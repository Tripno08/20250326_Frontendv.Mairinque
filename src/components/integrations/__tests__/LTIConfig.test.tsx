import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { LTIConfig } from '../LTIConfig';

describe('LTIConfig', () => {
  it('deve exibir o título da configuração LTI', () => {
    render(<LTIConfig />);
    expect(screen.getByText('Configuração LTI')).toBeInTheDocument();
  });

  it('deve exibir o loading enquanto carrega os dados', () => {
    render(<LTIConfig />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('deve exibir o formulário após carregar os dados', async () => {
    render(<LTIConfig />);

    await waitFor(() => {
      expect(screen.getByLabelText('Client ID')).toBeInTheDocument();
      expect(screen.getByLabelText('Client Secret')).toBeInTheDocument();
      expect(screen.getByLabelText('Launch URL')).toBeInTheDocument();
      expect(screen.getByLabelText('Platform URL')).toBeInTheDocument();
      expect(screen.getByLabelText('Ativar Integração')).toBeInTheDocument();
    });
  });

  it('deve preencher os campos com os dados carregados', async () => {
    render(<LTIConfig />);

    await waitFor(() => {
      expect(screen.getByLabelText('Client ID')).toHaveValue('test_client_id');
      expect(screen.getByLabelText('Client Secret')).toHaveValue('test_client_secret');
      expect(screen.getByLabelText('Launch URL')).toHaveValue('https://test.launch.url');
      expect(screen.getByLabelText('Platform URL')).toHaveValue('https://test.platform.url');
      expect(screen.getByLabelText('Ativar Integração')).toBeChecked();
    });
  });

  it('deve atualizar os campos quando o usuário edita', async () => {
    render(<LTIConfig />);

    await waitFor(() => {
      const clientIdInput = screen.getByLabelText('Client ID');
      fireEvent.change(clientIdInput, { target: { value: 'new_client_id' } });
      expect(clientIdInput).toHaveValue('new_client_id');
    });
  });

  it('deve exibir mensagem de sucesso ao salvar', async () => {
    render(<LTIConfig />);

    await waitFor(() => {
      const saveButton = screen.getByText('Salvar');
      fireEvent.click(saveButton);
    });

    expect(screen.getByText('Configuração salva com sucesso')).toBeInTheDocument();
  });

  it('deve exibir mensagem de erro ao falhar ao salvar', async () => {
    // Mock do erro
    jest.spyOn(global, 'fetch').mockRejectedValueOnce(new Error('Erro ao salvar'));

    render(<LTIConfig />);

    await waitFor(() => {
      const saveButton = screen.getByText('Salvar');
      fireEvent.click(saveButton);
    });

    expect(screen.getByText('Erro ao salvar configuração')).toBeInTheDocument();
  });

  it('deve testar a conexão quando o botão é clicado', async () => {
    render(<LTIConfig />);

    await waitFor(() => {
      const testButton = screen.getByText('Testar Conexão');
      fireEvent.click(testButton);
    });

    expect(screen.getByText('Conexão testada com sucesso')).toBeInTheDocument();
  });

  it('deve exibir mensagem de erro ao falhar no teste de conexão', async () => {
    // Mock do erro
    jest.spyOn(global, 'fetch').mockRejectedValueOnce(new Error('Erro ao testar conexão'));

    render(<LTIConfig />);

    await waitFor(() => {
      const testButton = screen.getByText('Testar Conexão');
      fireEvent.click(testButton);
    });

    expect(screen.getByText('Erro ao testar conexão')).toBeInTheDocument();
  });
});
