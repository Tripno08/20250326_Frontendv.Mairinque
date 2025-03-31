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
  Card,
  CardContent,
  Chip,
  Pagination,
} from '@mui/material';
import { useScreeningAdministrations } from '../../hooks/useScreening';
import { ScreeningAdministration } from '../../types/screening';

interface InstrumentScreeningHistoryCardsProps {
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
      return 'default';
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

export const InstrumentScreeningHistoryCards: React.FC<InstrumentScreeningHistoryCardsProps> = ({
  instrumentId,
}) => {
  const [filters, setFilters] = useState<{
    status?: ScreeningAdministration['status'];
    startDate?: Date;
    endDate?: Date;
  }>({});
  const [page, setPage] = useState(1);
  const cardsPerPage = 6;

  const { administrations, loading, error } = useScreeningAdministrations({
    instrumentId,
    ...filters,
  });

  const handleFilterChange = (field: keyof typeof filters, value: any) => {
    setFilters(prev => ({ ...prev, [field]: value }));
    setPage(1);
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  if (loading) {
    return <Typography>Carregando...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error.message}</Typography>;
  }

  const totalPages = Math.ceil(administrations.length / cardsPerPage);
  const paginatedData = administrations.slice((page - 1) * cardsPerPage, page * cardsPerPage);

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
              onChange={e => handleFilterChange('status', e.target.value)}
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
            onChange={e =>
              handleFilterChange('startDate', e.target.value ? new Date(e.target.value) : undefined)
            }
            InputLabelProps={{ shrink: true }}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <TextField
            fullWidth
            label="Data Final"
            type="date"
            value={filters.endDate ? new Date(filters.endDate).toISOString().split('T')[0] : ''}
            onChange={e =>
              handleFilterChange('endDate', e.target.value ? new Date(e.target.value) : undefined)
            }
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        {paginatedData.map(administration => (
          <Grid item xs={12} sm={6} md={4} key={administration.id}>
            <Card>
              <CardContent>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 2,
                  }}
                >
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
                  Término:{' '}
                  {administration.endDate ? new Date(administration.endDate).toLocaleString() : '-'}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Respostas: {administration.responses.length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={handlePageChange}
          color="primary"
          showFirstButton
          showLastButton
        />
      </Box>
    </Box>
  );
};
