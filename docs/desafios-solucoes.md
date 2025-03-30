# Desafios e Soluções

## Setup e Configuração

### 1. Compatibilidade de Versões
**Desafio**: Incompatibilidade entre Next.js e Material UI
**Solução**:
```json
{
  "dependencies": {
    "@mui/material": "^5.15.11",
    "@emotion/react": "^11.11.3",
    "@emotion/styled": "^11.11.0",
    "next": "14.1.0"
  }
}
```

### 2. Conflito Material UI e Tailwind
**Desafio**: Estilos conflitantes entre Material UI e Tailwind
**Solução**: Configuração do Tailwind para respeitar classes do Material UI
```typescript
// tailwind.config.ts
export default {
  important: true,
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          main: '#1976d2',
          light: '#42a5f5',
          dark: '#1565c0',
        },
      },
    },
  },
}
```

## Tipagem e Type Safety

### 1. Tipagem Estrita
**Desafio**: Garantir type safety em componentes complexos
**Solução**: Interfaces bem definidas e validação de props
```typescript
interface DomainSummaryProps {
  data: DomainSummaryData;
  isLoading?: boolean;
  error?: Error | null;
}

interface DomainSummaryData {
  reading: number;
  math: number;
  writing: number;
}
```

### 2. Validação de Props
**Desafio**: Props inválidas causando erros em runtime
**Solução**: Validação com PropTypes e TypeScript
```typescript
const DomainSummary: React.FC<DomainSummaryProps> = ({
  data,
  isLoading = false,
  error = null,
}) => {
  // Validação de dados
  if (!data || typeof data !== 'object') {
    return <ErrorComponent message="Dados inválidos" />;
  }
  // ...
};
```

## Performance

### 1. Re-renders Desnecessários
**Desafio**: Componentes re-renderizando sem necessidade
**Solução**: Memoização e useMemo
```typescript
const MemoizedChart = React.memo(ChartComponent);
const chartData = useMemo(() => processData(data), [data]);
```

### 2. Carregamento de Dados
**Desafio**: Gerenciamento eficiente de dados
**Solução**: React Query com cache
```typescript
const { data, isLoading, error } = useQuery(
  ['dashboard', filters],
  () => fetchDashboardData(filters),
  {
    staleTime: 5 * 60 * 1000,
    cacheTime: 30 * 60 * 1000,
  }
);
```

## Estado Global

### 1. Complexidade do Estado
**Desafio**: Gerenciamento de estado complexo
**Solução**: Zustand com slices
```typescript
interface DashboardStore {
  filters: DashboardFilters;
  setFilters: (filters: DashboardFilters) => void;
  data: DashboardData | null;
  setData: (data: DashboardData) => void;
}
```

### 2. Sincronização de Estado
**Desafio**: Estados desincronizados entre componentes
**Solução**: Context API com Zustand
```typescript
const DashboardContext = createContext<DashboardStore | null>(null);
```

## Testes

### 1. Componentes Complexos
**Desafio**: Testar componentes com múltiplas dependências
**Solução**: Mocks e testes isolados
```typescript
jest.mock('recharts', () => ({
  RadarChart: () => <div data-testid="mock-radar-chart" />,
  PolarGrid: () => null,
  PolarAngleAxis: () => null,
  PolarRadiusAxis: () => null,
  Radar: () => null,
}));
```

### 2. Testes de Integração
**Desafio**: Testar fluxos completos
**Solução**: Testes E2E com Cypress
```typescript
describe('Dashboard Flow', () => {
  it('should load and display data', () => {
    cy.visit('/dashboard');
    cy.get('[data-testid="tier-distribution"]').should('exist');
    cy.get('[data-testid="domain-summary"]').should('exist');
  });
});
```

## Acessibilidade

### 1. WCAG Compliance
**Desafio**: Garantir acessibilidade
**Solução**: Implementação de ARIA labels e roles
```typescript
<Box
  role="region"
  aria-label="Distribuição por Tier"
  aria-live="polite"
>
  {/* conteúdo */}
</Box>
```

### 2. Navegação por Teclado
**Desafio**: Navegação acessível
**Solução**: Foco e tabIndex
```typescript
<TabList
  aria-label="Filtros do dashboard"
  onChange={handleChange}
  sx={{ '& .MuiTabs-indicator': { display: 'none' } }}
>
  {/* tabs */}
</TabList>
```

## Documentação

### 1. Manutenção da Documentação
**Desafio**: Documentação desatualizada
**Solução**: Documentação automatizada
```typescript
/**
 * @component DomainSummary
 * @description Exibe um resumo do desempenho por domínio
 * @param {DomainSummaryProps} props
 * @example
 * <DomainSummary
 *   data={{ reading: 75, math: 80, writing: 70 }}
 *   isLoading={false}
 * />
 */
```

