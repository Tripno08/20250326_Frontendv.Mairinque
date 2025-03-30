import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MeetingAgenda } from '../MeetingAgenda';
import { AgendaItem } from '@/types/meeting';

describe('MeetingAgenda', () => {
  const mockAgenda: AgendaItem[] = [
    {
      id: '1',
      title: 'Item 1',
      description: 'Descrição do item 1',
      duration: 30,
      order: 1,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '2',
      title: 'Item 2',
      description: 'Descrição do item 2',
      duration: 45,
      order: 2,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  const mockOnUpdate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve renderizar a lista de itens da agenda', () => {
    render(<MeetingAgenda agenda={mockAgenda} onUpdate={mockOnUpdate} />);

    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Descrição do item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
    expect(screen.getByText('Descrição do item 2')).toBeInTheDocument();
  });

  it('deve abrir o diálogo de edição ao clicar em editar', () => {
    render(<MeetingAgenda agenda={mockAgenda} onUpdate={mockOnUpdate} />);

    const editButtons = screen.getAllByLabelText('Editar item');
    fireEvent.click(editButtons[0]);

    expect(screen.getByText('Editar Item da Agenda')).toBeInTheDocument();
  });

  it('deve fechar o diálogo ao clicar em cancelar', () => {
    render(<MeetingAgenda agenda={mockAgenda} onUpdate={mockOnUpdate} />);

    const editButtons = screen.getAllByLabelText('Editar item');
    fireEvent.click(editButtons[0]);
    fireEvent.click(screen.getByText('Cancelar'));

    expect(screen.queryByText('Editar Item da Agenda')).not.toBeInTheDocument();
  });

  it('deve chamar onUpdate ao salvar alterações', () => {
    render(<MeetingAgenda agenda={mockAgenda} onUpdate={mockOnUpdate} />);

    const editButtons = screen.getAllByLabelText('Editar item');
    fireEvent.click(editButtons[0]);

    // Alterar campos
    fireEvent.change(screen.getByLabelText('Título'), {
      target: { value: 'Item 1 Atualizado' },
    });
    fireEvent.change(screen.getByLabelText('Descrição'), {
      target: { value: 'Descrição atualizada' },
    });
    fireEvent.change(screen.getByLabelText('Duração (minutos)'), {
      target: { value: '60' },
    });

    fireEvent.click(screen.getByText('Salvar'));

    expect(mockOnUpdate).toHaveBeenCalledWith({
      ...mockAgenda[0],
      title: 'Item 1 Atualizado',
      description: 'Descrição atualizada',
      duration: 60,
    });
  });

  it('deve reordenar itens ao mover para cima', () => {
    render(<MeetingAgenda agenda={mockAgenda} onUpdate={mockOnUpdate} />);

    const moveUpButtons = screen.getAllByLabelText('Mover para cima');
    fireEvent.click(moveUpButtons[1]); // Mover segundo item para cima

    expect(mockOnUpdate).toHaveBeenCalledWith({
      ...mockAgenda[1],
      order: 1,
    });
    expect(mockOnUpdate).toHaveBeenCalledWith({
      ...mockAgenda[0],
      order: 2,
    });
  });

  it('deve reordenar itens ao mover para baixo', () => {
    render(<MeetingAgenda agenda={mockAgenda} onUpdate={mockOnUpdate} />);

    const moveDownButtons = screen.getAllByLabelText('Mover para baixo');
    fireEvent.click(moveDownButtons[0]); // Mover primeiro item para baixo

    expect(mockOnUpdate).toHaveBeenCalledWith({
      ...mockAgenda[0],
      order: 2,
    });
    expect(mockOnUpdate).toHaveBeenCalledWith({
      ...mockAgenda[1],
      order: 1,
    });
  });

  it('deve atualizar status do item ao clicar no checkbox', () => {
    render(<MeetingAgenda agenda={mockAgenda} onUpdate={mockOnUpdate} />);

    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[0]);

    expect(mockOnUpdate).toHaveBeenCalledWith({
      ...mockAgenda[0],
      status: 'completed',
    });
  });
});
