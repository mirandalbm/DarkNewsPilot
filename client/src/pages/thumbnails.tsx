import { useState, useEffect } from 'react';
import { useAuth } from "@/hooks/useAuth";
import ProfessionalSidebar from "@/components/layout/professional-sidebar";
import ProfessionalHeader from "@/components/layout/professional-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  ImageIcon, 
  Wand2, 
  Download, 
  Copy, 
  Palette, 
  Type,
  Layers,
  Sparkles,
  Settings
} from 'lucide-react';

interface ThumbnailTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  preview: string;
}

const thumbnailTemplates: ThumbnailTemplate[] = [
  {
    id: 'dark-mystery',
    name: 'Dark Mystery',
    category: 'Notícias',
    description: 'Estilo sombrio para notícias misteriosas',
    preview: 'bg-gradient-to-br from-red-900 to-black'
  },
  {
    id: 'breaking-news',
    name: 'Breaking News',
    category: 'Urgente',
    description: 'Design impactante para notícias urgentes',
    preview: 'bg-gradient-to-br from-red-600 to-orange-500'
  },
  {
    id: 'investigation',
    name: 'Investigação',
    category: 'Análise',
    description: 'Layout profissional para investigações',
    preview: 'bg-gradient-to-br from-blue-800 to-gray-900'
  },
  {
    id: 'conspiracy',
    name: 'Conspiração',
    category: 'Mistério',
    description: 'Visual intrigante para teorias',
    preview: 'bg-gradient-to-br from-purple-800 to-black'
  }
];

