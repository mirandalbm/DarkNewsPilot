import { storage } from '../storage';
import { cryptoService } from './cryptoService';

interface ElevenLabsVoice {
  voice_id: string;
  name: string;
  category: string;
  labels: Record<string, string>;
}

interface ElevenLabsSettings {
  voice_id?: string;
  model_id?: string;
  stability?: number;
  similarity_boost?: number;
  style?: number;
}

class ElevenLabsService {
  private baseUrl = 'https://api.elevenlabs.io/v1';

  async getApiKey(userId: string): Promise<string | null> {
    try {
      const config = await storage.getApiConfiguration(userId, 'elevenlabs');
      if (!config || !config.encryptedConfig || !config.isActive) {
        return null;
      }

      const decryptedConfig = JSON.parse(cryptoService.simpleDecrypt(config.encryptedConfig));
      return decryptedConfig.api_key || null;
    } catch (error) {
      console.error('Error getting ElevenLabs API key:', error);
      return null;
    }
  }

  async getVoices(userId: string): Promise<ElevenLabsVoice[]> {
    try {
      const apiKey = await this.getApiKey(userId);
      if (!apiKey) {
        throw new Error('ElevenLabs not configured for user');
      }

      const response = await fetch(`${this.baseUrl}/voices`, {
        headers: {
          'xi-api-key': apiKey,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`ElevenLabs API error: ${response.status}`);
      }

      const data = await response.json();
      return data.voices || [];
    } catch (error) {
      console.error('Error fetching ElevenLabs voices:', error);
      throw error;
    }
  }

  async generateSpeech(
    userId: string,
    text: string,
    settings: ElevenLabsSettings = {}
  ): Promise<Buffer> {
    try {
      const apiKey = await this.getApiKey(userId);
      if (!apiKey) {
        throw new Error('ElevenLabs not configured for user');
      }

      // Default settings for dark news content
      const voiceSettings = {
        voice_id: settings.voice_id || 'pNInz6obpgDQGcFmaJgB', // Adam voice (deep, authoritative)
        model_id: settings.model_id || 'eleven_monolingual_v1',
        stability: settings.stability || 0.75,
        similarity_boost: settings.similarity_boost || 0.75,
        style: settings.style || 0.5
      };

      const response = await fetch(`${this.baseUrl}/text-to-speech/${voiceSettings.voice_id}`, {
        method: 'POST',
        headers: {
          'xi-api-key': apiKey,
          'Content-Type': 'application/json',
          'Accept': 'audio/mpeg'
        },
        body: JSON.stringify({
          text,
          model_id: voiceSettings.model_id,
          voice_settings: {
            stability: voiceSettings.stability,
            similarity_boost: voiceSettings.similarity_boost,
            style: voiceSettings.style
          }
        })
      });

      if (!response.ok) {
        throw new Error(`ElevenLabs TTS error: ${response.status}`);
      }

      const audioBuffer = await response.arrayBuffer();
      
      // Update API status on success
      await storage.updateApiStatus({
        serviceName: "ElevenLabs",
        status: "operational",
        lastChecked: new Date(),
      });

      return Buffer.from(audioBuffer);
    } catch (error) {
      console.error('Error generating speech with ElevenLabs:', error);
      
      // Update API status on error
      await storage.updateApiStatus({
        serviceName: "ElevenLabs",
        status: "down",
        lastChecked: new Date(),
      });
      
      throw error;
    }
  }

  async generateSpeechMultilingual(
    userId: string,
    text: string,
    language: string = 'en-US',
    settings: ElevenLabsSettings = {}
  ): Promise<Buffer> {
    try {
      const apiKey = await this.getApiKey(userId);
      if (!apiKey) {
        throw new Error('ElevenLabs not configured for user');
      }

      // Language-specific voice mapping for DarkNews multilingual support
      const languageVoices: Record<string, string> = {
        'en-US': 'pNInz6obpgDQGcFmaJgB', // Adam - Deep, authoritative voice for English
        'pt-BR': 'yoZ06aMxZJJ28mfd3POQ', // Sam - Brazilian Portuguese with dramatic tone
        'es-ES': 'IKne3meq5aSn9XLyUdCD', // Matias - Spanish (Spain) with mystery undertone
        'es-MX': 'VR6AewLTigWG4xSOukaG', // Antoni - Mexican Spanish variant
        'de-DE': 'TxGEqnHWrfWFTfGW9XjX', // Clyde - German with strong investigative tone
        'fr-FR': 'XrExE9yKIg1WjnnlVkGX', // Liam - French with documentary narrator style
        'hi-IN': 'pqHfZKP75CvOlQylNhV4', // Bill - Hindi with authoritative presence
        'ja-JP': 'Xb7hH8MSUJpSbSDYk0k2'  // Charlie - Japanese with calm but intense delivery
      };

      // Enhanced voice settings optimized for dark mystery content by language
      const darkNewsSettings: Record<string, { stability: number; similarity_boost: number; style: number; model: string }> = {
        'en-US': { stability: 0.85, similarity_boost: 0.80, style: 0.65, model: 'eleven_monolingual_v1' },
        'pt-BR': { stability: 0.80, similarity_boost: 0.85, style: 0.70, model: 'eleven_multilingual_v2' },
        'es-ES': { stability: 0.82, similarity_boost: 0.78, style: 0.68, model: 'eleven_multilingual_v2' },
        'es-MX': { stability: 0.80, similarity_boost: 0.82, style: 0.72, model: 'eleven_multilingual_v2' },
        'de-DE': { stability: 0.88, similarity_boost: 0.75, style: 0.60, model: 'eleven_multilingual_v2' },
        'fr-FR': { stability: 0.85, similarity_boost: 0.80, style: 0.65, model: 'eleven_multilingual_v2' },
        'hi-IN': { stability: 0.83, similarity_boost: 0.85, style: 0.70, model: 'eleven_multilingual_v2' },
        'ja-JP': { stability: 0.87, similarity_boost: 0.78, style: 0.62, model: 'eleven_multilingual_v2' }
      };
      
      const langSettings = darkNewsSettings[language] || darkNewsSettings['en-US'];
      
      const voiceSettings = {
        voice_id: settings.voice_id || languageVoices[language] || languageVoices['en-US'],
        model_id: settings.model_id || langSettings.model,
        stability: settings.stability || langSettings.stability,
        similarity_boost: settings.similarity_boost || langSettings.similarity_boost,
        style: settings.style || langSettings.style
      };

      return await this.generateSpeech(userId, text, voiceSettings);
    } catch (error) {
      console.error('Error generating multilingual speech:', error);
      throw error;
    }
  }

  // Optimized method to generate speech with language-specific settings
  async generateSpeechForDarkNews(userId: string, text: string, language: string): Promise<Buffer> {
    return await this.generateSpeechMultilingual(userId, text, language, {});
  }

  // Get language-specific voice configuration
  getLanguageVoiceConfig(language: string): { voiceId: string; voiceName: string } {
    const voiceConfigs: Record<string, { voiceId: string; voiceName: string }> = {
      'en-US': { voiceId: 'pNInz6obpgDQGcFmaJgB', voiceName: 'Adam - English DarkNews Narrator' },
      'pt-BR': { voiceId: 'yoZ06aMxZJJ28mfd3POQ', voiceName: 'Sam - Brazilian Portuguese DarkNews' },
      'es-ES': { voiceId: 'IKne3meq5aSn9XLyUdCD', voiceName: 'Matias - Spanish DarkNews' },
      'es-MX': { voiceId: 'VR6AewLTigWG4xSOukaG', voiceName: 'Antoni - Mexican Spanish DarkNews' },
      'de-DE': { voiceId: 'TxGEqnHWrfWFTfGW9XjX', voiceName: 'Clyde - German DarkNews' },
      'fr-FR': { voiceId: 'XrExE9yKIg1WjnnlVkGX', voiceName: 'Liam - French DarkNews' },
      'hi-IN': { voiceId: 'pqHfZKP75CvOlQylNhV4', voiceName: 'Bill - Hindi DarkNews' },
      'ja-JP': { voiceId: 'Xb7hH8MSUJpSbSDYk0k2', voiceName: 'Charlie - Japanese DarkNews' }
    };
    
    return voiceConfigs[language] || voiceConfigs['en-US'];
  }

  async testConnection(userId: string): Promise<boolean> {
    try {
      const apiKey = await this.getApiKey(userId);
      if (!apiKey) {
        return false;
      }

      // Test by fetching user info
      const response = await fetch(`${this.baseUrl}/user`, {
        headers: {
          'xi-api-key': apiKey,
          'Content-Type': 'application/json'
        }
      });

      return response.ok;
    } catch (error) {
      console.error('ElevenLabs connection test failed:', error);
      return false;
    }
  }

  async getUserQuota(userId: string): Promise<{ character_count: number; character_limit: number } | null> {
    try {
      const apiKey = await this.getApiKey(userId);
      if (!apiKey) {
        return null;
      }

      const response = await fetch(`${this.baseUrl}/user/subscription`, {
        headers: {
          'xi-api-key': apiKey,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        return null;
      }

      const data = await response.json();
      return {
        character_count: data.character_count || 0,
        character_limit: data.character_limit || 10000
      };
    } catch (error) {
      console.error('Error fetching ElevenLabs quota:', error);
      return null;
    }
  }
}

export const elevenlabsService = new ElevenLabsService();