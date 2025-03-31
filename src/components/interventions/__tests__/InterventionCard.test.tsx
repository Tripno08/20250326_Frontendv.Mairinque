import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { InterventionCard } from '../InterventionCard';
import type { Intervention } from '@/types/intervention';

const mockIntervention: Intervention = {
  id: '1',
  title: 'Prática de Leitura Guiada',
  description: 'Intervenção estruturada para melhorar a fluência e compreensão leitora.',
  tier: 'Tier 2',
  domain: 'Acadêmico',
  evidenceLevel: 'Alta Evidência',
  duration: '30-45 minutos',
  materials: ['Textos nivelados', 'Fichas de registro'],
  steps: ['Selecionar texto', 'Estabelecer objetivos'],
  effectiveness: {
    rating: 4.5,
    studies: 12,
    description: 'Efetiva para melhorar fluência',
  },
  imageUrl: '/images/test.jpg',
  tags: ['Leitura', 'Fluência'],
};

describe('InterventionCard', () => {
  const mockOnClick = jest.fn();

  beforeEach(() => {
    mockOnClick.mockClear();
  });

  it('renderiza corretamente com todas as informações', () => {
    render(<InterventionCard intervention={mockIntervention} onClick={mockOnClick} />);

    // Verifica se o título está presente
    expect(screen.getByText('Prática de Leitura Guiada')).toBeInTheDocument();

    // Verifica se a descrição está presente
    expect(screen.getByText(/Intervenção estruturada/)).toBeInTheDocument();

    // Verifica se os elementos de nível e evidência estão presentes
    expect(screen.getByText('Tier 2')).toBeInTheDocument();
    expect(screen.getByText('Alta Evidência')).toBeInTheDocument();

    // Verifica se as tags estão presentes
    expect(screen.getByText('Leitura')).toBeInTheDocument();
    expect(screen.getByText('Fluência')).toBeInTheDocument();
  });

  it('chama onClick quando clicado', () => {
    render(<InterventionCard intervention={mockIntervention} onClick={mockOnClick} />);

    fireEvent.click(screen.getByText('Prática de Leitura Guiada').closest('div')!);
    expect(mockOnClick).toHaveBeenCalledTimes(1);
    expect(mockOnClick).toHaveBeenCalledWith(mockIntervention);
  });

  it('aplica classes CSS personalizadas', () => {
    const customClass = 'custom-class';
    render(
      <InterventionCard
        intervention={mockIntervention}
        onClick={mockOnClick}
        className={customClass}
      />
    );

    const card = screen.getByTestId('intervention-card');
    expect(card).toHaveClass(customClass);
  });

  it('renderiza sem imagem quando imageUrl não é fornecido', () => {
    const interventionWithoutImage = {
      ...mockIntervention,
      imageUrl: '',
    };

    render(<InterventionCard intervention={interventionWithoutImage} onClick={mockOnClick} />);

    // Verifica se o elemento de imagem não está presente
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('renderiza com a imagem quando imageUrl é fornecido', () => {
    render(<InterventionCard intervention={mockIntervention} onClick={mockOnClick} />);

    const image = screen.getByRole('img');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', '/images/test.jpg');
    expect(image).toHaveAttribute('alt', 'Prática de Leitura Guiada');
  });
});
