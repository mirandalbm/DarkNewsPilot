import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { 
  Youtube, 
  Plus, 
  Link as LinkIcon, 
  Settings, 
  BarChart3,
  Clock,
  Globe,
  Users,
  Eye,
  Calendar,
  CheckCircle,
  X,
  RefreshCw,
  ExternalLink
} from 'lucide-react';

interface YouTubeChannel {
  id: string;
  channelId: string;
  title: string;
  description: string;
  language: string;
  subscriberCount: number;
  videoCount: number;
  viewCount: number;
  thumbnailUrl?: string;
  isConnected: boolean;
  isActive: boolean;
  lastSync: string;
  publishingSettings: {
    autoPublish: boolean;
    scheduleType: 'immediate' | 'scheduled' | 'queue';
    defaultPrivacy: 'public' | 'unlisted' | 'private';
    addToPlaylist: boolean;
    playlistId?: string;
  };
}

interface ChannelAnalytics {
  channelId: string;
  totalViews: number;
  totalVideos: number;
  subscriberGrowth: number;
  averageViews: number;
  topPerformingVideo: {
    title: string;
    views: number;
    publishedAt: string;
  };
}

const mockChannels: YouTubeChannel[] = [
  {
    id: '1',
    channelId: 'UC123456789',
    title: 'DarkNews Brasil',
    description: 'Notícias sombrias e misteriosas do Brasil',
    language: 'pt-BR',
    subscriberCount: 125000,
    videoCount: 453,
    viewCount: 8500000,
    thumbnailUrl: 'https://via.placeholder.com/88x88',
    isConnected: true,
    isActive: true,
    lastSync: new Date().toISOString(),
    publishingSettings: {
      autoPublish: true,
      scheduleType: 'scheduled',
      defaultPrivacy: 'public',
      addToPlaylist: true,
      playlistId: 'PLxxx123'
    }
  },
  {
    id: '2',
    channelId: 'UC987654321',
    title: 'DarkNews International',
    description: 'Dark and mysterious news from around the world',
    language: 'en-US',
    subscriberCount: 89000,
    videoCount: 267,
    viewCount: 4200000,
    thumbnailUrl: 'https://via.placeholder.com/88x88',
    isConnected: true,
    isActive: false,
    lastSync: new Date(Date.now() - 3600000).toISOString(),
    publishingSettings: {
      autoPublish: false,
      scheduleType: 'queue',
      defaultPrivacy: 'unlisted',
      addToPlaylist: false
    }
  }
];

const mockAnalytics: Record<string, ChannelAnalytics> = {
  'UC123456789': {
    channelId: 'UC123456789',
    totalViews: 8500000,
    totalVideos: 453,
    subscriberGrowth: 12.5,
    averageViews: 18762,
    topPerformingVideo: {
      title: 'O Mistério da Casa Abandonada em São Paulo',
      views: 245000,
      publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
    }
  },
  'UC987654321': {
    channelId: 'UC987654321',
    totalViews: 4200000,
    totalVideos: 267,
    subscriberGrowth: 8.3,
    averageViews: 15730,
    topPerformingVideo: {
      title: 'The Haunted Lighthouse Mystery',
      views: 180000,
      publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
    }
  }
};

const supportedLanguages = [
  { value: 'pt-BR', label: 'Português (Brasil)' },
  { value: 'en-US', label: 'English (United States)' },
  { value: 'es-ES', label: 'Español (España)' },
  { value: 'fr-FR', label: 'Français (France)' },
  { value: 'de-DE', label: 'Deutsch (Deutschland)' },
  { value: 'it-IT', label: 'Italiano (Italia)' },
  { value: 'ja-JP', label: '日本語 (Japanese)' },
  { value: 'ko-KR', label: '한국어 (Korean)' }
];

