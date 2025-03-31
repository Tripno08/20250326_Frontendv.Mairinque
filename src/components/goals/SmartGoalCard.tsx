'use client';

import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Chip,
  IconButton,
  Divider,
  LinearProgress,
  Grid,
  Tooltip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Update as UpdateIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Timer as TimerIcon,
  Cancel as CancelIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Flag as FlagIcon,
} from '@mui/icons-material';
import { format, isBefore, differenceInDays, isAfter } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { GoalVisualizationProps, SmartGoal } from '@/types/smart-goals';

// Função para calcular porcentagem de progresso
const calculateProgress = (goal: SmartGoal): number => {
  const { measurement } = goal;
  const { initialValue, targetValue, currentValue } = measurement;

  // Se o valor alvo é igual ao inicial, consideramos 100% completo se atingido
  if (initialValue === targetValue) {
    return currentValue >= targetValue ? 100 : 0;
  }

  // Se o valor alvo é menor que o inicial (ex: reduzir algo)
  if (targetValue < initialValue) {
    if (currentValue <= targetValue) return 100;
    if (currentValue >= initialValue) return 0;
    return Math.round(((initialValue - currentValue) / (initialValue - targetValue)) * 100);
  }

  // Caso normal: valor alvo maior que inicial (ex: aumentar algo)
  if (currentValue >= targetValue) return 100;
  if (currentValue <= initialValue) return 0;
  return Math.round(((currentValue - initialValue) / (targetValue - initialValue)) * 100);
};

// Função para obter cor com base no status
const getStatusColor = (status: string): string => {
  switch (status) {
    case 'concluída':
      return 'success.main';
    case 'em andamento':
      return 'info.main';
    case 'atrasada':
      return 'error.main';
    case 'cancelada':
      return 'text.disabled';
    default:
      return 'warning.main'; // não iniciada
  }
};

// Função para obter cor com base na prioridade
const getPriorityColor = (priority: string): string => {
  switch (priority) {
    case 'crítica':
      return 'error';
    case 'alta':
      return 'warning';
    case 'média':
      return 'info';
    default:
      return 'success'; // baixa
  }
};

// Função para obter ícone do status
const StatusIcon: React.FC<{ status: string }> = ({ status }) => {
  switch (status) {
    case 'concluída':
      return <CheckCircleIcon color="success" />;
    case 'em andamento':
      return <TimerIcon color="info" />;
    case 'atrasada':
      return <FlagIcon color="error" />;
    case 'cancelada':
      return <CancelIcon color="action" />;
    default: // não iniciada
      return <ScheduleIcon color="warning" />;
  }
};

