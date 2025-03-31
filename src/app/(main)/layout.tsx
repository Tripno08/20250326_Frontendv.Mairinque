'use client';

import { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { NavigationGroup } from '@/types/layout';
import { AuthProvider } from '@/contexts/AuthContext';

export default function MainAppLayout({ children }: { children: React.ReactNode }) {
  // Definição dos itens de navegação
  const navigationGroups: NavigationGroup[] = [
    {
      id: 'main',
      title: 'Principal',
      items: [
        {
          id: 'dashboard',
          label: 'Dashboard',
          path: '/dashboard',
          icon: 'dashboard',
        },
        {
          id: 'perfil',
          label: 'Meu Perfil',
          path: '/perfil',
          icon: 'person',
        },
      ],
    },
    {
      id: 'mtss',
      title: 'RTI/MTSS',
      items: [
        {
          id: 'students',
          label: 'Alunos',
          path: '/students',
          icon: 'people',
          badge: { content: '120', color: 'primary' },
        },
        {
          id: 'interventions',
          label: 'Intervenções',
          path: '/interventions',
          icon: 'assignment',
          badge: { content: '15', color: 'warning' },
        },
        {
          id: 'assessments',
          label: 'Avaliações',
          path: '/assessments',
          icon: 'assessment',
        },
        {
          id: 'progress',
          label: 'Progresso',
          path: '/progress',
          icon: 'trending_up',
        },
      ],
    },
    {
      id: 'management',
      title: 'Gestão',
      items: [
        {
          id: 'teams',
          label: 'Equipes',
          path: '/teams',
          icon: 'groups',
        },
        {
          id: 'goals',
          label: 'Metas SMART',
          path: '/goals',
          icon: 'flag',
        },
        {
          id: 'reports',
          label: 'Relatórios',
          path: '/reports',
          icon: 'bar_chart',
        },
      ],
    },
    {
      id: 'communication',
      title: 'Comunicação',
      items: [
        {
          id: 'messages',
          label: 'Mensagens',
          path: '/messages',
          icon: 'chat',
          badge: { content: '5', color: 'error' },
        },
        {
          id: 'referrals',
          label: 'Encaminhamentos',
          path: '/referrals',
          icon: 'forward_to_inbox',
        },
      ],
    },
    {
      id: 'system',
      title: 'Sistema',
      items: [
        {
          id: 'settings',
          label: 'Configurações',
          path: '/settings',
          icon: 'settings',
        },
      ],
    },
  ];

  return (
    <AuthProvider>
      <MainLayout navigationGroups={navigationGroups}>{children}</MainLayout>
    </AuthProvider>
  );
}
