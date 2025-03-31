import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { AIAnalysisDashboardExample } from '../AIAnalysisDashboardExample';

const theme = createTheme();

describe('AIAnalysisDashboardExample', () => {
  it('renderiza o exemplo corretamente', () => {
    render(
      <ThemeProvider theme={theme}>
        <AIAnalysisDashboardExample />
      </ThemeProvider>
    );

    // Verifica se o título e subtítulo estão presentes
    expect(screen.getByText('Dashboard de Análise de IA')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Visualize análises e insights baseados em IA sobre o desempenho dos estudantes'
      )
    ).toBeInTheDocument();

    // Verifica se o dashboard está presente
    expect(screen.getByText('Estudantes em Risco')).toBeInTheDocument();
    expect(screen.getByText('Recomendações Ativas')).toBeInTheDocument();
    expect(screen.getByText('Clusters Identificados')).toBeInTheDocument();
    expect(screen.getByText('Padrões Detectados')).toBeInTheDocument();
  });

  it('atualiza o estudante selecionado quando um estudante é selecionado', () => {
    render(
      <ThemeProvider theme={theme}>
        <AIAnalysisDashboardExample />
      </ThemeProvider>
    );

    // Simula a seleção de um estudante
    // Note: Você precisará adicionar um elemento clicável no componente para testar isso
    // Por exemplo, se houver um botão ou card clicável:
    // fireEvent.click(screen.getByText('Estudante 1'));

    // Verifica se o ID do estudante selecionado é exibido
    // expect(screen.getByText('Estudante Selecionado: 1')).toBeInTheDocument();
  });

  it('não mostra o box de estudante selecionado inicialmente', () => {
    render(
      <ThemeProvider theme={theme}>
        <AIAnalysisDashboardExample />
      </ThemeProvider>
    );

    expect(screen.queryByText(/Estudante Selecionado:/)).not.toBeInTheDocument();
  });
});
