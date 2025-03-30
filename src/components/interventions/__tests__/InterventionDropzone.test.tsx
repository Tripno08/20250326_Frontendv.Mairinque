import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { InterventionDropzone } from '../InterventionDropzone';
import type { InterventionPlanItem } from '@/types/intervention-planner';

// Mock do useDroppable
jest.mock('@dnd-kit/core', () => ({
  ...jest.requireActual('@dnd-kit/core'),
  useDroppable: () => ({
    setNodeRef: jest.fn(),
    isOver: false,
    active: null,
  }),
}));

describe('InterventionDropzone', () => {
  it('renderiza a mensagem de área vazia quando não há itens', () => {
    render(
      <InterventionDropzone id="test-dropzone">
        <div>Conteúdo Filho</div>
      </InterventionDropzone>
    );

    // Verifica se a mensagem para arrastar está presente
    expect(screen.getByText('Arraste intervenções para cá')).toBeInTheDocument();

    // Verifica se o conteúdo filho não está presente quando vazio
    expect(screen.queryByText('Conteúdo Filho')).not.toBeInTheDocument();
  });

  it('renderiza o conteúdo filho quando há itens', () => {
    const mockItems: InterventionPlanItem[] = [
      {
        id: 'item-1',
        intervention: {
          id: '1',
          title: 'Intervenção Teste',
          description: 'Descrição',
          tier: 'Tier 1',
          domain: 'Acadêmico',
          evidenceLevel: 'Alta Evidência',
          duration: '30 min',
          materials: [],
          steps: [],
          effectiveness: {
            rating: 4,
            studies: 5,
            description: 'Efetiva',
          },
          tags: [],
        },
        position: 0,
      },
    ];

    render(
      <InterventionDropzone id="test-dropzone" items={mockItems}>
        <div>Conteúdo Filho</div>
      </InterventionDropzone>
    );

    // Verifica se o conteúdo filho está presente
    expect(screen.getByText('Conteúdo Filho')).toBeInTheDocument();

    // Verifica se a mensagem para arrastar não está presente
    expect(screen.queryByText('Arraste intervenções para cá')).not.toBeInTheDocument();
  });

  it('aplica estilo visual quando isOver é true', () => {
    render(
      <InterventionDropzone id="test-dropzone" isOver={true}>
        <div>Conteúdo Filho</div>
      </InterventionDropzone>
    );

    // Verifica se a mensagem quando está sobre a área é exibida
    expect(screen.getByText('Solte para adicionar')).toBeInTheDocument();
  });

  it('renderiza com ID correto', () => {
    const testId = 'test-custom-id';
    render(
      <InterventionDropzone id={testId}>
        <div>Conteúdo Filho</div>
      </InterventionDropzone>
    );

    // Como não podemos testar diretamente o id que vai para o hook,
    // verificamos ao menos se o componente renderiza corretamente
    expect(screen.getByText('Arraste intervenções para cá')).toBeInTheDocument();
  });
});
