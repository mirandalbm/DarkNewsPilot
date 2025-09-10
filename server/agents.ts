import { Request, Response } from 'express';
import { z } from 'zod';
import { createInsertSchema } from 'drizzle-zod';
import { DarkNewsMCPServer } from './mcp-server';
import { isAuthenticated } from './replitAuth';
import { AIProviderService } from './services/aiProviderService';

// Agent schemas
const ChatRequestSchema = z.object({
  message: z.string().min(1, 'Message is required'),
  agent: z.string().min(1, 'Agent is required'),
  contexts: z.array(z.string()).default([]),
  model: z.string().min(1, 'Model is required'),
  files: z.array(z.any()).optional()
});

interface AgentCapabilities {
  coding: boolean;
  debugging: boolean;
  testing: boolean;
  mcpIntegration: boolean;
  autonomousPlanning: boolean;
  uiDesign: boolean;
  fullStack: boolean;
  rapidDevelopment: boolean;
}

interface Agent {
  id: string;
  name: string;
  description: string;
  systemPrompt: string;
  capabilities: AgentCapabilities;
  maxTokens: number;
  temperature: number;
  tools: string[];
}

// Built-in Agents Configuration
const BUILTIN_AGENTS: Record<string, Agent> = {
  builder: {
    id: 'builder',
    name: 'Builder',
    description: 'Execute routine tasks end-to-end with precision and efficiency',
    systemPrompt: `You are Builder, a professional code assistant specialized in executing routine development tasks end-to-end.

Your core responsibilities:
- Write clean, maintainable, and well-documented code
- Debug issues systematically and provide clear explanations
- Test implementations thoroughly before completion
- Follow established patterns and best practices
- Provide step-by-step progress updates

Key principles:
1. Always complete tasks fully - no half-implementations
2. Write tests for critical functionality
3. Follow the existing codebase patterns and styles
4. Provide clear documentation for complex logic
5. Handle edge cases appropriately

When working:
- Start with understanding the requirements completely
- Plan your approach before coding
- Implement incrementally with validation
- Test each component as you build
- Document any architectural decisions

You have access to file operations, code analysis, and testing tools.`,
    capabilities: {
      coding: true,
      debugging: true,
      testing: true,
      mcpIntegration: false,
      autonomousPlanning: false,
      uiDesign: false,
      fullStack: true,
      rapidDevelopment: false
    },
    maxTokens: 4000,
    temperature: 0.1,
    tools: ['file_operations', 'code_analysis', 'testing']
  },

  'builder-mcp': {
    id: 'builder-mcp',
    name: 'Builder with MCP',
    description: 'Advanced builder with full MCP integration for external service automation',
    systemPrompt: `You are Builder with MCP, an advanced development assistant with full access to external services through MCP (Model Context Protocol) integrations.

Your enhanced capabilities include:
- All standard Builder capabilities (coding, debugging, testing)
- GitHub integration (repositories, issues, PRs, actions)
- Database operations (queries, migrations, data management)
- Slack integration (messaging, notifications, bot interactions)
- News API integration (content fetching, analysis)
- YouTube API integration (video management, analytics)
- System monitoring and diagnostics

MCP Service Categories Available:
1. **Database Tools** - Execute queries, manage schemas, handle migrations
2. **GitHub Tools** - Repository management, code review, CI/CD operations
3. **Slack Tools** - Team communication, notifications, workflow automation
4. **News Tools** - Content aggregation, analysis, trending topics
5. **YouTube Tools** - Video publishing, analytics, channel management
6. **System Tools** - Diagnostics, monitoring, performance analysis

When working with MCP services:
- Always check service availability before using
- Handle API rate limits gracefully
- Implement proper error handling and retries
- Log all external service interactions
- Respect service-specific best practices

You can automate complex workflows that span multiple external services.`,
    capabilities: {
      coding: true,
      debugging: true,
      testing: true,
      mcpIntegration: true,
      autonomousPlanning: false,
      uiDesign: false,
      fullStack: true,
      rapidDevelopment: false
    },
    maxTokens: 6000,
    temperature: 0.1,
    tools: ['file_operations', 'code_analysis', 'testing', 'mcp_integration']
  },

  'builder-autonomo': {
    id: 'builder-autonomo',
    name: 'Builder Autônomo',
    description: 'Autonomous builder focused on rapid web application development',
    systemPrompt: `You are Builder Autônomo, an autonomous development assistant specialized in rapid web application creation with beautiful, modern interfaces.

Your autonomous capabilities:
- Plan entire application architectures independently
- Create full-stack web applications from scratch
- Design modern, responsive user interfaces
- Implement complete feature sets without supervision
- Optimize for development speed while maintaining quality

Specializations:
1. **Rapid Prototyping** - Quick MVP development
2. **Modern UI/UX** - Beautiful, accessible interfaces
3. **Full-Stack Integration** - Seamless frontend-backend development
4. **Component Architecture** - Reusable, scalable components
5. **Performance Optimization** - Fast loading, efficient code

Development Approach:
- Start with user requirements analysis
- Create comprehensive project structure
- Build core functionality first
- Add styling and user experience enhancements
- Implement data persistence and API integration
- Test across different devices and browsers

Technologies you excel with:
- React/TypeScript for frontend
- Express/Node.js for backend
- Tailwind CSS for styling
- Vite for build optimization
- PostgreSQL for data storage

You work autonomously but provide regular progress updates and ask for clarification when requirements are ambiguous.`,
    capabilities: {
      coding: true,
      debugging: true,
      testing: true,
      mcpIntegration: false,
      autonomousPlanning: true,
      uiDesign: true,
      fullStack: true,
      rapidDevelopment: true
    },
    maxTokens: 8000,
    temperature: 0.2,
    tools: ['file_operations', 'code_analysis', 'testing', 'ui_design']
  },

  'solo-builder': {
    id: 'solo-builder',
    name: 'SOLO Builder',
    description: 'Advanced autonomous agent for complex, multi-phase development projects',
    systemPrompt: `You are SOLO Builder, the most advanced autonomous development agent capable of handling complex, enterprise-level projects independently.

Advanced Autonomous Capabilities:
- **Project Architecture** - Design scalable, maintainable system architectures
- **Multi-Phase Planning** - Break complex projects into manageable phases
- **Advanced Problem Solving** - Handle complex technical challenges independently
- **Quality Assurance** - Implement comprehensive testing and validation
- **Performance Engineering** - Optimize for scale, speed, and efficiency
- **Security Implementation** - Apply security best practices throughout
- **Documentation Creation** - Generate comprehensive technical documentation

Specialized in:
1. **Enterprise Applications** - Large-scale, production-ready systems
2. **Microservices Architecture** - Distributed system design and implementation
3. **Advanced Integrations** - Complex API integrations and data flows
4. **Performance Optimization** - Database tuning, caching, CDN integration
5. **Security Hardening** - Authentication, authorization, data protection
6. **DevOps Integration** - CI/CD pipelines, monitoring, deployment

Project Management Approach:
- Comprehensive requirements analysis and technical planning
- Risk assessment and mitigation strategies
- Incremental development with continuous integration
- Automated testing at unit, integration, and e2e levels
- Performance monitoring and optimization
- Security auditing and compliance checking
- Detailed progress reporting and milestone tracking

You operate with minimal supervision, making architectural decisions independently while keeping stakeholders informed of progress and any critical decisions that need approval.

Always prioritize:
- Code quality and maintainability
- Security and data protection
- Scalability and performance
- Comprehensive testing coverage
- Clear documentation and knowledge transfer`,
    capabilities: {
      coding: true,
      debugging: true,
      testing: true,
      mcpIntegration: true,
      autonomousPlanning: true,
      uiDesign: true,
      fullStack: true,
      rapidDevelopment: true
    },
    maxTokens: 12000,
    temperature: 0.15,
    tools: ['file_operations', 'code_analysis', 'testing', 'mcp_integration', 'ui_design', 'project_management']
  }
};

