import { renderHook, act, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useDashboard } from './useDashboard'
import { http } from '@/lib/http'

jest.mock('@/lib/http')

const mockData = {
  tierDistribution: {
    tier1: 60,
    tier2: 25,
    tier3: 15,
  },
  domainSummary: {
    reading: 75,
    math: 65,
    writing: 70,
  },
  assessmentCoverage: {
    total: 150,
    assessed: 120,
  },
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
})

const wrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('useDashboard', () => {
  beforeEach(() => {
    queryClient.clear()
    jest.clearAllMocks()
  })

  it('should fetch dashboard data successfully', async () => {
    (http.get as jest.Mock).mockResolvedValueOnce({ data: mockData })

    const { result } = renderHook(
      () => useDashboard(),
      { wrapper }
    )

    // Verifica estado inicial
    expect(result.current.isLoading).toBe(true)
    expect(result.current.error).toBeNull()

    // Espera a conclusão da query
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    // Verifica dados carregados
    expect(result.current.error).toBeNull()
    expect(result.current.data).toEqual(mockData)
  })

  it('should handle error state', async () => {
    (http.get as jest.Mock).mockRejectedValueOnce(new Error('API Error'))

    const { result } = renderHook(
      () => useDashboard(),
      { wrapper }
    )

    // Espera a conclusão da query com erro
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
      expect(result.current.error).toBeDefined()
    })
  })

  it('should handle empty data', async () => {
    (http.get as jest.Mock).mockResolvedValueOnce({ data: null })

    const { result } = renderHook(
      () => useDashboard(),
      { wrapper }
    )

    // Espera a conclusão da query
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.data).toBeNull()
  })
})
