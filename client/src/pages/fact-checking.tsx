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
  Search, 
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  Eye,
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
  Globe,
  Database,
  Server,
  Shield,
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  FileText,
  Link,
  ExternalLink,
  Info,
  HelpCircle,
  AlertCircle,
  Bookmark,
  Archive,
  Mail,
  Send,
  Bell,
  MessageSquare,
  Quote,
  ThumbsUp,
  ThumbsDown,
  Share2,
  Copy,
  Volume2,
  Hash,
  AtSign,
  Percent,
  BookOpen,
  Microscope,
  Lightbulb,
  Crosshair,
  Layers,
  Package,
  Sparkles,
  Fingerprint,
  Key,
  Lock,
  Unlock
} from 'lucide-react';

interface FactCheck {
  id: string;
  claim: string;
  status: 'pending' | 'verified' | 'false' | 'misleading' | 'unverifiable' | 'partially_true';
  confidence: number;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  source: string;
  sourceType: 'video' | 'article' | 'comment' | 'social_media' | 'news';
  createdAt: string;
  completedAt?: string;
  checkedBy?: string;
  evidence: Array<{
    type: 'supporting' | 'contradicting' | 'neutral';
    source: string;
    url?: string;
    credibility: number;
    summary: string;
    date?: string;
  }>;
  verdict: {
    rating: 'true' | 'mostly_true' | 'mixed' | 'mostly_false' | 'false' | 'unverifiable';
    explanation: string;
    keyPoints: string[];
    recommendations: string[];
  };
}

interface FactCheckSource {
  id: string;
  name: string;
  type: 'factcheck_org' | 'academic' | 'government' | 'news' | 'expert' | 'database';
  url: string;
  reliability: number;
  lastUpdate: string;
  coverage: string[];
  apiAvailable: boolean;
  enabled: boolean;
  checkCount: number;
}

interface ClaimPattern {
  id: string;
  name: string;
  pattern: string;
  category: 'conspiracy' | 'medical' | 'political' | 'scientific' | 'historical' | 'economic';
  severity: 'low' | 'medium' | 'high' | 'critical';
  autoFlag: boolean;
  keywords: string[];
  enabled: boolean;
  triggerCount: number;
  lastTriggered?: string;
}

