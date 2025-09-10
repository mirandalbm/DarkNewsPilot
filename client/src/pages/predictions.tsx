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
  TrendingUp,
  TrendingDown,
  BarChart3,
  LineChart,
  PieChart,
  Target,
  Zap,
  Brain,
  Sparkles,
  AlertTriangle,
  CheckCircle,
  Clock,
  Calendar,
  Globe,
  Users,
  Eye,
  Heart,
  Share2,
  DollarSign,
  Percent,
  ArrowUp,
  ArrowDown,
  ArrowRight,
  Plus,
  Minus,
  Search,
  Filter,
  RefreshCw,
  Settings,
  Download,
  Upload,
  Save,
  Play,
  Pause,
  RotateCcw,
  Maximize2,
  Minimize2,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Star,
  Award,
  Shield,
  Lock,
  Unlock,
  Info,
  AlertCircle,
  XCircle,
  Activity,
  Cpu,
  Database,
  Server,
  Cloud,
  Network,
  Wifi,
  Signal,
  Radio,
  Mic,
  Volume2,
  Video,
  Image,
  FileText,
  Code,
  Hash,
  Tag,
  Layers,
  Grid,
  List,
  Table,
  Map,
  Compass,
  Navigation,
  Route,
  Flag,
  Bookmark,
  MessageSquare,
  Mail,
  Phone,
  Link2,
  ExternalLink,
  Copy,
  Edit,
  Trash2,
  Archive,
  FolderOpen,
  File,
  Folder,
  HardDrive,
  MemoryStick,
  ScanLine,
  Crosshair
} from 'lucide-react';

interface PredictionModel {
  id: string;
  name: string;
  type: 'trending_topics' | 'performance_forecast' | 'audience_behavior' | 'content_optimization' | 'market_analysis' | 'revenue_prediction';
  accuracy: number;
  confidence: number;
  last_updated: string;
  training_data_size: number;
  prediction_horizon: string; // ex: "7 days", "30 days", "3 months"
  status: 'active' | 'training' | 'deprecated' | 'error';
  metrics: {
    precision: number;
    recall: number;
    f1_score: number;
    mae: number; // Mean Absolute Error
    rmse: number; // Root Mean Square Error
  };
  features: string[];
  last_prediction: string;
  usage_stats: {
    predictions_made: number;
    successful_predictions: number;
    avg_processing_time: number;
  };
}

interface TrendingTopic {
  id: string;
  keyword: string;
  category: 'crime' | 'mystery' | 'supernatural' | 'conspiracy' | 'breaking_news' | 'historical' | 'technology' | 'international';
  current_volume: number;
  predicted_volume: number;
  growth_rate: number;
  sentiment_score: number;
  difficulty_score: number;
  competition_level: number;
  viral_potential: number;
  relevance_score: number;
  geographic_focus: string[];
  demographic_appeal: {
    age_groups: string[];
    interests: string[];
    viewing_patterns: string[];
  };
  content_suggestions: Array<{
    angle: string;
    estimated_views: number;
    production_complexity: number;
    resource_requirements: string[];
  }>;
  historical_performance: Array<{
    date: string;
    volume: number;
    engagement: number;
    conversion: number;
  }>;
  predicted_timeline: Array<{
    date: string;
    predicted_volume: number;
    confidence: number;
    optimal_posting_time: string;
  }>;
  risk_factors: string[];
  opportunity_score: number;
}

interface ContentPerformancePrediction {
  id: string;
  content_title: string;
  content_type: 'video' | 'article' | 'podcast' | 'live_stream';
  predicted_metrics: {
    views: {
      estimate: number;
      confidence: number;
      range_min: number;
      range_max: number;
    };
    engagement_rate: {
      estimate: number;
      confidence: number;
      breakdown: {
        likes: number;
        comments: number;
        shares: number;
        watch_time: number;
      };
    };
    revenue: {
      estimate: number;
      confidence: number;
      sources: {
        ads: number;
        sponsors: number;
        merchandise: number;
        premium: number;
      };
    };
    viral_probability: number;
    retention_rate: number;
    click_through_rate: number;
  };
  optimization_suggestions: Array<{
    aspect: string;
    current_score: number;
    suggested_improvement: string;
    expected_impact: number;
    difficulty: 'easy' | 'medium' | 'hard';
    estimated_effort: string;
  }>;
  best_publishing_strategy: {
    optimal_date: string;
    optimal_time: string;
    platform_priorities: Array<{
      platform: string;
      priority: number;
      expected_performance: number;
    }>;
    hashtags: string[];
    target_audience: string[];
  };
  competitive_analysis: {
    similar_content_performance: number;
    market_saturation: number;
    differentiation_score: number;
    timing_advantage: number;
  };
  risk_assessment: {
    copyright_risk: number;
    controversy_risk: number;
    algorithm_risk: number;
    seasonal_risk: number;
  };
}

interface MarketIntelligence {
  period: 'week' | 'month' | 'quarter' | 'year';
  global_trends: {
    dark_content_demand: number;
    mystery_genre_growth: number;
    true_crime_popularity: number;
    documentary_consumption: number;
    youtube_dark_content_ctr: number;
  };
  audience_insights: {
    primary_demographics: Array<{
      age_range: string;
      percentage: number;
      engagement_rate: number;
      content_preferences: string[];
      peak_viewing_times: string[];
    }>;
    geographic_distribution: Array<{
      country: string;
      percentage: number;
      growth_rate: number;
      preferred_languages: string[];
      cultural_preferences: string[];
    }>;
    behavioral_patterns: {
      avg_session_duration: number;
      content_discovery_methods: Array<{
        method: string;
        percentage: number;
      }>;
      engagement_triggers: string[];
      churn_indicators: string[];
    };
  };
  competitor_analysis: Array<{
    name: string;
    subscriber_count: number;
    avg_views: number;
    growth_rate: number;
    content_strategy: string;
    strengths: string[];
    weaknesses: string[];
    market_share: number;
  }>;
  content_gaps: Array<{
    topic: string;
    demand_score: number;
    supply_score: number;
    opportunity_score: number;
    difficulty: number;
    potential_audience: number;
  }>;
  future_predictions: {
    next_30_days: {
      trending_topics: string[];
      optimal_content_types: string[];
      expected_audience_growth: number;
      revenue_forecast: number;
    };
    next_90_days: {
      market_shifts: string[];
      new_opportunities: string[];
      potential_challenges: string[];
      strategic_recommendations: string[];
    };
    next_year: {
      industry_evolution: string[];
      technology_impact: string[];
      audience_changes: string[];
      monetization_trends: string[];
    };
  };
}

interface OptimizationStrategy {
  id: string;
  name: string;
  category: 'content' | 'audience' | 'monetization' | 'production' | 'distribution' | 'growth';
  current_performance: number;
  target_performance: number;
  improvement_potential: number;
  implementation_difficulty: 'easy' | 'medium' | 'hard' | 'very_hard';
  estimated_timeline: string;
  resource_requirements: {
    budget: number;
    team_hours: number;
    tools_needed: string[];
    skills_required: string[];
  };
  expected_roi: {
    revenue_increase: number;
    cost_reduction: number;
    efficiency_gain: number;
    risk_mitigation: number;
  };
  action_items: Array<{
    task: string;
    priority: 'low' | 'medium' | 'high' | 'critical';
    assignee: string;
    deadline: string;
    dependencies: string[];
    success_metrics: string[];
  }>;
  success_probability: number;
  risk_factors: string[];
  monitoring_kpis: string[];
}

interface RevenueProjection {
  period: string;
  confidence_level: number;
  scenarios: {
    conservative: {
      total_revenue: number;
      growth_rate: number;
      breakdown: {
        ad_revenue: number;
        sponsorships: number;
        premium_subscriptions: number;
        merchandise: number;
        affiliate_commissions: number;
        courses_consulting: number;
      };
    };
    realistic: {
      total_revenue: number;
      growth_rate: number;
      breakdown: {
        ad_revenue: number;
        sponsorships: number;
        premium_subscriptions: number;
        merchandise: number;
        affiliate_commissions: number;
        courses_consulting: number;
      };
    };
    optimistic: {
      total_revenue: number;
      growth_rate: number;
      breakdown: {
        ad_revenue: number;
        sponsorships: number;
        premium_subscriptions: number;
        merchandise: number;
        affiliate_commissions: number;
        courses_consulting: number;
      };
    };
  };
  key_drivers: Array<{
    factor: string;
    impact_weight: number;
    current_value: number;
    target_value: number;
    improvement_difficulty: number;
  }>;
  seasonal_adjustments: Array<{
    period: string;
    adjustment_factor: number;
    reasoning: string;
  }>;
  risk_adjustments: Array<{
    risk_type: string;
    probability: number;
    impact: number;
    mitigation_strategies: string[];
  }>;
}

