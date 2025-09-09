import { storage } from "../storage";
import { openaiService } from "./openaiService";
import type { InsertVideo } from "@shared/schema";

interface VideoGenerationOptions {
  script?: boolean;
  voiceover?: boolean;
  avatar?: boolean;
  customInstruction?: string;
}

class VideoService {
  private readonly synthesiaTeplates = {
    dark_anchor: 'synthesia_avatar_1',
    mystery_narrator: 'synthesia_avatar_2', 
    tech_analyst: 'synthesia_avatar_3',
  };

  private readonly elevenLabsVoices = {
    'en-US': 'Adam',
    'pt-BR': 'Antonio',
    'es-ES': 'Pablo',
    'es-MX': 'Diego',
    'de-DE': 'Hans',
    'fr-FR': 'Antoine',
    'hi-IN': 'Arjun',
    'ja-JP': 'Takeshi',
  };

  async generateVideo(newsArticleId: string, language: string = 'en-US'): Promise<string> {
    try {
      // Get news article
      const newsArticles = await storage.getNewsArticles(1000);
      const article = newsArticles.find(a => a.id === newsArticleId);
      
      if (!article) {
        throw new Error("News article not found");
      }

      // Generate script
      const script = await openaiService.generateScript(article.title, article.content);

      // Create video record
      const video = await storage.createVideo({
        newsArticleId,
        title: article.title,
        script,
        language: language as any,
        avatarTemplate: 'dark_anchor',
        status: 'generating',
      });

      // Start video generation job
      await storage.createJob({
        type: 'video_render',
        status: 'pending',
        data: {
          videoId: video.id,
          script,
          language,
          avatarTemplate: 'dark_anchor',
        },
      });

      return video.id;
    } catch (error) {
      console.error("Error generating video:", error);
      throw error;
    }
  }

  async renderWithSynthesia(script: string, language: string, avatarTemplate: string): Promise<string> {
    try {
      if (!process.env.SYNTHESIA_API_KEY) {
        throw new Error("Synthesia API key not configured");
      }

      const payload = {
        title: `DarkNews Video ${Date.now()}`,
        description: "Auto-generated dark news video",
        visibility: "private",
        avatar: this.synthesiaTeplates[avatarTemplate as keyof typeof this.synthesiaTeplates] || this.synthesiaTeplates.dark_anchor,
        language: language,
        script: [{
          type: "text",
          text: script,
        }],
        background: "dark_newsroom",
        settings: {
          quality: "1080p",
          subtitles: true,
        }
      };

      const response = await fetch("https://api.synthesia.io/v2/videos", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.SYNTHESIA_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Synthesia API error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      
      await storage.updateApiStatus({
        serviceName: "Synthesia",
        status: "operational",
        lastChecked: new Date(),
      });

      return result.id;
    } catch (error) {
      console.error("Error rendering with Synthesia:", error);
      await storage.updateApiStatus({
        serviceName: "Synthesia", 
        status: "down",
        lastChecked: new Date(),
      });
      throw error;
    }
  }

  async checkVideoStatus(synthesiVideoId: string): Promise<{
    status: string;
    downloadUrl?: string;
    thumbnailUrl?: string;
  }> {
    try {
      const response = await fetch(`https://api.synthesia.io/v2/videos/${synthesiVideoId}`, {
        headers: {
          "Authorization": `Bearer ${process.env.SYNTHESIA_API_KEY}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Synthesia API error: ${response.status}`);
      }

      const result = await response.json();
      return {
        status: result.status,
        downloadUrl: result.download_url,
        thumbnailUrl: result.thumbnail_url,
      };
    } catch (error) {
      console.error("Error checking video status:", error);
      throw error;
    }
  }

  async regenerateVideo(videoId: string, options: VideoGenerationOptions): Promise<void> {
    try {
      const videos = await storage.getVideos(1000);
      const video = videos.find(v => v.id === videoId);
      
      if (!video) {
        throw new Error("Video not found");
      }

      // Create regeneration job
      await storage.createJob({
        type: 'video_regenerate',
        status: 'pending',
        data: {
          videoId,
          options,
        },
      });

      // Update video status
      await storage.updateVideoStatus(videoId, 'pending');
    } catch (error) {
      console.error("Error regenerating video:", error);
      throw error;
    }
  }

  async generateMultiLanguageVersions(videoId: string): Promise<void> {
    try {
      const videos = await storage.getVideos(1000);
      const originalVideo = videos.find(v => v.id === videoId);
      
      if (!originalVideo) {
        throw new Error("Original video not found");
      }

      const languages = ['pt-BR', 'es-ES', 'es-MX', 'de-DE', 'fr-FR', 'hi-IN', 'ja-JP'];
      
      for (const language of languages) {
        if (language !== originalVideo.language) {
          // Translate script
          const translatedScript = await openaiService.translateScript(
            originalVideo.script, 
            language
          );

          // Create new video version
          await storage.createVideo({
            newsArticleId: originalVideo.newsArticleId,
            title: originalVideo.title,
            script: translatedScript,
            language: language as any,
            avatarTemplate: originalVideo.avatarTemplate,
            status: 'pending',
          });
        }
      }
    } catch (error) {
      console.error("Error generating multi-language versions:", error);
      throw error;
    }
  }
}

export const videoService = new VideoService();
