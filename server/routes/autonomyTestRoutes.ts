import { Express } from 'express';
import { autonomousTestService } from '../services/autonomousTestService';
import { performanceAlertsService } from '../services/performanceAlertsService';
import { dynamicResourceManager } from '../services/dynamicResourceManager';

export function registerAutonomyTestRoutes(app: Express): void {
  
  // Run full autonomy test suite
  app.post('/api/autonomy/test', async (req, res) => {
    try {
      console.log("🧪 Starting autonomous system test...");
      const report = await autonomousTestService.runFullAutonomyTest();
      res.json(report);
    } catch (error) {
      console.error("❌ Autonomy test failed:", error);
      res.status(500).json({
        error: 'Autonomy test failed',
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });

  // Quick autonomy health check
  app.get('/api/autonomy/status', async (req, res) => {
    try {
      const healthCheck = await autonomousTestService.quickAutonomyCheck();
      res.json(healthCheck);
    } catch (error) {
      console.error("❌ Autonomy status check failed:", error);
      res.status(500).json({
        error: 'Status check failed',
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });

  // Get system metrics for monitoring
  app.get('/api/autonomy/metrics', async (req, res) => {
    try {
      const [systemMetrics, resourceStatus, activeAlerts] = await Promise.all([
        performanceAlertsService.getSystemMetrics(),
        dynamicResourceManager.getThrottleStatus(),
        performanceAlertsService.getActiveAlerts()
      ]);

      res.json({
        system: systemMetrics,
        resources: resourceStatus,
        alerts: activeAlerts,
        timestamp: new Date()
      });
    } catch (error) {
      console.error("❌ Error getting autonomy metrics:", error);
      res.status(500).json({
        error: 'Failed to get metrics',
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });

  // Manual resource throttle control
  app.post('/api/autonomy/throttle', async (req, res) => {
    try {
      const { level } = req.body;
      
      if (typeof level !== 'number' || level < 0 || level > 100) {
        return res.status(400).json({ error: 'Invalid throttle level. Must be 0-100.' });
      }

      await dynamicResourceManager.forceThrottleLevel(level);
      res.json({ success: true, throttleLevel: level });
    } catch (error) {
      console.error("❌ Error setting throttle level:", error);
      res.status(500).json({
        error: 'Failed to set throttle level',
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });

  // Emergency stop
  app.post('/api/autonomy/emergency-stop', async (req, res) => {
    try {
      console.log("🛑 Emergency stop initiated");
      await dynamicResourceManager.emergencyStop();
      res.json({ success: true, message: 'Emergency stop activated' });
    } catch (error) {
      console.error("❌ Error in emergency stop:", error);
      res.status(500).json({
        error: 'Emergency stop failed',
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });

  // Reset to baseline
  app.post('/api/autonomy/reset', async (req, res) => {
    try {
      console.log("🔄 Resetting to baseline configuration");
      await dynamicResourceManager.resetToBaseline();
      res.json({ success: true, message: 'System reset to baseline' });
    } catch (error) {
      console.error("❌ Error resetting system:", error);
      res.status(500).json({
        error: 'Reset failed',
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });

}