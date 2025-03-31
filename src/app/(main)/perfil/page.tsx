'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { User, UserPreferences } from '@/types/auth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import ScreenReaderOnly from '@/components/accessibility/ScreenReaderOnly';

export default function PerfilPage() {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState<Partial<User>>(user || {});
  const [preferences, setPreferences] = useState<UserPreferences>(
    user?.preferences || {
      theme: 'system',
      reducedMotion: false,
      highContrast: false,
      fontSize: 'default',
      language: 'pt-BR',
      notifications: {
        email: true,
        push: true,
        sms: false,
        categories: {
          system: true,
          students: true,
          assessments: true,
        },
      },
      sidebarExpanded: true,
    }
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Manipular mudanças nos campos do formulário
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Manipular mudanças nas preferências
  const handlePreferenceChange = (key: keyof UserPreferences, value: any) => {
    setPreferences({ ...preferences, [key]: value });
  };

  // Manipular mudanças nas preferências de notificações
  const handleNotificationChange = (key: string, value: boolean) => {
    setPreferences({
      ...preferences,
      notifications: {
        ...preferences.notifications,
        [key]: value,
      },
    });
  };

  // Manipular mudanças nas categorias de notificações
  const handleCategoryChange = (category: string, value: boolean) => {
    setPreferences({
      ...preferences,
      notifications: {
        ...preferences.notifications,
        categories: {
          ...preferences.notifications.categories,
          [category]: value,
        },
      },
    });
  };

  // Enviar formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccess(false);
    setError(null);

    try {
      // Simular uma chamada API
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Atualizar usuário
      updateUser({
        ...formData,
        preferences,
      });

      setSuccess(true);
    } catch (err) {
      setError('Ocorreu um erro ao salvar as alterações. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto p-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>
            Você precisa estar autenticado para acessar esta página.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold mb-8">Meu Perfil</h1>

      {success && (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertTitle>Sucesso</AlertTitle>
          <AlertDescription>Suas alterações foram salvas com sucesso.</AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="info" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="info">Informações Pessoais</TabsTrigger>
          <TabsTrigger value="accessibility">Acessibilidade</TabsTrigger>
          <TabsTrigger value="notifications">Notificações</TabsTrigger>
          <TabsTrigger value="institutions">Instituições</TabsTrigger>
        </TabsList>

        <form onSubmit={handleSubmit}>
          <TabsContent value="info">
            <Card>
              <CardHeader>
                <CardTitle>Informações Pessoais</CardTitle>
                <CardDescription>
                  Atualize suas informações de perfil e configure como os outros usuários podem ver
                  você.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">
                      Nome Completo
                      <ScreenReaderOnly> (obrigatório)</ScreenReaderOnly>
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name || ''}
                      onChange={handleInputChange}
                      required
                      aria-required="true"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">
                      E-mail
                      <ScreenReaderOnly> (obrigatório)</ScreenReaderOnly>
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email || ''}
                      onChange={handleInputChange}
                      required
                      aria-required="true"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="accessibility">
            <Card>
              <CardHeader>
                <CardTitle>Preferências de Acessibilidade</CardTitle>
                <CardDescription>
                  Configure suas preferências de acessibilidade para melhorar sua experiência na
                  plataforma.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="theme">Tema</Label>
                    <p className="text-sm text-muted-foreground">
                      Escolha entre tema claro, escuro ou sistema
                    </p>
                  </div>
                  <Select
                    defaultValue={preferences.theme}
                    onValueChange={value => handlePreferenceChange('theme', value)}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Selecione um tema" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Claro</SelectItem>
                      <SelectItem value="dark">Escuro</SelectItem>
                      <SelectItem value="system">Sistema</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="reducedMotion">Reduzir Movimento</Label>
                    <p className="text-sm text-muted-foreground">
                      Reduz ou elimina animações na interface
                    </p>
                  </div>
                  <Switch
                    id="reducedMotion"
                    checked={preferences.reducedMotion}
                    onCheckedChange={checked => handlePreferenceChange('reducedMotion', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="highContrast">Alto Contraste</Label>
                    <p className="text-sm text-muted-foreground">
                      Aumenta o contraste entre elementos da interface
                    </p>
                  </div>
                  <Switch
                    id="highContrast"
                    checked={preferences.highContrast}
                    onCheckedChange={checked => handlePreferenceChange('highContrast', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="fontSize">Tamanho da Fonte</Label>
                    <p className="text-sm text-muted-foreground">
                      Ajuste o tamanho da fonte em toda a plataforma
                    </p>
                  </div>
                  <Select
                    defaultValue={preferences.fontSize}
                    onValueChange={value => handlePreferenceChange('fontSize', value)}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Tamanho da fonte" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Padrão</SelectItem>
                      <SelectItem value="large">Grande</SelectItem>
                      <SelectItem value="larger">Muito Grande</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="language">Idioma</Label>
                    <p className="text-sm text-muted-foreground">Escolha o idioma da plataforma</p>
                  </div>
                  <Select
                    defaultValue={preferences.language}
                    onValueChange={value => handlePreferenceChange('language', value)}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Selecione um idioma" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                      <SelectItem value="en-US">English (US)</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Preferências de Notificações</CardTitle>
                <CardDescription>
                  Configure como e quando deseja receber notificações.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Canais de Notificação</h3>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="email-notifications">E-mail</Label>
                      <p className="text-sm text-muted-foreground">
                        Receber notificações por e-mail
                      </p>
                    </div>
                    <Switch
                      id="email-notifications"
                      checked={preferences.notifications.email}
                      onCheckedChange={checked => handleNotificationChange('email', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="push-notifications">Push</Label>
                      <p className="text-sm text-muted-foreground">
                        Receber notificações push no navegador
                      </p>
                    </div>
                    <Switch
                      id="push-notifications"
                      checked={preferences.notifications.push}
                      onCheckedChange={checked => handleNotificationChange('push', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="sms-notifications">SMS</Label>
                      <p className="text-sm text-muted-foreground">Receber notificações por SMS</p>
                    </div>
                    <Switch
                      id="sms-notifications"
                      checked={preferences.notifications.sms}
                      onCheckedChange={checked => handleNotificationChange('sms', checked)}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Categorias</h3>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="system-notifications">Sistema</Label>
                      <p className="text-sm text-muted-foreground">
                        Notificações sobre atualizações e manutenção
                      </p>
                    </div>
                    <Switch
                      id="system-notifications"
                      checked={preferences.notifications.categories.system}
                      onCheckedChange={checked => handleCategoryChange('system', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="students-notifications">Alunos</Label>
                      <p className="text-sm text-muted-foreground">
                        Notificações sobre progresso e atividades dos alunos
                      </p>
                    </div>
                    <Switch
                      id="students-notifications"
                      checked={preferences.notifications.categories.students}
                      onCheckedChange={checked => handleCategoryChange('students', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="assessments-notifications">Avaliações</Label>
                      <p className="text-sm text-muted-foreground">
                        Notificações sobre novas avaliações e resultados
                      </p>
                    </div>
                    <Switch
                      id="assessments-notifications"
                      checked={preferences.notifications.categories.assessments}
                      onCheckedChange={checked => handleCategoryChange('assessments', checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="institutions">
            <Card>
              <CardHeader>
                <CardTitle>Minhas Instituições</CardTitle>
                <CardDescription>
                  Gerencie suas associações com instituições de ensino.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {user.institutions.map(institution => (
                    <div
                      key={institution.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div>
                        <h3 className="font-medium">{institution.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          Função:{' '}
                          {institution.role === 'TEACHER'
                            ? 'Professor'
                            : institution.role === 'COORDINATOR'
                              ? 'Coordenador'
                              : institution.role === 'ADMIN'
                                ? 'Administrador'
                                : institution.role === 'SPECIALIST'
                                  ? 'Especialista'
                                  : institution.role === 'PARENT'
                                    ? 'Responsável'
                                    : 'Estudante'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Tipo:{' '}
                          {institution.type === 'SCHOOL'
                            ? 'Escola'
                            : institution.type === 'DISTRICT'
                              ? 'Distrito'
                              : 'Rede'}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {institution.isActive ? (
                          <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                            Ativo
                          </span>
                        ) : (
                          <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
                            Inativo
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <div className="mt-6 flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </div>
        </form>
      </Tabs>
    </div>
  );
}
