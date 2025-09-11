import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { 
  TrendingUp, 
  TrendingDown, 
  Search, 
  Globe, 
  Calendar,
  Clock,
  Hash,
  Eye,
  MessageSquare,
  Share2,
  Flame,
  Zap,
  Target,
  AlertCircle,
  BarChart3,
  Activity,
  Filter
} from 'lucide-react';

interface TrendingTopic {
  id: string;
  keyword: string;
  category: string;
  volume: number;
  growth: number;
  relevanceScore: number;
  region: string;
  timeframe: string;
  relatedTopics: string[];
  sentiment: 'positive' | 'negative' | 'neutral';
  virality: 'high' | 'medium' | 'low';
}

interface TrendAlert {
  id: string;
  topic: string;
  type: 'breaking' | 'rising' | 'peaked';
  message: string;
  timestamp: string;
  impact: 'high' | 'medium' | 'low';
}

const mockTrends: TrendingTopic[] = [
  {
    id: '1',
    keyword: 'Mistério do Triângulo das Bermudas',
    category: 'Mistério',
    volume: 127000,
    growth: 245,
    relevanceScore: 92,
    region: 'Global',
    timeframe: '24h',
    relatedTopics: ['oceano atlântico', 'desaparecimentos', 'aviação'],
    sentiment: 'neutral',
    virality: 'high'
  },
  {
    id: '2',
    keyword: 'Caso Beatriz Anjo',
    category: 'True Crime',
    volume: 89000,
    growth: 180,
    relevanceScore: 87,
    region: 'Brasil',
    timeframe: '12h',
    relatedTopics: ['investigação policial', 'desaparecimento', 'redes sociais'],
    sentiment: 'negative',
    virality: 'high'
  },
  {
    id: '3',
    keyword: 'Teorias sobre OVNIs Pentagon',
    category: 'Conspiração',
    volume: 156000,
    growth: 156,
    relevanceScore: 78,
    region: 'Global',
    timeframe: '6h',
    relatedTopics: ['pentágono', 'disclosure', 'extraterrestres'],
    sentiment: 'positive',
    virality: 'medium'
  },
  {
    id: '4',
    keyword: 'Ritual Satânico Encontrado',
    category: 'Ocultismo',
    volume: 67000,
    growth: 134,
    relevanceScore: 72,
    region: 'Brasil',
    timeframe: '18h',
    relatedTopics: ['rituais', 'ocultismo', 'investigação'],
    sentiment: 'negative',
    virality: 'medium'
  },
  {
    id: '5',
    keyword: 'Múmia Descoberta no Egito',
    category: 'Arqueologia',
    volume: 203000,
    growth: 298,
    relevanceScore: 95,
    region: 'Global',
    timeframe: '3h',
    relatedTopics: ['arqueologia', 'egito antigo', 'descoberta'],
    sentiment: 'positive',
    virality: 'high'
  }
];

const mockAlerts: TrendAlert[] = [
  {
    id: '1',
    topic: 'Múmia Descoberta no Egito',
    type: 'breaking',
    message: 'Novo pico de interesse - oportunidade para conteúdo viral',
    timestamp: '5 min atrás',
    impact: 'high'
  },
  {
    id: '2',
    topic: 'Mistério do Triângulo das Bermudas',
    type: 'rising',
    message: 'Crescimento acelerado nas últimas 2h - 245% de aumento',
    timestamp: '12 min atrás',
    impact: 'high'
  },
  {
    id: '3',
    topic: 'Teorias Conspiração Eleições',
    type: 'peaked',
    message: 'Tendência atingiu o pico - interesse pode diminuir',
    timestamp: '1h atrás',
    impact: 'medium'
  }
];

