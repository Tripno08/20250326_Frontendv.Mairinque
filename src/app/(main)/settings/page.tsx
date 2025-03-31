'use client';

import React from 'react';
import PlaceholderPage from '@/components/ui/PlaceholderPage';
import SettingsIcon from '@mui/icons-material/Settings';

export default function SettingsPage() {
  return (
    <PlaceholderPage
      title="Configurações do Sistema"
      description="Personalize a plataforma de acordo com as necessidades da sua instituição. Ajuste preferências, integre sistemas externos e gerencie permissões."
      icon={<SettingsIcon fontSize="inherit" color="primary" />}
    />
  );
}
