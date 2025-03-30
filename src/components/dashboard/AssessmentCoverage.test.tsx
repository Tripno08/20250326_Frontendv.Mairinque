import React from 'react'
import { render, screen } from '@testing-library/react'
import { AssessmentCoverage } from './AssessmentCoverage'

const mockData = {
  total: 150,
  assessed: 120,
}

describe('AssessmentCoverage', () => {
  it('should render correctly with valid data', () => {
    render(<AssessmentCoverage data={mockData} />)

    expect(screen.getByText('Cobertura de Avaliações')).toBeInTheDocument()
    expect(screen.getByText('Progresso')).toBeInTheDocument()
    expect(screen.getByText('80.0%')).toBeInTheDocument()
    expect(screen.getByText('120')).toBeInTheDocument()
    expect(screen.getByText('150')).toBeInTheDocument()
  })

  it('should handle empty data', () => {
    render(<AssessmentCoverage data={{ total: 0, assessed: 0 }} />)

    expect(screen.getByText('0.0%')).toBeInTheDocument()
    const assessedValue = screen.getByText('0', { selector: 'h4[data-testid="assessed-value"]' })
    const totalValue = screen.getByText('0', { selector: 'h4[data-testid="total-value"]' })
    expect(assessedValue).toBeInTheDocument()
    expect(totalValue).toBeInTheDocument()
  })

  it('should be accessible', () => {
    render(<AssessmentCoverage data={mockData} />)

    const progressBar = screen.getByRole('progressbar')
    expect(progressBar).toBeInTheDocument()
    expect(progressBar).toHaveAttribute('aria-valuenow', '80')
    expect(progressBar).toHaveAttribute('aria-valuemin', '0')
    expect(progressBar).toHaveAttribute('aria-valuemax', '100')
  })

  it('should handle loading state', () => {
    render(<AssessmentCoverage data={mockData} isLoading />)

    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })

  it('should handle error state', () => {
    render(<AssessmentCoverage data={mockData} error="Erro ao carregar dados" />)

    expect(screen.getByText('Erro ao carregar dados')).toBeInTheDocument()
  })

  it('should display correct labels', () => {
    render(<AssessmentCoverage data={mockData} />)

    expect(screen.getByText('Avaliados')).toBeInTheDocument()
    expect(screen.getByText('Total')).toBeInTheDocument()
  })
})
