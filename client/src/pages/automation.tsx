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
  Zap,
  Play,
  Pause,
  Square,
  SkipForward,
  RefreshCw,
  Settings,
  Plus,
  Edit,
  Trash2,
  Copy,
  Eye,
  EyeOff,
  Activity,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Target,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
  Clock,
  Calendar,
  Timer,
  Stopwatch,
  Bell,
  BellOff,
  ArrowRight,
  ArrowDown,
  ArrowUp,
  MoreHorizontal,
  Filter,
  Search,
  Download,
  Upload,
  FileText,
  File,
  Folder,
  FolderOpen,
  Database,
  Server,
  Cloud,
  Globe,
  Link2,
  ExternalLink,
  Share2,
  MessageSquare,
  Users,
  User,
  Cpu,
  MemoryStick,
  HardDrive,
  Network,
  Wifi,
  Router,
  Smartphone,
  Monitor,
  Tablet,
  Laptop,
  Tv,
  Radio,
  Headphones,
  Mic,
  Camera,
  Video,
  Image,
  Music,
  Volume2,
  VolumeX,
  Power,
  PowerOff,
  Battery,
  BatteryLow,
  Plug,
  Bluetooth,
  Usb,
  Cable,
  Satellite,
  Antenna,
  Signal,
  MapPin,
  Navigation,
  Compass,
  Flag,
  Bookmark,
  Star,
  Heart,
  ThumbsUp,
  Hash,
  Tag,
  Layers,
  Grid,
  List,
  Table,
  Columns,
  PenTool,
  Type,
  Paintbrush,
  Palette,
  Brush,
  Scissors,
  Move,
  RotateCcw,
  RotateCw,
  FlipHorizontal,
  FlipVertical,
  ZoomIn,
  ZoomOut,
  Maximize,
  Minimize,
  Expand,
  Shrink,
  Archive,
  Package,
  Box,
  Gift,
  ShoppingCart,
  ShoppingBag,
  CreditCard,
  DollarSign,
  Euro,
  PoundSterling,
  Yen,
  Wallet,
  Coins,
  Banknote,
  Receipt,
  Calculator,
  PieChart,
  LineChart,
  AreaChart,
  BarChart,
  Gauge,
  Thermometer,
  Ruler,
  Scale,
  Weight,
  Hourglass,
  Sand,
  Snowflake,
  Sun,
  Moon,
  CloudRain,
  CloudSnow,
  Tornado,
  Zap as Lightning,
  Flame,
  Droplets,
  Wind,
  Rainbow,
  Sunrise,
  Sunset,
  Mountain,
  Tree,
  Flower,
  Leaf,
  Seedling,
  Cactus,
  Cherry,
  Apple,
  Grape,
  Carrot,
  Corn,
  Wheat,
  Coffee,
  Wine,
  Beer,
  Soup,
  Pizza,
  Cake,
  Cookie,
  IceCream,
  Candy,
  Lollipop,
  Donut,
  Croissant,
  Sandwich,
  Hamburger,
  Fries,
  Popcorn,
  Pretzel,
  Bagel,
  Pancakes,
  Waffle,
  Egg,
  Bacon,
  Cheese,
  Milk,
  Bread,
  Butter,
  Salt,
  Pepper,
  Honey,
  Sugar,
  Spoon,
  Fork,
  Knife,
  Plate,
  Bowl,
  Cup,
  Glass,
  Bottle,
  Can,
  Jar
} from 'lucide-react';

interface AutomationPipeline {
  id: string;
  name: string;
  description: string;
  category: 'content_creation' | 'publishing' | 'analytics' | 'maintenance' | 'marketing' | 'moderation';
  status: 'active' | 'paused' | 'error' | 'draft' | 'running';
  priority: 'critical' | 'high' | 'medium' | 'low';
  trigger: {
    type: 'schedule' | 'event' | 'webhook' | 'manual' | 'conditional';
    schedule?: {
      frequency: 'hourly' | 'daily' | 'weekly' | 'monthly' | 'custom';
      time?: string;
      timezone: string;
      enabled: boolean;
    };
    event?: {
      source: string;
      condition: string;
    };
    webhook?: {
      url: string;
      method: 'GET' | 'POST' | 'PUT';
      headers: Record<string, string>;
    };
    conditional?: {
      conditions: Array<{
        field: string;
        operator: 'equals' | 'contains' | 'greater_than' | 'less_than';
        value: string;
      }>;
      logic: 'AND' | 'OR';
    };
  };
  steps: Array<{
    id: string;
    name: string;
    type: 'fetch_news' | 'generate_script' | 'create_video' | 'upload_youtube' | 'send_notification' | 'analyze_data' | 'moderate_content' | 'backup_data' | 'custom_action';
    config: {
      timeout: number; // segundos
      retries: number;
      retryDelay: number; // segundos
      continueOnError: boolean;
      parameters: Record<string, any>;
    };
    dependencies: string[]; // IDs dos steps que devem completar antes
    parallel: boolean; // pode executar em paralelo com outros steps
    estimated_duration: number; // segundos
    success_criteria: string[];
    failure_actions: Array<{
      action: 'retry' | 'skip' | 'stop' | 'notify' | 'rollback';
      parameters?: Record<string, any>;
    }>;
  }>;
  variables: Record<string, {
    type: 'string' | 'number' | 'boolean' | 'array' | 'object';
    default_value: any;
    description: string;
    required: boolean;
  }>;
  notifications: {
    on_start: {
      enabled: boolean;
      recipients: string[];
      channels: ('email' | 'slack' | 'discord' | 'webhook')[];
    };
    on_success: {
      enabled: boolean;
      recipients: string[];
      channels: ('email' | 'slack' | 'discord' | 'webhook')[];
    };
    on_failure: {
      enabled: boolean;
      recipients: string[];
      channels: ('email' | 'slack' | 'discord' | 'webhook')[];
    };
    on_warning: {
      enabled: boolean;
      recipients: string[];
      channels: ('email' | 'slack' | 'discord' | 'webhook')[];
    };
  };
  permissions: {
    view: string[];
    edit: string[];
    execute: string[];
    delete: string[];
  };
  version: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  last_run: {
    id: string;
    timestamp: string;
    duration: number;
    status: 'success' | 'failed' | 'partial' | 'cancelled';
    steps_completed: number;
    steps_total: number;
    error_message?: string;
    output?: any;
  };
  statistics: {
    total_runs: number;
    success_rate: number;
    avg_duration: number;
    last_success: string;
    last_failure: string;
    performance_trend: 'improving' | 'stable' | 'declining';
  };
  monitoring: {
    health_check: {
      enabled: boolean;
      interval: number; // minutos
      endpoint?: string;
      expected_response?: string;
    };
    alerts: {
      enabled: boolean;
      duration_threshold: number; // segundos
      failure_threshold: number; // número de falhas consecutivas
      memory_threshold: number; // MB
      cpu_threshold: number; // porcentagem
    };
  };
}

interface PipelineExecution {
  id: string;
  pipeline_id: string;
  pipeline_name: string;
  status: 'queued' | 'running' | 'success' | 'failed' | 'cancelled' | 'partial';
  started_at: string;
  completed_at?: string;
  duration?: number;
  triggered_by: {
    type: 'schedule' | 'manual' | 'webhook' | 'event';
    user?: string;
    source?: string;
  };
  steps: Array<{
    id: string;
    name: string;
    status: 'pending' | 'running' | 'success' | 'failed' | 'skipped';
    started_at?: string;
    completed_at?: string;
    duration?: number;
    output?: any;
    error?: {
      message: string;
      code: string;
      stack?: string;
    };
    logs: Array<{
      timestamp: string;
      level: 'debug' | 'info' | 'warn' | 'error';
      message: string;
    }>;
  }>;
  variables: Record<string, any>;
  resource_usage: {
    max_memory: number; // MB
    avg_cpu: number; // porcentagem
    network_io: number; // MB
    disk_io: number; // MB
  };
  artifacts: Array<{
    name: string;
    type: 'file' | 'url' | 'data';
    location: string;
    size?: number;
    created_at: string;
  }>;
}

interface AutomationTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  complexity: 'beginner' | 'intermediate' | 'advanced';
  estimated_setup_time: number; // minutos
  use_cases: string[];
  required_integrations: string[];
  template_config: {
    steps: Array<{
      name: string;
      type: string;
      description: string;
      required_parameters: string[];
      optional_parameters: string[];
    }>;
    default_variables: Record<string, any>;
    recommended_schedule: string;
  };
  usage_count: number;
  rating: number;
  reviews: Array<{
    user: string;
    rating: number;
    comment: string;
    date: string;
  }>;
}