const mockFactChecks: FactCheck[] = [
  {
    id: 'fact_001',
    claim: 'Vacinas causam autismo em crianças',
    status: 'false',
    confidence: 0.98,
    priority: 'high',
    source: 'Comentário no vídeo "Mistérios da Medicina"',
    sourceType: 'comment',
    createdAt: '2024-03-08 14:30:00',
    completedAt: '2024-03-08 16:45:00',
    checkedBy: 'Dr. Maria Silva - Especialista',
    evidence: [
      {
        type: 'contradicting',
        source: 'Centers for Disease Control and Prevention',
        url: 'https://cdc.gov/vaccines/safety/concerns/autism.html',
        credibility: 0.95,
        summary: 'Múltiplos estudos científicos com mais de 1 milhão de crianças demonstram que não há ligação entre vacinas e autismo.',
        date: '2024-02-15'
      },
      {
        type: 'contradicting',
        source: 'The Lancet Medical Journal',
        url: 'https://lancet.com/autism-vaccine-studies',
        credibility: 0.98,
        summary: 'Estudo original que alegava ligação foi retirado por fraude científica comprovada.',
        date: '2010-02-02'
      },
      {
        type: 'contradicting',
        source: 'Organização Mundial da Saúde',
        url: 'https://who.int/vaccine-safety',
        credibility: 0.96,
        summary: 'Posição oficial confirma segurança das vacinas e ausência de ligação com autismo.',
        date: '2024-01-20'
      }
    ],
    verdict: {
      rating: 'false',
      explanation: 'Esta afirmação é completamente falsa e foi refutada por décadas de pesquisa científica rigorosa. O estudo original que alegava esta ligação foi retirado por fraude.',
      keyPoints: [
        'Mais de 20 estudos com milhões de crianças não encontraram ligação',
        'Estudo original foi retirado por fraude científica',
        'Consenso científico mundial confirma segurança das vacinas'
      ],
      recommendations: [
        'Consultar pediatra para informações sobre vacinação',
        'Verificar fontes científicas confiáveis',
        'Ignorar informações de fontes não médicas sobre vacinas'
      ]
    }
  },
  {
    id: 'fact_002',
    claim: 'A Terra é plana e a NASA esconde a verdade',
    status: 'false',
    confidence: 0.99,
    priority: 'medium',
    source: 'Artigo "Teorias que a Ciência Esconde"',
    sourceType: 'article',
    createdAt: '2024-03-07 10:20:00',
    completedAt: '2024-03-07 14:15:00',
    checkedBy: 'Prof. João Santos - Físico',
    evidence: [
      {
        type: 'contradicting',
        source: 'NASA - Evidências Fotográficas',
        url: 'https://nasa.gov/earth-photos',
        credibility: 0.95,
        summary: 'Milhares de fotografias satelitais mostram claramente a curvatura da Terra.',
        date: '2024-03-01'
      },
      {
        type: 'contradicting',
        source: 'Experimentos de Eratóstenes',
        credibility: 0.90,
        summary: 'Método antigo de 240 a.C. ainda funciona para provar a esfericidade da Terra.',
        date: '-240'
      },
      {
        type: 'contradicting',
        source: 'Estações Espaciais Internacionais',
        url: 'https://iss.nasa.gov/live-video',
        credibility: 0.95,
        summary: 'Transmissões ao vivo da ISS mostram constantemente a Terra esférica.',
        date: '2024-03-07'
      }
    ],
    verdict: {
      rating: 'false',
      explanation: 'A Terra é demonstravelmente esférica através de inúmeras evidências científicas, observações e experimentos que qualquer pessoa pode verificar.',
      keyPoints: [
        'Evidências fotográficas de múltiplas fontes independentes',
        'Experimentos simples podem provar a curvatura',
        'Fenômenos como fusos horários só fazem sentido em planeta esférico'
      ],
      recommendations: [
        'Consultar livros de física básica',
        'Observar navios no horizonte',
        'Verificar transmissões ao vivo do espaço'
      ]
    }
  },
  {
    id: 'fact_003',
    claim: 'Chá de erva-doce cura diabetes tipo 2',
    status: 'misleading',
    confidence: 0.85,
    priority: 'high',
    source: 'Vídeo "Remédios Naturais Milagrosos"',
    sourceType: 'video',
    createdAt: '2024-03-06 18:15:00',
    completedAt: '2024-03-06 22:30:00',
    checkedBy: 'Dra. Ana Costa - Endocrinologista',
    evidence: [
      {
        type: 'neutral',
        source: 'Estudos sobre erva-doce',
        credibility: 0.75,
        summary: 'Alguns estudos sugerem propriedades anti-inflamatórias, mas sem evidências de cura para diabetes.',
        date: '2023-08-15'
      },
      {
        type: 'contradicting',
        source: 'Sociedade Brasileira de Diabetes',
        url: 'https://diabetes.org.br/tratamento',
        credibility: 0.92,
        summary: 'Não há evidências científicas de que chás curem diabetes. Tratamento requer medicação e acompanhamento médico.',
        date: '2024-02-10'
      }
    ],
    verdict: {
      rating: 'mostly_false',
      explanation: 'Embora a erva-doce possa ter benefícios para a saúde, não há evidências científicas de que cure diabetes. Afirmações de "cura" são perigosas e podem levar pacientes a abandonar tratamentos eficazes.',
      keyPoints: [
        'Nenhum estudo comprova cura de diabetes por erva-doce',
        'Diabetes tipo 2 requer tratamento médico contínuo',
        'Chás podem complementar, mas nunca substituir tratamento'
      ],
      recommendations: [
        'Sempre consultar endocrinologista',
        'Não abandonar medicação prescrita',
        'Chás podem ser complemento com aprovação médica'
      ]
    }
  },
  {
    id: 'fact_004',
    claim: 'Brasil tem a maior biodiversidade do mundo',
    status: 'verified',
    confidence: 0.92,
    priority: 'low',
    source: 'Documentário "Riquezas Naturais do Brasil"',
    sourceType: 'video',
    createdAt: '2024-03-05 09:30:00',
    completedAt: '2024-03-05 11:20:00',
    checkedBy: 'Prof. Carlos Lima - Biólogo',
    evidence: [
      {
        type: 'supporting',
        source: 'Instituto Brasileiro de Geografia e Estatística',
        url: 'https://ibge.gov.br/biodiversidade',
        credibility: 0.95,
        summary: 'Brasil possui aproximadamente 20% de todas as espécies conhecidas do planeta.',
        date: '2023-12-15'
      },
      {
        type: 'supporting',
        source: 'Ministério do Meio Ambiente',
        url: 'https://mma.gov.br/biodiversidade',
        credibility: 0.90,
        summary: 'Dados oficiais confirmam posição do Brasil como país mais biodiverso.',
        date: '2024-01-20'
      }
    ],
    verdict: {
      rating: 'true',
      explanation: 'O Brasil é reconhecido cientificamente como o país com maior biodiversidade do mundo, abrigando cerca de 20% de todas as espécies conhecidas.',
      keyPoints: [
        'Dados oficiais do governo confirmam a posição',
        'Reconhecimento internacional da comunidade científica',
        'Múltiplos biomas contribuem para essa diversidade'
      ],
      recommendations: [
        'Consultar dados do IBGE para estatísticas detalhadas',
        'Verificar relatórios do Ministério do Meio Ambiente',
        'Acompanhar pesquisas científicas sobre biodiversidade'
      ]
    }
  }
];

