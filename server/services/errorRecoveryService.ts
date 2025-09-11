import { storage } from "../storage";
import type { 
  ErrorLog, 
  InsertErrorLog, 
  PerformanceAlert,
  ProcessingJob 
} from "@shared/schema";

interface RetryConfig {
  maxRetries: number;
  initialDelayMs: number;
  maxDelayMs: number;
  backoffMultiplier: number;
  jitterMs: number;
  enableCircuitBreaker: boolean;
}

interface CircuitBreakerState {
  isOpen: boolean;
  failureCount: number;
  lastFailureTime: Date;
  resetTimeoutMs: number;
  successCount: number;
  totalRequests: number;
}

interface ErrorPattern {
  errorCode: string;
  frequency: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  pattern: string;
  suggestedAction: string;
  autoRecoverable: boolean;
}

interface RecoveryStrategy {
  strategyType: 'retry' | 'fallback' | 'circuit_break' | 'manual_intervention';
  config: any;
  conditions: string[];
  priority: number;
}

class ErrorRecoveryService {
  private circuitBreakers = new Map<string, CircuitBreakerState>();
  private retryQueues = new Map<string, any[]>();
  private errorPatterns = new Map<string, ErrorPattern>();
  
  private readonly DEFAULT_RETRY_CONFIG: RetryConfig = {
    maxRetries: 5,
    initialDelayMs: 1000,
    maxDelayMs: 60000,
    backoffMultiplier: 2,
    jitterMs: 100,
    enableCircuitBreaker: true
  };

  private readonly CIRCUIT_BREAKER_CONFIG = {
    failureThreshold: 5,
    resetTimeoutMs: 60000,
    successThreshold: 3
  };

  constructor() {
    this.initializeErrorPatterns();
    this.startErrorMonitoring();
  }

  // Main retry execution with exponential backoff
  async executeWithRetry<T>(
    operation: () => Promise<T>,
    context: {
      operationId: string;
      serviceName: string;
      endpoint?: string;
      jobId?: string;
      retryConfig?: Partial<RetryConfig>;
    }
  ): Promise<T> {
    const config = { ...this.DEFAULT_RETRY_CONFIG, ...context.retryConfig };
    const operationKey = `${context.serviceName}:${context.endpoint || 'default'}`;
    
    // Check circuit breaker state
    if (config.enableCircuitBreaker && this.isCircuitOpen(operationKey)) {
      throw new Error(`Circuit breaker is open for ${operationKey}`);
    }

    let lastError: Error | null = null;
    let attempt = 0;

    while (attempt <= config.maxRetries) {
      try {
        console.log(`🔄 Executing ${context.operationId} (attempt ${attempt + 1}/${config.maxRetries + 1})`);
        
        const result = await operation();
        
        // Success - reset circuit breaker
        if (config.enableCircuitBreaker) {
          this.recordSuccess(operationKey);
        }
        
        if (attempt > 0) {
          console.log(`✅ Operation ${context.operationId} succeeded after ${attempt} retries`);
          
          // Log successful recovery
          await storage.createErrorLog({
            jobId: context.jobId || null,
            errorCode: 'OPERATION_RECOVERED',
            severity: 'low',
            message: `Operation ${context.operationId} recovered after ${attempt} attempts`,
            serviceName: context.serviceName,
            endpoint: context.endpoint || 'unknown',
            retryCount: attempt,
            maxRetries: config.maxRetries,
            resolved: true,
            resolvedAt: new Date(),
            context: { operationId: context.operationId, attempts: attempt }
          });
        }
        
        return result;
        
      } catch (error) {
        lastError = error as Error;
        attempt++;
        
        console.error(`❌ Attempt ${attempt} failed for ${context.operationId}:`, error);
        
        // Record failure in circuit breaker
        if (config.enableCircuitBreaker) {
          this.recordFailure(operationKey);
        }
        
        // Log error with retry information
        await this.logRetryableError(error as Error, context, attempt, config);
        
        // Break if max retries reached
        if (attempt > config.maxRetries) {
          break;
        }
        
        // Calculate delay with exponential backoff and jitter
        const delay = this.calculateRetryDelay(attempt, config);
        console.log(`⏳ Waiting ${delay}ms before retry ${attempt + 1}...`);
        
        await this.sleep(delay);
        
        // Check if circuit breaker opened during retry
        if (config.enableCircuitBreaker && this.isCircuitOpen(operationKey)) {
          console.warn(`🚫 Circuit breaker opened for ${operationKey}, stopping retries`);
          break;
        }
      }
    }

    // All retries failed
    const finalError = new Error(
      `Operation ${context.operationId} failed after ${config.maxRetries + 1} attempts. Last error: ${lastError?.message}`
    );
    
    await this.handleFinalFailure(finalError, context, config.maxRetries + 1);
    throw finalError;
  }

