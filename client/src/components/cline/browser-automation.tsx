import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Camera, 
  Monitor, 
  MousePointer, 
  Play, 
  AlertCircle,
  CheckCircle,
  Clock,
  Download
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface BrowserAction {
  type: 'click' | 'fill' | 'wait' | 'waitForSelector';
  selector?: string;
  text?: string;
  duration?: number;
  timeout?: number;
}

interface BrowserAutomationProps {
  className?: string;
}

export function BrowserAutomation({ className }: BrowserAutomationProps) {
  const [url, setUrl] = useState("https://example.com");
  const [selector, setSelector] = useState("");
  const [fullPage, setFullPage] = useState(false);
  const [width, setWidth] = useState(1280);
  const [height, setHeight] = useState(720);
  const [duration, setDuration] = useState(10000);
  const [actions, setActions] = useState<BrowserAction[]>([]);
  const [newAction, setNewAction] = useState<BrowserAction>({ type: 'click' });
  const [screenshotResult, setScreenshotResult] = useState<any>(null);
  const [consoleResult, setConsoleResult] = useState<any>(null);
  const [interactionResult, setInteractionResult] = useState<any>(null);
  
  const { toast } = useToast();

  // Screenshot mutation
  const screenshotMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/cline/browser/screenshot", data);
      return response.json();
    },
    onSuccess: (data) => {
      setScreenshotResult(data);
      toast({
        title: "Screenshot capturado",
        description: "Screenshot capturado com sucesso",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message || "Falha ao capturar screenshot",
        variant: "destructive",
      });
    },
  });

  // Console monitoring mutation
  const consoleMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/cline/browser/console", data);
      return response.json();
    },
    onSuccess: (data) => {
      setConsoleResult(data);
      toast({
        title: "Console monitorado",
        description: `Capturados ${data.consoleLogs.length} logs e ${data.errors.length} erros`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message || "Falha ao monitorar console",
        variant: "destructive",
      });
    },
  });

  // Browser interaction mutation
  const interactionMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/cline/browser/interact", data);
      return response.json();
    },
    onSuccess: (data) => {
      setInteractionResult(data);
      const successCount = data.results.filter((r: any) => r.success).length;
      toast({
        title: "Interações concluídas",
        description: `${successCount}/${data.results.length} ações executadas com sucesso`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message || "Falha ao executar interações",
        variant: "destructive",
      });
    },
  });

  const handleScreenshot = () => {
    screenshotMutation.mutate({
      url,
      selector: selector || undefined,
      fullPage,
      width,
      height
    });
  };

  const handleConsoleMonitoring = () => {
    consoleMutation.mutate({
      url,
      duration
    });
  };

  const handleInteraction = () => {
    if (actions.length === 0) {
      toast({
        title: "Erro",
        description: "Adicione pelo menos uma ação",
        variant: "destructive",
      });
      return;
    }

    interactionMutation.mutate({
      url,
      actions
    });
  };

  const addAction = () => {
    if (newAction.type === 'click' && !newAction.selector) {
      toast({
        title: "Erro",
        description: "Seletor é obrigatório para ação click",
        variant: "destructive",
      });
      return;
    }

    setActions([...actions, { ...newAction }]);
    setNewAction({ type: 'click' });
  };

  const removeAction = (index: number) => {
    setActions(actions.filter((_, i) => i !== index));
  };

  const downloadScreenshot = () => {
    if (!screenshotResult?.screenshot) return;
    
    const link = document.createElement('a');
    link.href = screenshotResult.screenshot;
    link.download = `screenshot-${new Date().getTime()}.png`;
    link.click();
  };

  return (
    <div className={className}>
      <Tabs defaultValue="screenshot" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="screenshot" data-testid="tab-screenshot">
            <Camera className="h-4 w-4 mr-2" />
            Screenshots
          </TabsTrigger>
          <TabsTrigger value="console" data-testid="tab-console">
            <Monitor className="h-4 w-4 mr-2" />
            Console
          </TabsTrigger>
          <TabsTrigger value="interact" data-testid="tab-interact">
            <MousePointer className="h-4 w-4 mr-2" />
            Interações
          </TabsTrigger>
        </TabsList>

        <TabsContent value="screenshot" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Captura de Tela</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">URL</label>
                  <Input
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://example.com"
                    data-testid="input-screenshot-url"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Seletor (opcional)</label>
                  <Input
                    value={selector}
                    onChange={(e) => setSelector(e.target.value)}
                    placeholder=".class-name, #id, element"
                    data-testid="input-screenshot-selector"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Largura</label>
                  <Input
                    type="number"
                    value={width}
                    onChange={(e) => setWidth(Number(e.target.value))}
                    data-testid="input-screenshot-width"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Altura</label>
                  <Input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(Number(e.target.value))}
                    data-testid="input-screenshot-height"
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="fullPage"
                  checked={fullPage}
                  onChange={(e) => setFullPage(e.target.checked)}
                  data-testid="checkbox-full-page"
                />
                <label htmlFor="fullPage" className="text-sm">Página completa</label>
              </div>

              <Button 
                onClick={handleScreenshot}
                disabled={screenshotMutation.isPending}
                data-testid="button-take-screenshot"
              >
                <Camera className="h-4 w-4 mr-2" />
                {screenshotMutation.isPending ? "Capturando..." : "Capturar Screenshot"}
              </Button>

              {screenshotResult && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Resultado</h4>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={downloadScreenshot}
                      data-testid="button-download-screenshot"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                  <img 
                    src={screenshotResult.screenshot} 
                    alt="Screenshot"
                    className="max-w-full border rounded"
                    data-testid="img-screenshot-result"
                  />
                  <div className="text-xs text-muted-foreground">
                    {screenshotResult.dimensions.width}x{screenshotResult.dimensions.height} - {screenshotResult.timestamp}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="console" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Monitoramento de Console</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">URL</label>
                  <Input
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://example.com"
                    data-testid="input-console-url"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Duração (ms)</label>
                  <Input
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    data-testid="input-console-duration"
                  />
                </div>
              </div>

              <Button 
                onClick={handleConsoleMonitoring}
                disabled={consoleMutation.isPending}
                data-testid="button-monitor-console"
              >
                <Monitor className="h-4 w-4 mr-2" />
                {consoleMutation.isPending ? "Monitorando..." : "Monitorar Console"}
              </Button>

              {consoleResult && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Console Logs ({consoleResult.consoleLogs.length})</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ScrollArea className="h-40">
                          {consoleResult.consoleLogs.map((log: any, index: number) => (
                            <div key={index} className="flex items-start space-x-2 py-1 text-xs">
                              <Badge variant={log.type === 'error' ? 'destructive' : 'secondary'}>
                                {log.type}
                              </Badge>
                              <span className="flex-1" data-testid={`log-${index}`}>{log.text}</span>
                            </div>
                          ))}
                        </ScrollArea>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Erros ({consoleResult.errors.length})</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ScrollArea className="h-40">
                          {consoleResult.errors.map((error: any, index: number) => (
                            <div key={index} className="py-1 text-xs">
                              <div className="flex items-center space-x-1 text-red-600">
                                <AlertCircle className="h-3 w-3" />
                                <span className="font-medium" data-testid={`error-${index}`}>{error.message}</span>
                              </div>
                              {error.stack && (
                                <pre className="text-xs text-muted-foreground mt-1 whitespace-pre-wrap">
                                  {error.stack.split('\n').slice(0, 3).join('\n')}
                                </pre>
                              )}
                            </div>
                          ))}
                        </ScrollArea>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="interact" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Automação de Interações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">URL</label>
                <Input
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com"
                  data-testid="input-interact-url"
                />
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Adicionar Ação</h4>
                <div className="grid grid-cols-4 gap-2">
                  <select
                    value={newAction.type}
                    onChange={(e) => setNewAction({ ...newAction, type: e.target.value as any })}
                    className="px-3 py-2 border rounded"
                    data-testid="select-action-type"
                  >
                    <option value="click">Click</option>
                    <option value="fill">Preencher</option>
                    <option value="wait">Aguardar</option>
                    <option value="waitForSelector">Aguardar Seletor</option>
                  </select>
                  
                  {(newAction.type === 'click' || newAction.type === 'fill' || newAction.type === 'waitForSelector') && (
                    <Input
                      placeholder="Seletor CSS"
                      value={newAction.selector || ''}
                      onChange={(e) => setNewAction({ ...newAction, selector: e.target.value })}
                      data-testid="input-action-selector"
                    />
                  )}
                  
                  {newAction.type === 'fill' && (
                    <Input
                      placeholder="Texto"
                      value={newAction.text || ''}
                      onChange={(e) => setNewAction({ ...newAction, text: e.target.value })}
                      data-testid="input-action-text"
                    />
                  )}
                  
                  {(newAction.type === 'wait' || newAction.type === 'waitForSelector') && (
                    <Input
                      type="number"
                      placeholder="Duração (ms)"
                      value={newAction.duration || newAction.timeout || ''}
                      onChange={(e) => {
                        const value = Number(e.target.value);
                        if (newAction.type === 'wait') {
                          setNewAction({ ...newAction, duration: value });
                        } else {
                          setNewAction({ ...newAction, timeout: value });
                        }
                      }}
                      data-testid="input-action-duration"
                    />
                  )}
                  
                  <Button onClick={addAction} size="sm" data-testid="button-add-action">
                    Adicionar
                  </Button>
                </div>
              </div>

              {actions.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium">Ações ({actions.length})</h4>
                  <ScrollArea className="h-32">
                    {actions.map((action, index) => (
                      <div key={index} className="flex items-center justify-between p-2 border rounded mb-2">
                        <div className="flex items-center space-x-2">
                          <Badge>{action.type}</Badge>
                          {action.selector && <span className="text-sm">{action.selector}</span>}
                          {action.text && <span className="text-sm">"{action.text}"</span>}
                          {(action.duration || action.timeout) && (
                            <span className="text-sm text-muted-foreground">
                              {action.duration || action.timeout}ms
                            </span>
                          )}
                        </div>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => removeAction(index)}
                          data-testid={`button-remove-action-${index}`}
                        >
                          Remover
                        </Button>
                      </div>
                    ))}
                  </ScrollArea>
                </div>
              )}

              <Button 
                onClick={handleInteraction}
                disabled={interactionMutation.isPending || actions.length === 0}
                data-testid="button-execute-interactions"
              >
                <Play className="h-4 w-4 mr-2" />
                {interactionMutation.isPending ? "Executando..." : "Executar Interações"}
              </Button>

              {interactionResult && (
                <div className="space-y-4">
                  <h4 className="font-medium">Resultados</h4>
                  <div className="space-y-2">
                    {interactionResult.results.map((result: any, index: number) => (
                      <div key={index} className="flex items-center space-x-2 p-2 border rounded">
                        {result.success ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-red-600" />
                        )}
                        <Badge>{result.action}</Badge>
                        {result.selector && <span className="text-sm">{result.selector}</span>}
                        {result.error && <span className="text-sm text-red-600">{result.error}</span>}
                      </div>
                    ))}
                  </div>
                  
                  {interactionResult.screenshot && (
                    <div>
                      <h5 className="font-medium mb-2">Screenshot Final</h5>
                      <img 
                        src={interactionResult.screenshot} 
                        alt="Final screenshot"
                        className="max-w-full border rounded"
                        data-testid="img-interaction-result"
                      />
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}