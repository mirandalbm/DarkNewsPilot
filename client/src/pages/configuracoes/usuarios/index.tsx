import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { 
  User, 
  Mail, 
  Shield, 
  Clock, 
  Users,
  Settings,
  Edit3,
  Trash2,
  Plus,
  Eye,
  Key,
  LogOut,
  UserPlus
} from 'lucide-react';

interface UserProfile {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'editor' | 'viewer';
  lastLogin: string;
  createdAt: string;
  isActive: boolean;
}

interface Session {
  id: string;
  device: string;
  location: string;
  ip: string;
  lastActivity: string;
  current: boolean;
}

interface TeamMember {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'editor' | 'viewer';
  permissions: string[];
  invitedAt?: string;
  status: 'active' | 'invited' | 'suspended';
}

const mockProfile: UserProfile = {
  id: '1',
  username: 'admin',
  email: 'admin@darknews.com',
  role: 'admin',
  lastLogin: new Date().toISOString(),
  createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  isActive: true
};

const mockSessions: Session[] = [
  {
    id: '1',
    device: 'Chrome - Windows',
    location: 'São Paulo, Brazil',
    ip: '192.168.1.100',
    lastActivity: new Date().toISOString(),
    current: true
  },
  {
    id: '2',
    device: 'Safari - macOS',
    location: 'São Paulo, Brazil',
    ip: '192.168.1.101',
    lastActivity: new Date(Date.now() - 3600000).toISOString(),
    current: false
  }
];

const mockTeamMembers: TeamMember[] = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@darknews.com',
    role: 'admin',
    permissions: ['all'],
    status: 'active'
  },
  {
    id: '2',
    username: 'editor01',
    email: 'editor@darknews.com',
    role: 'editor',
    permissions: ['videos.create', 'videos.edit', 'news.manage'],
    status: 'active'
  }
];

const rolePermissions = {
  admin: {
    name: 'Administrador',
    description: 'Acesso completo ao sistema',
    permissions: ['Todos os recursos', 'Gerenciar usuários', 'Configurações do sistema', 'Billing e assinaturas']
  },
  editor: {
    name: 'Editor',
    description: 'Pode criar e editar conteúdo',
    permissions: ['Criar vídeos', 'Editar scripts', 'Gerenciar notícias', 'Ver analytics']
  },
  viewer: {
    name: 'Visualizador',
    description: 'Apenas visualização',
    permissions: ['Ver dashboard', 'Ver relatórios', 'Ver vídeos produzidos']
  }
};

