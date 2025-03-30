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
  Paper,
  Pagination
} from '@mui/material';
import {
  ResponsiveContainer,
  HeatmapChart,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Cell
} from 'recharts';
import { useScreeningAdministrations } from '../../hooks/useScreening';
import { ScreeningAdministration } from '../../types/screening';

interface InstrumentScreeningHistoryHeatmapProps {
  instrumentId: string;
}

export const InstrumentScreeningHistoryHeatmap: React.FC<InstrumentScreeningHistoryHeatmapProps> = ({
  instrumentId
}) => {
  const [filters, setFilters] = useState<{
    status?: ScreeningAdministration['status'];
    startDate?: Date;
    endDate?: Date;
  }>({});
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  const { administrations, loading, error } = useScreeningAdministrations({
    instrumentId,
    ...filters
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

  const totalPages = Math.ceil(administrations.length / itemsPerPage);
  const paginatedData = administrations.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const chartData = paginatedData.map(administration => ({
    date: new Date(administration.startDate).toLocaleDateString(),
    status: administration.status,
    responses: administration.responses.length
  }));

  const getColor = (value: number) => {
    const max = Math.max(...chartData.map(d => d.responses));
    const min = Math.min(...chartData.map(d => d.responses));
    const range = max - min;
    const step = range / 5;
    const index = Math.floor((value - min) / step);
    const colors = ['#ffebee', '#ffcdd2', '#ef5350', '#e53935', '#c62828'];
    return colors[index] || colors[0];
  };

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

      <Paper sx={{ p: 2, height: 400 }}>
        <ResponsiveContainer width="100%" height="100%">
          <HeatmapChart data={chartData}>
            <XAxis dataKey="date" />
            <YAxis dataKey="status" />
            <Tooltip
              formatter={(value: number) => [value, 'Respostas']}
              labelFormatter={(value: string) => `Data: ${value}`}
            />
            <Legend />
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={getColor(entry.responses)}
              />
            ))}
          </HeatmapChart>
        </ResponsiveContainer>
      </Paper>

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
