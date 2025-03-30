import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  Chip,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  Timeline as TimelineIcon,
  TrendingUp as TrendingUpIcon,
  Warning as WarningIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { useScreeningResults } from '../../hooks/useScreening';
import {
  ScreeningResult,
  ScreeningResultsDashboardProps,
  ScreeningTier
} from '../../types/screening';

const getTierColor = (tier: ScreeningTier) => {
  switch (tier) {
    case 'universal':
      return 'success';
    case 'selective':
      return 'warning';
    case 'intensive':
      return 'error';
    default:
      return 'default';
  }
};

const getTierLabel = (tier: ScreeningTier) => {
  switch (tier) {
    case 'universal':
      return 'Universal';
    case 'selective':
      return 'Seletivo';
    case 'intensive':
      return 'Intensivo';
    default:
      return tier;
  }
};

export const ScreeningResultsDashboard: React.FC<ScreeningResultsDashboardProps> = ({
  studentId,
  period
}) => {
  const { results, isLoading, error, refresh } = useScreeningResults(studentId, period);
  const [selectedResult, setSelectedResult] = useState<ScreeningResult | null>(null);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {error.message}
      </Alert>
    );
  }

  const latestResult = results[0];
  const previousResult = results[1];

  const calculateProgress = (current: number, previous: number) => {
    if (!previous) return 0;
    return ((current - previous) / previous) * 100;
  };

  const renderResultCard = (result: ScreeningResult) => (
    <Card
      key={result.id}
      sx={{
        height: '100%',
        cursor: 'pointer',
        '&:hover': {
          boxShadow: 6
        }
      }}
      onClick={() => setSelectedResult(result)}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Typography variant="h6" component="h2">
            {result.instrumentId}
          </Typography>
          <Chip
            label={getTierLabel(result.tier)}
            color={getTierColor(result.tier)}
            size="small"
          />
        </Box>

        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Pontuação: {result.score}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Percentil: {result.percentile}
          </Typography>
        </Box>

        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Data: {new Date(result.completedAt).toLocaleDateString()}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );

  const renderResultDetails = () => (
    <Dialog
      open={!!selectedResult}
      onClose={() => setSelectedResult(null)}
      maxWidth="md"
      fullWidth
    >
      {selectedResult && (
        <>
          <DialogTitle>
            Detalhes do Resultado
          </DialogTitle>
          <DialogContent>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Informações Gerais
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Instrumento
                  </Typography>
                  <Typography variant="body1">
                    {selectedResult.instrumentId}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Data
                  </Typography>
                  <Typography variant="body1">
                    {new Date(selectedResult.completedAt).toLocaleDateString()}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Pontuação
                  </Typography>
                  <Typography variant="body1">
                    {selectedResult.score}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Percentil
                  </Typography>
                  <Typography variant="body1">
                    {selectedResult.percentile}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">
                    Tier
                  </Typography>
                  <Chip
                    label={getTierLabel(selectedResult.tier)}
                    color={getTierColor(selectedResult.tier)}
                    size="small"
                    sx={{ mt: 1 }}
                  />
                </Grid>
              </Grid>
            </Box>

            <Box>
              <Typography variant="h6" gutterBottom>
                Recomendações
              </Typography>
              <ul>
                {selectedResult.recommendations.map((rec, index) => (
                  <li key={index}>
                    <Typography variant="body2">{rec}</Typography>
                  </li>
                ))}
              </ul>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSelectedResult(null)}>Fechar</Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5">
          Resultados de Rastreio
        </Typography>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Período</InputLabel>
          <Select
            value={timeRange}
            label="Período"
            onChange={(e) => setTimeRange(e.target.value as 'week' | 'month' | 'year')}
          >
            <MenuItem value="week">Última Semana</MenuItem>
            <MenuItem value="month">Último Mês</MenuItem>
            <MenuItem value="year">Último Ano</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {latestResult && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Último Resultado
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Pontuação Atual
                </Typography>
                <Typography variant="h4">
                  {latestResult.score}
                </Typography>
                <Chip
                  label={getTierLabel(latestResult.tier)}
                  color={getTierColor(latestResult.tier)}
                  size="small"
                  sx={{ mt: 1 }}
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Progresso
                </Typography>
                {previousResult && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TrendingUpIcon
                      color={calculateProgress(latestResult.score, previousResult.score) >= 0 ? 'success' : 'error'}
                    />
                    <Typography variant="body1">
                      {Math.abs(calculateProgress(latestResult.score, previousResult.score)).toFixed(1)}%
                    </Typography>
                  </Box>
                )}
                <LinearProgress
                  variant="determinate"
                  value={latestResult.percentile}
                  sx={{ mt: 1 }}
                />
              </Box>
            </Grid>
          </Grid>
        </Paper>
      )}

      <Typography variant="h6" gutterBottom>
        Histórico de Resultados
      </Typography>
      <Grid container spacing={3}>
        {results.map(result => (
          <Grid item xs={12} sm={6} md={4} key={result.id}>
            {renderResultCard(result)}
          </Grid>
        ))}
      </Grid>

      {renderResultDetails()}
    </Box>
  );
};
