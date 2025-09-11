import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  Settings,
  X,
  Bot,
  Mic,
  Zap,
  Database,
  Globe,
  Key,
  Palette,
  Volume2,
  Bell
} from "lucide-react";

interface SettingsPanelProps {
  onClose: () => void;
  clineState: any;
  onStateChange: (state: any) => void;
  compact?: boolean;
}

export function SettingsPanel({ onClose, clineState, onStateChange, compact = false }: SettingsPanelProps) {
  const [activeTab, setActiveTab] = useState("general");

  const handleToggle = (key: string, value: boolean) => {
    onStateChange({
      ...clineState,
      [key]: value
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>Configurações Avançadas</span>
          </CardTitle>
          <Button
            size="sm"
            variant="ghost"
            onClick={onClose}
            data-testid="button-close-settings"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 bg-muted/50 gap-1 h-auto p-1">
              <TabsTrigger 
                value="general" 
                className="flex items-center space-x-1 !text-sm !sm:text-sm !px-2 !py-2.5 h-auto min-h-[44px] whitespace-nowrap data-[state=active]:!text-sm"
              >
                <Settings className="h-3 w-3" />
                <span>Geral</span>
              </TabsTrigger>
              <TabsTrigger 
                value="agents" 
                className="flex items-center space-x-1 !text-sm !sm:text-sm !px-2 !py-2.5 h-auto min-h-[44px] whitespace-nowrap data-[state=active]:!text-sm"
              >
                <Bot className="h-3 w-3" />
                <span>Agentes</span>
              </TabsTrigger>
              <TabsTrigger 
                value="voice" 
                className="flex items-center space-x-1 !text-sm !sm:text-sm !px-2 !py-2.5 h-auto min-h-[44px] whitespace-nowrap data-[state=active]:!text-sm"
              >
                <Mic className="h-3 w-3" />
                <span>Voz</span>
              </TabsTrigger>
              <TabsTrigger 
                value="automation" 
                className="flex items-center space-x-1 !text-sm !sm:text-sm !px-2 !py-2.5 h-auto min-h-[44px] whitespace-nowrap data-[state=active]:!text-sm"
              >
                <Zap className="h-3 w-3" />
                <span>Automação</span>
              </TabsTrigger>
              <TabsTrigger 
                value="integrations" 
                className="flex items-center space-x-1 !text-sm !sm:text-sm !px-2 !py-2.5 h-auto min-h-[44px] whitespace-nowrap data-[state=active]:!text-sm"
              >
                <Database className="h-3 w-3" />
                <span>Integrações</span>
              </TabsTrigger>
              <TabsTrigger 
                value="appearance" 
                className="flex items-center space-x-1 !text-sm !sm:text-sm !px-2 !py-2.5 h-auto min-h-[44px] whitespace-nowrap data-[state=active]:!text-sm"
              >
                <Palette className="h-3 w-3" />
                <span>Aparência</span>
              </TabsTrigger>
            </TabsList>

            <div className="p-6 max-h-96 overflow-y-auto">
              {/* General Settings */}
              <TabsContent value="general" className="space-y-6 mt-0">
                <div>
                  <h3 className="font-semibold mb-4">Configurações Gerais</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm font-medium">Auto-Run</Label>
                        <p className="text-xs text-muted-foreground">
                          Executar comandos automaticamente
                        </p>
                      </div>
                      <Switch
                        checked={clineState.autoRunEnabled}
                        onCheckedChange={(value) => handleToggle('autoRunEnabled', value)}
                        data-testid="switch-auto-run"
                      />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm font-medium">Task List</Label>
                        <p className="text-xs text-muted-foreground">
                          Permitir agentes usar listas de tarefas
                        </p>
                      </div>
                      <Switch
                        checked={true}
                        onCheckedChange={() => {}}
                        data-testid="switch-task-list"
                      />
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Deny List</Label>
                      <p className="text-xs text-muted-foreground mb-2">
                        Comandos bloqueados (separados por vírgula)
                      </p>
                      <Input
                        placeholder="rm, kill, chmod"
                        className="text-sm"
                        data-testid="input-deny-list"
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Agents Settings */}
              <TabsContent value="agents" className="space-y-6 mt-0">
                <div>
                  <h3 className="font-semibold mb-4">Configuração de Agentes</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium mb-2 block">Agente Padrão</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {['builder', 'builder-mcp', 'builder-autonomo', 'solo-builder'].map((agent) => (
                          <Button
                            key={agent}
                            variant={clineState.activeAgent === agent ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => onStateChange({ ...clineState, activeAgent: agent })}
                            className="justify-start text-xs"
                            data-testid={`agent-option-${agent}`}
                          >
                            {agent.replace('-', ' ')}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <Label className="text-sm font-medium mb-2 block">Custom Agents</Label>
                      <p className="text-xs text-muted-foreground mb-3">
                        No custom agents available.
                      </p>
                      <Button size="sm" variant="outline" className="text-xs">
                        Create Custom Agent
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Voice Settings */}
              <TabsContent value="voice" className="space-y-6 mt-0">
                <div>
                  <h3 className="font-semibold mb-4">Configurações de Voz</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm font-medium">Transcrição Habilitada</Label>
                        <p className="text-xs text-muted-foreground">
                          Permitir transcrição de voz para texto
                        </p>
                      </div>
                      <Switch
                        checked={clineState.voiceEnabled}
                        onCheckedChange={(value) => handleToggle('voiceEnabled', value)}
                        data-testid="switch-voice-enabled"
                      />
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Idioma</Label>
                      <select className="w-full px-3 py-2 border rounded text-sm">
                        <option value="pt-BR">Português (Brasil)</option>
                        <option value="en-US">English (US)</option>
                        <option value="es-ES">Español</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium flex items-center">
                        <Volume2 className="h-4 w-4 mr-2" />
                        Volume Setting
                      </Label>
                      <Input
                        type="range"
                        min="0"
                        max="100"
                        defaultValue="100"
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Automation Settings */}
              <TabsContent value="automation" className="space-y-6 mt-0">
                <div>
                  <h3 className="font-semibold mb-4">Configurações de Automação</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm font-medium">Notificações de Status</Label>
                        <p className="text-xs text-muted-foreground">
                          Alertas quando tarefas são completadas
                        </p>
                      </div>
                      <Switch
                        checked={true}
                        onCheckedChange={() => {}}
                        data-testid="switch-notifications"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm font-medium">Notificações Sonoras</Label>
                        <p className="text-xs text-muted-foreground">
                          Sons para notificações
                        </p>
                      </div>
                      <Switch
                        checked={true}
                        onCheckedChange={() => {}}
                        data-testid="switch-sound-notifications"
                      />
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Timeout de Comandos</Label>
                      <Input
                        type="number"
                        placeholder="30"
                        className="text-sm"
                        data-testid="input-command-timeout"
                      />
                      <p className="text-xs text-muted-foreground">
                        Tempo limite em segundos para execução de comandos
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Integrations Settings */}
              <TabsContent value="integrations" className="space-y-6 mt-0">
                <div>
                  <h3 className="font-semibold mb-4">Status das Integrações</h3>
                  
                  <div className="space-y-3">
                    {[
                      { name: 'OpenAI', status: 'configured', icon: Key },
                      { name: 'ElevenLabs', status: 'configured', icon: Key },
                      { name: 'HeyGen', status: 'configured', icon: Key },
                      { name: 'NewsAPI', status: 'configured', icon: Globe },
                      { name: 'YouTube', status: 'configured', icon: Globe },
                      { name: 'Slack', status: 'not_configured', icon: Globe },
                      { name: 'Database', status: 'healthy', icon: Database }
                    ].map((integration) => (
                      <div key={integration.name} className="flex items-center justify-between p-3 border rounded">
                        <div className="flex items-center space-x-3">
                          <integration.icon className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">{integration.name}</span>
                        </div>
                        <Badge 
                          variant={
                            integration.status === 'healthy' ? 'default' :
                            integration.status === 'configured' ? 'secondary' : 
                            'destructive'
                          }
                          className="text-xs"
                        >
                          {integration.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              {/* Appearance Settings */}
              <TabsContent value="appearance" className="space-y-6 mt-0">
                <div>
                  <h3 className="font-semibold mb-4">Aparência e Tema</h3>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Tema</Label>
                      <div className="grid grid-cols-3 gap-2">
                        {['Light', 'Dark', 'Auto'].map((theme) => (
                          <Button
                            key={theme}
                            variant="outline"
                            size="sm"
                            className="justify-center text-xs"
                          >
                            {theme}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Densidade da Interface</Label>
                      <div className="grid grid-cols-3 gap-2">
                        {['Compact', 'Normal', 'Comfortable'].map((density) => (
                          <Button
                            key={density}
                            variant="outline"
                            size="sm"
                            className="justify-center text-xs"
                          >
                            {density}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Idioma da Interface</Label>
                      <select className="w-full px-3 py-2 border rounded text-sm">
                        <option value="pt-BR">Português (Brasil)</option>
                        <option value="en-US">English (US)</option>
                        <option value="es-ES">Español</option>
                      </select>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </div>

            {/* Footer Actions */}
            <div className="p-4 border-t bg-muted/30 flex justify-between">
              <div className="text-xs text-muted-foreground">
                Configurações são salvas automaticamente
              </div>
              <div className="space-x-2">
                <Button size="sm" variant="outline" onClick={onClose}>
                  Cancelar
                </Button>
                <Button size="sm" onClick={onClose}>
                  Salvar
                </Button>
              </div>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}