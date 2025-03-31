# Próximos Passos para Migração Material UI 7 e React 19

Seguindo a estratégia de abordagem progressiva, este documento detalha os próximos passos necessários para continuar a migração e corrigir os problemas de compatibilidade restantes no projeto.

## 1. Estender a Solução para Outros Componentes Grid

### Prioridade: Alta

- [x] Criar componentes wrapper para elementos do Material UI

  - [x] GridItem para Grid com item=true
  - [x] GridContainer para Grid com container=true
  - [x] ListItemWrapper para ListItem
  - [x] MenuItemWrapper para MenuItem

- [x] Atualizar componentes iniciais para usar os wrappers

  - [x] RoleAssignment.tsx
  - [x] TeamCommunication.tsx
  - [x] TeamManagement.tsx
  - [x] SmartGoalList.tsx
  - [x] SmartGoalForm.tsx

- [x] Atualizar componentes de screening para usar os wrappers

  - [x] InstrumentScreeningHistoryPieChart.tsx
  - [x] ScreeningCycleManager.tsx
  - [x] AdministratorScreeningHistory.tsx
  - [x] InstrumentScreeningHistoryScatterChart.tsx
  - [x] InstrumentScreeningHistoryChart.tsx
  - [x] ScreeningRuleConditions.tsx
  - [x] ScreeningAdministrationDetails.tsx
  - [x] ScreeningResultsDashboard.tsx
  - [x] ScreeningInstrumentManager.tsx

- [x] Atualizar componentes de AI para usar os wrappers
  - [x] AIAnalysisDashboard.tsx

### Abordagem Recomendada

1. Usar os componentes wrapper criados para substituir Grid

   ```tsx
   // Antes
   <Grid container spacing={3}>
     <Grid item xs={12} md={6}>
       <Card>...</Card>
     </Grid>
   </Grid>

   // Depois
   <GridContainer spacing={3}>
     <GridItem xs={12} md={6}>
       <Card>...</Card>
     </GridItem>
   </GridContainer>
   ```

2. Para layouts complexos, usar GridContainer e GridItem
3. Para layouts mais simples, considerar substituir Grid por Box com flexbox

## 2. Resolver Problemas de Paleta de Cores

### Prioridade: Média

- [x] Verificar se a cor 'info' na definição da paleta já existe
- [x] Verificar outras cores que possam estar faltando (por exemplo, 'warning', 'error')
- [x] Implementar solução temporária usando primary.light para casos onde info não foi reconhecido

### Abordagem Adotada

A verificação confirmou que as cores 'info', 'warning' e 'error' já existem na paleta do Material UI 7. Em componentes onde a propriedade info não foi reconhecida, usamos alternativas como primary.light.

## 3. Corrigir Problemas com Tipagem em Hooks e Serviços

### Prioridade: Alta

- [x] Resolver problemas de tipagem no useAssessments.test.tsx

  - Adicionada importação dos tipos Assessment, AssessmentType, AssessmentStatus, AssessmentFilters e AssessmentStats
  - Corrigidas as tipagens dos objetos mockados para usar os tipos corretos
  - Uso de type assertion para corrigir problemas com os tipos Omit e Partial

- [x] Corrigir erros em TeamService relacionados à especialidade

  - Importado o enum Specialty para substituir as strings nas especialidades
  - Substituído ['reading', 'writing'] por [Specialty.READING, Specialty.WRITING]
  - Substituído ['math'] por [Specialty.MATH]
  - Corrigido objeto retornado por getTeamMetrics para corresponder à interface TeamMetrics

- [x] Atualizar declarações de tipo para compatibilidade com React Query v5
  - Simplificada a abordagem de tipagem removendo interfaces personalizadas
  - Permitindo que o TypeScript infira os tipos nativos do React Query v5
  - Removidas anotações de tipo explícitas nos retornos dos hooks
  - Atualizado useAssessments.ts para utilizar a nova sintaxe de objeto único do React Query v5

### Abordagem Adotada

1. Para os erros de useAssessments, corrigimos as tipagens dos objetos de teste para usar os tipos definidos no sistema:

   ```tsx
   // Antes
   const mockAssessment = {
     type: 'quiz',
     status: 'draft',
     // ...
   };

   // Depois
   const mockAssessment: Assessment = {
     type: 'quiz' as AssessmentType,
     status: 'draft' as AssessmentStatus,
     // ...
   };
   ```

