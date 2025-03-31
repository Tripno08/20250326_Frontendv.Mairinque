import React, { useState } from 'react';
import { Container, Typography, Box } from '@mui/material';
import { AIAnalysisDashboard } from '../components/AIAnalysisDashboard';
import { StudentData } from '../types/ai.types';

// Dados de exemplo
const exampleStudents: StudentData[] = [
  {
    id: '1',
    createdAt: new Date(),
    updatedAt: new Date(),
    academicPerformance: {
      grades: [7.5, 8.0, 7.8],
      attendance: 0.85,
      behavior: 0.9,
    },
    demographicData: {
      age: 15,
      grade: 9,
      socioeconomicStatus: 0.7,
    },
    interventionHistory: [
      {
        type: 'academic',
        date: new Date(),
        outcome: 0.8,
      },
    ],
  },
  {
    id: '2',
    createdAt: new Date(),
    updatedAt: new Date(),
    academicPerformance: {
      grades: [6.0, 5.5, 6.2],
      attendance: 0.7,
      behavior: 0.8,
    },
    demographicData: {
      age: 16,
      grade: 9,
      socioeconomicStatus: 0.5,
    },
    interventionHistory: [
      {
        type: 'behavioral',
        date: new Date(),
        outcome: 0.6,
      },
    ],
  },
  {
    id: '3',
    createdAt: new Date(),
    updatedAt: new Date(),
    academicPerformance: {
      grades: [8.5, 8.8, 9.0],
      attendance: 0.95,
      behavior: 0.95,
    },
    demographicData: {
      age: 15,
      grade: 9,
      socioeconomicStatus: 0.8,
    },
    interventionHistory: [],
  },
  {
    id: '4',
    createdAt: new Date(),
    updatedAt: new Date(),
    academicPerformance: {
      grades: [5.0, 4.5, 4.8],
      attendance: 0.6,
      behavior: 0.7,
    },
    demographicData: {
      age: 16,
      grade: 9,
      socioeconomicStatus: 0.4,
    },
    interventionHistory: [
      {
        type: 'academic',
        date: new Date(),
        outcome: 0.4,
      },
      {
        type: 'behavioral',
        date: new Date(),
        outcome: 0.5,
      },
    ],
  },
];

export function AIAnalysisDashboardExample() {
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);

  const handleStudentSelect = (studentId: string) => {
    setSelectedStudentId(studentId);
    console.log(`Estudante selecionado: ${studentId}`);
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Dashboard de Análise de IA
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" paragraph>
          Visualize análises e insights baseados em IA sobre o desempenho dos estudantes
        </Typography>

        {selectedStudentId && (
          <Box sx={{ mb: 3, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
            <Typography variant="h6">Estudante Selecionado: {selectedStudentId}</Typography>
          </Box>
        )}

        <AIAnalysisDashboard students={exampleStudents} onStudentSelect={handleStudentSelect} />
      </Box>
    </Container>
  );
}