export default function Canais() {
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null);
  const { toast } = useToast();

  const { data: channels = mockChannels, isLoading } = useQuery({
    queryKey: ['/api/youtube/channels'],
    refetchInterval: 300000, // Refresh every 5 minutes
  });

  const { data: analytics = mockAnalytics } = useQuery({
    queryKey: ['/api/youtube/analytics'],
  });

  const connectChannelMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/youtube/connect');
      return response.json();
    },
    onSuccess: (data) => {
      // Redirect to YouTube OAuth
      window.location.href = data.authUrl;
    },
    onError: () => {
      toast({
        title: 'Erro na conexão',
        description: 'Não foi possível conectar com o YouTube.',
        variant: 'destructive',
      });
    },
  });

  const updateChannelSettingsMutation = useMutation({
    mutationFn: async ({ channelId, settings }: { channelId: string; settings: any }) => {
      const response = await apiRequest('PATCH', `/api/youtube/channels/${channelId}`, settings);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/youtube/channels'] });
      toast({
        title: 'Configurações salvas',
        description: 'As configurações do canal foram atualizadas.',
      });
    },
    onError: () => {
      toast({
        title: 'Erro ao salvar',
        description: 'Não foi possível salvar as configurações.',
        variant: 'destructive',
      });
    },
  });

  const toggleChannelActiveMutation = useMutation({
    mutationFn: async ({ channelId, isActive }: { channelId: string; isActive: boolean }) => {
      const response = await apiRequest('PATCH', `/api/youtube/channels/${channelId}/toggle`, {
        isActive
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/youtube/channels'] });
    },
  });

  const syncChannelMutation = useMutation({
    mutationFn: async (channelId: string) => {
      const response = await apiRequest('POST', `/api/youtube/channels/${channelId}/sync`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/youtube/channels'] });
      toast({
        title: 'Canal sincronizado',
        description: 'Os dados do canal foram atualizados.',
      });
    },
  });

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const formatDate = (date: string) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Canais do YouTube
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Gerencie suas conexões e configurações de publicação
        </p>
      </div>

      <Tabs defaultValue="channels" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="channels" className="flex items-center space-x-2">
            <Youtube className="h-4 w-4" />
            <span>Meus Canais</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center space-x-2">
            <Settings className="h-4 w-4" />
            <span>Configurações</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center space-x-2">
            <BarChart3 className="h-4 w-4" />
            <span>Analytics</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="channels" className="space-y-6">
          {/* Conectar novo canal */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <Plus className="h-5 w-5" />
                    <span>Conectar Novo Canal</span>
                  </CardTitle>
                  <CardDescription>
                    Conecte seus canais do YouTube para automação de publicação
                  </CardDescription>
                </div>
                <Button
                  onClick={() => connectChannelMutation.mutate()}
                  disabled={connectChannelMutation.isPending}
                  data-testid="connect-channel-button"
                >
                  <LinkIcon className="h-4 w-4 mr-2" />
                  {connectChannelMutation.isPending ? 'Conectando...' : 'Conectar Canal'}
                </Button>
              </div>
            </CardHeader>
          </Card>

          {/* Lista de canais conectados */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {channels.map((channel) => {
              const channelAnalytics = analytics[channel.channelId];
              
              return (
                <Card key={channel.id} className="relative">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <img
                          src={channel.thumbnailUrl || 'https://via.placeholder.com/48x48'}
                          alt={channel.title}
                          className="w-12 h-12 rounded-full"
                        />
                        <div>
                          <CardTitle className="text-lg">{channel.title}</CardTitle>
                          <p className="text-sm text-gray-500 line-clamp-2">
                            {channel.description}
                          </p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="outline">
                              {supportedLanguages.find(l => l.value === channel.language)?.label}
                            </Badge>
                            <Badge 
                              className={channel.isConnected 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                              }
                            >
                              {channel.isConnected ? 'Conectado' : 'Desconectado'}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={channel.isActive}
                          onCheckedChange={(checked) => 
                            toggleChannelActiveMutation.mutate({ 
                              channelId: channel.id, 
                              isActive: checked 
                            })
                          }
                          disabled={!channel.isConnected}
                          data-testid={`channel-active-${channel.id}`}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => syncChannelMutation.mutate(channel.id)}
                          disabled={syncChannelMutation.isPending}
                          data-testid={`sync-channel-${channel.id}`}
                        >
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {/* Estatísticas do canal */}
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-2xl font-bold text-primary">
                          {formatNumber(channel.subscriberCount)}
                        </p>
                        <p className="text-xs text-gray-500">Inscritos</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-primary">
                          {formatNumber(channel.videoCount)}
                        </p>
                        <p className="text-xs text-gray-500">Vídeos</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-primary">
                          {formatNumber(channel.viewCount)}
                        </p>
                        <p className="text-xs text-gray-500">Visualizações</p>
                      </div>
                    </div>

                    {/* Status de publicação */}
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Publicação automática:</span>
                      <Badge className={channel.publishingSettings.autoPublish 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                      }>
                        {channel.publishingSettings.autoPublish ? 'Ativa' : 'Inativa'}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Última sincronização:</span>
                      <span className="text-gray-500">{formatDate(channel.lastSync)}</span>
                    </div>

                    <div className="flex justify-between">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedChannel(channel.id)}
                        data-testid={`configure-channel-${channel.id}`}
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Configurar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(`https://youtube.com/channel/${channel.channelId}`, '_blank')}
                        data-testid={`view-channel-${channel.id}`}
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Ver Canal
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          {selectedChannel ? (
            (() => {
              const channel = channels.find(c => c.id === selectedChannel);
              if (!channel) return null;

              return (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Settings className="h-5 w-5" />
                      <span>Configurações - {channel.title}</span>
                    </CardTitle>
                    <CardDescription>
                      Configure as opções de publicação para este canal
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Publicação automática */}
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Publicação Automática</Label>
                        <p className="text-sm text-gray-500">
                          Publicar vídeos automaticamente quando prontos
                        </p>
                      </div>
                      <Switch
                        checked={channel.publishingSettings.autoPublish}
                        onCheckedChange={(checked) => 
                          updateChannelSettingsMutation.mutate({
                            channelId: channel.id,
                            settings: { 
                              publishingSettings: { 
                                ...channel.publishingSettings, 
                                autoPublish: checked 
                              }
                            }
                          })
                        }
                        data-testid="auto-publish-switch"
                      />
                    </div>

                    {/* Tipo de agendamento */}
                    <div className="space-y-2">
                      <Label htmlFor="schedule-type">Tipo de Agendamento</Label>
                      <Select 
                        value={channel.publishingSettings.scheduleType}
                        onValueChange={(value) => 
                          updateChannelSettingsMutation.mutate({
                            channelId: channel.id,
                            settings: { 
                              publishingSettings: { 
                                ...channel.publishingSettings, 
                                scheduleType: value 
                              }
                            }
                          })
                        }
                      >
                        <SelectTrigger data-testid="schedule-type-select">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="immediate">Imediato</SelectItem>
                          <SelectItem value="scheduled">Agendado</SelectItem>
                          <SelectItem value="queue">Fila de publicação</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Privacidade padrão */}
                    <div className="space-y-2">
                      <Label htmlFor="default-privacy">Privacidade Padrão</Label>
                      <Select 
                        value={channel.publishingSettings.defaultPrivacy}
                        onValueChange={(value) => 
                          updateChannelSettingsMutation.mutate({
                            channelId: channel.id,
                            settings: { 
                              publishingSettings: { 
                                ...channel.publishingSettings, 
                                defaultPrivacy: value 
                              }
                            }
                          })
                        }
                      >
                        <SelectTrigger data-testid="privacy-select">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="public">Público</SelectItem>
                          <SelectItem value="unlisted">Não listado</SelectItem>
                          <SelectItem value="private">Privado</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Playlist */}
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Adicionar à Playlist</Label>
                        <p className="text-sm text-gray-500">
                          Adicionar novos vídeos automaticamente a uma playlist
                        </p>
                      </div>
                      <Switch
                        checked={channel.publishingSettings.addToPlaylist}
                        onCheckedChange={(checked) => 
                          updateChannelSettingsMutation.mutate({
                            channelId: channel.id,
                            settings: { 
                              publishingSettings: { 
                                ...channel.publishingSettings, 
                                addToPlaylist: checked 
                              }
                            }
                          })
                        }
                        data-testid="add-to-playlist-switch"
                      />
                    </div>

                    {channel.publishingSettings.addToPlaylist && (
                      <div className="space-y-2">
                        <Label htmlFor="playlist-id">ID da Playlist</Label>
                        <Input
                          id="playlist-id"
                          placeholder="PLxxxxxxxxxxx"
                          value={channel.publishingSettings.playlistId || ''}
                          onChange={(e) => 
                            updateChannelSettingsMutation.mutate({
                              channelId: channel.id,
                              settings: { 
                                publishingSettings: { 
                                  ...channel.publishingSettings, 
                                  playlistId: e.target.value 
                                }
                              }
                            })
                          }
                          data-testid="playlist-id-input"
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })()
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Settings className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-500">
                  Selecione um canal na aba "Meus Canais" para configurar
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {channels.filter(c => c.isConnected).map((channel) => {
              const channelAnalytics = analytics[channel.channelId];
              if (!channelAnalytics) return null;

              return (
                <Card key={channel.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <BarChart3 className="h-5 w-5" />
                      <span>{channel.title}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-primary">
                          {formatNumber(channelAnalytics.totalViews)}
                        </p>
                        <p className="text-sm text-gray-500">Total de views</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-primary">
                          {formatNumber(channelAnalytics.averageViews)}
                        </p>
                        <p className="text-sm text-gray-500">Média por vídeo</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Crescimento de inscritos:</span>
                      <Badge className="bg-green-100 text-green-800">
                        +{channelAnalytics.subscriberGrowth}%
                      </Badge>
                    </div>

                    <div className="border-t pt-4">
                      <p className="text-sm font-medium mb-2">Vídeo mais visto:</p>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {channelAnalytics.topPerformingVideo.title}
                      </p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-sm text-gray-500">
                          {formatNumber(channelAnalytics.topPerformingVideo.views)} views
                        </span>
                        <span className="text-xs text-gray-400">
                          {formatDate(channelAnalytics.topPerformingVideo.publishedAt)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}