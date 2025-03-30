import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MeetingAttendance } from '../MeetingAttendance';
import { Participant } from '@/types/meeting';

describe('MeetingAttendance', () => {
  const mockParticipants: Participant[] = [
    {
      id: '1',
      name: 'João Silva',
      role: 'Professor',
      status: 'confirmed',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '2',
      name: 'Maria Santos',
      role: 'Coordenadora',
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  const mockOnUpdate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve renderizar a lista de participantes', () => {
    render(<MeetingAttendance participants={mockParticipants} onUpdate={mockOnUpdate} />);

    expect(screen.getByText('João Silva')).toBeInTheDocument();
    expect(screen.getByText('Professor')).toBeInTheDocument();
    expect(screen.getByText('Maria Santos')).toBeInTheDocument();
    expect(screen.getByText('Coordenadora')).toBeInTheDocument();
  });

  it('deve atualizar status do participante ao clicar no botão de presença', () => {
    render(<MeetingAttendance participants={mockParticipants} onUpdate={mockOnUpdate} />);

    const presenceButtons = screen.getAllByLabelText('Confirmar presença');
    fireEvent.click(presenceButtons[1]); // Maria Santos

    expect(mockOnUpdate).toHaveBeenCalledWith({
      ...mockParticipants[1],
      status: 'confirmed',
    });
  });

  it('deve atualizar status do participante ao clicar no botão de ausência', () => {
    render(<MeetingAttendance participants={mockParticipants} onUpdate={mockOnUpdate} />);

    const absenceButtons = screen.getAllByLabelText('Declinar presença');
    fireEvent.click(absenceButtons[0]); // João Silva

    expect(mockOnUpdate).toHaveBeenCalledWith({
      ...mockParticipants[0],
      status: 'declined',
    });
  });

  it('deve mostrar o status correto para cada participante', () => {
    render(<MeetingAttendance participants={mockParticipants} onUpdate={mockOnUpdate} />);

    const statusIndicators = screen.getAllByRole('status');
    expect(statusIndicators[0]).toHaveTextContent('Confirmado');
    expect(statusIndicators[1]).toHaveTextContent('Pendente');
  });

  it('deve calcular corretamente as estatísticas de presença', () => {
    render(<MeetingAttendance participants={mockParticipants} onUpdate={mockOnUpdate} />);

    expect(screen.getByText('1 Confirmado')).toBeInTheDocument();
    expect(screen.getByText('1 Pendente')).toBeInTheDocument();
    expect(screen.getByText('0 Declinado')).toBeInTheDocument();
  });

  it('deve atualizar estatísticas ao mudar status dos participantes', () => {
    render(<MeetingAttendance participants={mockParticipants} onUpdate={mockOnUpdate} />);

    // Maria Santos confirmada
    const presenceButtons = screen.getAllByLabelText('Confirmar presença');
    fireEvent.click(presenceButtons[1]);

    expect(screen.getByText('2 Confirmados')).toBeInTheDocument();
    expect(screen.getByText('0 Pendentes')).toBeInTheDocument();
    expect(screen.getByText('0 Declinados')).toBeInTheDocument();
  });
});
