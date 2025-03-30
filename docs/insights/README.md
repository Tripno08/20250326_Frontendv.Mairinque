# Sistema de Insights Acionáveis - Innerview

## Visão Geral

O Sistema de Insights Acionáveis é um componente central da plataforma Innerview que fornece inteligência acionável para educadores e administradores, permitindo a identificação precoce e resposta a padrões educacionais significativos.

Este sistema integra dados de diversas fontes para gerar:
- Alertas preventivos com indicadores visuais
- Sugestões personalizadas por perfil de usuário
- Visualizações comparativas com evidências
- Simulações de impacto potencial de decisões

## Componentes Principais

### 1. ActionableInsightsDashboard
Componente principal que integra todos os subcomponentes do sistema em uma interface unificada.

### 2. PreventiveAlertCard
Componente que exibe alertas visuais com indicadores de nível, ações sugeridas e opções para reconhecimento, resolução ou dispensa.

### 3. ProfileSuggestionList
Componente que apresenta sugestões específicas para o perfil de usuário ativo, ordenadas por relevância.

### 4. InsightVisualization
Componente que fornece visualizações comparativas de insights, incluindo gráficos de barras, linhas, pizza e radar.

### 5. ComparativeInsight
Componente para visualização detalhada de evidências específicas de um insight, incluindo gráficos e fontes.

### 6. ImpactSimulationPanel
Componente para simular o impacto potencial de diferentes cenários de decisão baseados em insights.

### 7. InsightFilterPanel
Componente para filtrar insights por múltiplos critérios, incluindo nível de alerta, categoria, e relevância.

## Documentação

O sistema inclui documentação abrangente disponível nos seguintes arquivos:

| Arquivo | Descrição |
|---------|-----------|
| [`actionable-insights-dashboard.md`](./actionable-insights-dashboard.md) | Documentação completa do dashboard, incluindo componentes, fluxo de dados, tipos e casos de uso |
| [`desafios-solucoes.md`](./desafios-solucoes.md) | Registro dos desafios encontrados durante o desenvolvimento e suas soluções |
| [`tipagem.md`](./tipagem.md) | Documentação detalhada do sistema de tipos TypeScript do sistema |
| [`dicas-visualizacao.md`](./dicas-visualizacao.md) | Boas práticas e dicas para uso das visualizações de dados com Recharts |

## Como Usar

### Importação dos Componentes

```tsx
import {
  ActionableInsightsDashboard,
  PreventiveAlertCard,
  ProfileSuggestionList,
  InsightVisualization,
  ComparativeInsight,
  ImpactSimulationPanel,
  InsightFilterPanel
} from '@/components/insights';
```

### Uso Básico

```tsx
import React, { useState } from 'react';
import { ActionableInsightsDashboard } from '@/components/insights';
import { mockInsights } from '@/data/mockInsights';
import { UserProfile } from '@/types/actionable-insights';

const InsightsPage: React.FC = () => {
  const [activeProfile, setActiveProfile] = useState<UserProfile>('teacher');

  return (
    <Container maxWidth="xl">
      <Typography variant="h3" component="h1" gutterBottom>
        Dashboard de Insights Acionáveis
      </Typography>

      <ActionableInsightsDashboard
        insights={mockInsights}
        activeProfile={activeProfile}
        onProfileChange={(profile) => setActiveProfile(profile)}
        isLoading={false}
        error={null}
      />
    </Container>
  );
};
```

### Uso Avançado: Componentes Individuais

```tsx
// Exibir um alerta preventivo específico
<PreventiveAlertCard
  insight={insight}
  onAcknowledge={handleAcknowledge}
  onResolve={handleResolve}
  onDismiss={handleDismiss}
/>

// Exibir sugestões para um perfil específico
<ProfileSuggestionList
  insights={relevantInsights}
  profile="teacher"
  maxItems={5}
/>

// Exibir visualizações comparativas
<InsightVisualization insights={insights} />

// Exibir simulações de impacto
<ImpactSimulationPanel insights={insights} />

// Exibir e gerenciar filtros
<InsightFilterPanel
  filters={filters}
  onFilterChange={handleFilterChange}
  activeProfile={activeProfile}
  onProfileChange={handleProfileChange}
/>
```

## Fluxo de Dados

1. Os dados de insights são carregados ou gerados pelo sistema
2. Filtros são aplicados para refinar os insights exibidos
3. Os insights são processados para visualizações específicas
4. Interações do usuário (reconhecer, resolver, filtrar) atualizam o estado
5. O sistema adapta as visualizações e sugestões com base nas interações

## Tecnologias Utilizadas

- React com TypeScript
- Material UI para componentes de interface
- Framer Motion para animações
- Recharts para visualizações de dados
- Memoização para otimização de performance

## Próximos Passos

1. Implementar sistema de notificações em tempo real
2. Expandir os tipos de visualizações disponíveis
3. Adicionar análise preditiva usando modelos de ML
4. Implementar comparações entre diferentes períodos
5. Integrar feedback do usuário para melhoria de sugestões

## Contribuição

Para contribuir com o desenvolvimento deste sistema, consulte os arquivos de documentação para entender a estrutura e padrões. Siga as convenções de tipagem e design estabelecidas.
