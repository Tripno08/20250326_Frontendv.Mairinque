import React from 'react';
import { render, screen } from '@testing-library/react';
import ReferralTimeline from '../ReferralTimeline';
import { HistoryItem, ReferralStatus } from '../../../types/referral';

describe('ReferralTimeline', () => {
  const mockHistory: HistoryItem[] = [
    {
      id: '1',
      createdAt: new Date('2024-03-30T10:00:00'),
      updatedAt: new Date('2024-03-30T10:00:00'),
      action: 'Criação',
      description: 'Encaminhamento criado',
      author: 'Admin',
      previousStatus: undefined,
      newStatus: 'pending' as ReferralStatus,
    },
    {
      id: '2',
      createdAt: new Date('2024-03-30T11:00:00'),
      updatedAt: new Date('2024-03-30T11:00:00'),
      action: 'Alteração de Status',
      description: 'Status alterado para em andamento',
      author: 'Usuário 1',
      previousStatus: 'pending' as ReferralStatus,
      newStatus: 'in_progress' as ReferralStatus,
    },
    {
      id: '3',
      createdAt: new Date('2024-03-30T12:00:00'),
      updatedAt: new Date('2024-03-30T12:00:00'),
      action: 'Conclusão',
      description: 'Encaminhamento concluído',
      author: 'Usuário 1',
      previousStatus: 'in_progress' as ReferralStatus,
      newStatus: 'completed' as ReferralStatus,
    },
  ];

  it('renderiza o título corretamente', () => {
    render(<ReferralTimeline history={mockHistory} />);
    expect(screen.getByText('Histórico de Alterações')).toBeInTheDocument();
  });

  it('renderiza todos os itens do histórico', () => {
    render(<ReferralTimeline history={mockHistory} />);

    expect(screen.getByText('Criação')).toBeInTheDocument();
    expect(screen.getByText('Alteração de Status')).toBeInTheDocument();
    expect(screen.getByText('Conclusão')).toBeInTheDocument();
  });

  it('renderiza as descrições dos itens', () => {
    render(<ReferralTimeline history={mockHistory} />);

    expect(screen.getByText('Encaminhamento criado')).toBeInTheDocument();
    expect(screen.getByText('Status alterado para em andamento')).toBeInTheDocument();
    expect(screen.getByText('Encaminhamento concluído')).toBeInTheDocument();
  });

  it('renderiza os autores dos itens', () => {
    render(<ReferralTimeline history={mockHistory} />);

    expect(screen.getByText('Admin')).toBeInTheDocument();
    expect(screen.getAllByText('Usuário 1')).toHaveLength(2);
  });

  it('renderiza as datas formatadas corretamente', () => {
    render(<ReferralTimeline history={mockHistory} />);

    const dates = screen.getAllByText(/30\/03\/2024/);
    expect(dates).toHaveLength(3);
  });

  it('renderiza os chips de status quando há mudança de status', () => {
    render(<ReferralTimeline history={mockHistory} />);

    expect(screen.getByText('pending')).toBeInTheDocument();
    expect(screen.getByText('in_progress')).toBeInTheDocument();
    expect(screen.getByText('completed')).toBeInTheDocument();
  });

  it('não renderiza chips de status quando não há mudança de status', () => {
    const historyWithoutStatusChange: HistoryItem[] = [
      {
        id: '1',
        createdAt: new Date('2024-03-30T10:00:00'),
        updatedAt: new Date('2024-03-30T10:00:00'),
        action: 'Criação',
        description: 'Encaminhamento criado',
        author: 'Admin',
        previousStatus: undefined,
        newStatus: 'pending' as ReferralStatus,
      },
    ];

    render(<ReferralTimeline history={historyWithoutStatusChange} />);

    expect(screen.queryByText('pending')).not.toBeInTheDocument();
  });
});
