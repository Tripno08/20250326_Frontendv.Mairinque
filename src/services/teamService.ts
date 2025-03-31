import {
  Team,
  TeamMember,
  TeamCase,
  TeamMessage,
  TeamMeeting,
  TeamMetrics,
  TeamFilters,
  CaseStatus,
  InterventionTier,
  TeamRole,
  Specialty,
} from '@/types/team';

// Dados mockados para desenvolvimento
const mockTeams: Team[] = [
  {
    id: '1',
    name: 'Equipe de Intervenção Precoce',
    description: 'Equipe focada em intervenções precoces de alfabetização e matemática',
    members: ['1', '2', '3', '4'],
    coordinator: '1',
    caseIds: ['1', '2', '3'],
    dateCreated: '2024-01-15T10:00:00Z',
    dateModified: '2024-03-28T14:30:00Z',
    isActive: true,
  },
  {
    id: '2',
    name: 'Equipe de Suporte Comportamental',
    description: 'Equipe especializada em intervenções comportamentais e socioemocionais',
    members: ['5', '6', '7', '8'],
    coordinator: '5',
    caseIds: ['4', '5', '6'],
    dateCreated: '2024-02-10T09:00:00Z',
    dateModified: '2024-03-15T11:20:00Z',
    isActive: true,
  },
];

const mockMembers: TeamMember[] = [
  {
    id: '1',
    name: 'Ana Silva',
    email: 'ana.silva@innerview.edu.br',
    role: TeamRole.COORDINATOR,
    specialties: [Specialty.READING, Specialty.WRITING],
    availability: [
      { weekday: 1, startTime: '08:00', endTime: '17:00' },
      { weekday: 3, startTime: '08:00', endTime: '17:00' },
      { weekday: 5, startTime: '08:00', endTime: '12:00' },
    ],
    maxCaseload: 15,
    currentCaseload: 8,
    avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
    bio: 'Especialista em alfabetização com 10 anos de experiência',
    isActive: true,
  },
  {
    id: '2',
    name: 'Carlos Mendes',
    email: 'carlos.mendes@innerview.edu.br',
    role: TeamRole.SPECIALIST,
    specialties: [Specialty.MATH],
    availability: [
      { weekday: 2, startTime: '09:00', endTime: '18:00' },
      { weekday: 4, startTime: '09:00', endTime: '18:00' },
    ],
    maxCaseload: 12,
    currentCaseload: 6,
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    bio: 'Especialista em matemática com foco em intervenções Tier 2',
    isActive: true,
  },
  // Adicione mais membros mock conforme necessário
];

const mockCases: TeamCase[] = [
  {
    id: '1',
    studentId: '101',
    studentName: 'João Pedro',
    description: 'Dificuldades em fluência de leitura e compreensão textual',
    tier: InterventionTier.TIER2,
    status: CaseStatus.IN_PROGRESS,
    priority: 'high',
    dateCreated: '2024-02-20T10:30:00Z',
    dateModified: '2024-03-25T14:15:00Z',
    assignedTo: ['1', '3'],
    domains: ['reading', 'comprehension'],
    notes: [
      'Avaliação inicial realizada em 25/02/2024',
      'Iniciou programa de fluência em 01/03/2024',
    ],
    documents: ['https://docs.innerview.edu.br/case1/assessment.pdf'],
  },
  {
    id: '2',
    studentId: '102',
    studentName: 'Maria Clara',
    description: 'Dificuldades em operações matemáticas básicas e resolução de problemas',
    tier: InterventionTier.TIER2,
    status: CaseStatus.IN_PROGRESS,
    priority: 'medium',
    dateCreated: '2024-02-22T09:15:00Z',
    dateModified: '2024-03-20T11:30:00Z',
    assignedTo: ['2', '4'],
    domains: ['math', 'problem_solving'],
    notes: ['Avaliação diagnóstica realizada em 26/02/2024'],
  },
  // Adicione mais casos mock conforme necessário
];