interface SystemMetrics {
  pipelines: {
    total: number;
    active: number;
    running: number;
    failed: number;
  };
  executions: {
    today: number;
    this_week: number;
    this_month: number;
    success_rate: number;
  };
  resources: {
    cpu_usage: number;
    memory_usage: number;
    storage_usage: number;
    network_usage: number;
  };
  performance: {
    avg_execution_time: number;
    queue_length: number;
    throughput: number; // execuções por hora
    error_rate: number;
  };
}

const mockPipelines: AutomationPipeline[] = [
  {
    id: 'pipeline_001',
    name: 'Produção Completa de Conteúdo',
    description: 'Pipeline automatizado que coleta notícias, gera scripts, cria vídeos e publica no YouTube',
    category: 'content_creation',
    status: 'active',
    priority: 'critical',
    trigger: {
      type: 'schedule',
      schedule: {
        frequency: 'daily',
        time: '08:00',
        timezone: 'America/Sao_Paulo',
        enabled: true
      }
    },
    steps: [
      {
        id: 'step_001',
        name: 'Buscar Notícias Trending',
        type: 'fetch_news',
        config: {
          timeout: 300,
          retries: 3,
          retryDelay: 60,
          continueOnError: false,
          parameters: {
            sources: ['newsapi', 'google_news', 'reddit'],
            keywords: ['mistério', 'crime', 'paranormal', 'sobrenatural'],
            max_articles: 20,
            language: 'pt'
          }
        },
        dependencies: [],
        parallel: false,
        estimated_duration: 120,
        success_criteria: ['articles_found > 5', 'quality_score > 0.7'],
        failure_actions: [
          { action: 'retry', parameters: { max_attempts: 3 } },
          { action: 'notify', parameters: { urgency: 'high' } }
        ]
      },
      {
        id: 'step_002',
        name: 'Gerar Script Dark News',
        type: 'generate_script',
        config: {
          timeout: 600,
          retries: 2,
          retryDelay: 30,
          continueOnError: false,
          parameters: {
            style: 'dark_mystery',
            target_duration: 600,
            language: 'pt-BR',
            tone: 'dramatic',
            include_sources: true
          }
        },
        dependencies: ['step_001'],
        parallel: false,
        estimated_duration: 300,
        success_criteria: ['script_length > 500', 'readability_score > 0.8'],
        failure_actions: [
          { action: 'retry', parameters: { alternative_model: 'gpt-4' } },
          { action: 'stop' }
        ]
      },
      {
        id: 'step_003',
        name: 'Criar Avatar Video',
        type: 'create_video',
        config: {
          timeout: 1800,
          retries: 1,
          retryDelay: 120,
          continueOnError: false,
          parameters: {
            avatar_id: 'dark_presenter_01',
            voice_id: 'brazilian_male_deep',
            background: 'dark_studio',
            quality: 'high',
            format: 'mp4'
          }
        },
        dependencies: ['step_002'],
        parallel: false,
        estimated_duration: 900,
        success_criteria: ['video_created', 'duration_match', 'quality_check'],
        failure_actions: [
          { action: 'retry', parameters: { fallback_avatar: 'default' } },
          { action: 'notify' }
        ]
      },
      {
        id: 'step_004',
        name: 'Otimizar SEO e Metadata',
        type: 'custom_action',
        config: {
          timeout: 180,
          retries: 2,
          retryDelay: 30,
          continueOnError: true,
          parameters: {
            title_optimization: true,
            description_generation: true,
            tags_suggestion: true,
            thumbnail_generation: true
          }
        },
        dependencies: ['step_003'],
        parallel: true,
        estimated_duration: 120,
        success_criteria: ['title_optimized', 'tags_generated'],
        failure_actions: [
          { action: 'skip' }
        ]
      },
      {
        id: 'step_005',
        name: 'Publicar no YouTube',
        type: 'upload_youtube',
        config: {
          timeout: 900,
          retries: 3,
          retryDelay: 180,
          continueOnError: false,
          parameters: {
            privacy: 'public',
            category: 'news',
            scheduled_time: null,
            monetization: true,
            community_post: true
          }
        },
        dependencies: ['step_003', 'step_004'],
        parallel: false,
        estimated_duration: 600,
        success_criteria: ['upload_successful', 'video_published'],
        failure_actions: [
          { action: 'retry', parameters: { privacy: 'unlisted' } },
          { action: 'notify', parameters: { urgency: 'critical' } }
        ]
      },
      {
        id: 'step_006',
        name: 'Notificar Equipe',
        type: 'send_notification',
        config: {
          timeout: 60,
          retries: 2,
          retryDelay: 15,
          continueOnError: true,
          parameters: {
            channels: ['slack', 'email'],
            template: 'content_published',
            include_metrics: true
          }
        },
        dependencies: ['step_005'],
        parallel: true,
        estimated_duration: 30,
        success_criteria: ['notifications_sent'],
        failure_actions: [
          { action: 'skip' }
        ]
      }
    ],
    variables: {
      target_audience: {
        type: 'string',
        default_value: 'brasileiro_adulto',
        description: 'Público-alvo para o conteúdo',
        required: true
      },
      content_quality: {
        type: 'number',
        default_value: 0.8,
        description: 'Threshold mínimo de qualidade (0-1)',
        required: true
      },
      max_duration: {
        type: 'number',
        default_value: 900,
        description: 'Duração máxima do vídeo em segundos',
        required: false
      }
    },
    notifications: {
      on_start: {
        enabled: true,
        recipients: ['producer@darknews.com'],
        channels: ['slack']
      },
      on_success: {
        enabled: true,
        recipients: ['team@darknews.com'],
        channels: ['slack', 'email']
      },
      on_failure: {
        enabled: true,
        recipients: ['admin@darknews.com', 'producer@darknews.com'],
        channels: ['slack', 'email']
      },
      on_warning: {
        enabled: true,
        recipients: ['producer@darknews.com'],
        channels: ['slack']
      }
    },
    permissions: {
      view: ['all'],
      edit: ['admin', 'producer'],
      execute: ['admin', 'producer', 'automation'],
      delete: ['admin']
    },
    version: '2.1.3',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-03-08T14:30:00Z',
    created_by: 'admin@darknews.com',
    last_run: {
      id: 'exec_001',
      timestamp: '2024-03-08T08:00:15Z',
      duration: 2847,
      status: 'success',
      steps_completed: 6,
      steps_total: 6,
      output: {
        video_id: 'yt_abc123',
        video_url: 'https://youtube.com/watch?v=abc123',
        views_24h: 15420
      }
    },
    statistics: {
      total_runs: 87,
      success_rate: 94.3,
      avg_duration: 2734,
      last_success: '2024-03-08T08:00:15Z',
      last_failure: '2024-03-06T08:00:20Z',
      performance_trend: 'stable'
    },
    monitoring: {
      health_check: {
        enabled: true,
        interval: 30,
        endpoint: '/api/health/content-pipeline',
        expected_response: 'healthy'
      },
      alerts: {
        enabled: true,
        duration_threshold: 3600,
        failure_threshold: 2,
        memory_threshold: 2048,
        cpu_threshold: 80
      }
    }
  },
  {
    id: 'pipeline_002',
    name: 'Moderação de Conteúdo',
    description: 'Pipeline de moderação automática para comentários e interações',
    category: 'moderation',
    status: 'active',
    priority: 'high',
    trigger: {
      type: 'event',
      event: {
        source: 'youtube_webhook',
        condition: 'new_comment'
      }
    },
    steps: [
      {
        id: 'step_201',
        name: 'Analisar Comentário',
        type: 'moderate_content',
        config: {
          timeout: 120,
          retries: 2,
          retryDelay: 10,
          continueOnError: false,
          parameters: {
            check_toxicity: true,
            check_spam: true,
            check_language: true,
            sentiment_analysis: true
          }
        },
        dependencies: [],
        parallel: false,
        estimated_duration: 15,
        success_criteria: ['analysis_complete', 'score_calculated'],
        failure_actions: [
          { action: 'retry' },
          { action: 'skip' }
        ]
      },
      {
        id: 'step_202',
        name: 'Aplicar Ação',
        type: 'custom_action',
        config: {
          timeout: 60,
          retries: 1,
          retryDelay: 5,
          continueOnError: true,
          parameters: {
            auto_approve_threshold: 0.9,
            auto_reject_threshold: 0.3,
            manual_review_threshold: 0.6
          }
        },
        dependencies: ['step_201'],
        parallel: false,
        estimated_duration: 10,
        success_criteria: ['action_applied'],
        failure_actions: [
          { action: 'notify', parameters: { urgency: 'medium' } }
        ]
      }
    ],
    variables: {
      strictness_level: {
        type: 'string',
        default_value: 'medium',
        description: 'Nível de rigidez da moderação',
        required: true
      }
    },
    notifications: {
      on_start: {
        enabled: false,
        recipients: [],
        channels: []
      },
      on_success: {
        enabled: false,
        recipients: [],
        channels: []
      },
      on_failure: {
        enabled: true,
        recipients: ['moderator@darknews.com'],
        channels: ['slack']
      },
      on_warning: {
        enabled: true,
        recipients: ['moderator@darknews.com'],
        channels: ['slack']
      }
    },
    permissions: {
      view: ['all'],
      edit: ['admin', 'moderator'],
      execute: ['admin', 'moderator', 'automation'],
      delete: ['admin']
    },
    version: '1.5.2',
    created_at: '2024-02-01T12:00:00Z',
    updated_at: '2024-03-07T16:20:00Z',
    created_by: 'moderator@darknews.com',
    last_run: {
      id: 'exec_002',
      timestamp: '2024-03-08T15:45:23Z',
      duration: 18,
      status: 'success',
      steps_completed: 2,
      steps_total: 2,
      output: {
        action: 'approved',
        confidence: 0.92,
        comment_id: 'yt_comment_456'
      }
    },
    statistics: {
      total_runs: 2847,
      success_rate: 98.7,
      avg_duration: 22,
      last_success: '2024-03-08T15:45:23Z',
      last_failure: '2024-03-07T09:12:15Z',
      performance_trend: 'improving'
    },
    monitoring: {
      health_check: {
        enabled: true,
        interval: 5,
        endpoint: '/api/health/moderation-pipeline'
      },
      alerts: {
        enabled: true,
        duration_threshold: 300,
        failure_threshold: 5,
        memory_threshold: 512,
        cpu_threshold: 60
      }
    }
  },
  {
    id: 'pipeline_003',
    name: 'Backup e Manutenção',
    description: 'Pipeline de backup automático e manutenção do sistema',
    category: 'maintenance',
    status: 'active',
    priority: 'medium',
    trigger: {
      type: 'schedule',
      schedule: {
        frequency: 'daily',
        time: '02:00',
        timezone: 'America/Sao_Paulo',
        enabled: true
      }
    },
    steps: [
      {
        id: 'step_301',
        name: 'Backup Banco de Dados',
        type: 'backup_data',
        config: {
          timeout: 1800,
          retries: 2,
          retryDelay: 300,
          continueOnError: false,
          parameters: {
            type: 'full',
            compression: true,
            encryption: true,
            destination: 's3://darknews-backups/'
          }
        },
        dependencies: [],
        parallel: false,
        estimated_duration: 900,
        success_criteria: ['backup_completed', 'verification_passed'],
        failure_actions: [
          { action: 'retry' },
          { action: 'notify', parameters: { urgency: 'critical' } }
        ]
      },
      {
        id: 'step_302',
        name: 'Limpeza de Arquivos Temporários',
        type: 'custom_action',
        config: {
          timeout: 300,
          retries: 1,
          retryDelay: 60,
          continueOnError: true,
          parameters: {
            cleanup_temp: true,
            cleanup_logs: true,
            retention_days: 30
          }
        },
        dependencies: [],
        parallel: true,
        estimated_duration: 180,
        success_criteria: ['cleanup_completed'],
        failure_actions: [
          { action: 'skip' }
        ]
      },
      {
        id: 'step_303',
        name: 'Relatório de Saúde',
        type: 'analyze_data',
        config: {
          timeout: 240,
          retries: 1,
          retryDelay: 30,
          continueOnError: true,
          parameters: {
            check_disk_space: true,
            check_memory: true,
            check_performance: true,
            generate_report: true
          }
        },
        dependencies: ['step_301'],
        parallel: false,
        estimated_duration: 120,
        success_criteria: ['report_generated'],
        failure_actions: [
          { action: 'skip' }
        ]
      }
    ],
    variables: {
      backup_retention: {
        type: 'number',
        default_value: 30,
        description: 'Dias para manter backups',
        required: true
      }
    },
    notifications: {
      on_start: {
        enabled: false,
        recipients: [],
        channels: []
      },
      on_success: {
        enabled: true,
        recipients: ['sysadmin@darknews.com'],
        channels: ['email']
      },
      on_failure: {
        enabled: true,
        recipients: ['sysadmin@darknews.com', 'admin@darknews.com'],
        channels: ['slack', 'email']
      },
      on_warning: {
        enabled: true,
        recipients: ['sysadmin@darknews.com'],
        channels: ['slack']
      }
    },
    permissions: {
      view: ['admin', 'sysadmin'],
      edit: ['admin', 'sysadmin'],
      execute: ['admin', 'sysadmin', 'automation'],
      delete: ['admin']
    },
    version: '1.2.1',
    created_at: '2024-01-20T08:00:00Z',
    updated_at: '2024-02-28T11:15:00Z',
    created_by: 'sysadmin@darknews.com',
    last_run: {
      id: 'exec_003',
      timestamp: '2024-03-08T02:00:10Z',
      duration: 1247,
      status: 'success',
      steps_completed: 3,
      steps_total: 3,
      output: {
        backup_size: '4.2GB',
        cleanup_freed: '1.8GB',
        system_health: 'good'
      }
    },
    statistics: {
      total_runs: 47,
      success_rate: 97.9,
      avg_duration: 1186,
      last_success: '2024-03-08T02:00:10Z',
      last_failure: '2024-02-25T02:00:15Z',
      performance_trend: 'stable'
    },
    monitoring: {
      health_check: {
        enabled: true,
        interval: 60,
        endpoint: '/api/health/maintenance-pipeline'
      },
      alerts: {
        enabled: true,
        duration_threshold: 3600,
        failure_threshold: 1,
        memory_threshold: 1024,
        cpu_threshold: 50
      }
    }
  }
];

