import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Bot, 
  User, 
  Send, 
  Loader2, 
  Settings, 
  Brain,
  MessageSquare,
  Copy,
  Check,
  Zap,
  Sparkles,
  Folder,
  Code,
  Terminal as TerminalIcon,
  FileText,
  Monitor,
  Plus,
  History,
  UserCircle,
  Mic,
  Image as ImageIcon,
  ThumbsUp,
  ThumbsDown,
  RotateCcw,
  Hash,
  AtSign,
  ChevronDown,
  X
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { FileExplorer } from "./file-explorer";
import { CodeEditor } from "./code-editor";
import { Terminal } from "./terminal";
import { BrowserAutomation } from "./browser-automation";
import { MCPIntegration } from "./mcp-integration";
// Import components (will be implemented)
// import { AgentSelector } from "./agent-selector";
// import { ContextSelector } from "./context-selector";
// import { ModelSelector } from "./model-selector";
// import { VoiceTranscription } from "./voice-transcription";
// import { FileUploader } from "./file-uploader";
// import { SettingsPanel } from "./settings-panel";
// import { TaskManager } from "./task-manager";

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  provider?: string;
  model?: string;
  cost?: number;
  tokensUsed?: number;
  rating?: 'good' | 'bad' | null;
}

interface Provider {
  id: string;
  name: string;
  displayName: string;
  models: Array<{
    id: string;
    name: string;
    displayName: string;
    contextWindow: number;
    inputCost: number;
    outputCost: number;
    isDefault?: boolean;
  }>;
  capabilities: Array<{
    type: string;
    level: string;
  }>;
  pricing: string;
}

interface ClineState {
  activeAgent: string;
  selectedContexts: string[];
  currentModel: string;
  taskList: any[];
  autoRunEnabled: boolean;
  voiceEnabled: boolean;
  uploadedFiles: File[];
}

