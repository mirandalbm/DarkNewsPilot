// Multi-AI Provider Architecture for Cline Integration
// Supports OpenAI, Anthropic, xAI, and Perplexity

export interface AIProvider {
  id: string;
  name: string;
  displayName: string;
  models: AIModel[];
  capabilities: AICapability[];
  pricing: PricingTier;
  maxTokens: number;
  supportsStreaming: boolean;
  supportsImages: boolean;
  supportsFunctions: boolean;
}

export interface AIModel {
  id: string;
  name: string;
  displayName: string;
  contextWindow: number;
  inputCost: number; // per 1K tokens
  outputCost: number; // per 1K tokens
  isDefault?: boolean;
}

export interface AICapability {
  type: 'coding' | 'analysis' | 'research' | 'creative' | 'reasoning';
  level: 'basic' | 'intermediate' | 'advanced' | 'expert';
}

export type PricingTier = 'free' | 'low' | 'medium' | 'high' | 'premium';

export interface AIRequest {
  provider: string;
  model: string;
  messages: ChatMessage[];
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
  tools?: AITool[];
}

export interface AIResponse {
  id: string;
  provider: string;
  model: string;
  content: string;
  tokensUsed: {
    input: number;
    output: number;
    total: number;
  };
  cost: number;
  finishReason: 'stop' | 'length' | 'tool_calls' | 'error';
  duration: number;
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
  name?: string;
  tool_calls?: any[];
}

export interface AITool {
  type: string;
  function: {
    name: string;
    description: string;
    parameters: any;
  };
}

// Provider Management
export interface ProviderConfig {
  id: string;
  apiKey: string;
  enabled: boolean;
  customName?: string;
  customModels?: AIModel[];
}

export interface ExtensionRequest {
  name: string;
  displayName: string;
  apiKeyName: string;
  baseUrl: string;
  models: AIModel[];
  capabilities: AICapability[];
  pricing: PricingTier;
}

// Predefined AI Providers Configuration
export const AI_PROVIDERS: Record<string, AIProvider> = {
  openai: {
    id: 'openai',
    name: 'OpenAI',
    displayName: 'OpenAI GPT',
    models: [
      {
        id: 'gpt-4o',
        name: 'gpt-4o',
        displayName: 'GPT-4 Omni',
        contextWindow: 128000,
        inputCost: 0.005,
        outputCost: 0.015,
        isDefault: true
      },
      {
        id: 'gpt-4-turbo',
        name: 'gpt-4-turbo',
        displayName: 'GPT-4 Turbo',
        contextWindow: 128000,
        inputCost: 0.01,
        outputCost: 0.03
      },
      {
        id: 'gpt-3.5-turbo',
        name: 'gpt-3.5-turbo', 
        displayName: 'GPT-3.5 Turbo',
        contextWindow: 16385,
        inputCost: 0.0015,
        outputCost: 0.002
      }
    ],
    capabilities: [
      { type: 'coding', level: 'expert' },
      { type: 'analysis', level: 'expert' },
      { type: 'reasoning', level: 'expert' },
      { type: 'creative', level: 'advanced' }
    ],
    pricing: 'medium',
    maxTokens: 4096,
    supportsStreaming: true,
    supportsImages: true,
    supportsFunctions: true
  },
  openrouter: {
    id: 'openrouter',
    name: 'openrouter',
    displayName: 'OpenRouter',
    models: [
      {
        id: 'anthropic/claude-3.5-sonnet',
        name: 'anthropic/claude-3.5-sonnet',
        displayName: 'Claude 3.5 Sonnet',
        contextWindow: 200000,
        inputCost: 0.003,
        outputCost: 0.015,
        isDefault: true
      },
      {
        id: 'openai/gpt-4-turbo',
        name: 'openai/gpt-4-turbo',
        displayName: 'GPT-4 Turbo',
        contextWindow: 128000,
        inputCost: 0.01,
        outputCost: 0.03
      },
      {
        id: 'meta-llama/llama-3.1-405b-instruct',
        name: 'meta-llama/llama-3.1-405b-instruct',
        displayName: 'Llama 3.1 405B',
        contextWindow: 131072,
        inputCost: 0.005,
        outputCost: 0.005
      },
      {
        id: 'google/gemini-pro-1.5',
        name: 'google/gemini-pro-1.5',
        displayName: 'Gemini Pro 1.5',
        contextWindow: 1000000,
        inputCost: 0.00125,
        outputCost: 0.005
      },
      {
        id: 'perplexity/llama-3.1-sonar-huge-128k-online',
        name: 'perplexity/llama-3.1-sonar-huge-128k-online',
        displayName: 'Perplexity Sonar Huge',
        contextWindow: 127072,
        inputCost: 0.005,
        outputCost: 0.005
      }
    ],
    capabilities: [
      { type: 'coding', level: 'expert' },
      { type: 'analysis', level: 'expert' },
      { type: 'reasoning', level: 'expert' },
      { type: 'creative', level: 'expert' },
      { type: 'research', level: 'expert' }
    ],
    pricing: 'low',
    maxTokens: 1000000,
    supportsStreaming: true,
    supportsImages: true,
    supportsFunctions: true
  }
};

