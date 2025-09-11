import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import ProfessionalSidebar from "@/components/layout/professional-sidebar";
import ProfessionalHeader from "@/components/layout/professional-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Video, Play, Edit3, CheckCircle, Clock, AlertCircle,
  Bot, Zap, Users, Globe, Mic, Settings,
  Eye, Download, Upload, RefreshCw, BarChart3,
  VolumeX, Volume2, MonitorPlay, Smartphone,
  Languages, Camera, Palette, FileText,
  Target, TrendingUp, Star
} from "lucide-react";

const avatarTemplates = [
  {
    id: 'dark_anchor',
    name: 'Dark Anchor',
    description: 'Apresentador profissional para conteúdo dark',
    thumbnail: '/api/avatar/dark_anchor/thumbnail',
    style: 'Formal e misterioso'
  },
  {
    id: 'mystery_narrator',
    name: 'Mystery Narrator',
    description: 'Narrador especializado em mistério',
    thumbnail: '/api/avatar/mystery_narrator/thumbnail',
    style: 'Dramático e envolvente'
  },
  {
    id: 'tech_analyst',
    name: 'Tech Analyst',
    description: 'Analista tech para notícias científicas',
    thumbnail: '/api/avatar/tech_analyst/thumbnail',
    style: 'Moderno e técnico'
  }
];

const languageOptions = [
  { code: 'pt-BR', name: 'Português (Brasil)', flag: '🇧🇷', voice: 'Antonio' },
  { code: 'en-US', name: 'English (US)', flag: '🇺🇸', voice: 'Adam' },
  { code: 'es-ES', name: 'Español (España)', flag: '🇪🇸', voice: 'Pablo' },
  { code: 'es-MX', name: 'Español (México)', flag: '🇲🇽', voice: 'Diego' },
  { code: 'de-DE', name: 'Deutsch', flag: '🇩🇪', voice: 'Hans' },
  { code: 'fr-FR', name: 'Français', flag: '🇫🇷', voice: 'Antoine' },
  { code: 'hi-IN', name: 'हिन्दी', flag: '🇮🇳', voice: 'Arjun' },
  { code: 'ja-JP', name: '日本語', flag: '🇯🇵', voice: 'Takeshi' }
];

