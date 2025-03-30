# Padrões de Código

## Estrutura de Arquivos

```
src/
  ├── components/
  │   ├── referrals/
  │   │   ├── ReferralBuilder/
  │   │   │   ├── index.tsx
  │   │   │   ├── styles.ts
  │   │   │   └── types.ts
  │   │   ├── ReferralList/
  │   │   ├── ReferralDetails/
  │   │   ├── ReferralDashboard/
  │   │   └── ReferralTimeline/
  │   └── common/
  ├── hooks/
  │   ├── useReferral/
  │   ├── useReferralList/
  │   └── useReferralMetrics/
  ├── services/
  │   ├── referralService/
  │   ├── notificationService/
  │   └── storageService/
  ├── contexts/
  │   └── ReferralContext/
  ├── types/
  │   └── referral.ts
  ├── utils/
  │   ├── date.ts
  │   ├── format.ts
  │   └── validation.ts
  └── api/
      └── endpoints.ts
```

## Componentes

### Estrutura Básica

```typescript
import React from 'react';
import { ComponentProps } from './types';
import { Container } from './styles';

export const Component: React.FC<ComponentProps> = ({
  prop1,
  prop2,
  children
}) => {
  // Hooks
  const [state, setState] = useState();
  const { data } = useQuery();

  // Handlers
  const handleEvent = useCallback(() => {
    // Lógica
  }, []);

  // Render helpers
  const renderItem = useCallback(() => {
    // Lógica de renderização
  }, []);

  return (
    <Container>
      {/* JSX */}
    </Container>
  );
};
```

### Organização de Props

```typescript
// types.ts
export interface ComponentProps extends BaseProps {
  // Props específicas
  data: DataType;
  onAction: (data: ActionData) => void;

  // Props opcionais
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}
```

### Estilos

```typescript
// styles.ts
import styled from '@emotion/styled';

export const Container = styled.div`
  // Estilos base
  display: flex;
  padding: ${({ theme }) => theme.spacing(2)};

  // Variantes
  ${({ variant }) => variant === 'primary' && `
    background: ${({ theme }) => theme.palette.primary.main};
  `}

  // Responsividade
  ${({ theme }) => theme.breakpoints.down('sm')} {
    flex-direction: column;
  }
`;
```

## Hooks

### Estrutura Básica

```typescript
// useHook.ts
export function useHook(params: Params) {
  // State
  const [state, setState] = useState();

  // Effects
  useEffect(() => {
    // Side effects
  }, []);

  // Callbacks
  const handleAction = useCallback(() => {
    // Lógica
  }, []);

  // Return
  return {
    state,
    handleAction
  };
}
```

### Composição de Hooks

```typescript
function useComposedHook() {
  // Hooks base
  const hook1 = useHook1();
  const hook2 = useHook2();

  // Composição
  const composedValue = useMemo(() => {
    // Lógica de composição
  }, [hook1, hook2]);

  return {
    ...hook1,
    ...hook2,
    composedValue
  };
}
```

## Serviços

### Estrutura Básica

```typescript
// service.ts
export class Service {
  private api: Api;

  constructor(api: Api) {
    this.api = api;
  }

  async getData(params: Params): Promise<Response> {
    try {
      const response = await this.api.get('/endpoint', { params });
      return response.data;
    } catch (error) {
      throw new ServiceError('Erro ao obter dados', error);
    }
  }
}
```

### Tratamento de Erros

```typescript
// errors.ts
export class ServiceError extends Error {
  constructor(
    message: string,
    public originalError: unknown
  ) {
    super(message);
    this.name = 'ServiceError';
  }
}
```

## Contextos

### Estrutura Básica

```typescript
// context.ts
const Context = createContext<ContextType | null>(null);

export function Provider({ children }: PropsWithChildren) {
  // State
  const [state, dispatch] = useReducer(reducer, initialState);

  // Value
  const value = useMemo(() => ({
    state,
    dispatch
  }), [state]);

  return (
    <Context.Provider value={value}>
      {children}
    </Context.Provider>
  );
}
```

### Hook de Contexto

```typescript
// useContext.ts
export function useAppContext() {
  const context = useContext(Context);

  if (!context) {
    throw new Error('useAppContext must be used within Provider');
  }

  return context;
}
```

