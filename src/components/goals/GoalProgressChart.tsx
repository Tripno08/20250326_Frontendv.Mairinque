'use client';

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
  ReferenceLine
} from 'recharts';
import { Box, Paper, Typography, useTheme } from '@mui/material';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { GoalProgressChartProps } from '@/types/smart-goals';

export const GoalProgressChart: React.FC<GoalProgressChartProps> = ({
  goal,
  width = 600,
  height = 300
}) => {
  const theme = useTheme();

  // Preparar dados para o gráfico
  const chartData = useMemo(() => {
    const { progressHistory } = goal.measurement;

    // Ordenar por data
    const sortedHistory = [...progressHistory].sort((a, b) => {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });

    // Mapear para formato do gráfico
    return sortedHistory.map(item => ({
      date: format(new Date(item.date), 'dd/MM/yyyy', { locale: ptBR }),
      valor: item.value,
      notes: item.notes,
      timestamp: new Date(item.date).getTime()
    }));
  }, [goal.measurement.progressHistory]);

  // Valores para linhas de referência
  const { initialValue, targetValue } = goal.measurement;

  // Verificar se há dados para renderizar
  if (chartData.length === 0) {
    return (
      <Paper
        sx={{
          p: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height,
          width: '100%',
          maxWidth: width
        }}
      >
        <Typography variant="body1" color="text.secondary">
          Ainda não há dados de progresso registrados.
        </Typography>
      </Paper>
    );
  }

  // Determinar valores mínimo e máximo para o eixo Y
  const minValue = Math.min(
    initialValue,
    targetValue,
    ...chartData.map(item => item.valor)
  );
  const maxValue = Math.max(
    initialValue,
    targetValue,
    ...chartData.map(item => item.valor)
  );

  // Adicionar margem ao eixo Y
  const yAxisMin = Math.max(0, minValue - (maxValue - minValue) * 0.1);
  const yAxisMax = maxValue + (maxValue - minValue) * 0.1;

  // Customização do tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <Box
          sx={{
            bgcolor: 'background.paper',
            p: 1.5,
            border: 1,
            borderColor: 'divider',
            borderRadius: 1,
            boxShadow: 1,
            maxWidth: 250
          }}
        >
          <Typography variant="subtitle2">{label}</Typography>
          <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
            <Box
              component="span"
              sx={{
                display: 'inline-block',
                width: 10,
                height: 10,
                backgroundColor: theme.palette.primary.main,
                mr: 1,
                borderRadius: '50%'
              }}
            />
            Valor: {data.valor} {goal.measurement.unit}
          </Typography>

          {data.notes && (
            <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary', fontSize: '0.8rem' }}>
              {data.notes}
            </Typography>
          )}
        </Box>
      );
    }

    return null;
  };

  return (
    <Paper sx={{ p: 3, width: '100%', maxWidth: width }}>
      <Typography variant="h6" component="h3" gutterBottom>
        Progresso ao Longo do Tempo
      </Typography>

      <Box sx={{ width: '100%', height }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 30,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />

            <XAxis
              dataKey="date"
              stroke={theme.palette.text.secondary}
              tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
              tickMargin={10}
            />

            <YAxis
              domain={[yAxisMin, yAxisMax]}
              stroke={theme.palette.text.secondary}
              tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
              tickMargin={10}
              label={{
                value: goal.measurement.unit,
                angle: -90,
                position: 'insideLeft',
                style: {
                  textAnchor: 'middle',
                  fill: theme.palette.text.secondary,
                  fontSize: 12
                }
              }}
            />

            <Tooltip content={<CustomTooltip />} />

            <Legend wrapperStyle={{ paddingTop: 10 }} />

            {/* Linha de valor inicial */}
            <ReferenceLine
              y={initialValue}
              stroke={theme.palette.grey[500]}
              strokeDasharray="3 3"
              label={{
                value: `Inicial: ${initialValue}`,
                position: 'insideBottomRight',
                style: { fill: theme.palette.grey[600], fontSize: 11 }
              }}
            />

            {/* Linha de valor alvo */}
            <ReferenceLine
              y={targetValue}
              stroke={theme.palette.success.main}
              strokeDasharray="3 3"
              label={{
                value: `Alvo: ${targetValue}`,
                position: 'insideTopRight',
                style: { fill: theme.palette.success.main, fontSize: 11 }
              }}
            />

            <Line
              type="monotone"
              dataKey="valor"
              name="Valor"
              stroke={theme.palette.primary.main}
              activeDot={{ r: 6 }}
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
};
