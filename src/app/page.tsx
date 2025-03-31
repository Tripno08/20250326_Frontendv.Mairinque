'use client';

import React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CardActions from '@mui/material/CardActions';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  const handleStartNow = () => {
    router.push('/login');
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Bem-vindo ao Innerview Escola
        </Typography>

        <Typography variant="h5" component="h2" gutterBottom>
          Plataforma educacional avançada para suporte ao framework RTI/MTSS
        </Typography>

        <Typography variant="body1" paragraph>
          O Innerview é uma plataforma educacional moderna projetada para apoiar instituições na
          implementação eficaz do framework RTI/MTSS (Response to Intervention/Multi-Tiered System
          of Supports).
        </Typography>

        <Button
          variant="contained"
          color="primary"
          size="large"
          sx={{ mt: 2 }}
          onClick={handleStartNow}
        >
          Iniciar Agora
        </Button>
      </Box>

      <Box sx={{ my: 6 }}>
        <Typography variant="h4" component="h2" gutterBottom>
          Principais Funcionalidades
        </Typography>

        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 2,
            mt: 2,
          }}
        >
          <Box sx={{ width: { xs: '100%', sm: '48%', md: '32%' } }}>
            <Card sx={{ height: '100%' }}>
              <CardMedia
                component="img"
                height="140"
                image="/placeholder.jpg"
                alt="Dashboard de progresso"
              />
              <CardContent>
                <Typography variant="h6" component="h3" gutterBottom>
                  Dashboard de Progresso
                </Typography>
                <Typography variant="body2">
                  Visualize dados educacionais em dashboards interativos e personalizáveis,
                  permitindo monitoramento eficaz do progresso dos alunos.
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  color="primary"
                  onClick={() => router.push('/recursos/dashboard')}
                >
                  Saiba mais
                </Button>
              </CardActions>
            </Card>
          </Box>

          <Box sx={{ width: { xs: '100%', sm: '48%', md: '32%' } }}>
            <Card sx={{ height: '100%' }}>
              <CardMedia
                component="img"
                height="140"
                image="/placeholder.jpg"
                alt="Gerenciamento de Intervenções"
              />
              <CardContent>
                <Typography variant="h6" component="h3" gutterBottom>
                  Gerenciamento de Intervenções
                </Typography>
                <Typography variant="body2">
                  Crie, acompanhe e avalie intervenções educacionais com ferramentas integradas para
                  cada nível do sistema MTSS.
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  color="primary"
                  onClick={() => router.push('/recursos/intervencoes')}
                >
                  Saiba mais
                </Button>
              </CardActions>
            </Card>
          </Box>

          <Box sx={{ width: { xs: '100%', sm: '48%', md: '32%' } }}>
            <Card sx={{ height: '100%' }}>
              <CardMedia
                component="img"
                height="140"
                image="/placeholder.jpg"
                alt="Análise de Dados"
              />
              <CardContent>
                <Typography variant="h6" component="h3" gutterBottom>
                  Análise de Dados
                </Typography>
                <Typography variant="body2">
                  Utilize análises preditivas avançadas para identificar precocemente alunos em
                  risco e otimizar as estratégias de intervenção.
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  color="primary"
                  onClick={() => router.push('/recursos/analise')}
                >
                  Saiba mais
                </Button>
              </CardActions>
            </Card>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}
