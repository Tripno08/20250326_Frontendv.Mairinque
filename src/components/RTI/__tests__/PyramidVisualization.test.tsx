import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { PyramidVisualization } from '../PyramidVisualization';
import { PyramidData } from '@/types/rti';

const mockData: PyramidData = {
  totalStudents: 1000,
  levels: [
    {
      id: 'tier1',
      name: 'Tier 1',
      description: 'Descrição Tier 1',
      color: '#4CAF50',
      percentage: 80,
      students: 800,
      interventions: ['Intervenção 1', 'Intervenção 2'],
    },
    {
      id: 'tier2',
      name: 'Tier 2',
      description: 'Descrição Tier 2',
      color: '#FFC107',
      percentage: 15,
      students: 150,
      interventions: ['Intervenção 3', 'Intervenção 4'],
    },
    {
      id: 'tier3',
      name: 'Tier 3',
      description: 'Descrição Tier 3',
      color: '#F44336',
      percentage: 5,
      students: 50,
      interventions: ['Intervenção 5', 'Intervenção 6'],
    },
  ],
};

describe('PyramidVisualization', () => {
  it('renderiza o componente corretamente', () => {
    render(<PyramidVisualization data={mockData} />);
    expect(screen.getByRole('img')).toBeInTheDocument();
  });

  it('exibe os níveis da pirâmide', () => {
    render(<PyramidVisualization data={mockData} />);
    mockData.levels.forEach((level) => {
      expect(screen.getByText(level.name)).toBeInTheDocument();
      expect(screen.getByText(`${level.percentage.toFixed(1)}%`)).toBeInTheDocument();
      expect(screen.getByText(`${level.students} alunos`)).toBeInTheDocument();
    });
  });

  it('chama onLevelClick quando um nível é clicado', async () => {
    const handleClick = jest.fn();
    render(<PyramidVisualization data={mockData} onLevelClick={handleClick} />);

    const tier1Element = screen.getByText('Tier 1');
    fireEvent.click(tier1Element);

    await waitFor(() => {
      expect(handleClick).toHaveBeenCalledWith(mockData.levels[0]);
    });
  });

  it('exibe detalhes do nível ao clicar', async () => {
    render(<PyramidVisualization data={mockData} />);

    const tier1Element = screen.getByText('Tier 1');
    fireEvent.click(tier1Element);

    await waitFor(() => {
      expect(screen.getByText('Descrição Tier 1')).toBeInTheDocument();
      expect(screen.getByText('Intervenção 1')).toBeInTheDocument();
      expect(screen.getByText('Intervenção 2')).toBeInTheDocument();
    });
  });

  it('fecha os detalhes ao clicar no botão de fechar', async () => {
    render(<PyramidVisualization data={mockData} />);

    // Abre os detalhes
    const tier1Element = screen.getByText('Tier 1');
    fireEvent.click(tier1Element);

    // Fecha os detalhes
    const closeButton = screen.getByText('✕');
    fireEvent.click(closeButton);

    await waitFor(() => {
      expect(screen.queryByText('Descrição Tier 1')).not.toBeInTheDocument();
    });
  });

  it('aplica hover effect ao passar o mouse sobre um nível', async () => {
    render(<PyramidVisualization data={mockData} />);

    const tier1Element = screen.getByText('Tier 1');
    fireEvent.mouseEnter(tier1Element);

    await waitFor(() => {
      const rect = tier1Element.parentElement?.querySelector('rect');
      expect(rect).toHaveAttribute('opacity', '1');
    });
  });

  it('remove hover effect ao sair do mouse', async () => {
    render(<PyramidVisualization data={mockData} />);

    const tier1Element = screen.getByText('Tier 1');
    fireEvent.mouseEnter(tier1Element);
    fireEvent.mouseLeave(tier1Element);

    await waitFor(() => {
      const rect = tier1Element.parentElement?.querySelector('rect');
      expect(rect).toHaveAttribute('opacity', '0.8');
    });
  });
}); 