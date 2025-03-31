'use client';

import React, { useEffect, useRef } from 'react';
import { NotificationCenterProps, Notification } from '@/types/layout';
import { X, Bell, Check, Trash, ExternalLink } from 'lucide-react';

// Dados mockados para exemplo
const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'Nova intervenção atribuída',
    message: 'Você foi designado para acompanhar a intervenção de leitura para João Silva.',
    type: 'info',
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 minutos atrás
    link: '/intervencoes/123',
    category: 'intervencoes',
    sender: {
      id: '101',
      name: 'Maria Coordenadora',
      avatar: '/avatars/maria.jpg',
    },
    actions: [
      {
        label: 'Ver detalhes',
        action: 'view',
      },
    ],
  },
  {
    id: '2',
    title: 'Reunião RTI agendada',
    message: 'Reunião para discussão do Tier 3 agendada para amanhã às 14h.',
    type: 'success',
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 horas atrás
    link: '/reunioes/456',
    category: 'reunioes',
    actions: [
      {
        label: 'Confirmar presença',
        action: 'confirm',
      },
      {
        label: 'Recusar',
        action: 'decline',
      },
    ],
  },
  {
    id: '3',
    title: 'Alerta de progresso',
    message: 'Pedro Alves não atingiu a meta estabelecida para o período.',
    type: 'warning',
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 dia atrás
    link: '/alunos/789/progresso',
    category: 'alunos',
    sender: {
      id: '102',
      name: 'Sistema',
    },
  },
  {
    id: '4',
    title: 'Erro na sincronização de dados',
    message: 'Não foi possível sincronizar os dados com o sistema externo.',
    type: 'error',
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 dias atrás
    category: 'sistema',
  },
];

