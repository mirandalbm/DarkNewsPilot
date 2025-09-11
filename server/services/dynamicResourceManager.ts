import { storage } from "../storage";
import { performanceAlertsService } from "./performanceAlertsService";
import { errorRecoveryService } from "./errorRecoveryService";

interface ResourceLimits {
  maxConcurrentJobs: number;
  maxQueueSize: number;
  maxMemoryUsage: number;
  maxCpuUsage: number;
  apiRateLimit: number;
  throttleLevel: number; // 0-100%
}

interface ResourceThrottleConfig {
  cpu: { light: number; moderate: number; heavy: number };
  memory: { light: number; moderate: number; heavy: number };
  queue: { light: number; moderate: number; heavy: number };
  api: { light: number; moderate: number; heavy: number };
}

interface ThrottleAction {
  type: 'pause_jobs' | 'reduce_concurrent' | 'delay_processing' | 'skip_non_critical' | 'emergency_mode';
  intensity: 'light' | 'moderate' | 'heavy';
  duration: number; // minutes
}

class DynamicResourceManager {
  private isActive = false;
  private monitoringInterval: NodeJS.Timeout | null = null;
  private currentLimits: ResourceLimits;
  private baselineLimits: ResourceLimits;
  private throttleActions: ThrottleAction[] = [];
  
  private readonly THROTTLE_CONFIG: ResourceThrottleConfig = {
    cpu: { light: 70, moderate: 85, heavy: 95 },
    memory: { light: 80, moderate: 90, heavy: 95 },
    queue: { light: 30, moderate: 50, heavy: 80 },
    api: { light: 80, moderate: 90, heavy: 95 }
  };

  constructor() {
    this.baselineLimits = {
      maxConcurrentJobs: 15,
      maxQueueSize: 100,
      maxMemoryUsage: 85, // percentage
      maxCpuUsage: 80,    // percentage
      apiRateLimit: 100,  // requests per minute
      throttleLevel: 0
    };
    
    this.currentLimits = { ...this.baselineLimits };
  }

  async start(): Promise<void> {
    if (this.isActive) return;

    this.isActive = true;
    console.log("⚡ Dynamic Resource Manager started");

    // Monitor system resources every 30 seconds
    this.monitoringInterval = setInterval(async () => {
      await this.performResourceAnalysis();
    }, 30 * 1000);

    // Initial analysis
    await this.performResourceAnalysis();
  }

