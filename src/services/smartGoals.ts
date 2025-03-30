import { v4 as uuidv4 } from 'uuid';
import type { SmartGoal, SmartGoalFormData } from '@/types/smart-goals';

// Mock de dados para testes
const MOCK_GOALS: SmartGoal[] = [
  {
    id: 'goal-1',
    studentId: 'student-123',
    title: 'Melhorar fluência de leitura',
    description: 'Aumentar a velocidade e precisão na leitura oral',
    specificDetails: 'Aumentar a fluência de leitura de 60 para 90 palavras por minuto com 95% de precisão em textos de nível escolar',
    measurement: {
      initialValue: 60,
      targetValue: 90,
      currentValue: 72,
      unit: 'palavras/min',
      progressHistory: [
        { date: new Date('2023-09-01'), value: 60, notes: 'Avaliação inicial' },
        { date: new Date('2023-09-15'), value: 65, notes: 'Após 2 semanas de prática diária' },
        { date: new Date('2023-10-01'), value: 72, notes: 'Melhora consistente' }
      ]
    },
    achievementSteps: [
      'Prática diária de leitura por 15 minutos',
      'Uso de cronômetro para medir velocidade',
      'Reler textos para aumentar familiaridade',
      'Participar de grupo de leitura semanal'
    ],
    relevance: 'A fluência de leitura é fundamental para a compreensão textual e para o sucesso acadêmico em todas as disciplinas',
    startDate: new Date('2023-09-01'),
    targetDate: new Date('2023-12-15'),
    status: 'em andamento',
    priority: 'alta',
    createdAt: new Date('2023-09-01'),
    updatedAt: new Date('2023-10-01'),
    interventions: ['intervention-1', 'intervention-2'],
    domain: 'Língua Portuguesa',
    skills: ['Fluência de leitura', 'Decodificação', 'Compreensão textual'],
    responsibleUsers: ['Professor de Português', 'Psicopedagogo']
  },
  {
    id: 'goal-2',
    studentId: 'student-123',
    title: 'Desenvolver habilidades de resolução de problemas matemáticos',
    description: 'Melhorar a capacidade de resolver problemas matemáticos do 5º ano',
    specificDetails: 'Aumentar a taxa de acerto em problemas matemáticos envolvendo frações de 40% para 80% em avaliações padronizadas',
    measurement: {
      initialValue: 40,
      targetValue: 80,
      currentValue: 60,
      unit: '% de acertos',
      progressHistory: [
        { date: new Date('2023-08-15'), value: 40, notes: 'Avaliação diagnóstica' },
        { date: new Date('2023-09-15'), value: 52, notes: 'Após intervenções iniciais' },
        { date: new Date('2023-10-15'), value: 60, notes: 'Progresso constante, mas precisa de mais prática' }
      ]
    },
    achievementSteps: [
      'Usar materiais concretos para visualizar frações',
      'Praticar problemas com contextos reais diariamente',
      'Criar representações visuais dos problemas',
      'Explicar o raciocínio utilizado para resolver problemas'
    ],
    relevance: 'A compreensão de frações é um fundamento crítico para matemática avançada e aplicações na vida cotidiana',
    startDate: new Date('2023-08-15'),
    targetDate: new Date('2024-01-31'),
    status: 'em andamento',
    priority: 'média',
    createdAt: new Date('2023-08-15'),
    updatedAt: new Date('2023-10-15'),
    interventions: ['intervention-3'],
    domain: 'Matemática',
    skills: ['Frações', 'Resolução de problemas', 'Raciocínio lógico'],
    responsibleUsers: ['Professor de Matemática', 'Tutor']
  }
];

// Variável para armazenar metas (emula banco de dados)
let goals = [...MOCK_GOALS];

/**
 * Busca todas as metas SMART
 */
export const getAllGoals = async (): Promise<SmartGoal[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...goals]);
    }, 500); // Simula latência de rede
  });
};

/**
 * Busca as metas SMART de um aluno específico
 */
export const getStudentGoals = async (studentId: string): Promise<SmartGoal[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const studentGoals = goals.filter(goal => goal.studentId === studentId);
      resolve([...studentGoals]);
    }, 500);
  });
};

/**
 * Busca uma meta SMART por ID
 */
export const getGoalById = async (goalId: string): Promise<SmartGoal | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const goal = goals.find(goal => goal.id === goalId);
      resolve(goal || null);
    }, 500);
  });
};