export default function Usuarios() {
  const [profileData, setProfileData] = useState(mockProfile);
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberRole, setNewMemberRole] = useState<'admin' | 'editor' | 'viewer'>('viewer');
  const { toast } = useToast();

  const { data: currentUser = mockProfile } = useQuery({
    queryKey: ['/api/user/profile'],
  });

  const { data: sessions = mockSessions } = useQuery({
    queryKey: ['/api/user/sessions'],
  });

  const { data: teamMembers = mockTeamMembers } = useQuery({
    queryKey: ['/api/team/members'],
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (updates: Partial<UserProfile>) => {
      const response = await apiRequest('PATCH', '/api/user/profile', updates);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/user/profile'] });
      toast({
        title: 'Perfil atualizado',
        description: 'Suas informações foram salvas com sucesso.',
      });
    },
    onError: () => {
      toast({
        title: 'Erro ao atualizar',
        description: 'Não foi possível salvar as alterações.',
        variant: 'destructive',
      });
    },
  });

  const revokeSessionMutation = useMutation({
    mutationFn: async (sessionId: string) => {
      const response = await apiRequest('DELETE', `/api/user/sessions/${sessionId}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/user/sessions'] });
      toast({
        title: 'Sessão revogada',
        description: 'A sessão foi encerrada com sucesso.',
      });
    },
  });

  const inviteTeamMemberMutation = useMutation({
    mutationFn: async ({ email, role }: { email: string; role: string }) => {
      const response = await apiRequest('POST', '/api/team/invite', { email, role });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/team/members'] });
      setNewMemberEmail('');
      setNewMemberRole('viewer');
      toast({
        title: 'Convite enviado',
        description: 'O convite foi enviado por email para o novo membro.',
      });
    },
    onError: () => {
      toast({
        title: 'Erro ao convidar',
        description: 'Não foi possível enviar o convite.',
        variant: 'destructive',
      });
    },
  });

  const removeTeamMemberMutation = useMutation({
    mutationFn: async (memberId: string) => {
      const response = await apiRequest('DELETE', `/api/team/members/${memberId}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/team/members'] });
      toast({
        title: 'Membro removido',
        description: 'O membro foi removido da equipe.',
      });
    },
  });

  const formatDate = (date: string) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'editor':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'viewer':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'invited':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'suspended':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  return (
    <div className="container mx-auto px-6 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Usuários e Equipe
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Gerencie seu perfil, equipe e permissões de acesso
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile" className="flex items-center space-x-2">
            <User className="h-4 w-4" />
            <span>Meu Perfil</span>
          </TabsTrigger>
          <TabsTrigger value="team" className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>Equipe</span>
          </TabsTrigger>
          <TabsTrigger value="permissions" className="flex items-center space-x-2">
            <Shield className="h-4 w-4" />
            <span>Permissões</span>
          </TabsTrigger>
          <TabsTrigger value="sessions" className="flex items-center space-x-2">
            <Clock className="h-4 w-4" />
            <span>Sessões</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Informações do Perfil</span>
              </CardTitle>
              <CardDescription>
                Atualize suas informações pessoais e configurações da conta
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-6">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={currentUser.avatar} />
                  <AvatarFallback className="text-lg">
                    {currentUser.username.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <h3 className="text-xl font-semibold">{currentUser.username}</h3>
                  <p className="text-gray-500">{currentUser.email}</p>
                  <Badge className={getRoleColor(currentUser.role)}>
                    {rolePermissions[currentUser.role]?.name}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="username">Nome de usuário</Label>
                  <Input
                    id="username"
                    value={profileData.username}
                    onChange={(e) => setProfileData(prev => ({ ...prev, username: e.target.value }))}
                    data-testid="username-input"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                    data-testid="email-input"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setProfileData(currentUser)}
                  data-testid="reset-profile-button"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={() => updateProfileMutation.mutate(profileData)}
                  disabled={updateProfileMutation.isPending}
                  data-testid="save-profile-button"
                >
                  {updateProfileMutation.isPending ? 'Salvando...' : 'Salvar Alterações'}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Key className="h-5 w-5" />
                <span>Informações da Conta</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-sm font-medium">Conta criada em</Label>
                  <p className="text-sm text-gray-600 mt-1">{formatDate(currentUser.createdAt)}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Último login</Label>
                  <p className="text-sm text-gray-600 mt-1">{formatDate(currentUser.lastLogin)}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Status da conta</Label>
                  <div className="mt-1">
                    <Badge className={currentUser.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                      {currentUser.isActive ? 'Ativa' : 'Inativa'}
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Nível de acesso</Label>
                  <p className="text-sm text-gray-600 mt-1">{rolePermissions[currentUser.role]?.name}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <UserPlus className="h-5 w-5" />
                    <span>Convidar Novo Membro</span>
                  </CardTitle>
                  <CardDescription>
                    Adicione novos membros à sua equipe
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-end space-x-3">
                <div className="flex-1 space-y-2">
                  <Label htmlFor="member-email">Email do novo membro</Label>
                  <Input
                    id="member-email"
                    type="email"
                    placeholder="usuario@exemplo.com"
                    value={newMemberEmail}
                    onChange={(e) => setNewMemberEmail(e.target.value)}
                    data-testid="new-member-email-input"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Função</Label>
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={newMemberRole}
                    onChange={(e) => setNewMemberRole(e.target.value as any)}
                    data-testid="new-member-role-select"
                  >
                    <option value="viewer">Visualizador</option>
                    <option value="editor">Editor</option>
                    <option value="admin">Administrador</option>
                  </select>
                </div>
                <Button
                  onClick={() => inviteTeamMemberMutation.mutate({ 
                    email: newMemberEmail, 
                    role: newMemberRole 
                  })}
                  disabled={!newMemberEmail || inviteTeamMemberMutation.isPending}
                  data-testid="invite-member-button"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {inviteTeamMemberMutation.isPending ? 'Enviando...' : 'Convidar'}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Membros da Equipe</span>
              </CardTitle>
              <CardDescription>
                Gerencie os membros e suas permissões
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {teamMembers.map((member) => (
                  <div 
                    key={member.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                    data-testid={`team-member-${member.id}`}
                  >
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src={member.avatar} />
                        <AvatarFallback>
                          {member.username.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{member.username}</p>
                        <p className="text-sm text-gray-500">{member.email}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge className={getRoleColor(member.role)}>
                            {rolePermissions[member.role]?.name}
                          </Badge>
                          <Badge className={getStatusColor(member.status)}>
                            {member.status === 'active' ? 'Ativo' : 
                             member.status === 'invited' ? 'Convidado' : 'Suspenso'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        data-testid={`edit-member-${member.id}`}
                      >
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      {member.id !== currentUser.id && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeTeamMemberMutation.mutate(member.id)}
                          disabled={removeTeamMemberMutation.isPending}
                          data-testid={`remove-member-${member.id}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="permissions" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.entries(rolePermissions).map(([role, details]) => (
              <Card key={role}>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="h-5 w-5" />
                    <span>{details.name}</span>
                  </CardTitle>
                  <CardDescription>{details.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {details.permissions.map((permission, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm">{permission}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="sessions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>Sessões Ativas</span>
              </CardTitle>
              <CardDescription>
                Monitore e gerencie suas sessões de login
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sessions.map((session) => (
                  <div 
                    key={session.id}
                    className={`flex items-center justify-between p-4 border rounded-lg ${
                      session.current ? 'bg-green-50 dark:bg-green-900/20 border-green-200' : ''
                    }`}
                    data-testid={`session-${session.id}`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full">
                        <Settings className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium flex items-center">
                          {session.device}
                          {session.current && (
                            <Badge className="ml-2 bg-green-100 text-green-800">
                              Sessão atual
                            </Badge>
                          )}
                        </p>
                        <p className="text-sm text-gray-500">
                          {session.location} • {session.ip}
                        </p>
                        <p className="text-xs text-gray-400">
                          Última atividade: {formatDate(session.lastActivity)}
                        </p>
                      </div>
                    </div>
                    
                    {!session.current && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => revokeSessionMutation.mutate(session.id)}
                        disabled={revokeSessionMutation.isPending}
                        data-testid={`revoke-session-${session.id}`}
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Revogar
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}