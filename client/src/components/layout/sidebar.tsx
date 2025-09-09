import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  Moon, 
  BarChart3, 
  Newspaper, 
  Video, 
  Upload, 
  TrendingUp, 
  Settings,
  LogOut,
  HeartPulse
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";

const navigation = [
  { name: "Dashboard", href: "/", icon: BarChart3 },
  { name: "News Management", href: "/news", icon: Newspaper },
  { name: "Video Production", href: "/production", icon: Video },
  { name: "Analytics", href: "/analytics", icon: TrendingUp },
];

export default function Sidebar() {
  const [location] = useLocation();

  const { data: stats } = useQuery({
    queryKey: ["/api/dashboard/stats"],
    refetchInterval: 30000,
  });

  return (
    <aside className="w-64 bg-card border-r border-border flex flex-col">
      {/* Logo/Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <Moon className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">DarkNews</h1>
            <p className="text-sm text-muted-foreground">Autopilot System</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const isActive = location === item.href;
          return (
            <Link key={item.name} href={item.href}>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start space-x-3 transition-all duration-200",
                  isActive 
                    ? "bg-primary text-primary-foreground hover:bg-primary/90" 
                    : "text-muted-foreground hover:text-foreground hover:bg-muted hover:translate-x-1"
                )}
                data-testid={`nav-${item.name.toLowerCase().replace(' ', '-')}`}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Button>
            </Link>
          );
        })}
      </nav>

      {/* System Status */}
      <div className="p-4 border-t border-border">
        <div className="bg-muted rounded-lg p-4 space-y-3">
          <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center">
            <HeartPulse className="h-4 w-4 mr-2" />
            System Status
          </h3>
          
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Videos Today</span>
            <span className="text-sm font-bold text-accent" data-testid="status-videos-today">
              {stats?.videosToday || 0}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Success Rate</span>
            <span className="text-sm font-bold text-accent" data-testid="status-success-rate">
              {stats?.successRate || 0}%
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
            <span className="text-xs text-muted-foreground">All Systems Operational</span>
          </div>
        </div>

        {/* Logout Button */}
        <Button
          variant="ghost"
          onClick={() => window.location.href = '/api/logout'}
          className="w-full justify-start space-x-3 mt-4 text-muted-foreground hover:text-foreground"
          data-testid="button-logout"
        >
          <LogOut className="h-5 w-5" />
          <span>Sign Out</span>
        </Button>
      </div>
    </aside>
  );
}
