import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { 
  Search,
  TrendingUp,
  TrendingDown,
  Target,
  BarChart3,
  Settings,
  Plus,
  Edit,
  Trash2,
  RefreshCw,
  Eye,
  ExternalLink,
  Star,
  Award,
  Zap,
  Globe,
  Hash,
  ArrowUp,
  ArrowDown,
  ArrowRight,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
  HelpCircle,
  Download,
  Upload,
  FileText,
  Image,
  Video,
  Mic,
  Calendar,
  Clock,
  User,
  Users,
  Flag,
  Bookmark,
  Heart,
  ThumbsUp,
  MessageSquare,
  Share2,
  Link2,
  Copy,
  Filter,
  MoreHorizontal,
  Play,
  Pause,
  Volume2,
  Maximize,
  Tag,
  PenTool,
  Type,
  Layers,
  Grid,
  List,
  Table,
  Columns,
  Activity,
  Brain,
  Lightbulb,
  Sparkles,
  Database,
  Server,
  Wifi,
  Signal,
  Smartphone,
  Monitor,
  Tablet
} from 'lucide-react';

interface SEOAnalysis {
  id: string;
  videoId: string;
  title: string;
  currentTitle: string;
  currentDescription: string;
  currentTags: string[];
  thumbnail: string;
  createdAt: string;
  lastAnalysis: string;
  status: 'analyzing' | 'completed' | 'needs_attention' | 'optimized';
  scores: {
    overall: number;
    title: number;
    description: number;
    tags: number;
    thumbnail: number;
    engagement: number;
  };
  recommendations: Array<{
    type: 'title' | 'description' | 'tags' | 'thumbnail' | 'timing';
    priority: 'high' | 'medium' | 'low';
    message: string;
    suggestion: string;
    impact: number;
  }>;
  keywords: Array<{
    keyword: string;
    volume: number;
    difficulty: number;
    relevance: number;
    currentRank?: number;
    targetRank: number;
    competition: number;
  }>;
  competitors: Array<{
    channel: string;
    title: string;
    views: number;
    rank: number;
    score: number;
  }>;
  performance: {
    views: number;
    clickThroughRate: number;
    averageViewDuration: number;
    engagement: number;
    searchTraffic: number;
    discoverySource: {
      search: number;
      suggested: number;
      browse: number;
      external: number;
    };
  };
}

interface KeywordResearch {
  id: string;
  keyword: string;
  volume: number;
  difficulty: number;
  cpc: number;
  competition: number;
  trend: 'rising' | 'stable' | 'declining';
  relatedKeywords: string[];
  longtailSuggestions: string[];
  searchIntent: 'informational' | 'commercial' | 'navigational' | 'transactional';
  seasonality: Array<{
    month: string;
    volume: number;
  }>;
  demographics: {
    ageGroups: Array<{ range: string; percentage: number }>;
    genders: { male: number; female: number };
    locations: Array<{ country: string; percentage: number }>;
  };
}

interface SEOTemplate {
  id: string;
  name: string;
  category: 'mystery' | 'crime' | 'paranormal' | 'documentary' | 'news' | 'entertainment';
  titleFormats: string[];
  descriptionTemplate: string;
  tagSuggestions: string[];
  thumbnailGuidelines: {
    colors: string[];
    elements: string[];
    textGuidelines: string;
  };
  bestPostingTimes: Array<{
    dayOfWeek: string;
    hour: number;
    performance: number;
  }>;
  targetAudience: {
    ageRange: string;
    interests: string[];
    behavior: string;
  };
  usage: number;
  averagePerformance: {
    views: number;
    ctr: number;
    engagement: number;
  };
}

interface CompetitorAnalysis {
  id: string;
  channel: string;
  subscriber_count: number;
  avgViews: number;
  uploadFrequency: number;
  topKeywords: string[];
  contentStrategy: {
    titlePatterns: string[];
    descriptionLength: number;
    tagUsage: number;
    thumbnailStyle: string;
  };
  performance: {
    growth: number;
    engagement: number;
    searchVisibility: number;
  };
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  recentUploads: Array<{
    title: string;
    views: number;
    published: string;
    rank: number;
  }>;
}

interface RankingMonitor {
  id: string;
  keyword: string;
  videoId: string;
  videoTitle: string;
  currentRank: number;
  previousRank?: number;
  targetRank: number;
  searchVolume: number;
  lastCheck: string;
  history: Array<{
    date: string;
    rank: number;
    views: number;
  }>;
  alerts: Array<{
    type: 'rank_drop' | 'rank_improvement' | 'target_reached' | 'high_competition';
    message: string;
    timestamp: string;
  }>;
}

const mockSEOAnalyses: SEOAnalysis[] = [
  {
    id: 'seo_001',
    videoId: 'video_001',
    title: 'Mistérios da Noite - O Caso do Desaparecimento',
    currentTitle: 'Mistérios da Noite - O Caso do Desaparecimento',
    currentDescription: 'Investigamos um dos casos mais intrigantes de desaparecimento...',
    currentTags: ['mistério', 'crime', 'investigação', 'desaparecimento'],
    thumbnail: '/thumbnails/misterios_001.jpg',
    createdAt: '2024-03-08',
    lastAnalysis: '2024-03-08 14:30:00',
    status: 'needs_attention',
    scores: {
      overall: 72,
      title: 68,
      description: 75,
      tags: 70,
      thumbnail: 85,
      engagement: 65
    },
    recommendations: [
      {
        type: 'title',
        priority: 'high',
        message: 'Título muito genérico, adicione elementos específicos',
        suggestion: 'MISTÉRIO REAL: O Desaparecimento Que Chocou o Brasil | Caso Não Resolvido',
        impact: 85
      },
      {
        type: 'description',
        priority: 'medium',
        message: 'Descrição muito curta, expanda com mais detalhes',
        suggestion: 'Adicione timestamps, fontes e call-to-action',
        impact: 70
      },
      {
        type: 'tags',
        priority: 'medium',
        message: 'Adicione tags de alta busca relacionadas',
        suggestion: 'crime real, caso não resolvido, brasil, mistério, investigação criminal',
        impact: 65
      }
    ],
    keywords: [
      { keyword: 'mistério real', volume: 89000, difficulty: 45, relevance: 95, currentRank: 15, targetRank: 5, competition: 0.7 },
      { keyword: 'caso não resolvido', volume: 67000, difficulty: 38, relevance: 92, currentRank: 22, targetRank: 8, competition: 0.6 },
      { keyword: 'crime verdadeiro', volume: 125000, difficulty: 52, relevance: 88, targetRank: 10, competition: 0.8 }
    ],
    competitors: [
      { channel: 'Canal Mistério', title: 'O Caso Mais Bizarro do Brasil', views: 1250000, rank: 3, score: 92 },
      { channel: 'Crimes Reais', title: 'Desaparecimento Inexplicável', views: 890000, rank: 7, score: 87 },
      { channel: 'Investigação BR', title: 'Mistério Nunca Resolvido', views: 670000, rank: 12, score: 83 }
    ],
    performance: {
      views: 45600,
      clickThroughRate: 4.2,
      averageViewDuration: 8.5,
      engagement: 6.8,
      searchTraffic: 32,
      discoverySource: {
        search: 32,
        suggested: 28,
        browse: 25,
        external: 15
      }
    }
  },
  {
    id: 'seo_002',
    videoId: 'video_002',
    title: 'Lendas Urbanas - A Verdade Por Trás do Mito',
    currentTitle: 'Lendas Urbanas - A Verdade Por Trás do Mito',
    currentDescription: 'Exploramos as lendas urbanas mais famosas e revelamos a verdade...',
    currentTags: ['lenda urbana', 'mito', 'folclore', 'brasil'],
    thumbnail: '/thumbnails/lendas_001.jpg',
    createdAt: '2024-03-07',
    lastAnalysis: '2024-03-07 16:20:00',
    status: 'optimized',
    scores: {
      overall: 89,
      title: 92,
      description: 88,
      tags: 85,
      thumbnail: 91,
      engagement: 87
    },
    recommendations: [
      {
        type: 'timing',
        priority: 'low',
        message: 'Considere postar às 20h para maior alcance',
        suggestion: 'Análise mostra maior engajamento neste horário',
        impact: 15
      }
    ],
    keywords: [
      { keyword: 'lendas urbanas brasileiras', volume: 156000, difficulty: 41, relevance: 98, currentRank: 4, targetRank: 3, competition: 0.5 },
      { keyword: 'mitos e lendas', volume: 234000, difficulty: 48, relevance: 94, currentRank: 8, targetRank: 5, competition: 0.6 },
      { keyword: 'folclore brasileiro', volume: 78000, difficulty: 35, relevance: 90, currentRank: 6, targetRank: 4, competition: 0.4 }
    ],
    competitors: [
      { channel: 'Folclore BR', title: 'Lendas que Aterrorizaram Gerações', views: 2100000, rank: 1, score: 96 },
      { channel: 'Mitos e Verdades', title: 'A Real História das Lendas', views: 1800000, rank: 2, score: 94 }
    ],
    performance: {
      views: 187000,
      clickThroughRate: 8.7,
      averageViewDuration: 12.3,
      engagement: 11.2,
      searchTraffic: 68,
      discoverySource: {
        search: 68,
        suggested: 18,
        browse: 10,
        external: 4
      }
    }
  }
];

