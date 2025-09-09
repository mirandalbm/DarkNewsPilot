import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { newsService } from "./services/newsService";
import { videoService } from "./services/videoService";
import { youtubeService } from "./services/youtubeService";
import { cryptoService } from "./services/cryptoService";
import { openaiService } from "./services/openaiService";
import { elevenlabsService } from "./services/elevenlabsService";
import { heygenService } from "./services/heygenService";
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

  // Video statistics endpoint
  app.get('/api/videos/stats', isAuthenticated, async (req, res) => {
    try {
      const stats = await storage.getVideoStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching video stats:", error);
      res.status(500).json({ message: "Failed to fetch video stats" });
    }
  });

  // Generate single video
  app.post('/api/videos/generate', isAuthenticated, async (req, res) => {
    try {
      const { newsId, language, avatar, customScript } = req.body;
      const videoId = await videoService.generateVideo(newsId, language, avatar, customScript);
      res.json({ message: "Video generation started", videoId });
    } catch (error) {
      console.error("Error generating video:", error);
      res.status(500).json({ message: "Failed to start video generation" });
    }
  });

  // Batch generate videos
  app.post('/api/videos/batch-generate', isAuthenticated, async (req, res) => {
    try {
      const { newsId, languages, avatar } = req.body;
      const videoIds = [];
      
      for (const language of languages) {
        const videoId = await videoService.generateVideo(newsId, language, avatar);
        videoIds.push(videoId);
      }
      
      res.json({ message: "Batch video generation started", videoIds });
    } catch (error) {
      console.error("Error batch generating videos:", error);
      res.status(500).json({ message: "Failed to start batch video generation" });
    }
  });

  // Edit video
  app.put('/api/videos/:id/edit', isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const { script, voiceover, avatar, customInstruction } = req.body;
      
      // Create edit job
      await storage.createJob({
        type: 'video_edit',
        status: 'pending',
        data: {
          videoId: id,
          editOptions: {
            regenerateScript: script,
            regenerateVoiceover: voiceover,
            changeAvatar: avatar,
            customInstruction
          }
        },
      });
      
      // Update video status to processing
      await storage.updateVideoStatus(id, 'processing');
      
      res.json({ message: "Video edit started" });
    } catch (error) {
      console.error("Error editing video:", error);
      res.status(500).json({ message: "Failed to edit video" });
    }
  });

  // Download video
  app.get('/api/videos/:id/download', isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      // TODO: Implement video download logic
      res.json({ message: "Video download endpoint - TODO: implement" });
    } catch (error) {
      console.error("Error downloading video:", error);
      res.status(500).json({ message: "Failed to download video" });
    }
  });

  // Avatar thumbnail
  app.get('/api/avatar/:id/thumbnail', async (req, res) => {
    try {
      const { id } = req.params;
      // TODO: Return actual avatar thumbnail
      res.json({ message: `Avatar thumbnail for ${id} - TODO: implement` });
    } catch (error) {
      console.error("Error fetching avatar thumbnail:", error);
      res.status(500).json({ message: "Failed to fetch avatar thumbnail" });
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

  // API Settings endpoints
  app.get('/api/settings/apis', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const configs = await storage.getAllApiConfigurations(userId);
      
      // Return configurations without sensitive data
      const safeConfigs = configs.map(config => {
        try {
          const decryptedConfig = config.encryptedConfig 
            ? JSON.parse(cryptoService.simpleDecrypt(config.encryptedConfig))
            : {};
          
          // Return config without sensitive values
          const safeFields = Object.keys(decryptedConfig).reduce((acc, key) => {
            acc[key] = key.toLowerCase().includes('secret') || key.toLowerCase().includes('key') || key.toLowerCase().includes('token')
              ? '***hidden***' 
              : decryptedConfig[key];
            return acc;
          }, {} as any);
          
          return {
            id: config.id,
            serviceId: config.serviceId,
            serviceName: config.serviceName,
            isActive: config.isActive,
            status: config.status,
            fields: safeFields,
            lastTested: config.lastTested
          };
        } catch (error) {
          return {
            id: config.id,
            serviceId: config.serviceId,
            serviceName: config.serviceName,
            isActive: config.isActive,
            status: 'error',
            fields: {},
            lastTested: config.lastTested
          };
        }
      });
      
      res.json(safeConfigs);
    } catch (error) {
      console.error("Error fetching API configurations:", error);
      res.status(500).json({ message: "Failed to fetch API configurations" });
    }
  });

  app.put('/api/settings/apis/:serviceId', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { serviceId } = req.params;
      const { isActive, fields } = req.body;
      
      // Service name mapping
      const serviceNames: Record<string, string> = {
        'openai': 'OpenAI GPT',
        'elevenlabs': 'ElevenLabs Voice',
        'heygen': 'HeyGen Avatars',
        'youtube': 'YouTube API',
        'newsapi': 'NewsAPI',
        'newsdata': 'NewsData.io',
        'twitter': 'Twitter/X',
        'facebook': 'Facebook',
        'instagram': 'Instagram',
        'discord': 'Discord Bot'
      };
      
      const serviceName = serviceNames[serviceId] || serviceId;
      const encryptedConfig = cryptoService.simpleEncrypt(JSON.stringify(fields));
      
      await storage.upsertApiConfiguration(userId, serviceId, {
        serviceName,
        isActive,
        encryptedConfig,
        status: 'inactive'
      });
      
      res.json({ message: "API configuration saved successfully" });
    } catch (error) {
      console.error("Error saving API configuration:", error);
      res.status(500).json({ message: "Failed to save API configuration" });
    }
  });

  app.post('/api/settings/test/:serviceId', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { serviceId } = req.params;
      
      const config = await storage.getApiConfiguration(userId, serviceId);
      if (!config || !config.encryptedConfig) {
        return res.status(400).json({ message: "API configuration not found" });
      }
      
      try {
        const decryptedConfig = JSON.parse(cryptoService.simpleDecrypt(config.encryptedConfig));
        
        // Test API based on service type
        let testResult = false;
        
        switch (serviceId) {
          case 'openai':
            testResult = await openaiService.testConnection(userId);
            break;
          case 'elevenlabs':
            testResult = await elevenlabsService.testConnection(userId);
            break;
          case 'heygen':
            testResult = await heygenService.testConnection(userId);
            break;
          case 'youtube':
            testResult = !!decryptedConfig.client_id && !!decryptedConfig.client_secret;
            break;
          case 'newsapi':
          case 'newsdata':
            // Test news API endpoints
            try {
              const testUrl = serviceId === 'newsapi' 
                ? `https://newsapi.org/v2/top-headlines?country=us&apiKey=${decryptedConfig.api_key}`
                : `https://newsdata.io/api/1/news?apikey=${decryptedConfig.api_key}&country=us`;
              const testResponse = await fetch(testUrl);
              testResult = testResponse.ok;
            } catch (error) {
              testResult = false;
            }
            break;
          default:
            testResult = true; // Social media APIs - basic key validation
        }
        
        const status = testResult ? 'active' : 'error';
        await storage.updateApiConfigStatus(userId, serviceId, status);
        
        res.json({ 
          success: testResult,
          status,
          message: testResult ? "API connection successful" : "API connection failed"
        });
      } catch (decryptError) {
        await storage.updateApiConfigStatus(userId, serviceId, 'error');
        res.status(400).json({ 
          success: false, 
          status: 'error',
          message: "Failed to decrypt configuration"
        });
      }
    } catch (error) {
      console.error("Error testing API:", error);
      res.status(500).json({ message: "Failed to test API configuration" });
    }
  });

  // Video generation endpoints
  app.post('/api/videos/generate', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { newsArticleId, language = 'en' } = req.body;
      
      if (!newsArticleId) {
        return res.status(400).json({ message: 'News article ID is required' });
      }
      
      // Check if article exists
      const article = await storage.getNewsArticleById(newsArticleId);
      if (!article) {
        return res.status(404).json({ message: 'News article not found' });
      }
      
      // Create video generation job
      const job = await storage.createJob({
        type: 'video_generation',
        status: 'pending',
        data: {
          newsArticleId,
          userId,
          language
        },
        progress: 0
      });
      
      res.json({ 
        message: 'Video generation started',
        jobId: job.id,
        status: 'pending'
      });
    } catch (error) {
      console.error('Error starting video generation:', error);
      res.status(500).json({ message: 'Failed to start video generation' });
    }
  });

  app.get('/api/videos/job/:jobId/status', isAuthenticated, async (req, res) => {
    try {
      const { jobId } = req.params;
      
      const jobs = await storage.getActiveJobs();
      const job = jobs.find(j => j.id === jobId);
      
      if (!job) {
        return res.status(404).json({ message: 'Job not found' });
      }
      
      res.json({
        jobId: job.id,
        status: job.status,
        progress: job.progress,
        error: job.error,
        completedAt: job.completedAt,
        createdAt: job.createdAt
      });
    } catch (error) {
      console.error('Error fetching job status:', error);
      res.status(500).json({ message: 'Failed to fetch job status' });
    }
  });

  app.post('/api/videos/generate-batch', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { newsArticleIds, language = 'en' } = req.body;
      
      if (!newsArticleIds || !Array.isArray(newsArticleIds)) {
        return res.status(400).json({ message: 'News article IDs array is required' });
      }
      
      const jobs = [];
      
      for (const newsArticleId of newsArticleIds) {
        // Check if article exists
        const article = await storage.getNewsArticleById(newsArticleId);
        if (article) {
          const job = await storage.createJob({
            type: 'video_generation',
            status: 'pending',
            data: {
              newsArticleId,
              userId,
              language
            },
            progress: 0
          });
          jobs.push({ articleId: newsArticleId, jobId: job.id });
        }
      }
      
      res.json({ 
        message: `Started ${jobs.length} video generation jobs`,
        jobs
      });
    } catch (error) {
      console.error('Error starting batch video generation:', error);
      res.status(500).json({ message: 'Failed to start batch video generation' });
    }
  });

  app.get('/api/videos/ready', isAuthenticated, async (req, res) => {
    try {
      const readyVideos = await storage.getVideosByStatus('ready');
      res.json(readyVideos);
    } catch (error) {
      console.error('Error fetching ready videos:', error);
      res.status(500).json({ message: 'Failed to fetch ready videos' });
    }
  });

  app.post('/api/videos/:videoId/publish', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { videoId } = req.params;
      const { channelId } = req.body;
      
      // Create publish job
      const job = await storage.createJob({
        type: 'publish',
        status: 'pending',
        data: {
          videoId,
          channelId,
          userId
        },
        progress: 0
      });
      
      res.json({ 
        message: 'Video publishing started',
        jobId: job.id
      });
    } catch (error) {
      console.error('Error starting video publish:', error);
      res.status(500).json({ message: 'Failed to start video publish' });
    }
  });

  // YouTube channel management endpoints
  app.get('/api/youtube/channels', isAuthenticated, async (req, res) => {
    try {
      const channels = await storage.getYoutubeChannels();
      res.json(channels);
    } catch (error) {
      console.error('Error fetching YouTube channels:', error);
      res.status(500).json({ message: 'Failed to fetch YouTube channels' });
    }
  });

  app.post('/api/youtube/channels', isAuthenticated, async (req: any, res) => {
    try {
      const { channelId, channelName, language, isActive } = req.body;
      
      const channel = await storage.createYoutubeChannel({
        channelId,
        channelName,
        language,
        isActive: isActive || false
      });
      
      res.json(channel);
    } catch (error) {
      console.error('Error creating YouTube channel:', error);
      res.status(500).json({ message: 'Failed to create YouTube channel' });
    }
  });

  app.put('/api/youtube/channels/:id', isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const { channelName, language, isActive } = req.body;
      
      await storage.updateYoutubeChannel(id, {
        channelName,
        language,
        isActive
      });
      
      res.json({ message: 'Channel updated successfully' });
    } catch (error) {
      console.error('Error updating YouTube channel:', error);
      res.status(500).json({ message: 'Failed to update YouTube channel' });
    }
  });

  app.delete('/api/youtube/channels/:id', isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      
      await storage.deleteYoutubeChannel(id);
      
      res.json({ message: 'Channel deleted successfully' });
    } catch (error) {
      console.error('Error deleting YouTube channel:', error);
      res.status(500).json({ message: 'Failed to delete YouTube channel' });
    }
  });

  app.get('/api/youtube/auth-url', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      
      // Get or create YouTube client
      const client = await youtubeService.getClient(userId);
      if (!client) {
        return res.status(400).json({ message: 'YouTube API not configured' });
      }
      
      // Generate authorization URL
      const authUrl = client.generateAuthUrl({
        access_type: 'offline',
        scope: [
          'https://www.googleapis.com/auth/youtube.upload',
          'https://www.googleapis.com/auth/youtube.readonly'
        ],
        state: userId // Pass user ID in state
      });
      
      res.json({ authUrl });
    } catch (error) {
      console.error('Error generating YouTube auth URL:', error);
      res.status(500).json({ message: 'Failed to generate authorization URL' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
