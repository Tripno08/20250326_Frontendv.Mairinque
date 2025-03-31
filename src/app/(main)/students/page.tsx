'use client';

import React from 'react';
import PlaceholderPage from '@/components/ui/PlaceholderPage';
import PeopleIcon from '@mui/icons-material/People';

export default function StudentsPage() {
  return (
    <PlaceholderPage
      title="Gestão de Alunos"
      description="Visualize, cadastre e gerencie os dados dos alunos. Acompanhe o progresso individual e realize intervenções personalizadas."
      icon={<PeopleIcon fontSize="inherit" color="primary" />}
    />
  );
}