const mockMessages: TeamMessage[] = [
  {
    id: '1',
    sender: '1',
    recipients: ['2', '3', '4'],
    subject: 'Próxima reunião da equipe',
    content:
      'Olá, equipe! Nossa próxima reunião será sexta-feira às 14h. Vamos discutir os casos 1 e 2.',
    timestamp: '2024-03-27T10:00:00Z',
    isRead: true,
    priority: 'normal',
  },
  {
    id: '2',
    sender: '2',
    recipients: ['1'],
    subject: 'Dúvida sobre caso 1',
    content:
      'Ana, preciso de sua orientação sobre a abordagem de fluência de leitura para o João Pedro.',
    timestamp: '2024-03-28T09:45:00Z',
    isRead: false,
    caseId: '1',
    priority: 'important',
  },
  // Adicione mais mensagens mock conforme necessário
];

const mockMeetings: TeamMeeting[] = [
  {
    id: '1',
    title: 'Revisão de Casos Tier 2',
    description: 'Revisão bimestral dos casos de intervenção Tier 2',
    date: '2024-04-05',
    startTime: '14:00',
    endTime: '16:00',
    location: 'Sala de Reuniões 3',
    isVirtual: false,
    attendees: ['1', '2', '3', '4'],
    caseIds: ['1', '2'],
    agenda: '1. Análise de progresso\n2. Ajustes nos planos de intervenção\n3. Próximos passos',
    status: 'scheduled',
  },
  {
    id: '2',
    title: 'Planejamento de Intervenções',
    date: '2024-04-10',
    startTime: '10:00',
    endTime: '11:30',
    isVirtual: true,
    meetingUrl: 'https://meet.innerview.edu.br/room123',
    attendees: ['1', '2', '5'],
    caseIds: ['3'],
    status: 'scheduled',
  },
  // Adicione mais reuniões mock conforme necessário
];

const mockMetrics: Record<string, TeamMetrics> = {
  '1': {
    totalCases: 12,
    casesByStatus: {
      [CaseStatus.OPEN]: 2,
      [CaseStatus.ASSIGNED]: 1,
      [CaseStatus.IN_PROGRESS]: 5,
      [CaseStatus.UNDER_REVIEW]: 1,
      [CaseStatus.COMPLETED]: 2,
      [CaseStatus.CLOSED]: 1,
    },
    casesByTier: {
      [InterventionTier.TIER1]: 4,
      [InterventionTier.TIER2]: 6,
      [InterventionTier.TIER3]: 2,
    },
    averageResolutionTime: 21.5, // em dias
    memberPerformance: [
      {
        memberId: '1',
        casesAssigned: 8,
        casesCompleted: 3,
        averageResolutionTime: 18.2,
      },
      {
        memberId: '2',
        casesAssigned: 6,
        casesCompleted: 2,
        averageResolutionTime: 23.7,
      },
    ],
    meetingsPerMonth: 4,
    interventionEffectiveness: 76, // percentual
  },
  '2': {
    totalCases: 9,
    casesByStatus: {
      [CaseStatus.OPEN]: 1,
      [CaseStatus.ASSIGNED]: 2,
      [CaseStatus.IN_PROGRESS]: 3,
      [CaseStatus.UNDER_REVIEW]: 1,
      [CaseStatus.COMPLETED]: 1,
      [CaseStatus.CLOSED]: 1,
    },
    casesByTier: {
      [InterventionTier.TIER1]: 2,
      [InterventionTier.TIER2]: 5,
      [InterventionTier.TIER3]: 2,
    },
    averageResolutionTime: 24.3, // em dias
    memberPerformance: [
      {
        memberId: '5',
        casesAssigned: 7,
        casesCompleted: 2,
        averageResolutionTime: 22.1,
      },
      {
        memberId: '6',
        casesAssigned: 5,
        casesCompleted: 1,
        averageResolutionTime: 28.5,
      },
    ],
    meetingsPerMonth: 3,
    interventionEffectiveness: 68, // percentual
  },
};

// Simula delay de API
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Classe do serviço
export class TeamService {
  // Métodos para equipes
  async getTeams(): Promise<Team[]> {
    await delay(500); // Simula delay de rede
    return [...mockTeams];
  }

  async getTeamById(teamId: string): Promise<Team | null> {
    await delay(300);
    const team = mockTeams.find(t => t.id === teamId);
    return team ? { ...team } : null;
  }

  async createTeam(teamData: Omit<Team, 'id' | 'dateCreated' | 'dateModified'>): Promise<Team> {
    await delay(600);
    const newTeam: Team = {
      id: `team_${Date.now()}`,
      ...teamData,
      dateCreated: new Date().toISOString(),
      dateModified: new Date().toISOString(),
    };
    mockTeams.push(newTeam);
    return { ...newTeam };
  }