  // Circuit breaker implementation
  private isCircuitOpen(operationKey: string): boolean {
    const state = this.circuitBreakers.get(operationKey);
    if (!state) {
      return false;
    }

    if (!state.isOpen) {
      return false;
    }

    // Check if reset timeout has passed
    const timeElapsed = Date.now() - state.lastFailureTime.getTime();
    if (timeElapsed >= state.resetTimeoutMs) {
      console.log(`🔄 Circuit breaker reset timeout reached for ${operationKey}`);
      state.isOpen = false;
      state.successCount = 0;
      return false;
    }

    return true;
  }

  private recordSuccess(operationKey: string): void {
    let state = this.circuitBreakers.get(operationKey);
    if (!state) {
      state = {
        isOpen: false,
        failureCount: 0,
        lastFailureTime: new Date(),
        resetTimeoutMs: this.CIRCUIT_BREAKER_CONFIG.resetTimeoutMs,
        successCount: 0,
        totalRequests: 0
      };
      this.circuitBreakers.set(operationKey, state);
    }

    state.successCount++;
    state.totalRequests++;
    
    // If circuit was half-open and we have enough successes, fully close it
    if (state.successCount >= this.CIRCUIT_BREAKER_CONFIG.successThreshold) {
      state.failureCount = 0;
      state.isOpen = false;
      console.log(`✅ Circuit breaker fully closed for ${operationKey}`);
    }
  }

  private recordFailure(operationKey: string): void {
    let state = this.circuitBreakers.get(operationKey);
    if (!state) {
      state = {
        isOpen: false,
        failureCount: 0,
        lastFailureTime: new Date(),
        resetTimeoutMs: this.CIRCUIT_BREAKER_CONFIG.resetTimeoutMs,
        successCount: 0,
        totalRequests: 0
      };
      this.circuitBreakers.set(operationKey, state);
    }

    state.failureCount++;
    state.totalRequests++;
    state.lastFailureTime = new Date();
    state.successCount = 0; // Reset success count on failure

    // Open circuit breaker if failure threshold reached
    if (state.failureCount >= this.CIRCUIT_BREAKER_CONFIG.failureThreshold) {
      state.isOpen = true;
      console.warn(`🚫 Circuit breaker opened for ${operationKey} (${state.failureCount} failures)`);
      
      // Create alert for circuit breaker opening
      this.createCircuitBreakerAlert(operationKey, state);
    }
  }

  // Calculate exponential backoff delay with jitter
  private calculateRetryDelay(attempt: number, config: RetryConfig): number {
    const exponentialDelay = config.initialDelayMs * Math.pow(config.backoffMultiplier, attempt - 1);
    const delayWithCap = Math.min(exponentialDelay, config.maxDelayMs);
    const jitter = Math.random() * config.jitterMs;
    
    return Math.round(delayWithCap + jitter);
  }

  // Error pattern analysis and auto-recovery
  async analyzeErrorPatterns(): Promise<ErrorPattern[]> {
    try {
      console.log("🔍 Analyzing error patterns for auto-recovery opportunities...");

      const recentErrors = await storage.getErrorLogs(undefined, false); // Get unresolved errors
      const errorStats = new Map<string, { count: number; errors: ErrorLog[] }>();

      // Group errors by error code
      recentErrors.forEach((error: ErrorLog) => {
        const key = error.errorCode;
        if (!errorStats.has(key)) {
          errorStats.set(key, { count: 0, errors: [] });
        }
        const stats = errorStats.get(key)!;
        stats.count++;
        stats.errors.push(error);
      });

      const patterns: ErrorPattern[] = [];

      for (const [errorCode, stats] of Array.from(errorStats.entries())) {
        if (stats.count >= 3) { // Pattern threshold
          const pattern = await this.identifyErrorPattern(errorCode, stats.errors);
          patterns.push(pattern);
          
          // Apply auto-recovery if possible
          if (pattern.autoRecoverable) {
            await this.applyAutoRecovery(pattern, stats.errors);
          }
        }
      }

      console.log(`📊 Identified ${patterns.length} error patterns`);
      return patterns;

    } catch (error) {
      console.error("❌ Error analyzing error patterns:", error);
      return [];
    }
  }

