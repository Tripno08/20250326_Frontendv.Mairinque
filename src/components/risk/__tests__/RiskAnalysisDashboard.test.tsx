import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import RiskAnalysisDashboard from '../RiskAnalysisDashboard';
import { riskAnalysisService } from '@/services/riskAnalysisService';
import { RiskLevel, StudentRiskData } from '@/types/risk-analysis';

// Mock do serviço de análise de risco
jest.mock('@/services/riskAnalysisService', () => ({
  riskAnalysisService: {
    getStudentRiskData: jest.fn(),
    getRiskTrendData: jest.fn(),
    getRiskProjectionData: jest.fn(),
    getRiskPatternData: jest.fn(),
    getRiskDistributionData: jest.fn(),
    getRiskFactorData: jest.fn(),
    getEarlyWarningIndicators: jest.fn(),
  }
}));

// Mock dos hooks
jest.mock('@/hooks/useRiskAnalysis', () => ({
  useRiskAnalysisDashboard: () => ({
    studentRiskData: mockStudentData,
    riskTrendData: [],
    riskProjectionData: [],
    riskPatternData: [],
    riskDistributionData: {
      low: 180,
      moderate: 95,
      high: 32,
      severe: 12,
      total: 319
    },
    riskFactorData: [],
    earlyWarningIndicators: [],
    isLoading: false,
    refetch: jest.fn(),
    setFilters: jest.fn()
  })
}));

// Dados de exemplo para testes
const mockStudentData: StudentRiskData[] = [
  {
    id: '1',
    name: 'Ana Silva',
    grade: '3º Ano',
    riskLevel: 'moderate' as RiskLevel,
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
      }
    },
    lastAssessment: '2023-03-15',
    interventions: ['Grupo de leitura intensiva']
  },
  {
    id: '2',
    name: 'Bruno Santos',
    grade: '2º Ano',
    riskLevel: 'high' as RiskLevel,
    riskScore: 42,
    previousScore: 40,
    changeTrend: 'stable',
    domains: {
      'leitura': {
        score: 38,
        threshold: 70,
        status: 'critical'
      }
    },
    lastAssessment: '2023-03-10',
    interventions: []
  }
];

describe('RiskAnalysisDashboard', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (riskAnalysisService.getStudentRiskData as jest.Mock).mockResolvedValue(mockStudentData);
    (riskAnalysisService.getRiskDistributionData as jest.Mock).mockResolvedValue({
      low: 180,
      moderate: 95,
      high: 32,
      severe: 12,
      total: 319
    });
  });

  it('renderiza o título do dashboard', () => {
    render(<RiskAnalysisDashboard />);
    expect(screen.getByText('Dashboard de Análise de Risco')).toBeInTheDocument();
  });

  it('renderiza os gráficos e componentes principais', () => {
    render(<RiskAnalysisDashboard />);

    // Verifica componentes principais
    expect(screen.getByText('Distribuição de Níveis de Risco')).toBeInTheDocument();
    expect(screen.getByText('Tendências de Risco')).toBeInTheDocument();
    expect(screen.getByText('Projeções de Risco')).toBeInTheDocument();

    // Verifica as tabs
    expect(screen.getByText('Estudantes em Risco')).toBeInTheDocument();
    expect(screen.getByText('Alertas Precoces')).toBeInTheDocument();
    expect(screen.getByText('Fatores de Risco')).toBeInTheDocument();
  });

  it('exibe o painel de filtros ao clicar no botão', () => {
    render(<RiskAnalysisDashboard />);

    // Inicialmente o painel de filtros está oculto
    expect(screen.queryByText('Pesquisar estudante')).not.toBeInTheDocument();

    // Clicar no botão de filtros
    fireEvent.click(screen.getByText('Filtros'));

    // Agora o painel deve estar visível
    expect(screen.getByLabelText('Pesquisar estudante')).toBeInTheDocument();
    expect(screen.getByLabelText('Série')).toBeInTheDocument();
    expect(screen.getByLabelText('Nível de Risco')).toBeInTheDocument();
  });

  it('navega entre as abas corretamente', () => {
    render(<RiskAnalysisDashboard />);

    // Por padrão, a primeira aba está ativa
    expect(screen.getByText('Estudantes em Situação de Risco')).toBeInTheDocument();

    // Clicar na segunda aba
    fireEvent.click(screen.getByText('Alertas Precoces'));
    expect(screen.getByText('Indicadores que sinalizam potenciais dificuldades acadêmicas')).toBeInTheDocument();

    // Clicar na terceira aba
    fireEvent.click(screen.getByText('Fatores de Risco'));
    expect(screen.getByText('Principais fatores correlacionados com baixo desempenho acadêmico')).toBeInTheDocument();
  });

  it('chama a função onStudentClick quando um estudante é clicado', () => {
    const handleStudentClick = jest.fn();
    render(<RiskAnalysisDashboard onStudentClick={handleStudentClick} />);

    // Encontrar e clicar na linha do estudante
    const studentName = screen.getByText('Ana Silva');
    fireEvent.click(studentName.closest('tr')!);

    expect(handleStudentClick).toHaveBeenCalledWith('1');
  });

  it('chama a função onExportData quando o botão de exportação é clicado', () => {
    const handleExportData = jest.fn();
    render(<RiskAnalysisDashboard onExportData={handleExportData} />);

    // Encontrar e clicar no botão de exportação
    fireEvent.click(screen.getByText('Exportar'));

    expect(handleExportData).toHaveBeenCalledWith('csv');
  });
});
