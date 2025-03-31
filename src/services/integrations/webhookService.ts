import {
  WebhookConfig,
  IntegrationResponse,
  IntegrationEvent,
  IntegrationMetrics,
} from '@/types/integrations';
import { api } from '@/lib/api';

class WebhookService {
  private static instance: WebhookService;
  private baseUrl = '/api/integrations/webhooks';

  private constructor() {}

  public static getInstance(): WebhookService {
    if (!WebhookService.instance) {
      WebhookService.instance = new WebhookService();
    }
    return WebhookService.instance;
  }

  async getWebhooks(): Promise<IntegrationResponse<WebhookConfig[]>> {
    try {
      const response = await api.get(this.baseUrl);
      return response.data;
    } catch (error) {
      throw new Error('Erro ao obter webhooks');
    }
  }

  async getWebhook(id: string): Promise<IntegrationResponse<WebhookConfig>> {
    try {
      const response = await api.get(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error) {
      throw new Error('Erro ao obter webhook');
    }
  }

  async createWebhook(
    config: Omit<WebhookConfig, 'id'>
  ): Promise<IntegrationResponse<WebhookConfig>> {
    try {
      const response = await api.post(this.baseUrl, config);
      return response.data;
    } catch (error) {
      throw new Error('Erro ao criar webhook');
    }
  }

  async updateWebhook(
    id: string,
    config: Partial<WebhookConfig>
  ): Promise<IntegrationResponse<WebhookConfig>> {
    try {
      const response = await api.put(`${this.baseUrl}/${id}`, config);
      return response.data;
    } catch (error) {
      throw new Error('Erro ao atualizar webhook');
    }
  }

  async deleteWebhook(id: string): Promise<IntegrationResponse<{ success: boolean }>> {
    try {
      const response = await api.delete(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error) {
      throw new Error('Erro ao excluir webhook');
    }
  }

  async getEvents(id: string): Promise<IntegrationResponse<IntegrationEvent[]>> {
    try {
      const response = await api.get(`${this.baseUrl}/${id}/events`);
      return response.data;
    } catch (error) {
      throw new Error('Erro ao obter eventos do webhook');
    }
  }

  async getMetrics(id: string): Promise<IntegrationResponse<IntegrationMetrics>> {
    try {
      const response = await api.get(`${this.baseUrl}/${id}/metrics`);
      return response.data;
    } catch (error) {
      throw new Error('Erro ao obter métricas do webhook');
    }
  }

  async retryFailedEvents(id: string): Promise<IntegrationResponse<{ success: boolean }>> {
    try {
      const response = await api.post(`${this.baseUrl}/${id}/retry`);
      return response.data;
    } catch (error) {
      throw new Error('Erro ao tentar novamente eventos falhos');
    }
  }
}

export const webhookService = WebhookService.getInstance();
