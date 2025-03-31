'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { MainLayoutProps, NavigationGroup } from '@/types/layout';
import Sidebar from './Sidebar';
import HeaderBar from './HeaderBar';
import SkipLink from '@/components/accessibility/SkipLink';
import { useAuth } from '@/contexts/AuthContext';

export default function MainLayout({
  children,
  navigationGroups: propNavigationGroups,
}: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mobileView, setMobileView] = useState(false);
  const pathname = usePathname();
  const { user } = useAuth();

  // Define se a visualização é mobile com base no tamanho da tela
  useEffect(() => {
    const handleResize = () => {
      setMobileView(window.innerWidth < 1024);
    };

    // Definir o estado inicial
    handleResize();

    // Adicionar listener para redimensionamento
    window.addEventListener('resize', handleResize);

    // Remover listener ao desmontar componente
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Fechar sidebar automaticamente em visualização mobile ao trocar de página
  useEffect(() => {
    if (mobileView) {
      setSidebarOpen(false);
    }
  }, [pathname, mobileView]);

  // Ao carregar, verificar preferência do usuário para sidebar
  useEffect(() => {
    if (!mobileView && user?.preferences?.sidebarExpanded !== undefined) {
      setSidebarOpen(user.preferences.sidebarExpanded);
    }
  }, [user, mobileView]);

  // Alternar sidebar
  const handleSidebarToggle = () => {
    setSidebarOpen(prev => !prev);
  };

  // Fechar sidebar (para mobile)
  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  // Navegação padrão caso não seja fornecida via props
  const defaultNavigationGroups: NavigationGroup[] = [
    {
      id: 'principal',
      title: 'Principal',
      items: [
        {
          id: 'dashboard',
          label: 'Dashboard',
          icon: 'dashboard',
          path: '/dashboard',
        },
        {
          id: 'perfil',
          label: 'Perfil',
          icon: 'person',
          path: '/perfil',
        },
      ],
    },
  ];

  // Utiliza a navegação fornecida via props ou a navegação padrão
  const navigationGroups = propNavigationGroups || defaultNavigationGroups;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Skip Link para acessibilidade */}
      <SkipLink targetId="main-content" label="Pular para o conteúdo principal" />

      {/* Header Bar */}
      <HeaderBar onSidebarToggle={handleSidebarToggle} title={getCurrentPageTitle(pathname)} />

      {/* Conteúdo principal com sidebar */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          open={sidebarOpen}
          onClose={handleSidebarClose}
          onToggle={handleSidebarToggle}
          navigationGroups={navigationGroups}
        />

        {/* Overlay para mobile quando sidebar está aberta */}
        {sidebarOpen && mobileView && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
            onClick={handleSidebarClose}
            aria-hidden="true"
          ></div>
        )}

        {/* Conteúdo principal */}
        <main
          id="main-content"
          className={`flex-1 overflow-y-auto transition-all duration-200 ease-in-out p-4 md:p-6
            ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'}
          `}
          tabIndex={-1} // Permite foco para skip link
        >
          {children}
        </main>
      </div>
    </div>
  );
}

// Função auxiliar para obter o título da página atual
function getCurrentPageTitle(pathname: string | null): string {
  if (!pathname) return 'Dashboard';

  const routeTitles: Record<string, string> = {
    '/dashboard': 'Dashboard',
    '/estudantes': 'Estudantes',
    '/intervencoes': 'Intervenções',
    '/avaliacoes': 'Avaliações',
    '/relatorios': 'Relatórios',
    '/progresso': 'Progresso',
    '/metas': 'Metas e Objetivos',
    '/reunioes': 'Reuniões',
    '/encaminhamentos': 'Encaminhamentos',
    '/mensagens': 'Mensagens',
    '/perfil': 'Perfil',
    '/preferencias': 'Preferências',
  };

  const title = routeTitles[pathname] || 'Dashboard';
  return title;
}