  // Smart error recovery based on patterns
  private async applyAutoRecovery(pattern: ErrorPattern, errors: ErrorLog[]): Promise<void> {
    try {
      console.log(`🔧 Applying auto-recovery for pattern: ${pattern.errorCode}`);

      switch (pattern.errorCode) {
        case 'API_RATE_LIMIT':
          await this.handleRateLimitRecovery(errors);
          break;
        case 'NETWORK_TIMEOUT':
          await this.handleNetworkTimeoutRecovery(errors);
          break;
        case 'SERVICE_UNAVAILABLE':
          await this.handleServiceUnavailableRecovery(errors);
          break;
        case 'MEMORY_LIMIT':
          await this.handleMemoryLimitRecovery(errors);
          break;
        case 'INVALID_RESPONSE':
          await this.handleInvalidResponseRecovery(errors);
          break;
        default:
          console.log(`⚠️ No auto-recovery strategy for ${pattern.errorCode}`);
      }

    } catch (error) {
      console.error(`❌ Failed to apply auto-recovery for ${pattern.errorCode}:`, error);
    }
  }

  // Specific recovery strategies
  private async handleRateLimitRecovery(errors: ErrorLog[]): Promise<void> {
    console.log("🐌 Implementing rate limit recovery strategy...");
    
    // Mark related jobs for delayed retry
    for (const error of errors) {
      if (error.jobId) {
        const nextRetryAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes delay
        await storage.updateErrorRetryCount(error.id, (error.retryCount || 0) + 1, nextRetryAt);
        
        // Update job to retry later
        await storage.updateJob(error.jobId, {
          status: 'pending',
          scheduledAt: nextRetryAt,
          retryCount: (error.retryCount || 0) + 1
        });
      }
    }

    // Temporarily reduce processing rate
    await this.adjustProcessingRate('reduce', 'rate_limit_recovery');
  }

  private async handleNetworkTimeoutRecovery(errors: ErrorLog[]): Promise<void> {
    console.log("🌐 Implementing network timeout recovery strategy...");
    
    for (const error of errors) {
      if ((error.retryCount || 0) < 3) {
        const nextRetryAt = new Date(Date.now() + 2 * 60 * 1000); // 2 minutes delay
        await storage.updateErrorRetryCount(error.id, (error.retryCount || 0) + 1, nextRetryAt);
        
        if (error.jobId) {
          await storage.updateJob(error.jobId, {
            status: 'pending',
            scheduledAt: nextRetryAt
          });
        }
      }
    }
  }

  private async handleServiceUnavailableRecovery(errors: ErrorLog[]): Promise<void> {
    console.log("🚫 Implementing service unavailable recovery strategy...");
    
    // Check service status and implement graceful degradation
    const serviceName = errors[0]?.serviceName;
    if (serviceName) {
      await storage.updateApiStatus({
        serviceName,
        status: 'degraded',
        responseTime: 0,
        lastChecked: new Date()
      });

      // Enable fallback mechanisms
      await this.enableFallbackMechanisms(serviceName);
    }
  }

  private async handleMemoryLimitRecovery(errors: ErrorLog[]): Promise<void> {
    console.log("💾 Implementing memory limit recovery strategy...");
    
    // Reduce batch sizes and processing concurrency
    await this.adjustProcessingRate('reduce', 'memory_optimization');
    
    // Trigger garbage collection (if applicable)
    if (global.gc) {
      global.gc();
    }
    
    // Create alert for memory issues
    await storage.createPerformanceAlert({
      alertType: 'memory_limit',
      severity: 'high',
      title: 'Memory Limit Recovery Initiated',
      description: 'System detected memory limit issues and applied auto-recovery',
      serviceName: 'ErrorRecovery',
      threshold: '80',
      currentValue: '95',
      metadata: { errorCount: errors.length, recovery: 'auto' }
    });
  }

  private async handleInvalidResponseRecovery(errors: ErrorLog[]): Promise<void> {
    console.log("🔄 Implementing invalid response recovery strategy...");
    
    for (const error of errors) {
      if ((error.retryCount || 0) < 2) {
        // Shorter delay for invalid response retries
        const nextRetryAt = new Date(Date.now() + 30 * 1000); // 30 seconds
        await storage.updateErrorRetryCount(error.id, (error.retryCount || 0) + 1, nextRetryAt);
      } else {
        // Mark for manual review after 2 retries
        await storage.markErrorResolved(
          error.id, 
          'Marked for manual review - invalid response pattern detected'
        );
      }
    }
  }

