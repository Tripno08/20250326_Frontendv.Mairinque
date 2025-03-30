import {
  StudentRiskData,
  RiskTrendData,
  RiskProjectionData,
  RiskPatternData,
  RiskDistributionData,
  RiskFactorData,
  EarlyWarningIndicator
} from '@/types/risk-analysis';

// Dados de exemplo
const mockStudentRiskData: StudentRiskData[] = [
  {
    id: '1',
    name: 'Ana Silva',
    grade: '3º Ano',
    riskLevel: 'moderate',
    riskScore: 65,
    previousScore: 72,
    changeTrend: 'worsening',
    domains: {
      'leitura': {
        score: 58,
        threshold: 70,
        status: 'at-risk'
      },
      'matemática': {
        score: 72,
        threshold: 70,
        status: 'on-track'
      },
      'escrita': {
        score: 64,
        threshold: 70,
        status: 'at-risk'
      }
    },
    lastAssessment: '2023-03-15',
    interventions: ['Grupo de leitura intensiva', 'Monitoria de escrita']
  },
  {
    id: '2',
    name: 'Bruno Santos',
    grade: '2º Ano',
    riskLevel: 'high',
    riskScore: 42,
    previousScore: 40,
    changeTrend: 'stable',
    domains: {
      'leitura': {
        score: 38,
        threshold: 70,
        status: 'critical'
      },
      'matemática': {
        score: 45,
        threshold: 70,
        status: 'at-risk'
      },
      'escrita': {
        score: 42,
        threshold: 70,
        status: 'at-risk'
      }
    },
    lastAssessment: '2023-03-10',
    interventions: ['Intervenção de leitura diária', 'Apoio individual']
  },
  {
    id: '3',
    name: 'Clara Oliveira',
    grade: '4º Ano',
    riskLevel: 'low',
    riskScore: 85,
    previousScore: 78,
    changeTrend: 'improving',
    domains: {
      'leitura': {
        score: 88,
        threshold: 70,
        status: 'above'
      },
      'matemática': {
        score: 82,
        threshold: 70,
        status: 'above'
      },
      'escrita': {
        score: 86,
        threshold: 70,
        status: 'above'
      }
    },
    lastAssessment: '2023-03-18',
    interventions: []
  },
  {
    id: '4',
    name: 'Daniel Costa',
    grade: '3º Ano',
    riskLevel: 'severe',
    riskScore: 25,
    previousScore: 30,
    changeTrend: 'worsening',
    domains: {
      'leitura': {
        score: 22,
        threshold: 70,
        status: 'critical'
      },
      'matemática': {
        score: 28,
        threshold: 70,
        status: 'critical'
      },
      'escrita': {
        score: 26,
        threshold: 70,
        status: 'critical'
      }
    },
    lastAssessment: '2023-03-12',
    interventions: ['Suporte intensivo diário', 'Terapia educacional']
  },
  {
    id: '5',
    name: 'Eduarda Lima',
    grade: '2º Ano',
    riskLevel: 'moderate',
    riskScore: 62,
    previousScore: 58,
    changeTrend: 'improving',
    domains: {
      'leitura': {
        score: 66,
        threshold: 70,
        status: 'at-risk'
      },
      'matemática': {
        score: 55,
        threshold: 70,
        status: 'at-risk'
      },
      'escrita': {
        score: 64,
        threshold: 70,
        status: 'at-risk'
      }
    },
    lastAssessment: '2023-03-16',
    interventions: ['Grupo de leitura intensiva']
  }
];

const mockRiskTrendData: RiskTrendData[] = [
  {
    date: '2023-01',
    lowRisk: 62,
    moderateRisk: 28,
    highRisk: 8,
    severeRisk: 2
  },
  {
    date: '2023-02',
    lowRisk: 60,
    moderateRisk: 29,
    highRisk: 9,
    severeRisk: 2
  },
  {
    date: '2023-03',
    lowRisk: 58,
    moderateRisk: 30,
    highRisk: 9,
    severeRisk: 3
  },
  {
    date: '2023-04',
    lowRisk: 56,
    moderateRisk: 31,
    highRisk: 10,
    severeRisk: 3
  },
  {
    date: '2023-05',
    lowRisk: 54,
    moderateRisk: 32,
    highRisk: 11,
    severeRisk: 3
  },
  {
    date: '2023-06',
    lowRisk: 58,
    moderateRisk: 30,
    highRisk: 9,
    severeRisk: 3
  }
];

