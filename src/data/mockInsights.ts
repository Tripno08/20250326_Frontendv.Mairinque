import { ActionableInsight, AlertLevel, UserProfile } from '@/types/actionable-insights';

/**
 * Dados de exemplo para insights acionáveis.
 */
export const mockInsights: ActionableInsight[] = [
  {
    id: '1',
    title: 'Queda no desempenho de leitura no 3º ano',
    description:
      'Identificada uma queda de 15% no desempenho médio de leitura dos alunos do 3º ano nas últimas avaliações.',
    alertLevel: 'high',
    timestamp: '2023-11-15T10:30:00Z',
    category: 'Acadêmico',
    impactArea: ['Leitura', 'Desempenho'],
    suggestedActions: [
      'Implementar avaliação diagnóstica específica para identificar lacunas',
      'Revisar o planejamento de atividades de leitura',
      'Organizar grupos de intervenção Tier 2 para alunos com maior dificuldade',
    ],
    potentialImpact: 85,
    profileRelevance: {
      teacher: 0.9,
      specialist: 0.8,
      coordinator: 0.7,
      principal: 0.5,
      administrator: 0.3,
    },
    isAcknowledged: true,
    isResolved: false,
    dateAcknowledged: '2023-11-16T08:45:00Z',
    evidence: {
      dataPoints: [
        { name: 'Setembro', value: 78, baseline: 75 },
        { name: 'Outubro', value: 72, baseline: 75 },
        { name: 'Novembro', value: 64, baseline: 75, comparisonValue: 79 },
      ],
      trend: {
        direction: 'down',
        percentChange: -15.2,
        period: 'últimos 3 meses',
      },
      sources: [
        'Avaliações formativas',
        'Registros de leitura semanal',
        'Comparativo com anos anteriores',
      ],
    },
  },
  {
    id: '2',
    title: 'Aumento na ausência escolar',
    description:
      'Aumento significativo nas ausências de estudantes, especialmente às segundas e sextas-feiras.',
    alertLevel: 'moderate',
    timestamp: '2023-11-18T09:15:00Z',
    category: 'Atendimento',
    impactArea: ['Frequência', 'Engajamento'],
    suggestedActions: [
      'Identificar padrões de ausência por turma e dia da semana',
      'Contatar familiares dos alunos com mais de 3 faltas no mês',
      'Implementar programa de incentivo à presença regular',
    ],
    potentialImpact: 70,
    profileRelevance: {
      teacher: 0.7,
      specialist: 0.4,
      coordinator: 0.9,
      principal: 0.8,
      administrator: 0.6,
    },
    isAcknowledged: false,
    isResolved: false,
    evidence: {
      dataPoints: [
        { name: 'Setembro', value: 92, baseline: 95 },
        { name: 'Outubro', value: 88, baseline: 95 },
        { name: 'Novembro', value: 84, baseline: 95, comparisonValue: 91 },
      ],
      trend: {
        direction: 'down',
        percentChange: -8.5,
        period: 'últimos 3 meses',
      },
      sources: ['Registros de frequência', 'Relatórios comparativos mensais'],
    },
  },
  {
    id: '3',
    title: 'Baixa efetividade das intervenções de matemática',
    description:
      'As intervenções de matemática para o 5º ano não estão produzindo os resultados esperados após 8 semanas.',
    alertLevel: 'critical',
    timestamp: '2023-11-20T14:25:00Z',
    category: 'Acadêmico',
    impactArea: ['Matemática', 'Desempenho'],
    suggestedActions: [
      'Revisar a metodologia das intervenções atuais',
      'Realizar avaliação diagnóstica detalhada das habilidades específicas',
      'Aumentar a frequência das intervenções para 3x por semana',
      'Implementar uso de materiais manipulativos para conceitos abstratos',
    ],
    potentialImpact: 90,
    profileRelevance: {
      teacher: 0.8,
      specialist: 0.9,
      coordinator: 0.8,
      principal: 0.6,
      administrator: 0.4,
    },
    isAcknowledged: true,
    isResolved: false,
    dateAcknowledged: '2023-11-21T09:10:00Z',
    evidence: {
      dataPoints: [
        { name: 'Semana 1', value: 45, baseline: 42 },
        { name: 'Semana 4', value: 48, baseline: 50 },
        { name: 'Semana 8', value: 51, baseline: 65, comparisonValue: 62 },
      ],
      trend: {
        direction: 'up',
        percentChange: 6.2,
        period: '8 semanas de intervenção',
      },
      sources: [
        'Avaliações de progresso semanal',
        'Registros de intervenção',
        'Comparativo com grupos similares',
      ],
    },
  },
  {
    id: '4',
    title: 'Oportunidade de melhoria no programa socioemocional',
    description:
      'Identificado potencial para ampliar o impacto do programa socioemocional com base em novas evidências.',
    alertLevel: 'low',
    timestamp: '2023-11-22T11:45:00Z',
    category: 'Comportamental',
    impactArea: ['Socioemocional', 'Comportamento'],
    suggestedActions: [
      'Integrar componentes de mindfulness às atividades atuais',
      'Incluir práticas de resolução colaborativa de problemas',
      'Capacitar professores em técnicas de feedback positivo',
    ],
    potentialImpact: 65,
    profileRelevance: {
      teacher: 0.7,
      specialist: 0.9,
      coordinator: 0.8,
      principal: 0.7,
      administrator: 0.5,
    },
    isAcknowledged: false,
    isResolved: false,
    evidence: {
      dataPoints: [
        { name: 'Autoconhecimento', value: 72, baseline: 70 },
        { name: 'Autorregulação', value: 65, baseline: 68 },
        { name: 'Habilidades Sociais', value: 78, baseline: 75 },
        { name: 'Tomada de Decisão', value: 70, baseline: 72 },
      ],
      trend: {
        direction: 'stable',
        period: 'último semestre',
      },
      sources: ['Avaliações socioemocionais', 'Observações em sala', 'Pesquisas com professores'],
    },
  },
  {
    id: '5',
    title: 'Padrão de dificuldade em escrita narrativa',
    description:
      'Identificado padrão consistente de dificuldade em escrita narrativa entre alunos do 4º ano.',
    alertLevel: 'moderate',
    timestamp: '2023-11-23T13:20:00Z',
    category: 'Acadêmico',
    impactArea: ['Escrita', 'Desempenho'],
    suggestedActions: [
      'Desenvolver oficinas específicas de escrita narrativa',
      'Implementar estratégia de modelagem com exemplos graduados',
      'Criar rubrica visual para autoavaliação dos alunos',
    ],
    potentialImpact: 75,
    profileRelevance: {
      teacher: 0.9,
      specialist: 0.8,
      coordinator: 0.6,
      principal: 0.4,
      administrator: 0.3,
    },
    isAcknowledged: true,
    isResolved: true,
    dateAcknowledged: '2023-11-24T08:30:00Z',
    dateResolved: '2023-12-05T15:40:00Z',
    evidence: {
      dataPoints: [
        { name: 'Estrutura', value: 45, baseline: 65 },
        { name: 'Vocabulário', value: 60, baseline: 70 },
        { name: 'Coesão', value: 42, baseline: 60 },
        { name: 'Criatividade', value: 72, baseline: 75 },
      ],
      trend: {
        direction: 'down',
        percentChange: -22.0,
        period: 'comparado com expectativa para o ano',
      },
      sources: ['Amostras de escrita', 'Rubrica analítica', 'Avaliações bimestrais'],
    },
  },
  {
    id: '6',
    title: 'Alunos com potencial para aceleração',
    description:
      'Grupo de alunos identificados com potencial para aceleração em ciências com base em desempenho consistente.',
    alertLevel: 'low',
    timestamp: '2023-11-24T10:05:00Z',
    category: 'Acadêmico',
    impactArea: ['Desempenho', 'Engajamento'],
    suggestedActions: [
      'Desenvolver plano de enriquecimento para estes alunos',
      'Implementar projeto de mentoria com professores de anos mais avançados',
      'Oferecer recursos complementares de aprofundamento',
    ],
    potentialImpact: 60,
    profileRelevance: {
      teacher: 0.8,
      specialist: 0.7,
      coordinator: 0.9,
      principal: 0.6,
      administrator: 0.4,
    },
    isAcknowledged: false,
    isResolved: false,
    evidence: {
      dataPoints: [
        { name: 'Avaliação 1', value: 92, baseline: 80 },
        { name: 'Avaliação 2', value: 94, baseline: 80 },
        { name: 'Projetos', value: 95, baseline: 85 },
      ],
      trend: {
        direction: 'up',
        percentChange: 15.0,
        period: 'comparado com média da turma',
      },
      sources: ['Avaliações formativas', 'Projetos de ciências', 'Observações de engajamento'],
    },
  },
  {
    id: '7',
    title: 'Necessidade de formação em diferenciação de ensino',
    description:
      'Identificada necessidade de apoio aos professores para implementação efetiva de estratégias de diferenciação.',
    alertLevel: 'moderate',
    timestamp: '2023-11-25T15:30:00Z',
    category: 'Administrativo',
    impactArea: ['Desempenho', 'Engajamento'],
    suggestedActions: [
      'Organizar formação específica sobre diferenciação em sala',
      'Implementar sistema de observação e feedback entre pares',
      'Disponibilizar recursos práticos e modelos de planos diferenciados',
    ],
    potentialImpact: 80,
    profileRelevance: {
      teacher: 0.7,
      specialist: 0.6,
      coordinator: 0.9,
      principal: 0.8,
      administrator: 0.7,
    },
    isAcknowledged: true,
    isResolved: false,
    dateAcknowledged: '2023-11-26T09:15:00Z',
    evidence: {
      dataPoints: [
        { name: 'Professores implementando', value: 35, baseline: 70 },
        { name: 'Confiança no método', value: 42, baseline: 75 },
        { name: 'Recursos disponíveis', value: 30, baseline: 65 },
      ],
      trend: {
        direction: 'down',
        percentChange: -48.6,
        period: 'em relação à meta institucional',
      },
      sources: [
        'Pesquisa com professores',
        'Observações de aula',
        'Dados de desempenho dos alunos',
      ],
    },
  },
  {
    id: '8',
    title: 'Risco de retenção detectado',
    description:
      'Grupo de 12 alunos identificados com alto risco de retenção com base em múltiplos indicadores.',
    alertLevel: 'critical',
    timestamp: '2023-11-27T08:45:00Z',
    category: 'Acadêmico',
    impactArea: ['Desempenho', 'Frequência'],
    suggestedActions: [
      'Estabelecer reunião emergencial da equipe multidisciplinar',
      'Implementar plano de intervenção intensivo (Tier 3) imediatamente',
      'Agendar reuniões individuais com famílias',
      'Estabelecer metas semanais de progresso com monitoramento próximo',
    ],
    potentialImpact: 95,
    profileRelevance: {
      teacher: 0.9,
      specialist: 0.9,
      coordinator: 0.9,
      principal: 0.8,
      administrator: 0.7,
    },
    isAcknowledged: true,
    isResolved: false,
    dateAcknowledged: '2023-11-27T10:20:00Z',
    evidence: {
      dataPoints: [
        { name: 'Desempenho Global', value: 35, baseline: 60 },
        { name: 'Frequência', value: 68, baseline: 92 },
        { name: 'Tarefas Completas', value: 40, baseline: 75 },
      ],
      trend: {
        direction: 'down',
        percentChange: -38.5,
        period: 'ao longo do semestre',
      },
      sources: [
        'Avaliações acumuladas',
        'Registros de frequência',
        'Relatórios de conclusão de tarefas',
        'Modelo preditivo de risco de retenção',
      ],
    },
  },
];

