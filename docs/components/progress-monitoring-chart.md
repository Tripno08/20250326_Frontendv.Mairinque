# ProgressMonitoringChart

O componente `ProgressMonitoringChart` é uma visualização interativa do progresso do aluno ao longo do tempo, utilizando a biblioteca Recharts para renderização de gráficos.

## Características

- Visualização de dados de progresso em linha do tempo
- Linha de tendência calculada automaticamente
- Benchmarks e metas com indicadores visuais
- Projeções de progresso futuro
- Zoom e controles de visualização
- Tooltips informativos
- Totalmente responsivo
- Suporte a acessibilidade

## Props

```typescript
interface ProgressMonitoringChartProps {
  data: ProgressDataPoint[];
  benchmarks: Benchmark[];
  goals: ProgressGoal[];
  onInterventionClick?: (intervention: string) => void;
  className?: string;
  width?: number;
  height?: number;
  dateRange?: {
    start: Date;
    end: Date;
  };
}
```

### ProgressDataPoint
```typescript
interface ProgressDataPoint {
  date: Date;
  value: number;
  intervention?: string;
  notes?: string;
}
```

### Benchmark
```typescript
interface Benchmark {
  name: string;
  value: number;
  color: string;
  description: string;
}
```

### ProgressGoal
```typescript
interface ProgressGoal {
  name: string;
  targetValue: number;
  deadline: Date;
  color: string;
  description: string;
}
```

## Exemplo de Uso

```tsx
import { ProgressMonitoringChart } from '@/components/Progress/ProgressMonitoringChart';

const MyComponent = () => {
  const data = [
    {
      date: new Date('2024-01-01'),
      value: 65,
      intervention: 'Intervenção A',
      notes: 'Primeira avaliação',
    },
    // ... mais pontos de dados
  ];

  const benchmarks = [
    {
      name: 'Benchmark 1',
      value: 70,
      color: '#4CAF50',
      description: 'Nível esperado',
    },
    // ... mais benchmarks
  ];

  const goals = [
    {
      name: 'Meta 1',
      targetValue: 80,
      deadline: new Date('2024-03-31'),
      color: '#FF9800',
      description: 'Meta para o trimestre',
    },
    // ... mais metas
  ];

  const handleInterventionClick = (intervention: string) => {
    console.log('Intervenção clicada:', intervention);
  };

  return (
    <ProgressMonitoringChart
      data={data}
      benchmarks={benchmarks}
      goals={goals}
      onInterventionClick={handleInterventionClick}
      dateRange={{
        start: new Date('2024-01-01'),
        end: new Date('2024-06-30'),
      }}
    />
  );
};
```

## Funcionalidades

### Visualização de Dados
- Gráfico de linha mostrando o progresso ao longo do tempo
- Pontos de dados com valores e datas
- Tooltips com informações detalhadas ao passar o mouse

### Linha de Tendência
- Calculada automaticamente usando regressão linear
- Mostra a direção geral do progresso
- Ajuda a identificar padrões de crescimento

### Benchmarks e Metas
- Linhas de referência para benchmarks
- Indicadores visuais para metas
- Cores diferentes para cada tipo de referência

### Projeções
- Cálculo automático de projeções futuras
- Nível de confiança para cada projeção
- Visualização clara das metas futuras

### Interatividade
- Controles de zoom (aumentar, diminuir, resetar)
- Filtro por intervalo de datas
- Clique em intervenções para mais detalhes

### Responsividade
- Adapta-se automaticamente ao tamanho do container
- Mantém proporções em diferentes tamanhos de tela
- Otimizado para visualização em dispositivos móveis

### Acessibilidade
- Suporte a navegação por teclado
- ARIA labels para elementos interativos
- Contraste adequado para leitura
- Descrições para leitores de tela

## Testes

O componente inclui testes unitários abrangentes que cobrem:
- Renderização correta
- Funcionalidade de zoom
- Filtro de datas
- Interação com intervenções
- Exibição de tooltips
- Cálculo de tendência
- Projeções

## Dependências

- recharts
- @mui/material
- @mui/icons-material
- date-fns (para manipulação de datas)

## Boas Práticas

1. **Dados**
   - Forneça dados ordenados por data
   - Inclua valores numéricos válidos
   - Adicione descrições claras para intervenções

2. **Performance**
   - Limite o número de pontos de dados
   - Use datas em formato Date
   - Evite atualizações frequentes

3. **Acessibilidade**
   - Forneça descrições significativas
   - Mantenha contraste adequado
   - Teste com leitores de tela

4. **Responsividade**
   - Use container com altura definida
   - Teste em diferentes tamanhos de tela
   - Considere layout em dispositivos móveis

## Solução de Problemas

### Problemas Comuns

1. **Gráfico não renderiza**
   - Verifique se os dados estão no formato correto
   - Confirme se as datas são objetos Date
   - Verifique se há valores numéricos válidos

2. **Zoom não funciona**
   - Confirme se o container tem dimensões definidas
   - Verifique se os eventos de clique estão sendo capturados
   - Teste em diferentes navegadores

3. **Tooltips não aparecem**
   - Verifique se os dados incluem informações para tooltip
   - Confirme se o mouse está sobre pontos válidos
   - Teste em diferentes dispositivos

### Dicas de Debug

1. Use o console para verificar dados
2. Verifique dimensões do container
3. Teste com dados de exemplo
4. Monitore eventos do mouse
5. Verifique cálculos de tendência

## Referências

- [Documentação do Recharts](https://recharts.org/)
- [Material-UI](https://mui.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [Acessibilidade Web](https://www.w3.org/WAI/) 