const mockKeywordResearch: KeywordResearch[] = [
  {
    id: 'kw_001',
    keyword: 'mistério real',
    volume: 89000,
    difficulty: 45,
    cpc: 0.35,
    competition: 0.7,
    trend: 'rising',
    relatedKeywords: ['crime real', 'caso verdadeiro', 'investigação criminal', 'mistério brasileiro'],
    longtailSuggestions: [
      'mistério real não resolvido',
      'mistério real brasileiro',
      'mistério real casos famosos',
      'mistério real documentário'
    ],
    searchIntent: 'informational',
    seasonality: [
      { month: 'Jan', volume: 92000 },
      { month: 'Fev', volume: 88000 },
      { month: 'Mar', volume: 89000 },
      { month: 'Abr', volume: 85000 },
      { month: 'Mai', volume: 87000 },
      { month: 'Jun', volume: 91000 }
    ],
    demographics: {
      ageGroups: [
        { range: '18-24', percentage: 25 },
        { range: '25-34', percentage: 35 },
        { range: '35-44', percentage: 22 },
        { range: '45-54', percentage: 18 }
      ],
      genders: { male: 48, female: 52 },
      locations: [
        { country: 'Brasil', percentage: 78 },
        { country: 'Portugal', percentage: 12 },
        { country: 'Angola', percentage: 5 },
        { country: 'Outros', percentage: 5 }
      ]
    }
  },
  {
    id: 'kw_002',
    keyword: 'paranormal brasil',
    volume: 134000,
    difficulty: 52,
    cpc: 0.28,
    competition: 0.8,
    trend: 'stable',
    relatedKeywords: ['sobrenatural', 'fantasma', 'assombração', 'atividade paranormal'],
    longtailSuggestions: [
      'paranormal brasil casos reais',
      'paranormal brasil documentário',
      'paranormal brasil investigação',
      'paranormal brasil histórias'
    ],
    searchIntent: 'informational',
    seasonality: [
      { month: 'Jan', volume: 128000 },
      { month: 'Fev', volume: 131000 },
      { month: 'Mar', volume: 134000 },
      { month: 'Abr', volume: 136000 },
      { month: 'Mai', volume: 138000 },
      { month: 'Jun', volume: 140000 }
    ],
    demographics: {
      ageGroups: [
        { range: '18-24', percentage: 30 },
        { range: '25-34', percentage: 28 },
        { range: '35-44', percentage: 25 },
        { range: '45-54', percentage: 17 }
      ],
      genders: { male: 44, female: 56 },
      locations: [
        { country: 'Brasil', percentage: 82 },
        { country: 'Portugal', percentage: 10 },
        { country: 'Outros', percentage: 8 }
      ]
    }
  }
];

const mockSEOTemplates: SEOTemplate[] = [
  {
    id: 'template_001',
    name: 'Mistério Real',
    category: 'mystery',
    titleFormats: [
      'MISTÉRIO REAL: [Título] | Caso Não Resolvido',
      '[Local]: O Mistério Que Chocou o Brasil',
      'CASO REAL: [Título] - A Verdade Nunca Contada',
      'INVESTIGAÇÃO: [Título] | O Que Realmente Aconteceu?'
    ],
    descriptionTemplate: `🔍 INVESTIGAÇÃO COMPLETA: [Resumo do caso]

📍 LOCAL: [Onde aconteceu]
📅 QUANDO: [Data dos eventos]
🎯 MISTÉRIO: [O que não foi explicado]

⏰ TIMELINE:
00:00 - Introdução
02:30 - Os Fatos
08:15 - Investigação
15:20 - Teorias
20:45 - Conclusão

📚 FONTES: [Links e referências]

💬 O que você acha que aconteceu? Deixe sua teoria nos comentários!

🔔 INSCREVA-SE para mais mistérios reais: [Link do canal]

#MistérioReal #CrimeVerdadeiro #CasoNãoResolvido #Brasil`,
    tagSuggestions: [
      'mistério real',
      'crime verdadeiro',
      'caso não resolvido',
      'investigação criminal',
      'brasil',
      'documentário',
      'true crime'
    ],
    thumbnailGuidelines: {
      colors: ['#FF0000', '#000000', '#FFFF00'],
      elements: ['Texto em destaque', 'Imagem dramática', 'Símbolos de mistério'],
      textGuidelines: 'Máximo 6 palavras, fonte bold, contraste alto'
    },
    bestPostingTimes: [
      { dayOfWeek: 'Terça', hour: 20, performance: 95 },
      { dayOfWeek: 'Quinta', hour: 19, performance: 92 },
      { dayOfWeek: 'Domingo', hour: 21, performance: 88 }
    ],
    targetAudience: {
      ageRange: '25-45',
      interests: ['crime', 'mistério', 'documentários', 'investigação'],
      behavior: 'Assiste vídeos longos, alta taxa de engajamento'
    },
    usage: 45,
    averagePerformance: {
      views: 125000,
      ctr: 7.8,
      engagement: 9.2
    }
  },
  {
    id: 'template_002',
    name: 'Lendas e Folclore',
    category: 'paranormal',
    titleFormats: [
      'LENDA REAL: [Nome] - A História Que Poucos Conhecem',
      '[Local]: A Lenda Que Aterrorizou Gerações',
      'FOLCLORE BRASILEIRO: [Nome] | Mito ou Realidade?',
      'A VERDADE sobre [Lenda] | Investigação Completa'
    ],
    descriptionTemplate: `🌟 LENDA BRASILEIRA: [Nome da lenda]

🏛️ ORIGEM: [Onde surgiu a lenda]
📖 HISTÓRIA: [Resumo da lenda]
🤔 REALIDADE: [O que é verdade e o que é mito]

⏰ CAPÍTULOS:
00:00 - A Lenda
03:45 - Origens Históricas
09:20 - Casos Relatados
14:30 - Análise Científica
18:15 - Conclusão

📚 PESQUISA: [Fontes utilizadas]

💭 Você já teve alguma experiência com esta lenda? Conte nos comentários!

🔔 INSCREVA-SE para mais lendas brasileiras: [Link do canal]

#LendasBrasileiras #Folclore #MitoOuRealidade #CulturaBrasileira`,
    tagSuggestions: [
      'lendas brasileiras',
      'folclore',
      'mito',
      'cultura brasileira',
      'sobrenatural',
      'tradição',
      'história'
    ],
    thumbnailGuidelines: {
      colors: ['#8B4513', '#228B22', '#FFD700'],
      elements: ['Elemento folclórico', 'Paisagem brasileira', 'Texto místico'],
      textGuidelines: 'Fonte ornamentada, cores terrosas, elementos visuais tradicionais'
    },
    bestPostingTimes: [
      { dayOfWeek: 'Sábado', hour: 19, performance: 94 },
      { dayOfWeek: 'Domingo', hour: 20, performance: 91 },
      { dayOfWeek: 'Sexta', hour: 22, performance: 87 }
    ],
    targetAudience: {
      ageRange: '20-50',
      interests: ['cultura', 'história', 'folclore', 'tradições'],
      behavior: 'Interesse em conteúdo educativo e cultural'
    },
    usage: 32,
    averagePerformance: {
      views: 98000,
      ctr: 6.5,
      engagement: 8.7
    }
  }
];

