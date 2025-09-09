import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { 
  Search, 
  Target, 
  TrendingUp, 
  CheckCircle,
  AlertCircle,
  XCircle,
  Lightbulb,
  BarChart3,
  Globe,
  Hash,
  Eye,
  Copy
} from 'lucide-react';

interface SEOAnalysis {
  score: number;
  title: {
    current: string;
    suggestions: string[];
    score: number;
  };
  description: {
    current: string;
    suggestions: string[];
    score: number;
  };
  keywords: {
    primary: string[];
    suggestions: string[];
    density: number;
  };
  issues: {
    type: 'error' | 'warning' | 'info';
    message: string;
  }[];
}

const sampleKeywords = [
  { keyword: 'notícias misteriosas', volume: 8100, difficulty: 65, trend: '+12%' },
  { keyword: 'casos não resolvidos', volume: 4400, difficulty: 58, trend: '+8%' },
  { keyword: 'investigação criminal', volume: 12300, difficulty: 72, trend: '+15%' },
  { keyword: 'mistérios urbanos', volume: 2900, difficulty: 45, trend: '+5%' },
  { keyword: 'teorias conspiração', volume: 6700, difficulty: 68, trend: '+20%' },
];

export default function SEOOptimization() {
  const [videoTitle, setVideoTitle] = useState('');
  const [videoDescription, setVideoDescription] = useState('');
  const [targetKeywords, setTargetKeywords] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<SEOAnalysis | null>(null);
  const { toast } = useToast();

  const handleAnalyze = async () => {
    if (!videoTitle.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, insira um título para analisar",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      // Simular análise SEO
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockAnalysis: SEOAnalysis = {
        score: 72,
        title: {
          current: videoTitle,
          suggestions: [
            videoTitle + " | REVELAÇÃO CHOCANTE 2024",
            "🔍 " + videoTitle + " - INVESTIGAÇÃO COMPLETA",
            videoTitle + " - O QUE NINGUÉM TE CONTA!"
          ],
          score: 65
        },
        description: {
          current: videoDescription,
          suggestions: [
            "Descubra a verdade por trás de " + videoTitle.toLowerCase() + ". Nossa investigação exclusiva revela detalhes nunca antes vistos. Clique e assista agora!",
            "🎯 INVESTIGAÇÃO EXCLUSIVA: " + videoTitle + ". Todos os fatos, evidências e teorias em um só lugar. Prepare-se para ficar chocado!",
            "A história completa sobre " + videoTitle.toLowerCase() + " que os grandes veículos não contam. Análise profunda e revelações surpreendentes."
          ],
          score: 58
        },
        keywords: {
          primary: targetKeywords.split(',').map(k => k.trim()).filter(k => k),
          suggestions: ['mistério', 'investigação', 'revelação', 'caso', 'verdade', 'exclusivo'],
          density: 2.3
        },
        issues: [
          { type: 'warning', message: 'Título pode ser muito longo para alguns dispositivos' },
          { type: 'info', message: 'Adicione emojis para chamar mais atenção' },
          { type: 'error', message: 'Descrição muito curta - recomendado pelo menos 125 caracteres' }
        ]
      };
      
      setAnalysis(mockAnalysis);
      toast({
        title: "Análise concluída!",
        description: `Score SEO: ${mockAnalysis.score}/100`
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao analisar conteúdo",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copiado!",
      description: "Texto copiado para a área de transferência"
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getIssueIcon = (type: string) => {
    switch (type) {
      case 'error': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'warning': return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      default: return <CheckCircle className="h-4 w-4 text-blue-500" />;
    }
  };

  return (
    <div className="container mx-auto px-6 py-8 max-w-6xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
            <Search className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Otimização SEO</h1>
            <p className="text-muted-foreground">Melhore o rankeamento dos seus vídeos no YouTube</p>
          </div>
        </div>

        <Tabs defaultValue="analyzer" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="analyzer">Analisador</TabsTrigger>
            <TabsTrigger value="keywords">Palavras-chave</TabsTrigger>
            <TabsTrigger value="tools">Ferramentas</TabsTrigger>
          </TabsList>

          {/* Analisador SEO */}
          <TabsContent value="analyzer" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Input */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Target className="h-5 w-5" />
                    <span>Analisar Conteúdo</span>
                  </CardTitle>
                  <CardDescription>
                    Insira os detalhes do seu vídeo para análise
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="video-title">Título do Vídeo</Label>
                    <Input
                      id="video-title"
                      placeholder="Ex: O Mistério da Cidade Perdida"
                      value={videoTitle}
                      onChange={(e) => setVideoTitle(e.target.value)}
                      data-testid="input-video-title"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="video-description">Descrição</Label>
                    <Textarea
                      id="video-description"
                      placeholder="Descreva o conteúdo do seu vídeo..."
                      value={videoDescription}
                      onChange={(e) => setVideoDescription(e.target.value)}
                      rows={4}
                      data-testid="textarea-video-description"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="target-keywords">Palavras-chave Alvo</Label>
                    <Input
                      id="target-keywords"
                      placeholder="Ex: mistério, investigação, caso"
                      value={targetKeywords}
                      onChange={(e) => setTargetKeywords(e.target.value)}
                      data-testid="input-target-keywords"
                    />
                    <p className="text-sm text-muted-foreground">Separe por vírgulas</p>
                  </div>

                  <Button 
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                    className="w-full"
                    data-testid="button-analyze"
                  >
                    {isAnalyzing ? (
                      <>
                        <Search className="h-4 w-4 mr-2 animate-spin" />
                        Analisando...
                      </>
                    ) : (
                      <>
                        <Search className="h-4 w-4 mr-2" />
                        Analisar SEO
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Resultados */}
              <Card>
                <CardHeader>
                  <CardTitle>Resultados da Análise</CardTitle>
                  <CardDescription>
                    Score e sugestões de melhoria
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {analysis ? (
                    <div className="space-y-6">
                      {/* Score Geral */}
                      <div className="text-center">
                        <div className={`text-4xl font-bold ${getScoreColor(analysis.score)}`}>
                          {analysis.score}/100
                        </div>
                        <p className="text-sm text-muted-foreground">Score SEO</p>
                        <Progress value={analysis.score} className="mt-2" />
                      </div>

                      {/* Issues */}
                      <div className="space-y-2">
                        <h4 className="font-medium">Problemas Encontrados</h4>
                        {analysis.issues.map((issue, index) => (
                          <div key={index} className="flex items-start space-x-2 p-2 rounded-lg bg-muted/50">
                            {getIssueIcon(issue.type)}
                            <p className="text-sm">{issue.message}</p>
                          </div>
                        ))}
                      </div>

                      {/* Sugestões Rápidas */}
                      <div className="space-y-2">
                        <h4 className="font-medium">Títulos Sugeridos</h4>
                        {analysis.title.suggestions.slice(0, 2).map((suggestion, index) => (
                          <div key={index} className="flex items-center justify-between p-2 rounded border">
                            <span className="text-sm">{suggestion}</span>
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => copyToClipboard(suggestion)}
                              data-testid={`button-copy-title-${index}`}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Configure o título e clique em "Analisar SEO"</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sugestões Detalhadas */}
            {analysis && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Lightbulb className="h-5 w-5" />
                      <span>Sugestões de Título</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {analysis.title.suggestions.map((suggestion, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <span className="text-sm flex-1">{suggestion}</span>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => copyToClipboard(suggestion)}
                          data-testid={`button-copy-full-title-${index}`}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Eye className="h-5 w-5" />
                      <span>Sugestões de Descrição</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {analysis.description.suggestions.map((suggestion, index) => (
                      <div key={index} className="p-3 border rounded-lg">
                        <p className="text-sm mb-2">{suggestion}</p>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => copyToClipboard(suggestion)}
                          data-testid={`button-copy-description-${index}`}
                        >
                          <Copy className="h-3 w-3 mr-1" />
                          Copiar
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          {/* Pesquisa de Palavras-chave */}
          <TabsContent value="keywords" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Hash className="h-5 w-5" />
                  <span>Pesquisa de Palavras-chave</span>
                </CardTitle>
                <CardDescription>
                  Encontre as melhores palavras-chave para o seu nicho
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex space-x-2">
                  <Input 
                    placeholder="Ex: mistério, conspiração, investigação"
                    className="flex-1"
                    data-testid="input-keyword-search"
                  />
                  <Button data-testid="button-search-keywords">
                    <Search className="h-4 w-4 mr-1" />
                    Pesquisar
                  </Button>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium">Palavras-chave Populares - Mistério/Crime</h4>
                  <div className="space-y-2">
                    {sampleKeywords.map((keyword, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="space-y-1">
                          <p className="font-medium">{keyword.keyword}</p>
                          <div className="flex space-x-4 text-sm text-muted-foreground">
                            <span>🔍 {keyword.volume.toLocaleString()} buscas/mês</span>
                            <span>📊 Dificuldade: {keyword.difficulty}/100</span>
                            <span className="text-green-500">↗ {keyword.trend}</span>
                          </div>
                        </div>
                        <Badge 
                          variant={keyword.difficulty > 70 ? "destructive" : keyword.difficulty > 50 ? "default" : "secondary"}
                          data-testid={`badge-difficulty-${index}`}
                        >
                          {keyword.difficulty > 70 ? "Alta" : keyword.difficulty > 50 ? "Média" : "Baixa"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Ferramentas */}
          <TabsContent value="tools" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4 text-center space-y-3">
                  <BarChart3 className="h-8 w-8 text-blue-500 mx-auto" />
                  <div>
                    <h3 className="font-medium">Análise de Concorrentes</h3>
                    <p className="text-sm text-muted-foreground">Veja o que está funcionando</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4 text-center space-y-3">
                  <TrendingUp className="h-8 w-8 text-green-500 mx-auto" />
                  <div>
                    <h3 className="font-medium">Tendências</h3>
                    <p className="text-sm text-muted-foreground">Tópicos em alta agora</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4 text-center space-y-3">
                  <Globe className="h-8 w-8 text-purple-500 mx-auto" />
                  <div>
                    <h3 className="font-medium">SEO Global</h3>
                    <p className="text-sm text-muted-foreground">Otimizar para outros países</p>
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