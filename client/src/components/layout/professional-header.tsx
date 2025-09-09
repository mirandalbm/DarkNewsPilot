import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Bell, 
  ChevronRight, 
  Globe, 
  Settings, 
  User, 
  LogOut,
  Search,
  MessageSquare,
  HelpCircle
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";

interface Breadcrumb {
  name: string;
  href?: string;
}

const routeBreadcrumbs: Record<string, Breadcrumb[]> = {
  "/": [{ name: "Dashboard" }],
  "/news": [{ name: "Gerenciamento de Conteúdo" }, { name: "Notícias" }],
  "/production": [{ name: "Gerenciamento de Conteúdo" }, { name: "Produção de Vídeos" }],
  "/analytics": [{ name: "Analytics & Insights" }, { name: "Visão Geral" }],
  "/thumbnails": [{ name: "Gerenciamento de Conteúdo" }, { name: "Gerador de Thumbnails" }],
  "/seo": [{ name: "Gerenciamento de Conteúdo" }, { name: "Otimização SEO" }],
  "/hashtags": [{ name: "Gerenciamento de Conteúdo" }, { name: "Gerador de Hashtags" }],
  "/youtube-analytics": [{ name: "Analytics & Insights" }, { name: "Performance YouTube" }],
  "/trends": [{ name: "Analytics & Insights" }, { name: "Análise de Tendências" }],
  "/revenue": [{ name: "Analytics & Insights" }, { name: "ROI & Receitas" }],
  "/ab-testing": [{ name: "Analytics & Insights" }, { name: "A/B Testing" }],
  "/automation": [{ name: "Automação & IA" }, { name: "Pipelines Automáticos" }],
  "/ai-models": [{ name: "Automação & IA" }, { name: "Modelos de IA Custom" }],
  "/voice-cloning": [{ name: "Automação & IA" }, { name: "Clonagem de Voz" }],
  "/predictions": [{ name: "Automação & IA" }, { name: "Previsões" }],
  "/subscriptions": [{ name: "Monetização" }, { name: "Assinaturas" }],
  "/affiliates": [{ name: "Monetização" }, { name: "Afiliados" }],
  "/sponsors": [{ name: "Monetização" }, { name: "Patrocínios" }],
  "/adsense": [{ name: "Monetização" }, { name: "AdSense" }],
  "/email": [{ name: "Comunicação" }, { name: "Email Marketing" }],
  "/discord": [{ name: "Comunicação" }, { name: "Discord Bot" }],
  "/notifications": [{ name: "Comunicação" }, { name: "Notificações" }],
  "/moderation": [{ name: "Comunicação" }, { name: "Moderação" }],
  "/content-verification": [{ name: "Segurança" }, { name: "Verificação de Conteúdo" }],
  "/fact-checking": [{ name: "Segurança" }, { name: "Fact-Checking" }],
  "/copyright": [{ name: "Segurança" }, { name: "Copyright" }],
  "/audit": [{ name: "Segurança" }, { name: "Auditoria" }],
  "/settings": [{ name: "Configurações" }],
};

export default function ProfessionalHeader() {
  const { user } = useAuth();
  const [location] = useLocation();
  
  const breadcrumbs = routeBreadcrumbs[location] || [{ name: "Dashboard" }];
  
  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Bom dia";
    if (hour < 18) return "Boa tarde";
    return "Boa noite";
  };

  return (
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6">
      {/* Left Side - Breadcrumbs */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2 text-sm">
          {breadcrumbs.map((crumb, index) => (
            <div key={index} className="flex items-center">
              {index > 0 && <ChevronRight className="h-4 w-4 text-muted-foreground mx-2" />}
              <span 
                className={index === breadcrumbs.length - 1 
                  ? "font-medium text-foreground" 
                  : "text-muted-foreground hover:text-foreground cursor-pointer"
                }
              >
                {crumb.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Center - Search */}
      <div className="flex-1 max-w-md mx-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar vídeos, notícias, configurações..."
            className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-lg text-sm 
                     focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                     placeholder:text-muted-foreground"
          />
        </div>
      </div>

      {/* Right Side - Actions & Profile */}
      <div className="flex items-center space-x-4">
        {/* Live Status */}
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-muted-foreground">Ao vivo</span>
        </div>

        {/* Language */}
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <Globe className="h-4 w-4" />
        </Button>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 relative">
              <Bell className="h-4 w-4" />
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 h-5 w-5 text-xs p-0 flex items-center justify-center"
              >
                3
              </Badge>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notificações</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="max-h-64 overflow-y-auto">
              <DropdownMenuItem className="flex items-start space-x-3 p-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Novo vídeo publicado</p>
                  <p className="text-xs text-muted-foreground">Canal PT-BR • há 5 minutos</p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-start space-x-3 p-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Meta de visualizações atingida</p>
                  <p className="text-xs text-muted-foreground">1M views • há 1 hora</p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-start space-x-3 p-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Erro na geração de vídeo</p>
                  <p className="text-xs text-muted-foreground">Canal ES-ES • há 2 horas</p>
                </div>
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Messages */}
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <MessageSquare className="h-4 w-4" />
        </Button>

        {/* Help */}
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <HelpCircle className="h-4 w-4" />
        </Button>

        {/* Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 px-2 hover:bg-muted">
              <div className="flex items-center space-x-3">
                <Avatar className="h-7 w-7">
                  <AvatarImage src={(user as any)?.profileImageUrl} />
                  <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                    {(user as any)?.firstName?.[0] || 'U'}{(user as any)?.lastName?.[0] || 'S'}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium">{getTimeGreeting()}</p>
                  <p className="text-xs text-muted-foreground">
                    {(user as any)?.firstName || 'Usuário'} {(user as any)?.lastName || ''}
                  </p>
                </div>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Perfil</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Configurações</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => window.location.href = '/api/logout'}
              className="text-red-600 focus:text-red-600"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sair</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}