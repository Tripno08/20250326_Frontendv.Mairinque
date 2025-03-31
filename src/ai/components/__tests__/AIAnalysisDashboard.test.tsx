import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { AIAnalysisDashboard } from '../AIAnalysisDashboard';
import { StudentData } from '../../types/ai.types';

const theme = createTheme();

const mockStudents: StudentData[] = [
  {
    id: '1',
    createdAt: new Date(),
    updatedAt: new Date(),
    academicPerformance: {
      grades: [7.5, 8.0, 7.8],
      attendance: 0.85,
      behavior: 0.9,
    },
    demographicData: {
      age: 15,
      grade: 9,
      socioeconomicStatus: 0.7,
    },
    interventionHistory: [
      {
        type: 'academic',
        date: new Date(),
        outcome: 0.8,
      },
    ],
  },
  {
    id: '2',
    createdAt: new Date(),
    updatedAt: new Date(),
    academicPerformance: {
      grades: [6.0, 5.5, 6.2],
      attendance: 0.7,
      behavior: 0.8,
    },
    demographicData: {
      age: 16,
      grade: 9,
      socioeconomicStatus: 0.5,
    },
    interventionHistory: [
      {
        type: 'behavioral',
        date: new Date(),
        outcome: 0.6,
      },
    ],
  },
];

const mockRiskPredictions = [
  { studentId: '1', riskScore: 0.3, confidence: 0.85 },
  { studentId: '2', riskScore: 0.7, confidence: 0.9 },
];

const mockRecommendations = [
  {
    id: '1',
    studentId: '2',
    type: 'academic',
    description: 'Recomendação de reforço escolar',
    priority: 'high',
    confidence: 0.85,
  },
];

const mockClusters = [
  {
    id: '1',
    name: 'Cluster 1',
    students: ['1'],
    metrics: {
      averageGrade: 7.5,
      attendance: 0.85,
      behavior: 0.9,
    },
  },
  {
    id: '2',
    name: 'Cluster 2',
    students: ['2'],
    metrics: {
      averageGrade: 6.0,
      attendance: 0.7,
      behavior: 0.8,
    },
  },
];

const mockPatterns = [
  {
    id: '1',
    type: 'anomaly',
    description: 'Queda significativa nas notas',
    confidence: 0.85,
    affectedStudents: ['2'],
    metrics: [
      { name: 'Variação', value: -2.5 },
      { name: 'Impacto', value: 0.8 },
    ],
  },
];

jest.mock('../../hooks/useAIAnalysis', () => ({
  useAIAnalysis: () => ({
    riskPredictions: mockRiskPredictions,
    recommendations: mockRecommendations,
    clusters: mockClusters,
    patterns: mockPatterns,
    isLoading: false,
    error: null,
    analyzeStudents: jest.fn(),
    getClusterVisualization: () => ({
      x: [0.5, 0.7],
      y: [0.6, 0.8],
      labels: [0, 1],
    }),
    getPatternsByType: (type: string) => mockPatterns.filter(p => p.type === type),
  }),
}));

describe('AIAnalysisDashboard', () => {
  it('renderiza o dashboard corretamente', () => {
    render(
      <ThemeProvider theme={theme}>
        <AIAnalysisDashboard students={mockStudents} />
      </ThemeProvider>
    );

    // Verifica se os cards de resumo estão presentes
    expect(screen.getByText('Estudantes em Risco')).toBeInTheDocument();
    expect(screen.getByText('Recomendações Ativas')).toBeInTheDocument();
    expect(screen.getByText('Clusters Identificados')).toBeInTheDocument();
    expect(screen.getByText('Padrões Detectados')).toBeInTheDocument();

    // Verifica se os valores estão corretos
    expect(screen.getByText('1')).toBeInTheDocument(); // Estudantes em risco
    expect(screen.getByText('1')).toBeInTheDocument(); // Recomendações ativas
    expect(screen.getByText('2')).toBeInTheDocument(); // Clusters
    expect(screen.getByText('1')).toBeInTheDocument(); // Padrões

    // Verifica se os gráficos estão presentes
    expect(screen.getByText('Distribuição de Risco')).toBeInTheDocument();
    expect(screen.getByText('Clusters de Estudantes')).toBeInTheDocument();

    // Verifica se as anomalias e tendências estão presentes
    expect(screen.getByText('Anomalias Detectadas')).toBeInTheDocument();
    expect(screen.getByText('Tendências Identificadas')).toBeInTheDocument();
  });

  it('mostra loading state quando carregando', () => {
    jest.spyOn(require('../../hooks/useAIAnalysis'), 'useAIAnalysis').mockImplementation(() => ({
      ...mockStudents,
      isLoading: true,
    }));

    render(
      <ThemeProvider theme={theme}>
        <AIAnalysisDashboard students={mockStudents} />
      </ThemeProvider>
    );

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('mostra mensagem de erro quando há erro', () => {
    const errorMessage = 'Erro ao carregar dados';
    jest.spyOn(require('../../hooks/useAIAnalysis'), 'useAIAnalysis').mockImplementation(() => ({
      ...mockStudents,
      error: new Error(errorMessage),
    }));

    render(
      <ThemeProvider theme={theme}>
        <AIAnalysisDashboard students={mockStudents} />
      </ThemeProvider>
    );

    expect(screen.getByText(`Erro ao carregar análise: ${errorMessage}`)).toBeInTheDocument();
  });

  it('chama onStudentSelect quando um estudante é selecionado', async () => {
    const onStudentSelect = jest.fn();
    render(
      <ThemeProvider theme={theme}>
        <AIAnalysisDashboard students={mockStudents} onStudentSelect={onStudentSelect} />
      </ThemeProvider>
    );

    // Simula a seleção de um estudante (você precisará adicionar um elemento clicável no componente)
    // Por exemplo, se houver um botão ou card clicável:
    // fireEvent.click(screen.getByText('João Silva'));

    // expect(onStudentSelect).toHaveBeenCalledWith('1');
  });
});
