import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MeetingScheduler } from '../MeetingScheduler';
import { MeetingType } from '@/types/meeting';

describe('MeetingScheduler', () => {
  const mockOnSchedule = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve renderizar o botão de agendamento', () => {
    render(<MeetingScheduler onSchedule={mockOnSchedule} />);
    expect(screen.getByText('Agendar Reunião')).toBeInTheDocument();
  });

  it('deve abrir o diálogo ao clicar no botão', () => {
    render(<MeetingScheduler onSchedule={mockOnSchedule} />);
    fireEvent.click(screen.getByText('Agendar Reunião'));
    expect(screen.getByText('Agendar Nova Reunião')).toBeInTheDocument();
  });

  it('deve fechar o diálogo ao clicar em cancelar', () => {
    render(<MeetingScheduler onSchedule={mockOnSchedule} />);
    fireEvent.click(screen.getByText('Agendar Reunião'));
    fireEvent.click(screen.getByText('Cancelar'));
    expect(screen.queryByText('Agendar Nova Reunião')).not.toBeInTheDocument();
  });

  it('deve validar campos obrigatórios', async () => {
    render(<MeetingScheduler onSchedule={mockOnSchedule} />);
    fireEvent.click(screen.getByText('Agendar Reunião'));
    fireEvent.click(screen.getByText('Agendar'));
    expect(mockOnSchedule).not.toHaveBeenCalled();
  });

  it('deve chamar onSchedule com os dados do formulário', async () => {
    render(<MeetingScheduler onSchedule={mockOnSchedule} />);
    fireEvent.click(screen.getByText('Agendar Reunião'));

    // Preencher formulário
    fireEvent.change(screen.getByLabelText('Título'), {
      target: { value: 'Reunião de Teste' },
    });
    fireEvent.change(screen.getByLabelText('Descrição'), {
      target: { value: 'Descrição da reunião' },
    });
    fireEvent.change(screen.getByLabelText('Tipo de Reunião'), {
      target: { value: 'rti' },
    });

    // Selecionar datas
    const startDateInput = screen.getByLabelText('Data e Hora de Início');
    const endDateInput = screen.getByLabelText('Data e Hora de Término');

    fireEvent.change(startDateInput, {
      target: { value: '2024-03-30T10:00' },
    });
    fireEvent.change(endDateInput, {
      target: { value: '2024-03-30T11:00' },
    });

    // Submeter formulário
    fireEvent.click(screen.getByText('Agendar'));

    await waitFor(() => {
      expect(mockOnSchedule).toHaveBeenCalledWith({
        title: 'Reunião de Teste',
        type: 'rti' as MeetingType,
        description: 'Descrição da reunião',
        startDate: expect.any(Date),
        endDate: expect.any(Date),
        status: 'scheduled',
        participants: [],
        decisions: [],
        notes: [],
        agenda: [],
      });
    });
  });

  it('deve limpar o formulário após agendar', async () => {
    render(<MeetingScheduler onSchedule={mockOnSchedule} />);
    fireEvent.click(screen.getByText('Agendar Reunião'));

    // Preencher formulário
    fireEvent.change(screen.getByLabelText('Título'), {
      target: { value: 'Reunião de Teste' },
    });
    fireEvent.change(screen.getByLabelText('Descrição'), {
      target: { value: 'Descrição da reunião' },
    });
    fireEvent.change(screen.getByLabelText('Tipo de Reunião'), {
      target: { value: 'rti' },
    });

    // Selecionar datas
    const startDateInput = screen.getByLabelText('Data e Hora de Início');
    const endDateInput = screen.getByLabelText('Data e Hora de Término');

    fireEvent.change(startDateInput, {
      target: { value: '2024-03-30T10:00' },
    });
    fireEvent.change(endDateInput, {
      target: { value: '2024-03-30T11:00' },
    });

    // Submeter formulário
    fireEvent.click(screen.getByText('Agendar'));

    await waitFor(() => {
      expect(mockOnSchedule).toHaveBeenCalled();
    });

    // Reabrir diálogo
    fireEvent.click(screen.getByText('Agendar Reunião'));

    // Verificar se campos estão vazios
    expect(screen.getByLabelText('Título')).toHaveValue('');
    expect(screen.getByLabelText('Descrição')).toHaveValue('');
    expect(screen.getByLabelText('Tipo de Reunião')).toHaveValue('rti');
  });
});
