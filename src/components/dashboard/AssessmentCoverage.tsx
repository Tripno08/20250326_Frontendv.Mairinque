import React from 'react';
import { Box, CircularProgress, Typography, Paper, LinearProgress } from '@mui/material';

interface AssessmentCoverageData {
  total: number;
  assessed: number;
}

interface AssessmentCoverageProps {
  data: AssessmentCoverageData;
  isLoading?: boolean;
  error?: string;
}

export const AssessmentCoverage: React.FC<AssessmentCoverageProps> = ({
  data,
  isLoading = false,
  error,
}) => {
  const percentage = data.total > 0 ? (data.assessed / data.total) * 100 : 0;

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
        Cobertura de Avaliações
      </Typography>
      <Box>
        <Box display="flex" justifyContent="space-between" mb={1}>
          <Typography variant="body2" color="text.secondary">
            Progresso
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {percentage.toFixed(1)}%
          </Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={percentage}
          sx={{ height: 10, borderRadius: 5 }}
          role="progressbar"
          aria-label="cobertura de avaliações"
          aria-valuenow={percentage}
          aria-valuemin={0}
          aria-valuemax={100}
        />
        <Box display="flex" justifyContent="space-between" mt={2}>
          <Box>
            <Typography variant="h4" color="primary" data-testid="assessed-value">
              {data.assessed}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Avaliados
            </Typography>
          </Box>
          <Box>
            <Typography variant="h4" color="text.secondary" data-testid="total-value">
              {data.total}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total
            </Typography>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};