export default function ThumbnailGenerator() {
  const { isAuthenticated, isLoading } = useAuth();
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [textStyle, setTextStyle] = useState('bold');
  const [colorScheme, setColorScheme] = useState('dark');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedThumbnails, setGeneratedThumbnails] = useState<string[]>([]);
  const { toast } = useToast();

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      window.location.href = '/';
    }
  }, [isAuthenticated, isLoading]);

  const handleGenerate = async () => {
    if (!title.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, insira um título para gerar a thumbnail",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    try {
      // Simular geração de thumbnails
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockThumbnails = [
        `data:image/svg+xml;base64,${btoa(`<svg width="1280" height="720" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#dc2626;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#000000;stop-opacity:1" />
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#grad1)"/>
          <text x="640" y="300" font-family="Arial Black, sans-serif" font-size="72" fill="white" text-anchor="middle" font-weight="bold">${title}</text>
          ${subtitle ? `<text x="640" y="420" font-family="Arial, sans-serif" font-size="36" fill="#cccccc" text-anchor="middle">${subtitle}</text>` : ''}
          <circle cx="100" cy="100" r="30" fill="#ff0000"/>
          <text x="100" y="110" font-family="Arial Black, sans-serif" font-size="20" fill="white" text-anchor="middle">NOVO</text>
        </svg>`)}`,
        `data:image/svg+xml;base64,${btoa(`<svg width="1280" height="720" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#7c2d12;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#1f2937;stop-opacity:1" />
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#grad2)"/>
          <rect x="50" y="50" width="1180" height="620" fill="none" stroke="#dc2626" stroke-width="8"/>
          <text x="640" y="320" font-family="Arial Black, sans-serif" font-size="64" fill="#ffffff" text-anchor="middle" font-weight="bold">${title}</text>
          ${subtitle ? `<text x="640" y="420" font-family="Arial, sans-serif" font-size="32" fill="#fbbf24" text-anchor="middle">${subtitle}</text>` : ''}
          <polygon points="1150,50 1230,50 1200,130" fill="#dc2626"/>
        </svg>`)}`
      ];
      
      setGeneratedThumbnails(mockThumbnails);
      toast({
        title: "Sucesso!",
        description: "Thumbnails geradas com sucesso"
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao gerar thumbnails",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadThumbnail = (thumbnailData: string, index: number) => {
    const link = document.createElement('a');
    link.href = thumbnailData;
    link.download = `thumbnail-${title.replace(/\s+/g, '-').toLowerCase()}-${index + 1}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Download iniciado",
      description: "Thumbnail baixada com sucesso"
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-[100dvh] bg-gray-900 flex items-center justify-center safe-bottom">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container bg-background">
      <ProfessionalSidebar />
      <div className="responsive-container">
        <ProfessionalHeader />
        <main className="flex-1 overflow-y-auto space-y-4 p-4 sm:p-6 w-full safe-bottom">
          {/* Header */}
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
              <ImageIcon className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold" data-testid="page-title">Gerador de Thumbnails</h1>
              <p className="text-muted-foreground">Crie thumbnails profissionais automaticamente</p>
            </div>
          </div>

        <Tabs defaultValue="quick" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="quick">Geração Rápida</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="advanced">Avançado</TabsTrigger>
          </TabsList>

          {/* Geração Rápida */}
          <TabsContent value="quick" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Wand2 className="h-5 w-5" />
                    <span>Configurações</span>
                  </CardTitle>
                  <CardDescription>
                    Configure o texto e estilo da sua thumbnail
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Título Principal</Label>
                    <Input
                      id="title"
                      placeholder="Ex: MISTÉRIO RESOLVIDO!"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      data-testid="input-title"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subtitle">Subtítulo (Opcional)</Label>
                    <Input
                      id="subtitle"
                      placeholder="Ex: A verdade por trás do caso"
                      value={subtitle}
                      onChange={(e) => setSubtitle(e.target.value)}
                      data-testid="input-subtitle"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Estilo do Texto</Label>
                      <Select value={textStyle} onValueChange={setTextStyle}>
                        <SelectTrigger data-testid="select-text-style">
                          <SelectValue placeholder="Escolha o estilo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="bold">Negrito</SelectItem>
                          <SelectItem value="outline">Contorno</SelectItem>
                          <SelectItem value="shadow">Sombra</SelectItem>
                          <SelectItem value="neon">Neon</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Esquema de Cores</Label>
                      <Select value={colorScheme} onValueChange={setColorScheme}>
                        <SelectTrigger data-testid="select-color-scheme">
                          <SelectValue placeholder="Escolha as cores" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="dark">Escuro</SelectItem>
                          <SelectItem value="fire">Fogo</SelectItem>
                          <SelectItem value="ice">Gelo</SelectItem>
                          <SelectItem value="electric">Elétrico</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Button 
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="w-full"
                    data-testid="button-generate"
                  >
                    {isGenerating ? (
                      <>
                        <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                        Gerando...
                      </>
                    ) : (
                      <>
                        <Wand2 className="h-4 w-4 mr-2" />
                        Gerar Thumbnails
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Preview */}
              <Card>
                <CardHeader>
                  <CardTitle>Resultados</CardTitle>
                  <CardDescription>
                    Suas thumbnails geradas aparecerão aqui
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {generatedThumbnails.length > 0 ? (
                    <div className="space-y-4">
                      {generatedThumbnails.map((thumbnail, index) => (
                        <div key={index} className="relative group">
                          <img 
                            src={thumbnail} 
                            alt={`Thumbnail ${index + 1}`}
                            className="w-full rounded-lg border-2 border-border"
                            data-testid={`thumbnail-${index}`}
                          />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center space-x-2">
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => downloadThumbnail(thumbnail, index)}
                              data-testid={`button-download-${index}`}
                            >
                              <Download className="h-4 w-4 mr-1" />
                              Download
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      <ImageIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Configure o título e clique em "Gerar Thumbnails"</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Templates */}
          <TabsContent value="templates" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {thumbnailTemplates.map((template) => (
                <Card 
                  key={template.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedTemplate === template.id ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setSelectedTemplate(template.id)}
                  data-testid={`template-${template.id}`}
                >
                  <CardContent className="p-4 space-y-3">
                    <div className={`w-full h-24 rounded-lg ${template.preview}`}></div>
                    <div>
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">{template.name}</h3>
                        <Badge variant="secondary" className="text-xs">
                          {template.category}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {template.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Avançado */}
          <TabsContent value="advanced" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="h-5 w-5" />
                  <span>Configurações Avançadas</span>
                </CardTitle>
                <CardDescription>
                  Controle total sobre a geração de thumbnails
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium flex items-center space-x-2">
                      <Type className="h-4 w-4" />
                      <span>Tipografia</span>
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <Label>Fonte Principal</Label>
                        <Select defaultValue="arial-black">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="arial-black">Arial Black</SelectItem>
                            <SelectItem value="roboto">Roboto</SelectItem>
                            <SelectItem value="montserrat">Montserrat</SelectItem>
                            <SelectItem value="impact">Impact</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Tamanho da Fonte</Label>
                        <Select defaultValue="large">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="small">Pequeno</SelectItem>
                            <SelectItem value="medium">Médio</SelectItem>
                            <SelectItem value="large">Grande</SelectItem>
                            <SelectItem value="xlarge">Extra Grande</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium flex items-center space-x-2">
                      <Palette className="h-4 w-4" />
                      <span>Cores</span>
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <Label>Cor do Texto</Label>
                        <div className="flex space-x-2 mt-1">
                          <div className="w-8 h-8 bg-white border-2 border-border rounded cursor-pointer"></div>
                          <div className="w-8 h-8 bg-red-500 border-2 border-border rounded cursor-pointer"></div>
                          <div className="w-8 h-8 bg-yellow-400 border-2 border-border rounded cursor-pointer"></div>
                          <div className="w-8 h-8 bg-blue-500 border-2 border-border rounded cursor-pointer"></div>
                        </div>
                      </div>
                      <div>
                        <Label>Cor de Fundo</Label>
                        <div className="flex space-x-2 mt-1">
                          <div className="w-8 h-8 bg-gradient-to-br from-red-900 to-black border-2 border-border rounded cursor-pointer"></div>
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-800 to-gray-900 border-2 border-border rounded cursor-pointer"></div>
                          <div className="w-8 h-8 bg-gradient-to-br from-purple-800 to-black border-2 border-border rounded cursor-pointer"></div>
                          <div className="w-8 h-8 bg-gradient-to-br from-green-800 to-black border-2 border-border rounded cursor-pointer"></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium flex items-center space-x-2">
                      <Layers className="h-4 w-4" />
                      <span>Efeitos</span>
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <Label>Adição de Elementos</Label>
                        <div className="space-y-2">
                          <label className="flex items-center space-x-2">
                            <input type="checkbox" className="rounded" />
                            <span className="text-sm">Seta "NOVO"</span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input type="checkbox" className="rounded" />
                            <span className="text-sm">Bordas Decorativas</span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input type="checkbox" className="rounded" />
                            <span className="text-sm">Efeito de Brilho</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <Button className="w-full" data-testid="button-generate-advanced">
                  <Wand2 className="h-4 w-4 mr-2" />
                  Gerar com Configurações Avançadas
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        </main>
      </div>
    </div>
  );
}