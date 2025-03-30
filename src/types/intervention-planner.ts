import { Intervention } from './intervention';

export interface InterventionPlanItem {
  id: string;
  intervention: Intervention;
  position: number;
  notes?: string;
}

export interface InterventionPlan {
  id?: string;
  title: string;
  description?: string;
  studentId?: string;
  items: InterventionPlanItem[];
  status: 'draft' | 'active' | 'completed' | 'archived';
  createdAt: Date;
  updatedAt: Date;
}

export interface DraggableInterventionProps {
  intervention: Intervention;
  isDragging?: boolean;
  isOverlay?: boolean;
}

export interface InterventionPlannerBoardProps {
  plan: InterventionPlan;
  interventionsLibrary: Intervention[];
  onPlanUpdate: (plan: InterventionPlan) => void;
  onSave?: () => void;
  readOnly?: boolean;
  className?: string;
}

export interface InterventionDropzoneProps {
  children: React.ReactNode;
  id: string;
  items?: InterventionPlanItem[];
  isOver?: boolean;
}

export interface DroppableInterventionProps {
  item: InterventionPlanItem;
  index: number;
}
