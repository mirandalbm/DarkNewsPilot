import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { 
  Brain as Crystal, 
  TrendingUp, 
  TrendingDown,
  Calendar,
  Clock,
  Target,
  BarChart3,
  LineChart,
  PieChart,
  Zap,
  Eye,
  Play,
  ThumbsUp,
  MessageSquare,
  Share2,
  Users,
  Globe,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Brain,
  Lightbulb,
  Activity,
  Timer,
  Star,
  Flame
} from 'lucide-react';

interface Prediction {
  id: string;
  type: 'viral_potential' | 'performance' | 'trending' | 'timing' | 'audience';
  title: string;
  description: string;
  confidence: number;
  timeframe: string;
  impact: 'high' | 'medium' | 'low';
  category: string;
  metrics: {
    expectedViews: number;
    expectedEngagement: number;
    viralScore: number;
  };
  recommendations: string[];
  createdAt: string;
  status: 'active' | 'archived' | 'monitoring';
}

interface TrendingTopic {
  id: string;
  keyword: string;
  category: string;
  searchVolume: number;
  growthRate: number;
  competition: number;
  viralPotential: number;
  timeWindow: string;
  relatedTopics: string[];
}

const mockPredictions: Prediction[] = [
  {
    id: '1',
    type: 'viral_potential',
    title: 'Alto Potencial Viral - Crimes Cibernéticos',
    description: 'Análise indica 87% de chance de viralização para conteúdo sobre crimes cibernéticos nas próximas 48h',
    confidence: 87,
    timeframe: 'Próximas 48h',
    impact: 'high',
    category: 'Crimes Digitais',
    metrics: {
      expectedViews: 2400000,
      expectedEngagement: 18.5,
      viralScore: 8.7
    },
    recommendations: [
      'Focar em casos recentes de hackers brasileiros',
      'Usar thumbnails com elementos tecnológicos',
      'Publicar entre 19h-21h para máximo alcance'
    ],
    createdAt: '2024-03-09',
    status: 'active'
  },
  {
    id: '2',
    type: 'performance',
    title: 'Previsão de Performance - Série Mistérios',
    description: 'Nova série sobre mistérios urbanos tem previsão de 1.8M visualizações na primeira semana',
    confidence: 92,
    timeframe: 'Primeira semana',
    impact: 'high',
    category: 'Mistérios Urbanos',
    metrics: {
      expectedViews: 1800000,
      expectedEngagement: 15.2,
      viralScore: 7.8
    },
    recommendations: [
      'Lançar teaser 24h antes do episódio completo',
      'Criar shorts com momentos de maior suspense',
      'Engajar audiência com polls sobre teorias'
    ],
    createdAt: '2024-03-08',
    status: 'monitoring'
  },
  {
    id: '3',
    type: 'trending',
    title: 'Trend Emergente - True Crime Podcast',
    description: 'Podcasts de true crime brasileiros crescendo 340% em buscas',
    confidence: 78,
    timeframe: 'Próximo mês',
    impact: 'medium',
    category: 'True Crime',
    metrics: {
      expectedViews: 950000,
      expectedEngagement: 12.4,
      viralScore: 6.9
    },
    recommendations: [
      'Adaptar episódios populares para formato podcast',
      'Parcerias com podcasters estabelecidos',
      'Versões extended com conteúdo extra'
    ],
    createdAt: '2024-03-07',
    status: 'active'
  },
  {
    id: '4',
    type: 'timing',
    title: 'Timing Ótimo - Documentários Investigativos',
    description: 'Sextas-feiras às 20h mostram 45% mais engajamento para documentários',
    confidence: 85,
    timeframe: 'Padrão semanal',
    impact: 'medium',
    category: 'Documentários',
    metrics: {
      expectedViews: 1200000,
      expectedEngagement: 16.8,
      viralScore: 7.2
    },
    recommendations: [
      'Agendar lançamentos para sextas às 20h',
      'Criar expectativa durante a semana',
      'Usar stories para countdown'
    ],
    createdAt: '2024-03-06',
    status: 'active'
  }
];

