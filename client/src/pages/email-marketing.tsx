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
  Mail, 
  Users,
  Send,
  Calendar,
  TrendingUp,
  TrendingDown,
  Eye,
  MousePointer,
  UserPlus,
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
  Copy,
  Trash2,
  PlayCircle,
  PauseCircle,
  StopCircle,
  FileText,
  Settings,
  Zap,
  Star,
  Award,
  Globe,
  ExternalLink,
  Upload,
  Percent,
  MessageSquare,
  Bell,
  Timer,
  Split,
  Database,
  Tags,
  List,
  Layers,
  Archive,
  Package,
  ChevronRight
} from 'lucide-react';

interface EmailCampaign {
  id: string;
  name: string;
  subject: string;
  type: 'newsletter' | 'promotional' | 'transactional' | 'automation';
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'paused';
  recipients: number;
  scheduledDate?: string;
  sentDate?: string;
  metrics: {
    sent: number;
    delivered: number;
    opened: number;
    clicked: number;
    unsubscribed: number;
    bounced: number;
    openRate: number;
    clickRate: number;
    unsubscribeRate: number;
  };
  createdAt: string;
  templateId?: string;
}

interface EmailList {
  id: string;
  name: string;
  description: string;
  subscribers: number;
  activeSubscribers: number;
  segmentation: string[];
  growthRate: number;
  lastUpdate: string;
  status: 'active' | 'archived';
}

interface EmailTemplate {
  id: string;
  name: string;
  description: string;
  category: 'newsletter' | 'welcome' | 'promotional' | 'notification';
  previewImage?: string;
  usageCount: number;
  lastModified: string;
  status: 'active' | 'archived';
}

const mockCampaigns: EmailCampaign[] = [
  {
    id: '1',
    name: 'Newsletter Semanal - Mistérios',
    subject: '🔍 Novos Mistérios Revelados Esta Semana',
    type: 'newsletter',
    status: 'sent',
    recipients: 15420,
    sentDate: '2024-03-08',
    metrics: {
      sent: 15420,
      delivered: 15125,
      opened: 4875,
      clicked: 890,
      unsubscribed: 12,
      bounced: 295,
      openRate: 32.2,
      clickRate: 18.3,
      unsubscribeRate: 0.08
    },
    createdAt: '2024-03-07',
    templateId: 'tmpl_1'
  },
  {
    id: '2',
    name: 'Promoção Curso Investigação',
    subject: '50% OFF: Aprenda Técnicas de Investigação',
    type: 'promotional',
    status: 'scheduled',
    recipients: 8760,
    scheduledDate: '2024-03-10',
    metrics: {
      sent: 0,
      delivered: 0,
      opened: 0,
      clicked: 0,
      unsubscribed: 0,
      bounced: 0,
      openRate: 0,
      clickRate: 0,
      unsubscribeRate: 0
    },
    createdAt: '2024-03-09',
    templateId: 'tmpl_2'
  },
  {
    id: '3',
    name: 'Boas-vindas Novos Inscritos',
    subject: 'Bem-vindo ao mundo dos mistérios! 👻',
    type: 'automation',
    status: 'sending',
    recipients: 245,
    metrics: {
      sent: 180,
      delivered: 175,
      opened: 85,
      clicked: 42,
      unsubscribed: 2,
      bounced: 5,
      openRate: 48.6,
      clickRate: 49.4,
      unsubscribeRate: 1.1
    },
    createdAt: '2024-02-15',
    templateId: 'tmpl_3'
  },
  {
    id: '4',
    name: 'Notificação Novo Vídeo',
    subject: '🚨 NOVO: O Caso Mais Assombrado do Brasil',
    type: 'transactional',
    status: 'draft',
    recipients: 18950,
    metrics: {
      sent: 0,
      delivered: 0,
      opened: 0,
      clicked: 0,
      unsubscribed: 0,
      bounced: 0,
      openRate: 0,
      clickRate: 0,
      unsubscribeRate: 0
    },
    createdAt: '2024-03-09'
  }
];

