import { BaseComponentProps, LoadingState } from './utils';

/**
 * Enumeração para níveis de alerta.
 */
export type AlertLevel = 'low' | 'moderate' | 'high' | 'critical';

/**
 * Enumeração para perfis de usuário.
 */
export type UserProfile = 'teacher' | 'specialist' | 'coordinator' | 'principal' | 'administrator';

/**
 * Interface para representar um insight acionável.
 */
export interface ActionableInsight {
  id: string;
  title: string;
  description: string;
  alertLevel: AlertLevel;
  timestamp: string;
  category: string;
  impactArea: string[];
  suggestedActions: string[];
  evidence?: InsightEvidence;
  potentialImpact?: number;
  profileRelevance: Record<UserProfile, number>;
  isAcknowledged?: boolean;
  isResolved?: boolean;
  dateAcknowledged?: string;
  dateResolved?: string;
}

/**
 * Interface para representar evidências de insights.
 */
export interface InsightEvidence {
  dataPoints: {
    name: string;
    value: number;
    baseline?: number;
    comparisonValue?: number;
  }[];
  trend?: {
    direction: 'up' | 'down' | 'stable';
    percentChange?: number;
    period: string;
  };
  sources: string[];
}

/**
 * Interface para interação com insights acionáveis.
 */
export interface InsightInteraction {
  acknowledgeInsight: (id: string) => Promise<void>;
  resolveInsight: (id: string) => Promise<void>;
  dismissInsight: (id: string) => Promise<void>;
  saveNotes: (id: string, notes: string) => Promise<void>;
}

/**
 * Interface para simulação de impacto de decisões.
 */
export interface ImpactSimulation {
  id: string;
  title: string;
  description: string;
  scenarios: {
    id: string;
    name: string;
    description: string;
    impactMetrics: {
      metric: string;
      currentValue: number;
      projectedValue: number;
      percentChange: number;
    }[];
  }[];
}

/**
 * Props para o componente principal ActionableInsightsDashboard.
 */
export interface ActionableInsightsDashboardProps extends BaseComponentProps, LoadingState {
  insights: ActionableInsight[];
  activeProfile?: UserProfile;
  onInsightSelect?: (insight: ActionableInsight) => void;
  onFilterChange?: (filters: InsightFilters) => void;
  onProfileChange?: (profile: UserProfile) => void;
}

/**
 * Interface para filtros de insights.
 */
export interface InsightFilters {
  alertLevel?: AlertLevel[];
  categories?: string[];
  impactAreas?: string[];
  dateRange?: [string, string];
  showResolved?: boolean;
  showAcknowledged?: boolean;
  relevanceThreshold?: number;
}

/**
 * Props para componentes de alerta preventivo.
 */
export interface PreventiveAlertProps extends BaseComponentProps {
  insight: ActionableInsight;
  onAcknowledge?: (id: string) => void;
  onResolve?: (id: string) => void;
  onDismiss?: (id: string) => void;
  expanded?: boolean;
}

/**
 * Props para componentes de sugestões específicas por perfil.
 */
export interface ProfileSuggestionsProps extends BaseComponentProps {
  insights: ActionableInsight[];
  profile: UserProfile;
  maxItems?: number;
}

/**
 * Props para componentes de visualizações comparativas.
 */
export interface ComparativeInsightProps extends BaseComponentProps {
  insight: ActionableInsight;
  showEvidence?: boolean;
}

/**
 * Props para componentes de simulação de impacto.
 */
export interface ImpactSimulationProps extends BaseComponentProps {
  simulation: ImpactSimulation;
  onScenarioSelect?: (scenarioId: string) => void;
  selectedScenario?: string;
}
