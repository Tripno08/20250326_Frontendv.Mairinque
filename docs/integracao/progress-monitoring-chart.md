# Integração - ProgressMonitoringChart

## Visão Geral

Este documento descreve como integrar o componente `ProgressMonitoringChart` em diferentes contextos e aplicações, incluindo exemplos de uso e boas práticas.

## Instalação

### 1. Dependências
```json
{
  "dependencies": {
    "@mui/material": "^5.15.0",
    "@mui/icons-material": "^5.15.0",
    "recharts": "^2.12.0",
    "date-fns": "^3.3.0",
    "lodash": "^4.17.21"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/lodash": "^4.14.202",
    "typescript": "^5.3.0"
  }
}
```

### 2. Configuração
```typescript
// tsconfig.json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx"
  }
}
```

## Uso Básico

### 1. Importação
```typescript
import { ProgressMonitoringChart } from '@innerview/components';
```

### 2. Implementação
```typescript
const MyComponent = () => {
  const data = [
    {
      date: new Date('2024-01-01'),
      value: 75,
      intervention: 'A',
      notes: 'Nota 1',
    },
    // ... mais dados
  ];

  const benchmarks = [
    {
      name: 'Benchmark 1',
      value: 70,
      color: '#FF0000',
      description: 'Descrição 1',
    },
  ];

  const goals = [
    {
      name: 'Meta 1',
      targetValue: 90,
      deadline: new Date('2024-06-30'),
      color: '#00FF00',
      description: 'Descrição 2',
    },
  ];

  return (
    <ProgressMonitoringChart
      data={data}
      benchmarks={benchmarks}
      goals={goals}
      onInterventionClick={(intervention) => {
        console.log('Intervenção clicada:', intervention);
      }}
    />
  );
};
```

## Integração com APIs

### 1. Fetch de Dados
```typescript
const useProgressData = () => {
  const [data, setData] = useState<ProgressData>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/progress');
        const json = await response.json();
        setData(json);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
};
```

### 2. React Query
```typescript
const useProgressData = () => {
  return useQuery<ProgressData>('progress', async () => {
    const response = await fetch('/api/progress');
    return response.json();
  });
};
```

## Integração com Temas

### 1. Material-UI
```typescript
const useChartTheme = () => {
  const theme = useTheme();
  
  return {
    colors: {
      primary: theme.palette.primary.main,
      secondary: theme.palette.secondary.main,
      background: theme.palette.background.paper,
      text: theme.palette.text.primary,
    },
    typography: {
      fontFamily: theme.typography.fontFamily,
      fontSize: theme.typography.fontSize,
    },
  };
};
```

### 2. Tema Personalizado
```typescript
const customTheme = {
  colors: {
    primary: '#1976D2',
    secondary: '#FF4081',
    success: '#4CAF50',
    warning: '#FFC107',
    error: '#F44336',
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
    fontSize: 14,
  },
};
```

## Integração com Estado

### 1. Context API
```typescript
const ProgressContext = createContext<{
  data: ProgressData;
  setData: (data: ProgressData) => void;
}>({
  data: [],
  setData: () => {},
});

const ProgressProvider = ({ children }: { children: React.ReactNode }) => {
  const [data, setData] = useState<ProgressData>([]);

  return (
    <ProgressContext.Provider value={{ data, setData }}>
      {children}
    </ProgressContext.Provider>
  );
};
```

### 2. Redux
```typescript
const progressSlice = createSlice({
  name: 'progress',
  initialState: {
    data: [] as ProgressData,
    loading: false,
    error: null as Error | null,
  },
  reducers: {
    setData: (state, action: PayloadAction<ProgressData>) => {
      state.data = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<Error | null>) => {
      state.error = action.payload;
    },
  },
});
```

## Integração com Roteamento

### 1. React Router
```typescript
const ProgressRoutes = () => {
  return (
    <Routes>
      <Route
        path="/progress"
        element={
          <ProgressProvider>
            <ProgressMonitoringChart />
          </ProgressProvider>
        }
      />
    </Routes>
  );
};
```

### 2. Parâmetros de URL
```typescript
const useProgressParams = () => {
  const { dateRange } = useParams<{ dateRange: string }>();
  
  return {
    start: dateRange ? new Date(dateRange.split('-')[0]) : undefined,
    end: dateRange ? new Date(dateRange.split('-')[1]) : undefined,
  };
};
```

## Boas Práticas

1. **Gerenciamento de Estado**
   - Use Context API para estado global
   - Use Redux para estado complexo
   - Evite prop drilling

2. **Performance**
   - Implemente memoização
   - Use virtualização para grandes conjuntos
   - Otimize re-renders

3. **Acessibilidade**
   - Implemente roles ARIA
   - Suporte navegação por teclado
   - Mantenha contraste adequado

4. **Testes**
   - Teste integração
   - Teste casos de erro
   - Teste acessibilidade

5. **Documentação**
   - Documente props
   - Documente callbacks
   - Mantenha exemplos atualizados

## Exemplos de Integração

### 1. Dashboard Completo
```typescript
const Dashboard = () => {
  const { data, loading, error } = useProgressData();
  const theme = useChartTheme();

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4">Dashboard de Progresso</Typography>
      <ProgressMonitoringChart
        data={data}
        benchmarks={benchmarks}
        goals={goals}
        theme={theme}
      />
    </Box>
  );
};
```

### 2. Filtros e Controles
```typescript
const ProgressView = () => {
  const [dateRange, setDateRange] = useState<DateRange | null>(null);
  const [selectedIntervention, setSelectedIntervention] = useState<string | null>(null);

  return (
    <Box>
      <DateRangePicker
        value={dateRange}
        onChange={setDateRange}
      />
      <InterventionFilter
        value={selectedIntervention}
        onChange={setSelectedIntervention}
      />
      <ProgressMonitoringChart
        data={data}
        dateRange={dateRange}
        selectedIntervention={selectedIntervention}
      />
    </Box>
  );
};
```

## Referências

- [React Documentation](https://reactjs.org/docs)
- [Material-UI](https://mui.com/)
- [Recharts](https://recharts.org/)
- [React Query](https://tanstack.com/query/latest)
- [Redux Toolkit](https://redux-toolkit.js.org/) 