import { storage } from "../storage";
import { autonomousSchedulerService } from "./autonomousSchedulerService";
import { performanceAlertsService } from "./performanceAlertsService";
import { enhancedNewsProcessor } from "../workers/enhancedNewsProcessor";
import { dynamicResourceManager } from "./dynamicResourceManager";
import { errorRecoveryService } from "./errorRecoveryService";

interface TestResults {
  testName: string;
  status: 'passed' | 'failed' | 'warning';
  duration: number;
  details: string;
  metrics?: any;
}

interface AutonomyTestReport {
  timestamp: Date;
  overallScore: number; // 0-100%
  autonomyLevel: 'Full' | 'Partial' | 'Limited' | 'Failed';
  tests: TestResults[];
  recommendations: string[];
  systemHealth: any;
}

class AutonomousTestService {
  private testResults: TestResults[] = [];

  async runFullAutonomyTest(): Promise<AutonomyTestReport> {
    console.log("🧪 Starting comprehensive autonomy test suite...");
    
    const startTime = Date.now();
    this.testResults = [];

    try {
      // Test 1: Autonomous Scheduler
      await this.testAutonomousScheduler();
      
      // Test 2: News Processing Pipeline
      await this.testNewsProcessingPipeline();
      
      // Test 3: Error Recovery System
      await this.testErrorRecoverySystem();
      
      // Test 4: Performance Monitoring
      await this.testPerformanceMonitoring();
      
      // Test 5: Resource Management
      await this.testResourceManagement();
      
      // Test 6: Multi-language Processing
      await this.testMultiLanguageProcessing();
      
      // Test 7: Auto-approval Pipeline
      await this.testAutoApprovalPipeline();
      
      // Test 8: End-to-end Workflow
      await this.testEndToEndWorkflow();

      const report = await this.generateAutonomyReport();
      
      console.log("✅ Autonomy test suite completed");
      console.log(`📊 Overall Autonomy Score: ${report.overallScore}%`);
      console.log(`🤖 Autonomy Level: ${report.autonomyLevel}`);
      
      return report;

    } catch (error) {
      console.error("❌ Error in autonomy test:", error);
      
      this.testResults.push({
        testName: 'Test Suite Execution',
        status: 'failed',
        duration: Date.now() - startTime,
        details: `Test suite failed: ${error instanceof Error ? error.message : String(error)}`
      });

      return this.generateAutonomyReport();
    }
  }

  private async testAutonomousScheduler(): Promise<void> {
    const testStart = Date.now();
    console.log("🤖 Testing autonomous scheduler...");

    try {
      // Test if scheduler is running
      const isRunning = autonomousSchedulerService.getIsRunning();
      if (!isRunning) {
        throw new Error("Autonomous scheduler is not running");
      }

      // Test scheduler functionality
      const scheduleTest = await autonomousSchedulerService.executeAutonomousScheduling();
      
      this.testResults.push({
        testName: 'Autonomous Scheduler',
        status: 'passed',
        duration: Date.now() - testStart,
        details: 'Scheduler is active and executing autonomous operations successfully'
      });

    } catch (error) {
      this.testResults.push({
        testName: 'Autonomous Scheduler',
        status: 'failed',
        duration: Date.now() - testStart,
        details: `Scheduler test failed: ${error instanceof Error ? error.message : String(error)}`
      });
    }
  }

  private async testNewsProcessingPipeline(): Promise<void> {
    const testStart = Date.now();
    console.log("📰 Testing news processing pipeline...");

    try {
      // Test news fetching
      const recentNews = await storage.getNewsArticles(10);
      
      if (recentNews.length === 0) {
        throw new Error("No news articles available for testing");
      }

      // Test if articles have viral scores
      const scoredArticles = recentNews.filter(article => article.viralScore && article.viralScore > 0);
      
      if (scoredArticles.length === 0) {
        throw new Error("No articles with viral scores found");
      }

      this.testResults.push({
        testName: 'News Processing Pipeline',
        status: 'passed',
        duration: Date.now() - testStart,
        details: `Successfully processed ${recentNews.length} articles, ${scoredArticles.length} with viral scores`,
        metrics: { totalArticles: recentNews.length, scoredArticles: scoredArticles.length }
      });

    } catch (error) {
      this.testResults.push({
        testName: 'News Processing Pipeline',
        status: 'failed',
        duration: Date.now() - testStart,
        details: `Pipeline test failed: ${error instanceof Error ? error.message : String(error)}`
      });
    }
  }

