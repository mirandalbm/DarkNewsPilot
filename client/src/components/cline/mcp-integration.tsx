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
  Database,
  Github,
  MessageSquare,
  Newspaper,
  Youtube,
  Activity,
  Server,
  Play,
  AlertCircle,
  CheckCircle,
  Copy
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface MCPIntegrationProps {
  className?: string;
}

export function MCPIntegration({ className }: MCPIntegrationProps) {
  const [selectedTool, setSelectedTool] = useState("db_query");
  const [toolParams, setToolParams] = useState<Record<string, any>>({});
  const [result, setResult] = useState<any>(null);
  const { toast } = useToast();

  // MCP tool execution mutation
  const executeMutation = useMutation({
    mutationFn: async (data: { tool: string; params: Record<string, any> }) => {
      const response = await apiRequest("POST", "/api/cline/mcp/execute", data);
      return response.json();
    },
    onSuccess: (data) => {
      setResult(data);
      toast({
        title: "MCP Tool Executado",
        description: "Operação concluída com sucesso",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message || "Falha ao executar MCP tool",
        variant: "destructive",
      });
    },
  });

  // Health check mutation
  const healthMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("GET", "/api/system/health");
      return response.json();
    },
    onSuccess: (data) => {
      setResult(data);
      toast({
        title: "Health Check",
        description: `Sistema ${data.status}`,
      });
    },
  });

  const tools = [
    {
      id: "db_query",
      name: "Database Query",
      description: "Execute SQL queries on the database",
      icon: Database,
      category: "database",
      params: {
        query: { type: "textarea", placeholder: "SELECT * FROM users LIMIT 10;" },
        params: { type: "text", placeholder: "[] (JSON array for parameters)" }
      }
    },
    {
      id: "db_get_schema",
      name: "Get Schema",
      description: "Retrieve database schema information",
      icon: Database,
      category: "database",
      params: {
        table: { type: "text", placeholder: "Table name (optional)" }
      }
    },
    {
      id: "github_list_repos",
      name: "List Repositories",
      description: "List GitHub repositories",
      icon: Github,
      category: "github",
      params: {
        type: { type: "select", options: ["all", "owner", "public", "private"], default: "all" },
        sort: { type: "select", options: ["created", "updated", "pushed", "full_name"], default: "updated" },
        per_page: { type: "number", placeholder: "30" }
      }
    },
    {
      id: "slack_send_message",
      name: "Send Slack Message",
      description: "Send message to Slack channel",
      icon: MessageSquare,
      category: "slack",
      params: {
        channel: { type: "text", placeholder: "#general" },
        text: { type: "textarea", placeholder: "Hello from DarkNews Autopilot!" }
      }
    },
    {
      id: "news_get_headlines",
      name: "Get News Headlines",
      description: "Fetch breaking news headlines",
      icon: Newspaper,
      category: "news",
      params: {
        category: { type: "select", options: ["business", "entertainment", "general", "health", "science", "sports", "technology"] },
        country: { type: "text", placeholder: "us, br, etc." },
        pageSize: { type: "number", placeholder: "20" }
      }
    },
    {
      id: "youtube_list_channels",
      name: "List Channels",
      description: "List YouTube channels",
      icon: Youtube,
      category: "youtube",
      params: {
        part: { type: "text", placeholder: "snippet,statistics" },
        mine: { type: "checkbox", default: true }
      }
    },
    {
      id: "system_health_check",
      name: "Health Check",
      description: "Check system health status",
      icon: Activity,
      category: "system",
      params: {}
    },
    {
      id: "system_get_metrics",
      name: "Get Metrics",
      description: "Retrieve system performance metrics",
      icon: Server,
      category: "system",
      params: {
        timeRange: { type: "select", options: ["1h", "6h", "24h", "7d"], default: "1h" }
      }
    }
  ];

  const categories = {
    database: { name: "Database", icon: Database, color: "bg-blue-100 text-blue-800" },
    github: { name: "GitHub", icon: Github, color: "bg-gray-100 text-gray-800" },
    slack: { name: "Slack", icon: MessageSquare, color: "bg-green-100 text-green-800" },
    news: { name: "News", icon: Newspaper, color: "bg-orange-100 text-orange-800" },
    youtube: { name: "YouTube", icon: Youtube, color: "bg-red-100 text-red-800" },
    system: { name: "System", icon: Server, color: "bg-purple-100 text-purple-800" }
  };

  const selectedToolData = tools.find(t => t.id === selectedTool);

  const handleParamChange = (paramName: string, value: any) => {
    setToolParams(prev => ({
      ...prev,
      [paramName]: value
    }));
  };

  const executeTool = () => {
    if (!selectedToolData) return;

    // Convert string params to appropriate types
    const processedParams = { ...toolParams };
    Object.entries(selectedToolData.params).forEach(([key, config]) => {
      if (config.type === 'number' && processedParams[key]) {
        processedParams[key] = Number(processedParams[key]);
      }
      if (config.type === 'checkbox') {
        processedParams[key] = processedParams[key] === true;
      }
      if (key === 'params' && processedParams[key]) {
        try {
          processedParams[key] = JSON.parse(processedParams[key]);
        } catch (e) {
          // Keep as string if not valid JSON
        }
      }
    });

    executeMutation.mutate({
      tool: selectedTool,
      params: processedParams
    });
  };

  const copyResult = async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(JSON.stringify(result, null, 2));
      toast({
        title: "Copiado!",
        description: "Resultado copiado para a área de transferência",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao copiar resultado",
        variant: "destructive",
      });
    }
  };

  return (
    <div className={className}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tool Selection */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Server className="h-5 w-5" />
              <span>MCP Tools</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-96">
              <div className="space-y-2">
                {Object.entries(categories).map(([catId, category]) => {
                  const categoryTools = tools.filter(t => t.category === catId);
                  return (
                    <div key={catId} className="space-y-1">
                      <div className="flex items-center space-x-2 py-1">
                        <category.icon className="h-4 w-4" />
                        <span className="font-medium text-sm">{category.name}</span>
                      </div>
                      {categoryTools.map((tool) => (
                        <Button
                          key={tool.id}
                          variant={selectedTool === tool.id ? "default" : "ghost"}
                          size="sm"
                          onClick={() => setSelectedTool(tool.id)}
                          className="w-full justify-start pl-6"
                          data-testid={`tool-${tool.id}`}
                        >
                          <tool.icon className="h-3 w-3 mr-2" />
                          <span className="text-xs">{tool.name}</span>
                        </Button>
                      ))}
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Tool Configuration */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                {selectedToolData && <selectedToolData.icon className="h-5 w-5" />}
                <span>{selectedToolData?.name}</span>
              </CardTitle>
              {selectedToolData && (
                <Badge className={categories[selectedToolData.category as keyof typeof categories].color}>
                  {categories[selectedToolData.category as keyof typeof categories].name}
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              {selectedToolData?.description}
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Parameters */}
            {selectedToolData && Object.keys(selectedToolData.params).length > 0 && (
              <div className="space-y-3">
                <h4 className="font-medium">Parâmetros</h4>
                {Object.entries(selectedToolData.params).map(([paramName, paramConfig]) => (
                  <div key={paramName} className="space-y-1">
                    <label className="text-sm font-medium capitalize">
                      {paramName.replace(/_/g, ' ')}
                    </label>
                    {paramConfig.type === 'textarea' ? (
                      <Textarea
                        placeholder={paramConfig.placeholder}
                        value={toolParams[paramName] || ''}
                        onChange={(e) => handleParamChange(paramName, e.target.value)}
                        data-testid={`param-${paramName}`}
                      />
                    ) : paramConfig.type === 'select' ? (
                      <select
                        className="w-full px-3 py-2 border rounded"
                        value={toolParams[paramName] || paramConfig.default || ''}
                        onChange={(e) => handleParamChange(paramName, e.target.value)}
                        data-testid={`param-${paramName}`}
                      >
                        {paramConfig.options?.map((option: string) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    ) : paramConfig.type === 'checkbox' ? (
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={toolParams[paramName] || paramConfig.default || false}
                          onChange={(e) => handleParamChange(paramName, e.target.checked)}
                          data-testid={`param-${paramName}`}
                        />
                        <span className="text-sm">Ativado</span>
                      </div>
                    ) : (
                      <Input
                        type={paramConfig.type === 'number' ? 'number' : 'text'}
                        placeholder={paramConfig.placeholder}
                        value={toolParams[paramName] || ''}
                        onChange={(e) => handleParamChange(paramName, e.target.value)}
                        data-testid={`param-${paramName}`}
                      />
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Execute Button */}
            <div className="flex space-x-2">
              <Button 
                onClick={executeTool}
                disabled={executeMutation.isPending}
                data-testid="button-execute-tool"
              >
                <Play className="h-4 w-4 mr-2" />
                {executeMutation.isPending ? "Executando..." : "Executar"}
              </Button>
              
              {selectedTool === 'system_health_check' && (
                <Button 
                  variant="outline"
                  onClick={() => healthMutation.mutate()}
                  disabled={healthMutation.isPending}
                  data-testid="button-health-check"
                >
                  <Activity className="h-4 w-4 mr-2" />
                  Health Check
                </Button>
              )}
            </div>

            {/* Result Display */}
            {result && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Resultado</h4>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={copyResult}
                    data-testid="button-copy-result"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copiar
                  </Button>
                </div>
                
                <Card>
                  <CardContent className="p-3">
                    <ScrollArea className="h-64">
                      <pre className="text-xs">
                        {JSON.stringify(result, null, 2)}
                      </pre>
                    </ScrollArea>
                  </CardContent>
                </Card>
                
                {result.status && (
                  <div className="flex items-center space-x-2">
                    {result.status === 'healthy' ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-red-600" />
                    )}
                    <span className="text-sm">
                      Status: {result.status}
                    </span>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}