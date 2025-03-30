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
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { useScreeningAdministrations } from '../../hooks/useScreening';
import { ScreeningAdministration } from '../../types/screening';

interface ChartDataItem {
  date: string;
  pending: number;
  in_progress: number;
  completed: number;
  cancelled: number;
  total: number;
}

interface InstrumentScreeningHistoryComposedChartProps {
  instrumentId: string;
}

export const InstrumentScreeningHistoryComposedChart: React.FC<InstrumentScreeningHistoryComposedChartProps> = ({
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

  const calculateTotal = (data: ChartDataItem): number => {
    return data.pending + data.in_progress + data.completed + data.cancelled;
  };

  const chartData = paginatedData.reduce<ChartDataItem[]>((acc, administration) => {
    const date = new Date(administration.startDate).toLocaleDateString();
    const existingDate = acc.find(item => item.date === date);

    if (existingDate) {
      existingDate[administration.status] = (existingDate[administration.status] || 0) + administration.responses.length;
      existingDate.total = calculateTotal(existingDate);
    } else {
      const newEntry: ChartDataItem = {
        date,
        pending: administration.status === 'pending' ? administration.responses.length : 0,
        in_progress: administration.status === 'in_progress' ? administration.responses.length : 0,
        completed: administration.status === 'completed' ? administration.responses.length : 0,
        cancelled: administration.status === 'cancelled' ? administration.responses.length : 0,
        total: administration.responses.length
      };
      acc.push(newEntry);
    }
    return acc;
  }, []);

  const COLORS = {
    pending: '#FFBB28',
    in_progress: '#00C49F',
    completed: '#0088FE',
    cancelled: '#FF8042',
    total: '#8884d8'
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
          <ComposedChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area
              type="monotone"
              dataKey="pending"
              stackId="1"
              stroke={COLORS.pending}
              fill={COLORS.pending}
              fillOpacity={0.3}
              name="Pendente"
            />
            <Area
              type="monotone"
              dataKey="in_progress"
              stackId="1"
              stroke={COLORS.in_progress}
              fill={COLORS.in_progress}
              fillOpacity={0.3}
              name="Em Andamento"
            />
            <Area
              type="monotone"
              dataKey="completed"
              stackId="1"
              stroke={COLORS.completed}
              fill={COLORS.completed}
              fillOpacity={0.3}
              name="Concluído"
            />
            <Area
              type="monotone"
              dataKey="cancelled"
              stackId="1"
              stroke={COLORS.cancelled}
              fill={COLORS.cancelled}
              fillOpacity={0.3}
              name="Cancelado"
            />
            <Line
              type="monotone"
              dataKey="total"
              stroke={COLORS.total}
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 8 }}
              name="Total"
            />
          </ComposedChart>
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
