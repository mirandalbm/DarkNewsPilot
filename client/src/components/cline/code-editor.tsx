import { useState, useEffect, useRef } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Save, 
  Undo, 
  FileText, 
  Clock, 
  GitBranch,
  History,
  AlertCircle,
  Check
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { apiRequest } from "@/lib/queryClient";

interface CodeEditorProps {
  filePath?: string;
  onClose?: () => void;
}

interface FileContent {
  content: string;
  size: number;
  lastModified: string;
  encoding: string;
}

export function CodeEditor({ filePath, onClose }: CodeEditorProps) {
  const [content, setContent] = useState("");
  const [originalContent, setOriginalContent] = useState("");
  const [hasChanges, setHasChanges] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch file content
  const { data: fileData, isLoading } = useQuery<FileContent>({
    queryKey: ["/api/cline/files/content", filePath],
    enabled: !!filePath,
  });

  // Save file mutation
  const saveMutation = useMutation({
    mutationFn: async (data: { path: string; content: string; backup?: boolean }) => {
      const response = await apiRequest("POST", "/api/cline/files/write", data);
      return response.json();
    },
    onSuccess: () => {
      setOriginalContent(content);
      setHasChanges(false);
      queryClient.invalidateQueries({ queryKey: ["/api/cline/files/tree"] });
      queryClient.invalidateQueries({ queryKey: ["/api/cline/files/content", filePath] });
      toast({
        title: "Sucesso",
        description: "Arquivo salvo com sucesso",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao salvar",
        description: error.message || "Falha ao salvar arquivo",
        variant: "destructive",
      });
    }
  });

  // Git diff query
  const { data: gitDiff } = useQuery<{ diff: string }>({
    queryKey: ["/api/cline/git/diff", filePath],
    enabled: !!filePath && hasChanges,
    refetchInterval: hasChanges ? 5000 : false,
  });

  useEffect(() => {
    if (fileData?.content) {
      setContent(fileData.content);
      setOriginalContent(fileData.content);
      setHasChanges(false);
    }
  }, [fileData]);

  useEffect(() => {
    setHasChanges(content !== originalContent);
  }, [content, originalContent]);

  const handleSave = () => {
    if (!filePath || !hasChanges) return;
    
    saveMutation.mutate({
      path: filePath,
      content,
      backup: true
    });
  };

  const handleUndo = () => {
    setContent(originalContent);
    setHasChanges(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.ctrlKey || e.metaKey) {
      if (e.key === 's') {
        e.preventDefault();
        handleSave();
      } else if (e.key === 'z') {
        e.preventDefault();
        handleUndo();
      }
    }
  };

  const getFileLanguage = (filePath: string) => {
    const ext = filePath.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'js':
      case 'jsx':
        return 'javascript';
      case 'ts':
      case 'tsx':
        return 'typescript';
      case 'json':
        return 'json';
      case 'css':
        return 'css';
      case 'html':
        return 'html';
      case 'md':
        return 'markdown';
      default:
        return 'text';
    }
  };

  const formatFileSize = (bytes: number) => {
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
  };

  const getDiffStats = (diff: string) => {
    if (!diff) return { additions: 0, deletions: 0 };
    
    const lines = diff.split('\n');
    let additions = 0;
    let deletions = 0;
    
    lines.forEach(line => {
      if (line.startsWith('+') && !line.startsWith('+++')) additions++;
      if (line.startsWith('-') && !line.startsWith('---')) deletions++;
    });
    
    return { additions, deletions };
  };

  if (!filePath) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground">
        <div className="text-center">
          <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Selecione um arquivo para editar</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  const diffStats = gitDiff ? getDiffStats(gitDiff.diff) : { additions: 0, deletions: 0 };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-3 border-b bg-muted/30">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium text-sm">{filePath.split('/').pop()}</span>
            {hasChanges && (
              <Badge variant="secondary" className="text-xs h-5">
                <AlertCircle className="h-3 w-3 mr-1" />
                Modificado
              </Badge>
            )}
          </div>
          
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleUndo}
              disabled={!hasChanges}
              className="h-7 px-2"
            >
              <Undo className="h-3 w-3 mr-1" />
              Desfazer
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={handleSave}
              disabled={!hasChanges || saveMutation.isPending}
              className="h-7 px-2"
            >
              {saveMutation.isPending ? (
                <div className="animate-spin w-3 h-3 border border-white border-t-transparent rounded-full mr-1" />
              ) : (
                <Save className="h-3 w-3 mr-1" />
              )}
              Salvar
            </Button>
            {onClose && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-7 px-2"
              >
                ×
              </Button>
            )}
          </div>
        </div>
        
        {/* File Info */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center space-x-4">
            <span>{getFileLanguage(filePath)}</span>
            {fileData && (
              <span>{formatFileSize(fileData.size)}</span>
            )}
            <div className="flex items-center space-x-1">
              <Clock className="h-3 w-3" />
              <span>
                {fileData?.lastModified 
                  ? new Date(fileData.lastModified).toLocaleTimeString('pt-BR', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })
                  : 'Não salvo'
                }
              </span>
            </div>
          </div>
          
          {hasChanges && diffStats && (diffStats.additions > 0 || diffStats.deletions > 0) && (
            <div className="flex items-center space-x-2">
              <GitBranch className="h-3 w-3" />
              <span className="text-green-600">+{diffStats.additions}</span>
              <span className="text-red-600">-{diffStats.deletions}</span>
            </div>
          )}
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 relative">
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          className={cn(
            "w-full h-full p-4 font-mono text-sm border-0 resize-none focus:outline-none",
            "bg-background text-foreground",
            "scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent"
          )}
          placeholder="Digite seu código aqui..."
          spellCheck={false}
        />
        
        {/* Line Numbers Overlay (simplified) */}
        <div className="absolute left-0 top-4 bottom-0 w-12 bg-muted/20 border-r pointer-events-none">
          <div className="p-2 text-xs text-muted-foreground font-mono">
            {content.split('\n').map((_, index) => (
              <div key={index} className="h-5 leading-5">
                {index + 1}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="p-2 border-t bg-muted/30">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center space-x-4">
            <span>Linha {content.substring(0, textareaRef.current?.selectionStart || 0).split('\n').length}</span>
            <span>Coluna {(textareaRef.current?.selectionStart || 0) - content.lastIndexOf('\n', (textareaRef.current?.selectionStart || 0) - 1)}</span>
            <span>{content.length} caracteres</span>
          </div>
          
          <div className="flex items-center space-x-2">
            {hasChanges ? (
              <div className="flex items-center space-x-1 text-yellow-600">
                <AlertCircle className="h-3 w-3" />
                <span>Não salvo</span>
              </div>
            ) : (
              <div className="flex items-center space-x-1 text-green-600">
                <Check className="h-3 w-3" />
                <span>Salvo</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}