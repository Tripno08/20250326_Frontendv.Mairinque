# Dashboard de Insights Acionáveis

## Visão Geral

O Dashboard de Insights Acionáveis é um componente central do sistema Innerview que fornece inteligência acionável para educadores e administradores, permitindo a identificação precoce e resposta a padrões educacionais significativos.

Este sistema integra dados de diversas fontes para gerar alertas preventivos, sugestões personalizadas, visualizações comparativas e simulações de impacto potencial, ajudando os educadores a tomar decisões baseadas em evidências.

## Componentes Principais

### 1. ActionableInsightsDashboard

Componente contentor principal que integra todos os subcomponentes do sistema de insights em uma interface unificada.

```tsx
<ActionableInsightsDashboard
  insights={insights}
  activeProfile="teacher"
  isLoading={false}
  error={null}
  onInsightSelect={(insight) => handleInsightSelect(insight)}
  onFilterChange={(filters) => handleFilterChange(filters)}
  onProfileChange={(profile) => handleProfileChange(profile)}
/>
```

#### Props

| Prop | Tipo | Descrição |
|------|------|-----------|
| `insights` | `ActionableInsight[]` | Array de insights acionáveis a serem exibidos |
| `activeProfile` | `UserProfile` | Perfil de usuário ativo (teacher, specialist, coordinator, principal, administrator) |
| `isLoading` | `boolean` | Indica se os dados estão sendo carregados |
| `error` | `Error \| null` | Erro ocorrido durante o carregamento dos dados |
| `onInsightSelect` | `(insight: ActionableInsight) => void` | Função chamada quando um insight é selecionado |
| `onFilterChange` | `(filters: InsightFilters) => void` | Função chamada quando os filtros são alterados |
| `onProfileChange` | `(profile: UserProfile) => void` | Função chamada quando o perfil ativo é alterado |

### 2. PreventiveAlertCard

Componente para exibir alertas preventivos com indicadores visuais, incluindo nível de alerta, impacto potencial e ações sugeridas.

```tsx
<PreventiveAlertCard
  insight={insight}
  onAcknowledge={(id) => handleAcknowledge(id)}
  onResolve={(id) => handleResolve(id)}
  onDismiss={(id) => handleDismiss(id)}
  expanded={false}
/>
```

### 3. ProfileSuggestionList

Componente que exibe sugestões específicas para o perfil de usuário ativo, ordenadas por relevância.

```tsx
<ProfileSuggestionList
  insights={relevantInsights}
  profile="teacher"
  maxItems={5}
/>
```

### 4. InsightVisualization

Componente que fornece visualizações comparativas para insights com evidências, incluindo gráficos e análises visuais.

```tsx
<InsightVisualization insights={insights} />
```

### 5. ImpactSimulationPanel

Componente para simular o impacto potencial de diferentes decisões e cenários baseados nos insights.

```tsx
<ImpactSimulationPanel insights={insights} />
```

### 6. InsightFilterPanel

Componente para filtrar insights por diversos critérios como nível de alerta, categoria, área de impacto e relevância.

```tsx
<InsightFilterPanel
  filters={filters}
  onFilterChange={(newFilters) => handleFilterChange(newFilters)}
  activeProfile="teacher"
  onProfileChange={(profile) => handleProfileChange(profile)}
/>
```

## Fluxo de Dados

1. Os dados de insights são carregados, tipicamente de uma API de backend
2. Os insights são filtrados com base nos critérios definidos pelo usuário
3. Os insights filtrados são ordenados por nível de alerta e relevância para o perfil ativo
4. Os componentes visuais são renderizados com base nos dados processados
5. As interações do usuário (reconhecer, resolver, dispensar) são enviadas de volta para o backend

## Tipos Principais

### ActionableInsight

```typescript
interface ActionableInsight {
  id: string;
  title: string;
  description: string;
  alertLevel: 'low' | 'moderate' | 'high' | 'critical';
  timestamp: string;
  category: string;
  impactArea: string[];
  suggestedActions: string[];
  evidence?: InsightEvidence;
  potentialImpact?: number;
  profileRelevance: Record<UserProfile, number>;
  isAcknowledged?: boolean;
  isResolved?: boolean;
  dateAcknowledged?: string;
  dateResolved?: string;
}
```

### InsightEvidence

```typescript
interface InsightEvidence {
  dataPoints: {
    name: string;
    value: number;
    baseline?: number;
    comparisonValue?: number;
  }[];
  trend?: {
    direction: 'up' | 'down' | 'stable';
    percentChange?: number;
    period: string;
  };
  sources: string[];
}
```

## Casos de Uso

### 1. Identificação de Riscos Acadêmicos

O sistema identifica automaticamente padrões de queda no desempenho acadêmico e alerta os educadores, permitindo intervenção precoce.

### 2. Monitoramento de Eficácia de Intervenções

Os educadores podem monitorar a eficácia das intervenções implementadas e receber alertas quando as intervenções não estão produzindo os resultados esperados.

### 3. Planejamento Baseado em Dados

Através das simulações de impacto, os administradores podem planejar mudanças curriculares e alocação de recursos com base em projeções de resultados.

### 4. Comunicação com Partes Interessadas

Os insights e evidências visuais facilitam a comunicação com famílias e outros stakeholders sobre o progresso e as necessidades dos estudantes.

## Integração com o Framework RTI/MTSS

O Dashboard de Insights Acionáveis se integra profundamente com o framework RTI/MTSS, fornecendo:

1. **Identificação precoce** de estudantes que podem necessitar de suporte adicional
2. **Monitoramento de progresso** através de visualizações comparativas
3. **Diferenciação de apoio** com sugestões específicas por perfil
4. **Tomada de decisão baseada em dados** através de simulações de impacto

## Próximos Passos e Melhorias Futuras

1. **Análise Preditiva Avançada** - Implementação de modelos de machine learning para previsão de riscos acadêmicos com maior precisão
2. **Recomendações Automatizadas** - Sistema que sugere intervenções específicas com base no histórico de eficácia para perfis similares
3. **Visualizações Personalizáveis** - Permitir que os usuários configurem seus próprios dashboards com as métricas mais relevantes
4. **Alertas Proativos** - Sistema de notificações que alerta os educadores sobre insights críticos assim que são detectados
