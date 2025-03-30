import React from 'react'
import { screen } from '@testing-library/react'
import { TierDistributionChart } from './TierDistributionChart'
import { renderWithContainer } from '@/test-utils/renderWithContainer'

describe('TierDistributionChart', () => {
  const mockData = {
    tier1: 60,
    tier2: 25,
    tier3: 15
  }

  it('should render correctly with valid data', () => {
    renderWithContainer(<TierDistributionChart data={mockData} />)

    // Verifica se o título está presente
    expect(screen.getByText('Distribuição por Nível')).toBeInTheDocument()

    // Verifica se o gráfico está presente com o role e aria-label corretos
    const chart = screen.getByRole('img', { name: 'distribuição por nível' })
    expect(chart).toBeInTheDocument()
  })

  it('should handle empty data', () => {
    renderWithContainer(<TierDistributionChart data={{ tier1: 0, tier2: 0, tier3: 0 }} />)

    // Verifica se o gráfico está presente mesmo com dados vazios
    const chart = screen.getByRole('img', { name: 'distribuição por nível' })
    expect(chart).toBeInTheDocument()
  })

  it('should be accessible', () => {
    renderWithContainer(<TierDistributionChart data={mockData} />)

    // Verifica acessibilidade do gráfico
    const chart = screen.getByRole('img', { name: 'distribuição por nível' })
    expect(chart).toHaveAttribute('role', 'img')
    expect(chart).toHaveAttribute('aria-label', 'distribuição por nível')
  })

  it('should show loading state', () => {
    renderWithContainer(<TierDistributionChart data={mockData} isLoading={true} />)

    // Verifica se o indicador de loading está presente
    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })

  it('should show error state', () => {
    const errorMessage = 'Erro ao carregar dados'
    renderWithContainer(<TierDistributionChart data={mockData} error={errorMessage} />)

    // Verifica se a mensagem de erro está presente
    expect(screen.getByText(errorMessage)).toBeInTheDocument()
  })
})
