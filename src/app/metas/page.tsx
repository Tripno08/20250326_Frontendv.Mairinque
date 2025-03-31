'use client';

import React, { useState } from 'react';
import { Container, Box, Typography, Tabs, Tab, Button } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import { SmartGoalList } from '@/components/goals/SmartGoalList';
import { SmartGoalForm } from '@/components/goals/SmartGoalForm';
import { GoalProgressUpdate } from '@/components/goals/GoalProgressUpdate';
import { GoalProgressChart } from '@/components/goals/GoalProgressChart';
import type { SmartGoal, SmartGoalFormData } from '@/types/smart-goals';
import type { Intervention, InterventionTier } from '@/types/intervention';

// Dados de exemplo para metas SMART
const EXAMPLE_GOALS: SmartGoal[] = [
  {
    id: 'goal-1',
    studentId: 'student-123',
    title: 'Melhorar fluência de leitura',
    description: 'Aumentar a velocidade e precisão na leitura oral',
    specificDetails:
      'Aumentar a fluência de leitura de 60 para 90 palavras por minuto com 95% de precisão em textos de nível escolar',
    measurement: {
      initialValue: 60,
      targetValue: 90,
      currentValue: 72,
      unit: 'palavras/min',
      progressHistory: [
        { date: new Date('2023-09-01'), value: 60, notes: 'Avaliação inicial' },
        { date: new Date('2023-09-15'), value: 65, notes: 'Após 2 semanas de prática diária' },
        { date: new Date('2023-10-01'), value: 72, notes: 'Melhora consistente' },
      ],
    },
    achievementSteps: [
      'Prática diária de leitura por 15 minutos',
      'Uso de cronômetro para medir velocidade',
      'Reler textos para aumentar familiaridade',
      'Participar de grupo de leitura semanal',
    ],
    relevance:
      'A fluência de leitura é fundamental para a compreensão textual e para o sucesso acadêmico em todas as disciplinas',
    startDate: new Date('2023-09-01'),
    targetDate: new Date('2023-12-15'),
    status: 'em andamento',
    priority: 'alta',
    createdAt: new Date('2023-09-01'),
    updatedAt: new Date('2023-10-01'),
    interventions: ['intervention-1', 'intervention-2'],
    domain: 'Língua Portuguesa',
    skills: ['Fluência de leitura', 'Decodificação', 'Compreensão textual'],
    responsibleUsers: ['Professor de Português', 'Psicopedagogo'],
  },
  {
    id: 'goal-2',
    studentId: 'student-123',
    title: 'Desenvolver habilidades de resolução de problemas matemáticos',
    description: 'Melhorar a capacidade de resolver problemas matemáticos do 5º ano',
    specificDetails:
      'Aumentar a taxa de acerto em problemas matemáticos envolvendo frações de 40% para 80% em avaliações padronizadas',
    measurement: {
      initialValue: 40,
      targetValue: 80,
      currentValue: 60,
      unit: '% de acertos',
      progressHistory: [
        { date: new Date('2023-08-15'), value: 40, notes: 'Avaliação diagnóstica' },
        { date: new Date('2023-09-15'), value: 52, notes: 'Após intervenções iniciais' },
        {
          date: new Date('2023-10-15'),
          value: 60,
          notes: 'Progresso constante, mas precisa de mais prática',
        },
      ],
    },
    achievementSteps: [
      'Usar materiais concretos para visualizar frações',
      'Praticar problemas com contextos reais diariamente',
      'Criar representações visuais dos problemas',
      'Explicar o raciocínio utilizado para resolver problemas',
    ],
    relevance:
      'A compreensão de frações é um fundamento crítico para matemática avançada e aplicações na vida cotidiana',
    startDate: new Date('2023-08-15'),
    targetDate: new Date('2024-01-31'),
    status: 'em andamento',
    priority: 'média',
    createdAt: new Date('2023-08-15'),
    updatedAt: new Date('2023-10-15'),
    interventions: ['intervention-3'],
    domain: 'Matemática',
    skills: ['Frações', 'Resolução de problemas', 'Raciocínio lógico'],
    responsibleUsers: ['Professor de Matemática', 'Tutor'],
  },
  {
    id: 'goal-3',
    studentId: 'student-123',
    title: 'Reduzir comportamentos disruptivos em sala de aula',
    description: 'Diminuir interrupções e comportamentos que afetam a aprendizagem',
    specificDetails:
      'Reduzir a frequência de interrupções em sala de aula de média de 12 para 3 por dia, medidas por observação direta',
    measurement: {
      initialValue: 12,
      targetValue: 3,
      currentValue: 8,
      unit: 'interrupções/dia',
      progressHistory: [
        { date: new Date('2023-09-10'), value: 12, notes: 'Linha de base - média de uma semana' },
        {
          date: new Date('2023-09-24'),
          value: 10,
          notes: 'Após implementação de sistema de recompensas',
        },
        {
          date: new Date('2023-10-08'),
          value: 8,
          notes: 'Melhora gradual com feedback consistente',
        },
      ],
    },
    achievementSteps: [
      'Implementar sistema de recompensas visual',
      'Oferecer feedback imediato e consistente',
      'Ensinar estratégias de autorregulação',
      'Realizar check-ins regulares com o aluno',
      'Proporcionar intervalos programados',
    ],
    relevance:
      'Reduzir comportamentos disruptivos aumentará o tempo de aprendizagem do aluno e melhorará o ambiente de aprendizagem para toda a turma',
    startDate: new Date('2023-09-10'),
    targetDate: new Date('2023-12-20'),
    status: 'em andamento',
    priority: 'crítica',
    createdAt: new Date('2023-09-10'),
    updatedAt: new Date('2023-10-08'),
    interventions: ['intervention-4', 'intervention-5'],
    domain: 'Competências Socioemocionais',
    skills: ['Autorregulação', 'Comportamento em sala', 'Habilidades sociais'],
    responsibleUsers: ['Professor', 'Psicólogo Escolar', 'Pais'],
  },
  {
    id: 'goal-4',
    studentId: 'student-123',
    title: 'Melhorar produção escrita',
    description: 'Desenvolver habilidades de escrita narrativa mais complexas',
    specificDetails:
      'Aumentar o escore médio em produção textual de 2,5 para 4,0 em escala de 1-5, conforme rubrica de avaliação',
    measurement: {
      initialValue: 2.5,
      targetValue: 4.0,
      currentValue: 3.2,
      unit: 'pontos (escala 1-5)',
      progressHistory: [
        {
          date: new Date('2023-08-20'),
          value: 2.5,
          notes: 'Avaliação inicial de produção escrita',
        },
        { date: new Date('2023-09-20'), value: 2.8, notes: 'Após foco em estrutura narrativa' },
        {
          date: new Date('2023-10-20'),
          value: 3.2,
          notes: 'Melhora na coesão e uso de vocabulário',
        },
      ],
    },
    achievementSteps: [
      'Usar organizadores gráficos para planejar narrativas',
      'Praticar elaboração de parágrafos com estrutura clara',
      'Ampliar vocabulário com lista personalizada',
      'Revisar e reescrever textos com feedback específico',
      'Ler exemplos de boas narrativas',
    ],
    relevance:
      'A escrita é uma forma essencial de comunicação acadêmica e profissional; melhorar esta habilidade impactará o desempenho em todas as áreas',
    startDate: new Date('2023-08-20'),
    targetDate: new Date('2024-02-28'),
    status: 'em andamento',
    priority: 'alta',
    createdAt: new Date('2023-08-20'),
    updatedAt: new Date('2023-10-20'),
    interventions: ['intervention-6'],
    domain: 'Língua Portuguesa',
    skills: ['Produção textual', 'Coesão', 'Vocabulário', 'Estrutura narrativa'],
    responsibleUsers: ['Professor de Português', 'Coordenador pedagógico'],
  },
  {
    id: 'goal-5',
    studentId: 'student-123',
    title: 'Ampliar participação em atividades em grupo',
    description: 'Aumentar engajamento em trabalhos colaborativos',
    specificDetails:
      'Aumentar a frequência de contribuições voluntárias em atividades em grupo de 2 para 8 por aula, medidas por observação estruturada',
    measurement: {
      initialValue: 2,
      targetValue: 8,
      currentValue: 5,
      unit: 'contribuições/aula',
      progressHistory: [
        { date: new Date('2023-09-05'), value: 2, notes: 'Observação inicial - muito tímido' },
        { date: new Date('2023-09-26'), value: 3, notes: 'Começando a se sentir mais confortável' },
        { date: new Date('2023-10-17'), value: 5, notes: 'Progresso notável em grupos menores' },
      ],
    },
    achievementSteps: [
      'Começar com grupos pequenos (2-3 alunos)',
      'Atribuir funções específicas nas atividades em grupo',
      'Oferecer reforço positivo para participações',
      'Preparar o aluno com antecedência para as discussões',
      'Gradualmente aumentar o tamanho dos grupos',
    ],
    relevance:
      'Habilidades colaborativas são essenciais para o sucesso acadêmico e profissional futuro, além de melhorarem a integração social',
    startDate: new Date('2023-09-05'),
    targetDate: new Date('2023-12-15'),
    status: 'em andamento',
    priority: 'média',
    createdAt: new Date('2023-09-05'),
    updatedAt: new Date('2023-10-17'),
    interventions: ['intervention-7'],
    domain: 'Competências Socioemocionais',
    skills: ['Trabalho em equipe', 'Comunicação', 'Participação ativa'],
    responsibleUsers: ['Professor', 'Psicólogo Escolar'],
  },
];

