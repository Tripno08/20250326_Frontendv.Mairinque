'use client';

import React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useRouter } from 'next/navigation';

export default function DashboardResourcePage() {
  const router = useRouter();

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Dashboard de Progresso
        </Typography>

        <Typography variant="body1" paragraph>
          Nosso dashboard de progresso oferece uma visão completa e intuitiva do desempenho dos
          alunos, permitindo que educadores e administradores tomem decisões baseadas em dados.
        </Typography>

        <Typography variant="body1" paragraph>
          Com visualizações interativas e personalizáveis, você pode:
        </Typography>

        <ul style={{ marginBottom: '1.5rem', paddingLeft: '1.5rem' }}>
          <li style={{ marginBottom: '0.5rem' }}>Monitorar o progresso individual e por grupo</li>
          <li style={{ marginBottom: '0.5rem' }}>
            Visualizar a distribuição de alunos por tier/nível
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            Acompanhar tendências de desempenho ao longo do tempo
          </li>
          <li style={{ marginBottom: '0.5rem' }}>Identificar áreas que requerem intervenção</li>
          <li style={{ marginBottom: '0.5rem' }}>
            Gerar relatórios detalhados para diferentes stakeholders
          </li>
        </ul>

        <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
          <Button variant="contained" color="primary" onClick={() => router.push('/login')}>
            Experimente Agora
          </Button>
          <Button variant="outlined" color="primary" onClick={() => router.push('/')}>
            Voltar para o Início
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