export class AgentManager {
  private mcpServer: DarkNewsMCPServer;
  private aiProvider: AIProviderService;

  constructor(mcpServer: DarkNewsMCPServer, aiProvider: AIProviderService) {
    this.mcpServer = mcpServer;
    this.aiProvider = aiProvider;
  }

  // Get all available agents
  getAvailableAgents(): Agent[] {
    return Object.values(BUILTIN_AGENTS);
  }

  // Get specific agent
  getAgent(agentId: string): Agent | null {
    return BUILTIN_AGENTS[agentId] || null;
  }

  // Process chat with specific agent
  async processChat(agentId: string, message: string, contexts: string[], model: string, files?: any[]): Promise<{
    response: string;
    provider: string;
    model: string;
    cost: number;
    tokensUsed: number;
  }> {
    const agent = this.getAgent(agentId);
    if (!agent) {
      throw new Error(`Agent ${agentId} not found`);
    }

    // Build context from selected sources
    let contextContent = '';
    for (const context of contexts) {
      const content = await this.getContextContent(context);
      if (content) {
        contextContent += `\n\n--- ${context.toUpperCase()} CONTEXT ---\n${content}`;
      }
    }

    // Process uploaded files
    let fileContent = '';
    if (files && files.length > 0) {
      fileContent = '\n\n--- UPLOADED FILES ---\n';
      for (const file of files) {
        fileContent += `File: ${file.name}\n${file.content}\n\n`;
      }
    }

    // Build final prompt
    const systemPrompt = agent.systemPrompt;
    const userPrompt = `${contextContent}${fileContent}\n\nUser Request:\n${message}`;

    // Get AI response using available provider
    const availableProviders = this.aiProvider.getAvailableProviders();
    if (availableProviders.length === 0) {
      throw new Error('No AI providers available');
    }

    // Use first available provider for now
    const provider = availableProviders[0];
    
    // Build messages for AI provider
    const messages = [
      { role: 'system' as const, content: systemPrompt },
      { role: 'user' as const, content: userPrompt }
    ];

    try {
      // Make actual AI provider request
      const aiRequest = {
        provider: provider.id,
        model: model,
        messages: messages,
        temperature: agent.temperature,
        maxTokens: agent.maxTokens
      };

      const providerResponse = await this.aiProvider.sendRequest(aiRequest);
      
      return {
        response: providerResponse.content,
        provider: providerResponse.provider,
        model: providerResponse.model,
        cost: providerResponse.cost,
        tokensUsed: providerResponse.tokensUsed.total
      };
    } catch (error) {
      console.error('AI Provider Error:', error);
      
      // Fallback response if AI provider fails
      const fallbackResponse = `I'm ${agent.name}, ready to help with your request. However, I'm currently experiencing connection issues with the AI provider. Here's what I can tell you about your request:

Request: "${message}"
Available contexts: ${contexts.join(', ')}
Model requested: ${model}
My capabilities: ${Object.keys(agent.capabilities).filter(cap => agent.capabilities[cap as keyof AgentCapabilities]).join(', ')}

Please try again in a moment or contact support if the issue persists.`;
      
      return {
        response: fallbackResponse,
        provider: provider.id,
        model: model,
        cost: 0,
        tokensUsed: 0
      };
    }
  }

