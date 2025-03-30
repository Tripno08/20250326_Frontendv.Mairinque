import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Team,
  TeamMember,
  TeamCase,
  TeamMeeting,
  TeamMessage,
  TeamMetrics,
  TeamFilters
} from '@/types/team';
import { teamService } from '@/services/teamService';

// Hook para lidar com a lista de equipes
export function useTeams() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchTeams = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const fetchedTeams = await teamService.getTeams();
      setTeams(fetchedTeams);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao buscar equipes'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTeams();
  }, [fetchTeams]);

  const createTeam = useCallback(async (teamData: Omit<Team, 'id' | 'dateCreated' | 'dateModified'>) => {
    try {
      const newTeam = await teamService.createTeam(teamData);
      setTeams(prev => [...prev, newTeam]);
      return newTeam;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Erro ao criar equipe');
    }
  }, []);

  const updateTeam = useCallback(async (teamId: string, teamData: Partial<Omit<Team, 'id' | 'dateCreated'>>) => {
    try {
      const updatedTeam = await teamService.updateTeam(teamId, teamData);
      if (updatedTeam) {
        setTeams(prev => prev.map(team => team.id === teamId ? updatedTeam : team));
      }
      return updatedTeam;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Erro ao atualizar equipe');
    }
  }, []);

  const deleteTeam = useCallback(async (teamId: string) => {
    try {
      const success = await teamService.deleteTeam(teamId);
      if (success) {
        setTeams(prev => prev.filter(team => team.id !== teamId));
      }
      return success;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Erro ao excluir equipe');
    }
  }, []);

  return {
    teams,
    isLoading,
    error,
    fetchTeams,
    createTeam,
    updateTeam,
    deleteTeam
  };
}

// Hook para lidar com uma equipe específica
export function useTeam(teamId: string) {
  const [team, setTeam] = useState<Team | null>(null);
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [cases, setCases] = useState<TeamCase[]>([]);
  const [metrics, setMetrics] = useState<TeamMetrics | null>(null);
  const [meetings, setMeetings] = useState<TeamMeeting[]>([]);
  const [messages, setMessages] = useState<TeamMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchTeamData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Buscar dados da equipe em paralelo
      const [
        teamData,
        membersData,
        casesData,
        metricsData,
        meetingsData,
        messagesData
      ] = await Promise.all([
        teamService.getTeamById(teamId),
        teamService.getTeamMembers(teamId),
        teamService.getTeamCases(teamId),
        teamService.getTeamMetrics(teamId),
        teamService.getTeamMeetings(teamId),
        teamService.getTeamMessages(teamId)
      ]);

      setTeam(teamData);
      setMembers(membersData);
      setCases(casesData);
      setMetrics(metricsData);
      setMeetings(meetingsData);
      setMessages(messagesData);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao buscar dados da equipe'));
    } finally {
      setIsLoading(false);
    }
  }, [teamId]);

  useEffect(() => {
    if (teamId) {
      fetchTeamData();
    }
  }, [teamId, fetchTeamData]);

  // Funções para manipular membros da equipe
  const addMember = useCallback(async (memberData: Omit<TeamMember, 'id'>) => {
    try {
      const newMember = await teamService.addMemberToTeam(teamId, memberData);
      if (newMember) {
        setMembers(prev => [...prev, newMember]);
      }
      return newMember;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Erro ao adicionar membro à equipe');
    }
  }, [teamId]);

  const removeMember = useCallback(async (memberId: string) => {
    try {
      const success = await teamService.removeMemberFromTeam(teamId, memberId);
      if (success) {
        setMembers(prev => prev.filter(member => member.id !== memberId));
      }
      return success;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Erro ao remover membro da equipe');
    }
  }, [teamId]);

  const updateMember = useCallback(async (memberId: string, memberData: Partial<Omit<TeamMember, 'id'>>) => {
    try {
      const updatedMember = await teamService.updateTeamMember(memberId, memberData);
      if (updatedMember) {
        setMembers(prev => prev.map(member => member.id === memberId ? updatedMember : member));
      }
      return updatedMember;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Erro ao atualizar membro da equipe');
    }
  }, []);

  // Funções para manipular casos da equipe
  const assignCase = useCallback(async (caseId: string) => {
    try {
      const success = await teamService.assignCaseToTeam(teamId, caseId);
      if (success) {
        // Recarregar os casos após a atribuição
        const updatedCases = await teamService.getTeamCases(teamId);
        setCases(updatedCases);
      }
      return success;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Erro ao atribuir caso à equipe');
    }
  }, [teamId]);

  const unassignCase = useCallback(async (caseId: string) => {
    try {
      const success = await teamService.unassignCaseFromTeam(teamId, caseId);
      if (success) {
        setCases(prev => prev.filter(c => c.id !== caseId));
      }
      return success;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Erro ao remover caso da equipe');
    }
  }, [teamId]);

  // Funções para manipular mensagens
  const sendMessage = useCallback(async (messageData: Omit<TeamMessage, 'id' | 'timestamp' | 'isRead'>) => {
    try {
      const newMessage = await teamService.sendMessage(messageData);
      setMessages(prev => [...prev, newMessage]);
      return newMessage;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Erro ao enviar mensagem');
    }
  }, []);

  const markMessageAsRead = useCallback(async (messageId: string) => {
    try {
      const success = await teamService.markMessageAsRead(messageId);
      if (success) {
        setMessages(prev => prev.map(msg =>
          msg.id === messageId ? { ...msg, isRead: true } : msg
        ));
      }
      return success;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Erro ao marcar mensagem como lida');
    }
  }, []);

  // Funções para manipular reuniões
  const createMeeting = useCallback(async (meetingData: Omit<TeamMeeting, 'id'>) => {
    try {
      const newMeeting = await teamService.createMeeting(meetingData);
      setMeetings(prev => [...prev, newMeeting]);
      return newMeeting;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Erro ao criar reunião');
    }
  }, []);

  // Estatísticas derivadas
  const membersWithCaseload = useMemo(() => {
    if (!cases || !members) return [];

    return members.map(member => {
      const assignedCases = cases.filter(c => c.assignedTo?.includes(member.id));
      return {
        ...member,
        assignedCases,
        caseCount: assignedCases.length,
        casesByTier: {
          1: assignedCases.filter(c => c.tier === 1).length,
          2: assignedCases.filter(c => c.tier === 2).length,
          3: assignedCases.filter(c => c.tier === 3).length
        }
      };
    });
  }, [cases, members]);

  return {
    team,
    members,
    cases,
    metrics,
    meetings,
    messages,
    isLoading,
    error,
    fetchTeamData,
    addMember,
    removeMember,
    updateMember,
    assignCase,
    unassignCase,
    sendMessage,
    markMessageAsRead,
    createMeeting,
    membersWithCaseload
  };
}

