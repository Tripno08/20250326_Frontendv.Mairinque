import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MeetingDashboard } from '../MeetingDashboard';
import { Meeting } from '@/types/meeting';

describe('MeetingDashboard', () => {
  const mockMeetings: Meeting[] = [
    {
      id: '1',
      title: 'Reunião 1',
      type: 'rti',
      description: 'Descrição da reunião 1',
      startDate: new Date('2024-03-30T10:00'),
      endDate: new Date('2024-03-30T11:00'),
      status: 'completed',
      participants: [
        {
          id: '1',
          name: 'João Silva',
          role: 'Professor',
          status: 'confirmed',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      decisions: [
        {
          id: '1',
          description: 'Decisão 1',
          assignedTo: 'João Silva',
          dueDate: new Date('2024-04-01'),
          status: 'completed',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      notes: [],
      agenda: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '2',
      title: 'Reunião 2',
      type: 'rti',
      description: 'Descrição da reunião 2',
      startDate: new Date('2024-04-01T14:00'),
      endDate: new Date('2024-04-01T15:00'),
      status: 'scheduled',
      participants: [
        {
          id: '2',
          name: 'Maria Santos',
          role: 'Coordenadora',
          status: 'pending',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      decisions: [
        {
          id: '2',
          description: 'Decisão 2',
          assignedTo: 'Maria Santos',
          dueDate: new Date('2024-04-15'),
          status: 'pending',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      notes: [],
      agenda: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  const mockOnMeetingSelect = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve renderizar estatísticas gerais', () => {
    render(<MeetingDashboard meetings={mockMeetings} onMeetingSelect={mockOnMeetingSelect} />);

    expect(screen.getByText('2')).toBeInTheDocument(); // Total de reuniões
    expect(screen.getByText('1')).toBeInTheDocument(); // Reuniões concluídas
    expect(screen.getByText('1')).toBeInTheDocument(); // Reuniões agendadas
    expect(screen.getByText('0')).toBeInTheDocument(); // Reuniões em andamento
  });

  it('deve renderizar próximas reuniões', () => {
    render(<MeetingDashboard meetings={mockMeetings} onMeetingSelect={mockOnMeetingSelect} />);

    expect(screen.getByText('Reunião 2')).toBeInTheDocument();
    expect(screen.getByText('01/04/2024 14:00')).toBeInTheDocument();
    expect(screen.getByText('Agendada')).toBeInTheDocument();
  });

  it('deve renderizar decisões pendentes', () => {
    render(<MeetingDashboard meetings={mockMeetings} onMeetingSelect={mockOnMeetingSelect} />);

    expect(screen.getByText('Decisão 2')).toBeInTheDocument();
    expect(screen.getByText('Maria Santos')).toBeInTheDocument();
    expect(screen.getByText('15/04/2024')).toBeInTheDocument();
    expect(screen.getByText('Pendente')).toBeInTheDocument();
  });

  it('deve mostrar progresso das reuniões', () => {
    render(<MeetingDashboard meetings={mockMeetings} onMeetingSelect={mockOnMeetingSelect} />);

    // Reunião 1: 100% de progresso (1 decisão concluída)
    expect(screen.getByText('100%')).toBeInTheDocument();

    // Reunião 2: 0% de progresso (1 decisão pendente)
    expect(screen.getByText('0%')).toBeInTheDocument();
  });

  it('deve ordenar próximas reuniões por data', () => {
    const meetingsWithDifferentDates = [
      {
        ...mockMeetings[0],
        startDate: new Date('2024-04-02T10:00'),
      },
      {
        ...mockMeetings[1],
        startDate: new Date('2024-04-01T14:00'),
      },
    ];

    render(
      <MeetingDashboard
        meetings={meetingsWithDifferentDates}
        onMeetingSelect={mockOnMeetingSelect}
      />
    );

    const meetingTitles = screen.getAllByRole('heading', { level: 6 });
    expect(meetingTitles[0]).toHaveTextContent('Reunião 2');
    expect(meetingTitles[1]).toHaveTextContent('Reunião 1');
  });

  it('deve ordenar decisões pendentes por data de entrega', () => {
    const meetingsWithDifferentDueDates = [
      {
        ...mockMeetings[0],
        decisions: [
          {
            ...mockMeetings[0].decisions[0],
            dueDate: new Date('2024-04-30'),
          },
        ],
      },
      {
        ...mockMeetings[1],
        decisions: [
          {
            ...mockMeetings[1].decisions[0],
            dueDate: new Date('2024-04-15'),
          },
        ],
      },
    ];

    render(
      <MeetingDashboard
        meetings={meetingsWithDifferentDueDates}
        onMeetingSelect={mockOnMeetingSelect}
      />
    );

    const decisionDescriptions = screen.getAllByText(/Decisão/);
    expect(decisionDescriptions[0]).toHaveTextContent('Decisão 2');
    expect(decisionDescriptions[1]).toHaveTextContent('Decisão 1');
  });

  it('deve chamar onMeetingSelect ao clicar em uma reunião', () => {
    render(<MeetingDashboard meetings={mockMeetings} onMeetingSelect={mockOnMeetingSelect} />);

    const meetingLinks = screen.getAllByRole('link');
    fireEvent.click(meetingLinks[0]);

    expect(mockOnMeetingSelect).toHaveBeenCalledWith(mockMeetings[0].id);
  });
});
