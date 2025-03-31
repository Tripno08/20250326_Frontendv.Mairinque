import React from 'react';
import { Box, Typography } from '@mui/material';
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
import { WidgetBase } from './WidgetBase';
import { ProgressData, Benchmark, ProgressGoal } from '@/types/dashboard';

interface ProgressMonitoringWidgetProps {
  widget: any;
  data: ProgressData[];
  benchmarks: Benchmark[];
  goals: ProgressGoal[];
  isLoading?: boolean;
  error?: Error | null;
}

export const ProgressMonitoringWidget: React.FC<ProgressMonitoringWidgetProps> = ({
  widget,
  data,
  benchmarks,
  goals,
  isLoading,
  error,
}) => {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <Box
          sx={{
            backgroundColor: 'background.paper',
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 1,
            p: 1,
            boxShadow: 3,
          }}
        >
          <Typography variant="body2" gutterBottom>
            {new Date(label).toLocaleDateString()}
          </Typography>
          {payload.map((entry: any, index: number) => (
            <Typography key={index} variant="body2" color={entry.color}>
              {entry.name}: {entry.value}%
            </Typography>
          ))}
        </Box>
      );
    }
    return null;
  };

  return (
    <WidgetBase
      widget={widget}
      title="Monitoramento de Progresso"
      isLoading={isLoading}
      error={error}
    >
      <Box sx={{ height: '100%', width: '100%', p: 2 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tickFormatter={date => new Date(date).toLocaleDateString()} />
            <YAxis domain={[0, 100]} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />

            {/* Linha de progresso */}
            <Line
              type="monotone"
              dataKey="value"
              stroke="#8884d8"
              name="Progresso"
              dot={{ r: 4 }}
            />

            {/* Benchmarks */}
            {benchmarks.map((benchmark, index) => (
              <Line
                key={`benchmark-${index}`}
                type="monotone"
                dataKey={() => benchmark.value}
                stroke={benchmark.color}
                name={benchmark.name}
                strokeDasharray="5 5"
                dot={false}
              />
            ))}

            {/* Metas */}
            {goals.map((goal, index) => (
              <Line
                key={`goal-${index}`}
                type="monotone"
                dataKey={() => goal.targetValue}
                stroke={goal.color}
                name={goal.name}
                strokeDasharray="3 3"
                dot={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </WidgetBase>
  );
};
