import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { IntegrationDashboard } from '../IntegrationDashboard';

describe('IntegrationDashboard', () => {
  it('deve exibir o título do dashboard', () => {
    render(<IntegrationDashboard />);
    expect(screen.getByText('Dashboard de Integrações')).toBeInTheDocument();
  });

  it('deve exibir o loading enquanto carrega os dados', () => {
    render(<IntegrationDashboard />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('deve exibir os dados do dashboard após carregar', async () => {
    render(<IntegrationDashboard />);

    await waitFor(() => {
      expect(screen.getByText('Total de Integrações')).toBeInTheDocument();
      expect(screen.getByText('Integrações Ativas')).toBeInTheDocument();
      expect(screen.getByText('Integrações com Erro')).toBeInTheDocument();
      expect(screen.getByText('Taxa de Sucesso Média')).toBeInTheDocument();
      expect(screen.getByText('Total de Eventos')).toBeInTheDocument();
      expect(screen.getByText('Total de Erros')).toBeInTheDocument();
    });

    expect(screen.getByText('4')).toBeInTheDocument(); // Total de Integrações
    expect(screen.getByText('3')).toBeInTheDocument(); // Integrações Ativas
    expect(screen.getByText('1')).toBeInTheDocument(); // Integrações com Erro
    expect(screen.getByText('97.5%')).toBeInTheDocument(); // Taxa de Sucesso Média
    expect(screen.getByText('1000')).toBeInTheDocument(); // Total de Eventos
    expect(screen.getByText('25')).toBeInTheDocument(); // Total de Erros
  });

  it('deve exibir a lista de integrações após carregar', async () => {
    render(<IntegrationDashboard />);

    await waitFor(() => {
      expect(screen.getByText('LTI')).toBeInTheDocument();
      expect(screen.getByText('Microsoft')).toBeInTheDocument();
      expect(screen.getByText('Google')).toBeInTheDocument();
      expect(screen.getByText('Webhooks')).toBeInTheDocument();
    });
  });

  it('deve exibir o status correto para cada integração', async () => {
    render(<IntegrationDashboard />);

    await waitFor(() => {
      expect(screen.getByText('Ativo')).toBeInTheDocument();
      expect(screen.getByText('Erro')).toBeInTheDocument();
    });
  });

  it('deve exibir a mensagem de erro quando falhar ao carregar os dados', async () => {
    // Mock do erro
    jest.spyOn(global, 'fetch').mockRejectedValueOnce(new Error('Erro ao carregar dados'));

    render(<IntegrationDashboard />);

    await waitFor(() => {
      expect(screen.getByText('Erro ao carregar dados do dashboard')).toBeInTheDocument();
    });
  });
});
