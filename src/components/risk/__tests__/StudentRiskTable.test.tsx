import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import StudentRiskTable from '../StudentRiskTable';
import { StudentRiskData, RiskLevel } from '@/types/risk-analysis';

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
      leitura: {
        score: 58,
        threshold: 70,
        status: 'at-risk',
      },
      matemática: {
        score: 72,
        threshold: 70,
        status: 'on-track',
      },
    },
    lastAssessment: '2023-03-15',
    interventions: ['Grupo de leitura intensiva'],
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
      leitura: {
        score: 38,
        threshold: 70,
        status: 'critical',
      },
    },
    lastAssessment: '2023-03-10',
    interventions: [],
  },
  {
    id: '3',
    name: 'Carlos Mendes',
    grade: '4º Ano',
    riskLevel: 'low' as RiskLevel,
    riskScore: 85,
    previousScore: 80,
    changeTrend: 'improving',
    domains: {
      leitura: {
        score: 88,
        threshold: 70,
        status: 'above',
      },
    },
    lastAssessment: '2023-03-18',
    interventions: [],
  },
];

describe('StudentRiskTable', () => {
  it('renderiza a tabela com dados dos estudantes', () => {
    render(<StudentRiskTable data={mockStudentData} />);

    // Verificar título da tabela
    expect(screen.getByText('Estudantes em Risco')).toBeInTheDocument();

    // Verificar cabeçalhos da tabela
    expect(screen.getByText('Estudante')).toBeInTheDocument();
    expect(screen.getByText('Série')).toBeInTheDocument();
    expect(screen.getByText('Nível de Risco')).toBeInTheDocument();
    expect(screen.getByText('Pontuação')).toBeInTheDocument();
    expect(screen.getByText('Tendência')).toBeInTheDocument();

    // Verificar que os estudantes são renderizados
    expect(screen.getByText('Ana Silva')).toBeInTheDocument();
    expect(screen.getByText('Bruno Santos')).toBeInTheDocument();
    expect(screen.getByText('Carlos Mendes')).toBeInTheDocument();
  });

  it('expande os detalhes do estudante ao clicar no botão de expansão', () => {
    render(<StudentRiskTable data={mockStudentData} />);

    // Inicialmente, os detalhes não estão visíveis
    expect(screen.queryByText('Detalhes por Domínio')).not.toBeInTheDocument();

    // Clicar no botão de expansão do primeiro estudante
    const expandButtons = screen.getAllByLabelText('expandir linha');
    if (expandButtons && expandButtons.length > 0) {
      fireEvent.click(expandButtons[0] as HTMLElement);
    }

    // Agora os detalhes devem estar visíveis
    expect(screen.getByText('Detalhes por Domínio')).toBeInTheDocument();
    expect(screen.getByText('Leitura')).toBeInTheDocument();
    expect(screen.getByText('Matemática')).toBeInTheDocument();

    // Verificar as intervenções
    expect(screen.getByText('Intervenções Atuais')).toBeInTheDocument();
    expect(screen.getByText('Grupo de leitura intensiva')).toBeInTheDocument();
  });

  it('chama onStudentClick quando um estudante é clicado', () => {
    const handleStudentClick = jest.fn();
    render(<StudentRiskTable data={mockStudentData} onStudentClick={handleStudentClick} />);

    // Clicar na linha do primeiro estudante
    const studentName = screen.getByText('Ana Silva');
    const row = studentName.closest('tr');
    if (row) {
      fireEvent.click(row);
    }

    // Verificar que a função de callback foi chamada com o ID correto
    expect(handleStudentClick).toHaveBeenCalledWith('1');
  });

  it('ordena os estudantes por pontuação de risco em ordem decrescente por padrão', () => {
    render(<StudentRiskTable data={mockStudentData} />);

    // Obter todas as células com pontuações
    const scoreValues = screen.getAllByText(/^(\d+)$/);

    // Verificar que as pontuações estão em ordem decrescente
    const scores = scoreValues.map(el => parseInt(el.textContent || '0', 10));
    if (scores.length >= 3) {
      const score0 = scores[0] || 0;
      const score1 = scores[1] || 0;
      const score2 = scores[2] || 0;

      expect(score0 >= score1).toBe(true);
      expect(score1 >= score2).toBe(true);
    }
  });

  it('filtra estudantes quando não há dados', () => {
    render(<StudentRiskTable data={[]} />);

    // Verificar mensagem de dados não disponíveis
    expect(screen.getByText('Nenhum dado de estudante disponível')).toBeInTheDocument();
  });

  it('mostra indicador de carregamento', () => {
    render(<StudentRiskTable data={mockStudentData} isLoading={true} />);

    // CircularProgress deve estar presente
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });
});
