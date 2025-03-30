import React from 'react';
import { Box, Typography } from '@mui/material';
import { CustomizableDashboard } from '@/components/dashboard/CustomizableDashboard';
import { TierDistributionChart } from '@/components/dashboard/TierDistributionChart';
import { DomainSummary } from '@/components/dashboard/DomainSummary';
import { AssessmentCoverage } from '@/components/dashboard/AssessmentCoverage';
import { ProgressMonitoringChart } from '@/components/Progress/ProgressMonitoringChart';
import { useDashboard } from '@/hooks/useDashboard';
import { DashboardWidget, DashboardLayout } from '@/types/dashboard';

// Dados mockados para exemplo
const mockData = {
  tierDistribution: {
    tier1: 60,
    tier2: 25,
    tier3: 15,
  },
  domainSummary: {
    reading: 75,
    math: 65,
    writing: 70,
  },
  assessmentCoverage: {
    total: 150,
    assessed: 120,
  },
  progressData: [
    { date: new Date('2024-01-01'), value: 75 },
    { date: new Date('2024-01-15'), value: 80 },
    { date: new Date('2024-02-01'), value: 85 },
  ],
};

// Layout padrão
const defaultLayout: DashboardLayout = {
  id: 'default',
  name: 'Layout Padrão',
  widgets: [
    {
      id: 'tier-distribution',
      type: 'tier-distribution',
      title: 'Distribuição por Nível',
      x: 0,
      y: 0,
      w: 6,
      h: 4,
    },
    {
      id: 'domain-summary',
      type: 'domain-summary',
      title: 'Desempenho por Domínio',
      x: 6,
      y: 0,
      w: 6,
      h: 4,
    },
    {
      id: 'assessment-coverage',
      type: 'assessment-coverage',
      title: 'Cobertura de Avaliações',
      x: 0,
      y: 4,
      w: 12,
      h: 4,
    },
    {
      id: 'progress-monitoring',
      type: 'progress-monitoring',
      title: 'Monitoramento de Progresso',
      x: 0,
      y: 8,
      w: 12,
      h: 6,
    },
  ],
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const DashboardExample: React.FC = () => {
  const { data, isLoading, error } = useDashboard();

  // Configuração dos widgets
  const widgets: DashboardWidget[] = [
    {
      id: 'tier-distribution',
      type: 'tier-distribution',
      title: 'Distribuição por Nível',
      component: (
        <TierDistributionChart
          data={mockData.tierDistribution}
          isLoading={isLoading}
          error={error}
        />
      ),
      defaultConfig: {
        w: 6,
        h: 4,
        minW: 4,
        minH: 3,
      },
    },
    {
      id: 'domain-summary',
      type: 'domain-summary',
      title: 'Desempenho por Domínio',
      component: (
        <DomainSummary
          data={mockData.domainSummary}
          isLoading={isLoading}
          error={error}
        />
      ),
      defaultConfig: {
        w: 6,
        h: 4,
        minW: 4,
        minH: 3,
      },
    },
    {
      id: 'assessment-coverage',
      type: 'assessment-coverage',
      title: 'Cobertura de Avaliações',
      component: (
        <AssessmentCoverage
          data={mockData.assessmentCoverage}
          isLoading={isLoading}
          error={error}
        />
      ),
      defaultConfig: {
        w: 12,
        h: 4,
        minW: 6,
        minH: 3,
      },
    },
    {
      id: 'progress-monitoring',
      type: 'progress-monitoring',
      title: 'Monitoramento de Progresso',
      component: (
        <ProgressMonitoringChart
          data={mockData.progressData}
          benchmarks={[
            { 
              name: 'Meta 1', 
              value: 80, 
              color: '#4CAF50',
              description: 'Meta de desempenho 1'
            },
            { 
              name: 'Meta 2', 
              value: 90, 
              color: '#2196F3',
              description: 'Meta de desempenho 2'
            }
          ]}
          goals={[
            { 
              name: 'Objetivo 1', 
              targetValue: 85, 
              deadline: new Date('2024-06-30'), 
              color: '#FF9800',
              description: 'Objetivo de progresso 1'
            },
            { 
              name: 'Objetivo 2', 
              targetValue: 95, 
              deadline: new Date('2024-12-31'), 
              color: '#9C27B0',
              description: 'Objetivo de progresso 2'
            }
          ]}
          isLoading={isLoading}
          error={error}
        />
      ),
      defaultConfig: {
        w: 12,
        h: 6,
        minW: 6,
        minH: 4,
      },
    },
  ];

  // Handlers
  const handleLayoutChange = (layout: DashboardLayout) => {
    console.log('Layout alterado:', layout);
  };

  const handleLayoutSave = (layout: DashboardLayout) => {
    console.log('Layout salvo:', layout);
    // Aqui você pode implementar a lógica para salvar o layout no backend
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard de Exemplo
      </Typography>
      <CustomizableDashboard
        widgets={widgets}
        defaultLayout={defaultLayout}
        onLayoutChange={handleLayoutChange}
        onLayoutSave={handleLayoutSave}
        isEditable={true}
        className="dashboard-example"
      />
    </Box>
  );
}; 