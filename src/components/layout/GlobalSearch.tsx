'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { GlobalSearchProps, SearchResult } from '@/types/layout';
import {
  Search,
  X,
  LayoutDashboard,
  Users,
  FileText,
  BookOpen,
  Calendar,
  User,
  ChevronRight,
} from 'lucide-react';

export default function GlobalSearch({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Exemplo de resultados simulados para demonstração
  const mockResults: Record<string, SearchResult[]> = {
    dashboard: [
      {
        id: '1',
        title: 'Dashboard Principal',
        description: 'Visualização geral do sistema',
        type: 'page',
        url: '/dashboard',
        icon: 'dashboard',
      },
    ],
    alunos: [
      {
        id: '2',
        title: 'Lista de Alunos',
        description: 'Gerenciamento de alunos',
        type: 'page',
        url: '/estudantes',
        icon: 'student',
      },
      {
        id: '3',
        title: 'João Silva',
        description: 'Aluno - 7º Ano B',
        type: 'student',
        url: '/estudantes/3',
        icon: 'student',
      },
      {
        id: '4',
        title: 'Maria Almeida',
        description: 'Aluna - 5º Ano A',
        type: 'student',
        url: '/estudantes/4',
        icon: 'student',
      },
    ],
    intervenções: [
      {
        id: '5',
        title: 'Intervenções Ativas',
        description: 'Lista de intervenções em andamento',
        type: 'page',
        url: '/intervencoes',
        icon: 'intervention',
      },
      {
        id: '6',
        title: 'Intervenção de Leitura - Nível 2',
        description: 'Intervenção para João Silva',
        type: 'intervention',
        url: '/intervencoes/6',
        icon: 'intervention',
      },
    ],
    avaliações: [
      {
        id: '7',
        title: 'Avaliações Recentes',
        description: 'Últimas avaliações realizadas',
        type: 'page',
        url: '/avaliacoes',
        icon: 'assessment',
      },
    ],
    reuniões: [
      {
        id: '8',
        title: 'Calendário de Reuniões',
        description: 'Agenda de próximas reuniões',
        type: 'page',
        url: '/reunioes',
        icon: 'meeting',
      },
      {
        id: '9',
        title: 'Reunião RTI - Nível 3',
        description: 'Discussão de intervenções de nível 3',
        type: 'meeting',
        url: '/reunioes/9',
        icon: 'meeting',
      },
    ],
  };

  // Focar no input de pesquisa ao abrir
  useEffect(() => {
    searchInputRef.current?.focus();
  }, []);

  // Evento para fechar com ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prevIndex => (prevIndex < results.length - 1 ? prevIndex + 1 : prevIndex));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prevIndex => (prevIndex > 0 ? prevIndex - 1 : 0));
      } else if (e.key === 'Enter' && results.length > 0 && selectedIndex >= 0) {
        e.preventDefault();
        handleResultClick(results[selectedIndex]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, results, selectedIndex]);

  // Fechar quando clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  // Simular pesquisa (substituir por chamada real à API)
  useEffect(() => {
    const searchQuery = query.trim().toLowerCase();

    if (searchQuery.length < 2) {
      setResults([]);
      return;
    }

    setLoading(true);

    // Simulando delay de pesquisa
    const timeoutId = setTimeout(() => {
      const allResults: SearchResult[] = [];

      // Procurar em todas as categorias
      Object.keys(mockResults).forEach(key => {
        if (key.includes(searchQuery)) {
          allResults.push(...mockResults[key]);
        }
      });

      // Filtrar resultados individuais
      const filteredResults = allResults.filter(
        result =>
          result.title.toLowerCase().includes(searchQuery) ||
          (result.description && result.description.toLowerCase().includes(searchQuery))
      );

      // Ordenar resultados (título > tipo > descrição)
      const sortedResults = filteredResults.sort((a, b) => {
        const aTitle = a.title.toLowerCase();
        const bTitle = b.title.toLowerCase();

        if (aTitle.startsWith(searchQuery) && !bTitle.startsWith(searchQuery)) return -1;
        if (!aTitle.startsWith(searchQuery) && bTitle.startsWith(searchQuery)) return 1;

        if (a.type === 'page' && b.type !== 'page') return -1;
        if (a.type !== 'page' && b.type === 'page') return 1;

        return aTitle.localeCompare(bTitle);
      });

      setResults(sortedResults);
      setSelectedIndex(sortedResults.length > 0 ? 0 : -1);
      setLoading(false);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  // Navegar ao clicar em um resultado
  const handleResultClick = (result: SearchResult) => {
    router.push(result.url);
    onClose();
  };

  // Obter ícone baseado no tipo
  const getIconForType = (result: SearchResult) => {
    switch (result.icon || result.type) {
      case 'dashboard':
        return <LayoutDashboard className="h-5 w-5 text-primary-600 dark:text-primary-400" />;
      case 'student':
        return <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />;
      case 'intervention':
        return <FileText className="h-5 w-5 text-green-600 dark:text-green-400" />;
      case 'assessment':
        return <BookOpen className="h-5 w-5 text-orange-600 dark:text-orange-400" />;
      case 'meeting':
        return <Calendar className="h-5 w-5 text-purple-600 dark:text-purple-400" />;
      default:
        return <User className="h-5 w-5 text-gray-600 dark:text-gray-400" />;
    }
  };

  return (
    <div
      className="fixed inset-0 bg-gray-900 bg-opacity-50 z-50 flex items-start justify-center pt-16 sm:pt-24"
      aria-modal="true"
      role="dialog"
      aria-labelledby="search-modal-title"
    >
      <div
        ref={searchContainerRef}
        className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-lg shadow-xl mx-4 overflow-hidden"
      >
        {/* Cabeçalho de pesquisa */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center">
          <Search className="h-5 w-5 text-gray-400 dark:text-gray-500 mr-3" aria-hidden="true" />

          <input
            ref={searchInputRef}
            type="search"
            id="global-search"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Pesquisar em tudo..."
            className="flex-1 bg-transparent border-0 outline-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-base"
            aria-labelledby="search-modal-title"
            aria-describedby="search-description"
          />

          <button
            onClick={onClose}
            className="ml-2 text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
            aria-label="Fechar pesquisa"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div id="search-modal-title" className="sr-only">
          Pesquisa global
        </div>
        <div id="search-description" className="sr-only">
          Use setas para navegar, Enter para selecionar, e Escape para fechar.
        </div>

        {/* Resultados da pesquisa */}
        <div className="max-h-96 overflow-y-auto py-2">
          {loading && (
            <div className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
              <div className="animate-spin inline-block h-6 w-6 border-t-2 border-b-2 border-primary-500 rounded-full mr-2" />
              <span>Pesquisando...</span>
            </div>
          )}

          {!loading && query.length >= 2 && results.length === 0 && (
            <div className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
              Nenhum resultado encontrado para "{query}"
            </div>
          )}

          {!loading && results.length > 0 && (
            <ul role="listbox" aria-label="Resultados da pesquisa">
              {results.map((result, index) => (
                <li
                  key={result.id}
                  role="option"
                  aria-selected={selectedIndex === index}
                  className={`
                    px-4 py-3 cursor-pointer flex items-center hover:bg-gray-100 dark:hover:bg-gray-700
                    ${selectedIndex === index ? 'bg-gray-100 dark:bg-gray-700' : ''}
                  `}
                  onClick={() => handleResultClick(result)}
                  onMouseEnter={() => setSelectedIndex(index)}
                >
                  <div className="mr-4">{getIconForType(result)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {result.title}
                      </h3>
                      <span className="ml-2 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded-full capitalize">
                        {result.type}
                      </span>
                    </div>
                    {result.description && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-1">
                        {result.description}
                      </p>
                    )}
                  </div>
                  <ChevronRight
                    className="h-4 w-4 text-gray-400 dark:text-gray-500 ml-2"
                    aria-hidden="true"
                  />
                </li>
              ))}
            </ul>
          )}

          {!loading && query.length < 2 && (
            <div className="px-4 py-4">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                Sugestões de pesquisa:
              </p>
              <div className="flex flex-wrap gap-2">
                {['dashboard', 'alunos', 'intervenções', 'avaliações', 'reuniões'].map(
                  suggestion => (
                    <button
                      key={suggestion}
                      className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600"
                      onClick={() => setQuery(suggestion)}
                    >
                      {suggestion}
                    </button>
                  )
                )}
              </div>
            </div>
          )}
        </div>

        {/* Rodapé com atalhos */}
        <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center justify-between">
            <div className="hidden sm:flex items-center space-x-4">
              <span className="flex items-center">
                <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded">
                  ↑
                </kbd>
                <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded ml-1">
                  ↓
                </kbd>
                <span className="ml-1">navegar</span>
              </span>
              <span className="flex items-center">
                <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded">
                  Enter
                </kbd>
                <span className="ml-1">selecionar</span>
              </span>
              <span className="flex items-center">
                <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded">
                  Esc
                </kbd>
                <span className="ml-1">fechar</span>
              </span>
            </div>
            <div>
              <span>Mostrando {results.length} resultados</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
