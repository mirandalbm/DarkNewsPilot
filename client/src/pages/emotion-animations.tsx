import { useState, useEffect } from 'react';
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
  Heart,
  Angry,
  Smile,
  Frown,
  Meh,
  Zap,
  AlertTriangle,
  Skull,
  Ghost,
  Eye,
  Brain,
  Sparkles,
  Flame,
  Wind,
  Waves,
  Target,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  Settings,
  Play,
  Pause,
  RotateCcw,
  Download,
  Upload,
  Save,
  RefreshCw,
  Filter,
  Search,
  Calendar,
  Clock,
  Users,
  Globe,
  Share2,
  Plus,
  Minus,
  ChevronRight,
  ChevronLeft,
  Maximize2,
  Minimize2
} from 'lucide-react';

// Sistema de análise emocional com IA
const emotionAnalysis = {
  fear: { intensity: 85, trend: 'up', keywords: ['terror', 'medo', 'pânico', 'assombração'] },
  anger: { intensity: 72, trend: 'stable', keywords: ['raiva', 'ódio', 'violência', 'conflito'] },
  sadness: { intensity: 68, trend: 'down', keywords: ['tristeza', 'perda', 'luto', 'tragédia'] },
  joy: { intensity: 45, trend: 'up', keywords: ['alegria', 'felicidade', 'vitória', 'sucesso'] },
  surprise: { intensity: 78, trend: 'up', keywords: ['surpresa', 'choque', 'revelação', 'descoberta'] },
  disgust: { intensity: 56, trend: 'stable', keywords: ['nojo', 'repulsa', 'escândalo', 'corrupção'] },
  mystery: { intensity: 92, trend: 'up', keywords: ['mistério', 'enigma', 'desconhecido', 'oculto'] }
};

// Sistema de animações baseadas em emoções
const EmotionIcon = ({ emotion, intensity, className = '' }: { emotion: string; intensity: number; className?: string }) => {
  const getIconByEmotion = (emotion: string) => {
    switch (emotion) {
      case 'fear': return <Skull className={`animate-pulse ${className}`} style={{ animationDuration: `${2 - intensity/100}s` }} />;
      case 'anger': return <Flame className={`animate-bounce ${className}`} style={{ animationDuration: `${1.5 - intensity/200}s` }} />;
      case 'sadness': return <Waves className={`animate-pulse ${className}`} style={{ animationDuration: `${3 - intensity/100}s` }} />;
      case 'joy': return <Sparkles className={`animate-spin ${className}`} style={{ animationDuration: `${2 - intensity/200}s` }} />;
      case 'surprise': return <Zap className={`animate-ping ${className}`} />;
      case 'disgust': return <AlertTriangle className={`animate-bounce ${className}`} style={{ animationDuration: `${1.8 - intensity/150}s` }} />;
      case 'mystery': return <Eye className={`animate-pulse ${className}`} style={{ animationDuration: `${1.2 - intensity/300}s` }} />;
      default: return <Brain className={`animate-pulse ${className}`} />;
    }
  };

  return getIconByEmotion(emotion);
};

