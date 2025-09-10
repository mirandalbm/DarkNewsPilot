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
  Shield,
  ShieldCheck,
  Eye,
  EyeOff,
  Search,
  Filter,
  Calendar,
  Clock,
  User,
  Users,
  Settings,
  Database,
  Server,
  Activity,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Info,
  HelpCircle,
  AlertCircle,
  FileText,
  Download,
  Upload,
  RefreshCw,
  Plus,
  Edit,
  Trash2,
  ExternalLink,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Target,
  Zap,
  Globe,
  Lock,
  Unlock,
  Key,
  Fingerprint,
  Hash,
  Archive,
  History,
  GitBranch,
  UserCheck,
  UserX,
  LogIn,
  LogOut,
  MousePointer,
  Smartphone,
  Monitor,
  Tablet,
  Wifi,
  WifiOff,
  MapPin,
  Navigation,
  Compass,
  Flag,
  Bell,
  BellOff,
  Mail,
  Send,
  MessageSquare,
  Phone,
  Video,
  Image,
  FileImage,
  FileVideo,
  Music,
  VolumeX,
  Volume2,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Repeat,
  Shuffle,
  Copy,
  Share2,
  Link2,
  Bookmark,
  Star,
  Heart,
  ThumbsUp,
  ThumbsDown,
  Award,
  Package,
  Box,
  Layers,
  Grid,
  List,
  Table,
  Columns,
  Rows
} from 'lucide-react';

interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  username: string;
  action: string;
  category: 'authentication' | 'content' | 'system' | 'security' | 'user_management' | 'configuration' | 'data';
  severity: 'low' | 'medium' | 'high' | 'critical';
  resourceType: string;
  resourceId?: string;
  ipAddress: string;
  userAgent: string;
  location?: {
    country: string;
    city: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  details: {
    description: string;
    beforeValue?: any;
    afterValue?: any;
    metadata?: Record<string, any>;
  };
  status: 'success' | 'failure' | 'warning';
  sessionId: string;
  deviceInfo: {
    type: 'desktop' | 'mobile' | 'tablet';
    os: string;
    browser: string;
  };
}

interface ComplianceRule {
  id: string;
  name: string;
  description: string;
  standard: 'GDPR' | 'LGPD' | 'SOX' | 'HIPAA' | 'ISO27001' | 'PCI_DSS' | 'custom';
  category: 'data_protection' | 'access_control' | 'audit_trail' | 'incident_management' | 'business_continuity';
  requirements: string[];
  automatedChecks: boolean;
  frequency: 'real_time' | 'daily' | 'weekly' | 'monthly' | 'quarterly';
  lastCheck: string;
  status: 'compliant' | 'non_compliant' | 'warning' | 'not_applicable';
  evidence: Array<{
    type: 'log' | 'policy' | 'procedure' | 'report';
    description: string;
    timestamp: string;
    verified: boolean;
  }>;
  violations: Array<{
    id: string;
    description: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    detected: string;
    resolved?: string;
    remediation: string;
  }>;
}

interface SecurityAlert {
  id: string;
  type: 'suspicious_activity' | 'unauthorized_access' | 'data_breach' | 'system_compromise' | 'policy_violation';
  severity: 'info' | 'warning' | 'high' | 'critical';
  title: string;
  description: string;
  detectedAt: string;
  resolvedAt?: string;
  userId?: string;
  ipAddress?: string;
  affectedResources: string[];
  riskScore: number;
  indicators: Array<{
    type: string;
    value: string;
    confidence: number;
  }>;
  response: {
    status: 'new' | 'investigating' | 'resolved' | 'false_positive';
    assignedTo?: string;
    actions: Array<{
      action: string;
      timestamp: string;
      performedBy: string;
    }>;
    notes?: string;
  };
  relatedLogs: string[];
}

interface DataRetentionPolicy {
  id: string;
  name: string;
  dataType: 'audit_logs' | 'user_data' | 'content' | 'system_logs' | 'analytics' | 'backups';
  retentionPeriod: number; // in days
  archiveAfter: number; // in days
  deleteAfter: number; // in days
  legalHold: boolean;
  encryptionRequired: boolean;
  anonymizeData: boolean;
  compliance: string[];
  lastReview: string;
  nextReview: string;
  rules: Array<{
    condition: string;
    action: 'retain' | 'archive' | 'delete' | 'anonymize';
    period: number;
  }>;
  exemptions: Array<{
    reason: string;
    dataIdentifier: string;
    exemptUntil?: string;
  }>;
}

