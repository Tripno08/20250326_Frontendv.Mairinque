export interface ProgressDataPoint {
  date: Date;
  value: number;
  intervention?: string;
  notes?: string;
}

export interface Benchmark {
  name: string;
  value: number;
  color: string;
  description: string;
}

export interface ProgressGoal {
  name: string;
  targetValue: number;
  deadline: Date;
  color: string;
  description: string;
}

export interface ProgressMonitoringChartProps {
  data: ProgressDataPoint[];
  benchmarks: Benchmark[];
  goals: ProgressGoal[];
  onInterventionClick?: (intervention: string) => void;
  className?: string;
  width?: number;
  height?: number;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

export interface ChartDimensions {
  width: number;
  height: number;
  margin: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  innerWidth: number;
  innerHeight: number;
}

export interface TrendLine {
  slope: number;
  intercept: number;
  rSquared: number;
}

export interface Projection {
  targetValue: number;
  deadline: Date;
  confidence: number;
}
