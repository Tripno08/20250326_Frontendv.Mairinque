import { Node, Edge } from 'reactflow';
import { v4 as uuidv4 } from 'uuid';

export interface FlowTemplate {
  id: string;
  name: string;
  description: string;
  nodes: Node[];
  edges: Edge[];
}

// Template para ciclo de rastreio universal
export const universalScreeningTemplate: FlowTemplate = {
  id: 'universal-screening',
  name: 'Ciclo de Rastreio Universal',
  description: 'Template para ciclo de rastreio universal com três momentos de avaliação',
  nodes: [
    {
      id: uuidv4(),
      type: 'screening',
      position: { x: 100, y: 100 },
      data: {
        label: 'Rastreio Inicial',
        instrument: 'Avaliação Diagnóstica',
        frequency: 'Trimestral',
        threshold: 70,
        domains: ['Leitura', 'Escrita', 'Matemática'],
      },
    },
    {
      id: uuidv4(),
      type: 'decision',
      position: { x: 100, y: 250 },
      data: {
        label: 'Análise de Resultados',
        criteria: ['Pontuação < 70%'],
        outcomes: ['Intervenção Necessária', 'Sem Necessidade'],
        threshold: 70,
      },
    },
    {
      id: uuidv4(),
      type: 'intervention',
      position: { x: 300, y: 400 },
      data: {
        label: 'Intervenção Tier 2',
        name: 'Suporte Adicional',
        description: 'Intervenção em pequenos grupos',
        duration: 60,
        frequency: '2x por semana',
        resources: ['Material adaptado', 'Jogos pedagógicos'],
        evidence: ['Pesquisas validadas', 'Resultados anteriores'],
      },
    },
  ],
  edges: [
    {
      id: 'e1',
      source: '1',
      target: '2',
      type: 'sequential',
    },
    {
      id: 'e2',
      source: '2',
      target: '3',
      type: 'conditional',
      data: { condition: 'Pontuação < 70%' },
    },
  ],
};

// Template para protocolo de intervenção
export const interventionProtocolTemplate: FlowTemplate = {
  id: 'intervention-protocol',
  name: 'Protocolo de Intervenção',
  description: 'Template para protocolo de intervenção com monitoramento',
  nodes: [
    {
      id: uuidv4(),
      type: 'assessment',
      position: { x: 100, y: 100 },
      data: {
        label: 'Avaliação Inicial',
        type: 'Diagnóstica',
        criteria: ['Habilidades básicas', 'Conhecimentos prévios'],
        duration: 45,
        responsible: ['Professor', 'Especialista'],
      },
    },
    {
      id: uuidv4(),
      type: 'intervention',
      position: { x: 100, y: 250 },
      data: {
        label: 'Intervenção Intensiva',
        name: 'Programa Estruturado',
        description: 'Intervenção individualizada',
        duration: 45,
        frequency: '3x por semana',
        resources: ['Material específico', 'Software educacional'],
        evidence: ['Estudos científicos', 'Dados de progresso'],
      },
    },
    {
      id: uuidv4(),
      type: 'assessment',
      position: { x: 100, y: 400 },
      data: {
        label: 'Monitoramento',
        type: 'Progresso',
        criteria: ['Fluência', 'Compreensão'],
        duration: 30,
        responsible: ['Professor'],
      },
    },
  ],
  edges: [
    {
      id: 'e1',
      source: '1',
      target: '2',
      type: 'sequential',
    },
    {
      id: 'e2',
      source: '2',
      target: '3',
      type: 'sequential',
    },
  ],
};

// Template para árvore de decisão
export const decisionTreeTemplate: FlowTemplate = {
  id: 'decision-tree',
  name: 'Árvore de Decisão',
  description: 'Template para tomada de decisão baseada em dados',
  nodes: [
    {
      id: uuidv4(),
      type: 'screening',
      position: { x: 100, y: 100 },
      data: {
        label: 'Coleta de Dados',
        instrument: 'Múltiplos Instrumentos',
        frequency: 'Mensal',
        threshold: 80,
        domains: ['Acadêmico', 'Comportamental'],
      },
    },
    {
      id: uuidv4(),
      type: 'decision',
      position: { x: 100, y: 250 },
      data: {
        label: 'Análise de Resposta',
        criteria: ['Progresso adequado', 'Resposta à intervenção'],
        outcomes: ['Continuar', 'Intensificar', 'Ajustar'],
        threshold: 80,
      },
    },
    {
      id: uuidv4(),
      type: 'condition',
      position: { x: 300, y: 400 },
      data: {
        label: 'Verificação de Progresso',
        condition: 'Progresso > Meta',
        description: 'Avaliação do progresso em relação à meta estabelecida',
      },
    },
  ],
  edges: [
    {
      id: 'e1',
      source: '1',
      target: '2',
      type: 'sequential',
    },
    {
      id: 'e2',
      source: '2',
      target: '3',
      type: 'conditional',
      data: { condition: 'Necessita ajuste' },
    },
  ],
};

export const flowTemplates: FlowTemplate[] = [
  universalScreeningTemplate,
  interventionProtocolTemplate,
  decisionTreeTemplate,
];
