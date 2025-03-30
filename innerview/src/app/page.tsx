import { Button, Container, Typography, Box, Card, CardContent, Grid } from '@mui/material';

export default function Home() {
  return (
    <Container maxWidth="lg" className="mt-8">
      <Box sx={{ my: 4 }} className="text-center">
        <Typography variant="h3" component="h1" gutterBottom className="font-bold mb-8">
          Bem-vindo ao Innerview Escola
        </Typography>

        <Typography variant="h5" component="h2" gutterBottom className="mb-6">
          Plataforma de Gestão e Monitoramento de Intervenções Educacionais
        </Typography>

        <Grid container spacing={4} className="mt-8">
          <Grid item xs={12} md={4}>
            <Card className="h-full hover:shadow-lg transition-shadow">
              <CardContent>
                <Typography variant="h5" component="h3" className="mb-4 font-bold">
                  Dashboard
                </Typography>
                <Typography variant="body1" className="mb-4">
                  Visualize dados e métricas importantes para monitorar o progresso dos alunos.
                </Typography>
                <Button variant="contained" color="primary" href="/dashboard">
                  Acessar Dashboard
                </Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card className="h-full hover:shadow-lg transition-shadow">
              <CardContent>
                <Typography variant="h5" component="h3" className="mb-4 font-bold">
                  Intervenções
                </Typography>
                <Typography variant="body1" className="mb-4">
                  Explore nossa biblioteca de intervenções baseadas em evidências para apoiar os alunos.
                </Typography>
                <Button variant="contained" color="primary" href="/intervencoes">
                  Ver Intervenções
                </Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card className="h-full hover:shadow-lg transition-shadow">
              <CardContent>
                <Typography variant="h5" component="h3" className="mb-4 font-bold">
                  Avaliações
                </Typography>
                <Typography variant="body1" className="mb-4">
                  Gerencie avaliações e acompanhe o desempenho dos estudantes em diferentes domínios.
                </Typography>
                <Button variant="contained" color="primary" href="/avaliacoes">
                  Gerenciar Avaliações
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}
