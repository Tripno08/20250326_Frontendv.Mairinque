'use client';

import React from 'react';
import PlaceholderPage from '@/components/ui/PlaceholderPage';
import ChatIcon from '@mui/icons-material/Chat';

export default function MessagesPage() {
  return (
    <PlaceholderPage
      title="Mensagens e Comunicação"
      description="Comunique-se com outros membros da equipe. Troque mensagens, compartilhe documentos e mantenha todos informados sobre o progresso dos alunos."
      icon={<ChatIcon fontSize="inherit" color="primary" />}
    />
  );
}
