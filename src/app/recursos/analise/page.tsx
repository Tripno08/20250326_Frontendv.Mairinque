'use client';

import React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useRouter } from 'next/navigation';

export default function AnaliseResourcePage() {
  const router = useRouter();

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Análise de Dados
        </Typography>

        <Typography variant="body1" paragraph>
          O Innerview oferece ferramentas avançadas de análise de dados que transformam informações
          complexas em insights acionáveis, permitindo a tomada de decisões baseada em evidências.
        </Typography>

        <Typography variant="body1" paragraph>
          Nossos recursos de análise incluem:
        </Typography>

        <ul style={{ marginBottom: '1.5rem', paddingLeft: '1.5rem' }}>
          <li style={{ marginBottom: '0.5rem' }}>
            Algoritmos preditivos para identificação precoce de alunos em risco
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            Análise de tendências de desempenho ao longo do tempo
          </li>
          <li style={{ marginBottom: '0.5rem' }}>Comparação entre diferentes grupos e coortes</li>
          <li style={{ marginBottom: '0.5rem' }}>
            Correlação entre diferentes indicadores educacionais
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            Relatórios automatizados com visualizações intuitivas
          </li>
        </ul>

        <Typography variant="body1" paragraph>
          Com essas ferramentas, educadores podem identificar padrões, prever desafios e desenvolver
          estratégias proativas para melhorar o desempenho acadêmico e comportamental dos alunos.
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
