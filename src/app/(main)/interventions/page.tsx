'use client';

import React from 'react';
import PlaceholderPage from '@/components/ui/PlaceholderPage';
import AssignmentIcon from '@mui/icons-material/Assignment';

export default function InterventionsPage() {
  return (
    <PlaceholderPage
      title="Gestão de Intervenções"
      description="Crie, acompanhe e avalie intervenções educacionais com base no modelo RTI/MTSS. Organize ações por tiers e monitore resultados."
      icon={<AssignmentIcon fontSize="inherit" color="primary" />}
    />
  );
}