// Hook para filtragem de membros da equipe
export function useTeamMemberFilters(teamId: string) {
  const [filters, setFilters] = useState<TeamFilters>({});
  const [filteredMembers, setFilteredMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const applyFilters = useCallback(async (newFilters: TeamFilters) => {
    setIsLoading(true);
    setError(null);
    try {
      const members = await teamService.filterTeamMembers(teamId, newFilters);
      setFilteredMembers(members);
      setFilters(newFilters);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao filtrar membros'));
    } finally {
      setIsLoading(false);
    }
  }, [teamId]);

  // Aplicar filtros iniciais (vazios)
  useEffect(() => {
    if (teamId) {
      applyFilters({});
    }
  }, [teamId, applyFilters]);

  return {
    filters,
    filteredMembers,
    isLoading,
    error,
    applyFilters
  };
}

// Hook para gerenciar atribuições de casos
export function useCaseAssignments(teamId: string) {
  const [assignments, setAssignments] = useState<Record<string, string[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { members, cases } = useTeam(teamId);

  // Inicializar as atribuições com base nos casos
  useEffect(() => {
    if (cases.length > 0) {
      const initialAssignments: Record<string, string[]> = {};

      cases.forEach(caseItem => {
        if (caseItem.assignedTo) {
          caseItem.assignedTo.forEach(memberId => {
            if (!initialAssignments[memberId]) {
              initialAssignments[memberId] = [];
            }
            if (!initialAssignments[memberId].includes(caseItem.id)) {
              initialAssignments[memberId].push(caseItem.id);
            }
          });
        }
      });

      setAssignments(initialAssignments);
      setIsLoading(false);
    }
  }, [cases]);

  const updateAssignment = useCallback(async (memberId: string, caseIds: string[]) => {
    try {
      // Simulação de uma chamada para atualizar as atribuições no servidor
      // Em uma implementação real, isso seria substituído pela chamada de API adequada
      await new Promise(resolve => setTimeout(resolve, 500));

      setAssignments(prev => ({
        ...prev,
        [memberId]: caseIds
      }));

      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao atualizar atribuições'));
      return false;
    }
  }, []);

  // Estatísticas derivadas
  const caseloadByMember = useMemo(() => {
    return members.map(member => {
      const memberCases = assignments[member.id] || [];
      return {
        memberId: member.id,
        memberName: member.name,
        caseCount: memberCases.length,
        cases: cases.filter(c => memberCases.includes(c.id))
      };
    });
  }, [members, cases, assignments]);

  return {
    assignments,
    isLoading,
    error,
    updateAssignment,
    caseloadByMember
  };
}

// Hook para o dashboard de desempenho da equipe
export function useTeamPerformance(teamId: string, dateRange?: { start: string; end: string }) {
  const [metrics, setMetrics] = useState<TeamMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchMetrics = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const metricsData = await teamService.getTeamMetrics(teamId);
      setMetrics(metricsData);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao buscar métricas da equipe'));
    } finally {
      setIsLoading(false);
    }
  }, [teamId]);

  useEffect(() => {
    if (teamId) {
      fetchMetrics();
    }
  }, [teamId, fetchMetrics, dateRange]);

  return {
    metrics,
    isLoading,
    error,
    fetchMetrics
  };
}
