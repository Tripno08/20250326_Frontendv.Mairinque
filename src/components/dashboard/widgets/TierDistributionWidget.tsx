import React from 'react';
import { Box, Typography } from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { WidgetBase } from './WidgetBase';
import { TierDistributionData } from '@/types/dashboard';

interface TierDistributionWidgetProps {
  widget: any;
  data: TierDistributionData;
  isLoading?: boolean;
  error?: Error | null;
}

const COLORS = ['#4CAF50', '#FFC107', '#F44336'];

export const TierDistributionWidget: React.FC<TierDistributionWidgetProps> = ({
  widget,
  data,
  isLoading,
  error,
}) => {
  const chartData = [
    { name: 'Nível 1', value: data.tier1 },
    { name: 'Nível 2', value: data.tier2 },
    { name: 'Nível 3', value: data.tier3 },
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
    <WidgetBase widget={widget} title="Distribuição por Nível" isLoading={isLoading} error={error}>
      <Box sx={{ height: '100%', width: '100%', p: 2 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </Box>
    </WidgetBase>
  );
};
