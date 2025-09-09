import OpenAI from "openai";
import { storage } from "../storage";
import { cryptoService } from "./cryptoService";

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
        Write a compelling dark mystery news video script (45-60 seconds) based on this breaking news:
        
        Title: ${newsTitle}
        Content: ${newsContent}
        
        Structure:
        1. HOOK (15s): Start with a dramatic question or shocking statement
        2. FACTS (20s): Present the key information in a mysterious, documentary style
        3. CONCLUSION (10s): End with thought-provoking implications or unanswered questions
        
        Style Guidelines:
        - Dark, serious, and mysterious tone
        - Use words like "revealed", "exposed", "hidden truth", "behind closed doors"
        - Factual but compelling delivery
        - Include natural pauses for dramatic effect
        - Write for spoken word, not reading
        
        Return only the script text, no stage directions or formatting.
      `;

      const client = userId ? await this.getClient(userId) : globalOpenai;
      if (!client) {
        throw new Error('OpenAI not configured');
      }

      const response = await client.chat.completions.create({
        model: "gpt-5",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 500,
        temperature: 0.7,
      });

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

  async translateScript(script: string, targetLanguage: string, userId?: string): Promise<string> {
    try {
      const prompt = `
        Translate this dark mystery news script to ${targetLanguage}.
        Maintain the dramatic, mysterious tone and natural speaking rhythm.
        
        Original script: ${script}
        
        Return only the translated script.
      `;

      const client = userId ? await this.getClient(userId) : globalOpenai;
      if (!client) {
        throw new Error('OpenAI not configured');
      }

      const response = await client.chat.completions.create({
        model: "gpt-5",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
      });

      return response.choices[0].message.content || script;
    } catch (error) {
      console.error("Error translating script:", error);
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
