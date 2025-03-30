import { renderHook, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  useAssessments,
  useAssessment,
  useCreateAssessment,
  useUpdateAssessment,
  useDeleteAssessment,
  usePublishAssessment,
  useCloseAssessment,
  useAssessmentResults,
  useAssessmentStats,
  useSubmitAssessment,
} from '../useAssessments';
import { assessmentService } from '@/services/assessmentService';

// Mock do serviço de avaliações
jest.mock('@/services/assessmentService', () => ({
  assessmentService: {
    listAssessments: jest.fn(),
    getAssessment: jest.fn(),
    createAssessment: jest.fn(),
    updateAssessment: jest.fn(),
    deleteAssessment: jest.fn(),
    publishAssessment: jest.fn(),
    closeAssessment: jest.fn(),
    getAssessmentResults: jest.fn(),
    getAssessmentStats: jest.fn(),
    submitAssessment: jest.fn(),
  },
}));

describe('useAssessments', () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => {
    return (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    );
  };

  const mockAssessment = {
    id: '1',
    title: 'Test Assessment',
    description: 'Test Description',
    type: 'quiz',
    status: 'draft',
    startDate: '2024-03-26',
    endDate: '2024-03-27',
    createdAt: '2024-03-26T00:00:00Z',
    updatedAt: '2024-03-26T00:00:00Z',
    createdBy: 'user1',
    questions: [],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    queryClient.clear();
  });

  describe('useAssessments', () => {
    it('deve buscar lista de avaliações', async () => {
      const mockFilters = {
        type: 'quiz',
        status: 'draft',
        page: 1,
        limit: 10,
      };

      const mockResponse = {
        data: [mockAssessment],
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      };

      (assessmentService.listAssessments as jest.Mock).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useAssessments(mockFilters), { wrapper });

      expect(result.current.isLoading).toBe(true);
      expect(assessmentService.listAssessments).toHaveBeenCalledWith(mockFilters);

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 0));
      });

      expect(result.current.isLoading).toBe(false);
      expect(result.current.data).toEqual(mockResponse);
    });
  });

  describe('useAssessment', () => {
    it('deve buscar uma avaliação específica', async () => {
      (assessmentService.getAssessment as jest.Mock).mockResolvedValue(mockAssessment);

      const { result } = renderHook(() => useAssessment('1'), { wrapper });

      expect(result.current.isLoading).toBe(true);
      expect(assessmentService.getAssessment).toHaveBeenCalledWith('1');

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 0));
      });

      expect(result.current.isLoading).toBe(false);
      expect(result.current.data).toEqual(mockAssessment);
    });
  });

  describe('useCreateAssessment', () => {
    it('deve criar uma nova avaliação', async () => {
      const newAssessment = { ...mockAssessment };
      delete newAssessment.id;

      (assessmentService.createAssessment as jest.Mock).mockResolvedValue(mockAssessment);

      const { result } = renderHook(() => useCreateAssessment(), { wrapper });

      await act(async () => {
        await result.current.mutateAsync(newAssessment);
      });

      expect(assessmentService.createAssessment).toHaveBeenCalledWith(newAssessment);
      expect(result.current.isSuccess).toBe(true);
    });
  });

  describe('useUpdateAssessment', () => {
    it('deve atualizar uma avaliação existente', async () => {
      const updateData = {
        title: 'Updated Title',
      };

      const updatedAssessment = { ...mockAssessment, ...updateData };
      (assessmentService.updateAssessment as jest.Mock).mockResolvedValue(updatedAssessment);

      const { result } = renderHook(() => useUpdateAssessment(), { wrapper });

      await act(async () => {
        await result.current.mutateAsync({ id: '1', assessment: updateData });
      });

      expect(assessmentService.updateAssessment).toHaveBeenCalledWith('1', updateData);
      expect(result.current.isSuccess).toBe(true);
    });
  });

  describe('useDeleteAssessment', () => {
    it('deve excluir uma avaliação', async () => {
      (assessmentService.deleteAssessment as jest.Mock).mockResolvedValue(undefined);

      const { result } = renderHook(() => useDeleteAssessment(), { wrapper });

      await act(async () => {
        await result.current.mutateAsync('1');
      });

      expect(assessmentService.deleteAssessment).toHaveBeenCalledWith('1');
      expect(result.current.isSuccess).toBe(true);
    });
  });

  describe('usePublishAssessment', () => {
    it('deve publicar uma avaliação', async () => {
      const publishedAssessment = { ...mockAssessment, status: 'published' };
      (assessmentService.publishAssessment as jest.Mock).mockResolvedValue(publishedAssessment);

      const { result } = renderHook(() => usePublishAssessment(), { wrapper });

      await act(async () => {
        await result.current.mutateAsync('1');
      });

      expect(assessmentService.publishAssessment).toHaveBeenCalledWith('1');
      expect(result.current.isSuccess).toBe(true);
    });
  });

  describe('useCloseAssessment', () => {
    it('deve fechar uma avaliação', async () => {
      const closedAssessment = { ...mockAssessment, status: 'closed' };
      (assessmentService.closeAssessment as jest.Mock).mockResolvedValue(closedAssessment);

      const { result } = renderHook(() => useCloseAssessment(), { wrapper });

      await act(async () => {
        await result.current.mutateAsync('1');
      });

      expect(assessmentService.closeAssessment).toHaveBeenCalledWith('1');
      expect(result.current.isSuccess).toBe(true);
    });
  });

  describe('useAssessmentResults', () => {
    it('deve buscar resultados de uma avaliação', async () => {
      const mockResults = [
        {
          id: '1',
          assessmentId: '1',
          userId: 'user1',
          score: 80,
          maxScore: 100,
          answers: [],
          submittedAt: '2024-03-26T00:00:00Z',
        },
      ];

      (assessmentService.getAssessmentResults as jest.Mock).mockResolvedValue(mockResults);

      const { result } = renderHook(() => useAssessmentResults('1'), { wrapper });

      expect(result.current.isLoading).toBe(true);
      expect(assessmentService.getAssessmentResults).toHaveBeenCalledWith('1');

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 0));
      });

      expect(result.current.isLoading).toBe(false);
      expect(result.current.data).toEqual(mockResults);
    });
  });

  describe('useAssessmentStats', () => {
    it('deve buscar estatísticas de avaliações', async () => {
      const mockStats = {
        totalAssessments: 10,
        totalStudents: 50,
        averageScore: 75,
        completionRate: 80,
        recentResults: [],
      };

      (assessmentService.getAssessmentStats as jest.Mock).mockResolvedValue(mockStats);

      const { result } = renderHook(() => useAssessmentStats(), { wrapper });

      expect(result.current.isLoading).toBe(true);
      expect(assessmentService.getAssessmentStats).toHaveBeenCalled();

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 0));
      });

      expect(result.current.isLoading).toBe(false);
      expect(result.current.data).toEqual(mockStats);
    });
  });

  describe('useSubmitAssessment', () => {
    it('deve enviar respostas de uma avaliação', async () => {
      const answers = [
        { questionId: '1', answer: 'A' },
        { questionId: '2', answer: 'B' },
      ];

      const mockResult = {
        id: '1',
        assessmentId: '1',
        userId: 'user1',
        score: 80,
        maxScore: 100,
        answers: [],
        submittedAt: '2024-03-26T00:00:00Z',
      };

      (assessmentService.submitAssessment as jest.Mock).mockResolvedValue(mockResult);

      const { result } = renderHook(() => useSubmitAssessment(), { wrapper });

      await act(async () => {
        await result.current.mutateAsync({ id: '1', answers });
      });

      expect(assessmentService.submitAssessment).toHaveBeenCalledWith('1', answers);
      expect(result.current.isSuccess).toBe(true);
    });
  });
});
