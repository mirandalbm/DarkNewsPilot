import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { 
  Mic, 
  Play, 
  Pause, 
  Square,
  Upload, 
  Download, 
  Settings,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  XCircle,
  BarChart3 as Waveform,
  User,
  Users,
  Clock,
  BarChart3,
  TrendingUp,
  Plus,
  Edit,
  Trash2,
  Copy,
  Volume2,
  VolumeX,
  FileAudio,
  Headphones
} from 'lucide-react';

interface VoiceProfile {
  id: string;
  name: string;
  description: string;
  language: string;
  gender: 'male' | 'female' | 'neutral';
  age: 'young' | 'adult' | 'senior';
  tone: 'professional' | 'casual' | 'dramatic' | 'mysterious';
  status: 'ready' | 'training' | 'processing' | 'error';
  quality: number;
  similarity: number;
  audioSamples: number;
  trainingTime: string;
  lastUsed: string;
  usage: {
    totalGenerations: number;
    totalDuration: number;
    avgQuality: number;
  };
}

interface AudioSample {
  id: string;
  name: string;
  duration: number;
  quality: number;
  uploadDate: string;
  status: 'processing' | 'ready' | 'error';
  waveformData: number[];
}

const mockVoices: VoiceProfile[] = [
  {
    id: '1',
    name: 'Narrador Profissional',
    description: 'Voz masculina profunda ideal para documentários dark news',
    language: 'pt-BR',
    gender: 'male',
    age: 'adult',
    tone: 'professional',
    status: 'ready',
    quality: 96.8,
    similarity: 94.2,
    audioSamples: 45,
    trainingTime: '2h 15min',
    lastUsed: '2024-03-09',
    usage: {
      totalGenerations: 3247,
      totalDuration: 18.5,
      avgQuality: 95.3
    }
  },
  {
    id: '2',
    name: 'Apresentadora Mistério',
    description: 'Voz feminina dramática para conteúdo de suspense',
    language: 'pt-BR',
    gender: 'female',
    age: 'adult',
    tone: 'dramatic',
    status: 'ready',
    quality: 94.1,
    similarity: 91.7,
    audioSamples: 38,
    trainingTime: '1h 45min',
    lastUsed: '2024-03-08',
    usage: {
      totalGenerations: 2156,
      totalDuration: 12.8,
      avgQuality: 93.6
    }
  },
  {
    id: '3',
    name: 'Comentarista Jovem',
    description: 'Voz jovem casual para conteúdo descontraído',
    language: 'pt-BR',
    gender: 'male',
    age: 'young',
    tone: 'casual',
    status: 'training',
    quality: 87.3,
    similarity: 85.9,
    audioSamples: 28,
    trainingTime: '3h 20min',
    lastUsed: '2024-03-05',
    usage: {
      totalGenerations: 1834,
      totalDuration: 9.2,
      avgQuality: 88.1
    }
  },
  {
    id: '4',
    name: 'Voz Internacional',
    description: 'Voz neutra em inglês para expansão global',
    language: 'en-US',
    gender: 'neutral',
    age: 'adult',
    tone: 'professional',
    status: 'processing',
    quality: 91.5,
    similarity: 89.2,
    audioSamples: 52,
    trainingTime: '4h 10min',
    lastUsed: '2024-03-07',
    usage: {
      totalGenerations: 967,
      totalDuration: 6.1,
      avgQuality: 90.8
    }
  }
];

const mockSamples: AudioSample[] = [
  {
    id: '1',
    name: 'Narração - Caso Maria Silva.wav',
    duration: 245,
    quality: 96.8,
    uploadDate: '2024-03-08',
    status: 'ready',
    waveformData: Array.from({length: 50}, () => Math.random() * 100)
  },
  {
    id: '2',
    name: 'Introdução - Mistérios Urbanos.wav',
    duration: 182,
    quality: 94.2,
    uploadDate: '2024-03-07',
    status: 'ready',
    waveformData: Array.from({length: 50}, () => Math.random() * 100)
  },
  {
    id: '3',
    name: 'Narração - Breaking News.wav',
    duration: 324,
    quality: 91.5,
    uploadDate: '2024-03-06',
    status: 'processing',
    waveformData: Array.from({length: 50}, () => Math.random() * 100)
  }
];

