# Testes - ProgressMonitoringChart

## Visão Geral

Este documento descreve a estratégia de testes para o componente `ProgressMonitoringChart`, garantindo sua qualidade e confiabilidade através de diferentes tipos de testes.

## Implementações

### 1. Testes Unitários
```typescript
// src/components/__tests__/ProgressMonitoringChart.test.tsx
import { render, screen } from '@testing-library/react';
import { ProgressMonitoringChart } from '../ProgressMonitoringChart';

describe('ProgressMonitoringChart', () => {
  const mockData = [
    { date: new Date('2024-01-01'), value: 10 },
    { date: new Date('2024-01-15'), value: 15 },
  ];

  test('renderiza o gráfico corretamente', () => {
    render(<ProgressMonitoringChart data={mockData} />);
    expect(screen.getByRole('img', { name: /gráfico/i })).toBeInTheDocument();
  });

  test('calcula linha de tendência corretamente', () => {
    const { container } = render(<ProgressMonitoringChart data={mockData} />);
    const trendLine = container.querySelector('.trend-line');
    expect(trendLine).toBeInTheDocument();
  });

  test('formata valores corretamente', () => {
    render(<ProgressMonitoringChart data={mockData} />);
    const value = screen.getByText('10,0');
    expect(value).toBeInTheDocument();
  });
});
```

### 2. Testes de Integração
```typescript
// src/components/__tests__/ProgressMonitoringChart.integration.test.tsx
import { render, fireEvent, screen } from '@testing-library/react';
import { ProgressMonitoringChart } from '../ProgressMonitoringChart';

describe('ProgressMonitoringChart Integration', () => {
  test('atualiza quando dados mudam', async () => {
    const { rerender } = render(<ProgressMonitoringChart data={[]} />);
    expect(screen.getByText('Sem dados')).toBeInTheDocument();

    const newData = [{ date: new Date(), value: 10 }];
    rerender(<ProgressMonitoringChart data={newData} />);
    expect(screen.queryByText('Sem dados')).not.toBeInTheDocument();
  });

  test('interage com controles de zoom', () => {
    render(<ProgressMonitoringChart data={[]} />);
    const zoomIn = screen.getByRole('button', { name: /zoom in/i });
    fireEvent.click(zoomIn);
    expect(screen.getByTestId('chart-scale')).toHaveAttribute('data-zoom', '2');
  });
});
```

### 3. Testes de Acessibilidade
```typescript
// src/components/__tests__/ProgressMonitoringChart.accessibility.test.tsx
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { ProgressMonitoringChart } from '../ProgressMonitoringChart';

expect.extend(toHaveNoViolations);

describe('ProgressMonitoringChart Accessibility', () => {
  test('não tem violações de acessibilidade', async () => {
    const { container } = render(<ProgressMonitoringChart data={[]} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('suporta navegação por teclado', () => {
    render(<ProgressMonitoringChart data={[]} />);
    const chart = screen.getByRole('img', { name: /gráfico/i });
    expect(chart).toHaveAttribute('tabIndex', '0');
  });
});
```

### 4. Testes de Performance
```typescript
// src/components/__tests__/ProgressMonitoringChart.performance.test.tsx
import { render } from '@testing-library/react';
import { ProgressMonitoringChart } from '../ProgressMonitoringChart';

describe('ProgressMonitoringChart Performance', () => {
  test('renderiza rapidamente com grande conjunto de dados', () => {
    const start = performance.now();
    const largeData = Array.from({ length: 1000 }, (_, i) => ({
      date: new Date(2024, 0, i + 1),
      value: Math.random() * 100,
    }));

    render(<ProgressMonitoringChart data={largeData} />);
    const end = performance.now();
    expect(end - start).toBeLessThan(100); // menos de 100ms
  });

  test('atualiza eficientemente', () => {
    const { rerender } = render(<ProgressMonitoringChart data={[]} />);
    const start = performance.now();
    
    rerender(<ProgressMonitoringChart data={[{ date: new Date(), value: 10 }]} />);
    const end = performance.now();
    expect(end - start).toBeLessThan(16); // menos de 1 frame (60fps)
  });
});
```