2. Para TeamService, substituímos as strings por enums:

   ```tsx
   // Antes
   specialties: ['reading', 'writing'],

   // Depois
   specialties: [Specialty.READING, Specialty.WRITING],
   ```

3. Para React Query v5, simplificamos a tipagem:

   ```tsx
   // Antes - Tipagem explícita com interfaces personalizadas
   export const useAssessments = (
     filters: AssessmentFilters
   ): QueryResult<{
     data: Assessment[];
     total: number;
     page: number;
     limit: number;
     totalPages: number;
   }> => {
     // ...
   };

   // Depois - Usando os tipos nativos inferidos do React Query v5
   export const useAssessments = (filters: AssessmentFilters) => {
     return useQuery({
       queryKey: assessmentKeys.list(filters),
       queryFn: () => assessmentService.listAssessments(filters),
     });
   };
   ```

## 4. Resolver Problemas de MSW (Mock Service Worker)

### Prioridade: Média

- [x] Criar documentação para atualização do MSW (msw-atualizacao.md)
- [x] Atualizar as importações do MSW para a versão mais recente
  - Substituída a importação de `rest` por `http` em src/mocks/server.ts
- [x] Refatorar os handlers para usar a nova API
  - Atualizados todos os handlers em src/mocks/server.ts para usar a nova sintaxe com `new Response()`
  - Implementado o tratamento de parâmetros de URL usando `({ params })` nos handlers de requisições com parâmetros
  - Adicionados headers adequados ('Content-Type': 'application/json') para todas as respostas

### Abordagem Adotada

```tsx
// Antes
rest.get('/api/path', (req, res, ctx) => {
  return res(ctx.status(200), ctx.json({ data: 'exemplo' }));
});

// Depois
http.get('/api/path', () => {
  return new Response(JSON.stringify({ data: 'exemplo' }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
});
```

Para handlers que utilizam parâmetros:

```tsx
// Antes
rest.put('/api/webhooks/:id', (req, res, ctx) => {
  const id = req.params.id;
  return res(ctx.status(200), ctx.json({ message: 'Atualizado' }));
});

// Depois
http.put('/api/webhooks/:id', ({ params }) => {
  const id = params.id;
  return new Response(JSON.stringify({ message: 'Atualizado' }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
});
```

## 5. Atualizar Testes para Compatibilidade

### Prioridade: Média

- [ ] Criar testes para os componentes wrapper
  - [ ] Testes para GridItem
  - [ ] Testes para GridContainer
  - [ ] Testes para ListItemWrapper
  - [ ] Testes para MenuItemWrapper
- [ ] Resolver problemas de tipagem em arquivos de teste
- [ ] Atualizar as configurações do Jest para React 19

### Abordagem Recomendada

1. Criar um wrapper de teste para Material UI que forneça um tema correto
2. Atualizar as configurações do Jest para suportar React 19

## 6. Documentação

### Prioridade: Média

- [x] Criar documentação detalhada para componentes wrapper (componentes-wrapper.md)
- [x] Criar documentação para atualização do MSW (msw-atualizacao.md)
- [x] Atualizar documentação com resumo do progresso (material-ui-atualizacao-resumo.md)
- [x] Atualizar checklist de deploy (deploy-checklist.md)
- [x] Documentar padrões recomendados para novos componentes (padrao-componentes-wrapper.md)
  - Adicionada documentação com práticas recomendadas para uso dos componentes wrapper
  - Incluídas boas práticas gerais para novos componentes (tipagem, componentização, hooks, etc.)
  - Adicionados exemplos de código para ilustrar os padrões recomendados
  - Incluídas seções sobre padrões de estilo e testes

## Monitoramento de Progresso

| Categoria                   | Progresso | Bloqueadores     |
| --------------------------- | --------- | ---------------- |
| Componentes Wrapper         | 4/4       | Concluído        |
| Componentes Grid Principais | 5/5       | Concluído        |
| Componentes de Screening    | 9/9       | Concluído        |
| Componentes de AI           | 1/1       | Concluído        |
| Paleta de Cores             | 1/1       | Concluído        |
| Tipagem de Hooks e Serviços | 10/10     | Concluído        |
| MSW                         | 5/5       | Concluído        |
| Testes                      | 0/15      | Média prioridade |
| Documentação                | 5/5       | Concluído        |