// Extensible providers for future additions
export interface ExtensibleProvider {
  id: string;
  name: string;
  displayName: string;
  apiKeyName: string;
  baseUrl: string;
  enabled: boolean;
  models: AIModel[];
  capabilities: AICapability[];
  pricing: PricingTier;
}

// Default provider configurations
export const DEFAULT_PROVIDERS = {
  coding: 'openai',
  research: 'openrouter',
  analysis: 'openai',
  creative: 'openai'
};

export const DEFAULT_MODELS = {
  openai: 'gpt-4o',
  openrouter: 'anthropic/claude-3.5-sonnet'
};

// Future extensible providers
export const EXTENSIBLE_PROVIDERS: ExtensibleProvider[] = [
  {
    id: 'xai',
    name: 'xai',
    displayName: 'xAI Grok',
    apiKeyName: 'XAI_API_KEY',
    baseUrl: 'https://api.x.ai/v1',
    enabled: false,
    models: [
      {
        id: 'grok-beta',
        name: 'grok-beta',
        displayName: 'Grok Beta',
        contextWindow: 131072,
        inputCost: 0.005,
        outputCost: 0.015,
        isDefault: true
      }
    ],
    capabilities: [
      { type: 'reasoning', level: 'expert' },
      { type: 'research', level: 'expert' },
      { type: 'coding', level: 'advanced' }
    ],
    pricing: 'medium'
  },
  {
    id: 'perplexity',
    name: 'perplexity',
    displayName: 'Perplexity',
    apiKeyName: 'PERPLEXITY_API_KEY',
    baseUrl: 'https://api.perplexity.ai',
    enabled: false,
    models: [
      {
        id: 'llama-3.1-sonar-huge-128k-online',
        name: 'llama-3.1-sonar-huge-128k-online',
        displayName: 'Sonar Huge 128K Online',
        contextWindow: 127072,
        inputCost: 0.005,
        outputCost: 0.005,
        isDefault: true
      }
    ],
    capabilities: [
      { type: 'research', level: 'expert' },
      { type: 'analysis', level: 'expert' },
      { type: 'coding', level: 'advanced' }
    ],
    pricing: 'low'
  },
  {
    id: 'abacusai',
    name: 'abacusai',
    displayName: 'Abacus.AI',
    apiKeyName: 'ABACUSAI_API_KEY',
    baseUrl: 'https://cloud.abacus.ai/api',
    enabled: false,
    models: [
      {
        id: 'smaug-72b-v0.1',
        name: 'smaug-72b-v0.1',
        displayName: 'Smaug 72B',
        contextWindow: 32768,
        inputCost: 0.002,
        outputCost: 0.002,
        isDefault: true
      }
    ],
    capabilities: [
      { type: 'analysis', level: 'expert' },
      { type: 'coding', level: 'advanced' }
    ],
    pricing: 'medium'
  }
];