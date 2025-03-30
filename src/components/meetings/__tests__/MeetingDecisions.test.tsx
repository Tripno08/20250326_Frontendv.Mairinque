import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MeetingDecisions } from '../MeetingDecisions';
import { Decision } from '@/types/meeting';

describe('MeetingDecisions', () => {
  const mockDecisions: Decision[] = [
    {
      id: '1',
      description: 'Decisão 1',
      assignedTo: 'João Silva',
      dueDate: new Date('2024-04-01'),
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '2',
      description: 'Decisão 2',
      assignedTo: 'Maria Santos',
      dueDate: new Date('2024-04-15'),
      status: 'completed',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  const mockOnUpdate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve renderizar a lista de decisões', () => {
    render(<MeetingDecisions decisions={mockDecisions} onUpdate={mockOnUpdate} />);

    expect(screen.getByText('Decisão 1')).toBeInTheDocument();
    expect(screen.getByText('João Silva')).toBeInTheDocument();
    expect(screen.getByText('Decisão 2')).toBeInTheDocument();
    expect(screen.getByText('Maria Santos')).toBeInTheDocument();
  });

  it('deve abrir o diálogo de edição ao clicar em editar', () => {
    render(<MeetingDecisions decisions={mockDecisions} onUpdate={mockOnUpdate} />);

    const editButtons = screen.getAllByLabelText('Editar decisão');
    fireEvent.click(editButtons[0]);

    expect(screen.getByText('Editar Decisão')).toBeInTheDocument();
  });

  it('deve fechar o diálogo ao clicar em cancelar', () => {
    render(<MeetingDecisions decisions={mockDecisions} onUpdate={mockOnUpdate} />);

    const editButtons = screen.getAllByLabelText('Editar decisão');
    fireEvent.click(editButtons[0]);
    fireEvent.click(screen.getByText('Cancelar'));

    expect(screen.queryByText('Editar Decisão')).not.toBeInTheDocument();
  });

  it('deve chamar onUpdate ao salvar alterações', () => {
    render(<MeetingDecisions decisions={mockDecisions} onUpdate={mockOnUpdate} />);

    const editButtons = screen.getAllByLabelText('Editar decisão');
    fireEvent.click(editButtons[0]);

    // Alterar campos
    fireEvent.change(screen.getByLabelText('Descrição'), {
      target: { value: 'Decisão 1 Atualizada' },
    });
    fireEvent.change(screen.getByLabelText('Responsável'), {
      target: { value: 'Pedro Oliveira' },
    });
    fireEvent.change(screen.getByLabelText('Data de Entrega'), {
      target: { value: '2024-04-30' },
    });

    fireEvent.click(screen.getByText('Salvar'));

    expect(mockOnUpdate).toHaveBeenCalledWith({
      ...mockDecisions[0],
      description: 'Decisão 1 Atualizada',
      assignedTo: 'Pedro Oliveira',
      dueDate: new Date('2024-04-30'),
    });
  });

  it('deve atualizar status da decisão ao clicar no checkbox', () => {
    render(<MeetingDecisions decisions={mockDecisions} onUpdate={mockOnUpdate} />);

    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[0]); // Marcar primeira decisão como concluída

    expect(mockOnUpdate).toHaveBeenCalledWith({
      ...mockDecisions[0],
      status: 'completed',
    });
  });

  it('deve mostrar o status correto para cada decisão', () => {
    render(<MeetingDecisions decisions={mockDecisions} onUpdate={mockOnUpdate} />);

    const statusIndicators = screen.getAllByRole('status');
    expect(statusIndicators[0]).toHaveTextContent('Pendente');
    expect(statusIndicators[1]).toHaveTextContent('Concluída');
  });

  it('deve calcular corretamente as estatísticas de decisões', () => {
    render(<MeetingDecisions decisions={mockDecisions} onUpdate={mockOnUpdate} />);

    expect(screen.getByText('1 Pendente')).toBeInTheDocument();
    expect(screen.getByText('1 Concluída')).toBeInTheDocument();
    expect(screen.getByText('0 Cancelada')).toBeInTheDocument();
  });
});