  async updateTeam(
    teamId: string,
    teamData: Partial<Omit<Team, 'id' | 'dateCreated'>>
  ): Promise<Team | null> {
    await delay(500);
    const index = mockTeams.findIndex(t => t.id === teamId);
    if (index === -1) return null;

    mockTeams[index] = {
      ...mockTeams[index],
      ...teamData,
      dateModified: new Date().toISOString(),
    };
    return { ...mockTeams[index] };
  }

  async deleteTeam(teamId: string): Promise<boolean> {
    await delay(400);
    const index = mockTeams.findIndex(t => t.id === teamId);
    if (index === -1) return false;

    mockTeams.splice(index, 1);
    return true;
  }

  // Métodos para membros da equipe
  async getTeamMembers(teamId: string): Promise<TeamMember[]> {
    await delay(400);
    const team = mockTeams.find(t => t.id === teamId);
    if (!team) return [];

    return mockMembers.filter(m => team.members.includes(m.id)).map(m => ({ ...m }));
  }

  async getTeamMemberById(memberId: string): Promise<TeamMember | null> {
    await delay(300);
    const member = mockMembers.find(m => m.id === memberId);
    return member ? { ...member } : null;
  }

  async addMemberToTeam(
    teamId: string,
    memberData: Omit<TeamMember, 'id'>
  ): Promise<TeamMember | null> {
    await delay(500);
    const teamIndex = mockTeams.findIndex(t => t.id === teamId);
    if (teamIndex === -1) return null;

    const newMember: TeamMember = {
      id: `member_${Date.now()}`,
      ...memberData,
    };

    mockMembers.push(newMember);
    mockTeams[teamIndex].members.push(newMember.id);
    mockTeams[teamIndex].dateModified = new Date().toISOString();

    return { ...newMember };
  }

  async updateTeamMember(
    memberId: string,
    memberData: Partial<Omit<TeamMember, 'id'>>
  ): Promise<TeamMember | null> {
    await delay(400);
    const index = mockMembers.findIndex(m => m.id === memberId);
    if (index === -1) return null;

    mockMembers[index] = {
      ...mockMembers[index],
      ...memberData,
    };

    return { ...mockMembers[index] };
  }

  async removeMemberFromTeam(teamId: string, memberId: string): Promise<boolean> {
    await delay(400);
    const teamIndex = mockTeams.findIndex(t => t.id === teamId);
    if (teamIndex === -1) return false;

    const memberIndex = mockTeams[teamIndex].members.indexOf(memberId);
    if (memberIndex === -1) return false;

    mockTeams[teamIndex].members.splice(memberIndex, 1);
    mockTeams[teamIndex].dateModified = new Date().toISOString();

    return true;
  }

  // Métodos para casos
  async getTeamCases(teamId: string): Promise<TeamCase[]> {
    await delay(500);
    const team = mockTeams.find(t => t.id === teamId);
    if (!team) return [];

    return mockCases.filter(c => team.caseIds.includes(c.id)).map(c => ({ ...c }));
  }

  async getCaseById(caseId: string): Promise<TeamCase | null> {
    await delay(300);
    const caseItem = mockCases.find(c => c.id === caseId);
    return caseItem ? { ...caseItem } : null;
  }

  async assignCaseToTeam(teamId: string, caseId: string): Promise<boolean> {
    await delay(400);
    const teamIndex = mockTeams.findIndex(t => t.id === teamId);
    if (teamIndex === -1) return false;

    const caseExists = mockCases.some(c => c.id === caseId);
    if (!caseExists) return false;

    if (!mockTeams[teamIndex].caseIds.includes(caseId)) {
      mockTeams[teamIndex].caseIds.push(caseId);
      mockTeams[teamIndex].dateModified = new Date().toISOString();
    }

    return true;
  }

  async unassignCaseFromTeam(teamId: string, caseId: string): Promise<boolean> {
    await delay(400);
    const teamIndex = mockTeams.findIndex(t => t.id === teamId);
    if (teamIndex === -1) return false;

    const caseIndex = mockTeams[teamIndex].caseIds.indexOf(caseId);
    if (caseIndex === -1) return false;

    mockTeams[teamIndex].caseIds.splice(caseIndex, 1);
    mockTeams[teamIndex].dateModified = new Date().toISOString();

    return true;
  }

