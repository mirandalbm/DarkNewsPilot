import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Image as ImageIcon, File, Upload, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FileUploaderProps {
  onFilesSelected: (files: File[]) => void;
}

export function FileUploader({ onFilesSelected }: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    const fileArray = Array.from(files);
    const validFiles: File[] = [];
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp',
      'text/plain', 'text/markdown', 'application/json',
      'text/javascript', 'text/typescript', 'text/css', 'text/html',
      'application/pdf'
    ];

    fileArray.forEach(file => {
      if (file.size > maxSize) {
        toast({
          title: "Arquivo Muito Grande",
          description: `${file.name} excede o limite de 10MB`,
          variant: "destructive",
        });
        return;
      }

      if (!allowedTypes.includes(file.type) && !file.name.match(/\.(txt|md|js|ts|jsx|tsx|css|html|json)$/)) {
        toast({
          title: "Tipo Não Suportado",
          description: `${file.name} não é um tipo de arquivo suportado`,
          variant: "destructive",
        });
        return;
      }

      validFiles.push(file);
    });

    if (validFiles.length > 0) {
      onFilesSelected(validFiles);
      toast({
        title: "Arquivos Carregados",
        description: `${validFiles.length} arquivo${validFiles.length > 1 ? 's' : ''} selecionado${validFiles.length > 1 ? 's' : ''}`,
      });
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    handleFileSelect(files);
  };

  return (
    <div className="relative">
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".txt,.md,.js,.ts,.jsx,.tsx,.css,.html,.json,.pdf,image/*"
        onChange={(e) => handleFileSelect(e.target.files)}
        className="hidden"
        data-testid="file-input"
      />
      
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`flex items-center space-x-1 transition-colors ${
          isDragging ? 'bg-accent border-primary' : ''
        }`}
        data-testid="button-file-upload"
      >
        <ImageIcon className="h-4 w-4" />
      </Button>

      {/* Drag Overlay */}
      {isDragging && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-popover border-2 border-dashed border-primary rounded-lg p-8 text-center">
            <Upload className="h-12 w-12 mx-auto text-primary mb-4" />
            <h3 className="font-semibold text-lg mb-2">Solte os arquivos aqui</h3>
            <p className="text-muted-foreground">
              Suporte para imagens, código, texto e PDFs (máx 10MB)
            </p>
          </div>
        </div>
      )}
    </div>
  );
}