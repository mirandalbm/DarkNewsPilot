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
  Shield, 
  ShieldAlert,
  ShieldCheck,
  ShieldX,
  Eye,
  EyeOff,
  Ban,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  MessageSquare,
  Video,
  Image,
  User,
  Users,
  Flag,
  Filter,
  Search,
  Plus,
  Edit,
  Trash2,
  Download,
  Upload,
  RefreshCw,
  Settings,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Activity,
  Zap,
  Target,
  Globe,
  Calendar,
  Timer,
  PlayCircle,
  PauseCircle,
  StopCircle,
  AlertCircle,
  Info,
  HelpCircle,
  ExternalLink,
  Archive,
  Bookmark,
  Star,
  Heart,
  ThumbsUp,
  ThumbsDown,
  Reply,
  Forward,
  Share2,
  Copy,
  Link,
  Mail,
  Send,
  Bell,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Camera,
  CameraOff,
  Lock,
  Unlock,
  Key,
  Database,
  Server,
  Wifi,
  WifiOff,
  Monitor,
  Smartphone,
  Tablet
} from 'lucide-react';

interface ModerationRule {
  id: string;
  name: string;
  type: 'comment' | 'video' | 'thumbnail' | 'title' | 'description';
  action: 'auto_approve' | 'auto_reject' | 'hold_review' | 'flag' | 'delete';
  severity: 'low' | 'medium' | 'high' | 'critical';
  enabled: boolean;
  conditions: Array<{
    field: string;
    operator: string;
    value: string;
  }>;
  keywords: string[];
  whitelist: string[];
  createdAt: string;
  lastTriggered?: string;
  triggerCount: number;
}

interface ModerationCase {
  id: string;
  type: 'comment' | 'video' | 'thumbnail' | 'user_report';
  content: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected' | 'escalated';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  reportedBy: string;
  assignedTo?: string;
  createdAt: string;
  resolvedAt?: string;
  metadata: {
    videoId?: string;
    commentId?: string;
    userId?: string;
    confidence?: number;
    aiFlags?: string[];
  };
}

interface ContentPolicy {
  id: string;
  name: string;
  category: 'harassment' | 'spam' | 'adult' | 'violence' | 'hate_speech' | 'copyright' | 'misinformation';
  description: string;
  enabled: boolean;
  autoAction: 'approve' | 'reject' | 'review';
  keywords: string[];
  patterns: string[];
  confidence: number;
  exceptions: string[];
}

interface ModerationStats {
  totalReviewed: number;
  autoApproved: number;
  autoRejected: number;
  pendingReview: number;
  accuracy: number;
  avgResponseTime: number;
  flaggedContent: number;
  appeals: number;
}

const mockRules: ModerationRule[] = [
  {
    id: 'rule_001',
    name: 'Filtro de Palavrões',
    type: 'comment',
    action: 'auto_reject',
    severity: 'medium',
    enabled: true,
    conditions: [
      { field: 'content', operator: 'contains', value: 'profanity_list' }
    ],
    keywords: ['palavrão1', 'palavrão2', 'ofensa'],
    whitelist: [],
    createdAt: '2024-01-15',
    lastTriggered: '2024-03-08',
    triggerCount: 245
  },
  {
    id: 'rule_002',
    name: 'Detector de Spam',
    type: 'comment',
    action: 'hold_review',
    severity: 'high',
    enabled: true,
    conditions: [
      { field: 'links_count', operator: '>', value: '2' },
      { field: 'caps_ratio', operator: '>', value: '0.8' }
    ],
    keywords: ['compre agora', 'clique aqui', 'promoção'],
    whitelist: ['canal oficial'],
    createdAt: '2024-01-20',
    lastTriggered: '2024-03-07',
    triggerCount: 156
  },
  {
    id: 'rule_003',
    name: 'Conteúdo Adulto',
    type: 'video',
    action: 'flag',
    severity: 'critical',
    enabled: true,
    conditions: [
      { field: 'ai_confidence', operator: '>', value: '0.85' }
    ],
    keywords: ['adulto', 'sexual', 'nudez'],
    whitelist: [],
    createdAt: '2024-02-01',
    lastTriggered: '2024-03-05',
    triggerCount: 12
  },
  {
    id: 'rule_004',
    name: 'Thumbnail Inapropriada',
    type: 'thumbnail',
    action: 'hold_review',
    severity: 'medium',
    enabled: true,
    conditions: [
      { field: 'explicit_content', operator: '>', value: '0.7' }
    ],
    keywords: [],
    whitelist: [],
    createdAt: '2024-02-10',
    triggerCount: 34
  }
];

