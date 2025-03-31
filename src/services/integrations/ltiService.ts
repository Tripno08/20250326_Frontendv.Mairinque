import {
  LTIConfig,
  IntegrationResponse,
  IntegrationEvent,
  IntegrationMetrics,
} from '@/types/integrations';
import { api } from '@/lib/api';

class LTIService {
  private static instance: LTIService;
  private baseUrl = '/api/integrations/lti';

  private constructor() {}

  public static getInstance(): LTIService {
    if (!LTIService.instance) {
      LTIService.instance = new LTIService();
    }
    return LTIService.instance;
  }

  async getConfig(): Promise<IntegrationResponse<LTIConfig>> {
    try {
      const response = await api.get(`${this.baseUrl}/config`);
      return response.data;
    } catch (error) {
      throw new Error('Erro ao obter configuração LTI');
    }
  }

  async updateConfig(config: Partial<LTIConfig>): Promise<IntegrationResponse<LTIConfig>> {
    try {
      const response = await api.put(`${this.baseUrl}/config`, config);
      return response.data;
    } catch (error) {
      throw new Error('Erro ao atualizar configuração LTI');
    }
  }

  async testConnection(): Promise<IntegrationResponse<{ success: boolean }>> {
    try {
      const response = await api.post(`${this.baseUrl}/test`);
      return response.data;
    } catch (error) {
      throw new Error('Erro ao testar conexão LTI');
    }
  }

  async getEvents(): Promise<IntegrationResponse<IntegrationEvent[]>> {
    try {
      const response = await api.get(`${this.baseUrl}/events`);
      return response.data;
    } catch (error) {
      throw new Error('Erro ao obter eventos LTI');
    }
  }

  async getMetrics(): Promise<IntegrationResponse<IntegrationMetrics>> {
    try {
      const response = await api.get(`${this.baseUrl}/metrics`);
      return response.data;
    } catch (error) {
      throw new Error('Erro ao obter métricas LTI');
    }
  }

  async generateLaunchUrl(params: Record<string, string>): Promise<string> {
    try {
      const response = await api.post(`${this.baseUrl}/launch-url`, params);
      return response.data.url;
    } catch (error) {
      throw new Error('Erro ao gerar URL de lançamento LTI');
    }
  }
}

export const ltiService = LTIService.getInstance();