  // Get context content from various sources
  private async getContextContent(context: string): Promise<string | null> {
    try {
      const fs = await import('fs/promises');
      const path = await import('path');
      
      switch (context) {
        case 'workspace':
          return await this.getWorkspaceContext();
        case 'client-src':
          return await this.getDirectoryContext('client/src');
        case 'server':
          return await this.getDirectoryContext('server');
        case 'shared':
          return await this.getDirectoryContext('shared');
        case 'package-json':
          return await this.getFileContext('package.json');
        case 'schema':
          return await this.getFileContext('shared/schema.ts');
        case 'replit-md':
          return await this.getFileContext('replit.md');
        case 'web-search':
          return await this.getWebSearchContext();
        case 'current-url':
          return await this.getCurrentUrlContext();
        default:
          return null;
      }
    } catch (error) {
      console.error(`Error getting context ${context}:`, error);
      return null;
    }
  }

  private async getWorkspaceContext(): Promise<string> {
    try {
      const fs = await import('fs/promises');
      const files = await fs.readdir('.', { withFileTypes: true });
      const structure = files
        .filter(file => file.isDirectory() && !file.name.startsWith('.') && file.name !== 'node_modules')
        .map(dir => `- ${dir.name}/`)
        .join('\n');
      
      return `Workspace Overview:\n- Frontend: React + TypeScript + Vite + Tailwind CSS\n- Backend: Express + TypeScript + Drizzle ORM\n- Database: PostgreSQL (Neon)\n- Authentication: Replit Auth\n- UI Components: shadcn/ui + Radix UI\n- Key Features: DarkNews Autopilot System for automated video creation\n\nProject Structure:\n${structure}`;
    } catch (error) {
      return `Workspace Overview (fallback):\n- Frontend: React + TypeScript + Vite + Tailwind CSS\n- Backend: Express + TypeScript + Drizzle ORM\n- Database: PostgreSQL (Neon)\n- Authentication: Replit Auth\n- UI Components: shadcn/ui + Radix UI\n- Key Features: DarkNews Autopilot System for automated video creation`;
    }
  }

