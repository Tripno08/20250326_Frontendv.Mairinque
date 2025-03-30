# Tipagem TypeScript no Sistema de Insights Acionáveis

## Visão Geral

Este documento descreve a estrutura de tipagem TypeScript implementada no Sistema de Insights Acionáveis, incluindo as principais interfaces, tipos e boas práticas de uso.

A tipagem forte é uma parte fundamental do sistema, garantindo a consistência dos dados, facilitando o desenvolvimento e evitando erros em tempo de execução.

## Interfaces Principais

### `ActionableInsight`

Interface central que representa um insight acionável no sistema.

```typescript
export interface ActionableInsight {
  id: string;                                   // Identificador único do insight
  title: string;                                // Título descritivo
  description: string;                          // Descrição detalhada
  alertLevel: AlertLevel;                       // Nível de alerta (low, moderate, high, critical)
  timestamp: string;                            // Data/hora de criação
  category: string;                             // Categoria principal (Acadêmico, Comportamental, etc.)
  impactArea: string[];                         // Áreas de impacto (Leitura, Matemática, etc.)
  suggestedActions: string[];                   // Ações sugeridas
  evidence?: InsightEvidence;                   // Evidências (opcional)
  potentialImpact?: number;                     // Impacto potencial em porcentagem (opcional)
  profileRelevance: Record<UserProfile, number>; // Relevância para cada perfil (0 a 1)
  isAcknowledged?: boolean;                     // Se foi reconhecido (opcional)
  isResolved?: boolean;                         // Se foi resolvido (opcional)
  dateAcknowledged?: string;                    // Data de reconhecimento (opcional)
  dateResolved?: string;                        // Data de resolução (opcional)
}
```

### `InsightEvidence`

Interface que representa as evidências que sustentam um insight.

```typescript
export interface InsightEvidence {
  dataPoints: {                          // Pontos de dados para visualização
    name: string;                        // Nome/label do ponto de dados
    value: number;                       // Valor atual
    baseline?: number;                   // Valor de referência/base (opcional)
    comparisonValue?: number;            // Valor de comparação (opcional)
  }[];
  trend?: {                              // Tendência temporal (opcional)
    direction: 'up' | 'down' | 'stable'; // Direção da tendência
    percentChange?: number;              // Mudança percentual (opcional)
    period: string;                      // Período de tempo da tendência
  };
  sources: string[];                     // Fontes de dados usadas como evidência
}
```

### `ImpactSimulation`

Interface para representação de simulações de impacto de decisões.

```typescript
export interface ImpactSimulation {
  id: string;                            // Identificador único da simulação
  title: string;                         // Título da simulação
  description: string;                   // Descrição detalhada
  scenarios: {                           // Cenários possíveis
    id: string;                          // ID único do cenário
    name: string;                        // Nome do cenário
    description: string;                 // Descrição do cenário
    impactMetrics: {                     // Métricas de impacto
      metric: string;                    // Nome da métrica
      currentValue: number;              // Valor atual
      projectedValue: number;            // Valor projetado
      percentChange: number;             // Mudança percentual
    }[];
  }[];
}
```

## Tipos Enumerados

### `AlertLevel`

Define os níveis de alerta disponíveis no sistema.

```typescript
export type AlertLevel = 'low' | 'moderate' | 'high' | 'critical';
```

### `UserProfile`

Define os perfis de usuário do sistema.

```typescript
export type UserProfile = 'teacher' | 'specialist' | 'coordinator' | 'principal' | 'administrator';
```

## Interfaces de Props de Componentes

### `ActionableInsightsDashboardProps`

Props para o componente principal do dashboard.

```typescript
export interface ActionableInsightsDashboardProps extends BaseComponentProps, LoadingState {
  insights: ActionableInsight[];               // Array de insights
  activeProfile?: UserProfile;                 // Perfil ativo
  onInsightSelect?: (insight: ActionableInsight) => void;  // Callback para seleção
  onFilterChange?: (filters: InsightFilters) => void;      // Callback para filtros
  onProfileChange?: (profile: UserProfile) => void;        // Callback para mudança de perfil
}
```

### `PreventiveAlertProps`

Props para o componente de alertas preventivos.

```typescript
export interface PreventiveAlertProps extends BaseComponentProps {
  insight: ActionableInsight;                 // Insight a ser exibido
  onAcknowledge?: (id: string) => void;       // Callback para reconhecimento
  onResolve?: (id: string) => void;           // Callback para resolução
  onDismiss?: (id: string) => void;           // Callback para dispensa
  expanded?: boolean;                         // Se o card deve iniciar expandido
}
```

### `ProfileSuggestionsProps`

Props para o componente de sugestões específicas por perfil.

```typescript
export interface ProfileSuggestionsProps extends BaseComponentProps {
  insights: ActionableInsight[];              // Array de insights
  profile: UserProfile;                       // Perfil ativo
  maxItems?: number;                          // Número máximo de itens a exibir
}
```

### `ComparativeInsightProps`

Props para o componente de visualizações comparativas.

```typescript
export interface ComparativeInsightProps extends BaseComponentProps {
  insight: ActionableInsight;                // Insight a ser visualizado
  showEvidence?: boolean;                    // Se deve mostrar evidências
}
```

### `ImpactSimulationProps`

Props para o componente de simulação de impacto.

```typescript
export interface ImpactSimulationProps extends BaseComponentProps {
  simulation: ImpactSimulation;               // Simulação a ser exibida
  onScenarioSelect?: (scenarioId: string) => void;  // Callback para seleção de cenário
  selectedScenario?: string;                  // ID do cenário selecionado
}
```

### `InsightFilterProps`

