# Exemplo de Uso do AIAnalysisDashboard

Este exemplo demonstra como utilizar o componente `AIAnalysisDashboard` em uma aplicação React.

## Estrutura

O exemplo inclui:

1. Dados de exemplo de estudantes
2. Estado para controlar o estudante selecionado
3. Handler para seleção de estudantes
4. Layout com Material-UI
5. Exibição condicional do estudante selecionado

## Código

```tsx
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
  // ... mais estudantes
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
```

## Como Usar

1. Importe o componente e os tipos necessários:

```tsx
import { AIAnalysisDashboardExample } from './examples/AIAnalysisDashboardExample';
```

2. Use o componente em sua aplicação:

```tsx
function App() {
  return <AIAnalysisDashboardExample />;
}
```

## Personalização

Você pode personalizar o exemplo:

1. Modificando os dados de exemplo em `exampleStudents`
2. Alterando o layout usando componentes do Material-UI
3. Adicionando mais funcionalidades ao handler de seleção
4. Customizando os estilos usando o sistema de estilos do Material-UI

## Testes

O exemplo inclui testes para:

- Renderização correta
- Interação com seleção de estudantes
- Estado inicial do componente

## Dependências

- @mui/material
- @mui/styles
- react
- typescript

## Contribuição

Para contribuir com o exemplo:

1. Fork o repositório
2. Crie uma branch para sua feature
3. Faça commit das mudanças
4. Push para a branch
5. Crie um Pull Request

## Licença

MIT
