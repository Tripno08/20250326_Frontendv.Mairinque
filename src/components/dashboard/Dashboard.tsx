import React from 'react';
import { Box, Grid, Container, Typography } from '@mui/material';
import { TierDistributionChart } from './TierDistributionChart';
import { DomainSummary } from './DomainSummary';
import { AssessmentCoverage } from './AssessmentCoverage';
import { useDashboard } from '@/hooks/useDashboard';

export const Dashboard: React.FC = () => {
  const { data, isLoading, error } = useDashboard();

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Carregando dashboard...
        </Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" color="error" gutterBottom>
          Erro ao carregar dados
        </Typography>
        <Typography color="error">{error.message}</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard de Progresso
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TierDistributionChart
            data={data?.tierDistribution}
            isLoading={isLoading}
            error={error}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <DomainSummary data={data?.domainSummary} isLoading={isLoading} error={error} />
        </Grid>
        <Grid item xs={12}>
          <AssessmentCoverage data={data?.assessmentCoverage} isLoading={isLoading} error={error} />
        </Grid>
      </Grid>
    </Container>
  );
};
