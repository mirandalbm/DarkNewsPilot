import { useState, useRef, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Terminal as TerminalIcon, 
  Play, 
  Square, 
  Trash2, 
  Copy,
  ChevronRight,
  Check,
  X,
  Loader2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { apiRequest } from "@/lib/queryClient";

interface TerminalOutput {
  id: string;
  command: string;
  exitCode: number | null;
  stdout: string;
  stderr: string;
  workingDirectory: string;
  timestamp: Date;
  isRunning: boolean;
}

export function Terminal() {
  const [history, setHistory] = useState<TerminalOutput[]>([]);
  const [currentCommand, setCurrentCommand] = useState("");
  const [workingDirectory, setWorkingDirectory] = useState(".");
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Execute command mutation
  const executeMutation = useMutation({
    mutationFn: async (data: { command: string; workingDirectory: string }) => {
      const response = await apiRequest("POST", "/api/cline/terminal/execute", data);
      return response.json();
    },
    onMutate: (variables) => {
      const tempOutput: TerminalOutput = {
        id: `temp-${Date.now()}`,
        command: variables.command,
        exitCode: null,
        stdout: "",
        stderr: "",
        workingDirectory: variables.workingDirectory,
        timestamp: new Date(),
        isRunning: true
      };
      setHistory(prev => [...prev, tempOutput]);
      return { tempId: tempOutput.id };
    },
    onSuccess: (data, variables, context) => {
      setHistory(prev => prev.map(item => 
        item.id === context?.tempId 
          ? {
              ...item,
              ...data,
              id: `cmd-${Date.now()}`,
              timestamp: new Date(),
              isRunning: false
            }
          : item
      ));
      
      // Add to command history
      if (!commandHistory.includes(variables.command)) {
        setCommandHistory(prev => [variables.command, ...prev.slice(0, 49)]);
      }
      setHistoryIndex(-1);
    },
    onError: (error: any, variables, context) => {
      setHistory(prev => prev.filter(item => item.id !== context?.tempId));
      toast({
        title: "Erro de execução",
        description: error.message || "Falha ao executar comando",
        variant: "destructive",
      });
    }
  });

  const handleExecute = () => {
    if (!currentCommand.trim() || executeMutation.isPending) return;

    executeMutation.mutate({
      command: currentCommand,
      workingDirectory
    });
    setCurrentCommand("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleExecute();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setCurrentCommand(commandHistory[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setCurrentCommand(commandHistory[newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setCurrentCommand("");
      }
    }
  };

  const copyOutput = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
      toast({
        title: "Copiado!",
        description: "Output copiado para a área de transferência",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao copiar output",
        variant: "destructive",
      });
    }
  };

  const clearTerminal = () => {
    setHistory([]);
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  const getStatusColor = (exitCode: number | null, isRunning: boolean) => {
    if (isRunning) return "text-yellow-500";
    if (exitCode === 0) return "text-green-500";
    return "text-red-500";
  };

  const getStatusIcon = (exitCode: number | null, isRunning: boolean) => {
    if (isRunning) return <Loader2 className="h-3 w-3 animate-spin" />;
    if (exitCode === 0) return <Check className="h-3 w-3" />;
    return <X className="h-3 w-3" />;
  };

  return (
    <div className="h-full flex flex-col bg-black/95 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="p-3 border-b border-gray-700 bg-gray-900">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <TerminalIcon className="h-4 w-4 text-green-400" />
            <span className="font-semibold text-sm text-white">Terminal</span>
            <Badge variant="outline" className="text-xs border-gray-600 text-gray-300">
              bash
            </Badge>
          </div>
          
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={clearTerminal}
              className="h-6 w-6 p-0 text-gray-400 hover:text-white"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
        
        <div className="mt-2 text-xs text-gray-400">
          <span className="text-green-400">~/</span>{workingDirectory}
        </div>
      </div>

      {/* Terminal Output */}
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4 font-mono text-sm">
          {history.map((output) => (
            <div key={output.id} className="group">
              {/* Command Header */}
              <div className="flex items-center space-x-2 mb-2">
                <div className={cn(
                  "flex items-center space-x-1",
                  getStatusColor(output.exitCode, output.isRunning)
                )}>
                  {getStatusIcon(output.exitCode, output.isRunning)}
                  <ChevronRight className="h-3 w-3 text-gray-500" />
                </div>
                <span className="text-green-400">$</span>
                <span className="text-white flex-1">{output.command}</span>
                <span className="text-xs text-gray-500">
                  {output.timestamp.toLocaleTimeString('pt-BR', { 
                    hour: '2-digit', 
                    minute: '2-digit',
                    second: '2-digit'
                  })}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-5 w-5 p-0 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-white"
                  onClick={() => copyOutput(output.stdout + output.stderr, output.id)}
                >
                  {copiedId === output.id ? (
                    <Check className="h-3 w-3" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                </Button>
              </div>

              {/* Output */}
              {output.stdout && (
                <div className="bg-gray-900/50 rounded p-2 mb-2">
                  <pre className="text-gray-200 whitespace-pre-wrap break-words">
                    {output.stdout}
                  </pre>
                </div>
              )}

              {/* Error Output */}
              {output.stderr && (
                <div className="bg-red-900/20 border border-red-700/30 rounded p-2 mb-2">
                  <pre className="text-red-300 whitespace-pre-wrap break-words">
                    {output.stderr}
                  </pre>
                </div>
              )}

              {/* Exit Code */}
              {output.exitCode !== null && !output.isRunning && (
                <div className="text-xs text-gray-500 mb-2">
                  Processo finalizado com código: {output.exitCode}
                </div>
              )}
            </div>
          ))}
          
          {history.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <TerminalIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Terminal pronto para comandos</p>
              <p className="text-xs mt-1">Digite comandos como: npm run dev, git status, ls -la</p>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Command Input */}
      <div className="p-3 border-t border-gray-700 bg-gray-900">
        <div className="flex items-center space-x-2">
          <span className="text-green-400 font-mono text-sm">$</span>
          <Input
            ref={inputRef}
            value={currentCommand}
            onChange={(e) => setCurrentCommand(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Digite um comando..."
            disabled={executeMutation.isPending}
            className="flex-1 bg-transparent border-0 text-white font-mono text-sm focus:ring-0 focus:ring-offset-0"
          />
          <Button
            onClick={handleExecute}
            disabled={executeMutation.isPending || !currentCommand.trim()}
            size="sm"
            className="px-3 h-7"
          >
            {executeMutation.isPending ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <Play className="h-3 w-3" />
            )}
          </Button>
        </div>
        
        <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
          <span>Use ↑↓ para navegar no histórico</span>
          <span>{commandHistory.length} comandos no histórico</span>
        </div>
      </div>
    </div>
  );
}