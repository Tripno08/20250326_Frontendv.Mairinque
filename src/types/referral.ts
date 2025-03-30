import { BaseEntity, BaseProps } from './common';

export type ReferralStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';
export type ReferralPriority = 'low' | 'medium' | 'high' | 'urgent';
export type ReferralType = 'academic' | 'behavioral' | 'social' | 'administrative';

export interface Referral extends BaseEntity {
  title: string;
  description: string;
  type: ReferralType;
  status: ReferralStatus;
  priority: ReferralPriority;
  assignedTo: string;
  createdBy: string;
  dueDate: Date;
  completedAt?: Date;
  attachments: Attachment[];
  comments: Comment[];
  history: HistoryItem[];
  tags: string[];
}

export interface Attachment extends BaseEntity {
  name: string;
  url: string;
  type: string;
  size: number;
}

export interface Comment extends BaseEntity {
  content: string;
  author: string;
  attachments?: Attachment[];
}

export interface HistoryItem extends BaseEntity {
  action: string;
  description: string;
  author: string;
  previousStatus?: ReferralStatus;
  newStatus?: ReferralStatus;
}

export interface ReferralMetrics {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
  cancelled: number;
  averageResolutionTime: number;
  priorityDistribution: Record<ReferralPriority, number>;
  typeDistribution: Record<ReferralType, number>;
}

// Props interfaces
export interface ReferralBuilderProps extends BaseProps {
  onSubmit: (referral: Omit<Referral, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

export interface ReferralListProps extends BaseProps {
  referrals: Referral[];
  onReferralSelect: (referralId: string) => void;
  onStatusChange: (referralId: string, status: ReferralStatus) => void;
}

export interface ReferralDetailsProps extends BaseProps {
  referral: Referral;
  onUpdate: (referral: Referral) => void;
  onAddComment: (referralId: string, comment: Omit<Comment, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

export interface ReferralDashboardProps extends BaseProps {
  metrics: ReferralMetrics;
  recentReferrals: Referral[];
  onReferralSelect: (referralId: string) => void;
}

export interface ReferralTimelineProps extends BaseProps {
  history: HistoryItem[];
}

export interface ReferralFilters {
  status?: ReferralStatus[];
  priority?: ReferralPriority[];
  type?: ReferralType[];
  assignedTo?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
}
