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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { 
  DollarSign, 
  BarChart3,
  TrendingUp,
  TrendingDown,
  Eye,
  MousePointer,
  Globe,
  Smartphone,
  Monitor,
  Tablet,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  RefreshCw,
  Download,
  Plus,
  Edit,
  Settings,
  Target,
  Activity,
  Filter,
  Search,
  Copy,
  Trash2,
  PlayCircle,
  PauseCircle,
  Calendar,
  MapPin,
  Users,
  Percent,
  Star,
  Award,
  Zap,
  Link,
  ExternalLink,
  MoreHorizontal,
  Info,
  AlertTriangle,
  ShieldCheck,
  FileText,
  Package,
  Layers,
  Layout,
  Grid,
  Maximize,
  Minimize,
  RotateCcw,
  Share2
} from 'lucide-react';

interface AdUnit {
  id: string;
  name: string;
  type: 'display' | 'video' | 'native' | 'auto';
  size: string;
  status: 'active' | 'paused' | 'inactive' | 'pending_review';
  placement: 'header' | 'sidebar' | 'content' | 'footer' | 'overlay' | 'inline';
  createdDate: string;
  revenue: {
    today: number;
    thisWeek: number;
    thisMonth: number;
  };
  metrics: {
    impressions: number;
    clicks: number;
    ctr: number;
    cpm: number;
    rpm: number;
  };
  targeting: {
    countries: string[];
    devices: string[];
    categories: string[];
  };
}

interface AdPerformance {
  date: string;
  revenue: number;
  impressions: number;
  clicks: number;
  ctr: number;
  cpm: number;
  rpm: number;
}

interface PolicyViolation {
  id: string;
  type: 'invalid_traffic' | 'content_policy' | 'ad_placement' | 'click_activity';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  page: string;
  detectedDate: string;
  status: 'open' | 'resolved' | 'disputed';
  adUnitId?: string;
}

const mockAdUnits: AdUnit[] = [
  {
    id: 'ad_001',
    name: 'Banner Header Principal',
    type: 'display',
    size: '728x90',
    status: 'active',
    placement: 'header',
    createdDate: '2024-01-15',
    revenue: {
      today: 45.80,
      thisWeek: 312.45,
      thisMonth: 1287.90
    },
    metrics: {
      impressions: 125400,
      clicks: 890,
      ctr: 0.71,
      cpm: 2.15,
      rpm: 10.27
    },
    targeting: {
      countries: ['BR', 'PT'],
      devices: ['desktop', 'mobile'],
      categories: ['true-crime', 'mystery', 'entertainment']
    }
  },
  {
    id: 'ad_002',
    name: 'Video InStream',
    type: 'video',
    size: 'responsive',
    status: 'active',
    placement: 'content',
    createdDate: '2024-02-01',
    revenue: {
      today: 89.20,
      thisWeek: 634.85,
      thisMonth: 2456.30
    },
    metrics: {
      impressions: 78900,
      clicks: 1240,
      ctr: 1.57,
      cpm: 4.85,
      rpm: 31.12
    },
    targeting: {
      countries: ['BR'],
      devices: ['desktop', 'mobile', 'tablet'],
      categories: ['video', 'entertainment']
    }
  },
  {
    id: 'ad_003',
    name: 'Native Content',
    type: 'native',
    size: 'fluid',
    status: 'active',
    placement: 'inline',
    createdDate: '2024-02-15',
    revenue: {
      today: 23.45,
      thisWeek: 156.78,
      thisMonth: 678.90
    },
    metrics: {
      impressions: 45600,
      clicks: 567,
      ctr: 1.24,
      cpm: 1.89,
      rpm: 14.89
    },
    targeting: {
      countries: ['BR', 'US'],
      devices: ['mobile', 'tablet'],
      categories: ['mystery', 'lifestyle']
    }
  },
  {
    id: 'ad_004',
    name: 'Sidebar Retangular',
    type: 'display',
    size: '300x250',
    status: 'paused',
    placement: 'sidebar',
    createdDate: '2024-01-20',
    revenue: {
      today: 0,
      thisWeek: 0,
      thisMonth: 245.67
    },
    metrics: {
      impressions: 0,
      clicks: 0,
      ctr: 0,
      cpm: 0,
      rpm: 0
    },
    targeting: {
      countries: ['BR'],
      devices: ['desktop'],
      categories: ['mystery', 'true-crime']
    }
  }
];

