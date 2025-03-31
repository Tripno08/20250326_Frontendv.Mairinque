'use client';

import React from 'react';
import PlaceholderPage from '@/components/ui/PlaceholderPage';
import FlagIcon from '@mui/icons-material/Flag';

export default function GoalsPage() {
  return (
    <PlaceholderPage
      title="Metas SMART"
      description="Defina, acompanhe e gerencie metas específicas, mensuráveis, atingíveis, relevantes e temporais para alunos e programas."
      icon={<FlagIcon fontSize="inherit" color="primary" />}
    />
  );
}
