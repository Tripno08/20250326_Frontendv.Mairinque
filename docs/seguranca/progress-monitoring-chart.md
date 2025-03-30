# Segurança - ProgressMonitoringChart

## Visão Geral

Este documento descreve as implementações de segurança para o componente `ProgressMonitoringChart`, garantindo a proteção dos dados e a integridade do componente.

## Implementações

### 1. Validação de Dados
```typescript
// src/validators/chartData.ts
import { z } from 'zod';

export const ChartDataSchema = z.object({
  date: z.date(),
  value: z.number().finite(),
  intervention: z.string().optional(),
  notes: z.string().optional(),
});

export const ChartDataArraySchema = z.array(ChartDataSchema);

export const validateChartData = (data: unknown) => {
  return ChartDataArraySchema.safeParse(data);
};

export const sanitizeChartData = (data: unknown) => {
  const result = validateChartData(data);
  if (!result.success) {
    throw new Error('Dados inválidos');
  }
  return result.data;
};
```

### 2. Proteção contra XSS
```typescript
// src/components/ChartTooltip.tsx
import DOMPurify from 'dompurify';
import { memo } from 'react';

export const ChartTooltip = memo(({ content }: { content: string }) => {
  const sanitizedContent = DOMPurify.sanitize(content, {
    ALLOWED_TAGS: ['p', 'b', 'i', 'em', 'strong'],
    ALLOWED_ATTR: ['class'],
  });

  return (
    <div
      className="chart-tooltip"
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
    />
  );
});

ChartTooltip.displayName = 'ChartTooltip';
```

### 3. Autenticação e Autorização
```typescript
// src/hooks/useChartPermissions.ts
import { useAuth } from '@/contexts/auth';

export const useChartPermissions = () => {
  const { user, roles } = useAuth();

  const canViewChart = () => {
    return roles.includes('viewer') || roles.includes('admin');
  };

  const canEditChart = () => {
    return roles.includes('editor') || roles.includes('admin');
  };

  const canExportData = () => {
    return roles.includes('exporter') || roles.includes('admin');
  };

  return {
    canViewChart,
    canEditChart,
    canExportData,
  };
};

// src/components/ProgressMonitoringChart.tsx
import { useChartPermissions } from '../hooks/useChartPermissions';

export const ProgressMonitoringChart = ({ data, ...props }) => {
  const { canViewChart } = useChartPermissions();

  if (!canViewChart()) {
    return <div>Acesso não autorizado</div>;
  }

  return (
    // ... implementação do gráfico
  );
};
```

### 4. Proteção de Dados
```typescript
// src/utils/encryption.ts
import { AES, enc } from 'crypto-js';

export const encryptData = (data: unknown, key: string) => {
  const jsonStr = JSON.stringify(data);
  return AES.encrypt(jsonStr, key).toString();
};

export const decryptData = (encryptedData: string, key: string) => {
  const bytes = AES.decrypt(encryptedData, key);
  const decryptedStr = bytes.toString(enc.Utf8);
  return JSON.parse(decryptedStr);
};

// src/components/ProgressMonitoringChart.tsx
import { encryptData, decryptData } from '../utils/encryption';

export const ProgressMonitoringChart = ({ encryptedData, encryptionKey }) => {
  const decryptedData = useMemo(() => {
    try {
      return decryptData(encryptedData, encryptionKey);
    } catch (error) {
      console.error('Erro ao descriptografar dados:', error);
      return [];
    }
  }, [encryptedData, encryptionKey]);

  return (
    // ... implementação do gráfico com dados descriptografados
  );
};
```

### 5. Segurança de API
```typescript
// src/api/interceptors.ts
import axios from 'axios';

const api = axios.create();

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirecionar para login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

### 6. Segurança de Estado
```typescript
// src/hooks/useChartState.ts
import { useReducer } from 'react';
import { validateChartData } from '../validators/chartData';

type ChartState = {
  data: ChartData[];
  zoom: number;
  selection: number[];
};

type ChartAction =
  | { type: 'SET_DATA'; payload: ChartData[] }
  | { type: 'SET_ZOOM'; payload: number }
  | { type: 'SET_SELECTION'; payload: number[] };

const chartReducer = (state: ChartState, action: ChartAction): ChartState => {
  switch (action.type) {
    case 'SET_DATA':
      const validationResult = validateChartData(action.payload);
      if (!validationResult.success) {
        console.error('Dados inválidos:', validationResult.error);
        return state;
      }
      return { ...state, data: action.payload };
    
    case 'SET_ZOOM':
      if (action.payload < 0.1 || action.payload > 10) {
        console.error('Nível de zoom inválido');
        return state;
      }
      return { ...state, zoom: action.payload };
    
    case 'SET_SELECTION':
      if (!Array.isArray(action.payload) || action.payload.some(x => !Number.isInteger(x))) {
        console.error('Seleção inválida');
        return state;
      }
      return { ...state, selection: action.payload };
    
    default:
      return state;
  }
};

export const useChartState = (initialData: ChartData[]) => {
  const [state, dispatch] = useReducer(chartReducer, {
    data: initialData,
    zoom: 1,
    selection: [],
  });

  return {
    state,
    dispatch,
  };
};
```

## Boas Práticas

1. **Validação**
   - Valide todos os inputs
   - Use schemas fortes
   - Sanitize dados HTML

2. **Autenticação**
   - Use tokens JWT
   - Implemente refresh
   - Valide permissões

3. **Proteção de Dados**
   - Criptografe dados sensíveis
   - Use chaves seguras
   - Mascare informações

4. **Segurança de API**
   - Use HTTPS
   - Valide tokens
   - Trate erros

5. **Segurança de Estado**
   - Valide mudanças
   - Proteja atualizações
   - Monitore alterações

## Exemplos de Implementação

### 1. Proteção contra Injeção
```typescript
// src/components/ChartFilter.tsx
import { sanitizeInput } from '../utils/security';

export const ChartFilter = ({ onFilter }: { onFilter: (query: string) => void }) => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const query = sanitizeInput(formData.get('query') as string);
    onFilter(query);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="query"
        pattern="[A-Za-z0-9\s]+"
        title="Apenas letras, números e espaços"
      />
      <button type="submit">Filtrar</button>
    </form>
  );
};
```

### 2. Proteção contra CSRF
```typescript
// src/api/config.ts
import axios from 'axios';

const api = axios.create({
  withCredentials: true,
  headers: {
    'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content'),
  },
});

export default api;
```

### 3. Proteção contra Clickjacking
```typescript
// src/components/ChartFrame.tsx
export const ChartFrame = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    if (window.self !== window.top) {
      window.top.location.href = window.self.location.href;
    }
  }, []);

  return (
    <div className="chart-frame">
      {children}
    </div>
  );
};
```

## Referências

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [React Security](https://reactjs.org/docs/security.html)
- [TypeScript Security](https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html)
- [Web Security](https://developer.mozilla.org/en-US/docs/Web/Security)
- [API Security](https://github.com/shieldfy/API-Security-Checklist) 