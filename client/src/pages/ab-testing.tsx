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
  Target, 
  Play, 
  Pause, 
  BarChart3,
  TrendingUp,
  TrendingDown,
  Eye,
  ThumbsUp,
  MessageSquare,
  Share2,
  Clock,
  Users,
  Zap,
  Plus,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  XCircle,
  Copy,
  Calendar,
  RotateCcw
} from 'lucide-react';

interface ABTest {
  id: string;
  name: string;
  type: 'title' | 'thumbnail' | 'description' | 'tags';
  status: 'draft' | 'running' | 'completed' | 'paused';
  confidence: number;
  winner: 'A' | 'B' | 'tie' | null;
  startDate: string;
  endDate?: string;
  variants: {
    A: {
      content: string;
      metrics: {
        views: number;
        clicks: number;
        ctr: number;
        likes: number;
        comments: number;
        shares: number;
      };
    };
    B: {
      content: string;
      metrics: {
        views: number;
        clicks: number;
        ctr: number;
        likes: number;
        comments: number;
        shares: number;
      };
    };
  };
  hypothesis: string;
  results?: string;
}

const mockTests: ABTest[] = [
  {
    id: '1',
    name: 'Teste de Título - Caso Maria',
    type: 'title',
    status: 'completed',
    confidence: 95,
    winner: 'B',
    startDate: '2024-03-01',
    endDate: '2024-03-15',
    hypothesis: 'Títulos com números específicos geram mais cliques',
    results: 'Variante B teve 34% mais cliques que A',
    variants: {
      A: {
        content: 'O Mistério do Desaparecimento de Maria',
        metrics: {
          views: 45000,
          clicks: 2700,
          ctr: 6.0,
          likes: 2100,
          comments: 340,
          shares: 180
        }
      },
      B: {
        content: 'O Mistério: 7 Pistas do Desaparecimento de Maria',
        metrics: {
          views: 47000,
          clicks: 3618,
          ctr: 7.7,
          likes: 2890,
          comments: 420,
          shares: 245
        }
      }
    }
  },
  {
    id: '2',
    name: 'Thumbnail - Cores Escuras vs Vibrantes',
    type: 'thumbnail',
    status: 'running',
    confidence: 78,
    winner: null,
    startDate: '2024-03-10',
    hypothesis: 'Cores vibrantes chamam mais atenção que tons escuros',
    variants: {
      A: {
        content: 'Thumbnail escura com tons vermelhos',
        metrics: {
          views: 23000,
          clicks: 1840,
          ctr: 8.0,
          likes: 1200,
          comments: 156,
          shares: 89
        }
      },
      B: {
        content: 'Thumbnail com cores vibrantes e contrastes',
        metrics: {
          views: 24500,
          clicks: 2205,
          ctr: 9.0,
          likes: 1450,
          comments: 178,
          shares: 112
        }
      }
    }
  },
  {
    id: '3',
    name: 'Descrição - Longa vs Curta',
    type: 'description',
    status: 'running',
    confidence: 42,
    winner: null,
    startDate: '2024-03-12',
    hypothesis: 'Descrições mais longas melhoram o engajamento',
    variants: {
      A: {
        content: 'Descrição curta e direta (50 palavras)',
        metrics: {
          views: 18000,
          clicks: 1260,
          ctr: 7.0,
          likes: 890,
          comments: 125,
          shares: 67
        }
      },
      B: {
        content: 'Descrição detalhada e envolvente (150 palavras)',
        metrics: {
          views: 17800,
          clicks: 1246,
          ctr: 7.0,
          likes: 912,
          comments: 134,
          shares: 71
        }
      }
    }
  }
];

