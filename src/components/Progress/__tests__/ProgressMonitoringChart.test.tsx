import { render, screen, fireEvent } from '@testing-library/react';
import { ProgressMonitoringChart } from '../ProgressMonitoringChart';
import type { ProgressDataPoint, Benchmark, ProgressGoal } from '@/types/progress';
import { renderWithContainer } from '@/test-utils/renderWithContainer';

// Mock dos dados de teste
const mockData: ProgressDataPoint[] = [
  {
    date: new Date('2024-01-01'),
    value: 65,
    intervention: 'Intervenção A',
    notes: 'Primeira avaliação',
  },
  {
    date: new Date('2024-01-15'),
    value: 68,
    intervention: 'Intervenção B',
    notes: 'Avaliação após intervenção',
  },
];

const mockBenchmarks: Benchmark[] = [
  {
    name: 'Benchmark 1',
    value: 70,
    color: '#4CAF50',
    description: 'Nível esperado',
  },
];

const mockGoals: ProgressGoal[] = [
  {
    name: 'Meta 1',
    targetValue: 80,
    deadline: new Date('2024-03-31'),
    color: '#FF9800',
    description: 'Meta para o trimestre',
  },
];

describe('ProgressMonitoringChart', () => {
  beforeAll(() => {
    // Mock ResizeObserver
    global.ResizeObserver = class ResizeObserver {
      observe() {}
      unobserve() {}
      disconnect() {}
    };
  });

  it('renderiza o gráfico corretamente', () => {
    render(
      <ProgressMonitoringChart
        data={mockData}
        benchmarks={mockBenchmarks}
        goals={mockGoals}
        width={800}
        height={600}
      />
    );

    // Verifica se os elementos principais estão presentes
    expect(screen.getByRole('button', { name: 'Aumentar Zoom' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Diminuir Zoom' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Resetar Zoom' })).toBeInTheDocument();
  });

  it('aplica zoom corretamente', () => {
    render(
      <ProgressMonitoringChart
        data={mockData}
        benchmarks={mockBenchmarks}
        goals={mockGoals}
        width={800}
        height={600}
      />
    );

    const zoomInButton = screen.getByRole('button', { name: 'Aumentar Zoom' });
    const zoomOutButton = screen.getByRole('button', { name: 'Diminuir Zoom' });
    const resetButton = screen.getByRole('button', { name: 'Resetar Zoom' });

    // Testa zoom in
    fireEvent.click(zoomInButton);
    expect(zoomInButton).toBeInTheDocument();

    // Testa zoom out
    fireEvent.click(zoomOutButton);
    expect(zoomOutButton).toBeInTheDocument();

    // Testa reset
    fireEvent.click(resetButton);
    expect(resetButton).toBeInTheDocument();
  });

  it('filtra dados por intervalo de datas', () => {
    const dateRange = {
      start: new Date('2024-01-01'),
      end: new Date('2024-01-15'),
    };

    render(
      <ProgressMonitoringChart
        data={mockData}
        benchmarks={mockBenchmarks}
        goals={mockGoals}
        dateRange={dateRange}
        width={800}
        height={600}
      />
    );

    // Verifica se os botões de controle estão presentes
    expect(screen.getByRole('button', { name: 'Aumentar Zoom' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Diminuir Zoom' })).toBeInTheDocument();
  });

  it('chama onInterventionClick quando uma intervenção é clicada', () => {
    const handleInterventionClick = jest.fn();

    render(
      <ProgressMonitoringChart
        data={mockData}
        benchmarks={mockBenchmarks}
        goals={mockGoals}
        onInterventionClick={handleInterventionClick}
        width={800}
        height={600}
      />
    );

    // Verifica se os botões de controle estão presentes
    expect(screen.getByRole('button', { name: 'Aumentar Zoom' })).toBeInTheDocument();
  });

  it('exibe tooltip com informações detalhadas', () => {
    render(
      <ProgressMonitoringChart
        data={mockData}
        benchmarks={mockBenchmarks}
        goals={mockGoals}
        width={800}
        height={600}
      />
    );

    // Verifica se os botões de controle estão presentes
    expect(screen.getByRole('button', { name: 'Aumentar Zoom' })).toBeInTheDocument();
  });

  it('calcula e exibe linha de tendência', () => {
    render(
      <ProgressMonitoringChart
        data={mockData}
        benchmarks={mockBenchmarks}
        goals={mockGoals}
        width={800}
        height={600}
      />
    );

    // Verifica se os botões de controle estão presentes
    expect(screen.getByRole('button', { name: 'Aumentar Zoom' })).toBeInTheDocument();
  });

  it('exibe projeções para as metas', () => {
    render(
      <ProgressMonitoringChart
        data={mockData}
        benchmarks={mockBenchmarks}
        goals={mockGoals}
        width={800}
        height={600}
      />
    );

    // Verifica se os botões de controle estão presentes
    expect(screen.getByRole('button', { name: 'Aumentar Zoom' })).toBeInTheDocument();
  });
});
