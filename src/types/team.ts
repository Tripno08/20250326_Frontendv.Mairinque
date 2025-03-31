/**
 * Tipos para o sistema de gestão de equipes multidisciplinares
 */

// Enums para papéis e especialidades
export enum TeamRole {
  COORDINATOR = 'coordinator',
  TEACHER = 'teacher',
  SPECIALIST = 'specialist',
  COUNSELOR = 'counselor',
  PSYCHOLOGIST = 'psychologist',
  SOCIAL_WORKER = 'social_worker',
  ADMIN = 'admin',
  OTHER = 'other',
}

export enum Specialty {
  READING = 'reading',
  MATH = 'math',
  WRITING = 'writing',
  BEHAVIOR = 'behavior',
  SOCIAL_EMOTIONAL = 'social_emotional',
  SPEECH = 'speech',
  OCCUPATIONAL_THERAPY = 'occupational_therapy',
  GENERAL = 'general',
}

// Tipo para disponibilidade de horário
export interface Availability {
  weekday: number; // 0-6 (Domingo-Sábado)
  startTime: string; // formato "HH:MM"
  endTime: string; // formato "HH:MM"
}

// Interface para membro da equipe
export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: TeamRole;
  specialties: Specialty[];
  availability: Availability[];
  maxCaseload?: number; // Capacidade máxima de casos
  currentCaseload?: number; // Carga atual de casos
  avatar?: string; // URL da imagem do avatar
  bio?: string; // Biografia breve
  isActive: boolean;
}

// Nível de intervenção (correspondente aos Tiers do RTI/MTSS)
export enum InterventionTier {
  TIER1 = 1,
  TIER2 = 2,
  TIER3 = 3,
}

// Status de caso
export enum CaseStatus {
  OPEN = 'open',
  ASSIGNED = 'assigned',
  IN_PROGRESS = 'in_progress',
  UNDER_REVIEW = 'under_review',
  COMPLETED = 'completed',
  CLOSED = 'closed',
}

// Interface para caso atribuído
export interface TeamCase {
  id: string;
  studentId: string;
  studentName: string;
  description: string;
  tier: InterventionTier;
  status: CaseStatus;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dateCreated: string;
  dateModified: string;
  assignedTo?: string[]; // IDs dos membros da equipe
  domains: string[]; // Domínios acadêmicos ou comportamentais
  notes?: string[];
  documents?: string[]; // URLs ou referências a documentos
  meetings?: TeamMeeting[];
}

// Interface para reunião de equipe
export interface TeamMeeting {
  id: string;
  title: string;
  description?: string;
  date: string;
  startTime: string;
  endTime: string;
  location?: string;
  isVirtual: boolean;
  meetingUrl?: string;
  attendees: string[]; // IDs dos membros da equipe
  caseIds: string[]; // IDs dos casos a serem discutidos
  agenda?: string;
  notes?: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  files?: string[]; // URLs ou referências a arquivos
}

// Interface para comunicação dentro da equipe
export interface TeamMessage {
  id: string;
  sender: string; // ID do membro da equipe
  recipients: string[]; // IDs dos membros da equipe
  subject: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  caseId?: string; // ID do caso relacionado (opcional)
  attachments?: string[]; // URLs ou referências a anexos
  priority: 'normal' | 'important' | 'urgent';
}

// Interface para equipe multidisciplinar
export interface Team {
  id: string;
  name: string;
  description?: string;
  members: string[]; // IDs dos membros da equipe
  coordinator: string; // ID do coordenador da equipe
  caseIds: string[]; // IDs dos casos atribuídos à equipe
  dateCreated: string;
  dateModified: string;
  isActive: boolean;
}

// Interface para métricas de equipe
export interface TeamMetrics {
  totalCases: number;
  casesByStatus: Record<CaseStatus, number>;
  casesByTier: Record<InterventionTier, number>;
  averageResolutionTime: number; // em dias
  memberPerformance: Array<{
    memberId: string;
    casesAssigned: number;
    casesCompleted: number;
    averageResolutionTime: number;
  }>;
  meetingsPerMonth: number;
  interventionEffectiveness: number; // percentual
}

// Interface para filtros
export interface TeamFilters {
  roles?: TeamRole[];
  specialties?: Specialty[];
  caseStatus?: CaseStatus[];
  tiers?: InterventionTier[];
  dateRange?: {
    start: string;
    end: string;
  };
  searchTerm?: string;
}

// Props para o componente TeamManagement
export interface TeamManagementProps {
  className?: string;
  style?: React.CSSProperties;
  onTeamCreate?: (team: Omit<Team, 'id'>) => Promise<void>;
  onTeamUpdate?: (team: Team) => Promise<void>;
  onTeamDelete?: (teamId: string) => Promise<void>;
  onMemberAdd?: (teamId: string, member: Omit<TeamMember, 'id'>) => Promise<void>;
  onMemberRemove?: (teamId: string, memberId: string) => Promise<void>;
  onCaseAssign?: (teamId: string, caseId: string) => Promise<void>;
  onCaseUnassign?: (teamId: string, caseId: string) => Promise<void>;
}

// Props para o componente RoleAssignment
export interface RoleAssignmentProps {
  className?: string;
  style?: React.CSSProperties;
  teamId: string;
  members: TeamMember[];
  cases: TeamCase[];
  onAssignmentChange?: (memberId: string, caseIds: string[]) => Promise<void>;
  onRoleChange?: (memberId: string, role: TeamRole) => Promise<void>;
}

// Props para o componente CaseDistributionChart
export interface CaseDistributionChartProps {
  className?: string;
  style?: React.CSSProperties;
  teamId: string;
  members?: TeamMember[];
  cases?: TeamCase[];
  width?: number;
  height?: number;
  showLegend?: boolean;
  title?: string;
}

// Props para o componente WorkloadChart
export interface WorkloadChartProps {
  className?: string;
  style?: React.CSSProperties;
  teamId: string;
  members?: TeamMember[];
  width?: number;
  height?: number;
  showLegend?: boolean;
  title?: string;
}

// Props para o componente TeamPerformanceDashboard
export interface TeamPerformanceDashboardProps {
  className?: string;
  style?: React.CSSProperties;
  teamId: string;
  metrics?: TeamMetrics;
  width?: number;
  height?: number;
  dateRange?: {
    start: string;
    end: string;
  };
  onDateRangeChange?: (dateRange: { start: string; end: string }) => void;
}

// Props para o componente TeamCommunication
export interface TeamCommunicationProps {
  className?: string;
  style?: React.CSSProperties;
  teamId: string;
  members?: TeamMember[];
  onMessageSend?: (
    message: Omit<TeamMessage, 'id' | 'timestamp' | 'isRead'>
  ) => Promise<TeamMessage | void>;
  onMessageRead?: (messageId: string) => Promise<boolean | void>;
}
