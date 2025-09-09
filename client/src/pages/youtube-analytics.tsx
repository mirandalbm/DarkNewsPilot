import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { 
  Youtube, 
  Play, 
  Eye, 
  ThumbsUp, 
  MessageSquare,
  Share2,
  TrendingUp,
  TrendingDown,
  Calendar,
  Clock,
  Users,
  DollarSign,
  BarChart3,
  LineChart,
  PieChart,
  Target,
  Filter,
  Download
} from 'lucide-react';

interface ChannelStats {
  name: string;
  subscribers: number;
  totalViews: number;
  totalVideos: number;
  estimatedRevenue: number;
  avgViewDuration: string;
  engagementRate: number;
}

interface VideoMetric {
  id: string;
  title: string;
  views: number;
  likes: number;
  comments: number;
  duration: string;
  publishedAt: string;
  thumbnail: string;
  performance: 'excellent' | 'good' | 'average' | 'poor';
  ctr: number;
  retention: number;
}

const mockChannels: ChannelStats[] = [
  {
    name: 'DarkNews BR',
    subscribers: 125000,
    totalViews: 8500000,
    totalVideos: 234,
    estimatedRevenue: 12500,
    avgViewDuration: '6:42',
    engagementRate: 8.3
  },
  {
    name: 'Mistérios Urbanos',
    subscribers: 89000,
    totalViews: 5200000,
    totalVideos: 156,
    estimatedRevenue: 7800,
    avgViewDuration: '5:18',
    engagementRate: 6.7
  }
];

const mockVideos: VideoMetric[] = [
  {
    id: '1',
    title: 'O Mistério da Casa Assombrada de São Paulo',
    views: 156000,
    likes: 8900,
    comments: 1200,
    duration: '12:34',
    publishedAt: '2024-03-15',
    thumbnail: 'https://via.placeholder.com/320x180',
    performance: 'excellent',
    ctr: 12.5,
    retention: 68
  },
  {
    id: '2',
    title: 'Caso Não Resolvido: O Desaparecimento de Maria',
    views: 89000,
    likes: 4200,
    comments: 890,
    duration: '15:22',
    publishedAt: '2024-03-10',
    thumbnail: 'https://via.placeholder.com/320x180',
    performance: 'good',
    ctr: 8.7,
    retention: 54
  },
  {
    id: '3',
    title: 'Teorias Conspiratórias Brasileiras',
    views: 45000,
    likes: 2100,
    comments: 340,
    duration: '8:45',
    publishedAt: '2024-03-05',
    thumbnail: 'https://via.placeholder.com/320x180',
    performance: 'average',
    ctr: 5.2,
    retention: 42
  }
];

