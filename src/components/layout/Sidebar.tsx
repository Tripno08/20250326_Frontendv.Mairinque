'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SidebarProps, NavigationGroup, NavigationItem } from '@/types/layout';
import {
  ChevronDown,
  ChevronRight,
  LayoutDashboard,
  Users,
  FileSpreadsheet,
  GraduationCap,
  BarChart,
  TrendingUp,
  Flag,
  Users2,
  Mail,
  MessageSquare,
  User,
  Settings,
  Menu,
  X,
} from 'lucide-react';

export default function Sidebar({ open, onClose, onToggle, navigationGroups }: SidebarProps) {
  const pathname = usePathname();
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

  // Função para alternar grupo expandido/colapsado
  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupId]: !prev[groupId],
    }));
  };

  // Função para obter o ícone correto com base no nome
  const getIcon = (iconName?: string) => {
    switch (iconName) {
      case 'dashboard':
        return <LayoutDashboard size={20} />;
      case 'people':
        return <Users size={20} />;
      case 'assignment':
        return <FileSpreadsheet size={20} />;
      case 'assessment':
        return <GraduationCap size={20} />;
      case 'bar_chart':
        return <BarChart size={20} />;
      case 'trending_up':
        return <TrendingUp size={20} />;
      case 'flag':
        return <Flag size={20} />;
      case 'groups':
        return <Users2 size={20} />;
      case 'forward_to_inbox':
        return <Mail size={20} />;
      case 'chat':
        return <MessageSquare size={20} />;
      case 'person':
        return <User size={20} />;
      case 'settings':
        return <Settings size={20} />;
      default:
        return <LayoutDashboard size={20} />;
    }
  };

  // Função para renderizar um item de navegação
  const renderNavItem = (item: NavigationItem, isCompact: boolean) => {
    const isActive = pathname === item.path;

    return (
      <li key={item.id} className="my-1">
        <Link
          href={item.path || '#'}
          className={`
            flex items-center py-2 px-3 rounded-md transition-colors
            ${
              isActive
                ? 'bg-primary-100 text-primary-900 dark:bg-primary-900 dark:text-primary-100'
                : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
            }
            ${isCompact ? 'justify-center' : 'justify-between'}
          `}
          aria-current={isActive ? 'page' : undefined}
        >
          <div className="flex items-center">
            <span className={`${isCompact ? '' : 'mr-3'}`} aria-hidden="true">
              {getIcon(item.icon)}
            </span>
            {!isCompact && <span>{item.label}</span>}
          </div>

          {!isCompact && item.badge && (
            <span
              className={`
              text-xs px-1.5 py-0.5 rounded-full
              ${item.badge.color === 'primary' ? 'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200' : ''}
              ${item.badge.color === 'error' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' : ''}
              ${item.badge.color === 'warning' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' : ''}
              ${item.badge.color === 'success' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : ''}
              ${item.badge.color === 'info' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' : ''}
            `}
            >
              {item.badge.content}
            </span>
          )}
        </Link>
      </li>
    );
  };

  // Função para renderizar um grupo de navegação
  const renderNavGroup = (group: NavigationGroup, isCompact: boolean) => {
    const isExpanded = expandedGroups[group.id] ?? true;

    return (
      <div key={group.id} className="mb-6">
        {!isCompact && (
          <button
            className="flex items-center justify-between w-full text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 px-3 py-2"
            onClick={() => toggleGroup(group.id)}
            aria-expanded={isExpanded}
            aria-controls={`nav-group-${group.id}`}
          >
            <span>{group.title}</span>
            <span className="ml-1">
              {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </span>
          </button>
        )}

        {(isCompact || isExpanded) && (
          <ul id={`nav-group-${group.id}`} className={`${isCompact ? 'space-y-1' : 'mt-1'}`}>
            {group.items.map(item => renderNavItem(item, isCompact))}
          </ul>
        )}
      </div>
    );
  };

  // Classes para o sidebar em diferentes estados
  const sidebarClasses = `
    h-screen overflow-y-auto fixed top-0 left-0 pt-16 pb-4 z-30
    transition-all duration-300 ease-in-out
    bg-white border-r border-gray-200
    dark:bg-gray-800 dark:border-gray-700
    ${open ? 'w-64 translate-x-0' : 'w-20 translate-x-0'}
    lg:translate-x-0
    ${!open ? 'sm:-translate-x-full lg:translate-x-0' : ''}
  `;

  // Botão para fechar o sidebar (mobile)
  const closeButton = (
    <button
      onClick={onClose}
      className="lg:hidden absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
      aria-label="Fechar menu de navegação"
    >
      <X size={24} />
    </button>
  );

  // Botão para expandir/colapsar o sidebar (desktop)
  const toggleButton = (
    <button
      onClick={onToggle}
      className="hidden lg:flex absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
      aria-label={open ? 'Colapsar menu de navegação' : 'Expandir menu de navegação'}
    >
      {open ? <X size={18} /> : <Menu size={18} />}
    </button>
  );

  return (
    <nav className={sidebarClasses} aria-label="Menu de navegação principal">
      {closeButton}
      {toggleButton}

      <div className="px-2 mt-4">{navigationGroups.map(group => renderNavGroup(group, !open))}</div>
    </nav>
  );
}
