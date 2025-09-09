import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { 
  Hash, 
  TrendingUp, 
  Target, 
  Copy, 
  Sparkles,
  BarChart3,
  Globe,
  Calendar,
  Eye,
  Users,
  Zap
} from 'lucide-react';

interface HashtagSuggestion {
  tag: string;
  category: string;
  popularity: number;
  engagement: string;
  reach: string;
}

interface HashtagSet {
  name: string;
  description: string;
  tags: string[];
  performance: string;
}

const trendingHashtags: HashtagSuggestion[] = [
  { tag: '#mistério', category: 'Geral', popularity: 95, engagement: '4.2%', reach: '2.1M' },
  { tag: '#investigação', category: 'Crime', popularity: 88, engagement: '3.8%', reach: '1.8M' },
  { tag: '#casosreais', category: 'True Crime', popularity: 92, engagement: '4.5%', reach: '2.3M' },
  { tag: '#teoriaconspiracao', category: 'Mistério', popularity: 85, engagement: '3.5%', reach: '1.5M' },
  { tag: '#nãoresolvido', category: 'Crime', popularity: 79, engagement: '3.2%', reach: '1.2M' },
  { tag: '#revelação', category: 'Geral', popularity: 87, engagement: '4.1%', reach: '1.9M' },
  { tag: '#darknews', category: 'Nicho', popularity: 76, engagement: '5.8%', reach: '890K' },
  { tag: '#descoberta', category: 'Investigação', popularity: 83, engagement: '3.7%', reach: '1.4M' },
  { tag: '#segredos', category: 'Mistério', popularity: 90, engagement: '4.3%', reach: '2.0M' },
  { tag: '#verdade', category: 'Geral', popularity: 94, engagement: '4.6%', reach: '2.4M' }
];

const hashtagSets: HashtagSet[] = [
  {
    name: 'Mistério Viral',
    description: 'Combinação otimizada para mistérios que viralizam',
    tags: ['#mistério', '#revelação', '#chocante', '#verdade', '#segredos'],
    performance: '+125% engajamento'
  },
  {
    name: 'True Crime BR',
    description: 'Focado em crimes reais brasileiros',
    tags: ['#truecrime', '#casosreais', '#investigação', '#brasil', '#justiça'],
    performance: '+89% alcance'
  },
  {
    name: 'Conspiração Trending',
    description: 'Para teorias conspiratórias em alta',
    tags: ['#conspiração', '#teoria', '#governooculto', '#illuminati', '#segredosmundiais'],
    performance: '+156% views'
  },
  {
    name: 'Dark News Mix',
    description: 'Mix exclusivo do canal DarkNews',
    tags: ['#darknews', '#nãoresolvido', '#mistériourbano', '#investigaçãoexclusiva', '#revelações'],
    performance: '+203% CTR'
  }
];