## Utilitários

### Funções Puras

```typescript
// utils.ts
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('pt-BR').format(date);
}

export function calculateTotal(items: Item[]): number {
  return items.reduce((total, item) => total + item.value, 0);
}
```

### Constantes

```typescript
// constants.ts
export const STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

export const PRIORITIES = ['low', 'medium', 'high', 'urgent'] as const;
```

## Boas Práticas

### 1. Nomenclatura

- PascalCase para componentes
- camelCase para funções e variáveis
- UPPER_CASE para constantes
- kebab-case para arquivos CSS

### 2. Organização

- Um componente por arquivo
- Separar lógica de UI
- Agrupar imports por tipo
- Ordenar métodos logicamente

### 3. Performance

- Usar memo quando necessário
- Evitar re-renders desnecessários
- Lazy loading de componentes
- Otimizar loops e cálculos

### 4. Segurança

- Validar inputs
- Sanitizar dados
- Tratar erros adequadamente
- Seguir princípios SOLID

### 5. Manutenibilidade

- Documentar código complexo
- Manter funções pequenas
- Evitar duplicação
- Usar tipos fortes

## Exemplos

### Componente

```typescript
import React, { useCallback, useMemo } from 'react';
import { ReferralCard } from './styles';
import { ReferralCardProps } from './types';
import { formatDate } from '@/utils/date';

export const ReferralCard: React.FC<ReferralCardProps> = ({
  referral,
  onSelect,
  className
}) => {
  // Memos
  const formattedDate = useMemo(() => (
    formatDate(referral.dueDate)
  ), [referral.dueDate]);

  // Handlers
  const handleClick = useCallback(() => {
    onSelect(referral.id);
  }, [onSelect, referral.id]);

  return (
    <ReferralCard
      className={className}
      onClick={handleClick}
      priority={referral.priority}
    >
      <h3>{referral.title}</h3>
      <p>{referral.description}</p>
      <span>{formattedDate}</span>
    </ReferralCard>
  );
};
```

### Hook

```typescript
function useReferralFilters(initialFilters: FilterParams) {
  // State
  const [filters, setFilters] = useState(initialFilters);
  const [results, setResults] = useState<Referral[]>([]);

  // Effects
  useEffect(() => {
    const fetchResults = async () => {
      try {
        const data = await referralService.listReferrals(filters);
        setResults(data);
      } catch (error) {
        console.error('Erro ao buscar encaminhamentos:', error);
      }
    };

    fetchResults();
  }, [filters]);

  // Handlers
  const updateFilters = useCallback((newFilters: Partial<FilterParams>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  return {
    filters,
    results,
    updateFilters
  };
}
```

### Serviço

```typescript
class ReferralService {
  private cache: CacheService;
  private api: Api;

  constructor(api: Api, cache: CacheService) {
    this.api = api;
    this.cache = cache;
  }

  async getReferral(id: string): Promise<Referral> {
    const cacheKey = `referral:${id}`;

    // Tentar cache
    const cached = await this.cache.get<Referral>(cacheKey);
    if (cached) return cached;

    // Buscar da API
    try {
      const response = await this.api.get(`/referrals/${id}`);
      const referral = response.data;

      // Salvar no cache
      await this.cache.set(cacheKey, referral, 5 * 60 * 1000);

      return referral;
    } catch (error) {
      throw new ServiceError('Erro ao buscar encaminhamento', error);
    }
  }
}
```

## Linting

### ESLint

```javascript
// .eslintrc.js
module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended'
  ],
  rules: {
    'react/prop-types': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn'
  }
};
```

### Prettier

```javascript
// .prettierrc
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2
}
```

## Git

### Commits

```bash
# Formato
type(scope): description

# Exemplos
feat(referral): add referral builder component
fix(api): handle error in referral service
docs(readme): update installation instructions
```

### Branches

```bash
# Formato
type/description

# Exemplos
feature/referral-builder
bugfix/api-error-handling
hotfix/security-vulnerability
```

## Scripts

```json
{
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "lint": "eslint src --ext .ts,.tsx",
    "format": "prettier --write \"src/**/*.{ts,tsx}\"",
    "typecheck": "tsc --noEmit"
  }
}
```
