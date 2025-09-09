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
  Brain, 
  Upload, 
  Download, 
  Settings,
  Play,
  Pause,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  XCircle,
  Zap,
  Target,
  BarChart3,
  TrendingUp,
  Clock,
  Database,
  Cpu,
  Plus,
  Edit,
  Trash2,
  Copy,
  Eye,
  FileText,
  Image,
  Video,
  Mic
} from 'lucide-react';

interface AIModel {
  id: string;
  name: string;
  type: 'text-generation' | 'voice-synthesis' | 'image-generation' | 'video-analysis';
  status: 'training' | 'ready' | 'deploying' | 'error' | 'draft';
  accuracy: number;
  performance: number;
  size: string;
  lastTrained: string;
  datasetSize: number;
  version: string;
  description: string;
  usage: {
    totalCalls: number;
    successRate: number;
    avgResponseTime: number;
  };
  trainingMetrics: {
    loss: number;
    epochs: number;
    learningRate: number;
  };
}

interface TrainingDataset {
  id: string;
  name: string;
  type: 'text' | 'audio' | 'image' | 'video';
  size: number;
  samples: number;
  quality: number;
  uploadDate: string;
  status: 'processing' | 'ready' | 'error';
}

const mockModels: AIModel[] = [
  {
    id: '1',
    name: 'DarkNews Script Generator v2.1',
    type: 'text-generation',
    status: 'ready',
    accuracy: 94.2,
    performance: 87.5,
    size: '2.3 GB',
    lastTrained: '2024-03-05',
    datasetSize: 15000,
    version: '2.1.0',
    description: 'Modelo especializado em gerar scripts no estilo dark news com alta qualidade narrativa',
    usage: {
      totalCalls: 2847,
      successRate: 96.8,
      avgResponseTime: 1.2
    },
    trainingMetrics: {
      loss: 0.23,
      epochs: 150,
      learningRate: 0.0001
    }
  },
  {
    id: '2',
    name: 'Narrator Voice Model PT-BR',
    type: 'voice-synthesis',
    status: 'training',
    accuracy: 89.7,
    performance: 82.1,
    size: '4.1 GB',
    lastTrained: '2024-03-08',
    datasetSize: 8500,
    version: '1.8.0',
    description: 'Modelo de voz personalizado para narração em português brasileiro',
    usage: {
      totalCalls: 1423,
      successRate: 94.2,
      avgResponseTime: 3.8
    },
    trainingMetrics: {
      loss: 0.31,
      epochs: 89,
      learningRate: 0.0002
    }
  },
  {
    id: '3',
    name: 'Thumbnail Optimizer v1.4',
    type: 'image-generation',
    status: 'ready',
    accuracy: 91.8,
    performance: 90.3,
    size: '1.8 GB',
    lastTrained: '2024-03-01',
    datasetSize: 12000,
    version: '1.4.2',
    description: 'Gerador de thumbnails otimizado para maximizar CTR em vídeos dark news',
    usage: {
      totalCalls: 3621,
      successRate: 98.1,
      avgResponseTime: 2.1
    },
    trainingMetrics: {
      loss: 0.18,
      epochs: 200,
      learningRate: 0.00005
    }
  },
  {
    id: '4',
    name: 'Content Quality Analyzer',
    type: 'video-analysis',
    status: 'deploying',
    accuracy: 88.4,
    performance: 85.7,
    size: '3.2 GB',
    lastTrained: '2024-03-07',
    datasetSize: 9800,
    version: '1.2.0',
    description: 'Análise automática de qualidade de vídeos e sugestões de melhorias',
    usage: {
      totalCalls: 892,
      successRate: 92.6,
      avgResponseTime: 5.4
    },
    trainingMetrics: {
      loss: 0.28,
      epochs: 120,
      learningRate: 0.0003
    }
  }
];

