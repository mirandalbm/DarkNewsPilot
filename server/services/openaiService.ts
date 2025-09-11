import OpenAI from "openai";
import { storage } from "../storage";
import { cryptoService } from "./cryptoService";
import { errorRecoveryService } from "./errorRecoveryService";

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
// Global fallback client
const globalOpenai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

class OpenAIService {
  private clients: Map<string, OpenAI> = new Map();

  async getClient(userId: string): Promise<OpenAI | null> {
    try {
      // Check cache first
      if (this.clients.has(userId)) {
        return this.clients.get(userId)!;
      }

      // Get API configuration
      const config = await storage.getApiConfiguration(userId, 'openai');
      if (!config || !config.encryptedConfig || !config.isActive) {
        // Fallback to global client if available
        return globalOpenai;
      }

      const decryptedConfig = JSON.parse(cryptoService.simpleDecrypt(config.encryptedConfig));
      
      if (!decryptedConfig.api_key) {
        return globalOpenai;
      }

      const client = new OpenAI({
        apiKey: decryptedConfig.api_key,
      });

      // Cache the client
      this.clients.set(userId, client);
      
      return client;
    } catch (error) {
      console.error('Error creating OpenAI client:', error);
      return globalOpenai;
    }
  }

  async generateScript(newsTitle: string, newsContent: string, userId?: string): Promise<string> {
    try {
      const prompt = `
        Create an captivating dark mystery news video script (50-65 seconds) that transforms this breaking news into a compelling documentary-style narrative:
        
        NEWS SOURCE:
        Title: ${newsTitle}
        Content: ${newsContent}
        
        SCRIPT STRUCTURE:
        
        🔥 HOOK (15-18s): Open with psychological impact
        - Start with a chilling question, paradox, or stark contrast
        - Use phrases like "What if I told you...", "While the world slept...", "In the shadows of..."
        - Create immediate cognitive dissonance or surprise
        
        🕵️ INVESTIGATION (25-30s): Unveil the mystery layer by layer
        - Present facts as discoveries, not announcements
        - Use investigative language: "sources reveal", "documents show", "witnesses confirm"
        - Build tension with pacing: short punchy sentences followed by longer revelations
        - Include precise details that feel insider knowledge
        
        💀 IMPLICATIONS (12-15s): Leave them questioning everything
        - Connect to larger patterns or conspiracies
        - Pose unsettling questions about what this means
        - End with a statement that lingers in the mind
        
        DARK STORYTELLING TECHNIQUES:
        ✓ Power Words: "classified", "suppressed", "infiltrated", "orchestrated", "calculated"
        ✓ Sensory Details: "behind closed doors", "in the dead of night", "whispered conversations"
        ✓ Authority Undermining: Question official narratives, hint at cover-ups
        ✓ Human Psychology: Focus on motives, secrets, hidden agendas
        ✓ Rhythmic Pacing: Vary sentence length for dramatic effect
        ✓ Present Tense: Make events feel immediate and urgent
        
        VOICE & TONE:
        - Authoritative investigative journalist
        - Calm but intense delivery
        - Factual precision with emotional undertones
        - Natural speaking rhythm with strategic pauses
        
        OUTPUT: Pure script text only, optimized for voice synthesis, no directions or formatting.
      `;

      const client = userId ? await this.getClient(userId) : globalOpenai;
      if (!client) {
        throw new Error('OpenAI not configured');
      }

      const response = await errorRecoveryService.executeWithRetry(
        () => client.chat.completions.create({
          model: "gpt-4o",  
          messages: [{ role: "user", content: prompt }],
          max_tokens: 500,
          temperature: 0.7,
        }),
        {
          operationId: 'openai_generate_script',
          serviceName: 'OpenAI',
          endpoint: 'chat.completions.create',
          retryConfig: {
            maxRetries: 3,
            initialDelayMs: 1000,
            maxDelayMs: 15000,
            backoffMultiplier: 2,
            jitterMs: 200,
            enableCircuitBreaker: true
          }
        }
      );

      const script = response.choices[0].message.content;
      if (!script) {
        throw new Error("No script generated");
      }

      await storage.updateApiStatus({
        serviceName: "OpenAI",
        status: "operational",
        lastChecked: new Date(),
      });

      return script;
    } catch (error) {
      console.error("Error generating script:", error);
      await storage.updateApiStatus({
        serviceName: "OpenAI",
        status: "down",
        lastChecked: new Date(),
      });
      throw error;
    }
  }

