import React, { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  ComposedChart
} from 'recharts';
import { Typography, Box, CircularProgress, Paper } from '@mui/material';
import { RiskTrendData } from '@/types/risk-analysis';

interface RiskTrendChartProps {
  data: RiskTrendData[];
  isLoading?: boolean;
  title?: string;
  height?: number;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('pt-BR', { month: 'short', year: '2-digit' }).format(date);
};

const RiskTrendChart: React.FC<RiskTrendChartProps> = ({
  data,
  isLoading = false,
  title = 'Tendências de Risco Acadêmico',
  height = 300,
}) => {
  const formattedData = useMemo(() => {
    return data.map(item => ({
      ...item,
      formattedDate: formatDate(item.date)
    }));
  }, [data]);

  if (isLoading) {
    return (
      <Paper
        elevation={2}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height,
          p: 2
        }}
      >
        <CircularProgress size={40} />
      </Paper>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Paper
        elevation={2}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height,
          p: 2
        }}
      >
        <Typography color="text.secondary">Dados não disponíveis</Typography>
      </Paper>
    );
  }

  return (
    <Paper elevation={2} sx={{ p: 2, height }}>
      <Typography variant="h6" gutterBottom>{title}</Typography>
      <Box sx={{ width: '100%', height: height - 80 }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={formattedData}
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="formattedDate" />
            <YAxis />
            <Tooltip
              formatter={(value) => [`${value}%`, '']}
              labelFormatter={(label) => `Período: ${label}`}
            />
            <Legend verticalAlign="top" height={36} />
            <Area
              type="monotone"
              dataKey="severeRisk"
              stackId="1"
              stroke="#9c27b0"
              fill="#9c27b0"
              name="Risco Severo"
            />
            <Area
              type="monotone"
              dataKey="highRisk"
              stackId="1"
              stroke="#f44336"
              fill="#f44336"
              name="Risco Alto"
            />
            <Area
              type="monotone"
              dataKey="moderateRisk"
              stackId="1"
              stroke="#ff9800"
              fill="#ff9800"
              name="Risco Moderado"
            />
            <Area
              type="monotone"
              dataKey="lowRisk"
              stackId="1"
              stroke="#4caf50"
              fill="#4caf50"
              name="Risco Baixo"
            />
            <Line
              type="monotone"
              dataKey="lowRisk"
              stroke="#00796b"
              strokeWidth={2}
              dot={{ r: 4 }}
              name="Risco Baixo (linha)"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </Box>
      <Typography variant="body2" color="text.secondary" align="center">
        Distribuição de estudantes por nível de risco ao longo do tempo
      </Typography>
    </Paper>
  );
};

export default RiskTrendChart;