### 5. Testes de Memória
```typescript
// src/components/__tests__/ProgressMonitoringChart.memory.test.tsx
import { render, unmount } from '@testing-library/react';
import { ProgressMonitoringChart } from '../ProgressMonitoringChart';

describe('ProgressMonitoringChart Memory', () => {
  test('não tem vazamentos de memória ao desmontar', () => {
    const { unmount } = render(<ProgressMonitoringChart data={[]} />);
    const heapBefore = performance.memory.usedJSHeapSize;
    unmount();
    const heapAfter = performance.memory.usedJSHeapSize;
    expect(heapAfter).toBeLessThanOrEqual(heapBefore);
  });
});
```

### 6. Testes de Snapshot
```typescript
// src/components/__tests__/ProgressMonitoringChart.snapshot.test.tsx
import { render } from '@testing-library/react';
import { ProgressMonitoringChart } from '../ProgressMonitoringChart';

describe('ProgressMonitoringChart Snapshot', () => {
  test('mantém aparência consistente', () => {
    const { container } = render(<ProgressMonitoringChart data={[]} />);
    expect(container).toMatchSnapshot();
  });

  test('atualiza snapshot quando necessário', () => {
    const { container } = render(
      <ProgressMonitoringChart
        data={[{ date: new Date(), value: 10 }]}
        theme="dark"
      />
    );
    expect(container).toMatchSnapshot();
  });
});
```

### 7. Testes de Casos de Borda
```typescript
// src/components/__tests__/ProgressMonitoringChart.edge.test.tsx
import { render, screen } from '@testing-library/react';
import { ProgressMonitoringChart } from '../ProgressMonitoringChart';

describe('ProgressMonitoringChart Edge Cases', () => {
  test('lida com dados vazios', () => {
    render(<ProgressMonitoringChart data={[]} />);
    expect(screen.getByText('Sem dados')).toBeInTheDocument();
  });

  test('lida com dados inválidos', () => {
    const invalidData = [{ date: 'invalid', value: NaN }];
    render(<ProgressMonitoringChart data={invalidData} />);
    expect(screen.getByText('Dados inválidos')).toBeInTheDocument();
  });
});
```

## Boas Práticas

1. **Organização de Testes**
   - Separe por tipo de teste
   - Use descrições claras
   - Mantenha testes isolados

2. **Cobertura de Testes**
   - Teste componentes principais
   - Inclua casos de borda
   - Verifique interações

3. **Manutenção de Testes**
   - Atualize snapshots
   - Remova testes obsoletos
   - Documente mudanças

4. **Performance de Testes**
   - Use mocks quando apropriado
   - Otimize setup/teardown
   - Agrupe testes similares

## Exemplos de Testes

### Teste Completo
```typescript
// src/components/__tests__/ProgressMonitoringChart.complete.test.tsx
import { render, fireEvent, screen } from '@testing-library/react';
import { ProgressMonitoringChart } from '../ProgressMonitoringChart';

describe('ProgressMonitoringChart Complete', () => {
  const mockData = [
    { date: new Date('2024-01-01'), value: 10 },
    { date: new Date('2024-01-15'), value: 15 },
  ];

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('funcionalidade completa', async () => {
    // Renderização inicial
    const { rerender } = render(<ProgressMonitoringChart data={mockData} />);
    expect(screen.getByRole('img', { name: /gráfico/i })).toBeInTheDocument();

    // Interação com zoom
    const zoomIn = screen.getByRole('button', { name: /zoom in/i });
    fireEvent.click(zoomIn);
    expect(screen.getByTestId('chart-scale')).toHaveAttribute('data-zoom', '2');

    // Atualização de dados
    const newData = [...mockData, { date: new Date('2024-02-01'), value: 20 }];
    rerender(<ProgressMonitoringChart data={newData} />);
    expect(screen.getByText('20,0')).toBeInTheDocument();

    // Interação com tooltip
    const dataPoint = screen.getByTestId('data-point-0');
    fireEvent.mouseOver(dataPoint);
    expect(screen.getByRole('tooltip')).toBeInTheDocument();

    // Mudança de tema
    rerender(<ProgressMonitoringChart data={newData} theme="dark" />);
    expect(screen.getByTestId('chart-container')).toHaveClass('theme-dark');

    // Exportação de dados
    const exportButton = screen.getByRole('button', { name: /exportar/i });
    fireEvent.click(exportButton);
    expect(screen.getByText('Dados exportados')).toBeInTheDocument();
  });
});
```

## Referências

- [Jest](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Jest Axe](https://github.com/nickcolley/jest-axe)
- [Testing Performance](https://web.dev/testing-web-performance/)
- [Memory Leaks](https://web.dev/memory-leaks/) 