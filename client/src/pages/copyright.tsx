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
  ShieldAlert,
  ShieldX,
  Copyright,
  Scale,
  Gavel,
  FileText,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  Eye,
  Flag,
  Ban,
  Archive,
  Download,
  Upload,
  RefreshCw,
  Settings,
  Plus,
  Edit,
  Trash2,
  ExternalLink,
  Info,
  HelpCircle,
  AlertCircle,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Activity,
  Calendar,
  User,
  Users,
  Star,
  Award,
  Globe,
  Database,
  Server,
  Brain,
  Zap,
  Target,
  Layers,
  Package,
  Sparkles,
  Fingerprint,
  Key,
  Lock,
  Unlock,
  Volume2,
  Image,
  Video,
  Music,
  Book,
  Camera,
  Mic,
  Film,
  Headphones,
  PlayCircle,
  PauseCircle,
  StopCircle,
  FastForward,
  Rewind,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  VolumeX,
  Volume1,
  Maximize,
  Minimize,
  Share2,
  Copy,
  Link,
  Mail,
  Send,
  Bell,
  MessageSquare,
  Hash,
  AtSign,
  Percent
} from 'lucide-react';

interface CopyrightClaim {
  id: string;
  title: string;
  type: 'video' | 'audio' | 'image' | 'text' | 'mixed';
  status: 'pending' | 'approved' | 'rejected' | 'disputed' | 'resolved';
  claimant: string;
  contentOwner: string;
  contentId: string;
  originalContent: {
    title: string;
    url?: string;
    registrationNumber?: string;
    publishDate: string;
    owner: string;
  };
  violatingContent: {
    title: string;
    url: string;
    uploadDate: string;
    duration?: number;
    matchPercentage: number;
    matchSegments: Array<{
      start: number;
      end: number;
      confidence: number;
    }>;
  };
  createdAt: string;
  reviewedAt?: string;
  resolvedAt?: string;
  dmcaNotice?: {
    sent: boolean;
    sentAt?: string;
    response?: string;
    responseAt?: string;
  };
  fairUseAssessment?: {
    isTransformative: boolean;
    commercialUse: boolean;
    amountUsed: number;
    marketImpact: number;
    verdict: 'fair_use' | 'not_fair_use' | 'unclear';
    reasoning: string;
  };
}

interface ContentFingerprint {
  id: string;
  contentId: string;
  title: string;
  type: 'video' | 'audio' | 'image';
  fingerprint: string;
  duration?: number;
  size: number;
  uploadDate: string;
  owner: string;
  license: 'copyright' | 'creative_commons' | 'public_domain' | 'custom';
  licenseDetails?: string;
  isProtected: boolean;
  matchCount: number;
  lastMatch?: string;
}

interface LicenseAgreement {
  id: string;
  name: string;
  type: 'exclusive' | 'non_exclusive' | 'royalty_free' | 'creative_commons';
  contentTypes: string[];
  territories: string[];
  duration: {
    start: string;
    end?: string;
    perpetual: boolean;
  };
  permissions: {
    commercial: boolean;
    derivative: boolean;
    distribution: boolean;
    public_performance: boolean;
  };
  restrictions: string[];
  royaltyRate?: number;
  upfrontFee?: number;
  licensee: string;
  licensor: string;
  status: 'active' | 'expired' | 'terminated' | 'pending';
  createdAt: string;
  documents: Array<{
    name: string;
    url: string;
    type: 'contract' | 'invoice' | 'receipt' | 'amendment';
  }>;
}

interface DMCANotice {
  id: string;
  type: 'takedown' | 'counter_notice';
  status: 'sent' | 'acknowledged' | 'complied' | 'disputed' | 'withdrawn';
  claimId: string;
  recipient: string;
  sender: string;
  contentDescription: string;
  violationDescription: string;
  legalBasis: string;
  requestedAction: 'remove' | 'disable' | 'restrict';
  sentAt: string;
  responseDeadline: string;
  response?: {
    action: string;
    completedAt: string;
    notes: string;
  };
  documents: Array<{
    name: string;
    url: string;
    type: 'notice' | 'response' | 'evidence';
  }>;
}

