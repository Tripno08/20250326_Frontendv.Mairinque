# Tipagem para Componentes de Gráficos

## Padrões de Tipagem Recomendados

### Interface de Propriedades do Componente

```typescript
interface ChartProps {
  // Dados a serem exibidos no gráfico
  data: DataType[];

  // Dimensões do gráfico (com valores padrão)
  width?: number;
  height?: number;

  // Propriedades opcionais para customização
  className?: string;

  // Callbacks para interação
  onPointClick?: (point: DataType) => void;

  // Configurações adicionais
  options?: ChartOptions;
}
```

### Interface para Dimensões do Gráfico

```typescript
interface ChartDimensions {
  width: number;
  height: number;
  margin: {
    top: number;
    right: number;
    left: number;
    bottom: number;
  }
}
```

### Interface para Estado do Gráfico

```typescript
interface ChartState {
  dimensions: ChartDimensions;
  isLoading: boolean;
  error?: string;
  selectedPoint?: DataType;
  zoomLevel: number;
}
```

## Tipagem para Dados do Gráfico

### Dados de Série Temporal

```typescript
interface TimeSeriesDataPoint {
  date: Date; // Ou string em formato ISO
  value: number;
  label?: string;
  metadata?: Record<string, any>;
}
```

### Dados Categóricos

```typescript
interface CategoricalDataPoint {
  category: string;
  value: number;
  color?: string;
  metadata?: Record<string, any>;
}
```

### Conjunto de Dados Multidimensional

```typescript
interface MultiDimensionalDataPoint {
  name: string;
  [key: string]: number | string; // Dimensões dinâmicas
}
```

## Tipagem para Utilitários de Gráficos

### Funções de Formatação

```typescript
type DateFormatter = (date: Date) => string;
type ValueFormatter = (value: number) => string;
```

### Funções de Cálculo

```typescript
interface TrendLineCalculation {
  slope: number;
  intercept: number;
  r2: number; // Coeficiente de determinação
}

interface Projection {
  deadline: Date;
  targetValue: number;
  confidence: number; // 0-1
}

type TrendLineCalculator = (data: TimeSeriesDataPoint[]) => TrendLineCalculation;
type ProjectionCalculator = (data: TimeSeriesDataPoint[], deadline: Date) => Projection;
```

### Funções de Cores

```typescript
type ColorGenerator = (value: number) => string;
type ColorGetter = (name: string) => string;
```

## Exemplo Completo de Tipagem

```typescript
// Tipos de dados
interface ProgressDataPoint {
  date: Date;
  value: number;
  intervention?: string;
  notes?: string;
}

interface Benchmark {
  name: string;
  value: number;
  color: string;
  description?: string;
}

interface ProgressGoal {
  name: string;
  targetValue: number;
  deadline: Date;
  color: string;
  description?: string;
}

// Propriedades do componente
interface ProgressMonitoringChartProps {
  data: ProgressDataPoint[];
  benchmarks: Benchmark[];
  goals: ProgressGoal[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  width?: number;
  height?: number;
  className?: string;
  onInterventionClick?: (intervention: string) => void;
}

// Dimensões do gráfico
interface ChartDimensions {
  width: number;
  height: number;
  margin: {
    top: number;
    right: number;
    left: number;
    bottom: number;
  }
}

// Tipagem para funções utilitárias
type FormatDate = (date: Date) => string;
type FormatValue = (value: number) => string;
type GetInterventionColor = (intervention: string) => string;
type CalculateTrendLine = (data: ProgressDataPoint[]) => {
  slope: number;
  intercept: number;
};
```

## Melhores Práticas de Tipagem

1. **Use tipagem explícita para todas as props**:
   - Defina tipos para todas as propriedades, mesmo as opcionais
   - Use valores padrão para props opcionais

2. **Separe a tipagem de dados da tipagem de componentes**:
   - Mantenha os tipos de dados em arquivos separados para reuso
   - Use namespaces ou módulos para organizar tipos relacionados

3. **Defina tipos para funções de utilidade**:
   - Especifique tipos de entrada e saída para funções utilitárias
   - Use tipos genéricos quando apropriado

4. **Evite uso excessivo de `any`**:
   - Use `unknown` como alternativa mais segura quando necessário
   - Defina tipos próprios para estruturas complexas

5. **Documente seus tipos**:
   - Adicione JSDoc para descrever o propósito de cada tipo
   - Inclua exemplos de uso em comentários

6. **Use tipagem de retorno explícita para componentes**:
   - Especifique o tipo de retorno React.FC<Props> ou JSX.Element
   - Isso ajuda a prevenir erros de tipo no JSX
