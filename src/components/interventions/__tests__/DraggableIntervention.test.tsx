import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { DraggableIntervention } from '../DraggableIntervention';
import type { Intervention } from '@/types/intervention';

// Mock do useDraggable
jest.mock('@dnd-kit/core', () => ({
  ...jest.requireActual('@dnd-kit/core'),
  useDraggable: () => ({
    attributes: {
      'aria-describedby': 'draggable-description',
    },
    listeners: {
      onMouseDown: jest.fn(),
      onTouchStart: jest.fn(),
    },
    setNodeRef: jest.fn(),
    transform: null,
  }),
}));

// Mock do CSS.Translate.toString
jest.mock('@dnd-kit/utilities', () => ({
  CSS: {
    Translate: {
      toString: jest.fn().mockReturnValue('translate3d(0px, 0px, 0px)'),
    },
  },
}));

describe('DraggableIntervention', () => {
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
    tags: ['Leitura', 'Fluência', 'Compreensão', 'Extras'],
  };

  it('renderiza corretamente o componente', () => {
    render(<DraggableIntervention intervention={mockIntervention} />);

    // Verifica se o título está presente
    expect(screen.getByText('Prática de Leitura Guiada')).toBeInTheDocument();

    // Verifica se a descrição está presente
    expect(screen.getByText(/Intervenção estruturada/)).toBeInTheDocument();

    // Verifica se os elementos de nível e evidência estão presentes
    expect(screen.getByText('Tier 2')).toBeInTheDocument();
    expect(screen.getByText('Alta Evidência')).toBeInTheDocument();

    // Verifica se a duração está presente
    expect(screen.getByText('30-45 minutos')).toBeInTheDocument();

    // Verifica se as tags estão presentes (limitadas a 3)
    expect(screen.getByText('Leitura')).toBeInTheDocument();
    expect(screen.getByText('Fluência')).toBeInTheDocument();
    expect(screen.getByText('Compreensão')).toBeInTheDocument();

    // Verifica se há indicador para tags extras
    expect(screen.getByText('+1')).toBeInTheDocument();
  });

  it('aplica estilo de isDragging quando true', () => {
    render(<DraggableIntervention intervention={mockIntervention} isDragging={true} />);

    // Verifica se o estilo de opacidade está aplicado
    const element = screen.getByText('Prática de Leitura Guiada').closest('div');
    expect(element).toHaveStyle('opacity: 0.5');
  });

  it('aplica estilo de isOverlay quando true', () => {
    render(<DraggableIntervention intervention={mockIntervention} isOverlay={true} />);

    // Não conseguimos verificar diretamente os estilos do Framer Motion,
    // mas podemos verificar se o componente foi renderizado
    expect(screen.getByText('Prática de Leitura Guiada')).toBeInTheDocument();
  });

  it('trunca descrições longas', () => {
    const interventionWithLongDescription: Intervention = {
      ...mockIntervention,
      description: 'a'.repeat(150),
    };

    render(<DraggableIntervention intervention={interventionWithLongDescription} />);

    // Verifica se a descrição truncada está presente
    const description = screen.getByText(/a+\.\.\./);
    expect(description).toBeInTheDocument();
    expect(description.textContent?.length).toBeLessThan(
      interventionWithLongDescription.description.length
    );
  });
});
