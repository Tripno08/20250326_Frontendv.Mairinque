# Tipagem - ProgressMonitoringChart

## Visão Geral

Este documento descreve a estrutura de tipos e interfaces implementadas para o componente `ProgressMonitoringChart`, garantindo type safety e melhor experiência de desenvolvimento.

## Tipos Base

### 1. Dados do Gráfico
```typescript
interface ProgressDataPoint {
  date: Date;
  value: number;
  intervention?: string;
  notes?: string;
}

type ProgressData = ProgressDataPoint[];
```

### 2. Referências e Metas
```typescript
interface Benchmark {
  name: string;
  value: number;
  color: string;
  description: string;
}

interface ProgressGoal {
  name: string;
  targetValue: number;
  deadline: Date;
  color: string;
  description: string;
}

type Benchmarks = Benchmark[];
type Goals = ProgressGoal[];
```

### 3. Props do Componente
```typescript
interface ProgressMonitoringChartProps {
  data: ProgressData;
  benchmarks: Benchmarks;
  goals: Goals;
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

## Tipos de Utilitários

### 1. Dimensões
```typescript
interface ChartDimensions {
  width: number;
  height: number;
  margin: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  innerWidth: number;
  innerHeight: number;
}
```

### 2. Linha de Tendência
```typescript
interface TrendLine {
  slope: number;
  intercept: number;
  rSquared: number;
}

interface Projection {
  targetValue: number;
  deadline: Date;
  confidence: number;
}
```

### 3. Escalas
```typescript
interface ChartScales {
  x: (date: Date) => number;
  y: (value: number) => number;
  color: (intervention: string) => string;
}
```

## Tipos de Eventos

### 1. Interações
```typescript
type ZoomLevel = number;
type ZoomDirection = 'in' | 'out';

interface ZoomEvent {
  direction: ZoomDirection;
  level: ZoomLevel;
}

interface DateRangeEvent {
  start: Date;
  end: Date;
}
```

### 2. Callbacks
```typescript
type InterventionClickHandler = (intervention: string) => void;
type ZoomChangeHandler = (event: ZoomEvent) => void;
type DateRangeChangeHandler = (event: DateRangeEvent) => void;
```

## Tipos de Componentes

### 1. Tooltip
```typescript
interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: ProgressDataPoint;
    value: number;
    color: string;
  }>;
  label?: string | number;
}

interface CustomTooltipProps extends TooltipProps {
  onInterventionClick?: InterventionClickHandler;
}
```

### 2. Pontos
```typescript
interface PointProps {
  data: ProgressDataPoint;
  scale: ChartScales;
  onClick?: (data: ProgressDataPoint) => void;
}
```

## Tipos de Validação

### 1. Validação de Dados
```typescript
interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

type DataValidator = (data: ProgressData) => ValidationResult;
```

### 2. Validação de Props
```typescript
interface PropsValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

type PropsValidator = (props: ProgressMonitoringChartProps) => PropsValidationResult;
```

## Tipos de Estado

### 1. Estado do Gráfico
```typescript
interface ChartState {
  zoomLevel: ZoomLevel;
  dateRange: DateRangeEvent | null;
  hoveredPoint: ProgressDataPoint | null;
  selectedIntervention: string | null;
}
```

### 2. Estado de Carregamento
```typescript
interface LoadingState {
  isLoading: boolean;
  error: Error | null;
  retryCount: number;
}
```

## Boas Práticas

1. **Nomenclatura**
   - Use nomes descritivos
   - Siga convenções de nomenclatura
   - Evite abreviações

2. **Organização**
   - Agrupe tipos relacionados
   - Use interfaces para objetos
   - Use types para uniões

3. **Validação**
   - Implemente validação em runtime
   - Use type guards quando necessário
   - Documente restrições

4. **Reutilização**
   - Use tipos genéricos
   - Compartilhe tipos comuns
   - Evite duplicação

5. **Documentação**
   - Documente tipos complexos
   - Use JSDoc quando necessário
   - Mantenha exemplos atualizados

## Exemplos de Uso

### 1. Tipos Básicos
```typescript
const data: ProgressData = [
  {
    date: new Date('2024-01-01'),
    value: 75,
    intervention: 'A',
    notes: 'Nota 1',
  },
];
```

### 2. Tipos Complexos
```typescript
const chartState: ChartState = {
  zoomLevel: 1,
  dateRange: {
    start: new Date('2024-01-01'),
    end: new Date('2024-06-30'),
  },
  hoveredPoint: null,
  selectedIntervention: null,
};
```

### 3. Tipos Genéricos
```typescript
interface ChartData<T> {
  data: T[];
  metadata: {
    total: number;
    average: number;
    min: number;
    max: number;
  };
}
```

## Referências

- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React TypeScript](https://reactjs.org/docs/static-type-checking.html)
- [TypeScript Deep Dive](https://basarat.gitbook.io/typescript/)
- [TypeScript Playground](https://www.typescriptlang.org/play) 