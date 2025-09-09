import { google } from 'googleapis';
import { storage } from "../storage";
import { openaiService } from "./openaiService";

class YouTubeService {
  private youtube: any;

  constructor() {
    this.initializeYouTube();
  }

  private async initializeYouTube() {
    try {
      const credentials = JSON.parse(process.env.YOUTUBE_CREDENTIALS || '{}');
      const auth = new google.auth.GoogleAuth({
        credentials,
        scopes: ['https://www.googleapis.com/auth/youtube.upload'],
      });

      this.youtube = google.youtube({ version: 'v3', auth });
      
      await storage.updateApiStatus({
        serviceName: "YouTube API",
        status: "operational",
        lastChecked: new Date(),
      });
    } catch (error) {
      console.error("Error initializing YouTube API:", error);
      await storage.updateApiStatus({
        serviceName: "YouTube API",
        status: "down",
        lastChecked: new Date(),
      });
    }
  }

  async uploadVideo(videoId: string): Promise<string> {
    try {
      const videos = await storage.getVideos(1000);
      const video = videos.find(v => v.id === videoId);
      
      if (!video || !video.videoUrl) {
        throw new Error("Video not found or not ready");
      }

      // Generate metadata
      const metadata = await openaiService.generateVideoMetadata(
        video.script, 
        video.language
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

      const response = await this.youtube.videos.insert({
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
