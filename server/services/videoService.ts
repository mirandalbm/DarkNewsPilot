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
  private readonly heygenTemplates = {
    dark_anchor: 'Susan_public_pro2_20230608',
    mystery_narrator: 'Tyler_public_20240711',
    tech_analyst: 'Josh_public_20240711',
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

  private readonly heygenVoices = {
    'en-US': '2d5b0e6cf36f460aa7fc47e3eee3b8b9',
    'pt-BR': '87f86aba5e1a4b2c8ad2b65b77c50c31',
    'es-ES': '846d3bf5e7eb4c6a9b5b7e2d7e3c4f6a',
    'es-MX': '7d4e8f9a1b2c3d4e5f6a7b8c9d0e1f2a',
    'de-DE': '1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d',
    'fr-FR': '9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c',
    'hi-IN': '3f2e1d0c9b8a7f6e5d4c3f2e1d0c9b8a',
    'ja-JP': '5d4c3f2e1d0c9b8a7f6e5d4c3f2e1d0c',
  };

  private getHeyGenVoiceId(language: string): string {
    return this.heygenVoices[language as keyof typeof this.heygenVoices] || this.heygenVoices['en-US'];
  }

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
        avatarTemplate: avatarTemplate as any,
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
          avatarTemplate: avatarTemplate as any,
        },
      });

      return video.id;
    } catch (error) {
      console.error("Error generating video:", error);
      throw error;
    }
  }

  async renderWithHeyGen(script: string, language: string, avatarTemplate: string): Promise<string> {
    try {
      if (!process.env.HEYGEN_API_KEY) {
        throw new Error("HeyGen API key not configured");
      }

      const payload = {
        video_inputs: [{
          character: {
            type: "avatar",
            avatar_id: this.heygenTemplates[avatarTemplate as keyof typeof this.heygenTemplates] || this.heygenTemplates.dark_anchor,
            avatar_style: "normal"
          },
          voice: {
            type: "text",
            input_text: script,
            voice_id: this.getHeyGenVoiceId(language)
          },
          background: {
            type: "color",
            value: "#1a1a1a"
          }
        }],
        dimension: {
          width: 1920,
          height: 1080
        },
        aspect_ratio: "16:9",
        callback_id: `darknews_${Date.now()}`
      };

      const response = await fetch("https://api.heygen.com/v2/video/generate", {
        method: "POST",
        headers: {
          "X-Api-Key": process.env.HEYGEN_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HeyGen API error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      
      await storage.updateApiStatus({
        serviceName: "HeyGen",
        status: "operational",
        lastChecked: new Date(),
      });

      return result.data.video_id;
    } catch (error) {
      console.error("Error rendering with HeyGen:", error);
      await storage.updateApiStatus({
        serviceName: "HeyGen", 
        status: "down",
        lastChecked: new Date(),
      });
      throw error;
    }
  }

  async checkVideoStatus(heygenVideoId: string): Promise<{
    status: string;
    downloadUrl?: string;
    thumbnailUrl?: string;
  }> {
    try {
      const response = await fetch(`https://api.heygen.com/v1/video_status.get?video_id=${heygenVideoId}`, {
        headers: {
          "X-Api-Key": process.env.HEYGEN_API_KEY!,
        },
      });

      if (!response.ok) {
        throw new Error(`HeyGen API error: ${response.status}`);
      }

      const result = await response.json();
      return {
        status: result.data.status,
        downloadUrl: result.data.video_url,
        thumbnailUrl: result.data.thumbnail_url,
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
