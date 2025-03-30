# Depuração - ProgressMonitoringChart

## Visão Geral

Este documento descreve as ferramentas e técnicas de depuração para o componente `ProgressMonitoringChart`, garantindo a identificação e resolução eficiente de problemas.

## Ferramentas de Depuração

### 1. React DevTools
```typescript
// src/debug/devtools.ts
import { enableDevTools } from '@/utils/debug';

export const setupDevTools = () => {
  if (process.env.NODE_ENV === 'development') {
    enableDevTools({
      logLifecycle: true,
      logRenders: true,
      logProps: true,
      logState: true,
    });
  }
};

// src/components/ProgressMonitoringChart.tsx
const ProgressMonitoringChart = React.memo((props: Props) => {
  // Nome personalizado para DevTools
  ProgressMonitoringChart.displayName = 'ProgressMonitoringChart';
  
  return (
    // ... implementação
  );
});
```

### 2. Chrome DevTools
```typescript
// src/debug/chrome.ts
export const setupDebugPoints = () => {
  // Pontos de interrupção condicionais
  if (process.env.NODE_ENV === 'development') {
    console.debug('Pontos de depuração disponíveis:');
    console.debug('- debugger; // Ponto de interrupção manual');
    console.debug('- console.trace(); // Stack trace');
  }
};

export const setupStructuredLogs = () => {
  // Logs estruturados para DevTools
  console.log('%c ProgressMonitoringChart Debug ', 'background: #222; color: #bada55');
  console.group('Informações de Depuração');
  console.table({
    versão: '1.0.0',
    ambiente: process.env.NODE_ENV,
    debug: true,
  });
  console.groupEnd();
};
```

### 3. Performance Profiler
```typescript
// src/debug/profiler.ts
import { Profiler } from 'react';

export const ChartProfiler = ({ children }: { children: React.ReactNode }) => {
  const handleRender = (
    id: string,
    phase: string,
    actualDuration: number,
    baseDuration: number,
    startTime: number,
    commitTime: number
  ) => {
    console.table({
      componente: id,
      fase: phase,
      duracaoAtual: `${actualDuration.toFixed(2)}ms`,
      duracaoBase: `${baseDuration.toFixed(2)}ms`,
      tempoInicio: new Date(startTime).toISOString(),
      tempoCommit: new Date(commitTime).toISOString(),
    });
  };

  return (
    <Profiler id="ProgressMonitoringChart" onRender={handleRender}>
      {children}
    </Profiler>
  );
};
```

## Problemas Comuns

### 1. Re-renderizações Desnecessárias
```typescript
// src/debug/renders.ts
import { useEffect, useRef } from 'react';

export const useRenderDebug = (componentName: string) => {
  const renderCount = useRef(0);

  useEffect(() => {
    renderCount.current += 1;
    console.log(`${componentName} renderizado ${renderCount.current} vezes`);
  });

  return renderCount.current;
};

// Uso no componente
const ProgressMonitoringChart = React.memo((props: Props) => {
  const renderCount = useRenderDebug('ProgressMonitoringChart');
  
  const memoizedData = useMemo(() => processData(props.data), [props.data]);
  
  return (
    <div data-testid="render-count">{renderCount}</div>
  );
});
```

### 2. Gargalos de Performance
```typescript
// src/debug/performance.ts
export const usePerformanceDebug = () => {
  useEffect(() => {
    performance.mark('chart-start');

    return () => {
      performance.mark('chart-end');
      performance.measure('chart-render', 'chart-start', 'chart-end');
      
      const measures = performance.getEntriesByType('measure');
      console.table(measures);
    };
  }, []);
};

// Uso no componente
const ProgressMonitoringChart = (props: Props) => {
  usePerformanceDebug();
  
  return (
    // ... implementação
  );
};
```

### 3. Vazamentos de Memória
```typescript
// src/debug/memory.ts
export const useMemoryDebug = () => {
  useEffect(() => {
    const interval = setInterval(() => {
      if (performance.memory) {
        console.table({
          heapTotal: `${(performance.memory.totalJSHeapSize / 1024 / 1024).toFixed(2)}MB`,
          heapUsed: `${(performance.memory.usedJSHeapSize / 1024 / 1024).toFixed(2)}MB`,
          heapLimit: `${(performance.memory.jsHeapSizeLimit / 1024 / 1024).toFixed(2)}MB`,
        });
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);
};
```

## Ferramentas de Diagnóstico

### 1. Validação de Props
```typescript
// src/debug/props.ts
import { z } from 'zod';

const PropsSchema = z.object({
  data: z.array(z.object({
    date: z.date(),
    value: z.number(),
  })),
  width: z.number().optional(),
  height: z.number().optional(),
  theme: z.enum(['light', 'dark']).optional(),
});

export const validateProps = (props: unknown) => {
  try {
    PropsSchema.parse(props);
    return true;
  } catch (error) {
    console.error('Erro de validação de props:', error);
    return false;
  }
};
```

