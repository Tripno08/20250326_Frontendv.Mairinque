import React from 'react';
import { Box, Typography, LinearProgress } from '@mui/material';
import { WidgetBase } from './WidgetBase';
import { AssessmentCoverageData } from '@/types/dashboard';

interface AssessmentCoverageWidgetProps {
  widget: any;
  data: AssessmentCoverageData;
  isLoading?: boolean;
  error?: Error | null;
}

export const AssessmentCoverageWidget: React.FC<AssessmentCoverageWidgetProps> = ({
  widget,
  data,
  isLoading,
  error,
}) => {
  const coverage = (data.assessed / data.total) * 100;

  return (
    <WidgetBase
      widget={widget}
      title="Cobertura de Avaliações"
      isLoading={isLoading}
      error={error}
    >
      <Box sx={{ height: '100%', width: '100%', p: 2 }}>
        <Box sx={{ mb: 2 }}>
          <Typography variant="h4" component="div" gutterBottom>
            {data.assessed}/{data.total}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Avaliações Realizadas
          </Typography>
        </Box>

        <Box sx={{ width: '100%' }}>
          <LinearProgress
            variant="determinate"
            value={coverage}
            sx={{
              height: 10,
              borderRadius: 5,
              backgroundColor: 'grey.200',
              '& .MuiLinearProgress-bar': {
                borderRadius: 5,
                backgroundColor: coverage >= 80 ? 'success.main' : coverage >= 60 ? 'warning.main' : 'error.main',
              },
            }}
          />
        </Box>

        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="body2" color="text.secondary">
            Cobertura
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {coverage.toFixed(1)}%
          </Typography>
        </Box>
      </Box>
    </WidgetBase>
  );
}; 