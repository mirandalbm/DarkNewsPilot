import { useState } from 'react';
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
import { 
  ShieldCheck, 
  ShieldAlert,
  ShieldX,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  Search,
  Eye,
  FileText,
  Video,
  Image,
  Link,
  Globe,
  Database,
  Server,
  Brain,
  Zap,
  Target,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Activity,
  Calendar,
  User,
  Users,
  Star,
  Award,
  Flag,
  Filter,
  Plus,
  Edit,
  Trash2,
  Download,
  Upload,
  RefreshCw,
  Settings,
  Play,
  Pause,
  Stop,
  FastForward,
  Rewind,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  RotateCcw,
  Share2,
  Copy,
  ExternalLink,
  Info,
  HelpCircle,
  AlertCircle,
  Bookmark,
  Archive,
  Mail,
  Send,
  Bell,
  Phone,
  MessageSquare,
  Hash,
  AtSign,
  Percent,
  DollarSign,
  Euro,
  PoundSterling,
  Yen,
  Bitcoin,
  CreditCard,
  Banknote,
  Wallet,
  PiggyBank,
  TrendingDown as DownTrend,
  Lock,
  Unlock,
  Key,
  Fingerprint,
  Shield,
  ShieldOff
} from 'lucide-react';

interface ContentItem {
  id: string;
  type: 'video' | 'article' | 'image' | 'audio' | 'document';
  title: string;
  description?: string;
  url?: string;
  status: 'pending' | 'verified' | 'rejected' | 'suspicious' | 'needs_review';
  confidence: number;
  createdAt: string;
  verifiedAt?: string;
  verifiedBy?: string;
  metadata: {
    duration?: number;
    size?: number;
    format?: string;
    resolution?: string;
    sources?: string[];
    claims?: string[];
    evidence?: Array<{
      type: 'source' | 'expert' | 'document' | 'cross_reference';
      url: string;
      title: string;
      confidence: number;
    }>;
  };
  aiAnalysis: {
    authenticity: number;
    quality: number;
    credibility: number;
    bias: number;
    factualness: number;
    flags: string[];
    summary: string;
  };
}

interface VerificationRule {
  id: string;
  name: string;
  type: 'source_check' | 'fact_check' | 'quality_check' | 'bias_check' | 'plagiarism_check';
  enabled: boolean;
  threshold: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
  conditions: Array<{
    field: string;
    operator: string;
    value: string;
  }>;
  actions: Array<{
    type: string;
    params: Record<string, any>;
  }>;
  lastUpdate: string;
  triggerCount: number;
}

interface VerificationSource {
  id: string;
  name: string;
  type: 'news' | 'academic' | 'government' | 'expert' | 'organization';
  url: string;
  reliability: number;
  bias: 'left' | 'center' | 'right' | 'unknown';
  lastChecked: string;
  enabled: boolean;
  apiKey?: string;
  rateLimit?: number;
}

