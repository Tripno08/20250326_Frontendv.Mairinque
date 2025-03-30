# RiskAnalysisDashboard

O `RiskAnalysisDashboard` é um componente abrangente que apresenta análises de risco acadêmico para estudantes, fornecendo visualizações de dados, tendências, projeções e ferramentas para identificação precoce de dificuldades acadêmicas.

## Visão Geral

Este dashboard integra múltiplas visualizações para apresentar uma análise completa de riscos acadêmicos, permitindo que educadores e administradores:

- Visualizem a distribuição de estudantes por nível de risco
- Acompanhem tendências de risco ao longo do tempo
- Analisem projeções futuras de risco acadêmico
- Identifiquem estudantes específicos que necessitam de intervenção
- Reconheçam padrões e fatores que contribuem para dificuldades acadêmicas
- Monitorem indicadores de alerta precoce

## Uso

```tsx
import { RiskAnalysisDashboard } from '@/components/risk/RiskAnalysisDashboard';

// Uso básico
<RiskAnalysisDashboard />

// Com manipuladores de eventos
<RiskAnalysisDashboard
  onStudentClick={(studentId) => router.push(`/students/${studentId}`)}
  onExportData={(format) => exportDashboardData(format)}
/>

// Com dados fornecidos externamente
<RiskAnalysisDashboard
  studentRiskData={studentData}
  riskTrendData={trendData}
  riskProjectionData={projectionData}
  riskDistributionData={distributionData}
  riskFactorData={factorData}
  earlyWarningIndicators={warningIndicators}
/>
```

## Props

| Nome | Tipo | Padrão | Descrição |
|------|------|--------|-----------|
| `className` | `string` | `undefined` | Classe CSS opcional para aplicar ao contêiner principal |
| `studentRiskData` | `StudentRiskData[]` | `[]` | Dados de risco de estudantes individuais |
| `riskTrendData` | `RiskTrendData[]` | `[]` | Dados de tendências de risco ao longo do tempo |
| `riskProjectionData` | `RiskProjectionData[]` | `[]` | Dados de projeções futuras de risco |
| `riskPatternData` | `RiskPatternData[]` | `[]` | Dados de padrões de risco identificados |
| `riskDistributionData` | `RiskDistributionData \| null` | `null` | Dados de distribuição de níveis de risco |
| `riskFactorData` | `RiskFactorData[]` | `[]` | Dados sobre fatores de risco acadêmico |
| `earlyWarningIndicators` | `EarlyWarningIndicator[]` | `[]` | Indicadores de alerta precoce |
| `isLoading` | `boolean` | `false` | Estado de carregamento do dashboard |
| `onStudentClick` | `(studentId: string) => void` | `undefined` | Callback quando um estudante é clicado |
| `onFilterChange` | `(filters: RiskAnalysisFilters) => void` | `undefined` | Callback quando os filtros são alterados |
| `onDataRefresh` | `() => void` | `undefined` | Callback para atualizar os dados |
| `onExportData` | `(format: 'csv' \| 'pdf' \| 'excel') => void` | `undefined` | Callback para exportar dados |

## Funcionalidades

### Visualização de Distribuição de Risco

Apresenta a distribuição de estudantes por nível de risco (Baixo, Moderado, Alto, Severo), permitindo uma visão rápida da situação geral da instituição educacional.

### Tendências de Risco

Mostra como os níveis de risco acadêmico evoluíram ao longo do tempo, permitindo identificar se as intervenções estão sendo eficazes ou se os problemas estão aumentando.

### Projeções de Risco

Apresenta projeções para os próximos períodos, baseadas em tendências históricas e modelos preditivos, permitindo planejamento proativo de intervenções.

### Tabela de Estudantes em Risco

Lista detalhada de estudantes com informações de risco, incluindo:
- Nível de risco individual
- Pontuação de risco
- Tendência (melhorando, estável, piorando)
- Detalhes expandíveis por domínio acadêmico
- Intervenções atuais

### Alertas Precoces

Indicadores que sinalizam potenciais problemas acadêmicos antes que se tornem críticos, como:
- Queda na fluência de leitura
- Aumento de ausências
- Diminuição nas pontuações de avaliações formativas
- Não conclusão de tarefas

### Fatores de Risco

Análise dos principais fatores correlacionados com baixo desempenho acadêmico, com seus pesos e significância.

## Hooks e Serviços Relacionados

O dashboard utiliza os seguintes hooks e serviços para obter e gerenciar dados:

- `useRiskAnalysisDashboard`: Hook principal que orquestra todos os dados necessários
- `useStudentRiskData`: Hook para dados de estudantes em risco
- `useRiskTrendData`: Hook para dados de tendências de risco
- `useRiskProjectionData`: Hook para dados de projeções de risco
- `useRiskPatternData`: Hook para dados de padrões de risco
- `useRiskDistributionData`: Hook para dados de distribuição de risco
- `useRiskFactorData`: Hook para dados de fatores de risco
- `useEarlyWarningIndicators`: Hook para indicadores de alerta precoce
- `riskAnalysisService`: Serviço para obter dados de análise de risco

## Subcomponentes

O dashboard é composto pelos seguintes subcomponentes:

- `RiskDistributionChart`: Gráfico de barras mostrando a distribuição de níveis de risco
- `RiskTrendChart`: Gráfico de área mostrando tendências de risco ao longo do tempo
- `RiskProjectionChart`: Gráfico de linha mostrando projeções futuras de risco
- `StudentRiskTable`: Tabela detalhada de estudantes em situação de risco
- `RiskLevelBadge`: Badge visual para indicar níveis de risco

## Exemplos

### Dashboard Completo

```tsx
import RiskAnalysisDashboard from '@/components/risk/RiskAnalysisDashboard';
import { useRouter } from 'next/router';

const RiskAnalysisPage = () => {
  const router = useRouter();

  const handleStudentClick = (studentId) => {
    router.push(`/students/${studentId}`);
  };

  const handleExportData = (format) => {
    // Implementação da exportação
    console.log(`Exportando dados em formato ${format}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <RiskAnalysisDashboard
        onStudentClick={handleStudentClick}
        onExportData={handleExportData}
      />
    </div>
  );
};
```

### Com Filtros Predefinidos

```tsx
import RiskAnalysisDashboard from '@/components/risk/RiskAnalysisDashboard';
import { useRiskAnalysisDashboard } from '@/hooks/useRiskAnalysis';

const FilteredRiskAnalysisPage = () => {
  const { setFilters } = useRiskAnalysisDashboard();

  // Definir filtros apenas para alunos do 3º ano em risco alto
  useEffect(() => {
    setFilters({
      grades: ['3º Ano'],
      riskLevels: ['high']
    });
  }, []);

  return <RiskAnalysisDashboard />;
};
```

## Considerações de Acessibilidade

O dashboard foi projetado seguindo as diretrizes WCAG 2.1 AA:

- Uso de contraste adequado para todos os elementos visuais
- Suporte a navegação por teclado em todos os componentes interativos
- Textos alternativos descritivos para elementos visuais
- Estrutura semântica com marcação apropriada
- Suporte a tecnologias assistivas, incluindo leitores de tela

## Considerações de Performance

Para garantir boa performance mesmo com grandes volumes de dados:

- Uso de memoização para evitar re-renderizações desnecessárias
- Paginação na tabela de estudantes
- Carregamento assíncrono de dados
- Estratégias de throttling e debouncing para interações de usuário
- Código divisível (code splitting) para reduzir o tamanho inicial do bundle