const mockAuditLogs: AuditLog[] = [
  {
    id: 'audit_001',
    timestamp: '2024-03-08 14:30:25',
    userId: 'user_001',
    username: 'admin@darknews.com',
    action: 'LOGIN_SUCCESS',
    category: 'authentication',
    severity: 'low',
    resourceType: 'user_session',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    location: {
      country: 'Brasil',
      city: 'São Paulo',
      coordinates: { lat: -23.5505, lng: -46.6333 }
    },
    details: {
      description: 'Usuário realizou login com sucesso',
      metadata: {
        loginMethod: 'email_password',
        twoFactorUsed: true,
        loginAttempts: 1
      }
    },
    status: 'success',
    sessionId: 'session_abc123',
    deviceInfo: {
      type: 'desktop',
      os: 'Windows 10',
      browser: 'Chrome 122'
    }
  },
  {
    id: 'audit_002',
    timestamp: '2024-03-08 14:45:12',
    userId: 'user_001',
    username: 'admin@darknews.com',
    action: 'VIDEO_PUBLISHED',
    category: 'content',
    severity: 'medium',
    resourceType: 'video',
    resourceId: 'video_456',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    location: {
      country: 'Brasil',
      city: 'São Paulo'
    },
    details: {
      description: 'Novo vídeo publicado no canal',
      beforeValue: { status: 'draft' },
      afterValue: { status: 'published', publishedAt: '2024-03-08 14:45:12' },
      metadata: {
        title: 'Mistérios da Noite - Episódio 15',
        duration: 1200,
        category: 'mystery'
      }
    },
    status: 'success',
    sessionId: 'session_abc123',
    deviceInfo: {
      type: 'desktop',
      os: 'Windows 10',
      browser: 'Chrome 122'
    }
  },
  {
    id: 'audit_003',
    timestamp: '2024-03-08 16:20:45',
    userId: 'user_002',
    username: 'editor@darknews.com',
    action: 'FAILED_LOGIN_ATTEMPT',
    category: 'security',
    severity: 'high',
    resourceType: 'authentication',
    ipAddress: '203.45.67.89',
    userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
    location: {
      country: 'Desconhecido',
      city: 'Desconhecido'
    },
    details: {
      description: 'Tentativa de login falhada - senha incorreta',
      metadata: {
        loginMethod: 'email_password',
        attemptNumber: 3,
        accountLocked: false,
        suspiciousActivity: true
      }
    },
    status: 'failure',
    sessionId: '',
    deviceInfo: {
      type: 'desktop',
      os: 'Linux',
      browser: 'Chrome 121'
    }
  },
  {
    id: 'audit_004',
    timestamp: '2024-03-08 10:15:30',
    userId: 'user_001',
    username: 'admin@darknews.com',
    action: 'SYSTEM_CONFIG_CHANGED',
    category: 'configuration',
    severity: 'high',
    resourceType: 'system_setting',
    resourceId: 'api_rate_limits',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    location: {
      country: 'Brasil',
      city: 'São Paulo'
    },
    details: {
      description: 'Limites de API alterados',
      beforeValue: { maxRequests: 1000, timeWindow: 3600 },
      afterValue: { maxRequests: 2000, timeWindow: 3600 },
      metadata: {
        reason: 'Aumento de capacidade',
        approvedBy: 'CTO'
      }
    },
    status: 'success',
    sessionId: 'session_abc123',
    deviceInfo: {
      type: 'desktop',
      os: 'Windows 10',
      browser: 'Chrome 122'
    }
  },
  {
    id: 'audit_005',
    timestamp: '2024-03-07 22:45:18',
    userId: 'system',
    username: 'Sistema Automático',
    action: 'DATA_BACKUP_COMPLETED',
    category: 'system',
    severity: 'low',
    resourceType: 'backup',
    resourceId: 'backup_20240307',
    ipAddress: '127.0.0.1',
    userAgent: 'DarkNews-Backup-Service/1.0',
    details: {
      description: 'Backup automático do banco de dados concluído',
      metadata: {
        backupSize: '2.5GB',
        duration: '45 minutes',
        success: true,
        location: 's3://darknews-backups/2024/03/07/'
      }
    },
    status: 'success',
    sessionId: 'system_backup',
    deviceInfo: {
      type: 'desktop',
      os: 'Linux Server',
      browser: 'System Process'
    }
  }
];

const mockComplianceRules: ComplianceRule[] = [
  {
    id: 'rule_001',
    name: 'Retenção de Dados Pessoais',
    description: 'Dados pessoais devem ser mantidos apenas pelo tempo necessário',
    standard: 'LGPD',
    category: 'data_protection',
    requirements: [
      'Definir período de retenção para cada tipo de dado',
      'Implementar exclusão automática após expiração',
      'Permitir exclusão manual mediante solicitação',
      'Manter registro de exclusões realizadas'
    ],
    automatedChecks: true,
    frequency: 'daily',
    lastCheck: '2024-03-08 06:00:00',
    status: 'compliant',
    evidence: [
      {
        type: 'policy',
        description: 'Política de Retenção de Dados v2.1',
        timestamp: '2024-01-15',
        verified: true
      },
      {
        type: 'log',
        description: 'Logs de exclusão automática',
        timestamp: '2024-03-08',
        verified: true
      }
    ],
    violations: []
  },
  {
    id: 'rule_002',
    name: 'Controle de Acesso Privilegiado',
    description: 'Acessos administrativos devem ser auditados e controlados',
    standard: 'ISO27001',
    category: 'access_control',
    requirements: [
      'Autenticação multifator para administradores',
      'Revisão periódica de permissões',
      'Registro de todas as ações administrativas',
      'Segregação de funções'
    ],
    automatedChecks: true,
    frequency: 'real_time',
    lastCheck: '2024-03-08 14:30:25',
    status: 'compliant',
    evidence: [
      {
        type: 'log',
        description: 'Logs de autenticação administrativa',
        timestamp: '2024-03-08',
        verified: true
      },
      {
        type: 'procedure',
        description: 'Procedimento de Revisão de Acesso',
        timestamp: '2024-02-01',
        verified: true
      }
    ],
    violations: []
  },
  {
    id: 'rule_003',
    name: 'Notificação de Incidentes',
    description: 'Incidentes de segurança devem ser reportados dentro de 72 horas',
    standard: 'LGPD',
    category: 'incident_management',
    requirements: [
      'Detecção automática de incidentes',
      'Classificação por severidade',
      'Notificação às autoridades competentes',
      'Comunicação aos titulares dos dados'
    ],
    automatedChecks: true,
    frequency: 'real_time',
    lastCheck: '2024-03-08 16:20:45',
    status: 'warning',
    evidence: [
      {
        type: 'procedure',
        description: 'Plano de Resposta a Incidentes',
        timestamp: '2024-01-10',
        verified: true
      }
    ],
    violations: [
      {
        id: 'violation_001',
        description: 'Tentativas de login suspeitas não foram reportadas automaticamente',
        severity: 'medium',
        detected: '2024-03-08 16:20:45',
        remediation: 'Implementar alertas automáticos para tentativas de login falhadas'
      }
    ]
  }
];

