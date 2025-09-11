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
import { Slider } from '@/components/ui/slider';
import { 
  Mic,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Square,
  SkipForward,
  SkipBack,
  RefreshCw,
  Upload,
  Download,
  Save,
  Settings,
  Plus,
  Edit,
  Trash2,
  Copy,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
  Clock,
  Timer,
  Calendar,
  User,
  Users,
  Globe,
  Flag,
  Zap,
  Target,
  BarChart3,
  LineChart,
  PieChart,
  TrendingUp,
  TrendingDown,
  Activity,
  Shield,
  Lock,
  Unlock,
  Filter,
  Search,
  FileAudio,
  Headphones,
  Radio,
  Waves,
  ScanLine,
  Database,
  Server,
  Cloud,
  HardDrive,
  Cpu,
  MemoryStick,
  Network,
  Archive,
  FolderOpen,
  File,
  FileText,
  Music,
  Video,
  Image,
  Code,
  Link2,
  ExternalLink,
  Share2,
  MessageSquare,
  Hash,
  Tag,
  Layers,
  Grid,
  List,
  Table,
  Columns,
  Maximize2,
  Minimize2,
  RotateCcw,
  Move,
  DollarSign,
  Award,
  Star,
  Heart,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react';

interface VoiceProfile {
  id: string;
  name: string;
  display_name: string;
  description: string;
  category: 'narrator' | 'presenter' | 'character' | 'commercial' | 'educational' | 'entertainment';
  language: string;
  accent: string;
  gender: 'male' | 'female' | 'neutral' | 'child';
  age_range: 'child' | 'teen' | 'young_adult' | 'adult' | 'middle_aged' | 'senior';
  tone: 'professional' | 'casual' | 'dramatic' | 'mysterious' | 'energetic' | 'calm' | 'authoritative' | 'friendly';
  emotion: 'neutral' | 'happy' | 'sad' | 'angry' | 'excited' | 'concerned' | 'confident';
  pace: 'very_slow' | 'slow' | 'normal' | 'fast' | 'very_fast';
  status: 'ready' | 'training' | 'processing' | 'error' | 'draft' | 'archived';
  quality_metrics: {
    overall_quality: number;
    naturalness: number;
    clarity: number;
    similarity: number;
    consistency: number;
    emotion_accuracy: number;
  };
  training_data: {
    audio_samples: number;
    total_duration: number; // em minutos
    sample_rate: number;
    quality_score: number;
    training_time: number; // em horas
    last_trained: string;
  };
  usage_stats: {
    total_generations: number;
    total_duration_generated: number; // em horas
    avg_generation_time: number; // em segundos
    success_rate: number;
    last_used: string;
    popularity_score: number;
  };
  technical_specs: {
    model_version: string;
    audio_format: string[];
    sample_rates: number[];
    max_length: number; // em segundos
    languages_supported: string[];
    voice_id: string;
  };
  authentication: {
    is_verified: boolean;
    anti_deepfake_score: number;
    security_level: 'low' | 'medium' | 'high' | 'maximum';
    watermark_enabled: boolean;
    biometric_signature: string;
  };
  pricing: {
    cost_per_minute: number;
    bulk_discount: number;
    premium_features: boolean;
  };
  created_by: string;
  created_at: string;
  updated_at: string;
  tags: string[];
  is_favorite: boolean;
  is_public: boolean;
}

interface VoiceTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  use_case: string;
  recommended_voices: string[];
  default_settings: {
    speed: number;
    pitch: number;
    volume: number;
    emphasis: number;
    pause_length: number;
  };
  script_template: string;
  performance_benchmarks: {
    engagement_score: number;
    retention_rate: number;
    conversion_rate: number;
  };
  usage_count: number;
  rating: number;
  preview_audio?: string;
}

interface AudioSample {
  id: string;
  voice_id: string;
  name: string;
  description: string;
  duration: number;
  file_size: number; // em MB
  format: string;
  sample_rate: number;
  bit_depth: number;
  quality_score: number;
  upload_date: string;
  status: 'processing' | 'ready' | 'error' | 'transcribing';
  waveform_data: number[];
  transcript: string;
  emotions_detected: Array<{
    emotion: string;
    confidence: number;
    timestamp: number;
  }>;
  noise_level: number;
  speech_clarity: number;
  is_training_sample: boolean;
}

interface VoiceComparison {
  id: string;
  name: string;
  description: string;
  voices: string[];
  test_script: string;
  metrics: Array<{
    voice_id: string;
    naturalness: number;
    clarity: number;
    engagement: number;
    preference_score: number;
  }>;
  created_at: string;
  total_votes: number;
}

interface VoiceGeneration {
  id: string;
  voice_id: string;
  text: string;
  settings: {
    speed: number;
    pitch: number;
    volume: number;
    emphasis: number;
    emotion: string;
    pause_length: number;
  };
  output: {
    audio_url: string;
    duration: number;
    file_size: number;
    format: string;
    quality_score: number;
  };
  status: 'queued' | 'processing' | 'completed' | 'failed';
  created_at: string;
  processing_time: number;
  cost: number;
  usage_context: string;
}

interface VoiceAnalytics {
  period: 'today' | 'week' | 'month' | 'year';
  total_generations: number;
  total_duration: number;
  total_cost: number;
  avg_quality: number;
  by_voice: Array<{
    voice_id: string;
    voice_name: string;
    generations: number;
    duration: number;
    quality: number;
    popularity: number;
  }>;
  by_category: Array<{
    category: string;
    generations: number;
    duration: number;
    avg_quality: number;
  }>;
  by_language: Array<{
    language: string;
    generations: number;
    duration: number;
    quality: number;
  }>;
  quality_trends: {
    dates: string[];
    naturalness: number[];
    clarity: number[];
    similarity: number[];
  };
  performance_metrics: {
    avg_generation_time: number;
    success_rate: number;
    user_satisfaction: number;
    retention_rate: number;
  };
}

