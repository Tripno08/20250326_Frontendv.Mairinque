import { useQuery } from '@tanstack/react-query';
import { http } from '@/lib/http';

interface TierDistribution {
  tier1: number;
  tier2: number;
  tier3: number;
}

interface DomainSummary {
  reading: number;
  math: number;
  writing: number;
}

interface AssessmentCoverage {
  total: number;
  assessed: number;
}

interface DashboardData {
  tierDistribution: TierDistribution;
  domainSummary: DomainSummary;
  assessmentCoverage: AssessmentCoverage;
}

const fetchDashboardData = async (): Promise<DashboardData> => {
  const response = await http.get<DashboardData>('/api/dashboard');
  return response.data;
};

export const useDashboard = () => {
  return useQuery<DashboardData, Error>({
    queryKey: ['dashboard'],
    queryFn: fetchDashboardData,
    staleTime: 5 * 60 * 1000, // 5 minutos
    cacheTime: 30 * 60 * 1000, // 30 minutos
  });
};
