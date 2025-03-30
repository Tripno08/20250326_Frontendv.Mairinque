import {
  ScreeningInstrument,
  ScreeningAdministration,
  ScreeningResult,
  ScreeningCycle,
  ScreeningRule
} from '../types/screening';

class ScreeningService {
  private static instance: ScreeningService;
  private baseUrl: string;

  private constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
  }

  public static getInstance(): ScreeningService {
    if (!ScreeningService.instance) {
      ScreeningService.instance = new ScreeningService();
    }
    return ScreeningService.instance;
  }

  // Instrumentos
  async getInstruments(filters?: {
    area?: string;
    category?: string;
    ageRange?: { min: number; max: number };
  }): Promise<ScreeningInstrument[]> {
    const response = await fetch(`${this.baseUrl}/api/screening/instruments`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      body: filters ? JSON.stringify(filters) : undefined,
    });

    if (!response.ok) {
      throw new Error('Erro ao buscar instrumentos');
    }

    return response.json();
  }

  async getInstrumentById(id: string): Promise<ScreeningInstrument> {
    const response = await fetch(`${this.baseUrl}/api/screening/instruments/${id}`);

    if (!response.ok) {
      throw new Error('Erro ao buscar instrumento');
    }

    return response.json();
  }

  async toggleFavoriteInstrument(id: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/api/screening/instruments/${id}/favorite`, {
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error('Erro ao favoritar instrumento');
    }
  }

  // Administração
  async startAdministration(
    instrumentId: string,
    studentId: string,
    administratorId: string
  ): Promise<ScreeningAdministration> {
    const response = await fetch(`${this.baseUrl}/api/screening/administrations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        instrumentId,
        studentId,
        administratorId,
      }),
    });

    if (!response.ok) {
      throw new Error('Erro ao iniciar administração');
    }

    return response.json();
  }

  async submitResponses(
    administrationId: string,
    responses: Array<{ questionId: string; value: any }>
  ): Promise<ScreeningAdministration> {
    const response = await fetch(
      `${this.baseUrl}/api/screening/administrations/${administrationId}/responses`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ responses }),
      }
    );

    if (!response.ok) {
      throw new Error('Erro ao enviar respostas');
    }

    return response.json();
  }

  // Resultados
  async getResults(
    studentId: string,
    period?: { start: Date; end: Date }
  ): Promise<ScreeningResult[]> {
    const queryParams = period
      ? `?start=${period.start.toISOString()}&end=${period.end.toISOString()}`
      : '';

    const response = await fetch(
      `${this.baseUrl}/api/screening/results/${studentId}${queryParams}`
    );

    if (!response.ok) {
      throw new Error('Erro ao buscar resultados');
    }

    return response.json();
  }

  // Ciclos
  async createCycle(cycle: Omit<ScreeningCycle, 'id' | 'createdAt' | 'updatedAt'>): Promise<ScreeningCycle> {
    const response = await fetch(`${this.baseUrl}/api/screening/cycles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cycle),
    });

    if (!response.ok) {
      throw new Error('Erro ao criar ciclo');
    }

    return response.json();
  }

  async updateCycle(id: string, cycle: Partial<ScreeningCycle>): Promise<ScreeningCycle> {
    const response = await fetch(`${this.baseUrl}/api/screening/cycles/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cycle),
    });

    if (!response.ok) {
      throw new Error('Erro ao atualizar ciclo');
    }

    return response.json();
  }

  // Regras
  async getRules(): Promise<ScreeningRule[]> {
    const response = await fetch(`${this.baseUrl}/api/screening/rules`);

    if (!response.ok) {
      throw new Error('Erro ao buscar regras');
    }

    return response.json();
  }

  async createRule(rule: Omit<ScreeningRule, 'id' | 'createdAt' | 'updatedAt'>): Promise<ScreeningRule> {
    const response = await fetch(`${this.baseUrl}/api/screening/rules`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(rule),
    });

    if (!response.ok) {
      throw new Error('Erro ao criar regra');
    }

    return response.json();
  }

  async updateRule(id: string, rule: Partial<ScreeningRule>): Promise<ScreeningRule> {
    const response = await fetch(`${this.baseUrl}/api/screening/rules/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(rule),
    });

    if (!response.ok) {
      throw new Error('Erro ao atualizar regra');
    }

    return response.json();
  }

  async getAdministrations(filters?: {
    studentId?: string;
    administratorId?: string;
    instrumentId?: string;
    status?: ScreeningAdministration['status'];
    startDate?: Date;
    endDate?: Date;
  }): Promise<ScreeningAdministration[]> {
    try {
      const response = await fetch(`${this.baseUrl}/administrations${this.buildQueryString(filters)}`);
      if (!response.ok) {
        throw new Error('Erro ao buscar administrações');
      }
      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar administrações:', error);
      throw error;
    }
  }

  async getAdministrationById(id: string): Promise<ScreeningAdministration> {
    try {
      const response = await fetch(`${this.baseUrl}/administrations/${id}`);
      if (!response.ok) {
        throw new Error('Erro ao buscar administração');
      }
      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar administração:', error);
      throw error;
    }
  }

  async createAdministration(administration: Omit<ScreeningAdministration, 'id' | 'createdAt' | 'updatedAt'>): Promise<ScreeningAdministration> {
    try {
      const response = await fetch(`${this.baseUrl}/administrations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(administration),
      });
      if (!response.ok) {
        throw new Error('Erro ao criar administração');
      }
      return await response.json();
    } catch (error) {
      console.error('Erro ao criar administração:', error);
      throw error;
    }
  }

  async updateAdministration(id: string, administration: Partial<ScreeningAdministration>): Promise<ScreeningAdministration> {
    try {
      const response = await fetch(`${this.baseUrl}/administrations/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(administration),
      });
      if (!response.ok) {
        throw new Error('Erro ao atualizar administração');
      }
      return await response.json();
    } catch (error) {
      console.error('Erro ao atualizar administração:', error);
      throw error;
    }
  }

  async deleteAdministration(id: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/administrations/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Erro ao excluir administração');
      }
    } catch (error) {
      console.error('Erro ao excluir administração:', error);
      throw error;
    }
  }

  private buildQueryString(filters?: Record<string, any>): string {
    if (!filters || Object.keys(filters).length === 0) {
      return '';
    }

    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (value instanceof Date) {
          params.append(key, value.toISOString());
        } else {
          params.append(key, value.toString());
        }
      }
    });

    return params.toString() ? `?${params.toString()}` : '';
  }
}

export const screeningService = ScreeningService.getInstance();
