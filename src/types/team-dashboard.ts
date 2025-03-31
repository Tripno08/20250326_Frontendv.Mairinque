import { CaseStatus, InterventionTier, TeamMetrics as BaseTeamMetrics } from './team';

/**
 * Tipos estendidos para os componentes de dashboard de equipe
 */

// Extensão da interface TeamMetrics para incluir os campos necessários para o dashboard
export interface TeamMetrics extends BaseTeamMetrics {
  teamSize: number;
  resolvedCases: number;
  averageProgress: number;
  caseStatusDistribution: Record<CaseStatus, number>;
  interventionTierDistribution: Record<InterventionTier, number>;
  progressOverTime: Array<{
    date: string;
    value: number;
  }>;
  teamSkillsDistribution: Record<string, number>;
}

// Definição do tipo de mudança de tendência
export type ChangeTrend = 'improving' | 'stable' | 'worsening';

// Interface para dados de risco
export interface RiskData {
  level: 'low' | 'moderate' | 'high' | 'severe';
  score: number;
  trend: ChangeTrend;
}

// Interface para filtros do dashboard
export interface DashboardFilters {
  startDate: Date;
  endDate: Date;
  showCompletedCases?: boolean;
  selectedMembers?: string[];
  caseTypes?: string[];
}
