import { createApiClient, get, post, put, del } from '@/utils/apiUtils';
import {
  Assessment,
  AssessmentFilters,
  AssessmentResult,
  AssessmentStats,
  PaginatedResponse,
} from '@/types/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
const apiClient = createApiClient(API_URL);

class AssessmentService {
  private static instance: AssessmentService;

  private constructor() {}

  public static getInstance(): AssessmentService {
    if (!AssessmentService.instance) {
      AssessmentService.instance = new AssessmentService();
    }
    return AssessmentService.instance;
  }

  // Listar avaliações com paginação e filtros
  public async listAssessments(
    filters: AssessmentFilters
  ): Promise<PaginatedResponse<Assessment[]>> {
    const queryParams = new URLSearchParams();

    if (filters.type) queryParams.append('type', filters.type);
    if (filters.status) queryParams.append('status', filters.status);
    if (filters.startDate) queryParams.append('startDate', filters.startDate);
    if (filters.endDate) queryParams.append('endDate', filters.endDate);
    if (filters.search) queryParams.append('search', filters.search);
    if (filters.page) queryParams.append('page', filters.page.toString());
    if (filters.limit) queryParams.append('limit', filters.limit.toString());

    const response = await get<PaginatedResponse<Assessment[]>>(
      apiClient,
      `/assessments?${queryParams.toString()}`
    );
    return response.data;
  }

  // Obter uma avaliação específica
  public async getAssessment(id: string): Promise<Assessment> {
    const response = await get<Assessment>(apiClient, `/assessments/${id}`);
    return response.data;
  }

  // Criar nova avaliação
  public async createAssessment(assessment: Omit<Assessment, 'id'>): Promise<Assessment> {
    const response = await post<Assessment>(apiClient, '/assessments', assessment);
    return response.data;
  }

  // Atualizar avaliação existente
  public async updateAssessment(id: string, assessment: Partial<Assessment>): Promise<Assessment> {
    const response = await put<Assessment>(apiClient, `/assessments/${id}`, assessment);
    return response.data;
  }

  // Excluir avaliação
  public async deleteAssessment(id: string): Promise<void> {
    await del(apiClient, `/assessments/${id}`);
  }

  // Publicar avaliação
  public async publishAssessment(id: string): Promise<Assessment> {
    const response = await post<Assessment>(apiClient, `/assessments/${id}/publish`);
    return response.data;
  }

  // Fechar avaliação
  public async closeAssessment(id: string): Promise<Assessment> {
    const response = await post<Assessment>(apiClient, `/assessments/${id}/close`);
    return response.data;
  }

  // Obter resultados de uma avaliação
  public async getAssessmentResults(id: string): Promise<AssessmentResult[]> {
    const response = await get<AssessmentResult[]>(apiClient, `/assessments/${id}/results`);
    return response.data;
  }

  // Obter estatísticas de avaliações
  public async getAssessmentStats(): Promise<AssessmentStats> {
    const response = await get<AssessmentStats>(apiClient, '/assessments/stats');
    return response.data;
  }

  // Enviar respostas de uma avaliação
  public async submitAssessment(
    id: string,
    answers: { questionId: string; answer: string }[]
  ): Promise<AssessmentResult> {
    const response = await post<AssessmentResult>(apiClient, `/assessments/${id}/submit`, {
      answers,
    });
    return response.data;
  }
}

export const assessmentService = AssessmentService.getInstance();