const mockRiskProjectionData: RiskProjectionData[] = [
  {
    month: 'Jan',
    projected: 12,
    actual: 10,
    baseline: 15
  },
  {
    month: 'Fev',
    projected: 11,
    actual: 12,
    baseline: 15
  },
  {
    month: 'Mar',
    projected: 10,
    actual: 9,
    baseline: 15
  },
  {
    month: 'Abr',
    projected: 9,
    actual: 11,
    baseline: 15
  },
  {
    month: 'Mai',
    projected: 8,
    actual: 8,
    baseline: 15
  },
  {
    month: 'Jun',
    projected: 7,
    baseline: 15
  },
  {
    month: 'Jul',
    projected: 6,
    baseline: 15
  },
  {
    month: 'Ago',
    projected: 5,
    baseline: 15
  }
];

const mockRiskPatternData: RiskPatternData[] = [
  {
    domain: 'Ausências',
    correlationScore: 0.85,
    impactFactor: 0.9,
    studentsAffected: 28,
    riskContribution: 0.4
  },
  {
    domain: 'Notas Baixas',
    correlationScore: 0.78,
    impactFactor: 0.85,
    studentsAffected: 42,
    riskContribution: 0.35
  },
  {
    domain: 'Comportamento',
    correlationScore: 0.65,
    impactFactor: 0.7,
    studentsAffected: 15,
    riskContribution: 0.15
  },
  {
    domain: 'Participação',
    correlationScore: 0.58,
    impactFactor: 0.6,
    studentsAffected: 22,
    riskContribution: 0.1
  }
];

const mockRiskDistributionData: RiskDistributionData = {
  low: 180,
  moderate: 95,
  high: 32,
  severe: 12,
  total: 319
};

const mockRiskFactorData: RiskFactorData[] = [
  {
    factor: 'Frequência < 80%',
    weight: 0.35,
    students: 48,
    significance: 'high'
  },
  {
    factor: 'Nota em leitura < 60%',
    weight: 0.28,
    students: 72,
    significance: 'high'
  },
  {
    factor: 'Nota em matemática < 60%',
    weight: 0.22,
    students: 64,
    significance: 'medium'
  },
  {
    factor: 'Múltiplas ocorrências disciplinares',
    weight: 0.15,
    students: 28,
    significance: 'medium'
  }
];

const mockEarlyWarningIndicators: EarlyWarningIndicator[] = [
  {
    id: '1',
    name: 'Queda na fluência de leitura',
    description: 'Redução significativa nas palavras corretas por minuto',
    threshold: 15,
    currentValue: 22,
    status: 'critical',
    trend: 'worsening',
    affectedStudents: 28
  },
  {
    id: '2',
    name: 'Aumento de ausências',
    description: 'Crescimento no número de faltas nos últimos 30 dias',
    threshold: 10,
    currentValue: 12,
    status: 'warning',
    trend: 'worsening',
    affectedStudents: 32
  },
  {
    id: '3',
    name: 'Queda em avaliações formativas',
    description: 'Redução na média das avaliações formativas recentes',
    threshold: 10,
    currentValue: 8,
    status: 'normal',
    trend: 'stable',
    affectedStudents: 15
  },
  {
    id: '4',
    name: 'Não conclusão de tarefas',
    description: 'Aumento no número de tarefas não entregues',
    threshold: 20,
    currentValue: 25,
    status: 'warning',
    trend: 'worsening',
    affectedStudents: 42
  }
];

// Simulação de atraso de rede
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Exportação do serviço
export const riskAnalysisService = {
  getStudentRiskData: async (): Promise<StudentRiskData[]> => {
    await delay(800);
    return [...mockStudentRiskData];
  },

  getRiskTrendData: async (period: string): Promise<RiskTrendData[]> => {
    await delay(600);
    return [...mockRiskTrendData];
  },

  getRiskProjectionData: async (months: number): Promise<RiskProjectionData[]> => {
    await delay(700);
    return mockRiskProjectionData.slice(0, months);
  },

  getRiskPatternData: async (): Promise<RiskPatternData[]> => {
    await delay(500);
    return [...mockRiskPatternData];
  },

  getRiskDistributionData: async (): Promise<RiskDistributionData> => {
    await delay(400);
    return {...mockRiskDistributionData};
  },

  getRiskFactorData: async (): Promise<RiskFactorData[]> => {
    await delay(600);
    return [...mockRiskFactorData];
  },

  getEarlyWarningIndicators: async (): Promise<EarlyWarningIndicator[]> => {
    await delay(500);
    return [...mockEarlyWarningIndicators];
  }
};