export default function YouTubeAnalytics() {
  const [selectedChannel, setSelectedChannel] = useState('darknews-br');
  const [selectedPeriod, setSelectedPeriod] = useState('30days');
  const [isLoading, setIsLoading] = useState(false);
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

  const getPerformanceBadge = (performance: string) => {
    const variants = {
      excellent: { variant: "default" as const, color: "bg-green-500", label: "Excelente" },
      good: { variant: "secondary" as const, color: "bg-blue-500", label: "Bom" },
      average: { variant: "outline" as const, color: "bg-yellow-500", label: "Médio" },
      poor: { variant: "destructive" as const, color: "bg-red-500", label: "Fraco" }
    };
    return variants[performance as keyof typeof variants] || variants.average;
  };

  const refreshData = async () => {
    setIsLoading(true);
    try {
      // Simular carregamento de dados
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast({
        title: "Dados atualizados!",
        description: "Métricas do YouTube sincronizadas"
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao sincronizar dados",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-6 py-8 max-w-7xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-700 rounded-lg flex items-center justify-center">
              <Youtube className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">YouTube Analytics</h1>
              <p className="text-muted-foreground">Análise detalhada dos seus canais</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Select value={selectedChannel} onValueChange={setSelectedChannel}>
              <SelectTrigger className="w-48" data-testid="select-channel">
                <SelectValue placeholder="Selecione o canal" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="darknews-br">DarkNews BR</SelectItem>
                <SelectItem value="misterios-urbanos">Mistérios Urbanos</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-32" data-testid="select-period">
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7days">7 dias</SelectItem>
                <SelectItem value="30days">30 dias</SelectItem>
                <SelectItem value="90days">90 dias</SelectItem>
                <SelectItem value="1year">1 ano</SelectItem>
              </SelectContent>
            </Select>

            <Button 
              onClick={refreshData}
              disabled={isLoading}
              data-testid="button-refresh"
            >
              {isLoading ? "Sincronizando..." : "Atualizar"}
            </Button>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Visualizações</p>
                  <p className="text-2xl font-bold">2.1M</p>
                  <p className="text-xs text-green-500 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +15.2% este mês
                  </p>
                </div>
                <Eye className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Inscritos</p>
                  <p className="text-2xl font-bold">125K</p>
                  <p className="text-xs text-green-500 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +8.7% este mês
                  </p>
                </div>
                <Users className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Tempo de Exibição</p>
                  <p className="text-2xl font-bold">14.2K</p>
                  <p className="text-xs text-red-500 flex items-center mt-1">
                    <TrendingDown className="h-3 w-3 mr-1" />
                    -2.1% este mês
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
                  <p className="text-sm font-medium text-muted-foreground">Receita Estimada</p>
                  <p className="text-2xl font-bold">R$ 12.5K</p>
                  <p className="text-xs text-green-500 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +22.4% este mês
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="videos">Vídeos</TabsTrigger>
            <TabsTrigger value="audience">Audiência</TabsTrigger>
            <TabsTrigger value="revenue">Receita</TabsTrigger>
            <TabsTrigger value="optimization">Otimização</TabsTrigger>
          </TabsList>

          {/* Visão Geral */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="h-5 w-5" />
                    <span>Performance Mensal</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Visualizações</span>
                      <span className="font-medium">2.1M (+15%)</span>
                    </div>
                    <Progress value={75} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Engajamento</span>
                      <span className="font-medium">8.3% (+2%)</span>
                    </div>
                    <Progress value={83} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Retenção</span>
                      <span className="font-medium">58% (+5%)</span>
                    </div>
                    <Progress value={58} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <PieChart className="h-5 w-5" />
                    <span>Fontes de Tráfego</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Pesquisa do YouTube</span>
                      <span className="font-medium">42%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Vídeos sugeridos</span>
                      <span className="font-medium">28%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Tráfego direto</span>
                      <span className="font-medium">15%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Redes sociais</span>
                      <span className="font-medium">10%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Outros</span>
                      <span className="font-medium">5%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <LineChart className="h-5 w-5" />
                  <span>Crescimento de Inscritos</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <LineChart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Gráfico de crescimento seria exibido aqui</p>
                  <p className="text-sm">Integração com API do YouTube em desenvolvimento</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Vídeos */}
          <TabsContent value="videos" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Performance dos Vídeos</span>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" data-testid="button-export-videos">
                      <Download className="h-4 w-4 mr-1" />
                      Exportar
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockVideos.map((video) => {
                    const performanceData = getPerformanceBadge(video.performance);
                    return (
                      <div key={video.id} className="flex items-center space-x-4 p-4 border rounded-lg hover:shadow-sm transition-all">
                        <div className="w-24 h-14 bg-gray-200 rounded flex-shrink-0 flex items-center justify-center">
                          <Play className="h-6 w-6 text-gray-500" />
                        </div>
                        
                        <div className="flex-1 space-y-1">
                          <h4 className="font-medium line-clamp-1">{video.title}</h4>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <span className="flex items-center space-x-1">
                              <Eye className="h-3 w-3" />
                              <span>{formatNumber(video.views)}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <ThumbsUp className="h-3 w-3" />
                              <span>{formatNumber(video.likes)}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <MessageSquare className="h-3 w-3" />
                              <span>{formatNumber(video.comments)}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <Calendar className="h-3 w-3" />
                              <span>{new Date(video.publishedAt).toLocaleDateString('pt-BR')}</span>
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                          <div className="text-center">
                            <p className="text-sm font-medium">{video.ctr}%</p>
                            <p className="text-xs text-muted-foreground">CTR</p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm font-medium">{video.retention}%</p>
                            <p className="text-xs text-muted-foreground">Retenção</p>
                          </div>
                          <Badge variant={performanceData.variant}>
                            {performanceData.label}
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Audiência */}
          <TabsContent value="audience" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Demografia</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm">18-24 anos</span>
                        <span className="text-sm font-medium">35%</span>
                      </div>
                      <Progress value={35} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm">25-34 anos</span>
                        <span className="text-sm font-medium">42%</span>
                      </div>
                      <Progress value={42} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm">35-44 anos</span>
                        <span className="text-sm font-medium">18%</span>
                      </div>
                      <Progress value={18} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm">45+ anos</span>
                        <span className="text-sm font-medium">5%</span>
                      </div>
                      <Progress value={5} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Localização</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Brasil</span>
                      <span className="font-medium">78%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Portugal</span>
                      <span className="font-medium">12%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Estados Unidos</span>
                      <span className="font-medium">5%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Outros</span>
                      <span className="font-medium">5%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Receita */}
          <TabsContent value="revenue" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <DollarSign className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold">R$ 12.5K</div>
                  <p className="text-sm text-muted-foreground">Receita estimada (30 dias)</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <Target className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold">R$ 0.08</div>
                  <p className="text-sm text-muted-foreground">RPM médio</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <BarChart3 className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold">+22%</div>
                  <p className="text-sm text-muted-foreground">Crescimento mensal</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Otimização */}
          <TabsContent value="optimization" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recomendações de Otimização</CardTitle>
                <CardDescription>
                  Sugestões baseadas na análise dos seus dados
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3 p-4 border rounded-lg">
                    <TrendingUp className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Melhore a retenção de audiência</h4>
                      <p className="text-sm text-muted-foreground">
                        Seus vídeos perdem 40% da audiência nos primeiros 30 segundos. 
                        Considere criar intros mais envolventes.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-4 border rounded-lg">
                    <Eye className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Otimize as thumbnails</h4>
                      <p className="text-sm text-muted-foreground">
                        CTR médio de 8.7% está abaixo da média do nicho (12%). 
                        Use cores mais contrastantes e texto maior.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-4 border rounded-lg">
                    <Calendar className="h-5 w-5 text-purple-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Frequência de publicação</h4>
                      <p className="text-sm text-muted-foreground">
                        Canais similares que postam 3x por semana têm 45% mais inscritos. 
                        Considere aumentar a frequência.
                      </p>
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