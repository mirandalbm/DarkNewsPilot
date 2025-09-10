import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { 
  Brain,
  Cpu,
  Zap,
  Settings,
  Plus,
  Edit,
  Trash2,
  Copy,
  Eye,
  Play,
  Pause,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
  TrendingUp,
  TrendingDown,
  BarChart3,
  LineChart,
  PieChart,
  Target,
  Clock,
  DollarSign,
  Activity,
  Server,
  Database,
  Cloud,
  Shield,
  Link2,
  Layers,
  Filter,
  Search,
  Download,
  Upload,
  FileText,
  Code,
  Mic,
  Image,
  Video,
  MessageSquare,
  Globe,
  Archive,
  RotateCcw,
  Save,
  AlertCircle
} from 'lucide-react';

interface AIProvider {
  id: string;
  name: string;
  type: 'language_model' | 'voice_synthesis' | 'image_generation' | 'video_analysis';
  status: 'active' | 'inactive' | 'error' | 'maintenance';
  api_endpoint: string;
  models: AIModelConfig[];
  pricing: {
    input_tokens: number; // custo por 1k tokens
    output_tokens: number;
    requests: number; // custo por request
    currency: string;
  };
  limits: {
    requests_per_minute: number;
    requests_per_day: number;
    max_tokens: number;
  };
  usage_stats: {
    requests_today: number;
    tokens_today: number;
    cost_today: number;
    uptime: number;
    avg_latency: number;
  };
  health: {
    last_check: string;
    response_time: number;
    error_rate: number;
    availability: number;
  };
}

interface AIModelConfig {
  id: string;
  name: string;
  display_name: string;
  provider_id: string;
  category: 'text' | 'code' | 'chat' | 'voice' | 'image' | 'video' | 'analysis';
  capabilities: string[];
  parameters: {
    temperature: number;
    max_tokens: number;
    top_p: number;
    frequency_penalty: number;
    presence_penalty: number;
    stop_sequences?: string[];
  };
  fallback_models: string[];
  usage_policy: {
    auto_fallback: boolean;
    cost_optimization: boolean;
    quality_preference: 'speed' | 'quality' | 'cost';
  };
  statistics: {
    total_requests: number;
    success_rate: number;
    avg_response_time: number;
    cost_per_request: number;
    quality_score: number;
  };
  customization: {
    system_prompt?: string;
    custom_instructions?: string;
    output_format?: string;
    style_guide?: string;
  };
}

interface ModelTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  use_case: string;
  recommended_models: string[];
  default_parameters: {
    temperature: number;
    max_tokens: number;
    top_p: number;
  };
  system_prompt: string;
  example_input: string;
  example_output: string;
  performance_metrics: {
    accuracy: number;
    speed: number;
    cost_efficiency: number;
  };
  usage_count: number;
  rating: number;
}

interface UsageAnalytics {
  period: 'today' | 'week' | 'month';
  total_requests: number;
  total_tokens: number;
  total_cost: number;
  by_provider: Array<{
    provider: string;
    requests: number;
    tokens: number;
    cost: number;
    percentage: number;
  }>;
  by_model: Array<{
    model: string;
    requests: number;
    avg_latency: number;
    success_rate: number;
    cost: number;
  }>;
  performance_trends: {
    response_times: number[];
    success_rates: number[];
    costs: number[];
  };
  cost_optimization: {
    potential_savings: number;
    recommendations: string[];
  };
}

