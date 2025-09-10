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
import { Textarea } from '@/components/ui/textarea';
import { 
  Bot, 
  Users,
  MessageSquare,
  Settings,
  Zap,
  Shield,
  Bell,
  PlayCircle,
  PauseCircle,
  StopCircle,
  CheckCircle,
  AlertCircle,
  XCircle,
  Clock,
  Activity,
  BarChart3,
  TrendingUp,
  Hash,
  AtSign,
  Star,
  Crown,
  Trash2,
  Edit,
  Plus,
  Eye,
  Download,
  Upload,
  RefreshCw,
  Search,
  Filter,
  Calendar,
  Target,
  Award,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  UserPlus,
  UserMinus,
  Ban,
  Unban,
  AlertTriangle,
  Info,
  HelpCircle,
  ExternalLink,
  Link,
  Copy,
  Send,
  Reply,
  Forward,
  Pin,
  Bookmark,
  FileText,
  Image,
  Video,
  Music,
  Gift,
  Heart,
  ThumbsUp,
  Smile,
  Package,
  Code,
  Terminal,
  Database,
  Server,
  Wifi,
  WifiOff,
  Globe
} from 'lucide-react';

interface DiscordServer {
  id: string;
  name: string;
  memberCount: number;
  onlineMembers: number;
  channels: number;
  botConnected: boolean;
  permissions: string[];
  features: string[];
}

interface BotCommand {
  id: string;
  name: string;
  description: string;
  category: 'moderation' | 'utility' | 'fun' | 'music' | 'custom';
  usageCount: number;
  enabled: boolean;
  permissions: string[];
  cooldown: number;
}

interface AutoMessage {
  id: string;
  type: 'welcome' | 'goodbye' | 'video_notification' | 'reminder' | 'announcement';
  title: string;
  content: string;
  channel: string;
  enabled: boolean;
  triggers: string[];
  conditions: string[];
  createdAt: string;
}

interface ModerationLog {
  id: string;
  action: 'ban' | 'kick' | 'mute' | 'warn' | 'timeout';
  user: string;
  moderator: string;
  reason: string;
  timestamp: string;
  duration?: string;
  status: 'active' | 'expired' | 'revoked';
}

const mockServers: DiscordServer[] = [
  {
    id: 'server_001',
    name: 'DarkNews Community',
    memberCount: 8542,
    onlineMembers: 1234,
    channels: 25,
    botConnected: true,
    permissions: ['ADMINISTRATOR', 'MANAGE_MESSAGES', 'MANAGE_ROLES', 'KICK_MEMBERS'],
    features: ['AUTO_MODERATION', 'WELCOME_MESSAGES', 'LEVEL_SYSTEM', 'MUSIC_BOT']
  },
  {
    id: 'server_002',
    name: 'True Crime Brasil',
    memberCount: 3421,
    onlineMembers: 567,
    channels: 15,
    botConnected: true,
    permissions: ['MANAGE_MESSAGES', 'MANAGE_ROLES'],
    features: ['AUTO_MODERATION', 'WELCOME_MESSAGES']
  },
  {
    id: 'server_003',
    name: 'Mysteries & Paranormal',
    memberCount: 1876,
    onlineMembers: 234,
    channels: 12,
    botConnected: false,
    permissions: [],
    features: []
  }
];

