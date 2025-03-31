import { RTILevel } from './rti';
import { Intervention } from './intervention';

// Tipos comuns
export interface BaseVisualizationProps {
  className?: string;
  style?: React.CSSProperties;
  width?: number;
  height?: number;
}

// Tipos para TierDistributionChart
export interface TierDistribution {
  totalStudents: number;
  tiers: {
    id: string;
    name: string;
    description: string;
    color: string;
    count: number;
    percentage: number;
  }[];
}

export interface TierDistributionChartProps extends BaseVisualizationProps {
  data: TierDistribution;
  onTierClick?: (tier: TierDistribution['tiers'][0]) => void;
  showLegend?: boolean;
  title?: string;
}

// Tipos para InterventionEffectivenessChart
export interface InterventionEffectiveness {
  intervention: string;
  domain: string;
  effectiveness: number; // Valor normalizado entre 0 e 100
  studentsCount: number;
  averageGrowth: number;
  durationInWeeks: number;
  tier: 1 | 2 | 3;
}

export interface InterventionEffectivenessChartProps extends BaseVisualizationProps {
  data: InterventionEffectiveness[];
  onInterventionClick?: (intervention: InterventionEffectiveness) => void;
  selectedTiers?: (1 | 2 | 3)[];
  selectedDomains?: string[];
  minStudentsCount?: number;
  showLabels?: boolean;
  title?: string;
}

// Tipos para DomainProgressChart
export interface DomainProgress {
  domain: string;
  color: string;
  initialScore: number;
  currentScore: number;
  targetScore: number;
  nationalAverage?: number;
  benchmarks?: {
    name: string;
    value: number;
  }[];
}

export interface DomainProgressChartProps extends BaseVisualizationProps {
  data: DomainProgress[];
  onDomainClick?: (domain: DomainProgress) => void;
  showBenchmarks?: boolean;
  showNationalAverage?: boolean;
  showTargets?: boolean;
  title?: string;
}

// Tipos para ScreeningCoverageChart
export interface ScreeningCoverage {
  period: string;
  total: number;
  screened: number;
  pending: number;
  missed: number;
  percentage: number;
}

export interface ScreeningCoverageChartProps extends BaseVisualizationProps {
  data: ScreeningCoverage[];
  onPeriodClick?: (period: ScreeningCoverage) => void;
  showPercentageLabels?: boolean;
  title?: string;
}

// Tipos para BenchmarkComparisonChart
export interface BenchmarkComparison {
  domain: string;
  schoolAverage: number;
  districtAverage: number;
  stateAverage: number;
  nationalAverage: number;
  target: number;
}

export interface BenchmarkComparisonChartProps extends BaseVisualizationProps {
  data: BenchmarkComparison[];
  onDomainClick?: (domain: BenchmarkComparison) => void;
  showTarget?: boolean;
  title?: string;
}
