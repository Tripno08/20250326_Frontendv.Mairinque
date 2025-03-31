import React, { useState } from 'react';
import { Box, Container, Typography, Paper } from '@mui/material';
import type { Intervention } from '@/types/intervention';
import type { InterventionPlan } from '@/types/intervention-planner';
import { InterventionPlannerBoard } from './InterventionPlannerBoard';

// Exemplos de intervenções
const mockInterventions: Intervention[] = [
  {
    id: '1',
    title: 'Prática de Leitura Guiada',
    description:
      'Intervenção estruturada para melhorar a fluência e compreensão leitora através de leitura em pares e feedback imediato.',
    tier: 'Tier 2',
    domain: 'Acadêmico',
    evidenceLevel: 'Alta Evidência',
    duration: '30-45 minutos',
    materials: ['Textos nivelados', 'Fichas de registro', 'Timer'],
    steps: [
      'Selecionar texto apropriado',
      'Estabelecer objetivos de leitura',
      'Realizar leitura em pares',
      'Fornecer feedback construtivo',
      'Registrar progresso',
    ],
    effectiveness: {
      rating: 4.5,
      studies: 12,
      description: 'Efetiva para melhorar fluência e compreensão leitora',
    },
    imageUrl: '/images/interventions/guided-reading.jpg',
    tags: ['Leitura', 'Fluência', 'Compreensão'],
  },
  {
    id: '2',
    title: 'Treinamento de Habilidades Sociais',
    description:
      'Programa estruturado para desenvolver habilidades sociais básicas e avançadas em ambiente controlado.',
    tier: 'Tier 2',
    domain: 'Social',
    evidenceLevel: 'Média Evidência',
    duration: '45-60 minutos',
    materials: ['Cartões de cenários', 'Roteiros de role-play', 'Fichas de avaliação'],
    steps: [
      'Apresentar cenário social',
      'Demonstrar comportamento adequado',
      'Praticar em pares',
      'Fornecer feedback',
      'Aplicar em contexto natural',
    ],
    effectiveness: {
      rating: 4.0,
      studies: 8,
      description: 'Efetiva para melhorar interações sociais',
    },
    imageUrl: '/images/interventions/social-skills.jpg',
    tags: ['Habilidades Sociais', 'Comunicação', 'Interação'],
  },
  {
    id: '3',
    title: 'Regulação Emocional',
    description:
      'Técnicas de mindfulness e regulação emocional para gerenciar emoções e comportamentos.',
    tier: 'Tier 1',
    domain: 'Emocional',
    evidenceLevel: 'Alta Evidência',
    duration: '15-20 minutos',
    materials: ['Cartões de respiração', 'Timer', 'Fichas de registro emocional'],
    steps: [
      'Identificar emoção',
      'Praticar respiração consciente',
      'Usar técnicas de grounding',
      'Aplicar estratégias de regulação',
      'Refletir sobre experiência',
    ],
    effectiveness: {
      rating: 4.8,
      studies: 15,
      description: 'Altamente efetiva para regulação emocional',
    },
    imageUrl: '/images/interventions/emotional-regulation.jpg',
    tags: ['Mindfulness', 'Regulação Emocional', 'Autocontrole'],
  },
  {
    id: '4',
    title: 'Intervenção em Matemática Básica',
    description:
      'Sequência estruturada de atividades para reforçar conceitos matemáticos básicos e operações.',
    tier: 'Tier 2',
    domain: 'Acadêmico',
    evidenceLevel: 'Alta Evidência',
    duration: '30 minutos',
    materials: ['Fichas de trabalho', 'Materiais manipuláveis', 'Jogos matemáticos'],
    steps: [
      'Avaliação diagnóstica',
      'Modelagem de conceitos',
      'Prática guiada',
      'Prática independente',
      'Avaliação formativa',
    ],
    effectiveness: {
      rating: 4.2,
      studies: 10,
      description: 'Efetiva para alunos com dificuldades em matemática',
    },
    imageUrl: '/images/interventions/math-intervention.jpg',
    tags: ['Matemática', 'Operações Básicas', 'Numeracia'],
  },
  {
    id: '5',
    title: 'Modelagem Comportamental',
    description:
      'Técnicas de modelagem e reforço positivo para desenvolver comportamentos adaptativos.',
    tier: 'Tier 3',
    domain: 'Comportamental',
    evidenceLevel: 'Média Evidência',
    duration: '20-25 minutos',
    materials: ['Tabela de reforço', 'Cartões de comportamento', 'Sistema de tokens'],
    steps: [
      'Definir comportamento-alvo',
      'Demonstrar comportamento',
      'Praticar com feedback',
      'Implementar reforço',
      'Monitorar progresso',
    ],
    effectiveness: {
      rating: 3.8,
      studies: 7,
      description: 'Moderadamente efetiva para modificação comportamental',
    },
    imageUrl: '/images/interventions/behavior-modeling.jpg',
    tags: ['Comportamento', 'Reforço Positivo', 'Modelagem'],
  },
];

// Plano inicial vazio
const initialPlan: InterventionPlan = {
  title: 'Plano de Intervenção - Maria Silva',
  description:
    'Plano estruturado para apoiar desenvolvimento de habilidades acadêmicas e socioemocionais',
  studentId: 'student-123',
  items: [],
  status: 'draft',
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const InterventionPlannerExample: React.FC = () => {
  const [plan, setPlan] = useState<InterventionPlan>(initialPlan);

  const handlePlanUpdate = (updatedPlan: InterventionPlan) => {
    setPlan(updatedPlan);
  };

  const handleSavePlan = () => {
    console.log('Plano salvo:', plan);
    // Aqui você poderia chamar uma API para salvar o plano
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Planejamento de Intervenções RTI/MTSS
      </Typography>

      <Paper
        elevation={0}
        sx={{ p: 3, mb: 4, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}
      >
        <Typography variant="body1" paragraph>
          Planeje intervenções personalizadas arrastando atividades da biblioteca para o plano.
          Reorganize as atividades conforme necessário e salve o plano quando estiver concluído.
        </Typography>
      </Paper>

      <Box sx={{ mt: 4 }}>
        <InterventionPlannerBoard
          plan={plan}
          interventionsLibrary={mockInterventions}
          onPlanUpdate={handlePlanUpdate}
          onSave={handleSavePlan}
        />
      </Box>
    </Container>
  );
};