const mockDatasets: TrainingDataset[] = [
  {
    id: '1',
    name: 'Scripts Dark News 2024',
    type: 'text',
    size: 2.4,
    samples: 15000,
    quality: 96.8,
    uploadDate: '2024-03-01',
    status: 'ready'
  },
  {
    id: '2',
    name: 'Narração Profissional PT-BR',
    type: 'audio',
    size: 8.7,
    samples: 8500,
    quality: 94.2,
    uploadDate: '2024-02-15',
    status: 'ready'
  },
  {
    id: '3',
    name: 'Thumbnails High-CTR Collection',
    type: 'image',
    size: 3.1,
    samples: 12000,
    quality: 91.5,
    uploadDate: '2024-02-28',
    status: 'ready'
  },
  {
    id: '4',
    name: 'Video Analysis Dataset',
    type: 'video',
    size: 15.2,
    samples: 3200,
    quality: 89.3,
    uploadDate: '2024-03-05',
    status: 'processing'
  }
];

export default function AIModels() {
  const [selectedModelType, setSelectedModelType] = useState('text-generation');
  const [newModelName, setNewModelName] = useState('');
  const [newModelDesc, setNewModelDesc] = useState('');
  const [isTraining, setIsTraining] = useState(false);
  const { toast } = useToast();

  const formatFileSize = (gb: number) => {
    if (gb >= 1) return `${gb.toFixed(1)} GB`;
    return `${(gb * 1024).toFixed(0)} MB`;
  };

  const getModelIcon = (type: string) => {
    switch (type) {
      case 'text-generation': return <FileText className="h-5 w-5" />;
      case 'voice-synthesis': return <Mic className="h-5 w-5" />;
      case 'image-generation': return <Image className="h-5 w-5" />;
      case 'video-analysis': return <Video className="h-5 w-5" />;
      default: return <Brain className="h-5 w-5" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ready': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'training': return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />;
      case 'deploying': return <Upload className="h-4 w-4 text-purple-500" />;
      case 'error': return <XCircle className="h-4 w-4 text-red-500" />;
      default: return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready': return 'text-green-500';
      case 'training': return 'text-blue-500';
      case 'deploying': return 'text-purple-500';
      case 'error': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const startTraining = async (modelId: string) => {
    setIsTraining(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast({
        title: "Treinamento iniciado",
        description: "O modelo está sendo treinado com o novo dataset"
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao iniciar treinamento",
        variant: "destructive"
      });
    } finally {
      setIsTraining(false);
    }
  };

  const deployModel = async (modelId: string) => {
    try {
      toast({
        title: "Modelo implantado",
        description: "O modelo está disponível para uso em produção"
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao implantar modelo",
        variant: "destructive"
      });
    }
  };

  const createModel = async () => {
    if (!newModelName) {
      toast({
        title: "Erro",
        description: "Nome do modelo é obrigatório",
        variant: "destructive"
      });
      return;
    }

    setIsTraining(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Modelo criado!",
        description: `Modelo "${newModelName}" foi criado e está sendo treinado`
      });
      
      setNewModelName('');
      setNewModelDesc('');
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao criar modelo",
        variant: "destructive"
      });
    } finally {
      setIsTraining(false);
    }
  };

  return (
    <div className="container mx-auto px-6 py-8 max-w-7xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Modelos de IA Custom</h1>
              <p className="text-muted-foreground">Treine e gerencie modelos personalizados</p>
            </div>
          </div>
          
          <Button data-testid="button-new-model">
            <Plus className="h-4 w-4 mr-2" />
            Novo Modelo
          </Button>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Modelos Ativos</p>
                  <p className="text-2xl font-bold">4</p>
                  <p className="text-xs text-green-500 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    2 em produção
                  </p>
                </div>
                <Brain className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Precisão Média</p>
                  <p className="text-2xl font-bold">91.5%</p>
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
                  <p className="text-sm font-medium text-muted-foreground">Uso Total</p>
                  <p className="text-2xl font-bold">8.7K</p>
                  <p className="text-xs text-blue-500 flex items-center mt-1">
                    <BarChart3 className="h-3 w-3 mr-1" />
                    Chamadas hoje
                  </p>
                </div>
                <Zap className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Tempo Resposta</p>
                  <p className="text-2xl font-bold">2.1s</p>
                  <p className="text-xs text-green-500 flex items-center mt-1">
                    <Clock className="h-3 w-3 mr-1" />
                    Médio
                  </p>
                </div>
                <Clock className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="models" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="models">Modelos</TabsTrigger>
            <TabsTrigger value="training">Treinamento</TabsTrigger>
            <TabsTrigger value="datasets">Datasets</TabsTrigger>
            <TabsTrigger value="monitoring">Monitoramento</TabsTrigger>
          </TabsList>

          {/* Modelos */}
          <TabsContent value="models" className="space-y-6">
            <div className="space-y-4">
              {mockModels.map((model) => (
                <Card key={model.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {/* Header do modelo */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                            {getModelIcon(model.type)}
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <h3 className="font-semibold">{model.name}</h3>
                              <Badge variant="outline">v{model.version}</Badge>
                              {getStatusIcon(model.status)}
                            </div>
                            <p className="text-sm text-muted-foreground">{model.description}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          {model.status === 'ready' && (
                            <Button size="sm" variant="outline" onClick={() => deployModel(model.id)} data-testid={`button-deploy-${model.id}`}>
                              <Upload className="h-3 w-3 mr-1" />
                              Usar
                            </Button>
                          )}
                          <Button size="sm" variant="outline" onClick={() => startTraining(model.id)} data-testid={`button-retrain-${model.id}`}>
                            <RefreshCw className="h-3 w-3 mr-1" />
                            Retreinar
                          </Button>
                          <Button size="sm" variant="outline" data-testid={`button-edit-${model.id}`}>
                            <Edit className="h-3 w-3 mr-1" />
                            Editar
                          </Button>
                        </div>
                      </div>

                      {/* Métricas do modelo */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Precisão</span>
                            <span className="font-medium">{model.accuracy}%</span>
                          </div>
                          <Progress value={model.accuracy} className="h-2" />
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Performance</span>
                            <span className="font-medium">{model.performance}%</span>
                          </div>
                          <Progress value={model.performance} className="h-2" />
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Taxa de Sucesso</span>
                            <span className="font-medium">{model.usage.successRate}%</span>
                          </div>
                          <Progress value={model.usage.successRate} className="h-2" />
                        </div>
                        
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground">Tamanho</p>
                          <p className="font-medium">{model.size}</p>
                        </div>
                      </div>

                      {/* Estatísticas detalhadas */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
                        <div>
                          <p className="text-sm font-medium">Uso</p>
                          <p className="text-xs text-muted-foreground">
                            {model.usage.totalCalls.toLocaleString()} chamadas
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Tempo médio: {model.usage.avgResponseTime}s
                          </p>
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium">Dataset</p>
                          <p className="text-xs text-muted-foreground">
                            {model.datasetSize.toLocaleString()} amostras
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Treinado em: {model.lastTrained}
                          </p>
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium">Treinamento</p>
                          <p className="text-xs text-muted-foreground">
                            Loss: {model.trainingMetrics.loss}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Épocas: {model.trainingMetrics.epochs}
                          </p>
                        </div>
                      </div>

                      {/* Status atual */}
                      {model.status === 'training' && (
                        <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                          <div className="flex items-center space-x-2 mb-2">
                            <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />
                            <span className="font-medium">Treinando...</span>
                          </div>
                          <Progress value={65} className="h-2 mb-1" />
                          <p className="text-xs text-muted-foreground">
                            Época 89/150 - Tempo estimado: 2h 15min
                          </p>
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
                <CardTitle>Criar Novo Modelo</CardTitle>
                <CardDescription>
                  Configure um modelo de IA personalizado para suas necessidades
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="model-name">Nome do Modelo</Label>
                      <Input
                        id="model-name"
                        placeholder="Ex: Script Generator v3.0"
                        value={newModelName}
                        onChange={(e) => setNewModelName(e.target.value)}
                        data-testid="input-model-name"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Tipo de Modelo</Label>
                      <Select value={selectedModelType} onValueChange={setSelectedModelType}>
                        <SelectTrigger data-testid="select-model-type">
                          <SelectValue placeholder="Escolha o tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="text-generation">Geração de Texto</SelectItem>
                          <SelectItem value="voice-synthesis">Síntese de Voz</SelectItem>
                          <SelectItem value="image-generation">Geração de Imagens</SelectItem>
                          <SelectItem value="video-analysis">Análise de Vídeo</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="model-desc">Descrição</Label>
                      <Textarea
                        id="model-desc"
                        placeholder="Descreva o objetivo deste modelo..."
                        value={newModelDesc}
                        onChange={(e) => setNewModelDesc(e.target.value)}
                        rows={3}
                        data-testid="textarea-model-desc"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Configurações de Treinamento</h4>
                    
                    <div className="space-y-2">
                      <Label>Dataset de Treinamento</Label>
                      <Select>
                        <SelectTrigger data-testid="select-training-dataset">
                          <SelectValue placeholder="Escolha o dataset" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="dataset1">Scripts Dark News 2024</SelectItem>
                          <SelectItem value="dataset2">Narração Profissional PT-BR</SelectItem>
                          <SelectItem value="dataset3">Thumbnails High-CTR</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="epochs">Épocas</Label>
                        <Input
                          id="epochs"
                          type="number"
                          placeholder="100"
                          defaultValue="100"
                          data-testid="input-epochs"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="learning-rate">Learning Rate</Label>
                        <Input
                          id="learning-rate"
                          placeholder="0.0001"
                          defaultValue="0.0001"
                          data-testid="input-learning-rate"
                        />
                      </div>
                    </div>

                    <Button 
                      onClick={createModel}
                      disabled={isTraining}
                      className="w-full"
                      data-testid="button-start-training"
                    >
                      {isTraining ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Iniciando Treinamento...
                        </>
                      ) : (
                        <>
                          <Play className="h-4 w-4 mr-2" />
                          Iniciar Treinamento
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Datasets */}
          <TabsContent value="datasets" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Datasets de Treinamento</h3>
              <Button data-testid="button-upload-dataset">
                <Upload className="h-4 w-4 mr-2" />
                Upload Dataset
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockDatasets.map((dataset) => (
                <Card key={dataset.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {dataset.type === 'text' && <FileText className="h-5 w-5 text-blue-500" />}
                          {dataset.type === 'audio' && <Mic className="h-5 w-5 text-green-500" />}
                          {dataset.type === 'image' && <Image className="h-5 w-5 text-purple-500" />}
                          {dataset.type === 'video' && <Video className="h-5 w-5 text-red-500" />}
                          <h4 className="font-medium">{dataset.name}</h4>
                        </div>
                        {dataset.status === 'ready' && <CheckCircle className="h-4 w-4 text-green-500" />}
                        {dataset.status === 'processing' && <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />}
                        {dataset.status === 'error' && <XCircle className="h-4 w-4 text-red-500" />}
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Tamanho:</span>
                          <span className="font-medium">{formatFileSize(dataset.size)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Amostras:</span>
                          <span className="font-medium">{dataset.samples.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Qualidade:</span>
                          <span className="font-medium">{dataset.quality}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Upload:</span>
                          <span className="font-medium">{dataset.uploadDate}</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Qualidade</span>
                          <span>{dataset.quality}%</span>
                        </div>
                        <Progress value={dataset.quality} className="h-2" />
                      </div>

                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" className="flex-1" data-testid={`button-view-${dataset.id}`}>
                          <Eye className="h-3 w-3 mr-1" />
                          Ver
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1" data-testid={`button-download-${dataset.id}`}>
                          <Download className="h-3 w-3 mr-1" />
                          Baixar
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Monitoramento */}
          <TabsContent value="monitoring" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Performance dos Modelos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockModels.filter(m => m.status === 'ready').map((model) => (
                      <div key={model.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <h4 className="font-medium">{model.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {model.usage.totalCalls} chamadas | {model.usage.avgResponseTime}s médio
                          </p>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold">{model.accuracy}%</div>
                          <p className="text-xs text-muted-foreground">Precisão</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Uso dos Recursos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>CPU</span>
                        <span>65%</span>
                      </div>
                      <Progress value={65} className="h-2" />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>GPU</span>
                        <span>42%</span>
                      </div>
                      <Progress value={42} className="h-2" />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Memória</span>
                        <span>78%</span>
                      </div>
                      <Progress value={78} className="h-2" />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Armazenamento</span>
                        <span>34%</span>
                      </div>
                      <Progress value={34} className="h-2" />
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