const mockLists: EmailList[] = [
  {
    id: '1',
    name: 'Lista Principal',
    description: 'Todos os inscritos interessados em mistérios e true crime',
    subscribers: 18950,
    activeSubscribers: 17240,
    segmentation: ['Todos'],
    growthRate: 12.5,
    lastUpdate: '2024-03-09',
    status: 'active'
  },
  {
    id: '2',
    name: 'Fãs de Paranormal',
    description: 'Inscritos interessados especificamente em conteúdo paranormal',
    subscribers: 8420,
    activeSubscribers: 7890,
    segmentation: ['Paranormal', 'Sobrenatural', 'Assombrações'],
    growthRate: 18.3,
    lastUpdate: '2024-03-08',
    status: 'active'
  },
  {
    id: '3',
    name: 'True Crime Brasil',
    description: 'Interessados em casos de crimes reais brasileiros',
    subscribers: 12750,
    activeSubscribers: 11980,
    segmentation: ['True Crime', 'Crimes Brasileiros', 'Investigação'],
    growthRate: 8.7,
    lastUpdate: '2024-03-09',
    status: 'active'
  },
  {
    id: '4',
    name: 'Assinantes Premium',
    description: 'Usuários com assinatura premium do canal',
    subscribers: 2340,
    activeSubscribers: 2240,
    segmentation: ['Premium', 'VIP', 'Exclusivo'],
    growthRate: 24.1,
    lastUpdate: '2024-03-09',
    status: 'active'
  }
];

const mockTemplates: EmailTemplate[] = [
  {
    id: 'tmpl_1',
    name: 'Newsletter Mistérios',
    description: 'Template para newsletter semanal com novos mistérios',
    category: 'newsletter',
    usageCount: 24,
    lastModified: '2024-03-01',
    status: 'active'
  },
  {
    id: 'tmpl_2',
    name: 'Promoção Especial',
    description: 'Template para campanhas promocionais e ofertas',
    category: 'promotional',
    usageCount: 15,
    lastModified: '2024-02-28',
    status: 'active'
  },
  {
    id: 'tmpl_3',
    name: 'Boas-vindas',
    description: 'Template de boas-vindas para novos inscritos',
    category: 'welcome',
    usageCount: 890,
    lastModified: '2024-02-15',
    status: 'active'
  },
  {
    id: 'tmpl_4',
    name: 'Notificação Vídeo',
    description: 'Template para notificar sobre novos vídeos',
    category: 'notification',
    usageCount: 156,
    lastModified: '2024-03-05',
    status: 'active'
  }
];