### 2. Exemplos de Uso
**Desafio**: Falta de exemplos práticos
**Solução**: Storybook com casos de uso
```typescript
export default {
  title: 'Dashboard/DomainSummary',
  component: DomainSummary,
  parameters: {
    docs: {
      description: {
        component: 'Componente para exibir resumo por domínio',
      },
    },
  },
};
```

## Lições Aprendidas

1. **Planejamento**:
   - Definir arquitetura antes de começar
   - Documentar decisões técnicas
   - Estabelecer padrões claros

2. **Desenvolvimento**:
   - Começar com tipagem forte
   - Implementar testes desde o início
   - Manter componentes pequenos e focados

3. **Manutenção**:
   - Revisar código regularmente
   - Atualizar documentação
   - Monitorar performance

## Próximos Passos

1. **Melhorias**:
   - Implementar CI/CD
   - Adicionar análise estática
   - Melhorar cobertura de testes

2. **Novas Features**:
   - Sistema de temas
   - Internacionalização
   - PWA support

3. **Otimizações**:
   - Bundle size
   - Performance
   - Acessibilidade

## Desafios Técnicos

### 1. Tipagem do Material UI

#### Desafio
Ao implementar o design system, encontramos problemas com a tipagem do Material UI, especialmente:
- Referências circulares nas interfaces de tema
- Propriedades não reconhecidas em componentes estendidos
- Conflitos entre tipos do Material UI e nossas customizações

#### Solução
1. **Reestruturação das Declarações de Tipo**
   ```typescript
   // Antes
   interface Palette {
     primary: Palette['primary'] & {
       main: string
       light: string
       dark: string
       contrastText: string
     }
   }

   // Depois
   interface CustomPaletteColor {
     main: string
     light: string
     dark: string
     contrastText: string
   }

   interface Palette {
     primary: CustomPaletteColor
     secondary: CustomPaletteColor
     // ...
   }
   ```

2. **Extensão de Componentes**
   ```typescript
   interface ActionButtonProps extends Omit<ButtonProps, 'variant'> {
     variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info'
     loading?: boolean
   }
   ```

3. **Declaração de Módulos**
   ```typescript
   declare module '@mui/material/styles' {
     interface Theme {
       status: {
         danger: string
       }
     }
   }
   ```

#### Próximos Passos
1. [ ] Revisar todas as declarações de tipo
2. [ ] Implementar testes de tipo
3. [ ] Documentar padrões de tipagem
4. [ ] Criar exemplos de uso

### 2. Compatibilidade de Versões

#### Desafio
Incompatibilidade entre versões do Material UI e suas dependências.

#### Solução
1. Atualização do `package.json`:
   ```json
   {
     "dependencies": {
       "@mui/material": "^5.15.0",
       "@emotion/react": "^11.11.0",
       "@emotion/styled": "^11.11.0"
     }
   }
   ```

2. Configuração do TypeScript:
   ```json
   {
     "compilerOptions": {
       "skipLibCheck": true,
       "strict": true
     }
   }
   ```

### 3. Testes de Componentes

#### Desafio
Dificuldade em testar componentes que dependem do tema do Material UI.

#### Solução
1. Criação de um wrapper de teste:
   ```typescript
   const renderWithTheme = (ui: React.ReactElement) => {
     return render(
       <ThemeProvider>
         {ui}
       </ThemeProvider>
     )
   }
   ```

2. Uso nos testes:
   ```typescript
   it('renderiza corretamente', () => {
     renderWithTheme(<GradientCard>Teste</GradientCard>)
     expect(screen.getByText('Teste')).toBeInTheDocument()
   })
   ```

## Boas Práticas

### 1. Tipagem
- Usar interfaces para props de componentes
- Evitar referências circulares
- Documentar tipos complexos
- Utilizar utilitários do TypeScript

### 2. Testes
- Testar comportamento, não implementação
- Usar mocks quando necessário
- Manter testes simples e focados
- Documentar casos de teste

### 3. Componentes
- Seguir princípios SOLID
- Manter componentes pequenos e reutilizáveis
- Documentar props e comportamentos
- Implementar acessibilidade