const mockExecutions: PipelineExecution[] = [
  {
    id: 'exec_001',
    pipeline_id: 'pipeline_001',
    pipeline_name: 'Produção Completa de Conteúdo',
    status: 'success',
    started_at: '2024-03-08T08:00:15Z',
    completed_at: '2024-03-08T08:47:42Z',
    duration: 2847,
    triggered_by: {
      type: 'schedule',
      source: 'cron'
    },
    steps: [
      {
        id: 'step_001',
        name: 'Buscar Notícias Trending',
        status: 'success',
        started_at: '2024-03-08T08:00:15Z',
        completed_at: '2024-03-08T08:02:23Z',
        duration: 128,
        output: {
          articles_found: 18,
          quality_scores: [0.89, 0.84, 0.91, 0.76],
          selected_article: 'Mistério em cidade pequena choca moradores'
        },
        logs: [
          { timestamp: '08:00:15', level: 'info', message: 'Iniciando busca de notícias' },
          { timestamp: '08:00:45', level: 'info', message: 'Encontrados 18 artigos relevantes' },
          { timestamp: '08:02:10', level: 'info', message: 'Artigo selecionado: score 0.91' },
          { timestamp: '08:02:23', level: 'info', message: 'Busca concluída com sucesso' }
        ]
      },
      {
        id: 'step_002',
        name: 'Gerar Script Dark News',
        status: 'success',
        started_at: '2024-03-08T08:02:23Z',
        completed_at: '2024-03-08T08:07:45Z',
        duration: 322,
        output: {
          script_length: 847,
          readability_score: 0.86,
          tone_analysis: 'dramatic_appropriate',
          estimated_duration: 578
        },
        logs: [
          { timestamp: '08:02:23', level: 'info', message: 'Iniciando geração de script' },
          { timestamp: '08:03:15', level: 'info', message: 'Analisando conteúdo da notícia' },
          { timestamp: '08:05:30', level: 'info', message: 'Script gerado: 847 palavras' },
          { timestamp: '08:07:45', level: 'info', message: 'Validação de qualidade aprovada' }
        ]
      },
      {
        id: 'step_003',
        name: 'Criar Avatar Video',
        status: 'success',
        started_at: '2024-03-08T08:07:45Z',
        completed_at: '2024-03-08T08:22:18Z',
        duration: 873,
        output: {
          video_path: '/tmp/videos/video_20240308_080745.mp4',
          duration: 582,
          resolution: '1920x1080',
          file_size: '145MB'
        },
        logs: [
          { timestamp: '08:07:45', level: 'info', message: 'Iniciando criação de vídeo' },
          { timestamp: '08:09:12', level: 'info', message: 'Avatar carregado: dark_presenter_01' },
          { timestamp: '08:15:30', level: 'info', message: 'Renderização 65% completa' },
          { timestamp: '08:22:18', level: 'info', message: 'Vídeo criado com sucesso' }
        ]
      },
      {
        id: 'step_004',
        name: 'Otimizar SEO e Metadata',
        status: 'success',
        started_at: '2024-03-08T08:22:18Z',
        completed_at: '2024-03-08T08:24:35Z',
        duration: 137,
        output: {
          optimized_title: 'MISTÉRIO REAL: O Caso Que Aterrorizou Uma Cidade Inteira | Investigação Completa',
          tags_generated: ['mistério real', 'crime', 'investigação', 'brasil', 'caso não resolvido'],
          thumbnail_created: true,
          seo_score: 0.94
        },
        logs: [
          { timestamp: '08:22:18', level: 'info', message: 'Iniciando otimização SEO' },
          { timestamp: '08:23:45', level: 'info', message: 'Título otimizado gerado' },
          { timestamp: '08:24:12', level: 'info', message: 'Tags sugeridas: 5 itens' },
          { timestamp: '08:24:35', level: 'info', message: 'SEO otimizado com score 0.94' }
        ]
      },
      {
        id: 'step_005',
        name: 'Publicar no YouTube',
        status: 'success',
        started_at: '2024-03-08T08:24:35Z',
        completed_at: '2024-03-08T08:46:12Z',
        duration: 1297,
        output: {
          video_id: 'dQw4w9WgXcQ',
          video_url: 'https://youtube.com/watch?v=dQw4w9WgXcQ',
          upload_status: 'published',
          monetization_enabled: true
        },
        logs: [
          { timestamp: '08:24:35', level: 'info', message: 'Iniciando upload para YouTube' },
          { timestamp: '08:35:20', level: 'info', message: 'Upload 70% completo' },
          { timestamp: '08:43:45', level: 'info', message: 'Processamento YouTube concluído' },
          { timestamp: '08:46:12', level: 'info', message: 'Vídeo publicado com sucesso' }
        ]
      },
      {
        id: 'step_006',
        name: 'Notificar Equipe',
        status: 'success',
        started_at: '2024-03-08T08:46:12Z',
        completed_at: '2024-03-08T08:47:42Z',
        duration: 90,
        output: {
          notifications_sent: 3,
          channels_used: ['slack', 'email'],
          recipients_reached: 5
        },
        logs: [
          { timestamp: '08:46:12', level: 'info', message: 'Enviando notificações' },
          { timestamp: '08:46:45', level: 'info', message: 'Slack: mensagem enviada' },
          { timestamp: '08:47:20', level: 'info', message: 'Email: 5 destinatários' },
          { timestamp: '08:47:42', level: 'info', message: 'Todas as notificações enviadas' }
        ]
      }
    ],
    variables: {
      target_audience: 'brasileiro_adulto',
      content_quality: 0.8,
      max_duration: 900
    },
    resource_usage: {
      max_memory: 1847,
      avg_cpu: 45,
      network_io: 156,
      disk_io: 89
    },
    artifacts: [
      {
        name: 'generated_script.txt',
        type: 'file',
        location: '/tmp/artifacts/script_20240308_080223.txt',
        size: 3247,
        created_at: '2024-03-08T08:07:45Z'
      },
      {
        name: 'final_video.mp4',
        type: 'file',
        location: '/tmp/artifacts/video_20240308_080745.mp4',
        size: 152043520,
        created_at: '2024-03-08T08:22:18Z'
      },
      {
        name: 'youtube_video',
        type: 'url',
        location: 'https://youtube.com/watch?v=dQw4w9WgXcQ',
        created_at: '2024-03-08T08:46:12Z'
      }
    ]
  },
  {
    id: 'exec_004',
    pipeline_id: 'pipeline_001',
    pipeline_name: 'Produção Completa de Conteúdo',
    status: 'failed',
    started_at: '2024-03-07T08:00:20Z',
    completed_at: '2024-03-07T08:15:45Z',
    duration: 925,
    triggered_by: {
      type: 'schedule',
      source: 'cron'
    },
    steps: [
      {
        id: 'step_001',
        name: 'Buscar Notícias Trending',
        status: 'success',
        started_at: '2024-03-07T08:00:20Z',
        completed_at: '2024-03-07T08:02:15Z',
        duration: 115,
        output: {
          articles_found: 12,
          quality_scores: [0.67, 0.72, 0.59],
          selected_article: 'Evento paranormal relatado em escola'
        },
        logs: [
          { timestamp: '08:00:20', level: 'info', message: 'Iniciando busca de notícias' },
          { timestamp: '08:02:15', level: 'warn', message: 'Poucos artigos de alta qualidade encontrados' }
        ]
      },
      {
        id: 'step_002',
        name: 'Gerar Script Dark News',
        status: 'failed',
        started_at: '2024-03-07T08:02:15Z',
        completed_at: '2024-03-07T08:15:45Z',
        duration: 810,
        error: {
          message: 'OpenAI API rate limit exceeded',
          code: 'RATE_LIMIT_ERROR',
          stack: 'Error: Rate limit exceeded...'
        },
        logs: [
          { timestamp: '08:02:15', level: 'info', message: 'Iniciando geração de script' },
          { timestamp: '08:10:30', level: 'warn', message: 'API response lenta detectada' },
          { timestamp: '08:15:45', level: 'error', message: 'Falha na API: rate limit exceeded' }
        ]
      },
      {
        id: 'step_003',
        name: 'Criar Avatar Video',
        status: 'skipped',
        logs: [
          { timestamp: '08:15:45', level: 'info', message: 'Step pulado devido a falha anterior' }
        ]
      },
      {
        id: 'step_004',
        name: 'Otimizar SEO e Metadata',
        status: 'skipped',
        logs: []
      },
      {
        id: 'step_005',
        name: 'Publicar no YouTube',
        status: 'skipped',
        logs: []
      },
      {
        id: 'step_006',
        name: 'Notificar Equipe',
        status: 'skipped',
        logs: []
      }
    ],
    variables: {
      target_audience: 'brasileiro_adulto',
      content_quality: 0.8,
      max_duration: 900
    },
    resource_usage: {
      max_memory: 678,
      avg_cpu: 23,
      network_io: 45,
      disk_io: 12
    },
    artifacts: []
  }
];

