import { BaseProps } from './common';

export type MeetingType = 'rti' | 'pedagogica' | 'administrativa';

export type MeetingStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled';

export type ParticipantStatus = 'confirmed' | 'pending' | 'declined';

export type DecisionStatus = 'pending' | 'completed' | 'cancelled';

export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Participant extends BaseEntity {
  name: string;
  role: string;
  status: ParticipantStatus;
}

export interface Decision extends BaseEntity {
  description: string;
  assignedTo: string;
  dueDate: Date;
  status: DecisionStatus;
}

export interface Note extends BaseEntity {
  content: string;
  author: string;
}

export interface AgendaItem extends BaseEntity {
  title: string;
  description: string;
  duration: number;
  order: number;
  status: 'pending' | 'completed';
}

export interface Meeting extends BaseEntity {
  title: string;
  type: MeetingType;
  description: string;
  startDate: Date;
  endDate: Date;
  status: MeetingStatus;
  participants: Participant[];
  decisions: Decision[];
  notes: Note[];
  agenda: AgendaItem[];
}

export interface MeetingSchedulerProps {
  onSchedule: (meeting: Omit<Meeting, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

export interface MeetingAgendaProps {
  agenda: AgendaItem[];
  onUpdate: (item: AgendaItem) => void;
}

export interface MeetingAttendanceProps {
  participants: Participant[];
  onUpdate: (participant: Participant) => void;
}

export interface MeetingDecisionsProps {
  decisions: Decision[];
  onUpdate: (decision: Decision) => void;
}

export interface CollaborativeEditorProps {
  notes: Note[];
  onUpdate: (note: Note) => void;
}

export interface MeetingDashboardProps {
  meetings: Meeting[];
  onMeetingSelect: (meetingId: string) => void;
}
