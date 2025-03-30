'use client';

import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Chip,
  Divider,
  Button,
  IconButton,
  Tooltip,
  Paper
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  FilterList as FilterIcon,
  ClearAll as ClearAllIcon,
  Assignment as AssignmentIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { SmartGoalCard } from './SmartGoalCard';
import type { GoalListProps, SmartGoal, GoalStatus, GoalPriority } from '@/types/smart-goals';

// Tipos para filtros
interface FilterOptions {
  status: GoalStatus | 'todas';
  priority: GoalPriority | 'todas';
  domain: string | 'todos';
  search: string;
}

export const SmartGoalList: React.FC<GoalListProps> = ({
  goals,
  onEdit,
  onDelete,
  onUpdateProgress
}) => {
  // Estado dos filtros
  const [filters, setFilters] = useState<FilterOptions>({
    status: 'todas',
    priority: 'todas',
    domain: 'todos',
    search: ''
  });

  // Estado para mostrar/esconder filtros
  const [showFilters, setShowFilters] = useState(false);

  // Extrair domínios únicos das metas
  const domains = useMemo(() => {
    const uniqueDomains = new Set<string>();
    goals.forEach(goal => {
      if (goal.domain) {
        uniqueDomains.add(goal.domain);
      }
    });
    return Array.from(uniqueDomains).sort();
  }, [goals]);

  // Filtrar metas
  const filteredGoals = useMemo(() => {
    return goals.filter(goal => {
      // Filtro de status
      if (filters.status !== 'todas' && goal.status !== filters.status) {
        return false;
      }

      // Filtro de prioridade
      if (filters.priority !== 'todas' && goal.priority !== filters.priority) {
        return false;
      }

      // Filtro de domínio
      if (filters.domain !== 'todos' && goal.domain !== filters.domain) {
        return false;
      }

      // Filtro de busca
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        return (
          goal.title.toLowerCase().includes(searchLower) ||
          goal.description.toLowerCase().includes(searchLower) ||
          goal.specificDetails.toLowerCase().includes(searchLower) ||
          goal.relevance.toLowerCase().includes(searchLower) ||
          goal.skills.some(skill => skill.toLowerCase().includes(searchLower))
        );
      }

      return true;
    });
  }, [goals, filters]);

  // Atualizar filtros
  const handleFilterChange = (
    field: keyof FilterOptions,
    value: string | GoalStatus | GoalPriority | 'todas' | 'todos'
  ) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Limpar filtros
  const clearFilters = () => {
    setFilters({
      status: 'todas',
      priority: 'todas',
      domain: 'todos',
      search: ''
    });
  };

  // Toggle para mostrar/esconder filtros
  const toggleFilters = () => {
    setShowFilters(prev => !prev);
  };

  // Ordenar metas (prioridade mais alta primeiro, depois por data alvo mais próxima)
  const sortedGoals = useMemo(() => {
    const statusOrder = {
      'em andamento': 0,
      'atrasada': 1,
      'não iniciada': 2,
      'concluída': 3,
      'cancelada': 4
    };

    const priorityOrder = {
      'crítica': 0,
      'alta': 1,
      'média': 2,
      'baixa': 3
    };

    return [...filteredGoals].sort((a, b) => {
      // Primeiro por status
      const statusDiff = statusOrder[a.status as keyof typeof statusOrder] -
                          statusOrder[b.status as keyof typeof statusOrder];
      if (statusDiff !== 0) return statusDiff;

      // Depois por prioridade
      const priorityDiff = priorityOrder[a.priority as keyof typeof priorityOrder] -
                            priorityOrder[b.priority as keyof typeof priorityOrder];
      if (priorityDiff !== 0) return priorityDiff;

      // Por fim, por data alvo (mais próxima primeiro)
      return new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime();
    });
  }, [filteredGoals]);

  // Contagem de metas por status
  const goalCounts = useMemo(() => {
    const counts = {
      total: goals.length,
      ativas: goals.filter(g => g.status === 'em andamento').length,
      atrasadas: goals.filter(g => g.status === 'atrasada').length,
      concluidas: goals.filter(g => g.status === 'concluída').length,
      naoIniciadas: goals.filter(g => g.status === 'não iniciada').length,
      canceladas: goals.filter(g => g.status === 'cancelada').length
    };

    return counts;
  }, [goals]);

  return (
    <Box>
      {/* Cabeçalho e estatísticas */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" component="h1">
            Metas SMART
          </Typography>

          <Box>
            <Tooltip title="Adicionar Nova Meta">
              <IconButton color="primary" onClick={() => onEdit?.('')} sx={{ mr: 1 }}>
                <AddIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title={showFilters ? "Esconder Filtros" : "Mostrar Filtros"}>
              <IconButton
                color={showFilters ? "primary" : "default"}
                onClick={toggleFilters}
              >
                <FilterIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Estatísticas de metas */}
        <Paper
          variant="outlined"
          sx={{
            p: 2,
            mb: 3,
            display: 'flex',
            flexWrap: 'wrap',
            gap: 2,
            justifyContent: 'space-around',
            alignItems: 'center'
          }}
        >
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h4" component="div" color="primary.main">
              {goalCounts.total}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total
            </Typography>
          </Box>

          <Divider orientation="vertical" flexItem />

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h4" component="div" color="info.main">
              {goalCounts.ativas}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Em Andamento
            </Typography>
          </Box>

          <Divider orientation="vertical" flexItem />

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h4" component="div" color="warning.main">
              {goalCounts.naoIniciadas}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Não Iniciadas
            </Typography>
          </Box>

          <Divider orientation="vertical" flexItem />

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h4" component="div" color="error.main">
              {goalCounts.atrasadas}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Atrasadas
            </Typography>
          </Box>

          <Divider orientation="vertical" flexItem />

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h4" component="div" color="success.main">
              {goalCounts.concluidas}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Concluídas
            </Typography>
          </Box>
        </Paper>
      </Box>

      {/* Área de busca e filtros */}
      <Box sx={{ mb: 4 }}>
        <TextField
          fullWidth
          placeholder="Buscar meta por título, descrição, habilidades..."
          variant="outlined"
          value={filters.search}
          onChange={(e) => handleFilterChange('search', e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: filters.search ? (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  onClick={() => handleFilterChange('search', '')}
                  aria-label="Limpar busca"
                >
                  <ClearAllIcon />
                </IconButton>
              </InputAdornment>
            ) : null
          }}
          sx={{ mb: 2 }}
        />

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={4}>
                    <FormControl fullWidth size="small">
                      <InputLabel id="status-filter-label">Status</InputLabel>
                      <Select
                        labelId="status-filter-label"
                        value={filters.status}
                        onChange={(e) => handleFilterChange('status', e.target.value)}
                        label="Status"
                      >
                        <MenuItem value="todas">Todas</MenuItem>
                        <MenuItem value="em andamento">Em Andamento</MenuItem>
                        <MenuItem value="não iniciada">Não Iniciada</MenuItem>
                        <MenuItem value="atrasada">Atrasada</MenuItem>
                        <MenuItem value="concluída">Concluída</MenuItem>
                        <MenuItem value="cancelada">Cancelada</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <FormControl fullWidth size="small">
                      <InputLabel id="priority-filter-label">Prioridade</InputLabel>
                      <Select
                        labelId="priority-filter-label"
                        value={filters.priority}
                        onChange={(e) => handleFilterChange('priority', e.target.value)}
                        label="Prioridade"
                      >
                        <MenuItem value="todas">Todas</MenuItem>
                        <MenuItem value="crítica">Crítica</MenuItem>
                        <MenuItem value="alta">Alta</MenuItem>
                        <MenuItem value="média">Média</MenuItem>
                        <MenuItem value="baixa">Baixa</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <FormControl fullWidth size="small">
                      <InputLabel id="domain-filter-label">Domínio</InputLabel>
                      <Select
                        labelId="domain-filter-label"
                        value={filters.domain}
                        onChange={(e) => handleFilterChange('domain', e.target.value)}
                        label="Domínio"
                      >
                        <MenuItem value="todos">Todos</MenuItem>
                        {domains.map(domain => (
                          <MenuItem key={domain} value={domain}>{domain}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                      variant="outlined"
                      startIcon={<ClearAllIcon />}
                      onClick={clearFilters}
                      size="small"
                    >
                      Limpar Filtros
                    </Button>
                  </Grid>
                </Grid>
              </Paper>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Resumo dos filtros ativos */}
        {(filters.status !== 'todas' || filters.priority !== 'todas' || filters.domain !== 'todos') && (
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Filtros ativos:
            </Typography>

            {filters.status !== 'todas' && (
              <Chip
                label={`Status: ${filters.status}`}
                size="small"
                onDelete={() => handleFilterChange('status', 'todas')}
              />
            )}

            {filters.priority !== 'todas' && (
              <Chip
                label={`Prioridade: ${filters.priority}`}
                size="small"
                onDelete={() => handleFilterChange('priority', 'todas')}
              />
            )}

            {filters.domain !== 'todos' && (
              <Chip
                label={`Domínio: ${filters.domain}`}
                size="small"
                onDelete={() => handleFilterChange('domain', 'todos')}
              />
            )}
          </Box>
        )}
      </Box>

      {/* Lista de metas */}
      {sortedGoals.length === 0 ? (
        <Box
          sx={{
            py: 10,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            bgcolor: 'background.paper',
            borderRadius: 2
          }}
        >
          <AssignmentIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Nenhuma meta encontrada
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center" sx={{ maxWidth: 400, mb: 3 }}>
            {goals.length === 0
              ? 'Ainda não há metas cadastradas. Crie sua primeira meta SMART agora!'
              : 'Nenhuma meta corresponde aos filtros aplicados. Tente ajustar seus critérios de busca.'}
          </Typography>

          {goals.length === 0 && onEdit && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => onEdit('')}
            >
              Criar Nova Meta
            </Button>
          )}

          {goals.length > 0 && (
            <Button
              variant="outlined"
              startIcon={<ClearAllIcon />}
              onClick={clearFilters}
            >
              Limpar Filtros
            </Button>
          )}
        </Box>
      ) : (
        <AnimatePresence>
          {sortedGoals.map(goal => (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <SmartGoalCard
                goal={goal}
                onEdit={onEdit}
                onDelete={onDelete}
                onUpdateProgress={onUpdateProgress}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      )}
    </Box>
  );
};
