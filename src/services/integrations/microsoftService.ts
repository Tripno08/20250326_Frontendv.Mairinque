import {
  MicrosoftConfig,
  IntegrationResponse,
  IntegrationEvent,
  IntegrationMetrics,
} from '@/types/integrations';
import { api } from '@/lib/api';

class MicrosoftService {
  private static instance: MicrosoftService;
  private baseUrl = '/api/integrations/microsoft';

  private constructor() {}

  public static getInstance(): MicrosoftService {
    if (!MicrosoftService.instance) {
      MicrosoftService.instance = new MicrosoftService();
    }
    return MicrosoftService.instance;
  }

  async getConfig(): Promise<IntegrationResponse<MicrosoftConfig>> {
    try {
      const response = await api.get(`${this.baseUrl}/config`);
      return response.data;
    } catch (error) {
      throw new Error('Erro ao obter configuração Microsoft');
    }
  }

  async updateConfig(
    config: Partial<MicrosoftConfig>
  ): Promise<IntegrationResponse<MicrosoftConfig>> {
    try {
      const response = await api.put(`${this.baseUrl}/config`, config);
      return response.data;
    } catch (error) {
      throw new Error('Erro ao atualizar configuração Microsoft');
    }
  }

  async testConnection(): Promise<IntegrationResponse<{ success: boolean }>> {
    try {
      const response = await api.post(`${this.baseUrl}/test`);
      return response.data;
    } catch (error) {
      throw new Error('Erro ao testar conexão Microsoft');
    }
  }

  async getEvents(): Promise<IntegrationResponse<IntegrationEvent[]>> {
    try {
      const response = await api.get(`${this.baseUrl}/events`);
      return response.data;
    } catch (error) {
      throw new Error('Erro ao obter eventos Microsoft');
    }
  }

  async getMetrics(): Promise<IntegrationResponse<IntegrationMetrics>> {
    try {
      const response = await api.get(`${this.baseUrl}/metrics`);
      return response.data;
    } catch (error) {
      throw new Error('Erro ao obter métricas Microsoft');
    }
  }

  async syncTeams(): Promise<IntegrationResponse<{ success: boolean }>> {
    try {
      const response = await api.post(`${this.baseUrl}/sync/teams`);
      return response.data;
    } catch (error) {
      throw new Error('Erro ao sincronizar Teams');
    }
  }

  async syncSharePoint(): Promise<IntegrationResponse<{ success: boolean }>> {
    try {
      const response = await api.post(`${this.baseUrl}/sync/sharepoint`);
      return response.data;
    } catch (error) {
      throw new Error('Erro ao sincronizar SharePoint');
    }
  }
}

export const microsoftService = MicrosoftService.getInstance();
