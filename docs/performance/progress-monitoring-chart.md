# Performance - ProgressMonitoringChart

## Visão Geral

Este documento descreve as otimizações de performance implementadas no componente `ProgressMonitoringChart`, garantindo uma experiência suave e responsiva para os usuários.

## Otimizações

### 1. Memoização

#### Cálculos de Tendência
```typescript
const trendLine = useMemo(() => {
  return calculateTrendLine(data);
}, [data]);

const projections = useMemo(() => {
  return goals.map((goal) => calculateProjection(data, goal.deadline));
}, [data, goals]);
```

#### Dimensões do Gráfico
```typescript
const dimensions = useMemo(() => {
  return calculateChartDimensions(containerWidth, containerHeight);
}, [containerWidth, containerHeight]);
```

### 2. Virtualização

#### Renderização de Pontos
```typescript
const VirtualizedPoints = memo(({ data, scale }: VirtualizedPointsProps) => {
  const visiblePoints = useMemo(() => {
    return data.filter((point) => {
      const x = scale.x(point.date);
      return x >= 0 && x <= dimensions.innerWidth;
    });
  }, [data, scale, dimensions.innerWidth]);

  return (
    <>
      {visiblePoints.map((point) => (
        <Point key={point.date.getTime()} data={point} />
      ))}
    </>
  );
});
```

### 3. Debounce e Throttle

#### Redimensionamento
```typescript
const handleResize = useCallback(
  debounce(() => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.clientWidth;
      const containerHeight = containerRef.current.clientHeight;
      setDimensions(
        calculateChartDimensions(containerWidth, containerHeight)
      );
    }
  }, 150),
  []
);
```

#### Atualização de Zoom
```typescript
const handleZoom = useCallback(
  throttle((delta: number) => {
    setZoomLevel((prev) => Math.max(0.5, Math.min(2, prev + delta)));
  }, 16),
  []
);
```

### 4. Otimização de Re-renders

#### Componentes Memorizados
```typescript
const CustomTooltip = memo(({ active, payload, label }: TooltipProps) => {
  if (!active || !payload?.length) return null;

  const dataPoint = payload[0].payload;
  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="subtitle2">
        {formatDate(new Date(label))}
      </Typography>
      <Typography variant="body2">
        Valor: {formatValue(dataPoint.value)}
      </Typography>
    </Paper>
  );
});
```

#### Callbacks Memorizados
```typescript
const handleInterventionClick = useCallback(
  (intervention: string) => {
    onInterventionClick?.(intervention);
  },
  [onInterventionClick]
);
```

### 5. Otimização de Dados

#### Filtragem Eficiente
```typescript
const filteredData = useMemo(() => {
  if (!dateRange) return data;

  return data.filter(
    (point) =>
      point.date >= dateRange.start && point.date <= dateRange.end
  );
}, [data, dateRange]);
```

#### Agregação de Dados
```typescript
const aggregatedData = useMemo(() => {
  if (data.length <= 100) return data;

  const interval = Math.ceil(data.length / 50);
  return data.reduce((acc, point, index) => {
    if (index % interval === 0) {
      acc.push(point);
    }
    return acc;
  }, [] as ProgressDataPoint[]);
}, [data]);
```

## Métricas de Performance

### 1. Tempo de Renderização
- Renderização inicial: < 100ms
- Re-renderização: < 50ms
- Atualização de dados: < 30ms

### 2. Uso de Memória
- Heap size: < 50MB
- Garbage collection: < 100ms
- Memory leaks: 0

### 3. FPS
- Média: 60 FPS
- Mínimo: 30 FPS
- Picos: < 5% do tempo

## Boas Práticas

1. **Memoização**
   - Use useMemo para cálculos complexos
   - Use useCallback para funções
   - Evite memoização desnecessária

2. **Virtualização**
   - Implemente para grandes conjuntos de dados
   - Otimize renderização de pontos
   - Mantenha scroll suave

3. **Debounce/Throttle**
   - Use para eventos frequentes
   - Ajuste intervalos conforme necessário
   - Limpe listeners adequadamente

4. **Otimização de Dados**
   - Filtre dados desnecessários
   - Agregue dados quando possível
   - Mantenha estruturas de dados eficientes

5. **Re-renders**
   - Minimize re-renders desnecessários
   - Use memo quando apropriado
   - Evite prop drilling

## Testes de Performance

### 1. Testes de Carga
```typescript
it('lida com grandes conjuntos de dados', () => {
  const largeData = generateLargeDataset(10000);
  
  const { container } = render(
    <ProgressMonitoringChart
      data={largeData}
      benchmarks={mockBenchmarks}
      goals={mockGoals}
    />
  );

  expect(container).toBeInTheDocument();
  expect(container.querySelector('svg')).toBeInTheDocument();
});
```

### 2. Testes de Memória
```typescript
it('não tem memory leaks', () => {
  const { unmount } = render(
    <ProgressMonitoringChart
      data={mockData}
      benchmarks={mockBenchmarks}
      goals={mockGoals}
    />
  );

  unmount();
  expect(global.gc).toBeDefined();
});
```

## Referências

- [React Performance](https://reactjs.org/docs/optimizing-performance.html)
- [Web Performance](https://web.dev/performance/)
- [Chrome DevTools](https://developer.chrome.com/docs/devtools/)
- [React DevTools](https://reactjs.org/blog/2019/08/15/new-react-devtools.html) 