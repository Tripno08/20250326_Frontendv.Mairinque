import React from 'react';
import { Box, Typography, LinearProgress } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { WidgetBase } from './WidgetBase';
import { DomainSummaryData } from '@/types/dashboard';

interface DomainSummaryWidgetProps {
  widget: any;
  data: DomainSummaryData;
  isLoading?: boolean;
  error?: Error | null;
}

const COLORS = ['#2196F3', '#4CAF50', '#FFC107'];

export const DomainSummaryWidget: React.FC<DomainSummaryWidgetProps> = ({
  widget,
  data,
  isLoading,
  error,
}) => {
  const chartData = [
    { name: 'Leitura', value: data.reading },
    { name: 'Matemática', value: data.math },
    { name: 'Escrita', value: data.writing },
  ];

  const CustomTooltip = ({ active, payload }: any) => {
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
          <Typography variant="body2">
            {payload[0].name}: {payload[0].value}%
          </Typography>
        </Box>
      );
    }
    return null;
  };

  return (
    <WidgetBase
      widget={widget}
      title="Desempenho por Domínio"
      isLoading={isLoading}
      error={error}
    >
      <Box sx={{ height: '100%', width: '100%', p: 2 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis domain={[0, 100]} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" fill="#8884d8">
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </WidgetBase>
  );
}; 