  async stop(): Promise<void> {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }
    this.isActive = false;
    console.log("Dynamic Resource Manager stopped");
  }

  private async performResourceAnalysis(): Promise<void> {
    try {
      console.log("📊 Performing dynamic resource analysis...");
      
      const metrics = await performanceAlertsService.getSystemMetrics();
      const currentThrottleLevel = this.calculateThrottleLevel(metrics);
      
      if (currentThrottleLevel !== this.currentLimits.throttleLevel) {
        await this.adjustResourceLimits(currentThrottleLevel, metrics);
      }

      // Execute any pending throttle actions
      await this.executeThrottleActions();

      // Log resource status
      this.logResourceStatus(metrics, currentThrottleLevel);

    } catch (error) {
      console.error("❌ Error in resource analysis:", error);
    }
  }

  private calculateThrottleLevel(metrics: any): number {
    const factors = {
      cpu: this.calculateFactor(metrics.cpuUsage * 100, this.THROTTLE_CONFIG.cpu),
      memory: this.calculateFactor(metrics.memoryUsage * 100, this.THROTTLE_CONFIG.memory),
      queue: this.calculateFactor(metrics.queueSize, this.THROTTLE_CONFIG.queue),
      api: this.calculateFactor(metrics.apiFailures, this.THROTTLE_CONFIG.api)
    };

    // Weight the factors (queue and API failures are more critical)
    const weightedScore = (
      factors.cpu * 0.2 +
      factors.memory * 0.2 +
      factors.queue * 0.35 +
      factors.api * 0.25
    );

    return Math.min(100, Math.max(0, Math.round(weightedScore * 100)));
  }

  private calculateFactor(value: number, thresholds: { light: number; moderate: number; heavy: number }): number {
    if (value <= thresholds.light) return 0;
    if (value <= thresholds.moderate) return (value - thresholds.light) / (thresholds.moderate - thresholds.light) * 0.5;
    if (value <= thresholds.heavy) return 0.5 + (value - thresholds.moderate) / (thresholds.heavy - thresholds.moderate) * 0.3;
    return 0.8 + Math.min(0.2, (value - thresholds.heavy) / thresholds.heavy * 0.2);
  }

  private async adjustResourceLimits(newThrottleLevel: number, metrics: any): Promise<void> {
    const oldLevel = this.currentLimits.throttleLevel;
    this.currentLimits.throttleLevel = newThrottleLevel;

    console.log(`🎛️ Adjusting throttle level: ${oldLevel}% → ${newThrottleLevel}%`);

    // Calculate new limits based on throttle level
    const throttleMultiplier = 1 - (newThrottleLevel / 100 * 0.7); // Max 70% reduction
    
    this.currentLimits.maxConcurrentJobs = Math.max(
      3, 
      Math.round(this.baselineLimits.maxConcurrentJobs * throttleMultiplier)
    );
    
    this.currentLimits.maxQueueSize = Math.max(
      20,
      Math.round(this.baselineLimits.maxQueueSize * throttleMultiplier)
    );
    
    this.currentLimits.apiRateLimit = Math.max(
      20,
      Math.round(this.baselineLimits.apiRateLimit * throttleMultiplier)
    );

    // Apply immediate throttle actions if needed
    if (newThrottleLevel > oldLevel) {
      await this.applyThrottleActions(newThrottleLevel, metrics);
    } else if (newThrottleLevel < oldLevel && newThrottleLevel < 30) {
      await this.restoreNormalOperations();
    }

    // Update storage with new limits
    await storage.updateSystemResourceLimits({
      maxConcurrentJobs: this.currentLimits.maxConcurrentJobs,
      maxQueueSize: this.currentLimits.maxQueueSize,
      throttleLevel: newThrottleLevel,
      timestamp: new Date()
    });
  }

  private async applyThrottleActions(throttleLevel: number, metrics: any): Promise<void> {
    const actions: ThrottleAction[] = [];

    if (throttleLevel >= 80) {
      actions.push({ type: 'emergency_mode', intensity: 'heavy', duration: 15 });
      actions.push({ type: 'pause_jobs', intensity: 'heavy', duration: 10 });
    } else if (throttleLevel >= 60) {
      actions.push({ type: 'reduce_concurrent', intensity: 'moderate', duration: 10 });
      actions.push({ type: 'skip_non_critical', intensity: 'moderate', duration: 15 });
    } else if (throttleLevel >= 40) {
      actions.push({ type: 'delay_processing', intensity: 'light', duration: 5 });
    }

    // Add specific actions based on metrics
    if (metrics.queueSize > 50) {
      actions.push({ type: 'pause_jobs', intensity: 'moderate', duration: 5 });
    }
    
    if (metrics.apiFailures > 3) {
      actions.push({ type: 'delay_processing', intensity: 'moderate', duration: 10 });
    }

    this.throttleActions.push(...actions);
    console.log(`🚦 Scheduled ${actions.length} throttle actions`);
  }

  private async restoreNormalOperations(): Promise<void> {
    console.log("🔄 Restoring normal operations - throttle level decreased");
    
    // Clear throttle actions
    this.throttleActions = [];
    
    // Resume paused jobs
    const pausedJobs = await storage.getJobsByStatus('paused');
    for (const job of pausedJobs.slice(0, 5)) { // Resume max 5 at a time
      await storage.updateJob(job.id, { status: 'pending' });
    }
    
    console.log(`▶️ Resumed ${Math.min(5, pausedJobs.length)} paused jobs`);
  }

  private async executeThrottleActions(): Promise<void> {
    const now = new Date();
    const activeActions = this.throttleActions.filter(action => {
      // Remove expired actions
      return true; // For simplicity, execute all actions
    });

    for (const action of activeActions) {
      try {
        await this.executeAction(action);
      } catch (error) {
        console.error(`❌ Error executing throttle action ${action.type}:`, error);
      }
    }

    // Remove completed actions
    this.throttleActions = [];
  }

  private async executeAction(action: ThrottleAction): Promise<void> {
    console.log(`⚡ Executing throttle action: ${action.type} (${action.intensity})`);

    switch (action.type) {
      case 'pause_jobs':
        await this.pauseNonCriticalJobs(action.intensity);
        break;
        
      case 'reduce_concurrent':
        await this.reduceConcurrentJobs(action.intensity);
        break;
        
      case 'delay_processing':
        await this.delayProcessing(action.intensity);
        break;
        
      case 'skip_non_critical':
        await this.skipNonCriticalTasks(action.intensity);
        break;
        
      case 'emergency_mode':
        await this.enableEmergencyMode(action.duration);
        break;
    }
  }

  private async pauseNonCriticalJobs(intensity: string): Promise<void> {
    const activeJobs = await storage.getActiveJobs();
    const nonCriticalJobs = activeJobs.filter(job => 
      job.status === 'pending' && 
      !['news_fetch', 'autonomous_scheduling', 'performance_alert'].includes(job.type)
    );

    const pauseCount = intensity === 'heavy' ? 15 : intensity === 'moderate' ? 10 : 5;
    
    for (let i = 0; i < Math.min(pauseCount, nonCriticalJobs.length); i++) {
      await storage.updateJob(nonCriticalJobs[i].id, { status: 'paused' });
    }

    console.log(`⏸️ Paused ${Math.min(pauseCount, nonCriticalJobs.length)} non-critical jobs`);
  }

  private async reduceConcurrentJobs(intensity: string): Promise<void> {
    const reduction = intensity === 'heavy' ? 0.5 : intensity === 'moderate' ? 0.7 : 0.85;
    this.currentLimits.maxConcurrentJobs = Math.max(
      2,
      Math.round(this.currentLimits.maxConcurrentJobs * reduction)
    );
    
    console.log(`🔽 Reduced max concurrent jobs to ${this.currentLimits.maxConcurrentJobs}`);
  }

  private async delayProcessing(intensity: string): Promise<void> {
    const delay = intensity === 'heavy' ? 15000 : intensity === 'moderate' ? 8000 : 3000;
    
    // Add delay to error recovery service
    await errorRecoveryService.updateGlobalConfig({
      defaultDelayMs: delay,
      throttleMode: true
    });
    
    console.log(`⏱️ Added ${delay}ms processing delay`);
  }

  private async skipNonCriticalTasks(intensity: string): Promise<void> {
    const skipTypes = intensity === 'heavy' 
      ? ['metadata_generation', 'thumbnail_optimization', 'analytics_update']
      : intensity === 'moderate'
      ? ['thumbnail_optimization', 'analytics_update'] 
      : ['analytics_update'];

    for (const jobType of skipTypes) {
      const jobs = await storage.getJobsByType(jobType);
      for (const job of jobs) {
        await storage.updateJob(job.id, { status: 'skipped' });
      }
    }

    console.log(`⏭️ Skipped ${skipTypes.length} types of non-critical tasks`);
  }

  private async enableEmergencyMode(duration: number): Promise<void> {
    console.log(`🚨 EMERGENCY MODE ACTIVATED for ${duration} minutes`);
    
    // Only allow critical operations
    this.currentLimits.maxConcurrentJobs = 2;
    this.currentLimits.maxQueueSize = 10;
    
    // Pause all non-essential jobs
    await this.pauseNonCriticalJobs('heavy');
    
    // Set timer to restore after emergency period
    setTimeout(async () => {
      console.log("✅ Emergency mode deactivated");
      this.currentLimits = { ...this.baselineLimits, throttleLevel: 50 };
    }, duration * 60 * 1000);
  }

  private logResourceStatus(metrics: any, throttleLevel: number): void {
    const status = throttleLevel > 70 ? '🔴 CRITICAL' : 
                  throttleLevel > 40 ? '🟡 MODERATE' : 
                  '🟢 OPTIMAL';

    console.log(`📊 Resource Status: ${status} (${throttleLevel}%)`);
    console.log(`   Queue: ${metrics.queueSize}/${this.currentLimits.maxQueueSize}`);
    console.log(`   Concurrent: ${metrics.activeJobs}/${this.currentLimits.maxConcurrentJobs}`);
    console.log(`   CPU: ${(metrics.cpuUsage * 100).toFixed(1)}%`);
    console.log(`   Memory: ${(metrics.memoryUsage * 100).toFixed(1)}%`);
  }

  // Public API methods
  getCurrentLimits(): ResourceLimits {
    return { ...this.currentLimits };
  }

  async forceThrottleLevel(level: number): Promise<void> {
    console.log(`🎛️ Force setting throttle level to ${level}%`);
    const metrics = await performanceAlertsService.getSystemMetrics();
    await this.adjustResourceLimits(level, metrics);
  }

  getThrottleStatus(): {
    isThrottled: boolean;
    level: number;
    activeActions: number;
    limits: ResourceLimits;
  } {
    return {
      isThrottled: this.currentLimits.throttleLevel > 0,
      level: this.currentLimits.throttleLevel,
      activeActions: this.throttleActions.length,
      limits: this.getCurrentLimits()
    };
  }

  async emergencyStop(): Promise<void> {
    console.log("🛑 EMERGENCY STOP - Pausing all operations");
    await this.enableEmergencyMode(30); // 30 minute emergency mode
  }

  async resetToBaseline(): Promise<void> {
    console.log("🔄 Resetting to baseline resource limits");
    this.currentLimits = { ...this.baselineLimits };
    this.throttleActions = [];
    await this.restoreNormalOperations();
  }
}

export const dynamicResourceManager = new DynamicResourceManager();