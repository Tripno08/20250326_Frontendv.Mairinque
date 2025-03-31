import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { assessmentService } from '@/services/assessmentService';
import { Assessment, AssessmentFilters, AssessmentResult, AssessmentStats } from '@/types/api';

// Chaves de cache para queries
export const assessmentKeys = {
  all: ['assessments'] as const,
  lists: () => [...assessmentKeys.all, 'list'] as const,
  list: (filters: AssessmentFilters) => [...assessmentKeys.lists(), filters] as const,
  details: () => [...assessmentKeys.all, 'detail'] as const,
  detail: (id: string) => [...assessmentKeys.details(), id] as const,
  results: (id: string) => [...assessmentKeys.all, 'results', id] as const,
  stats: () => [...assessmentKeys.all, 'stats'] as const,
};

// Hook para listar avaliações
export const useAssessments = (filters: AssessmentFilters) => {
  return useQuery({
    queryKey: assessmentKeys.list(filters),
    queryFn: () => assessmentService.listAssessments(filters),
  });
};

// Hook para obter uma avaliação específica
export const useAssessment = (id: string) => {
  return useQuery({
    queryKey: assessmentKeys.detail(id),
    queryFn: () => assessmentService.getAssessment(id),
    enabled: !!id,
  });
};

// Hook para criar avaliação
export const useCreateAssessment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (assessment: Omit<Assessment, 'id'>) =>
      assessmentService.createAssessment(assessment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: assessmentKeys.lists() });
    },
  });
};

// Hook para atualizar avaliação
export const useUpdateAssessment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, assessment }: { id: string; assessment: Partial<Assessment> }) =>
      assessmentService.updateAssessment(id, assessment),
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: assessmentKeys.detail(data.id) });
      queryClient.invalidateQueries({ queryKey: assessmentKeys.lists() });
    },
  });
};

// Hook para excluir avaliação
export const useDeleteAssessment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => assessmentService.deleteAssessment(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: assessmentKeys.lists() });
      queryClient.removeQueries({ queryKey: assessmentKeys.detail(id) });
    },
  });
};

// Hook para publicar avaliação
export const usePublishAssessment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => assessmentService.publishAssessment(id),
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: assessmentKeys.detail(data.id) });
      queryClient.invalidateQueries({ queryKey: assessmentKeys.lists() });
    },
  });
};

// Hook para fechar avaliação
export const useCloseAssessment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => assessmentService.closeAssessment(id),
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: assessmentKeys.detail(data.id) });
      queryClient.invalidateQueries({ queryKey: assessmentKeys.lists() });
    },
  });
};

// Hook para obter resultados de uma avaliação
export const useAssessmentResults = (id: string) => {
  return useQuery({
    queryKey: assessmentKeys.results(id),
    queryFn: () => assessmentService.getAssessmentResults(id),
    enabled: !!id,
  });
};

// Hook para obter estatísticas de avaliações
export const useAssessmentStats = () => {
  return useQuery({
    queryKey: assessmentKeys.stats(),
    queryFn: () => assessmentService.getAssessmentStats(),
  });
};

// Hook para enviar respostas de uma avaliação
export const useSubmitAssessment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      answers,
    }: {
      id: string;
      answers: { questionId: string; answer: string }[];
    }) => assessmentService.submitAssessment(id, answers),
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: assessmentKeys.results(data.assessmentId) });
      queryClient.invalidateQueries({ queryKey: assessmentKeys.stats() });
    },
  });
};