const mockPredictionModels: PredictionModel[] = [
  {
    id: 'model_001',
    name: 'Trending Topics Predictor v3.2',
    type: 'trending_topics',
    accuracy: 94.7,
    confidence: 92.1,
    last_updated: '2024-03-09T14:30:00Z',
    training_data_size: 2847392,
    prediction_horizon: '14 dias',
    status: 'active',
    metrics: {
      precision: 0.947,
      recall: 0.921,
      f1_score: 0.934,
      mae: 0.063,
      rmse: 0.089
    },
    features: ['search_volume', 'social_mentions', 'news_coverage', 'seasonal_patterns', 'competitor_activity'],
    last_prediction: '2024-03-09T15:45:00Z',
    usage_stats: {
      predictions_made: 8394,
      successful_predictions: 7940,
      avg_processing_time: 2.3
    }
  },
  {
    id: 'model_002',
    name: 'Performance Forecast Engine v2.8',
    type: 'performance_forecast',
    accuracy: 91.3,
    confidence: 88.7,
    last_updated: '2024-03-08T09:15:00Z',
    training_data_size: 1923847,
    prediction_horizon: '30 dias',
    status: 'active',
    metrics: {
      precision: 0.913,
      recall: 0.887,
      f1_score: 0.900,
      mae: 0.087,
      rmse: 0.124
    },
    features: ['content_quality', 'timing', 'audience_behavior', 'platform_algorithm', 'competitor_landscape'],
    last_prediction: '2024-03-09T12:20:00Z',
    usage_stats: {
      predictions_made: 5247,
      successful_predictions: 4789,
      avg_processing_time: 4.7
    }
  },
  {
    id: 'model_003',
    name: 'Audience Behavior Analyzer v4.1',
    type: 'audience_behavior',
    accuracy: 89.2,
    confidence: 91.5,
    last_updated: '2024-03-07T16:45:00Z',
    training_data_size: 3584927,
    prediction_horizon: '7 dias',
    status: 'active',
    metrics: {
      precision: 0.892,
      recall: 0.915,
      f1_score: 0.903,
      mae: 0.108,
      rmse: 0.147
    },
    features: ['viewing_patterns', 'engagement_history', 'demographic_data', 'device_usage', 'content_preferences'],
    last_prediction: '2024-03-09T11:30:00Z',
    usage_stats: {
      predictions_made: 12847,
      successful_predictions: 11462,
      avg_processing_time: 1.8
    }
  },
  {
    id: 'model_004',
    name: 'Revenue Prediction System v1.9',
    type: 'revenue_prediction',
    accuracy: 87.6,
    confidence: 85.3,
    last_updated: '2024-03-06T14:20:00Z',
    training_data_size: 847293,
    prediction_horizon: '90 dias',
    status: 'training',
    metrics: {
      precision: 0.876,
      recall: 0.853,
      f1_score: 0.864,
      mae: 0.124,
      rmse: 0.179
    },
    features: ['historical_revenue', 'content_performance', 'market_trends', 'seasonality', 'economic_indicators'],
    last_prediction: '2024-03-08T18:45:00Z',
    usage_stats: {
      predictions_made: 2941,
      successful_predictions: 2576,
      avg_processing_time: 6.8
    }
  }
];

const mockTrendingTopics: TrendingTopic[] = [
  {
    id: 'topic_001',
    keyword: 'Mistérios Urbanos Brasil 2024',
    category: 'mystery',
    current_volume: 89420,
    predicted_volume: 134780,
    growth_rate: 50.7,
    sentiment_score: 0.73,
    difficulty_score: 0.34,
    competition_level: 0.42,
    viral_potential: 0.87,
    relevance_score: 0.94,
    geographic_focus: ['Brasil', 'Portugal', 'Angola'],
    demographic_appeal: {
      age_groups: ['25-34', '35-44', '18-24'],
      interests: ['true crime', 'mistérios', 'documentários', 'história'],
      viewing_patterns: ['noturno', 'fins de semana', 'binge watching']
    },
    content_suggestions: [
      {
        angle: 'Casos não resolvidos em grandes cidades brasileiras',
        estimated_views: 245000,
        production_complexity: 6,
        resource_requirements: ['pesquisa intensiva', 'entrevistas', 'imagens de arquivo']
      },
      {
        angle: 'Lendas urbanas que se tornaram realidade',
        estimated_views: 189000,
        production_complexity: 4,
        resource_requirements: ['pesquisa histórica', 'dramatização', 'narração especial']
      }
    ],
    historical_performance: [
      { date: '2024-02-01', volume: 67420, engagement: 0.067, conversion: 0.034 },
      { date: '2024-02-15', volume: 78230, engagement: 0.072, conversion: 0.038 },
      { date: '2024-03-01', volume: 89420, engagement: 0.078, conversion: 0.041 }
    ],
    predicted_timeline: [
      { date: '2024-03-15', predicted_volume: 108750, confidence: 0.92, optimal_posting_time: '21:30' },
      { date: '2024-03-30', predicted_volume: 134780, confidence: 0.87, optimal_posting_time: '20:45' },
      { date: '2024-04-15', predicted_volume: 156890, confidence: 0.79, optimal_posting_time: '21:15' }
    ],
    risk_factors: ['saturação de mercado', 'mudanças algorítmicas', 'concorrência aumentada'],
    opportunity_score: 0.91
  },
  {
    id: 'topic_002',
    keyword: 'Crimes Reais Não Resolvidos',
    category: 'crime',
    current_volume: 156780,
    predicted_volume: 198340,
    growth_rate: 26.5,
    sentiment_score: 0.68,
    difficulty_score: 0.47,
    competition_level: 0.58,
    viral_potential: 0.79,
    relevance_score: 0.88,
    geographic_focus: ['Global', 'América Latina', 'Brasil'],
    demographic_appeal: {
      age_groups: ['25-34', '35-44', '45-54'],
      interests: ['true crime', 'investigação', 'justiça', 'documentários'],
      viewing_patterns: ['prime time', 'madrugada', 'pausas do trabalho']
    },
    content_suggestions: [
      {
        angle: 'Cold cases brasileiros com novas evidências',
        estimated_views: 320000,
        production_complexity: 8,
        resource_requirements: ['acesso a arquivos policiais', 'entrevistas especializadas', 'análise forense']
      },
      {
        angle: 'Investigações internacionais que impactaram o Brasil',
        estimated_views: 187000,
        production_complexity: 6,
        resource_requirements: ['pesquisa internacional', 'tradução', 'contexto local']
      }
    ],
    historical_performance: [
      { date: '2024-02-01', volume: 134250, engagement: 0.084, conversion: 0.052 },
      { date: '2024-02-15', volume: 145680, engagement: 0.087, conversion: 0.057 },
      { date: '2024-03-01', volume: 156780, engagement: 0.091, conversion: 0.063 }
    ],
    predicted_timeline: [
      { date: '2024-03-15', predicted_volume: 172450, confidence: 0.89, optimal_posting_time: '22:00' },
      { date: '2024-03-30', predicted_volume: 198340, confidence: 0.84, optimal_posting_time: '21:30' },
      { date: '2024-04-15', predicted_volume: 212890, confidence: 0.76, optimal_posting_time: '22:15' }
    ],
    risk_factors: ['sensibilidade do conteúdo', 'questões legais', 'pressão de famílias'],
    opportunity_score: 0.84
  },
  {
    id: 'topic_003',
    keyword: 'Fenômenos Sobrenaturais Inexplicados',
    category: 'supernatural',
    current_volume: 73290,
    predicted_volume: 125470,
    growth_rate: 71.2,
    sentiment_score: 0.59,
    difficulty_score: 0.28,
    competition_level: 0.31,
    viral_potential: 0.92,
    relevance_score: 0.77,
    geographic_focus: ['Brasil', 'México', 'Espanha'],
    demographic_appeal: {
      age_groups: ['18-24', '25-34', '16-17'],
      interests: ['paranormal', 'mistério', 'sobrenatural', 'terror'],
      viewing_patterns: ['noturno', 'fins de semana', 'periods de tensão']
    },
    content_suggestions: [
      {
        angle: 'Fenômenos paranormais capturados em vídeo',
        estimated_views: 412000,
        production_complexity: 5,
        resource_requirements: ['análise de vídeos', 'especialistas', 'efeitos visuais']
      },
      {
        angle: 'Investigação científica de eventos sobrenaturais',
        estimated_views: 278000,
        production_complexity: 7,
        resource_requirements: ['consultores científicos', 'equipamentos', 'locações']
      }
    ],
    historical_performance: [
      { date: '2024-02-01', volume: 45680, engagement: 0.098, conversion: 0.047 },
      { date: '2024-02-15', volume: 58920, engagement: 0.112, conversion: 0.054 },
      { date: '2024-03-01', volume: 73290, engagement: 0.124, conversion: 0.062 }
    ],
    predicted_timeline: [
      { date: '2024-03-15', predicted_volume: 94750, confidence: 0.91, optimal_posting_time: '23:30' },
      { date: '2024-03-30', predicted_volume: 125470, confidence: 0.88, optimal_posting_time: '23:00' },
      { date: '2024-04-15', predicted_volume: 148930, confidence: 0.82, optimal_posting_time: '22:45' }
    ],
    risk_factors: ['ceticismo da audiência', 'demonetização de plataformas', 'credibilidade'],
    opportunity_score: 0.86
  }
];

