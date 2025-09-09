import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { 
  Zap, 
  Play, 
  Pause, 
  Settings,
  Clock,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  XCircle,
  ArrowRight,
  Calendar,
  Timer,
  Users,
  Target,
  TrendingUp,
  BarChart3,
  Plus,
  Edit,
  Trash2,
  Copy,
  Eye,
  Save,
  Upload,
  Download
} from 'lucide-react';

interface Pipeline {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'paused' | 'draft' | 'error';
  trigger: {
    type: 'schedule' | 'event' | 'manual';
    value: string;
    frequency?: string;
  };
  steps: PipelineStep[];
  lastRun?: string;
  nextRun?: string;
  successRate: number;
  totalRuns: number;
  avgDuration: number;
}

interface PipelineStep {
  id: string;
  type: 'news_fetch' | 'content_filter' | 'script_generation' | 'voice_synthesis' | 'video_creation' | 'publishing' | 'analytics';
  name: string;
  description: string;
  config: Record<string, any>;
  status: 'pending' | 'running' | 'completed' | 'failed';
  duration?: number;
}

const mockPipelines: Pipeline[] = [
  {
    id: '1',
    name: 'Pipeline Completo - Notícias Crimes',
    description: 'Processo automatizado completo: busca notícias → script → voz → vídeo → publicação',
    status: 'active',
    trigger: {
      type: 'schedule',
      value: '06:00',
      frequency: 'daily'
    },
    steps: [
      {
        id: 'step1',
        type: 'news_fetch',
        name: 'Buscar Notícias',
        description: 'Coleta notícias sobre crimes e mistérios',
        config: { sources: ['newsapi', 'newsdata'], categories: ['crime', 'mystery'] },
        status: 'completed',
        duration: 45
      },
      {
        id: 'step2',
        type: 'content_filter',
        name: 'Filtrar Conteúdo',
        description: 'Seleciona as melhores notícias por potencial viral',
        config: { minScore: 7.5, maxArticles: 3 },
        status: 'completed',
        duration: 30
      },
      {
        id: 'step3',
        type: 'script_generation',
        name: 'Gerar Script',
        description: 'Cria script no estilo dark news',
        config: { style: 'dark_mystery', duration: '5-7min' },
        status: 'running',
        duration: 120
      },
      {
        id: 'step4',
        type: 'voice_synthesis',
        name: 'Síntese de Voz',
        description: 'Gera narração com voz IA',
        config: { voice: 'narrator_male_deep', language: 'pt-BR' },
        status: 'pending'
      },
      {
        id: 'step5',
        type: 'video_creation',
        name: 'Criar Vídeo',
        description: 'Produz vídeo final com avatar',
        config: { avatar: 'reporter_serious', background: 'newsroom' },
        status: 'pending'
      },
      {
        id: 'step6',
        type: 'publishing',
        name: 'Publicar',
        description: 'Publica nos canais configurados',
        config: { channels: ['youtube_main', 'youtube_clips'], schedule: 'immediate' },
        status: 'pending'
      }
    ],
    lastRun: '2024-03-09 06:00',
    nextRun: '2024-03-10 06:00',
    successRate: 92,
    totalRuns: 45,
    avgDuration: 8.5
  },
  {
    id: '2',
    name: 'Pipeline Rápido - Trending Topics',
    description: 'Processo acelerado para assuntos em alta',
    status: 'active',
    trigger: {
      type: 'event',
      value: 'trending_alert',
      frequency: 'on_trigger'
    },
    steps: [
      {
        id: 'step1',
        type: 'news_fetch',
        name: 'Capturar Trending',
        description: 'Monitora trending topics relevantes',
        config: { sources: ['google_trends', 'twitter_api'], threshold: 8.0 },
        status: 'completed',
        duration: 15
      },
      {
        id: 'step2',
        type: 'script_generation',
        name: 'Script Rápido',
        description: 'Gera script otimizado para velocidade',
        config: { style: 'breaking_news', duration: '2-3min' },
        status: 'completed',
        duration: 60
      },
      {
        id: 'step3',
        type: 'video_creation',
        name: 'Vídeo Express',
        description: 'Produção acelerada',
        config: { avatar: 'reporter_urgent', quality: 'fast' },
        status: 'running',
        duration: 180
      }
    ],
    lastRun: '2024-03-09 14:23',
    nextRun: 'Em espera de evento',
    successRate: 85,
    totalRuns: 12,
    avgDuration: 4.2
  },
  {
    id: '3',
    name: 'Pipeline Multilíngue - Expansão Global',
    description: 'Traduz e adapta conteúdo para múltiplos idiomas',
    status: 'paused',
    trigger: {
      type: 'manual',
      value: 'on_demand',
      frequency: 'manual'
    },
    steps: [
      {
        id: 'step1',
        type: 'content_filter',
        name: 'Selecionar Conteúdo',
        description: 'Escolhe vídeos de melhor performance',
        config: { minViews: 50000, timeframe: '24h' },
        status: 'pending'
      },
      {
        id: 'step2',
        type: 'script_generation',
        name: 'Traduzir Script',
        description: 'Adapta scripts para outros idiomas',
        config: { languages: ['en', 'es', 'fr'], cultural_adaptation: true },
        status: 'pending'
      },
      {
        id: 'step3',
        type: 'voice_synthesis',
        name: 'Dublar Idiomas',
        description: 'Gera vozes em múltiplos idiomas',
        config: { preserve_emotion: true, sync_timing: true },
        status: 'pending'
      }
    ],
    lastRun: '2024-03-05 16:00',
    nextRun: 'Manual',
    successRate: 78,
    totalRuns: 8,
    avgDuration: 12.0
  }
];