const mockCommands: BotCommand[] = [
  {
    id: 'cmd_001',
    name: '!novovideo',
    description: 'Anuncia automaticamente novos vídeos do canal',
    category: 'utility',
    usageCount: 1247,
    enabled: true,
    permissions: ['MANAGE_MESSAGES'],
    cooldown: 300
  },
  {
    id: 'cmd_002',
    name: '!ban',
    description: 'Bane um usuário do servidor',
    category: 'moderation',
    usageCount: 89,
    enabled: true,
    permissions: ['BAN_MEMBERS'],
    cooldown: 0
  },
  {
    id: 'cmd_003',
    name: '!play',
    description: 'Reproduz música no canal de voz',
    category: 'music',
    usageCount: 3456,
    enabled: true,
    permissions: ['CONNECT', 'SPEAK'],
    cooldown: 5
  },
  {
    id: 'cmd_004',
    name: '!misterio',
    description: 'Conta um mistério aleatório',
    category: 'fun',
    usageCount: 678,
    enabled: true,
    permissions: [],
    cooldown: 60
  },
  {
    id: 'cmd_005',
    name: '!clear',
    description: 'Apaga mensagens do canal',
    category: 'moderation',
    usageCount: 234,
    enabled: true,
    permissions: ['MANAGE_MESSAGES'],
    cooldown: 10
  }
];

const mockAutoMessages: AutoMessage[] = [
  {
    id: 'auto_001',
    type: 'welcome',
    title: 'Boas-vindas',
    content: '🎭 Bem-vindo ao **DarkNews Community**, {user}! \n\nConfira nossos canais:\n• 📺 #novos-videos\n• 💬 #discussao-geral\n• 🔍 #teorias-conspiracoes\n\nLeia as regras em #regras antes de participar!',
    channel: '#geral',
    enabled: true,
    triggers: ['member_join'],
    conditions: ['new_member'],
    createdAt: '2024-02-01'
  },
  {
    id: 'auto_002',
    type: 'video_notification',
    title: 'Novo Vídeo',
    content: '🚨 **NOVO VÍDEO DISPONÍVEL!** 🚨\n\n**{video_title}**\n\n👻 Mais um mistério desvendado! Assista agora e compartilhe suas teorias!\n\n🔗 {video_link}\n\n@everyone',
    channel: '#novos-videos',
    enabled: true,
    triggers: ['youtube_webhook'],
    conditions: ['new_video_published'],
    createdAt: '2024-02-15'
  },
  {
    id: 'auto_003',
    type: 'reminder',
    title: 'Lembrete de Lives',
    content: '📺 **LIVE AO VIVO EM 30 MINUTOS!**\n\nNão perca nossa discussão sobre os mistérios mais assombrados do Brasil!\n\n🕘 20:00 (horário de Brasília)\n📺 YouTube: DarkNews\n\n@here',
    channel: '#anuncios',
    enabled: true,
    triggers: ['scheduled_time'],
    conditions: ['30_minutes_before_live'],
    createdAt: '2024-03-01'
  }
];

const mockModerationLogs: ModerationLog[] = [
  {
    id: 'mod_001',
    action: 'ban',
    user: 'UsuarioProblematico#1234',
    moderator: 'ModeradorBot',
    reason: 'Spam excessivo e conteúdo inapropriado',
    timestamp: '2024-03-08 14:30:00',
    status: 'active'
  },
  {
    id: 'mod_002',
    action: 'timeout',
    user: 'MembroNervoso#5678',
    moderator: 'AutoMod',
    reason: 'Linguagem ofensiva detectada automaticamente',
    timestamp: '2024-03-08 12:15:00',
    duration: '24 horas',
    status: 'active'
  },
  {
    id: 'mod_003',
    action: 'warn',
    user: 'NovatoConfuso#9012',
    moderator: 'Admin#0001',
    reason: 'Postagem em canal incorreto',
    timestamp: '2024-03-07 18:45:00',
    status: 'active'
  }
];