/**
 * Obtém insights filtrados por nível de alerta.
 */
export const getInsightsByAlertLevel = (level: AlertLevel): ActionableInsight[] => {
  return mockInsights.filter(insight => insight.alertLevel === level);
};

/**
 * Obtém insights relevantes para um perfil específico.
 */
export const getInsightsByProfileRelevance = (
  profile: UserProfile,
  threshold = 0.7
): ActionableInsight[] => {
  return mockInsights
    .filter(insight => insight.profileRelevance[profile] >= threshold)
    .sort((a, b) => b.profileRelevance[profile] - a.profileRelevance[profile]);
};

/**
 * Obtém insights por categoria.
 */
export const getInsightsByCategory = (category: string): ActionableInsight[] => {
  return mockInsights.filter(insight => insight.category === category);
};

/**
 * Obtém insights por área de impacto.
 */
export const getInsightsByImpactArea = (area: string): ActionableInsight[] => {
  return mockInsights.filter(insight => insight.impactArea.includes(area));
};

/**
 * Obtém insights resolvidos ou não resolvidos.
 */
export const getInsightsByResolutionStatus = (resolved: boolean): ActionableInsight[] => {
  return mockInsights.filter(insight => insight.isResolved === resolved);
};

/**
 * Obtém insights reconhecidos ou não reconhecidos.
 */
export const getInsightsByAcknowledgementStatus = (acknowledged: boolean): ActionableInsight[] => {
  return mockInsights.filter(insight => insight.isAcknowledged === acknowledged);
};
