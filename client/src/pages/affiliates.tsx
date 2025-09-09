import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Share2, 
  Users,
  DollarSign,
  TrendingUp,
  Copy,
  Eye,
  Calendar,
  Link,
  Target,
  Award,
  BarChart3,
  Clock,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Download,
  UserPlus,
  Gift,
  Percent,
  Star,
  Activity,
  Filter,
  Search,
  Plus,
  Edit,
  Trash2,
  ExternalLink,
  QrCode,
  Mail,
  MessageSquare,
  Phone,
  MapPin,
  Globe,
  Instagram,
  Youtube,
  Twitter,
  Facebook,
  Zap,
  Crown,
  Shield
} from 'lucide-react';

interface Affiliate {
  id: string;
  name: string;
  email: string;
  phone?: string;
  social?: {
    youtube?: string;
    instagram?: string;
    twitter?: string;
  };
  status: 'active' | 'pending' | 'suspended' | 'inactive';
  joinDate: string;
  tier: 'bronze' | 'silver' | 'gold' | 'diamond';
  referralCode: string;
  totalEarnings: number;
  pendingEarnings: number;
  totalReferrals: number;
  conversionRate: number;
  lastActivity: string;
  paymentMethod: 'pix' | 'bank' | 'paypal';
}

interface Commission {
  id: string;
  affiliateId: string;
  affiliateName: string;
  customerEmail: string;
  subscriptionPlan: string;
  amount: number;
  commissionRate: number;
  commissionAmount: number;
  status: 'pending' | 'paid' | 'cancelled';
  date: string;
  paymentDate?: string;
}

const mockAffiliates: Affiliate[] = [
  {
    id: '1',
    name: 'João Silva',
    email: 'joao@creatorpro.com',
    phone: '+55 11 99999-9999',
    social: {
      youtube: 'CreatorProBR',
      instagram: '@creatorprobr'
    },
    status: 'active',
    joinDate: '2024-01-15',
    tier: 'gold',
    referralCode: 'JOAO2024',
    totalEarnings: 4580.50,
    pendingEarnings: 320.00,
    totalReferrals: 45,
    conversionRate: 18.5,
    lastActivity: '2024-03-08',
    paymentMethod: 'pix'
  },
  {
    id: '2',
    name: 'Maria Santos',
    email: 'maria@digitalcreative.com',
    phone: '+55 21 88888-8888',
    social: {
      youtube: 'DigitalCreativeBR',
      instagram: '@digitalcreative',
      twitter: '@digicreativebr'
    },
    status: 'active',
    joinDate: '2023-11-20',
    tier: 'diamond',
    referralCode: 'MARIA2023',
    totalEarnings: 8750.00,
    pendingEarnings: 560.00,
    totalReferrals: 78,
    conversionRate: 22.8,
    lastActivity: '2024-03-09',
    paymentMethod: 'bank'
  },
  {
    id: '3',
    name: 'Pedro Costa',
    email: 'pedro@techmedia.com.br',
    status: 'pending',
    joinDate: '2024-03-01',
    tier: 'bronze',
    referralCode: 'PEDRO2024',
    totalEarnings: 0,
    pendingEarnings: 0,
    totalReferrals: 0,
    conversionRate: 0,
    lastActivity: '2024-03-01',
    paymentMethod: 'pix'
  },
  {
    id: '4',
    name: 'Ana Oliveira',
    email: 'ana@contentcreator.com',
    phone: '+55 85 77777-7777',
    social: {
      youtube: 'AnaContentBR',
      instagram: '@anacontent'
    },
    status: 'suspended',
    joinDate: '2023-08-10',
    tier: 'silver',
    referralCode: 'ANA2023',
    totalEarnings: 2340.75,
    pendingEarnings: 0,
    totalReferrals: 28,
    conversionRate: 15.2,
    lastActivity: '2024-02-15',
    paymentMethod: 'paypal'
  }
];