const mockSources: FactCheckSource[] = [
  {
    id: 'source_001',
    name: 'FactCheck.org',
    type: 'factcheck_org',
    url: 'https://factcheck.org',
    reliability: 0.95,
    lastUpdate: '2024-03-08 12:00:00',
    coverage: ['política', 'saúde', 'ciência'],
    apiAvailable: true,
    enabled: true,
    checkCount: 2456
  },
  {
    id: 'source_002',
    name: 'Fapesp - Pesquisa Científica',
    type: 'academic',
    url: 'https://fapesp.br',
    reliability: 0.98,
    lastUpdate: '2024-03-08 08:30:00',
    coverage: ['ciência', 'medicina', 'tecnologia'],
    apiAvailable: false,
    enabled: true,
    checkCount: 1234
  },
  {
    id: 'source_003',
    name: 'Ministério da Saúde',
    type: 'government',
    url: 'https://saude.gov.br',
    reliability: 0.90,
    lastUpdate: '2024-03-07 15:20:00',
    coverage: ['saúde', 'medicina', 'prevenção'],
    apiAvailable: true,
    enabled: true,
    checkCount: 987
  },
  {
    id: 'source_004',
    name: 'Reuters Fact Check',
    type: 'news',
    url: 'https://reuters.com/fact-check',
    reliability: 0.92,
    lastUpdate: '2024-03-08 10:45:00',
    coverage: ['notícias', 'política', 'economia'],
    apiAvailable: true,
    enabled: true,
    checkCount: 3456
  }
];

const mockPatterns: ClaimPattern[] = [
  {
    id: 'pattern_001',
    name: 'Teorias Anti-Vacina',
    pattern: '(vacina|vacinação).*(causa|provoca).*(autismo|morte|doença)',
    category: 'medical',
    severity: 'critical',
    autoFlag: true,
    keywords: ['vacina causa autismo', 'vacinação perigosa', 'vacina mata'],
    enabled: true,
    triggerCount: 23,
    lastTriggered: '2024-03-08'
  },
  {
    id: 'pattern_002',
    name: 'Terra Plana',
    pattern: '(terra|planeta).*(plana|achatada|disco)',
    category: 'conspiracy',
    severity: 'medium',
    autoFlag: true,
    keywords: ['terra plana', 'nasa mentira', 'planeta disco'],
    enabled: true,
    triggerCount: 15,
    lastTriggered: '2024-03-07'
  },
  {
    id: 'pattern_003',
    name: 'Curas Milagrosas',
    pattern: '(cura|elimina|remove).*(câncer|diabetes|aids|covid)',
    category: 'medical',
    severity: 'high',
    autoFlag: true,
    keywords: ['cura câncer', 'elimina diabetes', 'remove aids'],
    enabled: true,
    triggerCount: 34,
    lastTriggered: '2024-03-06'
  },
  {
    id: 'pattern_004',
    name: 'Conspirações Políticas',
    pattern: '(governo|elite).*(controla|manipula|esconde)',
    category: 'political',
    severity: 'medium',
    autoFlag: false,
    keywords: ['governo esconde', 'elite controla', 'manipulação'],
    enabled: true,
    triggerCount: 67,
    lastTriggered: '2024-03-05'
  }
];

