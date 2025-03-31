import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { ApiError, ApiResponse } from '@/types/api';

// Configuração base do cliente HTTP
const createApiClient = (baseURL: string): AxiosInstance => {
  const client = axios.create({
    baseURL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Interceptor para adicionar token de autenticação
  client.interceptors.request.use(
    config => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    error => Promise.reject(error)
  );

  // Interceptor para tratamento de erros
  client.interceptors.response.use(
    response => response,
    (error: AxiosError) => {
      if (error.response?.status === 401) {
        // Token expirado ou inválido
        localStorage.removeItem('auth_token');
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );

  return client;
};

// Função para processar resposta da API
const processApiResponse = <T>(response: AxiosResponse): ApiResponse<T> => {
  return {
    data: response.data,
    status: response.status,
    message: response.data.message,
  };
};

// Função para processar erros da API
const processApiError = (error: AxiosError): ApiError => {
  if (error.response) {
    return {
      status: error.response.status,
      message: error.response.data.message || 'Erro na requisição',
      errors: error.response.data.errors || [],
    };
  }

  if (error.request) {
    return {
      status: 0,
      message: 'Erro de conexão com o servidor',
      errors: [],
    };
  }

  return {
    status: 0,
    message: error.message || 'Erro desconhecido',
    errors: [],
  };
};

// Função para fazer requisições GET
const get = async <T>(
  client: AxiosInstance,
  url: string,
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> => {
  try {
    const response = await client.get<T>(url, config);
    return processApiResponse<T>(response);
  } catch (error) {
    throw processApiError(error as AxiosError);
  }
};

// Função para fazer requisições POST
const post = async <T>(
  client: AxiosInstance,
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> => {
  try {
    const response = await client.post<T>(url, data, config);
    return processApiResponse<T>(response);
  } catch (error) {
    throw processApiError(error as AxiosError);
  }
};

// Função para fazer requisições PUT
const put = async <T>(
  client: AxiosInstance,
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> => {
  try {
    const response = await client.put<T>(url, data, config);
    return processApiResponse<T>(response);
  } catch (error) {
    throw processApiError(error as AxiosError);
  }
};

// Função para fazer requisições DELETE
const del = async <T>(
  client: AxiosInstance,
  url: string,
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> => {
  try {
    const response = await client.delete<T>(url, config);
    return processApiResponse<T>(response);
  } catch (error) {
    throw processApiError(error as AxiosError);
  }
};

export { createApiClient, get, post, put, del, processApiResponse, processApiError };
