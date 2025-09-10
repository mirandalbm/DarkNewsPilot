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
import { 
  Bell, 
  BellRing,
  BellOff,
  Settings,
  Plus,
  Filter,
  Search,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  XCircle,
  Clock,
  Calendar,
  User,
  Users,
  Mail,
  MessageSquare,
  Smartphone,
  Monitor,
  Globe,
  Zap,
  Activity,
  TrendingUp,
  TrendingDown,
  Star,
  Heart,
  ThumbsUp,
  Share2,
  Play,
  Video,
  Upload,
  Download,
  Database,
  Server,
  Shield,
  AlertTriangle,
  Info,
  HelpCircle,
  ExternalLink,
  Target,
  BarChart3,
  Package,
  Gift,
  Award,
  Crown,
  Sparkles,
  Trash2,
  Edit,
  Send,
  Archive,
  Bookmark,
  Flag,
  Tag,
  Link,
  Copy,
  Repeat,
  Volume2,
  VolumeX,
  Pause,
  PauseCircle,
  PlayCircle,
  RefreshCw
} from 'lucide-react';

interface Notification {
  id: string;
  type: 'video' | 'comment' | 'subscriber' | 'revenue' | 'system' | 'security' | 'community' | 'milestone';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  channel: 'email' | 'discord' | 'browser' | 'sms' | 'webhook';
  metadata?: {
    videoId?: string;
    userId?: string;
    amount?: number;
    link?: string;
    extra?: any;
  };
}

interface NotificationTemplate {
  id: string;
  name: string;
  type: string;
  title: string;
  content: string;
  channels: string[];
  triggers: string[];
  conditions: string[];
  enabled: boolean;
  variables: string[];
}