const mockCommissions: Commission[] = [
  {
    id: '1',
    affiliateId: '1',
    affiliateName: 'João Silva',
    customerEmail: 'cliente1@email.com',
    subscriptionPlan: 'Professional',
    amount: 79.90,
    commissionRate: 30,
    commissionAmount: 23.97,
    status: 'paid',
    date: '2024-03-01',
    paymentDate: '2024-03-08'
  },
  {
    id: '2',
    affiliateId: '2',
    affiliateName: 'Maria Santos',
    customerEmail: 'cliente2@email.com',
    subscriptionPlan: 'Enterprise',
    amount: 199.90,
    commissionRate: 35,
    commissionAmount: 69.97,
    status: 'pending',
    date: '2024-03-05'
  },
  {
    id: '3',
    affiliateId: '1',
    affiliateName: 'João Silva',
    customerEmail: 'cliente3@email.com',
    subscriptionPlan: 'Starter',
    amount: 29.90,
    commissionRate: 25,
    commissionAmount: 7.48,
    status: 'pending',
    date: '2024-03-07'
  }
];

export default function Affiliates() {
  const [selectedAffiliate, setSelectedAffiliate] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const { toast } = useToast();

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'diamond': return 'text-purple-500 bg-purple-100 dark:bg-purple-950';
      case 'gold': return 'text-yellow-500 bg-yellow-100 dark:bg-yellow-950';
      case 'silver': return 'text-gray-500 bg-gray-100 dark:bg-gray-950';
      default: return 'text-orange-500 bg-orange-100 dark:bg-orange-950';
    }
  };

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'diamond': return <Crown className="h-4 w-4" />;
      case 'gold': return <Award className="h-4 w-4" />;
      case 'silver': return <Star className="h-4 w-4" />;
      default: return <Shield className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-500';
      case 'pending': return 'text-yellow-500';
      case 'suspended': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'suspended': return <AlertCircle className="h-4 w-4 text-red-500" />;
      default: return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const generateReferralLink = (code: string) => {
    return `https://darknews.com.br/ref/${code}`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copiado!",
      description: "Link copiado para a área de transferência",
    });
  };

  const handleAddAffiliate = () => {
    toast({
      title: "Afiliado adicionado",
      description: "Novo afiliado foi convidado com sucesso",
    });
    setShowAddDialog(false);
  };

  const handlePayCommission = (commissionId: string) => {
    toast({
      title: "Comissão paga",
      description: "Pagamento processado com sucesso",
    });
  };

  return (
    <div className="container mx-auto px-6 py-8 max-w-7xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-pink-600 rounded-lg flex items-center justify-center">
              <Share2 className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Marketing de Afiliados</h1>
              <p className="text-muted-foreground">Gerencie seu programa de afiliados e comissões</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
              <DialogTrigger asChild>
                <Button data-testid="button-add-affiliate">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Convidar Afiliado
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Convidar Novo Afiliado</DialogTitle>
                  <DialogDescription>
                    Envie um convite para um novo afiliado
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="affiliate-name">Nome</Label>
                    <Input id="affiliate-name" placeholder="Nome do afiliado" data-testid="input-affiliate-name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="affiliate-email">Email</Label>
                    <Input id="affiliate-email" type="email" placeholder="email@exemplo.com" data-testid="input-affiliate-email" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="affiliate-tier">Tier Inicial</Label>
                    <Select>
                      <SelectTrigger data-testid="select-affiliate-tier">
                        <SelectValue placeholder="Selecione o tier" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bronze">Bronze (25%)</SelectItem>
                        <SelectItem value="silver">Silver (30%)</SelectItem>
                        <SelectItem value="gold">Gold (35%)</SelectItem>
                        <SelectItem value="diamond">Diamond (40%)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={handleAddAffiliate} className="w-full" data-testid="button-send-invite">
                    <Mail className="h-4 w-4 mr-2" />
                    Enviar Convite
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
                  <p className="text-sm font-medium text-muted-foreground">Afiliados Ativos</p>
                  <p className="text-2xl font-bold">127</p>
                  <p className="text-xs text-green-500 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +8 este mês
                  </p>
                </div>
                <Users className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Comissões Pagas</p>
                  <p className="text-2xl font-bold">R$ 18.4K</p>
                  <p className="text-xs text-green-500 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +22% este mês
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
                  <p className="text-sm font-medium text-muted-foreground">Conversões</p>
                  <p className="text-2xl font-bold">284</p>
                  <p className="text-xs text-blue-500 flex items-center mt-1">
                    <Target className="h-3 w-3 mr-1" />
                    Taxa 18.2%
                  </p>
                </div>
                <Target className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pendente</p>
                  <p className="text-2xl font-bold">R$ 3.2K</p>
                  <p className="text-xs text-yellow-500 flex items-center mt-1">
                    <Clock className="h-3 w-3 mr-1" />
                    Para pagamento
                  </p>
                </div>
                <Gift className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="affiliates" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="affiliates">Afiliados</TabsTrigger>
            <TabsTrigger value="commissions">Comissões</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Configurações</TabsTrigger>
          </TabsList>

          {/* Afiliados */}
          <TabsContent value="affiliates" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Gerenciar Afiliados</h3>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar afiliados..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                    data-testid="input-search-affiliates"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40" data-testid="select-status-filter">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="active">Ativos</SelectItem>
                    <SelectItem value="pending">Pendentes</SelectItem>
                    <SelectItem value="suspended">Suspensos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              {mockAffiliates.map((affiliate) => (
                <Card key={affiliate.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {/* Header do afiliado */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                            <Users className="h-6 w-6" />
                          </div>
                          <div>
                            <div className="flex items-center space-x-2 mb-1">
                              <h3 className="font-semibold">{affiliate.name}</h3>
                              <Badge className={getTierColor(affiliate.tier)}>
                                {getTierIcon(affiliate.tier)}
                                <span className="ml-1 capitalize">{affiliate.tier}</span>
                              </Badge>
                              {getStatusIcon(affiliate.status)}
                            </div>
                            <p className="text-sm text-muted-foreground">{affiliate.email}</p>
                            {affiliate.phone && (
                              <p className="text-xs text-muted-foreground">{affiliate.phone}</p>
                            )}
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="text-lg font-bold">{formatCurrency(affiliate.totalEarnings)}</div>
                          <p className="text-xs text-muted-foreground">Total ganho</p>
                        </div>
                      </div>

                      {/* Estatísticas */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted/50 rounded-lg">
                        <div className="text-center">
                          <div className="text-lg font-bold text-blue-500">{affiliate.totalReferrals}</div>
                          <p className="text-xs text-muted-foreground">Referrals</p>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-green-500">{affiliate.conversionRate}%</div>
                          <p className="text-xs text-muted-foreground">Conversão</p>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-orange-500">{formatCurrency(affiliate.pendingEarnings)}</div>
                          <p className="text-xs text-muted-foreground">Pendente</p>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-purple-500">{affiliate.referralCode}</div>
                          <p className="text-xs text-muted-foreground">Código</p>
                        </div>
                      </div>

                      {/* Links de referência */}
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Link de Referência:</h4>
                        <div className="flex items-center space-x-2 p-3 bg-muted/50 rounded-lg">
                          <Input
                            value={generateReferralLink(affiliate.referralCode)}
                            readOnly
                            className="flex-1"
                            data-testid={`input-referral-link-${affiliate.id}`}
                          />
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => copyToClipboard(generateReferralLink(affiliate.referralCode))}
                            data-testid={`button-copy-link-${affiliate.id}`}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            data-testid={`button-qr-code-${affiliate.id}`}
                          >
                            <QrCode className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Redes sociais */}
                      {affiliate.social && (
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium">Redes Sociais:</h4>
                          <div className="flex space-x-3">
                            {affiliate.social.youtube && (
                              <Badge variant="outline" className="text-red-500">
                                <Youtube className="h-3 w-3 mr-1" />
                                {affiliate.social.youtube}
                              </Badge>
                            )}
                            {affiliate.social.instagram && (
                              <Badge variant="outline" className="text-pink-500">
                                <Instagram className="h-3 w-3 mr-1" />
                                {affiliate.social.instagram}
                              </Badge>
                            )}
                            {affiliate.social.twitter && (
                              <Badge variant="outline" className="text-blue-500">
                                <Twitter className="h-3 w-3 mr-1" />
                                {affiliate.social.twitter}
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" data-testid={`button-view-${affiliate.id}`}>
                            <Eye className="h-4 w-4 mr-1" />
                            Ver Detalhes
                          </Button>
                          <Button variant="outline" size="sm" data-testid={`button-edit-${affiliate.id}`}>
                            <Edit className="h-4 w-4 mr-1" />
                            Editar
                          </Button>
                          {affiliate.status === 'active' && affiliate.pendingEarnings > 0 && (
                            <Button size="sm" data-testid={`button-pay-${affiliate.id}`}>
                              <DollarSign className="h-4 w-4 mr-1" />
                              Pagar {formatCurrency(affiliate.pendingEarnings)}
                            </Button>
                          )}
                        </div>
                        
                        <div className="text-xs text-muted-foreground">
                          Membro desde: {affiliate.joinDate} | Última atividade: {affiliate.lastActivity}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Comissões */}
          <TabsContent value="commissions" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Histórico de Comissões</h3>
              <div className="flex items-center space-x-4">
                <Select value={selectedAffiliate} onValueChange={setSelectedAffiliate}>
                  <SelectTrigger className="w-48" data-testid="select-affiliate-filter">
                    <SelectValue placeholder="Filtrar por afiliado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos Afiliados</SelectItem>
                    {mockAffiliates.map((affiliate) => (
                      <SelectItem key={affiliate.id} value={affiliate.id}>
                        {affiliate.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button data-testid="button-export-commissions">
                  <Download className="h-4 w-4 mr-2" />
                  Exportar
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              {mockCommissions.map((commission) => (
                <Card key={commission.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold">{commission.affiliateName}</h3>
                          <Badge variant="outline">{commission.subscriptionPlan}</Badge>
                          <Badge 
                            variant={commission.status === 'paid' ? 'default' : 
                                   commission.status === 'pending' ? 'secondary' : 'destructive'}
                          >
                            {commission.status === 'paid' ? 'Pago' : 
                             commission.status === 'pending' ? 'Pendente' : 'Cancelado'}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Cliente: {commission.customerEmail}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Data: {commission.date} {commission.paymentDate && `| Pago em: ${commission.paymentDate}`}
                        </p>
                      </div>
                      
                      <div className="text-right space-y-1">
                        <div className="text-lg font-bold">{formatCurrency(commission.commissionAmount)}</div>
                        <p className="text-xs text-muted-foreground">
                          {commission.commissionRate}% de {formatCurrency(commission.amount)}
                        </p>
                        {commission.status === 'pending' && (
                          <Button 
                            size="sm"
                            onClick={() => handlePayCommission(commission.id)}
                            data-testid={`button-pay-commission-${commission.id}`}
                          >
                            <DollarSign className="h-4 w-4 mr-1" />
                            Pagar
                          </Button>
                        )}
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
                  <CardTitle>Top Afiliados</CardTitle>
                  <CardDescription>Por total de ganhos</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockAffiliates
                      .sort((a, b) => b.totalEarnings - a.totalEarnings)
                      .slice(0, 5)
                      .map((affiliate, index) => (
                        <div key={affiliate.id} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center text-sm font-bold">
                              {index + 1}
                            </div>
                            <div>
                              <div className="font-medium">{affiliate.name}</div>
                              <div className="text-sm text-muted-foreground">{affiliate.totalReferrals} referrals</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold">{formatCurrency(affiliate.totalEarnings)}</div>
                            <div className="text-sm text-green-500">{affiliate.conversionRate}% conversão</div>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Distribuição por Tier</CardTitle>
                  <CardDescription>Afiliados por nível</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm flex items-center">
                          <Shield className="h-4 w-4 mr-2 text-orange-500" />
                          Bronze (25%)
                        </span>
                        <span className="font-medium">45%</span>
                      </div>
                      <Progress value={45} className="h-2" />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm flex items-center">
                          <Star className="h-4 w-4 mr-2 text-gray-500" />
                          Silver (30%)
                        </span>
                        <span className="font-medium">32%</span>
                      </div>
                      <Progress value={32} className="h-2" />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm flex items-center">
                          <Award className="h-4 w-4 mr-2 text-yellow-500" />
                          Gold (35%)
                        </span>
                        <span className="font-medium">18%</span>
                      </div>
                      <Progress value={18} className="h-2" />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm flex items-center">
                          <Crown className="h-4 w-4 mr-2 text-purple-500" />
                          Diamond (40%)
                        </span>
                        <span className="font-medium">5%</span>
                      </div>
                      <Progress value={5} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Performance Mensal</CardTitle>
                <CardDescription>Comissões pagas nos últimos 6 meses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-green-500">R$ 67.8K</div>
                    <p className="text-sm text-muted-foreground">Total Pago</p>
                  </div>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-blue-500">19.4%</div>
                    <p className="text-sm text-muted-foreground">Taxa Conversão Média</p>
                  </div>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-purple-500">847</div>
                    <p className="text-sm text-muted-foreground">Total Conversões</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Configurações */}
          <TabsContent value="settings" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Taxas de Comissão</CardTitle>
                  <CardDescription>Configure as taxas por tier</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    {[
                      { tier: 'Bronze', rate: 25, color: 'text-orange-500' },
                      { tier: 'Silver', rate: 30, color: 'text-gray-500' },
                      { tier: 'Gold', rate: 35, color: 'text-yellow-500' },
                      { tier: 'Diamond', rate: 40, color: 'text-purple-500' }
                    ].map((item) => (
                      <div key={item.tier} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-2">
                          <Percent className={`h-4 w-4 ${item.color}`} />
                          <span className="font-medium">{item.tier}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Input
                            type="number"
                            value={item.rate}
                            className="w-20 text-center"
                            data-testid={`input-rate-${item.tier.toLowerCase()}`}
                          />
                          <span className="text-sm text-muted-foreground">%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button className="w-full" data-testid="button-save-rates">
                    Salvar Configurações
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Configurações Gerais</CardTitle>
                  <CardDescription>Outras configurações do programa</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="min-payout">Valor mínimo para saque</Label>
                    <Input id="min-payout" type="number" defaultValue="50.00" data-testid="input-min-payout" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="payout-frequency">Frequência de pagamento</Label>
                    <Select>
                      <SelectTrigger data-testid="select-payout-frequency">
                        <SelectValue placeholder="Frequência" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="weekly">Semanal</SelectItem>
                        <SelectItem value="monthly">Mensal</SelectItem>
                        <SelectItem value="quarterly">Trimestral</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cookie-duration">Duração do cookie (dias)</Label>
                    <Input id="cookie-duration" type="number" defaultValue="30" data-testid="input-cookie-duration" />
                  </div>

                  <Button className="w-full" data-testid="button-save-general">
                    Salvar Configurações
                  </Button>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Material Promocional</CardTitle>
                <CardDescription>Links e recursos para afiliados</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Banners Promocionais</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Banners em diversos tamanhos para seus afiliados
                    </p>
                    <Button size="sm" variant="outline" data-testid="button-download-banners">
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Copy para Email</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Templates de email marketing para afiliados
                    </p>
                    <Button size="sm" variant="outline" data-testid="button-copy-templates">
                      <Copy className="h-4 w-4 mr-1" />
                      Copiar Templates
                    </Button>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Vídeos Promocionais</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Vídeos de demonstração do produto
                    </p>
                    <Button size="sm" variant="outline" data-testid="button-view-videos">
                      <ExternalLink className="h-4 w-4 mr-1" />
                      Ver Vídeos
                    </Button>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">FAQ Afiliados</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Perguntas frequentes sobre o programa
                    </p>
                    <Button size="sm" variant="outline" data-testid="button-view-faq">
                      <ExternalLink className="h-4 w-4 mr-1" />
                      Ver FAQ
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