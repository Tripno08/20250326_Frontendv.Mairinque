'use client';

import React from 'react';
import PlaceholderPage from '@/components/ui/PlaceholderPage';
import ForwardToInboxIcon from '@mui/icons-material/ForwardToInbox';

export default function ReferralsPage() {
  return (
    <PlaceholderPage
      title="Encaminhamentos"
      description="Gerencie o processo de encaminhamentos dentro do sistema RTI/MTSS. Acompanhe solicitações, revisite decisões e monitore resultados."
      icon={<ForwardToInboxIcon fontSize="inherit" color="primary" />}
    />
  );
}
