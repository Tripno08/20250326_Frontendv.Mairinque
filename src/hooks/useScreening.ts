import { useState, useEffect } from 'react';
import { screeningService } from '../services/screeningService';
import {
  ScreeningInstrument,
  ScreeningResult,
  ScreeningCycle,
  ScreeningRule,
  UseScreeningInstrumentReturn,
  UseScreeningResultsReturn,
  UseScreeningCycleReturn,
  ScreeningAdministration,
  ScreeningAdministrationManagerProps
} from '../types/screening';

export function useScreeningInstrument(id: string): UseScreeningInstrumentReturn {
  const [instrument, setInstrument] = useState<ScreeningInstrument | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchInstrument = async () => {
      try {
        setIsLoading(true);
        const data = await screeningService.getInstrumentById(id);
        setInstrument(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Erro desconhecido'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchInstrument();
  }, [id]);

  const toggleFavorite = async () => {
    if (!instrument) return;

    try {
      await screeningService.toggleFavoriteInstrument(instrument.id);
      setInstrument(prev => prev ? { ...prev, isFavorite: !prev.isFavorite } : null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao favoritar instrumento'));
    }
  };

  return {
    instrument,
    isLoading,
    error,
    toggleFavorite
  };
}

export function useScreeningResults(
  studentId: string,
  period?: { start: Date; end: Date }
): UseScreeningResultsReturn {
  const [results, setResults] = useState<ScreeningResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchResults = async () => {
    try {
      setIsLoading(true);
      const data = await screeningService.getResults(studentId, period);
      setResults(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro desconhecido'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, [studentId, period]);

  return {
    results,
    isLoading,
    error,
    refresh: fetchResults
  };
}

export function useScreeningCycle(id: string): UseScreeningCycleReturn {
  const [cycle, setCycle] = useState<ScreeningCycle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchCycle = async () => {
      try {
        setIsLoading(true);
        // TODO: Implementar endpoint específico para buscar ciclo
        const data = await screeningService.getRules().then(rules =>
          rules.find(rule => rule.id === id)
        );
        // Por enquanto, vamos criar um ciclo mockado para teste
        setCycle({
          id: id,
          name: 'Ciclo de Teste',
          startDate: new Date(),
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 dias
          frequency: 'monthly',
          tier: 'universal',
          instruments: [],
          status: 'pending',
          createdAt: new Date(),
          updatedAt: new Date()
        });
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Erro desconhecido'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchCycle();
  }, [id]);

  const updateCycle = async (updates: Partial<ScreeningCycle>) => {
    if (!cycle) return;

    try {
      const updated = await screeningService.updateCycle(cycle.id, updates);
      setCycle(updated);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao atualizar ciclo'));
    }
  };

  return {
    cycle,
    isLoading,
    error,
    updateCycle
  };
}

// Hook para gerenciar regras de rastreio
export function useScreeningRules() {
  const [rules, setRules] = useState<ScreeningRule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchRules = async () => {
      try {
        setIsLoading(true);
        const data = await screeningService.getRules();
        setRules(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Erro desconhecido'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchRules();
  }, []);

  const createRule = async (rule: Omit<ScreeningRule, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newRule = await screeningService.createRule(rule);
      setRules(prev => [...prev, newRule]);
      return newRule;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao criar regra'));
      throw err;
    }
  };

  const updateRule = async (id: string, updates: Partial<ScreeningRule>) => {
    try {
      const updated = await screeningService.updateRule(id, updates);
      setRules(prev => prev.map(rule =>
        rule.id === id ? updated : rule
      ));
      return updated;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao atualizar regra'));
      throw err;
    }
  };

  return {
    rules,
    isLoading,
    error,
    createRule,
    updateRule
  };
}

export const useScreeningAdministration = (id?: string) => {
  const [administration, setAdministration] = useState<ScreeningAdministration | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchAdministration = async () => {
      try {
        setLoading(true);
        const data = await screeningService.getAdministrationById(id);
        setAdministration(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Erro ao buscar administração'));
      } finally {
        setLoading(false);
      }
    };

    fetchAdministration();
  }, [id]);

  const createAdministration = async (data: Omit<ScreeningAdministration, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setLoading(true);
      const result = await screeningService.createAdministration(data);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao criar administração'));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateAdministration = async (id: string, data: Partial<ScreeningAdministration>) => {
    try {
      setLoading(true);
      const result = await screeningService.updateAdministration(id, data);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao atualizar administração'));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteAdministration = async (id: string) => {
    try {
      setLoading(true);
      await screeningService.deleteAdministration(id);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao excluir administração'));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    administration,
    loading,
    error,
    createAdministration,
    updateAdministration,
    deleteAdministration
  };
};

export const useScreeningAdministrations = (filters?: {
  studentId?: string;
  administratorId?: string;
  instrumentId?: string;
  status?: ScreeningAdministration['status'];
  startDate?: Date;
  endDate?: Date;
}) => {
  const [administrations, setAdministrations] = useState<ScreeningAdministration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchAdministrations = async () => {
      try {
        setLoading(true);
        const data = await screeningService.getAdministrations(filters);
        setAdministrations(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Erro ao buscar administrações'));
      } finally {
        setLoading(false);
      }
    };

    fetchAdministrations();
  }, [filters]);

  return { administrations, loading, error };
};
