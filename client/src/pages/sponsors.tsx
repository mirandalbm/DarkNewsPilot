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
import { Textarea } from '@/components/ui/textarea';
import { 
  Handshake, 
  Building,
  DollarSign,
  Calendar,
  TrendingUp,
  Eye,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  RefreshCw,
  Download,
  Plus,
  Edit,
  Target,
  BarChart3,
  Activity,
  Filter,
  Search,
  Mail,
  Phone,
  Globe,
  MapPin,
  Star,
  Award,
  Zap,
  Users,
  PlayCircle,
  PauseCircle,
  StopCircle,
  ExternalLink,
  Upload,
  Percent,
  TrendingDown,
  AlertTriangle,
  MessageSquare,
  Video,
  Image,
  Link,
  Calendar as CalendarIcon,
  CreditCard,
  Package,
  Settings
} from 'lucide-react';

interface Sponsor {
  id: string;
  name: string;
  logo?: string;
  industry: string;
  contact: {
    name: string;
    email: string;
    phone?: string;
  };
  website?: string;
  status: 'active' | 'pending' | 'paused' | 'ended';
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  startDate: string;
  endDate?: string;
  totalInvestment: number;
  campaignsCount: number;
  averageROI: number;
  lastActivity: string;
}

interface Campaign {
  id: string;
  sponsorId: string;
  sponsorName: string;
  title: string;
  description: string;
  budget: number;
  spent: number;
  startDate: string;
  endDate: string;
  status: 'draft' | 'active' | 'paused' | 'completed' | 'cancelled';
  type: 'sponsored_video' | 'product_placement' | 'banner' | 'mention';
  objectives: string[];
  targetMetrics: {
    views: number;
    clicks: number;
    conversions: number;
  };
  actualMetrics: {
    views: number;
    clicks: number;
    conversions: number;
    ctr: number;
    roi: number;
  };
  contentRequirements: string;
  deliverables: string[];
}

const mockSponsors: Sponsor[] = [
  {
    id: '1',
    name: 'TechSecurity Pro',
    industry: 'Tecnologia',
    contact: {
      name: 'Carlos Mendes',
      email: 'carlos@techsecurity.com',
      phone: '+55 11 99999-9999'
    },
    website: 'https://techsecurity.com',
    status: 'active',
    tier: 'gold',
    startDate: '2024-01-15',
    totalInvestment: 45000.00,
    campaignsCount: 8,
    averageROI: 285.5,
    lastActivity: '2024-03-08'
  },
  {
    id: '2',
    name: 'VPN Brasil',
    industry: 'Segurança Digital',
    contact: {
      name: 'Ana Silva',
      email: 'ana@vpnbrasil.com',
      phone: '+55 21 88888-8888'
    },
    website: 'https://vpnbrasil.com',
    status: 'active',
    tier: 'platinum',
    startDate: '2023-09-20',
    totalInvestment: 78000.00,
    campaignsCount: 12,
    averageROI: 342.8,
    lastActivity: '2024-03-09'
  },
  {
    id: '3',
    name: 'Dark Coffee Co.',
    industry: 'Alimentação',
    contact: {
      name: 'Pedro Costa',
      email: 'pedro@darkcoffee.com'
    },
    website: 'https://darkcoffee.com',
    status: 'pending',
    tier: 'silver',
    startDate: '2024-03-01',
    totalInvestment: 15000.00,
    campaignsCount: 0,
    averageROI: 0,
    lastActivity: '2024-03-01'
  },
  {
    id: '4',
    name: 'Crypto Tracker',
    industry: 'Fintech',
    contact: {
      name: 'Mariana Oliveira',
      email: 'mariana@cryptotracker.com',
      phone: '+55 85 77777-7777'
    },
    status: 'paused',
    tier: 'bronze',
    startDate: '2023-11-10',
    endDate: '2024-02-10',
    totalInvestment: 8500.00,
    campaignsCount: 3,
    averageROI: 156.2,
    lastActivity: '2024-02-10'
  }
];