const mockTemplates: AutomationTemplate[] = [
  {
    id: 'template_001',
    name: 'Produção de Conteúdo Básica',
    description: 'Template simples para criação automática de vídeos a partir de notícias',
    category: 'content_creation',
    icon: 'Video',
    complexity: 'beginner',
    estimated_setup_time: 15,
    use_cases: [
      'Criação diária de conteúdo',
      'Automatização de produção',
      'Geração de vídeos noticiosos'
    ],
    required_integrations: ['NewsAPI', 'OpenAI', 'HeyGen', 'YouTube'],
    template_config: {
      steps: [
        {
          name: 'Buscar Notícias',
          type: 'fetch_news',
          description: 'Coleta notícias de fontes configuradas',
          required_parameters: ['sources', 'keywords'],
          optional_parameters: ['max_articles', 'language']
        },
        {
          name: 'Gerar Script',
          type: 'generate_script',
          description: 'Cria roteiro baseado na notícia selecionada',
          required_parameters: ['style', 'language'],
          optional_parameters: ['target_duration', 'tone']
        },
        {
          name: 'Criar Vídeo',
          type: 'create_video',
          description: 'Gera vídeo com avatar AI',
          required_parameters: ['avatar_id', 'voice_id'],
          optional_parameters: ['background', 'quality']
        },
        {
          name: 'Publicar',
          type: 'upload_youtube',
          description: 'Publica vídeo no YouTube',
          required_parameters: ['privacy'],
          optional_parameters: ['scheduled_time', 'monetization']
        }
      ],
      default_variables: {
        content_style: 'informativo',
        target_duration: 300,
        video_quality: 'medium'
      },
      recommended_schedule: 'daily'
    },
    usage_count: 234,
    rating: 4.7,
    reviews: [
      {
        user: 'producer@example.com',
        rating: 5,
        comment: 'Template muito útil, economizou horas de trabalho!',
        date: '2024-03-01'
      },
      {
        user: 'content@example.com',
        rating: 4,
        comment: 'Funciona bem, mas poderia ter mais opções de customização',
        date: '2024-02-25'
      }
    ]
  },
  {
    id: 'template_002',
    name: 'Moderação Inteligente',
    description: 'Template para moderação automática de comentários com IA',
    category: 'moderation',
    icon: 'Shield',
    complexity: 'intermediate',
    estimated_setup_time: 25,
    use_cases: [
      'Moderação de comentários',
      'Detecção de spam',
      'Análise de sentimento',
      'Proteção da comunidade'
    ],
    required_integrations: ['YouTube API', 'Google Cloud AI', 'Slack'],
    template_config: {
      steps: [
        {
          name: 'Receber Comentário',
          type: 'webhook_trigger',
          description: 'Recebe notificação de novo comentário',
          required_parameters: ['webhook_url'],
          optional_parameters: ['auth_token']
        },
        {
          name: 'Analisar Conteúdo',
          type: 'moderate_content',
          description: 'Analisa toxicidade e spam',
          required_parameters: ['analysis_types'],
          optional_parameters: ['confidence_threshold']
        },
        {
          name: 'Aplicar Ação',
          type: 'apply_moderation',
          description: 'Aprova, rejeita ou sinaliza para revisão',
          required_parameters: ['action_rules'],
          optional_parameters: ['manual_review_threshold']
        },
        {
          name: 'Notificar Moderadores',
          type: 'send_notification',
          description: 'Envia alerta para moderadores se necessário',
          required_parameters: ['notification_channels'],
          optional_parameters: ['urgency_levels']
        }
      ],
      default_variables: {
        toxicity_threshold: 0.7,
        spam_threshold: 0.8,
        auto_approve_threshold: 0.9
      },
      recommended_schedule: 'event_driven'
    },
    usage_count: 156,
    rating: 4.5,
    reviews: [
      {
        user: 'moderator@example.com',
        rating: 5,
        comment: 'Reduziu drasticamente o trabalho manual de moderação',
        date: '2024-02-28'
      }
    ]
  },
  {
    id: 'template_003',
    name: 'Analytics e Relatórios',
    description: 'Template para geração automática de relatórios de performance',
    category: 'analytics',
    icon: 'BarChart3',
    complexity: 'advanced',
    estimated_setup_time: 45,
    use_cases: [
      'Relatórios de performance',
      'Análise de métricas',
      'Dashboards automáticos',
      'Insights de audiência'
    ],
    required_integrations: ['YouTube Analytics', 'Google Analytics', 'Database', 'Email'],
    template_config: {
      steps: [
        {
          name: 'Coletar Métricas',
          type: 'fetch_analytics',
          description: 'Coleta dados de múltiplas fontes',
          required_parameters: ['data_sources', 'time_range'],
          optional_parameters: ['metrics_list', 'filters']
        },
        {
          name: 'Processar Dados',
          type: 'analyze_data',
          description: 'Processa e analisa os dados coletados',
          required_parameters: ['analysis_type'],
          optional_parameters: ['comparison_periods', 'benchmarks']
        },
        {
          name: 'Gerar Relatório',
          type: 'generate_report',
          description: 'Cria relatório visual com insights',
          required_parameters: ['report_template'],
          optional_parameters: ['charts_config', 'export_format']
        },
        {
          name: 'Distribuir Relatório',
          type: 'send_report',
          description: 'Envia relatório para stakeholders',
          required_parameters: ['recipients'],
          optional_parameters: ['delivery_methods', 'schedule']
        }
      ],
      default_variables: {
        report_frequency: 'weekly',
        include_charts: true,
        export_format: 'pdf'
      },
      recommended_schedule: 'weekly'
    },
    usage_count: 89,
    rating: 4.8,
    reviews: [
      {
        user: 'analyst@example.com',
        rating: 5,
        comment: 'Relatórios muito detalhados e profissionais',
        date: '2024-03-05'
      }
    ]
  }
];

