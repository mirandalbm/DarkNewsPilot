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
  CreditCard, 
  Crown,
  Users,
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Check,
  X,
  AlertCircle,
  Settings,
  Eye,
  Star,
  Zap,
  Shield,
  Infinity,
  Clock,
  Gift,
  Target,
  BarChart3,
  Activity,
  RefreshCw,
  Download,
  Upload,
  UserCheck,
  AlertTriangle,
  CheckCircle,
  Package,
  Percent,
  PlayCircle,
  PauseCircle,
  StopCircle
} from 'lucide-react';

interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  billingPeriod: 'monthly' | 'yearly';
  features: string[];
  limits: {
    videosPerMonth: number;
    aiCredits: number;
    channels: number;
    storage: string;
  };
  popular?: boolean;
  color: string;
}

interface Subscriber {
  id: string;
  name: string;
  email: string;
  plan: string;
  status: 'active' | 'cancelled' | 'expired' | 'trial';
  startDate: string;
  nextBilling: string;
  totalRevenue: number;
  usage: {
    videos: number;
    credits: number;
    storage: number;
  };
}

const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'starter',
    name: 'Starter',
    description: 'Perfeito para criadores iniciantes',
    price: 29.90,
    billingPeriod: 'monthly',
    features: [
      'Até 10 vídeos por mês',
      '5.000 créditos de IA',
      '2 canais do YouTube',
      'Templates básicos',
      'Suporte por email'
    ],
    limits: {
      videosPerMonth: 10,
      aiCredits: 5000,
      channels: 2,
      storage: '50GB'
    },
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'Para criadores sérios de conteúdo',
    price: 79.90,
    billingPeriod: 'monthly',
    features: [
      'Até 50 vídeos por mês',
      '25.000 créditos de IA',
      '10 canais do YouTube',
      'Templates premium',
      'Análise avançada',
      'Suporte prioritário',
      'API access'
    ],
    limits: {
      videosPerMonth: 50,
      aiCredits: 25000,
      channels: 10,
      storage: '500GB'
    },
    popular: true,
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'Para agências e empresas',
    price: 199.90,
    billingPeriod: 'monthly',
    features: [
      'Vídeos ilimitados',
      '100.000 créditos de IA',
      'Canais ilimitados',
      'Templates customizados',
      'White-label',
      'Gerente dedicado',
      'SLA garantido',
      'Integração personalizada'
    ],
    limits: {
      videosPerMonth: -1, // ilimitado
      aiCredits: 100000,
      channels: -1, // ilimitado
      storage: '5TB'
    },
    color: 'from-orange-500 to-red-500'
  }
];

const mockSubscribers: Subscriber[] = [
  {
    id: '1',
    name: 'Canal Mistérios BR',
    email: 'contato@misteriosbr.com',
    plan: 'Professional',
    status: 'active',
    startDate: '2024-01-15',
    nextBilling: '2024-04-15',
    totalRevenue: 239.70,
    usage: {
      videos: 32,
      credits: 18500,
      storage: 245
    }
  },
  {
    id: '2',
    name: 'Dark Stories TV',
    email: 'admin@darkstories.tv',
    plan: 'Enterprise',
    status: 'active',
    startDate: '2023-11-20',
    nextBilling: '2024-04-20',
    totalRevenue: 999.50,
    usage: {
      videos: 156,
      credits: 75000,
      storage: 1200
    }
  },
  {
    id: '3',
    name: 'True Crime Brasil',
    email: 'hello@truecrimebr.com',
    plan: 'Starter',
    status: 'trial',
    startDate: '2024-03-01',
    nextBilling: '2024-04-01',
    totalRevenue: 0,
    usage: {
      videos: 4,
      credits: 1200,
      storage: 12
    }
  },
  {
    id: '4',
    name: 'Paranormal Channel',
    email: 'team@paranormal.com.br',
    plan: 'Professional',
    status: 'cancelled',
    startDate: '2023-08-10',
    nextBilling: '-',
    totalRevenue: 479.40,
    usage: {
      videos: 0,
      credits: 0,
      storage: 0
    }
  }
];

