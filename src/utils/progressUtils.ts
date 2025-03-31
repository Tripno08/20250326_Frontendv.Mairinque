import type { ProgressDataPoint, TrendLine, Projection } from '@/types/progress';

export const calculateChartDimensions = (containerWidth: number, containerHeight: number) => {
  const margin = {
    top: 40,
    right: 40,
    bottom: 60,
    left: 60,
  };

  const width = containerWidth;
  const height = containerHeight;
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  return {
    width,
    height,
    margin,
    innerWidth,
    innerHeight,
  };
};

export const calculateTrendLine = (data: ProgressDataPoint[]): TrendLine => {
  const n = data.length;
  if (n < 2) {
    return {
      slope: 0,
      intercept: data[0]?.value || 0,
      rSquared: 0,
    };
  }

  const xValues = data.map((_, i) => i);
  const yValues = data.map(d => d.value);

  const sumX = xValues.reduce((a, b) => a + b, 0);
  const sumY = yValues.reduce((a, b) => a + b, 0);
  const sumXY = xValues.reduce((sum, x, i) => sum + x * yValues[i], 0);
  const sumXX = xValues.reduce((sum, x) => sum + x * x, 0);
  const sumYY = yValues.reduce((sum, y) => sum + y * y, 0);

  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  const rSquared =
    Math.pow(n * sumXY - sumX * sumY, 2) / ((n * sumXX - sumX * sumX) * (n * sumYY - sumY * sumY));

  return {
    slope,
    intercept,
    rSquared,
  };
};

export const calculateProjection = (
  data: ProgressDataPoint[],
  targetDate: string | Date
): Projection => {
  const trendLine = calculateTrendLine(data);
  const lastIndex = data.length - 1;

  if (!data[lastIndex]?.date) {
    throw new Error('Data array is empty or missing date');
  }

  const targetDateTime = typeof targetDate === 'string' ? new Date(targetDate) : targetDate;
  const lastDateTime =
    typeof data[lastIndex].date === 'string'
      ? new Date(data[lastIndex].date)
      : data[lastIndex].date;

  const daysUntilTarget = Math.ceil(
    (targetDateTime.getTime() - lastDateTime.getTime()) / (1000 * 60 * 60 * 24)
  );

  const projectedValue = trendLine.slope * (lastIndex + daysUntilTarget) + trendLine.intercept;

  return {
    targetValue: projectedValue,
    deadline: targetDateTime,
    confidence: trendLine.rSquared,
  };
};

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
};

export const formatValue = (value: number): string => {
  return value.toFixed(1);
};

export const getInterventionColor = (intervention: string): string => {
  const colors: Record<string, string> = {
    'Tutoria Individual': '#4CAF50',
    'Grupo de Estudo': '#2196F3',
    'Avaliação Diagnóstica': '#FFC107',
    'Plano de Ação': '#9C27B0',
    Feedback: '#FF5722',
  };

  return colors[intervention] || '#757575';
};

export const getBenchmarkColor = (benchmark: string): string => {
  const colors: Record<string, string> = {
    'Média da Turma': '#2196F3',
    'Média Nacional': '#4CAF50',
    'Mínimo Esperado': '#FFC107',
    'Meta Anual': '#9C27B0',
  };

  return colors[benchmark] || '#757575';
};

export const getGoalColor = (goal: string): string => {
  const colors: Record<string, string> = {
    'Meta Curto Prazo': '#4CAF50',
    'Meta Médio Prazo': '#2196F3',
    'Meta Longo Prazo': '#9C27B0',
  };

  return colors[goal] || '#757575';
};
