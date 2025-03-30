import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ReferralList from '../ReferralList';
import { Referral, ReferralStatus } from '../../../types/referral';

describe('ReferralList', () => {
  const mockReferrals: Referral[] = [
    {
      id: '1',
      title: 'Encaminhamento Teste 1',
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
      title: 'Encaminhamento Teste 2',
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
  const mockOnStatusChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza a lista de encaminhamentos corretamente', () => {
    render(
      <ReferralList
        referrals={mockReferrals}
        onReferralSelect={mockOnReferralSelect}
        onStatusChange={mockOnStatusChange}
      />
    );

    expect(screen.getByText('Encaminhamento Teste 1')).toBeInTheDocument();
    expect(screen.getByText('Encaminhamento Teste 2')).toBeInTheDocument();
    expect(screen.getByText('teste')).toBeInTheDocument();
    expect(screen.getByText('urgente')).toBeInTheDocument();
  });

  it('chama onReferralSelect quando um encaminhamento é clicado', async () => {
    render(
      <ReferralList
        referrals={mockReferrals}
        onReferralSelect={mockOnReferralSelect}
        onStatusChange={mockOnStatusChange}
      />
    );

    const referralCard = screen.getByText('Encaminhamento Teste 1').closest('div[role="button"]');
    if (referralCard) {
      await userEvent.click(referralCard);
    }

    expect(mockOnReferralSelect).toHaveBeenCalledWith('1');
  });

  it('abre o menu de ações quando o botão de menu é clicado', async () => {
    render(
      <ReferralList
        referrals={mockReferrals}
        onReferralSelect={mockOnReferralSelect}
        onStatusChange={mockOnStatusChange}
      />
    );

    const menuButtons = screen.getAllByRole('button', { name: /more/i });
    if (menuButtons[0]) {
      await userEvent.click(menuButtons[0]);
    }

    expect(screen.getByText(/em andamento/i)).toBeInTheDocument();
    expect(screen.getByText(/concluir/i)).toBeInTheDocument();
    expect(screen.getByText(/cancelar/i)).toBeInTheDocument();
  });

  it('chama onStatusChange quando uma ação é selecionada', async () => {
    render(
      <ReferralList
        referrals={mockReferrals}
        onReferralSelect={mockOnReferralSelect}
        onStatusChange={mockOnStatusChange}
      />
    );

    const menuButtons = screen.getAllByRole('button', { name: /more/i });
    if (menuButtons[0]) {
      await userEvent.click(menuButtons[0]);
    }
    await userEvent.click(screen.getByText(/em andamento/i));

    expect(mockOnStatusChange).toHaveBeenCalledWith('1', 'in_progress');
  });

  it('mostra o ícone de vencimento com cor apropriada', () => {
    const overdueReferral: Referral = {
      id: '1',
      title: 'Encaminhamento Teste 1',
      description: 'Descrição do teste 1',
      type: 'academic',
      status: 'pending',
      priority: 'high',
      assignedTo: 'Usuário 1',
      createdBy: 'Admin',
      dueDate: new Date('2023-12-31'),
      attachments: [],
      comments: [],
      history: [],
      tags: ['teste', 'urgente'],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    render(
      <ReferralList
        referrals={[overdueReferral]}
        onReferralSelect={mockOnReferralSelect}
        onStatusChange={mockOnStatusChange}
      />
    );

    const timeIcon = screen.getByTitle(/vencimento/i);
    expect(timeIcon).toHaveStyle({ color: 'rgb(211, 47, 47)' }); // error color
  });
});