// Componente de análise emocional de texto
const EmotionAnalyzer = () => {
  const [text, setText] = useState('');
  const [analysis, setAnalysis] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeEmotion = async () => {
    setIsAnalyzing(true);
    // Simulação de análise com IA (em produção, integraria com OpenAI)
    setTimeout(() => {
      const emotions = ['fear', 'anger', 'sadness', 'joy', 'surprise', 'disgust', 'mystery'];
      const results = emotions.map(emotion => ({
        emotion,
        score: Math.random() * 100,
        confidence: Math.random() * 100
      })).sort((a, b) => b.score - a.score);
      
      setAnalysis({
        dominant: results[0],
        emotions: results,
        sentiment: results[0].score > 60 ? 'negativo' : results[0].score > 40 ? 'neutro' : 'positivo',
        intensity: results[0].score
      });
      setIsAnalyzing(false);
    }, 2000);
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="emotion-text">Texto para Análise Emocional</Label>
        <Textarea
          id="emotion-text"
          placeholder="Digite o texto da notícia para análise emocional..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="min-h-[100px]"
          data-testid="textarea-emotion-analysis"
        />
      </div>
      
      <Button onClick={analyzeEmotion} disabled={!text || isAnalyzing} data-testid="button-analyze-emotion">
        {isAnalyzing ? <RotateCcw className="h-4 w-4 mr-2 animate-spin" /> : <Brain className="h-4 w-4 mr-2" />}
        {isAnalyzing ? 'Analisando...' : 'Analisar Emoções'}
      </Button>

      {analysis && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <EmotionIcon emotion={analysis.dominant.emotion} intensity={analysis.intensity} className="h-5 w-5" />
              Resultado da Análise
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Emoção Dominante</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline">{analysis.dominant.emotion}</Badge>
                  <span className="text-sm text-gray-600">{analysis.dominant.score.toFixed(1)}%</span>
                </div>
              </div>
              <div>
                <Label>Sentimento Geral</Label>
                <Badge variant={analysis.sentiment === 'negativo' ? 'destructive' : analysis.sentiment === 'positivo' ? 'default' : 'secondary'}>
                  {analysis.sentiment}
                </Badge>
              </div>
            </div>
            
            <div className="mt-4">
              <Label>Distribuição Emocional</Label>
              <div className="space-y-2 mt-2">
                {analysis.emotions.slice(0, 5).map((emotion: any) => (
                  <div key={emotion.emotion} className="flex items-center gap-2">
                    <EmotionIcon emotion={emotion.emotion} intensity={emotion.score} className="h-4 w-4" />
                    <span className="capitalize w-20">{emotion.emotion}</span>
                    <Progress value={emotion.score} className="flex-1" />
                    <span className="text-sm w-12">{emotion.score.toFixed(0)}%</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

// Configurações de animação
const AnimationSettings = () => {
  const [settings, setSettings] = useState({
    intensity: 75,
    speed: 1.5,
    autoAdapt: true,
    fearSensitivity: 80,
    mysterySensitivity: 85
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Configurações Globais</CardTitle>
          <CardDescription>Ajuste as configurações gerais das animações emocionais</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Intensidade Geral ({settings.intensity}%)</Label>
            <Slider
              value={[settings.intensity]}
              onValueChange={(value) => setSettings({...settings, intensity: value[0]})}
              max={100}
              step={1}
              className="mt-2"
              data-testid="slider-animation-intensity"
            />
          </div>
          
          <div>
            <Label>Velocidade das Animações ({settings.speed}x)</Label>
            <Slider
              value={[settings.speed]}
              onValueChange={(value) => setSettings({...settings, speed: value[0]})}
              min={0.5}
              max={3}
              step={0.1}
              className="mt-2"
              data-testid="slider-animation-speed"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="auto-adapt">Adaptação Automática</Label>
            <Switch
              id="auto-adapt"
              checked={settings.autoAdapt}
              onCheckedChange={(checked) => setSettings({...settings, autoAdapt: checked})}
              data-testid="switch-auto-adapt"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sensibilidade por Emoção</CardTitle>
          <CardDescription>Configure a sensibilidade específica para cada tipo de emoção</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Sensibilidade ao Medo ({settings.fearSensitivity}%)</Label>
            <Slider
              value={[settings.fearSensitivity]}
              onValueChange={(value) => setSettings({...settings, fearSensitivity: value[0]})}
              max={100}
              step={1}
              className="mt-2"
              data-testid="slider-fear-sensitivity"
            />
          </div>
          
          <div>
            <Label>Sensibilidade ao Mistério ({settings.mysterySensitivity}%)</Label>
            <Slider
              value={[settings.mysterySensitivity]}
              onValueChange={(value) => setSettings({...settings, mysterySensitivity: value[0]})}
              max={100}
              step={1}
              className="mt-2"
              data-testid="slider-mystery-sensitivity"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Dashboard de métricas emocionais
const EmotionDashboard = () => {
  const [timeRange, setTimeRange] = useState('7d');
  
  const emotionStats = [
    { emotion: 'mystery', count: 234, percentage: 32, trend: 'up', icon: Eye },
    { emotion: 'fear', count: 198, percentage: 27, trend: 'stable', icon: Skull },
    { emotion: 'surprise', count: 156, percentage: 21, trend: 'up', icon: Zap },
    { emotion: 'anger', count: 89, percentage: 12, trend: 'down', icon: Flame },
    { emotion: 'sadness', count: 45, percentage: 6, trend: 'down', icon: Waves },
    { emotion: 'joy', count: 12, percentage: 2, trend: 'stable', icon: Sparkles }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Dashboard Emocional</h3>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-32" data-testid="select-time-range">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="24h">24h</SelectItem>
            <SelectItem value="7d">7 dias</SelectItem>
            <SelectItem value="30d">30 dias</SelectItem>
            <SelectItem value="90d">90 dias</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {emotionStats.map((stat) => {
          const IconComponent = stat.icon;
          return (
            <Card key={stat.emotion}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <EmotionIcon emotion={stat.emotion} intensity={stat.percentage * 2} className="h-5 w-5" />
                    <span className="capitalize font-medium">{stat.emotion}</span>
                  </div>
                  <Badge variant={stat.trend === 'up' ? 'default' : stat.trend === 'down' ? 'destructive' : 'secondary'}>
                    {stat.trend === 'up' && <TrendingUp className="h-3 w-3 mr-1" />}
                    {stat.trend === 'down' && <TrendingDown className="h-3 w-3 mr-1" />}
                    {stat.percentage}%
                  </Badge>
                </div>
                <div className="mt-2">
                  <div className="text-2xl font-bold">{stat.count}</div>
                  <div className="text-sm text-gray-600">detecções</div>
                </div>
                <Progress value={stat.percentage} className="mt-2" />
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Gráfico de tendências emocionais */}
      <Card>
        <CardHeader>
          <CardTitle>Tendências Emocionais</CardTitle>
          <CardDescription>Evolução das emoções detectadas ao longo do tempo</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center">
              <BarChart3 className="h-12 w-12 mx-auto text-gray-400 mb-2" />
              <p className="text-gray-600">Gráfico de tendências emocionais</p>
              <p className="text-sm text-gray-500">Dados dos últimos {timeRange}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Biblioteca de animações disponíveis
const AnimationLibrary = () => {
  const animations = [
    { name: 'Pulse Misterioso', emotion: 'mystery', description: 'Pulsação suave para conteúdo enigmático' },
    { name: 'Bounce Assustador', emotion: 'fear', description: 'Movimento brusco para notícias de terror' },
    { name: 'Spin Alegre', emotion: 'joy', description: 'Rotação dinâmica para notícias positivas' },
    { name: 'Shake Raivoso', emotion: 'anger', description: 'Tremor intenso para conteúdo violento' },
    { name: 'Fade Melancólico', emotion: 'sadness', description: 'Desbotamento suave para tragédias' },
    { name: 'Flash Surpresa', emotion: 'surprise', description: 'Lampejos rápidos para revelações' }
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {animations.map((animation, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">{animation.name}</h4>
                <EmotionIcon emotion={animation.emotion} intensity={75} className="h-5 w-5" />
              </div>
              <p className="text-sm text-gray-600 mb-3">{animation.description}</p>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" data-testid={`button-preview-${animation.emotion}`}>
                  <Play className="h-3 w-3 mr-1" />
                  Preview
                </Button>
                <Button size="sm" variant="outline" data-testid={`button-customize-${animation.emotion}`}>
                  <Settings className="h-3 w-3 mr-1" />
                  Personalizar
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Criar Nova Animação</CardTitle>
          <CardDescription>Desenvolva animações personalizadas baseadas em emoções específicas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="animation-name">Nome da Animação</Label>
              <Input id="animation-name" placeholder="Ex: Tremor Sinistro" data-testid="input-animation-name" />
            </div>
            <div>
              <Label htmlFor="animation-emotion">Emoção Alvo</Label>
              <Select>
                <SelectTrigger data-testid="select-animation-emotion">
                  <SelectValue placeholder="Selecione a emoção" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mystery">Mistério</SelectItem>
                  <SelectItem value="fear">Medo</SelectItem>
                  <SelectItem value="anger">Raiva</SelectItem>
                  <SelectItem value="sadness">Tristeza</SelectItem>
                  <SelectItem value="joy">Alegria</SelectItem>
                  <SelectItem value="surprise">Surpresa</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="mt-4">
            <Label htmlFor="animation-description">Descrição</Label>
            <Textarea id="animation-description" placeholder="Descreva o comportamento da animação..." data-testid="textarea-animation-description" />
          </div>
          <div className="mt-4 flex gap-2">
            <Button data-testid="button-create-animation">
              <Plus className="h-4 w-4 mr-2" />
              Criar Animação
            </Button>
            <Button variant="outline" data-testid="button-test-animation">
              <Play className="h-4 w-4 mr-2" />
              Testar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default function EmotionAnimations() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('analyzer');

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="relative">
            <Heart className="h-8 w-8 text-red-500 animate-pulse" />
            <Sparkles className="h-4 w-4 text-yellow-400 absolute -top-1 -right-1 animate-spin" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Animações Emocionais</h1>
            <p className="text-gray-600">Sistema inteligente de animações baseadas em análise emocional</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Animações Ativas</p>
                  <p className="text-2xl font-bold">47</p>
                </div>
                <div className="relative">
                  <Zap className="h-8 w-8 text-blue-500 animate-ping" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Emoção Dominante</p>
                  <p className="text-lg font-semibold flex items-center gap-2">
                    <EmotionIcon emotion="mystery" intensity={92} className="h-5 w-5" />
                    Mistério
                  </p>
                </div>
                <Badge variant="outline">92%</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Taxa de Engajamento</p>
                  <p className="text-2xl font-bold text-green-600">+34%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-500 animate-bounce" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Análises Hoje</p>
                  <p className="text-2xl font-bold">1,247</p>
                </div>
                <Brain className="h-8 w-8 text-purple-500 animate-pulse" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="analyzer" className="flex items-center gap-2" data-testid="tab-analyzer">
            <Brain className="h-4 w-4" />
            Analisador
          </TabsTrigger>
          <TabsTrigger value="dashboard" className="flex items-center gap-2" data-testid="tab-dashboard">
            <BarChart3 className="h-4 w-4" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="library" className="flex items-center gap-2" data-testid="tab-library">
            <Sparkles className="h-4 w-4" />
            Biblioteca
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2" data-testid="tab-settings">
            <Settings className="h-4 w-4" />
            Configurações
          </TabsTrigger>
          <TabsTrigger value="monitoring" className="flex items-center gap-2" data-testid="tab-monitoring">
            <Eye className="h-4 w-4" />
            Monitoramento
          </TabsTrigger>
        </TabsList>

        <TabsContent value="analyzer" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Analisador Emocional
              </CardTitle>
              <CardDescription>
                Analise o conteúdo emocional de notícias e gere animações adaptativas automaticamente
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EmotionAnalyzer />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="dashboard" className="space-y-6">
          <EmotionDashboard />
        </TabsContent>

        <TabsContent value="library" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Biblioteca de Animações
              </CardTitle>
              <CardDescription>
                Gerencie e personalize as animações disponíveis para cada tipo de emoção
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AnimationLibrary />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <AnimationSettings />
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Monitoramento em Tempo Real
              </CardTitle>
              <CardDescription>
                Acompanhe as animações emocionais sendo aplicadas em tempo real
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">Notícias Processadas</span>
                        <Badge variant="outline">Tempo Real</Badge>
                      </div>
                      <div className="text-2xl font-bold">156</div>
                      <div className="text-sm text-gray-600">nas últimas 24h</div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">Animações Ativas</span>
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                        </div>
                      </div>
                      <div className="text-2xl font-bold">23</div>
                      <div className="text-sm text-gray-600">sendo executadas</div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Log de Atividades</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {[1,2,3,4,5].map((_, index) => (
                        <div key={index} className="flex items-center gap-3 p-2 border rounded-lg">
                          <div className="flex items-center gap-2">
                            <EmotionIcon emotion="mystery" intensity={85} className="h-4 w-4" />
                            <span className="text-sm font-medium">Mistério detectado</span>
                          </div>
                          <span className="text-sm text-gray-600">em "Desaparecimento Inexplicável"</span>
                          <Badge variant="outline" className="ml-auto">85%</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}