  // Métodos para mensagens
  async getTeamMessages(teamId: string): Promise<TeamMessage[]> {
    await delay(400);
    const team = mockTeams.find(t => t.id === teamId);
    if (!team) return [];

    // Mensagens que envolvem membros da equipe (como remetente ou destinatário)
    return mockMessages
      .filter(m => {
        const isSenderInTeam = team.members.includes(m.sender);
        const isAnyRecipientInTeam = m.recipients.some(r => team.members.includes(r));
        return isSenderInTeam || isAnyRecipientInTeam;
      })
      .map(m => ({ ...m }));
  }

  async sendMessage(
    message: Omit<TeamMessage, 'id' | 'timestamp' | 'isRead'>
  ): Promise<TeamMessage> {
    await delay(500);
    const newMessage: TeamMessage = {
      id: `msg_${Date.now()}`,
      ...message,
      timestamp: new Date().toISOString(),
      isRead: false,
    };

    mockMessages.push(newMessage);
    return { ...newMessage };
  }

  async markMessageAsRead(messageId: string): Promise<boolean> {
    await delay(300);
    const index = mockMessages.findIndex(m => m.id === messageId);
    if (index === -1) return false;

    mockMessages[index].isRead = true;
    return true;
  }

  // Métodos para reuniões
  async getTeamMeetings(teamId: string): Promise<TeamMeeting[]> {
    await delay(500);
    const team = mockTeams.find(t => t.id === teamId);
    if (!team) return [];

    // Reuniões que envolvem pelo menos um membro da equipe
    return mockMeetings
      .filter(m => m.attendees.some(a => team.members.includes(a)))
      .map(m => ({ ...m }));
  }

  async createMeeting(meetingData: Omit<TeamMeeting, 'id'>): Promise<TeamMeeting> {
    await delay(600);
    const newMeeting: TeamMeeting = {
      id: `meeting_${Date.now()}`,
      ...meetingData,
    };

    mockMeetings.push(newMeeting);
    return { ...newMeeting };
  }

  // Métodos para métricas
  async getTeamMetrics(
    teamId: string,
    options?: { startDate: string; endDate: string }
  ): Promise<TeamMetrics> {
    // Em um ambiente real, aqui faria uma chamada à API
    // Por enquanto, retornamos dados mockados

    // Simula um pequeno atraso para simular chamada de rede
    await new Promise(resolve => setTimeout(resolve, 500));

    return {
      totalCases: 48,
      casesByStatus: {
        [CaseStatus.OPEN]: 5,
        [CaseStatus.ASSIGNED]: 8,
        [CaseStatus.IN_PROGRESS]: 15,
        [CaseStatus.UNDER_REVIEW]: 12,
        [CaseStatus.COMPLETED]: 6,
        [CaseStatus.CLOSED]: 2,
      },
      casesByTier: {
        [InterventionTier.TIER1]: 18,
        [InterventionTier.TIER2]: 23,
        [InterventionTier.TIER3]: 7,
      },
      averageResolutionTime: 14.5,
      memberPerformance: [
        {
          memberId: '1',
          casesAssigned: 10,
          casesCompleted: 8,
          averageResolutionTime: 12,
        },
        {
          memberId: '2',
          casesAssigned: 12,
          casesCompleted: 9,
          averageResolutionTime: 15,
        },
      ],
      meetingsPerMonth: 4,
      interventionEffectiveness: 75,
    };
  }

  // Método para filtragem
  async filterTeamMembers(teamId: string, filters: TeamFilters): Promise<TeamMember[]> {
    await delay(600);
    const team = mockTeams.find(t => t.id === teamId);
    if (!team) return [];

    let filteredMembers = mockMembers.filter(m => team.members.includes(m.id));

    if (filters.roles && filters.roles.length > 0) {
      filteredMembers = filteredMembers.filter(m => filters.roles!.includes(m.role));
    }

    if (filters.specialties && filters.specialties.length > 0) {
      filteredMembers = filteredMembers.filter(m =>
        m.specialties.some(s => filters.specialties!.includes(s))
      );
    }

    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      filteredMembers = filteredMembers.filter(
        m =>
          m.name.toLowerCase().includes(term) ||
          m.email.toLowerCase().includes(term) ||
          (m.bio && m.bio.toLowerCase().includes(term))
      );
    }

    return filteredMembers.map(m => ({ ...m }));
  }
}

export const teamService = new TeamService();
