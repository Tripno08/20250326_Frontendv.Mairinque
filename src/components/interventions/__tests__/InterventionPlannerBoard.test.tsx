import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { InterventionPlannerBoard } from '../InterventionPlannerBoard';
import type { InterventionPlan } from '@/types/intervention-planner';
import type { Intervention } from '@/types/intervention';

const mockInterventions: Intervention[] = [
  {
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
      description: 'Efetiva para melhorar fluência'
    },
    imageUrl: '/images/test.jpg',
    tags: ['Leitura', 'Fluência']
  },
  {
    id: '2',
    title: 'Treinamento de Habilidades Sociais',
    description: 'Programa estruturado para desenvolver habilidades sociais.',
    tier: 'Tier 2',
    domain: 'Social',
    evidenceLevel: 'Média Evidência',
    duration: '45-60 minutos',
    materials: ['Cartões de cenários', 'Roteiros de role-play'],
    steps: ['Apresentar cenário', 'Demonstrar comportamento'],
    effectiveness: {
      rating: 4.0,
      studies: 8,
      description: 'Efetiva para melhorar interações'
    },
    imageUrl: '/images/social.jpg',
    tags: ['Habilidades Sociais', 'Comunicação']
  }
];

const mockEmptyPlan: InterventionPlan = {
  title: 'Plano de Teste',
  description: 'Descrição do plano de teste',
  studentId: 'student-123',
  items: [],
  status: 'draft',
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockPlanWithItems: InterventionPlan = {
  ...mockEmptyPlan,
  items: [
    {
      id: 'item-1',
      intervention: mockInterventions[0],
      position: 0,
    }
  ],
};

// Mock do useDroppable, useDraggable e useSortable
jest.mock('@dnd-kit/core', () => ({
  ...jest.requireActual('@dnd-kit/core'),
  DndContext: ({ children }: any) => <div data-testid="dnd-context">{children}</div>,
  DragOverlay: ({ children }: any) => <div data-testid="drag-overlay">{children || null}</div>,
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
  useDroppable: () => ({
    setNodeRef: jest.fn(),
    isOver: false,
    active: null,
  }),
}));

jest.mock('@dnd-kit/sortable', () => ({
  ...jest.requireActual('@dnd-kit/sortable'),
  SortableContext: ({ children }: any) => <div data-testid="sortable-context">{children}</div>,
  useSortable: () => ({
    attributes: {
      'aria-describedby': 'sortable-description',
    },
    listeners: {
      onMouseDown: jest.fn(),
      onTouchStart: jest.fn(),
    },
    setNodeRef: jest.fn(),
    transform: null,
    transition: null,
    isDragging: false,
  }),
}));

describe('InterventionPlannerBoard', () => {
  const mockOnPlanUpdate = jest.fn();
  const mockOnSave = jest.fn();

  beforeEach(() => {
    mockOnPlanUpdate.mockClear();
    mockOnSave.mockClear();
    jest.clearAllMocks();
  });

  it('renderiza o componente corretamente com plano vazio', () => {
    render(
      <InterventionPlannerBoard
        plan={mockEmptyPlan}
        interventionsLibrary={mockInterventions}
        onPlanUpdate={mockOnPlanUpdate}
        onSave={mockOnSave}
      />
    );

    // Verifica se o título do componente está presente
    expect(screen.getByText('Planejador de Intervenções')).toBeInTheDocument();

    // Verifica se o título do plano está presente
    expect(screen.getByText(mockEmptyPlan.title)).toBeInTheDocument();

    // Verifica se o DndContext está presente
    expect(screen.getByTestId('dnd-context')).toBeInTheDocument();

    // Verifica se o SortableContext está presente
    expect(screen.getByTestId('sortable-context')).toBeInTheDocument();

    // Verifica se a área de soltar está presente
    expect(screen.getByText('Arraste intervenções para cá')).toBeInTheDocument();

    // Verifica se a biblioteca de intervenções está presente
    expect(screen.getByText('Biblioteca de Intervenções')).toBeInTheDocument();

    // Verifica se os itens da biblioteca estão presentes
    expect(screen.getByText('Prática de Leitura Guiada')).toBeInTheDocument();
    expect(screen.getByText('Treinamento de Habilidades Sociais')).toBeInTheDocument();
  });

  it('renderiza o componente corretamente com plano com itens', () => {
    render(
      <InterventionPlannerBoard
        plan={mockPlanWithItems}
        interventionsLibrary={mockInterventions}
        onPlanUpdate={mockOnPlanUpdate}
        onSave={mockOnSave}
      />
    );

    // Verifica se não mostra a mensagem de "Arraste intervenções para cá"
    expect(screen.queryByText('Arraste intervenções para cá')).not.toBeInTheDocument();
  });

  it('permite pesquisar na biblioteca de intervenções', () => {
    render(
      <InterventionPlannerBoard
        plan={mockEmptyPlan}
        interventionsLibrary={mockInterventions}
        onPlanUpdate={mockOnPlanUpdate}
        onSave={mockOnSave}
      />
    );

    // Encontra o campo de pesquisa
    const searchInput = screen.getByLabelText('Pesquisar intervenções');

    // Digita um termo de pesquisa que corresponde apenas a uma intervenção
    fireEvent.change(searchInput, { target: { value: 'Habilidades Sociais' } });

    // Verifica se apenas a intervenção correspondente está visível
    expect(screen.getByText('Treinamento de Habilidades Sociais')).toBeInTheDocument();
    expect(screen.queryByText('Prática de Leitura Guiada')).not.toBeInTheDocument();
  });

  it('permite salvar o plano', () => {
    render(
      <InterventionPlannerBoard
        plan={mockPlanWithItems}
        interventionsLibrary={mockInterventions}
        onPlanUpdate={mockOnPlanUpdate}
        onSave={mockOnSave}
      />
    );

    // Encontra e clica no botão de salvar
    const saveButton = screen.getByText('Salvar Plano');
    fireEvent.click(saveButton);

    // Verifica se a função de salvar foi chamada
    expect(mockOnSave).toHaveBeenCalledTimes(1);
  });

  it('desabilita o botão de salvar quando não há itens no plano', () => {
    render(
      <InterventionPlannerBoard
        plan={mockEmptyPlan}
        interventionsLibrary={mockInterventions}
        onPlanUpdate={mockOnPlanUpdate}
        onSave={mockOnSave}
      />
    );

    // Encontra o botão de salvar e verifica se está desabilitado
    const saveButton = screen.getByText('Salvar Plano');
    expect(saveButton).toBeDisabled();
  });
});
