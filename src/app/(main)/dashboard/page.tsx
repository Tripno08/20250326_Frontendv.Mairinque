'use client';

import React, { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  FileText,
  Calendar,
  TrendingUp,
  Flag,
  AlertCircle,
  Filter,
  RefreshCw,
  ChevronDown,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function DashboardPage() {
  const { user } = useAuth();
  const [activeFilter, setActiveFilter] = useState<string>('week');
  const [dashboardRefreshing, setDashboardRefreshing] = useState(false);

  // Função para alternar o filtro de periodo
  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    // Aqui seria implementada a lógica para atualizar os dados com base no filtro
  };

  // Função para atualizar dados do dashboard
  const handleRefresh = () => {
    setDashboardRefreshing(true);
    // Simulando uma atualização
    setTimeout(() => {
      setDashboardRefreshing(false);
    }, 1000);
  };

  // Dados simulados para KPIs
  const dashboardKpis = [
    {
      id: 'students',
      title: 'Estudantes',
      value: 126,
      change: 5.2,
      changeType: 'positive',
      icon: <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />,
      color: 'bg-blue-50 dark:bg-blue-900/20',
    },
    {
      id: 'interventions',
      title: 'Intervenções Ativas',
      value: 42,
      change: -2.3,
      changeType: 'negative',
      icon: <FileText className="h-6 w-6 text-green-600 dark:text-green-400" />,
      color: 'bg-green-50 dark:bg-green-900/20',
    },
    {
      id: 'assessments',
      title: 'Avaliações Pendentes',
      value: 18,
      change: 0,
      changeType: 'neutral',
      icon: <BookOpen className="h-6 w-6 text-orange-600 dark:text-orange-400" />,
      color: 'bg-orange-50 dark:bg-orange-900/20',
    },
    {
      id: 'meetings',
      title: 'Reuniões Agendadas',
      value: 7,
      change: 16.7,
      changeType: 'positive',
      icon: <Calendar className="h-6 w-6 text-purple-600 dark:text-purple-400" />,
      color: 'bg-purple-50 dark:bg-purple-900/20',
    },
  ];

  // Distribuição por tier
  const tierDistribution = [
    { tier: 1, percentage: 65, color: 'bg-green-500' },
    { tier: 2, percentage: 25, color: 'bg-yellow-500' },
    { tier: 3, percentage: 10, color: 'bg-red-500' },
  ];

  // Próximas tarefas
  const upcomingTasks = [
    {
      id: '1',
      title: 'Reunião RTI - Tier 3',
      dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2),
      priority: 'high',
      type: 'meeting',
    },
    {
      id: '2',
      title: 'Avaliação de progresso - João Silva',
      dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3),
      priority: 'medium',
      type: 'assessment',
    },
    {
      id: '3',
      title: 'Intervenção de leitura - Grupo A',
      dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 1),
      priority: 'high',
      type: 'intervention',
    },
    {
      id: '4',
      title: 'Relatório de progresso mensal',
      dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      priority: 'low',
      type: 'report',
    },
  ];

  // Alunos em risco
  const studentsAtRisk = [
    {
      id: '1',
      name: 'Pedro Alves',
      grade: '7º Ano B',
      risk: 'high',
      area: 'Matemática',
      trend: 'decreasing',
    },
    {
      id: '2',
      name: 'Maria Silva',
      grade: '5º Ano A',
      risk: 'medium',
      area: 'Leitura',
      trend: 'stable',
    },
    {
      id: '3',
      name: 'João Santos',
      grade: '9º Ano C',
      risk: 'high',
      area: 'Comportamento',
      trend: 'decreasing',
    },
  ];

  // Formato de data
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
    });
  };

  // Função para obter o ícone da tarefa
  const getTaskIcon = (type: string) => {
    switch (type) {
      case 'meeting':
        return <Calendar className="h-4 w-4" />;
      case 'assessment':
        return <BookOpen className="h-4 w-4" />;
      case 'intervention':
        return <FileText className="h-4 w-4" />;
      case 'report':
        return <LayoutDashboard className="h-4 w-4" />;
      default:
        return <Flag className="h-4 w-4" />;
    }
  };

  // Função para obter a cor da prioridade
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 dark:text-red-400';
      case 'medium':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'low':
        return 'text-green-600 dark:text-green-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  // Função para obter a cor do risco
  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  // Função para obter o ícone e cor da tendência
  const getTrendIndicator = (trend: string) => {
    switch (trend) {
      case 'increasing':
        return {
          icon: <TrendingUp className="h-4 w-4 text-green-500" />,
          label: 'Melhorando',
          color: 'text-green-600 dark:text-green-400',
        };
      case 'decreasing':
        return {
          icon: <TrendingUp className="h-4 w-4 text-red-500 transform rotate-180" />,
          label: 'Piorando',
          color: 'text-red-600 dark:text-red-400',
        };
      case 'stable':
        return {
          icon: <TrendingUp className="h-4 w-4 text-yellow-500 transform rotate-90" />,
          label: 'Estável',
          color: 'text-yellow-600 dark:text-yellow-400',
        };
      default:
        return {
          icon: null,
          label: 'Desconhecido',
          color: 'text-gray-600 dark:text-gray-400',
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Saudação e filtros */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Olá, {user?.name?.split(' ')[0] || 'Visitante'}
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Bem-vindo ao seu dashboard. Aqui está seu resumo diário.
          </p>
        </div>

        <div className="mt-4 sm:mt-0 flex items-center space-x-2">
          <div className="relative inline-block">
            <button
              type="button"
              className="flex items-center space-x-1 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
              aria-expanded="true"
              aria-haspopup="true"
            >
              <Filter className="h-4 w-4" />
              <span>
                {activeFilter === 'day' && 'Hoje'}
                {activeFilter === 'week' && 'Esta semana'}
                {activeFilter === 'month' && 'Este mês'}
                {activeFilter === 'quarter' && 'Este trimestre'}
              </span>
              <ChevronDown className="h-4 w-4" />
            </button>

            {/* Popover para filtros (normalmente seria controlado com estado) */}
            <div className="hidden origin-top-right absolute right-0 mt-2 w-36 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
              <div className="py-1">
                {['day', 'week', 'month', 'quarter'].map(filter => (
                  <button
                    key={filter}
                    className={`block w-full text-left px-4 py-2 text-sm ${
                      activeFilter === filter
                        ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                    onClick={() => handleFilterChange(filter)}
                  >
                    {filter === 'day' && 'Hoje'}
                    {filter === 'week' && 'Esta semana'}
                    {filter === 'month' && 'Este mês'}
                    {filter === 'quarter' && 'Este trimestre'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            type="button"
            className={`p-2 rounded-md ${
              dashboardRefreshing
                ? 'text-primary-500 animate-spin'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
            onClick={handleRefresh}
            aria-label="Atualizar dashboard"
            disabled={dashboardRefreshing}
          >
            <RefreshCw className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {dashboardKpis.map(kpi => (
          <div
            key={kpi.id}
            className={`${kpi.color} border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm`}
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">{kpi.icon}</div>
              <div className="ml-4">
                <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {kpi.title}
                </h2>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{kpi.value}</p>

                {kpi.change !== 0 && (
                  <p
                    className={`text-xs ${
                      kpi.changeType === 'positive'
                        ? 'text-green-600 dark:text-green-400'
                        : kpi.changeType === 'negative'
                          ? 'text-red-600 dark:text-red-400'
                          : 'text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    {kpi.change > 0 ? '+' : ''}
                    {kpi.change}% em relação ao período anterior
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Segunda linha */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Distribuição por tier */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Distribuição por Tier
          </h2>

          <div className="space-y-4">
            {tierDistribution.map(tier => (
              <div key={tier.tier} className="space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`h-3 w-3 rounded-full ${tier.color} mr-2`}></div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Tier {tier.tier}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {tier.percentage}%
                  </span>
                </div>

                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className={`${tier.color} h-2 rounded-full`}
                    style={{ width: `${tier.percentage}%` }}
                    role="progressbar"
                    aria-valuenow={tier.percentage}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`Tier ${tier.tier}: ${tier.percentage}%`}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-2 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              <strong>Tier 1:</strong> 65% dos estudantes respondem bem à instrução geral.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              <strong>Tier 2:</strong> 25% precisam de intervenções adicionais moderadas.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              <strong>Tier 3:</strong> 10% requerem intervenções intensivas e individualizadas.
            </p>
          </div>
        </div>

        {/* Próximas tarefas */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Próximas Tarefas
          </h2>

          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {upcomingTasks.map(task => (
              <li key={task.id} className="py-3">
                <div className="flex items-start">
                  <div
                    className={`flex-shrink-0 rounded-md p-2 ${
                      task.type === 'meeting'
                        ? 'bg-purple-100 dark:bg-purple-900/20'
                        : task.type === 'assessment'
                          ? 'bg-orange-100 dark:bg-orange-900/20'
                          : task.type === 'intervention'
                            ? 'bg-green-100 dark:bg-green-900/20'
                            : 'bg-blue-100 dark:bg-blue-900/20'
                    }`}
                  >
                    {getTaskIcon(task.type)}
                  </div>

                  <div className="ml-3 flex-1">
                    <div className="flex justify-between items-baseline">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {task.title}
                      </p>
                      <p className={`text-xs ${getPriorityColor(task.priority)}`}>
                        {task.priority === 'high'
                          ? 'Alta'
                          : task.priority === 'medium'
                            ? 'Média'
                            : 'Baixa'}
                      </p>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Data: {formatDate(task.dueDate)}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-4 text-center">
            <button className="text-sm text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300 font-medium">
              Ver todas as tarefas
            </button>
          </div>
        </div>

        {/* Alunos em risco */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm">
          <div className="flex items-center mb-4">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">Alunos em Risco</h2>
          </div>

          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {studentsAtRisk.map(student => {
              const trend = getTrendIndicator(student.trend);

              return (
                <li key={student.id} className="py-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {student.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {student.grade} • {student.area}
                      </p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRiskColor(student.risk)}`}
                      >
                        {student.risk === 'high'
                          ? 'Alto'
                          : student.risk === 'medium'
                            ? 'Médio'
                            : 'Baixo'}
                      </span>

                      <div className="flex items-center" title={trend.label}>
                        {trend.icon}
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="mt-4 text-center">
            <button className="text-sm text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300 font-medium">
              Ver todos os alertas
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
