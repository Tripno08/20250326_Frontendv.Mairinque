import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ReferralDashboard from '../ReferralDashboard';
import { Referral, ReferralMetrics } from '../../../types/referral';

describe('ReferralDashboard', () => {
  const mockMetrics: ReferralMetrics = {
    total: 100,
    pending: 30,
    inProgress: 40,
    completed: 25,
    cancelled: 5,
    averageResolutionTime: 72, // horas
    priorityDistribution: {
      low: 20,
      medium: 40,
      high: 30,
      urgent: 10,
    },
    typeDistribution: {
      academic: 40,
      behavioral: 30,
      social: 20,
      administrative: 10,
    },
  };

  const mockRecentReferrals: Referral[] = [
    {
      id: '1',
      title: 'Encaminhamento Recente 1',
      description: 'Descrição do teste 1',
      type: 'academic',
      status: 'pending',
      priority: 'high',
      assignedTo: 'Usuário 1',
      createdBy: 'Admin',
      dueDate: new Date('2024-12-31'),
      attachments: [],
      comments: [],
      history: [],
      tags: ['teste', 'urgente'],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '2',
      title: 'Encaminhamento Recente 2',
      description: 'Descrição do teste 2',
      type: 'behavioral',
      status: 'in_progress',
      priority: 'medium',
      assignedTo: 'Usuário 2',
      createdBy: 'Admin',
      dueDate: new Date('2024-12-31'),
      attachments: [],
      comments: [],
      history: [],
      tags: ['teste'],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  const mockOnReferralSelect = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza as métricas gerais corretamente', () => {
    render(
      <ReferralDashboard
        metrics={mockMetrics}
        recentReferrals={mockRecentReferrals}
        onReferralSelect={mockOnReferralSelect}
      />
    );

    expect(screen.getByText('100')).toBeInTheDocument();
    expect(screen.getByText('25%')).toBeInTheDocument();
  });

  it('renderiza o tempo médio de resolução corretamente', () => {
    render(
      <ReferralDashboard
        metrics={mockMetrics}
        recentReferrals={mockRecentReferrals}
        onReferralSelect={mockOnReferralSelect}
      />
    );

    expect(screen.getByText('3 dias')).toBeInTheDocument();
  });

  it('renderiza a distribuição por prioridade corretamente', () => {
    render(
      <ReferralDashboard
        metrics={mockMetrics}
        recentReferrals={mockRecentReferrals}
        onReferralSelect={mockOnReferralSelect}
      />
    );

    expect(screen.getByText('Baixa')).toBeInTheDocument();
    expect(screen.getByText('Média')).toBeInTheDocument();
    expect(screen.getByText('Alta')).toBeInTheDocument();
    expect(screen.getByText('Urgente')).toBeInTheDocument();
  });

  it('renderiza a distribuição por tipo corretamente', () => {
    render(
      <ReferralDashboard
        metrics={mockMetrics}
        recentReferrals={mockRecentReferrals}
        onReferralSelect={mockOnReferralSelect}
      />
    );

    expect(screen.getByText('Acadêmico')).toBeInTheDocument();
    expect(screen.getByText('Comportamental')).toBeInTheDocument();
    expect(screen.getByText('Social')).toBeInTheDocument();
    expect(screen.getByText('Administrativo')).toBeInTheDocument();
  });

  it('renderiza os encaminhamentos recentes corretamente', () => {
    render(
      <ReferralDashboard
        metrics={mockMetrics}
        recentReferrals={mockRecentReferrals}
        onReferralSelect={mockOnReferralSelect}
      />
    );

    expect(screen.getByText('Encaminhamento Recente 1')).toBeInTheDocument();
    expect(screen.getByText('Encaminhamento Recente 2')).toBeInTheDocument();
  });

  it('chama onReferralSelect quando um encaminhamento recente é clicado', async () => {
    render(
      <ReferralDashboard
        metrics={mockMetrics}
        recentReferrals={mockRecentReferrals}
        onReferralSelect={mockOnReferralSelect}
      />
    );

    const referralItem = screen.getByText('Encaminhamento Recente 1');
    await userEvent.click(referralItem);

    expect(mockOnReferralSelect).toHaveBeenCalledWith('1');
  });
});
