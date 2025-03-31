import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { GoogleConfig } from '../GoogleConfig';

describe('GoogleConfig', () => {
  it('deve exibir o título da configuração Google', () => {
    render(<GoogleConfig />);
    expect(screen.getByText('Configuração Google')).toBeInTheDocument();
  });

  it('deve exibir o loading enquanto carrega os dados', () => {
    render(<GoogleConfig />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('deve exibir o formulário após carregar os dados', async () => {
    render(<GoogleConfig />);

    await waitFor(() => {
      expect(screen.getByLabelText('Client ID')).toBeInTheDocument();
      expect(screen.getByLabelText('Client Secret')).toBeInTheDocument();
      expect(screen.getByLabelText('Ativar Integração')).toBeInTheDocument();
      expect(screen.getByLabelText('Google Classroom')).toBeInTheDocument();
      expect(screen.getByLabelText('Google Drive')).toBeInTheDocument();
      expect(screen.getByLabelText('Google Calendar')).toBeInTheDocument();
    });
  });

  it('deve preencher os campos com os dados carregados', async () => {
    render(<GoogleConfig />);

    await waitFor(() => {
      expect(screen.getByLabelText('Client ID')).toHaveValue('test_client_id');
      expect(screen.getByLabelText('Client Secret')).toHaveValue('test_client_secret');
      expect(screen.getByLabelText('Ativar Integração')).toBeChecked();
      expect(screen.getByLabelText('Google Classroom')).toBeChecked();
      expect(screen.getByLabelText('Google Drive')).toBeChecked();
      expect(screen.getByLabelText('Google Calendar')).toBeChecked();
    });
  });

  it('deve atualizar os campos quando o usuário edita', async () => {
    render(<GoogleConfig />);

    await waitFor(() => {
      const clientIdInput = screen.getByLabelText('Client ID');
      fireEvent.change(clientIdInput, { target: { value: 'new_client_id' } });
      expect(clientIdInput).toHaveValue('new_client_id');
    });
  });

  it('deve exibir mensagem de sucesso ao salvar', async () => {
    render(<GoogleConfig />);

    await waitFor(() => {
      const saveButton = screen.getByText('Salvar');
      fireEvent.click(saveButton);
    });

    expect(screen.getByText('Configuração salva com sucesso')).toBeInTheDocument();
  });

  it('deve exibir mensagem de erro ao falhar ao salvar', async () => {
    // Mock do erro
    jest.spyOn(global, 'fetch').mockRejectedValueOnce(new Error('Erro ao salvar'));

    render(<GoogleConfig />);

    await waitFor(() => {
      const saveButton = screen.getByText('Salvar');
      fireEvent.click(saveButton);
    });

    expect(screen.getByText('Erro ao salvar configuração')).toBeInTheDocument();
  });

  it('deve testar a conexão quando o botão é clicado', async () => {
    render(<GoogleConfig />);

    await waitFor(() => {
      const testButton = screen.getByText('Testar Conexão');
      fireEvent.click(testButton);
    });

    expect(screen.getByText('Conexão testada com sucesso')).toBeInTheDocument();
  });

  it('deve exibir mensagem de erro ao falhar no teste de conexão', async () => {
    // Mock do erro
    jest.spyOn(global, 'fetch').mockRejectedValueOnce(new Error('Erro ao testar conexão'));

    render(<GoogleConfig />);

    await waitFor(() => {
      const testButton = screen.getByText('Testar Conexão');
      fireEvent.click(testButton);
    });

    expect(screen.getByText('Erro ao testar conexão')).toBeInTheDocument();
  });

  it('deve sincronizar Classroom quando o botão é clicado', async () => {
    render(<GoogleConfig />);

    await waitFor(() => {
      const syncClassroomButton = screen.getByText('Sincronizar Classroom');
      fireEvent.click(syncClassroomButton);
    });

    expect(screen.getByText('Classroom sincronizado com sucesso')).toBeInTheDocument();
  });

  it('deve sincronizar Drive quando o botão é clicado', async () => {
    render(<GoogleConfig />);

    await waitFor(() => {
      const syncDriveButton = screen.getByText('Sincronizar Drive');
      fireEvent.click(syncDriveButton);
    });

    expect(screen.getByText('Drive sincronizado com sucesso')).toBeInTheDocument();
  });

  it('deve sincronizar Calendar quando o botão é clicado', async () => {
    render(<GoogleConfig />);

    await waitFor(() => {
      const syncCalendarButton = screen.getByText('Sincronizar Calendar');
      fireEvent.click(syncCalendarButton);
    });

    expect(screen.getByText('Calendar sincronizado com sucesso')).toBeInTheDocument();
  });
});