Props para o componente de filtros de insights.

```typescript
export interface InsightFilterPanelProps {
  filters: InsightFilters;                    // Estado atual dos filtros
  onFilterChange: (filters: InsightFilters) => void;  // Callback para mudanças
  activeProfile: UserProfile;                 // Perfil ativo
  onProfileChange: (profile: UserProfile) => void;    // Callback para mudança de perfil
  className?: string;                         // Classe CSS opcional
  style?: React.CSSProperties;                // Estilos inline opcionais
}
```

## Interfaces de Estado

### `InsightFilters`

Interface que define os filtros disponíveis para insights.

```typescript
export interface InsightFilters {
  alertLevel?: AlertLevel[];                  // Filtro por nível de alerta
  categories?: string[];                      // Filtro por categoria
  impactAreas?: string[];                     // Filtro por área de impacto
  dateRange?: [string, string];               // Filtro por período
  showResolved?: boolean;                     // Mostrar resolvidos
  showAcknowledged?: boolean;                 // Mostrar reconhecidos
  relevanceThreshold?: number;                // Threshold de relevância
}
```

## Interfaces Base

### `BaseComponentProps`

Interface base para props comuns a múltiplos componentes.

```typescript
export interface BaseComponentProps {
  className?: string;                        // Classe CSS opcional
  style?: React.CSSProperties;               // Estilos inline opcionais
}
```

### `LoadingState`

Interface para componentes que possuem estado de carregamento.

```typescript
export interface LoadingState {
  isLoading?: boolean;                       // Se está carregando
  error?: Error | null;                      // Erro (se houver)
}
```

## Boas Práticas

### 1. Usando as interfaces

```typescript
// Importando tipos
import {
  ActionableInsight,
  AlertLevel,
  UserProfile,
  InsightFilters
} from '@/types/actionable-insights';

// Usando em componentes funcionais
const MyComponent: React.FC<PreventiveAlertProps> = ({ insight, onAcknowledge }) => {
  // implementação...
};

// Usando em hooks
const useInsights = (filters: InsightFilters) => {
  // implementação...
};

// Casting correto
const alertLevel = data.level as AlertLevel;
```

### 2. Validação em Runtime

Embora o TypeScript forneça verificação de tipos em tempo de compilação, recomenda-se validar os dados críticos também em runtime, especialmente os recebidos de APIs.

```typescript
// Função para validar insight
const isValidInsight = (insight: any): insight is ActionableInsight => {
  return (
    typeof insight.id === 'string' &&
    typeof insight.title === 'string' &&
    typeof insight.description === 'string' &&
    ['low', 'moderate', 'high', 'critical'].includes(insight.alertLevel) &&
    // ... validações adicionais
    true
  );
};

// Uso
if (isValidInsight(data)) {
  // processar insight
} else {
  console.error('Dados de insight inválidos:', data);
}
```

### 3. Extensão de Tipos

```typescript
// Exemplo de extensão de tipos existentes
interface DetailedActionableInsight extends ActionableInsight {
  detailedAnalysis?: string;
  relatedInsights?: string[];
}

// Composição de tipos
type ActionableInsightWithHistory = ActionableInsight & {
  changeHistory: {
    timestamp: string;
    user: string;
    changes: Record<string, any>;
  }[];
};
```

## Técnicas Avançadas

### 1. Tipos Discriminados

Úteis para distinguir entre diferentes tipos de insights ou evidências.

```typescript
type EvidenceType = 'quantitative' | 'qualitative' | 'comparative';

interface BaseEvidence {
  type: EvidenceType;
  sources: string[];
}

interface QuantitativeEvidence extends BaseEvidence {
  type: 'quantitative';
  dataPoints: Array<{ name: string; value: number }>;
}

interface QualitativeEvidence extends BaseEvidence {
  type: 'qualitative';
  observations: string[];
}

// Uso
function processEvidence(evidence: BaseEvidence) {
  switch (evidence.type) {
    case 'quantitative':
      // TypeScript sabe que é QuantitativeEvidence
      return visualizeData(evidence.dataPoints);
    case 'qualitative':
      // TypeScript sabe que é QualitativeEvidence
      return summarizeObservations(evidence.observations);
  }
}
```

### 2. Tipos Utilitários Genéricos

```typescript
// Tipo para funções de manipulação de insights
type InsightProcessor<T> = (insight: ActionableInsight) => T;

// Tipo para funções de filtragem
type InsightFilter = (insight: ActionableInsight) => boolean;

// Uso
const highAlertFilter: InsightFilter = (insight) => insight.alertLevel === 'high';
const getTitles: InsightProcessor<string> = (insight) => insight.title;
```

## Dicas para Equipe de Desenvolvimento

1. **Sempre use tipagem explícita** para props de componentes e retornos de funções

2. **Prefira interfaces para API pública** e types para composições e unions

3. **Utilize `strictNullChecks`** para evitar erros de null/undefined

4. **Documente tipos complexos** com comentários JSDoc

5. **Use enums ou unions literais** para valores restritos como `AlertLevel`

6. **Evite `any`** sempre que possível, preferindo `unknown` para tipos desconhecidos

7. **Utilize genéricos** para criar funções e componentes reutilizáveis

## Evolução do Sistema de Tipos

Para futuras iterações do sistema, considere:

1. Implementar **validação com Zod** para melhorar a segurança em runtime

2. Criar **tipos utilitários específicos** para manipulação de dados de insights

3. Adicionar suporte a **i18n nos tipos** para internacionalização

4. Implementar **serialização de tipo** para facilitar a comunicação com APIs

5. Considerar o uso de **branding de tipos** para maior segurança em IDs e identificadores
