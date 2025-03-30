import type { Intervention } from '@/types/intervention';
import { InterventionGallery } from './InterventionGallery';

const mockInterventions: Intervention[] = [
  {
    id: '1',
    title: 'Prática de Leitura Guiada',
    description: 'Intervenção estruturada para melhorar a fluência e compreensão leitora através de leitura em pares e feedback imediato.',
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
      'Registrar progresso'
    ],
    effectiveness: {
      rating: 4.5,
      studies: 12,
      description: 'Efetiva para melhorar fluência e compreensão leitora'
    },
    imageUrl: '/images/interventions/guided-reading.jpg',
    tags: ['Leitura', 'Fluência', 'Compreensão']
  },
  {
    id: '2',
    title: 'Treinamento de Habilidades Sociais',
    description: 'Programa estruturado para desenvolver habilidades sociais básicas e avançadas em ambiente controlado.',
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
      'Aplicar em contexto natural'
    ],
    effectiveness: {
      rating: 4.0,
      studies: 8,
      description: 'Efetiva para melhorar interações sociais'
    },
    imageUrl: '/images/interventions/social-skills.jpg',
    tags: ['Habilidades Sociais', 'Comunicação', 'Interação']
  },
  {
    id: '3',
    title: 'Regulação Emocional',
    description: 'Técnicas de mindfulness e regulação emocional para gerenciar emoções e comportamentos.',
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
      'Refletir sobre experiência'
    ],
    effectiveness: {
      rating: 4.8,
      studies: 15,
      description: 'Altamente efetiva para regulação emocional'
    },
    imageUrl: '/images/interventions/emotional-regulation.jpg',
    tags: ['Mindfulness', 'Regulação Emocional', 'Autocontrole']
  }
];

export function InterventionExample() {
  const handleInterventionSelect = (intervention: Intervention) => {
    console.log('Intervenção selecionada:', intervention);
    // Aqui você pode implementar a lógica para mostrar detalhes da intervenção
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Biblioteca de Intervenções Baseadas em Evidências
      </h1>

      <InterventionGallery
        interventions={mockInterventions}
        onInterventionSelect={handleInterventionSelect}
      />
    </div>
  );
}