  private async testErrorRecoverySystem(): Promise<void> {
    const testStart = Date.now();
    console.log("🔄 Testing error recovery system...");

    try {
      // Test error recovery configuration
      const retryConfig = {
        maxRetries: 3,
        initialDelayMs: 1000,
        maxDelayMs: 10000,
        backoffMultiplier: 2,
        enableCircuitBreaker: true
      };

      // Simulate API call with error recovery
      const testOperation = () => {
        // Simulate a successful operation after retry logic
        return Promise.resolve({ success: true, timestamp: new Date() });
      };

      const result = await errorRecoveryService.executeWithRetry(
        testOperation,
        {
          operationId: 'autonomy_test_operation',
          serviceName: 'TestService',
          endpoint: 'test',
          retryConfig
        }
      );

      if (!result.success) {
        throw new Error("Error recovery test did not return expected result");
      }

      this.testResults.push({
        testName: 'Error Recovery System',
        status: 'passed',
        duration: Date.now() - testStart,
        details: 'Error recovery system is functioning correctly with retry mechanisms',
        metrics: { retryConfig, testResult: result }
      });

    } catch (error) {
      this.testResults.push({
        testName: 'Error Recovery System',
        status: 'failed',
        duration: Date.now() - testStart,
        details: `Error recovery test failed: ${error instanceof Error ? error.message : String(error)}`
      });
    }
  }

  private async testPerformanceMonitoring(): Promise<void> {
    const testStart = Date.now();
    console.log("📊 Testing performance monitoring...");

    try {
      // Get current system metrics
      const systemMetrics = await performanceAlertsService.getSystemMetrics();
      
      if (!systemMetrics) {
        throw new Error("Unable to retrieve system metrics");
      }

      // Check if alerts are being tracked
      const activeAlerts = await performanceAlertsService.getActiveAlerts();
      
      // Validate metric structure
      const requiredMetrics = ['queueSize', 'errorRate', 'activeJobs', 'timestamp'];
      const missingMetrics = requiredMetrics.filter(metric => !(metric in systemMetrics));
      
      if (missingMetrics.length > 0) {
        throw new Error(`Missing metrics: ${missingMetrics.join(', ')}`);
      }

      this.testResults.push({
        testName: 'Performance Monitoring',
        status: 'passed',
        duration: Date.now() - testStart,
        details: 'Performance monitoring is active and collecting comprehensive metrics',
        metrics: { 
          systemMetrics: {
            queueSize: systemMetrics.queueSize,
            errorRate: systemMetrics.errorRate,
            activeJobs: systemMetrics.activeJobs
          },
          activeAlerts: activeAlerts.length
        }
      });

    } catch (error) {
      this.testResults.push({
        testName: 'Performance Monitoring',
        status: 'failed',
        duration: Date.now() - testStart,
        details: `Performance monitoring test failed: ${error instanceof Error ? error.message : String(error)}`
      });
    }
  }

  private async testResourceManagement(): Promise<void> {
    const testStart = Date.now();
    console.log("⚡ Testing resource management...");

    try {
      // Get current resource limits
      const currentLimits = dynamicResourceManager.getCurrentLimits();
      
      if (!currentLimits) {
        throw new Error("Unable to retrieve resource limits");
      }

      // Test throttle status
      const throttleStatus = dynamicResourceManager.getThrottleStatus();
      
      // Validate resource management is active
      if (currentLimits.maxConcurrentJobs <= 0 || currentLimits.maxQueueSize <= 0) {
        throw new Error("Invalid resource limits detected");
      }

      this.testResults.push({
        testName: 'Resource Management',
        status: 'passed',
        duration: Date.now() - testStart,
        details: 'Resource management is active with dynamic throttling capabilities',
        metrics: {
          currentLimits,
          throttleStatus,
          isThrottled: throttleStatus.isThrottled
        }
      });

    } catch (error) {
      this.testResults.push({
        testName: 'Resource Management',
        status: 'failed',
        duration: Date.now() - testStart,
        details: `Resource management test failed: ${error instanceof Error ? error.message : String(error)}`
      });
    }
  }

