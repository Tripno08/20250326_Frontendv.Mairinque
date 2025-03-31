'use client';

import React from 'react';
import PlaceholderPage from '@/components/ui/PlaceholderPage';
import BarChartIcon from '@mui/icons-material/BarChart';

export default function ReportsPage() {
  return (
    <PlaceholderPage
      title="Relatórios e Análises"
      description="Gere relatórios personalizados, visualize tendências e obtenha insights sobre o desempenho dos alunos e a eficácia das intervenções."
      icon={<BarChartIcon fontSize="inherit" color="primary" />}
    />
  );
}
