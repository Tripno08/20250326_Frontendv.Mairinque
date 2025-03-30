import { Box, Typography } from '@mui/material';
import { PyramidVisualization } from './PyramidVisualization';
import { PyramidData } from '@/types/rti';

const exampleData: PyramidData = {
  totalStudents: 1000,
  levels: [
    {
      id: 'tier1',
      name: 'Tier 1 - Instrução Universal',
      description: 'Instrução de alta qualidade para todos os alunos',
      color: '#4CAF50',
      percentage: 80,
      students: 800,
      interventions: [
        'Instrução diferenciada',
        'Monitoramento contínuo',
        'Feedback imediato',
      ],
    },
    {
      id: 'tier2',
      name: 'Tier 2 - Intervenções Alvo',
      description: 'Intervenções em pequenos grupos para alunos que precisam de suporte adicional',
      color: '#FFC107',
      percentage: 15,
      students: 150,
      interventions: [
        'Tutoria em pequenos grupos',
        'Prática adicional',
        'Monitoramento semanal',
      ],
    },
    {
      id: 'tier3',
      name: 'Tier 3 - Intervenções Intensivas',
      description: 'Intervenções individualizadas para alunos que precisam de suporte intensivo',
      color: '#F44336',
      percentage: 5,
      students: 50,
      interventions: [
        'Instrução individual',
        'Avaliação frequente',
        'Plano de intervenção personalizado',
      ],
    },
  ],
};

export const PyramidVisualizationExample: React.FC = () => {
  const handleLevelClick = (level: any) => {
    console.log('Nível selecionado:', level);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Distribuição RTI/MTSS
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Visualização da distribuição de alunos nos diferentes níveis de intervenção
      </Typography>
      <Box
        sx={{
          width: '100%',
          height: 600,
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 1,
          overflow: 'hidden',
        }}
      >
        <PyramidVisualization
          data={exampleData}
          onLevelClick={handleLevelClick}
          width={800}
          height={600}
        />
      </Box>
    </Box>
  );
}; 