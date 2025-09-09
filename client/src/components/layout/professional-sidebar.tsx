import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
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
  LineChart
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

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
      { name: "Previsões", href: "/predictions", icon: TrendingUp }
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
      { name: "Auditoria", href: "/audit", icon: Activity }
    ]
  },
  {
    name: "Configurações",
    href: "/settings",
    icon: Settings,
    type: "single"
  }
];

export default function ProfessionalSidebar() {
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

  return (
    <aside className="w-72 bg-card border-r border-border flex flex-col h-screen">
      {/* Logo/Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
            <Moon className="h-7 w-7 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">DarkNews</h1>
            <p className="text-sm text-muted-foreground">Professional Autopilot</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-4 py-6">
        <nav className="space-y-2">
          {navigationStructure.map((item) => {
            if (item.type === "single") {
              const isActive = isActiveRoute(item.href!);
              return (
                <Link key={item.name} href={item.href!}>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start space-x-3 transition-all duration-200 h-11",
                      isActive 
                        ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-md" 
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                    )}
                    data-testid={`nav-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="font-medium">{item.name}</span>
                  </Button>
                </Link>
              );
            } else {
              const isExpanded = expandedCategories.has(item.name);
              const isActive = isCategoryActive(item.children!);
              
              return (
                <div key={item.name} className="space-y-1">
                  <Button
                    variant="ghost"
                    onClick={() => toggleCategory(item.name)}
                    className={cn(
                      "w-full justify-between h-11 transition-all duration-200",
                      isActive 
                        ? "bg-muted text-foreground font-medium" 
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                    )}
                  >
                    <div className="flex items-center space-x-3">
                      <item.icon className="h-5 w-5" />
                      <span className="font-medium">{item.name}</span>
                    </div>
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </Button>
                  
                  {isExpanded && (
                    <div className="ml-4 space-y-1 border-l border-border/50 pl-4">
                      {item.children!.map((child) => {
                        const isChildActive = isActiveRoute(child.href);
                        return (
                          <Link key={child.name} href={child.href}>
                            <Button
                              variant="ghost"
                              className={cn(
                                "w-full justify-start space-x-3 transition-all duration-200 h-9",
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
      <div className="p-4 border-t border-border">
        <div className="bg-gradient-to-br from-muted/50 to-muted rounded-xl p-4 space-y-3">
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

        <Separator className="my-4" />

        {/* User & Logout */}
        <div className="space-y-2">
          <Button
            variant="ghost"
            onClick={() => window.location.href = '/api/logout'}
            className="w-full justify-start space-x-3 text-muted-foreground hover:text-foreground h-9"
            data-testid="button-logout"
          >
            <LogOut className="h-4 w-4" />
            <span className="text-sm">Sair</span>
          </Button>
        </div>
      </div>
    </aside>
  );
}