const mockContentItems: ContentItem[] = [
  {
    id: 'content_001',
    type: 'video',
    title: 'Mistério Resolvido: Casa Assombrada era Fraude',
    description: 'Investigação revela que fenômenos paranormais eram encenados',
    url: 'https://youtube.com/watch?v=abc123',
    status: 'verified',
    confidence: 0.92,
    createdAt: '2024-03-08 14:30:00',
    verifiedAt: '2024-03-08 16:45:00',
    verifiedBy: 'AI Verificador',
    metadata: {
      duration: 1245,
      size: 150000000,
      format: 'mp4',
      resolution: '1920x1080',
      sources: ['Jornal Local', 'Polícia Civil', 'Testemunhas'],
      claims: ['Casa era cenário de fraude', 'Proprietário confessou', 'Equipamentos falsos encontrados']
    },
    aiAnalysis: {
      authenticity: 0.95,
      quality: 0.88,
      credibility: 0.90,
      bias: 0.15,
      factualness: 0.93,
      flags: ['verified_sources', 'multiple_witnesses', 'official_statement'],
      summary: 'Conteúdo altamente confiável com múltiplas fontes verificadas e evidências documentadas.'
    }
  },
  {
    id: 'content_002',
    type: 'article',
    title: 'Teoria da Conspiração sobre Alienígenas no Brasil',
    description: 'Artigo alega contato extraterrestre em base militar',
    status: 'suspicious',
    confidence: 0.23,
    createdAt: '2024-03-07 10:20:00',
    metadata: {
      sources: ['Fonte anônima', 'Blog pessoal'],
      claims: ['Base militar secreta', 'Naves extraterrestres', 'Governo esconde informações']
    },
    aiAnalysis: {
      authenticity: 0.25,
      quality: 0.45,
      credibility: 0.20,
      bias: 0.80,
      factualness: 0.15,
      flags: ['unverified_claims', 'anonymous_sources', 'conspiracy_pattern', 'sensationalist'],
      summary: 'Conteúdo com baixa credibilidade, fontes não verificáveis e padrões típicos de teorias conspiratórias.'
    }
  },
  {
    id: 'content_003',
    type: 'image',
    title: 'Foto de Criatura Misteriosa em Floresta',
    description: 'Imagem supostamente mostra criatura desconhecida',
    status: 'needs_review',
    confidence: 0.67,
    createdAt: '2024-03-06 18:15:00',
    metadata: {
      format: 'jpg',
      resolution: '2048x1536',
      sources: ['Fotógrafo amador'],
      claims: ['Nova espécie descoberta', 'Criatura nunca vista antes']
    },
    aiAnalysis: {
      authenticity: 0.70,
      quality: 0.85,
      credibility: 0.60,
      bias: 0.30,
      factualness: 0.55,
      flags: ['image_metadata_consistent', 'lighting_analysis_passed', 'expert_opinion_needed'],
      summary: 'Imagem tecnicamente autêntica, mas necessita validação de especialistas em biologia.'
    }
  },
  {
    id: 'content_004',
    type: 'document',
    title: 'Relatório Oficial sobre Fenômenos Paranormais',
    description: 'Documento supostamente oficial do governo',
    status: 'rejected',
    confidence: 0.12,
    createdAt: '2024-03-05 09:30:00',
    verifiedAt: '2024-03-05 11:20:00',
    verifiedBy: 'Verificador Especialista',
    metadata: {
      format: 'pdf',
      size: 2500000,
      sources: ['Site não oficial'],
      claims: ['Documento governamental', 'Investigação oficial', 'Evidências classificadas']
    },
    aiAnalysis: {
      authenticity: 0.10,
      quality: 0.30,
      credibility: 0.15,
      bias: 0.85,
      factualness: 0.08,
      flags: ['fake_document', 'inconsistent_formatting', 'no_official_seal', 'fabricated_content'],
      summary: 'Documento claramente falsificado com inconsistências múltiplas e ausência de autenticação oficial.'
    }
  }
];

const mockRules: VerificationRule[] = [
  {
    id: 'rule_001',
    name: 'Verificação de Fontes Múltiplas',
    type: 'source_check',
    enabled: true,
    threshold: 0.8,
    priority: 'high',
    conditions: [
      { field: 'source_count', operator: '>=', value: '3' },
      { field: 'official_sources', operator: '>=', value: '1' }
    ],
    actions: [
      { type: 'auto_verify', params: { confidence_boost: 0.2 } }
    ],
    lastUpdate: '2024-02-15',
    triggerCount: 156
  },
  {
    id: 'rule_002',
    name: 'Detector de Teorias Conspiratórias',
    type: 'fact_check',
    enabled: true,
    threshold: 0.7,
    priority: 'critical',
    conditions: [
      { field: 'conspiracy_keywords', operator: '>', value: '5' },
      { field: 'sensationalist_language', operator: '>', value: '0.6' }
    ],
    actions: [
      { type: 'flag_suspicious', params: { require_manual_review: true } }
    ],
    lastUpdate: '2024-03-01',
    triggerCount: 89
  },
  {
    id: 'rule_003',
    name: 'Análise de Qualidade de Imagem',
    type: 'quality_check',
    enabled: true,
    threshold: 0.75,
    priority: 'medium',
    conditions: [
      { field: 'content_type', operator: '==', value: 'image' },
      { field: 'metadata_integrity', operator: '>', value: '0.8' }
    ],
    actions: [
      { type: 'deep_analysis', params: { check_tampering: true } }
    ],
    lastUpdate: '2024-02-20',
    triggerCount: 234
  }
];

