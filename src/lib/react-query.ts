import { QueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { ApiError } from '@/types/api';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        // Não tenta novamente em caso de erros 4xx
        if (error instanceof AxiosError && error.response?.status < 500) {
          return false;
        }
        // Tenta no máximo 3 vezes
        return failureCount < 3;
      },
      staleTime: 5 * 60 * 1000, // 5 minutos
      cacheTime: 30 * 60 * 1000, // 30 minutos
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: (failureCount, error) => {
        // Não tenta novamente em caso de erros 4xx
        if (error instanceof AxiosError && error.response?.status < 500) {
          return false;
        }
        // Tenta no máximo 2 vezes
        return failureCount < 2;
      },
    },
  },
});

// Função para processar erros da API
export const handleApiError = (error: unknown): ApiError => {
  if (error instanceof AxiosError) {
    return {
      status: error.response?.status || 0,
      message: error.response?.data?.message || 'Erro na requisição',
      errors: error.response?.data?.errors || [],
    };
  }

  return {
    status: 0,
    message: error instanceof Error ? error.message : 'Erro desconhecido',
    errors: [],
  };
};

// Função para verificar se o erro é de autenticação
export const isAuthError = (error: unknown): boolean => {
  if (error instanceof AxiosError) {
    return error.response?.status === 401;
  }
  return false;
};

// Função para verificar se o erro é de permissão
export const isForbiddenError = (error: unknown): boolean => {
  if (error instanceof AxiosError) {
    return error.response?.status === 403;
  }
  return false;
};

// Função para verificar se o erro é de validação
export const isValidationError = (error: unknown): boolean => {
  if (error instanceof AxiosError) {
    return error.response?.status === 422;
  }
  return false;
};

// Função para verificar se o erro é de servidor
export const isServerError = (error: unknown): boolean => {
  if (error instanceof AxiosError) {
    return error.response?.status >= 500;
  }
  return false;
}; 