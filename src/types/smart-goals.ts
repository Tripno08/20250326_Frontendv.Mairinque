import { Intervention } from './intervention';

export type GoalStatus = 'não iniciada' | 'em andamento' | 'atrasada' | 'concluída' | 'cancelada';

export type GoalPriority = 'baixa' | 'média' | 'alta' | 'crítica';

export interface GoalProgress {
  date: Date;
  value: number;
  notes?: string;
}

export interface GoalMeasurement {
  initialValue: number;
  targetValue: number;
  currentValue: number;
  unit: string;
  progressHistory: GoalProgress[];
}

export interface SmartGoal {
  id: string;
  studentId: string;
  title: string;
  description: string;

  // Specific (Específica)
  specificDetails: string;

  // Measurable (Mensurável)
  measurement: GoalMeasurement;

  // Achievable (Atingível)
  achievementSteps: string[];

  // Relevant (Relevante)
  relevance: string;

  // Time-bound (Temporal)
  startDate: Date;
  targetDate: Date;

  // Status e metadados
  status: GoalStatus;
  priority: GoalPriority;
  createdAt: Date;
  updatedAt: Date;

  // Intervenções relacionadas
  interventions: string[] | Intervention[];

  // Áreas e competências relacionadas
  domain: string;
  skills: string[];

  // Responsáveis
  responsibleUsers: string[];
}

export interface SmartGoalFormData
  extends Omit<SmartGoal, 'id' | 'measurement' | 'createdAt' | 'updatedAt' | 'interventions'> {
  initialValue: number;
  targetValue: number;
  unit: string;
  interventions: string[];
}

export interface GoalVisualizationProps {
  goal: SmartGoal;
  onEdit?: (goalId: string) => void;
  onDelete?: (goalId: string) => void;
  onUpdateProgress?: (goalId: string, value: number, notes?: string) => void;
}

export interface GoalFormProps {
  initialData?: Partial<SmartGoalFormData> | undefined;
  studentId: string;
  interventionsLibrary?: Intervention[];
  onSave: (data: SmartGoalFormData) => void;
  onCancel: () => void;
}

export interface GoalListProps {
  goals: SmartGoal[];
  onEdit?: (goalId: string) => void;
  onDelete?: (goalId: string) => void;
  onUpdateProgress?: (goalId: string, value: number, notes?: string) => void;
}

export interface GoalProgressUpdateProps {
  goal: SmartGoal;
  onUpdate: (goalId: string, value: number, notes?: string) => void;
  onCancel: () => void;
}

export interface GoalProgressChartProps {
  goal: SmartGoal;
  width?: number;
  height?: number;
}