const mockSecurityAlerts: SecurityAlert[] = [
  {
    id: 'alert_001',
    type: 'suspicious_activity',
    severity: 'high',
    title: 'Múltiplas tentativas de login falhadas',
    description: 'Detectadas 5 tentativas de login falhadas em 10 minutos do IP 203.45.67.89',
    detectedAt: '2024-03-08 16:25:00',
    userId: 'user_002',
    ipAddress: '203.45.67.89',
    affectedResources: ['authentication_system', 'user_account_editor'],
    riskScore: 75,
    indicators: [
      { type: 'ip_reputation', value: 'suspicious', confidence: 0.8 },
      { type: 'geolocation', value: 'unknown_location', confidence: 0.9 },
      { type: 'user_behavior', value: 'anomalous', confidence: 0.7 }
    ],
    response: {
      status: 'investigating',
      assignedTo: 'security_team',
      actions: [
        {
          action: 'IP temporariamente bloqueado',
          timestamp: '2024-03-08 16:26:00',
          performedBy: 'automated_system'
        },
        {
          action: 'Notificação enviada à equipe de segurança',
          timestamp: '2024-03-08 16:26:30',
          performedBy: 'automated_system'
        }
      ],
      notes: 'Investigando origem do IP e padrões de comportamento'
    },
    relatedLogs: ['audit_003']
  },
  {
    id: 'alert_002',
    type: 'unauthorized_access',
    severity: 'critical',
    title: 'Acesso a área administrativa sem autenticação adequada',
    description: 'Tentativa de acesso direto a endpoints administrativos',
    detectedAt: '2024-03-07 18:45:32',
    ipAddress: '198.51.100.42',
    affectedResources: ['admin_panel', 'user_management'],
    riskScore: 95,
    indicators: [
      { type: 'endpoint_access', value: '/admin/users/delete', confidence: 1.0 },
      { type: 'authentication', value: 'bypassed', confidence: 0.95 },
      { type: 'privilege_escalation', value: 'attempted', confidence: 0.8 }
    ],
    response: {
      status: 'resolved',
      assignedTo: 'security_admin',
      actions: [
        {
          action: 'IP bloqueado permanentemente',
          timestamp: '2024-03-07 18:46:00',
          performedBy: 'security_admin'
        },
        {
          action: 'Endpoints administrativos protegidos com validação adicional',
          timestamp: '2024-03-07 19:15:00',
          performedBy: 'dev_team'
        },
        {
          action: 'Auditoria de segurança realizada',
          timestamp: '2024-03-07 20:00:00',
          performedBy: 'security_team'
        }
      ],
      notes: 'Vulnerabilidade corrigida. Sistema reforçado com autenticação dupla para endpoints administrativos.'
    },
    relatedLogs: []
  },
  {
    id: 'alert_003',
    type: 'policy_violation',
    severity: 'warning',
    title: 'Alteração de configuração fora do horário comercial',
    description: 'Configurações do sistema foram alteradas às 22:30, fora do horário permitido',
    detectedAt: '2024-03-06 22:30:15',
    userId: 'user_001',
    affectedResources: ['system_configuration'],
    riskScore: 45,
    indicators: [
      { type: 'time_window', value: 'after_hours', confidence: 1.0 },
      { type: 'change_magnitude', value: 'significant', confidence: 0.6 }
    ],
    response: {
      status: 'resolved',
      assignedTo: 'compliance_officer',
      actions: [
        {
          action: 'Verificação com o usuário responsável',
          timestamp: '2024-03-07 08:00:00',
          performedBy: 'compliance_officer'
        },
        {
          action: 'Alteração aprovada retroativamente',
          timestamp: '2024-03-07 08:30:00',
          performedBy: 'compliance_officer'
        }
      ],
      notes: 'Alteração emergencial aprovada. Usuário orientado sobre procedimentos para emergências.'
    },
    relatedLogs: []
  }
];

const mockRetentionPolicies: DataRetentionPolicy[] = [
  {
    id: 'policy_001',
    name: 'Logs de Auditoria',
    dataType: 'audit_logs',
    retentionPeriod: 2555, // 7 anos
    archiveAfter: 365, // 1 ano
    deleteAfter: 2555, // 7 anos
    legalHold: false,
    encryptionRequired: true,
    anonymizeData: false,
    compliance: ['LGPD', 'SOX'],
    lastReview: '2024-01-15',
    nextReview: '2024-07-15',
    rules: [
      {
        condition: 'security_incident_logs',
        action: 'retain',
        period: 3650 // 10 anos para logs de incidentes de segurança
      },
      {
        condition: 'routine_access_logs',
        action: 'archive',
        period: 365 // 1 ano para logs de acesso rotineiro
      }
    ],
    exemptions: []
  },
  {
    id: 'policy_002',
    name: 'Dados Pessoais de Usuários',
    dataType: 'user_data',
    retentionPeriod: 1095, // 3 anos
    archiveAfter: 730, // 2 anos
    deleteAfter: 1095, // 3 anos
    legalHold: false,
    encryptionRequired: true,
    anonymizeData: true,
    compliance: ['LGPD', 'GDPR'],
    lastReview: '2024-02-01',
    nextReview: '2024-08-01',
    rules: [
      {
        condition: 'inactive_users',
        action: 'anonymize',
        period: 730 // 2 anos de inatividade
      },
      {
        condition: 'deletion_request',
        action: 'delete',
        period: 30 // 30 dias após solicitação
      }
    ],
    exemptions: [
      {
        reason: 'Processo judicial em andamento',
        dataIdentifier: 'user_12345',
        exemptUntil: '2024-12-31'
      }
    ]
  },
  {
    id: 'policy_003',
    name: 'Conteúdo de Vídeos',
    dataType: 'content',
    retentionPeriod: 1825, // 5 anos
    archiveAfter: 1095, // 3 anos
    deleteAfter: 1825, // 5 anos
    legalHold: false,
    encryptionRequired: false,
    anonymizeData: false,
    compliance: ['Direitos Autorais'],
    lastReview: '2024-01-01',
    nextReview: '2024-07-01',
    rules: [
      {
        condition: 'copyright_claim',
        action: 'retain',
        period: 2555 // 7 anos para conteúdo com claims de copyright
      },
      {
        condition: 'low_performance',
        action: 'archive',
        period: 730 // 2 anos para vídeos com baixo desempenho
      }
    ],
    exemptions: []
  }
];