export function AdvancedChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `👋 Olá! Sou o **Cline AI Assistant Avançado** integrado ao DarkNews Autopilot. 

🎯 **Posso ajudar você com:**
- 🔧 **Desenvolvimento Completo** - Code, debug, deploy
- 🤖 **Automação Inteligente** - Workflows, pipelines, bots
- 🗃️ **Gerenciamento de Arquivos** - CRUD, backup, organização
- 💻 **Terminal Integration** - Comandos, scripts, monitoring
- 🌐 **Browser Automation** - Screenshots, testing, scraping
- 🔗 **MCP Integrations** - GitHub, Database, Slack, News, YouTube
- 📊 **Project Analysis** - Estrutura, dependências, performance
- ⚡ **Task Execution** - Troubleshooting automático

💡 **Dica**: Use @ para selecionar agentes e # para contexto!`,
      timestamp: new Date(),
    },
  ]);

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("chat");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [chatHistory, setChatHistory] = useState<string[]>([]);
  
  // Advanced state
  const [clineState, setClineState] = useState<ClineState>({
    activeAgent: "builder",
    selectedContexts: [],
    currentModel: "claude-4-sonnet",
    taskList: [],
    autoRunEnabled: false,
    voiceEnabled: true,
    uploadedFiles: []
  });

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Fetch available providers
  const { data: providers } = useQuery({
    queryKey: ['/api/ai-providers'],
    select: (data) => data as { active: Provider[]; extensible: Provider[] },
  });

  // Send message mutation
  const sendMutation = useMutation({
    mutationFn: async (data: { 
      message: string; 
      agent: string; 
      contexts: string[];
      model: string;
      files?: File[];
    }) => {
      const response = await apiRequest("POST", "/api/cline/chat", data);
      return response.json();
    },
    onSuccess: (data) => {
      const assistantMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
        provider: data.provider,
        model: data.model,
        cost: data.cost,
        tokensUsed: data.tokensUsed,
        rating: null
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
      
      toast({
        title: "Resposta Gerada",
        description: `Modelo: ${data.model} | Tokens: ${data.tokensUsed}`,
      });
    },
    onError: (error: any) => {
      setIsLoading(false);
      toast({
        title: "Erro",
        description: error.message || "Falha ao enviar mensagem",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    
    // Add to chat history
    setChatHistory(prev => [input, ...prev.slice(0, 9)]); // Keep last 10

    sendMutation.mutate({
      message: input,
      agent: clineState.activeAgent,
      contexts: clineState.selectedContexts,
      model: clineState.currentModel,
      files: clineState.uploadedFiles
    });

    setInput("");
    setClineState(prev => ({ ...prev, uploadedFiles: [] }));
  };

  const handleCopy = async (content: string, messageId: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedId(messageId);
      setTimeout(() => setCopiedId(null), 2000);
      
      toast({
        title: "Copiado!",
        description: "Mensagem copiada para a área de transferência",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao copiar mensagem",
        variant: "destructive",
      });
    }
  };

  const handleRating = (messageId: string, rating: 'good' | 'bad') => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, rating } : msg
    ));
    
    toast({
      title: rating === 'good' ? "👍 Feedback Positivo" : "👎 Feedback Negativo",
      description: "Obrigado pelo feedback! Isso nos ajuda a melhorar.",
    });
  };

  const handleRetry = (messageId: string) => {
    const message = messages.find(msg => msg.id === messageId);
    if (message && message.role === 'user') {
      setInput(message.content);
      inputRef.current?.focus();
    }
  };

  const startNewChat = () => {
    setMessages([{
      id: 'welcome',
      role: 'assistant',
      content: messages[0].content, // Keep welcome message
      timestamp: new Date(),
    }]);
    setInput("");
    setClineState(prev => ({ 
      ...prev, 
      selectedContexts: [], 
      uploadedFiles: [] 
    }));
    
    toast({
      title: "Novo Chat",
      description: "Conversa reiniciada com sucesso!",
    });
  };

  // Check if input has content for button color
  const hasContent = input.trim().length > 0 || clineState.uploadedFiles.length > 0;

  return (
    <Card className="flex flex-col h-full border-0 shadow-none bg-background">
      {/* Header Superior */}
      <CardHeader className="flex-shrink-0 pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bot className="h-5 w-5 text-primary" />
            <h2 className="font-semibold text-lg">Cline AI Assistant</h2>
            <Badge variant="outline" className="text-xs">
              Avançado
            </Badge>
          </div>
          
          {/* Menu Superior Direito */}
          <div className="flex items-center space-x-2">
            {/* Novo Chat */}
            <Button
              size="sm"
              variant="outline"
              onClick={startNewChat}
              data-testid="button-new-chat"
            >
              <Plus className="h-4 w-4" />
            </Button>

            {/* Histórico */}
            <div className="relative">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {/* TODO: Implement history */}}
                data-testid="button-history"
              >
                <History className="h-4 w-4" />
              </Button>
            </div>

            {/* Configurações */}
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowSettings(!showSettings)}
              data-testid="button-settings"
            >
              <Settings className="h-4 w-4" />
            </Button>

            {/* Menu Usuário */}
            <div className="relative">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowUserMenu(!showUserMenu)}
                data-testid="button-user-menu"
              >
                <UserCircle className="h-4 w-4" />
              </Button>
              
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-popover border rounded-md shadow-lg z-50">
                  <div className="py-1">
                    <button className="w-full text-left px-3 py-2 text-sm hover:bg-accent">
                      Manage Account
                    </button>
                    <button className="w-full text-left px-3 py-2 text-sm hover:bg-accent">
                      Mensagens
                    </button>
                    <button className="w-full text-left px-3 py-2 text-sm hover:bg-accent">
                      Tema do Dashboard
                    </button>
                    <button className="w-full text-left px-3 py-2 text-sm hover:bg-accent">
                      Linguagem
                    </button>
                    <Separator className="my-1" />
                    <button className="w-full text-left px-3 py-2 text-sm hover:bg-accent">
                      Help Document
                    </button>
                    <button className="w-full text-left px-3 py-2 text-sm hover:bg-accent">
                      Report Issue
                    </button>
                    <button className="w-full text-left px-3 py-2 text-sm hover:bg-accent">
                      Contact Us
                    </button>
                    <Separator className="my-1" />
                    <button className="w-full text-left px-3 py-2 text-sm hover:bg-accent text-red-600">
                      Log Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          {/* Sistema de Tabs Principal */}
          <TabsList className="flex-shrink-0 grid w-full grid-cols-6 bg-muted/50">
            <TabsTrigger value="chat" className="flex items-center space-x-1">
              <MessageSquare className="h-3 w-3" />
              <span>Chat</span>
            </TabsTrigger>
            <TabsTrigger value="agents" className="flex items-center space-x-1">
              <Bot className="h-3 w-3" />
              <span>Agents</span>
            </TabsTrigger>
            <TabsTrigger value="mcp" className="flex items-center space-x-1">
              <FileText className="h-3 w-3" />
              <span>MCP</span>
            </TabsTrigger>
            <TabsTrigger value="context" className="flex items-center space-x-1">
              <Hash className="h-3 w-3" />
              <span>Context</span>
            </TabsTrigger>
            <TabsTrigger value="rules" className="flex items-center space-x-1">
              <Settings className="h-3 w-3" />
              <span>Rules</span>
            </TabsTrigger>
            <TabsTrigger value="models" className="flex items-center space-x-1">
              <Brain className="h-3 w-3" />
              <span>Models</span>
            </TabsTrigger>
          </TabsList>

          {/* Tab Content - Chat */}
          <TabsContent value="chat" className="flex-1 flex flex-col mt-0">
            <div className="flex-1 flex flex-col">
              {/* Messages Area */}
              <ScrollArea className="flex-1 p-4" ref={scrollRef}>
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={cn(
                        "flex w-full",
                        message.role === "user" ? "justify-end" : "justify-start"
                      )}
                    >
                      <div
                        className={cn(
                          "flex max-w-[80%] space-x-2",
                          message.role === "user" ? "flex-row-reverse space-x-reverse" : "flex-row"
                        )}
                      >
                        <div
                          className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                            message.role === "user"
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground"
                          )}
                        >
                          {message.role === "user" ? (
                            <User className="h-4 w-4" />
                          ) : (
                            <Bot className="h-4 w-4" />
                          )}
                        </div>
                        <div
                          className={cn(
                            "rounded-lg px-3 py-2 prose prose-sm max-w-none",
                            message.role === "user"
                              ? "bg-primary text-primary-foreground ml-2"
                              : "bg-muted text-foreground mr-2"
                          )}
                        >
                          <div className="whitespace-pre-wrap break-words">
                            {message.content}
                          </div>
                          
                          {/* Message Metadata */}
                          {(message.provider || message.model) && (
                            <div className="mt-2 pt-2 border-t border-border/50">
                              <div className="flex flex-wrap gap-2 text-xs opacity-70">
                                {message.model && (
                                  <Badge variant="secondary" className="text-xs">
                                    {message.model}
                                  </Badge>
                                )}
                                {message.tokensUsed && (
                                  <Badge variant="outline" className="text-xs">
                                    {message.tokensUsed} tokens
                                  </Badge>
                                )}
                                {message.cost && (
                                  <Badge variant="outline" className="text-xs">
                                    ${message.cost.toFixed(4)}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="flex items-center space-x-2 bg-muted rounded-lg px-3 py-2">
                        <Bot className="h-4 w-4" />
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-sm">Processando...</span>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              {/* Action Icons Above Prompt */}
              <div className="px-4 py-2">
                <div className="flex justify-center space-x-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleRating(messages[messages.length - 1]?.id, 'good')}
                    data-testid="button-good"
                  >
                    <ThumbsUp className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleRating(messages[messages.length - 1]?.id, 'bad')}
                    data-testid="button-bad"
                  >
                    <ThumbsDown className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleCopy(messages[messages.length - 1]?.content || '', messages[messages.length - 1]?.id)}
                    data-testid="button-copy"
                  >
                    {copiedId === messages[messages.length - 1]?.id ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleRetry(messages[messages.length - 1]?.id)}
                    data-testid="button-retry"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Advanced Prompt Area */}
              <div className="p-4 border-t bg-muted/30">
                <form onSubmit={handleSubmit} className="space-y-3">
                  {/* Uploaded Files Display */}
                  {clineState.uploadedFiles.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {clineState.uploadedFiles.map((file, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          📎 {file.name}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* Main Input Row */}
                  <div className="flex items-end space-x-2">
                    {/* Left Icons */}
                    <div className="flex items-center space-x-1">
                      <Button type="button" variant="outline" size="sm">
                        <AtSign className="h-3 w-3" />
                      </Button>
                      <Button type="button" variant="outline" size="sm">
                        <Hash className="h-3 w-3" />
                      </Button>
                      <Button type="button" variant="outline" size="sm">
                        <ImageIcon className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Center - Input + Model Selector */}
                    <div className="flex-1 flex flex-col space-y-2">
                      <div className="flex items-center space-x-2">
                        <Brain className="h-4 w-4" />
                        <span className="font-medium text-sm">{clineState.currentModel}</span>
                        <ChevronDown className="h-4 w-4" />
                      </div>
                      <Input
                        ref={inputRef}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Digite sua mensagem... Use @ para agentes e # para contexto"
                        disabled={isLoading}
                        className="min-h-[44px] resize-none"
                        data-testid="input-message"
                      />
                    </div>

                    {/* Right Icons */}
                    <div className="flex items-center space-x-1">
                      <Button type="button" variant="outline" size="sm">
                        <Mic className="h-4 w-4" />
                      </Button>
                      <Button
                        type="submit"
                        disabled={!hasContent || isLoading}
                        className={cn(
                          "transition-colors",
                          hasContent ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"
                        )}
                        data-testid="button-send"
                      >
                        {isLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Send className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </TabsContent>

          {/* Other Tabs */}
          <TabsContent value="agents" className="flex-1 mt-0">
            <div className="p-4">
              <h3 className="font-semibold mb-4">Configuração de Agentes</h3>
              <p className="text-muted-foreground">Gerenciar agentes built-in e custom agents.</p>
            </div>
          </TabsContent>

          <TabsContent value="mcp" className="flex-1 mt-0">
            <MCPIntegration />
          </TabsContent>

          <TabsContent value="context" className="flex-1 mt-0">
            <div className="p-4">
              <h3 className="font-semibold mb-4">Gerenciamento de Contexto</h3>
              <p className="text-muted-foreground">Configurar fontes de contexto para os agentes.</p>
            </div>
          </TabsContent>

          <TabsContent value="rules" className="flex-1 mt-0">
            <div className="p-4">
              <h3 className="font-semibold mb-4">Regras e Configurações</h3>
              <p className="text-muted-foreground">Definir comportamento e regras para os agentes.</p>
            </div>
          </TabsContent>

          <TabsContent value="models" className="flex-1 mt-0">
            <div className="p-4">
              <h3 className="font-semibold mb-4">Configuração de Modelos</h3>
              <p className="text-muted-foreground">Gerenciar modelos Premium, Avançados e Custom.</p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>

      {/* Settings Panel */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Configurações</h3>
                <Button size="sm" variant="ghost" onClick={() => setShowSettings(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p>Painel de configurações em desenvolvimento...</p>
            </CardContent>
          </Card>
        </div>
      )}
    </Card>
  );
}