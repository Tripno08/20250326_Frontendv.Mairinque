import {
  GoogleConfig,
  IntegrationResponse,
  IntegrationEvent,
  IntegrationMetrics,
} from '@/types/integrations';
import { api } from '@/lib/api';

class GoogleService {
  private static instance: GoogleService;
  private baseUrl = '/api/integrations/google';

  private constructor() {}

  public static getInstance(): GoogleService {
    if (!GoogleService.instance) {
      GoogleService.instance = new GoogleService();
    }
    return GoogleService.instance;
  }

  async getConfig(): Promise<IntegrationResponse<GoogleConfig>> {
    try {
      const response = await api.get(`${this.baseUrl}/config`);
      return response.data;
    } catch (error) {
      throw new Error('Erro ao obter configuração Google');
    }
  }

  async updateConfig(config: Partial<GoogleConfig>): Promise<IntegrationResponse<GoogleConfig>> {
    try {
      const response = await api.put(`${this.baseUrl}/config`, config);
      return response.data;
    } catch (error) {
      throw new Error('Erro ao atualizar configuração Google');
    }
  }

  async testConnection(): Promise<IntegrationResponse<{ success: boolean }>> {
    try {
      const response = await api.post(`${this.baseUrl}/test`);
      return response.data;
    } catch (error) {
      throw new Error('Erro ao testar conexão Google');
    }
  }

  async getEvents(): Promise<IntegrationResponse<IntegrationEvent[]>> {
    try {
      const response = await api.get(`${this.baseUrl}/events`);
      return response.data;
    } catch (error) {
      throw new Error('Erro ao obter eventos Google');
    }
  }

  async getMetrics(): Promise<IntegrationResponse<IntegrationMetrics>> {
    try {
      const response = await api.get(`${this.baseUrl}/metrics`);
      return response.data;
    } catch (error) {
      throw new Error('Erro ao obter métricas Google');
    }
  }

  async syncClassroom(): Promise<IntegrationResponse<{ success: boolean }>> {
    try {
      const response = await api.post(`${this.baseUrl}/sync/classroom`);
      return response.data;
    } catch (error) {
      throw new Error('Erro ao sincronizar Google Classroom');
    }
  }

  async syncDrive(): Promise<IntegrationResponse<{ success: boolean }>> {
    try {
      const response = await api.post(`${this.baseUrl}/sync/drive`);
      return response.data;
    } catch (error) {
      throw new Error('Erro ao sincronizar Google Drive');
    }
  }

  async syncCalendar(): Promise<IntegrationResponse<{ success: boolean }>> {
    try {
      const response = await api.post(`${this.baseUrl}/sync/calendar`);
      return response.data;
    } catch (error) {
      throw new Error('Erro ao sincronizar Google Calendar');
    }
  }
}

export const googleService = GoogleService.getInstance();
