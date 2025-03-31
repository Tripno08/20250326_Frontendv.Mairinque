'use client';

import React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useRouter } from 'next/navigation';

export default function IntervencoesResourcePage() {
  const router = useRouter();

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Gerenciamento de Intervenções
        </Typography>

        <Typography variant="body1" paragraph>
          Nossa plataforma oferece um sistema completo para criar, implementar e monitorar
          intervenções educacionais no modelo RTI/MTSS, garantindo que cada aluno receba o suporte
          adequado.
        </Typography>

        <Typography variant="body1" paragraph>
          Principais funcionalidades:
        </Typography>

        <ul style={{ marginBottom: '1.5rem', paddingLeft: '1.5rem' }}>
          <li style={{ marginBottom: '0.5rem' }}>
            Biblioteca de intervenções baseadas em evidências
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            Ferramentas de planejamento para cada nível de intervenção
          </li>
          <li style={{ marginBottom: '0.5rem' }}>Monitoramento de fidelidade de implementação</li>
          <li style={{ marginBottom: '0.5rem' }}>Integração entre equipes multidisciplinares</li>
          <li style={{ marginBottom: '0.5rem' }}>
            Acompanhamento de progresso com indicadores personalizáveis
          </li>
        </ul>

        <Typography variant="body1" paragraph>
          Com o sistema de gerenciamento de intervenções do Innerview, as escolas podem facilmente
          documentar, implementar e avaliar a eficácia das intervenções em todos os tiers.
        </Typography>

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