export default function Audit() {
  const [selectedTab, setSelectedTab] = useState('logs');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState('today');
  const [showRuleDialog, setShowRuleDialog] = useState(false);
  const [showPolicyDialog, setShowPolicyDialog] = useState(false);
  const { toast } = useToast();

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'authentication': return 'bg-blue-100 text-blue-800 dark:bg-blue-950';
      case 'content': return 'bg-green-100 text-green-800 dark:bg-green-950';
      case 'system': return 'bg-purple-100 text-purple-800 dark:bg-purple-950';
      case 'security': return 'bg-red-100 text-red-800 dark:bg-red-950';
      case 'user_management': return 'bg-orange-100 text-orange-800 dark:bg-orange-950';
      case 'configuration': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950';
      case 'data': return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-950';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'text-green-500 bg-green-100 dark:bg-green-950';
      case 'medium': return 'text-yellow-500 bg-yellow-100 dark:bg-yellow-950';
      case 'high': return 'text-orange-500 bg-orange-100 dark:bg-orange-950';
      case 'critical': return 'text-red-500 bg-red-100 dark:bg-red-950';
      default: return 'text-gray-500 bg-gray-100 dark:bg-gray-950';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-500 bg-green-100 dark:bg-green-950';
      case 'failure': return 'text-red-500 bg-red-100 dark:bg-red-950';
      case 'warning': return 'text-yellow-500 bg-yellow-100 dark:bg-yellow-950';
      case 'compliant': return 'text-green-500 bg-green-100 dark:bg-green-950';
      case 'non_compliant': return 'text-red-500 bg-red-100 dark:bg-red-950';
      default: return 'text-gray-500 bg-gray-100 dark:bg-gray-950';
    }
  };

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType) {
      case 'mobile': return <Smartphone className="h-4 w-4" />;
      case 'tablet': return <Tablet className="h-4 w-4" />;
      case 'desktop': return <Monitor className="h-4 w-4" />;
      default: return <Monitor className="h-4 w-4" />;
    }
  };

  const getAlertTypeIcon = (type: string) => {
    switch (type) {
      case 'suspicious_activity': return <Eye className="h-4 w-4" />;
      case 'unauthorized_access': return <Lock className="h-4 w-4" />;
      case 'data_breach': return <Database className="h-4 w-4" />;
      case 'system_compromise': return <Server className="h-4 w-4" />;
      case 'policy_violation': return <Flag className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const handleCreateRule = () => {
    toast({
      title: "Regra criada",
      description: "Nova regra de compliance foi criada",
    });
    setShowRuleDialog(false);
  };

  const handleCreatePolicy = () => {
    toast({
      title: "Política criada",
      description: "Nova política de retenção foi criada",
    });
    setShowPolicyDialog(false);
  };

  const handleExportLogs = () => {
    toast({
      title: "Exportação iniciada",
      description: "Os logs estão sendo exportados",
    });
  };

  const handleGenerateReport = () => {
    toast({
      title: "Relatório gerado",
      description: "Relatório de auditoria foi gerado com sucesso",
    });
  };

  const filteredLogs = mockAuditLogs.filter(log => {
    let matches = true;
    
    if (categoryFilter !== 'all' && log.category !== categoryFilter) matches = false;
    if (severityFilter !== 'all' && log.severity !== severityFilter) matches = false;
    if (statusFilter !== 'all' && log.status !== statusFilter) matches = false;
    if (searchTerm && !log.action.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !log.username.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !log.details.description.toLowerCase().includes(searchTerm.toLowerCase())) matches = false;
    
    return matches;
  });

  const totalLogs = mockAuditLogs.length;
  const criticalLogs = mockAuditLogs.filter(log => log.severity === 'critical').length;
  const failedActions = mockAuditLogs.filter(log => log.status === 'failure').length;
  const securityEvents = mockAuditLogs.filter(log => log.category === 'security').length;

  return (
    <div className="container mx-auto px-6 py-8 max-w-7xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Sistema de Auditoria</h1>
              <p className="text-muted-foreground">Monitoramento, compliance e trilha de auditoria completa</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button onClick={handleExportLogs} data-testid="button-export-logs">
              <Download className="h-4 w-4 mr-2" />
              Exportar Logs
            </Button>
            
            <Button onClick={handleGenerateReport} variant="outline" data-testid="button-generate-report">
              <FileText className="h-4 w-4 mr-2" />
              Gerar Relatório
            </Button>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total de Logs</p>
                  <p className="text-2xl font-bold">{totalLogs}</p>
                  <p className="text-xs text-blue-500 flex items-center mt-1">
                    <Activity className="h-3 w-3 mr-1" />
                    Últimas 24h
                  </p>
                </div>
                <Activity className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Eventos Críticos</p>
                  <p className="text-2xl font-bold">{criticalLogs}</p>
                  <p className="text-xs text-red-500 flex items-center mt-1">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    Requer atenção
                  </p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Ações Falhadas</p>
                  <p className="text-2xl font-bold">{failedActions}</p>
                  <p className="text-xs text-orange-500 flex items-center mt-1">
                    <XCircle className="h-3 w-3 mr-1" />
                    Para investigar
                  </p>
                </div>
                <XCircle className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Eventos de Segurança</p>
                  <p className="text-2xl font-bold">{securityEvents}</p>
                  <p className="text-xs text-purple-500 flex items-center mt-1">
                    <Shield className="h-3 w-3 mr-1" />
                    Monitorados
                  </p>
                </div>
                <Shield className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="logs">Logs</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
            <TabsTrigger value="alerts">Alertas</TabsTrigger>
            <TabsTrigger value="retention">Retenção</TabsTrigger>
            <TabsTrigger value="reports">Relatórios</TabsTrigger>
          </TabsList>

          {/* Logs */}
          <TabsContent value="logs" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Logs de Auditoria</h3>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar logs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                    data-testid="input-search-logs"
                  />
                </div>
                
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-40" data-testid="select-category-filter">
                    <SelectValue placeholder="Categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    <SelectItem value="authentication">Autenticação</SelectItem>
                    <SelectItem value="content">Conteúdo</SelectItem>
                    <SelectItem value="system">Sistema</SelectItem>
                    <SelectItem value="security">Segurança</SelectItem>
                    <SelectItem value="user_management">Usuários</SelectItem>
                    <SelectItem value="configuration">Configuração</SelectItem>
                    <SelectItem value="data">Dados</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={severityFilter} onValueChange={setSeverityFilter}>
                  <SelectTrigger className="w-40" data-testid="select-severity-filter">
                    <SelectValue placeholder="Severidade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    <SelectItem value="critical">Crítica</SelectItem>
                    <SelectItem value="high">Alta</SelectItem>
                    <SelectItem value="medium">Média</SelectItem>
                    <SelectItem value="low">Baixa</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40" data-testid="select-status-filter">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="success">Sucesso</SelectItem>
                    <SelectItem value="failure">Falha</SelectItem>
                    <SelectItem value="warning">Aviso</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              {filteredLogs.map((log) => (
                <Card key={log.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {/* Header do log */}
                      <div className="flex items-start justify-between">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center space-x-2">
                            <Activity className="h-4 w-4" />
                            <h3 className="font-semibold">{log.action.replace('_', ' ')}</h3>
                            <Badge className={getCategoryColor(log.category)}>
                              {log.category === 'authentication' ? 'Autenticação' :
                               log.category === 'content' ? 'Conteúdo' :
                               log.category === 'system' ? 'Sistema' :
                               log.category === 'security' ? 'Segurança' :
                               log.category === 'user_management' ? 'Usuários' :
                               log.category === 'configuration' ? 'Configuração' : 'Dados'}
                            </Badge>
                            <Badge className={getSeverityColor(log.severity)}>
                              {log.severity === 'critical' ? 'Crítica' :
                               log.severity === 'high' ? 'Alta' :
                               log.severity === 'medium' ? 'Média' : 'Baixa'}
                            </Badge>
                            <Badge className={getStatusColor(log.status)}>
                              {log.status === 'success' ? 'Sucesso' :
                               log.status === 'failure' ? 'Falha' : 'Aviso'}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                            <span>Usuário: {log.username}</span>
                            <span>IP: {log.ipAddress}</span>
                            <span>Timestamp: {log.timestamp}</span>
                            {log.location && <span>Local: {log.location.city}, {log.location.country}</span>}
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          {getDeviceIcon(log.deviceInfo.type)}
                          <div className="text-right">
                            <div className="text-sm font-medium">{log.deviceInfo.os}</div>
                            <div className="text-xs text-muted-foreground">{log.deviceInfo.browser}</div>
                          </div>
                        </div>
                      </div>

                      {/* Descrição */}
                      <div className="p-3 bg-muted/50 rounded-lg">
                        <p className="text-sm">{log.details.description}</p>
                      </div>

                      {/* Mudanças (antes/depois) */}
                      {log.details.beforeValue && log.details.afterValue && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <h4 className="text-sm font-medium">Valor Anterior:</h4>
                            <div className="p-2 bg-red-50 dark:bg-red-950 rounded text-xs">
                              <pre>{JSON.stringify(log.details.beforeValue, null, 2)}</pre>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <h4 className="text-sm font-medium">Novo Valor:</h4>
                            <div className="p-2 bg-green-50 dark:bg-green-950 rounded text-xs">
                              <pre>{JSON.stringify(log.details.afterValue, null, 2)}</pre>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Metadata */}
                      {log.details.metadata && Object.keys(log.details.metadata).length > 0 && (
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium">Metadados:</h4>
                          <div className="flex flex-wrap gap-2">
                            {Object.entries(log.details.metadata).map(([key, value]) => (
                              <Badge key={key} variant="outline" className="text-xs">
                                {key}: {String(value)}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" data-testid={`button-details-${log.id}`}>
                            <Info className="h-4 w-4 mr-1" />
                            Ver Detalhes
                          </Button>
                          <Button variant="outline" size="sm" data-testid={`button-export-${log.id}`}>
                            <Download className="h-4 w-4 mr-1" />
                            Exportar
                          </Button>
                          {log.resourceId && (
                            <Button variant="outline" size="sm" data-testid={`button-resource-${log.id}`}>
                              <ExternalLink className="h-4 w-4 mr-1" />
                              Ver Recurso
                            </Button>
                          )}
                        </div>
                        
                        <div className="text-xs text-muted-foreground">
                          Session: {log.sessionId} | ID: {log.id}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Compliance */}
          <TabsContent value="compliance" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Regras de Compliance</h3>
              <Dialog open={showRuleDialog} onOpenChange={setShowRuleDialog}>
                <DialogTrigger asChild>
                  <Button data-testid="button-new-rule">
                    <Plus className="h-4 w-4 mr-2" />
                    Nova Regra
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Criar Nova Regra de Compliance</DialogTitle>
                    <DialogDescription>
                      Configure uma nova regra para monitoramento de compliance
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="rule-name">Nome da Regra</Label>
                        <Input id="rule-name" placeholder="Ex: Controle de Acesso" data-testid="input-rule-name" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="rule-standard">Padrão</Label>
                        <Select>
                          <SelectTrigger data-testid="select-rule-standard">
                            <SelectValue placeholder="Padrão" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="GDPR">GDPR</SelectItem>
                            <SelectItem value="LGPD">LGPD</SelectItem>
                            <SelectItem value="SOX">SOX</SelectItem>
                            <SelectItem value="HIPAA">HIPAA</SelectItem>
                            <SelectItem value="ISO27001">ISO 27001</SelectItem>
                            <SelectItem value="PCI_DSS">PCI DSS</SelectItem>
                            <SelectItem value="custom">Personalizado</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="rule-category">Categoria</Label>
                        <Select>
                          <SelectTrigger data-testid="select-rule-category">
                            <SelectValue placeholder="Categoria" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="data_protection">Proteção de Dados</SelectItem>
                            <SelectItem value="access_control">Controle de Acesso</SelectItem>
                            <SelectItem value="audit_trail">Trilha de Auditoria</SelectItem>
                            <SelectItem value="incident_management">Gestão de Incidentes</SelectItem>
                            <SelectItem value="business_continuity">Continuidade do Negócio</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="rule-frequency">Frequência</Label>
                        <Select>
                          <SelectTrigger data-testid="select-rule-frequency">
                            <SelectValue placeholder="Frequência" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="real_time">Tempo Real</SelectItem>
                            <SelectItem value="daily">Diário</SelectItem>
                            <SelectItem value="weekly">Semanal</SelectItem>
                            <SelectItem value="monthly">Mensal</SelectItem>
                            <SelectItem value="quarterly">Trimestral</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="rule-description">Descrição</Label>
                      <Textarea 
                        id="rule-description" 
                        placeholder="Descreva os requisitos da regra..."
                        data-testid="textarea-rule-description"
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch data-testid="switch-automated-checks" />
                      <Label className="text-sm">Verificações Automáticas</Label>
                    </div>

                    <Button onClick={handleCreateRule} className="w-full" data-testid="button-create-rule">
                      Criar Regra
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="space-y-4">
              {mockComplianceRules.map((rule) => (
                <Card key={rule.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {/* Header da regra */}
                      <div className="flex items-start justify-between">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center space-x-2">
                            <ShieldCheck className="h-4 w-4" />
                            <h3 className="font-semibold">{rule.name}</h3>
                            <Badge variant="outline">{rule.standard}</Badge>
                            <Badge className={
                              rule.category === 'data_protection' ? 'bg-blue-100 text-blue-800' :
                              rule.category === 'access_control' ? 'bg-green-100 text-green-800' :
                              rule.category === 'audit_trail' ? 'bg-purple-100 text-purple-800' :
                              rule.category === 'incident_management' ? 'bg-orange-100 text-orange-800' :
                              'bg-gray-100 text-gray-800'
                            }>
                              {rule.category.replace('_', ' ')}
                            </Badge>
                            <Badge className={getStatusColor(rule.status)}>
                              {rule.status === 'compliant' ? 'Conforme' :
                               rule.status === 'non_compliant' ? 'Não Conforme' :
                               rule.status === 'warning' ? 'Atenção' : 'N/A'}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{rule.description}</p>
                          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                            <span>Última verificação: {rule.lastCheck}</span>
                            <span>Frequência: {rule.frequency}</span>
                            <span>Automático: {rule.automatedChecks ? 'Sim' : 'Não'}</span>
                          </div>
                        </div>
                      </div>

                      {/* Requisitos */}
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Requisitos ({rule.requirements.length}):</h4>
                        <ul className="text-sm space-y-1">
                          {rule.requirements.slice(0, 3).map((req, index) => (
                            <li key={index} className="flex items-start space-x-2">
                              <CheckCircle className="h-3 w-3 text-green-500 mt-1" />
                              <span>{req}</span>
                            </li>
                          ))}
                          {rule.requirements.length > 3 && (
                            <li className="text-muted-foreground">... e mais {rule.requirements.length - 3} requisitos</li>
                          )}
                        </ul>
                      </div>

                      {/* Evidências */}
                      {rule.evidence.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium">Evidências ({rule.evidence.length}):</h4>
                          <div className="space-y-2">
                            {rule.evidence.slice(0, 2).map((evidence, index) => (
                              <div key={index} className="flex items-center space-x-2 p-2 bg-muted/50 rounded">
                                <FileText className="h-4 w-4" />
                                <div className="flex-1">
                                  <div className="text-sm font-medium">{evidence.description}</div>
                                  <div className="text-xs text-muted-foreground">{evidence.timestamp}</div>
                                </div>
                                {evidence.verified && <CheckCircle className="h-4 w-4 text-green-500" />}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Violações */}
                      {rule.violations.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium text-red-600">Violações ({rule.violations.length}):</h4>
                          <div className="space-y-2">
                            {rule.violations.map((violation, index) => (
                              <div key={index} className="p-3 bg-red-50 dark:bg-red-950 rounded">
                                <div className="flex items-center space-x-2 mb-1">
                                  <AlertTriangle className="h-4 w-4 text-red-500" />
                                  <span className="font-medium text-sm">{violation.description}</span>
                                  <Badge className={getSeverityColor(violation.severity)}>
                                    {violation.severity}
                                  </Badge>
                                </div>
                                <p className="text-xs text-muted-foreground">Detectado: {violation.detected}</p>
                                <p className="text-xs mt-1">Remediação: {violation.remediation}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" data-testid={`button-edit-rule-${rule.id}`}>
                            <Edit className="h-4 w-4 mr-1" />
                            Editar
                          </Button>
                          <Button variant="outline" size="sm" data-testid={`button-check-rule-${rule.id}`}>
                            <RefreshCw className="h-4 w-4 mr-1" />
                            Verificar Agora
                          </Button>
                          <Button variant="outline" size="sm" data-testid={`button-evidence-${rule.id}`}>
                            <FileText className="h-4 w-4 mr-1" />
                            Evidências
                          </Button>
                        </div>
                        
                        <div className="text-xs text-muted-foreground">
                          ID: {rule.id}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Alertas */}
          <TabsContent value="alerts" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Alertas de Segurança</h3>
              <Button data-testid="button-configure-alerts">
                <Settings className="h-4 w-4 mr-2" />
                Configurar Alertas
              </Button>
            </div>

            <div className="space-y-4">
              {mockSecurityAlerts.map((alert) => (
                <Card key={alert.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {/* Header do alerta */}
                      <div className="flex items-start justify-between">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center space-x-2">
                            {getAlertTypeIcon(alert.type)}
                            <h3 className="font-semibold">{alert.title}</h3>
                            <Badge className={getSeverityColor(alert.severity)}>
                              {alert.severity === 'critical' ? 'Crítico' :
                               alert.severity === 'high' ? 'Alto' :
                               alert.severity === 'warning' ? 'Aviso' : 'Info'}
                            </Badge>
                            <Badge className={
                              alert.response.status === 'new' ? 'bg-red-100 text-red-800' :
                              alert.response.status === 'investigating' ? 'bg-yellow-100 text-yellow-800' :
                              alert.response.status === 'resolved' ? 'bg-green-100 text-green-800' :
                              'bg-gray-100 text-gray-800'
                            }>
                              {alert.response.status === 'new' ? 'Novo' :
                               alert.response.status === 'investigating' ? 'Investigando' :
                               alert.response.status === 'resolved' ? 'Resolvido' : 'Falso Positivo'}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{alert.description}</p>
                          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                            <span>Detectado: {alert.detectedAt}</span>
                            {alert.resolvedAt && <span>Resolvido: {alert.resolvedAt}</span>}
                            {alert.ipAddress && <span>IP: {alert.ipAddress}</span>}
                            {alert.response.assignedTo && <span>Responsável: {alert.response.assignedTo}</span>}
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="text-lg font-bold text-red-500">
                            {alert.riskScore}
                          </div>
                          <p className="text-xs text-muted-foreground">Risk Score</p>
                        </div>
                      </div>

                      {/* Recursos afetados */}
                      {alert.affectedResources.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium">Recursos Afetados:</h4>
                          <div className="flex flex-wrap gap-1">
                            {alert.affectedResources.map((resource, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {resource.replace('_', ' ')}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Indicadores */}
                      {alert.indicators.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium">Indicadores de Compromisso:</h4>
                          <div className="space-y-2">
                            {alert.indicators.map((indicator, index) => (
                              <div key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                                <div>
                                  <span className="text-sm font-medium">{indicator.type.replace('_', ' ')}: </span>
                                  <span className="text-sm">{indicator.value}</span>
                                </div>
                                <div className="text-right">
                                  <div className="text-sm font-bold">{Math.round(indicator.confidence * 100)}%</div>
                                  <div className="text-xs text-muted-foreground">confiança</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Ações de resposta */}
                      {alert.response.actions.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium">Ações Realizadas:</h4>
                          <div className="space-y-2">
                            {alert.response.actions.map((action, index) => (
                              <div key={index} className="flex items-start space-x-2 p-2 bg-blue-50 dark:bg-blue-950 rounded">
                                <CheckCircle className="h-4 w-4 text-green-500 mt-1" />
                                <div className="flex-1">
                                  <div className="text-sm">{action.action}</div>
                                  <div className="text-xs text-muted-foreground">
                                    {action.timestamp} - {action.performedBy}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Notas */}
                      {alert.response.notes && (
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium">Notas:</h4>
                          <div className="p-3 bg-muted/50 rounded">
                            <p className="text-sm">{alert.response.notes}</p>
                          </div>
                        </div>
                      )}

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="flex space-x-2">
                          {alert.response.status === 'new' && (
                            <>
                              <Button variant="default" size="sm" data-testid={`button-investigate-${alert.id}`}>
                                <Eye className="h-4 w-4 mr-1" />
                                Investigar
                              </Button>
                              <Button variant="outline" size="sm" data-testid={`button-dismiss-${alert.id}`}>
                                <XCircle className="h-4 w-4 mr-1" />
                                Descartar
                              </Button>
                            </>
                          )}
                          <Button variant="outline" size="sm" data-testid={`button-details-alert-${alert.id}`}>
                            <Info className="h-4 w-4 mr-1" />
                            Ver Detalhes
                          </Button>
                          {alert.relatedLogs.length > 0 && (
                            <Button variant="outline" size="sm" data-testid={`button-logs-${alert.id}`}>
                              <History className="h-4 w-4 mr-1" />
                              Logs Relacionados
                            </Button>
                          )}
                        </div>
                        
                        <div className="text-xs text-muted-foreground">
                          ID: {alert.id}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Retenção */}
          <TabsContent value="retention" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Políticas de Retenção de Dados</h3>
              <Dialog open={showPolicyDialog} onOpenChange={setShowPolicyDialog}>
                <DialogTrigger asChild>
                  <Button data-testid="button-new-policy">
                    <Plus className="h-4 w-4 mr-2" />
                    Nova Política
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Criar Nova Política de Retenção</DialogTitle>
                    <DialogDescription>
                      Configure uma nova política para retenção e exclusão de dados
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="policy-name">Nome da Política</Label>
                        <Input id="policy-name" placeholder="Ex: Logs de Sistema" data-testid="input-policy-name" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="policy-type">Tipo de Dados</Label>
                        <Select>
                          <SelectTrigger data-testid="select-policy-type">
                            <SelectValue placeholder="Tipo de dados" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="audit_logs">Logs de Auditoria</SelectItem>
                            <SelectItem value="user_data">Dados de Usuário</SelectItem>
                            <SelectItem value="content">Conteúdo</SelectItem>
                            <SelectItem value="system_logs">Logs de Sistema</SelectItem>
                            <SelectItem value="analytics">Analytics</SelectItem>
                            <SelectItem value="backups">Backups</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="policy-retention">Retenção (dias)</Label>
                        <Input id="policy-retention" type="number" placeholder="365" data-testid="input-policy-retention" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="policy-archive">Arquivar após (dias)</Label>
                        <Input id="policy-archive" type="number" placeholder="90" data-testid="input-policy-archive" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="policy-delete">Deletar após (dias)</Label>
                        <Input id="policy-delete" type="number" placeholder="2555" data-testid="input-policy-delete" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <Switch data-testid="switch-encryption" />
                        <Label className="text-sm">Criptografia Obrigatória</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch data-testid="switch-anonymize" />
                        <Label className="text-sm">Anonimizar Dados</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch data-testid="switch-legal-hold" />
                        <Label className="text-sm">Retenção Legal</Label>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="policy-compliance">Compliance (separado por vírgula)</Label>
                      <Input 
                        id="policy-compliance" 
                        placeholder="LGPD, GDPR, SOX"
                        data-testid="input-policy-compliance"
                      />
                    </div>

                    <Button onClick={handleCreatePolicy} className="w-full" data-testid="button-create-policy">
                      Criar Política
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="space-y-4">
              {mockRetentionPolicies.map((policy) => (
                <Card key={policy.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {/* Header da política */}
                      <div className="flex items-start justify-between">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center space-x-2">
                            <Archive className="h-4 w-4" />
                            <h3 className="font-semibold">{policy.name}</h3>
                            <Badge variant="outline">{policy.dataType.replace('_', ' ')}</Badge>
                            {policy.legalHold && (
                              <Badge className="bg-red-100 text-red-800">Retenção Legal</Badge>
                            )}
                            {policy.encryptionRequired && (
                              <Badge className="bg-blue-100 text-blue-800">Criptografado</Badge>
                            )}
                            {policy.anonymizeData && (
                              <Badge className="bg-purple-100 text-purple-800">Anonimizar</Badge>
                            )}
                          </div>
                          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                            <span>Retenção: {Math.floor(policy.retentionPeriod / 365)} anos</span>
                            <span>Arquivar: {Math.floor(policy.archiveAfter / 30)} meses</span>
                            <span>Última revisão: {policy.lastReview}</span>
                            <span>Próxima revisão: {policy.nextReview}</span>
                          </div>
                        </div>
                      </div>

                      {/* Timeline */}
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Timeline de Retenção:</h4>
                        <div className="flex items-center space-x-4">
                          <div className="flex-1">
                            <div className="flex justify-between text-xs mb-1">
                              <span>Ativo</span>
                              <span>Arquivado</span>
                              <span>Excluído</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div className="bg-green-500 h-2 rounded-l-full" style={{ width: `${(policy.archiveAfter / policy.retentionPeriod) * 100}%` }}></div>
                              <div className="bg-yellow-500 h-2" style={{ width: `${((policy.deleteAfter - policy.archiveAfter) / policy.retentionPeriod) * 100}%` }}></div>
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>0 dias</span>
                          <span>{policy.archiveAfter} dias</span>
                          <span>{policy.deleteAfter} dias</span>
                        </div>
                      </div>

                      {/* Compliance */}
                      {policy.compliance.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium">Compliance:</h4>
                          <div className="flex flex-wrap gap-1">
                            {policy.compliance.map((comp, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {comp}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Regras especiais */}
                      {policy.rules.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium">Regras Especiais:</h4>
                          <div className="space-y-2">
                            {policy.rules.map((rule, index) => (
                              <div key={index} className="p-2 bg-muted/50 rounded text-sm">
                                <span className="font-medium">{rule.condition.replace('_', ' ')}: </span>
                                <span>{rule.action} após {Math.floor(rule.period / 30)} meses</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Exceções */}
                      {policy.exemptions.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium text-orange-600">Exceções:</h4>
                          <div className="space-y-2">
                            {policy.exemptions.map((exemption, index) => (
                              <div key={index} className="p-2 bg-orange-50 dark:bg-orange-950 rounded text-sm">
                                <div className="font-medium">{exemption.reason}</div>
                                <div>Dados: {exemption.dataIdentifier}</div>
                                {exemption.exemptUntil && <div>Válido até: {exemption.exemptUntil}</div>}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" data-testid={`button-edit-policy-${policy.id}`}>
                            <Edit className="h-4 w-4 mr-1" />
                            Editar
                          </Button>
                          <Button variant="outline" size="sm" data-testid={`button-review-policy-${policy.id}`}>
                            <Eye className="h-4 w-4 mr-1" />
                            Revisar
                          </Button>
                          <Button variant="outline" size="sm" data-testid={`button-apply-policy-${policy.id}`}>
                            <RefreshCw className="h-4 w-4 mr-1" />
                            Aplicar Agora
                          </Button>
                        </div>
                        
                        <div className="text-xs text-muted-foreground">
                          ID: {policy.id}
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
              <h3 className="text-lg font-semibold">Relatórios de Auditoria</h3>
              <Button onClick={handleGenerateReport} data-testid="button-new-report">
                <FileText className="h-4 w-4 mr-2" />
                Novo Relatório
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Relatórios Padrão</CardTitle>
                  <CardDescription>Relatórios pré-configurados de auditoria</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start" data-testid="button-report-compliance">
                    <ShieldCheck className="h-4 w-4 mr-2" />
                    Relatório de Compliance
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start" data-testid="button-report-security">
                    <Shield className="h-4 w-4 mr-2" />
                    Relatório de Segurança
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start" data-testid="button-report-access">
                    <Users className="h-4 w-4 mr-2" />
                    Relatório de Acesso
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start" data-testid="button-report-retention">
                    <Archive className="h-4 w-4 mr-2" />
                    Relatório de Retenção
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start" data-testid="button-report-violations">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Relatório de Violações
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Estatísticas de Auditoria</CardTitle>
                  <CardDescription>Métricas consolidadas do sistema</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="space-y-2">
                      <div className="text-2xl font-bold text-blue-500">99.2%</div>
                      <p className="text-xs text-muted-foreground">Taxa de Compliance</p>
                    </div>
                    <div className="space-y-2">
                      <div className="text-2xl font-bold text-green-500">2.8s</div>
                      <p className="text-xs text-muted-foreground">Tempo Médio de Log</p>
                    </div>
                    <div className="space-y-2">
                      <div className="text-2xl font-bold text-purple-500">15.2TB</div>
                      <p className="text-xs text-muted-foreground">Dados Auditados</p>
                    </div>
                    <div className="space-y-2">
                      <div className="text-2xl font-bold text-orange-500">3</div>
                      <p className="text-xs text-muted-foreground">Alertas Ativos</p>
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
                      <div className="font-medium">Relatório de Compliance - Março 2024</div>
                      <div className="text-sm text-muted-foreground">Gerado em 08/03/2024 às 14:30</div>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" data-testid="button-download-compliance-march">
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                      <Button size="sm" variant="outline" data-testid="button-share-compliance-march">
                        <Share2 className="h-4 w-4 mr-1" />
                        Compartilhar
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">Relatório de Segurança - Fevereiro 2024</div>
                      <div className="text-sm text-muted-foreground">Gerado em 01/03/2024 às 09:15</div>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" data-testid="button-download-security-feb">
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                      <Button size="sm" variant="outline" data-testid="button-share-security-feb">
                        <Share2 className="h-4 w-4 mr-1" />
                        Compartilhar
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">Relatório de Acesso - Janeiro 2024</div>
                      <div className="text-sm text-muted-foreground">Gerado em 31/01/2024 às 16:45</div>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" data-testid="button-download-access-jan">
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                      <Button size="sm" variant="outline" data-testid="button-share-access-jan">
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