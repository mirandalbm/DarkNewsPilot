import { google } from 'googleapis';
import { storage } from "../storage";
import { openaiService } from "./openaiService";
import { cryptoService } from "./cryptoService";

class YouTubeService {
  private clients: Map<string, any> = new Map();

  async getClient(userId: string): Promise<any> {
    try {
      // Check cache first
      if (this.clients.has(userId)) {
        return this.clients.get(userId);
      }

      // Get YouTube API configuration
      const config = await storage.getApiConfiguration(userId, 'youtube');
      if (!config || !config.encryptedConfig || !config.isActive) {
        // Fallback to global credentials if available
        if (process.env.YOUTUBE_CLIENT_ID && process.env.YOUTUBE_CLIENT_SECRET) {
          return this.createGlobalClient();
        }
        return null;
      }

      const decryptedConfig = JSON.parse(cryptoService.simpleDecrypt(config.encryptedConfig));
      
      if (!decryptedConfig.client_id || !decryptedConfig.client_secret) {
        return this.createGlobalClient();
      }

      const oauth2Client = new google.auth.OAuth2(
        decryptedConfig.client_id,
        decryptedConfig.client_secret,
        'http://localhost:5000/auth/youtube/callback'
      );

      // Set refresh token if available
      if (decryptedConfig.refresh_token) {
        oauth2Client.setCredentials({
          refresh_token: decryptedConfig.refresh_token,
          access_token: decryptedConfig.access_token
        });
      }

      const client = google.youtube({ version: 'v3', auth: oauth2Client });
      
      // Cache the client
      this.clients.set(userId, client);
      
      return client;
    } catch (error) {
      console.error('Error creating YouTube client:', error);
      return this.createGlobalClient();
    }
  }

  private createGlobalClient(): any {
    try {
      if (process.env.YOUTUBE_CLIENT_ID && process.env.YOUTUBE_CLIENT_SECRET) {
        const oauth2Client = new google.auth.OAuth2(
          process.env.YOUTUBE_CLIENT_ID,
          process.env.YOUTUBE_CLIENT_SECRET,
          'http://localhost:5000/auth/youtube/callback'
        );
        
        return google.youtube({ version: 'v3', auth: oauth2Client });
      }
      return null;
    } catch (error) {
      console.error('Error creating global YouTube client:', error);
      return null;
    }
  }

  async uploadVideo(videoId: string, userId: string): Promise<string> {
    try {
      const videos = await storage.getVideos(1000);
      const video = videos.find(v => v.id === videoId);
      
      if (!video || !video.videoUrl) {
        throw new Error("Video not found or not ready");
      }

      // Get YouTube client
      const youtubeClient = await this.getClient(userId);
      if (!youtubeClient) {
        throw new Error('YouTube API not configured for user');
      }

      // Generate metadata
      const metadata = await openaiService.generateVideoMetadata(
        video.script, 
        video.language,
        userId
      );

      // Get appropriate channel for language
      const channels = await storage.getYoutubeChannels();
      const targetChannel = channels.find(c => c.language === video.language) || channels[0];
      
      if (!targetChannel) {
        throw new Error("No YouTube channel configured");
      }

      // Download video file (would need actual implementation)
      const videoBuffer = await this.downloadVideo(video.videoUrl);

      const requestBody = {
        snippet: {
          title: metadata.title,
          description: metadata.description,
          tags: metadata.tags,
          categoryId: '25', // News & Politics
          defaultLanguage: video.language,
        },
        status: {
          privacyStatus: 'public',
          selfDeclaredMadeForKids: false,
        },
      };

      const media = {
        mimeType: 'video/mp4',
        body: videoBuffer,
      };

      const response = await youtubeClient.videos.insert({
        part: 'snippet,status',
        requestBody,
        media,
      });

      const youtubeVideoId = response.data.id;
      
      // Update video record
      await storage.updateVideoYoutubeId(videoId, youtubeVideoId);
      await storage.updateVideoStatus(videoId, 'published');

      return youtubeVideoId;
    } catch (error) {
      console.error("Error uploading video:", error);
      await storage.updateApiStatus({
        serviceName: "YouTube API",
        status: "down", 
        lastChecked: new Date(),
      });
      throw error;
    }
  }

  private async downloadVideo(url: string): Promise<Buffer> {
    // Implementation would download video from Synthesia or storage
    // For now, return empty buffer
    return Buffer.alloc(0);
  }

  async getChannelStats(channelId: string): Promise<{
    subscriberCount: number;
    viewCount: number;
    videoCount: number;
  }> {
    try {
      const response = await this.youtube.channels.list({
        part: 'statistics',
        id: channelId,
      });

      const stats = response.data.items[0]?.statistics;
      
      return {
        subscriberCount: parseInt(stats?.subscriberCount || '0'),
        viewCount: parseInt(stats?.viewCount || '0'),
        videoCount: parseInt(stats?.videoCount || '0'),
      };
    } catch (error) {
      console.error("Error getting channel stats:", error);
      throw error;
    }
  }

  async updateChannelStats(): Promise<void> {
    try {
      const channels = await storage.getYoutubeChannels();
      
      for (const channel of channels) {
        const stats = await this.getChannelStats(channel.channelId);
        
        // Update channel stats in database
        // (would need additional storage method)
      }
    } catch (error) {
      console.error("Error updating channel stats:", error);
    }
  }
}

export const youtubeService = new YouTubeService();