const mockVoices: VoiceProfile[] = [
  {
    id: 'voice_001',
    name: 'alex_dramatic_narrator',
    display_name: 'Alex - Narrador Dramático',
    description: 'Voz masculina profunda e envolvente, especializada em conteúdo dark news e documentários de mistério',
    category: 'narrator',
    language: 'pt-BR',
    accent: 'Brasileiro Neutro',
    gender: 'male',
    age_range: 'adult',
    tone: 'dramatic',
    emotion: 'neutral',
    pace: 'normal',
    status: 'ready',
    quality_metrics: {
      overall_quality: 96.8,
      naturalness: 95.4,
      clarity: 98.2,
      similarity: 94.7,
      consistency: 97.1,
      emotion_accuracy: 93.8
    },
    training_data: {
      audio_samples: 247,
      total_duration: 18.5,
      sample_rate: 48000,
      quality_score: 94.2,
      training_time: 12.3,
      last_trained: '2024-03-05T14:30:00Z'
    },
    usage_stats: {
      total_generations: 8947,
      total_duration_generated: 247.8,
      avg_generation_time: 3.2,
      success_rate: 98.7,
      last_used: '2024-03-09T11:45:00Z',
      popularity_score: 94.5
    },
    technical_specs: {
      model_version: '2.1.3',
      audio_format: ['wav', 'mp3', 'flac', 'aac'],
      sample_rates: [22050, 44100, 48000],
      max_length: 1800,
      languages_supported: ['pt-BR', 'pt-PT'],
      voice_id: 'alex_narrator_v2'
    },
    authentication: {
      is_verified: true,
      anti_deepfake_score: 97.3,
      security_level: 'high',
      watermark_enabled: true,
      biometric_signature: 'bio_alex_2024_v1'
    },
    pricing: {
      cost_per_minute: 0.15,
      bulk_discount: 25,
      premium_features: true
    },
    created_by: 'admin@darknews.com',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-03-05T14:30:00Z',
    tags: ['dark news', 'documentary', 'mystery', 'professional', 'dramatic'],
    is_favorite: true,
    is_public: false
  },
  {
    id: 'voice_002',
    name: 'sofia_mystery_host',
    display_name: 'Sofia - Apresentadora Mistério',
    description: 'Voz feminina cativante com tom misterioso, perfeita para apresentação de casos sobrenaturais',
    category: 'presenter',
    language: 'pt-BR',
    accent: 'Brasileiro Sul',
    gender: 'female',
    age_range: 'young_adult',
    tone: 'mysterious',
    emotion: 'concerned',
    pace: 'slow',
    status: 'ready',
    quality_metrics: {
      overall_quality: 94.2,
      naturalness: 93.7,
      clarity: 96.8,
      similarity: 92.4,
      consistency: 95.1,
      emotion_accuracy: 96.3
    },
    training_data: {
      audio_samples: 189,
      total_duration: 14.2,
      sample_rate: 48000,
      quality_score: 91.8,
      training_time: 9.7,
      last_trained: '2024-02-28T16:20:00Z'
    },
    usage_stats: {
      total_generations: 6234,
      total_duration_generated: 189.4,
      avg_generation_time: 2.8,
      success_rate: 97.9,
      last_used: '2024-03-09T09:12:00Z',
      popularity_score: 87.3
    },
    technical_specs: {
      model_version: '2.0.8',
      audio_format: ['wav', 'mp3', 'flac'],
      sample_rates: [22050, 44100, 48000],
      max_length: 1200,
      languages_supported: ['pt-BR'],
      voice_id: 'sofia_mystery_v2'
    },
    authentication: {
      is_verified: true,
      anti_deepfake_score: 95.8,
      security_level: 'high',
      watermark_enabled: true,
      biometric_signature: 'bio_sofia_2024_v1'
    },
    pricing: {
      cost_per_minute: 0.18,
      bulk_discount: 20,
      premium_features: true
    },
    created_by: 'producer@darknews.com',
    created_at: '2024-02-01T12:00:00Z',
    updated_at: '2024-02-28T16:20:00Z',
    tags: ['mystery', 'supernatural', 'presenter', 'feminine', 'engaging'],
    is_favorite: true,
    is_public: false
  },
  {
    id: 'voice_003',
    name: 'carlos_international',
    display_name: 'Carlos - Correspondente Internacional',
    description: 'Voz masculina profissional com sotaque neutro, ideal para conteúdo internacional e breaking news',
    category: 'commercial',
    language: 'en-US',
    accent: 'American Neutral',
    gender: 'male',
    age_range: 'middle_aged',
    tone: 'authoritative',
    emotion: 'confident',
    pace: 'fast',
    status: 'training',
    quality_metrics: {
      overall_quality: 89.1,
      naturalness: 87.9,
      clarity: 92.3,
      similarity: 86.7,
      consistency: 88.4,
      emotion_accuracy: 90.8
    },
    training_data: {
      audio_samples: 312,
      total_duration: 22.7,
      sample_rate: 48000,
      quality_score: 88.9,
      training_time: 15.8,
      last_trained: '2024-03-08T20:15:00Z'
    },
    usage_stats: {
      total_generations: 3847,
      total_duration_generated: 98.2,
      avg_generation_time: 4.1,
      success_rate: 94.6,
      last_used: '2024-03-08T18:30:00Z',
      popularity_score: 76.8
    },
    technical_specs: {
      model_version: '1.9.4',
      audio_format: ['wav', 'mp3'],
      sample_rates: [22050, 44100],
      max_length: 900,
      languages_supported: ['en-US', 'en-GB'],
      voice_id: 'carlos_intl_v1'
    },
    authentication: {
      is_verified: false,
      anti_deepfake_score: 91.2,
      security_level: 'medium',
      watermark_enabled: false,
      biometric_signature: 'bio_carlos_2024_v1'
    },
    pricing: {
      cost_per_minute: 0.12,
      bulk_discount: 15,
      premium_features: false
    },
    created_by: 'international@darknews.com',
    created_at: '2024-02-20T08:30:00Z',
    updated_at: '2024-03-08T20:15:00Z',
    tags: ['international', 'news', 'professional', 'authoritative', 'breaking'],
    is_favorite: false,
    is_public: true
  },
  {
    id: 'voice_004',
    name: 'lucia_educational',
    display_name: 'Lúcia - Educadora Explicativa',
    description: 'Voz feminina clara e didática, especializada em explicar conceitos complexos de forma acessível',
    category: 'educational',
    language: 'pt-BR',
    accent: 'Brasileiro Sudeste',
    gender: 'female',
    age_range: 'adult',
    tone: 'friendly',
    emotion: 'happy',
    pace: 'normal',
    status: 'ready',
    quality_metrics: {
      overall_quality: 92.6,
      naturalness: 94.1,
      clarity: 97.4,
      similarity: 89.8,
      consistency: 93.7,
      emotion_accuracy: 95.2
    },
    training_data: {
      audio_samples: 156,
      total_duration: 11.3,
      sample_rate: 44100,
      quality_score: 90.4,
      training_time: 8.2,
      last_trained: '2024-03-01T10:45:00Z'
    },
    usage_stats: {
      total_generations: 4521,
      total_duration_generated: 134.7,
      avg_generation_time: 2.6,
      success_rate: 98.1,
      last_used: '2024-03-09T15:20:00Z',
      popularity_score: 82.4
    },
    technical_specs: {
      model_version: '2.0.2',
      audio_format: ['wav', 'mp3', 'flac'],
      sample_rates: [22050, 44100, 48000],
      max_length: 1500,
      languages_supported: ['pt-BR'],
      voice_id: 'lucia_edu_v2'
    },
    authentication: {
      is_verified: true,
      anti_deepfake_score: 94.7,
      security_level: 'medium',
      watermark_enabled: true,
      biometric_signature: 'bio_lucia_2024_v1'
    },
    pricing: {
      cost_per_minute: 0.10,
      bulk_discount: 30,
      premium_features: true
    },
    created_by: 'education@darknews.com',
    created_at: '2024-01-28T14:15:00Z',
    updated_at: '2024-03-01T10:45:00Z',
    tags: ['educational', 'clear', 'friendly', 'explanatory', 'accessible'],
    is_favorite: false,
    is_public: true
  },
  {
    id: 'voice_005',
    name: 'bruno_character',
    display_name: 'Bruno - Personagem Sombrio',
    description: 'Voz masculina grave e ameaçadora, ideal para personagens vilões e atmosferas tensas',
    category: 'character',
    language: 'pt-BR',
    accent: 'Brasileiro Nordeste',
    gender: 'male',
    age_range: 'middle_aged',
    tone: 'dramatic',
    emotion: 'angry',
    pace: 'slow',
    status: 'processing',
    quality_metrics: {
      overall_quality: 88.4,
      naturalness: 85.7,
      clarity: 89.2,
      similarity: 91.3,
      consistency: 87.8,
      emotion_accuracy: 92.6
    },
    training_data: {
      audio_samples: 98,
      total_duration: 7.8,
      sample_rate: 44100,
      quality_score: 87.1,
      training_time: 6.4,
      last_trained: '2024-03-09T12:00:00Z'
    },
    usage_stats: {
      total_generations: 1967,
      total_duration_generated: 67.3,
      avg_generation_time: 3.7,
      success_rate: 95.8,
      last_used: '2024-03-07T21:45:00Z',
      popularity_score: 71.2
    },
    technical_specs: {
      model_version: '1.8.1',
      audio_format: ['wav', 'mp3'],
      sample_rates: [22050, 44100],
      max_length: 600,
      languages_supported: ['pt-BR'],
      voice_id: 'bruno_character_v1'
    },
    authentication: {
      is_verified: false,
      anti_deepfake_score: 89.3,
      security_level: 'low',
      watermark_enabled: false,
      biometric_signature: 'bio_bruno_2024_v1'
    },
    pricing: {
      cost_per_minute: 0.20,
      bulk_discount: 10,
      premium_features: false
    },
    created_by: 'creative@darknews.com',
    created_at: '2024-03-05T16:30:00Z',
    updated_at: '2024-03-09T12:00:00Z',
    tags: ['character', 'villain', 'dark', 'threatening', 'dramatic'],
    is_favorite: false,
    is_public: false
  }
];