const mockTrendingTopics: TrendingTopic[] = [
  {
    id: '1',
    keyword: 'crimes cibernéticos brasil',
    category: 'Tecnologia',
    searchVolume: 45000,
    growthRate: 234,
    competition: 65,
    viralPotential: 8.7,
    timeWindow: '7 dias',
    relatedTopics: ['hackers brasileiros', 'fraudes pix', 'golpes online']
  },
  {
    id: '2',
    keyword: 'mistérios não resolvidos',
    category: 'Mistério',
    searchVolume: 38000,
    growthRate: 156,
    competition: 78,
    viralPotential: 7.9,
    timeWindow: '14 dias',
    relatedTopics: ['casos frios', 'desaparecimentos', 'investigações']
  },
  {
    id: '3',
    keyword: 'serial killers brasileiros',
    category: 'True Crime',
    searchVolume: 52000,
    growthRate: 189,
    competition: 72,
    viralPotential: 8.2,
    timeWindow: '30 dias',
    relatedTopics: ['pedrinho matador', 'maníaco do parque', 'assassinos em série']
  },
  {
    id: '4',
    keyword: 'paranormal brasil',
    category: 'Sobrenatural',
    searchVolume: 29000,
    growthRate: 267,
    competition: 54,
    viralPotential: 7.1,
    timeWindow: '3 dias',
    relatedTopics: ['assombrações', 'casas mal-assombradas', 'fenômenos inexplicáveis']
  }
];