interface NotificationRule {
  id: string;
  name: string;
  event: string;
  conditions: Array<{
    field: string;
    operator: string;
    value: string;
  }>;
  actions: Array<{
    type: string;
    template: string;
    channels: string[];
    delay?: number;
  }>;
  enabled: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

const mockNotifications: Notification[] = [
  {
    id: 'notif_001',
    type: 'video',
    title: 'Novo vídeo publicado',
    message: 'O vídeo "Mistérios Não Resolvidos do Brasil" foi publicado com sucesso e já está recebendo visualizações',
    timestamp: '2024-03-08 14:30:00',
    read: false,
    priority: 'high',
    channel: 'discord',
    metadata: {
      videoId: 'video_123',
      link: 'https://youtube.com/watch?v=abc123'
    }
  },
  {
    id: 'notif_002',
    type: 'milestone',
    title: 'Meta de inscritos atingida!',
    message: 'Parabéns! Seu canal acabou de alcançar 50.000 inscritos 🎉',
    timestamp: '2024-03-08 12:15:00',
    read: false,
    priority: 'high',
    channel: 'email',
    metadata: {
      extra: { milestone: 50000 }
    }
  },
  {
    id: 'notif_003',
    type: 'revenue',
    title: 'Receita mensal superou expectativas',
    message: 'A receita deste mês já ultrapassou R$ 5.000, um aumento de 25% em relação ao mês anterior',
    timestamp: '2024-03-08 10:45:00',
    read: true,
    priority: 'medium',
    channel: 'browser',
    metadata: {
      amount: 5000
    }
  },
  {
    id: 'notif_004',
    type: 'comment',
    title: 'Comentário em destaque',
    message: 'Um novo comentário em "Casa Assombrada: Investigação Real" recebeu muitas curtidas',
    timestamp: '2024-03-08 09:20:00',
    read: true,
    priority: 'low',
    channel: 'browser',
    metadata: {
      videoId: 'video_456'
    }
  },
  {
    id: 'notif_005',
    type: 'system',
    title: 'Backup concluído',
    message: 'O backup automático dos dados foi concluído com sucesso',
    timestamp: '2024-03-08 06:00:00',
    read: true,
    priority: 'low',
    channel: 'email'
  },
  {
    id: 'notif_006',
    type: 'security',
    title: 'Tentativa de login detectada',
    message: 'Nova tentativa de login de um dispositivo não reconhecido foi bloqueada',
    timestamp: '2024-03-07 23:15:00',
    read: false,
    priority: 'urgent',
    channel: 'sms',
    metadata: {
      extra: { ip: '192.168.1.100', location: 'São Paulo, BR' }
    }
  }
];

const mockTemplates: NotificationTemplate[] = [
  {
    id: 'template_001',
    name: 'Novo Vídeo Publicado',
    type: 'video_published',
    title: '🎬 Novo vídeo: {video_title}',
    content: 'Seu novo vídeo "{video_title}" foi publicado com sucesso!\n\n📊 Estatísticas:\n• Visualizações: {views}\n• Curtidas: {likes}\n• Comentários: {comments}\n\n🔗 Assista: {video_url}',
    channels: ['discord', 'email'],
    triggers: ['video_published'],
    conditions: ['video_status=published'],
    enabled: true,
    variables: ['video_title', 'views', 'likes', 'comments', 'video_url']
  },
  {
    id: 'template_002',
    name: 'Meta de Inscritos',
    type: 'subscriber_milestone',
    title: '🎉 {milestone} inscritos alcançados!',
    content: 'Parabéns! Seu canal acabou de atingir {milestone} inscritos!\n\nEsta é uma conquista incrível. Continue criando conteúdo de qualidade para manter o crescimento.\n\n📈 Crescimento recente: +{recent_growth} inscritos esta semana',
    channels: ['discord', 'email', 'browser'],
    triggers: ['subscriber_milestone'],
    conditions: ['subscribers_count>=milestone'],
    enabled: true,
    variables: ['milestone', 'recent_growth', 'total_subscribers']
  },
  {
    id: 'template_003',
    name: 'Receita Mensal',
    type: 'revenue_report',
    title: '💰 Relatório de receita - {month}',
    content: 'Relatório de receita para {month}:\n\n💵 Total: {total_revenue}\n📈 Crescimento: {growth_percentage}%\n\nFontes de receita:\n• AdSense: {adsense_revenue}\n• Patrocínios: {sponsors_revenue}\n• Afiliados: {affiliate_revenue}',
    channels: ['email'],
    triggers: ['monthly_revenue_report'],
    conditions: ['month_ended=true'],
    enabled: true,
    variables: ['month', 'total_revenue', 'growth_percentage', 'adsense_revenue', 'sponsors_revenue', 'affiliate_revenue']
  }
];

const mockRules: NotificationRule[] = [
  {
    id: 'rule_001',
    name: 'Vídeo Viral',
    event: 'video_performance',
    conditions: [
      { field: 'views', operator: '>', value: '10000' },
      { field: 'time_since_publish', operator: '<', value: '24h' }
    ],
    actions: [
      {
        type: 'send_notification',
        template: 'template_001',
        channels: ['discord', 'email']
      }
    ],
    enabled: true,
    priority: 'high'
  },
  {
    id: 'rule_002',
    name: 'Receita Baixa',
    event: 'daily_revenue',
    conditions: [
      { field: 'daily_revenue', operator: '<', value: '100' },
      { field: 'day_of_month', operator: '>', value: '15' }
    ],
    actions: [
      {
        type: 'send_notification',
        template: 'template_003',
        channels: ['email'],
        delay: 3600
      }
    ],
    enabled: true,
    priority: 'medium'
  }
];

export default function Notifications() {
  const [selectedTab, setSelectedTab] = useState('notifications');
  const [filterType, setFilterType] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showOnlyUnread, setShowOnlyUnread] = useState(false);
  const [showTemplateDialog, setShowTemplateDialog] = useState(false);
  const [showRuleDialog, setShowRuleDialog] = useState(false);
  const { toast } = useToast();

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'video': return 'bg-red-100 text-red-800 dark:bg-red-950';
      case 'comment': return 'bg-blue-100 text-blue-800 dark:bg-blue-950';
      case 'subscriber': return 'bg-green-100 text-green-800 dark:bg-green-950';
      case 'revenue': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950';
      case 'system': return 'bg-gray-100 text-gray-800 dark:bg-gray-950';
      case 'security': return 'bg-red-100 text-red-800 dark:bg-red-950';
      case 'community': return 'bg-purple-100 text-purple-800 dark:bg-purple-950';
      case 'milestone': return 'bg-orange-100 text-orange-800 dark:bg-orange-950';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-950';
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

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="h-4 w-4" />;
      case 'comment': return <MessageSquare className="h-4 w-4" />;
      case 'subscriber': return <Users className="h-4 w-4" />;
      case 'revenue': return <TrendingUp className="h-4 w-4" />;
      case 'system': return <Server className="h-4 w-4" />;
      case 'security': return <Shield className="h-4 w-4" />;
      case 'community': return <Heart className="h-4 w-4" />;
      case 'milestone': return <Award className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'email': return <Mail className="h-3 w-3" />;
      case 'discord': return <MessageSquare className="h-3 w-3" />;
      case 'browser': return <Monitor className="h-3 w-3" />;
      case 'sms': return <Smartphone className="h-3 w-3" />;
      case 'webhook': return <Globe className="h-3 w-3" />;
      default: return <Bell className="h-3 w-3" />;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) {
      return `${minutes}m atrás`;
    } else if (hours < 24) {
      return `${hours}h atrás`;
    } else if (days < 7) {
      return `${days}d atrás`;
    } else {
      return date.toLocaleDateString('pt-BR');
    }
  };

  const handleMarkAsRead = (notificationId: string) => {
    toast({
      title: "Notificação marcada como lida",
      description: "A notificação foi marcada como lida",
    });
  };

  const handleMarkAllAsRead = () => {
    toast({
      title: "Todas marcadas como lidas",
      description: "Todas as notificações foram marcadas como lidas",
    });
  };

  const handleCreateTemplate = () => {
    toast({
      title: "Template criado",
      description: "Novo template de notificação foi criado",
    });
    setShowTemplateDialog(false);
  };

  const handleCreateRule = () => {
    toast({
      title: "Regra criada",
      description: "Nova regra de notificação foi criada",
    });
    setShowRuleDialog(false);
  };

  const unreadCount = mockNotifications.filter(n => !n.read).length;
  const filteredNotifications = mockNotifications.filter(notification => {
    let matches = true;
    
    if (filterType !== 'all' && notification.type !== filterType) matches = false;
    if (filterPriority !== 'all' && notification.priority !== filterPriority) matches = false;
    if (showOnlyUnread && notification.read) matches = false;
    if (searchTerm && !notification.title.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !notification.message.toLowerCase().includes(searchTerm.toLowerCase())) matches = false;
    
    return matches;
  });

  return (
    <div className="container mx-auto px-6 py-8 max-w-7xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <Bell className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Sistema de Notificações</h1>
              <p className="text-muted-foreground">Gerencie alertas e comunicações automáticas</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {unreadCount > 0 && (
              <Button variant="outline" onClick={handleMarkAllAsRead} data-testid="button-mark-all-read">
                <CheckCircle className="h-4 w-4 mr-2" />
                Marcar Todas como Lidas ({unreadCount})
              </Button>
            )}
            
            <Button data-testid="button-notification-settings">
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
                  <p className="text-sm font-medium text-muted-foreground">Não Lidas</p>
                  <p className="text-2xl font-bold">{unreadCount}</p>
                  <p className="text-xs text-red-500 flex items-center mt-1">
                    <BellRing className="h-3 w-3 mr-1" />
                    Requerem atenção
                  </p>
                </div>
                <BellRing className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Hoje</p>
                  <p className="text-2xl font-bold">{mockNotifications.filter(n => 
                    new Date(n.timestamp).toDateString() === new Date().toDateString()
                  ).length}</p>
                  <p className="text-xs text-blue-500 flex items-center mt-1">
                    <Calendar className="h-3 w-3 mr-1" />
                    Últimas 24h
                  </p>
                </div>
                <Activity className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Templates Ativos</p>
                  <p className="text-2xl font-bold">{mockTemplates.filter(t => t.enabled).length}</p>
                  <p className="text-xs text-green-500 flex items-center mt-1">
                    <Zap className="h-3 w-3 mr-1" />
                    de {mockTemplates.length} total
                  </p>
                </div>
                <Package className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Regras Ativas</p>
                  <p className="text-2xl font-bold">{mockRules.filter(r => r.enabled).length}</p>
                  <p className="text-xs text-purple-500 flex items-center mt-1">
                    <Target className="h-3 w-3 mr-1" />
                    de {mockRules.length} total
                  </p>
                </div>
                <Target className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="notifications">Notificações</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="rules">Regras</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Notificações */}
          <TabsContent value="notifications" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Notificações Recentes</h3>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={showOnlyUnread}
                    onCheckedChange={setShowOnlyUnread}
                    data-testid="switch-unread-only"
                  />
                  <Label className="text-sm">Apenas não lidas</Label>
                </div>
                
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar notificações..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                    data-testid="input-search-notifications"
                  />
                </div>
                
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-40" data-testid="select-type-filter">
                    <SelectValue placeholder="Tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="video">Vídeo</SelectItem>
                    <SelectItem value="comment">Comentário</SelectItem>
                    <SelectItem value="subscriber">Inscrito</SelectItem>
                    <SelectItem value="revenue">Receita</SelectItem>
                    <SelectItem value="system">Sistema</SelectItem>
                    <SelectItem value="security">Segurança</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={filterPriority} onValueChange={setFilterPriority}>
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
              {filteredNotifications.map((notification) => (
                <Card 
                  key={notification.id} 
                  className={`hover:shadow-md transition-shadow ${!notification.read ? 'border-l-4 border-l-blue-500' : ''}`}
                >
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {/* Header da notificação */}
                      <div className="flex items-start justify-between">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center space-x-2">
                            {getTypeIcon(notification.type)}
                            <h3 className={`font-semibold ${!notification.read ? 'text-blue-600' : ''}`}>
                              {notification.title}
                            </h3>
                            <Badge className={getTypeColor(notification.type)}>
                              {notification.type === 'video' ? 'Vídeo' :
                               notification.type === 'comment' ? 'Comentário' :
                               notification.type === 'subscriber' ? 'Inscrito' :
                               notification.type === 'revenue' ? 'Receita' :
                               notification.type === 'system' ? 'Sistema' :
                               notification.type === 'security' ? 'Segurança' :
                               notification.type === 'community' ? 'Comunidade' : 'Marco'}
                            </Badge>
                            <div className={`w-2 h-2 rounded-full ${getPriorityColor(notification.priority)}`} />
                            {!notification.read && <Badge variant="destructive" className="text-xs">Nova</Badge>}
                          </div>
                          <p className="text-sm text-muted-foreground">{notification.message}</p>
                          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                            <span className="flex items-center space-x-1">
                              <Clock className="h-3 w-3" />
                              <span>{formatTimestamp(notification.timestamp)}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              {getChannelIcon(notification.channel)}
                              <span>{notification.channel}</span>
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="flex space-x-2">
                          {!notification.read && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleMarkAsRead(notification.id)}
                              data-testid={`button-mark-read-${notification.id}`}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              Marcar como Lida
                            </Button>
                          )}
                          {notification.metadata?.link && (
                            <Button variant="outline" size="sm" data-testid={`button-view-${notification.id}`}>
                              <ExternalLink className="h-4 w-4 mr-1" />
                              Ver Detalhes
                            </Button>
                          )}
                          <Button variant="outline" size="sm" data-testid={`button-archive-${notification.id}`}>
                            <Archive className="h-4 w-4 mr-1" />
                            Arquivar
                          </Button>
                        </div>
                        
                        <div className="text-xs text-muted-foreground">
                          ID: {notification.id}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredNotifications.length === 0 && (
              <div className="text-center py-12">
                <BellOff className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Nenhuma notificação encontrada</h3>
                <p className="text-muted-foreground">
                  {showOnlyUnread ? 'Todas as notificações foram lidas' : 'Tente ajustar os filtros'}
                </p>
              </div>
            )}
          </TabsContent>

          {/* Templates */}
          <TabsContent value="templates" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Templates de Notificação</h3>
              <Dialog open={showTemplateDialog} onOpenChange={setShowTemplateDialog}>
                <DialogTrigger asChild>
                  <Button data-testid="button-new-template">
                    <Plus className="h-4 w-4 mr-2" />
                    Novo Template
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Criar Novo Template</DialogTitle>
                    <DialogDescription>
                      Configure um novo template de notificação
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="template-name">Nome do Template</Label>
                        <Input id="template-name" placeholder="Ex: Novo Comentário" data-testid="input-template-name" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="template-type">Tipo</Label>
                        <Select>
                          <SelectTrigger data-testid="select-template-type">
                            <SelectValue placeholder="Tipo de evento" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="video_published">Vídeo Publicado</SelectItem>
                            <SelectItem value="subscriber_milestone">Marco de Inscritos</SelectItem>
                            <SelectItem value="revenue_alert">Alerta de Receita</SelectItem>
                            <SelectItem value="comment_highlight">Comentário Destacado</SelectItem>
                            <SelectItem value="system_alert">Alerta de Sistema</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="template-title">Título da Notificação</Label>
                      <Input id="template-title" placeholder="Use variáveis como {video_title}" data-testid="input-template-title" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="template-content">Conteúdo</Label>
                      <Textarea 
                        id="template-content" 
                        placeholder="Conteúdo da notificação com variáveis..."
                        className="min-h-[100px]"
                        data-testid="textarea-template-content"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Canais de Entrega</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="email" defaultChecked />
                          <Label htmlFor="email" className="text-sm">Email</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="discord" />
                          <Label htmlFor="discord" className="text-sm">Discord</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="browser" defaultChecked />
                          <Label htmlFor="browser" className="text-sm">Navegador</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="sms" />
                          <Label htmlFor="sms" className="text-sm">SMS</Label>
                        </div>
                      </div>
                    </div>

                    <Button onClick={handleCreateTemplate} className="w-full" data-testid="button-create-template">
                      Criar Template
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="space-y-4">
              {mockTemplates.map((template) => (
                <Card key={template.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {/* Header do template */}
                      <div className="flex items-center justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <h3 className="font-semibold">{template.name}</h3>
                            <Badge variant="outline">{template.type}</Badge>
                            <Switch 
                              checked={template.enabled}
                              data-testid={`switch-template-${template.id}`}
                            />
                          </div>
                          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                            <span>Canais: {template.channels.join(', ')}</span>
                            <span>Variáveis: {template.variables.length}</span>
                          </div>
                        </div>
                      </div>

                      {/* Conteúdo do template */}
                      <div className="space-y-2">
                        <div className="p-3 bg-muted/50 rounded-lg">
                          <h4 className="font-medium text-sm mb-1">Título:</h4>
                          <p className="text-sm">{template.title}</p>
                        </div>
                        <div className="p-3 bg-muted/50 rounded-lg">
                          <h4 className="font-medium text-sm mb-1">Conteúdo:</h4>
                          <p className="text-sm whitespace-pre-line">{template.content}</p>
                        </div>
                      </div>

                      {/* Variáveis disponíveis */}
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Variáveis disponíveis:</h4>
                        <div className="flex flex-wrap gap-1">
                          {template.variables.map((variable, index) => (
                            <Badge key={index} variant="outline" className="text-xs font-mono">
                              {`{${variable}}`}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" data-testid={`button-edit-template-${template.id}`}>
                            <Edit className="h-4 w-4 mr-1" />
                            Editar
                          </Button>
                          <Button variant="outline" size="sm" data-testid={`button-test-template-${template.id}`}>
                            <Send className="h-4 w-4 mr-1" />
                            Testar
                          </Button>
                          <Button variant="outline" size="sm" data-testid={`button-copy-template-${template.id}`}>
                            <Copy className="h-4 w-4 mr-1" />
                            Duplicar
                          </Button>
                        </div>
                        
                        <div className="text-xs text-muted-foreground">
                          ID: {template.id}
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
              <h3 className="text-lg font-semibold">Regras de Automação</h3>
              <Dialog open={showRuleDialog} onOpenChange={setShowRuleDialog}>
                <DialogTrigger asChild>
                  <Button data-testid="button-new-rule">
                    <Target className="h-4 w-4 mr-2" />
                    Nova Regra
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Criar Nova Regra</DialogTitle>
                    <DialogDescription>
                      Configure uma nova regra de automação
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="rule-name">Nome da Regra</Label>
                        <Input id="rule-name" placeholder="Ex: Vídeo com Muitas Views" data-testid="input-rule-name" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="rule-event">Evento</Label>
                        <Select>
                          <SelectTrigger data-testid="select-rule-event">
                            <SelectValue placeholder="Tipo de evento" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="video_published">Vídeo Publicado</SelectItem>
                            <SelectItem value="video_performance">Performance do Vídeo</SelectItem>
                            <SelectItem value="subscriber_count">Contagem de Inscritos</SelectItem>
                            <SelectItem value="revenue_change">Mudança na Receita</SelectItem>
                            <SelectItem value="comment_received">Comentário Recebido</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Condições</Label>
                      <div className="grid grid-cols-3 gap-2">
                        <Select>
                          <SelectTrigger data-testid="select-condition-field">
                            <SelectValue placeholder="Campo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="views">Visualizações</SelectItem>
                            <SelectItem value="likes">Curtidas</SelectItem>
                            <SelectItem value="comments">Comentários</SelectItem>
                            <SelectItem value="subscribers">Inscritos</SelectItem>
                            <SelectItem value="revenue">Receita</SelectItem>
                          </SelectContent>
                        </Select>
                        
                        <Select>
                          <SelectTrigger data-testid="select-condition-operator">
                            <SelectValue placeholder="Operador" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value=">">Maior que</SelectItem>
                            <SelectItem value="<">Menor que</SelectItem>
                            <SelectItem value=">=">Maior ou igual</SelectItem>
                            <SelectItem value="<=">Menor ou igual</SelectItem>
                            <SelectItem value="=">Igual a</SelectItem>
                          </SelectContent>
                        </Select>
                        
                        <Input placeholder="Valor" data-testid="input-condition-value" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="rule-template">Template de Notificação</Label>
                      <Select>
                        <SelectTrigger data-testid="select-rule-template">
                          <SelectValue placeholder="Selecione o template" />
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

                    <div className="space-y-2">
                      <Label htmlFor="rule-priority">Prioridade</Label>
                      <Select>
                        <SelectTrigger data-testid="select-rule-priority">
                          <SelectValue placeholder="Nível de prioridade" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Baixa</SelectItem>
                          <SelectItem value="medium">Média</SelectItem>
                          <SelectItem value="high">Alta</SelectItem>
                          <SelectItem value="urgent">Urgente</SelectItem>
                        </SelectContent>
                      </Select>
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
                            <Badge variant="outline">{rule.event}</Badge>
                            <Badge className={
                              rule.priority === 'low' ? 'bg-gray-100 text-gray-800' :
                              rule.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                              rule.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                              'bg-red-100 text-red-800'
                            }>
                              {rule.priority === 'low' ? 'Baixa' :
                               rule.priority === 'medium' ? 'Média' :
                               rule.priority === 'high' ? 'Alta' : 'Urgente'}
                            </Badge>
                            <Switch 
                              checked={rule.enabled}
                              data-testid={`switch-rule-${rule.id}`}
                            />
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

                      {/* Ações */}
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Ações:</h4>
                        <div className="space-y-1">
                          {rule.actions.map((action, index) => (
                            <div key={index} className="text-sm p-2 bg-muted/50 rounded">
                              Enviar notificação via: {action.channels.join(', ')}
                              {action.delay && ` (delay: ${action.delay}s)`}
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
                            <PlayCircle className="h-4 w-4 mr-1" />
                            Testar
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

          {/* Analytics */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Notificações por Tipo</CardTitle>
                  <CardDescription>Distribuição dos tipos de notificação</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {['video', 'revenue', 'subscriber', 'comment', 'system'].map((type) => {
                      const count = mockNotifications.filter(n => n.type === type).length;
                      const percentage = (count / mockNotifications.length) * 100;
                      
                      return (
                        <div key={type} className="space-y-2">
                          <div className="flex justify-between">
                            <span className="capitalize font-medium">{type}</span>
                            <span className="text-sm text-muted-foreground">{count} ({percentage.toFixed(1)}%)</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div 
                              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
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
                  <CardTitle>Performance de Canais</CardTitle>
                  <CardDescription>Taxa de entrega por canal</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { channel: 'email', delivered: 98.5, failed: 1.5 },
                      { channel: 'discord', delivered: 95.2, failed: 4.8 },
                      { channel: 'browser', delivered: 87.3, failed: 12.7 },
                      { channel: 'sms', delivered: 99.1, failed: 0.9 }
                    ].map((data) => (
                      <div key={data.channel} className="space-y-2">
                        <div className="flex justify-between">
                          <span className="capitalize font-medium">{data.channel}</span>
                          <span className="text-sm text-muted-foreground">{data.delivered}% entregue</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${data.delivered}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Métricas Consolidadas</CardTitle>
                <CardDescription>Resumo da performance do sistema de notificações</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-blue-500">2,847</div>
                    <p className="text-sm text-muted-foreground">Notificações Enviadas (30d)</p>
                  </div>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-green-500">96.8%</div>
                    <p className="text-sm text-muted-foreground">Taxa de Entrega</p>
                  </div>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-purple-500">73.2%</div>
                    <p className="text-sm text-muted-foreground">Taxa de Leitura</p>
                  </div>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-orange-500">12.4%</div>
                    <p className="text-sm text-muted-foreground">Taxa de Clique</p>
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