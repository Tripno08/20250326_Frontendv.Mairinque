import { useState, useEffect, useCallback } from 'react';
import {
  StudentRiskData,
  RiskTrendData,
  RiskProjectionData,
  RiskPatternData,
  RiskDistributionData,
  RiskFactorData,
  EarlyWarningIndicator,
  RiskAnalysisFilters
} from '@/types/risk-analysis';
import { riskAnalysisService } from '@/services/riskAnalysisService';

// Hook para dados de risco de estudantes
export const useStudentRiskData = () => {
  const [data, setData] = useState<StudentRiskData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [filters, setFilters] = useState<RiskAnalysisFilters>({});

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const result = await riskAnalysisService.getStudentRiskData();

      // Aplicar filtros
      let filteredData = [...result];

      if (filters.grades && filters.grades.length > 0) {
        filteredData = filteredData.filter(student =>
          filters.grades?.includes(student.grade)
        );
      }

      if (filters.riskLevels && filters.riskLevels.length > 0) {
        filteredData = filteredData.filter(student =>
          filters.riskLevels?.includes(student.riskLevel)
        );
      }

      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        filteredData = filteredData.filter(student =>
          student.name.toLowerCase().includes(searchLower)
        );
      }

      setData(filteredData);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao buscar dados de risco dos estudantes'));
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, error, filters, setFilters, refetch: fetchData };
};

// Hook para dados de tendência de risco
export const useRiskTrendData = (period: string = '6m') => {
  const [data, setData] = useState<RiskTrendData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const result = await riskAnalysisService.getRiskTrendData(period);
      setData(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao buscar dados de tendência de risco'));
    } finally {
      setIsLoading(false);
    }
  }, [period]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, error, refetch: fetchData };
};

// Hook para dados de projeção de risco
export const useRiskProjectionData = (months: number = 6) => {
  const [data, setData] = useState<RiskProjectionData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const result = await riskAnalysisService.getRiskProjectionData(months);
      setData(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao buscar dados de projeção de risco'));
    } finally {
      setIsLoading(false);
    }
  }, [months]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, error, refetch: fetchData };
};

// Hook para dados de padrões de risco
export const useRiskPatternData = () => {
  const [data, setData] = useState<RiskPatternData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const result = await riskAnalysisService.getRiskPatternData();
      setData(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao buscar dados de padrões de risco'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, error, refetch: fetchData };
};

// Hook para dados de distribuição de risco
export const useRiskDistributionData = () => {
  const [data, setData] = useState<RiskDistributionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const result = await riskAnalysisService.getRiskDistributionData();
      setData(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao buscar dados de distribuição de risco'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, error, refetch: fetchData };
};

// Hook para dados de fatores de risco
export const useRiskFactorData = () => {
  const [data, setData] = useState<RiskFactorData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const result = await riskAnalysisService.getRiskFactorData();
      setData(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao buscar dados de fatores de risco'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, error, refetch: fetchData };
};

// Hook para indicadores de alerta precoce
export const useEarlyWarningIndicators = () => {
  const [data, setData] = useState<EarlyWarningIndicator[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const result = await riskAnalysisService.getEarlyWarningIndicators();
      setData(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao buscar indicadores de alerta precoce'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, error, refetch: fetchData };
};

// Hook principal que combina todos os dados
export const useRiskAnalysisDashboard = () => {
  const studentRisk = useStudentRiskData();
  const riskTrend = useRiskTrendData();
  const riskProjection = useRiskProjectionData();
  const riskPattern = useRiskPatternData();
  const riskDistribution = useRiskDistributionData();
  const riskFactors = useRiskFactorData();
  const earlyWarnings = useEarlyWarningIndicators();

  const isLoading =
    studentRisk.isLoading ||
    riskTrend.isLoading ||
    riskProjection.isLoading ||
    riskPattern.isLoading ||
    riskDistribution.isLoading ||
    riskFactors.isLoading ||
    earlyWarnings.isLoading;

  const refetchAll = useCallback(() => {
    studentRisk.refetch();
    riskTrend.refetch();
    riskProjection.refetch();
    riskPattern.refetch();
    riskDistribution.refetch();
    riskFactors.refetch();
    earlyWarnings.refetch();
  }, [
    studentRisk,
    riskTrend,
    riskProjection,
    riskPattern,
    riskDistribution,
    riskFactors,
    earlyWarnings
  ]);

  return {
    studentRiskData: studentRisk.data,
    riskTrendData: riskTrend.data,
    riskProjectionData: riskProjection.data,
    riskPatternData: riskPattern.data,
    riskDistributionData: riskDistribution.data,
    riskFactorData: riskFactors.data,
    earlyWarningIndicators: earlyWarnings.data,
    isLoading,
    filters: studentRisk.filters,
    setFilters: studentRisk.setFilters,
    refetch: refetchAll
  };
};
