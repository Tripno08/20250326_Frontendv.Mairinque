import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Chip
} from '@mui/material';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import { useScreeningAdministrations } from '../../hooks/useScreening';
import { ScreeningAdministration } from '../../types/screening';

interface InstrumentScreeningHistoryTimelineProps {
  instrumentId: string;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending':
      return 'warning';
    case 'in_progress':
      return 'info';
    case 'completed':
      return 'success';
    case 'cancelled':
      return 'error';
    default:
      return 'grey';
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'pending':
      return 'Pendente';
    case 'in_progress':
      return 'Em Andamento';
    case 'completed':
      return 'Concluído';
    case 'cancelled':
      return 'Cancelado';
    default:
      return status;
  }
};

export const InstrumentScreeningHistoryTimeline: React.FC<InstrumentScreeningHistoryTimelineProps> = ({
  instrumentId
}) => {
  const [filters, setFilters] = useState<{
    status?: ScreeningAdministration['status'];
    startDate?: Date;
    endDate?: Date;
  }>({});

  const { administrations, loading, error } = useScreeningAdministrations({
    instrumentId,
    ...filters
  });

  const handleFilterChange = (field: keyof typeof filters, value: any) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return <Typography>Carregando...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error.message}</Typography>;
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Histórico de Administrações
      </Typography>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={4}>
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              value={filters.status || ''}
              label="Status"
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <MenuItem value="">Todos</MenuItem>
              <MenuItem value="pending">Pendente</MenuItem>
              <MenuItem value="in_progress">Em Andamento</MenuItem>
              <MenuItem value="completed">Concluído</MenuItem>
              <MenuItem value="cancelled">Cancelado</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <TextField
            fullWidth
            label="Data Inicial"
            type="date"
            value={filters.startDate ? new Date(filters.startDate).toISOString().split('T')[0] : ''}
            onChange={(e) => handleFilterChange('startDate', e.target.value ? new Date(e.target.value) : undefined)}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <TextField
            fullWidth
            label="Data Final"
            type="date"
            value={filters.endDate ? new Date(filters.endDate).toISOString().split('T')[0] : ''}
            onChange={(e) => handleFilterChange('endDate', e.target.value ? new Date(e.target.value) : undefined)}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
      </Grid>

      <Timeline>
        {administrations.map((administration, index) => (
          <TimelineItem key={administration.id}>
            <TimelineSeparator>
              <TimelineDot color={getStatusColor(administration.status)} />
              {index < administrations.length - 1 && <TimelineConnector />}
            </TimelineSeparator>
            <TimelineContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="subtitle1" component="div">
                  Estudante: {administration.studentId}
                </Typography>
                <Chip
                  label={getStatusLabel(administration.status)}
                  color={getStatusColor(administration.status)}
                  size="small"
                />
              </Box>
              <Typography color="text.secondary" gutterBottom>
                Administrador: {administration.administratorId}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Início: {new Date(administration.startDate).toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Término: {administration.endDate ? new Date(administration.endDate).toLocaleString() : '-'}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Respostas: {administration.responses.length}
              </Typography>
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
    </Box>
  );
};