export default function FactChecking() {
  const [selectedTab, setSelectedTab] = useState('claims');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showClaimDialog, setShowClaimDialog] = useState(false);
  const [showPatternDialog, setShowPatternDialog] = useState(false);
  const { toast } = useToast();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'text-green-500 bg-green-100 dark:bg-green-950';
      case 'false': return 'text-red-500 bg-red-100 dark:bg-red-950';
      case 'misleading': return 'text-orange-500 bg-orange-100 dark:bg-orange-950';
      case 'partially_true': return 'text-blue-500 bg-blue-100 dark:bg-blue-950';
      case 'unverifiable': return 'text-gray-500 bg-gray-100 dark:bg-gray-950';
      case 'pending': return 'text-yellow-500 bg-yellow-100 dark:bg-yellow-950';
      default: return 'text-gray-500 bg-gray-100 dark:bg-gray-950';
    }
  };

  const getVerdictColor = (rating: string) => {
    switch (rating) {
      case 'true': return 'text-green-600 bg-green-100 dark:bg-green-950';
      case 'mostly_true': return 'text-green-500 bg-green-50 dark:bg-green-950';
      case 'mixed': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-950';
      case 'mostly_false': return 'text-orange-600 bg-orange-100 dark:bg-orange-950';
      case 'false': return 'text-red-600 bg-red-100 dark:bg-red-950';
      case 'unverifiable': return 'text-gray-600 bg-gray-100 dark:bg-gray-950';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-950';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-gray-100 text-gray-800 dark:bg-gray-950';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950';
      case 'high': return 'bg-orange-100 text-orange-800 dark:bg-orange-950';
      case 'critical': return 'bg-red-100 text-red-800 dark:bg-red-950';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-950';
    }
  };

  const formatConfidence = (confidence: number) => {
    return `${Math.round(confidence * 100)}%`;
  };

  const handleVerifyClaim = (claimId: string) => {
    toast({
      title: "Claim verificado",
      description: "O claim foi marcado como verificado",
    });
  };

  const handleRejectClaim = (claimId: string) => {
    toast({
      title: "Claim rejeitado",
      description: "O claim foi marcado como falso",
    });
  };

  const handleCreateClaim = () => {
    toast({
      title: "Claim adicionado",
      description: "Novo claim foi adicionado para verificação",
    });
    setShowClaimDialog(false);
  };

  const handleCreatePattern = () => {
    toast({
      title: "Padrão criado",
      description: "Novo padrão de detecção foi criado",
    });
    setShowPatternDialog(false);
  };

  const filteredClaims = mockFactChecks.filter(claim => {
    let matches = true;
    
    if (statusFilter !== 'all' && claim.status !== statusFilter) matches = false;
    if (priorityFilter !== 'all' && claim.priority !== priorityFilter) matches = false;
    if (searchTerm && !claim.claim.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !claim.source.toLowerCase().includes(searchTerm.toLowerCase())) matches = false;
    
    return matches;
  });

  const totalClaims = mockFactChecks.length;
  const verifiedClaims = mockFactChecks.filter(claim => claim.status === 'verified').length;
  const falseClaims = mockFactChecks.filter(claim => claim.status === 'false').length;
  const pendingClaims = mockFactChecks.filter(claim => claim.status === 'pending').length;

  return (
    <div className="container mx-auto px-6 py-8 max-w-7xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <Search className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Fact-Checking</h1>
              <p className="text-muted-foreground">Sistema inteligente de verificação de fatos</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Dialog open={showClaimDialog} onOpenChange={setShowClaimDialog}>
              <DialogTrigger asChild>
                <Button data-testid="button-new-claim">
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Claim
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Adicionar Claim para Verificação</DialogTitle>
                  <DialogDescription>
                    Submeta um claim para verificação de fatos
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="claim-text">Texto do Claim</Label>
                    <Textarea 
                      id="claim-text" 
                      placeholder="Digite o claim que precisa ser verificado..."
                      className="min-h-[100px]"
                      data-testid="textarea-claim-text"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="claim-source">Fonte</Label>
                      <Input id="claim-source" placeholder="Onde foi encontrado" data-testid="input-claim-source" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="claim-priority">Prioridade</Label>
                      <Select>
                        <SelectTrigger data-testid="select-claim-priority">
                          <SelectValue placeholder="Prioridade" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Baixa</SelectItem>
                          <SelectItem value="medium">Média</SelectItem>
                          <SelectItem value="high">Alta</SelectItem>
                          <SelectItem value="urgent">Urgente</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="claim-category">Categoria</Label>
                    <Select>
                      <SelectTrigger data-testid="select-claim-category">
                        <SelectValue placeholder="Categoria do claim" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="medical">Médico/Saúde</SelectItem>
                        <SelectItem value="political">Político</SelectItem>
                        <SelectItem value="scientific">Científico</SelectItem>
                        <SelectItem value="historical">Histórico</SelectItem>
                        <SelectItem value="conspiracy">Conspiratório</SelectItem>
                        <SelectItem value="economic">Econômico</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button onClick={handleCreateClaim} className="w-full" data-testid="button-create-claim">
                    Adicionar para Verificação
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            
            <Button variant="outline" data-testid="button-fact-check-settings">
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
                  <p className="text-sm font-medium text-muted-foreground">Total de Claims</p>
                  <p className="text-2xl font-bold">{totalClaims}</p>
                  <p className="text-xs text-blue-500 flex items-center mt-1">
                    <Search className="h-3 w-3 mr-1" />
                    Analisados
                  </p>
                </div>
                <Search className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Verificados Verdadeiros</p>
                  <p className="text-2xl font-bold">{verifiedClaims}</p>
                  <p className="text-xs text-green-500 flex items-center mt-1">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    {Math.round((verifiedClaims / totalClaims) * 100)}% do total
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Claims Falsos</p>
                  <p className="text-2xl font-bold">{falseClaims}</p>
                  <p className="text-xs text-red-500 flex items-center mt-1">
                    <XCircle className="h-3 w-3 mr-1" />
                    {Math.round((falseClaims / totalClaims) * 100)}% do total
                  </p>
                </div>
                <XCircle className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pendente Análise</p>
                  <p className="text-2xl font-bold">{pendingClaims}</p>
                  <p className="text-xs text-orange-500 flex items-center mt-1">
                    <Clock className="h-3 w-3 mr-1" />
                    Aguardando
                  </p>
                </div>
                <Clock className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="claims">Claims</TabsTrigger>
            <TabsTrigger value="sources">Fontes</TabsTrigger>
            <TabsTrigger value="patterns">Padrões</TabsTrigger>
            <TabsTrigger value="analysis">Análise</TabsTrigger>
            <TabsTrigger value="reports">Relatórios</TabsTrigger>
          </TabsList>

          {/* Claims */}
          <TabsContent value="claims" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Claims para Verificação</h3>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar claims..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                    data-testid="input-search-claims"
                  />
                </div>
                
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40" data-testid="select-status-filter">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="pending">Pendente</SelectItem>
                    <SelectItem value="verified">Verificado</SelectItem>
                    <SelectItem value="false">Falso</SelectItem>
                    <SelectItem value="misleading">Enganoso</SelectItem>
                    <SelectItem value="partially_true">Parcialmente Verdadeiro</SelectItem>
                    <SelectItem value="unverifiable">Não Verificável</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger className="w-40" data-testid="select-priority-filter">
                    <SelectValue placeholder="Prioridade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    <SelectItem value="low">Baixa</SelectItem>
                    <SelectItem value="medium">Média</SelectItem>
                    <SelectItem value="high">Alta</SelectItem>
                    <SelectItem value="urgent">Urgente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              {filteredClaims.map((claim) => (
                <Card key={claim.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {/* Header do claim */}
                      <div className="flex items-start justify-between">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center space-x-2">
                            <h3 className="font-semibold text-lg">{claim.claim}</h3>
                            <Badge className={getStatusColor(claim.status)}>
                              {claim.status === 'pending' ? 'Pendente' :
                               claim.status === 'verified' ? 'Verificado' :
                               claim.status === 'false' ? 'Falso' :
                               claim.status === 'misleading' ? 'Enganoso' :
                               claim.status === 'partially_true' ? 'Parcialmente Verdadeiro' : 'Não Verificável'}
                            </Badge>
                            {claim.verdict && (
                              <Badge className={getVerdictColor(claim.verdict.rating)}>
                                {claim.verdict.rating === 'true' ? 'Verdadeiro' :
                                 claim.verdict.rating === 'mostly_true' ? 'Mostly True' :
                                 claim.verdict.rating === 'mixed' ? 'Misto' :
                                 claim.verdict.rating === 'mostly_false' ? 'Mostly False' :
                                 claim.verdict.rating === 'false' ? 'Falso' : 'Não Verificável'}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Fonte: {claim.source} | Criado: {new Date(claim.createdAt).toLocaleString('pt-BR')}
                          </p>
                          {claim.completedAt && claim.checkedBy && (
                            <p className="text-sm text-muted-foreground">
                              Verificado em {new Date(claim.completedAt).toLocaleString('pt-BR')} por {claim.checkedBy}
                            </p>
                          )}
                        </div>
                        
                        <div className="text-right">
                          <div className="text-lg font-bold">
                            {formatConfidence(claim.confidence)}
                          </div>
                          <p className="text-xs text-muted-foreground">Confiança</p>
                        </div>
                      </div>

                      {/* Veredicto */}
                      {claim.verdict && (
                        <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
                          <h4 className="font-medium">Veredicto:</h4>
                          <p className="text-sm">{claim.verdict.explanation}</p>
                          
                          {claim.verdict.keyPoints.length > 0 && (
                            <div>
                              <h5 className="text-sm font-medium mb-2">Pontos-chave:</h5>
                              <ul className="text-sm space-y-1">
                                {claim.verdict.keyPoints.map((point, index) => (
                                  <li key={index} className="flex items-start space-x-2">
                                    <span className="text-blue-500 mt-1">•</span>
                                    <span>{point}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Evidências */}
                      {claim.evidence.length > 0 && (
                        <div className="space-y-3">
                          <h4 className="font-medium">Evidências ({claim.evidence.length}):</h4>
                          <div className="space-y-2">
                            {claim.evidence.slice(0, 3).map((evidence, index) => (
                              <div key={index} className="flex items-start space-x-3 p-3 border rounded-lg">
                                <div className={`w-2 h-2 rounded-full mt-2 ${
                                  evidence.type === 'supporting' ? 'bg-green-500' :
                                  evidence.type === 'contradicting' ? 'bg-red-500' : 'bg-gray-500'
                                }`} />
                                <div className="flex-1">
                                  <div className="flex items-center space-x-2 mb-1">
                                    <span className="font-medium text-sm">{evidence.source}</span>
                                    <Badge variant="outline" className="text-xs">
                                      {formatConfidence(evidence.credibility)} confiável
                                    </Badge>
                                    {evidence.date && (
                                      <span className="text-xs text-muted-foreground">{evidence.date}</span>
                                    )}
                                  </div>
                                  <p className="text-sm text-muted-foreground">{evidence.summary}</p>
                                  {evidence.url && (
                                    <Button variant="link" size="sm" className="h-auto p-0 mt-1" data-testid={`button-evidence-${index}`}>
                                      <ExternalLink className="h-3 w-3 mr-1" />
                                      Ver fonte
                                    </Button>
                                  )}
                                </div>
                              </div>
                            ))}
                            {claim.evidence.length > 3 && (
                              <p className="text-sm text-muted-foreground">
                                ... e mais {claim.evidence.length - 3} evidências
                              </p>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="flex space-x-2">
                          {claim.status === 'pending' ? (
                            <>
                              <Button 
                                variant="default" 
                                size="sm"
                                onClick={() => handleVerifyClaim(claim.id)}
                                data-testid={`button-verify-${claim.id}`}
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Verificar
                              </Button>
                              <Button 
                                variant="destructive" 
                                size="sm"
                                onClick={() => handleRejectClaim(claim.id)}
                                data-testid={`button-reject-${claim.id}`}
                              >
                                <XCircle className="h-4 w-4 mr-1" />
                                Marcar Falso
                              </Button>
                            </>
                          ) : (
                            <Button variant="outline" size="sm" data-testid={`button-recheck-${claim.id}`}>
                              <RefreshCw className="h-4 w-4 mr-1" />
                              Reverificar
                            </Button>
                          )}
                          <Button variant="outline" size="sm" data-testid={`button-details-${claim.id}`}>
                            <Info className="h-4 w-4 mr-1" />
                            Ver Detalhes
                          </Button>
                        </div>
                        
                        <div className="text-xs text-muted-foreground">
                          ID: {claim.id}
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
              <h3 className="text-lg font-semibold">Fontes de Fact-Checking</h3>
              <Button data-testid="button-add-source">
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Fonte
              </Button>
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
                          <Badge variant="outline">{source.type.replace('_', ' ')}</Badge>
                          {source.apiAvailable && (
                            <Badge className="bg-green-100 text-green-800">API</Badge>
                          )}
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

                        <div className="text-sm space-y-1">
                          <p>Verificações: {source.checkCount.toLocaleString()}</p>
                          <p>Última atualização: {new Date(source.lastUpdate).toLocaleString('pt-BR')}</p>
                          <p>Cobertura: {source.coverage.join(', ')}</p>
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

          {/* Padrões */}
          <TabsContent value="patterns" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Padrões de Detecção</h3>
              <Dialog open={showPatternDialog} onOpenChange={setShowPatternDialog}>
                <DialogTrigger asChild>
                  <Button data-testid="button-new-pattern">
                    <Target className="h-4 w-4 mr-2" />
                    Novo Padrão
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Criar Novo Padrão</DialogTitle>
                    <DialogDescription>
                      Configure um novo padrão para detecção automática de claims
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="pattern-name">Nome do Padrão</Label>
                        <Input id="pattern-name" placeholder="Ex: Teorias Anti-Vacina" data-testid="input-pattern-name" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="pattern-category">Categoria</Label>
                        <Select>
                          <SelectTrigger data-testid="select-pattern-category">
                            <SelectValue placeholder="Categoria" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="medical">Médico</SelectItem>
                            <SelectItem value="political">Político</SelectItem>
                            <SelectItem value="scientific">Científico</SelectItem>
                            <SelectItem value="historical">Histórico</SelectItem>
                            <SelectItem value="conspiracy">Conspiratório</SelectItem>
                            <SelectItem value="economic">Econômico</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="pattern-severity">Severidade</Label>
                        <Select>
                          <SelectTrigger data-testid="select-pattern-severity">
                            <SelectValue placeholder="Severidade" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Baixa</SelectItem>
                            <SelectItem value="medium">Média</SelectItem>
                            <SelectItem value="high">Alta</SelectItem>
                            <SelectItem value="critical">Crítica</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center space-x-2 pt-6">
                        <Switch data-testid="switch-auto-flag" />
                        <Label className="text-sm">Auto-flagging</Label>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="pattern-regex">Padrão (RegEx)</Label>
                      <Input id="pattern-regex" placeholder="(palavra1|palavra2).*(causa|provoca)" data-testid="input-pattern-regex" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="pattern-keywords">Palavras-chave (separadas por vírgula)</Label>
                      <Textarea 
                        id="pattern-keywords" 
                        placeholder="palavra1, palavra2, frase de exemplo"
                        data-testid="textarea-pattern-keywords"
                      />
                    </div>

                    <Button onClick={handleCreatePattern} className="w-full" data-testid="button-create-pattern">
                      Criar Padrão
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="space-y-4">
              {mockPatterns.map((pattern) => (
                <Card key={pattern.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {/* Header do padrão */}
                      <div className="flex items-center justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <h3 className="font-semibold">{pattern.name}</h3>
                            <Badge className={getSeverityColor(pattern.severity)}>
                              {pattern.severity === 'low' ? 'Baixa' :
                               pattern.severity === 'medium' ? 'Média' :
                               pattern.severity === 'high' ? 'Alta' : 'Crítica'}
                            </Badge>
                            <Badge variant="outline">{pattern.category}</Badge>
                            {pattern.autoFlag && (
                              <Badge className="bg-blue-100 text-blue-800">Auto-flag</Badge>
                            )}
                            <Switch 
                              checked={pattern.enabled}
                              data-testid={`switch-pattern-${pattern.id}`}
                            />
                          </div>
                          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                            <span>Triggers: {pattern.triggerCount}</span>
                            {pattern.lastTriggered && <span>Último: {pattern.lastTriggered}</span>}
                          </div>
                        </div>
                      </div>

                      {/* Padrão */}
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Padrão RegEx:</h4>
                        <div className="p-3 bg-muted/50 rounded-lg">
                          <code className="text-sm">{pattern.pattern}</code>
                        </div>
                      </div>

                      {/* Keywords */}
                      {pattern.keywords.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium">Palavras-chave:</h4>
                          <div className="flex flex-wrap gap-1">
                            {pattern.keywords.slice(0, 5).map((keyword, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {keyword}
                              </Badge>
                            ))}
                            {pattern.keywords.length > 5 && (
                              <Badge variant="outline" className="text-xs">
                                +{pattern.keywords.length - 5} mais
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" data-testid={`button-edit-pattern-${pattern.id}`}>
                            <Edit className="h-4 w-4 mr-1" />
                            Editar
                          </Button>
                          <Button variant="outline" size="sm" data-testid={`button-test-pattern-${pattern.id}`}>
                            <Play className="h-4 w-4 mr-1" />
                            Testar
                          </Button>
                          <Button variant="outline" size="sm" data-testid={`button-stats-pattern-${pattern.id}`}>
                            <BarChart3 className="h-4 w-4 mr-1" />
                            Estatísticas
                          </Button>
                        </div>
                        
                        <div className="text-xs text-muted-foreground">
                          ID: {pattern.id}
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
                  <CardTitle>Distribuição de Veredictos</CardTitle>
                  <CardDescription>Resultado das verificações de fatos</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { verdict: 'true', label: 'Verdadeiro', count: 1, color: 'bg-green-500' },
                      { verdict: 'false', label: 'Falso', count: 2, color: 'bg-red-500' },
                      { verdict: 'misleading', label: 'Enganoso', count: 1, color: 'bg-orange-500' }
                    ].map((data) => {
                      const percentage = (data.count / totalClaims) * 100;
                      
                      return (
                        <div key={data.verdict} className="space-y-2">
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
                  <CardTitle>Categorias Mais Verificadas</CardTitle>
                  <CardDescription>Tipos de claims mais comuns</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { category: 'Médico', count: 2, triggers: 57 },
                      { category: 'Conspiratório', count: 1, triggers: 15 },
                      { category: 'Científico', count: 1, triggers: 23 }
                    ].map((data, index) => (
                      <div key={data.category} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center text-sm font-bold">
                            {index + 1}
                          </div>
                          <div>
                            <div className="font-medium">{data.category}</div>
                            <div className="text-sm text-muted-foreground">{data.triggers} triggers</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold">{data.count}</div>
                          <div className="text-sm text-muted-foreground">claims</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Métricas de Fact-Checking</CardTitle>
                <CardDescription>Estatísticas gerais do sistema</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-green-500">96.2%</div>
                    <p className="text-sm text-muted-foreground">Precisão das Verificações</p>
                  </div>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-blue-500">4.8h</div>
                    <p className="text-sm text-muted-foreground">Tempo Médio de Verificação</p>
                  </div>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-purple-500">127</div>
                    <p className="text-sm text-muted-foreground">Claims Verificados (30d)</p>
                  </div>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-orange-500">8.3</div>
                    <p className="text-sm text-muted-foreground">Evidências Médias por Claim</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Relatórios */}
          <TabsContent value="reports" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Relatórios de Fact-Checking</h3>
              <Button data-testid="button-generate-fact-report">
                <Download className="h-4 w-4 mr-2" />
                Gerar Relatório
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Relatórios Rápidos</CardTitle>
                  <CardDescription>Relatórios pré-configurados</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start" data-testid="button-report-claims">
                    <Search className="h-4 w-4 mr-2" />
                    Relatório de Claims Verificados
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start" data-testid="button-report-false-claims">
                    <XCircle className="h-4 w-4 mr-2" />
                    Claims Falsos Detectados
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start" data-testid="button-report-patterns">
                    <Target className="h-4 w-4 mr-2" />
                    Performance dos Padrões
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start" data-testid="button-report-sources">
                    <Globe className="h-4 w-4 mr-2" />
                    Eficiência das Fontes
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start" data-testid="button-report-categories">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Análise por Categoria
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
                        <div className="font-medium">Fact-Checking - Março 2024</div>
                        <div className="text-sm text-muted-foreground">Gerado em 08/03/2024</div>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" data-testid="button-download-fact-march">
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                        <Button size="sm" variant="outline" data-testid="button-share-fact-march">
                          <Share2 className="h-4 w-4 mr-1" />
                          Compartilhar
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">Claims Falsos - Fevereiro 2024</div>
                        <div className="text-sm text-muted-foreground">Gerado em 01/03/2024</div>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" data-testid="button-download-false-feb">
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                        <Button size="sm" variant="outline" data-testid="button-share-false-feb">
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