export const SmartGoalCard: React.FC<GoalVisualizationProps> = ({
  goal,
  onEdit,
  onDelete,
  onUpdateProgress,
}) => {
  // Estados para diálogos
  const [openDelete, setOpenDelete] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [newValue, setNewValue] = useState<number>(goal.measurement.currentValue);
  const [progressNotes, setProgressNotes] = useState('');

  // Calcular progresso
  const progress = calculateProgress(goal);

  // Verificar se meta está atrasada mas não marcada como tal
  const isOverdue =
    goal.status !== 'concluída' &&
    goal.status !== 'cancelada' &&
    isBefore(goal.targetDate, new Date()) &&
    goal.status !== 'atrasada';

  // Calcular dias restantes
  const daysLeft = differenceInDays(goal.targetDate, new Date());

  // Verificar se meta está perto do prazo (menos de 7 dias)
  const isCloseToDeadline =
    daysLeft >= 0 && daysLeft < 7 && goal.status !== 'concluída' && goal.status !== 'cancelada';

  // Analisar tendência (baseado no último registro do histórico)
  const getTrend = () => {
    const { progressHistory } = goal.measurement;
    if (progressHistory.length < 2) return 'stable';

    // Ordena por data (mais recente primeiro)
    const sortedHistory = [...progressHistory].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    const latestValue = sortedHistory[0].value;
    const previousValue = sortedHistory[1].value;

    if (latestValue > previousValue) return 'up';
    if (latestValue < previousValue) return 'down';
    return 'stable';
  };

  const trend = getTrend();

  // Manipuladores para diálogos
  const handleOpenDelete = () => setOpenDelete(true);
  const handleCloseDelete = () => setOpenDelete(false);
  const handleConfirmDelete = () => {
    if (onDelete) {
      onDelete(goal.id);
    }
    setOpenDelete(false);
  };

  const handleOpenUpdate = () => {
    setNewValue(goal.measurement.currentValue);
    setProgressNotes('');
    setOpenUpdate(true);
  };

  const handleCloseUpdate = () => setOpenUpdate(false);

  const handleConfirmUpdate = () => {
    if (onUpdateProgress) {
      onUpdateProgress(goal.id, newValue, progressNotes);
    }
    setOpenUpdate(false);
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        mb: 4,
        borderRadius: 2,
        borderLeft: 4,
        borderColor: getStatusColor(goal.status),
        position: 'relative',
        transition: 'all 0.2s',
        '&:hover': {
          boxShadow: 6,
        },
      }}
    >
      {/* Cabeçalho */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Box>
          <Typography variant="h6" component="h3" gutterBottom>
            {goal.title}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1 }}>
            <Chip
              icon={<StatusIcon status={goal.status} />}
              label={goal.status.charAt(0).toUpperCase() + goal.status.slice(1)}
              size="small"
              sx={{ backgroundColor: `${getStatusColor(goal.status)}25` }}
            />
            <Chip
              label={goal.priority}
              size="small"
              color={getPriorityColor(goal.priority)}
              variant="outlined"
            />
            <Chip label={goal.domain} size="small" variant="outlined" />
          </Box>
        </Box>

        {/* Ações */}
        <Box>
          {onUpdateProgress && goal.status !== 'concluída' && goal.status !== 'cancelada' && (
            <IconButton color="primary" onClick={handleOpenUpdate} aria-label="Atualizar progresso">
              <UpdateIcon />
            </IconButton>
          )}

          {onEdit && (
            <IconButton color="info" onClick={() => onEdit(goal.id)} aria-label="Editar meta">
              <EditIcon />
            </IconButton>
          )}

          {onDelete && (
            <IconButton color="error" onClick={handleOpenDelete} aria-label="Excluir meta">
              <DeleteIcon />
            </IconButton>
          )}
        </Box>
      </Box>

      {/* Descrição */}
      {goal.description && (
        <Typography variant="body2" color="text.secondary" paragraph>
          {goal.description}
        </Typography>
      )}

      {/* Progresso */}
      <Box sx={{ mt: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="body2" fontWeight="medium">
            Progresso ({progress}%)
          </Typography>

          {trend === 'up' && (
            <Tooltip title="Tendência de melhoria">
              <TrendingUpIcon color="success" fontSize="small" />
            </Tooltip>
          )}

          {trend === 'down' && (
            <Tooltip title="Tendência de piora">
              <TrendingDownIcon color="error" fontSize="small" />
            </Tooltip>
          )}
        </Box>

        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{
            height: 8,
            borderRadius: 1,
            mb: 1,
            backgroundColor: theme => `${theme.palette.primary.main}20`,
          }}
        />

        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="caption" color="text.secondary">
            {goal.measurement.initialValue} {goal.measurement.unit}
          </Typography>
          <Typography variant="caption" fontWeight="bold">
            {goal.measurement.currentValue} {goal.measurement.unit}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {goal.measurement.targetValue} {goal.measurement.unit}
          </Typography>
        </Box>
      </Box>

      {/* Informações SMART */}
      <Grid container spacing={2} sx={{ mt: 1 }}>
        {/* Específico */}
        <Grid item xs={12}>
          <Typography variant="subtitle2" color="primary" gutterBottom>
            S - Específico
          </Typography>
          <Typography variant="body2" paragraph>
            {goal.specificDetails}
          </Typography>
        </Grid>

        {/* Alcançável */}
        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle2" color="primary" gutterBottom>
            A - Alcançável
          </Typography>
          <Box component="ul" sx={{ pl: 2, mt: 0 }}>
            {goal.achievementSteps.map((step, index) => (
              <Typography component="li" variant="body2" key={index}>
                {step}
              </Typography>
            ))}
          </Box>
        </Grid>

        {/* Relevante */}
        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle2" color="primary" gutterBottom>
            R - Relevante
          </Typography>
          <Typography variant="body2" paragraph>
            {goal.relevance}
          </Typography>
        </Grid>
      </Grid>

      {/* Temporal */}
      <Box sx={{ mt: 2, pt: 2, borderTop: 1, borderColor: 'divider' }}>
        <Typography variant="subtitle2" color="primary" gutterBottom>
          T - Temporal
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">
              Início: {format(new Date(goal.startDate), 'dd/MM/yyyy', { locale: ptBR })}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography
              variant="body2"
              color={
                isOverdue ? 'error.main' : isCloseToDeadline ? 'warning.main' : 'text.secondary'
              }
              fontWeight={isOverdue || isCloseToDeadline ? 'bold' : 'regular'}
            >
              Prazo: {format(new Date(goal.targetDate), 'dd/MM/yyyy', { locale: ptBR })}
              {isOverdue && ' (Atrasada)'}
              {isCloseToDeadline && ` (${daysLeft} dias restantes)`}
            </Typography>
          </Grid>
        </Grid>
      </Box>

      {/* Responsáveis e habilidades */}
      {(goal.responsibleUsers.length > 0 || goal.skills.length > 0) && (
        <Box sx={{ mt: 2, pt: 2, borderTop: 1, borderColor: 'divider' }}>
          <Grid container spacing={2}>
            {goal.responsibleUsers.length > 0 && (
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" gutterBottom>
                  Responsáveis
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {goal.responsibleUsers.map((user, index) => (
                    <Chip key={index} label={user} size="small" variant="outlined" />
                  ))}
                </Box>
              </Grid>
            )}

            {goal.skills.length > 0 && (
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" gutterBottom>
                  Habilidades Relacionadas
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {goal.skills.map((skill, index) => (
                    <Chip key={index} label={skill} size="small" variant="outlined" />
                  ))}
                </Box>
              </Grid>
            )}
          </Grid>
        </Box>
      )}

      {/* Diálogo para excluir meta */}
      <Dialog open={openDelete} onClose={handleCloseDelete}>
        <DialogTitle>Excluir Meta</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tem certeza que deseja excluir a meta "{goal.title}"? Esta ação não pode ser desfeita.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDelete}>Cancelar</Button>
          <Button onClick={handleConfirmDelete} color="error" autoFocus>
            Excluir
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo para atualizar progresso */}
      <Dialog open={openUpdate} onClose={handleCloseUpdate}>
        <DialogTitle>Atualizar Progresso</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Atualize o valor atual do progresso da meta.
          </DialogContentText>

          <TextField
            autoFocus
            label={`Valor atual (${goal.measurement.unit})`}
            type="number"
            fullWidth
            value={newValue}
            onChange={e => setNewValue(Number(e.target.value))}
            sx={{ mb: 3 }}
            inputProps={{
              min: Math.min(goal.measurement.initialValue, goal.measurement.targetValue),
              max: Math.max(goal.measurement.initialValue, goal.measurement.targetValue),
              step: 0.1,
            }}
          />

          <TextField
            label="Observações"
            fullWidth
            multiline
            rows={3}
            value={progressNotes}
            onChange={e => setProgressNotes(e.target.value)}
            placeholder="Descreva o que foi feito e/ou observações relevantes"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseUpdate}>Cancelar</Button>
          <Button onClick={handleConfirmUpdate} color="primary">
            Atualizar
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};