  async translateScript(script: string, targetLanguage: string, userId?: string): Promise<string> {
    try {
      const languageMap: Record<string, string> = {
        'en-US': 'English',
        'pt-BR': 'Portuguese (Brazil)',
        'es-ES': 'Spanish (Spain)', 
        'es-MX': 'Spanish (Mexico)',
        'de-DE': 'German',
        'fr-FR': 'French',
        'hi-IN': 'Hindi',
        'ja-JP': 'Japanese'
      };

      const targetLang = languageMap[targetLanguage] || 'English';

      const prompt = `
        Translate this dark mystery news video script to ${targetLang}, maintaining the dramatic and investigative tone:
        
        Original Script: ${script}
        
        TRANSLATION REQUIREMENTS:
        ✓ Preserve the mysterious, dark documentary style
        ✓ Keep dramatic timing and pacing 
        ✓ Maintain investigative language and power words
        ✓ Adapt cultural references appropriately
        ✓ Keep the same emotional impact and suspense
        ✓ Ensure natural flow for voice synthesis
        
        Return only the translated script, no explanations or formatting.
      `;

      const client = userId ? await this.getClient(userId) : globalOpenai;
      if (!client) {
        throw new Error('OpenAI not configured');
      }

      const response = await errorRecoveryService.executeWithRetry(
        () => client.chat.completions.create({
          model: "gpt-4o",
          messages: [{ role: "user", content: prompt }],
          max_tokens: 600,
          temperature: 0.3, // Lower temperature for more consistent translations
        }),
        {
          operationId: 'openai_translate_script',
          serviceName: 'OpenAI',
          endpoint: 'chat.completions.create',
          retryConfig: {
            maxRetries: 3,
            initialDelayMs: 1000,
            maxDelayMs: 15000,
            backoffMultiplier: 2,
            jitterMs: 200,
            enableCircuitBreaker: true
          }
        }
      );

      const translatedScript = response.choices[0].message.content;
      if (!translatedScript) {
        throw new Error("No translation generated");
      }

      return translatedScript;
    } catch (error) {
      console.error("Error translating script:", error);
      throw error;
    }
  }

  async generateVideoMetadata(script: string, language: string, userId?: string): Promise<{
    title: string;
    description: string;
    tags: string[];
  }> {
    try {
      const prompt = `
        Generate YouTube metadata for this dark news video script in ${language}:
        
        Script: ${script}
        
        Create:
        1. A compelling title (under 60 characters) that's mysterious and clickable
        2. A description (2-3 sentences) that hooks viewers
        3. 8-10 relevant tags for SEO
        
        Respond with JSON in this format:
        {
          "title": "string",
          "description": "string", 
          "tags": ["tag1", "tag2", ...]
        }
      `;

      const client = userId ? await this.getClient(userId) : globalOpenai;
      if (!client) {
        throw new Error('OpenAI not configured');
      }

      const response = await client.chat.completions.create({
        model: "gpt-5",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        temperature: 0.8,
      });

      const result = JSON.parse(response.choices[0].message.content || "{}");
      return result;
    } catch (error) {
      console.error("Error generating metadata:", error);
      throw error;
    }
  }


  async testConnection(userId: string): Promise<boolean> {
    try {
      const client = await this.getClient(userId);
      if (!client) {
        return false;
      }

      // Test with a simple completion
      const response = await client.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: 'Hello' }],
        max_tokens: 5,
      });

      return !!response.choices[0]?.message?.content;
    } catch (error) {
      console.error('OpenAI connection test failed:', error);
      return false;
    }
  }

  clearCache(userId: string): void {
    this.clients.delete(userId);
  }
}

export const openaiService = new OpenAIService();
