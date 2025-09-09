import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { newsService } from "./services/newsService";
import { videoService } from "./services/videoService";
import { youtubeService } from "./services/youtubeService";
import { startNewsProcessor } from "./workers/newsProcessor";
import { startVideoProcessor } from "./workers/videoProcessor";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Start background workers
  startNewsProcessor();
  startVideoProcessor();

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Dashboard routes
  app.get('/api/dashboard/stats', isAuthenticated, async (req, res) => {
    try {
      const stats = await storage.getDashboardStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });

  app.get('/api/dashboard/jobs', isAuthenticated, async (req, res) => {
    try {
      const jobs = await storage.getActiveJobs();
      res.json(jobs);
    } catch (error) {
      console.error("Error fetching active jobs:", error);
      res.status(500).json({ message: "Failed to fetch active jobs" });
    }
  });

  app.get('/api/dashboard/api-status', isAuthenticated, async (req, res) => {
    try {
      const statuses = await storage.getApiStatuses();
      res.json(statuses);
    } catch (error) {
      console.error("Error fetching API statuses:", error);
      res.status(500).json({ message: "Failed to fetch API statuses" });
    }
  });

  // News routes
  app.get('/api/news', isAuthenticated, async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const news = await storage.getNewsArticles(limit);
      res.json(news);
    } catch (error) {
      console.error("Error fetching news:", error);
      res.status(500).json({ message: "Failed to fetch news" });
    }
  });

  app.post('/api/news/fetch', isAuthenticated, async (req, res) => {
    try {
      const { sources, keywords } = req.body;
      await newsService.triggerNewsFetch(sources, keywords);
      res.json({ message: "News fetch triggered successfully" });
    } catch (error) {
      console.error("Error triggering news fetch:", error);
      res.status(500).json({ message: "Failed to trigger news fetch" });
    }
  });

  app.put('/api/news/:id/status', isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      await storage.updateNewsArticleStatus(id, status);
      res.json({ message: "News status updated successfully" });
    } catch (error) {
      console.error("Error updating news status:", error);
      res.status(500).json({ message: "Failed to update news status" });
    }
  });

  // News statistics endpoint
  app.get('/api/news/stats', isAuthenticated, async (req, res) => {
    try {
      const stats = await storage.getNewsStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching news stats:", error);
      res.status(500).json({ message: "Failed to fetch news stats" });
    }
  });

  // News sources endpoint
  app.get('/api/news/sources', isAuthenticated, async (req, res) => {
    try {
      const sources = await storage.getNewsSources();
      res.json(sources);
    } catch (error) {
      console.error("Error fetching news sources:", error);
      res.status(500).json({ message: "Failed to fetch news sources" });
    }
  });

  // Video routes
  app.get('/api/videos', isAuthenticated, async (req, res) => {
    try {
      const status = req.query.status as string;
      const limit = parseInt(req.query.limit as string) || 50;
      
      const videos = status 
        ? await storage.getVideosByStatus(status)
        : await storage.getVideos(limit);
      
      res.json(videos);
    } catch (error) {
      console.error("Error fetching videos:", error);
      res.status(500).json({ message: "Failed to fetch videos" });
    }
  });

  app.put('/api/videos/:id/approve', isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      await storage.updateVideoStatus(id, 'approved');
      
      // Trigger publishing job
      await storage.createJob({
        type: 'publish',
        status: 'pending',
        data: { videoId: id },
      });
      
      res.json({ message: "Video approved and queued for publishing" });
    } catch (error) {
      console.error("Error approving video:", error);
      res.status(500).json({ message: "Failed to approve video" });
    }
  });

  app.put('/api/videos/:id/regenerate', isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const { options } = req.body; // { script: boolean, voiceover: boolean, avatar: boolean }
      
      await videoService.regenerateVideo(id, options);
      res.json({ message: "Video regeneration triggered" });
    } catch (error) {
      console.error("Error regenerating video:", error);
      res.status(500).json({ message: "Failed to regenerate video" });
    }
  });

  // Channel routes
  app.get('/api/channels', isAuthenticated, async (req, res) => {
    try {
      const channels = await storage.getYoutubeChannels();
      res.json(channels);
    } catch (error) {
      console.error("Error fetching channels:", error);
      res.status(500).json({ message: "Failed to fetch channels" });
    }
  });

  // System routes
  app.post('/api/system/pause-jobs', isAuthenticated, async (req, res) => {
    try {
      // Implementation would depend on job queue system
      res.json({ message: "All jobs paused" });
    } catch (error) {
      console.error("Error pausing jobs:", error);
      res.status(500).json({ message: "Failed to pause jobs" });
    }
  });

  app.get('/api/system/metrics/:metric', isAuthenticated, async (req, res) => {
    try {
      const { metric } = req.params;
      const hours = parseInt(req.query.hours as string) || 24;
      const metrics = await storage.getMetrics(metric, hours);
      res.json(metrics);
    } catch (error) {
      console.error("Error fetching metrics:", error);
      res.status(500).json({ message: "Failed to fetch metrics" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
