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
  Pagination,
  Card,
} from '@mui/material';
import {
  ResponsiveContainer,
  ScatterChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Scatter,
} from 'recharts';
import { useScreeningAdministrations } from '../../hooks/useScreening';
import { ScreeningAdministration } from '../../types/screening';
import GridContainer from '@/components/GridContainer';
import GridItem from '@/components/GridItem';
import MenuItemWrapper from '@/components/MenuItemWrapper';
import { DatePicker } from '@mui/x-date-pickers';

interface InstrumentScreeningHistoryScatterChartProps {
  instrumentId: string;
}

export const InstrumentScreeningHistoryScatterChart: React.FC<
  InstrumentScreeningHistoryScatterChartProps
> = ({ instrumentId }) => {
  const [filters, setFilters] = useState<{
    status?: ScreeningAdministration['status'];
    startDate?: Date;
    endDate?: Date;
  }>({});
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

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

  const totalPages = Math.ceil(administrations.length / itemsPerPage);
  const paginatedData = administrations.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const chartData = paginatedData.map(administration => ({
    date: new Date(administration.startDate).getTime(),
    responses: administration.responses.length,
    status: administration.status,
  }));

  return (
    <Box>
      <Card sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Gráfico de Dispersão de Rastreio
        </Typography>

        <GridContainer spacing={2} sx={{ mb: 3 }}>
          <GridItem xs={12} sm={6} md={4}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={filters.status || ''}
                label="Status"
                onChange={e => handleFilterChange('status', e.target.value)}
              >
                <MenuItemWrapper value="">Todos</MenuItemWrapper>
                <MenuItemWrapper value="pending">Pendente</MenuItemWrapper>
                <MenuItemWrapper value="in_progress">Em Andamento</MenuItemWrapper>
                <MenuItemWrapper value="completed">Concluído</MenuItemWrapper>
                <MenuItemWrapper value="cancelled">Cancelado</MenuItemWrapper>
              </Select>
            </FormControl>
          </GridItem>

          <GridItem xs={12} sm={6} md={4}>
            <DatePicker
              label="Data Inicial"
              value={filters.startDate}
              onChange={newValue => handleFilterChange('startDate', newValue)}
              format="dd/MM/yyyy"
              slotProps={{
                textField: {
                  fullWidth: true,
                  variant: 'outlined',
                },
              }}
            />
          </GridItem>

          <GridItem xs={12} sm={6} md={4}>
            <DatePicker
              label="Data Final"
              value={filters.endDate}
              onChange={newValue => handleFilterChange('endDate', newValue)}
              format="dd/MM/yyyy"
              slotProps={{
                textField: {
                  fullWidth: true,
                  variant: 'outlined',
                },
              }}
            />
          </GridItem>
        </GridContainer>
      </Card>

      <Paper sx={{ p: 2, height: 400 }}>
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              type="number"
              domain={['auto', 'auto']}
              tickFormatter={value => new Date(value).toLocaleDateString()}
            />
            <YAxis dataKey="responses" />
            <Tooltip
              formatter={(value: number) => [value, 'Respostas']}
              labelFormatter={(value: number) => new Date(value).toLocaleDateString()}
            />
            <Legend />
            <Scatter name="Respostas" data={chartData} fill="#8884d8" />
          </ScatterChart>
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
