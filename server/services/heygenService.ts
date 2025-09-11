import { storage } from '../storage';
import { cryptoService } from './cryptoService';

interface HeyGenAvatar {
  avatar_id: string;
  avatar_name: string;
  preview_image_url: string;
  support_languages: string[];
  gender: string;
}

interface HeyGenVideoRequest {
  script: {
    type: 'text';
    input_text: string;
  };
  avatar: {
    type: 'talking_photo' | 'avatar';
    avatar_id: string;
    avatar_style?: string;
  };
  voice: {
    type: 'text' | 'audio';
    voice_id?: string;
    input_text?: string;
    input_audio?: string; // Base64 encoded audio from ElevenLabs
  };
  background?: {
    type: 'color' | 'image';
    value: string;
  };
  dimension?: {
    width: number;
    height: number;
  };
  aspect_ratio?: string;
}

interface HeyGenVideoResponse {
  video_id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  video_url?: string;
  thumbnail_url?: string;
  error?: string;
}

class HeyGenService {
  private baseUrl = 'https://api.heygen.com/v2';

  // Unified language mapping for consistent voice selection
  private getUnifiedLanguageCode(language: string): string {
    const languageMap: Record<string, string> = {
      'en-US': 'en',
      'pt-BR': 'pt', 
      'es-ES': 'es',
      'es-MX': 'es',
      'de-DE': 'de',
      'fr-FR': 'fr',
      'hi-IN': 'hi',
      'ja-JP': 'ja'
    };
    return languageMap[language] || 'en';
  }

  // Unified avatar templates for different styles
  private getAvatarTemplate(style: string = 'dark_anchor'): string {
    const avatarTemplates: Record<string, string> = {
      'dark_anchor': 'Susan_public_pro2_20230608',
      'mystery_narrator': 'Tyler_public_20240711', 
      'tech_analyst': 'Josh_public_20240711',
      'investigative': 'Wayne-20220722',
      'documentary': 'Kristin-inblouse-20220304'
    };
    return avatarTemplates[style] || avatarTemplates['dark_anchor'];
  }

  async getApiKey(userId: string): Promise<string | null> {
    try {
      const config = await storage.getApiConfiguration(userId, 'heygen');
      if (!config || !config.encryptedConfig || !config.isActive) {
        return null;
      }

      const decryptedConfig = JSON.parse(cryptoService.simpleDecrypt(config.encryptedConfig));
      return decryptedConfig.api_key || null;
    } catch (error) {
      console.error('Error getting HeyGen API key:', error);
      return null;
    }
  }