// Dados de exemplo para intervenções
const EXAMPLE_INTERVENTIONS: Intervention[] = [
  {
    id: 'intervention-1',
    title: 'Leitura Guiada em Pares',
    description: 'Leitura conjunta com um parceiro, alternando parágrafos e oferecendo feedback.',
    tier: 'Tier 2' as InterventionTier,
    domain: 'Acadêmico',
    evidenceLevel: 'Alta Evidência',
    duration: '20-30 minutos',
    materials: ['Textos nivelados', 'Guia de feedback', 'Cronômetro'],
    steps: [
      'Seleção de texto apropriado',
      'Demonstração inicial',
      'Prática alternada',
      'Feedback específico',
    ],
    effectiveness: {
      rating: 4.5,
      studies: 12,
      description: 'Comprovadamente eficaz para melhorar fluência',
    },
    tags: ['Leitura', 'Fluência', 'Intervenção em pares'],
  },
  {
    id: 'intervention-2',
    title: 'Leitura Repetida Cronometrada',
    description: 'Releitura do mesmo texto com medição de tempo e registro de progresso.',
    tier: 'Tier 2' as InterventionTier,
    domain: 'Acadêmico',
    evidenceLevel: 'Alta Evidência',
    duration: '15-20 minutos',
    materials: ['Textos curtos nivelados', 'Cronômetro', 'Gráfico de progresso'],
    steps: [
      'Linha de base inicial',
      'Leituras repetidas',
      'Registro de tempos',
      'Análise de progresso',
    ],
    effectiveness: {
      rating: 4.3,
      studies: 15,
      description: 'Eficaz para automaticidade e fluência',
    },
    tags: ['Leitura', 'Fluência', 'Monitoramento'],
  },
  {
    id: 'intervention-3',
    title: 'Resolução Visual de Problemas com Frações',
    description: 'Uso de representações visuais para modelar problemas com frações.',
    tier: 'Tier 2' as InterventionTier,
    domain: 'Acadêmico',
    evidenceLevel: 'Média Evidência',
    duration: '30-45 minutos',
    materials: ['Círculos fracionários', 'Barras de fração', 'Problemas contextualizados'],
    steps: ['Modelagem pelo professor', 'Prática guiada', 'Prática independente', 'Verificação'],
    effectiveness: {
      rating: 3.8,
      studies: 8,
      description: 'Eficaz para compreensão conceitual',
    },
    tags: ['Matemática', 'Frações', 'Representação Visual'],
  },
  {
    id: 'intervention-4',
    title: 'Check-In/Check-Out',
    description: 'Sistema diário de monitoramento comportamental com feedback frequente.',
    tier: 'Tier 2' as InterventionTier,
    domain: 'Comportamental',
    evidenceLevel: 'Alta Evidência',
    duration: '5-10 minutos, várias vezes ao dia',
    materials: [
      'Folha de pontuação diária',
      'Definição clara de comportamentos',
      'Sistema de recompensas',
    ],
    steps: [
      'Check-in matinal',
      'Feedback ao longo do dia',
      'Check-out vespertino',
      'Comunicação com responsáveis',
    ],
    effectiveness: {
      rating: 4.2,
      studies: 22,
      description: 'Eficaz para modificação comportamental',
    },
    tags: ['Comportamento', 'Monitoramento', 'Feedback'],
  },
  {
    id: 'intervention-5',
    title: 'Automonitoramento Comportamental',
    description: 'Treinamento em observação e registro do próprio comportamento.',
    tier: 'Tier 2' as InterventionTier,
    domain: 'Comportamental',
    evidenceLevel: 'Média Evidência',
    duration: 'Contínuo durante o dia escolar',
    materials: ['Folha de registro', 'Temporizador', 'Guia visual de comportamentos'],
    steps: ['Definição de comportamentos', 'Demonstração', 'Prática guiada', 'Autoavaliação'],
    effectiveness: {
      rating: 3.5,
      studies: 10,
      description: 'Eficaz para desenvolver autorregulação',
    },
    tags: ['Comportamento', 'Autorregulação', 'Automonitoramento'],
  },
  {
    id: 'intervention-6',
    title: 'Estratégia de Escrita POW+TREE',
    description: 'Estratégia estruturada para planejamento e organização da escrita persuasiva.',
    tier: 'Tier 2' as InterventionTier,
    domain: 'Acadêmico',
    evidenceLevel: 'Alta Evidência',
    duration: '45-60 minutos',
    materials: ['Organizadores gráficos', 'Exemplos de textos', 'Listas de verificação'],
    steps: ['Ensino explícito dos passos', 'Modelagem', 'Prática guiada', 'Prática independente'],
    effectiveness: {
      rating: 4.1,
      studies: 14,
      description: 'Significativa melhora na qualidade da escrita',
    },
    tags: ['Escrita', 'Organização', 'Estrutura Textual'],
  },
  {
    id: 'intervention-7',
    title: 'Aprendizagem Cooperativa Estruturada',
    description: 'Utilização de papéis definidos e estruturas específicas para trabalho em grupo.',
    tier: 'Tier 1' as InterventionTier,
    domain: 'Social',
    evidenceLevel: 'Alta Evidência',
    duration: '30-45 minutos',
    materials: ['Cartões de função', 'Roteiros de atividade', 'Critérios de sucesso'],
    steps: ['Atribuição de papéis', 'Explicação da atividade', 'Monitoramento', 'Reflexão grupal'],
    effectiveness: {
      rating: 4.0,
      studies: 18,
      description: 'Eficaz para habilidades sociais e acadêmicas',
    },
    tags: ['Trabalho em Grupo', 'Habilidades Sociais', 'Comunicação'],
  },
];

