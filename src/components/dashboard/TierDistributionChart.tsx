import React, { useRef, useEffect, useState } from 'react';
import { Box, CircularProgress, Typography, Paper } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, LabelList } from 'recharts';

interface TierDistributionData {
  tier1: number;
  tier2: number;
  tier3: number;
}

interface TierDistributionChartProps {
  data: TierDistributionData;
  isLoading?: boolean;
  error?: string;
  width?: number;
  height?: number;
}

interface ChartDimensions {
  width: number;
  height: number;
}

export const TierDistributionChart: React.FC<TierDistributionChartProps> = ({
  data,
  isLoading = false,
  error,
  width: propWidth,
  height: propHeight,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState<ChartDimensions>({
    width: propWidth || 800,
    height: propHeight || 600,
  });

  const chartData = [
    { name: 'Nível 1', value: data.tier1 },
    { name: 'Nível 2', value: data.tier2 },
    { name: 'Nível 3', value: data.tier3 },
  ];

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { clientWidth, clientHeight } = containerRef.current;
        setDimensions({
          width: propWidth || Math.max(clientWidth, 300),
          height: propHeight || Math.max(clientHeight, 300),
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);

    return () => window.removeEventListener('resize', updateDimensions);
  }, [propWidth, propHeight]);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={300}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={300}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Paper sx={{ p: 2, height: '100%' }}>
      <Typography variant="h6" gutterBottom>
        Distribuição por Nível
      </Typography>
      <Box
        ref={containerRef}
        height={dimensions.height}
        width={dimensions.width}
        role="img"
        aria-label="distribuição por nível"
        sx={{
          minWidth: '300px',
          minHeight: '300px',
          position: 'relative',
        }}
      >
        <BarChart
          width={dimensions.width}
          height={dimensions.height}
          data={chartData}
          style={{ position: 'absolute', top: 0, left: 0 }}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <XAxis dataKey="name" />
          <YAxis domain={[0, 100]} />
          <Tooltip
            formatter={(value: number) => [`${value}%`, 'Porcentagem']}
            labelFormatter={label => `Nível: ${label}`}
          />
          <Bar dataKey="value" fill="#1976d2" name="Porcentagem">
            <LabelList dataKey="value" position="top" formatter={(value: number) => `${value}%`} />
          </Bar>
        </BarChart>
      </Box>
    </Paper>
  );
};
