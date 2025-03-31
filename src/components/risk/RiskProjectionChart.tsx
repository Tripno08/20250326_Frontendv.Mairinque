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
  ReferenceLine,
} from 'recharts';
import { Typography, Box, CircularProgress, Paper } from '@mui/material';
import { RiskProjectionData } from '@/types/risk-analysis';

interface RiskProjectionChartProps {
  data: RiskProjectionData[];
  isLoading?: boolean;
  title?: string;
  height?: number;
}

const RiskProjectionChart: React.FC<RiskProjectionChartProps> = ({
  data,
  isLoading = false,
  title = 'Projeções de Risco Acadêmico',
  height = 300,
}) => {
  const chartData = useMemo(() => {
    // Organizando os dados para visualização
    return data.map(item => ({
      ...item,
      // Criamos uma propriedade para linhas tracejadas após o último registro real
      dottedProjected: !item.actual ? item.projected : undefined,
    }));
  }, [data]);

  // Encontrar o último registro com dados reais
  const lastActualIndex = useMemo(() => {
    const index = chartData.findIndex(item => !item.actual);
    return index !== -1 ? index : chartData.length;
  }, [chartData]);

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

  if (!data || data.length === 0) {
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
    <Paper elevation={2} sx={{ p: 2, height }}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <Box sx={{ width: '100%', height: height - 80 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="month" />
            <YAxis domain={[0, 'dataMax + 5']} />
            <Tooltip
              formatter={value => [`${value}%`, '']}
              labelFormatter={label => `Mês: ${label}`}
            />
            <Legend verticalAlign="top" height={36} />

            {/* Linha de referência que separa dados reais de projeções */}
            {lastActualIndex < chartData.length && chartData[lastActualIndex - 1] && (
              <ReferenceLine
                x={chartData[lastActualIndex - 1].month}
                stroke="#757575"
                strokeDasharray="3 3"
                label={{ value: 'Projeção inicia', position: 'top', fill: '#757575' }}
              />
            )}

            {/* Linha de meta/baseline */}
            <Line
              type="monotone"
              dataKey="baseline"
              stroke="#757575"
              strokeWidth={1}
              strokeDasharray="5 5"
              name="Meta"
              dot={false}
            />

            {/* Linha de dados reais */}
            <Line
              type="monotone"
              dataKey="actual"
              stroke="#1976d2"
              strokeWidth={3}
              name="Dados Reais"
              dot={{ r: 5, fill: '#1976d2' }}
              activeDot={{ r: 8 }}
            />

            {/* Linha de projeção sólida (até o último dado real) */}
            <Line
              type="monotone"
              dataKey="projected"
              stroke="#7e57c2"
              strokeWidth={2}
              name="Projeção"
              dot={{ r: 3, fill: '#7e57c2' }}
            />

            {/* Linha de projeção tracejada (após o último dado real) */}
            <Line
              type="monotone"
              dataKey="dottedProjected"
              stroke="#7e57c2"
              strokeWidth={2}
              strokeDasharray="5 5"
              name="Projeção Futura"
              dot={{ r: 3, fill: '#7e57c2' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>
      <Typography variant="body2" color="text.secondary" align="center">
        Projeção de estudantes em situação de risco nos próximos meses
      </Typography>
    </Paper>
  );
};

export default RiskProjectionChart;
