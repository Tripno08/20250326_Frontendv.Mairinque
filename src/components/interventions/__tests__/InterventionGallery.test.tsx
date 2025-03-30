import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { InterventionGallery } from '../InterventionGallery'
import type { Intervention } from '@/types/intervention'

const mockInterventions: Intervention[] = [
  {
    id: '1',
    title: 'Prática de Leitura Guiada',
    description: 'Intervenção para melhorar fluência leitora.',
    tier: 'Tier 2',
    domain: 'Acadêmico',
    evidenceLevel: 'Alta Evidência',
    duration: '30-45 minutos',
    materials: ['Textos nivelados'],
    steps: ['Selecionar texto'],
    effectiveness: {
      rating: 4.5,
      studies: 12,
      description: 'Efetiva'
    },
    tags: ['Leitura']
  },
  {
    id: '2',
    title: 'Treinamento Social',
    description: 'Programa para habilidades sociais.',
    tier: 'Tier 1',
    domain: 'Social',
    evidenceLevel: 'Média Evidência',
    duration: '45-60 minutos',
    materials: ['Cartões'],
    steps: ['Apresentar cenário'],
    effectiveness: {
      rating: 4.0,
      studies: 8,
      description: 'Efetiva'
    },
    tags: ['Social']
  }
]

describe('InterventionGallery', () => {
  const mockOnSelect = jest.fn()

  beforeEach(() => {
    mockOnSelect.mockClear()
  })

  it('renderiza a lista de intervenções', () => {
    render(
      <InterventionGallery
        interventions={mockInterventions}
        onInterventionSelect={mockOnSelect}
      />
    )

    expect(screen.getByRole('heading', { name: 'Prática de Leitura Guiada' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Treinamento Social' })).toBeInTheDocument()
  })

  it('filtra por nível (tier)', async () => {
    render(
      <InterventionGallery
        interventions={mockInterventions}
        onInterventionSelect={mockOnSelect}
      />
    )

    const tierSelect = screen.getByTestId('tier-select')
    fireEvent.change(tierSelect, { target: { value: 'Tier 1' } })

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Treinamento Social' })).toBeInTheDocument()
    })

    await waitFor(() => {
      expect(screen.queryByRole('heading', { name: 'Prática de Leitura Guiada' })).not.toBeInTheDocument()
    })
  })

  it('filtra por domínio', async () => {
    render(
      <InterventionGallery
        interventions={mockInterventions}
        onInterventionSelect={mockOnSelect}
      />
    )

    const domainSelect = screen.getByTestId('domain-select')
    fireEvent.change(domainSelect, { target: { value: 'Acadêmico' } })

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Prática de Leitura Guiada' })).toBeInTheDocument()
    })

    await waitFor(() => {
      expect(screen.queryByRole('heading', { name: 'Treinamento Social' })).not.toBeInTheDocument()
    })
  })

  it('filtra por nível de evidência', async () => {
    render(
      <InterventionGallery
        interventions={mockInterventions}
        onInterventionSelect={mockOnSelect}
      />
    )

    const evidenceSelect = screen.getByTestId('evidence-select')
    fireEvent.change(evidenceSelect, { target: { value: 'Alta Evidência' } })

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Prática de Leitura Guiada' })).toBeInTheDocument()
    })

    await waitFor(() => {
      expect(screen.queryByRole('heading', { name: 'Treinamento Social' })).not.toBeInTheDocument()
    })
  })

  it('filtra por busca de texto', async () => {
    render(
      <InterventionGallery
        interventions={mockInterventions}
        onInterventionSelect={mockOnSelect}
      />
    )

    const searchInput = screen.getByPlaceholderText(/buscar intervenções/i)
    fireEvent.change(searchInput, { target: { value: 'Leitura' } })

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Prática de Leitura Guiada' })).toBeInTheDocument()
    })

    await waitFor(() => {
      expect(screen.queryByRole('heading', { name: 'Treinamento Social' })).not.toBeInTheDocument()
    })
  })

  it('chama onInterventionSelect quando uma intervenção é selecionada', () => {
    render(
      <InterventionGallery
        interventions={mockInterventions}
        onInterventionSelect={mockOnSelect}
      />
    )

    fireEvent.click(screen.getByRole('heading', { name: 'Prática de Leitura Guiada' }))
    expect(mockOnSelect).toHaveBeenCalledTimes(1)
    expect(mockOnSelect).toHaveBeenCalledWith(mockInterventions[0])
  })

  it('exibe mensagem quando não há resultados', () => {
    render(
      <InterventionGallery
        interventions={[]}
        onInterventionSelect={mockOnSelect}
      />
    )

    expect(screen.getByText(/nenhuma intervenção encontrada/i)).toBeInTheDocument()
  })
})
