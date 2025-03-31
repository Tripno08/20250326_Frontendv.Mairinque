import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { WebhookConfig } from '../WebhookConfig';

describe('WebhookConfig', () => {
  it('deve exibir o título da configuração de Webhooks', () => {
    render(<WebhookConfig />);
    expect(screen.getByText('Configuração de Webhooks')).toBeInTheDocument();
  });

  it('deve exibir o loading enquanto carrega os dados', () => {
    render(<WebhookConfig />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('deve exibir a lista de webhooks após carregar', async () => {
    render(<WebhookConfig />);

    await waitFor(() => {
      expect(screen.getByText('https://test.webhook.url')).toBeInTheDocument();
      expect(screen.getByText('98%')).toBeInTheDocument();
      expect(screen.getByText('Ativo')).toBeInTheDocument();
    });
  });

  it('deve abrir o diálogo de novo webhook quando o botão é clicado', async () => {
    render(<WebhookConfig />);

    await waitFor(() => {
      const addButton = screen.getByText('Novo Webhook');
      fireEvent.click(addButton);
    });

    expect(screen.getByText('Novo Webhook')).toBeInTheDocument();
    expect(screen.getByLabelText('URL')).toBeInTheDocument();
    expect(screen.getByLabelText('Secret')).toBeInTheDocument();
    expect(screen.getByLabelText('Timeout')).toBeInTheDocument();
    expect(screen.getByLabelText('Tentativas')).toBeInTheDocument();
    expect(screen.getByLabelText('Ativo')).toBeInTheDocument();
  });

  it('deve criar um novo webhook quando o formulário é submetido', async () => {
    render(<WebhookConfig />);

    await waitFor(() => {
      const addButton = screen.getByText('Novo Webhook');
      fireEvent.click(addButton);
    });

    const urlInput = screen.getByLabelText('URL');
    const secretInput = screen.getByLabelText('Secret');
    const timeoutInput = screen.getByLabelText('Timeout');
    const retryInput = screen.getByLabelText('Tentativas');

    fireEvent.change(urlInput, { target: { value: 'https://new.webhook.url' } });
    fireEvent.change(secretInput, { target: { value: 'new_secret' } });
    fireEvent.change(timeoutInput, { target: { value: '10000' } });
    fireEvent.change(retryInput, { target: { value: '5' } });

    const saveButton = screen.getByText('Salvar');
    fireEvent.click(saveButton);

    expect(screen.getByText('Webhook criado com sucesso')).toBeInTheDocument();
  });

  it('deve exibir mensagem de erro ao falhar ao criar webhook', async () => {
    // Mock do erro
    jest.spyOn(global, 'fetch').mockRejectedValueOnce(new Error('Erro ao criar webhook'));

    render(<WebhookConfig />);

    await waitFor(() => {
      const addButton = screen.getByText('Novo Webhook');
      fireEvent.click(addButton);
    });

    const saveButton = screen.getByText('Salvar');
    fireEvent.click(saveButton);

    expect(screen.getByText('Erro ao criar webhook')).toBeInTheDocument();
  });

  it('deve abrir o diálogo de edição quando o botão de editar é clicado', async () => {
    render(<WebhookConfig />);

    await waitFor(() => {
      const editButton = screen.getByTestId('edit-webhook-1');
      fireEvent.click(editButton);
    });

    expect(screen.getByText('Editar Webhook')).toBeInTheDocument();
    expect(screen.getByLabelText('URL')).toHaveValue('https://test.webhook.url');
    expect(screen.getByLabelText('Secret')).toHaveValue('test_secret');
    expect(screen.getByLabelText('Timeout')).toHaveValue('5000');
    expect(screen.getByLabelText('Tentativas')).toHaveValue('3');
    expect(screen.getByLabelText('Ativo')).toBeChecked();
  });

  it('deve atualizar um webhook quando o formulário é submetido', async () => {
    render(<WebhookConfig />);

    await waitFor(() => {
      const editButton = screen.getByTestId('edit-webhook-1');
      fireEvent.click(editButton);
    });

    const urlInput = screen.getByLabelText('URL');
    fireEvent.change(urlInput, { target: { value: 'https://updated.webhook.url' } });

    const saveButton = screen.getByText('Salvar');
    fireEvent.click(saveButton);

    expect(screen.getByText('Webhook atualizado com sucesso')).toBeInTheDocument();
  });

  it('deve exibir mensagem de erro ao falhar ao atualizar webhook', async () => {
    // Mock do erro
    jest.spyOn(global, 'fetch').mockRejectedValueOnce(new Error('Erro ao atualizar webhook'));

    render(<WebhookConfig />);

    await waitFor(() => {
      const editButton = screen.getByTestId('edit-webhook-1');
      fireEvent.click(editButton);
    });

    const saveButton = screen.getByText('Salvar');
    fireEvent.click(saveButton);

    expect(screen.getByText('Erro ao atualizar webhook')).toBeInTheDocument();
  });

  it('deve remover um webhook quando o botão de deletar é clicado', async () => {
    render(<WebhookConfig />);

    await waitFor(() => {
      const deleteButton = screen.getByTestId('delete-webhook-1');
      fireEvent.click(deleteButton);
    });

    expect(screen.getByText('Webhook removido com sucesso')).toBeInTheDocument();
  });

  it('deve exibir mensagem de erro ao falhar ao remover webhook', async () => {
    // Mock do erro
    jest.spyOn(global, 'fetch').mockRejectedValueOnce(new Error('Erro ao remover webhook'));

    render(<WebhookConfig />);

    await waitFor(() => {
      const deleteButton = screen.getByTestId('delete-webhook-1');
      fireEvent.click(deleteButton);
    });

    expect(screen.getByText('Erro ao remover webhook')).toBeInTheDocument();
  });

  it('deve tentar novamente um evento com erro quando o botão é clicado', async () => {
    render(<WebhookConfig />);

    await waitFor(() => {
      const retryButton = screen.getByTestId('retry-event-1');
      fireEvent.click(retryButton);
    });

    expect(screen.getByText('Evento reprocessado com sucesso')).toBeInTheDocument();
  });

  it('deve exibir mensagem de erro ao falhar ao reprocessar evento', async () => {
    // Mock do erro
    jest.spyOn(global, 'fetch').mockRejectedValueOnce(new Error('Erro ao reprocessar evento'));

    render(<WebhookConfig />);

    await waitFor(() => {
      const retryButton = screen.getByTestId('retry-event-1');
      fireEvent.click(retryButton);
    });

    expect(screen.getByText('Erro ao reprocessar evento')).toBeInTheDocument();
  });
});