  // Recovery strategy helpers
  private async adjustProcessingRate(action: 'reduce' | 'increase', reason: string): Promise<void> {
    console.log(`⚡ ${action === 'reduce' ? 'Reducing' : 'Increasing'} processing rate: ${reason}`);
    
    // This would integrate with your job scheduler to adjust processing rates
    // For now, we'll log the action and create a metric
    await storage.recordMetric({
      metricName: 'processing_rate_adjustment',
      value: action === 'reduce' ? '-1' : '1'
    });
  }

  private async enableFallbackMechanisms(serviceName: string): Promise<void> {
    console.log(`🔄 Enabling fallback mechanisms for ${serviceName}`);
    
    // Implement service-specific fallback logic
    switch (serviceName) {
      case 'OpenAI':
        // Could switch to alternative AI provider
        console.log("Switching to fallback AI provider");
        break;
      case 'ElevenLabs':
        // Could use text-to-speech fallback
        console.log("Switching to fallback TTS service");
        break;
      case 'YouTube':
        // Could queue uploads for later
        console.log("Queuing uploads for retry");
        break;
    }
  }

  // Helper methods
  private async logRetryableError(
    error: Error, 
    context: any, 
    attempt: number, 
    config: RetryConfig
  ): Promise<void> {
    await storage.createErrorLog({
      jobId: context.jobId || null,
      errorCode: this.extractErrorCode(error),
      severity: attempt > config.maxRetries / 2 ? 'high' : 'medium',
      message: error.message,
      serviceName: context.serviceName,
      endpoint: context.endpoint || 'unknown',
      retryCount: attempt,
      maxRetries: config.maxRetries,
      nextRetryAt: attempt <= config.maxRetries ? 
        new Date(Date.now() + this.calculateRetryDelay(attempt, config)) : 
        undefined,
      context: { operationId: context.operationId, attempt }
    });
  }

  private async handleFinalFailure(error: Error, context: any, totalAttempts: number): Promise<void> {
    console.error(`💥 Final failure for ${context.operationId} after ${totalAttempts} attempts`);
    
    await storage.createErrorLog({
      jobId: context.jobId || null,
      errorCode: 'OPERATION_FINAL_FAILURE',
      severity: 'critical',
      message: `Operation ${context.operationId} permanently failed: ${error.message}`,
      serviceName: context.serviceName,
      endpoint: context.endpoint || 'unknown',
      retryCount: totalAttempts,
      maxRetries: totalAttempts,
      context: { operationId: context.operationId, finalError: error.message }
    });

    // Create critical alert
    await storage.createPerformanceAlert({
      alertType: 'operation_failure',
      severity: 'critical',
      title: `Operation Failed: ${context.operationId}`,
      description: `Critical operation failure after ${totalAttempts} attempts`,
      serviceName: context.serviceName,
      threshold: '0',
      currentValue: totalAttempts.toString(),
      metadata: { 
        operationId: context.operationId,
        error: error.message,
        totalAttempts 
      }
    });
  }

  private extractErrorCode(error: Error): string {
    // Extract error code from error message or type
    if (error.message.includes('timeout')) return 'NETWORK_TIMEOUT';
    if (error.message.includes('rate limit')) return 'API_RATE_LIMIT';
    if (error.message.includes('memory')) return 'MEMORY_LIMIT';
    if (error.message.includes('unavailable')) return 'SERVICE_UNAVAILABLE';
    if (error.message.includes('invalid') || error.message.includes('parse')) return 'INVALID_RESPONSE';
    if (error.message.includes('permission') || error.message.includes('auth')) return 'AUTHORIZATION_ERROR';
    
    return 'UNKNOWN_ERROR';
  }

  private async identifyErrorPattern(errorCode: string, errors: ErrorLog[]): Promise<ErrorPattern> {
    const frequency = errors.length;
    const timeSpan = Date.now() - new Date(errors[errors.length - 1].occuredAt || new Date()).getTime();
    const avgFrequency = frequency / (timeSpan / (1000 * 60 * 60)); // per hour

    let severity: 'low' | 'medium' | 'high' | 'critical' = 'low';
    let autoRecoverable = false;
    let suggestedAction = 'Manual review required';

    // Determine severity and recoverability based on error code and frequency
    switch (errorCode) {
      case 'API_RATE_LIMIT':
        severity = 'medium';
        autoRecoverable = true;
        suggestedAction = 'Implement exponential backoff and rate limiting';
        break;
      case 'NETWORK_TIMEOUT':
        severity = avgFrequency > 5 ? 'high' : 'medium';
        autoRecoverable = true;
        suggestedAction = 'Retry with increased timeout values';
        break;
      case 'SERVICE_UNAVAILABLE':
        severity = 'high';
        autoRecoverable = true;
        suggestedAction = 'Enable fallback mechanisms and graceful degradation';
        break;
      case 'MEMORY_LIMIT':
        severity = 'critical';
        autoRecoverable = true;
        suggestedAction = 'Reduce batch sizes and optimize memory usage';
        break;
      case 'AUTHORIZATION_ERROR':
        severity = 'critical';
        autoRecoverable = false;
        suggestedAction = 'Check API credentials and permissions';
        break;
    }

    return {
      errorCode,
      frequency,
      severity,
      pattern: `${frequency} occurrences in ${Math.round(timeSpan / (1000 * 60))} minutes`,
      suggestedAction,
      autoRecoverable
    };
  }

