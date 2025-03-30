'use client';

import React from 'react';
import { Box, Typography, Container, Button } from '@mui/material';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  return (
    <Container maxWidth="xl">
      <Box sx={{ my: 4, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Innerview Escola
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom>
          Sistema de Gestão de Intervenções Educacionais
        </Typography>

        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={() => router.push('/intervencoes')}
          >
            Intervenções
          </Button>
          <Button
            variant="outlined"
            color="primary"
            size="large"
            onClick={() => router.push('/metas')}
          >
            Metas
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