/**
 * Cria uma nova meta SMART
 */
export const createGoal = async (formData: SmartGoalFormData): Promise<SmartGoal> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const now = new Date();

      // Criar nova meta com tipagem correta
      const newGoal: SmartGoal = {
        id: uuidv4(),
        createdAt: now,
        updatedAt: now,
        title: formData.title,
        description: formData.description,
        specificDetails: formData.specificDetails,
        achievementSteps: formData.achievementSteps,
        relevance: formData.relevance,
        startDate: formData.startDate,
        targetDate: formData.targetDate,
        status: formData.status,
        priority: formData.priority,
        studentId: formData.studentId,
        domain: formData.domain,
        skills: formData.skills,
        responsibleUsers: formData.responsibleUsers,
        interventions: formData.interventions,
        measurement: {
          initialValue: formData.initialValue,
          targetValue: formData.targetValue,
          currentValue: formData.initialValue,
          unit: formData.unit,
          progressHistory: [
            {
              date: now,
              value: formData.initialValue,
              notes: 'Valor inicial'
            }
          ]
        }
      };

      // Adicionar à lista
      goals = [...goals, newGoal];

      resolve(newGoal);
    }, 500);
  });
};

/**
 * Atualiza uma meta SMART existente
 */
export const updateGoal = async (goalId: string, formData: SmartGoalFormData): Promise<SmartGoal | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = goals.findIndex(goal => goal.id === goalId);

      if (index === -1) {
        resolve(null);
        return;
      }

      // Manter histórico e valor atual
      const existingGoal = goals[index];

      if (!existingGoal) {
        resolve(null);
        return;
      }

      // Atualizar meta com tipagem correta
      const updatedGoal: SmartGoal = {
        ...existingGoal,
        title: formData.title,
        description: formData.description,
        specificDetails: formData.specificDetails,
        achievementSteps: formData.achievementSteps,
        relevance: formData.relevance,
        startDate: formData.startDate,
        targetDate: formData.targetDate,
        status: formData.status,
        priority: formData.priority,
        domain: formData.domain,
        skills: formData.skills,
        responsibleUsers: formData.responsibleUsers,
        interventions: formData.interventions,
        updatedAt: new Date(),
        measurement: {
          ...existingGoal.measurement,
          initialValue: formData.initialValue,
          targetValue: formData.targetValue,
          unit: formData.unit
        }
      };

      // Substituir na lista
      goals = [
        ...goals.slice(0, index),
        updatedGoal,
        ...goals.slice(index + 1)
      ];

      resolve(updatedGoal);
    }, 500);
  });
};

/**
 * Atualiza o progresso de uma meta SMART
 */
export const updateGoalProgress = async (
  goalId: string,
  value: number,
  notes?: string
): Promise<SmartGoal | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = goals.findIndex(goal => goal.id === goalId);

      if (index === -1) {
        resolve(null);
        return;
      }

      const existingGoal = goals[index];

      if (!existingGoal) {
        resolve(null);
        return;
      }

      const now = new Date();

      // Adicionar nova entrada ao histórico
      const newProgressEntry = {
        date: now,
        value,
        notes: notes || ''
      };

      // Verificar se atingiu a meta
      let newStatus = existingGoal.status;

      // Lógica para verificar conclusão
      const { initialValue, targetValue } = existingGoal.measurement;

      if (
        (targetValue > initialValue && value >= targetValue) ||
        (targetValue < initialValue && value <= targetValue) ||
        (targetValue === initialValue && value === targetValue)
      ) {
        newStatus = 'concluída';
      }

      // Atualizar meta com tipagem correta
      const updatedGoal: SmartGoal = {
        ...existingGoal,
        status: newStatus,
        updatedAt: now,
        measurement: {
          ...existingGoal.measurement,
          currentValue: value,
          progressHistory: [
            ...existingGoal.measurement.progressHistory,
            newProgressEntry
          ]
        }
      };

      // Substituir na lista
      goals = [
        ...goals.slice(0, index),
        updatedGoal,
        ...goals.slice(index + 1)
      ];

      resolve(updatedGoal);
    }, 500);
  });
};

/**
 * Exclui uma meta SMART
 */
export const deleteGoal = async (goalId: string): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const initialLength = goals.length;
      goals = goals.filter(goal => goal.id !== goalId);

      resolve(goals.length < initialLength);
    }, 500);
  });
};