const mockTemplates: VoiceTemplate[] = [
  {
    id: 'template_001',
    name: 'Breaking News Urgente',
    description: 'Template otimizado para notícias de última hora com máximo impacto',
    category: 'News & Current Affairs',
    use_case: 'Notícias urgentes, alertas, breaking news',
    recommended_voices: ['alex_dramatic_narrator', 'carlos_international'],
    default_settings: {
      speed: 1.1,
      pitch: 0,
      volume: 0.9,
      emphasis: 0.8,
      pause_length: 0.5
    },
    script_template: '[ALERTA URGENTE] {título} | [PAUSA] Acabamos de receber informações sobre {evento}...',
    performance_benchmarks: {
      engagement_score: 94.7,
      retention_rate: 87.3,
      conversion_rate: 23.4
    },
    usage_count: 1247,
    rating: 4.8,
    preview_audio: '/audio/templates/breaking_news_preview.mp3'
  },
  {
    id: 'template_002',
    name: 'Mistério Sobrenatural',
    description: 'Template para conteúdo de mistério com atmosfera sobrenatural',
    category: 'Mystery & Supernatural',
    use_case: 'Casos paranormais, mistérios urbanos, lendas',
    recommended_voices: ['sofia_mystery_host', 'bruno_character'],
    default_settings: {
      speed: 0.9,
      pitch: -2,
      volume: 0.7,
      emphasis: 0.6,
      pause_length: 1.2
    },
    script_template: 'Na escuridão da noite... [PAUSA LONGA] {local} guarda segredos que a ciência não consegue explicar...',
    performance_benchmarks: {
      engagement_score: 91.2,
      retention_rate: 92.1,
      conversion_rate: 19.7
    },
    usage_count: 892,
    rating: 4.9,
    preview_audio: '/audio/templates/mystery_preview.mp3'
  },
  {
    id: 'template_003',
    name: 'Explicação Didática',
    description: 'Template para explicar conceitos complexos de forma clara',
    category: 'Educational',
    use_case: 'Tutoriais, explicações técnicas, análises detalhadas',
    recommended_voices: ['lucia_educational'],
    default_settings: {
      speed: 1.0,
      pitch: 1,
      volume: 0.8,
      emphasis: 0.4,
      pause_length: 0.8
    },
    script_template: 'Para entendermos {tópico}, precisamos primeiro analisar... [PAUSA] Vamos começar com {conceito_básico}...',
    performance_benchmarks: {
      engagement_score: 88.4,
      retention_rate: 89.7,
      conversion_rate: 15.2
    },
    usage_count: 634,
    rating: 4.6,
    preview_audio: '/audio/templates/educational_preview.mp3'
  }
];

const mockAnalytics: VoiceAnalytics = {
  period: 'month',
  total_generations: 24891,
  total_duration: 847.3,
  total_cost: 1247.89,
  avg_quality: 93.2,
  by_voice: [
    { voice_id: 'voice_001', voice_name: 'Alex - Narrador Dramático', generations: 8947, duration: 247.8, quality: 96.8, popularity: 94.5 },
    { voice_id: 'voice_002', voice_name: 'Sofia - Apresentadora Mistério', generations: 6234, duration: 189.4, quality: 94.2, popularity: 87.3 },
    { voice_id: 'voice_004', voice_name: 'Lúcia - Educadora Explicativa', generations: 4521, duration: 134.7, quality: 92.6, popularity: 82.4 },
    { voice_id: 'voice_003', voice_name: 'Carlos - Correspondente Internacional', generations: 3847, duration: 98.2, quality: 89.1, popularity: 76.8 },
    { voice_id: 'voice_005', voice_name: 'Bruno - Personagem Sombrio', generations: 1967, duration: 67.3, quality: 88.4, popularity: 71.2 }
  ],
  by_category: [
    { category: 'narrator', generations: 8947, duration: 247.8, avg_quality: 96.8 },
    { category: 'presenter', generations: 6234, duration: 189.4, avg_quality: 94.2 },
    { category: 'educational', generations: 4521, duration: 134.7, avg_quality: 92.6 },
    { category: 'commercial', generations: 3847, duration: 98.2, avg_quality: 89.1 },
    { category: 'character', generations: 1967, duration: 67.3, avg_quality: 88.4 }
  ],
  by_language: [
    { language: 'pt-BR', generations: 21044, duration: 749.1, quality: 93.7 },
    { language: 'en-US', generations: 3847, duration: 98.2, quality: 89.1 }
  ],
  quality_trends: {
    dates: ['2024-02-09', '2024-02-16', '2024-02-23', '2024-03-01', '2024-03-08'],
    naturalness: [91.2, 92.1, 92.8, 93.4, 93.2],
    clarity: [94.1, 94.7, 95.2, 95.8, 95.4],
    similarity: [89.7, 90.3, 91.1, 91.8, 91.5]
  },
  performance_metrics: {
    avg_generation_time: 3.2,
    success_rate: 97.3,
    user_satisfaction: 94.1,
    retention_rate: 89.7
  }
};