export default function DiscordBot() {
  const [selectedServer, setSelectedServer] = useState<string>('server_001');
  const [commandFilter, setCommandFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCommandDialog, setShowCommandDialog] = useState(false);
  const [showMessageDialog, setShowMessageDialog] = useState(false);
  const { toast } = useToast();

  const getStatusColor = (connected: boolean) => {
    return connected ? 'text-green-500' : 'text-red-500';
  };

  const getStatusIcon = (connected: boolean) => {
    return connected ? 
      <CheckCircle className="h-4 w-4 text-green-500" /> : 
      <XCircle className="h-4 w-4 text-red-500" />;
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'moderation': return 'bg-red-100 text-red-800 dark:bg-red-950';
      case 'utility': return 'bg-blue-100 text-blue-800 dark:bg-blue-950';
      case 'fun': return 'bg-green-100 text-green-800 dark:bg-green-950';
      case 'music': return 'bg-purple-100 text-purple-800 dark:bg-purple-950';
      case 'custom': return 'bg-orange-100 text-orange-800 dark:bg-orange-950';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-950';
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'ban': return 'text-red-600 bg-red-100 dark:bg-red-950';
      case 'kick': return 'text-orange-600 bg-orange-100 dark:bg-orange-950';
      case 'timeout': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-950';
      case 'warn': return 'text-blue-600 bg-blue-100 dark:bg-blue-950';
      case 'mute': return 'text-gray-600 bg-gray-100 dark:bg-gray-950';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-950';
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

  const handleCreateCommand = () => {
    toast({
      title: "Comando criado",
      description: "Novo comando foi adicionado ao bot",
    });
    setShowCommandDialog(false);
  };

  const handleCreateAutoMessage = () => {
    toast({
      title: "Mensagem automática criada",
      description: "Nova automação foi configurada",
    });
    setShowMessageDialog(false);
  };

  const handleToggleCommand = (commandId: string) => {
    toast({
      title: "Comando atualizado",
      description: "Status do comando foi alterado",
    });
  };

  const handleConnectBot = (serverId: string) => {
    toast({
      title: "Bot conectado",
      description: "Bot foi conectado ao servidor com sucesso",
    });
  };

  const selectedServerData = mockServers.find(s => s.id === selectedServer);
  const totalMembers = mockServers.reduce((sum, server) => sum + server.memberCount, 0);
  const totalOnline = mockServers.reduce((sum, server) => sum + server.onlineMembers, 0);
  const connectedServers = mockServers.filter(s => s.botConnected).length;

  return (
    <div className="container mx-auto px-6 py-8 max-w-7xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Bot className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Discord Bot</h1>
              <p className="text-muted-foreground">Automação e gerenciamento da comunidade Discord</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Dialog open={showCommandDialog} onOpenChange={setShowCommandDialog}>
              <DialogTrigger asChild>
                <Button data-testid="button-new-command">
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Comando
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Criar Novo Comando</DialogTitle>
                  <DialogDescription>
                    Configure um novo comando personalizado para o bot
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="command-name">Nome do Comando</Label>
                    <Input id="command-name" placeholder="!meucomando" data-testid="input-command-name" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="command-description">Descrição</Label>
                    <Input id="command-description" placeholder="O que este comando faz" data-testid="input-command-description" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="command-category">Categoria</Label>
                      <Select>
                        <SelectTrigger data-testid="select-command-category">
                          <SelectValue placeholder="Categoria" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="utility">Utilidade</SelectItem>
                          <SelectItem value="fun">Diversão</SelectItem>
                          <SelectItem value="moderation">Moderação</SelectItem>
                          <SelectItem value="music">Música</SelectItem>
                          <SelectItem value="custom">Personalizado</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="command-cooldown">Cooldown (segundos)</Label>
                      <Input id="command-cooldown" type="number" placeholder="60" data-testid="input-command-cooldown" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="command-response">Resposta do Comando</Label>
                    <Textarea id="command-response" placeholder="Resposta que o bot enviará" data-testid="textarea-command-response" />
                  </div>

                  <Button onClick={handleCreateCommand} className="w-full" data-testid="button-create-command">
                    Criar Comando
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Button variant="outline" data-testid="button-bot-settings">
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
                  <p className="text-sm font-medium text-muted-foreground">Total de Membros</p>
                  <p className="text-2xl font-bold">{formatNumber(totalMembers)}</p>
                  <p className="text-xs text-green-500 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +{formatNumber(totalOnline)} online
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
                  <p className="text-sm font-medium text-muted-foreground">Servidores Conectados</p>
                  <p className="text-2xl font-bold">{connectedServers}</p>
                  <p className="text-xs text-blue-500 flex items-center mt-1">
                    <Server className="h-3 w-3 mr-1" />
                    de {mockServers.length} total
                  </p>
                </div>
                <Server className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Comandos Ativos</p>
                  <p className="text-2xl font-bold">{mockCommands.filter(cmd => cmd.enabled).length}</p>
                  <p className="text-xs text-purple-500 flex items-center mt-1">
                    <Terminal className="h-3 w-3 mr-1" />
                    de {mockCommands.length} total
                  </p>
                </div>
                <Terminal className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Uso de Comandos</p>
                  <p className="text-2xl font-bold">{formatNumber(mockCommands.reduce((sum, cmd) => sum + cmd.usageCount, 0))}</p>
                  <p className="text-xs text-orange-500 flex items-center mt-1">
                    <Activity className="h-3 w-3 mr-1" />
                    Este mês
                  </p>
                </div>
                <Activity className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="servers" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="servers">Servidores</TabsTrigger>
            <TabsTrigger value="commands">Comandos</TabsTrigger>
            <TabsTrigger value="automation">Automação</TabsTrigger>
            <TabsTrigger value="moderation">Moderação</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Servidores */}
          <TabsContent value="servers" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Gerenciar Servidores</h3>
              <Button data-testid="button-add-server">
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Servidor
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockServers.map((server) => (
                <Card key={server.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {/* Header do servidor */}
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <h3 className="font-semibold">{server.name}</h3>
                            {getStatusIcon(server.botConnected)}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {formatNumber(server.memberCount)} membros
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-green-500">
                            {formatNumber(server.onlineMembers)}
                          </div>
                          <p className="text-xs text-muted-foreground">online</p>
                        </div>
                      </div>

                      {/* Estatísticas */}
                      <div className="grid grid-cols-2 gap-4 p-3 bg-muted/50 rounded-lg">
                        <div className="text-center">
                          <div className="text-lg font-bold text-blue-500">{server.channels}</div>
                          <p className="text-xs text-muted-foreground">Canais</p>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-purple-500">{server.permissions.length}</div>
                          <p className="text-xs text-muted-foreground">Permissões</p>
                        </div>
                      </div>

                      {/* Features */}
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Recursos Ativos:</h4>
                        <div className="flex flex-wrap gap-1">
                          {server.features.map((feature, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {feature.replace('_', ' ')}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="space-y-2">
                        {server.botConnected ? (
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm" className="flex-1" data-testid={`button-configure-${server.id}`}>
                              <Settings className="h-4 w-4 mr-1" />
                              Configurar
                            </Button>
                            <Button variant="outline" size="sm" className="flex-1" data-testid={`button-analytics-${server.id}`}>
                              <BarChart3 className="h-4 w-4 mr-1" />
                              Analytics
                            </Button>
                          </div>
                        ) : (
                          <Button 
                            className="w-full"
                            onClick={() => handleConnectBot(server.id)}
                            data-testid={`button-connect-${server.id}`}
                          >
                            <Bot className="h-4 w-4 mr-2" />
                            Conectar Bot
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Comandos */}
          <TabsContent value="commands" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Gerenciar Comandos</h3>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar comandos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                    data-testid="input-search-commands"
                  />
                </div>
                <Select value={commandFilter} onValueChange={setCommandFilter}>
                  <SelectTrigger className="w-40" data-testid="select-command-filter">
                    <SelectValue placeholder="Categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    <SelectItem value="moderation">Moderação</SelectItem>
                    <SelectItem value="utility">Utilidade</SelectItem>
                    <SelectItem value="fun">Diversão</SelectItem>
                    <SelectItem value="music">Música</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              {mockCommands.map((command) => (
                <Card key={command.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {/* Header do comando */}
                      <div className="flex items-center justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <h3 className="font-semibold font-mono bg-muted px-2 py-1 rounded text-sm">
                              {command.name}
                            </h3>
                            <Badge className={getCategoryColor(command.category)}>
                              {command.category === 'moderation' ? 'Moderação' :
                               command.category === 'utility' ? 'Utilidade' :
                               command.category === 'fun' ? 'Diversão' :
                               command.category === 'music' ? 'Música' : 'Personalizado'}
                            </Badge>
                            <Switch 
                              checked={command.enabled}
                              onCheckedChange={() => handleToggleCommand(command.id)}
                              data-testid={`switch-${command.id}`}
                            />
                          </div>
                          <p className="text-sm text-muted-foreground">{command.description}</p>
                          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                            <span>Usado {formatNumber(command.usageCount)} vezes</span>
                            <span>Cooldown: {command.cooldown}s</span>
                            <span>Permissões: {command.permissions.length}</span>
                          </div>
                        </div>
                        
                        <div className="text-right space-y-1">
                          <div className="text-lg font-bold">{formatNumber(command.usageCount)}</div>
                          <p className="text-xs text-muted-foreground">usos totais</p>
                        </div>
                      </div>

                      {/* Permissões */}
                      {command.permissions.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium">Permissões Necessárias:</h4>
                          <div className="flex flex-wrap gap-1">
                            {command.permissions.map((permission, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {permission.replace('_', ' ')}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" data-testid={`button-edit-${command.id}`}>
                            <Edit className="h-4 w-4 mr-1" />
                            Editar
                          </Button>
                          <Button variant="outline" size="sm" data-testid={`button-test-${command.id}`}>
                            <PlayCircle className="h-4 w-4 mr-1" />
                            Testar
                          </Button>
                          <Button variant="outline" size="sm" data-testid={`button-stats-${command.id}`}>
                            <BarChart3 className="h-4 w-4 mr-1" />
                            Estatísticas
                          </Button>
                        </div>
                        
                        <div className="text-xs text-muted-foreground">
                          ID: {command.id}
                        </div>
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
              <h3 className="text-lg font-semibold">Mensagens Automáticas</h3>
              <Dialog open={showMessageDialog} onOpenChange={setShowMessageDialog}>
                <DialogTrigger asChild>
                  <Button data-testid="button-new-automation">
                    <Zap className="h-4 w-4 mr-2" />
                    Nova Automação
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Criar Mensagem Automática</DialogTitle>
                    <DialogDescription>
                      Configure uma nova automação para o bot
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="auto-title">Título</Label>
                        <Input id="auto-title" placeholder="Nome da automação" data-testid="input-auto-title" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="auto-type">Tipo</Label>
                        <Select>
                          <SelectTrigger data-testid="select-auto-type">
                            <SelectValue placeholder="Tipo de automação" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="welcome">Boas-vindas</SelectItem>
                            <SelectItem value="goodbye">Despedida</SelectItem>
                            <SelectItem value="video_notification">Notificação de Vídeo</SelectItem>
                            <SelectItem value="reminder">Lembrete</SelectItem>
                            <SelectItem value="announcement">Anúncio</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="auto-channel">Canal</Label>
                      <Select>
                        <SelectTrigger data-testid="select-auto-channel">
                          <SelectValue placeholder="Selecione o canal" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="geral">#geral</SelectItem>
                          <SelectItem value="novos-videos">#novos-videos</SelectItem>
                          <SelectItem value="anuncios">#anuncios</SelectItem>
                          <SelectItem value="boas-vindas">#boas-vindas</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="auto-content">Conteúdo da Mensagem</Label>
                      <Textarea 
                        id="auto-content" 
                        placeholder="Digite a mensagem automática..."
                        className="min-h-[100px]"
                        data-testid="textarea-auto-content"
                      />
                      <p className="text-xs text-muted-foreground">
                        Use variáveis: {'{user}'}, {'{video_title}'}, {'{video_link}'}
                      </p>
                    </div>

                    <Button onClick={handleCreateAutoMessage} className="w-full" data-testid="button-create-automation">
                      Criar Automação
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="space-y-4">
              {mockAutoMessages.map((message) => (
                <Card key={message.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {/* Header da mensagem */}
                      <div className="flex items-center justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <h3 className="font-semibold">{message.title}</h3>
                            <Badge variant="outline">
                              {message.type === 'welcome' ? 'Boas-vindas' :
                               message.type === 'goodbye' ? 'Despedida' :
                               message.type === 'video_notification' ? 'Notificação' :
                               message.type === 'reminder' ? 'Lembrete' : 'Anúncio'}
                            </Badge>
                            <Badge variant="outline">{message.channel}</Badge>
                            <Switch 
                              checked={message.enabled}
                              data-testid={`switch-auto-${message.id}`}
                            />
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Criado em: {message.createdAt}
                          </p>
                        </div>
                      </div>

                      {/* Conteúdo da mensagem */}
                      <div className="p-3 bg-muted/50 rounded-lg">
                        <p className="text-sm whitespace-pre-line">{message.content}</p>
                      </div>

                      {/* Triggers e condições */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium">Triggers:</h4>
                          <div className="flex flex-wrap gap-1">
                            {message.triggers.map((trigger, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {trigger.replace('_', ' ')}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium">Condições:</h4>
                          <div className="flex flex-wrap gap-1">
                            {message.conditions.map((condition, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {condition.replace('_', ' ')}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" data-testid={`button-edit-auto-${message.id}`}>
                            <Edit className="h-4 w-4 mr-1" />
                            Editar
                          </Button>
                          <Button variant="outline" size="sm" data-testid={`button-test-auto-${message.id}`}>
                            <Send className="h-4 w-4 mr-1" />
                            Testar Envio
                          </Button>
                        </div>
                        
                        <div className="text-xs text-muted-foreground">
                          ID: {message.id}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Moderação */}
          <TabsContent value="moderation" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Logs de Moderação</h3>
              <div className="flex items-center space-x-4">
                <Button variant="outline" data-testid="button-auto-mod-settings">
                  <Shield className="h-4 w-4 mr-2" />
                  Auto-Moderação
                </Button>
                <Button data-testid="button-export-logs">
                  <Download className="h-4 w-4 mr-2" />
                  Exportar Logs
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              {mockModerationLogs.map((log) => (
                <Card key={log.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {/* Header do log */}
                      <div className="flex items-center justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Badge className={getActionColor(log.action)}>
                              {log.action === 'ban' ? 'BAN' :
                               log.action === 'kick' ? 'KICK' :
                               log.action === 'timeout' ? 'TIMEOUT' :
                               log.action === 'warn' ? 'WARN' : 'MUTE'}
                            </Badge>
                            <h3 className="font-semibold">{log.user}</h3>
                            <Badge variant="outline">
                              por {log.moderator}
                            </Badge>
                          </div>
                          <p className="text-sm">{log.reason}</p>
                          <p className="text-xs text-muted-foreground">
                            {log.timestamp}
                            {log.duration && ` | Duração: ${log.duration}`}
                          </p>
                        </div>
                        
                        <div className="text-right">
                          <Badge 
                            variant={log.status === 'active' ? 'default' : 
                                   log.status === 'expired' ? 'secondary' : 'destructive'}
                          >
                            {log.status === 'active' ? 'Ativo' :
                             log.status === 'expired' ? 'Expirado' : 'Revogado'}
                          </Badge>
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="flex space-x-2">
                          {log.status === 'active' && log.action !== 'warn' && (
                            <Button variant="outline" size="sm" data-testid={`button-revoke-${log.id}`}>
                              <XCircle className="h-4 w-4 mr-1" />
                              Revogar
                            </Button>
                          )}
                          <Button variant="outline" size="sm" data-testid={`button-details-${log.id}`}>
                            <Info className="h-4 w-4 mr-1" />
                            Detalhes
                          </Button>
                        </div>
                        
                        <div className="text-xs text-muted-foreground">
                          ID: {log.id}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Configurações de Auto-Moderação</CardTitle>
                <CardDescription>Configure a moderação automática do bot</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">Filtro de Palavrões</div>
                        <p className="text-sm text-muted-foreground">
                          Deletar mensagens com linguagem ofensiva
                        </p>
                      </div>
                      <Switch defaultChecked data-testid="switch-profanity-filter" />
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">Anti-Spam</div>
                        <p className="text-sm text-muted-foreground">
                          Detectar e punir spam automaticamente
                        </p>
                      </div>
                      <Switch defaultChecked data-testid="switch-anti-spam" />
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">Filtro de Convites</div>
                        <p className="text-sm text-muted-foreground">
                          Bloquear links de convite de outros servidores
                        </p>
                      </div>
                      <Switch data-testid="switch-invite-filter" />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">Auto-Role para Novos Membros</div>
                        <p className="text-sm text-muted-foreground">
                          Dar role automaticamente para novos membros
                        </p>
                      </div>
                      <Switch defaultChecked data-testid="switch-auto-role" />
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">Log de Mensagens Deletadas</div>
                        <p className="text-sm text-muted-foreground">
                          Registrar mensagens apagadas pelos usuários
                        </p>
                      </div>
                      <Switch defaultChecked data-testid="switch-deleted-messages" />
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">Limite de Menções</div>
                        <p className="text-sm text-muted-foreground">
                          Restringir número de menções por mensagem
                        </p>
                      </div>
                      <Switch data-testid="switch-mention-limit" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Comandos Mais Usados</CardTitle>
                  <CardDescription>Top comandos por número de usos</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockCommands
                      .sort((a, b) => b.usageCount - a.usageCount)
                      .slice(0, 5)
                      .map((command, index) => (
                        <div key={command.id} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center text-sm font-bold">
                              {index + 1}
                            </div>
                            <div>
                              <div className="font-medium font-mono">{command.name}</div>
                              <div className="text-sm text-muted-foreground">{command.description}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold">{formatNumber(command.usageCount)}</div>
                            <div className="text-sm text-muted-foreground">usos</div>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Atividade por Servidor</CardTitle>
                  <CardDescription>Engajamento nos servidores conectados</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockServers
                      .filter(s => s.botConnected)
                      .map((server) => (
                        <div key={server.id} className="space-y-2">
                          <div className="flex justify-between">
                            <span className="font-medium">{server.name}</span>
                            <span className="text-sm text-muted-foreground">
                              {Math.round((server.onlineMembers / server.memberCount) * 100)}% online
                            </span>
                          </div>
                          <Progress 
                            value={(server.onlineMembers / server.memberCount) * 100} 
                            className="h-2" 
                          />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>{formatNumber(server.onlineMembers)} online</span>
                            <span>{formatNumber(server.memberCount)} total</span>
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
                <CardDescription>Visão geral da performance do bot</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-blue-500">{formatNumber(5697)}</div>
                    <p className="text-sm text-muted-foreground">Comandos Executados (30d)</p>
                  </div>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-green-500">{formatNumber(1234)}</div>
                    <p className="text-sm text-muted-foreground">Novos Membros (30d)</p>
                  </div>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-purple-500">87</div>
                    <p className="text-sm text-muted-foreground">Ações de Moderação (30d)</p>
                  </div>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-orange-500">99.2%</div>
                    <p className="text-sm text-muted-foreground">Uptime do Bot</p>
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