const mockProviders: AIProvider[] = [
  {
    id: 'openai',
    name: 'OpenAI',
    type: 'language_model',
    status: 'active',
    api_endpoint: 'https://api.openai.com/v1',
    models: [
      {
        id: 'gpt-4-turbo',
        name: 'gpt-4-turbo',
        display_name: 'GPT-4 Turbo',
        provider_id: 'openai',
        category: 'text',
        capabilities: ['text-generation', 'analysis', 'reasoning', 'code'],
        parameters: {
          temperature: 0.7,
          max_tokens: 4096,
          top_p: 1.0,
          frequency_penalty: 0,
          presence_penalty: 0,
          stop_sequences: []
        },
        fallback_models: ['gpt-3.5-turbo', 'claude-3-sonnet'],
        usage_policy: {
          auto_fallback: true,
          cost_optimization: true,
          quality_preference: 'quality'
        },
        statistics: {
          total_requests: 15420,
          success_rate: 98.7,
          avg_response_time: 2.1,
          cost_per_request: 0.045,
          quality_score: 9.2
        },
        customization: {
          system_prompt: 'Você é um assistente especializado em criar conteúdo dark news...',
          custom_instructions: 'Sempre mantenha o tom dramático e misterioso',
          output_format: 'markdown',
          style_guide: 'Dark News Style Guide v2.1'
        }
      },
      {
        id: 'gpt-3.5-turbo',
        name: 'gpt-3.5-turbo',
        display_name: 'GPT-3.5 Turbo',
        provider_id: 'openai',
        category: 'text',
        capabilities: ['text-generation', 'chat', 'analysis'],
        parameters: {
          temperature: 0.7,
          max_tokens: 2048,
          top_p: 1.0,
          frequency_penalty: 0,
          presence_penalty: 0
        },
        fallback_models: ['claude-3-haiku'],
        usage_policy: {
          auto_fallback: true,
          cost_optimization: true,
          quality_preference: 'cost'
        },
        statistics: {
          total_requests: 28947,
          success_rate: 99.2,
          avg_response_time: 1.3,
          cost_per_request: 0.008,
          quality_score: 8.1
        },
        customization: {
          system_prompt: 'Você é um redator especializado em conteúdo viral...'
        }
      }
    ],
    pricing: {
      input_tokens: 0.01,
      output_tokens: 0.03,
      requests: 0.002,
      currency: 'USD'
    },
    limits: {
      requests_per_minute: 3500,
      requests_per_day: 200000,
      max_tokens: 128000
    },
    usage_stats: {
      requests_today: 247,
      tokens_today: 1847293,
      cost_today: 23.47,
      uptime: 99.8,
      avg_latency: 1.7
    },
    health: {
      last_check: '2024-03-09T14:23:15Z',
      response_time: 1234,
      error_rate: 1.2,
      availability: 99.8
    }
  },
  {
    id: 'anthropic',
    name: 'Anthropic',
    type: 'language_model',
    status: 'active',
    api_endpoint: 'https://api.anthropic.com/v1',
    models: [
      {
        id: 'claude-3-opus',
        name: 'claude-3-opus-20240229',
        display_name: 'Claude 3 Opus',
        provider_id: 'anthropic',
        category: 'text',
        capabilities: ['text-generation', 'analysis', 'reasoning', 'creative-writing'],
        parameters: {
          temperature: 0.7,
          max_tokens: 4096,
          top_p: 1.0,
          frequency_penalty: 0,
          presence_penalty: 0
        },
        fallback_models: ['claude-3-sonnet', 'gpt-4-turbo'],
        usage_policy: {
          auto_fallback: true,
          cost_optimization: false,
          quality_preference: 'quality'
        },
        statistics: {
          total_requests: 8943,
          success_rate: 97.8,
          avg_response_time: 2.8,
          cost_per_request: 0.067,
          quality_score: 9.5
        },
        customization: {
          system_prompt: 'Você é Claude, um assistente IA especializado em narrativas dramáticas...'
        }
      },
      {
        id: 'claude-3-sonnet',
        name: 'claude-3-sonnet-20240229',
        display_name: 'Claude 3 Sonnet',
        provider_id: 'anthropic',
        category: 'text',
        capabilities: ['text-generation', 'analysis', 'chat'],
        parameters: {
          temperature: 0.7,
          max_tokens: 2048,
          top_p: 1.0,
          frequency_penalty: 0,
          presence_penalty: 0
        },
        fallback_models: ['claude-3-haiku', 'gpt-3.5-turbo'],
        usage_policy: {
          auto_fallback: true,
          cost_optimization: true,
          quality_preference: 'quality'
        },
        statistics: {
          total_requests: 12847,
          success_rate: 98.9,
          avg_response_time: 2.1,
          cost_per_request: 0.025,
          quality_score: 8.9
        },
        customization: {}
      }
    ],
    pricing: {
      input_tokens: 0.015,
      output_tokens: 0.075,
      requests: 0.001,
      currency: 'USD'
    },
    limits: {
      requests_per_minute: 1000,
      requests_per_day: 50000,
      max_tokens: 200000
    },
    usage_stats: {
      requests_today: 183,
      tokens_today: 982743,
      cost_today: 31.25,
      uptime: 99.9,
      avg_latency: 2.4
    },
    health: {
      last_check: '2024-03-09T14:23:18Z',
      response_time: 1876,
      error_rate: 0.8,
      availability: 99.9
    }
  },
  {
    id: 'elevenlabs',
    name: 'ElevenLabs',
    type: 'voice_synthesis',
    status: 'active',
    api_endpoint: 'https://api.elevenlabs.io/v1',
    models: [
      {
        id: 'eleven_multilingual_v2',
        name: 'eleven_multilingual_v2',
        display_name: 'Multilingual v2',
        provider_id: 'elevenlabs',
        category: 'voice',
        capabilities: ['voice-synthesis', 'multilingual', 'emotion'],
        parameters: {
          temperature: 0.7,
          max_tokens: 0,
          top_p: 1.0,
          frequency_penalty: 0,
          presence_penalty: 0
        },
        fallback_models: ['eleven_turbo_v2'],
        usage_policy: {
          auto_fallback: true,
          cost_optimization: true,
          quality_preference: 'quality'
        },
        statistics: {
          total_requests: 3247,
          success_rate: 96.4,
          avg_response_time: 4.7,
          cost_per_request: 0.18,
          quality_score: 9.1
        },
        customization: {
          style_guide: 'Dark dramatic narrator voice'
        }
      }
    ],
    pricing: {
      input_tokens: 0,
      output_tokens: 0,
      requests: 0.15,
      currency: 'USD'
    },
    limits: {
      requests_per_minute: 120,
      requests_per_day: 10000,
      max_tokens: 0
    },
    usage_stats: {
      requests_today: 47,
      tokens_today: 0,
      cost_today: 7.05,
      uptime: 98.9,
      avg_latency: 4.2
    },
    health: {
      last_check: '2024-03-09T14:23:20Z',
      response_time: 3847,
      error_rate: 2.1,
      availability: 98.9
    }
  },
  {
    id: 'heygen',
    name: 'HeyGen',
    type: 'video_analysis',
    status: 'active',
    api_endpoint: 'https://api.heygen.com/v1',
    models: [
      {
        id: 'avatar_generation',
        name: 'avatar_generation',
        display_name: 'Avatar Generation',
        provider_id: 'heygen',
        category: 'video',
        capabilities: ['avatar-creation', 'video-generation', 'lip-sync'],
        parameters: {
          temperature: 0.5,
          max_tokens: 0,
          top_p: 1.0,
          frequency_penalty: 0,
          presence_penalty: 0
        },
        fallback_models: [],
        usage_policy: {
          auto_fallback: false,
          cost_optimization: true,
          quality_preference: 'quality'
        },
        statistics: {
          total_requests: 892,
          success_rate: 94.2,
          avg_response_time: 12.4,
          cost_per_request: 2.50,
          quality_score: 8.7
        },
        customization: {
          style_guide: 'Professional news anchor appearance'
        }
      }
    ],
    pricing: {
      input_tokens: 0,
      output_tokens: 0,
      requests: 2.00,
      currency: 'USD'
    },
    limits: {
      requests_per_minute: 10,
      requests_per_day: 500,
      max_tokens: 0
    },
    usage_stats: {
      requests_today: 12,
      tokens_today: 0,
      cost_today: 24.00,
      uptime: 97.5,
      avg_latency: 11.8
    },
    health: {
      last_check: '2024-03-09T14:23:25Z',
      response_time: 11234,
      error_rate: 4.2,
      availability: 97.5
    }
  }
];

