# Acessibilidade - ProgressMonitoringChart

## Visão Geral

Este documento descreve as implementações de acessibilidade no componente `ProgressMonitoringChart`, garantindo que ele seja utilizável por todos os usuários, incluindo aqueles que utilizam tecnologias assistivas.

## Implementações

### 1. Roles ARIA
```typescript
const ChartContainer = () => {
  return (
    <div
      role="region"
      aria-label="Gráfico de Monitoramento de Progresso"
      aria-roledescription="Gráfico interativo mostrando o progresso do aluno ao longo do tempo"
    >
      <div role="img">
        {/* Conteúdo do gráfico */}
      </div>
    </div>
  );
};
```

### 2. Navegação por Teclado
```typescript
const ChartControls = () => {
  return (
    <div role="toolbar" aria-label="Controles do Gráfico">
      <IconButton
        onClick={handleZoomIn}
        aria-label="Aumentar Zoom"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            handleZoomIn();
          }
        }}
      >
        <ZoomInIcon />
      </IconButton>
    </div>
  );
};
```

### 3. Descrições
```typescript
const ChartDescription = () => {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      <Typography>
        Gráfico mostrando {data.length} pontos de dados,
        com valores entre {minValue} e {maxValue}.
      </Typography>
    </div>
  );
};
```

## Contraste e Cores

### 1. Paleta de Cores
```typescript
const colors = {
  primary: '#1976D2', // Contraste 4.5:1
  secondary: '#FF4081', // Contraste 4.5:1
  success: '#4CAF50', // Contraste 4.5:1
  warning: '#FFC107', // Contraste 4.5:1
  error: '#F44336', // Contraste 4.5:1
};
```

### 2. Indicadores Visuais
```typescript
const VisualIndicator = ({ type }: { type: 'success' | 'warning' | 'error' }) => {
  return (
    <Box
      sx={{
        color: colors[type],
        fontWeight: 'bold',
        textDecoration: 'underline',
      }}
      role="status"
      aria-label={`Status: ${type}`}
    >
      {type}
    </Box>
  );
};
```

## Textos Alternativos

### 1. Tooltips
```typescript
const ChartTooltip = ({ data }: { data: ProgressDataPoint }) => {
  return (
    <Tooltip
      title={`Valor: ${formatValue(data.value)}`}
      aria-label={`Valor do ponto: ${formatValue(data.value)}`}
    >
      <div role="button" tabIndex={0}>
        {/* Conteúdo do tooltip */}
      </div>
    </Tooltip>
  );
};
```

### 2. Legendas
```typescript
const ChartLegend = () => {
  return (
    <div role="list" aria-label="Legenda do Gráfico">
      {legends.map((legend) => (
        <div
          key={legend.id}
          role="listitem"
          aria-label={`${legend.label}: ${legend.value}`}
        >
          <ColorIndicator color={legend.color} />
          <Typography>{legend.label}</Typography>
        </div>
      ))}
    </div>
  );
};
```

## Redimensionamento

### 1. Responsividade
```typescript
const ResponsiveChart = () => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={filteredData}
        margin={dimensions.margin}
        scale={zoomLevel}
      >
        {/* Conteúdo do gráfico */}
      </LineChart>
    </ResponsiveContainer>
  );
};
```

### 2. Ajuste de Texto
```typescript
const ResponsiveText = ({ text }: { text: string }) => {
  return (
    <Typography
      sx={{
        fontSize: {
          xs: '0.75rem',
          sm: '0.875rem',
          md: '1rem',
        },
      }}
    >
      {text}
    </Typography>
  );
};
```

## Boas Práticas

1. **Semântica HTML**
   - Use elementos HTML apropriados
   - Mantenha estrutura hierárquica clara
   - Evite divs desnecessários

2. **Roles ARIA**
   - Use roles apenas quando necessário
   - Mantenha roles atualizados
   - Evite roles redundantes

3. **Navegação**
   - Implemente navegação por teclado
   - Mantenha ordem de foco lógica
   - Evite armadilhas de foco

4. **Contraste**
   - Mantenha contraste mínimo de 4.5:1
   - Use cores com significado
   - Evite confiar apenas em cores

5. **Textos**
   - Forneça textos alternativos
   - Use descrições claras
   - Evite textos decorativos

## Testes de Acessibilidade

### 1. Testes Manuais
```typescript
const accessibilityTests = {
  keyboard: [
    'Navegação por Tab',
    'Ativação por Enter',
    'Ordem de foco',
  ],
  screenReader: [
    'Leitura de textos',
    'Navegação por landmarks',
    'Descrições de imagens',
  ],
  visual: [
    'Contraste de cores',
    'Tamanho de texto',
    'Espaçamento',
  ],
};
```

### 2. Testes Automatizados
```typescript
it('implementa roles ARIA corretamente', () => {
  render(
    <ProgressMonitoringChart
      data={mockData}
      benchmarks={mockBenchmarks}
      goals={mockGoals}
    />
  );

  expect(screen.getByRole('region')).toBeInTheDocument();
  expect(screen.getByRole('img')).toBeInTheDocument();
  expect(screen.getByRole('tooltip')).toBeInTheDocument();
});
```

## Exemplos de Implementação

### 1. Gráfico Acessível
```typescript
const AccessibleChart = () => {
  return (
    <div
      role="region"
      aria-label="Gráfico de Progresso"
      aria-roledescription="Gráfico interativo mostrando o progresso do aluno"
    >
      <ChartDescription />
      <ChartControls />
      <ChartContent />
      <ChartLegend />
    </div>
  );
};
```

### 2. Tooltip Acessível
```typescript
const AccessibleTooltip = ({ data }: { data: ProgressDataPoint }) => {
  return (
    <div
      role="tooltip"
      aria-label={`Dados do ponto ${formatDate(data.date)}`}
    >
      <Typography variant="subtitle2">
        {formatDate(data.date)}
      </Typography>
      <Typography variant="body2">
        Valor: {formatValue(data.value)}
      </Typography>
      {data.intervention && (
        <Typography
          variant="body2"
          role="button"
          tabIndex={0}
          aria-label={`Intervenção: ${data.intervention}`}
        >
          Intervenção: {data.intervention}
        </Typography>
      )}
    </div>
  );
};
```

## Referências

- [WCAG 2.1](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Practices](https://www.w3.org/WAI/ARIA/apg/)
- [React Accessibility](https://reactjs.org/docs/accessibility.html)
- [Material-UI Accessibility](https://mui.com/material-ui/getting-started/accessibility/)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/) 