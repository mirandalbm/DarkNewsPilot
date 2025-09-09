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
import ApiSettings from "@/pages/api-settings";
import NotFound from "@/pages/not-found";
import ThumbnailGenerator from "@/pages/thumbnails";
import SEOOptimization from "@/pages/seo";
import HashtagGenerator from "@/pages/hashtags";
import YouTubeAnalytics from "@/pages/youtube-analytics";
import TrendsAnalysis from "@/pages/trends";
import RevenueAnalysis from "@/pages/revenue";
import ABTesting from "@/pages/ab-testing";
import AutomationPipelines from "@/pages/automation";
import AIModels from "@/pages/ai-models";
import VoiceCloning from "@/pages/voice-cloning";
import Predictions from "@/pages/predictions";
import Subscriptions from "@/pages/subscriptions";
import Affiliates from "@/pages/affiliates";
import Sponsors from "@/pages/sponsors";
// Configurações
import ConfiguracaoIndex from "@/pages/configuracoes";
import Integracoes from "@/pages/configuracoes/integracoes";
import Painel from "@/pages/configuracoes/painel";
import Saldos from "@/pages/configuracoes/saldos";
import Assinaturas from "@/pages/configuracoes/assinaturas";
import Usuarios from "@/pages/configuracoes/usuarios";
import Canais from "@/pages/configuracoes/canais";

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
          <Route path="/thumbnails" component={ThumbnailGenerator} />
          <Route path="/seo" component={SEOOptimization} />
          <Route path="/hashtags" component={HashtagGenerator} />
          {/* Analytics Avançado */}
          <Route path="/youtube-analytics" component={YouTubeAnalytics} />
          <Route path="/trends" component={TrendsAnalysis} />
          <Route path="/revenue" component={RevenueAnalysis} />
          <Route path="/ab-testing" component={ABTesting} />
          {/* Automação & IA */}
          <Route path="/automation" component={AutomationPipelines} />
          <Route path="/ai-models" component={AIModels} />
          <Route path="/voice-cloning" component={VoiceCloning} />
          <Route path="/predictions" component={Predictions} />
          {/* Monetização */}
          <Route path="/subscriptions" component={Subscriptions} />
          <Route path="/affiliates" component={Affiliates} />
          <Route path="/sponsors" component={Sponsors} />
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
          {/* Configurações */}
          <Route path="/configuracoes" component={ConfiguracaoIndex} />
          <Route path="/configuracoes/integracoes" component={Integracoes} />
          <Route path="/configuracoes/painel" component={Painel} />
          <Route path="/configuracoes/saldos" component={Saldos} />
          <Route path="/configuracoes/assinaturas" component={Assinaturas} />
          <Route path="/configuracoes/usuarios" component={Usuarios} />
          <Route path="/configuracoes/canais" component={Canais} />
          <Route path="/settings" component={ConfiguracaoIndex} />
          <Route path="/settings/integracoes" component={Integracoes} />
          <Route path="/settings/painel" component={Painel} />
          <Route path="/settings/saldos" component={Saldos} />
          <Route path="/settings/assinaturas" component={Assinaturas} />
          <Route path="/settings/usuarios" component={Usuarios} />
          <Route path="/settings/canais" component={Canais} />
        </>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="darknews-theme">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
