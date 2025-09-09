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
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Calculator,
  Target,
  PieChart,
  BarChart3,
  LineChart,
  Calendar,
  Clock,
  Users,
  Eye,
  Play,
  Zap,
  AlertCircle,
  CheckCircle,
  Download,
  Plus
} from 'lucide-react';

interface RevenueData {
  period: string;
  adRevenue: number;
  sponsorships: number;
  merchandise: number;
  memberships: number;
  total: number;
  costs: number;
  profit: number;
  roi: number;
}

interface Campaign {
  id: string;
  name: string;
  type: 'content' | 'ads' | 'sponsorship';
  investment: number;
  revenue: number;
  roi: number;
  status: 'active' | 'completed' | 'paused';
  startDate: string;
  endDate: string;
  metrics: {
    views: number;
    clicks: number;
    conversions: number;
  };
}

const mockRevenueData: RevenueData[] = [
  {
    period: 'Janeiro 2024',
    adRevenue: 8500,
    sponsorships: 15000,
    merchandise: 2300,
    memberships: 4200,
    total: 30000,
    costs: 12000,
    profit: 18000,
    roi: 150
  },
  {
    period: 'Fevereiro 2024',
    adRevenue: 9200,
    sponsorships: 18000,
    merchandise: 2800,
    memberships: 4800,
    total: 34800,
    costs: 13500,
    profit: 21300,
    roi: 158
  },
  {
    period: 'Março 2024',
    adRevenue: 11500,
    sponsorships: 22000,
    merchandise: 3200,
    memberships: 5400,
    total: 42100,
    costs: 15000,
    profit: 27100,
    roi: 181
  }
];

const mockCampaigns: Campaign[] = [
  {
    id: '1',
    name: 'Série Mistérios Urbanos',
    type: 'content',
    investment: 5000,
    revenue: 12500,
    roi: 150,
    status: 'active',
    startDate: '2024-03-01',
    endDate: '2024-03-31',
    metrics: {
      views: 850000,
      clicks: 42500,
      conversions: 1250
    }
  },
  {
    id: '2',
    name: 'Campanha Google Ads',
    type: 'ads',
    investment: 2000,
    revenue: 4800,
    roi: 140,
    status: 'active',
    startDate: '2024-03-15',
    endDate: '2024-04-15',
    metrics: {
      views: 125000,
      clicks: 8900,
      conversions: 340
    }
  },
  {
    id: '3',
    name: 'Parceria CryptoNews',
    type: 'sponsorship',
    investment: 1000,
    revenue: 8000,
    roi: 700,
    status: 'completed',
    startDate: '2024-02-01',
    endDate: '2024-02-28',
    metrics: {
      views: 340000,
      clicks: 18700,
      conversions: 890
    }
  }
];

