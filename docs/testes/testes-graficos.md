# Testes para Componentes de Gráficos

## Desafios e Soluções

### Desafios Comuns

1. **Componentes com elementos duplicados**: Texto repetido em legendas e detalhes
2. **Dimensões dinâmicas**: Comportamento diferente em ambiente de teste
3. **APIs do navegador**: ResizeObserver e eventos de redimensionamento não disponíveis
4. **Interações complexas**: Difícil testar zoom, pan, tooltips, etc.

### Soluções Recomendadas

#### 1. Para Elementos Duplicados

Use `within()` do Testing Library para isolar consultas a partes específicas do DOM:

```typescript
// Em vez disso
expect(screen.getByText('Leitura')).toBeInTheDocument();

// Use
const detailsSection = screen.getByText('Detalhes').closest('div');
if (detailsSection) {
  expect(within(detailsSection).getByText('Leitura')).toBeInTheDocument();
}
```

#### 2. Para Dimensões Dinâmicas

- Defina dimensões fixas durante testes
- Mock as funções que calculam dimensões
- Teste componentes individualmente, não o layout inteiro

#### 3. Para APIs do Navegador

```typescript
// Mock do ResizeObserver
beforeAll(() => {
  global.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});
```

#### 4. Para Interações Complexas

- Divida os testes em unidades menores
- Use mocks para eventos complexos como dragging
- Teste o resultado final, não os passos intermediários

## Estrutura de Testes Recomendada

### 1. Teste de Renderização Básica

```typescript
it('renderiza o gráfico corretamente', () => {
  render(
    <ChartComponent
      data={mockData}
      width={800}
      height={600}
    />
  );

  // Verifica se os elementos principais estão presentes
  expect(screen.getByRole('img', { name: /gráfico/i })).toBeInTheDocument();
  expect(screen.getByText('Título do Gráfico')).toBeInTheDocument();
});
```

### 2. Teste de Estados

```typescript
it('exibe estado de carregamento', () => {
  render(<ChartComponent data={[]} isLoading={true} />);
  expect(screen.getByRole('progressbar')).toBeInTheDocument();
});

it('exibe mensagem de erro', () => {
  const errorMessage = 'Erro ao carregar dados';
  render(<ChartComponent data={[]} error={errorMessage} />);
  expect(screen.getByText(errorMessage)).toBeInTheDocument();
});
```

### 3. Teste de Interações

```typescript
it('aplica zoom corretamente', () => {
  render(<ChartComponent data={mockData} />);

  const zoomInButton = screen.getByRole('button', { name: 'Aumentar Zoom' });

  // Executa ação
  fireEvent.click(zoomInButton);

  // Verifica resultado (dependendo da implementação)
  expect(screen.getByRole('img', { name: /gráfico/i })).toHaveAttribute(
    'data-zoom-level',
    '1.1'
  );
});
```

### 4. Teste de Filtragem de Dados

```typescript
it('filtra dados por intervalo de datas', () => {
  const dateRange = {
    start: new Date('2024-01-01'),
    end: new Date('2024-01-31'),
  };

  render(
    <ChartComponent
      data={mockData}
      dateRange={dateRange}
    />
  );

  // Verifica se os dados filtrados estão corretos
  // (depende da implementação específica)
});
```

## Melhores Práticas

### 1. Use Mocks para Dados Complexos

```typescript
// Crie dados de mock reutilizáveis
const mockData: DataPoint[] = [
  { date: new Date('2024-01-01'), value: 65 },
  { date: new Date('2024-02-01'), value: 70 },
];

// Use variantes para diferentes testes
const mockDataEmpty: DataPoint[] = [];
const mockDataSingle: DataPoint[] = [{ date: new Date(), value: 50 }];
```

### 2. Isole Componentes de Visualização

```typescript
// Teste unidades menores quando possível
it('renderiza barras com cores corretas', () => {
  // Renderiza apenas o componente de barras, não o gráfico inteiro
  render(<BarComponent data={mockData} colorScale={mockColorScale} />);

  // Verifica as barras
  const bars = screen.getAllByRole('graphics-symbol');
  expect(bars[0]).toHaveStyle({ fill: '#1976d2' });
});
```

### 3. Testes de Regressão Visual

Para componentes visuais complexos, considere testes de regressão visual:

```typescript
it('corresponde ao snapshot', () => {
  const { container } = render(<ChartComponent data={mockData} />);
  expect(container).toMatchSnapshot();
});
```

### 4. Teste a Acessibilidade

```typescript
it('é acessível', () => {
  render(<ChartComponent data={mockData} />);

  // Verifica atributos de acessibilidade
  const chart = screen.getByRole('img', { name: /gráfico/i });
  expect(chart).toHaveAttribute('aria-label');

  // Ou use ferramentas como jest-axe para testes de acessibilidade completos
});
```

## Exemplo Completo de Suite de Testes

```typescript
import { render, screen, within, fireEvent } from '@testing-library/react';
import { ChartComponent } from '../ChartComponent';

describe('ChartComponent', () => {
  // Mock de dados para testes
  const mockData = [
    { date: new Date('2024-01-01'), value: 65 },
    { date: new Date('2024-02-01'), value: 70 },
  ];

  // Mock do ResizeObserver
  beforeAll(() => {
    global.ResizeObserver = class ResizeObserver {
      observe() {}
      unobserve() {}
      disconnect() {}
    };
  });

  it('renderiza o gráfico corretamente', () => {
    render(<ChartComponent data={mockData} />);
    expect(screen.getByRole('img')).toBeInTheDocument();
  });

  it('exibe os dados corretos', () => {
    render(<ChartComponent data={mockData} />);

    // Verifica se os valores estão presentes
    const container = screen.getByTestId('chart-container');
    const values = within(container).getAllByText(/\d+/);

    expect(values.some(el => el.textContent === '65')).toBeTruthy();
    expect(values.some(el => el.textContent === '70')).toBeTruthy();
  });

  it('responde a interações', () => {
    const handleClick = jest.fn();
    render(<ChartComponent data={mockData} onPointClick={handleClick} />);

    // Encontra um ponto no gráfico e clica nele
    const points = screen.getAllByRole('graphics-symbol');
    fireEvent.click(points[0]);

    expect(handleClick).toHaveBeenCalledTimes(1);
    expect(handleClick).toHaveBeenCalledWith(mockData[0]);
  });
});
```
