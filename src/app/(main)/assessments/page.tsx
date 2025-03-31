'use client';

import React from 'react';
import PlaceholderPage from '@/components/ui/PlaceholderPage';
import AssessmentIcon from '@mui/icons-material/Assessment';

export default function AssessmentsPage() {
  return (
    <PlaceholderPage
      title="Avaliações e Diagnósticos"
      description="Aplique, gerencie e analise avaliações formativas e somativas. Identifique necessidades específicas para intervenções direcionadas."
      icon={<AssessmentIcon fontSize="inherit" color="primary" />}
    />
  );
}
