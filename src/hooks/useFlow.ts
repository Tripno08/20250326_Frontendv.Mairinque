import { useState, useCallback } from 'react';
import { create } from 'zustand';
import { Flow, FlowNode, FlowEdge, UseFlowReturn } from '../types/flow';

interface FlowStore {
  flow: Flow | null;
  isLoading: boolean;
  error: Error | null;
  setFlow: (flow: Flow) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: Error | null) => void;
}

const useFlowStore = create<FlowStore>(set => ({
  flow: null,
  isLoading: false,
  error: null,
  setFlow: flow => set({ flow }),
  setLoading: loading => set({ isLoading: loading }),
  setError: error => set({ error }),
}));

export function useFlow(initialFlow?: Flow): UseFlowReturn {
  const { flow, isLoading, error, setFlow, setLoading, setError } = useFlowStore();

  // Inicializa o fluxo se fornecido
  useState(() => {
    if (initialFlow) {
      setFlow(initialFlow);
    }
  });

  const updateFlow = useCallback(
    async (updatedFlow: Flow) => {
      try {
        setLoading(true);
        // TODO: Implementar chamada à API
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulação
        setFlow(updatedFlow);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Erro ao atualizar fluxo'));
      } finally {
        setLoading(false);
      }
    },
    [setFlow, setLoading, setError]
  );

  const addNode = useCallback(
    (node: FlowNode) => {
      if (!flow) return;

      const updatedFlow: Flow = {
        ...flow,
        nodes: [...flow.nodes, node],
      };
      setFlow(updatedFlow);
    },
    [flow, setFlow]
  );

  const removeNode = useCallback(
    (nodeId: string) => {
      if (!flow) return;

      const updatedFlow: Flow = {
        ...flow,
        nodes: flow.nodes.filter(node => node.id !== nodeId),
        edges: flow.edges.filter(edge => edge.source !== nodeId && edge.target !== nodeId),
      };
      setFlow(updatedFlow);
    },
    [flow, setFlow]
  );

  const addEdge = useCallback(
    (edge: FlowEdge) => {
      if (!flow) return;

      const updatedFlow: Flow = {
        ...flow,
        edges: [...flow.edges, edge],
      };
      setFlow(updatedFlow);
    },
    [flow, setFlow]
  );

  const removeEdge = useCallback(
    (edgeId: string) => {
      if (!flow) return;

      const updatedFlow: Flow = {
        ...flow,
        edges: flow.edges.filter(edge => edge.id !== edgeId),
      };
      setFlow(updatedFlow);
    },
    [flow, setFlow]
  );

  return {
    flow,
    isLoading,
    error,
    updateFlow,
    addNode,
    removeNode,
    addEdge,
    removeEdge,
  };
}
