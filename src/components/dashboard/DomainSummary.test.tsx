import React from 'react'
import { screen, within } from '@testing-library/react'
import { DomainSummary } from './DomainSummary'
import { renderWithContainer } from '@/test-utils/renderWithContainer'

describe('DomainSummary', () => {
  const mockData = {
    reading: 75,
    math: 65,
    writing: 70
  }

  it('should render correctly with valid data', () => {
    renderWithContainer(<DomainSummary data={mockData} />)

    // Verifica se o título está presente
    expect(screen.getByText('Desempenho por Domínio')).toBeInTheDocument()

    // Verifica se o gráfico está presente com o role e aria-label corretos
    const chart = screen.getByRole('img', { name: 'desempenho por domínio' })
    expect(chart).toBeInTheDocument()

    // Verifica se a seção de detalhes está presente
    const detailsSection = screen.getByText('Detalhes').closest('div')
    if (detailsSection) {
      expect(within(detailsSection).getByText('Leitura')).toBeInTheDocument()
      expect(within(detailsSection).getByText('Matemática')).toBeInTheDocument()
      expect(within(detailsSection).getByText('Escrita')).toBeInTheDocument()
    } else {
      throw new Error('Seção de detalhes não encontrada')
    }
  })

  it('should handle empty data', () => {
    renderWithContainer(<DomainSummary data={{ reading: 0, math: 0, writing: 0 }} />)

    // Verifica se o gráfico está presente mesmo com dados vazios
    const chart = screen.getByRole('img', { name: 'desempenho por domínio' })
    expect(chart).toBeInTheDocument()
  })

  it('should be accessible', () => {
    renderWithContainer(<DomainSummary data={mockData} />)

    // Verifica acessibilidade do gráfico
    const chart = screen.getByRole('img', { name: 'desempenho por domínio' })
    expect(chart).toHaveAttribute('role', 'img')
    expect(chart).toHaveAttribute('aria-label', 'desempenho por domínio')
  })

  it('should show loading state', () => {
    renderWithContainer(<DomainSummary data={mockData} isLoading={true} />)

    // Verifica se o indicador de loading está presente
    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })

  it('should show error state', () => {
    const errorMessage = 'Erro ao carregar dados'
    renderWithContainer(<DomainSummary data={mockData} error={errorMessage} />)

    // Verifica se a mensagem de erro está presente
    expect(screen.getByText(errorMessage)).toBeInTheDocument()
  })
})
