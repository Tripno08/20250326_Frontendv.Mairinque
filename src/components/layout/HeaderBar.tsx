'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { HeaderProps } from '@/types/layout';
import {
  Menu,
  Bell,
  Search,
  Sun,
  Moon,
  User,
  LogOut,
  Settings,
  Building,
  ChevronDown,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import NotificationCenter from '../notifications/NotificationCenter';
import GlobalSearch from './GlobalSearch';

export default function HeaderBar({ onSidebarToggle, title = 'Dashboard' }: HeaderProps) {
  const { user, logout, selectedInstitution, switchInstitution } = useAuth();

  // Estados para controles de UI
  const [darkMode, setDarkMode] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [institutionMenuOpen, setInstitutionMenuOpen] = useState(false);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  // Função para lidar com o clique em uma instituição
  const handleInstitutionChange = (institutionId: string) => {
    switchInstitution(institutionId);
    setInstitutionMenuOpen(false);
  };

  // Função para fazer logout
  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between px-4 py-2 h-16">
        {/* Botão do menu e logo */}
        <div className="flex items-center space-x-4">
          <button
            type="button"
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            onClick={onSidebarToggle}
            aria-label="Toggle menu"
          >
            <Menu className="h-6 w-6" />
          </button>

          <Link
            href="/dashboard"
            className="flex items-center focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-md"
          >
            <div className="relative h-8 w-8 mr-2">
              <Image
                src="/logo.svg"
                alt="Innerview Logo"
                fill
                className="object-contain"
                onError={e => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
            <span className="font-semibold text-xl text-gray-900 dark:text-white">Innerview</span>
          </Link>
        </div>

        {/* Título da página */}
        <div className="hidden md:block">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h1>
        </div>

        {/* Controles direitos */}
        <div className="flex items-center space-x-3">
          {/* Seletor de instituição */}
          {user?.institutions && user.institutions.length > 1 && (
            <div className="relative">
              <button
                type="button"
                className="flex items-center py-1 px-2 text-sm rounded-md border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                onClick={() => setInstitutionMenuOpen(!institutionMenuOpen)}
                aria-expanded={institutionMenuOpen}
                aria-haspopup="true"
                aria-label="Selecionar instituição"
              >
                <Building className="h-4 w-4 mr-1" />
                <span className="max-w-[150px] truncate">
                  {selectedInstitution?.name || 'Selecionar instituição'}
                </span>
                <ChevronDown className="h-4 w-4 ml-1" />
              </button>

              {institutionMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-50"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="institution-menu-button"
                >
                  <div className="py-1" role="none">
                    {user.institutions.map(institution => (
                      <button
                        key={institution.id}
                        className={`flex items-center w-full text-left px-4 py-2 text-sm ${
                          selectedInstitution?.id === institution.id
                            ? 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white'
                            : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                        }`}
                        onClick={() => handleInstitutionChange(institution.id)}
                        role="menuitem"
                      >
                        <Building className="h-4 w-4 mr-2" />
                        <span className="truncate">{institution.name}</span>
                        <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                          ({institution.role})
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Botão de pesquisa */}
          <button
            type="button"
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-full p-1"
            onClick={() => setSearchOpen(true)}
            aria-label="Pesquisar"
          >
            <Search className="h-5 w-5" />
          </button>

          {/* Botão de dark mode */}
          <button
            type="button"
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-full p-1"
            onClick={toggleDarkMode}
            aria-label={darkMode ? 'Ativar modo claro' : 'Ativar modo escuro'}
          >
            {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>

          {/* Botão de notificações */}
          <button
            type="button"
            className="relative text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-full p-1"
            onClick={() => setNotificationsOpen(true)}
            aria-label="Notificações"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-800" />
          </button>

          {/* Menu de perfil */}
          <div className="relative ml-2">
            <button
              type="button"
              className="flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-full"
              onClick={() => setProfileMenuOpen(!profileMenuOpen)}
              aria-expanded={profileMenuOpen}
              aria-haspopup="true"
              aria-label="Menu de perfil"
            >
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary-100 dark:bg-primary-900">
                <span className="text-primary-700 dark:text-primary-300 font-medium">
                  {user?.name?.charAt(0) || 'U'}
                </span>
              </div>
            </button>

            {profileMenuOpen && (
              <div
                className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-50"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="user-menu-button"
              >
                <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {user?.name || 'Usuário'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {user?.email || 'usuario@exemplo.com'}
                  </p>
                </div>

                <Link
                  href="/perfil"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                  role="menuitem"
                  onClick={() => setProfileMenuOpen(false)}
                >
                  <User className="h-4 w-4 mr-2" />
                  Meu Perfil
                </Link>

                <Link
                  href="/preferencias"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                  role="menuitem"
                  onClick={() => setProfileMenuOpen(false)}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Preferências
                </Link>

                <button
                  className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                  role="menuitem"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sair
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de pesquisa */}
      {searchOpen && <GlobalSearch onClose={() => setSearchOpen(false)} />}

      {/* Centro de notificações */}
      <NotificationCenter
        open={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
        onMarkAllAsRead={() => {
          /* Implementação real marcaria todas como lidas */
        }}
        onClearAll={() => {
          /* Implementação real limparia todas as notificações */
        }}
      />

      {/* Backdrop para fechar menus quando clicar fora */}
      {(profileMenuOpen || institutionMenuOpen) && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => {
            setProfileMenuOpen(false);
            setInstitutionMenuOpen(false);
          }}
          aria-hidden="true"
        />
      )}
    </header>
  );
}