const mockSources: VerificationSource[] = [
  {
    id: 'source_001',
    name: 'Reuters',
    type: 'news',
    url: 'https://reuters.com',
    reliability: 0.95,
    bias: 'center',
    lastChecked: '2024-03-08 12:00:00',
    enabled: true,
    rateLimit: 1000
  },
  {
    id: 'source_002',
    name: 'Nature Journal',
    type: 'academic',
    url: 'https://nature.com',
    reliability: 0.98,
    bias: 'center',
    lastChecked: '2024-03-08 08:30:00',
    enabled: true,
    rateLimit: 500
  },
  {
    id: 'source_003',
    name: 'Governo Federal',
    type: 'government',
    url: 'https://gov.br',
    reliability: 0.90,
    bias: 'center',
    lastChecked: '2024-03-07 15:20:00',
    enabled: true,
    rateLimit: 200
  },
  {
    id: 'source_004',
    name: 'Wikipedia',
    type: 'organization',
    url: 'https://wikipedia.org',
    reliability: 0.82,
    bias: 'center',
    lastChecked: '2024-03-08 10:45:00',
    enabled: true,
    rateLimit: 2000
  }
];

export default function ContentVerification() {
  const [selectedTab, setSelectedTab] = useState('content');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showRuleDialog, setShowRuleDialog] = useState(false);
  const [showSourceDialog, setShowSourceDialog] = useState(false);
  const { toast } = useToast();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'text-green-500 bg-green-100 dark:bg-green-950';
      case 'rejected': return 'text-red-500 bg-red-100 dark:bg-red-950';
      case 'suspicious': return 'text-yellow-500 bg-yellow-100 dark:bg-yellow-950';
      case 'needs_review': return 'text-blue-500 bg-blue-100 dark:bg-blue-950';
      case 'pending': return 'text-gray-500 bg-gray-100 dark:bg-gray-950';
      default: return 'text-gray-500 bg-gray-100 dark:bg-gray-950';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="h-4 w-4" />;
      case 'article': return <FileText className="h-4 w-4" />;
      case 'image': return <Image className="h-4 w-4" />;
      case 'audio': return <Volume2 className="h-4 w-4" />;
      case 'document': return <FileText className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getBiasColor = (bias: string) => {
    switch (bias) {
      case 'left': return 'text-blue-500';
      case 'right': return 'text-red-500';
      case 'center': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  const formatConfidence = (confidence: number) => {
    return `${Math.round(confidence * 100)}%`;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDuration = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hrs > 0) {
      return `${hrs}h ${mins}m ${secs}s`;
    }
    return `${mins}m ${secs}s`;
  };

  const handleVerifyContent = (contentId: string) => {
    toast({
      title: "Conteúdo verificado",
      description: "O conteúdo foi marcado como verificado",
    });
  };

  const handleRejectContent = (contentId: string) => {
    toast({
      title: "Conteúdo rejeitado",
      description: "O conteúdo foi marcado como rejeitado",
    });
  };

  const handleCreateRule = () => {
    toast({
      title: "Regra criada",
      description: "Nova regra de verificação foi criada",
    });
    setShowRuleDialog(false);
  };

  const handleCreateSource = () => {
    toast({
      title: "Fonte adicionada",
      description: "Nova fonte de verificação foi adicionada",
    });
    setShowSourceDialog(false);
  };

  const handleRunVerification = () => {
    toast({
      title: "Verificação iniciada",
      description: "Processo de verificação em lote foi iniciado",
    });
  };

  const filteredContent = mockContentItems.filter(item => {
    let matches = true;
    
    if (statusFilter !== 'all' && item.status !== statusFilter) matches = false;
    if (typeFilter !== 'all' && item.type !== typeFilter) matches = false;
    if (searchTerm && !item.title.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !item.description?.toLowerCase().includes(searchTerm.toLowerCase())) matches = false;
    
    return matches;
  });

  const totalContent = mockContentItems.length;
  const verifiedContent = mockContentItems.filter(item => item.status === 'verified').length;
  const pendingContent = mockContentItems.filter(item => item.status === 'pending' || item.status === 'needs_review').length;
  const averageConfidence = mockContentItems.reduce((sum, item) => sum + item.confidence, 0) / totalContent;

  return (
    <div className="container mx-auto px-6 py-8 max-w-7xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-teal-600 rounded-lg flex items-center justify-center">
              <ShieldCheck className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Verificação de Conteúdo</h1>
              <p className="text-muted-foreground">Sistema inteligente de verificação e autenticação</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button onClick={handleRunVerification} data-testid="button-run-verification">
              <Play className="h-4 w-4 mr-2" />
              Executar Verificação
            </Button>
            
            <Button variant="outline" data-testid="button-verification-settings">
              <Settings className="h-4 w-4 mr-2" />
              Configurações
            </Button>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total de Conteúdo</p>
                  <p className="text-2xl font-bold">{totalContent}</p>
                  <p className="text-xs text-blue-500 flex items-center mt-1">
                    <Database className="h-3 w-3 mr-1" />
                    Itens analisados
                  </p>
                </div>
                <FileText className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Conteúdo Verificado</p>
                  <p className="text-2xl font-bold">{verifiedContent}</p>
                  <p className="text-xs text-green-500 flex items-center mt-1">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    {Math.round((verifiedContent / totalContent) * 100)}% do total
                  </p>
                </div>
                <ShieldCheck className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pendente Análise</p>
                  <p className="text-2xl font-bold">{pendingContent}</p>
                  <p className="text-xs text-orange-500 flex items-center mt-1">
                    <Clock className="h-3 w-3 mr-1" />
                    Requer atenção
                  </p>
                </div>
                <AlertTriangle className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Confiança Média</p>
                  <p className="text-2xl font-bold">{formatConfidence(averageConfidence)}</p>
                  <p className="text-xs text-purple-500 flex items-center mt-1">
                    <Target className="h-3 w-3 mr-1" />
                    Precisão do sistema
                  </p>
                </div>
                <Target className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="content">Conteúdo</TabsTrigger>
            <TabsTrigger value="rules">Regras</TabsTrigger>
            <TabsTrigger value="sources">Fontes</TabsTrigger>
            <TabsTrigger value="analysis">Análise</TabsTrigger>
            <TabsTrigger value="reports">Relatórios</TabsTrigger>
          </TabsList>

          {/* Conteúdo */}
          <TabsContent value="content" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Conteúdo para Verificação</h3>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar conteúdo..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                    data-testid="input-search-content"
                  />
                </div>
                
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-40" data-testid="select-type-filter">
                    <SelectValue placeholder="Tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="video">Vídeo</SelectItem>
                    <SelectItem value="article">Artigo</SelectItem>
                    <SelectItem value="image">Imagem</SelectItem>
                    <SelectItem value="audio">Áudio</SelectItem>
                    <SelectItem value="document">Documento</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40" data-testid="select-status-filter">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="pending">Pendente</SelectItem>
                    <SelectItem value="verified">Verificado</SelectItem>
                    <SelectItem value="rejected">Rejeitado</SelectItem>
                    <SelectItem value="suspicious">Suspeito</SelectItem>
                    <SelectItem value="needs_review">Revisão Manual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              {filteredContent.map((item) => (
                <Card key={item.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {/* Header do conteúdo */}
                      <div className="flex items-start justify-between">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center space-x-2">
                            {getTypeIcon(item.type)}
                            <h3 className="font-semibold">{item.title}</h3>
                            <Badge className={getStatusColor(item.status)}>
                              {item.status === 'pending' ? 'Pendente' :
                               item.status === 'verified' ? 'Verificado' :
                               item.status === 'rejected' ? 'Rejeitado' :
                               item.status === 'suspicious' ? 'Suspeito' : 'Revisão Manual'}
                            </Badge>
                            <Badge variant="outline">
                              Confiança: {formatConfidence(item.confidence)}
                            </Badge>
                          </div>
                          {item.description && (
                            <p className="text-sm text-muted-foreground">{item.description}</p>
                          )}
                          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                            <span>Criado: {new Date(item.createdAt).toLocaleString('pt-BR')}</span>
                            {item.verifiedAt && <span>Verificado: {new Date(item.verifiedAt).toLocaleString('pt-BR')}</span>}
                            {item.verifiedBy && <span>Por: {item.verifiedBy}</span>}
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="text-lg font-bold">
                            {formatConfidence(item.confidence)}
                          </div>
                          <p className="text-xs text-muted-foreground">Confiança</p>
                        </div>
                      </div>

                      {/* Análise AI */}
                      <div className="space-y-3">
                        <h4 className="text-sm font-medium">Análise AI:</h4>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                          <div className="text-center">
                            <div className="text-lg font-bold text-green-500">
                              {formatConfidence(item.aiAnalysis.authenticity)}
                            </div>
                            <p className="text-xs text-muted-foreground">Autenticidade</p>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-blue-500">
                              {formatConfidence(item.aiAnalysis.quality)}
                            </div>
                            <p className="text-xs text-muted-foreground">Qualidade</p>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-purple-500">
                              {formatConfidence(item.aiAnalysis.credibility)}
                            </div>
                            <p className="text-xs text-muted-foreground">Credibilidade</p>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-orange-500">
                              {formatConfidence(1 - item.aiAnalysis.bias)}
                            </div>
                            <p className="text-xs text-muted-foreground">Imparcialidade</p>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-red-500">
                              {formatConfidence(item.aiAnalysis.factualness)}
                            </div>
                            <p className="text-xs text-muted-foreground">Factualidade</p>
                          </div>
                        </div>
                      </div>

                      {/* Resumo da análise */}
                      <div className="p-3 bg-muted/50 rounded-lg">
                        <p className="text-sm">{item.aiAnalysis.summary}</p>
                      </div>

                      {/* Flags AI */}
                      {item.aiAnalysis.flags.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium">Flags Detectadas:</h4>
                          <div className="flex flex-wrap gap-1">
                            {item.aiAnalysis.flags.map((flag, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {flag.replace('_', ' ')}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Metadata */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="space-y-1">
                          <h4 className="font-medium">Informações Técnicas:</h4>
                          {item.metadata.duration && <p>Duração: {formatDuration(item.metadata.duration)}</p>}
                          {item.metadata.size && <p>Tamanho: {formatFileSize(item.metadata.size)}</p>}
                          {item.metadata.format && <p>Formato: {item.metadata.format}</p>}
                          {item.metadata.resolution && <p>Resolução: {item.metadata.resolution}</p>}
                        </div>
                        <div className="space-y-1">
                          <h4 className="font-medium">Fontes ({item.metadata.sources?.length || 0}):</h4>
                          {item.metadata.sources?.slice(0, 3).map((source, index) => (
                            <p key={index} className="text-muted-foreground">• {source}</p>
                          ))}
                          {(item.metadata.sources?.length || 0) > 3 && (
                            <p className="text-muted-foreground">... e mais {(item.metadata.sources?.length || 0) - 3}</p>
                          )}
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="flex space-x-2">
                          {item.status === 'pending' || item.status === 'needs_review' ? (
                            <>
                              <Button 
                                variant="default" 
                                size="sm"
                                onClick={() => handleVerifyContent(item.id)}
                                data-testid={`button-verify-${item.id}`}
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Verificar
                              </Button>
                              <Button 
                                variant="destructive" 
                                size="sm"
                                onClick={() => handleRejectContent(item.id)}
                                data-testid={`button-reject-${item.id}`}
                              >
                                <XCircle className="h-4 w-4 mr-1" />
                                Rejeitar
                              </Button>
                            </>
                          ) : (
                            <Button variant="outline" size="sm" data-testid={`button-reanalyze-${item.id}`}>
                              <RefreshCw className="h-4 w-4 mr-1" />
                              Reanalisar
                            </Button>
                          )}
                          <Button variant="outline" size="sm" data-testid={`button-details-${item.id}`}>
                            <Info className="h-4 w-4 mr-1" />
                            Ver Detalhes
                          </Button>
                          {item.url && (
                            <Button variant="outline" size="sm" data-testid={`button-view-${item.id}`}>
                              <ExternalLink className="h-4 w-4 mr-1" />
                              Ver Original
                            </Button>
                          )}
                        </div>
                        
                        <div className="text-xs text-muted-foreground">
                          ID: {item.id}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Regras */}
          <TabsContent value="rules" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Regras de Verificação</h3>
              <Dialog open={showRuleDialog} onOpenChange={setShowRuleDialog}>
                <DialogTrigger asChild>
                  <Button data-testid="button-new-rule">
                    <Plus className="h-4 w-4 mr-2" />
                    Nova Regra
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Criar Nova Regra</DialogTitle>
                    <DialogDescription>
                      Configure uma nova regra de verificação automática
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="rule-name">Nome da Regra</Label>
                        <Input id="rule-name" placeholder="Ex: Verificação de Múltiplas Fontes" data-testid="input-rule-name" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="rule-type">Tipo de Verificação</Label>
                        <Select>
                          <SelectTrigger data-testid="select-rule-type">
                            <SelectValue placeholder="Tipo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="source_check">Verificação de Fontes</SelectItem>
                            <SelectItem value="fact_check">Checagem de Fatos</SelectItem>
                            <SelectItem value="quality_check">Verificação de Qualidade</SelectItem>
                            <SelectItem value="bias_check">Detecção de Viés</SelectItem>
                            <SelectItem value="plagiarism_check">Detecção de Plágio</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="rule-threshold">Limite de Confiança</Label>
                        <Input id="rule-threshold" type="number" min="0" max="1" step="0.1" placeholder="0.8" data-testid="input-rule-threshold" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="rule-priority">Prioridade</Label>
                        <Select>
                          <SelectTrigger data-testid="select-rule-priority">
                            <SelectValue placeholder="Prioridade" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Baixa</SelectItem>
                            <SelectItem value="medium">Média</SelectItem>
                            <SelectItem value="high">Alta</SelectItem>
                            <SelectItem value="critical">Crítica</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="rule-description">Descrição</Label>
                      <Textarea 
                        id="rule-description" 
                        placeholder="Descreva como esta regra funciona..."
                        data-testid="textarea-rule-description"
                      />
                    </div>

                    <Button onClick={handleCreateRule} className="w-full" data-testid="button-create-rule">
                      Criar Regra
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="space-y-4">
              {mockRules.map((rule) => (
                <Card key={rule.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {/* Header da regra */}
                      <div className="flex items-center justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <h3 className="font-semibold">{rule.name}</h3>
                            <Badge variant="outline">{rule.type.replace('_', ' ')}</Badge>
                            <Badge className={
                              rule.priority === 'low' ? 'bg-gray-100 text-gray-800' :
                              rule.priority === 'medium' ? 'bg-blue-100 text-blue-800' :
                              rule.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                              'bg-red-100 text-red-800'
                            }>
                              {rule.priority === 'low' ? 'Baixa' :
                               rule.priority === 'medium' ? 'Média' :
                               rule.priority === 'high' ? 'Alta' : 'Crítica'}
                            </Badge>
                            <Switch 
                              checked={rule.enabled}
                              data-testid={`switch-rule-${rule.id}`}
                            />
                          </div>
                          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                            <span>Limite: {formatConfidence(rule.threshold)}</span>
                            <span>Triggers: {rule.triggerCount}</span>
                            <span>Atualizado: {rule.lastUpdate}</span>
                          </div>
                        </div>
                      </div>

                      {/* Condições */}
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Condições:</h4>
                        <div className="space-y-1">
                          {rule.conditions.map((condition, index) => (
                            <div key={index} className="text-sm p-2 bg-muted/50 rounded">
                              <code>{condition.field} {condition.operator} {condition.value}</code>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" data-testid={`button-edit-rule-${rule.id}`}>
                            <Edit className="h-4 w-4 mr-1" />
                            Editar
                          </Button>
                          <Button variant="outline" size="sm" data-testid={`button-test-rule-${rule.id}`}>
                            <Play className="h-4 w-4 mr-1" />
                            Testar
                          </Button>
                          <Button variant="outline" size="sm" data-testid={`button-stats-rule-${rule.id}`}>
                            <BarChart3 className="h-4 w-4 mr-1" />
                            Estatísticas
                          </Button>
                        </div>
                        
                        <div className="text-xs text-muted-foreground">
                          ID: {rule.id}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Fontes */}
          <TabsContent value="sources" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Fontes de Verificação</h3>
              <Dialog open={showSourceDialog} onOpenChange={setShowSourceDialog}>
                <DialogTrigger asChild>
                  <Button data-testid="button-new-source">
                    <Plus className="h-4 w-4 mr-2" />
                    Nova Fonte
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Adicionar Nova Fonte</DialogTitle>
                    <DialogDescription>
                      Configure uma nova fonte para verificação de conteúdo
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="source-name">Nome da Fonte</Label>
                        <Input id="source-name" placeholder="Ex: BBC News" data-testid="input-source-name" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="source-type">Tipo</Label>
                        <Select>
                          <SelectTrigger data-testid="select-source-type">
                            <SelectValue placeholder="Tipo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="news">Notícias</SelectItem>
                            <SelectItem value="academic">Acadêmica</SelectItem>
                            <SelectItem value="government">Governamental</SelectItem>
                            <SelectItem value="expert">Especialista</SelectItem>
                            <SelectItem value="organization">Organização</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="source-url">URL</Label>
                      <Input id="source-url" placeholder="https://exemplo.com" data-testid="input-source-url" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="source-reliability">Confiabilidade</Label>
                        <Input id="source-reliability" type="number" min="0" max="1" step="0.1" placeholder="0.9" data-testid="input-source-reliability" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="source-bias">Orientação Política</Label>
                        <Select>
                          <SelectTrigger data-testid="select-source-bias">
                            <SelectValue placeholder="Orientação" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="left">Esquerda</SelectItem>
                            <SelectItem value="center">Centro</SelectItem>
                            <SelectItem value="right">Direita</SelectItem>
                            <SelectItem value="unknown">Desconhecida</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <Button onClick={handleCreateSource} className="w-full" data-testid="button-create-source">
                      Adicionar Fonte
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockSources.map((source) => (
                <Card key={source.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {/* Header da fonte */}
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Globe className="h-4 w-4" />
                          <h3 className="font-semibold">{source.name}</h3>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">{source.type}</Badge>
                          <Badge className={`${getBiasColor(source.bias)} bg-opacity-10`}>
                            {source.bias === 'left' ? 'Esquerda' :
                             source.bias === 'right' ? 'Direita' :
                             source.bias === 'center' ? 'Centro' : 'Desconhecida'}
                          </Badge>
                          <Switch 
                            checked={source.enabled}
                            data-testid={`switch-source-${source.id}`}
                          />
                        </div>
                      </div>

                      {/* Métricas da fonte */}
                      <div className="space-y-3">
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Confiabilidade</span>
                            <span>{formatConfidence(source.reliability)}</span>
                          </div>
                          <Progress value={source.reliability * 100} className="h-2" />
                        </div>

                        <div className="text-sm">
                          <p>URL: {source.url}</p>
                          <p>Rate Limit: {source.rateLimit} req/h</p>
                          <p>Última verificação: {new Date(source.lastChecked).toLocaleString('pt-BR')}</p>
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" data-testid={`button-edit-source-${source.id}`}>
                            <Edit className="h-4 w-4 mr-1" />
                            Editar
                          </Button>
                          <Button variant="outline" size="sm" data-testid={`button-test-source-${source.id}`}>
                            <RefreshCw className="h-4 w-4 mr-1" />
                            Testar
                          </Button>
                        </div>
                        
                        <div className="text-xs text-muted-foreground">
                          ID: {source.id}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Análise */}
          <TabsContent value="analysis" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Distribuição por Status</CardTitle>
                  <CardDescription>Status de verificação do conteúdo</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { status: 'verified', label: 'Verificado', count: 1, color: 'bg-green-500' },
                      { status: 'needs_review', label: 'Revisão Manual', count: 1, color: 'bg-blue-500' },
                      { status: 'suspicious', label: 'Suspeito', count: 1, color: 'bg-yellow-500' },
                      { status: 'rejected', label: 'Rejeitado', count: 1, color: 'bg-red-500' }
                    ].map((data) => {
                      const percentage = (data.count / totalContent) * 100;
                      
                      return (
                        <div key={data.status} className="space-y-2">
                          <div className="flex justify-between">
                            <span className="font-medium">{data.label}</span>
                            <span className="text-sm text-muted-foreground">{data.count} ({percentage.toFixed(1)}%)</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div 
                              className={`${data.color} h-2 rounded-full transition-all duration-300`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Confiança por Tipo</CardTitle>
                  <CardDescription>Nível médio de confiança por tipo de conteúdo</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {['video', 'article', 'image', 'document'].map((type) => {
                      const items = mockContentItems.filter(item => item.type === type);
                      const avgConfidence = items.length > 0 
                        ? items.reduce((sum, item) => sum + item.confidence, 0) / items.length 
                        : 0;
                      
                      return (
                        <div key={type} className="space-y-2">
                          <div className="flex justify-between">
                            <span className="capitalize font-medium">{type}</span>
                            <span className="text-sm text-muted-foreground">
                              {formatConfidence(avgConfidence)} ({items.length} itens)
                            </span>
                          </div>
                          <Progress value={avgConfidence * 100} className="h-2" />
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Métricas de Verificação</CardTitle>
                <CardDescription>Estatísticas gerais do sistema de verificação</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-green-500">94.3%</div>
                    <p className="text-sm text-muted-foreground">Precisão do Sistema</p>
                  </div>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-blue-500">8.5min</div>
                    <p className="text-sm text-muted-foreground">Tempo Médio de Análise</p>
                  </div>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-purple-500">156</div>
                    <p className="text-sm text-muted-foreground">Itens Verificados (24h)</p>
                  </div>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-orange-500">4.2</div>
                    <p className="text-sm text-muted-foreground">Fontes Médias por Item</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Relatórios */}
          <TabsContent value="reports" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Relatórios de Verificação</h3>
              <Button data-testid="button-generate-report">
                <Download className="h-4 w-4 mr-2" />
                Gerar Relatório
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Relatórios Rápidos</CardTitle>
                  <CardDescription>Relatórios pré-configurados para download</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start" data-testid="button-report-daily">
                    <FileText className="h-4 w-4 mr-2" />
                    Relatório Diário de Verificações
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start" data-testid="button-report-sources">
                    <Globe className="h-4 w-4 mr-2" />
                    Performance das Fontes
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start" data-testid="button-report-confidence">
                    <Target className="h-4 w-4 mr-2" />
                    Análise de Confiança
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start" data-testid="button-report-rejected">
                    <XCircle className="h-4 w-4 mr-2" />
                    Conteúdo Rejeitado
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start" data-testid="button-report-rules">
                    <Shield className="h-4 w-4 mr-2" />
                    Eficiência das Regras
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Histórico de Relatórios</CardTitle>
                  <CardDescription>Relatórios gerados recentemente</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">Verificações - Março 2024</div>
                        <div className="text-sm text-muted-foreground">Gerado em 08/03/2024</div>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" data-testid="button-download-march">
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                        <Button size="sm" variant="outline" data-testid="button-share-march">
                          <Share2 className="h-4 w-4 mr-1" />
                          Compartilhar
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">Performance de Fontes - Fevereiro 2024</div>
                        <div className="text-sm text-muted-foreground">Gerado em 01/03/2024</div>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" data-testid="button-download-feb">
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                        <Button size="sm" variant="outline" data-testid="button-share-feb">
                          <Share2 className="h-4 w-4 mr-1" />
                          Compartilhar
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">Análise de Confiança - Janeiro 2024</div>
                        <div className="text-sm text-muted-foreground">Gerado em 31/01/2024</div>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" data-testid="button-download-jan">
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                        <Button size="sm" variant="outline" data-testid="button-share-jan">
                          <Share2 className="h-4 w-4 mr-1" />
                          Compartilhar
                        </Button>
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