## Referências
- [Documentação do Material UI](https://mui.com/material-ui/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)

# Desafios e Soluções no Desenvolvimento

## 1. Tipagem TypeScript

### Desafios
1. **Props Dinâmicas em Componentes**
   - Componentes precisavam aceitar diferentes tipos de dados
   - Props opcionais com valores padrão
   - Tipos complexos para eventos e callbacks

2. **Generics em Hooks**
   - Hooks precisavam ser tipados para diferentes tipos de dados
   - Reutilização de tipos entre diferentes hooks
   - Tipagem de retornos assíncronos

3. **Estados e Transições**
   - Estados complexos com múltiplas transições
   - Validação de estados válidos
   - Tipagem de ações e eventos

### Soluções
1. **Tipos Utilitários**
   ```typescript
   // Tipos base para props
   type BaseProps = {
     className?: string;
     style?: React.CSSProperties;
     children?: React.ReactNode;
   };

   // Tipos para variantes
   type VariantProps<T extends { variants: any }> = {
     variant?: keyof T['variants'];
   };

   // Tipos para estados
   type StateMachine<T extends string> = {
     current: T;
     transitions: Record<T, T[]>;
   };
   ```

2. **Generics em Hooks**
   ```typescript
   // Hook genérico para dados
   function useData<T>(key: string) {
     return useQuery<T>({
       queryKey: [key],
       queryFn: () => fetchData<T>(key),
     });
   }

   // Hook para mutações
   function useMutation<T, R = void>(mutationFn: (data: T) => Promise<R>) {
     return useMutation({
       mutationFn,
       onSuccess: () => {
         queryClient.invalidateQueries();
       },
     });
   }
   ```

3. **Estados Discriminados**
   ```typescript
   type AssessmentState =
     | { status: 'draft'; canEdit: true }
     | { status: 'published'; canEdit: false }
     | { status: 'closed'; canEdit: false };

   function useAssessmentState(assessment: Assessment): AssessmentState {
     // Lógica de estado
   }
   ```

## 2. Performance

### Desafios
1. **Re-renders Desnecessários**
   - Componentes re-renderizando sem necessidade
   - Props mudando frequentemente
   - Estados globais causando re-renders

2. **Carregamento de Dados**
   - Múltiplas requisições simultâneas
   - Cache ineficiente
   - Estados de loading complexos

3. **Bundle Size**
   - Dependências pesadas
   - Código não utilizado
   - Imagens não otimizadas

### Soluções
1. **Otimização de Renderização**
   ```typescript
   // Memoização de componentes
   const MemoizedComponent = React.memo(Component, (prev, next) => {
     return prev.id === next.id;
   });

   // Memoização de valores
   const memoizedValue = useMemo(() => {
     return expensiveCalculation(props);
   }, [props]);

   // Memoização de callbacks
   const memoizedCallback = useCallback(() => {
     doSomething(props);
   }, [props]);
   ```

2. **Gerenciamento de Cache**
   ```typescript
   // Configuração do React Query
   const queryClient = new QueryClient({
     defaultOptions: {
       queries: {
         staleTime: 5 * 60 * 1000, // 5 minutos
         cacheTime: 30 * 60 * 1000, // 30 minutos
         refetchOnWindowFocus: false,
       },
     },
   });

   // Invalidação inteligente
   function useAssessment(id: string) {
     return useQuery({
       queryKey: ['assessment', id],
       queryFn: () => fetchAssessment(id),
       enabled: !!id,
     });
   }
   ```

3. **Otimização de Bundle**
   ```typescript
   // Lazy loading de componentes
   const HeavyComponent = lazy(() => import('./HeavyComponent'));

   // Code splitting de rotas
   const routes = [
     {
       path: '/dashboard',
       component: lazy(() => import('./Dashboard')),
     },
   ];
   ```

## 3. Acessibilidade

### Desafios
1. **Compatibilidade com Leitores de Tela**
   - Estrutura semântica incorreta
   - Falta de ARIA labels
   - Navegação por teclado

2. **Contraste e Cores**
   - Contraste insuficiente
   - Cores não acessíveis
   - Modo escuro

3. **Interatividade**
   - Estados focáveis
   - Feedback visual
   - Mensagens de erro

### Soluções
1. **Semântica e ARIA**
   ```typescript
   // Componente acessível
   function AccessibleButton({ children, ...props }) {
     return (
       <button
         role="button"
         aria-label={props['aria-label']}
         {...props}
       >
         {children}
       </button>
     );
   }

   // Feedback para leitores
   function StatusMessage({ status }) {
     return (
       <div
         role="status"
         aria-live="polite"
       >
         {status}
       </div>
     );
   }
   ```

2. **Tema Acessível**
   ```typescript
   // Configuração de cores
   const theme = createTheme({
     palette: {
       primary: {
         main: '#1976d2',
         contrastText: '#ffffff',
       },
       background: {
         default: '#ffffff',
         paper: '#f5f5f5',
       },
     },
   });

   // Modo escuro
   const darkTheme = createTheme({
     palette: {
       mode: 'dark',
       // ... outras configurações
     },
   });
   ```

3. **Feedback e Estados**
   ```typescript
   // Componente com feedback
   function FormField({ error, ...props }) {
     return (
       <div>
         <input
           aria-invalid={!!error}
           aria-describedby={error ? 'error-message' : undefined}
           {...props}
         />
         {error && (
           <div
             id="error-message"
             role="alert"
           >
             {error}
           </div>
         )}
       </div>
     );
   }
   ```

## 4. Testes

### Desafios
1. **Configuração do Ambiente**
   - Setup com TypeScript
   - Mocks complexos
   - Ambiente isolado

2. **Cobertura de Testes**
   - Componentes complexos
   - Hooks assíncronos
   - Integrações

3. **Manutenção**
   - Testes frágeis
   - Falsos positivos
   - Performance

### Soluções
1. **Setup de Testes**
   ```typescript
   // Configuração do Jest
   export default {
     preset: 'ts-jest',
     testEnvironment: 'jsdom',
     setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
     moduleNameMapper: {
       '^@/(.*)$': '<rootDir>/src/$1',
     },
   };

   // Setup de testes
   import '@testing-library/jest-dom';
   import { server } from './mocks/server';

   beforeAll(() => server.listen());
   afterEach(() => server.resetHandlers());
   afterAll(() => server.close());
   ```

2. **Testes de Componentes**
   ```typescript
   // Teste de componente
   describe('GradientCard', () => {
     it('renderiza com gradiente padrão', () => {
       render(<GradientCard>Conteúdo</GradientCard>);
       expect(screen.getByText('Conteúdo')).toBeInTheDocument();
     });

     it('aplica gradiente personalizado', () => {
       render(
         <GradientCard gradient="linear-gradient(45deg, #ff0000, #00ff00)">
           Conteúdo
         </GradientCard>
       );
       const card = screen.getByText('Conteúdo').parentElement;
       expect(card).toHaveStyle({
         background: 'linear-gradient(45deg, #ff0000, #00ff00)',
       });
     });
   });
   ```

3. **Testes de Hooks**
   ```typescript
   // Teste de hook
   describe('useAssessment', () => {
     it('busca dados da avaliação', async () => {
       const { result } = renderHook(() => useAssessment('1'));

       expect(result.current.isLoading).toBe(true);
       await waitFor(() => {
         expect(result.current.isLoading).toBe(false);
       });
       expect(result.current.data).toBeDefined();
     });
   });
   ```

## 5. Cache e Estado

### Desafios
1. **Gerenciamento de Estado**
   - Estados complexos
   - Sincronização entre componentes
   - Persistência

2. **Cache de Dados**
   - Invalidação de cache
   - Dados desatualizados
   - Performance

3. **Offline**
   - Funcionalidade offline
   - Sincronização
   - Conflitos

### Soluções
1. **React Query**
   ```typescript
   // Configuração do cliente
   const queryClient = new QueryClient({
     defaultOptions: {
       queries: {
         staleTime: 5 * 60 * 1000,
         cacheTime: 30 * 60 * 1000,
         retry: (failureCount, error) => {
           return failureCount < 3;
         },
       },
     },
   });

   // Hook personalizado
   function useAssessmentData(id: string) {
     return useQuery({
       queryKey: ['assessment', id],
       queryFn: () => fetchAssessment(id),
       enabled: !!id,
     });
   }
   ```

2. **Invalidação Inteligente**
   ```typescript
   // Mutação com invalidação
   function useUpdateAssessment() {
     const queryClient = useQueryClient();

     return useMutation({
       mutationFn: updateAssessment,
       onSuccess: (data) => {
         queryClient.invalidateQueries(['assessment', data.id]);
         queryClient.invalidateQueries(['assessments']);
       },
     });
   }
   ```

3. **Suporte Offline**
   ```typescript
   // Configuração offline
   const offlineConfig = {
     storage: window.localStorage,
     retry: (failureCount, error) => {
       return failureCount < 3;
     },
   };

   // Sincronização
   function syncOfflineData() {
     const pendingMutations = getPendingMutations();
     for (const mutation of pendingMutations) {
       try {
         await executeMutation(mutation);
         removePendingMutation(mutation.id);
       } catch (error) {
         handleSyncError(error);
       }
     }
   }
   ```

## Conclusão

Os desafios encontrados durante o desenvolvimento foram resolvidos através de:

1. **Tipagem Forte**
   - Uso de TypeScript avançado
   - Generics e tipos utilitários
   - Validação em tempo de compilação

2. **Performance**
   - Otimização de renderização
   - Gerenciamento eficiente de cache
   - Code splitting e lazy loading

3. **Acessibilidade**
   - Implementação de ARIA
   - Semântica HTML
   - Testes com leitores de tela

4. **Testes**
   - Ambiente isolado
   - Mocks tipados
   - Cobertura abrangente

5. **Estado e Cache**
   - React Query
   - Invalidação inteligente
   - Suporte offline

Estas soluções resultaram em um código mais robusto, performático e acessível, mantendo a manutenibilidade e escalabilidade do projeto.

## Frontend

### 8. Implementação do InterventionPlannerBoard

#### Desafio
Criar um sistema de arrastar e soltar (drag and drop) para um quadro de planejamento de intervenções educacionais, permitindo aos usuários planejar visualmente intervenções para estudantes.

#### Soluções Aplicadas

1. **Estratégia de Componentes**
   - Divisão em componentes especializados (DraggableIntervention, DroppableIntervention, InterventionDropzone)
   - Separação de responsabilidades para facilitar manutenção e testes
   - Uso de props bem definidas para cada componente

2. **Biblioteca dnd-kit**
   - Escolha da biblioteca dnd-kit pela sua tipagem nativa com TypeScript
   - Uso do `useDraggable` para itens arrastáveis da biblioteca
   - Uso do `useSortable` para itens que podem ser reordenados
   - Uso do `useDroppable` para a área de soltar intervenções

3. **Gerenciamento de Estado**
   - Gerenciamento de estado local com `useState` para itens do plano
   - Sincronização bidirecional com o estado externo através de props
   - Atualização de posição dos itens ao arrastar e soltar

4. **Feedback Visual**
   - Animações com Framer Motion para criar sensação de interatividade
   - Estado visual de "sobre" quando um item está sendo arrastado para a área
   - Overlay para mostrar o item sendo arrastado
   - Notificações para operações bem-sucedidas

5. **Tipagem e Interfaces**
   - Criação de interfaces específicas para componentes de drag and drop
   - Tipagem estrita de props para garantir consistência
   - Separação de tipos por responsabilidade

#### Desafios Específicos

1. **Tipagem de Eventos de Drag and Drop**
   - **Problema**: Tipagem correta dos eventos e handlers do dnd-kit
   - **Solução**: Uso de interfaces genéricas e tipagem adequada de eventos

2. **Interação entre Biblioteca e Lista Ordenável**
   - **Problema**: Permitir arrastar itens da biblioteca para a lista e reordenar itens já na lista
   - **Solução**: Identificação única para itens e lógica diferenciada para origem e destino

3. **Persistência e Atualização de Posição**
   - **Problema**: Manter ordem correta e persistir após arrastar e soltar
   - **Solução**: Atualização de índices após cada operação e uso de arrayMove do dnd-kit

4. **Testes de Componentes com Drag and Drop**
   - **Problema**: Dificuldade em testar componentes que dependem de drag and drop
   - **Solução**: Mock das funções do dnd-kit para isolar comportamento durante testes

#### Código de Exemplo

```tsx
// Exemplo simplificado do gerenciamento de drag and drop
const handleDragEnd = useCallback((event: DragEndEvent) => {
  const { active, over } = event;

  if (!over) return;

  // Arrastar da biblioteca para o plano
  if (over.id === 'interventions-dropzone' && active.data.current) {
    const intervention = active.data.current.intervention as Intervention;

    // Criar novo item no plano
    const newItem: InterventionPlanItem = {
      id: uuidv4(),
      intervention,
      position: items.length,
    };

    const updatedItems = [...items, newItem];
    setItems(updatedItems);

    // Atualizar plano completo
    onPlanUpdate({
      ...plan,
      items: updatedItems,
      updatedAt: new Date(),
    });

    return;
  }

  // Reordenar itens já no plano
  if (active.id !== over.id) {
    const oldIndex = items.findIndex(item => item.id === active.id);
    const newIndex = items.findIndex(item => item.id === over.id);

    if (oldIndex !== -1 && newIndex !== -1) {
      const updatedItems = arrayMove(items, oldIndex, newIndex).map(
        (item, index) => ({ ...item, position: index })
      );

      setItems(updatedItems);

      // Atualizar plano completo
      onPlanUpdate({
        ...plan,
        items: updatedItems,
        updatedAt: new Date(),
      });
    }
  }
}, [items, onPlanUpdate, plan]);
```

#### Aprendizados

1. A separação de componentes por responsabilidade facilita a manutenção e teste
2. O uso de interfaces bem definidas melhora a experiência de desenvolvimento
3. Feedback visual imediato melhora significativamente a experiência do usuário
4. A integração de tipagem correta com bibliotecas de terceiros exige atenção aos detalhes
5. Testes de componentes com drag and drop requerem estratégia específica de mocking

### 9. Implementação do Sistema de Metas SMART

#### Desafios

1. **Implementação de formulário complexo com validação**
   - O formulário de metas SMART exige múltiplos campos organizados em seções específicas (Specific, Measurable, Achievable, Relevant, Time-bound)
   - Cada campo possui regras de validação próprias
   - Necessidade de campos dinâmicos para os passos de realização da meta

2. **Cálculo de progresso para diferentes cenários**
   - Necessidade de lidar com diferentes tipos de metas: aumento de valor, redução de valor, e valor binário
   - Cálculo de porcentagem de progresso precisava ser adaptativo ao contexto

3. **Visualização de dados históricos**
   - Representação gráfica precisa do progresso ao longo do tempo
   - Exibição de tendências (melhoria/piora) baseadas nos dados históricos
   - Tooltip customizado com informações detalhadas

4. **Integração com sistema de intervenções**
   - Necessidade de vincular metas SMART com intervenções existentes
   - Interface de seleção de intervenções intuitiva

5. **Interfaces TypeScript complexas**
   - Estrutura de dados aninhada para metas SMART
   - Tipos específicos para diferentes aspectos do sistema

6. **Tratamento de datas**
   - Manipulação de datas para início, conclusão e histórico de progresso
   - Cálculos relacionados a prazos (dias restantes, atrasos)

#### Soluções Aplicadas

1. **Organização do formulário**
   ```tsx
   <Grid item xs={12}>
     <Typography variant="h6" gutterBottom sx={{ mt: 2, color: 'primary.main' }}>
       S - Específica
     </Typography>
     <TextField
       fullWidth
       label="Detalhes específicos"
       name="specificDetails"
       value={formData.specificDetails}
       onChange={handleTextChange}
       multiline
       rows={3}
       error={!!errors.specificDetails}
       helperText={errors.specificDetails || 'Descreva detalhadamente o que se pretende alcançar'}
       required
     />
   </Grid>
   ```

2. **Validação de formulário**
   ```tsx
   const validateForm = (): boolean => {
     const newErrors: Record<string, string> = {};

     // Campos obrigatórios
     if (!formData.title.trim()) newErrors.title = 'O título é obrigatório';
     if (!formData.specificDetails.trim()) newErrors.specificDetails = 'Os detalhes específicos são obrigatórios';

     // Validação de datas
     if (formData.startDate && formData.targetDate && formData.startDate >= formData.targetDate) {
       newErrors.targetDate = 'A data alvo deve ser posterior à data de início';
     }

     setErrors(newErrors);
     return Object.keys(newErrors).length === 0;
   };
   ```

3. **Cálculo adaptativo de progresso**
   ```tsx
   const calculateProgress = (goal: SmartGoal): number => {
     const { initialValue, targetValue, currentValue } = goal.measurement;

     // Se o valor alvo é igual ao inicial, consideramos 100% completo se atingido
     if (initialValue === targetValue) {
       return currentValue >= targetValue ? 100 : 0;
     }

     // Se o valor alvo é menor que o inicial (ex: reduzir algo)
     if (targetValue < initialValue) {
       if (currentValue <= targetValue) return 100;
       if (currentValue >= initialValue) return 0;
       return Math.round(((initialValue - currentValue) / (initialValue - targetValue)) * 100);
     }

     // Caso normal: valor alvo maior que inicial (ex: aumentar algo)
     if (currentValue >= targetValue) return 100;
     if (currentValue <= initialValue) return 0;
     return Math.round(((currentValue - initialValue) / (targetValue - initialValue)) * 100);
   };
   ```

4. **Visualização gráfica com Recharts**
   ```tsx
   <LineChart
     data={chartData}
     margin={{
       top: 20,
       right: 30,
       left: 20,
       bottom: 30,
     }}
   >
     <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />

     <XAxis
       dataKey="date"
       stroke={theme.palette.text.secondary}
       tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
       tickMargin={10}
     />

     <YAxis
       domain={[yAxisMin, yAxisMax]}
       stroke={theme.palette.text.secondary}
       tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
       tickMargin={10}
     />

     {/* Linha de valor inicial */}
     <ReferenceLine
       y={initialValue}
       stroke={theme.palette.grey[500]}
       strokeDasharray="3 3"
     />

     {/* Linha de valor alvo */}
     <ReferenceLine
       y={targetValue}
       stroke={theme.palette.success.main}
       strokeDasharray="3 3"
     />

     <Line
       type="monotone"
       dataKey="valor"
       name="Valor"
       stroke={theme.palette.primary.main}
       activeDot={{ r: 6 }}
       strokeWidth={2}
     />
   </LineChart>
   ```

5. **Seleção de intervenções relacionadas**
   ```tsx
   <Autocomplete
     multiple
     options={interventionsLibrary.map(i => i.id)}
     getOptionLabel={(optionId) => {
       const intervention = interventionsLibrary.find(i => i.id === optionId);
       return intervention ? intervention.title : '';
     }}
     value={formData.interventions}
     onChange={handleInterventionsChange}
     renderOption={(props, optionId) => {
       const intervention = interventionsLibrary.find(i => i.id === optionId);
       if (!intervention) return null;

       return (
         <ListItem {...props}>
           <Chip
             label={intervention.tier}
             size="small"
             color={
               intervention.tier === 'Tier 1' ? 'success' :
               intervention.tier === 'Tier 2' ? 'warning' : 'error'
             }
           />
           <Typography variant="body2">{intervention.title}</Typography>
         </ListItem>
       );
     }}
   />
   ```

6. **Tratamento personalizado de datas**
   ```tsx
   // Verificar se meta está atrasada mas não marcada como tal
   const isOverdue = (
     goal.status !== 'concluída' &&
     goal.status !== 'cancelada' &&
     isBefore(goal.targetDate, new Date()) &&
     goal.status !== 'atrasada'
   );

   // Calcular dias restantes
   const daysLeft = differenceInDays(goal.targetDate, new Date());

   // Verificar se meta está perto do prazo (menos de 7 dias)
   const isCloseToDeadline = daysLeft >= 0 && daysLeft < 7 &&
     goal.status !== 'concluída' && goal.status !== 'cancelada';
   ```

7. **Filtros e busca para lista de metas**
   ```tsx
   const filteredGoals = useMemo(() => {
     return goals.filter(goal => {
       // Filtro de status
       if (filters.status !== 'todas' && goal.status !== filters.status) {
         return false;
       }

       // Filtro de busca
       if (filters.search) {
         const searchLower = filters.search.toLowerCase();
         return (
           goal.title.toLowerCase().includes(searchLower) ||
           goal.description.toLowerCase().includes(searchLower) ||
           // outros campos...
         );
       }

       return true;
     });
   }, [goals, filters]);
   ```

#### Aprendizados

1. A abordagem de dividir o sistema em componentes especializados facilita a manutenção e teste
2. Para formulários complexos, a divisão visual por seções melhora a experiência do usuário
3. O cálculo de progresso deve considerar diferentes cenários de uso (aumento vs. redução)
4. A integração com outros sistemas (como intervenções) deve ser prevista desde o início
5. A visualização gráfica de dados históricos requer atenção ao detalhe para ser realmente útil
6. Filtros e ordenação são essenciais para gerenciar coleções grandes de itens

## Dashboard de Análise de Risco Acadêmico

### 1. Gerenciamento de Múltiplos Datasets
**Desafio**: Coordenar diferentes conjuntos de dados relacionados mas independentes
**Solução**: Hooks customizados orquestrados

```typescript
// Hook principal que orquestra múltiplos hooks de dados
export const useRiskAnalysisDashboard = () => {
  const studentRisk = useStudentRiskData();
  const riskTrend = useRiskTrendData();
  const riskProjection = useRiskProjectionData();
  const riskDistribution = useRiskDistributionData();
  const riskFactors = useRiskFactorData();
  const earlyWarnings = useEarlyWarningIndicators();

  const isLoading = studentRisk.isLoading ||
                    riskTrend.isLoading ||
                    riskProjection.isLoading ||
                    riskDistribution.isLoading ||
                    riskFactors.isLoading ||
                    earlyWarnings.isLoading;

  const refetchAll = useCallback(() => {
    studentRisk.refetch();
    riskTrend.refetch();
    riskProjection.refetch();
    riskDistribution.refetch();
    riskFactors.refetch();
    earlyWarnings.refetch();
  }, [...]);

  return {
    studentRiskData: studentRisk.data,
    riskTrendData: riskTrend.data,
    // ... outros dados
    isLoading,
    filters: studentRisk.filters,
    setFilters: studentRisk.setFilters,
    refetch: refetchAll
  };
};
```

### 2. Visualização de Tendências e Projeções
**Desafio**: Representar visualmente dados históricos e projeções futuras
**Solução**: Gráficos especializados com distinção visual clara

```typescript
// Componente de projeção com diferenciação visual
const RiskProjectionChart: React.FC<RiskProjectionChartProps> = ({
  data,
  isLoading = false,
  title = 'Projeções de Risco Acadêmico',
  height = 300,
}) => {
  const chartData = useMemo(() => {
    return data.map(item => ({
      ...item,
      // Criar propriedade para representação visual diferente após dados reais
      dottedProjected: !item.actual ? item.projected : undefined,
    }));
  }, [data]);

  // ... renderização do gráfico com linhas sólidas e tracejadas
};
```

### 3. Sistema de Filtros Integrados
**Desafio**: Filtros que afetam múltiplas visualizações simultaneamente
**Solução**: Sistema centralizado de filtros com estado compartilhado

```typescript
const RiskAnalysisDashboard: React.FC<RiskAnalysisDashboardProps> = (props) => {
  const [filters, setFilters] = useState<RiskAnalysisFilters>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrades, setSelectedGrades] = useState<string[]>([]);
  const [selectedRiskLevels, setSelectedRiskLevels] = useState<RiskLevel[]>([]);

  // Hook customizado recebe e aplica os filtros em todos os dados
  const {
    studentRiskData,
    riskTrendData,
    // ... outros dados
    setFilters: setApiFilters
  } = useRiskAnalysisDashboard();

  const handleApplyFilters = () => {
    const newFilters: RiskAnalysisFilters = {
      grades: selectedGrades.length > 0 ? selectedGrades : undefined,
      riskLevels: selectedRiskLevels.length > 0 ? selectedRiskLevels : undefined,
      searchTerm: searchTerm.length > 0 ? searchTerm : undefined
    };

    // Aplicar filtros em todos os datasets simultaneamente
    setApiFilters(newFilters);
    setFilters(newFilters);
  };

  // ... renderização do dashboard com componentes filtrados
};
```

### 4. Tratamento de Grandes Volumes de Dados
**Desafio**: Performance com grande volume de dados de estudantes
**Solução**: Paginação, ordenação e memoização eficientes

```typescript
const StudentRiskTable: React.FC<StudentRiskTableProps> = ({
  data,
  isLoading = false,
  title = 'Estudantes em Risco',
  onStudentClick,
}) => {
  // Paginação para melhor performance
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Ordenação otimizada
  const [order, setOrder] = useState<Order>('desc');
  const [orderBy, setOrderBy] = useState<OrderByKey>('riskScore');

  // Função de ordenação memoizada
  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => {
      let aValue: any = a[orderBy];
      let bValue: any = b[orderBy];

      if (orderBy === 'changeTrend') {
        const trendOrder = { 'improving': 0, 'stable': 1, 'worsening': 2 };
        aValue = trendOrder[a.changeTrend];
        bValue = trendOrder[b.changeTrend];
      }

      return order === 'asc'
        ? (aValue < bValue ? -1 : 1)
        : (aValue > bValue ? -1 : 1);
    });
  }, [data, order, orderBy]);

  // Aplicar paginação após ordenação
  const paginatedData = useMemo(() => {
    return sortedData.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    );
  }, [sortedData, page, rowsPerPage]);

  // ... renderização da tabela otimizada
};
```

### 5. Tipo de Dados Reutilizáveis
**Desafio**: Criar tipos de dados coesos e reutilizáveis para múltiplos componentes
**Solução**: Sistema de tipagem TypeScript hierárquico e modular

```typescript
// Tipos base
export type RiskLevel = 'low' | 'moderate' | 'high' | 'severe';

// Interfaces para dados específicos
export interface StudentRiskData {
  id: string;
  name: string;
  grade: string;
  riskLevel: RiskLevel;
  riskScore: number;
  previousScore?: number;
  changeTrend: 'improving' | 'stable' | 'worsening';
  domains: {
    [key: string]: {
      score: number;
      threshold: number;
      status: 'above' | 'on-track' | 'at-risk' | 'critical';
    };
  };
  lastAssessment: string;
  interventions: string[];
}

// Interfaces para visualizações específicas
export interface RiskTrendData {
  date: string;
  lowRisk: number;
  moderateRisk: number;
  highRisk: number;
  severeRisk: number;
}

// Interfaces para props de componentes
export interface RiskAnalysisDashboardProps {
  className?: string;
  studentRiskData?: StudentRiskData[];
  riskTrendData?: RiskTrendData[];
  // ... outros dados
  onStudentClick?: (studentId: string) => void;
  onFilterChange?: (filters: RiskAnalysisFilters) => void;
  onExportData?: (format: 'csv' | 'pdf' | 'excel') => void;
}
```

### 6. Integração com Framework RTI/MTSS
**Desafio**: Alinhar o dashboard com conceitos específicos do framework RTI/MTSS
**Solução**: Mapeamento de níveis de risco para tiers e cores padronizadas

```typescript
// Mapeamento de níveis de risco para cores consistentes
const getRiskColor = (level: RiskLevel): string => {
  switch (level) {
    case 'low':
      return '#4caf50'; // verde (Tier 1)
    case 'moderate':
      return '#ff9800'; // laranja (Tier 2 baixo)
    case 'high':
      return '#f44336'; // vermelho (Tier 2 alto)
    case 'severe':
      return '#9c27b0'; // roxo (Tier 3)
    default:
      return '#757575';
  }
};

// Componente que aplica o padrão visual do framework
const RiskLevelBadge: React.FC<RiskLevelBadgeProps> = ({
  level,
  trend,
  showTrend = false,
  tooltipTitle,
  size = 'medium',
  className
}) => {
  // Traduções e cores consistentes com o framework RTI/MTSS
  const label = getRiskLabel(level);
  const color = getRiskColor(level);

  // ... renderização do badge alinhado ao framework
};