const stepTypeIcons = {
  news_fetch: <Download className="h-4 w-4" />,
  content_filter: <Target className="h-4 w-4" />,
  script_generation: <Edit className="h-4 w-4" />,
  voice_synthesis: <Users className="h-4 w-4" />,
  video_creation: <Play className="h-4 w-4" />,
  publishing: <Upload className="h-4 w-4" />,
  analytics: <BarChart3 className="h-4 w-4" />
};

export default function AutomationPipelines() {
  const [selectedPipeline, setSelectedPipeline] = useState<string | null>(null);
  const [newPipelineName, setNewPipelineName] = useState('');
  const [newPipelineDesc, setNewPipelineDesc] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes}min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}min`;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Play className="h-4 w-4 text-green-500" />;
      case 'paused': return <Pause className="h-4 w-4 text-yellow-500" />;
      case 'error': return <XCircle className="h-4 w-4 text-red-500" />;
      default: return <Settings className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStepStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'running': return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />;
      case 'failed': return <XCircle className="h-4 w-4 text-red-500" />;
      default: return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const runPipeline = async (pipelineId: string) => {
    try {
      toast({
        title: "Pipeline iniciado",
        description: "O pipeline foi executado manualmente"
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao executar pipeline",
        variant: "destructive"
      });
    }
  };

  const pausePipeline = async (pipelineId: string) => {
    try {
      toast({
        title: "Pipeline pausado",
        description: "O pipeline foi pausado com sucesso"
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao pausar pipeline",
        variant: "destructive"
      });
    }
  };

  const createPipeline = async () => {
    if (!newPipelineName) {
      toast({
        title: "Erro",
        description: "Nome do pipeline é obrigatório",
        variant: "destructive"
      });
      return;
    }

    setIsCreating(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Pipeline criado!",
        description: `Pipeline "${newPipelineName}" foi criado com sucesso`
      });
      
      setNewPipelineName('');
      setNewPipelineDesc('');
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao criar pipeline",
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="container mx-auto px-6 py-8 max-w-7xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Pipelines Automáticos</h1>
              <p className="text-muted-foreground">Configure fluxos automatizados de produção</p>
            </div>
          </div>
          
          <Button data-testid="button-new-pipeline">
            <Plus className="h-4 w-4 mr-2" />
            Novo Pipeline
          </Button>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pipelines Ativos</p>
                  <p className="text-2xl font-bold">3</p>
                  <p className="text-xs text-green-500 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    2 executados hoje
                  </p>
                </div>
                <Play className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Taxa de Sucesso</p>
                  <p className="text-2xl font-bold">87%</p>
                  <p className="text-xs text-green-500 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +5% esta semana
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Tempo Médio</p>
                  <p className="text-2xl font-bold">8.2min</p>
                  <p className="text-xs text-green-500 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    15% mais rápido
                  </p>
                </div>
                <Clock className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Execuções Hoje</p>
                  <p className="text-2xl font-bold">12</p>
                  <p className="text-xs text-blue-500 flex items-center mt-1">
                    <RefreshCw className="h-3 w-3 mr-1" />
                    3 em andamento
                  </p>
                </div>
                <Zap className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="active" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="active">Pipelines Ativos</TabsTrigger>
            <TabsTrigger value="create">Criar Pipeline</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="monitoring">Monitoramento</TabsTrigger>
          </TabsList>

          {/* Pipelines Ativos */}
          <TabsContent value="active" className="space-y-6">
            <div className="space-y-4">
              {mockPipelines.map((pipeline) => (
                <Card key={pipeline.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {/* Header do pipeline */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(pipeline.status)}
                            <h3 className="font-semibold">{pipeline.name}</h3>
                          </div>
                          <Badge variant={
                            pipeline.status === 'active' ? 'default' : 
                            pipeline.status === 'paused' ? 'secondary' : 
                            pipeline.status === 'error' ? 'destructive' : 'outline'
                          }>
                            {pipeline.status === 'active' ? 'Ativo' : 
                             pipeline.status === 'paused' ? 'Pausado' :
                             pipeline.status === 'error' ? 'Erro' : 'Rascunho'}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Button size="sm" variant="outline" onClick={() => runPipeline(pipeline.id)} data-testid={`button-run-${pipeline.id}`}>
                            <Play className="h-3 w-3 mr-1" />
                            Executar
                          </Button>
                          {pipeline.status === 'active' && (
                            <Button size="sm" variant="outline" onClick={() => pausePipeline(pipeline.id)} data-testid={`button-pause-${pipeline.id}`}>
                              <Pause className="h-3 w-3 mr-1" />
                              Pausar
                            </Button>
                          )}
                          <Button size="sm" variant="outline" data-testid={`button-edit-${pipeline.id}`}>
                            <Edit className="h-3 w-3 mr-1" />
                            Editar
                          </Button>
                        </div>
                      </div>

                      {/* Descrição e métricas */}
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        <div className="lg:col-span-2">
                          <p className="text-sm text-muted-foreground mb-3">{pipeline.description}</p>
                          
                          {/* Steps visualization */}
                          <div className="space-y-2">
                            <h4 className="text-sm font-medium">Etapas do Pipeline:</h4>
                            <div className="flex items-center space-x-2 overflow-x-auto pb-2">
                              {pipeline.steps.map((step, index) => (
                                <div key={step.id} className="flex items-center space-x-2 min-w-fit">
                                  <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg border ${
                                    step.status === 'completed' ? 'bg-green-50 dark:bg-green-950 border-green-200' :
                                    step.status === 'running' ? 'bg-blue-50 dark:bg-blue-950 border-blue-200' :
                                    step.status === 'failed' ? 'bg-red-50 dark:bg-red-950 border-red-200' :
                                    'bg-gray-50 dark:bg-gray-950 border-gray-200'
                                  }`}>
                                    {stepTypeIcons[step.type]}
                                    <span className="text-xs font-medium">{step.name}</span>
                                    {getStepStatusIcon(step.status)}
                                  </div>
                                  {index < pipeline.steps.length - 1 && (
                                    <ArrowRight className="h-3 w-3 text-gray-400" />
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div>
                              <p className="text-muted-foreground">Taxa de Sucesso</p>
                              <p className="font-medium">{pipeline.successRate}%</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Total de Execuções</p>
                              <p className="font-medium">{pipeline.totalRuns}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Duração Média</p>
                              <p className="font-medium">{formatDuration(pipeline.avgDuration)}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Última Execução</p>
                              <p className="font-medium">{pipeline.lastRun}</p>
                            </div>
                          </div>
                          
                          <div className="pt-2">
                            <div className="flex justify-between text-sm mb-1">
                              <span>Próxima Execução:</span>
                              <span className="font-medium">{pipeline.nextRun}</span>
                            </div>
                            {pipeline.status === 'active' && (
                              <Progress value={75} className="h-2" />
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Configurações do trigger */}
                      <div className="p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <Timer className="h-4 w-4" />
                          <span className="text-sm font-medium">Trigger:</span>
                          <span className="text-sm">
                            {pipeline.trigger.type === 'schedule' ? 
                              `Agendado - ${pipeline.trigger.value} (${pipeline.trigger.frequency})` :
                              pipeline.trigger.type === 'event' ?
                              `Evento - ${pipeline.trigger.value}` :
                              'Manual'
                            }
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Criar Pipeline */}
          <TabsContent value="create" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Criar Novo Pipeline</CardTitle>
                <CardDescription>
                  Configure um fluxo automatizado personalizado
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="pipeline-name">Nome do Pipeline</Label>
                      <Input
                        id="pipeline-name"
                        placeholder="Ex: Pipeline Notícias Urgentes"
                        value={newPipelineName}
                        onChange={(e) => setNewPipelineName(e.target.value)}
                        data-testid="input-pipeline-name"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="pipeline-desc">Descrição</Label>
                      <Textarea
                        id="pipeline-desc"
                        placeholder="Descreva o objetivo deste pipeline..."
                        value={newPipelineDesc}
                        onChange={(e) => setNewPipelineDesc(e.target.value)}
                        rows={3}
                        data-testid="textarea-pipeline-desc"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Tipo de Trigger</Label>
                      <Select>
                        <SelectTrigger data-testid="select-trigger-type">
                          <SelectValue placeholder="Como será ativado?" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="schedule">Agendamento</SelectItem>
                          <SelectItem value="event">Evento</SelectItem>
                          <SelectItem value="manual">Manual</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Etapas do Pipeline</h4>
                    <div className="space-y-2">
                      {['Buscar Notícias', 'Filtrar Conteúdo', 'Gerar Script', 'Síntese de Voz', 'Criar Vídeo', 'Publicar'].map((step, index) => (
                        <div key={index} className="flex items-center space-x-3 p-2 border rounded">
                          <Switch data-testid={`switch-step-${index}`} />
                          <span className="text-sm">{step}</span>
                          <Button size="sm" variant="ghost" data-testid={`button-config-step-${index}`}>
                            <Settings className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>

                    <Button 
                      onClick={createPipeline}
                      disabled={isCreating}
                      className="w-full"
                      data-testid="button-create-pipeline"
                    >
                      {isCreating ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Criando...
                        </>
                      ) : (
                        <>
                          <Plus className="h-4 w-4 mr-2" />
                          Criar Pipeline
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Templates */}
          <TabsContent value="templates" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                      <Zap className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="font-semibold">Pipeline Básico</h3>
                    <p className="text-sm text-muted-foreground">
                      Busca notícias → Script → Voz → Vídeo → Publicação
                    </p>
                    <Badge variant="outline">6 etapas</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                      <RefreshCw className="h-6 w-6 text-green-600" />
                    </div>
                    <h3 className="font-semibold">Pipeline Rápido</h3>
                    <p className="text-sm text-muted-foreground">
                      Versão otimizada para trending topics
                    </p>
                    <Badge variant="outline">3 etapas</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                      <Users className="h-6 w-6 text-purple-600" />
                    </div>
                    <h3 className="font-semibold">Pipeline Multilíngue</h3>
                    <p className="text-sm text-muted-foreground">
                      Tradução e adaptação para múltiplos idiomas
                    </p>
                    <Badge variant="outline">5 etapas</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Monitoramento */}
          <TabsContent value="monitoring" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Performance dos Pipelines</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockPipelines.map((pipeline) => (
                      <div key={pipeline.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <h4 className="font-medium">{pipeline.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {pipeline.totalRuns} execuções | {formatDuration(pipeline.avgDuration)} médio
                          </p>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold">{pipeline.successRate}%</div>
                          <p className="text-xs text-muted-foreground">Sucesso</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Execuções Recentes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-3 border rounded-lg">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <div className="flex-1">
                        <p className="font-medium">Pipeline Completo</p>
                        <p className="text-sm text-muted-foreground">09/03/2024 06:00 - 8.2min</p>
                      </div>
                      <Badge variant="default">Sucesso</Badge>
                    </div>

                    <div className="flex items-center space-x-3 p-3 border rounded-lg">
                      <RefreshCw className="h-5 w-5 text-blue-500 animate-spin" />
                      <div className="flex-1">
                        <p className="font-medium">Pipeline Rápido</p>
                        <p className="text-sm text-muted-foreground">09/03/2024 14:23 - Em andamento</p>
                      </div>
                      <Badge variant="secondary">Executando</Badge>
                    </div>

                    <div className="flex items-center space-x-3 p-3 border rounded-lg">
                      <XCircle className="h-5 w-5 text-red-500" />
                      <div className="flex-1">
                        <p className="font-medium">Pipeline Multilíngue</p>
                        <p className="text-sm text-muted-foreground">08/03/2024 16:00 - Falha na etapa 3</p>
                      </div>
                      <Badge variant="destructive">Erro</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}