const mockMarketIntelligence: MarketIntelligence = {
  period: 'month',
  global_trends: {
    dark_content_demand: 87.3,
    mystery_genre_growth: 34.2,
    true_crime_popularity: 91.7,
    documentary_consumption: 45.8,
    youtube_dark_content_ctr: 12.4
  },
  audience_insights: {
    primary_demographics: [
      {
        age_range: '25-34',
        percentage: 34.7,
        engagement_rate: 0.089,
        content_preferences: ['investigative', 'documentary', 'mystery'],
        peak_viewing_times: ['20:00-22:00', '22:00-24:00']
      },
      {
        age_range: '35-44',
        percentage: 28.3,
        engagement_rate: 0.076,
        content_preferences: ['true crime', 'historical', 'analysis'],
        peak_viewing_times: ['21:00-23:00', '06:00-08:00']
      },
      {
        age_range: '18-24',
        percentage: 22.1,
        engagement_rate: 0.094,
        content_preferences: ['supernatural', 'viral', 'interactive'],
        peak_viewing_times: ['22:00-02:00', '14:00-16:00']
      }
    ],
    geographic_distribution: [
      {
        country: 'Brasil',
        percentage: 67.8,
        growth_rate: 23.4,
        preferred_languages: ['pt-BR'],
        cultural_preferences: ['casos locais', 'histórias regionais', 'lendas brasileiras']
      },
      {
        country: 'Portugal',
        percentage: 12.4,
        growth_rate: 18.7,
        preferred_languages: ['pt-PT'],
        cultural_preferences: ['história europeia', 'mistérios antigos', 'investigação']
      },
      {
        country: 'Estados Unidos',
        percentage: 8.9,
        growth_rate: 31.2,
        preferred_languages: ['en-US'],
        cultural_preferences: ['true crime internacional', 'conspiracy theories', 'cold cases']
      }
    ],
    behavioral_patterns: {
      avg_session_duration: 847,
      content_discovery_methods: [
        { method: 'YouTube search', percentage: 42.3 },
        { method: 'Recommendations', percentage: 31.7 },
        { method: 'Social media', percentage: 16.8 },
        { method: 'Direct access', percentage: 9.2 }
      ],
      engagement_triggers: ['suspense narrativo', 'revelações chocantes', 'evidências visuais', 'casos locais'],
      churn_indicators: ['conteúdo repetitivo', 'baixa qualidade de produção', 'falta de novos casos', 'sensacionalismo excessivo']
    }
  },
  competitor_analysis: [
    {
      name: 'Canal Nostalgia',
      subscriber_count: 8940000,
      avg_views: 1840000,
      growth_rate: 12.3,
      content_strategy: 'Nostálgia e mistérios históricos brasileiros',
      strengths: ['marca consolidada', 'produção de qualidade', 'audiência fiel'],
      weaknesses: ['baixa frequência de uploads', 'foco limitado', 'pouca inovação'],
      market_share: 23.7
    },
    {
      name: 'Mundo Freak',
      subscriber_count: 4560000,
      avg_views: 890000,
      growth_rate: 34.8,
      content_strategy: 'Mistérios, lendas urbanas e paranormal',
      strengths: ['alta frequência', 'engajamento jovem', 'conteúdo viral'],
      weaknesses: ['qualidade inconsistente', 'credibilidade questionável', 'dependência de trends'],
      market_share: 15.2
    },
    {
      name: 'Casos de Família',
      subscriber_count: 2890000,
      avg_views: 620000,
      growth_rate: 8.7,
      content_strategy: 'True crime nacional com foco em casos familiares',
      strengths: ['nicho específico', 'pesquisa profunda', 'credibilidade'],
      weaknesses: ['crescimento lento', 'audiência limitada', 'produção cara'],
      market_share: 9.4
    }
  ],
  content_gaps: [
    {
      topic: 'Crimes cibernéticos brasileiros',
      demand_score: 78.4,
      supply_score: 23.1,
      opportunity_score: 91.7,
      difficulty: 6,
      potential_audience: 1247000
    },
    {
      topic: 'Mistérios arqueológicos nacionais',
      demand_score: 63.8,
      supply_score: 18.9,
      opportunity_score: 84.2,
      difficulty: 7,
      potential_audience: 892000
    },
    {
      topic: 'Conspirações políticas históricas',
      demand_score: 89.2,
      supply_score: 45.7,
      opportunity_score: 76.3,
      difficulty: 9,
      potential_audience: 1890000
    }
  ],
  future_predictions: {
    next_30_days: {
      trending_topics: ['mistérios urbanos', 'crimes não resolvidos', 'fenômenos inexplicados', 'investigações independentes'],
      optimal_content_types: ['documentários curtos', 'séries investigativas', 'análises interativas', 'lives de discussão'],
      expected_audience_growth: 18.7,
      revenue_forecast: 47890
    },
    next_90_days: {
      market_shifts: ['aumento do interesse em true crime', 'demanda por conteúdo original', 'preferência por formatos longos'],
      new_opportunities: ['parcerias com podcasts', 'conteúdo interativo', 'documentários exclusivos'],
      potential_challenges: ['concorrência intensificada', 'mudanças algorítmicas', 'regulamentações de conteúdo'],
      strategic_recommendations: ['investir em produção própria', 'diversificar plataformas', 'construir comunidade engajada']
    },
    next_year: {
      industry_evolution: ['consolidação do mercado dark content', 'profissionalização dos creators', 'integração AI na produção'],
      technology_impact: ['realidade virtual para investigações', 'AI para análise de evidências', 'plataformas especializadas'],
      audience_changes: ['maior exigência de qualidade', 'preferência por credibilidade', 'consumo multi-plataforma'],
      monetization_trends: ['assinaturas premium', 'merchandise temático', 'eventos presenciais', 'consultoria investigativa']
    }
  }
};

const mockRevenueProjection: RevenueProjection = {
  period: '2024 Q2-Q4',
  confidence_level: 87.3,
  scenarios: {
    conservative: {
      total_revenue: 284790,
      growth_rate: 23.4,
      breakdown: {
        ad_revenue: 156780,
        sponsorships: 67890,
        premium_subscriptions: 34520,
        merchandise: 15670,
        affiliate_commissions: 7430,
        courses_consulting: 2500
      }
    },
    realistic: {
      total_revenue: 387940,
      growth_rate: 41.7,
      breakdown: {
        ad_revenue: 198340,
        sponsorships: 97830,
        premium_subscriptions: 54720,
        merchandise: 24890,
        affiliate_commissions: 9360,
        courses_consulting: 2800
      }
    },
    optimistic: {
      total_revenue: 523680,
      growth_rate: 67.2,
      breakdown: {
        ad_revenue: 267450,
        sponsorships: 134890,
        premium_subscriptions: 78940,
        merchandise: 31250,
        affiliate_commissions: 8350,
        courses_consulting: 2800
      }
    }
  },
  key_drivers: [
    {
      factor: 'Subscriber Growth Rate',
      impact_weight: 0.34,
      current_value: 12.3,
      target_value: 28.7,
      improvement_difficulty: 6
    },
    {
      factor: 'Average View Duration',
      impact_weight: 0.28,
      current_value: 847,
      target_value: 1240,
      improvement_difficulty: 4
    },
    {
      factor: 'Content Production Quality',
      impact_weight: 0.23,
      current_value: 7.8,
      target_value: 9.2,
      improvement_difficulty: 7
    },
    {
      factor: 'Monetization Optimization',
      impact_weight: 0.15,
      current_value: 0.034,
      target_value: 0.067,
      improvement_difficulty: 5
    }
  ],
  seasonal_adjustments: [
    {
      period: 'Q2 (Abril-Junho)',
      adjustment_factor: 1.15,
      reasoning: 'Menor competição educacional, mais tempo livre para entretenimento'
    },
    {
      period: 'Q3 (Julho-Setembro)',
      adjustment_factor: 0.92,
      reasoning: 'Férias escolares, audiência mais jovem, menor engajamento premium'
    },
    {
      period: 'Q4 (Outubro-Dezembro)',
      adjustment_factor: 1.34,
      reasoning: 'Época de Halloween, Natal, maior interesse em mistérios e histórias'
    }
  ],
  risk_adjustments: [
    {
      risk_type: 'Algorithm Changes',
      probability: 0.34,
      impact: -0.23,
      mitigation_strategies: ['diversificação de plataformas', 'lista de email própria', 'presença em redes sociais']
    },
    {
      risk_type: 'Increased Competition',
      probability: 0.67,
      impact: -0.18,
      mitigation_strategies: ['diferenciação de conteúdo', 'qualidade superior', 'relacionamento com audiência']
    },
    {
      risk_type: 'Content Monetization Changes',
      probability: 0.45,
      impact: -0.31,
      mitigation_strategies: ['múltiplas fontes de receita', 'produtos próprios', 'parcerias diretas']
    }
  ]
};