const mockCases: ModerationCase[] = [
  {
    id: 'case_001',
    type: 'comment',
    content: 'Este vídeo é fake! Vocês só querem views!',
    reason: 'Possível desinformação detectada',
    status: 'pending',
    priority: 'medium',
    reportedBy: 'Sistema AI',
    createdAt: '2024-03-08 14:30:00',
    metadata: {
      videoId: 'video_123',
      commentId: 'comment_456',
      confidence: 0.75,
      aiFlags: ['negative_sentiment', 'fake_claim']
    }
  },
  {
    id: 'case_002',
    type: 'video',
    content: 'Vídeo: "Teorias Conspiratórias Sobre Alienígenas"',
    reason: 'Conteúdo pode promover desinformação',
    status: 'approved',
    priority: 'low',
    reportedBy: 'Usuário@exemplo.com',
    assignedTo: 'Moderador#001',
    createdAt: '2024-03-07 16:20:00',
    resolvedAt: '2024-03-07 18:45:00',
    metadata: {
      videoId: 'video_789',
      confidence: 0.45,
      aiFlags: ['conspiracy_theory']
    }
  },
  {
    id: 'case_003',
    type: 'user_report',
    content: 'Usuário postando spam nos comentários',
    reason: 'Spam reportado por múltiplos usuários',
    status: 'rejected',
    priority: 'high',
    reportedBy: '5 usuários',
    assignedTo: 'Moderador#002',
    createdAt: '2024-03-06 10:15:00',
    resolvedAt: '2024-03-06 11:30:00',
    metadata: {
      userId: 'user_999',
      confidence: 0.92,
      aiFlags: ['spam_pattern', 'multiple_reports']
    }
  }
];

const mockPolicies: ContentPolicy[] = [
  {
    id: 'policy_001',
    name: 'Anti-Assédio',
    category: 'harassment',
    description: 'Detecta e previne comentários de assédio ou bullying',
    enabled: true,
    autoAction: 'reject',
    keywords: ['idiota', 'burro', 'vai morrer'],
    patterns: ['ameaça de morte', 'assédio sexual'],
    confidence: 0.8,
    exceptions: ['contexto educativo']
  },
  {
    id: 'policy_002',
    name: 'Detector de Spam',
    category: 'spam',
    description: 'Identifica padrões de spam em comentários',
    enabled: true,
    autoAction: 'review',
    keywords: ['compre', 'promoção', 'desconto'],
    patterns: ['múltiplos links', 'texto repetitivo'],
    confidence: 0.75,
    exceptions: ['links oficiais']
  },
  {
    id: 'policy_003',
    name: 'Conteúdo Adulto',
    category: 'adult',
    description: 'Detecta conteúdo adulto em vídeos e thumbnails',
    enabled: true,
    autoAction: 'reject',
    keywords: ['sexual', 'nudez', 'adulto'],
    patterns: ['exposição corporal', 'linguagem sexual'],
    confidence: 0.9,
    exceptions: []
  }
];