  private async makeRequest(userId: string, endpoint: string, options: RequestInit = {}): Promise<Response> {
    const apiKey = await this.getApiKey(userId);
    if (!apiKey) {
      throw new Error('HeyGen not configured for user');
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'X-API-Key': apiKey,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    return response;
  }

  async getAvatars(userId: string): Promise<HeyGenAvatar[]> {
    try {
      const response = await this.makeRequest(userId, '/avatars');

      if (!response.ok) {
        throw new Error(`HeyGen API error: ${response.status}`);
      }

      const data = await response.json();
      return data.data.avatars || [];
    } catch (error) {
      console.error('Error fetching HeyGen avatars:', error);
      throw error;
    }
  }

  async createVideo(
    userId: string,
    scriptText: string,
    options: {
      avatarId?: string;
      voiceId?: string;
      language?: string;
      background?: string;
    } = {}
  ): Promise<string> {
    try {
      // Dark mystery avatar templates for different styles
      const darkAvatarTemplates = {
        'dark_anchor': 'Daisy-inskirt-20220818',      // Professional news anchor
        'investigative': 'Tyler-incasual-20220721',    // Casual investigative reporter  
        'documentary': 'Kristin-inblouse-20220304',   // Documentary host
        'serious_male': 'Wayne-20220722',             // Serious male presenter
        'mystery_female': 'Angela-inblackskirt-20220608', // Mystery theme female
      };
      
      const defaultAvatarId = options.avatarId || this.getAvatarTemplate('dark_anchor');
      
      const videoRequest: HeyGenVideoRequest = {
        script: {
          type: 'text',
          input_text: scriptText,
        },
        avatar: {
          type: 'avatar',
          avatar_id: defaultAvatarId,
          avatar_style: 'normal'
        },
        voice: {
          type: 'text',
          voice_id: options.voiceId || 'bae2d1d5c8a34ba0bf92486fdb9b7f31', // Professional female voice
          input_text: scriptText,
        },
        dimension: {
          width: 1920,
          height: 1080
        },
        aspect_ratio: '16:9',
        background: {
          type: 'color',
          value: options.background || '#1a1a1a', // Dark background for mystery theme
        }
      };

      const response = await this.makeRequest(userId, '/video/generate', {
        method: 'POST',
        body: JSON.stringify(videoRequest),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`HeyGen video generation error: ${response.status} - ${errorData.message || 'Unknown error'}`);
      }

      const data = await response.json();
      
      // Update API status on success
      await storage.updateApiStatus({
        serviceName: "HeyGen",
        status: "operational",
        lastChecked: new Date(),
      });

      return data.data.video_id;
    } catch (error) {
      console.error('Error creating HeyGen video:', error);
      
      // Update API status on error
      await storage.updateApiStatus({
        serviceName: "HeyGen",
        status: "down",
        lastChecked: new Date(),
      });
      
      throw error;
    }
  }

  async getVideoStatus(userId: string, videoId: string): Promise<HeyGenVideoResponse> {
    try {
      const response = await this.makeRequest(userId, `/video/status?video_id=${videoId}`);

      if (!response.ok) {
        throw new Error(`HeyGen API error: ${response.status}`);
      }

      const data = await response.json();
      return {
        video_id: videoId,
        status: data.data.status,
        video_url: data.data.video_url,
        thumbnail_url: data.data.thumbnail_url,
        error: data.data.error
      };
    } catch (error) {
      console.error('Error checking HeyGen video status:', error);
      throw error;
    }
  }

  async downloadVideo(userId: string, videoUrl: string): Promise<Buffer> {
    try {
      const response = await fetch(videoUrl);
      
      if (!response.ok) {
        throw new Error(`Failed to download video: ${response.status}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      return Buffer.from(arrayBuffer);
    } catch (error) {
      console.error('Error downloading HeyGen video:', error);
      throw error;
    }
  }

  // NEW: Integrated ElevenLabs + HeyGen pipeline
  async createVideoWithAudio(
    userId: string,
    scriptText: string,
    audioBuffer: Buffer,
    options: {
      avatarStyle?: string;
      background?: string;
      language?: string;
    } = {}
  ): Promise<string> {
    try {
      // Convert audio buffer to base64
      const audioBase64 = audioBuffer.toString('base64');
      
      const videoRequest: HeyGenVideoRequest = {
        script: {
          type: 'text',
          input_text: scriptText,
        },
        avatar: {
          type: 'avatar',
          avatar_id: this.getAvatarTemplate(options.avatarStyle || 'dark_anchor'),
          avatar_style: 'normal'
        },
        voice: {
          type: 'audio', // Use audio from ElevenLabs instead of text
          input_audio: audioBase64,
        },
        background: {
          type: 'color',
          value: options.background || '#1a1a1a', // Dark theme
        },
        dimension: {
          width: 1920,
          height: 1080
        },
        aspect_ratio: '16:9'
      };

      const response = await this.makeRequest(userId, '/video/generate', {
        method: 'POST',
        body: JSON.stringify(videoRequest),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`HeyGen audio video error: ${response.status} - ${errorData.message || 'Unknown error'}`);
      }

      const data = await response.json();
      
      // Update API status on success
      await storage.updateApiStatus({
        serviceName: "HeyGen",
        status: "operational",
        lastChecked: new Date(),
      });

      return data.data.video_id;
    } catch (error) {
      console.error('Error creating HeyGen video with audio:', error);
      
      // Update API status on error
      await storage.updateApiStatus({
        serviceName: "HeyGen",
        status: "down",
        lastChecked: new Date(),
      });
      
      throw error;
    }
  }

  async createVideoWithCustomAvatar(
    userId: string,
    scriptText: string,
    photoUrl: string,
    options: {
      voiceId?: string;
      language?: string;
    } = {}
  ): Promise<string> {
    try {
      const videoRequest: HeyGenVideoRequest = {
        script: {
          type: 'text',
          input_text: scriptText,
        },
        avatar: {
          type: 'talking_photo',
          avatar_id: photoUrl, // URL to the photo for talking photo
        },
        voice: {
          type: 'text',
          voice_id: options.voiceId || 'bae2d1d5c8a34ba0bf92486fdb9b7f31',
          input_text: scriptText,
        },
        dimension: {
          width: 1920,
          height: 1080
        },
        aspect_ratio: '16:9',
        background: {
          type: 'color',
          value: '#1a1a1a', // Dark theme
        }
      };

      const response = await this.makeRequest(userId, '/video/generate', {
        method: 'POST',
        body: JSON.stringify(videoRequest),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`HeyGen custom video error: ${response.status} - ${errorData.message || 'Unknown error'}`);
      }

      const data = await response.json();
      return data.data.video_id;
    } catch (error) {
      console.error('Error creating custom HeyGen video:', error);
      throw error;
    }
  }

  async testConnection(userId: string): Promise<boolean> {
    try {
      const response = await this.makeRequest(userId, '/avatars');
      return response.ok;
    } catch (error) {
      console.error('HeyGen connection test failed:', error);
      return false;
    }
  }

  async getUserCredits(userId: string): Promise<{ remaining_credits: number; total_credits: number } | null> {
    try {
      const response = await this.makeRequest(userId, '/user/remaining_quota');

      if (!response.ok) {
        return null;
      }

      const data = await response.json();
      return {
        remaining_credits: data.data.remaining_quota || 0,
        total_credits: data.data.total_quota || 0
      };
    } catch (error) {
      console.error('Error fetching HeyGen credits:', error);
      return null;
    }
  }

  async getTemplates(userId: string): Promise<any[]> {
    try {
      const response = await this.makeRequest(userId, '/templates');

      if (!response.ok) {
        throw new Error(`HeyGen API error: ${response.status}`);
      }

      const data = await response.json();
      return data.data.templates || [];
    } catch (error) {
      console.error('Error fetching HeyGen templates:', error);
      return [];
    }
  }

  // Poll for video completion
  async waitForVideoCompletion(
    userId: string,
    videoId: string,
    maxWaitTime: number = 300000, // 5 minutes
    pollInterval: number = 10000 // 10 seconds
  ): Promise<HeyGenVideoResponse> {
    const startTime = Date.now();
    
    while (Date.now() - startTime < maxWaitTime) {
      const status = await this.getVideoStatus(userId, videoId);
      
      if (status.status === 'completed' || status.status === 'failed') {
        return status;
      }
      
      // Wait before polling again
      await new Promise(resolve => setTimeout(resolve, pollInterval));
    }
    
    throw new Error('Video generation timeout');
  }
}

export const heygenService = new HeyGenService();