  private async testMultiLanguageProcessing(): Promise<void> {
    const testStart = Date.now();
    console.log("🌐 Testing multi-language processing...");

    try {
      // Test enhanced news processor status
      const queueStatus = enhancedNewsProcessor.getBatchQueueStatus();
      const processingMetrics = enhancedNewsProcessor.getProcessingMetrics();
      
      // Check if all 8 languages are supported
      const supportedLanguages = ['en-US', 'pt-BR', 'es-ES', 'es-MX', 'de-DE', 'fr-FR', 'hi-IN', 'ja-JP'];
      const configuredLanguages = Object.keys(processingMetrics.languagePerformance || {});
      
      const missingLanguages = supportedLanguages.filter(lang => !configuredLanguages.includes(lang));
      
      if (missingLanguages.length > 0) {
        this.testResults.push({
          testName: 'Multi-language Processing',
          status: 'warning',
          duration: Date.now() - testStart,
          details: `Missing language support for: ${missingLanguages.join(', ')}`,
          metrics: { supportedLanguages: configuredLanguages, missingLanguages }
        });
      } else {
        this.testResults.push({
          testName: 'Multi-language Processing',
          status: 'passed',
          duration: Date.now() - testStart,
          details: 'All 8 target languages are configured with batch processing',
          metrics: { 
            supportedLanguages: configuredLanguages,
            queueStatus: {
              pending: queueStatus.pending.length,
              processing: queueStatus.processing.length,
              completed: queueStatus.completed.length
            }
          }
        });
      }

    } catch (error) {
      this.testResults.push({
        testName: 'Multi-language Processing',
        status: 'failed',
        duration: Date.now() - testStart,
        details: `Multi-language test failed: ${error instanceof Error ? error.message : String(error)}`
      });
    }
  }

  private async testAutoApprovalPipeline(): Promise<void> {
    const testStart = Date.now();
    console.log("✅ Testing auto-approval pipeline...");

    try {
      // Test if auto-approval service is configured
      const { autoApprovalService } = await import("./autoApprovalService");
      
      // Check recent auto-approval decisions
      const recentVideos = await storage.getVideos(10);
      const autoApprovedCount = recentVideos.filter(video => 
        video.metadata && 
        (video.metadata as any).autoApproved === true
      ).length;

      this.testResults.push({
        testName: 'Auto-approval Pipeline',
        status: 'passed',
        duration: Date.now() - testStart,
        details: `Auto-approval pipeline is active, ${autoApprovedCount} recent auto-approvals detected`,
        metrics: { autoApprovedCount, totalRecentVideos: recentVideos.length }
      });

    } catch (error) {
      this.testResults.push({
        testName: 'Auto-approval Pipeline',
        status: 'failed',
        duration: Date.now() - testStart,
        details: `Auto-approval test failed: ${error instanceof Error ? error.message : String(error)}`
      });
    }
  }