const mockCampaigns: Campaign[] = [
  {
    id: '1',
    sponsorId: '1',
    sponsorName: 'TechSecurity Pro',
    title: 'Campanha de Antivírus',
    description: 'Promoção do novo antivírus com foco em proteção contra malware',
    budget: 12000.00,
    spent: 8500.00,
    startDate: '2024-03-01',
    endDate: '2024-03-31',
    status: 'active',
    type: 'sponsored_video',
    objectives: ['Aumentar awareness', 'Gerar leads', 'Promover trial gratuito'],
    targetMetrics: {
      views: 500000,
      clicks: 15000,
      conversions: 1200
    },
    actualMetrics: {
      views: 380000,
      clicks: 11500,
      conversions: 890,
      ctr: 3.02,
      roi: 245.8
    },
    contentRequirements: 'Vídeo de 2-3 minutos sobre crimes cibernéticos com integração natural do produto',
    deliverables: ['Vídeo principal', 'Short para Instagram', 'Post no LinkedIn']
  },
  {
    id: '2',
    sponsorId: '2',
    sponsorName: 'VPN Brasil',
    title: 'Proteção Online',
    description: 'Campanha educativa sobre privacidade online',
    budget: 18000.00,
    spent: 18000.00,
    startDate: '2024-02-01',
    endDate: '2024-02-29',
    status: 'completed',
    type: 'product_placement',
    objectives: ['Educar sobre privacidade', 'Aumentar assinantes VPN'],
    targetMetrics: {
      views: 800000,
      clicks: 24000,
      conversions: 2000
    },
    actualMetrics: {
      views: 920000,
      clicks: 28500,
      conversions: 2340,
      ctr: 3.10,
      roi: 312.5
    },
    contentRequirements: 'Integração durante explicação sobre como criminosos rastreiam pessoas online',
    deliverables: ['Integração no vídeo', 'Código de desconto', 'Banner nos comentários']
  },
  {
    id: '3',
    sponsorId: '3',
    sponsorName: 'Dark Coffee Co.',
    title: 'Café para Madrugadas',
    description: 'Promoção do café especial para quem trabalha tarde',
    budget: 5000.00,
    spent: 0,
    startDate: '2024-03-15',
    endDate: '2024-04-15',
    status: 'draft',
    type: 'mention',
    objectives: ['Brand awareness', 'Vendas online'],
    targetMetrics: {
      views: 200000,
      clicks: 5000,
      conversions: 400
    },
    actualMetrics: {
      views: 0,
      clicks: 0,
      conversions: 0,
      ctr: 0,
      roi: 0
    },
    contentRequirements: 'Menção natural durante narrativa sobre investigações noturnas',
    deliverables: ['Menção no vídeo', 'Post nos stories']
  }
];

