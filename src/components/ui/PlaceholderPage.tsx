'use client';

import React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useRouter } from 'next/navigation';

interface PlaceholderPageProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
}

export default function PlaceholderPage({ title, description, icon }: PlaceholderPageProps) {
  const router = useRouter();

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Paper
          elevation={3}
          sx={{
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            borderRadius: 2,
          }}
        >
          {icon && <Box sx={{ mb: 2, fontSize: 64 }}>{icon}</Box>}

          <Typography variant="h4" component="h1" gutterBottom color="primary">
            {title}
          </Typography>

          <Typography variant="body1" paragraph color="text.secondary">
            {description || 'Esta página está em desenvolvimento e estará disponível em breve.'}
          </Typography>

          <Typography variant="body2" paragraph color="text.secondary" sx={{ mb: 4 }}>
            A equipe de desenvolvimento está trabalhando para implementar todas as funcionalidades
            previstas nesta seção. Acompanhe as atualizações para ter acesso aos novos recursos.
          </Typography>

          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => router.push('/dashboard')}
          >
            Voltar para o Dashboard
          </Button>
        </Paper>
      </Box>
    </Container>
  );
}
