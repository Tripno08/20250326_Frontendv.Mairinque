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
  Button,
  Divider,
  IconButton,
} from '@mui/material';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { useScreeningAdministrations } from '../../hooks/useScreening';
import { ScreeningAdministration } from '../../types/screening';
import { DatePicker } from '@mui/x-date-pickers';
import GridContainer from '@/components/GridContainer';
import GridItem from '@/components/GridItem';

interface InstrumentScreeningHistoryPieChartProps {
  instrumentId: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export const InstrumentScreeningHistoryPieChart: React.FC<
  InstrumentScreeningHistoryPieChartProps
> = ({ instrumentId }) => {
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

  const chartData = administrations.reduce((acc: any[], administration) => {
    const existingStatus = acc.find(item => item.name === administration.status);
    if (existingStatus) {
      existingStatus.value += 1;
    } else {
      acc.push({
        name: administration.status,
        value: 1,
      });
    }
    return acc;
  }, []);

  return (
    <Box>
      <Card sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Histórico de Triagem - Gráfico de Pizza
        </Typography>
        <GridContainer spacing={2} sx={{ mb: 3 }}>
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
          <GridItem xs={12} sm={6} md={4}>
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
          </GridItem>
        </GridContainer>
      </Card>

      <Paper sx={{ p: 2, height: 400 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={150}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </Paper>
    </Box>
  );
};
