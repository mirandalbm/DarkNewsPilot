import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { useSidebar } from "@/hooks/useSidebar";
import { cn } from "@/lib/utils";
import type { DashboardStats } from "@shared/schema";
import ProfessionalSidebar from "@/components/layout/professional-sidebar";
import ProfessionalHeader from "@/components/layout/professional-header";
import { ClineChat } from "@/components/cline/cline-chat";
import { AdvancedChat } from "@/components/cline/advanced-chat";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Video, 
  TrendingUp, 
  Eye, 
  Users, 
  DollarSign, 
  Play, 
  Pause, 
  BarChart3,
  Globe,
  Clock,
  Zap,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Activity
} from "lucide-react";

export default function ProfessionalDashboard() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const sidebar = useSidebar();

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Não autorizado",
        description: "Você foi desconectado. Fazendo login novamente...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  const { data: stats, isLoading: statsLoading } = useQuery<DashboardStats>({
    queryKey: ["/api/dashboard/stats"],
    enabled: isAuthenticated,
    refetchInterval: 30000,
  });

  const { data: jobs } = useQuery<any[]>({
    queryKey: ["/api/dashboard/jobs"],
    enabled: isAuthenticated,
    refetchInterval: 5000,
  });

  const { data: apiStatuses } = useQuery<any[]>({
    queryKey: ["/api/dashboard/api-status"],
    enabled: isAuthenticated,
    refetchInterval: 60000,
  });

  const handleProcessNews = async () => {
    try {
      const response = await fetch('/api/news/fetch', {
        method: 'POST',
        credentials: 'include',
      });
      
      if (response.status === 401) {
        toast({
          title: "Não autorizado",
          description: "Você foi desconectado. Fazendo login novamente...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      
      if (!response.ok) {
        throw new Error('Failed to trigger news processing');
      }
      
      toast({
        title: "Sucesso",
        description: "Processamento de notícias iniciado",
      });
    } catch (error: any) {
      toast({
        title: "Erro",
        description: "Falha ao iniciar processamento de notícias",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const metrics = [
    {
      title: "Total de Vídeos",
      value: stats?.totalVideos || 0,
      change: `+${stats?.videosToday || 0} hoje`,
      icon: Video,
      color: "blue",
      gradient: "from-blue-500 to-blue-600"
    },
    {
      title: "Visualizações Totais", 
      value: stats?.totalViews ? `${(stats.totalViews / 1000000).toFixed(1)}M` : "0",
      change: "+24.5K hoje",
      icon: Eye,
      color: "green",
      gradient: "from-green-500 to-green-600"
    },
    {
      title: "Inscritos",
      value: stats?.totalSubscribers ? `${Math.floor(stats.totalSubscribers / 1000)}K` : "0K",
      change: "+1.2K esta semana",
      icon: Users,
      color: "purple",
      gradient: "from-purple-500 to-purple-600"
    },
    {
      title: "Receita Estimada",
      value: "R$ 12.5K",
      change: "+18% este mês",
      icon: DollarSign,
      color: "yellow",
      gradient: "from-yellow-500 to-yellow-600"
    }
  ];

  const handleTestVideoPipeline = async () => {
    try {
      const response = await fetch('/api/test/video-pipeline', {
        method: 'POST',
        credentials: 'include',
      });
      
      if (response.status === 401) {
        toast({
          title: "Não autorizado",
          description: "Você foi desconectado. Fazendo login novamente...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      
      if (!response.ok) {
        throw new Error('Failed to test video pipeline');
      }
      
      const result = await response.json();
      toast({
        title: "🎬 Pipeline de Vídeo Iniciado",
        description: `Testando criação de vídeo com IA: ${result.videoId}`,
      });
    } catch (error: any) {
      toast({
        title: "Erro",
        description: "Falha ao testar pipeline de vídeo",
        variant: "destructive",
      });
    }
  };

  const quickActions = [
    {
      title: "Processar Notícias",
      description: "Buscar e processar novas notícias",
      icon: Play,
      action: handleProcessNews,
      variant: "default" as const
    },
    {
      title: "🧪 Testar Pipeline",
      description: "Testar geração completa de vídeo com IA",
      icon: Zap,
      action: handleTestVideoPipeline,
      variant: "secondary" as const
    },
    {
      title: "Ver Analytics",
      description: "Abrir relatórios detalhados",
      icon: BarChart3,
      action: () => window.location.href = "/analytics",
      variant: "outline" as const
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'operational':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'degraded':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'down':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="app-container bg-background">
      <ProfessionalSidebar />
      
      <div className={cn(
        "responsive-container transition-all duration-300",
        sidebar.isMobile && "w-full"
      )}>
        <ProfessionalHeader />
        
        {/* Three Column Layout */}
        <div className={cn(
          "flex h-[calc(100vh-64px)] transition-all duration-300",
          sidebar.isMobile ? "flex-col" : "flex-row"
        )}>
          {/* Main Content Area */}
          <main className={cn(
            "flex-1 overflow-y-auto space-y-4 sm:space-y-6 transition-all duration-300",
            sidebar.isMobile ? "p-3" : sidebar.isTablet ? "p-4" : "p-6",
            !sidebar.isMobile && "pr-0" // Remove right padding when Cline is visible
          )}>
            {/* Welcome Section */}
            <div className={cn(
              "flex justify-between transition-all duration-300",
              sidebar.isMobile ? "flex-col space-y-2" : "items-center"
            )}>
              <div>
                <h1 className={cn(
                  "font-bold text-foreground transition-all duration-300",
                  sidebar.isMobile ? "text-2xl" : sidebar.isTablet ? "text-2xl" : "text-3xl"
                )}>Dashboard Principal</h1>
                <p className={cn(
                  "text-muted-foreground mt-1 transition-all duration-300",
                  sidebar.isMobile ? "text-sm" : "text-base"
                )}>
                  Monitore sua produção de conteúdo automatizada
                </p>
              </div>
              <div className={cn(
                "flex items-center space-x-2 text-muted-foreground transition-all duration-300",
                sidebar.isMobile ? "text-xs" : "text-sm"
              )}>
                <Clock className={cn(
                  "transition-all duration-300",
                  sidebar.isMobile ? "h-3 w-3" : "h-4 w-4"
                )} />
                <span>
                  {sidebar.isMobile 
                    ? `${new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`
                    : `Última atualização: ${new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`
                  }
                </span>
              </div>
            </div>

          {/* Metrics Cards */}
          <div className={cn(
            "grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 transition-all duration-300",
            sidebar.isMobile ? "gap-3" : "gap-4 md:gap-6"
          )}>
            {metrics.map((metric) => (
              <Card key={metric.title} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className={cn(
                  "transition-all duration-300",
                  sidebar.isMobile ? "p-3" : "p-4 md:p-6"
                )}>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1 sm:space-y-2 min-w-0 flex-1 pr-2">
                      <p className={cn(
                        "font-medium text-muted-foreground truncate",
                        sidebar.isMobile ? "text-xs" : "text-sm"
                      )}>
                        {metric.title}
                      </p>
                      <p className={cn(
                        "font-bold text-foreground",
                        sidebar.isMobile ? "text-lg" : "text-2xl md:text-3xl"
                      )}>
                        {typeof metric.value === 'number' ? metric.value.toLocaleString() : metric.value}
                      </p>
                      <p className={cn(
                        "text-green-600 font-medium truncate",
                        sidebar.isMobile ? "text-xs" : "text-sm"
                      )}>
                        {metric.change}
                      </p>
                    </div>
                    <div className={cn(
                      "bg-gradient-to-r rounded-xl flex items-center justify-center flex-shrink-0",
                      sidebar.isMobile ? "w-8 h-8" : "w-10 h-10 md:w-12 md:h-12",
                      metric.gradient
                    )}>
                      <metric.icon className={cn(
                        "text-white",
                        sidebar.isMobile ? "h-4 w-4" : "h-5 w-5 md:h-6 md:w-6"
                      )} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Quick Actions & Status */}
          <div className={cn(
            "grid transition-all duration-300",
            sidebar.isMobile ? "grid-cols-1 gap-4" : "grid-cols-1 lg:grid-cols-3 gap-6"
          )}>
            {/* Quick Actions */}
            <Card className={cn(
              sidebar.isMobile ? "col-span-1" : "lg:col-span-2"
            )}>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="h-5 w-5" />
                  <span>Ações Rápidas</span>
                </CardTitle>
              </CardHeader>
              <CardContent className={cn(
                "space-y-3 sm:space-y-4",
                sidebar.isMobile ? "p-4" : "p-6"
              )}>
                {quickActions.map((action) => (
                  <div key={action.title} className={cn(
                    "flex items-center justify-between bg-muted/50 rounded-lg transition-all duration-300",
                    sidebar.isMobile ? "flex-col space-y-2 p-3" : "p-4"
                  )}>
                    <div className={cn(
                      "flex items-center min-w-0 flex-1",
                      sidebar.isMobile ? "space-x-2 w-full" : "space-x-3"
                    )}>
                      <div className={cn(
                        "bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0",
                        sidebar.isMobile ? "w-8 h-8" : "w-10 h-10"
                      )}>
                        <action.icon className={cn(
                          "text-primary",
                          sidebar.isMobile ? "h-4 w-4" : "h-5 w-5"
                        )} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className={cn(
                          "font-medium text-foreground",
                          sidebar.isMobile ? "text-sm truncate" : "text-base"
                        )}>{action.title}</h3>
                        <p className={cn(
                          "text-muted-foreground",
                          sidebar.isMobile ? "text-xs truncate" : "text-sm"
                        )}>{action.description}</p>
                      </div>
                    </div>
                    <Button 
                      variant={action.variant} 
                      onClick={action.action}
                      size={sidebar.isMobile ? "sm" : "default"}
                      className={cn(
                        sidebar.isMobile && "w-full mt-2"
                      )}
                    >
                      {sidebar.isMobile ? "▶️" : "Executar"}
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* System Status */}
            <Card>
              <CardHeader className={cn(
                sidebar.isMobile ? "p-4" : "p-6"
              )}>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className={cn(
                    sidebar.isMobile ? "h-4 w-4" : "h-5 w-5"
                  )} />
                  <span className={cn(
                    sidebar.isMobile ? "text-sm" : "text-base"
                  )}>Status dos Sistemas</span>
                </CardTitle>
              </CardHeader>
              <CardContent className={cn(
                "space-y-3 sm:space-y-4",
                sidebar.isMobile ? "p-4" : "p-6"
              )}>
                {apiStatuses && apiStatuses.length > 0 ? (
                  apiStatuses.map((service: any) => (
                    <div key={service.serviceName} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 min-w-0 flex-1">
                        {getStatusIcon(service.status)}
                        <span className={cn(
                          "font-medium truncate",
                          sidebar.isMobile ? "text-xs" : "text-sm"
                        )}>{service.serviceName}</span>
                      </div>
                      <Badge 
                        variant={service.status === 'operational' ? 'default' : 'destructive'}
                        className={cn(
                          "flex-shrink-0",
                          sidebar.isMobile ? "text-xs px-1.5 py-0.5" : "text-xs"
                        )}
                      >
                        {service.status}
                      </Badge>
                    </div>
                  ))
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 min-w-0 flex-1">
                        <CheckCircle className={cn(
                          "text-green-500 flex-shrink-0",
                          sidebar.isMobile ? "h-3 w-3" : "h-4 w-4"
                        )} />
                        <span className={cn(
                          "font-medium truncate",
                          sidebar.isMobile ? "text-xs" : "text-sm"
                        )}>OpenAI</span>
                      </div>
                      <Badge variant="default" className={cn(
                        "flex-shrink-0",
                        sidebar.isMobile ? "text-xs px-1.5 py-0.5" : "text-xs"
                      )}>Operacional</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 min-w-0 flex-1">
                        <CheckCircle className={cn(
                          "text-green-500 flex-shrink-0",
                          sidebar.isMobile ? "h-3 w-3" : "h-4 w-4"
                        )} />
                        <span className={cn(
                          "font-medium truncate",
                          sidebar.isMobile ? "text-xs" : "text-sm"
                        )}>HeyGen</span>
                      </div>
                      <Badge variant="default" className={cn(
                        "flex-shrink-0",
                        sidebar.isMobile ? "text-xs px-1.5 py-0.5" : "text-xs"
                      )}>Operacional</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 min-w-0 flex-1">
                        <CheckCircle className={cn(
                          "text-green-500 flex-shrink-0",
                          sidebar.isMobile ? "h-3 w-3" : "h-4 w-4"
                        )} />
                        <span className={cn(
                          "font-medium truncate",
                          sidebar.isMobile ? "text-xs" : "text-sm"
                        )}>ElevenLabs</span>
                      </div>
                      <Badge variant="default" className={cn(
                        "flex-shrink-0",
                        sidebar.isMobile ? "text-xs px-1.5 py-0.5" : "text-xs"
                      )}>Operacional</Badge>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Production Pipeline */}
          <Card>
            <CardHeader className={cn(
              sidebar.isMobile ? "p-4" : "p-6"
            )}>
              <CardTitle className="flex items-center space-x-2">
                <Globe className={cn(
                  sidebar.isMobile ? "h-4 w-4" : "h-5 w-5"
                )} />
                <span className={cn(
                  sidebar.isMobile ? "text-sm" : "text-base"
                )}>Pipeline de Produção Global</span>
              </CardTitle>
            </CardHeader>
            <CardContent className={cn(
              sidebar.isMobile ? "p-4" : "p-6"
            )}>
              <div className={cn(
                "grid transition-all duration-300",
                sidebar.isMobile ? "grid-cols-1 gap-4" : "grid-cols-2 md:grid-cols-4 gap-6"
              )}>
                {[
                  { lang: "🇺🇸 Inglês", videos: 24, progress: 85 },
                  { lang: "🇧🇷 Português", videos: 18, progress: 72 },
                  { lang: "🇪🇸 Espanhol", videos: 15, progress: 68 },
                  { lang: "🇩🇪 Alemão", videos: 12, progress: 55 }
                ].map((channel) => (
                  <div key={channel.lang} className={cn(
                    "space-y-2 sm:space-y-3 transition-all duration-300",
                    sidebar.isMobile && "bg-muted/30 p-3 rounded-lg"
                  )}>
                    <div className="flex items-center justify-between">
                      <span className={cn(
                        "font-medium",
                        sidebar.isMobile ? "text-xs truncate" : "text-sm"
                      )}>{channel.lang}</span>
                      <Badge 
                        variant="outline"
                        className={cn(
                          "flex-shrink-0",
                          sidebar.isMobile ? "text-xs px-1.5 py-0.5" : "text-xs"
                        )}
                      >{channel.videos} vídeos</Badge>
                    </div>
                    <Progress 
                      value={channel.progress} 
                      className={cn(
                        sidebar.isMobile ? "h-1.5" : "h-2"
                      )} 
                    />
                    <p className={cn(
                      "text-muted-foreground",
                      sidebar.isMobile ? "text-xs" : "text-xs"
                    )}>{channel.progress}% completo</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          </main>

          {/* Cline AI Assistant Column - Fixed Right */}
          {!sidebar.isMobile && (
            <aside className={cn(
              "w-80 border-l bg-background/50 transition-all duration-300",
              sidebar.isTablet ? "w-72" : "w-80"
            )}>
              <div className="h-full p-4">
                <AdvancedChat compact={true} />
              </div>
            </aside>
          )}

          {/* Mobile Cline Chat */}
          {sidebar.isMobile && (
            <div className="p-4 border-t bg-background/50">
              <div className="h-96">
                <AdvancedChat compact={true} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}