export default function Subscriptions() {
  const [selectedPlan, setSelectedPlan] = useState<string>('professional');
  const [showBillingDialog, setShowBillingDialog] = useState(false);
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const { toast } = useToast();

  const formatPrice = (price: number, period: 'monthly' | 'yearly') => {
    if (period === 'yearly') {
      const yearlyPrice = price * 12 * 0.8; // 20% desconto anual
      return `R$ ${yearlyPrice.toFixed(2)}/ano`;
    }
    return `R$ ${price.toFixed(2)}/mês`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-500';
      case 'trial': return 'text-blue-500';
      case 'cancelled': return 'text-red-500';
      case 'expired': return 'text-gray-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'trial': return <Clock className="h-4 w-4 text-blue-500" />;
      case 'cancelled': return <StopCircle className="h-4 w-4 text-red-500" />;
      case 'expired': return <AlertTriangle className="h-4 w-4 text-gray-500" />;
      default: return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
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

  const handlePlanUpgrade = (planId: string) => {
    toast({
      title: "Upgrade solicitado",
      description: `Iniciando processo de upgrade para o plano ${planId}`,
    });
  };

  const handleBillingChange = () => {
    toast({
      title: "Cobrança atualizada",
      description: "Informações de cobrança foram atualizadas com sucesso",
    });
    setShowBillingDialog(false);
  };

  return (
    <div className="container mx-auto px-6 py-8 max-w-7xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
              <CreditCard className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Sistema de Assinaturas</h1>
              <p className="text-muted-foreground">Gestão completa de planos e assinantes</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Select value={billingPeriod} onValueChange={(value: 'monthly' | 'yearly') => setBillingPeriod(value)}>
              <SelectTrigger className="w-32" data-testid="select-billing-period">
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">Mensal</SelectItem>
                <SelectItem value="yearly">Anual</SelectItem>
              </SelectContent>
            </Select>

            <Dialog open={showBillingDialog} onOpenChange={setShowBillingDialog}>
              <DialogTrigger asChild>
                <Button data-testid="button-billing-settings">
                  <Settings className="h-4 w-4 mr-2" />
                  Configurar
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Configurações de Cobrança</DialogTitle>
                  <DialogDescription>
                    Configure métodos de pagamento e informações fiscais
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="card-number">Número do Cartão</Label>
                    <Input id="card-number" placeholder="**** **** **** 1234" data-testid="input-card-number" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiry">Validade</Label>
                      <Input id="expiry" placeholder="MM/AA" data-testid="input-expiry" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvv">CVV</Label>
                      <Input id="cvv" placeholder="123" data-testid="input-cvv" />
                    </div>
                  </div>
                  <Button onClick={handleBillingChange} className="w-full" data-testid="button-save-billing">
                    Salvar Configurações
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
                  <p className="text-sm font-medium text-muted-foreground">Assinantes Ativos</p>
                  <p className="text-2xl font-bold">1,247</p>
                  <p className="text-xs text-green-500 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +12.5% este mês
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
                  <p className="text-sm font-medium text-muted-foreground">Receita Mensal</p>
                  <p className="text-2xl font-bold">R$ 89.4K</p>
                  <p className="text-xs text-green-500 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +18.2% este mês
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
                  <p className="text-sm font-medium text-muted-foreground">Taxa de Retenção</p>
                  <p className="text-2xl font-bold">94.2%</p>
                  <p className="text-xs text-green-500 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +2.1% este mês
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
                  <p className="text-sm font-medium text-muted-foreground">Trials Ativos</p>
                  <p className="text-2xl font-bold">184</p>
                  <p className="text-xs text-blue-500 flex items-center mt-1">
                    <Clock className="h-3 w-3 mr-1" />
                    78% convertem
                  </p>
                </div>
                <Gift className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="plans" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="plans">Planos</TabsTrigger>
            <TabsTrigger value="subscribers">Assinantes</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="billing">Faturamento</TabsTrigger>
          </TabsList>

          {/* Planos */}
          <TabsContent value="plans" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Planos Disponíveis</h3>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">Período:</span>
                <Badge variant={billingPeriod === 'yearly' ? 'default' : 'secondary'}>
                  {billingPeriod === 'yearly' ? '20% desconto anual' : 'Mensal'}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {subscriptionPlans.map((plan) => (
                <Card 
                  key={plan.id} 
                  className={`relative hover:shadow-lg transition-all ${
                    plan.popular ? 'ring-2 ring-purple-500 scale-105' : ''
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-purple-500 text-white">
                        <Crown className="h-3 w-3 mr-1" />
                        Mais Popular
                      </Badge>
                    </div>
                  )}
                  
                  <CardHeader>
                    <div className={`w-12 h-12 bg-gradient-to-br ${plan.color} rounded-lg flex items-center justify-center mb-3`}>
                      <Package className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                    <div className="pt-2">
                      <div className="text-3xl font-bold">
                        {formatPrice(plan.price, billingPeriod)}
                      </div>
                      {billingPeriod === 'yearly' && (
                        <div className="text-sm text-muted-foreground line-through">
                          R$ {(plan.price * 12).toFixed(2)}/ano
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      {plan.features.map((feature, index) => (
                        <div key={index} className="flex items-center space-x-2 text-sm">
                          <Check className="h-4 w-4 text-green-500" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-4 border-t space-y-2">
                      <h4 className="font-medium text-sm">Limites:</h4>
                      <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                        <div>Vídeos: {plan.limits.videosPerMonth === -1 ? 'Ilimitado' : plan.limits.videosPerMonth}</div>
                        <div>Créditos: {formatNumber(plan.limits.aiCredits)}</div>
                        <div>Canais: {plan.limits.channels === -1 ? 'Ilimitado' : plan.limits.channels}</div>
                        <div>Storage: {plan.limits.storage}</div>
                      </div>
                    </div>

                    <Button 
                      className="w-full" 
                      variant={plan.popular ? 'default' : 'outline'}
                      onClick={() => handlePlanUpgrade(plan.id)}
                      data-testid={`button-select-plan-${plan.id}`}
                    >
                      {plan.popular ? 'Escolher Plano' : 'Selecionar'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Comparação de Planos */}
            <Card>
              <CardHeader>
                <CardTitle>Comparação Detalhada</CardTitle>
                <CardDescription>Compare todos os recursos dos planos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Recurso</th>
                        {subscriptionPlans.map((plan) => (
                          <th key={plan.id} className="text-center p-2">{plan.name}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      <tr className="border-b">
                        <td className="p-2 font-medium">Vídeos por mês</td>
                        <td className="text-center p-2">10</td>
                        <td className="text-center p-2">50</td>
                        <td className="text-center p-2">
                          <Infinity className="h-4 w-4 mx-auto" />
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-2 font-medium">Créditos de IA</td>
                        <td className="text-center p-2">5K</td>
                        <td className="text-center p-2">25K</td>
                        <td className="text-center p-2">100K</td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-2 font-medium">Canais YouTube</td>
                        <td className="text-center p-2">2</td>
                        <td className="text-center p-2">10</td>
                        <td className="text-center p-2">
                          <Infinity className="h-4 w-4 mx-auto" />
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-2 font-medium">API Access</td>
                        <td className="text-center p-2"><X className="h-4 w-4 mx-auto text-red-500" /></td>
                        <td className="text-center p-2"><Check className="h-4 w-4 mx-auto text-green-500" /></td>
                        <td className="text-center p-2"><Check className="h-4 w-4 mx-auto text-green-500" /></td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-2 font-medium">White-label</td>
                        <td className="text-center p-2"><X className="h-4 w-4 mx-auto text-red-500" /></td>
                        <td className="text-center p-2"><X className="h-4 w-4 mx-auto text-red-500" /></td>
                        <td className="text-center p-2"><Check className="h-4 w-4 mx-auto text-green-500" /></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Assinantes */}
          <TabsContent value="subscribers" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Gerenciar Assinantes</h3>
              <div className="flex items-center space-x-4">
                <Select>
                  <SelectTrigger className="w-40" data-testid="select-subscriber-filter">
                    <SelectValue placeholder="Filtrar por status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="active">Ativos</SelectItem>
                    <SelectItem value="trial">Trial</SelectItem>
                    <SelectItem value="cancelled">Cancelados</SelectItem>
                  </SelectContent>
                </Select>
                <Button data-testid="button-export-subscribers">
                  <Download className="h-4 w-4 mr-2" />
                  Exportar
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              {mockSubscribers.map((subscriber) => (
                <Card key={subscriber.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {/* Header do assinante */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                            <UserCheck className="h-5 w-5" />
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <h3 className="font-semibold">{subscriber.name}</h3>
                              <Badge variant="outline">{subscriber.plan}</Badge>
                              {getStatusIcon(subscriber.status)}
                            </div>
                            <p className="text-sm text-muted-foreground">{subscriber.email}</p>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="text-lg font-bold">R$ {subscriber.totalRevenue.toFixed(2)}</div>
                          <p className="text-xs text-muted-foreground">Receita total</p>
                        </div>
                      </div>

                      {/* Informações de cobrança */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
                        <div>
                          <span className="text-xs text-muted-foreground">Início:</span>
                          <p className="font-medium">{subscriber.startDate}</p>
                        </div>
                        <div>
                          <span className="text-xs text-muted-foreground">Próxima cobrança:</span>
                          <p className="font-medium">{subscriber.nextBilling}</p>
                        </div>
                        <div>
                          <span className="text-xs text-muted-foreground">Status:</span>
                          <p className={`font-medium ${getStatusColor(subscriber.status)}`}>
                            {subscriber.status === 'active' ? 'Ativo' : 
                             subscriber.status === 'trial' ? 'Trial' :
                             subscriber.status === 'cancelled' ? 'Cancelado' : 'Expirado'}
                          </p>
                        </div>
                      </div>

                      {/* Uso atual */}
                      <div className="space-y-3">
                        <h4 className="text-sm font-medium">Uso Atual:</h4>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Vídeos este mês</span>
                            <span>{subscriber.usage.videos} / {
                              subscriptionPlans.find(p => p.name === subscriber.plan)?.limits.videosPerMonth === -1 
                                ? '∞' 
                                : subscriptionPlans.find(p => p.name === subscriber.plan)?.limits.videosPerMonth
                            }</span>
                          </div>
                          <Progress 
                            value={subscriber.usage.videos / 
                              (subscriptionPlans.find(p => p.name === subscriber.plan)?.limits.videosPerMonth || 100) * 100} 
                            className="h-2" 
                          />
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Créditos de IA</span>
                            <span>{formatNumber(subscriber.usage.credits)} / {
                              formatNumber(subscriptionPlans.find(p => p.name === subscriber.plan)?.limits.aiCredits || 0)
                            }</span>
                          </div>
                          <Progress 
                            value={subscriber.usage.credits / 
                              (subscriptionPlans.find(p => p.name === subscriber.plan)?.limits.aiCredits || 1) * 100} 
                            className="h-2" 
                          />
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Storage usado</span>
                            <span>{subscriber.usage.storage}GB / {
                              subscriptionPlans.find(p => p.name === subscriber.plan)?.limits.storage
                            }</span>
                          </div>
                          <Progress value={subscriber.usage.storage / 500 * 100} className="h-2" />
                        </div>
                      </div>

                      {/* Ações */}
                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" data-testid={`button-view-${subscriber.id}`}>
                            <Eye className="h-4 w-4 mr-1" />
                            Ver Detalhes
                          </Button>
                          {subscriber.status === 'active' && (
                            <Button variant="outline" size="sm" data-testid={`button-pause-${subscriber.id}`}>
                              <PauseCircle className="h-4 w-4 mr-1" />
                              Pausar
                            </Button>
                          )}
                        </div>
                        
                        {subscriber.status === 'trial' && (
                          <Badge variant="secondary" className="text-xs">
                            <Clock className="h-3 w-3 mr-1" />
                            Trial expira em 5 dias
                          </Badge>
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
                  <CardTitle>Crescimento de Assinantes</CardTitle>
                  <CardDescription>Últimos 6 meses</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { month: 'Nov', value: 950, growth: 8.2 },
                      { month: 'Dez', value: 1024, growth: 7.8 },
                      { month: 'Jan', value: 1156, growth: 12.9 },
                      { month: 'Fev', value: 1203, growth: 4.1 },
                      { month: 'Mar', value: 1247, growth: 3.7 }
                    ].map((data) => (
                      <div key={data.month} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 text-sm font-medium">{data.month}</div>
                          <div className="flex-1">
                            <Progress value={data.value / 1500 * 100} className="h-2" />
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{data.value}</div>
                          <div className="text-xs text-green-500">+{data.growth}%</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Distribuição por Plano</CardTitle>
                  <CardDescription>Assinantes ativos por plano</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Starter</span>
                        <span className="font-medium">42% (524)</span>
                      </div>
                      <Progress value={42} className="h-2" />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Professional</span>
                        <span className="font-medium">48% (599)</span>
                      </div>
                      <Progress value={48} className="h-2" />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Enterprise</span>
                        <span className="font-medium">10% (124)</span>
                      </div>
                      <Progress value={10} className="h-2" />
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold">R$ 71.8K</div>
                        <p className="text-xs text-muted-foreground">MRR</p>
                      </div>
                      <div>
                        <div className="text-2xl font-bold">R$ 861K</div>
                        <p className="text-xs text-muted-foreground">ARR</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Métricas de Retenção</CardTitle>
                <CardDescription>Análise de churn e lifetime value</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-green-500">94.2%</div>
                    <p className="text-sm text-muted-foreground">Taxa de Retenção</p>
                  </div>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-red-500">5.8%</div>
                    <p className="text-sm text-muted-foreground">Churn Rate</p>
                  </div>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-blue-500">R$ 1,248</div>
                    <p className="text-sm text-muted-foreground">LTV Médio</p>
                  </div>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-purple-500">18.2 meses</div>
                    <p className="text-sm text-muted-foreground">Duração Média</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Faturamento */}
          <TabsContent value="billing" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Próximas Cobranças</CardTitle>
                  <CardDescription>Receita prevista para próximos 30 dias</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div>
                        <div className="font-medium">Próximos 7 dias</div>
                        <div className="text-sm text-muted-foreground">124 renovações</div>
                      </div>
                      <div className="text-lg font-bold">R$ 8.9K</div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div>
                        <div className="font-medium">Próximos 15 dias</div>
                        <div className="text-sm text-muted-foreground">287 renovações</div>
                      </div>
                      <div className="text-lg font-bold">R$ 21.3K</div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div>
                        <div className="font-medium">Próximos 30 dias</div>
                        <div className="text-sm text-muted-foreground">542 renovações</div>
                      </div>
                      <div className="text-lg font-bold">R$ 42.7K</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Falhas de Pagamento</CardTitle>
                  <CardDescription>Cobranças que falharam recentemente</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-3 border border-red-200 bg-red-50 dark:bg-red-950 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">Mystery Channel Pro</div>
                          <div className="text-sm text-muted-foreground">R$ 79.90 - Cartão expirado</div>
                        </div>
                        <Button size="sm" variant="outline" data-testid="button-retry-payment">
                          <RefreshCw className="h-4 w-4 mr-1" />
                          Tentar novamente
                        </Button>
                      </div>
                    </div>

                    <div className="p-3 border border-yellow-200 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">Dark Stories TV</div>
                          <div className="text-sm text-muted-foreground">R$ 199.90 - Fundos insuficientes</div>
                        </div>
                        <Button size="sm" variant="outline" data-testid="button-contact-customer">
                          <UserCheck className="h-4 w-4 mr-1" />
                          Contatar
                        </Button>
                      </div>
                    </div>

                    <div className="text-center text-sm text-muted-foreground">
                      2 de 1,247 cobranças falharam (0.16%)
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Relatório Financeiro</CardTitle>
                <CardDescription>Resumo financeiro do mês atual</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-green-500">R$ 89.4K</div>
                    <p className="text-sm text-muted-foreground">Receita Bruta</p>
                    <p className="text-xs text-green-500 mt-1">+18.2% vs mês anterior</p>
                  </div>
                  
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-blue-500">R$ 82.1K</div>
                    <p className="text-sm text-muted-foreground">Receita Líquida</p>
                    <p className="text-xs text-muted-foreground mt-1">Após taxas e impostos</p>
                  </div>
                  
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-purple-500">8.2%</div>
                    <p className="text-sm text-muted-foreground">Taxa de Processamento</p>
                    <p className="text-xs text-muted-foreground mt-1">Stripe + impostos</p>
                  </div>
                </div>

                <div className="mt-6 flex justify-center">
                  <Button data-testid="button-download-report">
                    <Download className="h-4 w-4 mr-2" />
                    Baixar Relatório Completo
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}