### 2. Verificação de Tipos
```typescript
// src/debug/types.ts
export const typeCheck = <T>(value: unknown, type: string): value is T => {
  const actualType = typeof value;
  const isValid = actualType === type;
  
  if (!isValid) {
    console.error(`Erro de tipo: esperado ${type}, recebido ${actualType}`);
  }
  
  return isValid;
};

// Uso no componente
const value = props.data[0]?.value;
if (typeCheck<number>(value, 'number')) {
  // Usar valor com segurança
}
```

### 3. Monitoramento de Erros
```typescript
// src/debug/errors.ts
import { Component, ErrorInfo } from 'react';

export class ChartErrorBoundary extends Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Erro no ProgressMonitoringChart:', {
      error,
      componentStack: errorInfo.componentStack,
    });
  }

  render() {
    if (this.state.hasError) {
      return <div>Erro ao renderizar o gráfico</div>;
    }

    return this.props.children;
  }
}
```

## Técnicas de Depuração

### 1. Pontos de Interrupção Condicionais
```typescript
// src/debug/breakpoints.ts
export const setupConditionalBreakpoints = () => {
  const debugData = (data: unknown[]) => {
    if (data.length > 1000) {
      debugger; // Ponto de interrupção para grandes conjuntos de dados
    }
  };

  return {
    debugData,
  };
};
```

### 2. Logs Estruturados
```typescript
// src/debug/logging.ts
export const chartLogger = {
  data: (data: unknown) => {
    console.group('Dados do Gráfico');
    console.log('Quantidade:', Array.isArray(data) ? data.length : 0);
    console.log('Amostra:', Array.isArray(data) ? data.slice(0, 3) : data);
    console.groupEnd();
  },

  state: (state: unknown) => {
    console.group('Estado do Gráfico');
    console.table(state);
    console.groupEnd();
  },

  error: (error: Error) => {
    console.group('Erro no Gráfico');
    console.error(error);
    console.trace();
    console.groupEnd();
  },
};
```

### 3. Testes Isolados
```typescript
// src/debug/isolation.ts
export const isolateComponent = (props: Props) => {
  return (
    <div style={{ border: '2px solid red', padding: '1rem' }}>
      <div style={{ marginBottom: '1rem' }}>
        <h3>Componente Isolado</h3>
        <pre>{JSON.stringify(props, null, 2)}</pre>
      </div>
      <ProgressMonitoringChart {...props} />
    </div>
  );
};
```

## Boas Práticas

1. **Logs**
   - Use níveis apropriados
   - Estruture mensagens
   - Limpe em produção

2. **Performance**
   - Profile renderizações
   - Monitore memória
   - Identifique gargalos

3. **Erros**
   - Capture exceções
   - Forneça contexto
   - Implemente fallbacks

4. **Estado**
   - Monitore mudanças
   - Valide transições
   - Preserve histórico

5. **Testes**
   - Isole componentes
   - Simule erros
   - Verifique limites

## Exemplos de Depuração

### 1. Problemas de Renderização
```typescript
// src/debug/examples/render.tsx
import { useRenderDebug } from '../debug/renders';

export const ChartRenderDebug = (props: Props) => {
  const renderCount = useRenderDebug('Chart');
  
  useEffect(() => {
    console.log('Props mudaram:', {
      anterior: prevProps.current,
      atual: props,
    });
    prevProps.current = props;
  }, [props]);

  return (
    <div>
      <div>Renderizações: {renderCount}</div>
      <ProgressMonitoringChart {...props} />
    </div>
  );
};
```

### 2. Problemas de Performance
```typescript
// src/debug/examples/performance.tsx
import { usePerformanceDebug } from '../debug/performance';

export const ChartPerformanceDebug = (props: Props) => {
  usePerformanceDebug();
  
  return (
    <Profiler id="chart" onRender={console.log}>
      <ProgressMonitoringChart {...props} />
    </Profiler>
  );
};
```

### 3. Problemas de Memória
```typescript
// src/debug/examples/memory.tsx
import { useMemoryDebug } from '../debug/memory';

export const ChartMemoryDebug = (props: Props) => {
  useMemoryDebug();
  
  return (
    <ErrorBoundary>
      <ProgressMonitoringChart {...props} />
    </ErrorBoundary>
  );
};
```

## Referências

- [React DevTools](https://reactjs.org/blog/2019/08/15/new-react-devtools.html)
- [Chrome DevTools](https://developers.google.com/web/tools/chrome-devtools)
- [Performance Profiling](https://reactjs.org/docs/profiler.html)
- [Memory Management](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Memory_Management)
- [Error Boundaries](https://reactjs.org/docs/error-boundaries.html) 