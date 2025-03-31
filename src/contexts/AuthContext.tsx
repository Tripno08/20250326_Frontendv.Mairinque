'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { AuthState, User, LoginCredentials, Institution } from '@/types/auth';

// Interface que define os métodos e propriedades do contexto
interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  updateUser: (data: Partial<User>) => void;
  switchInstitution: (institutionId: string) => void;
}

// Valor padrão para o contexto
const defaultAuthContext: AuthContextType = {
  isAuthenticated: false,
  user: null,
  loading: true,
  error: null,
  login: async () => {},
  logout: async () => {},
  refreshToken: async () => {},
  updateUser: () => {},
  switchInstitution: () => {},
};

// Criação do contexto
const AuthContext = createContext<AuthContextType>(defaultAuthContext);

// Propriedades do provedor de autenticação
interface AuthProviderProps {
  children: ReactNode;
}

// Provedor de autenticação
export function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter();
  const pathname = usePathname();

  // Estado de autenticação
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    loading: true,
    error: null,
  });

  // Verificar se o usuário já está autenticado ao carregar a página
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Na implementação real, verificaria o token no localStorage e faria uma chamada à API
        const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

        if (isAuthenticated) {
          // Simulando dados do usuário
          const mockUser: User = {
            id: '1',
            name: 'Usuário de Teste',
            email: 'usuario@exemplo.com',
            role: 'TEACHER',
            permissions: [{ resource: 'dashboard', actions: ['read'] }],
            institutions: [
              { id: '1', name: 'Escola Modelo', type: 'SCHOOL', role: 'TEACHER', isActive: true },
              {
                id: '2',
                name: 'Instituto Educacional',
                type: 'SCHOOL',
                role: 'COORDINATOR',
                isActive: true,
              },
            ],
            preferences: {
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
            },
          };

          setAuthState({
            isAuthenticated: true,
            user: mockUser,
            loading: false,
            error: null,
            selectedInstitution: mockUser.institutions[0],
          });
        } else {
          setAuthState({
            isAuthenticated: false,
            user: null,
            loading: false,
            error: null,
          });
        }
      } catch (error) {
        setAuthState({
          isAuthenticated: false,
          user: null,
          loading: false,
          error: 'Erro ao verificar autenticação',
        });
      }
    };

    checkAuth();
  }, []);

  // Redirecionamento baseado em autenticação
  useEffect(() => {
    if (!authState.loading) {
      const isAuthRoute =
        pathname?.startsWith('/(auth)') ||
        pathname === '/login' ||
        pathname === '/password-reset' ||
        pathname === '/first-access';

      if (!authState.isAuthenticated && !isAuthRoute) {
        // Redirecionar para login se não estiver autenticado e não estiver em uma rota de autenticação
        // Salvar URL atual para redirecionamento após login
        localStorage.setItem('redirectUrl', pathname || '/');
        router.push('/login');
      } else if (authState.isAuthenticated && isAuthRoute) {
        // Redirecionar para dashboard se estiver autenticado e tentar acessar uma rota de autenticação
        const redirectUrl = localStorage.getItem('redirectUrl') || '/dashboard';
        localStorage.removeItem('redirectUrl');
        router.push(redirectUrl);
      }
    }
  }, [authState.isAuthenticated, authState.loading, pathname, router]);

  // Função de login
  const login = async (credentials: LoginCredentials) => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }));

    try {
      // Aqui faria a chamada real de API
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Simulando sucesso
      const mockUser: User = {
        id: '1',
        name: 'Usuário de Teste',
        email: credentials.email,
        role: 'TEACHER',
        permissions: [{ resource: 'dashboard', actions: ['read'] }],
        institutions: [
          { id: '1', name: 'Escola Modelo', type: 'SCHOOL', role: 'TEACHER', isActive: true },
          {
            id: '2',
            name: 'Instituto Educacional',
            type: 'SCHOOL',
            role: 'COORDINATOR',
            isActive: true,
          },
        ],
        preferences: {
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
        },
        lastLogin: new Date(),
      };

      localStorage.setItem('isAuthenticated', 'true');

      setAuthState({
        isAuthenticated: true,
        user: mockUser,
        loading: false,
        error: null,
        selectedInstitution: mockUser.institutions[0],
      });

      // Redirecionar após login bem-sucedido
      const redirectUrl = localStorage.getItem('redirectUrl') || '/dashboard';
      localStorage.removeItem('redirectUrl');
      router.push(redirectUrl);
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: 'Credenciais inválidas',
      }));
    }
  };

  // Função de logout
  const logout = async () => {
    setAuthState(prev => ({ ...prev, loading: true }));

    try {
      // Aqui faria a chamada real de API
      await new Promise(resolve => setTimeout(resolve, 500));

      // Limpar dados de autenticação
      localStorage.removeItem('isAuthenticated');

      setAuthState({
        isAuthenticated: false,
        user: null,
        loading: false,
        error: null,
      });

      router.push('/login');
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: 'Erro ao fazer logout',
      }));
    }
  };

  // Função para atualizar o token
  const refreshToken = async () => {
    // Implementação do refresh token
    try {
      // Simular uma chamada de API
      await new Promise(resolve => setTimeout(resolve, 500));

      // Na implementação real, atualizaria o token e o salvaria
      console.log('Token atualizado');
    } catch (error) {
      // Se falhar, fazer logout
      logout();
    }
  };

  // Função para atualizar dados do usuário
  const updateUser = (data: Partial<User>) => {
    setAuthState(prev => ({
      ...prev,
      user: prev.user ? { ...prev.user, ...data } : null,
    }));
  };

  // Função para alternar entre instituições
  const switchInstitution = (institutionId: string) => {
    if (!authState.user) return;

    const institution = authState.user.institutions.find(inst => inst.id === institutionId);

    if (institution) {
      setAuthState(prev => ({
        ...prev,
        selectedInstitution: institution,
      }));
    }
  };

  // Valor do contexto
  const contextValue: AuthContextType = {
    ...authState,
    login,
    logout,
    refreshToken,
    updateUser,
    switchInstitution,
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
}

// Hook personalizado para usar o contexto de autenticação
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }

  return context;
};

export default AuthContext;