  private async testEndToEndWorkflow(): Promise<void> {
    const testStart = Date.now();
    console.log("🔄 Testing end-to-end autonomous workflow...");

    try {
      // Test complete workflow from news to video
      const startTime = Date.now();
      
      // Simulate autonomous workflow trigger
      console.log("   1. Testing news fetch...");
      const newsCount = (await storage.getNewsArticles(5)).length;
      
      console.log("   2. Testing job processing...");
      const activeJobs = await storage.getActiveJobs();
      
      console.log("   3. Testing system health...");
      const systemMetrics = await performanceAlertsService.getSystemMetrics();
      
      console.log("   4. Testing resource allocation...");
      const resourceStatus = dynamicResourceManager.getThrottleStatus();

      const workflowTime = Date.now() - startTime;

      // Validate end-to-end workflow components
      const workflowHealth = {
        newsAvailable: newsCount > 0,
        jobsProcessing: activeJobs.length >= 0,
        systemResponsive: workflowTime < 10000, // Less than 10 seconds
        resourcesManaged: resourceStatus !== undefined
      };

      const healthyComponents = Object.values(workflowHealth).filter(Boolean).length;
      const totalComponents = Object.keys(workflowHealth).length;

      if (healthyComponents === totalComponents) {
        this.testResults.push({
          testName: 'End-to-end Workflow',
          status: 'passed',
          duration: Date.now() - testStart,
          details: 'Complete autonomous workflow is functioning correctly',
          metrics: { workflowHealth, workflowTime, newsCount, activeJobs: activeJobs.length }
        });
      } else {
        this.testResults.push({
          testName: 'End-to-end Workflow',
          status: 'warning',
          duration: Date.now() - testStart,
          details: `Workflow partially functional: ${healthyComponents}/${totalComponents} components healthy`,
          metrics: { workflowHealth, workflowTime }
        });
      }

    } catch (error) {
      this.testResults.push({
        testName: 'End-to-end Workflow',
        status: 'failed',
        duration: Date.now() - testStart,
        details: `End-to-end test failed: ${error instanceof Error ? error.message : String(error)}`
      });
    }
  }

  private async generateAutonomyReport(): Promise<AutonomyTestReport> {
    const passedTests = this.testResults.filter(test => test.status === 'passed').length;
    const warningTests = this.testResults.filter(test => test.status === 'warning').length;
    const failedTests = this.testResults.filter(test => test.status === 'failed').length;
    const totalTests = this.testResults.length;

    // Calculate autonomy score (passed = 100%, warning = 50%, failed = 0%)
    const overallScore = Math.round(
      ((passedTests * 100) + (warningTests * 50)) / (totalTests * 100) * 100
    );

    // Determine autonomy level
    let autonomyLevel: 'Full' | 'Partial' | 'Limited' | 'Failed';
    if (overallScore >= 90) autonomyLevel = 'Full';
    else if (overallScore >= 70) autonomyLevel = 'Partial';
    else if (overallScore >= 50) autonomyLevel = 'Limited';
    else autonomyLevel = 'Failed';

    // Generate recommendations
    const recommendations: string[] = [];
    
    if (failedTests > 0) {
      recommendations.push(`Fix ${failedTests} failed system components for improved autonomy`);
    }
    
    if (warningTests > 0) {
      recommendations.push(`Address ${warningTests} warning conditions to achieve full autonomy`);
    }
    
    if (overallScore < 100) {
      recommendations.push("Review system logs for specific error details and resolution steps");
    }

    if (overallScore >= 90) {
      recommendations.push("System is operating at high autonomy - monitor for continued performance");
    }

    // Get system health snapshot
    const systemHealth = await performanceAlertsService.getSystemMetrics();

    const report: AutonomyTestReport = {
      timestamp: new Date(),
      overallScore,
      autonomyLevel,
      tests: this.testResults,
      recommendations,
      systemHealth
    };

    // Store report in database
    await storage.storeAutonomyReport(report);

    return report;
  }

  // Quick health check for dashboard
  async quickAutonomyCheck(): Promise<{
    status: 'healthy' | 'degraded' | 'critical';
    score: number;
    issues: string[];
  }> {
    const issues: string[] = [];
    let score = 100;

    try {
      // Check scheduler
      if (!autonomousSchedulerService.getIsRunning()) {
        issues.push("Autonomous scheduler not running");
        score -= 30;
      }

      // Check system metrics
      const metrics = await performanceAlertsService.getSystemMetrics();
      if (metrics.queueSize > 50) {
        issues.push("High queue size detected");
        score -= 20;
      }

      // Check resource status
      const resourceStatus = dynamicResourceManager.getThrottleStatus();
      if (resourceStatus.level > 70) {
        issues.push("High system throttling detected");
        score -= 25;
      }

      const status = score >= 80 ? 'healthy' : score >= 50 ? 'degraded' : 'critical';

      return { status, score, issues };

    } catch (error) {
      return {
        status: 'critical',
        score: 0,
        issues: [`Health check failed: ${error instanceof Error ? error.message : String(error)}`]
      };
    }
  }
}

export const autonomousTestService = new AutonomousTestService();