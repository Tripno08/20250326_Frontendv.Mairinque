import React from 'react';
import { Box } from '@mui/material';
import { CustomizableDashboard } from './CustomizableDashboard';
import { TierDistributionChart } from './TierDistributionChart';
import { DomainSummary } from './DomainSummary';
import { AssessmentCoverage } from './AssessmentCoverage';
import { ProgressMonitoringChart } from '../Progress/ProgressMonitoringChart';
import { useDashboard } from '@/hooks/useDashboard';
import { DashboardWidget } from '@/types/dashboard';

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

const defaultLayout = {
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

  const widgets: DashboardWidget[] = [
    {
      id: 'tier-distribution',
      type: 'tier-distribution',
      title: 'Distribuição por Nível',
      component: (
        <TierDistributionChart
          data={data?.tierDistribution || mockData.tierDistribution}
          isLoading={isLoading}
          error={error}
        />
      ),
      defaultConfig: {
        minW: 4,
        minH: 3,
        maxW: 8,
        maxH: 6,
      },
    },
    {
      id: 'domain-summary',
      type: 'domain-summary',
      title: 'Desempenho por Domínio',
      component: (
        <DomainSummary
          data={data?.domainSummary || mockData.domainSummary}
          isLoading={isLoading}
          error={error}
        />
      ),
      defaultConfig: {
        minW: 4,
        minH: 3,
        maxW: 8,
        maxH: 6,
      },
    },
    {
      id: 'assessment-coverage',
      type: 'assessment-coverage',
      title: 'Cobertura de Avaliações',
      component: (
        <AssessmentCoverage
          data={data?.assessmentCoverage || mockData.assessmentCoverage}
          isLoading={isLoading}
          error={error}
        />
      ),
      defaultConfig: {
        minW: 6,
        minH: 3,
        maxW: 12,
        maxH: 6,
      },
    },
    {
      id: 'progress-monitoring',
      type: 'progress-monitoring',
      title: 'Monitoramento de Progresso',
      component: (
        <ProgressMonitoringChart
          data={data?.progressData || mockData.progressData}
          benchmarks={[
            {
              name: 'Meta',
              value: 90,
              color: '#4CAF50',
              description: 'Meta de desempenho esperada',
            },
            {
              name: 'Média',
              value: 75,
              color: '#FFC107',
              description: 'Média de desempenho atual',
            },
          ]}
          goals={[
            {
              name: 'Meta Anual',
              targetValue: 95,
              deadline: new Date('2024-12-31'),
              color: '#2196F3',
              description: 'Meta de desempenho para o final do ano',
            },
          ]}
        />
      ),
      defaultConfig: {
        minW: 6,
        minH: 4,
        maxW: 12,
        maxH: 8,
      },
    },
  ];

  const handleLayoutChange = (layout: any) => {
    console.log('Layout alterado:', layout);
  };

  const handleLayoutSave = (layout: any) => {
    console.log('Layout salvo:', layout);
  };

  return (
    <Box sx={{ p: 3 }}>
      <CustomizableDashboard
        widgets={widgets}
        defaultLayout={defaultLayout}
        onLayoutChange={handleLayoutChange}
        onLayoutSave={handleLayoutSave}
        isEditable={true}
      />
    </Box>
  );
};
