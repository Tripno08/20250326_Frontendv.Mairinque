'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Eye, Move, Sun, Moon, Type, Maximize, Minimize, X, CheckSquare } from 'lucide-react';
import { AccessibilityPreferences } from '@/types/accessibility';

interface AccessibilityMenuProps {
  open: boolean;
  onClose: () => void;
  preferences: AccessibilityPreferences;
  onPreferencesChange: (preferences: Partial<AccessibilityPreferences>) => void;
}

/**
 * Menu de configurações de acessibilidade
 * Permite controlar preferências como tema, tamanho de fonte, redução de movimento, etc.
 */
export default function AccessibilityMenu({
  open,
  onClose,
  preferences,
  onPreferencesChange,
}: AccessibilityMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<'visual' | 'motion' | 'text'>('visual');

  // Fechar o menu quando clicar fora
  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open, onClose]);

  // Fechar com ESC
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  // Renderizar o conteúdo da aba ativa
  const renderTabContent = () => {
    switch (activeTab) {
      case 'visual':
        return (
          <div className="space-y-6">
            {/* Tema */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Tema</h3>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  className={`flex items-center justify-center py-2 px-3 rounded-md border ${
                    preferences.theme === 'light'
                      ? 'bg-primary-50 dark:bg-primary-900/30 border-primary-300 dark:border-primary-700'
                      : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600'
                  }`}
                  onClick={() => onPreferencesChange({ theme: 'light' })}
                  aria-pressed={preferences.theme === 'light'}
                >
                  <Sun className="h-5 w-5 mr-2 text-amber-500" />
                  <span>Claro</span>
                </button>
                <button
                  type="button"
                  className={`flex items-center justify-center py-2 px-3 rounded-md border ${
                    preferences.theme === 'dark'
                      ? 'bg-primary-50 dark:bg-primary-900/30 border-primary-300 dark:border-primary-700'
                      : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600'
                  }`}
                  onClick={() => onPreferencesChange({ theme: 'dark' })}
                  aria-pressed={preferences.theme === 'dark'}
                >
                  <Moon className="h-5 w-5 mr-2 text-indigo-500" />
                  <span>Escuro</span>
                </button>
              </div>
            </div>

            {/* Alto contraste */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Eye className="h-5 w-5 text-gray-600 dark:text-gray-400 mr-2" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Alto contraste
                </span>
              </div>
              <button
                type="button"
                className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                  preferences.highContrast ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'
                }`}
                role="switch"
                aria-checked={preferences.highContrast}
                onClick={() => onPreferencesChange({ highContrast: !preferences.highContrast })}
              >
                <span
                  className={`${
                    preferences.highContrast ? 'translate-x-6' : 'translate-x-1'
                  } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                />
              </button>
            </div>

            {/* Reduzir transparência */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Maximize className="h-5 w-5 text-gray-600 dark:text-gray-400 mr-2" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Reduzir transparência
                </span>
              </div>
              <button
                type="button"
                className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                  preferences.reduceTransparency ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'
                }`}
                role="switch"
                aria-checked={preferences.reduceTransparency}
                onClick={() =>
                  onPreferencesChange({ reduceTransparency: !preferences.reduceTransparency })
                }
              >
                <span
                  className={`${
                    preferences.reduceTransparency ? 'translate-x-6' : 'translate-x-1'
                  } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                />
              </button>
            </div>
          </div>
        );

      case 'motion':
        return (
          <div className="space-y-6">
            {/* Reduzir movimento */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Move className="h-5 w-5 text-gray-600 dark:text-gray-400 mr-2" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Reduzir movimento
                </span>
              </div>
              <button
                type="button"
                className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                  preferences.reducedMotion ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'
                }`}
                role="switch"
                aria-checked={preferences.reducedMotion}
                onClick={() => onPreferencesChange({ reducedMotion: !preferences.reducedMotion })}
              >
                <span
                  className={`${
                    preferences.reducedMotion ? 'translate-x-6' : 'translate-x-1'
                  } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                />
              </button>
            </div>

            {/* Autoplay de sons */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-600 dark:text-gray-400 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.536l-2.829-2.829m0 0a4 4 0 015.657-5.657l3.536 3.536m0 0l.708.707-5.657 5.657-3.536-3.536a4 4 0 015.657-5.657l3.535 3.535"
                  />
                </svg>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Autoplay de sons
                </span>
              </div>
              <button
                type="button"
                className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                  preferences.autoplaySounds ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'
                }`}
                role="switch"
                aria-checked={preferences.autoplaySounds}
                onClick={() => onPreferencesChange({ autoplaySounds: !preferences.autoplaySounds })}
              >
                <span
                  className={`${
                    preferences.autoplaySounds ? 'translate-x-6' : 'translate-x-1'
                  } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                />
              </button>
            </div>

            {/* Legendas */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-600 dark:text-gray-400 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Legendas em vídeos
                </span>
              </div>
              <button
                type="button"
                className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                  preferences.captionsEnabled ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'
                }`}
                role="switch"
                aria-checked={preferences.captionsEnabled}
                onClick={() =>
                  onPreferencesChange({ captionsEnabled: !preferences.captionsEnabled })
                }
              >
                <span
                  className={`${
                    preferences.captionsEnabled ? 'translate-x-6' : 'translate-x-1'
                  } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                />
              </button>
            </div>
          </div>
        );

      case 'text':
        return (
          <div className="space-y-6">
            {/* Tamanho da fonte */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                Tamanho da fonte
              </h3>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  className={`flex items-center justify-center py-2 px-3 rounded-md border ${
                    preferences.fontSize === 'default'
                      ? 'bg-primary-50 dark:bg-primary-900/30 border-primary-300 dark:border-primary-700'
                      : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600'
                  }`}
                  onClick={() => onPreferencesChange({ fontSize: 'default' })}
                  aria-pressed={preferences.fontSize === 'default'}
                >
                  <Type className="h-4 w-4 mr-1" />
                  <span>Padrão</span>
                </button>
                <button
                  type="button"
                  className={`flex items-center justify-center py-2 px-3 rounded-md border ${
                    preferences.fontSize === 'large'
                      ? 'bg-primary-50 dark:bg-primary-900/30 border-primary-300 dark:border-primary-700'
                      : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600'
                  }`}
                  onClick={() => onPreferencesChange({ fontSize: 'large' })}
                  aria-pressed={preferences.fontSize === 'large'}
                >
                  <Type className="h-5 w-5 mr-1" />
                  <span>Grande</span>
                </button>
                <button
                  type="button"
                  className={`flex items-center justify-center py-2 px-3 rounded-md border ${
                    preferences.fontSize === 'larger'
                      ? 'bg-primary-50 dark:bg-primary-900/30 border-primary-300 dark:border-primary-700'
                      : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600'
                  }`}
                  onClick={() => onPreferencesChange({ fontSize: 'larger' })}
                  aria-pressed={preferences.fontSize === 'larger'}
                >
                  <Type className="h-6 w-6 mr-1" />
                  <span>Maior</span>
                </button>
              </div>
            </div>

            {/* Espaçamento de linhas */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                Espaçamento entre linhas
              </h3>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  className={`flex items-center justify-center py-2 px-3 rounded-md border ${
                    preferences.lineSpacing === 'default'
                      ? 'bg-primary-50 dark:bg-primary-900/30 border-primary-300 dark:border-primary-700'
                      : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600'
                  }`}
                  onClick={() => onPreferencesChange({ lineSpacing: 'default' })}
                  aria-pressed={preferences.lineSpacing === 'default'}
                >
                  <span className="text-sm">Padrão</span>
                </button>
                <button
                  type="button"
                  className={`flex items-center justify-center py-2 px-3 rounded-md border ${
                    preferences.lineSpacing === 'wide'
                      ? 'bg-primary-50 dark:bg-primary-900/30 border-primary-300 dark:border-primary-700'
                      : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600'
                  }`}
                  onClick={() => onPreferencesChange({ lineSpacing: 'wide' })}
                  aria-pressed={preferences.lineSpacing === 'wide'}
                >
                  <span className="text-sm">Amplo</span>
                </button>
                <button
                  type="button"
                  className={`flex items-center justify-center py-2 px-3 rounded-md border ${
                    preferences.lineSpacing === 'wider'
                      ? 'bg-primary-50 dark:bg-primary-900/30 border-primary-300 dark:border-primary-700'
                      : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600'
                  }`}
                  onClick={() => onPreferencesChange({ lineSpacing: 'wider' })}
                  aria-pressed={preferences.lineSpacing === 'wider'}
                >
                  <span className="text-sm">Máximo</span>
                </button>
              </div>
            </div>

            {/* Leitor de tela otimizado */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <CheckSquare className="h-5 w-5 text-gray-600 dark:text-gray-400 mr-2" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Otimizado para leitor de tela
                </span>
              </div>
              <button
                type="button"
                className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                  preferences.screenReaderOptimized
                    ? 'bg-primary-600'
                    : 'bg-gray-200 dark:bg-gray-700'
                }`}
                role="switch"
                aria-checked={preferences.screenReaderOptimized}
                onClick={() =>
                  onPreferencesChange({ screenReaderOptimized: !preferences.screenReaderOptimized })
                }
              >
                <span
                  className={`${
                    preferences.screenReaderOptimized ? 'translate-x-6' : 'translate-x-1'
                  } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                />
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center bg-black bg-opacity-50">
      <div
        ref={menuRef}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="accessibility-menu-title"
      >
        {/* Cabeçalho */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h2
            id="accessibility-menu-title"
            className="text-lg font-medium text-gray-900 dark:text-white"
          >
            Configurações de Acessibilidade
          </h2>
          <button
            type="button"
            className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
            onClick={onClose}
            aria-label="Fechar menu de acessibilidade"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navegação por abas */}
        <div className="px-6 py-3 border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-4">
            <button
              type="button"
              className={`px-3 py-2 text-sm font-medium rounded-md ${
                activeTab === 'visual'
                  ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
              onClick={() => setActiveTab('visual')}
              aria-current={activeTab === 'visual' ? 'page' : undefined}
            >
              Visual
            </button>
            <button
              type="button"
              className={`px-3 py-2 text-sm font-medium rounded-md ${
                activeTab === 'motion'
                  ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
              onClick={() => setActiveTab('motion')}
              aria-current={activeTab === 'motion' ? 'page' : undefined}
            >
              Movimento
            </button>
            <button
              type="button"
              className={`px-3 py-2 text-sm font-medium rounded-md ${
                activeTab === 'text'
                  ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
              onClick={() => setActiveTab('text')}
              aria-current={activeTab === 'text' ? 'page' : undefined}
            >
              Texto
            </button>
          </nav>
        </div>

        {/* Conteúdo da aba ativa */}
        <div className="px-6 py-4">{renderTabContent()}</div>

        {/* Rodapé */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
          <button
            type="button"
            className="inline-flex justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            onClick={onClose}
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
