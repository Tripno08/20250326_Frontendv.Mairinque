import { useState, useEffect, useCallback } from 'react';
import type { SmartGoal, SmartGoalFormData } from '@/types/smart-goals';

interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

/**
 * Hook para buscar todas as metas SMART
 */
export function useAllGoals() {
  const [state, setState] = useState<FetchState<SmartGoal[]>>({
    data: null,
    loading: true,
    error: null
  });

  const fetchGoals = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await fetch('/api/goals');

      if (!response.ok) {
        throw new Error(`Falha ao buscar metas: ${response.status}`);
      }

      const data = await response.json();
      setState({ data, loading: false, error: null });
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error : new Error(String(error))
      }));
    }
  }, []);

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  return { ...state, refetch: fetchGoals };
}

/**
 * Hook para buscar metas SMART de um aluno específico
 */
export function useStudentGoals(studentId: string) {
  const [state, setState] = useState<FetchState<SmartGoal[]>>({
    data: null,
    loading: true,
    error: null
  });

  const fetchGoals = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await fetch(`/api/goals?studentId=${studentId}`);

      if (!response.ok) {
        throw new Error(`Falha ao buscar metas: ${response.status}`);
      }

      const data = await response.json();
      setState({ data, loading: false, error: null });
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error : new Error(String(error))
      }));
    }
  }, [studentId]);

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  return { ...state, refetch: fetchGoals };
}

/**
 * Hook para buscar uma meta SMART específica
 */
export function useGoal(goalId: string) {
  const [state, setState] = useState<FetchState<SmartGoal>>({
    data: null,
    loading: true,
    error: null
  });

  const fetchGoal = useCallback(async () => {
    if (!goalId) {
      setState({ data: null, loading: false, error: null });
      return;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await fetch(`/api/goals/${goalId}`);

      if (!response.ok) {
        throw new Error(`Falha ao buscar meta: ${response.status}`);
      }

      const data = await response.json();
      setState({ data, loading: false, error: null });
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error : new Error(String(error))
      }));
    }
  }, [goalId]);

  useEffect(() => {
    fetchGoal();
  }, [fetchGoal]);

  return { ...state, refetch: fetchGoal };
}

/**
 * Hook para criar uma nova meta SMART
 */
export function useCreateGoal() {
  const [state, setState] = useState<{
    loading: boolean;
    error: Error | null;
    success: boolean;
    data: SmartGoal | null;
  }>({
    loading: false,
    error: null,
    success: false,
    data: null
  });

  const createGoal = async (formData: SmartGoalFormData) => {
    setState({ loading: true, error: null, success: false, data: null });

    try {
      const response = await fetch('/api/goals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error(`Falha ao criar meta: ${response.status}`);
      }

      const data = await response.json();
      setState({ loading: false, error: null, success: true, data });

      return data;
    } catch (error) {
      setState({
        loading: false,
        error: error instanceof Error ? error : new Error(String(error)),
        success: false,
        data: null
      });

      throw error;
    }
  };

  return { ...state, createGoal };
}

/**
 * Hook para atualizar uma meta SMART existente
 */
export function useUpdateGoal(goalId: string) {
  const [state, setState] = useState<{
    loading: boolean;
    error: Error | null;
    success: boolean;
    data: SmartGoal | null;
  }>({
    loading: false,
    error: null,
    success: false,
    data: null
  });

  const updateGoal = async (formData: SmartGoalFormData) => {
    setState({ loading: true, error: null, success: false, data: null });

    try {
      const response = await fetch(`/api/goals/${goalId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error(`Falha ao atualizar meta: ${response.status}`);
      }

      const data = await response.json();
      setState({ loading: false, error: null, success: true, data });

      return data;
    } catch (error) {
      setState({
        loading: false,
        error: error instanceof Error ? error : new Error(String(error)),
        success: false,
        data: null
      });

      throw error;
    }
  };

  return { ...state, updateGoal };
}

/**
 * Hook para excluir uma meta SMART
 */
export function useDeleteGoal() {
  const [state, setState] = useState<{
    loading: boolean;
    error: Error | null;
    success: boolean;
  }>({
    loading: false,
    error: null,
    success: false
  });

  const deleteGoal = async (goalId: string) => {
    setState({ loading: true, error: null, success: false });

    try {
      const response = await fetch(`/api/goals/${goalId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error(`Falha ao excluir meta: ${response.status}`);
      }

      setState({ loading: false, error: null, success: true });

      return true;
    } catch (error) {
      setState({
        loading: false,
        error: error instanceof Error ? error : new Error(String(error)),
        success: false
      });

      throw error;
    }
  };

  return { ...state, deleteGoal };
}

/**
 * Hook para atualizar o progresso de uma meta SMART
 */
export function useUpdateGoalProgress() {
  const [state, setState] = useState<{
    loading: boolean;
    error: Error | null;
    success: boolean;
    data: SmartGoal | null;
  }>({
    loading: false,
    error: null,
    success: false,
    data: null
  });

  const updateProgress = async (goalId: string, value: number, notes?: string) => {
    setState({ loading: true, error: null, success: false, data: null });

    try {
      const response = await fetch(`/api/goals/${goalId}/progress`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ value, notes })
      });

      if (!response.ok) {
        throw new Error(`Falha ao atualizar progresso: ${response.status}`);
      }

      const data = await response.json();
      setState({ loading: false, error: null, success: true, data });

      return data;
    } catch (error) {
      setState({
        loading: false,
        error: error instanceof Error ? error : new Error(String(error)),
        success: false,
        data: null
      });

      throw error;
    }
  };

  return { ...state, updateProgress };
}
