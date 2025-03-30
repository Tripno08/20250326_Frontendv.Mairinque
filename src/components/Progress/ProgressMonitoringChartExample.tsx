import { Box, Typography } from '@mui/material';
import { ProgressMonitoringChart } from './ProgressMonitoringChart';
import { ProgressDataPoint, Benchmark, ProgressGoal } from '@/types/progress';

const exampleData: ProgressDataPoint[] = [
  {
    date: '2024-01-01',
    value: 65,
    intervention: 'Intervenção A',
    notes: 'Primeira avaliação',
  },
  {
    date: '2024-01-15',
    value: 68,
    intervention: 'Intervenção B',
    notes: 'Avaliação após intervenção',
  },
  {
    date: '2024-02-01',
    value: 72,
    intervention: 'Intervenção C',
    notes: 'Melhoria significativa',
  },
  {
    date: '2024-02-15',
    value: 75,
    notes: 'Avaliação regular',
  },
  {
    date: '2024-03-01',
    value: 78,
    intervention: 'Intervenção D',
    notes: 'Nova intervenção',
  },
];

const exampleBenchmarks: Benchmark[] = [
  {
    name: 'Benchmark 1',
    value: 70,
    color: '#4CAF50',
    description: 'Nível esperado para o primeiro trimestre',
  },
  {
    name: 'Benchmark 2',
    value: 80,
    color: '#2196F3',
    description: 'Nível esperado para o segundo trimestre',
  },
];

const exampleGoals: ProgressGoal[] = [
  {
    name: 'Meta Trimestral',
    targetValue: 85,
    deadline: '2024-03-31',
    color: '#FF9800',
    description: 'Meta para o final do trimestre',
  },
  {
    name: 'Meta Semestral',
    targetValue: 90,
    deadline: '2024-06-30',
    color: '#E91E63',
    description: 'Meta para o final do semestre',
  },
];

export const ProgressMonitoringChartExample: React.FC = () => {
  const handleInterventionClick = (intervention: string) => {
    console.log('Intervenção clicada:', intervention);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Monitoramento de Progresso
      </Typography>
      <Box sx={{ height: 500, width: '100%' }}>
        <ProgressMonitoringChart
          data={exampleData}
          benchmarks={exampleBenchmarks}
          goals={exampleGoals}
          onInterventionClick={handleInterventionClick}
          dateRange={{
            start: '2024-01-01',
            end: '2024-06-30',
          }}
        />
      </Box>
    </Box>
  );
}; 