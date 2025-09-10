import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
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
  Sparkles
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  provider?: string;
  model?: string;
  cost?: number;
  tokensUsed?: number;
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

export function ClineChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `👋 Olá! Sou o **Cline AI Assistant** integrado ao DarkNews Autopilot. 

🎯 **Posso ajudar você com:**
• Análise e otimização da produção de vídeos
• Estratégias de conteúdo viral para notícias dark
• Configuração de automações e workflows
• Debugging de problemas no sistema
• Geração de scripts e ideias criativas

💡 **Como usar:**
Digite suas perguntas ou comandos e eu te ajudo a maximizar sua produção automatizada!`,
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState("openrouter");
  const [selectedModel, setSelectedModel] = useState("anthropic/claude-3.5-sonnet");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch available AI providers
  const { data: providersData } = useQuery<{active: Provider[], extensible: any[], total: number}>({
    queryKey: ["/api/ai-providers"],
    refetchInterval: 60000,
  });

  // Chat mutation
  const chatMutation = useMutation({
    mutationFn: async (messageData: {
      provider: string;
      model: string;
      messages: Array<{role: string; content: string}>;
      temperature?: number;
      maxTokens?: number;
    }) => {
      const response = await apiRequest("POST", "/api/ai-providers/chat", messageData);
      return response.json();
    },
    onSuccess: (data) => {
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.content,
        timestamp: new Date(),
        provider: data.provider,
        model: data.model,
        cost: data.cost,
        tokensUsed: data.tokensUsed?.total
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    },
    onError: (error: any) => {
      toast({
        title: "Erro no Chat",
        description: error.message || "Falha ao enviar mensagem",
        variant: "destructive",
      });
      setIsTyping(false);
    }
  });

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Prepare messages for API (exclude metadata)
    const apiMessages = [...messages, userMessage].map(msg => ({
      role: msg.role,
      content: msg.content
    }));

    // Add system context
    const systemMessage = {
      role: "system",
      content: `Você é o Cline AI Assistant integrado ao DarkNews Autopilot, um sistema de automação de vídeos de notícias dark/mystery.

CONTEXTO DO SISTEMA:
- Sistema automatizado que gera vídeos de notícias no estilo dark/mystery
- Utiliza OpenAI para scripts, ElevenLabs para voz, HeyGen para avatares
- Publica automaticamente em múltiplos canais YouTube (8+ idiomas)
- Dashboard profissional para monitoramento em tempo real
- Pipeline completo: descoberta → script → voz → avatar → publicação

SUAS CAPACIDADES:
- Análise de performance de vídeos e métricas
- Otimização de scripts para engajamento viral
- Sugestões de automação e workflows
- Debugging técnico e troubleshooting
- Estratégias de conteúdo dark/mystery

ESTILO DE RESPOSTA:
- Seja conciso mas informativo
- Use emojis para clareza visual
- Forneça insights acionáveis
- Mantenha o foco em produtividade e automação
- Use português brasileiro naturalmente`
    };

    chatMutation.mutate({
      provider: selectedProvider,
      model: selectedModel,
      messages: [systemMessage, ...apiMessages.slice(-10)], // Keep last 10 messages for context
      temperature: 0.7,
      maxTokens: 1024
    });
  };

  const copyToClipboard = async (text: string, messageId: string) => {
    try {
      await navigator.clipboard.writeText(text);
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

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const activeProvider = providersData?.active.find(p => p.id === selectedProvider);
  const selectedModelData = activeProvider?.models.find(m => m.id === selectedModel);

  return (
    <Card className="h-full flex flex-col border-0 shadow-lg">
      <CardHeader className="flex-shrink-0 border-b bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Bot className="h-5 w-5" />
            <span className="font-semibold">Cline AI Assistant</span>
            <Badge variant="secondary" className="text-xs bg-white/20 text-white border-0">
              {providersData?.total || 1} providers
            </Badge>
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Sparkles className="h-4 w-4 opacity-80" />
            <Settings className="h-4 w-4 opacity-80 cursor-pointer hover:opacity-100" />
          </div>
        </div>
        
        {/* Provider & Model Selection */}
        <div className="flex items-center space-x-2 text-xs text-blue-100">
          <Brain className="h-3 w-3" />
          <span>{activeProvider?.displayName || "OpenRouter"}</span>
          <span>•</span>
          <span>{selectedModelData?.displayName || "Claude 3.5 Sonnet"}</span>
          {selectedModelData && (
            <>
              <span>•</span>
              <span>{(selectedModelData.contextWindow / 1000).toFixed(0)}K context</span>
            </>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex space-x-3",
                  message.role === 'user' ? "justify-end" : "justify-start"
                )}
              >
                {message.role === 'assistant' && (
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                )}
                
                <div
                  className={cn(
                    "max-w-[85%] rounded-lg px-3 py-2 relative group",
                    message.role === 'user'
                      ? "bg-blue-600 text-white"
                      : "bg-muted text-foreground border"
                  )}
                >
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">
                    {message.content}
                  </div>
                  
                  {message.role === 'assistant' && (
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-muted-foreground/20">
                      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                        {message.provider && (
                          <Badge variant="outline" className="text-xs h-5">
                            {message.provider}
                          </Badge>
                        )}
                        {message.tokensUsed && (
                          <span>{message.tokensUsed.toLocaleString()} tokens</span>
                        )}
                        {message.cost && (
                          <span>${(message.cost * 1000).toFixed(2)}/1k</span>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                        onClick={() => copyToClipboard(message.content, message.id)}
                      >
                        {copiedId === message.id ? (
                          <Check className="h-3 w-3" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </Button>
                    </div>
                  )}
                </div>

                {message.role === 'user' && (
                  <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="h-4 w-4 text-white" />
                  </div>
                )}
              </div>
            ))}
            
            {isTyping && (
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <div className="bg-muted rounded-lg px-3 py-2 border">
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <Separator />
        
        <div className="p-4 bg-muted/30">
          <div className="flex space-x-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Digite sua pergunta sobre o DarkNews Autopilot..."
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              disabled={isTyping}
              className="flex-1"
            />
            <Button 
              onClick={handleSend}
              disabled={isTyping || !input.trim()}
              size="sm"
              className="px-3"
            >
              {isTyping ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
          
          <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
            <div className="flex items-center space-x-2">
              <MessageSquare className="h-3 w-3" />
              <span>{messages.length - 1} mensagens</span>
            </div>
            <div className="flex items-center space-x-2">
              <Zap className="h-3 w-3" />
              <span>AI-powered automation</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}