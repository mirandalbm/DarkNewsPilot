import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, 
  ChevronDown,
  Zap,
  Star,
  Settings
} from "lucide-react";

interface ModelSelectorProps {
  value: string;
  onChange: (model: string) => void;
  providers?: any;
}

interface Model {
  id: string;
  name: string;
  displayName: string;
  provider: string;
  category: 'premium' | 'avancado' | 'custom';
  contextWindow: number;
  inputCost: number;
  outputCost: number;
  capabilities: string[];
}

const availableModels: Model[] = [
  // Premium Models
  {
    id: "claude-4-sonnet",
    name: "Claude-4-Sonnet",
    displayName: "Claude 4 Sonnet",
    provider: "Anthropic",
    category: "premium",
    contextWindow: 200000,
    inputCost: 0.015,
    outputCost: 0.075,
    capabilities: ["reasoning", "coding", "analysis", "multimodal"]
  },
  {
    id: "gpt-4o",
    name: "GPT-4o",
    displayName: "GPT-4 Omni",
    provider: "OpenAI",
    category: "premium",
    contextWindow: 128000,
    inputCost: 0.005,
    outputCost: 0.015,
    capabilities: ["reasoning", "coding", "vision", "multimodal"]
  },
  
  // Advanced Models
  {
    id: "claude-3.5-sonnet",
    name: "Claude-3.5-Sonnet", 
    displayName: "Claude 3.5 Sonnet",
    provider: "Anthropic",
    category: "avancado",
    contextWindow: 200000,
    inputCost: 0.003,
    outputCost: 0.015,
    capabilities: ["reasoning", "coding", "analysis"]
  },
  {
    id: "gemini-pro",
    name: "Gemini-Pro",
    displayName: "Gemini Pro",
    provider: "Google",
    category: "avancado", 
    contextWindow: 32000,
    inputCost: 0.000125,
    outputCost: 0.000375,
    capabilities: ["reasoning", "multimodal", "fast"]
  },
  
  // Custom Models
  {
    id: "openrouter-auto",
    name: "OpenRouter-Auto",
    displayName: "OpenRouter Auto",
    provider: "OpenRouter",
    category: "custom",
    contextWindow: 200000,
    inputCost: 0.001,
    outputCost: 0.003,
    capabilities: ["dynamic", "cost-effective"]
  }
];

const categoryConfig = {
  premium: {
    name: "Modelos Premium",
    icon: Star,
    color: "text-yellow-600",
    bgColor: "bg-yellow-100"
  },
  avancado: {
    name: "Modelos Avançados", 
    icon: Zap,
    color: "text-blue-600",
    bgColor: "bg-blue-100"
  },
  custom: {
    name: "Modelos Custom",
    icon: Settings,
    color: "text-purple-600", 
    bgColor: "bg-purple-100"
  }
};

export function ModelSelector({ value, onChange, providers }: ModelSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const selectedModel = availableModels.find(model => model.id === value) || availableModels[0];
  
  const handleSelect = (modelId: string) => {
    onChange(modelId);
    setIsOpen(false);
  };

  const modelsByCategory = {
    premium: availableModels.filter(m => m.category === 'premium'),
    avancado: availableModels.filter(m => m.category === 'avancado'),
    custom: availableModels.filter(m => m.category === 'custom')
  };

  return (
    <div className="relative">
      <Button
        type="button"
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full"
        data-testid="button-model-selector"
      >
        <div className="flex items-center space-x-2">
          <Brain className="h-4 w-4" />
          <span className="font-medium">{selectedModel.displayName}</span>
          <Badge variant="secondary" className="text-xs">
            {selectedModel.provider}
          </Badge>
        </div>
        <ChevronDown className="h-4 w-4" />
      </Button>

      {isOpen && (
        <div className="absolute bottom-full left-0 mb-2 w-full min-w-96 bg-popover border rounded-md shadow-lg z-50">
          <div className="p-4">
            <h4 className="font-semibold text-sm mb-4 flex items-center">
              <Brain className="h-4 w-4 mr-2" />
              Selecionar Modelo AI
            </h4>
            
            <div className="space-y-4 max-h-80 overflow-y-auto">
              {(Object.keys(modelsByCategory) as Array<keyof typeof modelsByCategory>).map((category) => {
                const categoryData = categoryConfig[category];
                const models = modelsByCategory[category];
                
                if (models.length === 0) return null;
                
                return (
                  <div key={category}>
                    <h5 className="text-xs font-medium text-muted-foreground mb-2 flex items-center">
                      <categoryData.icon className={`h-3 w-3 mr-1 ${categoryData.color}`} />
                      {categoryData.name}
                    </h5>
                    
                    <div className="space-y-2">
                      {models.map((model) => (
                        <button
                          key={model.id}
                          onClick={() => handleSelect(model.id)}
                          className={`w-full text-left p-3 rounded-md border transition-colors ${
                            value === model.id 
                              ? 'bg-accent border-primary ring-1 ring-primary/20' 
                              : 'hover:bg-accent border-border'
                          }`}
                          data-testid={`model-${model.id}`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="font-medium text-sm flex items-center space-x-2">
                                <span>{model.displayName}</span>
                                {value === model.id && (
                                  <Badge variant="outline" className="text-xs px-1">
                                    Atual
                                  </Badge>
                                )}
                              </div>
                              <div className="text-xs text-muted-foreground mb-2">
                                {model.provider} • {model.contextWindow.toLocaleString()} tokens
                              </div>
                              
                              {/* Capabilities */}
                              <div className="flex flex-wrap gap-1 mb-2">
                                {model.capabilities.slice(0, 3).map((capability) => (
                                  <Badge 
                                    key={capability}
                                    variant="secondary" 
                                    className="text-xs px-1 py-0"
                                  >
                                    {capability}
                                  </Badge>
                                ))}
                              </div>
                              
                              {/* Pricing */}
                              <div className="text-xs text-muted-foreground">
                                Input: ${model.inputCost}/1K tokens • Output: ${model.outputCost}/1K tokens
                              </div>
                            </div>
                            
                            <div className={`w-2 h-2 rounded-full ${categoryData.bgColor} mt-1`} />
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="flex items-center justify-between mt-4 pt-3 border-t">
              <div className="text-xs text-muted-foreground">
                {availableModels.length} modelos disponíveis
              </div>
              <Button
                size="sm"
                onClick={() => setIsOpen(false)}
                className="text-xs h-6"
              >
                Fechar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}