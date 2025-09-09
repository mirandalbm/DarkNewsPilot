import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import { ThemeProvider } from "@/components/ui/theme-provider";
import Landing from "@/pages/landing";
import ProfessionalDashboard from "@/pages/professional-dashboard";
import NewsManagement from "@/pages/news-management";
import VideoProduction from "@/pages/video-production";
import Analytics from "@/pages/analytics";
import NotFound from "@/pages/not-found";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      {isLoading || !isAuthenticated ? (
        <Route path="/" component={Landing} />
      ) : (
        <>
          <Route path="/" component={ProfessionalDashboard} />
          <Route path="/news" component={NewsManagement} />
          <Route path="/production" component={VideoProduction} />
          <Route path="/analytics" component={Analytics} />
          {/* Ferramentas de Conteúdo */}
          <Route path="/thumbnails" component={() => <div className="p-8"><h1>Gerador de Thumbnails - Em desenvolvimento</h1></div>} />
          <Route path="/seo" component={() => <div className="p-8"><h1>Otimização SEO - Em desenvolvimento</h1></div>} />
          <Route path="/hashtags" component={() => <div className="p-8"><h1>Gerador de Hashtags - Em desenvolvimento</h1></div>} />
          {/* Analytics Avançado */}
          <Route path="/youtube-analytics" component={() => <div className="p-8"><h1>YouTube Analytics - Em desenvolvimento</h1></div>} />
          <Route path="/trends" component={() => <div className="p-8"><h1>Análise de Tendências - Em desenvolvimento</h1></div>} />
          <Route path="/revenue" component={() => <div className="p-8"><h1>ROI & Receitas - Em desenvolvimento</h1></div>} />
          <Route path="/ab-testing" component={() => <div className="p-8"><h1>A/B Testing - Em desenvolvimento</h1></div>} />
          {/* Automação & IA */}
          <Route path="/automation" component={() => <div className="p-8"><h1>Pipelines Automáticos - Em desenvolvimento</h1></div>} />
          <Route path="/ai-models" component={() => <div className="p-8"><h1>Modelos de IA Custom - Em desenvolvimento</h1></div>} />
          <Route path="/voice-cloning" component={() => <div className="p-8"><h1>Clonagem de Voz - Em desenvolvimento</h1></div>} />
          <Route path="/predictions" component={() => <div className="p-8"><h1>Previsões - Em desenvolvimento</h1></div>} />
          {/* Monetização */}
          <Route path="/subscriptions" component={() => <div className="p-8"><h1>Sistema de Assinaturas - Em desenvolvimento</h1></div>} />
          <Route path="/affiliates" component={() => <div className="p-8"><h1>Marketing de Afiliados - Em desenvolvimento</h1></div>} />
          <Route path="/sponsors" component={() => <div className="p-8"><h1>Gestão de Patrocínios - Em desenvolvimento</h1></div>} />
          <Route path="/adsense" component={() => <div className="p-8"><h1>Integração AdSense - Em desenvolvimento</h1></div>} />
          {/* Comunicação */}
          <Route path="/email" component={() => <div className="p-8"><h1>Email Marketing - Em desenvolvimento</h1></div>} />
          <Route path="/discord" component={() => <div className="p-8"><h1>Discord Bot - Em desenvolvimento</h1></div>} />
          <Route path="/notifications" component={() => <div className="p-8"><h1>Sistema de Notificações - Em desenvolvimento</h1></div>} />
          <Route path="/moderation" component={() => <div className="p-8"><h1>Moderação Automática - Em desenvolvimento</h1></div>} />
          {/* Segurança */}
          <Route path="/content-verification" component={() => <div className="p-8"><h1>Verificação de Conteúdo - Em desenvolvimento</h1></div>} />
          <Route path="/fact-checking" component={() => <div className="p-8"><h1>Fact-Checking - Em desenvolvimento</h1></div>} />
          <Route path="/copyright" component={() => <div className="p-8"><h1>Proteção de Copyright - Em desenvolvimento</h1></div>} />
          <Route path="/audit" component={() => <div className="p-8"><h1>Sistema de Auditoria - Em desenvolvimento</h1></div>} />
          <Route path="/settings" component={() => <div className="p-8"><h1>Configurações - Em desenvolvimento</h1></div>} />
        </>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="darknews-theme">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
