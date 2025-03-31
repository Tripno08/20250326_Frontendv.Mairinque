# AIAnalysisDashboard

O componente `AIAnalysisDashboard` é uma interface visual que exibe análises e insights baseados em IA sobre o desempenho dos estudantes.

## Funcionalidades

- Visualização de métricas de risco para estudantes
- Análise de clusters de estudantes
- Detecção de padrões e anomalias
- Recomendações de intervenção
- Gráficos interativos
- Cards de resumo com métricas principais

## Props

| Prop            | Tipo                          | Descrição                                                   |
| --------------- | ----------------------------- | ----------------------------------------------------------- |
| students        | `StudentData[]`               | Array de dados dos estudantes para análise                  |
| onStudentSelect | `(studentId: string) => void` | Callback opcional chamado quando um estudante é selecionado |

## Estrutura

O dashboard é dividido em várias seções:

### 1. Cards de Resumo

- Número de estudantes em risco
- Número de recomendações ativas
- Número de clusters identificados
- Número de padrões detectados

### 2. Gráficos

- Distribuição de Risco: Gráfico de linha mostrando o risco e confiança para cada estudante
- Clusters de Estudantes: Gráfico de dispersão mostrando a distribuição dos clusters

### 3. Análises Detalhadas

- Anomalias Detectadas: Cards com informações sobre comportamentos anômalos
- Tendências Identificadas: Cards com informações sobre tendências nos dados

## Estilos

O componente utiliza o sistema de estilos do Material-UI e inclui:

- Animações suaves nos cards
- Cores diferentes para diferentes tipos de alerta
- Layout responsivo
- Gráficos interativos com tooltips

## Exemplo de Uso

```tsx
import { AIAnalysisDashboard } from './components/AIAnalysisDashboard';

function App() {
  const students = [
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
  ];

  const handleStudentSelect = (studentId: string) => {
    console.log(`Estudante selecionado: ${studentId}`);
  };

  return <AIAnalysisDashboard students={students} onStudentSelect={handleStudentSelect} />;
}
```

## Dependências

- @mui/material
- @mui/styles
- recharts
- react
- typescript

## Testes

O componente inclui testes para:

- Renderização correta
- Estado de carregamento
- Tratamento de erros
- Interação com seleção de estudantes

## Contribuição

Para contribuir com o componente:

1. Fork o repositório
2. Crie uma branch para sua feature
3. Faça commit das mudanças
4. Push para a branch
5. Crie um Pull Request

## Licença

MIT