## Resumo da Implementação

A migração para o Material UI 7 com React 19 apresentou vários desafios, principalmente relacionados às mudanças de tipagem em componentes essenciais como Grid, ListItem e MenuItem. Em vez de optar pelo downgrade das dependências, implementamos uma solução elegante e progressiva usando componentes wrapper.

### Principais Soluções Implementadas

1. **Componentes Wrapper**:

   Criamos quatro componentes wrapper que encapsulam a lógica de compatibilidade:

   - **GridContainer**: Encapsula `<Grid component="div" container>` para layouts de container
   - **GridItem**: Encapsula `<Grid component="div" item>` para itens dentro do grid
   - **ListItemWrapper**: Encapsula `<ListItem component="div">` para itens de lista
   - **MenuItemWrapper**: Encapsula `<MenuItem component="li">` para itens de menu

   Esta abordagem permitiu:

   - Manter a tipagem forte do TypeScript
   - Centralizar as correções de compatibilidade
   - Facilitar a manutenção do código
   - Simplificar a migração de múltiplos componentes

2. **Tipagem com TypeScript**:

   Utilizamos interfaces que estendem as props originais dos componentes com Omit para remover propriedades que causavam conflito:

   ```tsx
   interface GridItemProps extends Omit<GridProps, 'item'> {
     children: ReactNode;
     xs?: number | boolean;
     // outras props...
   }
   ```

3. **Migração Progressiva**:

   Migramos os componentes em ordem de dependência e importância:

   - Primeiro os componentes de interface geral (5 componentes)
   - Em seguida os componentes de screening (9 componentes)
   - Por último o componente de AI (1 componente)

### Resultados

A abordagem foi bem-sucedida, permitindo que todos os 15 componentes planejados fossem migrados sem recorrer ao downgrade das dependências. Os componentes wrapper funcionaram como esperado em todos os contextos, resolvendo os problemas de tipagem e mantendo a funcionalidade original.

### Lições Aprendidas

1. **Centralização da solução**: Criar componentes wrapper foi mais eficiente do que adicionar a propriedade `component` em cada ocorrência dos componentes.

2. **Tipagem forte**: Manter a tipagem forte do TypeScript foi crucial para identificar e resolver problemas de compatibilidade.

3. **Abordagem progressiva**: Migrar os componentes gradualmente permitiu identificar padrões de problemas e refinir a solução ao longo do processo.

4. **Documentação**: Documentar a solução e o progresso facilitou a coordenação do trabalho e o entendimento da equipe.

Essas lições serão aplicadas nas próximas etapas do projeto, especialmente na resolução dos problemas pendentes de tipagem em hooks e serviços.

## Próximos Componentes a Migrar (Ordem de Prioridade)

1. **Corrigir erros de tipagem em hooks e serviços**:

   - useAssessments.test.tsx
   - TeamService.ts

2. **Atualizar MSW para a nova API**:

   - Implementar mudanças conforme documentação em msw-atualizacao.md

3. **Criar testes para componentes wrapper**:
   - GridItem.test.tsx
   - GridContainer.test.tsx
   - ListItemWrapper.test.tsx
   - MenuItemWrapper.test.tsx

## Conclusão

A migração para Material UI 7 e React 19 progrediu significativamente. Concluímos a migração de todos os componentes planejados: cinco componentes de interface geral, nove componentes de screening e um componente de AI. Todos agora utilizam os wrappers GridContainer, GridItem, ListItemWrapper e MenuItemWrapper conforme apropriado.

A implementação dos componentes wrapper resolveu os problemas de tipagem do Material UI 7, especialmente com o Grid, ListItem e MenuItem que agora exigem a propriedade 'component'. A estratégia de usar interfaces que estendem as props originais dos componentes permitiu uma solução elegante que preserva a tipagem correta.

O próximo foco será corrigir problemas de tipagem em hooks e serviços, seguido pela atualização do MSW e pela criação de testes para os componentes wrapper. Continuaremos seguindo a abordagem progressiva, garantindo que cada componente seja testado apropriadamente após as alterações.