const mockCompetitorAnalyses: CompetitorAnalysis[] = [
  {
    id: 'comp_001',
    channel: 'Canal Mistério',
    subscriber_count: 1250000,
    avgViews: 450000,
    uploadFrequency: 3, // por semana
    topKeywords: ['mistério', 'crime real', 'investigação', 'caso não resolvido'],
    contentStrategy: {
      titlePatterns: ['MISTÉRIO:', 'CASO REAL:', 'INVESTIGAÇÃO:'],
      descriptionLength: 800,
      tagUsage: 12,
      thumbnailStyle: 'Dramático com texto em destaque'
    },
    performance: {
      growth: 15.2,
      engagement: 8.9,
      searchVisibility: 92
    },
    strengths: [
      'Alta frequência de upload',
      'Thumbnails muito atrativas',
      'Boa otimização SEO',
      'Engajamento alto'
    ],
    weaknesses: [
      'Conteúdo às vezes repetitivo',
      'Pouca diversificação de temas'
    ],
    opportunities: [
      'Explorar mais casos internacionais',
      'Criar séries temáticas',
      'Melhorar qualidade de áudio'
    ],
    recentUploads: [
      { title: 'O Mistério Que Aterrorizou São Paulo', views: 890000, published: '2024-03-07', rank: 2 },
      { title: 'Caso Real: Desaparecimento Inexplicável', views: 1200000, published: '2024-03-05', rank: 1 },
      { title: 'Investigação: O Crime Que Chocou o Brasil', views: 670000, published: '2024-03-03', rank: 4 }
    ]
  },
  {
    id: 'comp_002',
    channel: 'Lendas do Brasil',
    subscriber_count: 850000,
    avgViews: 320000,
    uploadFrequency: 2,
    topKeywords: ['lendas', 'folclore', 'brasil', 'cultura'],
    contentStrategy: {
      titlePatterns: ['LENDA:', 'FOLCLORE:', 'MITO:'],
      descriptionLength: 600,
      tagUsage: 8,
      thumbnailStyle: 'Artístico com elementos culturais'
    },
    performance: {
      growth: 12.8,
      engagement: 7.6,
      searchVisibility: 78
    },
    strengths: [
      'Nicho bem definido',
      'Qualidade visual excelente',
      'Conteúdo educativo'
    ],
    weaknesses: [
      'Baixa frequência de upload',
      'SEO pode melhorar'
    ],
    opportunities: [
      'Expandir para outros países',
      'Criar merchandise temático',
      'Parcerias com influenciadores'
    ],
    recentUploads: [
      { title: 'A Lenda do Boto-Cor-de-Rosa', views: 540000, published: '2024-03-06', rank: 3 },
      { title: 'Curupira: Mito ou Realidade?', views: 720000, published: '2024-03-01', rank: 2 }
    ]
  }
];

const mockRankingMonitors: RankingMonitor[] = [
  {
    id: 'rank_001',
    keyword: 'mistério real',
    videoId: 'video_001',
    videoTitle: 'Mistérios da Noite - O Caso do Desaparecimento',
    currentRank: 15,
    previousRank: 18,
    targetRank: 5,
    searchVolume: 89000,
    lastCheck: '2024-03-08 14:30:00',
    history: [
      { date: '2024-03-01', rank: 22, views: 1200 },
      { date: '2024-03-02', rank: 20, views: 1450 },
      { date: '2024-03-03', rank: 19, views: 1680 },
      { date: '2024-03-04', rank: 18, views: 1820 },
      { date: '2024-03-05', rank: 17, views: 1950 },
      { date: '2024-03-06', rank: 16, views: 2100 },
      { date: '2024-03-07', rank: 15, views: 2280 },
      { date: '2024-03-08', rank: 15, views: 2350 }
    ],
    alerts: [
      {
        type: 'rank_improvement',
        message: 'Subiu 3 posições na última semana',
        timestamp: '2024-03-08 14:30:00'
      }
    ]
  },
  {
    id: 'rank_002',
    keyword: 'lendas brasileiras',
    videoId: 'video_002',
    videoTitle: 'Lendas Urbanas - A Verdade Por Trás do Mito',
    currentRank: 4,
    previousRank: 6,
    targetRank: 3,
    searchVolume: 156000,
    lastCheck: '2024-03-08 16:00:00',
    history: [
      { date: '2024-03-01', rank: 8, views: 3200 },
      { date: '2024-03-02', rank: 7, views: 3650 },
      { date: '2024-03-03', rank: 6, views: 4100 },
      { date: '2024-03-04', rank: 6, views: 4300 },
      { date: '2024-03-05', rank: 5, views: 4800 },
      { date: '2024-03-06', rank: 4, views: 5200 },
      { date: '2024-03-07', rank: 4, views: 5450 },
      { date: '2024-03-08', rank: 4, views: 5680 }
    ],
    alerts: [
      {
        type: 'target_reached',
        message: 'Próximo do objetivo (posição 3)',
        timestamp: '2024-03-06 12:00:00'
      }
    ]
  }
];