const mockTemplates: ModelTemplate[] = [
  {
    id: 'dark_news_script',
    name: 'Script Dark News',
    description: 'Template otimizado para geração de scripts no estilo dark news',
    category: 'Criação de Conteúdo',
    use_case: 'Geração de roteiros dramaticos e envolventes',
    recommended_models: ['gpt-4-turbo', 'claude-3-opus'],
    default_parameters: {
      temperature: 0.8,
      max_tokens: 2048,
      top_p: 0.9
    },
    system_prompt: 'Você é um roteirista especializado em criar conteúdo dark news. Seus scripts devem ser dramáticos, envolventes e cheios de suspense, mantendo sempre a veracidade dos fatos.',
    example_input: 'Escreva um script sobre um caso de desaparecimento misterioso',
    example_output: '[FADE IN] Uma cidade pequena guarda segredos sombrios... [DRAMATIC PAUSE]',
    performance_metrics: {
      accuracy: 94.2,
      speed: 88.7,
      cost_efficiency: 76.3
    },
    usage_count: 1847,
    rating: 4.8
  },
  {
    id: 'seo_optimization',
    name: 'Otimização SEO',
    description: 'Template para otimização de títulos e descrições',
    category: 'Marketing',
    use_case: 'Criação de títulos e descrições otimizados para SEO',
    recommended_models: ['gpt-3.5-turbo', 'claude-3-sonnet'],
    default_parameters: {
      temperature: 0.6,
      max_tokens: 512,
      top_p: 0.8
    },
    system_prompt: 'Você é um especialista em SEO que cria títulos e descrições irresistíveis para vídeos dark news, maximizando CTR e engagement.',
    example_input: 'Otimize o título: "Caso misterioso na cidade"',
    example_output: '🔍 MISTÉRIO REAL: O Caso Que Aterrorizou Uma Cidade Inteira | Investigação Completa',
    performance_metrics: {
      accuracy: 91.5,
      speed: 95.2,
      cost_efficiency: 89.1
    },
    usage_count: 3247,
    rating: 4.6
  },
  {
    id: 'voice_narration',
    name: 'Narração Dramática',
    description: 'Template para síntese de voz com tom dramático',
    category: 'Produção de Áudio',
    use_case: 'Criação de narrações envolventes e dramáticas',
    recommended_models: ['eleven_multilingual_v2'],
    default_parameters: {
      temperature: 0.7,
      max_tokens: 0,
      top_p: 1.0
    },
    system_prompt: 'Configure a voz para um tom grave, pausas dramáticas e ênfase em palavras-chave para maximizar o impacto emocional.',
    example_input: 'Narre o texto sobre um mistério urbano',
    example_output: '[Audio sample with dramatic pauses and emphasis]',
    performance_metrics: {
      accuracy: 96.8,
      speed: 82.3,
      cost_efficiency: 71.4
    },
    usage_count: 892,
    rating: 4.9
  }
];