export default function Sponsors() {
  const [selectedSponsor, setSelectedSponsor] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showCampaignDialog, setShowCampaignDialog] = useState(false);
  const { toast } = useToast();

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'platinum': return 'text-purple-500 bg-purple-100 dark:bg-purple-950';
      case 'gold': return 'text-yellow-500 bg-yellow-100 dark:bg-yellow-950';
      case 'silver': return 'text-gray-500 bg-gray-100 dark:bg-gray-950';
      default: return 'text-orange-500 bg-orange-100 dark:bg-orange-950';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-500';
      case 'pending': return 'text-yellow-500';
      case 'paused': return 'text-orange-500';
      case 'ended': return 'text-gray-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'paused': return <PauseCircle className="h-4 w-4 text-orange-500" />;
      case 'ended': return <StopCircle className="h-4 w-4 text-gray-500" />;
      default: return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getCampaignTypeColor = (type: string) => {
    switch (type) {
      case 'sponsored_video': return 'bg-blue-100 text-blue-800 dark:bg-blue-950';
      case 'product_placement': return 'bg-green-100 text-green-800 dark:bg-green-950';
      case 'banner': return 'bg-purple-100 text-purple-800 dark:bg-purple-950';
      case 'mention': return 'bg-orange-100 text-orange-800 dark:bg-orange-950';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-950';
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

  const handleAddSponsor = () => {
    toast({
      title: "Patrocinador adicionado",
      description: "Novo patrocinador foi cadastrado com sucesso",
    });
    setShowAddDialog(false);
  };

  const handleCreateCampaign = () => {
    toast({
      title: "Campanha criada",
      description: "Nova campanha foi criada com sucesso",
    });
    setShowCampaignDialog(false);
  };

  const handleApproveCampaign = (campaignId: string) => {
    toast({
      title: "Campanha aprovada",
      description: "A campanha foi aprovada e está ativa",
    });
  };

  return (
    <div className="container mx-auto px-6 py-8 max-w-7xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-teal-600 rounded-lg flex items-center justify-center">
              <Handshake className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Gestão de Patrocínios</h1>
              <p className="text-muted-foreground">Gerencie contratos, campanhas e relacionamentos com patrocinadores</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
              <DialogTrigger asChild>
                <Button data-testid="button-add-sponsor">
                  <Building className="h-4 w-4 mr-2" />
                  Novo Patrocinador
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Adicionar Novo Patrocinador</DialogTitle>
                  <DialogDescription>
                    Cadastre um novo patrocinador no sistema
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="sponsor-name">Nome da Empresa</Label>
                      <Input id="sponsor-name" placeholder="Nome do patrocinador" data-testid="input-sponsor-name" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sponsor-industry">Indústria</Label>
                      <Select>
                        <SelectTrigger data-testid="select-sponsor-industry">
                          <SelectValue placeholder="Selecione a indústria" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="technology">Tecnologia</SelectItem>
                          <SelectItem value="security">Segurança</SelectItem>
                          <SelectItem value="fintech">Fintech</SelectItem>
                          <SelectItem value="food">Alimentação</SelectItem>
                          <SelectItem value="entertainment">Entretenimento</SelectItem>
                          <SelectItem value="education">Educação</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="sponsor-website">Website</Label>
                    <Input id="sponsor-website" placeholder="https://exemplo.com" data-testid="input-sponsor-website" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="contact-name">Nome do Contato</Label>
                      <Input id="contact-name" placeholder="Nome do responsável" data-testid="input-contact-name" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contact-email">Email do Contato</Label>
                      <Input id="contact-email" type="email" placeholder="email@exemplo.com" data-testid="input-contact-email" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="contact-phone">Telefone</Label>
                      <Input id="contact-phone" placeholder="+55 11 99999-9999" data-testid="input-contact-phone" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sponsor-tier">Tier do Patrocinador</Label>
                      <Select>
                        <SelectTrigger data-testid="select-sponsor-tier">
                          <SelectValue placeholder="Selecione o tier" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="bronze">Bronze</SelectItem>
                          <SelectItem value="silver">Silver</SelectItem>
                          <SelectItem value="gold">Gold</SelectItem>
                          <SelectItem value="platinum">Platinum</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Button onClick={handleAddSponsor} className="w-full" data-testid="button-save-sponsor">
                    Cadastrar Patrocinador
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={showCampaignDialog} onOpenChange={setShowCampaignDialog}>
              <DialogTrigger asChild>
                <Button variant="outline" data-testid="button-new-campaign">
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Campanha
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl">
                <DialogHeader>
                  <DialogTitle>Criar Nova Campanha</DialogTitle>
                  <DialogDescription>
                    Configure uma nova campanha de patrocínio
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="campaign-sponsor">Patrocinador</Label>
                      <Select>
                        <SelectTrigger data-testid="select-campaign-sponsor">
                          <SelectValue placeholder="Selecione o patrocinador" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockSponsors.map((sponsor) => (
                            <SelectItem key={sponsor.id} value={sponsor.id}>
                              {sponsor.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="campaign-type">Tipo de Campanha</Label>
                      <Select>
                        <SelectTrigger data-testid="select-campaign-type">
                          <SelectValue placeholder="Tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sponsored_video">Vídeo Patrocinado</SelectItem>
                          <SelectItem value="product_placement">Product Placement</SelectItem>
                          <SelectItem value="banner">Banner/Display</SelectItem>
                          <SelectItem value="mention">Menção</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="campaign-title">Título da Campanha</Label>
                    <Input id="campaign-title" placeholder="Nome da campanha" data-testid="input-campaign-title" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="campaign-description">Descrição</Label>
                    <Textarea id="campaign-description" placeholder="Descreva os objetivos e detalhes da campanha" data-testid="textarea-campaign-description" />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="campaign-budget">Orçamento</Label>
                      <Input id="campaign-budget" type="number" placeholder="5000.00" data-testid="input-campaign-budget" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="campaign-start">Data de Início</Label>
                      <Input id="campaign-start" type="date" data-testid="input-campaign-start" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="campaign-end">Data de Fim</Label>
                      <Input id="campaign-end" type="date" data-testid="input-campaign-end" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="campaign-requirements">Requisitos de Conteúdo</Label>
                    <Textarea id="campaign-requirements" placeholder="Especifique como o produto/serviço deve ser integrado" data-testid="textarea-campaign-requirements" />
                  </div>

                  <Button onClick={handleCreateCampaign} className="w-full" data-testid="button-create-campaign">
                    Criar Campanha
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Patrocinadores Ativos</p>
                  <p className="text-2xl font-bold">23</p>
                  <p className="text-xs text-green-500 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +3 este mês
                  </p>
                </div>
                <Building className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Receita de Patrocínios</p>
                  <p className="text-2xl font-bold">R$ 127K</p>
                  <p className="text-xs text-green-500 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +28% este mês
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
                  <p className="text-sm font-medium text-muted-foreground">Campanhas Ativas</p>
                  <p className="text-2xl font-bold">12</p>
                  <p className="text-xs text-blue-500 flex items-center mt-1">
                    <Activity className="h-3 w-3 mr-1" />
                    8 em produção
                  </p>
                </div>
                <Target className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">ROI Médio</p>
                  <p className="text-2xl font-bold">284%</p>
                  <p className="text-xs text-green-500 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +12% este trimestre
                  </p>
                </div>
                <Award className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="sponsors" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="sponsors">Patrocinadores</TabsTrigger>
            <TabsTrigger value="campaigns">Campanhas</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="contracts">Contratos</TabsTrigger>
          </TabsList>

          {/* Patrocinadores */}
          <TabsContent value="sponsors" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Gerenciar Patrocinadores</h3>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar patrocinadores..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                    data-testid="input-search-sponsors"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40" data-testid="select-status-filter">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="active">Ativos</SelectItem>
                    <SelectItem value="pending">Pendentes</SelectItem>
                    <SelectItem value="paused">Pausados</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              {mockSponsors.map((sponsor) => (
                <Card key={sponsor.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {/* Header do patrocinador */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                            <Building className="h-6 w-6" />
                          </div>
                          <div>
                            <div className="flex items-center space-x-2 mb-1">
                              <h3 className="font-semibold">{sponsor.name}</h3>
                              <Badge className={getTierColor(sponsor.tier)}>
                                <span className="capitalize">{sponsor.tier}</span>
                              </Badge>
                              {getStatusIcon(sponsor.status)}
                            </div>
                            <p className="text-sm text-muted-foreground">{sponsor.industry}</p>
                            <div className="flex items-center space-x-4 text-xs text-muted-foreground mt-1">
                              <span className="flex items-center">
                                <Mail className="h-3 w-3 mr-1" />
                                {sponsor.contact.email}
                              </span>
                              {sponsor.contact.phone && (
                                <span className="flex items-center">
                                  <Phone className="h-3 w-3 mr-1" />
                                  {sponsor.contact.phone}
                                </span>
                              )}
                              {sponsor.website && (
                                <span className="flex items-center">
                                  <Globe className="h-3 w-3 mr-1" />
                                  Website
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="text-lg font-bold">{formatCurrency(sponsor.totalInvestment)}</div>
                          <p className="text-xs text-muted-foreground">Investimento total</p>
                        </div>
                      </div>

                      {/* Estatísticas */}
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-muted/50 rounded-lg">
                        <div className="text-center">
                          <div className="text-lg font-bold text-blue-500">{sponsor.campaignsCount}</div>
                          <p className="text-xs text-muted-foreground">Campanhas</p>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-green-500">{sponsor.averageROI}%</div>
                          <p className="text-xs text-muted-foreground">ROI Médio</p>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-purple-500">{sponsor.contact.name}</div>
                          <p className="text-xs text-muted-foreground">Contato</p>
                        </div>
                        <div className="text-center">
                          <div className={`text-lg font-bold ${getStatusColor(sponsor.status)}`}>
                            {sponsor.status === 'active' ? 'Ativo' : 
                             sponsor.status === 'pending' ? 'Pendente' :
                             sponsor.status === 'paused' ? 'Pausado' : 'Finalizado'}
                          </div>
                          <p className="text-xs text-muted-foreground">Status</p>
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" data-testid={`button-view-${sponsor.id}`}>
                            <Eye className="h-4 w-4 mr-1" />
                            Ver Detalhes
                          </Button>
                          <Button variant="outline" size="sm" data-testid={`button-edit-${sponsor.id}`}>
                            <Edit className="h-4 w-4 mr-1" />
                            Editar
                          </Button>
                          <Button size="sm" data-testid={`button-new-campaign-${sponsor.id}`}>
                            <Plus className="h-4 w-4 mr-1" />
                            Nova Campanha
                          </Button>
                        </div>
                        
                        <div className="text-xs text-muted-foreground">
                          Parceiro desde: {sponsor.startDate} | Última atividade: {sponsor.lastActivity}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Campanhas */}
          <TabsContent value="campaigns" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Gerenciar Campanhas</h3>
              <div className="flex items-center space-x-4">
                <Select value={selectedSponsor} onValueChange={setSelectedSponsor}>
                  <SelectTrigger className="w-48" data-testid="select-sponsor-filter">
                    <SelectValue placeholder="Filtrar por patrocinador" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos Patrocinadores</SelectItem>
                    {mockSponsors.map((sponsor) => (
                      <SelectItem key={sponsor.id} value={sponsor.id}>
                        {sponsor.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button data-testid="button-export-campaigns">
                  <Download className="h-4 w-4 mr-2" />
                  Exportar
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              {mockCampaigns.map((campaign) => (
                <Card key={campaign.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {/* Header da campanha */}
                      <div className="flex items-center justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <h3 className="font-semibold">{campaign.title}</h3>
                            <Badge className={getCampaignTypeColor(campaign.type)}>
                              {campaign.type === 'sponsored_video' ? 'Vídeo Patrocinado' :
                               campaign.type === 'product_placement' ? 'Product Placement' :
                               campaign.type === 'banner' ? 'Banner' : 'Menção'}
                            </Badge>
                            <Badge 
                              variant={campaign.status === 'active' ? 'default' : 
                                     campaign.status === 'completed' ? 'secondary' : 
                                     campaign.status === 'draft' ? 'outline' : 'destructive'}
                            >
                              {campaign.status === 'active' ? 'Ativa' :
                               campaign.status === 'completed' ? 'Concluída' :
                               campaign.status === 'draft' ? 'Rascunho' : 
                               campaign.status === 'paused' ? 'Pausada' : 'Cancelada'}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{campaign.sponsorName}</p>
                          <p className="text-sm">{campaign.description}</p>
                        </div>
                        
                        <div className="text-right space-y-1">
                          <div className="text-lg font-bold">{formatCurrency(campaign.budget)}</div>
                          <p className="text-xs text-muted-foreground">
                            Gasto: {formatCurrency(campaign.spent)}
                          </p>
                          <Progress value={(campaign.spent / campaign.budget) * 100} className="w-24 h-2" />
                        </div>
                      </div>

                      {/* Métricas */}
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 p-4 bg-muted/50 rounded-lg">
                        <div className="text-center">
                          <div className="text-lg font-bold text-blue-500">
                            {formatNumber(campaign.actualMetrics.views)}
                          </div>
                          <p className="text-xs text-muted-foreground">Views</p>
                          <p className="text-xs text-green-500">
                            Meta: {formatNumber(campaign.targetMetrics.views)}
                          </p>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-green-500">
                            {formatNumber(campaign.actualMetrics.clicks)}
                          </div>
                          <p className="text-xs text-muted-foreground">Clicks</p>
                          <p className="text-xs text-green-500">
                            Meta: {formatNumber(campaign.targetMetrics.clicks)}
                          </p>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-purple-500">
                            {campaign.actualMetrics.conversions}
                          </div>
                          <p className="text-xs text-muted-foreground">Conversões</p>
                          <p className="text-xs text-green-500">
                            Meta: {campaign.targetMetrics.conversions}
                          </p>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-orange-500">
                            {campaign.actualMetrics.ctr.toFixed(2)}%
                          </div>
                          <p className="text-xs text-muted-foreground">CTR</p>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-red-500">
                            {campaign.actualMetrics.roi.toFixed(1)}%
                          </div>
                          <p className="text-xs text-muted-foreground">ROI</p>
                        </div>
                      </div>

                      {/* Requisitos e entregáveis */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium">Requisitos de Conteúdo:</h4>
                          <p className="text-sm text-muted-foreground">{campaign.contentRequirements}</p>
                        </div>
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium">Entregáveis:</h4>
                          <div className="flex flex-wrap gap-1">
                            {campaign.deliverables.map((deliverable, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {deliverable}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" data-testid={`button-view-campaign-${campaign.id}`}>
                            <Eye className="h-4 w-4 mr-1" />
                            Ver Detalhes
                          </Button>
                          {campaign.status === 'draft' && (
                            <Button 
                              size="sm"
                              onClick={() => handleApproveCampaign(campaign.id)}
                              data-testid={`button-approve-${campaign.id}`}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Aprovar
                            </Button>
                          )}
                          {campaign.status === 'active' && (
                            <Button variant="outline" size="sm" data-testid={`button-pause-${campaign.id}`}>
                              <PauseCircle className="h-4 w-4 mr-1" />
                              Pausar
                            </Button>
                          )}
                        </div>
                        
                        <div className="text-xs text-muted-foreground">
                          {campaign.startDate} - {campaign.endDate}
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
                  <CardTitle>Performance por Patrocinador</CardTitle>
                  <CardDescription>ROI e investimento total</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockSponsors
                      .sort((a, b) => b.totalInvestment - a.totalInvestment)
                      .map((sponsor, index) => (
                        <div key={sponsor.id} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center text-sm font-bold">
                              {index + 1}
                            </div>
                            <div>
                              <div className="font-medium">{sponsor.name}</div>
                              <div className="text-sm text-muted-foreground">{sponsor.campaignsCount} campanhas</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold">{formatCurrency(sponsor.totalInvestment)}</div>
                            <div className="text-sm text-green-500">{sponsor.averageROI}% ROI</div>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Tipos de Campanha</CardTitle>
                  <CardDescription>Distribuição por tipo</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Vídeos Patrocinados</span>
                        <span className="font-medium">45%</span>
                      </div>
                      <Progress value={45} className="h-2" />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Product Placement</span>
                        <span className="font-medium">30%</span>
                      </div>
                      <Progress value={30} className="h-2" />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Menções</span>
                        <span className="font-medium">15%</span>
                      </div>
                      <Progress value={15} className="h-2" />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Banners</span>
                        <span className="font-medium">10%</span>
                      </div>
                      <Progress value={10} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Métricas Consolidadas</CardTitle>
                <CardDescription>Performance geral dos patrocínios</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-green-500">R$ 342K</div>
                    <p className="text-sm text-muted-foreground">Receita Total de Patrocínios</p>
                  </div>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-blue-500">84</div>
                    <p className="text-sm text-muted-foreground">Campanhas Realizadas</p>
                  </div>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-purple-500">284%</div>
                    <p className="text-sm text-muted-foreground">ROI Médio Geral</p>
                  </div>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-orange-500">18.4M</div>
                    <p className="text-sm text-muted-foreground">Views Geradas</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Contratos */}
          <TabsContent value="contracts" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Contratos Ativos</CardTitle>
                  <CardDescription>Contratos em vigência</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockSponsors.filter(s => s.status === 'active').map((sponsor) => (
                      <div key={sponsor.id} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">{sponsor.name}</div>
                            <div className="text-sm text-muted-foreground">
                              Válido até: {sponsor.endDate || 'Indeterminado'}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold">{formatCurrency(sponsor.totalInvestment)}</div>
                            <Badge className={getTierColor(sponsor.tier)} variant="outline">
                              {sponsor.tier}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex space-x-2 mt-3">
                          <Button size="sm" variant="outline" data-testid={`button-view-contract-${sponsor.id}`}>
                            <FileText className="h-4 w-4 mr-1" />
                            Ver Contrato
                          </Button>
                          <Button size="sm" variant="outline" data-testid={`button-edit-contract-${sponsor.id}`}>
                            <Edit className="h-4 w-4 mr-1" />
                            Editar
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Renovações Pendentes</CardTitle>
                  <CardDescription>Contratos próximos do vencimento</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-3 border border-yellow-200 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">TechSecurity Pro</div>
                          <div className="text-sm text-muted-foreground">
                            Vence em 15 dias
                          </div>
                        </div>
                        <Button size="sm" data-testid="button-renew-contract">
                          <RefreshCw className="h-4 w-4 mr-1" />
                          Renovar
                        </Button>
                      </div>
                    </div>

                    <div className="p-3 border border-orange-200 bg-orange-50 dark:bg-orange-950 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">VPN Brasil</div>
                          <div className="text-sm text-muted-foreground">
                            Vence em 30 dias
                          </div>
                        </div>
                        <Button size="sm" data-testid="button-contact-renewal">
                          <MessageSquare className="h-4 w-4 mr-1" />
                          Contatar
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Templates de Contrato</CardTitle>
                <CardDescription>Modelos padrão para diferentes tipos de parceria</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Contrato Bronze/Silver</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Para parcerias de menor valor (até R$ 20K)
                    </p>
                    <Button size="sm" variant="outline" data-testid="button-download-template-basic">
                      <Download className="h-4 w-4 mr-1" />
                      Download Template
                    </Button>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Contrato Gold/Platinum</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Para parcerias estratégicas (acima de R$ 20K)
                    </p>
                    <Button size="sm" variant="outline" data-testid="button-download-template-premium">
                      <Download className="h-4 w-4 mr-1" />
                      Download Template
                    </Button>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Termo de Exclusividade</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Para parcerias com exclusividade de categoria
                    </p>
                    <Button size="sm" variant="outline" data-testid="button-download-template-exclusive">
                      <Download className="h-4 w-4 mr-1" />
                      Download Template
                    </Button>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Addendum de Performance</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Métricas e KPIs obrigatórios
                    </p>
                    <Button size="sm" variant="outline" data-testid="button-download-template-performance">
                      <Download className="h-4 w-4 mr-1" />
                      Download Template
                    </Button>
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