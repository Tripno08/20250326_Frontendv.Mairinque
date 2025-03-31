import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MicrosoftConfig } from '../MicrosoftConfig';

describe('MicrosoftConfig', () => {
  it('deve exibir o título da configuração Microsoft', () => {
    render(<MicrosoftConfig />);
    expect(screen.getByText('Configuração Microsoft')).toBeInTheDocument();
  });

  it('deve exibir o loading enquanto carrega os dados', () => {
    render(<MicrosoftConfig />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('deve exibir o formulário após carregar os dados', async () => {
    render(<MicrosoftConfig />);

    await waitFor(() => {
      expect(screen.getByLabelText('Client ID')).toBeInTheDocument();
      expect(screen.getByLabelText('Client Secret')).toBeInTheDocument();
      expect(screen.getByLabelText('Tenant ID')).toBeInTheDocument();
      expect(screen.getByLabelText('Graph API Version')).toBeInTheDocument();
      expect(screen.getByLabelText('Ativar Integração')).toBeInTheDocument();
      expect(screen.getByLabelText('Microsoft Teams')).toBeInTheDocument();
      expect(screen.getByLabelText('SharePoint')).toBeInTheDocument();
    });
  });

  it('deve preencher os campos com os dados carregados', async () => {
    render(<MicrosoftConfig />);

    await waitFor(() => {
      expect(screen.getByLabelText('Client ID')).toHaveValue('test_client_id');
      expect(screen.getByLabelText('Client Secret')).toHaveValue('test_client_secret');
      expect(screen.getByLabelText('Tenant ID')).toHaveValue('test_tenant_id');
      expect(screen.getByLabelText('Graph API Version')).toHaveValue('v1.0');
      expect(screen.getByLabelText('Ativar Integração')).toBeChecked();
      expect(screen.getByLabelText('Microsoft Teams')).toBeChecked();
      expect(screen.getByLabelText('SharePoint')).toBeChecked();
    });
  });

  it('deve atualizar os campos quando o usuário edita', async () => {
    render(<MicrosoftConfig />);

    await waitFor(() => {
      const clientIdInput = screen.getByLabelText('Client ID');
      fireEvent.change(clientIdInput, { target: { value: 'new_client_id' } });
      expect(clientIdInput).toHaveValue('new_client_id');
    });
  });

  it('deve exibir mensagem de sucesso ao salvar', async () => {
    render(<MicrosoftConfig />);

    await waitFor(() => {
      const saveButton = screen.getByText('Salvar');
      fireEvent.click(saveButton);
    });

    expect(screen.getByText('Configuração salva com sucesso')).toBeInTheDocument();
  });

  it('deve exibir mensagem de erro ao falhar ao salvar', async () => {
    // Mock do erro
    jest.spyOn(global, 'fetch').mockRejectedValueOnce(new Error('Erro ao salvar'));

    render(<MicrosoftConfig />);

    await waitFor(() => {
      const saveButton = screen.getByText('Salvar');
      fireEvent.click(saveButton);
    });

    expect(screen.getByText('Erro ao salvar configuração')).toBeInTheDocument();
  });

  it('deve testar a conexão quando o botão é clicado', async () => {
    render(<MicrosoftConfig />);

    await waitFor(() => {
      const testButton = screen.getByText('Testar Conexão');
      fireEvent.click(testButton);
    });

    expect(screen.getByText('Conexão testada com sucesso')).toBeInTheDocument();
  });

  it('deve exibir mensagem de erro ao falhar no teste de conexão', async () => {
    // Mock do erro
    jest.spyOn(global, 'fetch').mockRejectedValueOnce(new Error('Erro ao testar conexão'));

    render(<MicrosoftConfig />);

    await waitFor(() => {
      const testButton = screen.getByText('Testar Conexão');
      fireEvent.click(testButton);
    });

    expect(screen.getByText('Erro ao testar conexão')).toBeInTheDocument();
  });

  it('deve sincronizar Teams quando o botão é clicado', async () => {
    render(<MicrosoftConfig />);

    await waitFor(() => {
      const syncTeamsButton = screen.getByText('Sincronizar Teams');
      fireEvent.click(syncTeamsButton);
    });

    expect(screen.getByText('Teams sincronizado com sucesso')).toBeInTheDocument();
  });

  it('deve sincronizar SharePoint quando o botão é clicado', async () => {
    render(<MicrosoftConfig />);

    await waitFor(() => {
      const syncSharePointButton = screen.getByText('Sincronizar SharePoint');
      fireEvent.click(syncSharePointButton);
    });

    expect(screen.getByText('SharePoint sincronizado com sucesso')).toBeInTheDocument();
  });
});
