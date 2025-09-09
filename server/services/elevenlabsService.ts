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
    language: string = 'en',
    settings: ElevenLabsSettings = {}
  ): Promise<Buffer> {
    try {
      const apiKey = await this.getApiKey(userId);
      if (!apiKey) {
        throw new Error('ElevenLabs not configured for user');
      }

      // Language-specific voice mapping for multilingual support
      const languageVoices: Record<string, string> = {
        'en': 'pNInz6obpgDQGcFmaJgB', // Adam (English)
        'es': 'IKne3meq5aSn9XLyUdCD', // Matias (Spanish)
        'fr': 'XrExE9yKIg1WjnnlVkGX', // Liam (French)
        'de': 'TxGEqnHWrfWFTfGW9XjX', // Clyde (German)
        'pt': 'yoZ06aMxZJJ28mfd3POQ', // Sam (Portuguese)
        'hi': 'pqHfZKP75CvOlQylNhV4', // Bill (Hindi)
        'ja': 'IKne3meq5aSn9XLyUdCD'  // Fallback for Japanese
      };

      const voiceSettings = {
        voice_id: settings.voice_id || languageVoices[language] || languageVoices['en'],
        model_id: settings.model_id || 'eleven_multilingual_v2',
        stability: settings.stability || 0.75,
        similarity_boost: settings.similarity_boost || 0.75,
        style: settings.style || 0.5
      };

      return await this.generateSpeech(userId, text, voiceSettings);
    } catch (error) {
      console.error('Error generating multilingual speech:', error);
      throw error;
    }
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