const mockAnalytics: UsageAnalytics = {
  period: 'today',
  total_requests: 489,
  total_tokens: 2830036,
  total_cost: 85.77,
  by_provider: [
    { provider: 'OpenAI', requests: 247, tokens: 1847293, cost: 23.47, percentage: 50.5 },
    { provider: 'Anthropic', requests: 183, tokens: 982743, cost: 31.25, percentage: 37.4 },
    { provider: 'ElevenLabs', requests: 47, tokens: 0, cost: 7.05, percentage: 9.6 },
    { provider: 'HeyGen', requests: 12, tokens: 0, cost: 24.00, percentage: 2.5 }
  ],
  by_model: [
    { model: 'GPT-4 Turbo', requests: 124, avg_latency: 2.1, success_rate: 98.7, cost: 15.80 },
    { model: 'GPT-3.5 Turbo', requests: 123, avg_latency: 1.3, success_rate: 99.2, cost: 7.67 },
    { model: 'Claude 3 Sonnet', requests: 98, avg_latency: 2.1, success_rate: 98.9, cost: 18.45 },
    { model: 'Claude 3 Opus', requests: 85, avg_latency: 2.8, success_rate: 97.8, cost: 12.80 }
  ],
  performance_trends: {
    response_times: [1.8, 2.1, 1.9, 2.3, 2.0, 1.7, 2.1],
    success_rates: [98.5, 99.1, 97.8, 98.9, 99.2, 98.7, 98.3],
    costs: [78.23, 82.15, 79.87, 85.77, 83.24, 81.45, 85.77]
  },
  cost_optimization: {
    potential_savings: 12.34,
    recommendations: [
      'Use GPT-3.5 Turbo para tarefas simples (economia de 65%)',
      'Implemente cache para requisições similares',
      'Configure fallbacks automáticos para reduzir custos'
    ]
  }
};

