import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useSidebar } from "@/hooks/useSidebar";
import { 
  Moon, 
  BarChart3, 
  Newspaper, 
  Video, 
  TrendingUp, 
  Settings,
  LogOut,
  HeartPulse,
  DollarSign,
  MessageSquare,
  Shield,
  Bot,
  ChevronDown,
  ChevronRight,
  Activity,
  Globe,
  Users,
  Camera,
  Hash,
  Mail,
  Bell,
  Lock,
  Zap,
  PieChart,
  BarChart2,
  LineChart,
  Menu,
  X,
  PanelLeftClose,
  PanelLeftOpen,
  Heart,
  Sparkles,
  Archive,
  RotateCcw,
  Backup
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";

const navigationStructure = [
  {
    name: "Dashboard",
    href: "/",
    icon: BarChart3,
    type: "single"
  },
  {
    name: "Gerenciamento de Conteúdo",
    icon: Newspaper,
    type: "category",
    children: [
      { name: "Notícias", href: "/news", icon: Newspaper },
      { name: "Produção de Vídeos", href: "/production", icon: Video },
      { name: "Gerador de Thumbnails", href: "/thumbnails", icon: Camera },
      { name: "Otimização SEO", href: "/seo", icon: TrendingUp },
      { name: "Gerador de Hashtags", href: "/hashtags", icon: Hash }
    ]
  },
  {
    name: "Analytics & Insights",
    icon: PieChart,
    type: "category", 
    children: [
      { name: "Visão Geral", href: "/analytics", icon: BarChart2 },
      { name: "Performance YouTube", href: "/youtube-analytics", icon: LineChart },
      { name: "Análise de Tendências", href: "/trends", icon: TrendingUp },
      { name: "ROI & Receitas", href: "/revenue", icon: DollarSign },
      { name: "A/B Testing", href: "/ab-testing", icon: Activity }
    ]
  },
  {
    name: "Automação & IA",
    icon: Bot,
    type: "category",
    children: [
      { name: "Pipelines Automáticos", href: "/automation", icon: Zap },
      { name: "Modelos de IA Custom", href: "/ai-models", icon: Bot },
      { name: "Clonagem de Voz", href: "/voice-cloning", icon: Users },
      { name: "Previsões", href: "/predictions", icon: TrendingUp },
      { name: "Animações Emocionais", href: "/emotion-animations", icon: Heart }
    ]
  },
  {
    name: "Monetização",
    icon: DollarSign,
    type: "category",
    children: [
      { name: "Assinaturas", href: "/subscriptions", icon: DollarSign },
      { name: "Afiliados", href: "/affiliates", icon: Users },
      { name: "Patrocínios", href: "/sponsors", icon: Globe },
      { name: "AdSense", href: "/adsense", icon: PieChart }
    ]
  },
  {
    name: "Comunicação",
    icon: MessageSquare,
    type: "category",
    children: [
      { name: "Email Marketing", href: "/email", icon: Mail },
      { name: "Discord Bot", href: "/discord", icon: MessageSquare },
      { name: "Notificações", href: "/notifications", icon: Bell },
      { name: "Moderação", href: "/moderation", icon: Shield }
    ]
  },
  {
    name: "Segurança",
    icon: Shield,
    type: "category",
    children: [
      { name: "Verificação de Conteúdo", href: "/content-verification", icon: Shield },
      { name: "Fact-Checking", href: "/fact-checking", icon: Lock },
      { name: "Copyright", href: "/copyright", icon: Lock },
      { name: "Auditoria", href: "/audit", icon: Activity },
      { name: "Backup & Recuperação", href: "/backup", icon: Archive }
    ]
  },
  {
    name: "Configurações",
    href: "/settings",
    icon: Settings,
    type: "single"
  }
];

interface SidebarContentProps {
  isCollapsed?: boolean;
  onNavigate?: () => void;
}

function SidebarContent({ isCollapsed = false, onNavigate }: SidebarContentProps) {
  const [location] = useLocation();
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['Gerenciamento de Conteúdo']));

  const { data: stats } = useQuery({
    queryKey: ["/api/dashboard/stats"],
    refetchInterval: 30000,
  });

  const toggleCategory = (categoryName: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryName)) {
      newExpanded.delete(categoryName);
    } else {
      newExpanded.add(categoryName);
    }
    setExpandedCategories(newExpanded);
  };

  const isActiveRoute = (href: string) => location === href;
  const isCategoryActive = (children: any[]) => children.some(child => location === child.href);

  const handleNavigation = (href: string) => {
    if (onNavigate) {
      onNavigate();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Logo/Header */}
      <div className={cn(
        "border-b border-border transition-all duration-300",
        isCollapsed ? "p-3" : "p-6"
      )}>
        <div className={cn(
          "flex items-center transition-all duration-300",
          isCollapsed ? "justify-center" : "space-x-3"
        )}>
          <div className={cn(
            "bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg transition-all duration-300",
            isCollapsed ? "w-10 h-10" : "w-12 h-12"
          )}>
            <Moon className={cn(
              "text-white transition-all duration-300",
              isCollapsed ? "h-6 w-6" : "h-7 w-7"
            )} />
          </div>
          {!isCollapsed && (
            <div className="animate-in slide-in-from-left-2 duration-300">
              <h1 className="text-xl font-bold text-foreground">DarkNews</h1>
              <p className="text-sm text-muted-foreground">Professional Autopilot</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <ScrollArea className={cn(
        "flex-1 py-6 transition-all duration-300",
        isCollapsed ? "px-2" : "px-4"
      )}>
        <nav className="space-y-2">
          {navigationStructure.map((item) => {
            if (item.type === "single") {
              const isActive = isActiveRoute(item.href!);
              const button = (
                <Link key={item.name} href={item.href!}>
                  <Button
                    variant="ghost"
                    onClick={() => handleNavigation(item.href!)}
                    className={cn(
                      "w-full transition-all duration-200 h-11 group",
                      isCollapsed ? "justify-center px-2" : "justify-start space-x-3",
                      isActive 
                        ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-md" 
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                    )}
                    data-testid={`nav-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    <item.icon className={cn(
                      "transition-all duration-200",
                      isCollapsed ? "h-5 w-5" : "h-5 w-5"
                    )} />
                    {!isCollapsed && (
                      <span className="font-medium animate-in slide-in-from-left-2 duration-300">
                        {item.name}
                      </span>
                    )}
                  </Button>
                </Link>
              );
              
              return isCollapsed ? (
                <Tooltip key={item.name} delayDuration={300}>
                  <TooltipTrigger asChild>
                    {button}
                  </TooltipTrigger>
                  <TooltipContent side="right" className="font-medium">
                    {item.name}
                  </TooltipContent>
                </Tooltip>
              ) : button;
            } else {
              const isExpanded = expandedCategories.has(item.name) && !isCollapsed;
              const isActive = isCategoryActive(item.children!);
              
              const categoryButton = (
                <Button
                  variant="ghost"
                  onClick={() => !isCollapsed && toggleCategory(item.name)}
                  className={cn(
                    "w-full transition-all duration-200 h-11 group",
                    isCollapsed ? "justify-center px-2" : "justify-between",
                    isActive 
                      ? "bg-muted text-foreground font-medium" 
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                  )}
                >
                  <div className={cn(
                    "flex items-center transition-all duration-200",
                    isCollapsed ? "justify-center" : "space-x-3"
                  )}>
                    <item.icon className="h-5 w-5" />
                    {!isCollapsed && (
                      <span className="font-medium animate-in slide-in-from-left-2 duration-300">
                        {item.name}
                      </span>
                    )}
                  </div>
                  {!isCollapsed && (
                    <div className="animate-in slide-in-from-right-2 duration-300">
                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </div>
                  )}
                </Button>
              );
              
              return (
                <div key={item.name} className="space-y-1">
                  {isCollapsed ? (
                    <Tooltip delayDuration={300}>
                      <TooltipTrigger asChild>
                        {categoryButton}
                      </TooltipTrigger>
                      <TooltipContent side="right" className="font-medium max-w-xs">
                        <div className="space-y-1">
                          <div className="font-semibold">{item.name}</div>
                          <div className="space-y-0.5">
                            {item.children!.map((child) => (
                              <Link key={child.name} href={child.href}>
                                <div 
                                  className="text-sm hover:text-primary cursor-pointer py-1 px-2 rounded hover:bg-muted/60 transition-colors"
                                  onClick={() => handleNavigation(child.href)}
                                >
                                  {child.name}
                                </div>
                              </Link>
                            ))}
                          </div>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  ) : (
                    categoryButton
                  )}
                  
                  {isExpanded && !isCollapsed && (
                    <div className="ml-4 space-y-1 border-l border-border/50 pl-4 animate-in slide-in-from-top-2 duration-300">
                      {item.children!.map((child) => {
                        const isChildActive = isActiveRoute(child.href);
                        return (
                          <Link key={child.name} href={child.href}>
                            <Button
                              variant="ghost"
                              onClick={() => handleNavigation(child.href)}
                              className={cn(
                                "w-full justify-start space-x-3 transition-all duration-200 h-9 group",
                                isChildActive 
                                  ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm" 
                                  : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                              )}
                              data-testid={`nav-${child.name.toLowerCase().replace(/\s+/g, '-')}`}
                            >
                              <child.icon className="h-4 w-4" />
                              <span className="text-sm">{child.name}</span>
                            </Button>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }
          })}
        </nav>
      </ScrollArea>

      {/* System Status */}
      <div className={cn(
        "border-t border-border transition-all duration-300",
        isCollapsed ? "p-2" : "p-4"
      )}>
        {!isCollapsed && (
          <div className="bg-gradient-to-br from-muted/50 to-muted rounded-xl p-4 space-y-3 animate-in slide-in-from-bottom-2 duration-300">
            <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center">
              <HeartPulse className="h-4 w-4 mr-2 text-green-500" />
              Status do Sistema
            </h3>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Vídeos Hoje</span>
                <Badge variant="secondary" className="text-xs">
                  {stats?.videosToday || 0}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Taxa de Sucesso</span>
                <Badge variant="outline" className="text-xs text-green-600">
                  {stats?.successRate || 0}%
                </Badge>
              </div>
              
              <div className="flex items-center space-x-2 pt-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-muted-foreground">Todos os sistemas funcionando</span>
              </div>
            </div>
          </div>
        )}

        {!isCollapsed && <Separator className="my-4" />}

        {/* User & Logout */}
        <div className="space-y-2">
          {isCollapsed ? (
            <Tooltip delayDuration={300}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  onClick={() => window.location.href = '/api/logout'}
                  className="w-full justify-center px-2 text-muted-foreground hover:text-foreground h-9"
                  data-testid="button-logout"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" className="font-medium">
                Sair
              </TooltipContent>
            </Tooltip>
          ) : (
            <Button
              variant="ghost"
              onClick={() => window.location.href = '/api/logout'}
              className="w-full justify-start space-x-3 text-muted-foreground hover:text-foreground h-9 animate-in slide-in-from-left-2 duration-300"
              data-testid="button-logout"
            >
              <LogOut className="h-4 w-4" />
              <span className="text-sm">Sair</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProfessionalSidebar() {
  const sidebar = useSidebar();

  // Desktop sidebar
  if (sidebar.isDesktop) {
    return (
      <div className="relative">
        <aside className={cn(
          "sidebar-responsive bg-card border-r border-border flex flex-col",
          sidebar.isCollapsed ? "w-16" : "w-72"
        )}>
          <SidebarContent isCollapsed={sidebar.isCollapsed} />
        </aside>
        
        {/* Toggle button */}
        <Button
          variant="outline"
          size="sm"
          onClick={sidebar.toggleCollapse}
          className="absolute -right-3 top-6 z-10 h-6 w-6 rounded-full bg-background border shadow-md hover:shadow-lg transition-all duration-200"
          data-testid="button-toggle-sidebar"
        >
          {sidebar.isCollapsed ? (
            <PanelLeftOpen className="h-3 w-3" />
          ) : (
            <PanelLeftClose className="h-3 w-3" />
          )}
        </Button>
      </div>
    );
  }

  // Mobile/Tablet drawer
  return (
    <div className="lg:hidden">
      <Sheet open={sidebar.isOpen} onOpenChange={sidebar.toggleSidebar}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="fixed top-4 left-4 z-50 h-10 w-10 bg-background/80 backdrop-blur-sm border shadow-lg hover:shadow-xl transition-all duration-200 lg:hidden"
            data-testid="button-mobile-menu"
          >
            {sidebar.isOpen ? (
              <X className="h-4 w-4" />
            ) : (
              <Menu className="h-4 w-4" />
            )}
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72 p-0 bg-card">
          <SidebarContent onNavigate={sidebar.closeSidebar} />
        </SheetContent>
      </Sheet>
      
      {/* Overlay background for mobile */}
      {sidebar.isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden" 
          onClick={sidebar.closeSidebar}
        />
      )}
    </div>
  );
}