  private async getDirectoryContext(dirPath: string): Promise<string> {
    try {
      const fs = await import('fs/promises');
      const path = await import('path');
      
      const files = await fs.readdir(dirPath, { withFileTypes: true });
      const structure = files
        .map(file => {
          const prefix = file.isDirectory() ? '📁 ' : '📄 ';
          return `${prefix}${file.name}`;
        })
        .join('\n');
      
      return `Directory structure for ${dirPath}:\n${structure}`;
    } catch (error) {
      return `Directory structure for ${dirPath} (error reading): ${error}`;
    }
  }

  private async getFileContext(filePath: string): Promise<string> {
    try {
      const fs = await import('fs/promises');
      const content = await fs.readFile(filePath, 'utf-8');
      
      // Truncate very long files to avoid token limits
      const maxLength = 10000;
      if (content.length > maxLength) {
        return `File content for ${filePath} (truncated):\n${content.substring(0, maxLength)}\n\n... [truncated - file too long]`;
      }
      
      return `File content for ${filePath}:\n${content}`;
    } catch (error) {
      return `File content for ${filePath} (error reading): ${error}`;
    }
  }

  private async getWebSearchContext(): Promise<string> {
    try {
      // Simulated web search context for now
      // TODO: Implement real web search integration
      return `Web Search Context:\n- Real-time web search results would appear here\n- Integration with search APIs (Google, Bing, etc.)\n- Recent news and information from the web\n- Current trends and developments`;
    } catch (error) {
      return `Web search context (error): ${error}`;
    }
  }

  private async getCurrentUrlContext(): Promise<string> {
    try {
      // Simulated current URL context for now
      // TODO: Implement browser integration to get current URL content
      return `Current URL Context:\n- Content from the currently viewed webpage\n- Meta information (title, description)\n- Main text content extracted from the page\n- Links and navigation structure`;
    } catch (error) {
      return `Current URL context (error): ${error}`;
    }
  }

  // Execute agent tools (placeholder for future implementation)
  async executeAgentTool(agentId: string, tool: string, params: any): Promise<any> {
    const agent = this.getAgent(agentId);
    if (!agent) {
      throw new Error(`Agent ${agentId} not found`);
    }

    if (!agent.tools.includes(tool)) {
      throw new Error(`Agent ${agentId} does not have access to tool ${tool}`);
    }

    // Tool execution logic would go here
    // For now, return a placeholder
    return {
      success: true,
      result: `Tool ${tool} executed by agent ${agentId}`,
      params
    };
  }
}

// Routes for agent management
export const setupAgentRoutes = (app: any, mcpServer: DarkNewsMCPServer, aiProvider: AIProviderService) => {
  const agentManager = new AgentManager(mcpServer, aiProvider);

  // Get available agents
  app.get('/api/agents', isAuthenticated, (req: Request, res: Response) => {
    try {
      const agents = agentManager.getAvailableAgents();
      res.json({ agents });
    } catch (error: any) {
      console.error('Error getting agents:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Get specific agent
  app.get('/api/agents/:id', isAuthenticated, (req: Request, res: Response) => {
    try {
      const agent = agentManager.getAgent(req.params.id);
      if (!agent) {
        return res.status(404).json({ error: 'Agent not found' });
      }
      res.json({ agent });
    } catch (error: any) {
      console.error('Error getting agent:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Process chat with agent
  app.post('/api/cline/chat', isAuthenticated, async (req: Request, res: Response) => {
    try {
      const validation = ChatRequestSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ 
          error: 'Validation failed', 
          details: validation.error.issues 
        });
      }

      const { message, agent, contexts, model, files } = validation.data;

      const result = await agentManager.processChat(agent, message, contexts, model, files);
      
      res.json(result);
    } catch (error: any) {
      console.error('Error processing chat:', error);
      res.status(500).json({ error: error.message || 'Internal server error' });
    }
  });

  // Execute agent tool
  app.post('/api/agents/:id/tools/:tool', isAuthenticated, async (req: Request, res: Response) => {
    try {
      const { id: agentId, tool } = req.params;
      const params = req.body;

      const result = await agentManager.executeAgentTool(agentId, tool, params);
      
      res.json(result);
    } catch (error: any) {
      console.error('Error executing agent tool:', error);
      res.status(500).json({ error: error.message || 'Internal server error' });
    }
  });
};

export { BUILTIN_AGENTS, Agent, AgentCapabilities };