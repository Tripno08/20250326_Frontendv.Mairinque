import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { InterventionExample } from '../InterventionExample'

// Mock do console.log para verificar se a função é chamada
const consoleSpy = jest.spyOn(console, 'log')

describe('InterventionExample', () => {
  beforeEach(() => {
    consoleSpy.mockClear()
  })

  it('renderiza o título da página', () => {
    render(<InterventionExample />)
    expect(screen.getByText(/biblioteca de intervenções/i)).toBeInTheDocument()
  })

  it('renderiza a galeria de intervenções', () => {
    render(<InterventionExample />)

    // Verifica se os títulos das intervenções de exemplo estão presentes
    // Usando queryByRole com name para ser mais específico
    expect(screen.getByRole('heading', { name: 'Prática de Leitura Guiada' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Treinamento de Habilidades Sociais' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Regulação Emocional' })).toBeInTheDocument()
  })

  it('renderiza os filtros da galeria', () => {
    render(<InterventionExample />)

    // Verifica se os elementos de filtro estão presentes usando seus IDs
    expect(screen.getByTestId('tier-select')).toBeInTheDocument()
    expect(screen.getByTestId('domain-select')).toBeInTheDocument()
    expect(screen.getByTestId('evidence-select')).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/buscar intervenções/i)).toBeInTheDocument()
  })

  it('chama console.log quando uma intervenção é selecionada', () => {
    render(<InterventionExample />)

    // Clica na primeira intervenção
    fireEvent.click(screen.getByRole('heading', { name: 'Prática de Leitura Guiada' }))

    // Verifica se console.log foi chamado
    expect(consoleSpy).toHaveBeenCalledTimes(1)
    // Verifica se foi chamado com os parâmetros esperados sem usar funções específicas
    expect(consoleSpy.mock.calls[0][0]).toContain('Intervenção selecionada:')
    expect(typeof consoleSpy.mock.calls[0][1]).toBe('object')
  })

  it('filtra as intervenções corretamente', async () => {
    render(<InterventionExample />)

    // Filtra por nível usando testId
    const tierSelect = screen.getByTestId('tier-select')
    fireEvent.change(tierSelect, { target: { value: 'Tier 1' } })

    // Verifica se apenas as intervenções do Tier 1 estão visíveis
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Regulação Emocional' })).toBeInTheDocument()
    })

    await waitFor(() => {
      expect(screen.queryByRole('heading', { name: 'Prática de Leitura Guiada' })).not.toBeInTheDocument()
      expect(screen.queryByRole('heading', { name: 'Treinamento de Habilidades Sociais' })).not.toBeInTheDocument()
    })
  })

  it('filtra por busca de texto', async () => {
    render(<InterventionExample />)

    // Busca por "Leitura"
    const searchInput = screen.getByPlaceholderText(/buscar intervenções/i)
    fireEvent.change(searchInput, { target: { value: 'Leitura' } })

    // Verifica se apenas as intervenções relacionadas à leitura estão visíveis
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Prática de Leitura Guiada' })).toBeInTheDocument()
    })

    await waitFor(() => {
      expect(screen.queryByRole('heading', { name: 'Treinamento de Habilidades Sociais' })).not.toBeInTheDocument()
      expect(screen.queryByRole('heading', { name: 'Regulação Emocional' })).not.toBeInTheDocument()
    })
  })
})