export default function VideoProduction() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const queryClient = useQueryClient();
  
  const [selectedAvatar, setSelectedAvatar] = useState('dark_anchor');
  const [selectedLanguage, setSelectedLanguage] = useState('pt-BR');
  const [customScript, setCustomScript] = useState('');
  const [editingVideo, setEditingVideo] = useState<string | null>(null);
  const [previewVideo, setPreviewVideo] = useState<string | null>(null);
  const [batchLanguages, setBatchLanguages] = useState<string[]>([]);
  
  const [editOptions, setEditOptions] = useState({
    script: false,
    voiceover: false,
    avatar: false,
    customInstruction: false,
    instruction: ''
  });

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  const { data: videos, isLoading: videosLoading } = useQuery({
    queryKey: ["/api/videos"],
    enabled: isAuthenticated,
    refetchInterval: 5000, // Refresh every 5 seconds
  });

  const { data: productionStats } = useQuery({
    queryKey: ["/api/videos/stats"],
    enabled: isAuthenticated,
    refetchInterval: 30000,
  });

  const { data: approvedNews } = useQuery({
    queryKey: ["/api/news", { status: "approved" }],
    enabled: isAuthenticated,
  });

  const generateVideoMutation = useMutation({
    mutationFn: async ({ newsId, language, avatar, script }: { 
      newsId: string, 
      language: string, 
      avatar: string,
      script?: string 
    }) => {
      await apiRequest("POST", "/api/videos/generate", { 
        newsId, 
        language, 
        avatar, 
        customScript: script 
      });
    },
    onSuccess: () => {
      toast({
        title: "Produção Iniciada",
        description: "Vídeo adicionado à fila de produção com IA",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/videos"] });
    },
    onError: (error: any) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Erro",
        description: "Falha ao iniciar produção de vídeo",
        variant: "destructive",
      });
    },
  });

  const batchGenerateMutation = useMutation({
    mutationFn: async ({ newsId, languages, avatar }: { 
      newsId: string, 
      languages: string[], 
      avatar: string 
    }) => {
      await apiRequest("POST", "/api/videos/batch-generate", { 
        newsId, 
        languages, 
        avatar 
      });
    },
    onSuccess: (_, { languages }) => {
      toast({
        title: "Produção em Lote Iniciada",
        description: `${languages.length} vídeos em produção simultânea`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/videos"] });
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: "Falha ao iniciar produção em lote",
        variant: "destructive",
      });
    },
  });

  const approveVideoMutation = useMutation({
    mutationFn: async (videoId: string) => {
      await apiRequest("PUT", `/api/videos/${videoId}/approve`);
    },
    onSuccess: () => {
      toast({
        title: "Vídeo Aprovado",
        description: "Vídeo aprovado e enviado para publicação",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/videos"] });
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: "Falha ao aprovar vídeo",
        variant: "destructive",
      });
    },
  });

  const editVideoMutation = useMutation({
    mutationFn: async ({ videoId, options }: { videoId: string, options: any }) => {
      await apiRequest("PUT", `/api/videos/${videoId}/edit`, options);
    },
    onSuccess: () => {
      toast({
        title: "Edição Iniciada",
        description: "Vídeo sendo reprocessado com as alterações",
      });
      setEditingVideo(null);
      setEditOptions({
        script: false,
        voiceover: false,
        avatar: false,
        customInstruction: false,
        instruction: ''
      });
      queryClient.invalidateQueries({ queryKey: ["/api/videos"] });
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: "Falha ao editar vídeo",
        variant: "destructive",
      });
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready': return 'bg-emerald-500 text-white hover:bg-emerald-600';
      case 'approved': return 'bg-blue-500 text-white hover:bg-blue-600';
      case 'published': return 'bg-green-500 text-white hover:bg-green-600';
      case 'generating': return 'bg-amber-500 text-white hover:bg-amber-600';
      case 'failed': return 'bg-red-500 text-white hover:bg-red-600';
      case 'processing': return 'bg-purple-500 text-white hover:bg-purple-600';
      default: return 'bg-gray-500 text-white hover:bg-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ready': return <CheckCircle className="h-4 w-4" />;
      case 'approved': return <Eye className="h-4 w-4" />;
      case 'published': return <Globe className="h-4 w-4" />;
      case 'generating': return <Bot className="h-4 w-4" />;
      case 'failed': return <AlertCircle className="h-4 w-4" />;
      case 'processing': return <RefreshCw className="h-4 w-4 animate-spin" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const handleBatchLanguageChange = (language: string, checked: boolean) => {
    if (checked) {
      setBatchLanguages(prev => [...prev, language]);
    } else {
      setBatchLanguages(prev => prev.filter(lang => lang !== language));
    }
  };

  const handleEditSubmit = () => {
    if (!editingVideo) return;
    
    editVideoMutation.mutate({
      videoId: editingVideo,
      options: {
        ...editOptions,
        customInstruction: editOptions.instruction
      }
    });
  };

  return (
    <div className="flex min-h-[100dvh] bg-background">
      <ProfessionalSidebar />
      <div className="flex-1">
        <ProfessionalHeader />
        <main className="p-6 page-container">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-foreground flex items-center">
                  <Video className="h-8 w-8 mr-3 text-primary" />
                  Produção de Vídeos IA
                </h1>
                <p className="text-muted-foreground mt-2">
                  Sistema automatizado de criação com HeyGen e ElevenLabs
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-purple-500/20"
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Analytics
                </Button>
                <Button
                  className="bg-gradient-to-r from-primary to-primary/80"
                  data-testid="button-new-production"
                >
                  <Zap className="h-4 w-4 mr-2" />
                  Nova Produção
                </Button>
              </div>
            </div>
            
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Vídeos Produzidos</p>
                      <p className="text-2xl font-bold text-foreground">{productionStats?.totalVideos || 0}</p>
                      <p className="text-xs text-green-600 mt-1">+{productionStats?.todayVideos || 0} hoje</p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                      <Video className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Em Produção</p>
                      <p className="text-2xl font-bold text-foreground">{productionStats?.processingVideos || 0}</p>
                      <p className="text-xs text-blue-600 mt-1">Fila de renderização</p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                      <Bot className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Taxa de Sucesso</p>
                      <p className="text-2xl font-bold text-foreground">{productionStats?.successRate || 0}%</p>
                      <p className="text-xs text-emerald-600 mt-1">Qualidade IA</p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
                      <Target className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Idiomas Ativos</p>
                      <p className="text-2xl font-bold text-foreground">{languageOptions.length}</p>
                      <p className="text-xs text-orange-600 mt-1">Multi-dublagem</p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                      <Languages className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Production Content */}
          <Tabs defaultValue="queue" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="queue">Fila de Produção</TabsTrigger>
              <TabsTrigger value="ready">Aprovação</TabsTrigger>
              <TabsTrigger value="published">Publicados</TabsTrigger>
              <TabsTrigger value="studio">Estúdio IA</TabsTrigger>
            </TabsList>
            
            <TabsContent value="queue" className="space-y-6">
              {/* Quick Production */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Zap className="h-5 w-5 mr-2" />
                    Produção Rápida
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {approvedNews && (approvedNews as any[]).length > 0 ? (
                    <div className="grid grid-cols-1 gap-4">
                      {(approvedNews as any[]).slice(0, 3).map((news: any) => (
                        <div key={news.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                          <div className="flex-1">
                            <h3 className="font-semibold text-sm">{news.title}</h3>
                            <p className="text-xs text-muted-foreground mt-1">
                              Score Viral: {news.viralScore}/100 • {news.source}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Select
                              value={selectedAvatar}
                              onValueChange={setSelectedAvatar}
                            >
                              <SelectTrigger className="w-32">
                                <SelectValue placeholder="Avatar" />
                              </SelectTrigger>
                              <SelectContent>
                                {avatarTemplates.map((avatar) => (
                                  <SelectItem key={avatar.id} value={avatar.id}>
                                    {avatar.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <Select
                              value={selectedLanguage}
                              onValueChange={setSelectedLanguage}
                            >
                              <SelectTrigger className="w-32">
                                <SelectValue placeholder="Idioma" />
                              </SelectTrigger>
                              <SelectContent>
                                {languageOptions.map((lang) => (
                                  <SelectItem key={lang.code} value={lang.code}>
                                    {lang.flag} {lang.name.split('(')[0]}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <Button
                              size="sm"
                              onClick={() => generateVideoMutation.mutate({
                                newsId: news.id,
                                language: selectedLanguage,
                                avatar: selectedAvatar
                              })}
                              disabled={generateVideoMutation.isPending}
                              className="bg-gradient-to-r from-blue-500 to-blue-600"
                            >
                              {generateVideoMutation.isPending ? (
                                <RefreshCw className="h-4 w-4 animate-spin" />
                              ) : (
                                <Play className="h-4 w-4" />
                              )}
                            </Button>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="outline"
                                >
                                  <Languages className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-md">
                                <DialogHeader>
                                  <DialogTitle>Produção Multi-idioma</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div className="grid grid-cols-2 gap-2">
                                    {languageOptions.map((lang) => (
                                      <div key={lang.code} className="flex items-center space-x-2">
                                        <Checkbox
                                          id={lang.code}
                                          checked={batchLanguages.includes(lang.code)}
                                          onCheckedChange={(checked) => 
                                            handleBatchLanguageChange(lang.code, checked as boolean)
                                          }
                                        />
                                        <label htmlFor={lang.code} className="text-sm">
                                          {lang.flag} {lang.name.split('(')[0]}
                                        </label>
                                      </div>
                                    ))}
                                  </div>
                                  <Button
                                    className="w-full"
                                    onClick={() => {
                                      if (batchLanguages.length > 0) {
                                        batchGenerateMutation.mutate({
                                          newsId: news.id,
                                          languages: batchLanguages,
                                          avatar: selectedAvatar
                                        });
                                      }
                                    }}
                                    disabled={batchLanguages.length === 0 || batchGenerateMutation.isPending}
                                  >
                                    <Zap className="h-4 w-4 mr-2" />
                                    Produzir {batchLanguages.length} Vídeos
                                  </Button>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        Nenhuma notícia aprovada para produção.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Processing Videos */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                    Vídeos em Produção
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {videosLoading ? (
                    <div className="grid grid-cols-1 gap-4">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="border border-border rounded-lg p-4">
                          <div className="h-4 bg-muted rounded animate-pulse mb-2"></div>
                          <div className="h-3 bg-muted rounded animate-pulse w-3/4"></div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {(videos as any[])?.filter((video: any) => 
                        ['generating', 'processing'].includes(video.status)
                      ).map((video: any) => (
                        <div key={video.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <Badge className={getStatusColor(video.status)}>
                                {getStatusIcon(video.status)}
                                <span className="ml-1">{video.status}</span>
                              </Badge>
                              <Badge variant="outline">
                                {languageOptions.find(l => l.code === video.language)?.flag} {video.language}
                              </Badge>
                            </div>
                            <h3 className="font-semibold text-sm mb-1">{video.title}</h3>
                            <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                              <span>Avatar: {video.avatarTemplate}</span>
                              <span>Iniciado: {new Date(video.createdAt).toLocaleTimeString('pt-BR')}</span>
                            </div>
                            {video.progress && (
                              <Progress value={video.progress} className="mt-2 h-1" />
                            )}
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            disabled
                          >
                            <Clock className="h-4 w-4" />
                          </Button>
                        </div>
                      )) || (
                        <div className="text-center py-8">
                          <Bot className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                          <p className="text-muted-foreground">
                            Nenhum vídeo em produção no momento.
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="ready" className="space-y-4">
              <div className="grid grid-cols-1 gap-6">
                {(videos as any[])?.filter((video: any) => video.status === 'ready').map((video: any) => (
                  <Card key={video.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            <Badge className={getStatusColor(video.status)}>
                              {getStatusIcon(video.status)}
                              <span className="ml-1">Pronto para Aprovação</span>
                            </Badge>
                            <Badge variant="outline">
                              {languageOptions.find(l => l.code === video.language)?.flag} {video.language}
                            </Badge>
                            {video.viralScore && (
                              <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500">
                                <Star className="h-3 w-3 mr-1" />
                                {video.viralScore}/100
                              </Badge>
                            )}
                          </div>
                          <h3 className="text-xl font-bold text-foreground mb-2">{video.title}</h3>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-4">
                            <span>Avatar: {video.avatarTemplate}</span>
                            <span>Duração: ~60s</span>
                            <span>Criado: {new Date(video.createdAt).toLocaleDateString('pt-BR')}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setPreviewVideo(video.id)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Preview
                          </Button>
                        </div>
                      </div>
                      
                      {/* Video Preview Placeholder */}
                      <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg mb-4 flex items-center justify-center border border-border">
                        <div className="text-center">
                          <Video className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                          <p className="text-sm text-muted-foreground mb-2">Preview do Vídeo</p>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setPreviewVideo(video.id)}
                          >
                            <Play className="h-4 w-4 mr-2" />
                            Reproduzir
                          </Button>
                        </div>
                      </div>

                      {/* Script Preview */}
                      <div className="bg-muted/50 rounded-lg p-4 mb-6">
                        <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center">
                          <FileText className="h-4 w-4 mr-2" />
                          Roteiro Gerado
                        </h4>
                        <p className="text-sm text-muted-foreground line-clamp-3">
                          {video.script || 'Script sendo gerado...'}
                        </p>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex items-center space-x-3">
                        <Button
                          onClick={() => approveVideoMutation.mutate(video.id)}
                          disabled={approveVideoMutation.isPending}
                          className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white"
                          data-testid={`button-approve-${video.id}`}
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Aprovar para Publicação
                        </Button>
                        
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              onClick={() => setEditingVideo(video.id)}
                              data-testid={`button-edit-${video.id}`}
                            >
                              <Edit3 className="h-4 w-4 mr-2" />
                              Editar
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-md">
                            <DialogHeader>
                              <DialogTitle>Opções de Edição</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="space-y-3">
                                <div className="flex items-center space-x-2">
                                  <Checkbox
                                    id="edit-script"
                                    checked={editOptions.script}
                                    onCheckedChange={(checked) => 
                                      setEditOptions(prev => ({ ...prev, script: checked as boolean }))
                                    }
                                  />
                                  <label htmlFor="edit-script" className="text-sm">
                                    Regenerar Roteiro
                                  </label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Checkbox
                                    id="edit-voiceover"
                                    checked={editOptions.voiceover}
                                    onCheckedChange={(checked) => 
                                      setEditOptions(prev => ({ ...prev, voiceover: checked as boolean }))
                                    }
                                  />
                                  <label htmlFor="edit-voiceover" className="text-sm">
                                    Regenerar Narração
                                  </label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Checkbox
                                    id="edit-avatar"
                                    checked={editOptions.avatar}
                                    onCheckedChange={(checked) => 
                                      setEditOptions(prev => ({ ...prev, avatar: checked as boolean }))
                                    }
                                  />
                                  <label htmlFor="edit-avatar" className="text-sm">
                                    Trocar Avatar/Template
                                  </label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Checkbox
                                    id="edit-custom"
                                    checked={editOptions.customInstruction}
                                    onCheckedChange={(checked) => 
                                      setEditOptions(prev => ({ ...prev, customInstruction: checked as boolean }))
                                    }
                                  />
                                  <label htmlFor="edit-custom" className="text-sm">
                                    Instrução Customizada
                                  </label>
                                </div>
                              </div>
                              
                              {editOptions.customInstruction && (
                                <Textarea
                                  placeholder="Descreva as alterações desejadas..."
                                  value={editOptions.instruction}
                                  onChange={(e) => setEditOptions(prev => ({ ...prev, instruction: e.target.value }))}
                                  className="min-h-20"
                                />
                              )}
                              
                              <Button
                                className="w-full"
                                onClick={handleEditSubmit}
                                disabled={editVideoMutation.isPending}
                              >
                                {editVideoMutation.isPending ? (
                                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                ) : (
                                  <Zap className="h-4 w-4 mr-2" />
                                )}
                                Aplicar Alterações
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(`/api/videos/${video.id}/download`, '_blank')}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="published">
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {(videos as any[])?.filter((video: any) => video.status === 'published').map((video: any) => (
                  <Card key={video.id} className="border-0 shadow-lg">
                    <CardContent className="p-6">
                      <div className="aspect-video bg-muted rounded-lg mb-4 flex items-center justify-center">
                        <Play className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <h3 className="font-semibold mb-2">{video.title}</h3>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>{languageOptions.find(l => l.code === video.language)?.flag} {video.language}</span>
                        <Badge className="bg-green-100 text-green-800">
                          Publicado
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="studio">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Camera className="h-5 w-5 mr-2" />
                    Estúdio de Criação IA
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Avatar Selection */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Selecionar Avatar</h3>
                      <div className="grid grid-cols-1 gap-4">
                        {avatarTemplates.map((avatar) => (
                          <div
                            key={avatar.id}
                            className={`p-4 border rounded-lg cursor-pointer transition-all ${
                              selectedAvatar === avatar.id 
                                ? 'border-primary bg-primary/10' 
                                : 'border-border hover:border-primary/50'
                            }`}
                            onClick={() => setSelectedAvatar(avatar.id)}
                          >
                            <div className="flex items-start space-x-4">
                              <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                                <Users className="h-6 w-6 text-muted-foreground" />
                              </div>
                              <div className="flex-1">
                                <h4 className="font-medium">{avatar.name}</h4>
                                <p className="text-sm text-muted-foreground">{avatar.description}</p>
                                <Badge variant="outline" className="mt-2">
                                  {avatar.style}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Custom Script */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Roteiro Personalizado</h3>
                      <Textarea
                        placeholder="Digite seu roteiro personalizado aqui..."
                        value={customScript}
                        onChange={(e) => setCustomScript(e.target.value)}
                        className="min-h-40 mb-4"
                      />
                      
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium">Idioma</label>
                          <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {languageOptions.map((lang) => (
                                <SelectItem key={lang.code} value={lang.code}>
                                  {lang.flag} {lang.name} - Voz: {lang.voice}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <Button
                          className="w-full bg-gradient-to-r from-purple-500 to-blue-500"
                          disabled={!customScript.trim()}
                        >
                          <Zap className="h-4 w-4 mr-2" />
                          Criar Vídeo Personalizado
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}