export default function VoiceCloning() {
  const [selectedVoice, setSelectedVoice] = useState<string | null>(null);
  const [testText, setTestText] = useState('');
  const [newVoiceName, setNewVoiceName] = useState('');
  const [newVoiceDesc, setNewVoiceDesc] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isTraining, setIsTraining] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speechRate, setSpeechRate] = useState([1.0]);
  const [pitch, setPitch] = useState([0]);
  const [volume, setVolume] = useState([0.8]);
  const { toast } = useToast();

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatTime = (hours: number) => {
    if (hours < 1) return `${Math.round(hours * 60)}min`;
    return `${hours.toFixed(1)}h`;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ready': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'training': return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />;
      case 'processing': return <RefreshCw className="h-4 w-4 text-purple-500 animate-spin" />;
      case 'error': return <XCircle className="h-4 w-4 text-red-500" />;
      default: return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getLanguageFlag = (language: string) => {
    switch (language) {
      case 'pt-BR': return '🇧🇷';
      case 'en-US': return '🇺🇸';
      case 'es-ES': return '🇪🇸';
      case 'fr-FR': return '🇫🇷';
      default: return '🌐';
    }
  };

  const generateVoice = async () => {
    if (!testText || !selectedVoice) {
      toast({
        title: "Erro",
        description: "Selecione uma voz e digite o texto para gerar",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      toast({
        title: "Áudio gerado!",
        description: "A síntese de voz foi concluída com sucesso"
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao gerar áudio",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const createVoice = async () => {
    if (!newVoiceName) {
      toast({
        title: "Erro",
        description: "Nome da voz é obrigatório",
        variant: "destructive"
      });
      return;
    }

    setIsTraining(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Voz criada!",
        description: `Voz "${newVoiceName}" está sendo treinada`
      });
      
      setNewVoiceName('');
      setNewVoiceDesc('');
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao criar voz",
        variant: "destructive"
      });
    } finally {
      setIsTraining(false);
    }
  };

  const playTestAudio = () => {
    setIsPlaying(!isPlaying);
    setTimeout(() => setIsPlaying(false), 3000);
  };

  return (
    <div className="container mx-auto px-6 py-8 max-w-7xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Mic className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Clonagem de Voz</h1>
              <p className="text-muted-foreground">Crie vozes personalizadas com IA</p>
            </div>
          </div>
          
          <Button data-testid="button-new-voice">
            <Plus className="h-4 w-4 mr-2" />
            Nova Voz
          </Button>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Vozes Ativas</p>
                  <p className="text-2xl font-bold">4</p>
                  <p className="text-xs text-green-500 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    2 prontas para uso
                  </p>
                </div>
                <Mic className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Qualidade Média</p>
                  <p className="text-2xl font-bold">93.4%</p>
                  <p className="text-xs text-green-500 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +2.1% este mês
                  </p>
                </div>
                <BarChart3 className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Gerações Hoje</p>
                  <p className="text-2xl font-bold">127</p>
                  <p className="text-xs text-blue-500 flex items-center mt-1">
                    <Clock className="h-3 w-3 mr-1" />
                    46.8h de áudio
                  </p>
                </div>
                <Waveform className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Idiomas</p>
                  <p className="text-2xl font-bold">3</p>
                  <p className="text-xs text-blue-500 flex items-center mt-1">
                    <Users className="h-3 w-3 mr-1" />
                    PT, EN, ES
                  </p>
                </div>
                <Users className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="generator" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="generator">Gerador</TabsTrigger>
            <TabsTrigger value="voices">Vozes</TabsTrigger>
            <TabsTrigger value="training">Treinamento</TabsTrigger>
            <TabsTrigger value="samples">Amostras</TabsTrigger>
          </TabsList>

          {/* Gerador */}
          <TabsContent value="generator" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Síntese de Voz</CardTitle>
                  <CardDescription>
                    Gere áudio usando suas vozes personalizadas
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Voz</Label>
                      <Select value={selectedVoice || ''} onValueChange={setSelectedVoice}>
                        <SelectTrigger data-testid="select-voice">
                          <SelectValue placeholder="Escolha uma voz" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockVoices.filter(v => v.status === 'ready').map((voice) => (
                            <SelectItem key={voice.id} value={voice.id}>
                              <div className="flex items-center space-x-2">
                                <span>{getLanguageFlag(voice.language)}</span>
                                <span>{voice.name}</span>
                                <Badge variant="outline" className="ml-2">
                                  {voice.quality.toFixed(1)}%
                                </Badge>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="test-text">Texto para Síntese</Label>
                      <Textarea
                        id="test-text"
                        placeholder="Digite o texto que será convertido em áudio..."
                        value={testText}
                        onChange={(e) => setTestText(e.target.value)}
                        rows={4}
                        data-testid="textarea-test-text"
                      />
                      <div className="text-xs text-muted-foreground">
                        {testText.length} caracteres
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Velocidade: {speechRate[0]}x</Label>
                        <Slider
                          value={speechRate}
                          onValueChange={setSpeechRate}
                          min={0.5}
                          max={2.0}
                          step={0.1}
                          className="w-full"
                          data-testid="slider-speech-rate"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Pitch: {pitch[0] > 0 ? '+' : ''}{pitch[0]}</Label>
                        <Slider
                          value={pitch}
                          onValueChange={setPitch}
                          min={-10}
                          max={10}
                          step={1}
                          className="w-full"
                          data-testid="slider-pitch"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Volume: {Math.round(volume[0] * 100)}%</Label>
                        <Slider
                          value={volume}
                          onValueChange={setVolume}
                          min={0}
                          max={1}
                          step={0.1}
                          className="w-full"
                          data-testid="slider-volume"
                        />
                      </div>
                    </div>

                    <Button 
                      onClick={generateVoice}
                      disabled={isGenerating}
                      className="w-full"
                      data-testid="button-generate-voice"
                    >
                      {isGenerating ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Gerando...
                        </>
                      ) : (
                        <>
                          <Waveform className="h-4 w-4 mr-2" />
                          Gerar Áudio
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Preview e Controles</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {selectedVoice && (
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                          <User className="h-5 w-5" />
                        </div>
                        <div>
                          <h4 className="font-medium">
                            {mockVoices.find(v => v.id === selectedVoice)?.name}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {mockVoices.find(v => v.id === selectedVoice)?.description}
                          </p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Idioma:</span>
                          <span className="ml-2">{mockVoices.find(v => v.id === selectedVoice)?.language}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Gênero:</span>
                          <span className="ml-2 capitalize">{mockVoices.find(v => v.id === selectedVoice)?.gender}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Tom:</span>
                          <span className="ml-2 capitalize">{mockVoices.find(v => v.id === selectedVoice)?.tone}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Qualidade:</span>
                          <span className="ml-2">{mockVoices.find(v => v.id === selectedVoice)?.quality.toFixed(1)}%</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="space-y-4">
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium">Áudio Gerado</span>
                        <Button size="sm" variant="outline" onClick={playTestAudio} data-testid="button-play-test">
                          {isPlaying ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                        </Button>
                      </div>
                      
                      {/* Waveform simulada */}
                      <div className="h-16 bg-background rounded border flex items-center justify-center">
                        <div className="flex items-end space-x-1 h-12">
                          {Array.from({length: 30}, (_, i) => (
                            <div 
                              key={i}
                              className={`w-1 bg-blue-500 transition-all duration-200 ${
                                isPlaying ? 'opacity-100' : 'opacity-50'
                              }`}
                              style={{height: `${Math.random() * 100}%`}}
                            />
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
                        <span>0:00</span>
                        <span>Duração estimada: {Math.round(testText.length / 10)}s</span>
                        <span>0:{Math.round(testText.length / 10)}</span>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button variant="outline" className="flex-1" data-testid="button-download-audio">
                        <Download className="h-4 w-4 mr-2" />
                        Baixar
                      </Button>
                      <Button variant="outline" className="flex-1" data-testid="button-copy-settings">
                        <Copy className="h-4 w-4 mr-2" />
                        Copiar Config
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Vozes */}
          <TabsContent value="voices" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockVoices.map((voice) => (
                <Card key={voice.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {/* Header da voz */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">{getLanguageFlag(voice.language)}</span>
                          <div>
                            <h3 className="font-semibold">{voice.name}</h3>
                            <p className="text-xs text-muted-foreground">{voice.description}</p>
                          </div>
                        </div>
                        {getStatusIcon(voice.status)}
                      </div>

                      {/* Badges de características */}
                      <div className="flex flex-wrap gap-1">
                        <Badge variant="outline" className="text-xs">
                          {voice.gender}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {voice.age}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {voice.tone}
                        </Badge>
                      </div>

                      {/* Métricas */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Qualidade</span>
                          <span className="font-medium">{voice.quality}%</span>
                        </div>
                        <Progress value={voice.quality} className="h-2" />
                        
                        <div className="flex justify-between text-sm">
                          <span>Similaridade</span>
                          <span className="font-medium">{voice.similarity}%</span>
                        </div>
                        <Progress value={voice.similarity} className="h-2" />
                      </div>

                      {/* Estatísticas */}
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-muted-foreground">Amostras:</span>
                          <span className="ml-1 font-medium">{voice.audioSamples}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Treinamento:</span>
                          <span className="ml-1 font-medium">{voice.trainingTime}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Gerações:</span>
                          <span className="ml-1 font-medium">{voice.usage.totalGenerations}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Duração:</span>
                          <span className="ml-1 font-medium">{formatTime(voice.usage.totalDuration)}</span>
                        </div>
                      </div>

                      {/* Ações */}
                      <div className="flex space-x-2">
                        {voice.status === 'ready' && (
                          <Button size="sm" variant="outline" className="flex-1" data-testid={`button-use-${voice.id}`}>
                            <Play className="h-3 w-3 mr-1" />
                            Usar
                          </Button>
                        )}
                        <Button size="sm" variant="outline" className="flex-1" data-testid={`button-edit-${voice.id}`}>
                          <Edit className="h-3 w-3 mr-1" />
                          Editar
                        </Button>
                      </div>

                      {/* Status de treinamento */}
                      {voice.status === 'training' && (
                        <div className="p-2 bg-blue-50 dark:bg-blue-950 rounded text-xs">
                          <div className="flex items-center space-x-1 mb-1">
                            <RefreshCw className="h-3 w-3 animate-spin" />
                            <span>Treinando...</span>
                          </div>
                          <Progress value={67} className="h-1" />
                          <span className="text-muted-foreground">67% concluído</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Treinamento */}
          <TabsContent value="training" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Criar Nova Voz</CardTitle>
                <CardDescription>
                  Configure uma voz personalizada para seu conteúdo
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="voice-name">Nome da Voz</Label>
                      <Input
                        id="voice-name"
                        placeholder="Ex: Narrador Épico"
                        value={newVoiceName}
                        onChange={(e) => setNewVoiceName(e.target.value)}
                        data-testid="input-voice-name"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="voice-desc">Descrição</Label>
                      <Textarea
                        id="voice-desc"
                        placeholder="Descreva o estilo e uso desta voz..."
                        value={newVoiceDesc}
                        onChange={(e) => setNewVoiceDesc(e.target.value)}
                        rows={3}
                        data-testid="textarea-voice-desc"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Idioma</Label>
                        <Select>
                          <SelectTrigger data-testid="select-language">
                            <SelectValue placeholder="Idioma" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pt-BR">🇧🇷 Português (BR)</SelectItem>
                            <SelectItem value="en-US">🇺🇸 English (US)</SelectItem>
                            <SelectItem value="es-ES">🇪🇸 Español (ES)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Gênero</Label>
                        <Select>
                          <SelectTrigger data-testid="select-gender">
                            <SelectValue placeholder="Gênero" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">Masculino</SelectItem>
                            <SelectItem value="female">Feminino</SelectItem>
                            <SelectItem value="neutral">Neutro</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Idade</Label>
                        <Select>
                          <SelectTrigger data-testid="select-age">
                            <SelectValue placeholder="Idade" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="young">Jovem</SelectItem>
                            <SelectItem value="adult">Adulto</SelectItem>
                            <SelectItem value="senior">Sênior</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Tom</Label>
                        <Select>
                          <SelectTrigger data-testid="select-tone">
                            <SelectValue placeholder="Tom" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="professional">Profissional</SelectItem>
                            <SelectItem value="casual">Casual</SelectItem>
                            <SelectItem value="dramatic">Dramático</SelectItem>
                            <SelectItem value="mysterious">Misterioso</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Amostras de Áudio</Label>
                      <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                        <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground mb-2">
                          Arraste arquivos de áudio ou clique para enviar
                        </p>
                        <Button variant="outline" size="sm" data-testid="button-upload-samples">
                          Escolher Arquivos
                        </Button>
                        <p className="text-xs text-muted-foreground mt-2">
                          Recomendado: 20-50 amostras de 30s-2min cada
                        </p>
                      </div>
                    </div>

                    <Button 
                      onClick={createVoice}
                      disabled={isTraining}
                      className="w-full"
                      data-testid="button-create-voice"
                    >
                      {isTraining ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Criando Voz...
                        </>
                      ) : (
                        <>
                          <Mic className="h-4 w-4 mr-2" />
                          Criar Voz
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Amostras */}
          <TabsContent value="samples" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Amostras de Áudio</h3>
              <Button data-testid="button-upload-new-sample">
                <Upload className="h-4 w-4 mr-2" />
                Upload Nova Amostra
              </Button>
            </div>

            <div className="space-y-4">
              {mockSamples.map((sample) => (
                <Card key={sample.id} className="hover:shadow-sm transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                        <FileAudio className="h-5 w-5" />
                      </div>
                      
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{sample.name}</h4>
                          {getStatusIcon(sample.status)}
                        </div>
                        
                        <div className="flex space-x-4 text-sm text-muted-foreground">
                          <span>Duração: {formatDuration(sample.duration)}</span>
                          <span>Qualidade: {sample.quality}%</span>
                          <span>Upload: {sample.uploadDate}</span>
                        </div>
                        
                        {/* Waveform miniatura */}
                        <div className="flex items-end space-x-0.5 h-8">
                          {sample.waveformData.slice(0, 20).map((height, i) => (
                            <div 
                              key={i}
                              className="w-1 bg-blue-500/50"
                              style={{height: `${(height / 100) * 100}%`}}
                            />
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="outline" data-testid={`button-play-sample-${sample.id}`}>
                          <Play className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline" data-testid={`button-download-sample-${sample.id}`}>
                          <Download className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}