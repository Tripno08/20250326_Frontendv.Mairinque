'use client';

import React from 'react';
import PlaceholderPage from '@/components/ui/PlaceholderPage';
import GroupsIcon from '@mui/icons-material/Groups';

export default function TeamsPage() {
  return (
    <PlaceholderPage
      title="Gestão de Equipes"
      description="Organize e gerencie equipes multidisciplinares. Atribua papéis, monitore atividades e facilite a colaboração entre profissionais."
      icon={<GroupsIcon fontSize="inherit" color="primary" />}
    />
  );
}