const mockClaims: CopyrightClaim[] = [
  {
    id: 'claim_001',
    title: 'Uso não autorizado de música tema',
    type: 'audio',
    status: 'pending',
    claimant: 'MusicCorp Records',
    contentOwner: 'MusicCorp Records',
    contentId: 'video_123',
    originalContent: {
      title: 'Dark Mystery Theme - Original Soundtrack',
      registrationNumber: 'SR0001234567',
      publishDate: '2022-03-15',
      owner: 'MusicCorp Records'
    },
    violatingContent: {
      title: 'Mistérios da Noite - Episódio 15',
      url: 'https://youtube.com/watch?v=abc123',
      uploadDate: '2024-03-08',
      duration: 1200,
      matchPercentage: 87.5,
      matchSegments: [
        { start: 0, end: 30, confidence: 0.95 },
        { start: 180, end: 210, confidence: 0.89 },
        { start: 600, end: 630, confidence: 0.92 }
      ]
    },
    createdAt: '2024-03-08 14:30:00',
    dmcaNotice: {
      sent: false
    },
    fairUseAssessment: {
      isTransformative: false,
      commercialUse: true,
      amountUsed: 0.15,
      marketImpact: 0.7,
      verdict: 'not_fair_use',
      reasoning: 'O uso comercial de 15% da música original sem transformação significativa não se qualifica como uso justo.'
    }
  },
  {
    id: 'claim_002',
    title: 'Violação de direitos de imagem',
    type: 'image',
    status: 'approved',
    claimant: 'PhotoStock Inc.',
    contentOwner: 'PhotoStock Inc.',
    contentId: 'video_456',
    originalContent: {
      title: 'Stock Photo - Mysterious Forest',
      url: 'https://photostock.com/image/123456',
      registrationNumber: 'IMG2024001234',
      publishDate: '2024-01-10',
      owner: 'PhotoStock Inc.'
    },
    violatingContent: {
      title: 'Lendas Urbanas - Thumbnail',
      url: 'https://youtube.com/thumbnail/def456',
      uploadDate: '2024-03-07',
      matchPercentage: 98.3,
      matchSegments: [
        { start: 0, end: 100, confidence: 0.98 }
      ]
    },
    createdAt: '2024-03-07 16:20:00',
    reviewedAt: '2024-03-07 18:45:00',
    resolvedAt: '2024-03-07 19:30:00',
    dmcaNotice: {
      sent: true,
      sentAt: '2024-03-07 20:00:00',
      response: 'Imagem removida e substituída',
      responseAt: '2024-03-07 21:15:00'
    }
  },
  {
    id: 'claim_003',
    title: 'Trecho de documentário protegido',
    type: 'video',
    status: 'disputed',
    claimant: 'Documentary Films Ltd.',
    contentOwner: 'Documentary Films Ltd.',
    contentId: 'video_789',
    originalContent: {
      title: 'The Truth Behind Mysteries - Documentary',
      registrationNumber: 'DOC2023007890',
      publishDate: '2023-08-20',
      owner: 'Documentary Films Ltd.'
    },
    violatingContent: {
      title: 'Análise de Mistérios Reais',
      url: 'https://youtube.com/watch?v=ghi789',
      uploadDate: '2024-03-06',
      duration: 45,
      matchPercentage: 65.2,
      matchSegments: [
        { start: 120, end: 165, confidence: 0.78 }
      ]
    },
    createdAt: '2024-03-06 10:15:00',
    reviewedAt: '2024-03-06 14:30:00',
    fairUseAssessment: {
      isTransformative: true,
      commercialUse: true,
      amountUsed: 0.08,
      marketImpact: 0.2,
      verdict: 'fair_use',
      reasoning: 'O uso de 8% do conteúdo original para análise crítica e comentário constitui uso justo.'
    }
  }
];

const mockFingerprints: ContentFingerprint[] = [
  {
    id: 'fp_001',
    contentId: 'track_001',
    title: 'Dark Mystery Theme - Original',
    type: 'audio',
    fingerprint: 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0',
    duration: 180,
    size: 8500000,
    uploadDate: '2022-03-15',
    owner: 'MusicCorp Records',
    license: 'copyright',
    isProtected: true,
    matchCount: 15,
    lastMatch: '2024-03-08'
  },
  {
    id: 'fp_002',
    contentId: 'img_001',
    title: 'Mysterious Forest Stock Photo',
    type: 'image',
    fingerprint: 'z9y8x7w6v5u4t3s2r1q0p9o8n7m6l5k4j3i2h1g0',
    size: 2100000,
    uploadDate: '2024-01-10',
    owner: 'PhotoStock Inc.',
    license: 'copyright',
    licenseDetails: 'Uso comercial mediante licenciamento',
    isProtected: true,
    matchCount: 8,
    lastMatch: '2024-03-07'
  },
  {
    id: 'fp_003',
    contentId: 'doc_001',
    title: 'Documentary Segment - Truth Behind',
    type: 'video',
    fingerprint: 'f5e4d3c2b1a0z9y8x7w6v5u4t3s2r1q0p9o8n7m6',
    duration: 600,
    size: 150000000,
    uploadDate: '2023-08-20',
    owner: 'Documentary Films Ltd.',
    license: 'copyright',
    isProtected: true,
    matchCount: 3,
    lastMatch: '2024-03-06'
  },
  {
    id: 'fp_004',
    contentId: 'cc_001',
    title: 'Creative Commons Dark Ambient',
    type: 'audio',
    fingerprint: 'cc1bb2aa3zz4yy5xx6ww7vv8uu9tt0ss1rr2qq3pp',
    duration: 240,
    size: 11200000,
    uploadDate: '2024-01-05',
    owner: 'FreeSounds Community',
    license: 'creative_commons',
    licenseDetails: 'CC BY-SA 4.0 - Atribuição necessária',
    isProtected: false,
    matchCount: 45,
    lastMatch: '2024-03-08'
  }
];

