import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ReferralBuilder from '../ReferralBuilder';
import { ReferralType, ReferralPriority } from '../../../types/referral';

describe('ReferralBuilder', () => {
  const mockOnSubmit = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza o formulário corretamente', () => {
    render(<ReferralBuilder onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    expect(screen.getByLabelText(/título/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/descrição/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/tipo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/prioridade/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/atribuir para/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/data de vencimento/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/adicionar tag/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancelar/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /criar encaminhamento/i })).toBeInTheDocument();
  });

  it('permite adicionar e remover tags', async () => {
    render(<ReferralBuilder onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    const tagInput = screen.getByLabelText(/adicionar tag/i);
    const addButton = screen.getByRole('button', { name: /adicionar/i });

    await userEvent.type(tagInput, 'nova-tag');
    await userEvent.click(addButton);

    expect(screen.getByText('nova-tag')).toBeInTheDocument();
    expect(tagInput).toHaveValue('');

    const deleteButton = screen.getByRole('button', { name: /delete/i });
    await userEvent.click(deleteButton);

    expect(screen.queryByText('nova-tag')).not.toBeInTheDocument();
  });

  it('submete o formulário com dados válidos', async () => {
    render(<ReferralBuilder onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    await userEvent.type(screen.getByLabelText(/título/i), 'Teste de Encaminhamento');
    await userEvent.type(screen.getByLabelText(/descrição/i), 'Descrição do teste');
    await userEvent.type(screen.getByLabelText(/atribuir para/i), 'Usuário Teste');

    const submitButton = screen.getByRole('button', { name: /criar encaminhamento/i });
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Teste de Encaminhamento',
          description: 'Descrição do teste',
          assignedTo: 'Usuário Teste',
          type: 'academic',
          priority: 'medium',
          status: 'pending',
          tags: [],
        })
      );
    });
  });

  it('não submete o formulário com dados inválidos', async () => {
    render(<ReferralBuilder onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    const submitButton = screen.getByRole('button', { name: /criar encaminhamento/i });
    await userEvent.click(submitButton);

    expect(mockOnSubmit).not.toHaveBeenCalled();
    expect(submitButton).toBeDisabled();
  });

  it('chama onCancel quando o botão cancelar é clicado', async () => {
    render(<ReferralBuilder onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    const cancelButton = screen.getByRole('button', { name: /cancelar/i });
    await userEvent.click(cancelButton);

    expect(mockOnCancel).toHaveBeenCalled();
  });

  it('permite selecionar tipo e prioridade', async () => {
    render(<ReferralBuilder onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    const typeSelect = screen.getByLabelText(/tipo/i);
    const prioritySelect = screen.getByLabelText(/prioridade/i);

    await userEvent.click(typeSelect);
    await userEvent.click(screen.getByText(/comportamental/i));

    await userEvent.click(prioritySelect);
    await userEvent.click(screen.getByText(/alta/i));

    expect(typeSelect).toHaveValue('behavioral');
    expect(prioritySelect).toHaveValue('high');
  });
});