export default function EmailMarketing() {
  const [selectedList, setSelectedList] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCampaignDialog, setShowCampaignDialog] = useState(false);
  const [showListDialog, setShowListDialog] = useState(false);
  const { toast } = useToast();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent': return 'text-green-500';
      case 'sending': return 'text-blue-500';
      case 'scheduled': return 'text-yellow-500';
      case 'draft': return 'text-gray-500';
      case 'paused': return 'text-orange-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'sending': return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />;
      case 'scheduled': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'draft': return <FileText className="h-4 w-4 text-gray-500" />;
      case 'paused': return <PauseCircle className="h-4 w-4 text-orange-500" />;
      default: return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'newsletter': return 'bg-blue-100 text-blue-800 dark:bg-blue-950';
      case 'promotional': return 'bg-green-100 text-green-800 dark:bg-green-950';
      case 'transactional': return 'bg-purple-100 text-purple-800 dark:bg-purple-950';
      case 'automation': return 'bg-orange-100 text-orange-800 dark:bg-orange-950';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-950';
    }
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

  const handleCreateCampaign = () => {
    toast({
      title: "Campanha criada",
      description: "Nova campanha de email foi criada com sucesso",
    });
    setShowCampaignDialog(false);
  };

  const handleCreateList = () => {
    toast({
      title: "Lista criada",
      description: "Nova lista de contatos foi criada com sucesso",
    });
    setShowListDialog(false);
  };

  const handleSendCampaign = (campaignId: string) => {
    toast({
      title: "Campanha enviada",
      description: "A campanha foi enviada com sucesso",
    });
  };

  const handleScheduleCampaign = (campaignId: string) => {
    toast({
      title: "Campanha agendada",
      description: "A campanha foi agendada para envio",
    });
  };

  return (
    <div className="container mx-auto px-6 py-8 max-w-7xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Mail className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Email Marketing</h1>
              <p className="text-muted-foreground">Gerencie campanhas, listas e automações de email</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Dialog open={showCampaignDialog} onOpenChange={setShowCampaignDialog}>
              <DialogTrigger asChild>
                <Button data-testid="button-new-campaign">
                  <Send className="h-4 w-4 mr-2" />
                  Nova Campanha
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Criar Nova Campanha</DialogTitle>
                  <DialogDescription>
                    Configure uma nova campanha de email marketing
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="campaign-name">Nome da Campanha</Label>
                      <Input id="campaign-name" placeholder="Ex: Newsletter Semanal" data-testid="input-campaign-name" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="campaign-type">Tipo</Label>
                      <Select>
                        <SelectTrigger data-testid="select-campaign-type">
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="newsletter">Newsletter</SelectItem>
                          <SelectItem value="promotional">Promocional</SelectItem>
                          <SelectItem value="transactional">Transacional</SelectItem>
                          <SelectItem value="automation">Automação</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email-subject">Assunto do Email</Label>
                    <Input id="email-subject" placeholder="Digite o assunto do email" data-testid="input-email-subject" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email-list">Lista de Destinatários</Label>
                    <Select>
                      <SelectTrigger data-testid="select-email-list">
                        <SelectValue placeholder="Selecione a lista" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockLists.map((list) => (
                          <SelectItem key={list.id} value={list.id}>
                            {list.name} ({formatNumber(list.activeSubscribers)} ativos)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email-template">Template</Label>
                    <Select>
                      <SelectTrigger data-testid="select-email-template">
                        <SelectValue placeholder="Selecione um template" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockTemplates.map((template) => (
                          <SelectItem key={template.id} value={template.id}>
                            {template.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="send-date">Data de Envio</Label>
                      <Input id="send-date" type="datetime-local" data-testid="input-send-date" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="timezone">Fuso Horário</Label>
                      <Select>
                        <SelectTrigger data-testid="select-timezone">
                          <SelectValue placeholder="Fuso horário" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="america/sao_paulo">Brasília (GMT-3)</SelectItem>
                          <SelectItem value="america/new_york">Nova York (GMT-5)</SelectItem>
                          <SelectItem value="europe/london">Londres (GMT+0)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Button onClick={handleCreateCampaign} className="w-full" data-testid="button-create-campaign">
                    Criar Campanha
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={showListDialog} onOpenChange={setShowListDialog}>
              <DialogTrigger asChild>
                <Button variant="outline" data-testid="button-new-list">
                  <List className="h-4 w-4 mr-2" />
                  Nova Lista
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Criar Nova Lista</DialogTitle>
                  <DialogDescription>
                    Crie uma nova lista de contatos para suas campanhas
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="list-name">Nome da Lista</Label>
                    <Input id="list-name" placeholder="Ex: Fãs de Mistérios" data-testid="input-list-name" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="list-description">Descrição</Label>
                    <Textarea id="list-description" placeholder="Descreva o público desta lista" data-testid="textarea-list-description" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="list-tags">Tags de Segmentação</Label>
                    <Input id="list-tags" placeholder="Ex: paranormal, true crime, mistérios" data-testid="input-list-tags" />
                  </div>

                  <Button onClick={handleCreateList} className="w-full" data-testid="button-create-list">
                    Criar Lista
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
                  <p className="text-sm font-medium text-muted-foreground">Total de Inscritos</p>
                  <p className="text-2xl font-bold">18,950</p>
                  <p className="text-xs text-green-500 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +12.5% este mês
                  </p>
                </div>
                <Users className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Taxa de Abertura</p>
                  <p className="text-2xl font-bold">34.8%</p>
                  <p className="text-xs text-green-500 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +2.3% este mês
                  </p>
                </div>
                <Eye className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Taxa de Clique</p>
                  <p className="text-2xl font-bold">18.7%</p>
                  <p className="text-xs text-green-500 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +1.8% este mês
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
                  <p className="text-sm font-medium text-muted-foreground">Emails Enviados</p>
                  <p className="text-2xl font-bold">127K</p>
                  <p className="text-xs text-blue-500 flex items-center mt-1">
                    <Send className="h-3 w-3 mr-1" />
                    Este mês
                  </p>
                </div>
                <Send className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="campaigns" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="campaigns">Campanhas</TabsTrigger>
            <TabsTrigger value="lists">Listas</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="automation">Automação</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Campanhas */}
          <TabsContent value="campaigns" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Gerenciar Campanhas</h3>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar campanhas..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                    data-testid="input-search-campaigns"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40" data-testid="select-status-filter">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="sent">Enviadas</SelectItem>
                    <SelectItem value="scheduled">Agendadas</SelectItem>
                    <SelectItem value="draft">Rascunhos</SelectItem>
                  </SelectContent>
                </Select>
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
                            <h3 className="font-semibold">{campaign.name}</h3>
                            <Badge className={getTypeColor(campaign.type)}>
                              {campaign.type === 'newsletter' ? 'Newsletter' :
                               campaign.type === 'promotional' ? 'Promocional' :
                               campaign.type === 'transactional' ? 'Transacional' : 'Automação'}
                            </Badge>
                            {getStatusIcon(campaign.status)}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Assunto: {campaign.subject}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {campaign.status === 'sent' && campaign.sentDate && `Enviado em: ${campaign.sentDate}`}
                            {campaign.status === 'scheduled' && campaign.scheduledDate && `Agendado para: ${campaign.scheduledDate}`}
                            {campaign.status === 'draft' && `Criado em: ${campaign.createdAt}`}
                          </p>
                        </div>
                        
                        <div className="text-right space-y-1">
                          <div className="text-lg font-bold">{formatNumber(campaign.recipients)}</div>
                          <p className="text-xs text-muted-foreground">Destinatários</p>
                        </div>
                      </div>

                      {/* Métricas (só para campanhas enviadas) */}
                      {campaign.status === 'sent' && (
                        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 p-4 bg-muted/50 rounded-lg">
                          <div className="text-center">
                            <div className="text-lg font-bold text-blue-500">
                              {formatNumber(campaign.metrics.delivered)}
                            </div>
                            <p className="text-xs text-muted-foreground">Entregues</p>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-green-500">
                              {formatNumber(campaign.metrics.opened)}
                            </div>
                            <p className="text-xs text-muted-foreground">Abertos</p>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-purple-500">
                              {formatNumber(campaign.metrics.clicked)}
                            </div>
                            <p className="text-xs text-muted-foreground">Cliques</p>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-orange-500">
                              {campaign.metrics.openRate.toFixed(1)}%
                            </div>
                            <p className="text-xs text-muted-foreground">Taxa Abertura</p>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-cyan-500">
                              {campaign.metrics.clickRate.toFixed(1)}%
                            </div>
                            <p className="text-xs text-muted-foreground">Taxa Clique</p>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-red-500">
                              {campaign.metrics.unsubscribed}
                            </div>
                            <p className="text-xs text-muted-foreground">Descadastros</p>
                          </div>
                        </div>
                      )}

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" data-testid={`button-view-${campaign.id}`}>
                            <Eye className="h-4 w-4 mr-1" />
                            Ver Detalhes
                          </Button>
                          {campaign.status === 'draft' && (
                            <>
                              <Button variant="outline" size="sm" data-testid={`button-edit-${campaign.id}`}>
                                <Edit className="h-4 w-4 mr-1" />
                                Editar
                              </Button>
                              <Button 
                                size="sm"
                                onClick={() => handleSendCampaign(campaign.id)}
                                data-testid={`button-send-${campaign.id}`}
                              >
                                <Send className="h-4 w-4 mr-1" />
                                Enviar Agora
                              </Button>
                            </>
                          )}
                          {campaign.status === 'scheduled' && (
                            <Button variant="outline" size="sm" data-testid={`button-cancel-${campaign.id}`}>
                              <XCircle className="h-4 w-4 mr-1" />
                              Cancelar
                            </Button>
                          )}
                          {campaign.status === 'sent' && (
                            <Button variant="outline" size="sm" data-testid={`button-duplicate-${campaign.id}`}>
                              <Copy className="h-4 w-4 mr-1" />
                              Duplicar
                            </Button>
                          )}
                        </div>
                        
                        <div className="text-xs text-muted-foreground">
                          ID: {campaign.id}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Listas */}
          <TabsContent value="lists" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Gerenciar Listas de Contatos</h3>
              <div className="flex items-center space-x-4">
                <Button variant="outline" data-testid="button-import-contacts">
                  <Upload className="h-4 w-4 mr-2" />
                  Importar Contatos
                </Button>
                <Button data-testid="button-export-contacts">
                  <Download className="h-4 w-4 mr-2" />
                  Exportar
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mockLists.map((list) => (
                <Card key={list.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {/* Header da lista */}
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <h3 className="font-semibold">{list.name}</h3>
                          <p className="text-sm text-muted-foreground">{list.description}</p>
                        </div>
                        <Badge variant={list.status === 'active' ? 'default' : 'secondary'}>
                          {list.status === 'active' ? 'Ativa' : 'Arquivada'}
                        </Badge>
                      </div>

                      {/* Estatísticas */}
                      <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                        <div className="text-center">
                          <div className="text-lg font-bold text-blue-500">
                            {formatNumber(list.subscribers)}
                          </div>
                          <p className="text-xs text-muted-foreground">Total Inscritos</p>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-green-500">
                            {formatNumber(list.activeSubscribers)}
                          </div>
                          <p className="text-xs text-muted-foreground">Ativos</p>
                        </div>
                      </div>

                      {/* Taxa de crescimento */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Crescimento mensal</span>
                          <span className="text-green-500 font-medium">+{list.growthRate}%</span>
                        </div>
                        <Progress value={Math.min(list.growthRate, 100)} className="h-2" />
                      </div>

                      {/* Segmentação */}
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Segmentação:</h4>
                        <div className="flex flex-wrap gap-1">
                          {list.segmentation.map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" data-testid={`button-view-list-${list.id}`}>
                            <Eye className="h-4 w-4 mr-1" />
                            Ver Contatos
                          </Button>
                          <Button variant="outline" size="sm" data-testid={`button-edit-list-${list.id}`}>
                            <Edit className="h-4 w-4 mr-1" />
                            Editar
                          </Button>
                        </div>
                        
                        <div className="text-xs text-muted-foreground">
                          Atualizada em: {list.lastUpdate}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Templates */}
          <TabsContent value="templates" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Templates de Email</h3>
              <div className="flex items-center space-x-4">
                <Button data-testid="button-new-template">
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Template
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockTemplates.map((template) => (
                <Card key={template.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {/* Preview placeholder */}
                      <div className="w-full h-32 bg-muted rounded-lg flex items-center justify-center">
                        <FileText className="h-8 w-8 text-muted-foreground" />
                      </div>

                      {/* Header do template */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold">{template.name}</h3>
                          <Badge variant="outline" className="text-xs">
                            {template.category === 'newsletter' ? 'Newsletter' :
                             template.category === 'welcome' ? 'Boas-vindas' :
                             template.category === 'promotional' ? 'Promocional' : 'Notificação'}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{template.description}</p>
                      </div>

                      {/* Estatísticas */}
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Usado {template.usageCount} vezes</span>
                        <span className="text-muted-foreground">Mod. {template.lastModified}</span>
                      </div>

                      {/* Footer */}
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" className="flex-1" data-testid={`button-preview-${template.id}`}>
                          <Eye className="h-4 w-4 mr-1" />
                          Preview
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1" data-testid={`button-use-template-${template.id}`}>
                          <Copy className="h-4 w-4 mr-1" />
                          Usar
                        </Button>
                        <Button variant="outline" size="sm" data-testid={`button-edit-template-${template.id}`}>
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Automação */}
          <TabsContent value="automation" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Fluxos de Automação</h3>
              <div className="flex items-center space-x-4">
                <Button data-testid="button-new-automation">
                  <Zap className="h-4 w-4 mr-2" />
                  Novo Fluxo
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <UserPlus className="h-5 w-5" />
                    <span>Sequência de Boas-vindas</span>
                  </CardTitle>
                  <CardDescription>
                    Automação para novos inscritos da lista principal
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">1</div>
                      <div className="flex-1">
                        <div className="font-medium">Email de boas-vindas</div>
                        <div className="text-sm text-muted-foreground">Imediatamente</div>
                      </div>
                      <Badge variant="secondary">Ativo</Badge>
                    </div>

                    <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold">2</div>
                      <div className="flex-1">
                        <div className="font-medium">Guia de conteúdo</div>
                        <div className="text-sm text-muted-foreground">3 dias depois</div>
                      </div>
                      <Badge variant="secondary">Ativo</Badge>
                    </div>

                    <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                      <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">3</div>
                      <div className="flex-1">
                        <div className="font-medium">Convite para premium</div>
                        <div className="text-sm text-muted-foreground">7 dias depois</div>
                      </div>
                      <Badge variant="secondary">Ativo</Badge>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" data-testid="button-edit-automation-welcome">
                      <Edit className="h-4 w-4 mr-1" />
                      Editar
                    </Button>
                    <Button variant="outline" size="sm" data-testid="button-stats-automation-welcome">
                      <BarChart3 className="h-4 w-4 mr-1" />
                      Estatísticas
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Bell className="h-5 w-5" />
                    <span>Notificação de Vídeo</span>
                  </CardTitle>
                  <CardDescription>
                    Automação disparada quando um novo vídeo é publicado
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                      <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm font-bold">1</div>
                      <div className="flex-1">
                        <div className="font-medium">Trigger: Novo vídeo</div>
                        <div className="text-sm text-muted-foreground">Webhook do YouTube</div>
                      </div>
                      <Badge variant="secondary">Ativo</Badge>
                    </div>

                    <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                      <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white text-sm font-bold">2</div>
                      <div className="flex-1">
                        <div className="font-medium">Email de notificação</div>
                        <div className="text-sm text-muted-foreground">30 min depois</div>
                      </div>
                      <Badge variant="secondary">Ativo</Badge>
                    </div>
                  </div>

                  <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                    <div className="text-sm font-medium">Performance:</div>
                    <div className="text-xs text-muted-foreground">156 emails enviados esta semana</div>
                    <div className="text-xs text-muted-foreground">Taxa de abertura: 42.3%</div>
                  </div>

                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" data-testid="button-edit-automation-video">
                      <Edit className="h-4 w-4 mr-1" />
                      Editar
                    </Button>
                    <Button variant="outline" size="sm" data-testid="button-pause-automation-video">
                      <PauseCircle className="h-4 w-4 mr-1" />
                      Pausar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Analytics */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Performance das Campanhas</CardTitle>
                  <CardDescription>Últimos 30 dias</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-green-500">34.8%</div>
                        <p className="text-sm text-muted-foreground">Taxa de Abertura</p>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-blue-500">18.7%</div>
                        <p className="text-sm text-muted-foreground">Taxa de Clique</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Newsletter</span>
                        <span className="font-medium">36.2%</span>
                      </div>
                      <Progress value={36.2} className="h-2" />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Promocional</span>
                        <span className="font-medium">28.4%</span>
                      </div>
                      <Progress value={28.4} className="h-2" />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Transacional</span>
                        <span className="font-medium">45.1%</span>
                      </div>
                      <Progress value={45.1} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Crescimento da Lista</CardTitle>
                  <CardDescription>Inscritos vs Descadastros</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-green-500">+1,247</div>
                        <p className="text-sm text-muted-foreground">Novos Inscritos</p>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-red-500">-89</div>
                        <p className="text-sm text-muted-foreground">Descadastros</p>
                      </div>
                    </div>

                    <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                      <div className="text-lg font-bold text-green-700 dark:text-green-300">
                        +1,158 crescimento líquido
                      </div>
                      <p className="text-sm text-muted-foreground">Taxa de crescimento: +6.8%</p>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Fontes de Inscrição:</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>YouTube (descrição)</span>
                          <span>67%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Site oficial</span>
                          <span>23%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Redes sociais</span>
                          <span>10%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Relatório Detalhado</CardTitle>
                <CardDescription>Métricas consolidadas do email marketing</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-blue-500">127,450</div>
                    <p className="text-sm text-muted-foreground">Emails Enviados</p>
                  </div>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-green-500">124,830</div>
                    <p className="text-sm text-muted-foreground">Emails Entregues</p>
                  </div>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-purple-500">43,410</div>
                    <p className="text-sm text-muted-foreground">Emails Abertos</p>
                  </div>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-orange-500">8,120</div>
                    <p className="text-sm text-muted-foreground">Cliques Únicos</p>
                  </div>
                </div>

                <div className="mt-6 flex justify-center">
                  <Button data-testid="button-download-report">
                    <Download className="h-4 w-4 mr-2" />
                    Baixar Relatório Completo
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}