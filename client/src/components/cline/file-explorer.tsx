import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { 
  Folder, 
  FolderOpen, 
  File, 
  Plus, 
  Search, 
  MoreHorizontal,
  Edit,
  Trash2,
  Copy,
  Download,
  Clock,
  Code
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { apiRequest } from "@/lib/queryClient";

interface FileItem {
  name: string;
  path: string;
  type: 'file' | 'directory';
  size?: number;
  lastModified?: string;
  children?: FileItem[];
}

interface FileExplorerProps {
  onFileSelect?: (file: FileItem) => void;
  selectedPath?: string;
}

export function FileExplorer({ onFileSelect, selectedPath }: FileExplorerProps) {
  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(new Set(['.']));
  const [searchQuery, setSearchQuery] = useState("");
  const [createMode, setCreateMode] = useState<{ type: 'file' | 'directory'; parent: string } | null>(null);
  const [newItemName, setNewItemName] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch file tree
  const { data: fileTree, isLoading } = useQuery<FileItem[]>({
    queryKey: ["/api/cline/files/tree"],
    refetchInterval: 5000,
  });

  // Create file/folder mutation
  const createMutation = useMutation({
    mutationFn: async (data: { path: string; type: 'file' | 'directory'; content?: string }) => {
      const response = await apiRequest("POST", "/api/cline/files/create", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cline/files/tree"] });
      setCreateMode(null);
      setNewItemName("");
      toast({
        title: "Sucesso",
        description: "Item criado com sucesso",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message || "Falha ao criar item",
        variant: "destructive",
      });
    }
  });

  // Delete file/folder mutation
  const deleteMutation = useMutation({
    mutationFn: async (path: string) => {
      const response = await apiRequest("DELETE", `/api/cline/files/${encodeURIComponent(path)}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cline/files/tree"] });
      toast({
        title: "Sucesso",
        description: "Item deletado com sucesso",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message || "Falha ao deletar item",
        variant: "destructive",
      });
    }
  });

  const toggleExpanded = (path: string) => {
    const newExpanded = new Set(expandedPaths);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpandedPaths(newExpanded);
  };

  const handleCreateItem = () => {
    if (!newItemName.trim() || !createMode) return;
    
    const fullPath = createMode.parent === '.' 
      ? newItemName 
      : `${createMode.parent}/${newItemName}`;
    
    createMutation.mutate({
      path: fullPath,
      type: createMode.type,
      content: createMode.type === 'file' ? '' : undefined
    });
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '';
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
  };

  const getFileIcon = (item: FileItem) => {
    if (item.type === 'directory') {
      return expandedPaths.has(item.path) ? FolderOpen : Folder;
    }
    
    const ext = item.name.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'tsx':
      case 'ts':
      case 'js':
      case 'jsx':
        return Code;
      default:
        return File;
    }
  };

  const renderFileTree = (items: FileItem[], level = 0) => {
    return items?.map((item) => {
      const Icon = getFileIcon(item);
      const isExpanded = expandedPaths.has(item.path);
      const isSelected = item.path === selectedPath;
      
      return (
        <div key={item.path}>
          <div
            className={cn(
              "flex items-center space-x-2 py-1 px-2 hover:bg-muted/50 cursor-pointer rounded transition-colors min-w-0",
              isSelected && "bg-blue-500/20 border-l-2 border-blue-500",
              level > 0 && "ml-4"
            )}
            style={{ paddingLeft: `${Math.min(level * 16 + 8, 80)}px` }}
            onClick={() => {
              if (item.type === 'directory') {
                toggleExpanded(item.path);
              } else {
                onFileSelect?.(item);
              }
            }}
          >
            <Icon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <span className="text-sm font-medium flex-1 truncate min-w-0" title={item.name}>{item.name}</span>
            
            {item.type === 'file' && item.size && (
              <span className="text-xs text-muted-foreground flex-shrink-0 hidden sm:inline">
                {formatFileSize(item.size)}
              </span>
            )}
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 flex-shrink-0">
                  <MoreHorizontal className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" sideOffset={5}>
                <DropdownMenuItem onClick={() => onFileSelect?.(item)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setCreateMode({ type: 'file', parent: item.path })}>
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Arquivo
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setCreateMode({ type: 'directory', parent: item.path })}>
                  <Folder className="h-4 w-4 mr-2" />
                  Nova Pasta
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => deleteMutation.mutate(item.path)}
                  className="text-red-600"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Deletar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          {item.type === 'directory' && isExpanded && item.children && (
            <div>
              {renderFileTree(item.children, level + 1)}
            </div>
          )}
        </div>
      );
    });
  };

  const filteredTree = fileTree?.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.children && item.children.some(child => 
      child.name.toLowerCase().includes(searchQuery.toLowerCase())
    ))
  );

  return (
    <div className="h-full flex flex-col min-w-0 overflow-hidden">
      {/* Header */}
      <div className="p-3 border-b flex-shrink-0">
        <div className="flex items-center justify-between mb-2 min-w-0">
          <h3 className="font-semibold text-sm truncate">File Explorer</h3>
          <div className="flex space-x-1 flex-shrink-0">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={() => setCreateMode({ type: 'file', parent: '.' })}
            >
              <Plus className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={() => setCreateMode({ type: 'directory', parent: '.' })}
            >
              <Folder className="h-3 w-3" />
            </Button>
          </div>
        </div>
        
        <div className="relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-muted-foreground" />
          <Input
            placeholder="Buscar arquivos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-7 h-7 text-xs"
          />
        </div>
      </div>

      {/* Create Item Modal */}
      {createMode && (
        <div className="p-3 bg-muted/50 border-b flex-shrink-0">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 min-w-0">
              {createMode.type === 'file' ? <File className="h-4 w-4 flex-shrink-0" /> : <Folder className="h-4 w-4 flex-shrink-0" />}
              <span className="text-sm font-medium truncate">
                Criar {createMode.type === 'file' ? 'Arquivo' : 'Pasta'}
              </span>
            </div>
            <Input
              placeholder={`Nome do ${createMode.type === 'file' ? 'arquivo' : 'pasta'}...`}
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleCreateItem()}
              className="h-7 text-xs"
              autoFocus
            />
            <div className="flex space-x-1">
              <Button 
                size="sm" 
                onClick={handleCreateItem}
                disabled={!newItemName.trim() || createMutation.isPending}
                className="h-6 text-xs"
              >
                Criar
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => {
                  setCreateMode(null);
                  setNewItemName("");
                }}
                className="h-6 text-xs"
              >
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* File Tree */}
      <ScrollArea className="flex-1 min-h-0">
        <div className="p-2 min-w-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin w-4 h-4 border-2 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : (
            <div className="group min-w-0">
              {renderFileTree(filteredTree || [])}
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Footer Info */}
      <div className="p-2 border-t bg-muted/30 flex-shrink-0">
        <div className="flex items-center justify-between text-xs text-muted-foreground min-w-0">
          <span className="truncate">{fileTree?.length || 0} itens</span>
          <div className="flex items-center space-x-1 flex-shrink-0">
            <Clock className="h-3 w-3" />
            <span className="hidden sm:inline">Sincronizado</span>
          </div>
        </div>
      </div>
    </div>
  );
}