export default function TrendsAnalysis() {
  const [selectedRegion, setSelectedRegion] = useState('global');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTimeframe, setSelectedTimeframe] = useState('24h');
  const [searchTerm, setSearchTerm] = useState('');
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

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return '😊';
      case 'negative': return '😰';
      default: return '😐';
    }
  };

  const getViralityColor = (virality: string) => {
    switch (virality) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-yellow-500';
      default: return 'text-green-500';
    }
  };

  const getGrowthIcon = (growth: number) => {
    return growth > 100 ? <TrendingUp className="h-4 w-4 text-green-500" /> : <TrendingDown className="h-4 w-4 text-red-500" />;
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'breaking': return <Flame className="h-4 w-4 text-red-500" />;
      case 'rising': return <TrendingUp className="h-4 w-4 text-green-500" />;
      default: return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    }
  };

  const analyzeCustomTopic = async () => {
    if (!searchTerm.trim()) {
      toast({
        title: "Erro",
        description: "Digite um tópico para analisar",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast({
        title: "Análise concluída!",
        description: `Tendência para "${searchTerm}" analisada`
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao analisar tópico",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const refreshTrends = async () => {
    toast({
      title: "Atualizando...",
      description: "Buscando as últimas tendências"
    });
    
    // Simular refresh
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({
      title: "Atualizado!",
      description: "Tendências atualizadas com sucesso"
    });
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8 max-w-7xl">
      <div className="space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-3 sm:space-y-0">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold">Análise de Tendências</h1>
              <p className="text-muted-foreground text-sm sm:text-base">Monitore tópicos virais em tempo real</p>
            </div>
          </div>
          
          <Button onClick={refreshTrends} size="sm" className="min-h-[44px]" data-testid="button-refresh-trends">
            <Activity className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Atualizar</span>
          </Button>
        </div>

        {/* Filtros */}
        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="flex items-center space-x-2">
              <Filter className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="text-sm sm:text-base">Filtros de Pesquisa</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="space-y-2">
                <Label>Região</Label>
                <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                  <SelectTrigger data-testid="select-region">
                    <SelectValue placeholder="Selecione a região" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="global">Global</SelectItem>
                    <SelectItem value="brasil">Brasil</SelectItem>
                    <SelectItem value="eua">Estados Unidos</SelectItem>
                    <SelectItem value="europa">Europa</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Categoria</Label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger data-testid="select-category">
                    <SelectValue placeholder="Selecione a categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    <SelectItem value="mystery">Mistério</SelectItem>
                    <SelectItem value="truecrime">True Crime</SelectItem>
                    <SelectItem value="conspiracy">Conspiração</SelectItem>
                    <SelectItem value="paranormal">Paranormal</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Período</Label>
                <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
                  <SelectTrigger data-testid="select-timeframe">
                    <SelectValue placeholder="Selecione o período" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1h">Última hora</SelectItem>
                    <SelectItem value="6h">Últimas 6 horas</SelectItem>
                    <SelectItem value="24h">Últimas 24 horas</SelectItem>
                    <SelectItem value="7d">Últimos 7 dias</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 sm:col-span-2 lg:col-span-1">
                <Label>Pesquisa Personalizada</Label>
                <div className="flex space-x-2">
                  <Input
                    placeholder="Ex: múmias egípcias"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1"
                    data-testid="input-search-term"
                  />
                  <Button 
                    onClick={analyzeCustomTopic}
                    disabled={isAnalyzing}
                    size="sm"
                    className="min-h-[44px] flex-shrink-0"
                    data-testid="button-analyze-topic"
                  >
                    {isAnalyzing ? (
                      <Activity className="h-4 w-4 animate-spin" />
                    ) : (
                      <Search className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Alertas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5" />
              <span>Alertas de Tendências</span>
            </CardTitle>
            <CardDescription>
              Oportunidades quentes para criar conteúdo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockAlerts.map((alert) => (
                <div key={alert.id} className="flex items-center space-x-3 p-3 border rounded-lg hover:shadow-sm transition-all">
                  {getAlertIcon(alert.type)}
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{alert.topic}</span>
                      <Badge variant={alert.impact === 'high' ? 'destructive' : alert.impact === 'medium' ? 'default' : 'secondary'}>
                        {alert.type === 'breaking' ? 'BREAKING' : alert.type === 'rising' ? 'SUBINDO' : 'PICO'}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{alert.message}</p>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {alert.timestamp}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="trending" className="space-y-4 sm:space-y-6">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
            <TabsTrigger value="trending" className="text-xs sm:text-sm">Em Alta</TabsTrigger>
            <TabsTrigger value="rising" className="text-xs sm:text-sm">Subindo</TabsTrigger>
            <TabsTrigger value="predictions" className="text-xs sm:text-sm">Previsões</TabsTrigger>
            <TabsTrigger value="competitors" className="text-xs sm:text-sm">Concorrência</TabsTrigger>
          </TabsList>

          {/* Tendências em Alta */}
          <TabsContent value="trending" className="space-y-4 sm:space-y-6">
            <div className="grid gap-3 sm:gap-4">
              {mockTrends.map((trend, index) => (
                <Card key={trend.id} className="hover:shadow-md transition-shadow" data-testid={`trend-card-${trend.id}`}>
                  <CardContent className="p-4 sm:p-6">
                    <div className="space-y-3 sm:space-y-0 sm:flex sm:items-start sm:justify-between">
                      <div className="space-y-2 flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                          <h3 className="font-semibold text-base sm:text-lg">{trend.keyword}</h3>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" className="text-xs">{trend.category}</Badge>
                            <span className="text-lg sm:text-xl">{getSentimentIcon(trend.sentiment)}</span>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 sm:gap-6 text-xs sm:text-sm text-muted-foreground">
                          <span className="flex items-center space-x-1">
                            <Eye className="h-3 w-3" />
                            <span>{formatNumber(trend.volume)} buscas</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            {getGrowthIcon(trend.growth)}
                            <span>+{trend.growth}%</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Globe className="h-3 w-3" />
                            <span>{trend.region}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Clock className="h-3 w-3" />
                            <span>{trend.timeframe}</span>
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-1 sm:gap-2 mt-2 sm:mt-3">
                          {trend.relatedTopics.map((topic, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              {topic}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="text-center space-y-2">
                        <div className={`text-2xl font-bold ${getViralityColor(trend.virality)}`}>
                          {trend.relevanceScore}
                        </div>
                        <p className="text-xs text-muted-foreground">Score</p>
                        <Badge className={trend.virality === 'high' ? 'bg-red-500' : trend.virality === 'medium' ? 'bg-yellow-500' : 'bg-green-500'}>
                          {trend.virality === 'high' ? 'VIRAL' : trend.virality === 'medium' ? 'QUENTE' : 'NORMAL'}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Tendências Subindo */}
          <TabsContent value="rising" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Tópicos em Ascensão</CardTitle>
                <CardDescription>
                  Tópicos que estão ganhando tração rapidamente
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockTrends
                    .filter(trend => trend.growth > 150)
                    .map((trend, index) => (
                      <div key={trend.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-medium">{trend.keyword}</h4>
                          <p className="text-sm text-muted-foreground">{trend.category}</p>
                        </div>
                        <div className="text-center">
                          <div className="text-green-500 font-bold">+{trend.growth}%</div>
                          <p className="text-xs text-muted-foreground">crescimento</p>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Previsões */}
          <TabsContent value="predictions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5" />
                  <span>Previsões para as Próximas 24h</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg bg-green-50 dark:bg-green-950">
                    <div className="flex items-center space-x-2 mb-2">
                      <TrendingUp className="h-5 w-5 text-green-500" />
                      <span className="font-medium">Alta Probabilidade de Viral</span>
                    </div>
                    <p className="text-sm">Múmia Descoberta no Egito tem 87% de chance de viralizar nas próximas 12h</p>
                  </div>

                  <div className="p-4 border rounded-lg bg-yellow-50 dark:bg-yellow-950">
                    <div className="flex items-center space-x-2 mb-2">
                      <Zap className="h-5 w-5 text-yellow-500" />
                      <span className="font-medium">Oportunidade Emergente</span>
                    </div>
                    <p className="text-sm">Rituais Satânicos pode explodir se conectado com caso atual em investigação</p>
                  </div>

                  <div className="p-4 border rounded-lg bg-blue-50 dark:bg-blue-950">
                    <div className="flex items-center space-x-2 mb-2">
                      <BarChart3 className="h-5 w-5 text-blue-500" />
                      <span className="font-medium">Tendência Sustentável</span>
                    </div>
                    <p className="text-sm">True Crime continua forte - alta demanda pelos próximos 7 dias</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Análise de Concorrência */}
          <TabsContent value="competitors" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>O Que Seus Concorrentes Estão Fazendo</CardTitle>
                <CardDescription>
                  Análise dos canais similares e suas estratégias
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">Canal Mistério BR</h4>
                      <Badge>Concorrente Direto</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Últimos vídeos: OVNIs, Múmias, True Crime
                    </p>
                    <div className="flex space-x-4 text-sm">
                      <span>📈 +25% visualizações</span>
                      <span>🎬 3 uploads esta semana</span>
                      <span>⏱️ 12min duração média</span>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">True Crime Podcast</h4>
                      <Badge variant="secondary">Nicho Adjacente</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Foco em casos brasileiros não resolvidos
                    </p>
                    <div className="flex space-x-4 text-sm">
                      <span>📈 +45% inscritos</span>
                      <span>🎬 2 uploads por semana</span>
                      <span>⏱️ 35min duração média</span>
                    </div>
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