// Enum para controle da visualização
enum ViewMode {
  LIST = 'list',
  CREATE = 'create',
  EDIT = 'edit',
  UPDATE = 'update',
  CHART = 'chart',
}

export default function MetasPage() {
  // Estados
  const [goals, setGoals] = useState<SmartGoal[]>(EXAMPLE_GOALS);
  const [currentView, setCurrentView] = useState<ViewMode>(ViewMode.LIST);
  const [selectedGoalId, setSelectedGoalId] = useState<string>('');
  const [tabIndex, setTabIndex] = useState(0);

  // Recuperar meta selecionada
  const selectedGoal = goals.find(goal => goal.id === selectedGoalId);

  // Manipulador para mudança de tab
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  // Manipulador para criar/editar meta
  const handleEdit = (goalId: string) => {
    setSelectedGoalId(goalId);
    setCurrentView(goalId ? ViewMode.EDIT : ViewMode.CREATE);
  };

  // Manipulador para excluir meta
  const handleDelete = (goalId: string) => {
    setGoals(prev => prev.filter(goal => goal.id !== goalId));
  };

  // Manipulador para atualizar progresso
  const handleUpdateProgress = (goalId: string, value: number, notes?: string) => {
    if (!notes) notes = '';

    setGoals(prev =>
      prev.map(goal => {
        if (goal.id !== goalId) return goal;

        // Criar nova entrada de progresso
        const newProgressEntry = {
          date: new Date(),
          value,
          notes,
        };

        // Atualizar meta
        return {
          ...goal,
          updatedAt: new Date(),
          measurement: {
            ...goal.measurement,
            currentValue: value,
            progressHistory: [...goal.measurement.progressHistory, newProgressEntry],
          },
          // Atualizar status se atingiu o alvo
          status: isGoalComplete(goal, value) ? 'concluída' : goal.status,
        };
      })
    );

    // Voltar para lista
    setCurrentView(ViewMode.LIST);
  };

  // Verificar se meta foi atingida
  const isGoalComplete = (goal: SmartGoal, currentValue: number): boolean => {
    const { initialValue, targetValue } = goal.measurement;

    // Se o alvo é maior que o inicial (aumentar)
    if (targetValue > initialValue) {
      return currentValue >= targetValue;
    }

    // Se o alvo é menor que o inicial (diminuir)
    if (targetValue < initialValue) {
      return currentValue <= targetValue;
    }

    // Se são iguais
    return currentValue === targetValue;
  };

  // Manipulador para cancelar operação
  const handleCancel = () => {
    setCurrentView(ViewMode.LIST);
    setSelectedGoalId('');
  };

  // Manipulador para salvar meta
  const handleSaveGoal = (formData: SmartGoalFormData) => {
    if (currentView === ViewMode.CREATE) {
      // Criar nova meta
      const newGoal: SmartGoal = {
        id: uuidv4(),
        createdAt: new Date(),
        updatedAt: new Date(),
        ...formData,
        measurement: {
          initialValue: formData.initialValue,
          targetValue: formData.targetValue,
          currentValue: formData.initialValue,
          unit: formData.unit,
          progressHistory: [
            {
              date: new Date(),
              value: formData.initialValue,
              notes: 'Valor inicial',
            },
          ],
        },
      };

      setGoals(prev => [...prev, newGoal]);
    } else {
      // Atualizar meta existente
      setGoals(prev =>
        prev.map(goal => {
          if (goal.id !== selectedGoalId) return goal;

          return {
            ...goal,
            ...formData,
            updatedAt: new Date(),
            measurement: {
              ...goal.measurement,
              initialValue: formData.initialValue,
              targetValue: formData.targetValue,
              unit: formData.unit,
            },
          };
        })
      );
    }

    // Voltar para lista
    setCurrentView(ViewMode.LIST);
    setSelectedGoalId('');
  };

  // Iniciar atualização de progresso
  const handleStartProgressUpdate = (goalId: string) => {
    setSelectedGoalId(goalId);
    setCurrentView(ViewMode.UPDATE);
  };

  // Visualizar gráfico de progresso
  const handleViewChart = (goalId: string) => {
    setSelectedGoalId(goalId);
    setCurrentView(ViewMode.CHART);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
        <Tabs value={tabIndex} onChange={handleTabChange} aria-label="Abas de navegação">
          <Tab label="Metas do Aluno" />
          <Tab label="Progresso" />
        </Tabs>
      </Box>

      {currentView === ViewMode.LIST && (
        <SmartGoalList
          goals={goals}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onUpdateProgress={handleStartProgressUpdate}
        />
      )}

      {(currentView === ViewMode.CREATE || currentView === ViewMode.EDIT) && (
        <SmartGoalForm
          initialData={
            selectedGoal
              ? {
                  studentId: selectedGoal.studentId,
                  title: selectedGoal.title,
                  description: selectedGoal.description,
                  specificDetails: selectedGoal.specificDetails,
                  initialValue: selectedGoal.measurement.initialValue,
                  targetValue: selectedGoal.measurement.targetValue,
                  unit: selectedGoal.measurement.unit,
                  achievementSteps: selectedGoal.achievementSteps,
                  relevance: selectedGoal.relevance,
                  startDate: selectedGoal.startDate,
                  targetDate: selectedGoal.targetDate,
                  status: selectedGoal.status,
                  priority: selectedGoal.priority,
                  domain: selectedGoal.domain,
                  skills: selectedGoal.skills,
                  responsibleUsers: selectedGoal.responsibleUsers,
                  interventions:
                    Array.isArray(selectedGoal.interventions) &&
                    typeof selectedGoal.interventions[0] === 'string'
                      ? (selectedGoal.interventions as string[])
                      : [],
                }
              : undefined
          }
          studentId="student-123"
          interventionsLibrary={EXAMPLE_INTERVENTIONS}
          onSave={handleSaveGoal}
          onCancel={handleCancel}
        />
      )}

      {currentView === ViewMode.UPDATE && selectedGoal && (
        <Box>
          <Button variant="outlined" onClick={handleCancel} sx={{ mb: 2 }}>
            Voltar para lista
          </Button>

          <GoalProgressUpdate
            goal={selectedGoal}
            onUpdate={handleUpdateProgress}
            onCancel={handleCancel}
          />

          {selectedGoal.measurement.progressHistory.length > 1 && (
            <Box sx={{ mt: 4 }}>
              <GoalProgressChart goal={selectedGoal} />
            </Box>
          )}
        </Box>
      )}

      {currentView === ViewMode.CHART && selectedGoal && (
        <Box>
          <Button variant="outlined" onClick={handleCancel} sx={{ mb: 2 }}>
            Voltar para lista
          </Button>

          <Typography variant="h5" gutterBottom>
            {selectedGoal.title}
          </Typography>

          <GoalProgressChart goal={selectedGoal} />
        </Box>
      )}
    </Container>
  );
}
