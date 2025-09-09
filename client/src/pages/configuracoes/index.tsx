import { Link } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Settings,
  Bot, 
  Monitor, 
  CreditCard, 
  Crown,
  Users,
  Youtube,
  Play,
  Bell
} from 'lucide-react';

const configSections = [
  {
    title: 'Integrações',
    description: 'Configure APIs e serviços externos',
    icon: Bot,
    href: '/settings/integracoes',
    color: 'bg-blue-500',
    items: ['OpenAI', 'ElevenLabs', 'HeyGen', 'YouTube', 'NewsAPI']
  },
  {
    title: 'Painel',
    description: 'Personalize sua experiência do dashboard',
    icon: Monitor,
    href: '/settings/painel',
    color: 'bg-purple-500',
    items: ['Tema', 'Idioma', 'Notificações', 'Segurança']
  },
  {
    title: 'Saldos',
    description: 'Monitore custos e gerencie créditos',
    icon: CreditCard,
    href: '/settings/saldos',
    color: 'bg-green-500',
    items: ['Saldos por API', 'Histórico', 'Projeções', 'Créditos']
  },
  {
    title: 'Assinaturas',
    description: 'Gerencie planos e pagamentos',
    icon: Crown,
    href: '/settings/assinaturas',
    color: 'bg-yellow-500',
    items: ['Plano atual', 'Upgrade/Downgrade', 'Histórico', 'Uso']
  },
  {
    title: 'Usuários',
    description: 'Gerenciar contas e permissões',
    icon: Users,
    href: '/settings/usuarios',
    color: 'bg-indigo-500',
    items: ['Perfil', 'Equipe', 'Permissões', 'Sessões']
  },
  {
    title: 'Canais',
    description: 'Configure canais do YouTube',
    icon: Youtube,
    href: '/settings/canais',
    color: 'bg-red-500',
    items: ['Conectar canais', 'Configurar', 'Agendamento', 'Analytics']
  },
  {
    title: 'Automação',
    description: 'Configurar pipelines automatizados',
    icon: Play,
    href: '/settings/automacao',
    color: 'bg-orange-500',
    items: ['Workflows', 'Horários', 'Filtros', 'Aprovação']
  },
  {
    title: 'Notificações',
    description: 'Configure alertas e avisos',
    icon: Bell,
    href: '/settings/notificacoes',
    color: 'bg-pink-500',
    items: ['Email', 'Slack', 'Push', 'Webhooks']
  }
];

export default function ConfiguracaoIndex() {
  return (
    <div className="container mx-auto px-6 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center space-x-3">
          <Settings className="h-8 w-8 text-primary" />
          <span>Configurações</span>
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Configure e personalize todos os aspectos do seu sistema DarkNews Autopilot
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {configSections.map((section) => {
          const Icon = section.icon;
          
          return (
            <Link key={section.href} href={section.href}>
              <Card className="group hover:shadow-lg transition-all duration-200 cursor-pointer hover:scale-105 border-l-4 border-l-transparent hover:border-l-primary">
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`p-3 rounded-lg ${section.color} bg-opacity-10`}>
                      <Icon className={`h-6 w-6 text-${section.color.split('-')[1]}-600`} />
                    </div>
                    <div>
                      <CardTitle className="text-lg group-hover:text-primary transition-colors">
                        {section.title}
                      </CardTitle>
                      <CardDescription className="text-sm">
                        {section.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1">
                    {section.items.map((item, index) => (
                      <div key={index} className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800">
                    <span className="text-primary text-sm font-medium group-hover:underline">
                      Configurar →
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Quick access to commonly used settings */}
      <div className="mt-12">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          Acesso Rápido
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href="/settings/integracoes">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4 text-center">
                <Bot className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <p className="font-medium text-sm">APIs</p>
                <p className="text-xs text-gray-500">Conectar serviços</p>
              </CardContent>
            </Card>
          </Link>
          
          <Link href="/settings/canais">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4 text-center">
                <Youtube className="h-8 w-8 text-red-500 mx-auto mb-2" />
                <p className="font-medium text-sm">YouTube</p>
                <p className="text-xs text-gray-500">Gerenciar canais</p>
              </CardContent>
            </Card>
          </Link>
          
          <Link href="/settings/automacao">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4 text-center">
                <Play className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                <p className="font-medium text-sm">Automação</p>
                <p className="text-xs text-gray-500">Configurar pipelines</p>
              </CardContent>
            </Card>
          </Link>
          
          <Link href="/settings/saldos">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4 text-center">
                <CreditCard className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <p className="font-medium text-sm">Custos</p>
                <p className="text-xs text-gray-500">Monitorar gastos</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}