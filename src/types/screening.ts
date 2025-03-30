import { BaseEntity } from './base';

// Enums
export type ScreeningArea = 'reading' | 'math' | 'behavior' | 'social_emotional';
export type ScreeningCategory = 'academic' | 'behavioral' | 'socioemotional';
export type ScreeningStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';
export type ScreeningTier = 'universal' | 'selective' | 'intensive';
export type ScreeningFrequency = 'weekly' | 'biweekly' | 'monthly' | 'quarterly';
export type QuestionType = 'radio' | 'checkbox' | 'slider' | 'text';
export type ScreeningRuleConditionType = 'score' | 'frequency' | 'attendance' | 'behavior';
export type ScreeningRuleActionType = 'notification' | 'referral' | 'intervention' | 'assessment';
export type ScreeningRuleActionTarget = 'student' | 'teacher' | 'parent' | 'counselor' | 'principal';
export type ScreeningRuleOperator = 'equals' | 'notEquals' | 'greaterThan' | 'lessThan' | 'greaterThanOrEqual' | 'lessThanOrEqual' | 'contains' | 'notContains';

// Interfaces
export interface Question {
  id: string;
  type: QuestionType;
  text: string;
  options: string[];
  min: number;
  max: number;
}

export interface ScreeningInstrument extends BaseEntity {
  name: string;
  description: string;
  area: ScreeningArea;
  category: ScreeningCategory;
  ageRange: {
    min: number;
    max: number;
  };
  administrationTime: number; // em minutos
  instructions: string;
  cutoffPoints: {
    tier1: number;
    tier2: number;
    tier3: number;
  };
  evidence: {
    description: string;
    references: string[];
  };
  resources: string[];
  isFavorite: boolean;
  questions: Question[];
}

export interface ScreeningAdministration extends BaseEntity {
  instrumentId: string;
  studentId: string;
  administratorId: string;
  startDate: Date;
  endDate: Date | null;
  status: ScreeningStatus;
  responses: ScreeningResponse[];
  notes: string;
}

export interface ScreeningResponse {
  questionId: string;
  value: string | number | boolean | string[];
  timestamp: Date;
}

export interface ScreeningResult extends BaseEntity {
  administrationId: string;
  instrumentId: string;
  studentId: string;
  score: number;
  tier: ScreeningTier;
  percentile: number;
  recommendations: string[];
  completedAt: Date;
}

export interface ScreeningCycle extends BaseEntity {
  name: string;
  startDate: Date;
  endDate: Date;
  frequency: ScreeningFrequency;
  tier: ScreeningTier;
  instruments: string[]; // IDs dos instrumentos
  status: ScreeningStatus;
}

export interface ScreeningRule extends BaseEntity {
  name: string;
  description: string;
  area: ScreeningArea;
  tier: ScreeningTier;
  conditions: ScreeningRuleCondition[];
  actions: ScreeningRuleAction[];
  isActive: boolean;
}

export interface ScreeningRuleCondition {
  id: string;
  type: ScreeningRuleConditionType;
  operator: ScreeningRuleOperator;
  value: string | number | boolean;
  instrumentId?: string;
}

export interface ScreeningRuleAction {
  id: string;
  type: ScreeningRuleActionType;
  target: ScreeningRuleActionTarget;
  message: string;
  data?: Record<string, any>;
}

// Props
export interface ScreeningInstrumentCatalogProps {
  onInstrumentSelect: (instrument: ScreeningInstrument) => void;
  filters?: {
    area?: ScreeningArea;
    category?: ScreeningCategory;
    ageRange?: { min: number; max: number };
  };
}

export interface ScreeningAdministrationFormProps {
  instrument: ScreeningInstrument;
  studentId: string;
  onComplete: (administration: ScreeningAdministration) => void;
  onCancel: () => void;
}

export interface ScreeningResultsDashboardProps {
  studentId: string;
  period?: {
    start: Date;
    end: Date;
  };
}

export interface ScreeningCycleManagerProps {
  onCycleCreate: (cycle: Omit<ScreeningCycle, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCycleUpdate: (id: string, cycle: Partial<ScreeningCycle>) => void;
}

// Hooks
export interface UseScreeningInstrumentReturn {
  instrument: ScreeningInstrument | null;
  isLoading: boolean;
  error: Error | null;
  toggleFavorite: () => Promise<void>;
}

export interface UseScreeningResultsReturn {
  results: ScreeningResult[];
  isLoading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
}

export interface UseScreeningCycleReturn {
  cycle: ScreeningCycle | null;
  isLoading: boolean;
  error: Error | null;
  updateCycle: (cycle: Partial<ScreeningCycle>) => Promise<void>;
}

export interface ScreeningRuleManagerProps {
  onRuleCreate: (rule: Omit<ScreeningRule, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onRuleUpdate: (id: string, rule: Partial<ScreeningRule>) => void;
}

export interface ScreeningInstrumentManagerProps {
  onInstrumentCreate: (instrument: Omit<ScreeningInstrument, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onInstrumentUpdate: (id: string, instrument: Partial<ScreeningInstrument>) => void;
}

export interface ScreeningAdministrationManagerProps {
  onAdministrationCreate: (administration: Omit<ScreeningAdministration, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onAdministrationUpdate: (id: string, administration: Partial<ScreeningAdministration>) => void;
}