const mockPolicyViolations: PolicyViolation[] = [
  {
    id: 'pv_001',
    type: 'invalid_traffic',
    severity: 'medium',
    description: 'Tráfego suspeito detectado com múltiplos cliques do mesmo IP',
    page: '/video/misterio-casa-assombrada',
    detectedDate: '2024-03-08',
    status: 'open',
    adUnitId: 'ad_001'
  },
  {
    id: 'pv_002',
    type: 'content_policy',
    severity: 'low',
    description: 'Conteúdo pode não estar adequado para todos os anunciantes',
    page: '/video/crime-real-brasil',
    detectedDate: '2024-03-05',
    status: 'resolved'
  },
  {
    id: 'pv_003',
    type: 'ad_placement',
    severity: 'high',
    description: 'Anúncio muito próximo ao conteúdo principal',
    page: '/homepage',
    detectedDate: '2024-03-01',
    status: 'disputed',
    adUnitId: 'ad_003'
  }
];

export default function AdSense() {
  const [selectedAdUnit, setSelectedAdUnit] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAdUnitDialog, setShowAdUnitDialog] = useState(false);
  const [dateRange, setDateRange] = useState('7d');
  const { toast } = useToast();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-500';
      case 'paused': return 'text-yellow-500';
      case 'inactive': return 'text-gray-500';
      case 'pending_review': return 'text-blue-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'paused': return <PauseCircle className="h-4 w-4 text-yellow-500" />;
      case 'inactive': return <XCircle className="h-4 w-4 text-gray-500" />;
      case 'pending_review': return <Clock className="h-4 w-4 text-blue-500" />;
      default: return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'display': return 'bg-blue-100 text-blue-800 dark:bg-blue-950';
      case 'video': return 'bg-red-100 text-red-800 dark:bg-red-950';
      case 'native': return 'bg-green-100 text-green-800 dark:bg-green-950';
      case 'auto': return 'bg-purple-100 text-purple-800 dark:bg-purple-950';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-950';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'text-yellow-500 bg-yellow-100 dark:bg-yellow-950';
      case 'medium': return 'text-orange-500 bg-orange-100 dark:bg-orange-950';
      case 'high': return 'text-red-500 bg-red-100 dark:bg-red-950';
      case 'critical': return 'text-red-600 bg-red-200 dark:bg-red-900';
      default: return 'text-gray-500 bg-gray-100 dark:bg-gray-950';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const handleCreateAdUnit = () => {
    toast({
      title: "Unidade de anúncio criada",
      description: "Nova unidade foi configurada com sucesso",
    });
    setShowAdUnitDialog(false);
  };

  const handleToggleAdUnit = (adUnitId: string, status: string) => {
    const newStatus = status === 'active' ? 'paused' : 'active';
    toast({
      title: `Anúncio ${newStatus === 'active' ? 'ativado' : 'pausado'}`,
      description: `Unidade de anúncio foi ${newStatus === 'active' ? 'ativada' : 'pausada'} com sucesso`,
    });
  };

  const handleResolveViolation = (violationId: string) => {
    toast({
      title: "Violação resolvida",
      description: "A violação de política foi marcada como resolvida",
    });
  };

  const totalRevenue = mockAdUnits.reduce((sum, unit) => sum + unit.revenue.thisMonth, 0);
  const totalImpressions = mockAdUnits.reduce((sum, unit) => sum + unit.metrics.impressions, 0);
  const totalClicks = mockAdUnits.reduce((sum, unit) => sum + unit.metrics.clicks, 0);
  const averageCTR = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;

  return (
    <div className="container mx-auto px-6 py-8 max-w-7xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-yellow-600 rounded-lg flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Integração AdSense</h1>
              <p className="text-muted-foreground">Gerencie anúncios, receita e performance do Google AdSense</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Dialog open={showAdUnitDialog} onOpenChange={setShowAdUnitDialog}>
              <DialogTrigger asChild>
                <Button data-testid="button-new-ad-unit">
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Unidade
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Criar Nova Unidade de Anúncio</DialogTitle>
                  <DialogDescription>
                    Configure uma nova unidade de anúncio AdSense
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="ad-name">Nome da Unidade</Label>
                    <Input id="ad-name" placeholder="Ex: Banner Header" data-testid="input-ad-name" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="ad-type">Tipo de Anúncio</Label>
                      <Select>
                        <SelectTrigger data-testid="select-ad-type">
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="display">Display</SelectItem>
                          <SelectItem value="video">Vídeo</SelectItem>
                          <SelectItem value="native">Nativo</SelectItem>
                          <SelectItem value="auto">Automático</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ad-size">Tamanho</Label>
                      <Select>
                        <SelectTrigger data-testid="select-ad-size">
                          <SelectValue placeholder="Tamanho" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="728x90">Leaderboard (728x90)</SelectItem>
                          <SelectItem value="300x250">Medium Rectangle (300x250)</SelectItem>
                          <SelectItem value="320x50">Mobile Banner (320x50)</SelectItem>
                          <SelectItem value="responsive">Responsivo</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ad-placement">Posicionamento</Label>
                    <Select>
                      <SelectTrigger data-testid="select-ad-placement">
                        <SelectValue placeholder="Onde será exibido" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="header">Cabeçalho</SelectItem>
                        <SelectItem value="sidebar">Barra Lateral</SelectItem>
                        <SelectItem value="content">Dentro do Conteúdo</SelectItem>
                        <SelectItem value="footer">Rodapé</SelectItem>
                        <SelectItem value="overlay">Overlay</SelectItem>
                        <SelectItem value="inline">Inline</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button onClick={handleCreateAdUnit} className="w-full" data-testid="button-create-ad-unit">
                    Criar Unidade de Anúncio
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Button variant="outline" data-testid="button-adsense-settings">
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
                  <p className="text-sm font-medium text-muted-foreground">Receita do Mês</p>
                  <p className="text-2xl font-bold">{formatCurrency(totalRevenue)}</p>
                  <p className="text-xs text-green-500 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +18% vs mês anterior
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Impressões</p>
                  <p className="text-2xl font-bold">{formatNumber(totalImpressions)}</p>
                  <p className="text-xs text-blue-500 flex items-center mt-1">
                    <Eye className="h-3 w-3 mr-1" />
                    Este mês
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
                  <p className="text-sm font-medium text-muted-foreground">Taxa de Clique</p>
                  <p className="text-2xl font-bold">{averageCTR.toFixed(2)}%</p>
                  <p className="text-xs text-purple-500 flex items-center mt-1">
                    <MousePointer className="h-3 w-3 mr-1" />
                    Média geral
                  </p>
                </div>
                <MousePointer className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Unidades Ativas</p>
                  <p className="text-2xl font-bold">{mockAdUnits.filter(unit => unit.status === 'active').length}</p>
                  <p className="text-xs text-orange-500 flex items-center mt-1">
                    <Target className="h-3 w-3 mr-1" />
                    de {mockAdUnits.length} total
                  </p>
                </div>
                <Target className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="units" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="units">Unidades</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="optimization">Otimização</TabsTrigger>
            <TabsTrigger value="policies">Políticas</TabsTrigger>
            <TabsTrigger value="reports">Relatórios</TabsTrigger>
          </TabsList>

          {/* Unidades de Anúncio */}
          <TabsContent value="units" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Gerenciar Unidades de Anúncio</h3>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar unidades..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                    data-testid="input-search-units"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40" data-testid="select-status-filter">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="active">Ativos</SelectItem>
                    <SelectItem value="paused">Pausados</SelectItem>
                    <SelectItem value="inactive">Inativos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              {mockAdUnits.map((unit) => (
                <Card key={unit.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {/* Header da unidade */}
                      <div className="flex items-center justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <h3 className="font-semibold">{unit.name}</h3>
                            <Badge className={getTypeColor(unit.type)}>
                              {unit.type === 'display' ? 'Display' :
                               unit.type === 'video' ? 'Vídeo' :
                               unit.type === 'native' ? 'Nativo' : 'Automático'}
                            </Badge>
                            <Badge variant="outline">{unit.size}</Badge>
                            {getStatusIcon(unit.status)}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Posição: {unit.placement} | Criado: {unit.createdDate}
                          </p>
                        </div>
                        
                        <div className="text-right space-y-1">
                          <div className="text-lg font-bold">{formatCurrency(unit.revenue.thisMonth)}</div>
                          <p className="text-xs text-muted-foreground">Este mês</p>
                        </div>
                      </div>

                      {/* Métricas */}
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 p-4 bg-muted/50 rounded-lg">
                        <div className="text-center">
                          <div className="text-lg font-bold text-blue-500">
                            {formatNumber(unit.metrics.impressions)}
                          </div>
                          <p className="text-xs text-muted-foreground">Impressões</p>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-green-500">
                            {formatNumber(unit.metrics.clicks)}
                          </div>
                          <p className="text-xs text-muted-foreground">Cliques</p>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-purple-500">
                            {unit.metrics.ctr.toFixed(2)}%
                          </div>
                          <p className="text-xs text-muted-foreground">CTR</p>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-orange-500">
                            {formatCurrency(unit.metrics.cpm)}
                          </div>
                          <p className="text-xs text-muted-foreground">CPM</p>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-red-500">
                            {formatCurrency(unit.metrics.rpm)}
                          </div>
                          <p className="text-xs text-muted-foreground">RPM</p>
                        </div>
                      </div>

                      {/* Segmentação */}
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Segmentação:</h4>
                        <div className="flex flex-wrap gap-2">
                          <div className="flex items-center space-x-1">
                            <Globe className="h-3 w-3" />
                            <span className="text-xs">Países: {unit.targeting.countries.join(', ')}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Monitor className="h-3 w-3" />
                            <span className="text-xs">Dispositivos: {unit.targeting.devices.length}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Target className="h-3 w-3" />
                            <span className="text-xs">Categorias: {unit.targeting.categories.length}</span>
                          </div>
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleToggleAdUnit(unit.id, unit.status)}
                            data-testid={`button-toggle-${unit.id}`}
                          >
                            {unit.status === 'active' ? (
                              <>
                                <PauseCircle className="h-4 w-4 mr-1" />
                                Pausar
                              </>
                            ) : (
                              <>
                                <PlayCircle className="h-4 w-4 mr-1" />
                                Ativar
                              </>
                            )}
                          </Button>
                          <Button variant="outline" size="sm" data-testid={`button-edit-${unit.id}`}>
                            <Edit className="h-4 w-4 mr-1" />
                            Editar
                          </Button>
                          <Button variant="outline" size="sm" data-testid={`button-view-${unit.id}`}>
                            <BarChart3 className="h-4 w-4 mr-1" />
                            Relatório
                          </Button>
                        </div>
                        
                        <div className="text-xs text-muted-foreground">
                          ID: {unit.id}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Performance */}
          <TabsContent value="performance" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Análise de Performance</h3>
              <div className="flex items-center space-x-4">
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger className="w-40" data-testid="select-date-range">
                    <SelectValue placeholder="Período" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1d">Hoje</SelectItem>
                    <SelectItem value="7d">7 dias</SelectItem>
                    <SelectItem value="30d">30 dias</SelectItem>
                    <SelectItem value="90d">90 dias</SelectItem>
                  </SelectContent>
                </Select>
                <Button data-testid="button-export-performance">
                  <Download className="h-4 w-4 mr-2" />
                  Exportar
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Performance por Dispositivo</CardTitle>
                  <CardDescription>Receita por tipo de dispositivo</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Monitor className="h-5 w-5 text-blue-500" />
                        <div>
                          <div className="font-medium">Desktop</div>
                          <div className="text-sm text-muted-foreground">62% do tráfego</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{formatCurrency(2847.30)}</div>
                        <div className="text-sm text-green-500">+15%</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Smartphone className="h-5 w-5 text-green-500" />
                        <div>
                          <div className="font-medium">Mobile</div>
                          <div className="text-sm text-muted-foreground">32% do tráfego</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{formatCurrency(1456.80)}</div>
                        <div className="text-sm text-green-500">+22%</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Tablet className="h-5 w-5 text-purple-500" />
                        <div>
                          <div className="font-medium">Tablet</div>
                          <div className="text-sm text-muted-foreground">6% do tráfego</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{formatCurrency(119.00)}</div>
                        <div className="text-sm text-red-500">-5%</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Top Países por Receita</CardTitle>
                  <CardDescription>Receita por localização geográfica</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-3 bg-green-500 rounded-sm"></div>
                        <span className="font-medium">Brasil</span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{formatCurrency(3650.20)}</div>
                        <div className="text-sm text-muted-foreground">78.5%</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-3 bg-blue-500 rounded-sm"></div>
                        <span className="font-medium">Portugal</span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{formatCurrency(445.80)}</div>
                        <div className="text-sm text-muted-foreground">9.6%</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-3 bg-purple-500 rounded-sm"></div>
                        <span className="font-medium">Estados Unidos</span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{formatCurrency(298.50)}</div>
                        <div className="text-sm text-muted-foreground">6.4%</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-3 bg-orange-500 rounded-sm"></div>
                        <span className="font-medium">Outros</span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{formatCurrency(259.60)}</div>
                        <div className="text-sm text-muted-foreground">5.5%</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Métricas Consolidadas</CardTitle>
                <CardDescription>Visão geral da performance dos anúncios</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-green-500">{formatCurrency(4654.10)}</div>
                    <p className="text-sm text-muted-foreground">Receita Total (30d)</p>
                  </div>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-blue-500">{formatNumber(249900)}</div>
                    <p className="text-sm text-muted-foreground">Impressões (30d)</p>
                  </div>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-purple-500">1.12%</div>
                    <p className="text-sm text-muted-foreground">CTR Médio</p>
                  </div>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-orange-500">{formatCurrency(18.63)}</div>
                    <p className="text-sm text-muted-foreground">RPM Médio</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Otimização */}
          <TabsContent value="optimization" className="space-y-6">
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Sugestões de Otimização</h3>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <TrendingUp className="h-5 w-5 text-green-500" />
                      <span>Oportunidades de Melhoria</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-3 border-l-4 border-green-500 bg-green-50 dark:bg-green-950">
                      <div className="font-medium">Adicionar unidade mobile</div>
                      <p className="text-sm text-muted-foreground">
                        32% do seu tráfego é mobile, mas apenas 1 unidade está otimizada
                      </p>
                      <div className="mt-2">
                        <Badge className="bg-green-100 text-green-800">Potencial: +R$ 340/mês</Badge>
                      </div>
                    </div>

                    <div className="p-3 border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-950">
                      <div className="font-medium">Otimizar posicionamento</div>
                      <p className="text-sm text-muted-foreground">
                        Unidades inline têm 40% mais CTR que sidebar
                      </p>
                      <div className="mt-2">
                        <Badge className="bg-blue-100 text-blue-800">Potencial: +R$ 180/mês</Badge>
                      </div>
                    </div>

                    <div className="p-3 border-l-4 border-orange-500 bg-orange-50 dark:bg-orange-950">
                      <div className="font-medium">Experimento A/B</div>
                      <p className="text-sm text-muted-foreground">
                        Testar tamanhos diferentes para banner header
                      </p>
                      <div className="mt-2">
                        <Badge className="bg-orange-100 text-orange-800">Potencial: +R$ 120/mês</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Settings className="h-5 w-5 text-blue-500" />
                      <span>Configurações Automáticas</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">Auto-otimização de anúncios</div>
                        <p className="text-sm text-muted-foreground">
                          Ajustar automaticamente tamanhos e posições
                        </p>
                      </div>
                      <Switch defaultChecked data-testid="switch-auto-optimization" />
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">Bloqueio de anúncios baixa qualidade</div>
                        <p className="text-sm text-muted-foreground">
                          Filtrar automaticamente anúncios com baixo CTR
                        </p>
                      </div>
                      <Switch defaultChecked data-testid="switch-quality-filter" />
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">Relatórios automáticos</div>
                        <p className="text-sm text-muted-foreground">
                          Enviar relatório de performance semanalmente
                        </p>
                      </div>
                      <Switch data-testid="switch-auto-reports" />
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">Alertas de performance</div>
                        <p className="text-sm text-muted-foreground">
                          Notificar quando receita cair mais de 20%
                        </p>
                      </div>
                      <Switch defaultChecked data-testid="switch-performance-alerts" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Experimetos A/B Sugeridos</CardTitle>
                  <CardDescription>Testes recomendados para melhorar performance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">Teste de Tamanho</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Comparar 728x90 vs 320x50 no header mobile
                      </p>
                      <Button size="sm" variant="outline" data-testid="button-test-size">
                        <Zap className="h-4 w-4 mr-1" />
                        Iniciar Teste
                      </Button>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">Teste de Posição</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Comparar sidebar vs inline no conteúdo
                      </p>
                      <Button size="sm" variant="outline" data-testid="button-test-position">
                        <Zap className="h-4 w-4 mr-1" />
                        Iniciar Teste
                      </Button>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">Teste de Cor</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Comparar diferentes esquemas de cores
                      </p>
                      <Button size="sm" variant="outline" data-testid="button-test-color">
                        <Zap className="h-4 w-4 mr-1" />
                        Iniciar Teste
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Políticas */}
          <TabsContent value="policies" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Violações de Política</h3>
              <Button data-testid="button-policy-guide">
                <FileText className="h-4 w-4 mr-2" />
                Guia de Políticas
              </Button>
            </div>

            <div className="space-y-4">
              {mockPolicyViolations.map((violation) => (
                <Card key={violation.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {/* Header da violação */}
                      <div className="flex items-center justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <AlertTriangle className="h-5 w-5 text-orange-500" />
                            <h3 className="font-semibold">
                              {violation.type === 'invalid_traffic' ? 'Tráfego Inválido' :
                               violation.type === 'content_policy' ? 'Política de Conteúdo' :
                               violation.type === 'ad_placement' ? 'Posicionamento de Anúncio' : 'Atividade de Clique'}
                            </h3>
                            <Badge className={getSeverityColor(violation.severity)}>
                              {violation.severity === 'low' ? 'Baixa' :
                               violation.severity === 'medium' ? 'Média' :
                               violation.severity === 'high' ? 'Alta' : 'Crítica'}
                            </Badge>
                            <Badge 
                              variant={violation.status === 'resolved' ? 'default' : 
                                     violation.status === 'disputed' ? 'secondary' : 'destructive'}
                            >
                              {violation.status === 'open' ? 'Aberta' :
                               violation.status === 'resolved' ? 'Resolvida' : 'Contestada'}
                            </Badge>
                          </div>
                          <p className="text-sm">{violation.description}</p>
                          <p className="text-xs text-muted-foreground">
                            Página: {violation.page} | Detectado: {violation.detectedDate}
                            {violation.adUnitId && ` | Unidade: ${violation.adUnitId}`}
                          </p>
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="flex space-x-2">
                          {violation.status === 'open' && (
                            <>
                              <Button 
                                size="sm"
                                onClick={() => handleResolveViolation(violation.id)}
                                data-testid={`button-resolve-${violation.id}`}
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Marcar como Resolvida
                              </Button>
                              <Button variant="outline" size="sm" data-testid={`button-dispute-${violation.id}`}>
                                <AlertCircle className="h-4 w-4 mr-1" />
                                Contestar
                              </Button>
                            </>
                          )}
                          <Button variant="outline" size="sm" data-testid={`button-details-${violation.id}`}>
                            <Info className="h-4 w-4 mr-1" />
                            Ver Detalhes
                          </Button>
                        </div>
                        
                        <div className="text-xs text-muted-foreground">
                          ID: {violation.id}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Status de Conformidade</CardTitle>
                <CardDescription>Verificação das políticas do AdSense</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-2">
                        <ShieldCheck className="h-5 w-5 text-green-500" />
                        <span>Conteúdo apropriado</span>
                      </div>
                      <Badge className="bg-green-100 text-green-800">✓ Conforme</Badge>
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-2">
                        <ShieldCheck className="h-5 w-5 text-green-500" />
                        <span>Posicionamento de anúncios</span>
                      </div>
                      <Badge className="bg-green-100 text-green-800">✓ Conforme</Badge>
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className="h-5 w-5 text-yellow-500" />
                        <span>Tráfego e cliques</span>
                      </div>
                      <Badge className="bg-yellow-100 text-yellow-800">⚠ Atenção</Badge>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-2">
                        <ShieldCheck className="h-5 w-5 text-green-500" />
                        <span>Experiência do usuário</span>
                      </div>
                      <Badge className="bg-green-100 text-green-800">✓ Conforme</Badge>
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-2">
                        <ShieldCheck className="h-5 w-5 text-green-500" />
                        <span>Políticas de privacidade</span>
                      </div>
                      <Badge className="bg-green-100 text-green-800">✓ Conforme</Badge>
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-2">
                        <ShieldCheck className="h-5 w-5 text-green-500" />
                        <span>Navegação e estrutura</span>
                      </div>
                      <Badge className="bg-green-100 text-green-800">✓ Conforme</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Relatórios */}
          <TabsContent value="reports" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Relatórios Detalhados</h3>
              <div className="flex items-center space-x-4">
                <Select>
                  <SelectTrigger className="w-48" data-testid="select-report-period">
                    <SelectValue placeholder="Período do relatório" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="today">Hoje</SelectItem>
                    <SelectItem value="yesterday">Ontem</SelectItem>
                    <SelectItem value="week">Esta semana</SelectItem>
                    <SelectItem value="month">Este mês</SelectItem>
                    <SelectItem value="custom">Período customizado</SelectItem>
                  </SelectContent>
                </Select>
                <Button data-testid="button-generate-report">
                  <Download className="h-4 w-4 mr-2" />
                  Gerar Relatório
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Relatórios Rápidos</CardTitle>
                  <CardDescription>Relatórios pré-configurados para download</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start" data-testid="button-revenue-report">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Relatório de Receita (30 dias)
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start" data-testid="button-performance-report">
                    <Target className="h-4 w-4 mr-2" />
                    Performance por Unidade de Anúncio
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start" data-testid="button-geographic-report">
                    <Globe className="h-4 w-4 mr-2" />
                    Relatório Geográfico
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start" data-testid="button-device-report">
                    <Monitor className="h-4 w-4 mr-2" />
                    Análise por Dispositivo
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start" data-testid="button-policy-report">
                    <ShieldCheck className="h-4 w-4 mr-2" />
                    Relatório de Conformidade
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Relatórios Personalizados</CardTitle>
                  <CardDescription>Configure relatórios com métricas específicas</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <Label>Métricas a incluir:</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="revenue" defaultChecked />
                        <Label htmlFor="revenue" className="text-sm">Receita</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="impressions" defaultChecked />
                        <Label htmlFor="impressions" className="text-sm">Impressões</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="clicks" defaultChecked />
                        <Label htmlFor="clicks" className="text-sm">Cliques</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="ctr" />
                        <Label htmlFor="ctr" className="text-sm">CTR</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="cpm" />
                        <Label htmlFor="cpm" className="text-sm">CPM</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="rpm" />
                        <Label htmlFor="rpm" className="text-sm">RPM</Label>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Agrupamento:</Label>
                    <Select>
                      <SelectTrigger data-testid="select-grouping">
                        <SelectValue placeholder="Agrupar por" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="date">Data</SelectItem>
                        <SelectItem value="ad_unit">Unidade de Anúncio</SelectItem>
                        <SelectItem value="country">País</SelectItem>
                        <SelectItem value="device">Dispositivo</SelectItem>
                        <SelectItem value="ad_size">Tamanho do Anúncio</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button className="w-full" data-testid="button-create-custom-report">
                    <FileText className="h-4 w-4 mr-2" />
                    Criar Relatório Personalizado
                  </Button>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Histórico de Relatórios</CardTitle>
                <CardDescription>Relatórios gerados recentemente</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">Relatório de Receita - Março 2024</div>
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
                      <div className="font-medium">Performance por Dispositivo - Fevereiro 2024</div>
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
                      <div className="font-medium">Análise Geográfica - Janeiro 2024</div>
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
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}