const mockLicenses: LicenseAgreement[] = [
  {
    id: 'license_001',
    name: 'Premium Music License - DarkNews',
    type: 'non_exclusive',
    contentTypes: ['background_music', 'intro_music', 'outro_music'],
    territories: ['Brasil', 'Portugal', 'Global Online'],
    duration: {
      start: '2024-01-01',
      end: '2024-12-31',
      perpetual: false
    },
    permissions: {
      commercial: true,
      derivative: false,
      distribution: true,
      public_performance: true
    },
    restrictions: ['Não pode ser revendida', 'Máximo 50 usos por mês'],
    royaltyRate: 5.0,
    upfrontFee: 2500,
    licensee: 'DarkNews Autopilot',
    licensor: 'MusicCorp Records',
    status: 'active',
    createdAt: '2024-01-01',
    documents: [
      { name: 'Contrato de Licenciamento.pdf', url: '/docs/license_001_contract.pdf', type: 'contract' },
      { name: 'Pagamento Confirmado.pdf', url: '/docs/license_001_payment.pdf', type: 'receipt' }
    ]
  },
  {
    id: 'license_002',
    name: 'Stock Images Premium Package',
    type: 'royalty_free',
    contentTypes: ['thumbnails', 'background_images', 'promotional_images'],
    territories: ['Mundial'],
    duration: {
      start: '2024-02-01',
      perpetual: true
    },
    permissions: {
      commercial: true,
      derivative: true,
      distribution: true,
      public_performance: true
    },
    restrictions: ['Não pode ser redistribuída como stock'],
    upfrontFee: 1200,
    licensee: 'DarkNews Autopilot',
    licensor: 'PhotoStock Inc.',
    status: 'active',
    createdAt: '2024-02-01',
    documents: [
      { name: 'Licença Perpétua.pdf', url: '/docs/license_002_contract.pdf', type: 'contract' }
    ]
  },
  {
    id: 'license_003',
    name: 'Documentary Clips License',
    type: 'exclusive',
    contentTypes: ['documentary_clips', 'interview_segments'],
    territories: ['Brasil'],
    duration: {
      start: '2024-03-01',
      end: '2026-03-01',
      perpetual: false
    },
    permissions: {
      commercial: true,
      derivative: true,
      distribution: false,
      public_performance: true
    },
    restrictions: ['Uso exclusivo para canal DarkNews', 'Máximo 30 segundos por uso'],
    royaltyRate: 12.0,
    upfrontFee: 5000,
    licensee: 'DarkNews Autopilot',
    licensor: 'Documentary Films Ltd.',
    status: 'active',
    createdAt: '2024-03-01',
    documents: [
      { name: 'Contrato Exclusivo.pdf', url: '/docs/license_003_contract.pdf', type: 'contract' },
      { name: 'Amendmento 1.pdf', url: '/docs/license_003_amendment.pdf', type: 'amendment' }
    ]
  }
];

const mockDMCANotices: DMCANotice[] = [
  {
    id: 'dmca_001',
    type: 'takedown',
    status: 'complied',
    claimId: 'claim_002',
    recipient: 'DarkNews Autopilot',
    sender: 'PhotoStock Inc.',
    contentDescription: 'Imagem stock protegida usada como thumbnail',
    violationDescription: 'Uso não autorizado de fotografia registrada sob direitos autorais',
    legalBasis: 'Digital Millennium Copyright Act (DMCA)',
    requestedAction: 'remove',
    sentAt: '2024-03-07 20:00:00',
    responseDeadline: '2024-03-09 20:00:00',
    response: {
      action: 'Conteúdo removido e substituído por imagem licenciada',
      completedAt: '2024-03-07 21:15:00',
      notes: 'Substituição imediata realizada. Nova imagem licenciada adequadamente.'
    },
    documents: [
      { name: 'DMCA Notice.pdf', url: '/docs/dmca_001_notice.pdf', type: 'notice' },
      { name: 'Compliance Response.pdf', url: '/docs/dmca_001_response.pdf', type: 'response' }
    ]
  },
  {
    id: 'dmca_002',
    type: 'counter_notice',
    status: 'sent',
    claimId: 'claim_003',
    recipient: 'Documentary Films Ltd.',
    sender: 'DarkNews Autopilot',
    contentDescription: 'Segmento de documentário usado para análise crítica',
    violationDescription: 'Contestação de alegação de violação - alegando uso justo',
    legalBasis: 'Fair Use Doctrine - 17 U.S.C. § 107',
    requestedAction: 'restore',
    sentAt: '2024-03-06 16:30:00',
    responseDeadline: '2024-03-16 16:30:00',
    documents: [
      { name: 'Counter Notice.pdf', url: '/docs/dmca_002_counter.pdf', type: 'notice' },
      { name: 'Fair Use Evidence.pdf', url: '/docs/dmca_002_evidence.pdf', type: 'evidence' }
    ]
  }
];