const mockMetrics: SystemMetrics = {
  pipelines: {
    total: 23,
    active: 18,
    running: 3,
    failed: 1
  },
  executions: {
    today: 47,
    this_week: 298,
    this_month: 1247,
    success_rate: 94.3
  },
  resources: {
    cpu_usage: 34,
    memory_usage: 67,
    storage_usage: 78,
    network_usage: 23
  },
  performance: {
    avg_execution_time: 1847,
    queue_length: 5,
    throughput: 12.4,
    error_rate: 5.7
  }
};

export default function AutomationPipelines() {
  const [selectedTab, setSelectedTab] = useState('overview');
  const [pipelineFilter, setPipelineFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showPipelineDialog, setShowPipelineDialog] = useState(false);
  const [showTemplateDialog, setShowTemplateDialog] = useState(false);
  const [selectedExecution, setSelectedExecution] = useState<string | null>(null);
  const { toast } = useToast();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
      case 'active': return 'text-green-500 bg-green-100 dark:bg-green-950';
      case 'running': return 'text-blue-500 bg-blue-100 dark:bg-blue-950';
      case 'failed':
      case 'error': return 'text-red-500 bg-red-100 dark:bg-red-950';
      case 'paused': return 'text-yellow-500 bg-yellow-100 dark:bg-yellow-950';
      case 'cancelled':
      case 'draft': return 'text-gray-500 bg-gray-100 dark:bg-gray-950';
      case 'partial': return 'text-orange-500 bg-orange-100 dark:bg-orange-950';
      case 'queued': return 'text-purple-500 bg-purple-100 dark:bg-purple-950';
      default: return 'text-gray-500 bg-gray-100 dark:bg-gray-950';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-500 bg-red-100 dark:bg-red-950';
      case 'high': return 'text-orange-500 bg-orange-100 dark:bg-orange-950';
      case 'medium': return 'text-yellow-500 bg-yellow-100 dark:bg-yellow-950';
      case 'low': return 'text-green-500 bg-green-100 dark:bg-green-950';
      default: return 'text-gray-500 bg-gray-100 dark:bg-gray-950';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'content_creation': return <Video className="h-4 w-4" />;
      case 'publishing': return <Upload className="h-4 w-4" />;
      case 'analytics': return <BarChart3 className="h-4 w-4" />;
      case 'maintenance': return <Settings className="h-4 w-4" />;
      case 'marketing': return <Target className="h-4 w-4" />;
      case 'moderation': return <Shield className="h-4 w-4" />;
      default: return <Zap className="h-4 w-4" />;
    }
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

  const handleRunPipeline = (pipelineId: string) => {
    toast({
      title: "Pipeline executado",
      description: "O pipeline foi adicionado à fila de execução",
    });
  };

  const handlePausePipeline = (pipelineId: string) => {
    toast({
      title: "Pipeline pausado",
      description: "O pipeline foi pausado com sucesso",
    });
  };

  const handleCreatePipeline = () => {
    toast({
      title: "Pipeline criado",
      description: "Novo pipeline foi criado com sucesso",
    });
    setShowPipelineDialog(false);
  };

  const handleUseTemplate = (templateId: string) => {
    toast({
      title: "Template aplicado",
      description: "Pipeline criado baseado no template selecionado",
    });
    setShowTemplateDialog(false);
  };

  const filteredPipelines = mockPipelines.filter(pipeline => {
    let matches = true;
    
    if (pipelineFilter !== 'all' && pipeline.status !== pipelineFilter) matches = false;
    if (searchTerm && !pipeline.name.toLowerCase().includes(searchTerm.toLowerCase())) matches = false;
    
    return matches;
  });

  return (
    <div className="container mx-auto px-6 py-8 max-w-7xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Automação e Pipelines</h1>
              <p className="text-muted-foreground">Gestão completa de fluxos automatizados e processos</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Dialog open={showTemplateDialog} onOpenChange={setShowTemplateDialog}>
              <DialogTrigger asChild>
                <Button variant="outline" data-testid="button-browse-templates">
                  <FileText className="h-4 w-4 mr-2" />
                  Templates
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl">
                <DialogHeader>
                  <DialogTitle>Templates de Automação</DialogTitle>
                  <DialogDescription>
                    Escolha um template para criar rapidamente um novo pipeline
                  </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                  {mockTemplates.map((template) => (
                    <Card key={template.id} className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center space-x-2">
                              {getCategoryIcon(template.category)}
                              <h3 className="font-semibold text-sm">{template.name}</h3>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {template.complexity === 'beginner' ? 'Iniciante' :
                               template.complexity === 'intermediate' ? 'Intermediário' : 'Avançado'}
                            </Badge>
                          </div>
                          
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {template.description}
                          </p>
                          
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">
                              {template.estimated_setup_time} min setup
                            </span>
                            <div className="flex items-center space-x-1">
                              <Star className="h-3 w-3 text-yellow-500 fill-current" />
                              <span>{template.rating}</span>
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap gap-1">
                            {template.use_cases.slice(0, 2).map((useCase, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {useCase}
                              </Badge>
                            ))}
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
            
            <Dialog open={showPipelineDialog} onOpenChange={setShowPipelineDialog}>
              <DialogTrigger asChild>
                <Button data-testid="button-new-pipeline">
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Pipeline
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl">
                <DialogHeader>
                  <DialogTitle>Criar Novo Pipeline</DialogTitle>
                  <DialogDescription>
                    Configure um novo pipeline de automação
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="pipeline-name">Nome do Pipeline</Label>
                      <Input id="pipeline-name" placeholder="Ex: Produção Diária" data-testid="input-pipeline-name" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pipeline-category">Categoria</Label>
                      <Select>
                        <SelectTrigger data-testid="select-pipeline-category">
                          <SelectValue placeholder="Categoria" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="content_creation">Criação de Conteúdo</SelectItem>
                          <SelectItem value="publishing">Publicação</SelectItem>
                          <SelectItem value="analytics">Analytics</SelectItem>
                          <SelectItem value="maintenance">Manutenção</SelectItem>
                          <SelectItem value="marketing">Marketing</SelectItem>
                          <SelectItem value="moderation">Moderação</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pipeline-description">Descrição</Label>
                    <Textarea
                      id="pipeline-description"
                      placeholder="Descreva o que este pipeline faz..."
                      data-testid="textarea-pipeline-description"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="pipeline-trigger">Gatilho</Label>
                      <Select>
                        <SelectTrigger data-testid="select-pipeline-trigger">
                          <SelectValue placeholder="Como será acionado" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="schedule">Agendamento</SelectItem>
                          <SelectItem value="event">Evento</SelectItem>
                          <SelectItem value="webhook">Webhook</SelectItem>
                          <SelectItem value="manual">Manual</SelectItem>
                          <SelectItem value="conditional">Condicional</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pipeline-priority">Prioridade</Label>
                      <Select>
                        <SelectTrigger data-testid="select-pipeline-priority">
                          <SelectValue placeholder="Prioridade" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="critical">Crítica</SelectItem>
                          <SelectItem value="high">Alta</SelectItem>
                          <SelectItem value="medium">Média</SelectItem>
                          <SelectItem value="low">Baixa</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Notificações</Label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Switch data-testid="switch-notify-start" />
                        <Label className="text-sm">Notificar ao iniciar</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch defaultChecked data-testid="switch-notify-success" />
                        <Label className="text-sm">Notificar em caso de sucesso</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch defaultChecked data-testid="switch-notify-failure" />
                        <Label className="text-sm">Notificar em caso de falha</Label>
                      </div>
                    </div>
                  </div>

                  <Button onClick={handleCreatePipeline} className="w-full" data-testid="button-create-pipeline">
                    Criar Pipeline
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
                  <p className="text-sm font-medium text-muted-foreground">Pipelines Ativos</p>
                  <p className="text-2xl font-bold">{mockMetrics.pipelines.active}</p>
                  <p className="text-xs text-green-500 flex items-center mt-1">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    {mockMetrics.pipelines.running} executando
                  </p>
                </div>
                <Activity className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Taxa de Sucesso</p>
                  <p className="text-2xl font-bold">{mockMetrics.executions.success_rate}%</p>
                  <p className="text-xs text-blue-500 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    Este mês
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
                  <p className="text-sm font-medium text-muted-foreground">Execuções Hoje</p>
                  <p className="text-2xl font-bold">{mockMetrics.executions.today}</p>
                  <p className="text-xs text-purple-500 flex items-center mt-1">
                    <Zap className="h-3 w-3 mr-1" />
                    {mockMetrics.performance.throughput}/h taxa
                  </p>
                </div>
                <Lightning className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Tempo Médio</p>
                  <p className="text-2xl font-bold">{formatDuration(mockMetrics.performance.avg_execution_time)}</p>
                  <p className="text-xs text-orange-500 flex items-center mt-1">
                    <Clock className="h-3 w-3 mr-1" />
                    Por execução
                  </p>
                </div>
                <Timer className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="pipelines">Pipelines</TabsTrigger>
            <TabsTrigger value="executions">Execuções</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="monitoring">Monitoramento</TabsTrigger>
          </TabsList>

          {/* Overview */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* System Status */}
              <Card>
                <CardHeader>
                  <CardTitle>Status do Sistema</CardTitle>
                  <CardDescription>Saúde geral da automação</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">CPU</span>
                      <span className="text-sm font-medium">{mockMetrics.resources.cpu_usage}%</span>
                    </div>
                    <Progress value={mockMetrics.resources.cpu_usage} />

                    <div className="flex items-center justify-between">
                      <span className="text-sm">Memória</span>
                      <span className="text-sm font-medium">{mockMetrics.resources.memory_usage}%</span>
                    </div>
                    <Progress value={mockMetrics.resources.memory_usage} />

                    <div className="flex items-center justify-between">
                      <span className="text-sm">Armazenamento</span>
                      <span className="text-sm font-medium">{mockMetrics.resources.storage_usage}%</span>
                    </div>
                    <Progress value={mockMetrics.resources.storage_usage} />

                    <div className="flex items-center justify-between">
                      <span className="text-sm">Rede</span>
                      <span className="text-sm font-medium">{mockMetrics.resources.network_usage}%</span>
                    </div>
                    <Progress value={mockMetrics.resources.network_usage} />
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Atividade Recente</CardTitle>
                  <CardDescription>Últimas execuções de pipeline</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {mockExecutions.slice(0, 5).map((execution) => (
                      <div key={execution.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          {getCategoryIcon('content_creation')}
                          <div>
                            <div className="font-medium text-sm">{execution.pipeline_name}</div>
                            <div className="text-xs text-muted-foreground">{execution.started_at}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className={getStatusColor(execution.status)}>
                            {execution.status === 'success' ? 'Sucesso' :
                             execution.status === 'failed' ? 'Falha' :
                             execution.status === 'running' ? 'Executando' :
                             execution.status === 'queued' ? 'Na Fila' : 'Cancelado'}
                          </Badge>
                          {execution.duration && (
                            <div className="text-xs text-muted-foreground mt-1">
                              {formatDuration(execution.duration)}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Performance Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Métricas de Performance</CardTitle>
                <CardDescription>Indicadores chave do sistema de automação</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                  <div>
                    <div className="text-2xl font-bold">{mockMetrics.performance.queue_length}</div>
                    <div className="text-sm text-muted-foreground">Na Fila</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{mockMetrics.performance.throughput.toFixed(1)}</div>
                    <div className="text-sm text-muted-foreground">Execuções/Hora</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{mockMetrics.performance.error_rate.toFixed(1)}%</div>
                    <div className="text-sm text-muted-foreground">Taxa de Erro</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{mockMetrics.executions.this_month}</div>
                    <div className="text-sm text-muted-foreground">Este Mês</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pipelines */}
          <TabsContent value="pipelines" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Pipelines de Automação</h3>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar pipelines..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                    data-testid="input-search-pipelines"
                  />
                </div>
                
                <Select value={pipelineFilter} onValueChange={setPipelineFilter}>
                  <SelectTrigger className="w-40" data-testid="select-pipeline-filter">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="active">Ativo</SelectItem>
                    <SelectItem value="paused">Pausado</SelectItem>
                    <SelectItem value="error">Erro</SelectItem>
                    <SelectItem value="draft">Rascunho</SelectItem>
                    <SelectItem value="running">Executando</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              {filteredPipelines.map((pipeline) => (
                <Card key={pipeline.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {/* Header do pipeline */}
                      <div className="flex items-start justify-between">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center space-x-2">
                            {getCategoryIcon(pipeline.category)}
                            <h3 className="font-semibold">{pipeline.name}</h3>
                            <Badge className={getStatusColor(pipeline.status)}>
                              {pipeline.status === 'active' ? 'Ativo' :
                               pipeline.status === 'paused' ? 'Pausado' :
                               pipeline.status === 'error' ? 'Erro' :
                               pipeline.status === 'draft' ? 'Rascunho' : 'Executando'}
                            </Badge>
                            <Badge className={getPriorityColor(pipeline.priority)}>
                              {pipeline.priority === 'critical' ? 'Crítica' :
                               pipeline.priority === 'high' ? 'Alta' :
                               pipeline.priority === 'medium' ? 'Média' : 'Baixa'}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{pipeline.description}</p>
                          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                            <span>Categoria: {pipeline.category.replace('_', ' ')}</span>
                            <span>Versão: {pipeline.version}</span>
                            <span>Etapas: {pipeline.steps.length}</span>
                            <span>Taxa de sucesso: {pipeline.statistics.success_rate}%</span>
                          </div>
                        </div>
                      </div>

                      {/* Trigger info */}
                      <div className="p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center space-x-2 mb-2">
                          <Clock className="h-4 w-4" />
                          <span className="text-sm font-medium">Gatilho:</span>
                          <span className="text-sm">
                            {pipeline.trigger.type === 'schedule' ? 
                              `Agendado - ${pipeline.trigger.schedule?.frequency} às ${pipeline.trigger.schedule?.time}` :
                             pipeline.trigger.type === 'event' ? 
                              `Evento - ${pipeline.trigger.event?.source}` :
                             pipeline.trigger.type === 'webhook' ? 
                              'Webhook' : 'Manual'}
                          </span>
                        </div>
                      </div>

                      {/* Últimas execuções */}
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Última Execução:</h4>
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <Play className="h-4 w-4" />
                            <div>
                              <div className="text-sm font-medium">{pipeline.last_run.timestamp}</div>
                              <div className="text-xs text-muted-foreground">
                                {pipeline.last_run.steps_completed}/{pipeline.last_run.steps_total} etapas - {formatDuration(pipeline.last_run.duration)}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge className={getStatusColor(pipeline.last_run.status)}>
                              {pipeline.last_run.status === 'success' ? 'Sucesso' :
                               pipeline.last_run.status === 'failed' ? 'Falha' :
                               pipeline.last_run.status === 'partial' ? 'Parcial' : 'Cancelado'}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      {/* Principais etapas */}
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Principais Etapas ({pipeline.steps.length}):</h4>
                        <div className="flex space-x-2 overflow-x-auto">
                          {pipeline.steps.slice(0, 4).map((step, index) => (
                            <div key={step.id} className="flex items-center space-x-2 min-w-fit p-2 border rounded">
                              <div className="w-6 h-6 bg-blue-100 dark:bg-blue-950 rounded-full flex items-center justify-center text-xs font-bold">
                                {index + 1}
                              </div>
                              <span className="text-xs">{step.name}</span>
                            </div>
                          ))}
                          {pipeline.steps.length > 4 && (
                            <div className="flex items-center text-xs text-muted-foreground">
                              +{pipeline.steps.length - 4} mais
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Estatísticas */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-3 bg-muted/50 rounded-lg">
                        <div className="text-center">
                          <div className="text-sm font-bold">{pipeline.statistics.total_runs}</div>
                          <div className="text-xs text-muted-foreground">Total Execuções</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm font-bold">{pipeline.statistics.success_rate}%</div>
                          <div className="text-xs text-muted-foreground">Taxa Sucesso</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm font-bold">{formatDuration(pipeline.statistics.avg_duration)}</div>
                          <div className="text-xs text-muted-foreground">Duração Média</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm font-bold">
                            {pipeline.statistics.performance_trend === 'improving' ? '↗️' :
                             pipeline.statistics.performance_trend === 'declining' ? '↘️' : '→'}
                          </div>
                          <div className="text-xs text-muted-foreground">Tendência</div>
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="flex space-x-2">
                          <Button 
                            variant="default" 
                            size="sm"
                            onClick={() => handleRunPipeline(pipeline.id)}
                            disabled={pipeline.status === 'running'}
                            data-testid={`button-run-${pipeline.id}`}
                          >
                            <Play className="h-4 w-4 mr-1" />
                            Executar
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handlePausePipeline(pipeline.id)}
                            data-testid={`button-pause-${pipeline.id}`}
                          >
                            <Pause className="h-4 w-4 mr-1" />
                            Pausar
                          </Button>
                          <Button variant="outline" size="sm" data-testid={`button-edit-${pipeline.id}`}>
                            <Edit className="h-4 w-4 mr-1" />
                            Editar
                          </Button>
                          <Button variant="outline" size="sm" data-testid={`button-logs-${pipeline.id}`}>
                            <FileText className="h-4 w-4 mr-1" />
                            Logs
                          </Button>
                          <Button variant="outline" size="sm" data-testid={`button-clone-${pipeline.id}`}>
                            <Copy className="h-4 w-4 mr-1" />
                            Clonar
                          </Button>
                        </div>
                        
                        <div className="text-xs text-muted-foreground">
                          ID: {pipeline.id}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Executions */}
          <TabsContent value="executions" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Histórico de Execuções</h3>
              <Button variant="outline" data-testid="button-export-executions">
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
            </div>

            <div className="space-y-4">
              {mockExecutions.map((execution) => (
                <Card key={execution.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {/* Header da execução */}
                      <div className="flex items-start justify-between">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center space-x-2">
                            {getCategoryIcon('content_creation')}
                            <h3 className="font-semibold">{execution.pipeline_name}</h3>
                            <Badge className={getStatusColor(execution.status)}>
                              {execution.status === 'success' ? 'Sucesso' :
                               execution.status === 'failed' ? 'Falha' :
                               execution.status === 'running' ? 'Executando' :
                               execution.status === 'queued' ? 'Na Fila' :
                               execution.status === 'partial' ? 'Parcial' : 'Cancelado'}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                            <span>Iniciado: {execution.started_at}</span>
                            {execution.completed_at && (
                              <span>Concluído: {execution.completed_at}</span>
                            )}
                            {execution.duration && (
                              <span>Duração: {formatDuration(execution.duration)}</span>
                            )}
                            <span>Gatilho: {execution.triggered_by.type}</span>
                          </div>
                        </div>
                      </div>

                      {/* Progresso das etapas */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <h4 className="text-sm font-medium">Progresso das Etapas:</h4>
                          <span className="text-xs text-muted-foreground">
                            {execution.steps.filter(s => s.status === 'success').length}/{execution.steps.length} completas
                          </span>
                        </div>
                        <Progress 
                          value={(execution.steps.filter(s => s.status === 'success').length / execution.steps.length) * 100} 
                        />
                      </div>

                      {/* Lista de etapas */}
                      <div className="space-y-2">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                          {execution.steps.map((step, index) => (
                            <div key={step.id} className="flex items-center space-x-2 p-2 border rounded">
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                                step.status === 'success' ? 'bg-green-100 dark:bg-green-950 text-green-600' :
                                step.status === 'failed' ? 'bg-red-100 dark:bg-red-950 text-red-600' :
                                step.status === 'running' ? 'bg-blue-100 dark:bg-blue-950 text-blue-600' :
                                step.status === 'skipped' ? 'bg-gray-100 dark:bg-gray-950 text-gray-600' :
                                'bg-yellow-100 dark:bg-yellow-950 text-yellow-600'
                              }`}>
                                {step.status === 'success' ? '✓' :
                                 step.status === 'failed' ? '✗' :
                                 step.status === 'running' ? '⟳' :
                                 step.status === 'skipped' ? '−' : index + 1}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-xs font-medium truncate">{step.name}</div>
                                {step.duration && (
                                  <div className="text-xs text-muted-foreground">
                                    {formatDuration(step.duration)}
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Recursos utilizados */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-3 bg-muted/50 rounded-lg">
                        <div className="text-center">
                          <div className="text-sm font-bold">{execution.resource_usage.max_memory} MB</div>
                          <div className="text-xs text-muted-foreground">Pico Memória</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm font-bold">{execution.resource_usage.avg_cpu}%</div>
                          <div className="text-xs text-muted-foreground">CPU Médio</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm font-bold">{execution.resource_usage.network_io} MB</div>
                          <div className="text-xs text-muted-foreground">I/O Rede</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm font-bold">{execution.resource_usage.disk_io} MB</div>
                          <div className="text-xs text-muted-foreground">I/O Disco</div>
                        </div>
                      </div>

                      {/* Artefatos gerados */}
                      {execution.artifacts.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium">Artefatos Gerados ({execution.artifacts.length}):</h4>
                          <div className="space-y-1">
                            {execution.artifacts.slice(0, 3).map((artifact, index) => (
                              <div key={index} className="flex items-center justify-between p-2 border rounded text-xs">
                                <div className="flex items-center space-x-2">
                                  {artifact.type === 'file' ? <File className="h-3 w-3" /> :
                                   artifact.type === 'url' ? <Link2 className="h-3 w-3" /> :
                                   <Database className="h-3 w-3" />}
                                  <span>{artifact.name}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  {artifact.size && (
                                    <span className="text-muted-foreground">
                                      {(artifact.size / 1024 / 1024).toFixed(1)} MB
                                    </span>
                                  )}
                                  <Button size="sm" variant="ghost">
                                    <Download className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                            {execution.artifacts.length > 3 && (
                              <div className="text-xs text-muted-foreground">
                                ... e mais {execution.artifacts.length - 3} artefatos
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" data-testid={`button-details-${execution.id}`}>
                            <Eye className="h-4 w-4 mr-1" />
                            Detalhes
                          </Button>
                          <Button variant="outline" size="sm" data-testid={`button-logs-execution-${execution.id}`}>
                            <FileText className="h-4 w-4 mr-1" />
                            Logs
                          </Button>
                          {execution.status === 'failed' && (
                            <Button variant="outline" size="sm" data-testid={`button-retry-${execution.id}`}>
                              <RefreshCw className="h-4 w-4 mr-1" />
                              Tentar Novamente
                            </Button>
                          )}
                          {execution.status === 'running' && (
                            <Button variant="destructive" size="sm" data-testid={`button-cancel-${execution.id}`}>
                              <Square className="h-4 w-4 mr-1" />
                              Cancelar
                            </Button>
                          )}
                        </div>
                        
                        <div className="text-xs text-muted-foreground">
                          ID: {execution.id}
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
              <h3 className="text-lg font-semibold">Templates de Automação</h3>
              <Button variant="outline" data-testid="button-create-template">
                <Plus className="h-4 w-4 mr-2" />
                Criar Template
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockTemplates.map((template) => (
                <Card key={template.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {/* Header do template */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-2">
                          {getCategoryIcon(template.category)}
                          <h3 className="font-semibold">{template.name}</h3>
                        </div>
                        <Badge variant="outline">
                          {template.complexity === 'beginner' ? 'Iniciante' :
                           template.complexity === 'intermediate' ? 'Intermediário' : 'Avançado'}
                        </Badge>
                      </div>

                      <p className="text-sm text-muted-foreground">{template.description}</p>

                      {/* Métricas */}
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div>
                          <div className="text-lg font-bold">{template.usage_count}</div>
                          <div className="text-xs text-muted-foreground">Usos</div>
                        </div>
                        <div>
                          <div className="flex items-center justify-center space-x-1">
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                            <span className="text-lg font-bold">{template.rating}</span>
                          </div>
                          <div className="text-xs text-muted-foreground">Avaliação</div>
                        </div>
                      </div>

                      {/* Setup time */}
                      <div className="flex items-center justify-center p-2 bg-muted/50 rounded">
                        <Clock className="h-4 w-4 mr-2" />
                        <span className="text-sm">Setup: ~{template.estimated_setup_time} min</span>
                      </div>

                      {/* Casos de uso */}
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Casos de Uso:</h4>
                        <div className="space-y-1">
                          {template.use_cases.slice(0, 3).map((useCase, index) => (
                            <div key={index} className="text-xs p-2 bg-muted/50 rounded">
                              • {useCase}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Integrações necessárias */}
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Integrações:</h4>
                        <div className="flex flex-wrap gap-1">
                          {template.required_integrations.map((integration, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {integration}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Avaliações */}
                      {template.reviews.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium">Última Avaliação:</h4>
                          <div className="p-2 bg-muted/50 rounded text-xs">
                            <div className="flex items-center space-x-1 mb-1">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star 
                                  key={i} 
                                  className={`h-3 w-3 ${i < template.reviews[0].rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} 
                                />
                              ))}
                              <span className="ml-2 text-muted-foreground">{template.reviews[0].user}</span>
                            </div>
                            <p className="text-muted-foreground">"{template.reviews[0].comment}"</p>
                          </div>
                        </div>
                      )}

                      {/* Footer */}
                      <Button 
                        className="w-full"
                        onClick={() => handleUseTemplate(template.id)}
                        data-testid={`button-use-template-detail-${template.id}`}
                      >
                        Usar Este Template
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Monitoring */}
          <TabsContent value="monitoring" className="space-y-6">
            <h3 className="text-lg font-semibold">Monitoramento e Alertas</h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Queue Status */}
              <Card>
                <CardHeader>
                  <CardTitle>Status da Fila</CardTitle>
                  <CardDescription>Execuções pendentes e em andamento</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Na fila</span>
                      <span className="text-sm font-medium">{mockMetrics.performance.queue_length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Executando</span>
                      <span className="text-sm font-medium">{mockMetrics.pipelines.running}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Taxa de processamento</span>
                      <span className="text-sm font-medium">{mockMetrics.performance.throughput}/h</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Error Analysis */}
              <Card>
                <CardHeader>
                  <CardTitle>Análise de Erros</CardTitle>
                  <CardDescription>Principais causas de falhas</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-2 border rounded">
                      <span className="text-sm">Rate Limit API</span>
                      <Badge variant="destructive">23%</Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 border rounded">
                      <span className="text-sm">Timeout de Rede</span>
                      <Badge variant="destructive">18%</Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 border rounded">
                      <span className="text-sm">Erro de Validação</span>
                      <Badge variant="destructive">12%</Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 border rounded">
                      <span className="text-sm">Falha de Upload</span>
                      <Badge variant="destructive">8%</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Resource Usage Charts */}
            <Card>
              <CardHeader>
                <CardTitle>Uso de Recursos</CardTitle>
                <CardDescription>Consumo de CPU, memória e rede em tempo real</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{mockMetrics.resources.cpu_usage}%</div>
                    <div className="text-sm text-muted-foreground">CPU</div>
                    <Progress value={mockMetrics.resources.cpu_usage} className="mt-2" />
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{mockMetrics.resources.memory_usage}%</div>
                    <div className="text-sm text-muted-foreground">Memória</div>
                    <Progress value={mockMetrics.resources.memory_usage} className="mt-2" />
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{mockMetrics.resources.storage_usage}%</div>
                    <div className="text-sm text-muted-foreground">Armazenamento</div>
                    <Progress value={mockMetrics.resources.storage_usage} className="mt-2" />
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{mockMetrics.resources.network_usage}%</div>
                    <div className="text-sm text-muted-foreground">Rede</div>
                    <Progress value={mockMetrics.resources.network_usage} className="mt-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Active Alerts */}
            <Card>
              <CardHeader>
                <CardTitle>Alertas Ativos</CardTitle>
                <CardDescription>Notificações que requerem atenção</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg border-yellow-200 bg-yellow-50 dark:bg-yellow-950">
                    <div className="flex items-center space-x-3">
                      <AlertTriangle className="h-5 w-5 text-yellow-500" />
                      <div>
                        <div className="font-medium text-sm">Pipeline "Produção Completa" com latência alta</div>
                        <div className="text-xs text-muted-foreground">Duração média 25% acima do normal</div>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      Investigar
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg border-blue-200 bg-blue-50 dark:bg-blue-950">
                    <div className="flex items-center space-x-3">
                      <Info className="h-5 w-5 text-blue-500" />
                      <div>
                        <div className="font-medium text-sm">Fila de execução com 5 pipelines pendentes</div>
                        <div className="text-xs text-muted-foreground">Considere aumentar paralelismo</div>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      Configurar
                    </Button>
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