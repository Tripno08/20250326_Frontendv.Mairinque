'use client';

import React from 'react';
import PlaceholderPage from '@/components/ui/PlaceholderPage';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

export default function ProgressPage() {
  return (
    <PlaceholderPage
      title="Monitoramento de Progresso"
      description="Acompanhe o desenvolvimento dos alunos ao longo do tempo. Visualize tendências, identifique necessidades e ajuste intervenções conforme necessário."
      icon={<TrendingUpIcon fontSize="inherit" color="primary" />}
    />
  );
}