export default function RevenueAnalysis() {
  const [selectedPeriod, setSelectedPeriod] = useState('3months');
  const [newCampaignName, setNewCampaignName] = useState('');
  const [newCampaignBudget, setNewCampaignBudget] = useState('');
  const [selectedCampaignType, setSelectedCampaignType] = useState('');
  const [isCalculating, setIsCalculating] = useState(false);
  const { toast } = useToast();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const getROIColor = (roi: number) => {
    if (roi >= 200) return 'text-green-500';
    if (roi >= 100) return 'text-blue-500';
    if (roi >= 50) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'completed': return <CheckCircle className="h-4 w-4 text-blue-500" />;
      default: return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    }
  };

  const calculateProjectedROI = async () => {
    if (!newCampaignName || !newCampaignBudget) {
      toast({
        title: "Erro",
        description: "Preencha nome e orçamento da campanha",
        variant: "destructive"
      });
      return;
    }

    setIsCalculating(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const budget = parseFloat(newCampaignBudget);
      const projectedROI = Math.floor(Math.random() * 200) + 100; // 100-300%
      const projectedRevenue = budget * (projectedROI / 100);
      
      toast({
        title: "Projeção calculada!",
        description: `ROI estimado: ${projectedROI}% | Receita: ${formatCurrency(projectedRevenue)}`,
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao calcular projeção",
        variant: "destructive"
      });
    } finally {
      setIsCalculating(false);
    }
  };

  const currentPeriodData = mockRevenueData[mockRevenueData.length - 1];
  const previousPeriodData = mockRevenueData[mockRevenueData.length - 2];
  const revenueGrowth = ((currentPeriodData.total - previousPeriodData.total) / previousPeriodData.total) * 100;

  return (
    <div className="container mx-auto px-6 py-8 max-w-7xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">ROI & Receitas</h1>
              <p className="text-muted-foreground">Análise financeira e retorno sobre investimento</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-40" data-testid="select-period">
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1month">Último mês</SelectItem>
                <SelectItem value="3months">3 meses</SelectItem>
                <SelectItem value="6months">6 meses</SelectItem>
                <SelectItem value="1year">1 ano</SelectItem>
              </SelectContent>
            </Select>

            <Button data-testid="button-export-revenue">
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
          </div>
        </div>

        {/* KPIs principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Receita Total</p>
                  <p className="text-2xl font-bold">{formatCurrency(currentPeriodData.total)}</p>
                  <p className={`text-xs flex items-center mt-1 ${revenueGrowth > 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {revenueGrowth > 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                    {formatPercentage(Math.abs(revenueGrowth))} vs mês anterior
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
                  <p className="text-sm font-medium text-muted-foreground">Lucro Líquido</p>
                  <p className="text-2xl font-bold">{formatCurrency(currentPeriodData.profit)}</p>
                  <p className="text-xs text-green-500 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +26.8% vs mês anterior
                  </p>
                </div>
                <Target className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">ROI Médio</p>
                  <p className="text-2xl font-bold">{formatPercentage(currentPeriodData.roi)}</p>
                  <p className="text-xs text-green-500 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +14.6% vs mês anterior
                  </p>
                </div>
                <BarChart3 className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Margem de Lucro</p>
                  <p className="text-2xl font-bold">{formatPercentage((currentPeriodData.profit / currentPeriodData.total) * 100)}</p>
                  <p className="text-xs text-green-500 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +3.2% vs mês anterior
                  </p>
                </div>
                <PieChart className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="sources">Fontes de Receita</TabsTrigger>
            <TabsTrigger value="campaigns">Campanhas</TabsTrigger>
            <TabsTrigger value="projections">Projeções</TabsTrigger>
            <TabsTrigger value="costs">Análise de Custos</TabsTrigger>
          </TabsList>

          {/* Visão Geral */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <LineChart className="h-5 w-5" />
                    <span>Evolução da Receita</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockRevenueData.map((data, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{data.period}</p>
                          <p className="text-sm text-muted-foreground">
                            Lucro: {formatCurrency(data.profit)} | ROI: {formatPercentage(data.roi)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">{formatCurrency(data.total)}</p>
                          <p className="text-sm text-muted-foreground">Receita total</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="h-5 w-5" />
                    <span>Performance por Canal</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">YouTube Ads</span>
                        <span className="font-medium">{formatCurrency(currentPeriodData.adRevenue)}</span>
                      </div>
                      <Progress value={(currentPeriodData.adRevenue / currentPeriodData.total) * 100} className="h-2" />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Patrocínios</span>
                        <span className="font-medium">{formatCurrency(currentPeriodData.sponsorships)}</span>
                      </div>
                      <Progress value={(currentPeriodData.sponsorships / currentPeriodData.total) * 100} className="h-2" />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Membros</span>
                        <span className="font-medium">{formatCurrency(currentPeriodData.memberships)}</span>
                      </div>
                      <Progress value={(currentPeriodData.memberships / currentPeriodData.total) * 100} className="h-2" />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Produtos</span>
                        <span className="font-medium">{formatCurrency(currentPeriodData.merchandise)}</span>
                      </div>
                      <Progress value={(currentPeriodData.merchandise / currentPeriodData.total) * 100} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Fontes de Receita */}
          <TabsContent value="sources" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6 text-center">
                  <Play className="h-8 w-8 text-red-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{formatCurrency(currentPeriodData.adRevenue)}</div>
                  <p className="text-sm text-muted-foreground">YouTube Ads</p>
                  <p className="text-xs text-green-500 mt-1">+8.2% este mês</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <Users className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{formatCurrency(currentPeriodData.sponsorships)}</div>
                  <p className="text-sm text-muted-foreground">Patrocínios</p>
                  <p className="text-xs text-green-500 mt-1">+22.2% este mês</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <Target className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{formatCurrency(currentPeriodData.memberships)}</div>
                  <p className="text-sm text-muted-foreground">Membros</p>
                  <p className="text-xs text-green-500 mt-1">+12.5% este mês</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <Zap className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{formatCurrency(currentPeriodData.merchandise)}</div>
                  <p className="text-sm text-muted-foreground">Produtos</p>
                  <p className="text-xs text-green-500 mt-1">+14.3% este mês</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Campanhas */}
          <TabsContent value="campaigns" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Campanhas Ativas</span>
                  <Button data-testid="button-new-campaign">
                    <Plus className="h-4 w-4 mr-2" />
                    Nova Campanha
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockCampaigns.map((campaign) => (
                    <div key={campaign.id} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-sm transition-all">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium">{campaign.name}</h4>
                          <Badge variant={campaign.type === 'sponsorship' ? 'default' : campaign.type === 'ads' ? 'secondary' : 'outline'}>
                            {campaign.type === 'sponsorship' ? 'Patrocínio' : campaign.type === 'ads' ? 'Anúncio' : 'Conteúdo'}
                          </Badge>
                          {getStatusIcon(campaign.status)}
                        </div>
                        <div className="flex space-x-4 text-sm text-muted-foreground">
                          <span>Investimento: {formatCurrency(campaign.investment)}</span>
                          <span>Receita: {formatCurrency(campaign.revenue)}</span>
                          <span className="flex items-center space-x-1">
                            <Eye className="h-3 w-3" />
                            <span>{campaign.metrics.views.toLocaleString()}</span>
                          </span>
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <div className={`text-xl font-bold ${getROIColor(campaign.roi)}`}>
                          {formatPercentage(campaign.roi)}
                        </div>
                        <p className="text-xs text-muted-foreground">ROI</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Projeções */}
          <TabsContent value="projections" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Calculator className="h-5 w-5" />
                    <span>Calculadora de ROI</span>
                  </CardTitle>
                  <CardDescription>
                    Calcule o retorno projetado para novas campanhas
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="campaign-name">Nome da Campanha</Label>
                    <Input
                      id="campaign-name"
                      placeholder="Ex: Série Crimes Famosos"
                      value={newCampaignName}
                      onChange={(e) => setNewCampaignName(e.target.value)}
                      data-testid="input-campaign-name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="campaign-budget">Orçamento (R$)</Label>
                    <Input
                      id="campaign-budget"
                      type="number"
                      placeholder="Ex: 5000"
                      value={newCampaignBudget}
                      onChange={(e) => setNewCampaignBudget(e.target.value)}
                      data-testid="input-campaign-budget"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Tipo de Campanha</Label>
                    <Select value={selectedCampaignType} onValueChange={setSelectedCampaignType}>
                      <SelectTrigger data-testid="select-campaign-type">
                        <SelectValue placeholder="Escolha o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="content">Produção de Conteúdo</SelectItem>
                        <SelectItem value="ads">Anúncios Pagos</SelectItem>
                        <SelectItem value="sponsorship">Patrocínio</SelectItem>
                        <SelectItem value="collaboration">Colaboração</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button 
                    onClick={calculateProjectedROI}
                    disabled={isCalculating}
                    className="w-full"
                    data-testid="button-calculate-roi"
                  >
                    {isCalculating ? (
                      <>
                        <Calculator className="h-4 w-4 mr-2 animate-spin" />
                        Calculando...
                      </>
                    ) : (
                      <>
                        <Calculator className="h-4 w-4 mr-2" />
                        Calcular ROI Projetado
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Metas de Receita</CardTitle>
                  <CardDescription>
                    Progresso em direção às metas mensais
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Meta Mensal</span>
                      <span className="font-medium">{formatCurrency(45000)}</span>
                    </div>
                    <Progress value={(currentPeriodData.total / 45000) * 100} className="h-3" />
                    <p className="text-xs text-muted-foreground">
                      {formatPercentage((currentPeriodData.total / 45000) * 100)} da meta atingida
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Meta Trimestral</span>
                      <span className="font-medium">{formatCurrency(120000)}</span>
                    </div>
                    <Progress value={87} className="h-3" />
                    <p className="text-xs text-muted-foreground">87% da meta trimestral</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Meta Anual</span>
                      <span className="font-medium">{formatCurrency(500000)}</span>
                    </div>
                    <Progress value={24} className="h-3" />
                    <p className="text-xs text-muted-foreground">24% da meta anual</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Análise de Custos */}
          <TabsContent value="costs" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Breakdown de Custos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Produção de Vídeo</span>
                      <span className="font-medium">{formatCurrency(6000)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">APIs (OpenAI, ElevenLabs)</span>
                      <span className="font-medium">{formatCurrency(2500)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Hospedagem & Infraestrutura</span>
                      <span className="font-medium">{formatCurrency(800)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Marketing & Anúncios</span>
                      <span className="font-medium">{formatCurrency(3200)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Outros</span>
                      <span className="font-medium">{formatCurrency(2500)}</span>
                    </div>
                    <hr />
                    <div className="flex justify-between items-center font-bold">
                      <span>Total</span>
                      <span>{formatCurrency(currentPeriodData.costs)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Otimização de Custos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                      <div className="flex items-center space-x-2 mb-1">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="font-medium text-sm">Economia Identificada</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Mudança para plano anual das APIs: -R$ 300/mês
                      </p>
                    </div>

                    <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                      <div className="flex items-center space-x-2 mb-1">
                        <AlertCircle className="h-4 w-4 text-blue-500" />
                        <span className="font-medium text-sm">Oportunidade</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Negociar desconto em volume para produção: -15% custos
                      </p>
                    </div>

                    <div className="p-3 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
                      <div className="flex items-center space-x-2 mb-1">
                        <Target className="h-4 w-4 text-yellow-500" />
                        <span className="font-medium text-sm">Meta de Eficiência</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Reduzir custos em 20% mantendo qualidade
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}