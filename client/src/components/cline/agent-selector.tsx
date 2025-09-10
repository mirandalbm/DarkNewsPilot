import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  AtSign, 
  Bot, 
  Zap, 
  Building2, 
  Sparkles,
  ChevronDown 
} from "lucide-react";

interface AgentSelectorProps {
  value: string;
  onChange: (agent: string) => void;
  compact?: boolean;
}

interface Agent {
  id: string;
  name: string;
  description: string;
  icon: any;
  category: 'builtin' | 'custom';
  capabilities: string[];
}

const builtInAgents: Agent[] = [
  {
    id: "builder",
    name: "Builder",
    description: "Execute routine tasks end-to-end",
    icon: Building2,
    category: 'builtin',
    capabilities: ["coding", "debugging", "testing"]
  },
  {
    id: "builder-mcp",
    name: "Builder with MCP", 
    description: "Set up with all configured MCP services",
    icon: Zap,
    category: 'builtin',
    capabilities: ["coding", "mcp-tools", "integration"]
  },
  {
    id: "builder-autonomo",
    name: "Builder Autônomo",
    description: "Quickly build beautiful web apps",
    icon: Sparkles,
    category: 'builtin',
    capabilities: ["autonomous", "rapid-dev", "ui-design"]
  },
  {
    id: "solo-builder",
    name: "SOLO Builder",
    description: "Advanced autonomous development",
    icon: Bot,
    category: 'builtin',
    capabilities: ["autonomous", "advanced", "full-stack"]
  }
];

export function AgentSelector({ value, onChange }: AgentSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const selectedAgent = builtInAgents.find(agent => agent.id === value) || builtInAgents[0];

  const handleSelect = (agentId: string) => {
    onChange(agentId);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1"
        data-testid="button-agent-selector"
      >
        <AtSign className="h-3 w-3" />
        <selectedAgent.icon className="h-3 w-3" />
        <ChevronDown className="h-3 w-3" />
      </Button>

      {isOpen && (
        <div className="absolute bottom-full left-0 mb-2 w-80 bg-popover border rounded-md shadow-lg z-50">
          <div className="p-3">
            <h4 className="font-semibold text-sm mb-3 flex items-center">
              <AtSign className="h-4 w-4 mr-2" />
              Selecionar Agente
            </h4>
            
            <div className="space-y-2">
              <div>
                <h5 className="text-xs font-medium text-muted-foreground mb-2">
                  Built-in Agents
                </h5>
                <div className="space-y-1">
                  {builtInAgents.map((agent) => (
                    <button
                      key={agent.id}
                      onClick={() => handleSelect(agent.id)}
                      className={`w-full text-left p-2 rounded-md hover:bg-accent transition-colors ${
                        value === agent.id ? 'bg-accent' : ''
                      }`}
                      data-testid={`agent-${agent.id}`}
                    >
                      <div className="flex items-start space-x-2">
                        <agent.icon className="h-4 w-4 mt-0.5 text-primary" />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm">{agent.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {agent.description}
                          </div>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {agent.capabilities.slice(0, 3).map((capability) => (
                              <Badge 
                                key={capability} 
                                variant="secondary" 
                                className="text-xs px-1 py-0"
                              >
                                {capability}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t">
                <h5 className="text-xs font-medium text-muted-foreground mb-2">
                  Custom Agents
                </h5>
                <div className="text-xs text-muted-foreground text-center py-2">
                  No custom agents available.{" "}
                  <button className="text-primary hover:underline">
                    Create
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}