export default function NotificationCenter({
  open,
  onClose,
  onMarkAllAsRead,
  onClearAll,
}: NotificationCenterProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Fechar quando pressionar ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (open) {
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onClose]);

  // Fechar quando clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open, onClose]);

  // Agrupar notificações por data
  const groupNotificationsByDate = (notifications: Notification[]) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const thisWeek = new Date(today);
    thisWeek.setDate(thisWeek.getDate() - 7);

    const groups: Record<string, Notification[]> = {
      Hoje: [],
      Ontem: [],
      'Esta semana': [],
      Anteriores: [],
    };

    notifications.forEach(notification => {
      const date = new Date(notification.createdAt);
      date.setHours(0, 0, 0, 0);

      if (date.getTime() === today.getTime()) {
        groups['Hoje'].push(notification);
      } else if (date.getTime() === yesterday.getTime()) {
        groups['Ontem'].push(notification);
      } else if (date > thisWeek) {
        groups['Esta semana'].push(notification);
      } else {
        groups['Anteriores'].push(notification);
      }
    });

    return groups;
  };

  const groupedNotifications = groupNotificationsByDate(mockNotifications);

  // Formatar hora da notificação
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  // Marcar uma notificação como lida
  const handleMarkAsRead = (id: string) => {
    console.log('Marcando notificação como lida:', id);
    // Implementação real atualizaria o estado e faria uma chamada à API
  };

  // Excluir uma notificação
  const handleDelete = (id: string) => {
    console.log('Excluindo notificação:', id);
    // Implementação real atualizaria o estado e faria uma chamada à API
  };

  // Executar ação da notificação
  const handleAction = (notificationId: string, action: string) => {
    console.log(`Executando ação ${action} na notificação ${notificationId}`);
    // Implementação real executaria a ação específica
  };

  // Se não estiver aberto, não renderizar nada
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden"
      aria-labelledby="notification-center-title"
      role="dialog"
      aria-modal="true"
    >
      {/* Overlay semi-transparente */}
      <div className="absolute inset-0 bg-gray-500 bg-opacity-25" aria-hidden="true" />

      {/* Container centralizado */}
      <div className="fixed inset-y-0 right-0 max-w-sm w-full flex">
        {/* Painel de notificações */}
        <div
          ref={containerRef}
          className="relative w-full h-full bg-white dark:bg-gray-800 shadow-xl flex flex-col overflow-y-auto"
        >
          {/* Cabeçalho */}
          <div className="sticky top-0 z-10 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center">
              <Bell className="h-5 w-5 text-primary-600 dark:text-primary-400" aria-hidden="true" />
              <h2
                id="notification-center-title"
                className="ml-2 text-lg font-medium text-gray-900 dark:text-white"
              >
                Notificações
              </h2>
              <span className="ml-2 py-0.5 px-2 bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 text-xs rounded-full">
                {mockNotifications.filter(n => !n.read).length}
              </span>
            </div>

            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-md"
              aria-label="Fechar painel de notificações"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Ações */}
          <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700 flex space-x-2 text-sm">
            <button
              onClick={onMarkAllAsRead}
              className="flex items-center text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded px-2 py-1"
              aria-label="Marcar todas como lidas"
            >
              <Check className="h-4 w-4 mr-1" />
              Marcar tudo como lido
            </button>

            <button
              onClick={onClearAll}
              className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded px-2 py-1"
              aria-label="Limpar todas notificações"
            >
              <Trash className="h-4 w-4 mr-1" />
              Limpar tudo
            </button>
          </div>

          {/* Lista de notificações */}
          <div className="flex-1 overflow-y-auto">
            {Object.entries(groupedNotifications).map(
              ([date, notifications]) =>
                notifications.length > 0 && (
                  <div key={date} className="py-2">
                    <h3 className="px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                      {date}
                    </h3>

                    <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                      {notifications.map(notification => (
                        <li
                          key={notification.id}
                          className={`px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors
                          ${notification.read ? '' : 'bg-blue-50 dark:bg-blue-900/20'}
                        `}
                        >
                          <div className="flex items-start">
                            {/* Indicador de tipo */}
                            <div className="flex-shrink-0 mt-0.5">
                              <span
                                className={`inline-block h-2 w-2 rounded-full
                                ${notification.type === 'info' ? 'bg-blue-500' : ''}
                                ${notification.type === 'success' ? 'bg-green-500' : ''}
                                ${notification.type === 'warning' ? 'bg-yellow-500' : ''}
                                ${notification.type === 'error' ? 'bg-red-500' : ''}
                              `}
                                aria-hidden="true"
                              />
                            </div>

                            {/* Conteúdo da notificação */}
                            <div className="ml-3 flex-1">
                              <div className="flex justify-between items-baseline">
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                  {notification.title}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  {formatTime(notification.createdAt)}
                                </p>
                              </div>

                              <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                                {notification.message}
                              </p>

                              {/* Ações da notificação */}
                              {notification.actions && notification.actions.length > 0 && (
                                <div className="mt-2 flex space-x-2">
                                  {notification.actions.map(action => (
                                    <button
                                      key={action.action}
                                      className="text-xs px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
                                      onClick={() => handleAction(notification.id, action.action)}
                                    >
                                      {action.label}
                                    </button>
                                  ))}
                                </div>
                              )}

                              {/* Link da notificação */}
                              {notification.link && (
                                <a
                                  href={notification.link}
                                  className="mt-2 inline-flex items-center text-xs text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300 font-medium"
                                >
                                  Ver detalhes
                                  <ExternalLink className="ml-1 h-3 w-3" aria-hidden="true" />
                                </a>
                              )}
                            </div>

                            {/* Ações de gerenciamento */}
                            <div className="ml-3 flex-shrink-0 flex">
                              {!notification.read && (
                                <button
                                  onClick={() => handleMarkAsRead(notification.id)}
                                  className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-full p-1"
                                  aria-label="Marcar como lida"
                                >
                                  <Check className="h-4 w-4" />
                                </button>
                              )}

                              <button
                                onClick={() => handleDelete(notification.id)}
                                className="ml-2 text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-full p-1"
                                aria-label="Excluir notificação"
                              >
                                <Trash className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )
            )}

            {/* Estado vazio */}
            {mockNotifications.length === 0 && (
              <div className="py-8 text-center">
                <Bell
                  className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600"
                  aria-hidden="true"
                />
                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                  Sem notificações
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Você não tem notificações no momento.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