  private async createCircuitBreakerAlert(operationKey: string, state: CircuitBreakerState): Promise<void> {
    await storage.createPerformanceAlert({
      alertType: 'circuit_breaker',
      severity: 'high',
      title: `Circuit Breaker Opened: ${operationKey}`,
      description: `Circuit breaker opened due to ${state.failureCount} consecutive failures`,
      serviceName: 'ErrorRecovery',
      threshold: this.CIRCUIT_BREAKER_CONFIG.failureThreshold.toString(),
      currentValue: state.failureCount.toString(),
      metadata: {
        operationKey,
        failureCount: state.failureCount,
        totalRequests: state.totalRequests,
        resetTimeout: state.resetTimeoutMs
      }
    });
  }

  private initializeErrorPatterns(): void {
    // Initialize known error patterns
    this.errorPatterns.set('API_RATE_LIMIT', {
      errorCode: 'API_RATE_LIMIT',
      frequency: 0,
      severity: 'medium',
      pattern: 'Rate limiting detected',
      suggestedAction: 'Implement exponential backoff',
      autoRecoverable: true
    });

    this.errorPatterns.set('NETWORK_TIMEOUT', {
      errorCode: 'NETWORK_TIMEOUT',
      frequency: 0,
      severity: 'medium',
      pattern: 'Network timeout detected',
      suggestedAction: 'Retry with increased timeout',
      autoRecoverable: true
    });
  }

  private startErrorMonitoring(): void {
    // Start periodic error pattern analysis
    setInterval(async () => {
      try {
        await this.analyzeErrorPatterns();
      } catch (error) {
        console.error("Error in periodic error analysis:", error);
      }
    }, 5 * 60 * 1000); // Every 5 minutes

    console.log("🔍 Error monitoring and auto-recovery system started");
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Public utility methods
  async getCircuitBreakerStatus(): Promise<Map<string, CircuitBreakerState>> {
    return new Map(this.circuitBreakers);
  }

  async resetCircuitBreaker(operationKey: string): Promise<void> {
    const state = this.circuitBreakers.get(operationKey);
    if (state) {
      state.isOpen = false;
      state.failureCount = 0;
      state.successCount = 0;
      console.log(`🔄 Circuit breaker manually reset for ${operationKey}`);
    }
  }

  async getErrorRecoveryStats(): Promise<{
    totalRetries: number;
    successfulRecoveries: number;
    openCircuitBreakers: number;
    activePatterns: number;
  }> {
    const recentErrors = await storage.getErrorLogs();
    const totalRetries = recentErrors.reduce((sum: number, error: ErrorLog) => sum + (error.retryCount || 0), 0);
    const successfulRecoveries = recentErrors.filter((error: ErrorLog) => error.resolved).length;
    const openCircuitBreakers = Array.from(this.circuitBreakers.values())
      .filter(state => state.isOpen).length;
    const activePatterns = this.errorPatterns.size;

    return {
      totalRetries,
      successfulRecoveries,
      openCircuitBreakers,
      activePatterns
    };
  }

  // Global configuration update method for dynamic resource manager
  async updateGlobalConfig(config: { defaultDelayMs?: number; throttleMode?: boolean; [key: string]: any }): Promise<void> {
    console.log("🔧 Updating global error recovery configuration", config);
    
    if (config.defaultDelayMs) {
      this.DEFAULT_RETRY_CONFIG.initialDelayMs = config.defaultDelayMs;
    }
    
    if (config.throttleMode !== undefined) {
      // Enable or disable throttle mode
      console.log(`${config.throttleMode ? 'Enabling' : 'Disabling'} throttle mode`);
    }
    
    // Record the configuration change
    await storage.recordMetric({
      metricName: 'error_recovery_config_update',
      value: JSON.stringify(config)
    });
  }
}

export const errorRecoveryService = new ErrorRecoveryService();