export default function VoiceCloningSystem() {
  const [selectedTab, setSelectedTab] = useState('overview');
  const [selectedVoice, setSelectedVoice] = useState<string | null>(null);
  const [voiceFilter, setVoiceFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showVoiceDialog, setShowVoiceDialog] = useState(false);
  const [showTemplateDialog, setShowTemplateDialog] = useState(false);
  const [showComparisonDialog, setShowComparisonDialog] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [testText, setTestText] = useState('');
  const [voiceSettings, setVoiceSettings] = useState({
    speed: 1.0,
    pitch: 0,
    volume: 0.8,
    emphasis: 0.5,
    emotion: 'neutral'
  });
  const { toast } = useToast();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready': return 'text-green-500 bg-green-100 dark:bg-green-950';
      case 'training': return 'text-blue-500 bg-blue-100 dark:bg-blue-950';
      case 'processing': return 'text-purple-500 bg-purple-100 dark:bg-purple-950';
      case 'error': return 'text-red-500 bg-red-100 dark:bg-red-950';
      case 'draft': return 'text-yellow-500 bg-yellow-100 dark:bg-yellow-950';
      case 'archived': return 'text-gray-500 bg-gray-100 dark:bg-gray-950';
      default: return 'text-gray-500 bg-gray-100 dark:bg-gray-950';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'narrator': return <Mic className="h-4 w-4" />;
      case 'presenter': return <Radio className="h-4 w-4" />;
      case 'character': return <User className="h-4 w-4" />;
      case 'commercial': return <Target className="h-4 w-4" />;
      case 'educational': return <FileText className="h-4 w-4" />;
      case 'entertainment': return <Music className="h-4 w-4" />;
      default: return <Volume2 className="h-4 w-4" />;
    }
  };

  const getLanguageFlag = (language: string) => {
    switch (language) {
      case 'pt-BR': return '🇧🇷';
      case 'pt-PT': return '🇵🇹';
      case 'en-US': return '🇺🇸';
      case 'en-GB': return '🇬🇧';
      case 'es-ES': return '🇪🇸';
      case 'es-MX': return '🇲🇽';
      case 'fr-FR': return '🇫🇷';
      case 'de-DE': return '🇩🇪';
      case 'it-IT': return '🇮🇹';
      case 'ja-JP': return '🇯🇵';
      case 'hi-IN': return '🇮🇳';
      case 'zh-CN': return '🇨🇳';
      case 'ko-KR': return '🇰🇷';
      case 'ru-RU': return '🇷🇺';
      default: return '🌐';
    }
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes.toFixed(1)}min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins.toFixed(0)}min`;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const handleGenerateVoice = async () => {
    if (!testText || !selectedVoice) {
      toast({
        title: "Configuração incompleta",
        description: "Selecione uma voz e digite o texto para gerar",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      toast({
        title: "Áudio gerado com sucesso",
        description: `${testText.length} caracteres processados em alta qualidade`
      });
    } catch (error) {
      toast({
        title: "Erro na geração",
        description: "Falha ao processar o áudio, tente novamente",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCreateVoice = async () => {
    toast({
      title: "Novo treinamento iniciado",
      description: "A nova voz está sendo criada com as amostras fornecidas"
    });
    setShowVoiceDialog(false);
  };

  const handleUseTemplate = (templateId: string) => {
    const template = mockTemplates.find(t => t.id === templateId);
    if (template) {
      setVoiceSettings({
        speed: template.default_settings.speed,
        pitch: template.default_settings.pitch,
        volume: template.default_settings.volume,
        emphasis: template.default_settings.emphasis,
        emotion: 'neutral'
      });
      setTestText(template.script_template);
      toast({
        title: "Template aplicado",
        description: `Configurações do template "${template.name}" foram carregadas`
      });
      setShowTemplateDialog(false);
    }
  };

  const filteredVoices = mockVoices.filter(voice => {
    let matches = true;
    
    if (voiceFilter !== 'all' && voice.status !== voiceFilter) matches = false;
    if (searchTerm && !voice.display_name.toLowerCase().includes(searchTerm.toLowerCase())) matches = false;
    
    return matches;
  });

  const totalVoices = mockVoices.length;
  const readyVoices = mockVoices.filter(v => v.status === 'ready').length;
  const avgQuality = mockVoices.reduce((sum, v) => sum + v.quality_metrics.overall_quality, 0) / totalVoices;
  const totalGenerationsToday = mockVoices.reduce((sum, v) => sum + (v.usage_stats.total_generations / 30), 0);

  return (
    <div className="container mx-auto px-6 py-8 max-w-7xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Mic className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Sistema de Clonagem de Voz</h1>
              <p className="text-muted-foreground">Criação e gestão avançada de vozes sintéticas personalizadas</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Dialog open={showTemplateDialog} onOpenChange={setShowTemplateDialog}>
              <DialogTrigger asChild>
                <Button variant="outline" data-testid="button-browse-templates">
                  <Layers className="h-4 w-4 mr-2" />
                  Templates
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl">
                <DialogHeader>
                  <DialogTitle>Templates de Voz</DialogTitle>
                  <DialogDescription>
                    Escolha um template otimizado para aplicar configurações pré-definidas
                  </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                  {mockTemplates.map((template) => (
                    <Card key={template.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-semibold text-sm">{template.name}</h3>
                              <p className="text-xs text-muted-foreground">{template.category}</p>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Star className="h-3 w-3 text-yellow-500 fill-current" />
                              <span className="text-xs">{template.rating}</span>
                            </div>
                          </div>
                          
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {template.description}
                          </p>
                          
                          <div className="text-xs text-muted-foreground">
                            <span>Usado {template.usage_count} vezes</span>
                          </div>
                          
                          <div className="grid grid-cols-3 gap-2 text-xs">
                            <div className="text-center">
                              <div className="font-medium">{template.performance_benchmarks.engagement_score}%</div>
                              <div className="text-muted-foreground">Engajamento</div>
                            </div>
                            <div className="text-center">
                              <div className="font-medium">{template.performance_benchmarks.retention_rate}%</div>
                              <div className="text-muted-foreground">Retenção</div>
                            </div>
                            <div className="text-center">
                              <div className="font-medium">{template.performance_benchmarks.conversion_rate}%</div>
                              <div className="text-muted-foreground">Conversão</div>
                            </div>
                          </div>
                          
                          <Button 
                            size="sm" 
                            className="w-full"
                            onClick={() => handleUseTemplate(template.id)}
                            data-testid={`button-use-template-${template.id}`}
                          >
                            Usar Template
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
            
            <Dialog open={showVoiceDialog} onOpenChange={setShowVoiceDialog}>
              <DialogTrigger asChild>
                <Button data-testid="button-create-voice">
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Voz
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl">
                <DialogHeader>
                  <DialogTitle>Criar Nova Voz</DialogTitle>
                  <DialogDescription>
                    Configure uma nova voz personalizada com amostras de áudio
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="voice-name">Nome da Voz</Label>
                      <Input id="voice-name" placeholder="Ex: Maria Apresentadora" data-testid="input-voice-name" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="voice-category">Categoria</Label>
                      <Select>
                        <SelectTrigger data-testid="select-voice-category">
                          <SelectValue placeholder="Categoria" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="narrator">Narrador</SelectItem>
                          <SelectItem value="presenter">Apresentador</SelectItem>
                          <SelectItem value="character">Personagem</SelectItem>
                          <SelectItem value="commercial">Comercial</SelectItem>
                          <SelectItem value="educational">Educacional</SelectItem>
                          <SelectItem value="entertainment">Entretenimento</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="voice-description">Descrição</Label>
                    <Textarea
                      id="voice-description"
                      placeholder="Descreva as características desta voz..."
                      data-testid="textarea-voice-description"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="voice-language">Idioma</Label>
                      <Select>
                        <SelectTrigger data-testid="select-voice-language">
                          <SelectValue placeholder="Idioma" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pt-BR">🇧🇷 Português (Brasil)</SelectItem>
                          <SelectItem value="pt-PT">🇵🇹 Português (Portugal)</SelectItem>
                          <SelectItem value="en-US">🇺🇸 English (US)</SelectItem>
                          <SelectItem value="en-GB">🇬🇧 English (UK)</SelectItem>
                          <SelectItem value="es-ES">🇪🇸 Español</SelectItem>
                          <SelectItem value="fr-FR">🇫🇷 Français</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="voice-gender">Gênero</Label>
                      <Select>
                        <SelectTrigger data-testid="select-voice-gender">
                          <SelectValue placeholder="Gênero" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Masculino</SelectItem>
                          <SelectItem value="female">Feminino</SelectItem>
                          <SelectItem value="neutral">Neutro</SelectItem>
                          <SelectItem value="child">Infantil</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="voice-tone">Tom</Label>
                      <Select>
                        <SelectTrigger data-testid="select-voice-tone">
                          <SelectValue placeholder="Tom" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="professional">Profissional</SelectItem>
                          <SelectItem value="casual">Casual</SelectItem>
                          <SelectItem value="dramatic">Dramático</SelectItem>
                          <SelectItem value="mysterious">Misterioso</SelectItem>
                          <SelectItem value="energetic">Energético</SelectItem>
                          <SelectItem value="calm">Calmo</SelectItem>
                          <SelectItem value="authoritative">Autoritário</SelectItem>
                          <SelectItem value="friendly">Amigável</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Upload de Amostras de Áudio</h4>
                    <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center">
                      <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h4 className="text-lg font-medium mb-2">Arraste arquivos de áudio aqui</h4>
                      <p className="text-sm text-muted-foreground mb-4">
                        Suporte para WAV, MP3, FLAC • Mínimo 5 minutos • Máximo 50MB por arquivo
                      </p>
                      <Button variant="outline">
                        <FileAudio className="h-4 w-4 mr-2" />
                        Escolher Arquivos
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium">Configurações Avançadas</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="voice-public">Voz Pública</Label>
                        <Switch id="voice-public" data-testid="switch-voice-public" />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="voice-watermark">Marca d'água</Label>
                        <Switch id="voice-watermark" defaultChecked data-testid="switch-voice-watermark" />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="voice-security">Alta Segurança</Label>
                        <Switch id="voice-security" data-testid="switch-voice-security" />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="voice-premium">Recursos Premium</Label>
                        <Switch id="voice-premium" data-testid="switch-voice-premium" />
                      </div>
                    </div>
                  </div>

                  <Button onClick={handleCreateVoice} className="w-full" data-testid="button-create-voice-submit">
                    Iniciar Treinamento da Voz
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Vozes Disponíveis</p>
                  <p className="text-2xl font-bold">{totalVoices}</p>
                  <p className="text-xs text-green-500 flex items-center mt-1">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    {readyVoices} prontas
                  </p>
                </div>
                <Mic className="h-8 w-8 text-indigo-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Qualidade Média</p>
                  <p className="text-2xl font-bold">{avgQuality.toFixed(1)}%</p>
                  <p className="text-xs text-green-500 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +2.4% este mês
                  </p>
                </div>
                <Target className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Gerações Hoje</p>
                  <p className="text-2xl font-bold">{Math.round(totalGenerationsToday)}</p>
                  <p className="text-xs text-blue-500 flex items-center mt-1">
                    <Activity className="h-3 w-3 mr-1" />
                    {formatDuration(mockAnalytics.total_duration / 30)} áudio
                  </p>
                </div>
                <BarChart3 className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Custo Mensal</p>
                  <p className="text-2xl font-bold">{formatCurrency(mockAnalytics.total_cost)}</p>
                  <p className="text-xs text-orange-500 flex items-center mt-1">
                    <DollarSign className="h-3 w-3 mr-1" />
                    {formatCurrency(mockAnalytics.total_cost / 30)}/dia
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-1 h-auto p-1">
            <TabsTrigger 
              value="overview" 
              className="!text-sm !sm:text-sm !px-2 !py-2.5 h-auto min-h-[44px] whitespace-nowrap data-[state=active]:!text-sm"
            >
              Visão Geral
            </TabsTrigger>
            <TabsTrigger 
              value="generator" 
              className="!text-sm !sm:text-sm !px-2 !py-2.5 h-auto min-h-[44px] whitespace-nowrap data-[state=active]:!text-sm"
            >
              Gerador
            </TabsTrigger>
            <TabsTrigger 
              value="library" 
              className="!text-sm !sm:text-sm !px-2 !py-2.5 h-auto min-h-[44px] whitespace-nowrap data-[state=active]:!text-sm"
            >
              Biblioteca
            </TabsTrigger>
            <TabsTrigger 
              value="training" 
              className="!text-sm !sm:text-sm !px-2 !py-2.5 h-auto min-h-[44px] whitespace-nowrap data-[state=active]:!text-sm"
            >
              Treinamento
            </TabsTrigger>
            <TabsTrigger 
              value="analytics" 
              className="!text-sm !sm:text-sm !px-2 !py-2.5 h-auto min-h-[44px] whitespace-nowrap data-[state=active]:!text-sm"
            >
              Analytics
            </TabsTrigger>
            <TabsTrigger 
              value="security" 
              className="!text-sm !sm:text-sm !px-2 !py-2.5 h-auto min-h-[44px] whitespace-nowrap data-[state=active]:!text-sm"
            >
              Segurança
            </TabsTrigger>
          </TabsList>

          {/* Overview */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top Performing Voices */}
              <Card>
                <CardHeader>
                  <CardTitle>Vozes Mais Populares</CardTitle>
                  <CardDescription>Ranking por uso e qualidade</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockAnalytics.by_voice.slice(0, 5).map((voice, index) => (
                      <div key={voice.voice_id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center text-sm font-bold">
                            {index + 1}
                          </div>
                          <div>
                            <div className="font-medium text-sm">{voice.voice_name}</div>
                            <div className="text-xs text-muted-foreground">
                              {voice.generations.toLocaleString()} gerações • {voice.quality.toFixed(1)}% qualidade
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">{formatDuration(voice.duration)}</div>
                          <div className="text-xs text-muted-foreground">{voice.popularity.toFixed(0)}% popularidade</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quality Trends */}
              <Card>
                <CardHeader>
                  <CardTitle>Tendências de Qualidade</CardTitle>
                  <CardDescription>Evolução das métricas nas últimas 5 semanas</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Naturalidade</span>
                        <span className="font-medium">{mockAnalytics.quality_trends.naturalness[4]}%</span>
                      </div>
                      <Progress value={mockAnalytics.quality_trends.naturalness[4]} className="h-2" />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Clareza</span>
                        <span className="font-medium">{mockAnalytics.quality_trends.clarity[4]}%</span>
                      </div>
                      <Progress value={mockAnalytics.quality_trends.clarity[4]} className="h-2" />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Similaridade</span>
                        <span className="font-medium">{mockAnalytics.quality_trends.similarity[4]}%</span>
                      </div>
                      <Progress value={mockAnalytics.quality_trends.similarity[4]} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Usage by Category */}
            <Card>
              <CardHeader>
                <CardTitle>Distribuição por Categoria</CardTitle>
                <CardDescription>Uso de vozes por tipo de conteúdo</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  {mockAnalytics.by_category.map((category, index) => (
                    <div key={category.category} className="text-center p-4 border rounded-lg">
                      <div className="mb-2">
                        {getCategoryIcon(category.category)}
                      </div>
                      <div className="text-lg font-bold">{category.generations.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground capitalize">{category.category}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {category.avg_quality.toFixed(1)}% qualidade
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Generator */}
          <TabsContent value="generator" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Voice Generation */}
              <Card>
                <CardHeader>
                  <CardTitle>Síntese de Voz</CardTitle>
                  <CardDescription>Gere áudio de alta qualidade com suas vozes personalizadas</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Voz Selecionada</Label>
                      <Select value={selectedVoice || ''} onValueChange={setSelectedVoice}>
                        <SelectTrigger data-testid="select-voice-generator">
                          <SelectValue placeholder="Escolha uma voz" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockVoices.filter(v => v.status === 'ready').map((voice) => (
                            <SelectItem key={voice.id} value={voice.id}>
                              <div className="flex items-center space-x-2">
                                <span>{getLanguageFlag(voice.language)}</span>
                                <span>{voice.display_name}</span>
                                <Badge variant="outline" className="ml-2 text-xs">
                                  {voice.quality_metrics.overall_quality.toFixed(1)}%
                                </Badge>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="generator-text">Texto para Síntese</Label>
                      <Textarea
                        id="generator-text"
                        placeholder="Digite ou cole o texto que será convertido em áudio..."
                        value={testText}
                        onChange={(e) => setTestText(e.target.value)}
                        rows={6}
                        data-testid="textarea-generator-text"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{testText.length} caracteres</span>
                        <span>≈ {Math.round(testText.length / 15)} segundos de áudio</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Velocidade: {voiceSettings.speed.toFixed(1)}x</Label>
                        <Slider
                          value={[voiceSettings.speed]}
                          onValueChange={(value) => setVoiceSettings(prev => ({ ...prev, speed: value[0] }))}
                          min={0.5}
                          max={2.0}
                          step={0.1}
                          className="w-full"
                          data-testid="slider-speed"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Tom: {voiceSettings.pitch > 0 ? '+' : ''}{voiceSettings.pitch}</Label>
                        <Slider
                          value={[voiceSettings.pitch]}
                          onValueChange={(value) => setVoiceSettings(prev => ({ ...prev, pitch: value[0] }))}
                          min={-10}
                          max={10}
                          step={1}
                          className="w-full"
                          data-testid="slider-pitch"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Volume: {Math.round(voiceSettings.volume * 100)}%</Label>
                        <Slider
                          value={[voiceSettings.volume]}
                          onValueChange={(value) => setVoiceSettings(prev => ({ ...prev, volume: value[0] }))}
                          min={0}
                          max={1}
                          step={0.1}
                          className="w-full"
                          data-testid="slider-volume"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Ênfase: {Math.round(voiceSettings.emphasis * 100)}%</Label>
                        <Slider
                          value={[voiceSettings.emphasis]}
                          onValueChange={(value) => setVoiceSettings(prev => ({ ...prev, emphasis: value[0] }))}
                          min={0}
                          max={1}
                          step={0.1}
                          className="w-full"
                          data-testid="slider-emphasis"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Emoção</Label>
                      <Select value={voiceSettings.emotion} onValueChange={(value) => setVoiceSettings(prev => ({ ...prev, emotion: value }))}>
                        <SelectTrigger data-testid="select-emotion">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="neutral">Neutro</SelectItem>
                          <SelectItem value="happy">Feliz</SelectItem>
                          <SelectItem value="sad">Triste</SelectItem>
                          <SelectItem value="angry">Irritado</SelectItem>
                          <SelectItem value="excited">Animado</SelectItem>
                          <SelectItem value="concerned">Preocupado</SelectItem>
                          <SelectItem value="confident">Confiante</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Button 
                      onClick={handleGenerateVoice}
                      disabled={isGenerating || !testText || !selectedVoice}
                      className="w-full"
                      data-testid="button-generate-audio"
                    >
                      {isGenerating ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Gerando Áudio...
                        </>
                      ) : (
                        <>
                          <Waves className="h-4 w-4 mr-2" />
                          Gerar Áudio
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Preview & Controls */}
              <Card>
                <CardHeader>
                  <CardTitle>Preview e Controles</CardTitle>
                  <CardDescription>Visualize e teste o áudio gerado</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {selectedVoice && (
                    <div className="p-4 border rounded-lg bg-muted/50">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                          <User className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">
                            {mockVoices.find(v => v.id === selectedVoice)?.display_name}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {mockVoices.find(v => v.id === selectedVoice)?.description}
                          </p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Idioma:</span>
                          <span className="ml-2 font-medium">{mockVoices.find(v => v.id === selectedVoice)?.language}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Gênero:</span>
                          <span className="ml-2 font-medium capitalize">{mockVoices.find(v => v.id === selectedVoice)?.gender}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Tom:</span>
                          <span className="ml-2 font-medium capitalize">{mockVoices.find(v => v.id === selectedVoice)?.tone}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Qualidade:</span>
                          <span className="ml-2 font-medium">{mockVoices.find(v => v.id === selectedVoice)?.quality_metrics.overall_quality.toFixed(1)}%</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="space-y-4">
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium">Áudio Gerado</span>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" onClick={() => setIsPlaying(!isPlaying)} data-testid="button-play-preview">
                            {isPlaying ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                          </Button>
                          <Button size="sm" variant="outline" data-testid="button-stop-preview">
                            <Square className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      
                      {/* Visualizador de forma de onda */}
                      <div className="h-20 bg-background rounded border flex items-center justify-center mb-3">
                        <div className="flex items-end space-x-1 h-16">
                          {Array.from({length: 50}, (_, i) => (
                            <div 
                              key={i}
                              className={`w-1 bg-indigo-500 transition-all duration-200 ${
                                isPlaying ? 'opacity-100' : 'opacity-50'
                              }`}
                              style={{height: `${Math.random() * 100}%`}}
                            />
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>0:00</span>
                        <div className="flex space-x-4">
                          <span>Duração: {Math.round(testText.length / 15)}s</span>
                          <span>Qualidade: {selectedVoice ? mockVoices.find(v => v.id === selectedVoice)?.quality_metrics.overall_quality.toFixed(1) : 0}%</span>
                        </div>
                        <span>{Math.round(testText.length / 15)}s</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="outline" className="flex-1" data-testid="button-download-audio">
                        <Download className="h-4 w-4 mr-2" />
                        Baixar WAV
                      </Button>
                      <Button variant="outline" className="flex-1" data-testid="button-download-mp3">
                        <Download className="h-4 w-4 mr-2" />
                        Baixar MP3
                      </Button>
                      <Button variant="outline" className="flex-1" data-testid="button-share-audio">
                        <Share2 className="h-4 w-4 mr-2" />
                        Compartilhar
                      </Button>
                      <Button variant="outline" className="flex-1" data-testid="button-save-preset">
                        <Save className="h-4 w-4 mr-2" />
                        Salvar Preset
                      </Button>
                    </div>
                  </div>

                  {/* Cost Calculator */}
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Calculadora de Custo</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Duração estimada:</span>
                        <span className="ml-2 font-medium">{Math.round(testText.length / 15)}s</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Custo estimado:</span>
                        <span className="ml-2 font-medium">{formatCurrency((testText.length / 15 / 60) * 0.15)}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Library */}
          <TabsContent value="library" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Biblioteca de Vozes</h3>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar vozes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                    data-testid="input-search-voices"
                  />
                </div>
                
                <Select value={voiceFilter} onValueChange={setVoiceFilter}>
                  <SelectTrigger className="w-40" data-testid="select-voice-filter">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    <SelectItem value="ready">Prontas</SelectItem>
                    <SelectItem value="training">Treinando</SelectItem>
                    <SelectItem value="processing">Processando</SelectItem>
                    <SelectItem value="error">Erro</SelectItem>
                    <SelectItem value="draft">Rascunho</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVoices.map((voice) => (
                <Card key={voice.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {/* Header da voz */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                            {getCategoryIcon(voice.category)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <span className="text-lg">{getLanguageFlag(voice.language)}</span>
                              <h3 className="font-semibold text-sm">{voice.display_name}</h3>
                              {voice.is_favorite && <Heart className="h-4 w-4 text-red-500 fill-current" />}
                            </div>
                            <p className="text-xs text-muted-foreground line-clamp-2">{voice.description}</p>
                          </div>
                        </div>
                        <Badge className={getStatusColor(voice.status)}>
                          {voice.status === 'ready' ? 'Pronta' :
                           voice.status === 'training' ? 'Treinando' :
                           voice.status === 'processing' ? 'Processando' :
                           voice.status === 'error' ? 'Erro' :
                           voice.status === 'draft' ? 'Rascunho' : 'Arquivada'}
                        </Badge>
                      </div>

                      {/* Características */}
                      <div className="flex flex-wrap gap-1">
                        <Badge variant="outline" className="text-xs capitalize">
                          {voice.gender}
                        </Badge>
                        <Badge variant="outline" className="text-xs capitalize">
                          {voice.age_range.replace('_', ' ')}
                        </Badge>
                        <Badge variant="outline" className="text-xs capitalize">
                          {voice.tone}
                        </Badge>
                        <Badge variant="outline" className="text-xs capitalize">
                          {voice.category}
                        </Badge>
                      </div>

                      {/* Métricas de qualidade */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Qualidade Geral</span>
                          <span className="font-medium">{voice.quality_metrics.overall_quality.toFixed(1)}%</span>
                        </div>
                        <Progress value={voice.quality_metrics.overall_quality} className="h-2" />
                        
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="text-muted-foreground">Naturalidade:</span>
                            <span className="ml-1 font-medium">{voice.quality_metrics.naturalness.toFixed(1)}%</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Clareza:</span>
                            <span className="ml-1 font-medium">{voice.quality_metrics.clarity.toFixed(1)}%</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Similaridade:</span>
                            <span className="ml-1 font-medium">{voice.quality_metrics.similarity.toFixed(1)}%</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Consistência:</span>
                            <span className="ml-1 font-medium">{voice.quality_metrics.consistency.toFixed(1)}%</span>
                          </div>
                        </div>
                      </div>

                      {/* Estatísticas de uso */}
                      <div className="p-3 bg-muted/50 rounded-lg text-xs">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <span className="text-muted-foreground">Gerações:</span>
                            <span className="ml-1 font-medium">{voice.usage_stats.total_generations.toLocaleString()}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Duração:</span>
                            <span className="ml-1 font-medium">{formatDuration(voice.usage_stats.total_duration_generated)}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Sucesso:</span>
                            <span className="ml-1 font-medium">{voice.usage_stats.success_rate.toFixed(1)}%</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Popularidade:</span>
                            <span className="ml-1 font-medium">{voice.usage_stats.popularity_score.toFixed(0)}%</span>
                          </div>
                        </div>
                      </div>

                      {/* Treinamento */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">Amostras de treinamento:</span>
                          <span className="font-medium">{voice.training_data.audio_samples}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">Duração total:</span>
                          <span className="font-medium">{formatDuration(voice.training_data.total_duration)}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">Último treinamento:</span>
                          <span className="font-medium">{new Date(voice.training_data.last_trained).toLocaleDateString()}</span>
                        </div>
                      </div>

                      {/* Segurança */}
                      {voice.authentication.is_verified && (
                        <div className="flex items-center space-x-2 p-2 bg-green-50 dark:bg-green-950 rounded border border-green-200">
                          <Shield className="h-4 w-4 text-green-500" />
                          <span className="text-xs text-green-700 dark:text-green-300">
                            Voz verificada • Segurança {voice.authentication.security_level}
                          </span>
                        </div>
                      )}

                      {/* Ações */}
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          variant="default" 
                          className="flex-1"
                          onClick={() => setSelectedVoice(voice.id)}
                          disabled={voice.status !== 'ready'}
                          data-testid={`button-use-voice-${voice.id}`}
                        >
                          <Play className="h-3 w-3 mr-1" />
                          Usar
                        </Button>
                        <Button size="sm" variant="outline" data-testid={`button-preview-${voice.id}`}>
                          <Headphones className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline" data-testid={`button-details-${voice.id}`}>
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline" data-testid={`button-edit-voice-${voice.id}`}>
                          <Edit className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Training */}
          <TabsContent value="training" className="space-y-6">
            <h3 className="text-lg font-semibold">Gerenciamento de Treinamento</h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Active Training */}
              <Card>
                <CardHeader>
                  <CardTitle>Treinamentos Ativos</CardTitle>
                  <CardDescription>Progresso dos modelos em treinamento</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockVoices.filter(v => v.status === 'training' || v.status === 'processing').map((voice) => (
                      <div key={voice.id} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h4 className="font-medium text-sm">{voice.display_name}</h4>
                            <p className="text-xs text-muted-foreground">{voice.category} • {voice.language}</p>
                          </div>
                          <Badge className={getStatusColor(voice.status)}>
                            {voice.status === 'training' ? 'Treinando' : 'Processando'}
                          </Badge>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs">
                            <span>Progresso</span>
                            <span>{voice.status === 'training' ? '67%' : '23%'}</span>
                          </div>
                          <Progress value={voice.status === 'training' ? 67 : 23} className="h-2" />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Tempo restante: {voice.status === 'training' ? '2h 15min' : '45min'}</span>
                            <span>Época {voice.status === 'training' ? '134/200' : 'Processando...'}</span>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 mt-3 text-xs">
                          <div>
                            <span className="text-muted-foreground">Amostras:</span>
                            <span className="ml-1 font-medium">{voice.training_data.audio_samples}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Duração:</span>
                            <span className="ml-1 font-medium">{formatDuration(voice.training_data.total_duration)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Training Queue */}
              <Card>
                <CardHeader>
                  <CardTitle>Fila de Treinamento</CardTitle>
                  <CardDescription>Próximos treinamentos agendados</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-sm">Marina - Narradora Jovem</h4>
                        <Badge variant="outline">Na fila</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">
                        78 amostras • 11.2 min • Posição #1 na fila
                      </p>
                      <div className="text-xs text-muted-foreground">
                        Estimativa de início: em 2h 15min
                      </div>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-sm">Roberto - Comercial Energético</h4>
                        <Badge variant="outline">Na fila</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">
                        156 amostras • 22.7 min • Posição #2 na fila
                      </p>
                      <div className="text-xs text-muted-foreground">
                        Estimativa de início: em 8h 30min
                      </div>
                    </div>

                    <div className="text-center py-4">
                      <Button variant="outline" className="w-full">
                        <Plus className="h-4 w-4 mr-2" />
                        Adicionar à Fila
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Training History */}
            <Card>
              <CardHeader>
                <CardTitle>Histórico de Treinamentos</CardTitle>
                <CardDescription>Últimos treinamentos concluídos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockVoices.filter(v => v.status === 'ready').slice(0, 5).map((voice) => (
                    <div key={voice.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <div>
                          <div className="font-medium text-sm">{voice.display_name}</div>
                          <div className="text-xs text-muted-foreground">
                            Concluído em {new Date(voice.training_data.last_trained).toLocaleDateString()} • 
                            {formatDuration(voice.training_data.training_time)} de treinamento
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{voice.quality_metrics.overall_quality.toFixed(1)}%</div>
                        <div className="text-xs text-muted-foreground">Qualidade final</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics */}
          <TabsContent value="analytics" className="space-y-6">
            <h3 className="text-lg font-semibold">Analytics e Performance</h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Usage Statistics */}
              <Card>
                <CardHeader>
                  <CardTitle>Estatísticas de Uso</CardTitle>
                  <CardDescription>Métricas dos últimos 30 dias</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold">{mockAnalytics.total_generations.toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground">Total de Gerações</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold">{formatDuration(mockAnalytics.total_duration)}</div>
                        <div className="text-sm text-muted-foreground">Duração Total</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold">{formatCurrency(mockAnalytics.total_cost)}</div>
                        <div className="text-sm text-muted-foreground">Custo Total</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold">{mockAnalytics.avg_quality.toFixed(1)}%</div>
                        <div className="text-sm text-muted-foreground">Qualidade Média</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Performance Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle>Métricas de Performance</CardTitle>
                  <CardDescription>Indicadores de qualidade e eficiência</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Tempo Médio de Geração</span>
                        <span className="font-medium">{mockAnalytics.performance_metrics.avg_generation_time.toFixed(1)}s</span>
                      </div>
                      <Progress value={(mockAnalytics.performance_metrics.avg_generation_time / 10) * 100} className="h-2" />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Taxa de Sucesso</span>
                        <span className="font-medium">{mockAnalytics.performance_metrics.success_rate.toFixed(1)}%</span>
                      </div>
                      <Progress value={mockAnalytics.performance_metrics.success_rate} className="h-2" />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Satisfação do Usuário</span>
                        <span className="font-medium">{mockAnalytics.performance_metrics.user_satisfaction.toFixed(1)}%</span>
                      </div>
                      <Progress value={mockAnalytics.performance_metrics.user_satisfaction} className="h-2" />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Taxa de Retenção</span>
                        <span className="font-medium">{mockAnalytics.performance_metrics.retention_rate.toFixed(1)}%</span>
                      </div>
                      <Progress value={mockAnalytics.performance_metrics.retention_rate} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Usage by Language */}
            <Card>
              <CardHeader>
                <CardTitle>Distribuição por Idioma</CardTitle>
                <CardDescription>Uso de vozes por idioma e região</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockAnalytics.by_language.map((lang, index) => (
                    <div key={lang.language} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <div className="flex items-center space-x-2">
                          <span>{getLanguageFlag(lang.language)}</span>
                          <span>{lang.language}</span>
                        </div>
                        <div className="text-right">
                          <span className="font-medium">{lang.generations.toLocaleString()}</span>
                          <span className="text-muted-foreground ml-2">gerações</span>
                        </div>
                      </div>
                      <Progress value={(lang.generations / mockAnalytics.total_generations) * 100} className="h-2" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{formatDuration(lang.duration)} de áudio</span>
                        <span>{lang.quality.toFixed(1)}% qualidade média</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security */}
          <TabsContent value="security" className="space-y-6">
            <h3 className="text-lg font-semibold">Segurança e Autenticação</h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Security Overview */}
              <Card>
                <CardHeader>
                  <CardTitle>Status de Segurança</CardTitle>
                  <CardDescription>Verificação e proteção contra deepfakes</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockVoices.map((voice) => (
                      <div key={voice.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full ${
                            voice.authentication.is_verified ? 'bg-green-500' : 'bg-red-500'
                          }`} />
                          <div>
                            <div className="font-medium text-sm">{voice.display_name}</div>
                            <div className="text-xs text-muted-foreground">
                              Segurança: {voice.authentication.security_level} • 
                              Score: {voice.authentication.anti_deepfake_score.toFixed(1)}%
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          {voice.authentication.is_verified && (
                            <Shield className="h-4 w-4 text-green-500" />
                          )}
                          {voice.authentication.watermark_enabled && (
                            <Lock className="h-4 w-4 text-blue-500" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Security Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>Configurações de Segurança</CardTitle>
                  <CardDescription>Políticas globais de proteção</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="auto-watermark">Marca d'água automática</Label>
                          <p className="text-xs text-muted-foreground">
                            Adiciona marca d'água inaudível em todos os áudios gerados
                          </p>
                        </div>
                        <Switch id="auto-watermark" defaultChecked data-testid="switch-auto-watermark" />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="deepfake-detection">Detecção de deepfake</Label>
                          <p className="text-xs text-muted-foreground">
                            Analisa todos os áudios gerados para detectar manipulações
                          </p>
                        </div>
                        <Switch id="deepfake-detection" defaultChecked data-testid="switch-deepfake-detection" />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="usage-logging">Log de uso detalhado</Label>
                          <p className="text-xs text-muted-foreground">
                            Registra todas as gerações para auditoria e segurança
                          </p>
                        </div>
                        <Switch id="usage-logging" defaultChecked data-testid="switch-usage-logging" />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="biometric-auth">Autenticação biométrica</Label>
                          <p className="text-xs text-muted-foreground">
                            Requer verificação biométrica para vozes críticas
                          </p>
                        </div>
                        <Switch id="biometric-auth" data-testid="switch-biometric-auth" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Nível mínimo de segurança</Label>
                      <Select defaultValue="medium">
                        <SelectTrigger data-testid="select-security-level">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Baixo</SelectItem>
                          <SelectItem value="medium">Médio</SelectItem>
                          <SelectItem value="high">Alto</SelectItem>
                          <SelectItem value="maximum">Máximo</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="retention-period">Período de retenção de logs</Label>
                      <Select defaultValue="90">
                        <SelectTrigger data-testid="select-retention-period">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="30">30 dias</SelectItem>
                          <SelectItem value="90">90 dias</SelectItem>
                          <SelectItem value="180">180 dias</SelectItem>
                          <SelectItem value="365">1 ano</SelectItem>
                          <SelectItem value="permanent">Permanente</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Audit Log */}
            <Card>
              <CardHeader>
                <CardTitle>Log de Auditoria</CardTitle>
                <CardDescription>Histórico de atividades e eventos de segurança</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <div>
                        <div className="font-medium text-sm">Voz criada com sucesso</div>
                        <div className="text-xs text-muted-foreground">
                          Sofia - Apresentadora Mistério • Verificação biométrica aprovada
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      2024-03-09 14:23:15
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <AlertTriangle className="h-5 w-5 text-yellow-500" />
                      <div>
                        <div className="font-medium text-sm">Tentativa de deepfake detectada</div>
                        <div className="text-xs text-muted-foreground">
                          Score de autenticidade: 65% • Geração bloqueada automaticamente
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      2024-03-09 11:45:32
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Shield className="h-5 w-5 text-blue-500" />
                      <div>
                        <div className="font-medium text-sm">Configuração de segurança alterada</div>
                        <div className="text-xs text-muted-foreground">
                          Nível de segurança alterado para "Alto" por admin@darknews.com
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      2024-03-09 09:12:08
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Lock className="h-5 w-5 text-indigo-500" />
                      <div>
                        <div className="font-medium text-sm">Marca d'água aplicada</div>
                        <div className="text-xs text-muted-foreground">
                          Áudio gerado com marca d'água digital • ID: wm_abc123xyz
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      2024-03-09 08:45:21
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