export default function SEOOptimization() {
  const [selectedTab, setSelectedTab] = useState('analysis');
  const [analysisFilter, setAnalysisFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showTemplateDialog, setShowTemplateDialog] = useState(false);
  const [showKeywordDialog, setShowKeywordDialog] = useState(false);
  const { toast } = useToast();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'optimized': return 'text-green-500 bg-green-100 dark:bg-green-950';
      case 'needs_attention': return 'text-orange-500 bg-orange-100 dark:bg-orange-950';
      case 'analyzing': return 'text-blue-500 bg-blue-100 dark:bg-blue-950';
      case 'completed': return 'text-purple-500 bg-purple-100 dark:bg-purple-950';
      default: return 'text-gray-500 bg-gray-100 dark:bg-gray-950';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-500 bg-red-100 dark:bg-red-950';
      case 'medium': return 'text-yellow-500 bg-yellow-100 dark:bg-yellow-950';
      case 'low': return 'text-green-500 bg-green-100 dark:bg-green-950';
      default: return 'text-gray-500 bg-gray-100 dark:bg-gray-950';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'rising': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'declining': return <TrendingDown className="h-4 w-4 text-red-500" />;
      case 'stable': return <ArrowRight className="h-4 w-4 text-blue-500" />;
      default: return <ArrowRight className="h-4 w-4 text-gray-500" />;
    }
  };

  const handleOptimizeVideo = (analysisId: string) => {
    toast({
      title: "Otimização iniciada",
      description: "As recomendações SEO estão sendo aplicadas",
    });
  };

  const handleAnalyzeKeyword = () => {
    toast({
      title: "Análise iniciada",
      description: "A pesquisa de palavra-chave foi iniciada",
    });
    setShowKeywordDialog(false);
  };

  const handleCreateTemplate = () => {
    toast({
      title: "Template criado",
      description: "Novo template SEO foi criado com sucesso",
    });
    setShowTemplateDialog(false);
  };

  const handleGenerateReport = () => {
    toast({
      title: "Relatório gerado",
      description: "Relatório SEO foi gerado com sucesso",
    });
  };

  const filteredAnalyses = mockSEOAnalyses.filter(analysis => {
    let matches = true;
    
    if (analysisFilter !== 'all' && analysis.status !== analysisFilter) matches = false;
    if (searchTerm && !analysis.title.toLowerCase().includes(searchTerm.toLowerCase())) matches = false;
    
    return matches;
  });

  const totalAnalyses = mockSEOAnalyses.length;
  const needsAttention = mockSEOAnalyses.filter(a => a.status === 'needs_attention').length;
  const optimized = mockSEOAnalyses.filter(a => a.status === 'optimized').length;
  const avgScore = Math.round(mockSEOAnalyses.reduce((sum, a) => sum + a.scores.overall, 0) / totalAnalyses);

  return (
    <div className="app-container">
      <div className="responsive-container">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-teal-600 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold">Otimização SEO</h1>
              <p className="text-muted-foreground text-sm sm:text-base">Análise e otimização para melhor performance nos mecanismos de busca</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <Button data-testid="button-analyze-all" className="min-h-[44px]">
              <Search className="h-4 w-4 mr-2" />
              Analisar Todos
            </Button>
            
            <Button variant="outline" data-testid="button-seo-settings" className="min-h-[44px]">
              <Settings className="h-4 w-4 mr-2" />
              Configurações
            </Button>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground">Vídeos Analisados</p>
                  <p className="text-xl sm:text-2xl font-bold">{totalAnalyses}</p>
                  <p className="text-xs text-blue-500 flex items-center mt-1">
                    <BarChart3 className="h-3 w-3 mr-1" />
                    Este mês
                  </p>
                </div>
                <BarChart3 className="h-6 w-6 sm:h-8 sm:w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground">Score Médio SEO</p>
                  <p className={`text-xl sm:text-2xl font-bold ${getScoreColor(avgScore)}`}>{avgScore}</p>
                  <p className="text-xs text-green-500 flex items-center mt-1">
                    <ArrowUp className="h-3 w-3 mr-1" />
                    +5 pontos
                  </p>
                </div>
                <Target className="h-6 w-6 sm:h-8 sm:w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground">Precisam Atenção</p>
                  <p className="text-xl sm:text-2xl font-bold">{needsAttention}</p>
                  <p className="text-xs text-orange-500 flex items-center mt-1">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    Otimizar
                  </p>
                </div>
                <AlertTriangle className="h-6 w-6 sm:h-8 sm:w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground">Otimizados</p>
                  <p className="text-xl sm:text-2xl font-bold">{optimized}</p>
                  <p className="text-xs text-green-500 flex items-center mt-1">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Performando bem
                  </p>
                </div>
                <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4 sm:space-y-6">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-1">
            <TabsTrigger value="analysis" className="text-xs sm:text-sm">Análise</TabsTrigger>
            <TabsTrigger value="keywords" className="text-xs sm:text-sm">Palavras-chave</TabsTrigger>
            <TabsTrigger value="templates" className="text-xs sm:text-sm">Templates</TabsTrigger>
            <TabsTrigger value="competitors" className="text-xs sm:text-sm">Concorrentes</TabsTrigger>
            <TabsTrigger value="ranking" className="text-xs sm:text-sm">Rankings</TabsTrigger>
            <TabsTrigger value="reports" className="text-xs sm:text-sm">Relatórios</TabsTrigger>
          </TabsList>

          {/* Análise SEO */}
          <TabsContent value="analysis" className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <h3 className="text-base sm:text-lg font-semibold">Análises SEO</h3>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar vídeos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full sm:w-64 min-h-[44px]"
                    data-testid="input-search-videos"
                  />
                </div>
                
                <Select value={analysisFilter} onValueChange={setAnalysisFilter}>
                  <SelectTrigger className="w-full sm:w-40 min-h-[44px]" data-testid="select-analysis-filter">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="optimized">Otimizados</SelectItem>
                    <SelectItem value="needs_attention">Precisam Atenção</SelectItem>
                    <SelectItem value="analyzing">Analisando</SelectItem>
                    <SelectItem value="completed">Completos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              {filteredAnalyses.map((analysis) => (
                <Card key={analysis.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4 sm:p-6">
                    <div className="space-y-4">
                      {/* Header da análise */}
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between space-y-2 sm:space-y-0">
                        <div className="space-y-2 flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                            <div className="flex items-center space-x-2">
                              <Video className="h-4 w-4" />
                              <h3 className="font-semibold text-sm sm:text-base">{analysis.title}</h3>
                            </div>
                            <Badge className={getStatusColor(analysis.status)}>
                              {analysis.status === 'optimized' ? 'Otimizado' :
                               analysis.status === 'needs_attention' ? 'Precisa Atenção' :
                               analysis.status === 'analyzing' ? 'Analisando' : 'Completo'}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs text-muted-foreground">
                            <span>Criado: {analysis.createdAt}</span>
                            <span>Última análise: {analysis.lastAnalysis}</span>
                            <span>Views: {analysis.performance.views.toLocaleString('pt-BR')}</span>
                            <span>CTR: {analysis.performance.clickThroughRate}%</span>
                          </div>
                        </div>
                        
                        <div className="text-center sm:text-right">
                          <div className={`text-xl sm:text-2xl font-bold ${getScoreColor(analysis.scores.overall)}`}>
                            {analysis.scores.overall}
                          </div>
                          <p className="text-xs text-muted-foreground">Score Geral</p>
                        </div>
                      </div>

                      {/* Scores detalhados */}
                      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 sm:gap-4">
                        <div className="text-center">
                          <div className={`text-sm sm:text-lg font-bold ${getScoreColor(analysis.scores.title)}`}>
                            {analysis.scores.title}
                          </div>
                          <p className="text-xs text-muted-foreground">Título</p>
                        </div>
                        <div className="text-center">
                          <div className={`text-sm sm:text-lg font-bold ${getScoreColor(analysis.scores.description)}`}>
                            {analysis.scores.description}
                          </div>
                          <p className="text-xs text-muted-foreground">Descrição</p>
                        </div>
                        <div className="text-center">
                          <div className={`text-sm sm:text-lg font-bold ${getScoreColor(analysis.scores.tags)}`}>
                            {analysis.scores.tags}
                          </div>
                          <p className="text-xs text-muted-foreground">Tags</p>
                        </div>
                        <div className="text-center">
                          <div className={`text-lg font-bold ${getScoreColor(analysis.scores.thumbnail)}`}>
                            {analysis.scores.thumbnail}
                          </div>
                          <p className="text-xs text-muted-foreground">Thumbnail</p>
                        </div>
                        <div className="text-center">
                          <div className={`text-lg font-bold ${getScoreColor(analysis.scores.engagement)}`}>
                            {analysis.scores.engagement}
                          </div>
                          <p className="text-xs text-muted-foreground">Engajamento</p>
                        </div>
                      </div>

                      {/* Recomendações principais */}
                      {analysis.recommendations.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium">Principais Recomendações:</h4>
                          <div className="space-y-2">
                            {analysis.recommendations.slice(0, 2).map((rec, index) => (
                              <div key={index} className="p-3 border rounded-lg">
                                <div className="flex items-start justify-between mb-2">
                                  <div className="flex items-center space-x-2">
                                    <Badge className={getPriorityColor(rec.priority)}>
                                      {rec.priority === 'high' ? 'Alta' :
                                       rec.priority === 'medium' ? 'Média' : 'Baixa'}
                                    </Badge>
                                    <span className="text-sm font-medium">{rec.type}</span>
                                  </div>
                                  <div className="text-right">
                                    <div className="text-sm font-bold text-green-600">+{rec.impact}%</div>
                                    <div className="text-xs text-muted-foreground">Impacto</div>
                                  </div>
                                </div>
                                <p className="text-sm mb-2">{rec.message}</p>
                                <div className="p-2 bg-muted/50 rounded text-xs">
                                  <strong>Sugestão:</strong> {rec.suggestion}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Top keywords */}
                      {analysis.keywords.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium">Palavras-chave Principais:</h4>
                          <div className="flex flex-wrap gap-2">
                            {analysis.keywords.slice(0, 5).map((keyword, index) => (
                              <div key={index} className="flex items-center space-x-1 p-2 bg-muted/50 rounded">
                                <span className="text-sm font-medium">{keyword.keyword}</span>
                                <Badge variant="outline" className="text-xs">
                                  {keyword.currentRank ? `#${keyword.currentRank}` : 'N/A'}
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                  {(keyword.volume / 1000).toFixed(0)}k/mês
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Performance */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-3 bg-muted/50 rounded-lg">
                        <div className="text-center">
                          <div className="text-sm font-bold">{analysis.performance.views.toLocaleString('pt-BR')}</div>
                          <div className="text-xs text-muted-foreground">Views</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm font-bold">{analysis.performance.clickThroughRate}%</div>
                          <div className="text-xs text-muted-foreground">CTR</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm font-bold">{analysis.performance.averageViewDuration}min</div>
                          <div className="text-xs text-muted-foreground">Duração Média</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm font-bold">{analysis.performance.searchTraffic}%</div>
                          <div className="text-xs text-muted-foreground">Tráfego Busca</div>
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="flex space-x-2">
                          <Button 
                            variant="default" 
                            size="sm"
                            onClick={() => handleOptimizeVideo(analysis.id)}
                            data-testid={`button-optimize-${analysis.id}`}
                          >
                            <Zap className="h-4 w-4 mr-1" />
                            Otimizar
                          </Button>
                          <Button variant="outline" size="sm" data-testid={`button-details-${analysis.id}`}>
                            <Info className="h-4 w-4 mr-1" />
                            Ver Detalhes
                          </Button>
                          <Button variant="outline" size="sm" data-testid={`button-keywords-${analysis.id}`}>
                            <Hash className="h-4 w-4 mr-1" />
                            Keywords
                          </Button>
                        </div>
                        
                        <div className="text-xs text-muted-foreground">
                          ID: {analysis.id}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Keywords */}
          <TabsContent value="keywords" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Pesquisa de Palavras-chave</h3>
              <Dialog open={showKeywordDialog} onOpenChange={setShowKeywordDialog}>
                <DialogTrigger asChild>
                  <Button data-testid="button-new-keyword-research">
                    <Plus className="h-4 w-4 mr-2" />
                    Nova Pesquisa
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Pesquisar Palavras-chave</DialogTitle>
                    <DialogDescription>
                      Encontre as melhores palavras-chave para seu conteúdo
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="keyword-input">Palavra-chave Principal</Label>
                      <Input 
                        id="keyword-input" 
                        placeholder="Ex: mistério brasileiro"
                        data-testid="input-keyword-research"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="keyword-location">Localização</Label>
                        <Select>
                          <SelectTrigger data-testid="select-keyword-location">
                            <SelectValue placeholder="País/Região" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="BR">Brasil</SelectItem>
                            <SelectItem value="PT">Portugal</SelectItem>
                            <SelectItem value="US">Estados Unidos</SelectItem>
                            <SelectItem value="global">Global</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="keyword-language">Idioma</Label>
                        <Select>
                          <SelectTrigger data-testid="select-keyword-language">
                            <SelectValue placeholder="Idioma" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pt">Português</SelectItem>
                            <SelectItem value="en">Inglês</SelectItem>
                            <SelectItem value="es">Espanhol</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="keyword-related">Palavras-chave Relacionadas (opcional)</Label>
                      <Textarea 
                        id="keyword-related" 
                        placeholder="Digite palavras relacionadas separadas por vírgula..."
                        data-testid="textarea-related-keywords"
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch data-testid="switch-include-longtail" />
                      <Label className="text-sm">Incluir sugestões de cauda longa</Label>
                    </div>

                    <Button onClick={handleAnalyzeKeyword} className="w-full" data-testid="button-analyze-keyword">
                      Analisar Palavras-chave
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="space-y-4">
              {mockKeywordResearch.map((keyword) => (
                <Card key={keyword.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {/* Header da keyword */}
                      <div className="flex items-start justify-between">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center space-x-2">
                            <Hash className="h-4 w-4" />
                            <h3 className="font-semibold">{keyword.keyword}</h3>
                            {getTrendIcon(keyword.trend)}
                            <Badge variant="outline">
                              {keyword.searchIntent === 'informational' ? 'Informacional' :
                               keyword.searchIntent === 'commercial' ? 'Comercial' :
                               keyword.searchIntent === 'navigational' ? 'Navegacional' : 'Transacional'}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      {/* Métricas principais */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-3 border rounded-lg">
                          <div className="text-lg font-bold text-blue-500">
                            {(keyword.volume / 1000).toFixed(0)}k
                          </div>
                          <p className="text-xs text-muted-foreground">Volume Mensal</p>
                        </div>
                        <div className="text-center p-3 border rounded-lg">
                          <div className={`text-lg font-bold ${keyword.difficulty < 30 ? 'text-green-500' : keyword.difficulty < 60 ? 'text-yellow-500' : 'text-red-500'}`}>
                            {keyword.difficulty}
                          </div>
                          <p className="text-xs text-muted-foreground">Dificuldade</p>
                        </div>
                        <div className="text-center p-3 border rounded-lg">
                          <div className="text-lg font-bold text-green-500">
                            R$ {keyword.cpc.toFixed(2)}
                          </div>
                          <p className="text-xs text-muted-foreground">CPC Médio</p>
                        </div>
                        <div className="text-center p-3 border rounded-lg">
                          <div className={`text-lg font-bold ${keyword.competition < 0.3 ? 'text-green-500' : keyword.competition < 0.7 ? 'text-yellow-500' : 'text-red-500'}`}>
                            {Math.round(keyword.competition * 100)}%
                          </div>
                          <p className="text-xs text-muted-foreground">Competição</p>
                        </div>
                      </div>

                      {/* Sazonalidade */}
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Tendência de Volume:</h4>
                        <div className="flex items-end space-x-1 h-20">
                          {keyword.seasonality.map((data, index) => {
                            const maxVolume = Math.max(...keyword.seasonality.map(s => s.volume));
                            const height = (data.volume / maxVolume) * 100;
                            
                            return (
                              <div key={index} className="flex-1 flex flex-col items-center">
                                <div 
                                  className="w-full bg-blue-500 rounded-t"
                                  style={{ height: `${height}%` }}
                                ></div>
                                <div className="text-xs text-muted-foreground mt-1">{data.month}</div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Palavras relacionadas */}
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Palavras-chave Relacionadas:</h4>
                        <div className="flex flex-wrap gap-1">
                          {keyword.relatedKeywords.slice(0, 8).map((related, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {related}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Sugestões longtail */}
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Sugestões de Cauda Longa:</h4>
                        <div className="space-y-1">
                          {keyword.longtailSuggestions.slice(0, 4).map((suggestion, index) => (
                            <div key={index} className="p-2 bg-muted/50 rounded text-sm">
                              {suggestion}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Demografia */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium">Faixa Etária:</h4>
                          <div className="space-y-1">
                            {keyword.demographics.ageGroups.map((age, index) => (
                              <div key={index} className="flex justify-between text-xs">
                                <span>{age.range}</span>
                                <span>{age.percentage}%</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium">Gênero:</h4>
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span>Masculino</span>
                              <span>{keyword.demographics.genders.male}%</span>
                            </div>
                            <div className="flex justify-between text-xs">
                              <span>Feminino</span>
                              <span>{keyword.demographics.genders.female}%</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium">Localização:</h4>
                          <div className="space-y-1">
                            {keyword.demographics.locations.slice(0, 3).map((loc, index) => (
                              <div key={index} className="flex justify-between text-xs">
                                <span>{loc.country}</span>
                                <span>{loc.percentage}%</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" data-testid={`button-use-keyword-${keyword.id}`}>
                            <Plus className="h-4 w-4 mr-1" />
                            Usar Keyword
                          </Button>
                          <Button variant="outline" size="sm" data-testid={`button-track-keyword-${keyword.id}`}>
                            <Eye className="h-4 w-4 mr-1" />
                            Monitorar
                          </Button>
                          <Button variant="outline" size="sm" data-testid={`button-export-keyword-${keyword.id}`}>
                            <Download className="h-4 w-4 mr-1" />
                            Exportar
                          </Button>
                        </div>
                        
                        <div className="text-xs text-muted-foreground">
                          ID: {keyword.id}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Templates */}
          <TabsContent value="templates" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Templates SEO</h3>
              <Dialog open={showTemplateDialog} onOpenChange={setShowTemplateDialog}>
                <DialogTrigger asChild>
                  <Button data-testid="button-new-template">
                    <Plus className="h-4 w-4 mr-2" />
                    Novo Template
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl">
                  <DialogHeader>
                    <DialogTitle>Criar Novo Template SEO</DialogTitle>
                    <DialogDescription>
                      Configure um template para otimização consistente
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="template-name">Nome do Template</Label>
                        <Input id="template-name" placeholder="Ex: Mistério Sobrenatural" data-testid="input-template-name" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="template-category">Categoria</Label>
                        <Select>
                          <SelectTrigger data-testid="select-template-category">
                            <SelectValue placeholder="Categoria" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="mystery">Mistério</SelectItem>
                            <SelectItem value="crime">Crime</SelectItem>
                            <SelectItem value="paranormal">Paranormal</SelectItem>
                            <SelectItem value="documentary">Documentário</SelectItem>
                            <SelectItem value="news">Notícias</SelectItem>
                            <SelectItem value="entertainment">Entretenimento</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="template-title-formats">Formatos de Título (um por linha)</Label>
                      <Textarea 
                        id="template-title-formats"
                        placeholder="MISTÉRIO: [Título] | Caso Real&#10;[Local]: O Mistério Que Chocou..."
                        rows={3}
                        data-testid="textarea-title-formats"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="template-description">Template de Descrição</Label>
                      <Textarea 
                        id="template-description"
                        placeholder="📍 LOCAL: [Onde]&#10;📅 QUANDO: [Data]&#10;🔍 MISTÉRIO: [O que aconteceu]..."
                        rows={5}
                        data-testid="textarea-description-template"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="template-tags">Tags Sugeridas (separadas por vírgula)</Label>
                      <Input 
                        id="template-tags"
                        placeholder="mistério, crime real, investigação, brasil"
                        data-testid="input-template-tags"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="template-audience-age">Público-alvo (idade)</Label>
                        <Input id="template-audience-age" placeholder="25-45" data-testid="input-audience-age" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="template-best-time">Melhor horário para postar</Label>
                        <Input id="template-best-time" placeholder="20:00" data-testid="input-best-time" />
                      </div>
                    </div>

                    <Button onClick={handleCreateTemplate} className="w-full" data-testid="button-create-template">
                      Criar Template
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mockSEOTemplates.map((template) => (
                <Card key={template.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {/* Header do template */}
                      <div className="flex items-start justify-between">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center space-x-2">
                            <PenTool className="h-4 w-4" />
                            <h3 className="font-semibold">{template.name}</h3>
                            <Badge variant="outline">{template.category}</Badge>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Usado {template.usage} vezes | Público: {template.targetAudience.ageRange}
                          </div>
                        </div>
                      </div>

                      {/* Performance média */}
                      <div className="grid grid-cols-3 gap-4 p-3 bg-muted/50 rounded-lg">
                        <div className="text-center">
                          <div className="text-sm font-bold">
                            {(template.averagePerformance.views / 1000).toFixed(0)}k
                          </div>
                          <div className="text-xs text-muted-foreground">Views Médias</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm font-bold">
                            {template.averagePerformance.ctr}%
                          </div>
                          <div className="text-xs text-muted-foreground">CTR Médio</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm font-bold">
                            {template.averagePerformance.engagement}%
                          </div>
                          <div className="text-xs text-muted-foreground">Engajamento</div>
                        </div>
                      </div>

                      {/* Formatos de título */}
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Formatos de Título:</h4>
                        <div className="space-y-1">
                          {template.titleFormats.slice(0, 2).map((format, index) => (
                            <div key={index} className="p-2 bg-muted/50 rounded text-xs font-mono">
                              {format}
                            </div>
                          ))}
                          {template.titleFormats.length > 2 && (
                            <div className="text-xs text-muted-foreground">
                              +{template.titleFormats.length - 2} mais formatos
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Tags principais */}
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Tags Principais:</h4>
                        <div className="flex flex-wrap gap-1">
                          {template.tagSuggestions.slice(0, 6).map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Diretrizes de thumbnail */}
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Thumbnail:</h4>
                        <div className="p-2 bg-muted/50 rounded text-xs">
                          <div className="mb-1">
                            <strong>Cores:</strong> {template.thumbnailGuidelines.colors.join(', ')}
                          </div>
                          <div className="mb-1">
                            <strong>Elementos:</strong> {template.thumbnailGuidelines.elements.join(', ')}
                          </div>
                          <div>
                            <strong>Texto:</strong> {template.thumbnailGuidelines.textGuidelines}
                          </div>
                        </div>
                      </div>

                      {/* Melhores horários */}
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Melhores Horários:</h4>
                        <div className="flex space-x-2">
                          {template.bestPostingTimes.slice(0, 3).map((time, index) => (
                            <div key={index} className="text-center p-2 border rounded">
                              <div className="text-xs font-medium">{time.dayOfWeek}</div>
                              <div className="text-xs">{time.hour}h</div>
                              <div className="text-xs text-green-500">{time.performance}%</div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="flex space-x-2">
                          <Button variant="default" size="sm" data-testid={`button-use-template-${template.id}`}>
                            <Zap className="h-4 w-4 mr-1" />
                            Usar Template
                          </Button>
                          <Button variant="outline" size="sm" data-testid={`button-edit-template-${template.id}`}>
                            <Edit className="h-4 w-4 mr-1" />
                            Editar
                          </Button>
                        </div>
                        
                        <div className="text-xs text-muted-foreground">
                          ID: {template.id}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Concorrentes */}
          <TabsContent value="competitors" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Análise de Concorrentes</h3>
              <Button data-testid="button-add-competitor">
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Concorrente
              </Button>
            </div>

            <div className="space-y-4">
              {mockCompetitorAnalyses.map((competitor) => (
                <Card key={competitor.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {/* Header do concorrente */}
                      <div className="flex items-start justify-between">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center space-x-2">
                            <Users className="h-4 w-4" />
                            <h3 className="font-semibold">{competitor.channel}</h3>
                            <Badge variant="outline">
                              {(competitor.subscriber_count / 1000000).toFixed(1)}M subs
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                            <span>Views médias: {(competitor.avgViews / 1000).toFixed(0)}k</span>
                            <span>Uploads: {competitor.uploadFrequency}/semana</span>
                            <span>Crescimento: {competitor.performance.growth > 0 ? '+' : ''}{competitor.performance.growth}%</span>
                          </div>
                        </div>
                      </div>

                      {/* Métricas de performance */}
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center p-3 border rounded-lg">
                          <div className={`text-lg font-bold ${competitor.performance.growth > 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {competitor.performance.growth > 0 ? '+' : ''}{competitor.performance.growth}%
                          </div>
                          <p className="text-xs text-muted-foreground">Crescimento</p>
                        </div>
                        <div className="text-center p-3 border rounded-lg">
                          <div className="text-lg font-bold text-blue-500">
                            {competitor.performance.engagement}%
                          </div>
                          <p className="text-xs text-muted-foreground">Engajamento</p>
                        </div>
                        <div className="text-center p-3 border rounded-lg">
                          <div className="text-lg font-bold text-purple-500">
                            {competitor.performance.searchVisibility}
                          </div>
                          <p className="text-xs text-muted-foreground">Visibilidade</p>
                        </div>
                      </div>

                      {/* Estratégia de conteúdo */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium">Estratégia de Títulos:</h4>
                          <div className="space-y-1">
                            {competitor.contentStrategy.titlePatterns.map((pattern, index) => (
                              <div key={index} className="p-2 bg-muted/50 rounded text-xs">
                                {pattern}
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium">Detalhes Técnicos:</h4>
                          <div className="text-xs space-y-1">
                            <div>Descrição: ~{competitor.contentStrategy.descriptionLength} caracteres</div>
                            <div>Tags: {competitor.contentStrategy.tagUsage} por vídeo</div>
                            <div>Thumbnails: {competitor.contentStrategy.thumbnailStyle}</div>
                          </div>
                        </div>
                      </div>

                      {/* Top keywords */}
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Principais Keywords:</h4>
                        <div className="flex flex-wrap gap-1">
                          {competitor.topKeywords.map((keyword, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {keyword}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* SWOT Analysis */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium text-green-600">Forças:</h4>
                          <ul className="text-xs space-y-1">
                            {competitor.strengths.map((strength, index) => (
                              <li key={index} className="flex items-start space-x-2">
                                <CheckCircle className="h-3 w-3 text-green-500 mt-0.5" />
                                <span>{strength}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium text-red-600">Fraquezas:</h4>
                          <ul className="text-xs space-y-1">
                            {competitor.weaknesses.map((weakness, index) => (
                              <li key={index} className="flex items-start space-x-2">
                                <XCircle className="h-3 w-3 text-red-500 mt-0.5" />
                                <span>{weakness}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Oportunidades */}
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-blue-600">Oportunidades Identificadas:</h4>
                        <ul className="text-xs space-y-1">
                          {competitor.opportunities.map((opportunity, index) => (
                            <li key={index} className="flex items-start space-x-2">
                              <Lightbulb className="h-3 w-3 text-blue-500 mt-0.5" />
                              <span>{opportunity}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Uploads recentes */}
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Uploads Recentes:</h4>
                        <div className="space-y-2">
                          {competitor.recentUploads.slice(0, 3).map((upload, index) => (
                            <div key={index} className="flex items-center justify-between p-2 border rounded">
                              <div className="flex-1">
                                <div className="text-sm font-medium">{upload.title}</div>
                                <div className="text-xs text-muted-foreground">{upload.published}</div>
                              </div>
                              <div className="text-right">
                                <div className="text-sm font-bold">{(upload.views / 1000).toFixed(0)}k</div>
                                <div className="text-xs">#{upload.rank}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" data-testid={`button-analyze-competitor-${competitor.id}`}>
                            <BarChart3 className="h-4 w-4 mr-1" />
                            Analisar Detalhado
                          </Button>
                          <Button variant="outline" size="sm" data-testid={`button-monitor-competitor-${competitor.id}`}>
                            <Eye className="h-4 w-4 mr-1" />
                            Monitorar
                          </Button>
                          <Button variant="outline" size="sm" data-testid={`button-compare-competitor-${competitor.id}`}>
                            <Target className="h-4 w-4 mr-1" />
                            Comparar
                          </Button>
                        </div>
                        
                        <div className="text-xs text-muted-foreground">
                          ID: {competitor.id}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Rankings */}
          <TabsContent value="ranking" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Monitoramento de Rankings</h3>
              <Button data-testid="button-add-ranking-monitor">
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Monitoramento
              </Button>
            </div>

            <div className="space-y-4">
              {mockRankingMonitors.map((monitor) => (
                <Card key={monitor.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {/* Header do monitoramento */}
                      <div className="flex items-start justify-between">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center space-x-2">
                            <Search className="h-4 w-4" />
                            <h3 className="font-semibold">{monitor.keyword}</h3>
                            <Badge variant="outline">
                              {(monitor.searchVolume / 1000).toFixed(0)}k/mês
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {monitor.videoTitle}
                          </div>
                          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                            <span>Última verificação: {monitor.lastCheck}</span>
                            <span>Objetivo: #{monitor.targetRank}</span>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="flex items-center space-x-2">
                            <div className="text-2xl font-bold">#{monitor.currentRank}</div>
                            {monitor.previousRank && (
                              <div className="flex items-center">
                                {monitor.currentRank < monitor.previousRank ? (
                                  <ArrowUp className="h-4 w-4 text-green-500" />
                                ) : monitor.currentRank > monitor.previousRank ? (
                                  <ArrowDown className="h-4 w-4 text-red-500" />
                                ) : (
                                  <ArrowRight className="h-4 w-4 text-gray-500" />
                                )}
                                <span className="text-xs text-muted-foreground">
                                  {monitor.previousRank}
                                </span>
                              </div>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">Posição Atual</p>
                        </div>
                      </div>

                      {/* Progresso para meta */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progresso para meta (#{monitor.targetRank})</span>
                          <span>
                            {Math.max(0, Math.round(((monitor.currentRank - monitor.targetRank) / monitor.currentRank) * 100))}%
                          </span>
                        </div>
                        <Progress 
                          value={Math.max(0, 100 - ((monitor.currentRank - monitor.targetRank) / monitor.currentRank) * 100)} 
                          className="w-full"
                        />
                      </div>

                      {/* Histórico de ranking */}
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Histórico de Posições:</h4>
                        <div className="flex items-end space-x-1 h-20">
                          {monitor.history.slice(-7).map((data, index) => {
                            const maxRank = Math.max(...monitor.history.map(h => h.rank));
                            const height = ((maxRank - data.rank + 1) / maxRank) * 100;
                            
                            return (
                              <div key={index} className="flex-1 flex flex-col items-center">
                                <div 
                                  className={`w-full rounded-t ${
                                    data.rank <= monitor.targetRank ? 'bg-green-500' :
                                    data.rank <= monitor.targetRank + 5 ? 'bg-yellow-500' : 'bg-red-500'
                                  }`}
                                  style={{ height: `${height}%` }}
                                ></div>
                                <div className="text-xs text-muted-foreground mt-1">
                                  {new Date(data.date).getDate()}/{new Date(data.date).getMonth() + 1}
                                </div>
                                <div className="text-xs font-medium">#{data.rank}</div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Alertas */}
                      {monitor.alerts.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium">Alertas Recentes:</h4>
                          <div className="space-y-1">
                            {monitor.alerts.slice(0, 3).map((alert, index) => (
                              <div key={index} className={`p-2 rounded text-xs ${
                                alert.type === 'rank_improvement' ? 'bg-green-50 dark:bg-green-950 text-green-800 dark:text-green-200' :
                                alert.type === 'target_reached' ? 'bg-blue-50 dark:bg-blue-950 text-blue-800 dark:text-blue-200' :
                                alert.type === 'rank_drop' ? 'bg-red-50 dark:bg-red-950 text-red-800 dark:text-red-200' :
                                'bg-yellow-50 dark:bg-yellow-950 text-yellow-800 dark:text-yellow-200'
                              }`}>
                                <div className="flex items-center space-x-2">
                                  {alert.type === 'rank_improvement' ? <ArrowUp className="h-3 w-3" /> :
                                   alert.type === 'target_reached' ? <Target className="h-3 w-3" /> :
                                   alert.type === 'rank_drop' ? <ArrowDown className="h-3 w-3" /> :
                                   <AlertTriangle className="h-3 w-3" />}
                                  <span>{alert.message}</span>
                                </div>
                                <div className="text-xs opacity-75 mt-1">{alert.timestamp}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" data-testid={`button-check-rank-${monitor.id}`}>
                            <RefreshCw className="h-4 w-4 mr-1" />
                            Verificar Agora
                          </Button>
                          <Button variant="outline" size="sm" data-testid={`button-optimize-rank-${monitor.id}`}>
                            <Zap className="h-4 w-4 mr-1" />
                            Otimizar
                          </Button>
                          <Button variant="outline" size="sm" data-testid={`button-history-rank-${monitor.id}`}>
                            <BarChart3 className="h-4 w-4 mr-1" />
                            Ver Histórico
                          </Button>
                        </div>
                        
                        <div className="text-xs text-muted-foreground">
                          ID: {monitor.id}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Relatórios */}
          <TabsContent value="reports" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Relatórios SEO</h3>
              <Button onClick={handleGenerateReport} data-testid="button-generate-seo-report">
                <FileText className="h-4 w-4 mr-2" />
                Gerar Relatório
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Relatórios Automatizados</CardTitle>
                  <CardDescription>Relatórios gerados automaticamente</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start" data-testid="button-report-performance">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Relatório de Performance SEO
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start" data-testid="button-report-keywords">
                    <Hash className="h-4 w-4 mr-2" />
                    Análise de Palavras-chave
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start" data-testid="button-report-competitors">
                    <Users className="h-4 w-4 mr-2" />
                    Análise Competitiva
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start" data-testid="button-report-rankings">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Monitoramento de Rankings
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start" data-testid="button-report-optimization">
                    <Zap className="h-4 w-4 mr-2" />
                    Recomendações de Otimização
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Métricas Principais</CardTitle>
                  <CardDescription>Indicadores de performance SEO</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="space-y-2">
                      <div className="text-2xl font-bold text-green-500">+127%</div>
                      <p className="text-xs text-muted-foreground">Tráfego Orgânico</p>
                    </div>
                    <div className="space-y-2">
                      <div className="text-2xl font-bold text-blue-500">8.4%</div>
                      <p className="text-xs text-muted-foreground">CTR Médio</p>
                    </div>
                    <div className="space-y-2">
                      <div className="text-2xl font-bold text-purple-500">23</div>
                      <p className="text-xs text-muted-foreground">Keywords Top 10</p>
                    </div>
                    <div className="space-y-2">
                      <div className="text-2xl font-bold text-orange-500">89</div>
                      <p className="text-xs text-muted-foreground">Score SEO Médio</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Histórico de Relatórios</CardTitle>
                <CardDescription>Relatórios gerados recentemente</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">Relatório SEO Completo - Março 2024</div>
                      <div className="text-sm text-muted-foreground">Gerado em 08/03/2024 às 16:30</div>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" data-testid="button-download-seo-march">
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                      <Button size="sm" variant="outline" data-testid="button-share-seo-march">
                        <Share2 className="h-4 w-4 mr-1" />
                        Compartilhar
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">Análise de Keywords - Fevereiro 2024</div>
                      <div className="text-sm text-muted-foreground">Gerado em 29/02/2024 às 14:15</div>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" data-testid="button-download-keywords-feb">
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                      <Button size="sm" variant="outline" data-testid="button-share-keywords-feb">
                        <Share2 className="h-4 w-4 mr-1" />
                        Compartilhar
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">Relatório de Concorrentes - Janeiro 2024</div>
                      <div className="text-sm text-muted-foreground">Gerado em 31/01/2024 às 11:45</div>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" data-testid="button-download-competitors-jan">
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                      <Button size="sm" variant="outline" data-testid="button-share-competitors-jan">
                        <Share2 className="h-4 w-4 mr-1" />
                        Compartilhar
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}