export default function PredictiveAnalyticsSystem() {
  const [selectedTab, setSelectedTab] = useState('overview');
  const [timeFrame, setTimeFrame] = useState('30_days');
  const [predictionType, setPredictionType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModelDialog, setShowModelDialog] = useState(false);
  const [showOptimizationDialog, setShowOptimizationDialog] = useState(false);
  const [isGeneratingPrediction, setIsGeneratingPrediction] = useState(false);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const { toast } = useToast();

  const getModelStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-500 bg-green-100 dark:bg-green-950';
      case 'training': return 'text-blue-500 bg-blue-100 dark:bg-blue-950';
      case 'deprecated': return 'text-gray-500 bg-gray-100 dark:bg-gray-950';
      case 'error': return 'text-red-500 bg-red-100 dark:bg-red-950';
      default: return 'text-gray-500 bg-gray-100 dark:bg-gray-950';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'trending_topics': return <TrendingUp className="h-4 w-4" />;
      case 'performance_forecast': return <BarChart3 className="h-4 w-4" />;
      case 'audience_behavior': return <Users className="h-4 w-4" />;
      case 'content_optimization': return <Target className="h-4 w-4" />;
      case 'market_analysis': return <Globe className="h-4 w-4" />;
      case 'revenue_prediction': return <DollarSign className="h-4 w-4" />;
      default: return <Brain className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'crime': return 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300';
      case 'mystery': return 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300';
      case 'supernatural': return 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300';
      case 'conspiracy': return 'bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300';
      case 'breaking_news': return 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300';
      case 'historical': return 'bg-brown-100 text-brown-700 dark:bg-brown-950 dark:text-brown-300';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-950 dark:text-gray-300';
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toLocaleString();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(1)}%`;
  };

  const handleGeneratePrediction = async () => {
    setIsGeneratingPrediction(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      toast({
        title: "Previsão gerada com sucesso",
        description: "Nova análise preditiva disponível no dashboard"
      });
    } catch (error) {
      toast({
        title: "Erro na previsão",
        description: "Falha ao gerar análise preditiva",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingPrediction(false);
    }
  };

  const handleOptimizeContent = () => {
    toast({
      title: "Otimização iniciada",
      description: "Aplicando recomendações de melhoria automaticamente"
    });
    setShowOptimizationDialog(false);
  };

  const filteredModels = mockPredictionModels.filter(model => {
    let matches = true;
    
    if (predictionType !== 'all' && model.type !== predictionType) matches = false;
    if (searchTerm && !model.name.toLowerCase().includes(searchTerm.toLowerCase())) matches = false;
    
    return matches;
  });

  const avgAccuracy = mockPredictionModels.reduce((sum, model) => sum + model.accuracy, 0) / mockPredictionModels.length;
  const activeModels = mockPredictionModels.filter(m => m.status === 'active').length;
  const totalPredictions = mockPredictionModels.reduce((sum, model) => sum + model.usage_stats.predictions_made, 0);
  const avgProcessingTime = mockPredictionModels.reduce((sum, model) => sum + model.usage_stats.avg_processing_time, 0) / mockPredictionModels.length;

  return (
    <div className="container mx-auto px-6 py-8 max-w-7xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Sistema de Previsões e Analytics</h1>
              <p className="text-muted-foreground">Inteligência preditiva para otimização de conteúdo e crescimento</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Dialog open={showOptimizationDialog} onOpenChange={setShowOptimizationDialog}>
              <DialogTrigger asChild>
                <Button variant="outline" data-testid="button-auto-optimize">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Auto-Otimizar
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Otimização Automática</DialogTitle>
                  <DialogDescription>
                    Aplicar recomendações de IA para maximizar performance
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <Card>
                    <CardContent className="p-4">
                      <h4 className="font-medium mb-2">Otimizações Recomendadas</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-2 border rounded">
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm">Otimizar horários de publicação</span>
                          </div>
                          <span className="text-xs text-green-600">+23% views</span>
                        </div>
                        <div className="flex items-center justify-between p-2 border rounded">
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm">Ajustar tags e keywords</span>
                          </div>
                          <span className="text-xs text-green-600">+18% discovery</span>
                        </div>
                        <div className="flex items-center justify-between p-2 border rounded">
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm">Melhorar thumbnails automaticamente</span>
                          </div>
                          <span className="text-xs text-green-600">+31% CTR</span>
                        </div>
                        <div className="flex items-center justify-between p-2 border rounded">
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm">Configurar cross-promotion inteligente</span>
                          </div>
                          <span className="text-xs text-green-600">+14% retention</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <div className="text-center p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                    <h4 className="font-medium text-green-700 dark:text-green-300 mb-1">
                      Impacto Estimado Total
                    </h4>
                    <p className="text-2xl font-bold text-green-600">+67% Performance</p>
                    <p className="text-sm text-green-600 mt-1">Implementação em 24-48 horas</p>
                  </div>

                  <Button onClick={handleOptimizeContent} className="w-full" data-testid="button-apply-optimizations">
                    Aplicar Todas as Otimizações
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            
            <Button onClick={handleGeneratePrediction} disabled={isGeneratingPrediction} data-testid="button-generate-prediction">
              {isGeneratingPrediction ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Analisando...
                </>
              ) : (
                <>
                  <Brain className="h-4 w-4 mr-2" />
                  Nova Previsão
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Modelos Ativos</p>
                  <p className="text-2xl font-bold">{activeModels}</p>
                  <p className="text-xs text-green-500 flex items-center mt-1">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    {avgAccuracy.toFixed(1)}% precisão média
                  </p>
                </div>
                <Brain className="h-8 w-8 text-emerald-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Previsões Geradas</p>
                  <p className="text-2xl font-bold">{formatNumber(totalPredictions)}</p>
                  <p className="text-xs text-blue-500 flex items-center mt-1">
                    <Activity className="h-3 w-3 mr-1" />
                    {avgProcessingTime.toFixed(1)}s tempo médio
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
                  <p className="text-sm font-medium text-muted-foreground">ROI Previsto</p>
                  <p className="text-2xl font-bold">{formatCurrency(mockRevenueProjection.scenarios.realistic.total_revenue)}</p>
                  <p className="text-xs text-green-500 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +{mockRevenueProjection.scenarios.realistic.growth_rate}% crescimento
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Oportunidades</p>
                  <p className="text-2xl font-bold">{mockTrendingTopics.length}</p>
                  <p className="text-xs text-purple-500 flex items-center mt-1">
                    <Sparkles className="h-3 w-3 mr-1" />
                    {Math.round(mockTrendingTopics.reduce((sum, t) => sum + t.opportunity_score, 0) / mockTrendingTopics.length * 100)}% score médio
                  </p>
                </div>
                <Target className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="trending">Trending Topics</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="market">Market Intel</TabsTrigger>
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
            <TabsTrigger value="models">Modelos</TabsTrigger>
          </TabsList>

          {/* Overview */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Quick Insights */}
              <Card>
                <CardHeader>
                  <CardTitle>Insights Rápidos</CardTitle>
                  <CardDescription>Principais oportunidades detectadas pela IA</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg bg-green-50 dark:bg-green-950">
                      <div className="flex items-center space-x-2 mb-2">
                        <TrendingUp className="h-5 w-5 text-green-500" />
                        <span className="font-medium text-green-700 dark:text-green-300">Oportunidade de Alto Impacto</span>
                      </div>
                      <p className="text-sm text-green-600 dark:text-green-400">
                        "Mistérios Urbanos Brasil 2024" tem 91% score de oportunidade com crescimento previsto de 50.7%
                      </p>
                      <Button size="sm" variant="outline" className="mt-2">
                        Explorar Tópico
                      </Button>
                    </div>

                    <div className="p-4 border rounded-lg bg-blue-50 dark:bg-blue-950">
                      <div className="flex items-center space-x-2 mb-2">
                        <Target className="h-5 w-5 text-blue-500" />
                        <span className="font-medium text-blue-700 dark:text-blue-300">Otimização Recomendada</span>
                      </div>
                      <p className="text-sm text-blue-600 dark:text-blue-400">
                        Ajustar horário de publicação para 21:30 pode aumentar views em 23%
                      </p>
                      <Button size="sm" variant="outline" className="mt-2">
                        Aplicar Agora
                      </Button>
                    </div>

                    <div className="p-4 border rounded-lg bg-orange-50 dark:bg-orange-950">
                      <div className="flex items-center space-x-2 mb-2">
                        <AlertTriangle className="h-5 w-5 text-orange-500" />
                        <span className="font-medium text-orange-700 dark:text-orange-300">Atenção Necessária</span>
                      </div>
                      <p className="text-sm text-orange-600 dark:text-orange-400">
                        Concorrência aumentou 34.8% no nicho de mistérios - diferenciação urgente
                      </p>
                      <Button size="sm" variant="outline" className="mt-2">
                        Ver Estratégia
                      </Button>
                    </div>

                    <div className="p-4 border rounded-lg bg-purple-50 dark:bg-purple-950">
                      <div className="flex items-center space-x-2 mb-2">
                        <Sparkles className="h-5 w-5 text-purple-500" />
                        <span className="font-medium text-purple-700 dark:text-purple-300">Tendência Emergente</span>
                      </div>
                      <p className="text-sm text-purple-600 dark:text-purple-400">
                        "Fenômenos Sobrenaturais" crescendo 71.2% - potencial viral de 92%
                      </p>
                      <Button size="sm" variant="outline" className="mt-2">
                        Criar Conteúdo
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Performance Dashboard */}
              <Card>
                <CardHeader>
                  <CardTitle>Dashboard de Performance</CardTitle>
                  <CardDescription>Métricas chave em tempo real</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 border rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{mockMarketIntelligence.global_trends.true_crime_popularity}%</div>
                        <div className="text-xs text-muted-foreground">True Crime Demand</div>
                      </div>
                      <div className="text-center p-3 border rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{mockMarketIntelligence.global_trends.mystery_genre_growth}%</div>
                        <div className="text-xs text-muted-foreground">Mystery Growth</div>
                      </div>
                      <div className="text-center p-3 border rounded-lg">
                        <div className="text-2xl font-bold text-orange-600">{mockMarketIntelligence.global_trends.youtube_dark_content_ctr}%</div>
                        <div className="text-xs text-muted-foreground">Dark Content CTR</div>
                      </div>
                      <div className="text-center p-3 border rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">{mockMarketIntelligence.audience_insights.behavioral_patterns.avg_session_duration}</div>
                        <div className="text-xs text-muted-foreground">Avg Session (s)</div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Audiência 25-34 anos</span>
                          <span>{mockMarketIntelligence.audience_insights.primary_demographics[0].percentage}%</span>
                        </div>
                        <Progress value={mockMarketIntelligence.audience_insights.primary_demographics[0].percentage} className="h-2" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Audiência Brasil</span>
                          <span>{mockMarketIntelligence.audience_insights.geographic_distribution[0].percentage}%</span>
                        </div>
                        <Progress value={mockMarketIntelligence.audience_insights.geographic_distribution[0].percentage} className="h-2" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Discovery via YouTube Search</span>
                          <span>{mockMarketIntelligence.audience_insights.behavioral_patterns.content_discovery_methods[0].percentage}%</span>
                        </div>
                        <Progress value={mockMarketIntelligence.audience_insights.behavioral_patterns.content_discovery_methods[0].percentage} className="h-2" />
                      </div>
                    </div>

                    <div className="pt-3 border-t">
                      <h4 className="font-medium mb-2">Próximos 30 dias</h4>
                      <div className="text-sm space-y-1">
                        <div className="flex justify-between">
                          <span>Crescimento esperado:</span>
                          <span className="font-medium text-green-600">+{mockMarketIntelligence.future_predictions.next_30_days.expected_audience_growth}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Receita prevista:</span>
                          <span className="font-medium">{formatCurrency(mockMarketIntelligence.future_predictions.next_30_days.revenue_forecast)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Competitive Analysis */}
            <Card>
              <CardHeader>
                <CardTitle>Análise Competitiva</CardTitle>
                <CardDescription>Posicionamento no mercado Dark News</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockMarketIntelligence.competitor_analysis.map((competitor, index) => (
                    <div key={competitor.name} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <div className="font-medium">{competitor.name}</div>
                          <div className="text-sm text-muted-foreground">{competitor.content_strategy}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{formatNumber(competitor.subscriber_count)} subs</div>
                        <div className="text-xs text-muted-foreground">
                          {formatNumber(competitor.avg_views)} views médias
                        </div>
                        <div className="text-xs text-green-600">+{competitor.growth_rate}% crescimento</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Trending Topics */}
          <TabsContent value="trending" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Trending Topics</h3>
              <div className="flex items-center space-x-4">
                <Select value={timeFrame} onValueChange={setTimeFrame}>
                  <SelectTrigger className="w-40" data-testid="select-timeframe">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7_days">7 dias</SelectItem>
                    <SelectItem value="30_days">30 dias</SelectItem>
                    <SelectItem value="90_days">90 dias</SelectItem>
                    <SelectItem value="1_year">1 ano</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-6">
              {mockTrendingTopics.map((topic) => (
                <Card key={topic.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {/* Header do tópico */}
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="font-semibold text-lg">{topic.keyword}</h3>
                            <Badge className={getCategoryColor(topic.category)}>
                              {topic.category}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">Volume atual:</span>
                              <span className="ml-2 font-medium">{formatNumber(topic.current_volume)}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Previsão:</span>
                              <span className="ml-2 font-medium text-green-600">{formatNumber(topic.predicted_volume)}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Crescimento:</span>
                              <span className="ml-2 font-medium text-blue-600">+{topic.growth_rate.toFixed(1)}%</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Oportunidade:</span>
                              <span className="ml-2 font-medium text-purple-600">{Math.round(topic.opportunity_score * 100)}%</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Métricas */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Viral Potential</span>
                            <span className="font-medium">{Math.round(topic.viral_potential * 100)}%</span>
                          </div>
                          <Progress value={topic.viral_potential * 100} className="h-2" />
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Relevância</span>
                            <span className="font-medium">{Math.round(topic.relevance_score * 100)}%</span>
                          </div>
                          <Progress value={topic.relevance_score * 100} className="h-2" />
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Dificuldade</span>
                            <span className="font-medium">{Math.round(topic.difficulty_score * 100)}%</span>
                          </div>
                          <Progress value={topic.difficulty_score * 100} className="h-2" />
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Competição</span>
                            <span className="font-medium">{Math.round(topic.competition_level * 100)}%</span>
                          </div>
                          <Progress value={topic.competition_level * 100} className="h-2" />
                        </div>
                      </div>

                      {/* Demografia */}
                      <div className="p-4 bg-muted/50 rounded-lg">
                        <h4 className="font-medium mb-2">Demografia e Interesses</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Idades:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {topic.demographic_appeal.age_groups.map((age, i) => (
                                <Badge key={i} variant="outline" className="text-xs">{age}</Badge>
                              ))}
                            </div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Interesses:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {topic.demographic_appeal.interests.slice(0, 3).map((interest, i) => (
                                <Badge key={i} variant="outline" className="text-xs">{interest}</Badge>
                              ))}
                            </div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Padrões:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {topic.demographic_appeal.viewing_patterns.slice(0, 2).map((pattern, i) => (
                                <Badge key={i} variant="outline" className="text-xs">{pattern}</Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Sugestões de conteúdo */}
                      <div className="space-y-3">
                        <h4 className="font-medium">Sugestões de Conteúdo</h4>
                        {topic.content_suggestions.map((suggestion, index) => (
                          <div key={index} className="p-3 border rounded-lg">
                            <div className="flex items-start justify-between mb-2">
                              <h5 className="font-medium text-sm">{suggestion.angle}</h5>
                              <Badge variant="outline" className="text-xs">
                                {formatNumber(suggestion.estimated_views)} views
                              </Badge>
                            </div>
                            <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                              <span>Complexidade: {suggestion.production_complexity}/10</span>
                              <span>Recursos: {suggestion.resource_requirements.join(', ')}</span>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Timeline de predição */}
                      <div className="space-y-2">
                        <h4 className="font-medium">Timeline de Crescimento</h4>
                        <div className="space-y-2">
                          {topic.predicted_timeline.map((prediction, index) => (
                            <div key={index} className="flex items-center justify-between p-2 border rounded text-sm">
                              <div className="flex items-center space-x-3">
                                <span className="font-medium">{new Date(prediction.date).toLocaleDateString()}</span>
                                <span className="text-muted-foreground">
                                  Horário ótimo: {prediction.optimal_posting_time}
                                </span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className="font-medium">{formatNumber(prediction.predicted_volume)}</span>
                                <Badge variant="outline" className="text-xs">
                                  {Math.round(prediction.confidence * 100)}% confiança
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Ações */}
                      <div className="flex space-x-2 pt-2 border-t">
                        <Button size="sm" className="flex-1" data-testid={`button-create-content-${topic.id}`}>
                          <Plus className="h-3 w-3 mr-1" />
                          Criar Conteúdo
                        </Button>
                        <Button size="sm" variant="outline" data-testid={`button-track-topic-${topic.id}`}>
                          <Eye className="h-3 w-3 mr-1" />
                          Monitorar
                        </Button>
                        <Button size="sm" variant="outline" data-testid={`button-analyze-${topic.id}`}>
                          <BarChart3 className="h-3 w-3 mr-1" />
                          Analisar
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Performance */}
          <TabsContent value="performance" className="space-y-6">
            <h3 className="text-lg font-semibold">Previsões de Performance</h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Content Performance Prediction */}
              <Card>
                <CardHeader>
                  <CardTitle>Simulador de Performance</CardTitle>
                  <CardDescription>Preveja o sucesso do seu próximo conteúdo</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="content-title">Título do Conteúdo</Label>
                    <Input 
                      id="content-title" 
                      placeholder="Ex: O Mistério Que Aterrorizou São Paulo" 
                      data-testid="input-content-title"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Tipo de Conteúdo</Label>
                    <Select>
                      <SelectTrigger data-testid="select-content-type">
                        <SelectValue placeholder="Escolha o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="video">Vídeo</SelectItem>
                        <SelectItem value="article">Artigo</SelectItem>
                        <SelectItem value="podcast">Podcast</SelectItem>
                        <SelectItem value="live_stream">Live Stream</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Categoria</Label>
                    <Select>
                      <SelectTrigger data-testid="select-content-category">
                        <SelectValue placeholder="Categoria principal" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="crime">Crime Real</SelectItem>
                        <SelectItem value="mystery">Mistério</SelectItem>
                        <SelectItem value="supernatural">Sobrenatural</SelectItem>
                        <SelectItem value="conspiracy">Conspiração</SelectItem>
                        <SelectItem value="historical">Histórico</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button className="w-full" data-testid="button-predict-performance">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Prever Performance
                  </Button>
                </CardContent>
              </Card>

              {/* Performance Results */}
              <Card>
                <CardHeader>
                  <CardTitle>Previsão de Resultados</CardTitle>
                  <CardDescription>Baseado em análise de dados históricos</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 border rounded-lg">
                        <div className="text-2xl font-bold">245K</div>
                        <div className="text-xs text-muted-foreground">Views Estimadas</div>
                        <div className="text-xs text-green-600">89% confiança</div>
                      </div>
                      <div className="text-center p-3 border rounded-lg">
                        <div className="text-2xl font-bold">12.4%</div>
                        <div className="text-xs text-muted-foreground">Engagement Rate</div>
                        <div className="text-xs text-blue-600">92% confiança</div>
                      </div>
                      <div className="text-center p-3 border rounded-lg">
                        <div className="text-2xl font-bold">$1,247</div>
                        <div className="text-xs text-muted-foreground">Receita Estimada</div>
                        <div className="text-xs text-green-600">76% confiança</div>
                      </div>
                      <div className="text-center p-3 border rounded-lg">
                        <div className="text-2xl font-bold">78%</div>
                        <div className="text-xs text-muted-foreground">Viral Probability</div>
                        <div className="text-xs text-purple-600">84% confiança</div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-medium">Breakdown de Engagement</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Likes</span>
                          <span className="font-medium">18.9K (7.7%)</span>
                        </div>
                        <Progress value={77} className="h-2" />
                        
                        <div className="flex justify-between text-sm">
                          <span>Comentários</span>
                          <span className="font-medium">3.4K (1.4%)</span>
                        </div>
                        <Progress value={58} className="h-2" />
                        
                        <div className="flex justify-between text-sm">
                          <span>Compartilhamentos</span>
                          <span className="font-medium">7.8K (3.2%)</span>
                        </div>
                        <Progress value={85} className="h-2" />
                        
                        <div className="flex justify-between text-sm">
                          <span>Watch Time</span>
                          <span className="font-medium">67% retenção</span>
                        </div>
                        <Progress value={67} className="h-2" />
                      </div>
                    </div>

                    <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                      <h4 className="font-medium text-green-700 dark:text-green-300 mb-1">
                        Melhor Estratégia de Publicação
                      </h4>
                      <div className="text-sm space-y-1">
                        <div>📅 Data ótima: Quinta, 14 de Março</div>
                        <div>🕘 Horário: 21:30 BRT</div>
                        <div>📱 Plataforma primária: YouTube</div>
                        <div>🏷️ Tags: #mistério #crime #brasil</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Optimization Suggestions */}
            <Card>
              <CardHeader>
                <CardTitle>Sugestões de Otimização</CardTitle>
                <CardDescription>Recomendações para maximizar performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Target className="h-5 w-5 text-green-500" />
                        <span className="font-medium">Otimização de Título</span>
                      </div>
                      <Badge className="bg-green-100 text-green-700">+31% CTR</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Adicionar elementos emocionais e números específicos aumenta significativamente o click-through rate
                    </p>
                    <div className="space-y-2">
                      <div className="text-sm">
                        <span className="text-red-600">❌ Título atual:</span> "O Mistério Que Aterrorizou São Paulo"
                      </div>
                      <div className="text-sm">
                        <span className="text-green-600">✅ Sugestão:</span> "🔍 O MISTÉRIO que ATERRORIZOU 12 MILHÕES em São Paulo | Caso REAL Nunca Resolvido"
                      </div>
                    </div>
                    <Button size="sm" variant="outline" className="mt-2">
                      Aplicar Sugestão
                    </Button>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Eye className="h-5 w-5 text-blue-500" />
                        <span className="font-medium">Thumbnail Optimization</span>
                      </div>
                      <Badge className="bg-blue-100 text-blue-700">+27% Views</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Usar cores contrastantes e expressões humanas aumenta engagement visual
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="text-xs text-center">
                        <div className="w-full h-16 bg-red-100 rounded border mb-1"></div>
                        <span>Atual: 8.4% CTR</span>
                      </div>
                      <div className="text-xs text-center">
                        <div className="w-full h-16 bg-green-100 rounded border mb-1"></div>
                        <span>Opção A: 11.7% CTR</span>
                      </div>
                      <div className="text-xs text-center">
                        <div className="w-full h-16 bg-blue-100 rounded border mb-1"></div>
                        <span>Opção B: 10.9% CTR</span>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" className="mt-2">
                      Gerar Thumbnails
                    </Button>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-5 w-5 text-purple-500" />
                        <span className="font-medium">Timing Strategy</span>
                      </div>
                      <Badge className="bg-purple-100 text-purple-700">+18% Reach</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Ajustar horário de publicação baseado no comportamento da audiência
                    </p>
                    <div className="grid grid-cols-4 gap-2 text-xs">
                      <div className="text-center p-2 border rounded">
                        <div className="font-medium">20:00</div>
                        <div className="text-muted-foreground">84% audiência</div>
                      </div>
                      <div className="text-center p-2 border rounded bg-green-50">
                        <div className="font-medium">21:30</div>
                        <div className="text-green-600">94% audiência</div>
                      </div>
                      <div className="text-center p-2 border rounded">
                        <div className="font-medium">22:00</div>
                        <div className="text-muted-foreground">89% audiência</div>
                      </div>
                      <div className="text-center p-2 border rounded">
                        <div className="font-medium">23:00</div>
                        <div className="text-muted-foreground">76% audiência</div>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" className="mt-2">
                      Agendar para 21:30
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Market Intel */}
          <TabsContent value="market" className="space-y-6">
            <h3 className="text-lg font-semibold">Market Intelligence</h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Global Trends */}
              <Card>
                <CardHeader>
                  <CardTitle>Tendências Globais</CardTitle>
                  <CardDescription>Índices de mercado para conteúdo dark</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Demanda Dark Content</span>
                        <span className="font-medium">{mockMarketIntelligence.global_trends.dark_content_demand}%</span>
                      </div>
                      <Progress value={mockMarketIntelligence.global_trends.dark_content_demand} className="h-2" />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Crescimento Mistério</span>
                        <span className="font-medium text-green-600">+{mockMarketIntelligence.global_trends.mystery_genre_growth}%</span>
                      </div>
                      <Progress value={mockMarketIntelligence.global_trends.mystery_genre_growth} className="h-2" />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Popularidade True Crime</span>
                        <span className="font-medium">{mockMarketIntelligence.global_trends.true_crime_popularity}%</span>
                      </div>
                      <Progress value={mockMarketIntelligence.global_trends.true_crime_popularity} className="h-2" />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Consumo Documentários</span>
                        <span className="font-medium">{mockMarketIntelligence.global_trends.documentary_consumption}%</span>
                      </div>
                      <Progress value={mockMarketIntelligence.global_trends.documentary_consumption} className="h-2" />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>CTR YouTube Dark</span>
                        <span className="font-medium">{mockMarketIntelligence.global_trends.youtube_dark_content_ctr}%</span>
                      </div>
                      <Progress value={mockMarketIntelligence.global_trends.youtube_dark_content_ctr} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Content Gaps */}
              <Card>
                <CardHeader>
                  <CardTitle>Oportunidades de Mercado</CardTitle>
                  <CardDescription>Gaps de conteúdo com alto potencial</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockMarketIntelligence.content_gaps.map((gap, index) => (
                      <div key={index} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-sm">{gap.topic}</h4>
                          <Badge variant="outline" className="text-xs">
                            {formatNumber(gap.potential_audience)} audiência
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-3 text-xs">
                          <div>
                            <div className="text-muted-foreground">Demanda</div>
                            <div className="font-medium text-green-600">{gap.demand_score.toFixed(1)}</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Oferta</div>
                            <div className="font-medium text-orange-600">{gap.supply_score.toFixed(1)}</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Oportunidade</div>
                            <div className="font-medium text-purple-600">{gap.opportunity_score.toFixed(1)}</div>
                          </div>
                        </div>
                        
                        <div className="mt-2">
                          <div className="flex justify-between text-xs">
                            <span>Dificuldade: {gap.difficulty}/10</span>
                            <Button size="sm" variant="outline" className="h-6 text-xs">
                              Explorar
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Demographics */}
            <Card>
              <CardHeader>
                <CardTitle>Insights de Audiência</CardTitle>
                <CardDescription>Perfil demográfico e comportamental</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Age Demographics */}
                  <div>
                    <h4 className="font-medium mb-3">Distribuição por Idade</h4>
                    <div className="space-y-3">
                      {mockMarketIntelligence.audience_insights.primary_demographics.map((demo, index) => (
                        <div key={index} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>{demo.age_range}</span>
                            <span className="font-medium">{demo.percentage}%</span>
                          </div>
                          <Progress value={demo.percentage} className="h-2" />
                          <div className="text-xs text-muted-foreground">
                            Engagement: {formatPercentage(demo.engagement_rate)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Geographic */}
                  <div>
                    <h4 className="font-medium mb-3">Distribuição Geográfica</h4>
                    <div className="space-y-3">
                      {mockMarketIntelligence.audience_insights.geographic_distribution.map((geo, index) => (
                        <div key={index} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>{geo.country}</span>
                            <span className="font-medium">{geo.percentage}%</span>
                          </div>
                          <Progress value={geo.percentage} className="h-2" />
                          <div className="text-xs text-muted-foreground">
                            Crescimento: +{geo.growth_rate}%
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Discovery Methods */}
                  <div>
                    <h4 className="font-medium mb-3">Métodos de Descoberta</h4>
                    <div className="space-y-3">
                      {mockMarketIntelligence.audience_insights.behavioral_patterns.content_discovery_methods.map((method, index) => (
                        <div key={index} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>{method.method}</span>
                            <span className="font-medium">{method.percentage}%</span>
                          </div>
                          <Progress value={method.percentage} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Future Predictions */}
            <Card>
              <CardHeader>
                <CardTitle>Previsões Futuras</CardTitle>
                <CardDescription>Tendências e mudanças esperadas no mercado</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Next 30 Days */}
                  <div>
                    <h4 className="font-medium mb-3">Próximos 30 Dias</h4>
                    <div className="space-y-3">
                      <div>
                        <div className="text-sm text-muted-foreground">Trending Topics</div>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {mockMarketIntelligence.future_predictions.next_30_days.trending_topics.slice(0, 3).map((topic, i) => (
                            <Badge key={i} variant="outline" className="text-xs">{topic}</Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-sm text-muted-foreground">Crescimento Esperado</div>
                        <div className="text-lg font-bold text-green-600">
                          +{mockMarketIntelligence.future_predictions.next_30_days.expected_audience_growth}%
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-sm text-muted-foreground">Receita Prevista</div>
                        <div className="text-lg font-bold">
                          {formatCurrency(mockMarketIntelligence.future_predictions.next_30_days.revenue_forecast)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Next 90 Days */}
                  <div>
                    <h4 className="font-medium mb-3">Próximos 90 Dias</h4>
                    <div className="space-y-3">
                      <div>
                        <div className="text-sm text-muted-foreground">Mudanças de Mercado</div>
                        <ul className="text-xs space-y-1 mt-1">
                          {mockMarketIntelligence.future_predictions.next_90_days.market_shifts.slice(0, 2).map((shift, i) => (
                            <li key={i} className="flex items-start space-x-1">
                              <span>•</span>
                              <span>{shift}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <div className="text-sm text-muted-foreground">Novas Oportunidades</div>
                        <ul className="text-xs space-y-1 mt-1">
                          {mockMarketIntelligence.future_predictions.next_90_days.new_opportunities.slice(0, 2).map((opp, i) => (
                            <li key={i} className="flex items-start space-x-1">
                              <span>•</span>
                              <span>{opp}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Next Year */}
                  <div>
                    <h4 className="font-medium mb-3">Próximo Ano</h4>
                    <div className="space-y-3">
                      <div>
                        <div className="text-sm text-muted-foreground">Evolução da Indústria</div>
                        <ul className="text-xs space-y-1 mt-1">
                          {mockMarketIntelligence.future_predictions.next_year.industry_evolution.slice(0, 2).map((evo, i) => (
                            <li key={i} className="flex items-start space-x-1">
                              <span>•</span>
                              <span>{evo}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <div className="text-sm text-muted-foreground">Tendências de Monetização</div>
                        <ul className="text-xs space-y-1 mt-1">
                          {mockMarketIntelligence.future_predictions.next_year.monetization_trends.slice(0, 2).map((trend, i) => (
                            <li key={i} className="flex items-start space-x-1">
                              <span>•</span>
                              <span>{trend}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Revenue */}
          <TabsContent value="revenue" className="space-y-6">
            <h3 className="text-lg font-semibold">Projeções de Receita</h3>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Scenarios */}
              {Object.entries(mockRevenueProjection.scenarios).map(([scenario, data]) => (
                <Card key={scenario}>
                  <CardHeader>
                    <CardTitle className="capitalize">Cenário {scenario === 'conservative' ? 'Conservador' : scenario === 'realistic' ? 'Realista' : 'Otimista'}</CardTitle>
                    <CardDescription>
                      {scenario === 'conservative' ? 'Projeção cautelosa' : 
                       scenario === 'realistic' ? 'Projeção baseada em tendências' : 
                       'Projeção com máximo potencial'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-center">
                        <div className="text-3xl font-bold">{formatCurrency(data.total_revenue)}</div>
                        <div className="text-sm text-muted-foreground">Receita Total</div>
                        <div className={`text-sm flex items-center justify-center mt-1 ${
                          data.growth_rate > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {data.growth_rate > 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                          +{data.growth_rate}% crescimento
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h4 className="font-medium text-sm">Breakdown por Fonte</h4>
                        
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span>Ads</span>
                            <span className="font-medium">{formatCurrency(data.breakdown.ad_revenue)}</span>
                          </div>
                          <Progress value={(data.breakdown.ad_revenue / data.total_revenue) * 100} className="h-1" />
                        </div>

                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span>Sponsorships</span>
                            <span className="font-medium">{formatCurrency(data.breakdown.sponsorships)}</span>
                          </div>
                          <Progress value={(data.breakdown.sponsorships / data.total_revenue) * 100} className="h-1" />
                        </div>

                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span>Premium</span>
                            <span className="font-medium">{formatCurrency(data.breakdown.premium_subscriptions)}</span>
                          </div>
                          <Progress value={(data.breakdown.premium_subscriptions / data.total_revenue) * 100} className="h-1" />
                        </div>

                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span>Merchandise</span>
                            <span className="font-medium">{formatCurrency(data.breakdown.merchandise)}</span>
                          </div>
                          <Progress value={(data.breakdown.merchandise / data.total_revenue) * 100} className="h-1" />
                        </div>

                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span>Affiliates</span>
                            <span className="font-medium">{formatCurrency(data.breakdown.affiliate_commissions)}</span>
                          </div>
                          <Progress value={(data.breakdown.affiliate_commissions / data.total_revenue) * 100} className="h-1" />
                        </div>

                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span>Cursos</span>
                            <span className="font-medium">{formatCurrency(data.breakdown.courses_consulting)}</span>
                          </div>
                          <Progress value={(data.breakdown.courses_consulting / data.total_revenue) * 100} className="h-1" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Key Drivers */}
            <Card>
              <CardHeader>
                <CardTitle>Principais Direcionadores de Receita</CardTitle>
                <CardDescription>Fatores com maior impacto no crescimento financeiro</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockRevenueProjection.key_drivers.map((driver, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium">{driver.factor}</h4>
                        <Badge variant="outline">
                          {Math.round(driver.impact_weight * 100)}% impacto
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 text-sm mb-3">
                        <div>
                          <div className="text-muted-foreground">Atual</div>
                          <div className="font-medium">{driver.current_value}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Meta</div>
                          <div className="font-medium text-green-600">{driver.target_value}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Dificuldade</div>
                          <div className="font-medium">{driver.improvement_difficulty}/10</div>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span>Progresso para meta</span>
                          <span>{Math.round((driver.current_value / driver.target_value) * 100)}%</span>
                        </div>
                        <Progress value={(driver.current_value / driver.target_value) * 100} className="h-2" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Risk Analysis */}
            <Card>
              <CardHeader>
                <CardTitle>Análise de Riscos</CardTitle>
                <CardDescription>Fatores que podem impactar as projeções</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockRevenueProjection.risk_adjustments.map((risk, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{risk.risk_type}</h4>
                        <div className="flex space-x-2">
                          <Badge variant="outline" className="text-orange-600">
                            {Math.round(risk.probability * 100)}% prob
                          </Badge>
                          <Badge variant="outline" className="text-red-600">
                            {Math.round(Math.abs(risk.impact) * 100)}% impacto
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <h5 className="text-sm font-medium">Estratégias de Mitigação:</h5>
                        <ul className="text-sm space-y-1">
                          {risk.mitigation_strategies.map((strategy, i) => (
                            <li key={i} className="flex items-start space-x-2">
                              <span className="text-muted-foreground">•</span>
                              <span>{strategy}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Seasonal Adjustments */}
            <Card>
              <CardHeader>
                <CardTitle>Ajustes Sazonais</CardTitle>
                <CardDescription>Variações esperadas ao longo do ano</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockRevenueProjection.seasonal_adjustments.map((adjustment, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium">{adjustment.period}</h4>
                        <p className="text-sm text-muted-foreground">{adjustment.reasoning}</p>
                      </div>
                      <div className="text-right">
                        <div className={`text-lg font-bold ${
                          adjustment.adjustment_factor > 1 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {adjustment.adjustment_factor > 1 ? '+' : ''}{Math.round((adjustment.adjustment_factor - 1) * 100)}%
                        </div>
                        <div className="text-xs text-muted-foreground">Ajuste esperado</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Models */}
          <TabsContent value="models" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Modelos Preditivos</h3>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar modelos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                    data-testid="input-search-models"
                  />
                </div>
                
                <Select value={predictionType} onValueChange={setPredictionType}>
                  <SelectTrigger className="w-48" data-testid="select-prediction-type">
                    <SelectValue placeholder="Tipo de predição" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os tipos</SelectItem>
                    <SelectItem value="trending_topics">Trending Topics</SelectItem>
                    <SelectItem value="performance_forecast">Performance Forecast</SelectItem>
                    <SelectItem value="audience_behavior">Audience Behavior</SelectItem>
                    <SelectItem value="content_optimization">Content Optimization</SelectItem>
                    <SelectItem value="market_analysis">Market Analysis</SelectItem>
                    <SelectItem value="revenue_prediction">Revenue Prediction</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              {filteredModels.map((model) => (
                <Card key={model.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {/* Header do modelo */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                            {getTypeIcon(model.type)}
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <h3 className="font-semibold">{model.name}</h3>
                              <Badge className={getModelStatusColor(model.status)}>
                                {model.status === 'active' ? 'Ativo' :
                                 model.status === 'training' ? 'Treinando' :
                                 model.status === 'deprecated' ? 'Depreciado' : 'Erro'}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Horizonte: {model.prediction_horizon} • 
                              Última atualização: {new Date(model.last_updated).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Button size="sm" variant="outline" data-testid={`button-retrain-${model.id}`}>
                            <RefreshCw className="h-3 w-3 mr-1" />
                            Retreinar
                          </Button>
                          <Button size="sm" variant="outline" data-testid={`button-deploy-${model.id}`}>
                            <Play className="h-3 w-3 mr-1" />
                            Deploy
                          </Button>
                          <Button size="sm" variant="outline" data-testid={`button-configure-${model.id}`}>
                            <Settings className="h-3 w-3 mr-1" />
                            Config
                          </Button>
                        </div>
                      </div>

                      {/* Métricas principais */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-3 border rounded-lg">
                          <div className="text-xl font-bold">{model.accuracy.toFixed(1)}%</div>
                          <div className="text-xs text-muted-foreground">Precisão</div>
                        </div>
                        <div className="text-center p-3 border rounded-lg">
                          <div className="text-xl font-bold">{model.confidence.toFixed(1)}%</div>
                          <div className="text-xs text-muted-foreground">Confiança</div>
                        </div>
                        <div className="text-center p-3 border rounded-lg">
                          <div className="text-xl font-bold">{formatNumber(model.usage_stats.predictions_made)}</div>
                          <div className="text-xs text-muted-foreground">Previsões</div>
                        </div>
                        <div className="text-center p-3 border rounded-lg">
                          <div className="text-xl font-bold">{model.usage_stats.avg_processing_time.toFixed(1)}s</div>
                          <div className="text-xs text-muted-foreground">Tempo Médio</div>
                        </div>
                      </div>

                      {/* Métricas detalhadas */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-medium mb-2">Performance Metrics</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>Precision:</span>
                              <span className="font-medium">{model.metrics.precision.toFixed(3)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Recall:</span>
                              <span className="font-medium">{model.metrics.recall.toFixed(3)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>F1 Score:</span>
                              <span className="font-medium">{model.metrics.f1_score.toFixed(3)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>MAE:</span>
                              <span className="font-medium">{model.metrics.mae.toFixed(3)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>RMSE:</span>
                              <span className="font-medium">{model.metrics.rmse.toFixed(3)}</span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium mb-2">Training Info</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>Dataset Size:</span>
                              <span className="font-medium">{formatNumber(model.training_data_size)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Success Rate:</span>
                              <span className="font-medium text-green-600">
                                {((model.usage_stats.successful_predictions / model.usage_stats.predictions_made) * 100).toFixed(1)}%
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Last Prediction:</span>
                              <span className="font-medium">
                                {new Date(model.last_prediction).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Features */}
                      <div>
                        <h4 className="font-medium mb-2">Features Utilizadas</h4>
                        <div className="flex flex-wrap gap-2">
                          {model.features.map((feature, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Status específico por modelo */}
                      {model.status === 'training' && (
                        <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                          <div className="flex items-center space-x-2 mb-2">
                            <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />
                            <span className="font-medium">Treinamento em Progresso</span>
                          </div>
                          <Progress value={67} className="h-2 mb-1" />
                          <p className="text-xs text-muted-foreground">
                            Época 134/200 - Tempo estimado: 3h 45min
                          </p>
                        </div>
                      )}

                      {model.status === 'error' && (
                        <div className="p-3 bg-red-50 dark:bg-red-950 rounded-lg">
                          <div className="flex items-center space-x-2 mb-1">
                            <XCircle className="h-4 w-4 text-red-500" />
                            <span className="font-medium text-red-700 dark:text-red-300">Erro no Modelo</span>
                          </div>
                          <p className="text-xs text-red-600 dark:text-red-400">
                            Falha na validação dos dados - verificar qualidade do dataset
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}