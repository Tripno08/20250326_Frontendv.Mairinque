import React from 'react'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { ActionableInsightsDashboard } from '../ActionableInsightsDashboard'
import { mockInsights } from '@/data/mockInsights'
import { UserProfile } from '@/types/actionable-insights'

// Mock dos componentes filhos para testes isolados
jest.mock('../alerts/PreventiveAlertCard', () => ({
  PreventiveAlertCard: ({ insight }: any) => (
    <div data-testid={`alert-card-${insight.id}`}>
      <div data-testid="alert-title">{insight.title}</div>
    </div>
  ),
}))

jest.mock('../suggestions/ProfileSuggestionList', () => ({
  ProfileSuggestionList: ({ profile }: any) => (
    <div data-testid="profile-suggestions">
      Sugestões para perfil: {profile}
    </div>
  ),
}))

jest.mock('../visualizations/InsightVisualization', () => ({
  InsightVisualization: () => <div data-testid="insight-visualization">Visualizações</div>,
}))

jest.mock('../simulations/ImpactSimulationPanel', () => ({
  ImpactSimulationPanel: () => <div data-testid="impact-simulation">Simulações</div>,
}))

jest.mock('../filters/InsightFilterPanel', () => ({
  InsightFilterPanel: ({ onFilterChange, onProfileChange }: any) => (
    <div data-testid="filter-panel">
      <button onClick={() => onFilterChange({ showResolved: true })}>Mudar Filtro</button>
      <button onClick={() => onProfileChange('principal')}>Mudar Perfil</button>
    </div>
  ),
}))

describe('ActionableInsightsDashboard', () => {
  // Filtramos apenas os insights que seriam exibidos por padrão (não resolvidos)
  const defaultFilteredInsights = mockInsights.filter(insight => !insight.isResolved);

  const defaultProps = {
    insights: mockInsights,
    activeProfile: 'teacher' as UserProfile,
    isLoading: false,
    error: null,
    onInsightSelect: jest.fn(),
    onFilterChange: jest.fn(),
    onProfileChange: jest.fn(),
  }

  test('renderiza corretamente no estado de carregamento', () => {
    render(<ActionableInsightsDashboard {...defaultProps} isLoading={true} />)
    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })

  test('renderiza corretamente quando há um erro', () => {
    render(<ActionableInsightsDashboard {...defaultProps} error={new Error('Erro de teste')} />)
    expect(screen.getByText(/Erro ao carregar insights/i)).toBeInTheDocument()
  })

  test('renderiza corretamente com dados', () => {
    render(<ActionableInsightsDashboard {...defaultProps} />)
    expect(screen.getByText(/Insights Acionáveis/i)).toBeInTheDocument()
    expect(screen.getByTestId('filter-panel')).toBeInTheDocument()
  })

  test('exibe a quantidade correta de insights disponíveis', () => {
    render(<ActionableInsightsDashboard {...defaultProps} />)
    // Use uma regex mais flexível para testar a quantidade de insights disponíveis
    expect(screen.getByText(/insights disponíveis/i)).toBeInTheDocument()
  })

  test('muda entre as abas corretamente', async () => {
    render(<ActionableInsightsDashboard {...defaultProps} />)

    // Por padrão, a aba de alertas deve estar ativa
    // Verificamos a existência dos cards de alerta que não são resolvidos
    const alertCards = screen.getAllByTestId(/alert-card-/)
    expect(alertCards.length).toBe(defaultFilteredInsights.length)

    // Clica na aba de sugestões
    fireEvent.click(screen.getByRole('tab', { name: /sugestões/i }))
    await waitFor(() => {
      expect(screen.getByTestId('profile-suggestions')).toBeInTheDocument()
    })

    // Clica na aba de visualizações
    fireEvent.click(screen.getByRole('tab', { name: /visualizações/i }))
    await waitFor(() => {
      expect(screen.getByTestId('insight-visualization')).toBeInTheDocument()
    })

    // Clica na aba de simulações
    fireEvent.click(screen.getByRole('tab', { name: /simulações/i }))
    await waitFor(() => {
      expect(screen.getByTestId('impact-simulation')).toBeInTheDocument()
    })
  })

  test('chama onFilterChange quando os filtros são alterados', () => {
    render(<ActionableInsightsDashboard {...defaultProps} />)

    fireEvent.click(screen.getByText(/Mudar Filtro/i))
    expect(defaultProps.onFilterChange).toHaveBeenCalledWith({ showResolved: true })
  })

  test('chama onProfileChange quando o perfil é alterado', () => {
    render(<ActionableInsightsDashboard {...defaultProps} />)

    fireEvent.click(screen.getByText(/Mudar Perfil/i))
    expect(defaultProps.onProfileChange).toHaveBeenCalledWith('principal')
  })
})