export default function HashtagGenerator() {
  const [videoTopic, setVideoTopic] = useState('');
  const [videoDescription, setVideoDescription] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [contentType, setContentType] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedHashtags, setGeneratedHashtags] = useState<string[]>([]);
  const [selectedHashtags, setSelectedHashtags] = useState<string[]>([]);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!videoTopic.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, insira o tópico do vídeo",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    try {
      // Simular geração de hashtags baseada no tópico
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const baseHashtags = ['#' + videoTopic.toLowerCase().replace(/\s+/g, '')];
      const relatedHashtags = [
        '#mistério', '#investigação', '#revelação', '#segredos', '#verdade',
        '#chocante', '#exclusivo', '#descoberta', '#análise', '#facts',
        '#darknews', '#truecrime', '#casosreais', '#teoria', '#evidência'
      ];
      
      const mockHashtags = [
        ...baseHashtags,
        ...relatedHashtags.slice(0, 14)
      ];
      
      setGeneratedHashtags(mockHashtags);
      setSelectedHashtags(mockHashtags.slice(0, 5)); // Selecionar os primeiros 5
      
      toast({
        title: "Hashtags geradas!",
        description: `${mockHashtags.length} hashtags relevantes encontradas`
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao gerar hashtags",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleHashtag = (hashtag: string) => {
    if (selectedHashtags.includes(hashtag)) {
      setSelectedHashtags(selectedHashtags.filter(h => h !== hashtag));
    } else if (selectedHashtags.length < 30) {
      setSelectedHashtags([...selectedHashtags, hashtag]);
    } else {
      toast({
        title: "Limite atingido",
        description: "Máximo de 30 hashtags permitidas",
        variant: "destructive"
      });
    }
  };

  const copyHashtags = () => {
    const hashtagText = selectedHashtags.join(' ');
    navigator.clipboard.writeText(hashtagText);
    toast({
      title: "Copiado!",
      description: `${selectedHashtags.length} hashtags copiadas`
    });
  };

  const copyHashtagSet = (tags: string[]) => {
    const hashtagText = tags.join(' ');
    navigator.clipboard.writeText(hashtagText);
    toast({
      title: "Set copiado!",
      description: `${tags.length} hashtags copiadas`
    });
  };

  const getPopularityColor = (popularity: number) => {
    if (popularity >= 90) return 'text-green-500';
    if (popularity >= 75) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="container mx-auto px-6 py-8 max-w-6xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Hash className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Gerador de Hashtags</h1>
            <p className="text-muted-foreground">Maximize o alcance com hashtags estratégicas</p>
          </div>
        </div>

        <Tabs defaultValue="generator" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="generator">Gerador</TabsTrigger>
            <TabsTrigger value="trending">Em Alta</TabsTrigger>
            <TabsTrigger value="sets">Sets Prontos</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Gerador Principal */}
          <TabsContent value="generator" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Configuração */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Target className="h-5 w-5" />
                    <span>Configurar Conteúdo</span>
                  </CardTitle>
                  <CardDescription>
                    Descreva seu vídeo para gerar hashtags relevantes
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="video-topic">Tópico Principal</Label>
                    <Input
                      id="video-topic"
                      placeholder="Ex: Caso da Garota Desaparecida"
                      value={videoTopic}
                      onChange={(e) => setVideoTopic(e.target.value)}
                      data-testid="input-video-topic"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="video-desc">Descrição (Opcional)</Label>
                    <Textarea
                      id="video-desc"
                      placeholder="Descreva brevemente o conteúdo..."
                      value={videoDescription}
                      onChange={(e) => setVideoDescription(e.target.value)}
                      rows={3}
                      data-testid="textarea-video-desc"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Tipo de Conteúdo</Label>
                      <Select value={contentType} onValueChange={setContentType}>
                        <SelectTrigger data-testid="select-content-type">
                          <SelectValue placeholder="Escolha o tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="investigation">Investigação</SelectItem>
                          <SelectItem value="mystery">Mistério</SelectItem>
                          <SelectItem value="truecrime">True Crime</SelectItem>
                          <SelectItem value="conspiracy">Conspiração</SelectItem>
                          <SelectItem value="breaking">Breaking News</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Público-Alvo</Label>
                      <Select value={targetAudience} onValueChange={setTargetAudience}>
                        <SelectTrigger data-testid="select-target-audience">
                          <SelectValue placeholder="Quem vai assistir" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="young">Jovens (18-25)</SelectItem>
                          <SelectItem value="adult">Adultos (25-40)</SelectItem>
                          <SelectItem value="mature">Maduros (40+)</SelectItem>
                          <SelectItem value="general">Geral</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Button 
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="w-full"
                    data-testid="button-generate-hashtags"
                  >
                    {isGenerating ? (
                      <>
                        <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                        Gerando...
                      </>
                    ) : (
                      <>
                        <Hash className="h-4 w-4 mr-2" />
                        Gerar Hashtags
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Resultados */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Hashtags Geradas</span>
                    {selectedHashtags.length > 0 && (
                      <Button 
                        size="sm" 
                        onClick={copyHashtags}
                        data-testid="button-copy-selected"
                      >
                        <Copy className="h-3 w-3 mr-1" />
                        Copiar ({selectedHashtags.length})
                      </Button>
                    )}
                  </CardTitle>
                  <CardDescription>
                    Clique para selecionar/deselecionar hashtags
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {generatedHashtags.length > 0 ? (
                    <div className="space-y-4">
                      <div className="flex flex-wrap gap-2">
                        {generatedHashtags.map((hashtag, index) => (
                          <Badge
                            key={index}
                            variant={selectedHashtags.includes(hashtag) ? "default" : "outline"}
                            className="cursor-pointer hover:shadow-sm transition-all"
                            onClick={() => toggleHashtag(hashtag)}
                            data-testid={`hashtag-${index}`}
                          >
                            {hashtag}
                          </Badge>
                        ))}
                      </div>
                      
                      {selectedHashtags.length > 0 && (
                        <div className="p-3 bg-muted rounded-lg">
                          <p className="text-sm font-medium mb-2">Selecionadas:</p>
                          <p className="text-sm break-all">{selectedHashtags.join(' ')}</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      <Hash className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Configure o tópico e clique em "Gerar Hashtags"</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Hashtags em Alta */}
          <TabsContent value="trending" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>Hashtags em Alta</span>
                </CardTitle>
                <CardDescription>
                  As hashtags mais populares no momento
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-3">
                  {trendingHashtags.map((hashtag, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-sm transition-all">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-3">
                          <span className="font-medium text-lg">{hashtag.tag}</span>
                          <Badge variant="outline">{hashtag.category}</Badge>
                        </div>
                        <div className="flex space-x-4 text-sm text-muted-foreground">
                          <span className="flex items-center space-x-1">
                            <BarChart3 className="h-3 w-3" />
                            <span>Popularidade: {hashtag.popularity}%</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Users className="h-3 w-3" />
                            <span>Engajamento: {hashtag.engagement}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Eye className="h-3 w-3" />
                            <span>Alcance: {hashtag.reach}</span>
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className={`text-2xl font-bold ${getPopularityColor(hashtag.popularity)}`}>
                          {hashtag.popularity}
                        </div>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => {
                            navigator.clipboard.writeText(hashtag.tag);
                            toast({ title: "Copiado!", description: hashtag.tag });
                          }}
                          data-testid={`button-copy-trending-${index}`}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Sets Prontos */}
          <TabsContent value="sets" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {hashtagSets.map((set, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{set.name}</span>
                      <Badge variant="secondary" className="text-green-600">
                        {set.performance}
                      </Badge>
                    </CardTitle>
                    <CardDescription>
                      {set.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {set.tags.map((tag, tagIndex) => (
                        <Badge key={tagIndex} variant="outline">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <Button 
                      onClick={() => copyHashtagSet(set.tags)}
                      className="w-full"
                      data-testid={`button-copy-set-${index}`}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copiar Set Completo
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Analytics */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6 text-center space-y-2">
                  <Zap className="h-8 w-8 text-blue-500 mx-auto" />
                  <div className="text-2xl font-bold">+156%</div>
                  <p className="text-sm text-muted-foreground">Aumento médio no alcance</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center space-y-2">
                  <Users className="h-8 w-8 text-green-500 mx-auto" />
                  <div className="text-2xl font-bold">+89%</div>
                  <p className="text-sm text-muted-foreground">Aumento no engajamento</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center space-y-2">
                  <Eye className="h-8 w-8 text-purple-500 mx-auto" />
                  <div className="text-2xl font-bold">+203%</div>
                  <p className="text-sm text-muted-foreground">Aumento nas visualizações</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Performance das Hashtags</CardTitle>
                <CardDescription>
                  Análise detalhada do desempenho das suas hashtags
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Analytics detalhadas em desenvolvimento</p>
                  <p className="text-sm">Conecte suas contas para ver métricas reais</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}