export default function Moderation() {
  const [selectedTab, setSelectedTab] = useState('dashboard');
  const [caseFilter, setCaseFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showRuleDialog, setShowRuleDialog] = useState(false);
  const [showPolicyDialog, setShowPolicyDialog] = useState(false);
  const { toast } = useToast();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-500 bg-yellow-100 dark:bg-yellow-950';
      case 'approved': return 'text-green-500 bg-green-100 dark:bg-green-950';
      case 'rejected': return 'text-red-500 bg-red-100 dark:bg-red-950';
      case 'escalated': return 'text-purple-500 bg-purple-100 dark:bg-purple-950';
      default: return 'text-gray-500 bg-gray-100 dark:bg-gray-950';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'text-gray-500';
      case 'medium': return 'text-yellow-500';
      case 'high': return 'text-orange-500';
      case 'urgent': return 'text-red-500';
      default: return 'text-gray-500';
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

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'comment': return <MessageSquare className="h-4 w-4" />;
      case 'video': return <Video className="h-4 w-4" />;
      case 'thumbnail': return <Image className="h-4 w-4" />;
      case 'user_report': return <Flag className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('pt-BR');
  };

  const handleApproveCase = (caseId: string) => {
    toast({
      title: "Caso aprovado",
      description: "O conteúdo foi aprovado e liberado",
    });
  };

  const handleRejectCase = (caseId: string) => {
    toast({
      title: "Caso rejeitado",
      description: "O conteúdo foi rejeitado e removido",
    });
  };

  const handleCreateRule = () => {
    toast({
      title: "Regra criada",
      description: "Nova regra de moderação foi criada",
    });
    setShowRuleDialog(false);
  };

  const handleCreatePolicy = () => {
    toast({
      title: "Política criada",
      description: "Nova política de conteúdo foi criada",
    });
    setShowPolicyDialog(false);
  };

  const handleToggleRule = (ruleId: string) => {
    toast({
      title: "Regra atualizada",
      description: "Status da regra foi alterado",
    });
  };

  const mockStats: ModerationStats = {
    totalReviewed: 8945,
    autoApproved: 7234,
    autoRejected: 1456,
    pendingReview: 255,
    accuracy: 94.8,
    avgResponseTime: 12.5,
    flaggedContent: 89,
    appeals: 23
  };

  const filteredCases = mockCases.filter(case_ => {
    let matches = true;
    
    if (caseFilter !== 'all' && case_.type !== caseFilter) matches = false;
    if (statusFilter !== 'all' && case_.status !== statusFilter) matches = false;
    if (searchTerm && !case_.content.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !case_.reason.toLowerCase().includes(searchTerm.toLowerCase())) matches = false;
    
    return matches;
  });

  return (
    <div className="container mx-auto px-6 py-8 max-w-7xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-600 rounded-lg flex items-center justify-center">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Moderação Automática</h1>
              <p className="text-muted-foreground">Sistema inteligente de moderação de conteúdo</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button variant="outline" data-testid="button-moderation-settings">
              <Settings className="h-4 w-4 mr-2" />
              Configurações
            </Button>
            
            <Button data-testid="button-export-cases">
              <Download className="h-4 w-4 mr-2" />
              Exportar Casos
            </Button>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Revisado</p>
                  <p className="text-2xl font-bold">{mockStats.totalReviewed.toLocaleString()}</p>
                  <p className="text-xs text-blue-500 flex items-center mt-1">
                    <Activity className="h-3 w-3 mr-1" />
                    Este mês
                  </p>
                </div>
                <BarChart3 className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Precisão do Sistema</p>
                  <p className="text-2xl font-bold">{mockStats.accuracy}%</p>
                  <p className="text-xs text-green-500 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +2.3% vs mês anterior
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
                  <p className="text-sm font-medium text-muted-foreground">Pendente Revisão</p>
                  <p className="text-2xl font-bold">{mockStats.pendingReview}</p>
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
                  <p className="text-sm font-medium text-muted-foreground">Tempo Resposta</p>
                  <p className="text-2xl font-bold">{mockStats.avgResponseTime}m</p>
                  <p className="text-xs text-purple-500 flex items-center mt-1">
                    <Timer className="h-3 w-3 mr-1" />
                    Tempo médio
                  </p>
                </div>
                <Timer className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="cases">Casos Pendentes</TabsTrigger>
            <TabsTrigger value="rules">Regras</TabsTrigger>
            <TabsTrigger value="policies">Políticas</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Dashboard */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Atividade Recente</CardTitle>
                  <CardDescription>Ações de moderação das últimas 24 horas</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <ShieldCheck className="h-5 w-5 text-green-500" />
                        <div>
                          <div className="font-medium">Comentários Aprovados</div>
                          <div className="text-sm text-muted-foreground">Últimas 24h</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-green-500">1,247</div>
                        <div className="text-sm text-muted-foreground">+18%</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <ShieldX className="h-5 w-5 text-red-500" />
                        <div>
                          <div className="font-medium">Conteúdo Rejeitado</div>
                          <div className="text-sm text-muted-foreground">Últimas 24h</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-red-500">89</div>
                        <div className="text-sm text-muted-foreground">-12%</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <ShieldAlert className="h-5 w-5 text-yellow-500" />
                        <div>
                          <div className="font-medium">Casos Escalados</div>
                          <div className="text-sm text-muted-foreground">Últimas 24h</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-yellow-500">23</div>
                        <div className="text-sm text-muted-foreground">+5%</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Regras Mais Ativadas</CardTitle>
                  <CardDescription>Top regras que mais detectaram conteúdo</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockRules
                      .sort((a, b) => b.triggerCount - a.triggerCount)
                      .slice(0, 4)
                      .map((rule, index) => (
                        <div key={rule.id} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center text-sm font-bold">
                              {index + 1}
                            </div>
                            <div>
                              <div className="font-medium">{rule.name}</div>
                              <div className="text-sm text-muted-foreground">{rule.type}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold">{rule.triggerCount}</div>
                            <div className="text-sm text-muted-foreground">triggers</div>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Status do Sistema</CardTitle>
                <CardDescription>Estado atual da moderação automática</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Shield className="h-5 w-5 text-green-500" />
                        <span>Moderação AI Ativa</span>
                      </div>
                      <Badge className="bg-green-100 text-green-800">✓ Online</Badge>
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Filter className="h-5 w-5 text-blue-500" />
                        <span>Filtros de Spam</span>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800">✓ Ativo</Badge>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Eye className="h-5 w-5 text-purple-500" />
                        <span>Análise de Imagem</span>
                      </div>
                      <Badge className="bg-purple-100 text-purple-800">✓ Operacional</Badge>
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-2">
                        <MessageSquare className="h-5 w-5 text-orange-500" />
                        <span>Moderação de Texto</span>
                      </div>
                      <Badge className="bg-orange-100 text-orange-800">✓ Funcionando</Badge>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Users className="h-5 w-5 text-green-500" />
                        <span>Detecção de Trolls</span>
                      </div>
                      <Badge className="bg-green-100 text-green-800">✓ Ativo</Badge>
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Flag className="h-5 w-5 text-red-500" />
                        <span>Sistema de Reports</span>
                      </div>
                      <Badge className="bg-red-100 text-red-800">✓ Disponível</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Casos Pendentes */}
          <TabsContent value="cases" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Casos Pendentes de Moderação</h3>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar casos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                    data-testid="input-search-cases"
                  />
                </div>
                
                <Select value={caseFilter} onValueChange={setCaseFilter}>
                  <SelectTrigger className="w-40" data-testid="select-case-filter">
                    <SelectValue placeholder="Tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="comment">Comentário</SelectItem>
                    <SelectItem value="video">Vídeo</SelectItem>
                    <SelectItem value="thumbnail">Thumbnail</SelectItem>
                    <SelectItem value="user_report">Report de Usuário</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40" data-testid="select-status-filter">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="pending">Pendente</SelectItem>
                    <SelectItem value="approved">Aprovado</SelectItem>
                    <SelectItem value="rejected">Rejeitado</SelectItem>
                    <SelectItem value="escalated">Escalado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              {filteredCases.map((case_) => (
                <Card key={case_.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {/* Header do caso */}
                      <div className="flex items-start justify-between">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center space-x-2">
                            {getTypeIcon(case_.type)}
                            <h3 className="font-semibold">{case_.reason}</h3>
                            <Badge className={getStatusColor(case_.status)}>
                              {case_.status === 'pending' ? 'Pendente' :
                               case_.status === 'approved' ? 'Aprovado' :
                               case_.status === 'rejected' ? 'Rejeitado' : 'Escalado'}
                            </Badge>
                            <div className={`w-2 h-2 rounded-full ${getPriorityColor(case_.priority)}`} />
                          </div>
                          <div className="p-3 bg-muted/50 rounded-lg">
                            <p className="text-sm">{case_.content}</p>
                          </div>
                          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                            <span>Reportado por: {case_.reportedBy}</span>
                            <span>Criado: {formatTimestamp(case_.createdAt)}</span>
                            {case_.assignedTo && <span>Responsável: {case_.assignedTo}</span>}
                            {case_.metadata.confidence && (
                              <span>Confiança AI: {Math.round(case_.metadata.confidence * 100)}%</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* AI Flags */}
                      {case_.metadata.aiFlags && case_.metadata.aiFlags.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium">Flags AI:</h4>
                          <div className="flex flex-wrap gap-1">
                            {case_.metadata.aiFlags.map((flag, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {flag.replace('_', ' ')}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="flex space-x-2">
                          {case_.status === 'pending' && (
                            <>
                              <Button 
                                variant="default" 
                                size="sm"
                                onClick={() => handleApproveCase(case_.id)}
                                data-testid={`button-approve-${case_.id}`}
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Aprovar
                              </Button>
                              <Button 
                                variant="destructive" 
                                size="sm"
                                onClick={() => handleRejectCase(case_.id)}
                                data-testid={`button-reject-${case_.id}`}
                              >
                                <XCircle className="h-4 w-4 mr-1" />
                                Rejeitar
                              </Button>
                              <Button variant="outline" size="sm" data-testid={`button-escalate-${case_.id}`}>
                                <AlertTriangle className="h-4 w-4 mr-1" />
                                Escalar
                              </Button>
                            </>
                          )}
                          <Button variant="outline" size="sm" data-testid={`button-details-${case_.id}`}>
                            <Info className="h-4 w-4 mr-1" />
                            Ver Detalhes
                          </Button>
                        </div>
                        
                        <div className="text-xs text-muted-foreground">
                          ID: {case_.id}
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
              <h3 className="text-lg font-semibold">Regras de Moderação</h3>
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
                      Configure uma nova regra de moderação automática
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="rule-name">Nome da Regra</Label>
                        <Input id="rule-name" placeholder="Ex: Filtro Anti-Spam" data-testid="input-rule-name" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="rule-type">Tipo de Conteúdo</Label>
                        <Select>
                          <SelectTrigger data-testid="select-rule-type">
                            <SelectValue placeholder="Tipo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="comment">Comentário</SelectItem>
                            <SelectItem value="video">Vídeo</SelectItem>
                            <SelectItem value="thumbnail">Thumbnail</SelectItem>
                            <SelectItem value="title">Título</SelectItem>
                            <SelectItem value="description">Descrição</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="rule-action">Ação Automática</Label>
                        <Select>
                          <SelectTrigger data-testid="select-rule-action">
                            <SelectValue placeholder="Ação" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="auto_approve">Aprovar Automaticamente</SelectItem>
                            <SelectItem value="auto_reject">Rejeitar Automaticamente</SelectItem>
                            <SelectItem value="hold_review">Reter para Revisão</SelectItem>
                            <SelectItem value="flag">Marcar como Suspeito</SelectItem>
                            <SelectItem value="delete">Deletar Imediatamente</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="rule-severity">Severidade</Label>
                        <Select>
                          <SelectTrigger data-testid="select-rule-severity">
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
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="rule-keywords">Palavras-chave (separadas por vírgula)</Label>
                      <Textarea 
                        id="rule-keywords" 
                        placeholder="palavra1, palavra2, frase de exemplo"
                        data-testid="textarea-rule-keywords"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="rule-whitelist">Lista Branca (exceções)</Label>
                      <Textarea 
                        id="rule-whitelist" 
                        placeholder="palavras ou frases que devem ser ignoradas"
                        data-testid="textarea-rule-whitelist"
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
                            <Badge className={getSeverityColor(rule.severity)}>
                              {rule.severity === 'low' ? 'Baixa' :
                               rule.severity === 'medium' ? 'Média' :
                               rule.severity === 'high' ? 'Alta' : 'Crítica'}
                            </Badge>
                            <Badge variant="outline">{rule.type}</Badge>
                            <Switch 
                              checked={rule.enabled}
                              onCheckedChange={() => handleToggleRule(rule.id)}
                              data-testid={`switch-rule-${rule.id}`}
                            />
                          </div>
                          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                            <span>Ação: {rule.action}</span>
                            <span>Triggers: {rule.triggerCount}</span>
                            {rule.lastTriggered && <span>Último trigger: {rule.lastTriggered}</span>}
                          </div>
                        </div>
                      </div>

                      {/* Keywords */}
                      {rule.keywords.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium">Palavras-chave:</h4>
                          <div className="flex flex-wrap gap-1">
                            {rule.keywords.slice(0, 5).map((keyword, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {keyword}
                              </Badge>
                            ))}
                            {rule.keywords.length > 5 && (
                              <Badge variant="outline" className="text-xs">
                                +{rule.keywords.length - 5} mais
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" data-testid={`button-edit-rule-${rule.id}`}>
                            <Edit className="h-4 w-4 mr-1" />
                            Editar
                          </Button>
                          <Button variant="outline" size="sm" data-testid={`button-test-rule-${rule.id}`}>
                            <PlayCircle className="h-4 w-4 mr-1" />
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

          {/* Políticas */}
          <TabsContent value="policies" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Políticas de Conteúdo</h3>
              <Dialog open={showPolicyDialog} onOpenChange={setShowPolicyDialog}>
                <DialogTrigger asChild>
                  <Button data-testid="button-new-policy">
                    <Shield className="h-4 w-4 mr-2" />
                    Nova Política
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Criar Nova Política</DialogTitle>
                    <DialogDescription>
                      Configure uma nova política de moderação de conteúdo
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="policy-name">Nome da Política</Label>
                        <Input id="policy-name" placeholder="Ex: Anti-Bullying" data-testid="input-policy-name" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="policy-category">Categoria</Label>
                        <Select>
                          <SelectTrigger data-testid="select-policy-category">
                            <SelectValue placeholder="Categoria" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="harassment">Assédio</SelectItem>
                            <SelectItem value="spam">Spam</SelectItem>
                            <SelectItem value="adult">Conteúdo Adulto</SelectItem>
                            <SelectItem value="violence">Violência</SelectItem>
                            <SelectItem value="hate_speech">Discurso de Ódio</SelectItem>
                            <SelectItem value="copyright">Direitos Autorais</SelectItem>
                            <SelectItem value="misinformation">Desinformação</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="policy-description">Descrição</Label>
                      <Textarea 
                        id="policy-description" 
                        placeholder="Descreva o que esta política detecta e previne"
                        data-testid="textarea-policy-description"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="policy-action">Ação Automática</Label>
                        <Select>
                          <SelectTrigger data-testid="select-policy-action">
                            <SelectValue placeholder="Ação" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="approve">Aprovar</SelectItem>
                            <SelectItem value="reject">Rejeitar</SelectItem>
                            <SelectItem value="review">Enviar para Revisão</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="policy-confidence">Nível de Confiança</Label>
                        <Select>
                          <SelectTrigger data-testid="select-policy-confidence">
                            <SelectValue placeholder="Confiança" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0.5">50% - Baixo</SelectItem>
                            <SelectItem value="0.7">70% - Médio</SelectItem>
                            <SelectItem value="0.8">80% - Alto</SelectItem>
                            <SelectItem value="0.9">90% - Muito Alto</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <Button onClick={handleCreatePolicy} className="w-full" data-testid="button-create-policy">
                      Criar Política
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="space-y-4">
              {mockPolicies.map((policy) => (
                <Card key={policy.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {/* Header da política */}
                      <div className="flex items-center justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <h3 className="font-semibold">{policy.name}</h3>
                            <Badge variant="outline">{policy.category}</Badge>
                            <Badge className={
                              policy.autoAction === 'approve' ? 'bg-green-100 text-green-800' :
                              policy.autoAction === 'reject' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                            }>
                              {policy.autoAction}
                            </Badge>
                            <Switch 
                              checked={policy.enabled}
                              data-testid={`switch-policy-${policy.id}`}
                            />
                          </div>
                          <p className="text-sm text-muted-foreground">{policy.description}</p>
                          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                            <span>Confiança: {Math.round(policy.confidence * 100)}%</span>
                            <span>Keywords: {policy.keywords.length}</span>
                            <span>Padrões: {policy.patterns.length}</span>
                          </div>
                        </div>
                      </div>

                      {/* Progress bar de confiança */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Nível de Confiança</span>
                          <span>{Math.round(policy.confidence * 100)}%</span>
                        </div>
                        <Progress value={policy.confidence * 100} className="h-2" />
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" data-testid={`button-edit-policy-${policy.id}`}>
                            <Edit className="h-4 w-4 mr-1" />
                            Editar
                          </Button>
                          <Button variant="outline" size="sm" data-testid={`button-test-policy-${policy.id}`}>
                            <PlayCircle className="h-4 w-4 mr-1" />
                            Testar
                          </Button>
                        </div>
                        
                        <div className="text-xs text-muted-foreground">
                          ID: {policy.id}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Analytics */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Eficiência por Tipo</CardTitle>
                  <CardDescription>Taxa de precisão por tipo de conteúdo</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { type: 'Comentários', precision: 96.8, total: 5234 },
                      { type: 'Vídeos', precision: 88.4, total: 456 },
                      { type: 'Thumbnails', precision: 92.1, total: 234 },
                      { type: 'Reports', precision: 94.7, total: 123 }
                    ].map((data) => (
                      <div key={data.type} className="space-y-2">
                        <div className="flex justify-between">
                          <span className="font-medium">{data.type}</span>
                          <span className="text-sm text-muted-foreground">
                            {data.precision}% ({data.total} casos)
                          </span>
                        </div>
                        <Progress value={data.precision} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Tendências de Moderação</CardTitle>
                  <CardDescription>Evolução da moderação ao longo do tempo</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">Taxa de Aprovação</div>
                        <div className="text-sm text-muted-foreground">Últimos 30 dias</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-green-500">81.2%</div>
                        <div className="text-sm text-green-500">+3.2%</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">Tempo de Resposta</div>
                        <div className="text-sm text-muted-foreground">Média em minutos</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-blue-500">12.5min</div>
                        <div className="text-sm text-blue-500">-8.3%</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">Cases Escalados</div>
                        <div className="text-sm text-muted-foreground">Para revisão manual</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-orange-500">2.8%</div>
                        <div className="text-sm text-orange-500">-1.2%</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Métricas Consolidadas</CardTitle>
                <CardDescription>Resumo da performance do sistema de moderação</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-blue-500">94.8%</div>
                    <p className="text-sm text-muted-foreground">Precisão Geral</p>
                  </div>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-green-500">8,945</div>
                    <p className="text-sm text-muted-foreground">Casos Processados (30d)</p>
                  </div>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-purple-500">12.5min</div>
                    <p className="text-sm text-muted-foreground">Tempo Médio de Resposta</p>
                  </div>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-orange-500">99.1%</div>
                    <p className="text-sm text-muted-foreground">Uptime do Sistema</p>
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