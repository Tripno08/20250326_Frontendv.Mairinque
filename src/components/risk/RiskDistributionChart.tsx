import React, { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { Typography, Box, CircularProgress, Paper } from '@mui/material';
import { RiskDistributionData } from '@/types/risk-analysis';

interface RiskDistributionChartProps {
  data: RiskDistributionData | null;
  isLoading?: boolean;
  title?: string;
  height?: number;
  className?: string;
}

const RiskDistributionChart: React.FC<RiskDistributionChartProps> = ({
  data,
  isLoading = false,
  title = 'Distribuição de Níveis de Risco',
  height = 300,
  className,
}) => {
  const chartData = useMemo(() => {
    if (!data) return [];

    return [
      {
        name: 'Baixo',
        value: data.low,
        percentage: ((data.low / data.total) * 100).toFixed(1),
        color: '#4caf50',
      },
      {
        name: 'Moderado',
        value: data.moderate,
        percentage: ((data.moderate / data.total) * 100).toFixed(1),
        color: '#ff9800',
      },
      {
        name: 'Alto',
        value: data.high,
        percentage: ((data.high / data.total) * 100).toFixed(1),
        color: '#f44336',
      },
      {
        name: 'Severo',
        value: data.severe,
        percentage: ((data.severe / data.total) * 100).toFixed(1),
        color: '#9c27b0',
      },
    ];
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
          p: 2,
        }}
      >
        <CircularProgress size={40} />
      </Paper>
    );
  }

  if (!data) {
    return (
      <Paper
        elevation={2}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height,
          p: 2,
        }}
      >
        <Typography color="text.secondary">Dados não disponíveis</Typography>
      </Paper>
    );
  }

  return (
    <Paper elevation={2} sx={{ p: 2, height }} className={className || undefined}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <Box sx={{ width: '100%', height: height - 80 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 25,
            }}
            barSize={50}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip
              formatter={(value, name, props) => [
                `${value} estudantes (${props.payload.percentage}%)`,
                'Quantidade',
              ]}
              labelFormatter={label => `Nível de Risco: ${label}`}
            />
            <Legend verticalAlign="top" height={36} />
            <Bar dataKey="value" name="Estudantes" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Box>
      <Typography variant="body2" color="text.secondary" align="center">
        Total: {data.total} estudantes
      </Typography>
    </Paper>
  );
};

export default RiskDistributionChart;
