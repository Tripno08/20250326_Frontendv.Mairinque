import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { CollaborativeEditor } from '../CollaborativeEditor';
import { Note } from '@/types/meeting';

describe('CollaborativeEditor', () => {
  const mockNotes: Note[] = [
    {
      id: '1',
      content: 'Nota 1',
      author: 'João Silva',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '2',
      content: 'Nota 2',
      author: 'Maria Santos',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  const mockOnUpdate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve renderizar a lista de notas', () => {
    render(<CollaborativeEditor notes={mockNotes} onUpdate={mockOnUpdate} />);

    expect(screen.getByText('Nota 1')).toBeInTheDocument();
    expect(screen.getByText('João Silva')).toBeInTheDocument();
    expect(screen.getByText('Nota 2')).toBeInTheDocument();
    expect(screen.getByText('Maria Santos')).toBeInTheDocument();
  });

  it('deve abrir o diálogo de edição ao clicar em editar', () => {
    render(<CollaborativeEditor notes={mockNotes} onUpdate={mockOnUpdate} />);

    const editButtons = screen.getAllByLabelText('Editar nota');
    fireEvent.click(editButtons[0]);

    expect(screen.getByText('Editar Nota')).toBeInTheDocument();
  });

  it('deve fechar o diálogo ao clicar em cancelar', () => {
    render(<CollaborativeEditor notes={mockNotes} onUpdate={mockOnUpdate} />);

    const editButtons = screen.getAllByLabelText('Editar nota');
    fireEvent.click(editButtons[0]);
    fireEvent.click(screen.getByText('Cancelar'));

    expect(screen.queryByText('Editar Nota')).not.toBeInTheDocument();
  });

  it('deve chamar onUpdate ao salvar alterações', () => {
    render(<CollaborativeEditor notes={mockNotes} onUpdate={mockOnUpdate} />);

    const editButtons = screen.getAllByLabelText('Editar nota');
    fireEvent.click(editButtons[0]);

    // Alterar conteúdo
    fireEvent.change(screen.getByLabelText('Conteúdo'), {
      target: { value: 'Nota 1 Atualizada' },
    });

    fireEvent.click(screen.getByText('Salvar'));

    expect(mockOnUpdate).toHaveBeenCalledWith({
      ...mockNotes[0],
      content: 'Nota 1 Atualizada',
    });
  });

  it('deve adicionar nova nota', () => {
    render(<CollaborativeEditor notes={mockNotes} onUpdate={mockOnUpdate} />);

    // Abrir diálogo de nova nota
    fireEvent.click(screen.getByText('Adicionar Nota'));

    // Preencher conteúdo
    fireEvent.change(screen.getByLabelText('Conteúdo'), {
      target: { value: 'Nova Nota' },
    });

    fireEvent.click(screen.getByText('Salvar'));

    expect(mockOnUpdate).toHaveBeenCalledWith({
      id: expect.any(String),
      content: 'Nova Nota',
      author: expect.any(String),
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });
  });

  it('deve excluir nota', () => {
    render(<CollaborativeEditor notes={mockNotes} onUpdate={mockOnUpdate} />);

    const deleteButtons = screen.getAllByLabelText('Excluir nota');
    fireEvent.click(deleteButtons[0]);

    expect(mockOnUpdate).toHaveBeenCalledWith(mockNotes[0].id);
  });

  it('deve mostrar data e hora de criação/atualização', () => {
    render(<CollaborativeEditor notes={mockNotes} onUpdate={mockOnUpdate} />);

    const timestamps = screen.getAllByText(/Criado em|Atualizado em/);
    expect(timestamps).toHaveLength(4); // 2 notas, cada uma com 2 timestamps
  });

  it('deve ordenar notas por data de atualização', () => {
    const notesWithDifferentDates = [
      {
        ...mockNotes[0],
        updatedAt: new Date('2024-03-01'),
      },
      {
        ...mockNotes[1],
        updatedAt: new Date('2024-03-02'),
      },
    ];

    render(<CollaborativeEditor notes={notesWithDifferentDates} onUpdate={mockOnUpdate} />);

    const noteContents = screen.getAllByRole('article');
    expect(noteContents[0]).toHaveTextContent('Nota 2');
    expect(noteContents[1]).toHaveTextContent('Nota 1');
  });
});
