import { ReactNode } from 'react';

export type RiskLevel = 'low' | 'moderate' | 'high' | 'severe';

export interface StudentRiskData {
  id: string;
  name: string;
  grade: string;
  riskLevel: RiskLevel;
  riskScore: number;
  previousScore?: number;
  changeTrend: 'improving' | 'stable' | 'worsening';
  domains: {
    [key: string]: {
      score: number;
      threshold: number;
      status: 'above' | 'on-track' | 'at-risk' | 'critical';
    };
  };
  lastAssessment: string;
  interventions: string[];
}

export interface RiskTrendData {
  date: string;
  lowRisk: number;
  moderateRisk: number;
  highRisk: number;
  severeRisk: number;
}

export interface RiskProjectionData {
  month: string;
  projected: number;
  actual?: number;
  baseline: number;
}

export interface RiskPatternData {
  domain: string;
  correlationScore: number;
  impactFactor: number;
  studentsAffected: number;
  riskContribution: number;
}

export interface RiskDistributionData {
  low: number;
  moderate: number;
  high: number;
  severe: number;
  total: number;
}

export interface RiskFactorData {
  factor: string;
  weight: number;
  students: number;
  significance: 'high' | 'medium' | 'low';
}

export interface EarlyWarningIndicator {
  id: string;
  name: string;
  description: string;
  threshold: number;
  currentValue: number;
  status: 'normal' | 'warning' | 'critical';
  trend: 'improving' | 'stable' | 'worsening';
  affectedStudents: number;
}

export interface RiskAnalysisDashboardProps {
  className?: string;
  studentRiskData?: StudentRiskData[];
  riskTrendData?: RiskTrendData[];
  riskProjectionData?: RiskProjectionData[];
  riskPatternData?: RiskPatternData[];
  riskDistributionData?: RiskDistributionData;
  riskFactorData?: RiskFactorData[];
  earlyWarningIndicators?: EarlyWarningIndicator[];
  isLoading?: boolean;
  onStudentClick?: (studentId: string) => void;
  onFilterChange?: (filters: RiskAnalysisFilters) => void;
  onDataRefresh?: () => void;
  onExportData?: (format: 'csv' | 'pdf' | 'excel') => void;
}

export interface RiskAnalysisFilters {
  grades?: string[] | undefined;
  riskLevels?: RiskLevel[] | undefined;
  dateRange?: [Date, Date] | undefined;
  domains?: string[] | undefined;
  searchTerm?: string | undefined;
}

export interface RiskLevelThresholds {
  low: number;
  moderate: number;
  high: number;
  severe: number;
}

export interface RiskVisualizationConfig {
  colors: {
    low: string;
    moderate: string;
    high: string;
    severe: string;
    improving: string;
    stable: string;
    worsening: string;
    projection: string;
    baseline: string;
    actual: string;
  };
  thresholds: RiskLevelThresholds;
  animationDuration: number;
}

export interface RiskAnalysisService {
  getStudentRiskData: () => Promise<StudentRiskData[]>;
  getRiskTrendData: (period: string) => Promise<RiskTrendData[]>;
  getRiskProjectionData: (months: number) => Promise<RiskProjectionData[]>;
  getRiskPatternData: () => Promise<RiskPatternData[]>;
  getRiskDistributionData: () => Promise<RiskDistributionData>;
  getRiskFactorData: () => Promise<RiskFactorData[]>;
  getEarlyWarningIndicators: () => Promise<EarlyWarningIndicator[]>;
}