export default function ABTesting() {
  const [selectedTestType, setSelectedTestType] = useState('title');
  const [newTestName, setNewTestName] = useState('');
  const [hypothesis, setHypothesis] = useState('');
  const [variantA, setVariantA] = useState('');
  const [variantB, setVariantB] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running': return <Play className="h-4 w-4 text-green-500" />;
      case 'completed': return <CheckCircle className="h-4 w-4 text-blue-500" />;
      case 'paused': return <Pause className="h-4 w-4 text-yellow-500" />;
      default: return <XCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getWinnerIcon = (winner: string | null, variant: 'A' | 'B') => {
    if (winner === variant) {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    } else if (winner && winner !== variant) {
      return <XCircle className="h-4 w-4 text-red-500" />;
    }
    return null;
  };

  const createTest = async () => {
    if (!newTestName || !hypothesis || !variantA || !variantB) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    setIsCreating(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Teste criado!",
        description: `A/B Test "${newTestName}" foi criado com sucesso`,
      });
      
      // Limpar formulário
      setNewTestName('');
      setHypothesis('');
      setVariantA('');
      setVariantB('');
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao criar teste",
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  };

  const pauseTest = (testId: string) => {
    toast({
      title: "Teste pausado",
      description: "O teste foi pausado e pode ser retomado a qualquer momento"
    });
  };

  const stopTest = (testId: string) => {
    toast({
      title: "Teste finalizado",
      description: "O teste foi finalizado e os resultados estão disponíveis"
    });
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-green-500';
    if (confidence >= 70) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="container mx-auto px-6 py-8 max-w-7xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Target className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">A/B Testing</h1>
              <p className="text-muted-foreground">Teste diferentes versões para otimizar performance</p>
            </div>
          </div>
          
          <Button data-testid="button-new-test">
            <Plus className="h-4 w-4 mr-2" />
            Novo Teste
          </Button>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Testes Ativos</p>
                  <p className="text-2xl font-bold">3</p>
                  <p className="text-xs text-green-500 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    2 novos esta semana
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
                  <p className="text-2xl font-bold">78%</p>
                  <p className="text-xs text-green-500 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +12% este mês
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
                  <p className="text-sm font-medium text-muted-foreground">Melhoria Média</p>
                  <p className="text-2xl font-bold">+24%</p>
                  <p className="text-xs text-green-500 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    Nos vencedores
                  </p>
                </div>
                <BarChart3 className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Confiança Média</p>
                  <p className="text-2xl font-bold">85%</p>
                  <p className="text-xs text-yellow-500 flex items-center mt-1">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    Nos testes ativos
                  </p>
                </div>
                <Target className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="tests" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="tests">Testes Ativos</TabsTrigger>
            <TabsTrigger value="create">Criar Teste</TabsTrigger>
            <TabsTrigger value="results">Resultados</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>

          {/* Testes Ativos */}
          <TabsContent value="tests" className="space-y-6">
            <div className="space-y-4">
              {mockTests.map((test) => (
                <Card key={test.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {/* Header do teste */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(test.status)}
                            <h3 className="font-semibold">{test.name}</h3>
                          </div>
                          <Badge variant={
                            test.type === 'title' ? 'default' : 
                            test.type === 'thumbnail' ? 'secondary' : 
                            test.type === 'description' ? 'outline' : 'destructive'
                          }>
                            {test.type === 'title' ? 'Título' : 
                             test.type === 'thumbnail' ? 'Thumbnail' :
                             test.type === 'description' ? 'Descrição' : 'Tags'}
                          </Badge>
                          {test.status === 'running' && (
                            <Badge className={getConfidenceColor(test.confidence)}>
                              {test.confidence}% confiança
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          {test.status === 'running' && (
                            <>
                              <Button size="sm" variant="outline" onClick={() => pauseTest(test.id)} data-testid={`button-pause-${test.id}`}>
                                <Pause className="h-3 w-3 mr-1" />
                                Pausar
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => stopTest(test.id)} data-testid={`button-stop-${test.id}`}>
                                <XCircle className="h-3 w-3 mr-1" />
                                Finalizar
                              </Button>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Hipótese */}
                      <div className="p-3 bg-muted/50 rounded-lg">
                        <p className="text-sm"><strong>Hipótese:</strong> {test.hypothesis}</p>
                        {test.results && (
                          <p className="text-sm mt-1"><strong>Resultado:</strong> {test.results}</p>
                        )}
                      </div>

                      {/* Comparação das variantes */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Variante A */}
                        <div className="border rounded-lg p-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium flex items-center space-x-2">
                              <span>Variante A (Controle)</span>
                              {getWinnerIcon(test.winner, 'A')}
                            </h4>
                            {test.winner === 'A' && <Badge variant="default">Vencedor</Badge>}
                          </div>
                          
                          <p className="text-sm text-muted-foreground">
                            {test.variants.A.content}
                          </p>
                          
                          <div className="grid grid-cols-3 gap-2 text-sm">
                            <div className="text-center">
                              <p className="font-medium">{formatNumber(test.variants.A.metrics.views)}</p>
                              <p className="text-xs text-muted-foreground">Views</p>
                            </div>
                            <div className="text-center">
                              <p className="font-medium">{formatNumber(test.variants.A.metrics.clicks)}</p>
                              <p className="text-xs text-muted-foreground">Cliques</p>
                            </div>
                            <div className="text-center">
                              <p className="font-medium">{formatPercentage(test.variants.A.metrics.ctr)}</p>
                              <p className="text-xs text-muted-foreground">CTR</p>
                            </div>
                          </div>
                        </div>

                        {/* Variante B */}
                        <div className="border rounded-lg p-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium flex items-center space-x-2">
                              <span>Variante B (Teste)</span>
                              {getWinnerIcon(test.winner, 'B')}
                            </h4>
                            {test.winner === 'B' && <Badge variant="default">Vencedor</Badge>}
                          </div>
                          
                          <p className="text-sm text-muted-foreground">
                            {test.variants.B.content}
                          </p>
                          
                          <div className="grid grid-cols-3 gap-2 text-sm">
                            <div className="text-center">
                              <p className="font-medium">{formatNumber(test.variants.B.metrics.views)}</p>
                              <p className="text-xs text-muted-foreground">Views</p>
                            </div>
                            <div className="text-center">
                              <p className="font-medium">{formatNumber(test.variants.B.metrics.clicks)}</p>
                              <p className="text-xs text-muted-foreground">Cliques</p>
                            </div>
                            <div className="text-center">
                              <p className="font-medium">{formatPercentage(test.variants.B.metrics.ctr)}</p>
                              <p className="text-xs text-muted-foreground">CTR</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Métricas de progresso */}
                      {test.status === 'running' && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                          <div className="text-center">
                            <Progress value={test.confidence} className="h-2 mb-1" />
                            <p className="text-sm">Confiança: {test.confidence}%</p>
                          </div>
                          <div className="text-center">
                            <Progress value={75} className="h-2 mb-1" />
                            <p className="text-sm">Duração: 15/20 dias</p>
                          </div>
                          <div className="text-center">
                            <Progress value={85} className="h-2 mb-1" />
                            <p className="text-sm">Amostra: 85% coletada</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Criar Novo Teste */}
          <TabsContent value="create" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Criar Novo A/B Test</CardTitle>
                <CardDescription>
                  Configure um novo teste para otimizar seu conteúdo
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="test-name">Nome do Teste</Label>
                      <Input
                        id="test-name"
                        placeholder="Ex: Teste de Título - Caso X"
                        value={newTestName}
                        onChange={(e) => setNewTestName(e.target.value)}
                        data-testid="input-test-name"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Tipo de Teste</Label>
                      <Select value={selectedTestType} onValueChange={setSelectedTestType}>
                        <SelectTrigger data-testid="select-test-type">
                          <SelectValue placeholder="Escolha o que testar" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="title">Título do Vídeo</SelectItem>
                          <SelectItem value="thumbnail">Thumbnail</SelectItem>
                          <SelectItem value="description">Descrição</SelectItem>
                          <SelectItem value="tags">Tags/Hashtags</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="hypothesis">Hipótese</Label>
                      <Textarea
                        id="hypothesis"
                        placeholder="Ex: Títulos com números específicos geram mais cliques..."
                        value={hypothesis}
                        onChange={(e) => setHypothesis(e.target.value)}
                        rows={3}
                        data-testid="textarea-hypothesis"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="variant-a">Variante A (Controle)</Label>
                      <Textarea
                        id="variant-a"
                        placeholder="Versão atual ou controle..."
                        value={variantA}
                        onChange={(e) => setVariantA(e.target.value)}
                        rows={3}
                        data-testid="textarea-variant-a"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="variant-b">Variante B (Teste)</Label>
                      <Textarea
                        id="variant-b"
                        placeholder="Nova versão a ser testada..."
                        value={variantB}
                        onChange={(e) => setVariantB(e.target.value)}
                        rows={3}
                        data-testid="textarea-variant-b"
                      />
                    </div>

                    <Button 
                      onClick={createTest}
                      disabled={isCreating}
                      className="w-full"
                      data-testid="button-create-test"
                    >
                      {isCreating ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Criando...
                        </>
                      ) : (
                        <>
                          <Plus className="h-4 w-4 mr-2" />
                          Criar Teste
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Resultados */}
          <TabsContent value="results" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold">8</div>
                  <p className="text-sm text-muted-foreground">Testes Concluídos</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <TrendingUp className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold">6</div>
                  <p className="text-sm text-muted-foreground">Vencedores Claros</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <BarChart3 className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold">+32%</div>
                  <p className="text-sm text-muted-foreground">Melhoria Média CTR</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Histórico de Resultados</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockTests
                    .filter(test => test.status === 'completed')
                    .map((test) => (
                      <div key={test.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="space-y-1">
                          <h4 className="font-medium">{test.name}</h4>
                          <p className="text-sm text-muted-foreground">{test.results}</p>
                        </div>
                        <div className="text-center">
                          <Badge variant="default">
                            Variante {test.winner} venceu
                          </Badge>
                          <p className="text-xs text-muted-foreground mt-1">
                            {test.confidence}% confiança
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Insights */}
          <TabsContent value="insights" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Insights e Recomendações</CardTitle>
                <CardDescription>
                  Padrões identificados nos seus testes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="font-medium">Padrão Identificado</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Títulos com números específicos (ex: "7 Pistas", "3 Teorias") têm 
                      CTR 34% maior que títulos genéricos.
                    </p>
                  </div>

                  <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <TrendingUp className="h-5 w-5 text-blue-500" />
                      <span className="font-medium">Oportunidade</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Thumbnails com cores vibrantes superam tons escuros em 23% 
                      no engajamento geral.
                    </p>
                  </div>

                  <div className="p-4 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <AlertCircle className="h-5 w-5 text-yellow-500" />
                      <span className="font-medium">Recomendação</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Teste elementos de urgência nos títulos como "REVELADO", 
                      "FINALMENTE" para aumentar cliques.
                    </p>
                  </div>

                  <div className="p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Target className="h-5 w-5 text-purple-500" />
                      <span className="font-medium">Próximo Teste</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Sugere-se testar diferentes durações de vídeo para 
                      maximizar tempo de visualização.
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