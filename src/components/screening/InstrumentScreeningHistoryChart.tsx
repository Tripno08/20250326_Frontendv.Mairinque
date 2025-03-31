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
  Card,
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useScreeningAdministrations } from '../../hooks/useScreening';
import { ScreeningAdministration } from '../../types/screening';
import GridContainer from '@/components/GridContainer';
import GridItem from '@/components/GridItem';
import MenuItemWrapper from '@/components/MenuItemWrapper';
import { DatePicker } from '@mui/x-date-pickers';

interface InstrumentScreeningHistoryChartProps {
  instrumentId: string;
}

export const InstrumentScreeningHistoryChart: React.FC<InstrumentScreeningHistoryChartProps> = ({
  instrumentId,
}) => {
  const [filters, setFilters] = useState<{
    status?: ScreeningAdministration['status'];
    startDate?: Date;
    endDate?: Date;
  }>({});

  const { administrations, loading, error } = useScreeningAdministrations({
    instrumentId,
    ...filters,
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

  const chartData = administrations.map(administration => ({
    date: new Date(administration.startDate).toLocaleDateString(),
    status: administration.status,
    responses: administration.responses.length,
  }));

  return (
    <Box>
      <Card sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Histórico de Administrações
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
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="responses" stroke="#8884d8" name="Respostas" />
          </LineChart>
        </ResponsiveContainer>
      </Paper>
    </Box>
  );
};