export default function AIModelsManager() {
  const [selectedTab, setSelectedTab] = useState('overview');
  const [providerFilter, setProviderFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showProviderDialog, setShowProviderDialog] = useState(false);
  const [showModelDialog, setShowModelDialog] = useState(false);
  const [showTemplateDialog, setShowTemplateDialog] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const { toast } = useToast();

  const getProviderStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-500 bg-green-100 dark:bg-green-950';
      case 'inactive': return 'text-gray-500 bg-gray-100 dark:bg-gray-950';
      case 'error': return 'text-red-500 bg-red-100 dark:bg-red-950';
      case 'maintenance': return 'text-yellow-500 bg-yellow-100 dark:bg-yellow-950';
      default: return 'text-gray-500 bg-gray-100 dark:bg-gray-950';
    }
  };

  const getProviderIcon = (type: string) => {
    switch (type) {
      case 'language_model': return <MessageSquare className="h-5 w-5" />;
      case 'voice_synthesis': return <Mic className="h-5 w-5" />;
      case 'image_generation': return <Image className="h-5 w-5" />;
      case 'video_analysis': return <Video className="h-5 w-5" />;
      default: return <Brain className="h-5 w-5" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const handleTestProvider = (providerId: string) => {
    toast({
      title: "Teste de conectividade",
      description: `Testando conexão com ${providerId}...`
    });
  };

  const handleUpdateModel = (modelId: string) => {
    toast({
      title: "Modelo atualizado",
      description: "Configurações do modelo foram salvas com sucesso"
    });
  };

  const handleUseTemplate = (templateId: string) => {
    toast({
      title: "Template aplicado",
      description: "Configurações do template foram aplicadas ao modelo"
    });
    setShowTemplateDialog(false);
  };

  const filteredProviders = mockProviders.filter(provider => {
    let matches = true;
    
    if (providerFilter !== 'all' && provider.status !== providerFilter) matches = false;
    if (searchTerm && !provider.name.toLowerCase().includes(searchTerm.toLowerCase())) matches = false;
    
    return matches;
  });

  const totalCostToday = mockProviders.reduce((sum, provider) => sum + provider.usage_stats.cost_today, 0);
  const totalRequestsToday = mockProviders.reduce((sum, provider) => sum + provider.usage_stats.requests_today, 0);
  const avgLatency = mockProviders.reduce((sum, provider) => sum + provider.usage_stats.avg_latency, 0) / mockProviders.length;
  const avgUptime = mockProviders.reduce((sum, provider) => sum + provider.usage_stats.uptime, 0) / mockProviders.length;

  return (
    <div className="container mx-auto px-6 py-8 max-w-7xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Gerenciador de Modelos de IA</h1>
              <p className="text-muted-foreground">Gestão completa de provedores, modelos e configurações de IA</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Dialog open={showTemplateDialog} onOpenChange={setShowTemplateDialog}>
              <DialogTrigger asChild>
                <Button variant="outline" data-testid="button-browse-templates">
                  <Layers className="h-4 w-4 mr-2" />
                  Templates
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl">
                <DialogHeader>
                  <DialogTitle>Templates de Modelos</DialogTitle>
                  <DialogDescription>
                    Escolha um template otimizado para aplicar configurações pré-definidas
                  </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                  {mockTemplates.map((template) => (
                    <Card key={template.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-semibold text-sm">{template.name}</h3>
                              <p className="text-xs text-muted-foreground">{template.category}</p>
                            </div>
                            <div className="flex items-center space-x-1">
                              <span className="text-xs">⭐ {template.rating}</span>
                            </div>
                          </div>
                          
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {template.description}
                          </p>
                          
                          <div className="text-xs text-muted-foreground">
                            <span>Usado {template.usage_count} vezes</span>
                          </div>
                          
                          <div className="grid grid-cols-3 gap-2 text-xs">
                            <div className="text-center">
                              <div className="font-medium">{template.performance_metrics.accuracy}%</div>
                              <div className="text-muted-foreground">Precisão</div>
                            </div>
                            <div className="text-center">
                              <div className="font-medium">{template.performance_metrics.speed}%</div>
                              <div className="text-muted-foreground">Velocidade</div>
                            </div>
                            <div className="text-center">
                              <div className="font-medium">{template.performance_metrics.cost_efficiency}%</div>
                              <div className="text-muted-foreground">Custo</div>
                            </div>
                          </div>
                          
                          <Button 
                            size="sm" 
                            className="w-full"
                            onClick={() => handleUseTemplate(template.id)}
                            data-testid={`button-use-template-${template.id}`}
                          >
                            Usar Template
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
            
            <Dialog open={showProviderDialog} onOpenChange={setShowProviderDialog}>
              <DialogTrigger asChild>
                <Button data-testid="button-add-provider">
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Provedor
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Adicionar Provedor de IA</DialogTitle>
                  <DialogDescription>
                    Configure um novo provedor de serviços de IA
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="provider-name">Nome do Provedor</Label>
                      <Input id="provider-name" placeholder="Ex: OpenAI" data-testid="input-provider-name" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="provider-type">Tipo</Label>
                      <Select>
                        <SelectTrigger data-testid="select-provider-type">
                          <SelectValue placeholder="Tipo de serviço" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="language_model">Modelo de Linguagem</SelectItem>
                          <SelectItem value="voice_synthesis">Síntese de Voz</SelectItem>
                          <SelectItem value="image_generation">Geração de Imagens</SelectItem>
                          <SelectItem value="video_analysis">Análise de Vídeo</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="api-endpoint">Endpoint da API</Label>
                    <Input 
                      id="api-endpoint" 
                      placeholder="https://api.exemplo.com/v1" 
                      data-testid="input-api-endpoint" 
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="api-key">Chave da API</Label>
                    <Input 
                      id="api-key" 
                      type="password" 
                      placeholder="sk-..." 
                      data-testid="input-api-key" 
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="rate-limit">Limite por Minuto</Label>
                      <Input 
                        id="rate-limit" 
                        type="number" 
                        placeholder="1000" 
                        data-testid="input-rate-limit" 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="daily-limit">Limite Diário</Label>
                      <Input 
                        id="daily-limit" 
                        type="number" 
                        placeholder="50000" 
                        data-testid="input-daily-limit" 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cost-per-token">Custo por Token</Label>
                      <Input 
                        id="cost-per-token" 
                        type="number" 
                        step="0.001" 
                        placeholder="0.015" 
                        data-testid="input-cost-per-token" 
                      />
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button className="flex-1" data-testid="button-test-connection">
                      <Link2 className="h-4 w-4 mr-2" />
                      Testar Conexão
                    </Button>
                    <Button className="flex-1" data-testid="button-save-provider">
                      <Save className="h-4 w-4 mr-2" />
                      Salvar Provedor
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Provedores Ativos</p>
                  <p className="text-2xl font-bold">{mockProviders.filter(p => p.status === 'active').length}</p>
                  <p className="text-xs text-green-500 flex items-center mt-1">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    {mockProviders.length} total
                  </p>
                </div>
                <Server className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Requisições Hoje</p>
                  <p className="text-2xl font-bold">{totalRequestsToday.toLocaleString()}</p>
                  <p className="text-xs text-blue-500 flex items-center mt-1">
                    <Activity className="h-3 w-3 mr-1" />
                    {avgUptime.toFixed(1)}% uptime
                  </p>
                </div>
                <BarChart3 className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Custo Hoje</p>
                  <p className="text-2xl font-bold">{formatCurrency(totalCostToday)}</p>
                  <p className="text-xs text-orange-500 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +12% vs ontem
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Latência Média</p>
                  <p className="text-2xl font-bold">{avgLatency.toFixed(1)}s</p>
                  <p className="text-xs text-green-500 flex items-center mt-1">
                    <Clock className="h-3 w-3 mr-1" />
                    Otimizada
                  </p>
                </div>
                <Zap className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="providers">Provedores</TabsTrigger>
            <TabsTrigger value="models">Modelos</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="optimization">Otimização</TabsTrigger>
          </TabsList>

          {/* Overview */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Health Status */}
              <Card>
                <CardHeader>
                  <CardTitle>Status de Saúde dos Provedores</CardTitle>
                  <CardDescription>Monitoramento em tempo real</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockProviders.map((provider) => (
                      <div key={provider.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          {getProviderIcon(provider.type)}
                          <div>
                            <div className="font-medium">{provider.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {provider.health.availability}% uptime • {provider.health.response_time}ms
                            </div>
                          </div>
                        </div>
                        <Badge className={getProviderStatusColor(provider.status)}>
                          {provider.status === 'active' ? 'Ativo' :
                           provider.status === 'inactive' ? 'Inativo' :
                           provider.status === 'error' ? 'Erro' : 'Manutenção'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Cost Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle>Distribuição de Custos</CardTitle>
                  <CardDescription>Custos por provedor hoje</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {mockAnalytics.by_provider.map((item, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>{item.provider}</span>
                          <span className="font-medium">{formatCurrency(item.cost)}</span>
                        </div>
                        <Progress value={item.percentage} className="h-2" />
                        <div className="text-xs text-muted-foreground">
                          {item.requests} requisições • {item.percentage.toFixed(1)}% do total
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Performance Trends */}
            <Card>
              <CardHeader>
                <CardTitle>Tendências de Performance</CardTitle>
                <CardDescription>Métricas dos últimos 7 dias</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold">2.1s</div>
                    <div className="text-sm text-muted-foreground">Tempo de Resposta Médio</div>
                    <div className="text-xs text-green-500 flex items-center justify-center mt-1">
                      <TrendingDown className="h-3 w-3 mr-1" />
                      -8% melhoria
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">98.3%</div>
                    <div className="text-sm text-muted-foreground">Taxa de Sucesso</div>
                    <div className="text-xs text-green-500 flex items-center justify-center mt-1">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      +1.2% melhoria
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{formatCurrency(mockAnalytics.cost_optimization.potential_savings)}</div>
                    <div className="text-sm text-muted-foreground">Economia Potencial</div>
                    <div className="text-xs text-blue-500 flex items-center justify-center mt-1">
                      <Target className="h-3 w-3 mr-1" />
                      Otimização disponível
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Providers */}
          <TabsContent value="providers" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Provedores de IA</h3>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar provedores..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                    data-testid="input-search-providers"
                  />
                </div>
                
                <Select value={providerFilter} onValueChange={setProviderFilter}>
                  <SelectTrigger className="w-40" data-testid="select-provider-filter">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="active">Ativo</SelectItem>
                    <SelectItem value="inactive">Inativo</SelectItem>
                    <SelectItem value="error">Erro</SelectItem>
                    <SelectItem value="maintenance">Manutenção</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              {filteredProviders.map((provider) => (
                <Card key={provider.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {/* Header do provedor */}
                      <div className="flex items-start justify-between">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                              {getProviderIcon(provider.type)}
                            </div>
                            <div>
                              <div className="flex items-center space-x-2">
                                <h3 className="font-semibold">{provider.name}</h3>
                                <Badge className={getProviderStatusColor(provider.status)}>
                                  {provider.status === 'active' ? 'Ativo' :
                                   provider.status === 'inactive' ? 'Inativo' :
                                   provider.status === 'error' ? 'Erro' : 'Manutenção'}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {provider.type.replace('_', ' ')} • {provider.models.length} modelos
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleTestProvider(provider.id)}
                            data-testid={`button-test-${provider.id}`}
                          >
                            <Link2 className="h-3 w-3 mr-1" />
                            Testar
                          </Button>
                          <Button size="sm" variant="outline" data-testid={`button-configure-${provider.id}`}>
                            <Settings className="h-3 w-3 mr-1" />
                            Configurar
                          </Button>
                          <Button size="sm" variant="outline" data-testid={`button-edit-provider-${provider.id}`}>
                            <Edit className="h-3 w-3 mr-1" />
                            Editar
                          </Button>
                        </div>
                      </div>

                      {/* Métricas de uso */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-muted/50 rounded-lg">
                        <div className="text-center">
                          <div className="text-lg font-bold">{provider.usage_stats.requests_today}</div>
                          <div className="text-xs text-muted-foreground">Requisições Hoje</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold">{formatCurrency(provider.usage_stats.cost_today)}</div>
                          <div className="text-xs text-muted-foreground">Custo Hoje</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold">{provider.usage_stats.avg_latency}s</div>
                          <div className="text-xs text-muted-foreground">Latência Média</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold">{provider.usage_stats.uptime}%</div>
                          <div className="text-xs text-muted-foreground">Uptime</div>
                        </div>
                      </div>

                      {/* Configuração de limites */}
                      <div className="space-y-3">
                        <h4 className="text-sm font-medium">Limites e Custos:</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Por minuto:</span>
                            <span className="ml-2 font-medium">{provider.limits.requests_per_minute.toLocaleString()}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Por dia:</span>
                            <span className="ml-2 font-medium">{provider.limits.requests_per_day.toLocaleString()}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Custo por token:</span>
                            <span className="ml-2 font-medium">${provider.pricing.input_tokens}</span>
                          </div>
                        </div>
                      </div>

                      {/* Lista de modelos */}
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Modelos Disponíveis ({provider.models.length}):</h4>
                        <div className="flex flex-wrap gap-2">
                          {provider.models.slice(0, 3).map((model) => (
                            <Badge key={model.id} variant="outline" className="text-xs">
                              {model.display_name}
                            </Badge>
                          ))}
                          {provider.models.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{provider.models.length - 3} mais
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Status de saúde */}
                      <div className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Status de Saúde</span>
                          <span className="text-xs text-muted-foreground">
                            Última verificação: {new Date(provider.health.last_check).toLocaleTimeString()}
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-xs">
                          <div>
                            <div className="font-medium">{provider.health.availability}%</div>
                            <div className="text-muted-foreground">Disponibilidade</div>
                          </div>
                          <div>
                            <div className="font-medium">{provider.health.response_time}ms</div>
                            <div className="text-muted-foreground">Tempo Resposta</div>
                          </div>
                          <div>
                            <div className="font-medium">{provider.health.error_rate}%</div>
                            <div className="text-muted-foreground">Taxa de Erro</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Models */}
          <TabsContent value="models" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Configuração de Modelos</h3>
              <Button variant="outline" data-testid="button-import-config">
                <Upload className="h-4 w-4 mr-2" />
                Importar Configuração
              </Button>
            </div>

            <div className="space-y-4">
              {mockProviders.flatMap(provider => 
                provider.models.map(model => (
                  <Card key={model.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        {/* Header do modelo */}
                        <div className="flex items-start justify-between">
                          <div className="space-y-2 flex-1">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center">
                                {getProviderIcon(provider.type)}
                              </div>
                              <div>
                                <h3 className="font-semibold">{model.display_name}</h3>
                                <p className="text-sm text-muted-foreground">
                                  {provider.name} • {model.category}
                                </p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleUpdateModel(model.id)}
                              data-testid={`button-update-${model.id}`}
                            >
                              <Save className="h-3 w-3 mr-1" />
                              Salvar
                            </Button>
                            <Button size="sm" variant="outline" data-testid={`button-test-model-${model.id}`}>
                              <Play className="h-3 w-3 mr-1" />
                              Testar
                            </Button>
                          </div>
                        </div>

                        {/* Estatísticas do modelo */}
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 bg-muted/50 rounded-lg">
                          <div className="text-center">
                            <div className="text-lg font-bold">{model.statistics.total_requests.toLocaleString()}</div>
                            <div className="text-xs text-muted-foreground">Total Requisições</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold">{model.statistics.success_rate}%</div>
                            <div className="text-xs text-muted-foreground">Taxa Sucesso</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold">{model.statistics.avg_response_time}s</div>
                            <div className="text-xs text-muted-foreground">Tempo Médio</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold">{formatCurrency(model.statistics.cost_per_request)}</div>
                            <div className="text-xs text-muted-foreground">Custo/Req</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold">{model.statistics.quality_score}/10</div>
                            <div className="text-xs text-muted-foreground">Qualidade</div>
                          </div>
                        </div>

                        {/* Configuração de parâmetros */}
                        <div className="space-y-4">
                          <h4 className="text-sm font-medium">Parâmetros do Modelo:</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <Label>Temperature: {model.parameters.temperature}</Label>
                                <Slider
                                  value={[model.parameters.temperature]}
                                  max={2}
                                  min={0}
                                  step={0.1}
                                  className="w-full"
                                  data-testid={`slider-temperature-${model.id}`}
                                />
                              </div>
                              
                              <div className="space-y-2">
                                <Label>Top P: {model.parameters.top_p}</Label>
                                <Slider
                                  value={[model.parameters.top_p]}
                                  max={1}
                                  min={0}
                                  step={0.1}
                                  className="w-full"
                                  data-testid={`slider-top-p-${model.id}`}
                                />
                              </div>
                              
                              <div className="space-y-2">
                                <Label htmlFor={`max-tokens-${model.id}`}>Max Tokens</Label>
                                <Input
                                  id={`max-tokens-${model.id}`}
                                  type="number"
                                  value={model.parameters.max_tokens}
                                  data-testid={`input-max-tokens-${model.id}`}
                                />
                              </div>
                            </div>
                            
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <Label>Frequency Penalty: {model.parameters.frequency_penalty}</Label>
                                <Slider
                                  value={[model.parameters.frequency_penalty]}
                                  max={2}
                                  min={-2}
                                  step={0.1}
                                  className="w-full"
                                  data-testid={`slider-frequency-penalty-${model.id}`}
                                />
                              </div>
                              
                              <div className="space-y-2">
                                <Label>Presence Penalty: {model.parameters.presence_penalty}</Label>
                                <Slider
                                  value={[model.parameters.presence_penalty]}
                                  max={2}
                                  min={-2}
                                  step={0.1}
                                  className="w-full"
                                  data-testid={`slider-presence-penalty-${model.id}`}
                                />
                              </div>
                              
                              <div className="space-y-2">
                                <Label htmlFor={`stop-sequences-${model.id}`}>Stop Sequences</Label>
                                <Input
                                  id={`stop-sequences-${model.id}`}
                                  placeholder="Separado por vírgulas"
                                  data-testid={`input-stop-sequences-${model.id}`}
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Política de uso */}
                        <div className="space-y-3">
                          <h4 className="text-sm font-medium">Política de Uso:</h4>
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <Label htmlFor={`auto-fallback-${model.id}`}>Fallback Automático</Label>
                              <Switch 
                                id={`auto-fallback-${model.id}`}
                                checked={model.usage_policy.auto_fallback}
                                data-testid={`switch-auto-fallback-${model.id}`}
                              />
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <Label htmlFor={`cost-optimization-${model.id}`}>Otimização de Custos</Label>
                              <Switch 
                                id={`cost-optimization-${model.id}`}
                                checked={model.usage_policy.cost_optimization}
                                data-testid={`switch-cost-optimization-${model.id}`}
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label>Preferência de Qualidade</Label>
                              <Select value={model.usage_policy.quality_preference}>
                                <SelectTrigger data-testid={`select-quality-preference-${model.id}`}>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="speed">Velocidade</SelectItem>
                                  <SelectItem value="quality">Qualidade</SelectItem>
                                  <SelectItem value="cost">Custo</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>

                        {/* Modelos de fallback */}
                        {model.fallback_models.length > 0 && (
                          <div className="space-y-2">
                            <h4 className="text-sm font-medium">Modelos de Fallback:</h4>
                            <div className="flex flex-wrap gap-2">
                              {model.fallback_models.map((fallbackId, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {fallbackId}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Customização */}
                        {model.customization.system_prompt && (
                          <div className="space-y-2">
                            <Label htmlFor={`system-prompt-${model.id}`}>System Prompt</Label>
                            <Textarea
                              id={`system-prompt-${model.id}`}
                              value={model.customization.system_prompt}
                              rows={3}
                              data-testid={`textarea-system-prompt-${model.id}`}
                            />
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* Analytics */}
          <TabsContent value="analytics" className="space-y-6">
            <h3 className="text-lg font-semibold">Analytics de Uso</h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Usage by Provider */}
              <Card>
                <CardHeader>
                  <CardTitle>Uso por Provedor</CardTitle>
                  <CardDescription>Distribuição de requisições hoje</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockAnalytics.by_provider.map((item, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>{item.provider}</span>
                          <div className="text-right">
                            <div className="font-medium">{item.requests} req</div>
                            <div className="text-xs text-muted-foreground">{formatCurrency(item.cost)}</div>
                          </div>
                        </div>
                        <Progress value={item.percentage} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Model Performance */}
              <Card>
                <CardHeader>
                  <CardTitle>Performance por Modelo</CardTitle>
                  <CardDescription>Métricas de desempenho</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {mockAnalytics.by_model.map((item, index) => (
                      <div key={index} className="p-3 border rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <div className="font-medium text-sm">{item.model}</div>
                          <div className="text-xs text-muted-foreground">{item.requests} req</div>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div>
                            <div className="font-medium">{item.success_rate}%</div>
                            <div className="text-muted-foreground">Sucesso</div>
                          </div>
                          <div>
                            <div className="font-medium">{item.avg_latency}s</div>
                            <div className="text-muted-foreground">Latência</div>
                          </div>
                          <div>
                            <div className="font-medium">{formatCurrency(item.cost)}</div>
                            <div className="text-muted-foreground">Custo</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Cost Trends */}
            <Card>
              <CardHeader>
                <CardTitle>Tendências de Custo</CardTitle>
                <CardDescription>Evolução dos gastos nos últimos 7 dias</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
                  <div>
                    <div className="text-2xl font-bold">{formatCurrency(mockAnalytics.total_cost)}</div>
                    <div className="text-sm text-muted-foreground">Total Hoje</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{mockAnalytics.total_requests.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">Requisições</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{(mockAnalytics.total_tokens / 1000000).toFixed(1)}M</div>
                    <div className="text-sm text-muted-foreground">Tokens</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{formatCurrency(mockAnalytics.total_cost / mockAnalytics.total_requests)}</div>
                    <div className="text-sm text-muted-foreground">Custo/Req</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Optimization */}
          <TabsContent value="optimization" className="space-y-6">
            <h3 className="text-lg font-semibold">Otimização de Custos</h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Cost Optimization */}
              <Card>
                <CardHeader>
                  <CardTitle>Recomendações de Economia</CardTitle>
                  <CardDescription>
                    Economia potencial: {formatCurrency(mockAnalytics.cost_optimization.potential_savings)}/dia
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockAnalytics.cost_optimization.recommendations.map((recommendation, index) => (
                      <div key={index} className="p-3 border rounded-lg">
                        <div className="flex items-start space-x-3">
                          <div className="w-6 h-6 bg-blue-100 dark:bg-blue-950 rounded-full flex items-center justify-center text-xs font-bold">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm">{recommendation}</p>
                          </div>
                          <Button size="sm" variant="outline">
                            Aplicar
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Model Efficiency */}
              <Card>
                <CardHeader>
                  <CardTitle>Eficiência dos Modelos</CardTitle>
                  <CardDescription>Análise custo-benefício por modelo</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {mockAnalytics.by_model.map((model, index) => (
                      <div key={index} className="p-3 border rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium text-sm">{model.model}</span>
                          <Badge variant="outline" className="text-xs">
                            {((model.success_rate + (100 - model.avg_latency * 10)) / 2).toFixed(0)}% eficiência
                          </Badge>
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span>Custo-benefício</span>
                            <span>{(model.success_rate / model.cost * 100).toFixed(0)}%</span>
                          </div>
                          <Progress value={(model.success_rate / model.cost * 100)} className="h-1" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Configuration Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle>Recomendações de Configuração</CardTitle>
                <CardDescription>Otimizações automáticas disponíveis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg bg-green-50 dark:bg-green-950">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <span className="font-medium">Fallback Automático</span>
                      </div>
                      <Button size="sm" variant="outline">Configurar</Button>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Configure fallbacks automáticos para reduzir custos em 25% durante picos de uso
                    </p>
                  </div>

                  <div className="p-4 border rounded-lg bg-blue-50 dark:bg-blue-950">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Info className="h-5 w-5 text-blue-500" />
                        <span className="font-medium">Cache Inteligente</span>
                      </div>
                      <Button size="sm" variant="outline">Ativar</Button>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Ative cache para requisições similares e economize até 40% em custos de API
                    </p>
                  </div>

                  <div className="p-4 border rounded-lg bg-orange-50 dark:bg-orange-950">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className="h-5 w-5 text-orange-500" />
                        <span className="font-medium">Monitoramento de Limites</span>
                      </div>
                      <Button size="sm" variant="outline">Configurar</Button>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Configure alertas para evitar exceder limites de rate e custos inesperados
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}