export default function Predictions() {
  const [selectedTimeframe, setSelectedTimeframe] = useState('7days');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [predictText, setPredictText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-yellow-500';
      default: return 'text-green-500';
    }
  };

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case 'high': return <Flame className="h-4 w-4 text-red-500" />;
      case 'medium': return <Zap className="h-4 w-4 text-yellow-500" />;
      default: return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'viral_potential': return <Flame className="h-4 w-4" />;
      case 'performance': return <BarChart3 className="h-4 w-4" />;
      case 'trending': return <TrendingUp className="h-4 w-4" />;
      case 'timing': return <Clock className="h-4 w-4" />;
      default: return <Target className="h-4 w-4" />;
    }
  };

  const analyzeContent = async () => {
    if (!predictText) {
      toast({
        title: "Erro",
        description: "Digite o conteúdo para análise preditiva",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const viralScore = Math.floor(Math.random() * 40) + 60; // 60-100
      const expectedViews = Math.floor(Math.random() * 2000000) + 500000;
      
      toast({
        title: "Análise concluída!",
        description: `Score viral: ${viralScore}/100 | Views previstas: ${formatNumber(expectedViews)}`,
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha na análise preditiva",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="container mx-auto px-6 py-8 max-w-7xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Crystal className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Previsões</h1>
              <p className="text-muted-foreground">Análise preditiva de tendências e performance</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
              <SelectTrigger className="w-40" data-testid="select-timeframe">
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24h">Próximas 24h</SelectItem>
                <SelectItem value="7days">Próximos 7 dias</SelectItem>
                <SelectItem value="30days">Próximos 30 dias</SelectItem>
                <SelectItem value="3months">Próximos 3 meses</SelectItem>
              </SelectContent>
            </Select>

            <Button data-testid="button-refresh-predictions">
              <RefreshCw className="h-4 w-4 mr-2" />
              Atualizar
            </Button>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Previsões Ativas</p>
                  <p className="text-2xl font-bold">12</p>
                  <p className="text-xs text-green-500 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    4 alta confiança
                  </p>
                </div>
                <Crystal className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Precisão Média</p>
                  <p className="text-2xl font-bold">89.3%</p>
                  <p className="text-xs text-green-500 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +3.2% este mês
                  </p>
                </div>
                <Target className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Trends Detectados</p>
                  <p className="text-2xl font-bold">28</p>
                  <p className="text-xs text-blue-500 flex items-center mt-1">
                    <Flame className="h-3 w-3 mr-1" />
                    7 emergentes
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Score Viral Médio</p>
                  <p className="text-2xl font-bold">7.8</p>
                  <p className="text-xs text-orange-500 flex items-center mt-1">
                    <Star className="h-3 w-3 mr-1" />
                    Para próximos conteúdos
                  </p>
                </div>
                <Flame className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="predictions" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="predictions">Previsões</TabsTrigger>
            <TabsTrigger value="trending">Trending Topics</TabsTrigger>
            <TabsTrigger value="analyzer">Analisador</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>

          {/* Previsões */}
          <TabsContent value="predictions" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Previsões Ativas</h3>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48" data-testid="select-category">
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas Categorias</SelectItem>
                  <SelectItem value="crimes">Crimes</SelectItem>
                  <SelectItem value="mystery">Mistérios</SelectItem>
                  <SelectItem value="paranormal">Paranormal</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              {mockPredictions.map((prediction) => (
                <Card key={prediction.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {/* Header da previsão */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                            {getTypeIcon(prediction.type)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h3 className="font-semibold">{prediction.title}</h3>
                              <Badge variant="outline">{prediction.category}</Badge>
                              {getImpactIcon(prediction.impact)}
                            </div>
                            <p className="text-sm text-muted-foreground">{prediction.description}</p>
                          </div>
                        </div>
                        
                        <div className="text-center">
                          <div className="text-2xl font-bold">{prediction.confidence}%</div>
                          <p className="text-xs text-muted-foreground">Confiança</p>
                        </div>
                      </div>

                      {/* Métricas previstas */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
                        <div className="text-center">
                          <div className="text-lg font-bold text-blue-500">
                            {formatNumber(prediction.metrics.expectedViews)}
                          </div>
                          <p className="text-xs text-muted-foreground">Views Previstas</p>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-green-500">
                            {prediction.metrics.expectedEngagement}%
                          </div>
                          <p className="text-xs text-muted-foreground">Engajamento</p>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-orange-500">
                            {prediction.metrics.viralScore}/10
                          </div>
                          <p className="text-xs text-muted-foreground">Score Viral</p>
                        </div>
                      </div>

                      {/* Recomendações */}
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Recomendações:</h4>
                        <div className="space-y-1">
                          {prediction.recommendations.map((rec, index) => (
                            <div key={index} className="flex items-start space-x-2 text-sm">
                              <Lightbulb className="h-3 w-3 text-yellow-500 mt-0.5 flex-shrink-0" />
                              <span className="text-muted-foreground">{rec}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-2 text-xs text-muted-foreground">
                        <span>Timeframe: {prediction.timeframe}</span>
                        <span>Criado em: {prediction.createdAt}</span>
                        <Badge variant={prediction.status === 'active' ? 'default' : 'secondary'}>
                          {prediction.status === 'active' ? 'Ativo' : 
                           prediction.status === 'monitoring' ? 'Monitorando' : 'Arquivado'}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Trending Topics */}
          <TabsContent value="trending" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mockTrendingTopics.map((topic) => (
                <Card key={topic.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">{topic.keyword}</h3>
                          <Badge variant="outline" className="mt-1">{topic.category}</Badge>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold">{topic.viralPotential}/10</div>
                          <p className="text-xs text-muted-foreground">Potencial</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Volume de busca:</span>
                          <p className="font-medium">{formatNumber(topic.searchVolume)}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Crescimento:</span>
                          <p className="font-medium text-green-500">+{topic.growthRate}%</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Competição:</span>
                          <p className="font-medium">{topic.competition}/100</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Janela:</span>
                          <p className="font-medium">{topic.timeWindow}</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <span className="text-sm font-medium">Tópicos Relacionados:</span>
                        <div className="flex flex-wrap gap-1">
                          {topic.relatedTopics.map((related, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {related}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Potencial Viral</span>
                          <span>{topic.viralPotential}/10</span>
                        </div>
                        <Progress value={topic.viralPotential * 10} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Analisador */}
          <TabsContent value="analyzer" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="h-5 w-5" />
                  <span>Analisador Preditivo</span>
                </CardTitle>
                <CardDescription>
                  Analise o potencial viral e performance de seu conteúdo antes de publicar
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="predict-content">Conteúdo para Análise</Label>
                    <Textarea
                      id="predict-content"
                      placeholder="Digite o título, descrição ou script que deseja analisar..."
                      value={predictText}
                      onChange={(e) => setPredictText(e.target.value)}
                      rows={6}
                      data-testid="textarea-predict-content"
                    />
                    <div className="text-xs text-muted-foreground">
                      {predictText.length} caracteres
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Tipo de Conteúdo</Label>
                      <Select>
                        <SelectTrigger data-testid="select-content-type">
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="video">Vídeo Longo</SelectItem>
                          <SelectItem value="short">Short/Clip</SelectItem>
                          <SelectItem value="series">Série/Episódio</SelectItem>
                          <SelectItem value="live">Live/Stream</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Categoria Principal</Label>
                      <Select>
                        <SelectTrigger data-testid="select-content-category">
                          <SelectValue placeholder="Categoria" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="crime">True Crime</SelectItem>
                          <SelectItem value="mystery">Mistérios</SelectItem>
                          <SelectItem value="paranormal">Paranormal</SelectItem>
                          <SelectItem value="investigation">Investigação</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Button 
                    onClick={analyzeContent}
                    disabled={isAnalyzing}
                    className="w-full"
                    data-testid="button-analyze-content"
                  >
                    {isAnalyzing ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Analisando...
                      </>
                    ) : (
                      <>
                        <Brain className="h-4 w-4 mr-2" />
                        Analisar Potencial
                      </>
                    )}
                  </Button>
                </div>

                {/* Resultados simulados */}
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-medium mb-3">Última Análise:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-green-500">8.2/10</div>
                      <p className="text-sm text-muted-foreground">Score Viral</p>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-blue-500">1.8M</div>
                      <p className="text-sm text-muted-foreground">Views Previstas</p>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-purple-500">94%</div>
                      <p className="text-sm text-muted-foreground">Confiança</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Insights */}
          <TabsContent value="insights" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Insights de Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                      <div className="flex items-center space-x-2 mb-1">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="font-medium text-sm">Padrão Identificado</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Conteúdos publicados às sextas-feiras têm 45% mais engajamento.
                      </p>
                    </div>

                    <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                      <div className="flex items-center space-x-2 mb-1">
                        <TrendingUp className="h-4 w-4 text-blue-500" />
                        <span className="font-medium text-sm">Trend Emergente</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Crimes cibernéticos estão crescendo 234% em interesse nas últimas 2 semanas.
                      </p>
                    </div>

                    <div className="p-3 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
                      <div className="flex items-center space-x-2 mb-1">
                        <AlertTriangle className="h-4 w-4 text-yellow-500" />
                        <span className="font-medium text-sm">Oportunidade</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Nichos de paranormal brasileiro têm baixa competição e alto potencial.
                      </p>
                    </div>

                    <div className="p-3 bg-purple-50 dark:bg-purple-950 rounded-lg">
                      <div className="flex items-center space-x-2 mb-1">
                        <Lightbulb className="h-4 w-4 text-purple-500" />
                        <span className="font-medium text-sm">Recomendação</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Combine elementos de mistério com investigação jornalística para máximo impacto.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Análise de Audiência</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Faixa 18-24 anos</span>
                        <span className="font-medium">28%</span>
                      </div>
                      <Progress value={28} className="h-2" />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Faixa 25-34 anos</span>
                        <span className="font-medium">42%</span>
                      </div>
                      <Progress value={42} className="h-2" />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Faixa 35-44 anos</span>
                        <span className="font-medium">22%</span>
                      </div>
                      <Progress value={22} className="h-2" />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Faixa 45+ anos</span>
                        <span className="font-medium">8%</span>
                      </div>
                      <Progress value={8} className="h-2" />
                    </div>

                    <div className="pt-4 border-t">
                      <h4 className="font-medium mb-2">Horários de Maior Engajamento:</h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>19h-21h: <span className="font-medium">Peak</span></div>
                        <div>21h-23h: <span className="font-medium">Alto</span></div>
                        <div>12h-14h: <span className="font-medium">Médio</span></div>
                        <div>14h-17h: <span className="font-medium">Baixo</span></div>
                      </div>
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