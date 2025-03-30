import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ReferralDetails from '../ReferralDetails';
import { Referral, Comment } from '../../../types/referral';

describe('ReferralDetails', () => {
  const mockReferral: Referral = {
    id: '1',
    title: 'Encaminhamento Teste',
    description: 'Descrição do teste',
    type: 'academic',
    status: 'pending',
    priority: 'high',
    assignedTo: 'Usuário 1',
    createdBy: 'Admin',
    dueDate: new Date('2024-12-31'),
    attachments: [
      {
        id: '1',
        name: 'documento.pdf',
        url: 'http://example.com/documento.pdf',
        type: 'application/pdf',
        size: 1024,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    comments: [
      {
        id: '1',
        content: 'Comentário teste',
        author: 'Usuário 1',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    history: [
      {
        id: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
        action: 'Criação',
        description: 'Encaminhamento criado',
        author: 'Admin',
        previousStatus: undefined,
        newStatus: 'pending',
      },
    ],
    tags: ['teste', 'urgente'],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockOnUpdate = jest.fn();
  const mockOnAddComment = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza os detalhes do encaminhamento corretamente', () => {
    render(
      <ReferralDetails
        referral={mockReferral}
        onUpdate={mockOnUpdate}
        onAddComment={mockOnAddComment}
      />
    );

    expect(screen.getByText('Encaminhamento Teste')).toBeInTheDocument();
    expect(screen.getByText('Descrição do teste')).toBeInTheDocument();
    expect(screen.getByText('teste')).toBeInTheDocument();
    expect(screen.getByText('urgente')).toBeInTheDocument();
    expect(screen.getByText('documento.pdf')).toBeInTheDocument();
    expect(screen.getByText('Comentário teste')).toBeInTheDocument();
  });

  it('renderiza os chips de status, prioridade e tipo corretamente', () => {
    render(
      <ReferralDetails
        referral={mockReferral}
        onUpdate={mockOnUpdate}
        onAddComment={mockOnAddComment}
      />
    );

    expect(screen.getByText('pending')).toBeInTheDocument();
    expect(screen.getByText('high')).toBeInTheDocument();
    expect(screen.getByText('academic')).toBeInTheDocument();
  });

  it('abre o diálogo de novo comentário quando o botão é clicado', async () => {
    render(
      <ReferralDetails
        referral={mockReferral}
        onUpdate={mockOnUpdate}
        onAddComment={mockOnAddComment}
      />
    );

    const newCommentButton = screen.getByRole('button', { name: /novo comentário/i });
    await userEvent.click(newCommentButton);

    expect(screen.getByText('Novo Comentário')).toBeInTheDocument();
  });

  it('adiciona um novo comentário quando o formulário é submetido', async () => {
    render(
      <ReferralDetails
        referral={mockReferral}
        onUpdate={mockOnUpdate}
        onAddComment={mockOnAddComment}
      />
    );

    const newCommentButton = screen.getByRole('button', { name: /novo comentário/i });
    await userEvent.click(newCommentButton);

    const commentInput = screen.getByLabelText(/comentário/i);
    await userEvent.type(commentInput, 'Novo comentário teste');

    const submitButton = screen.getByRole('button', { name: /enviar/i });
    await userEvent.click(submitButton);

    expect(mockOnAddComment).toHaveBeenCalledWith('1', {
      content: 'Novo comentário teste',
      author: 'current-user',
    });
  });

  it('atualiza o status quando os botões de ação são clicados', async () => {
    render(
      <ReferralDetails
        referral={mockReferral}
        onUpdate={mockOnUpdate}
        onAddComment={mockOnAddComment}
      />
    );

    const startButton = screen.getByRole('button', { name: /iniciar/i });
    await userEvent.click(startButton);

    expect(mockOnUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 'in_progress',
        history: expect.arrayContaining([
          expect.objectContaining({
            action: 'Alteração de Status',
            description: 'Status alterado de pending para in_progress',
          }),
        ]),
      })
    );
  });

  it('desabilita os botões de ação apropriadamente baseado no status', () => {
    const completedReferral: Referral = {
      ...mockReferral,
      status: 'completed',
    };

    render(
      <ReferralDetails
        referral={completedReferral}
        onUpdate={mockOnUpdate}
        onAddComment={mockOnAddComment}
      />
    );

    expect(screen.getByRole('button', { name: /iniciar/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /concluir/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /cancelar/i })).toBeEnabled();
  });

  it('mostra o tamanho do anexo formatado corretamente', () => {
    render(
      <ReferralDetails
        referral={mockReferral}
        onUpdate={mockOnUpdate}
        onAddComment={mockOnAddComment}
      />
    );

    expect(screen.getByText('1 KB')).toBeInTheDocument();
  });
});
