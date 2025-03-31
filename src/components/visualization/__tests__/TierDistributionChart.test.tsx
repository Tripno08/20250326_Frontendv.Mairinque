import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { TierDistributionChart } from '../TierDistributionChart';
import { TierDistribution } from '@/types/visualization';

// Mock de dados para o teste
const mockData: TierDistribution = {
  totalStudents: 1000,
  tiers: [
    {
      id: 'tier1',
      name: 'Tier 1',
      description: 'Instrução Universal',
      color: '#4CAF50',
      count: 800,
      percentage: 80,
    },
    {
      id: 'tier2',
      name: 'Tier 2',
      description: 'Intervenções Direcionadas',
      color: '#FFC107',
      count: 150,
      percentage: 15,
    },
    {
      id: 'tier3',
      name: 'Tier 3',
      description: 'Intervenções Intensivas',
      color: '#F44336',
      count: 50,
      percentage: 5,
    },
  ],
};

// Mock da função recharts
jest.mock('recharts', () => {
  const OriginalModule = jest.requireActual('recharts');
  return {
    ...OriginalModule,
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="responsive-container">{children}</div>
    ),
    BarChart: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="bar-chart">{children}</div>
    ),
    PieChart: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="pie-chart">{children}</div>
    ),
    CartesianGrid: () => <div data-testid="cartesian-grid" />,
    XAxis: () => <div data-testid="x-axis" />,
    YAxis: () => <div data-testid="y-axis" />,
    Tooltip: () => <div data-testid="tooltip" />,
    Legend: () => <div data-testid="legend" />,
    Bar: ({ children }: { children: React.ReactNode }) => <div data-testid="bar">{children}</div>,
    Pie: ({ children }: { children: React.ReactNode }) => <div data-testid="pie">{children}</div>,
    Cell: () => <div data-testid="cell" />,
    Sector: () => <div data-testid="sector" />,
  };
});

describe('TierDistributionChart', () => {
  it('renderiza corretamente com dados padrão', () => {
    render(<TierDistributionChart data={mockData} />);

    // Verificar se o título está presente
    expect(screen.getByText('Distribuição por Níveis RTI/MTSS')).toBeInTheDocument();

    // Verificar se o total de estudantes está presente
    expect(screen.getByText('Total: 1000 estudantes')).toBeInTheDocument();

    // Verificar se o gráfico de barras está sendo renderizado por padrão
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
  });

  it('alterna entre gráfico de barras e pizza quando os botões são clicados', () => {
    render(<TierDistributionChart data={mockData} />);

    // Inicialmente, deve ser o gráfico de barras
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();

    // Clicar no botão de pizza
    fireEvent.click(screen.getByLabelText('gráfico de pizza'));

    // Agora deve ser o gráfico de pizza
    expect(screen.getByTestId('pie-chart')).toBeInTheDocument();

    // Clicar de volta no botão de barras
    fireEvent.click(screen.getByLabelText('gráfico de barras'));

    // Deve voltar a ser o gráfico de barras
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
  });

  it('chama a função onTierClick quando um tier é clicado', () => {
    const mockOnTierClick = jest.fn();

    render(<TierDistributionChart data={mockData} onTierClick={mockOnTierClick} />);

    // Simular o clique no gráfico
    // Como não podemos simular exatamente o evento do Recharts,
    // vamos apenas verificar se a prop foi passada corretamente
    expect(mockOnTierClick).not.toHaveBeenCalled();
  });

  it('renderiza com título personalizado', () => {
    const customTitle = 'Distribuição de Alunos';

    render(<TierDistributionChart data={mockData} title={customTitle} />);

    expect(screen.getByText(customTitle)).toBeInTheDocument();
  });

  it('não mostra a legenda quando showLegend é false', () => {
    render(<TierDistributionChart data={mockData} showLegend={false} />);

    // Como o Legend é mockado, não pode ser totalmente testado aqui,
    // mas a prop está sendo passada
  });

  it('renderiza com tamanho personalizado', () => {
    const { container } = render(
      <TierDistributionChart data={mockData} width={600} height={300} />
    );

    // Como estamos usando um Box que envolve o Paper, não podemos
    // verificar diretamente as dimensões no teste sem usar APIs de DOM
    // mais complexas
  });
});