export default function Copyright() {
  const [selectedTab, setSelectedTab] = useState('claims');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showClaimDialog, setShowClaimDialog] = useState(false);
  const [showLicenseDialog, setShowLicenseDialog] = useState(false);
  const { toast } = useToast();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-green-500 bg-green-100 dark:bg-green-950';
      case 'rejected': return 'text-red-500 bg-red-100 dark:bg-red-950';
      case 'disputed': return 'text-orange-500 bg-orange-100 dark:bg-orange-950';
      case 'resolved': return 'text-blue-500 bg-blue-100 dark:bg-blue-950';
      case 'pending': return 'text-yellow-500 bg-yellow-100 dark:bg-yellow-950';
      default: return 'text-gray-500 bg-gray-100 dark:bg-gray-950';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="h-4 w-4" />;
      case 'audio': return <Music className="h-4 w-4" />;
      case 'image': return <Image className="h-4 w-4" />;
      case 'text': return <FileText className="h-4 w-4" />;
      case 'mixed': return <Layers className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getLicenseTypeColor = (type: string) => {
    switch (type) {
      case 'exclusive': return 'bg-purple-100 text-purple-800 dark:bg-purple-950';
      case 'non_exclusive': return 'bg-blue-100 text-blue-800 dark:bg-blue-950';
      case 'royalty_free': return 'bg-green-100 text-green-800 dark:bg-green-950';
      case 'creative_commons': return 'bg-orange-100 text-orange-800 dark:bg-orange-950';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-950';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(amount);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleApproveClaim = (claimId: string) => {
    toast({
      title: "Claim aprovado",
      description: "A violação de copyright foi confirmada",
    });
  };

  const handleRejectClaim = (claimId: string) => {
    toast({
      title: "Claim rejeitado",
      description: "A alegação de violação foi rejeitada",
    });
  };

  const handleSendDMCA = (claimId: string) => {
    toast({
      title: "DMCA enviado",
      description: "Notificação DMCA foi enviada com sucesso",
    });
  };

  const handleCreateLicense = () => {
    toast({
      title: "Licença criada",
      description: "Nova licença foi adicionada ao sistema",
    });
    setShowLicenseDialog(false);
  };

  const filteredClaims = mockClaims.filter(claim => {
    let matches = true;
    
    if (statusFilter !== 'all' && claim.status !== statusFilter) matches = false;
    if (typeFilter !== 'all' && claim.type !== typeFilter) matches = false;
    if (searchTerm && !claim.title.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !claim.claimant.toLowerCase().includes(searchTerm.toLowerCase())) matches = false;
    
    return matches;
  });

  const totalClaims = mockClaims.length;
  const pendingClaims = mockClaims.filter(claim => claim.status === 'pending').length;
  const approvedClaims = mockClaims.filter(claim => claim.status === 'approved').length;
  const disputedClaims = mockClaims.filter(claim => claim.status === 'disputed').length;

  return (
    <div className="container mx-auto px-6 py-8 max-w-7xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
              <Copyright className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Proteção de Copyright</h1>
              <p className="text-muted-foreground">Sistema de gestão de direitos autorais e propriedade intelectual</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button data-testid="button-scan-content">
              <Search className="h-4 w-4 mr-2" />
              Escanear Conteúdo
            </Button>
            
            <Button variant="outline" data-testid="button-copyright-settings">
              <Settings className="h-4 w-4 mr-2" />
              Configurações
            </Button>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total de Claims</p>
                  <p className="text-2xl font-bold">{totalClaims}</p>
                  <p className="text-xs text-blue-500 flex items-center mt-1">
                    <Flag className="h-3 w-3 mr-1" />
                    Registrados
                  </p>
                </div>
                <Flag className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pendente Análise</p>
                  <p className="text-2xl font-bold">{pendingClaims}</p>
                  <p className="text-xs text-yellow-500 flex items-center mt-1">
                    <Clock className="h-3 w-3 mr-1" />
                    Aguardando
                  </p>
                </div>
                <Clock className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Claims Aprovados</p>
                  <p className="text-2xl font-bold">{approvedClaims}</p>
                  <p className="text-xs text-green-500 flex items-center mt-1">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Confirmados
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Em Disputa</p>
                  <p className="text-2xl font-bold">{disputedClaims}</p>
                  <p className="text-xs text-orange-500 flex items-center mt-1">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    Contestados
                  </p>
                </div>
                <AlertTriangle className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="claims">Claims</TabsTrigger>
            <TabsTrigger value="fingerprints">Fingerprints</TabsTrigger>
            <TabsTrigger value="licenses">Licenças</TabsTrigger>
            <TabsTrigger value="dmca">DMCA</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Claims */}
          <TabsContent value="claims" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Claims de Copyright</h3>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar claims..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                    data-testid="input-search-claims"
                  />
                </div>
                
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-40" data-testid="select-type-filter">
                    <SelectValue placeholder="Tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="video">Vídeo</SelectItem>
                    <SelectItem value="audio">Áudio</SelectItem>
                    <SelectItem value="image">Imagem</SelectItem>
                    <SelectItem value="text">Texto</SelectItem>
                    <SelectItem value="mixed">Misto</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40" data-testid="select-status-filter">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="pending">Pendente</SelectItem>
                    <SelectItem value="approved">Aprovado</SelectItem>
                    <SelectItem value="rejected">Rejeitado</SelectItem>
                    <SelectItem value="disputed">Disputado</SelectItem>
                    <SelectItem value="resolved">Resolvido</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              {filteredClaims.map((claim) => (
                <Card key={claim.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {/* Header do claim */}
                      <div className="flex items-start justify-between">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center space-x-2">
                            {getTypeIcon(claim.type)}
                            <h3 className="font-semibold">{claim.title}</h3>
                            <Badge className={getStatusColor(claim.status)}>
                              {claim.status === 'pending' ? 'Pendente' :
                               claim.status === 'approved' ? 'Aprovado' :
                               claim.status === 'rejected' ? 'Rejeitado' :
                               claim.status === 'disputed' ? 'Disputado' : 'Resolvido'}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                            <span>Requerente: {claim.claimant}</span>
                            <span>Criado: {new Date(claim.createdAt).toLocaleString('pt-BR')}</span>
                            {claim.resolvedAt && <span>Resolvido: {new Date(claim.resolvedAt).toLocaleString('pt-BR')}</span>}
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="text-lg font-bold text-red-500">
                            {claim.violatingContent.matchPercentage.toFixed(1)}%
                          </div>
                          <p className="text-xs text-muted-foreground">Similaridade</p>
                        </div>
                      </div>

                      {/* Conteúdo original vs violação */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium text-green-600">Conteúdo Original:</h4>
                          <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                            <p className="font-medium">{claim.originalContent.title}</p>
                            <p className="text-sm text-muted-foreground">Proprietário: {claim.originalContent.owner}</p>
                            <p className="text-sm text-muted-foreground">Publicado: {claim.originalContent.publishDate}</p>
                            {claim.originalContent.registrationNumber && (
                              <p className="text-sm text-muted-foreground">Registro: {claim.originalContent.registrationNumber}</p>
                            )}
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium text-red-600">Conteúdo em Violação:</h4>
                          <div className="p-3 bg-red-50 dark:bg-red-950 rounded-lg">
                            <p className="font-medium">{claim.violatingContent.title}</p>
                            <p className="text-sm text-muted-foreground">Upload: {claim.violatingContent.uploadDate}</p>
                            {claim.violatingContent.duration && (
                              <p className="text-sm text-muted-foreground">Duração: {Math.floor(claim.violatingContent.duration / 60)}m {claim.violatingContent.duration % 60}s</p>
                            )}
                            <Button variant="link" size="sm" className="h-auto p-0 mt-1" data-testid={`button-view-violation-${claim.id}`}>
                              <ExternalLink className="h-3 w-3 mr-1" />
                              Ver conteúdo
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Segmentos correspondentes */}
                      {claim.violatingContent.matchSegments.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium">Segmentos Correspondentes:</h4>
                          <div className="flex flex-wrap gap-2">
                            {claim.violatingContent.matchSegments.map((segment, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {segment.start}s-{segment.end}s ({Math.round(segment.confidence * 100)}%)
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Análise de Uso Justo */}
                      {claim.fairUseAssessment && (
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium">Análise de Uso Justo:</h4>
                          <div className="p-3 bg-muted/50 rounded-lg">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                              <div>
                                <span className="text-xs text-muted-foreground">Transformativo:</span>
                                <div className={claim.fairUseAssessment.isTransformative ? 'text-green-600' : 'text-red-600'}>
                                  {claim.fairUseAssessment.isTransformative ? 'Sim' : 'Não'}
                                </div>
                              </div>
                              <div>
                                <span className="text-xs text-muted-foreground">Uso Comercial:</span>
                                <div className={claim.fairUseAssessment.commercialUse ? 'text-red-600' : 'text-green-600'}>
                                  {claim.fairUseAssessment.commercialUse ? 'Sim' : 'Não'}
                                </div>
                              </div>
                              <div>
                                <span className="text-xs text-muted-foreground">Quantidade:</span>
                                <div>{Math.round(claim.fairUseAssessment.amountUsed * 100)}%</div>
                              </div>
                              <div>
                                <span className="text-xs text-muted-foreground">Impacto:</span>
                                <div className={claim.fairUseAssessment.marketImpact > 0.5 ? 'text-red-600' : 'text-green-600'}>
                                  {Math.round(claim.fairUseAssessment.marketImpact * 100)}%
                                </div>
                              </div>
                            </div>
                            <div className="mb-2">
                              <Badge className={
                                claim.fairUseAssessment.verdict === 'fair_use' ? 'bg-green-100 text-green-800' :
                                claim.fairUseAssessment.verdict === 'not_fair_use' ? 'bg-red-100 text-red-800' :
                                'bg-yellow-100 text-yellow-800'
                              }>
                                {claim.fairUseAssessment.verdict === 'fair_use' ? 'Uso Justo' :
                                 claim.fairUseAssessment.verdict === 'not_fair_use' ? 'Não é Uso Justo' : 'Incerto'}
                              </Badge>
                            </div>
                            <p className="text-sm">{claim.fairUseAssessment.reasoning}</p>
                          </div>
                        </div>
                      )}

                      {/* Status DMCA */}
                      {claim.dmcaNotice && (
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium">Status DMCA</div>
                            <div className="text-sm text-muted-foreground">
                              {claim.dmcaNotice.sent ? 
                                `Enviado em ${claim.dmcaNotice.sentAt}` : 
                                'Não enviado'
                              }
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            {claim.dmcaNotice.sent ? (
                              <Badge className="bg-green-100 text-green-800">Enviado</Badge>
                            ) : (
                              <Badge className="bg-gray-100 text-gray-800">Pendente</Badge>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="flex space-x-2">
                          {claim.status === 'pending' && (
                            <>
                              <Button 
                                variant="default" 
                                size="sm"
                                onClick={() => handleApproveClaim(claim.id)}
                                data-testid={`button-approve-${claim.id}`}
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Aprovar
                              </Button>
                              <Button 
                                variant="destructive" 
                                size="sm"
                                onClick={() => handleRejectClaim(claim.id)}
                                data-testid={`button-reject-${claim.id}`}
                              >
                                <XCircle className="h-4 w-4 mr-1" />
                                Rejeitar
                              </Button>
                            </>
                          )}
                          {claim.status === 'approved' && !claim.dmcaNotice?.sent && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleSendDMCA(claim.id)}
                              data-testid={`button-dmca-${claim.id}`}
                            >
                              <Gavel className="h-4 w-4 mr-1" />
                              Enviar DMCA
                            </Button>
                          )}
                          <Button variant="outline" size="sm" data-testid={`button-details-${claim.id}`}>
                            <Info className="h-4 w-4 mr-1" />
                            Ver Detalhes
                          </Button>
                        </div>
                        
                        <div className="text-xs text-muted-foreground">
                          ID: {claim.id}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Fingerprints */}
          <TabsContent value="fingerprints" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Fingerprints de Conteúdo</h3>
              <Button data-testid="button-generate-fingerprint">
                <Fingerprint className="h-4 w-4 mr-2" />
                Gerar Fingerprint
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockFingerprints.map((fingerprint) => (
                <Card key={fingerprint.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {/* Header do fingerprint */}
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          {getTypeIcon(fingerprint.type)}
                          <h3 className="font-semibold">{fingerprint.title}</h3>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">{fingerprint.type}</Badge>
                          <Badge className={
                            fingerprint.license === 'copyright' ? 'bg-red-100 text-red-800' :
                            fingerprint.license === 'creative_commons' ? 'bg-green-100 text-green-800' :
                            fingerprint.license === 'public_domain' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }>
                            {fingerprint.license === 'copyright' ? 'Copyright' :
                             fingerprint.license === 'creative_commons' ? 'Creative Commons' :
                             fingerprint.license === 'public_domain' ? 'Domínio Público' : 'Personalizada'}
                          </Badge>
                          {fingerprint.isProtected && (
                            <Shield className="h-4 w-4 text-red-500" />
                          )}
                        </div>
                      </div>

                      {/* Informações do arquivo */}
                      <div className="space-y-2 text-sm">
                        <p><span className="font-medium">Proprietário:</span> {fingerprint.owner}</p>
                        <p><span className="font-medium">Tamanho:</span> {formatFileSize(fingerprint.size)}</p>
                        {fingerprint.duration && (
                          <p><span className="font-medium">Duração:</span> {Math.floor(fingerprint.duration / 60)}m {fingerprint.duration % 60}s</p>
                        )}
                        <p><span className="font-medium">Upload:</span> {fingerprint.uploadDate}</p>
                        <p><span className="font-medium">Matches:</span> {fingerprint.matchCount}</p>
                        {fingerprint.lastMatch && (
                          <p><span className="font-medium">Último match:</span> {fingerprint.lastMatch}</p>
                        )}
                      </div>

                      {/* Fingerprint hash */}
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Fingerprint:</h4>
                        <div className="p-2 bg-muted/50 rounded font-mono text-xs break-all">
                          {fingerprint.fingerprint}
                        </div>
                      </div>

                      {/* Detalhes da licença */}
                      {fingerprint.licenseDetails && (
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium">Licença:</h4>
                          <p className="text-sm text-muted-foreground">{fingerprint.licenseDetails}</p>
                        </div>
                      )}

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" data-testid={`button-scan-fingerprint-${fingerprint.id}`}>
                            <Search className="h-4 w-4 mr-1" />
                            Escanear
                          </Button>
                          <Button variant="outline" size="sm" data-testid={`button-edit-fingerprint-${fingerprint.id}`}>
                            <Edit className="h-4 w-4 mr-1" />
                            Editar
                          </Button>
                        </div>
                        
                        <div className="text-xs text-muted-foreground">
                          ID: {fingerprint.id}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Licenças */}
          <TabsContent value="licenses" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Licenças e Acordos</h3>
              <Dialog open={showLicenseDialog} onOpenChange={setShowLicenseDialog}>
                <DialogTrigger asChild>
                  <Button data-testid="button-new-license">
                    <Plus className="h-4 w-4 mr-2" />
                    Nova Licença
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Adicionar Nova Licença</DialogTitle>
                    <DialogDescription>
                      Configure uma nova licença ou acordo de uso
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="license-name">Nome da Licença</Label>
                        <Input id="license-name" placeholder="Ex: Premium Music Package" data-testid="input-license-name" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="license-type">Tipo</Label>
                        <Select>
                          <SelectTrigger data-testid="select-license-type">
                            <SelectValue placeholder="Tipo da licença" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="exclusive">Exclusiva</SelectItem>
                            <SelectItem value="non_exclusive">Não Exclusiva</SelectItem>
                            <SelectItem value="royalty_free">Royalty Free</SelectItem>
                            <SelectItem value="creative_commons">Creative Commons</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="license-licensor">Licenciador</Label>
                        <Input id="license-licensor" placeholder="Empresa/Pessoa que licencia" data-testid="input-license-licensor" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="license-territories">Territórios</Label>
                        <Input id="license-territories" placeholder="Brasil, Portugal, Global..." data-testid="input-license-territories" />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="license-start">Data Início</Label>
                        <Input id="license-start" type="date" data-testid="input-license-start" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="license-end">Data Fim</Label>
                        <Input id="license-end" type="date" data-testid="input-license-end" />
                      </div>
                      <div className="flex items-center space-x-2 pt-6">
                        <Switch data-testid="switch-perpetual" />
                        <Label className="text-sm">Perpétua</Label>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="license-upfront">Taxa Inicial (R$)</Label>
                        <Input id="license-upfront" type="number" placeholder="0" data-testid="input-license-upfront" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="license-royalty">Taxa Royalty (%)</Label>
                        <Input id="license-royalty" type="number" placeholder="0" data-testid="input-license-royalty" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Permissões</Label>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center space-x-2">
                          <Switch data-testid="switch-commercial" />
                          <Label className="text-sm">Uso Comercial</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch data-testid="switch-derivative" />
                          <Label className="text-sm">Obras Derivadas</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch data-testid="switch-distribution" />
                          <Label className="text-sm">Distribuição</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch data-testid="switch-performance" />
                          <Label className="text-sm">Exibição Pública</Label>
                        </div>
                      </div>
                    </div>

                    <Button onClick={handleCreateLicense} className="w-full" data-testid="button-create-license">
                      Criar Licença
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="space-y-4">
              {mockLicenses.map((license) => (
                <Card key={license.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {/* Header da licença */}
                      <div className="flex items-start justify-between">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center space-x-2">
                            <Scale className="h-4 w-4" />
                            <h3 className="font-semibold">{license.name}</h3>
                            <Badge className={getLicenseTypeColor(license.type)}>
                              {license.type === 'exclusive' ? 'Exclusiva' :
                               license.type === 'non_exclusive' ? 'Não Exclusiva' :
                               license.type === 'royalty_free' ? 'Royalty Free' : 'Creative Commons'}
                            </Badge>
                            <Badge className={
                              license.status === 'active' ? 'bg-green-100 text-green-800' :
                              license.status === 'expired' ? 'bg-red-100 text-red-800' :
                              license.status === 'terminated' ? 'bg-gray-100 text-gray-800' :
                              'bg-yellow-100 text-yellow-800'
                            }>
                              {license.status === 'active' ? 'Ativa' :
                               license.status === 'expired' ? 'Expirada' :
                               license.status === 'terminated' ? 'Terminada' : 'Pendente'}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                            <span>Licenciador: {license.licensor}</span>
                            <span>Criada: {license.createdAt}</span>
                            <span>Territórios: {license.territories.slice(0, 2).join(', ')}{license.territories.length > 2 && '...'}</span>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="space-y-1">
                            {license.upfrontFee && (
                              <div className="text-lg font-bold text-green-600">
                                {formatCurrency(license.upfrontFee)}
                              </div>
                            )}
                            {license.royaltyRate && (
                              <div className="text-sm text-muted-foreground">
                                {license.royaltyRate}% royalty
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Duração */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <h4 className="text-sm font-medium mb-2">Duração:</h4>
                          <div className="text-sm">
                            <p>Início: {license.duration.start}</p>
                            {license.duration.perpetual ? (
                              <p className="text-green-600">Perpétua</p>
                            ) : (
                              <p>Fim: {license.duration.end}</p>
                            )}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-medium mb-2">Permissões:</h4>
                          <div className="space-y-1">
                            {license.permissions.commercial && <Badge variant="outline" className="text-xs">Comercial</Badge>}
                            {license.permissions.derivative && <Badge variant="outline" className="text-xs">Derivadas</Badge>}
                            {license.permissions.distribution && <Badge variant="outline" className="text-xs">Distribuição</Badge>}
                            {license.permissions.public_performance && <Badge variant="outline" className="text-xs">Exibição</Badge>}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-medium mb-2">Tipos de Conteúdo:</h4>
                          <div className="space-y-1">
                            {license.contentTypes.slice(0, 3).map((type, index) => (
                              <Badge key={index} variant="outline" className="text-xs mr-1">
                                {type.replace('_', ' ')}
                              </Badge>
                            ))}
                            {license.contentTypes.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{license.contentTypes.length - 3} mais
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Restrições */}
                      {license.restrictions.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium">Restrições:</h4>
                          <ul className="text-sm space-y-1">
                            {license.restrictions.map((restriction, index) => (
                              <li key={index} className="flex items-start space-x-2">
                                <span className="text-red-500 mt-1">•</span>
                                <span>{restriction}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Documentos */}
                      {license.documents.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium">Documentos ({license.documents.length}):</h4>
                          <div className="flex flex-wrap gap-2">
                            {license.documents.map((doc, index) => (
                              <Button key={index} variant="outline" size="sm" data-testid={`button-doc-${index}`}>
                                <FileText className="h-3 w-3 mr-1" />
                                {doc.name}
                              </Button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" data-testid={`button-edit-license-${license.id}`}>
                            <Edit className="h-4 w-4 mr-1" />
                            Editar
                          </Button>
                          <Button variant="outline" size="sm" data-testid={`button-renew-license-${license.id}`}>
                            <RefreshCw className="h-4 w-4 mr-1" />
                            Renovar
                          </Button>
                          <Button variant="outline" size="sm" data-testid={`button-docs-license-${license.id}`}>
                            <Download className="h-4 w-4 mr-1" />
                            Documentos
                          </Button>
                        </div>
                        
                        <div className="text-xs text-muted-foreground">
                          ID: {license.id}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* DMCA */}
          <TabsContent value="dmca" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Notificações DMCA</h3>
              <Button data-testid="button-new-dmca">
                <Gavel className="h-4 w-4 mr-2" />
                Nova Notificação
              </Button>
            </div>

            <div className="space-y-4">
              {mockDMCANotices.map((notice) => (
                <Card key={notice.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {/* Header da notificação */}
                      <div className="flex items-start justify-between">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center space-x-2">
                            <Gavel className="h-4 w-4" />
                            <h3 className="font-semibold">
                              {notice.type === 'takedown' ? 'Takedown Notice' : 'Counter Notice'}
                            </h3>
                            <Badge className={
                              notice.status === 'sent' ? 'bg-blue-100 text-blue-800' :
                              notice.status === 'acknowledged' ? 'bg-yellow-100 text-yellow-800' :
                              notice.status === 'complied' ? 'bg-green-100 text-green-800' :
                              notice.status === 'disputed' ? 'bg-orange-100 text-orange-800' :
                              'bg-gray-100 text-gray-800'
                            }>
                              {notice.status === 'sent' ? 'Enviado' :
                               notice.status === 'acknowledged' ? 'Reconhecido' :
                               notice.status === 'complied' ? 'Cumprido' :
                               notice.status === 'disputed' ? 'Disputado' : 'Retirado'}
                            </Badge>
                            <Badge variant="outline">
                              {notice.type === 'takedown' ? 'Remoção' : 'Contestação'}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                            <span>De: {notice.sender}</span>
                            <span>Para: {notice.recipient}</span>
                            <span>Enviado: {new Date(notice.sentAt).toLocaleString('pt-BR')}</span>
                            <span>Prazo: {new Date(notice.responseDeadline).toLocaleString('pt-BR')}</span>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="text-lg font-bold">
                            {notice.requestedAction === 'remove' ? 'Remover' :
                             notice.requestedAction === 'disable' ? 'Desabilitar' :
                             notice.requestedAction === 'restrict' ? 'Restringir' : 'Restaurar'}
                          </div>
                          <p className="text-xs text-muted-foreground">Ação Solicitada</p>
                        </div>
                      </div>

                      {/* Descrições */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium">Descrição do Conteúdo:</h4>
                          <p className="text-sm p-3 bg-muted/50 rounded-lg">{notice.contentDescription}</p>
                        </div>
                        
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium">Descrição da Violação:</h4>
                          <p className="text-sm p-3 bg-muted/50 rounded-lg">{notice.violationDescription}</p>
                        </div>
                      </div>

                      {/* Base Legal */}
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Base Legal:</h4>
                        <p className="text-sm p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">{notice.legalBasis}</p>
                      </div>

                      {/* Resposta */}
                      {notice.response && (
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium">Resposta:</h4>
                          <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium">Ação: {notice.response.action}</span>
                              <span className="text-sm text-muted-foreground">
                                {new Date(notice.response.completedAt).toLocaleString('pt-BR')}
                              </span>
                            </div>
                            <p className="text-sm">{notice.response.notes}</p>
                          </div>
                        </div>
                      )}

                      {/* Documentos */}
                      {notice.documents.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium">Documentos ({notice.documents.length}):</h4>
                          <div className="flex flex-wrap gap-2">
                            {notice.documents.map((doc, index) => (
                              <Button key={index} variant="outline" size="sm" data-testid={`button-dmca-doc-${index}`}>
                                <FileText className="h-3 w-3 mr-1" />
                                {doc.name}
                              </Button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" data-testid={`button-respond-${notice.id}`}>
                            <Mail className="h-4 w-4 mr-1" />
                            Responder
                          </Button>
                          <Button variant="outline" size="sm" data-testid={`button-view-claim-${notice.id}`}>
                            <ExternalLink className="h-4 w-4 mr-1" />
                            Ver Claim
                          </Button>
                          <Button variant="outline" size="sm" data-testid={`button-download-${notice.id}`}>
                            <Download className="h-4 w-4 mr-1" />
                            Baixar
                          </Button>
                        </div>
                        
                        <div className="text-xs text-muted-foreground">
                          ID: {notice.id}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Analytics */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Claims por Tipo</CardTitle>
                  <CardDescription>Distribuição dos tipos de violação</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { type: 'Áudio', count: 1, color: 'bg-blue-500' },
                      { type: 'Imagem', count: 1, color: 'bg-green-500' },
                      { type: 'Vídeo', count: 1, color: 'bg-purple-500' }
                    ].map((data) => {
                      const percentage = (data.count / totalClaims) * 100;
                      
                      return (
                        <div key={data.type} className="space-y-2">
                          <div className="flex justify-between">
                            <span className="font-medium">{data.type}</span>
                            <span className="text-sm text-muted-foreground">{data.count} ({percentage.toFixed(1)}%)</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div 
                              className={`${data.color} h-2 rounded-full transition-all duration-300`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Status dos Claims</CardTitle>
                  <CardDescription>Estado atual dos claims de copyright</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { status: 'Aprovado', count: approvedClaims, color: 'bg-green-500' },
                      { status: 'Pendente', count: pendingClaims, color: 'bg-yellow-500' },
                      { status: 'Disputado', count: disputedClaims, color: 'bg-orange-500' }
                    ].map((data) => {
                      const percentage = (data.count / totalClaims) * 100;
                      
                      return (
                        <div key={data.status} className="space-y-2">
                          <div className="flex justify-between">
                            <span className="font-medium">{data.status}</span>
                            <span className="text-sm text-muted-foreground">{data.count} ({percentage.toFixed(1)}%)</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div 
                              className={`${data.color} h-2 rounded-full transition-all duration-300`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Métricas de Copyright</CardTitle>
                <CardDescription>Estatísticas consolidadas do sistema</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-blue-500">98.7%</div>
                    <p className="text-sm text-muted-foreground">Precisão de Detecção</p>
                  </div>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-green-500">2.4h</div>
                    <p className="text-sm text-muted-foreground">Tempo Médio de Resolução</p>
                  </div>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-purple-500">{mockFingerprints.length}</div>
                    <p className="text-sm text-muted-foreground">Fingerprints Ativos</p>
                  </div>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-orange-500">{mockLicenses.length}</div>
                    <p className="text-sm text-muted-foreground">Licenças Ativas</p>
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