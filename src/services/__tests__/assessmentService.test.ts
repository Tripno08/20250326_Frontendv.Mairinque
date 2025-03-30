import { assessmentService } from '../assessmentService';
import { createApiClient, get, post, put, del } from '@/utils/apiUtils';
import type { Assessment, AssessmentFilters, AssessmentResult, AssessmentStats } from '@/types/api';
import '@testing-library/jest-dom';

// Mock dos utilitários da API
jest.mock('@/utils/apiUtils', () => ({
  createApiClient: jest.fn(),
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  del: jest.fn(),
}));

describe('AssessmentService', () => {
  const mockApiClient = {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  };

  const mockAssessment: Assessment = {
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
    (createApiClient as jest.Mock).mockReturnValue(mockApiClient);
  });

  describe('listAssessments', () => {
    const mockFilters: AssessmentFilters = {
      type: 'quiz',
      status: 'draft',
      page: 1,
      limit: 10,
    };

    it('deve listar avaliações com filtros', async () => {
      const mockResponse = {
        data: {
          data: [mockAssessment],
          total: 1,
          page: 1,
          limit: 10,
          totalPages: 1,
        },
        status: 200,
      };

      (get as jest.Mock).mockResolvedValue(mockResponse);

      const result = await assessmentService.listAssessments(mockFilters);

      expect(get).toHaveBeenCalledWith(
        mockApiClient,
        '/assessments?type=quiz&status=draft&page=1&limit=10'
      );
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('getAssessment', () => {
    it('deve obter uma avaliação específica', async () => {
      const mockResponse = {
        data: mockAssessment,
        status: 200,
      };

      (get as jest.Mock).mockResolvedValue(mockResponse);

      const result = await assessmentService.getAssessment('1');

      expect(get).toHaveBeenCalledWith(mockApiClient, '/assessments/1');
      expect(result).toEqual(mockAssessment);
    });
  });

  describe('createAssessment', () => {
    it('deve criar uma nova avaliação', async () => {
      const newAssessment = { ...mockAssessment } as Omit<Assessment, 'id'>;
      // @ts-ignore
      delete newAssessment.id;

      const mockResponse = {
        data: mockAssessment,
        status: 201,
      };

      (post as jest.Mock).mockResolvedValue(mockResponse);

      const result = await assessmentService.createAssessment(newAssessment);

      expect(post).toHaveBeenCalledWith(mockApiClient, '/assessments', newAssessment);
      expect(result).toEqual(mockAssessment);
    });
  });

  describe('updateAssessment', () => {
    it('deve atualizar uma avaliação existente', async () => {
      const updateData = {
        title: 'Updated Title',
      };

      const mockResponse = {
        data: { ...mockAssessment, ...updateData },
        status: 200,
      };

      (put as jest.Mock).mockResolvedValue(mockResponse);

      const result = await assessmentService.updateAssessment('1', updateData);

      expect(put).toHaveBeenCalledWith(mockApiClient, '/assessments/1', updateData);
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('deleteAssessment', () => {
    it('deve excluir uma avaliação', async () => {
      const mockResponse = {
        status: 204,
      };

      (del as jest.Mock).mockResolvedValue(mockResponse);

      await assessmentService.deleteAssessment('1');

      expect(del).toHaveBeenCalledWith(mockApiClient, '/assessments/1');
    });
  });

  describe('publishAssessment', () => {
    it('deve publicar uma avaliação', async () => {
      const mockResponse = {
        data: { ...mockAssessment, status: 'published' },
        status: 200,
      };

      (post as jest.Mock).mockResolvedValue(mockResponse);

      const result = await assessmentService.publishAssessment('1');

      expect(post).toHaveBeenCalledWith(mockApiClient, '/assessments/1/publish');
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('closeAssessment', () => {
    it('deve fechar uma avaliação', async () => {
      const mockResponse = {
        data: { ...mockAssessment, status: 'closed' },
        status: 200,
      };

      (post as jest.Mock).mockResolvedValue(mockResponse);

      const result = await assessmentService.closeAssessment('1');

      expect(post).toHaveBeenCalledWith(mockApiClient, '/assessments/1/close');
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('getAssessmentResults', () => {
    it('deve obter resultados de uma avaliação', async () => {
      const mockResults: AssessmentResult[] = [
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

      const mockResponse = {
        data: mockResults,
        status: 200,
      };

      (get as jest.Mock).mockResolvedValue(mockResponse);

      const result = await assessmentService.getAssessmentResults('1');

      expect(get).toHaveBeenCalledWith(mockApiClient, '/assessments/1/results');
      expect(result).toEqual(mockResults);
    });
  });

  describe('getAssessmentStats', () => {
    it('deve obter estatísticas de avaliações', async () => {
      const mockStats: AssessmentStats = {
        totalAssessments: 10,
        totalStudents: 50,
        averageScore: 75,
        completionRate: 80,
        recentResults: [],
      };

      const mockResponse = {
        data: mockStats,
        status: 200,
      };

      (get as jest.Mock).mockResolvedValue(mockResponse);

      const result = await assessmentService.getAssessmentStats();

      expect(get).toHaveBeenCalledWith(mockApiClient, '/assessments/stats');
      expect(result).toEqual(mockStats);
    });
  });

  describe('submitAssessment', () => {
    it('deve enviar respostas de uma avaliação', async () => {
      const answers = [
        { questionId: '1', answer: 'A' },
        { questionId: '2', answer: 'B' },
      ];

      const mockResult: AssessmentResult = {
        id: '1',
        assessmentId: '1',
        userId: 'user1',
        score: 80,
        maxScore: 100,
        answers: [],
        submittedAt: '2024-03-26T00:00:00Z',
      };

      const mockResponse = {
        data: mockResult,
        status: 200,
      };

      (post as jest.Mock).mockResolvedValue(mockResponse);

      const result = await assessmentService.submitAssessment('1', answers);

      expect(post).toHaveBeenCalledWith(mockApiClient, '/assessments/1/submit', {
        answers,
      });
      expect(result).toEqual(mockResult);
    });
  });
});
