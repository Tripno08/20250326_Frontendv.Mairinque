# Checklist de Deploy para Testes

Este documento contém a lista de tarefas para preparar e realizar o deploy do ambiente de testes do projeto Innerview Escola.

## Informações do Servidor de Testes

- **Endereço IP**: 45.77.75.5
- **Usuário**: root
- **Senha**: e4@B-(j8mtHNo?z$
- **Diretório de Deploy**: /root/webdev/innerviewBeta1
- **Versão do Node.js**: 23.10.0
- **Versão do NPM**: 10.9.2

## Abordagem de Desenvolvimento

Foi decidido seguir a **abordagem progressiva**: manter as versões mais recentes das dependências (React 19, Material UI 7, etc.) e corrigir todos os problemas de código e tipagem. Essa abordagem demandará mais tempo e esforço, mas resultará em uma base de código mais atualizada e alinhada com as melhores práticas atuais.

## 1. Preparação do Ambiente

- [x] Configurar arquivo `.env.test` com variáveis de ambiente apropriadas

  - Verificar variáveis de API, autenticação e serviços externos
  - Garantir que as configurações sejam adequadas para o ambiente de testes
  - Validar valores de secrets e chaves para o ambiente

- [x] Verificar se todas as dependências estão instaladas e atualizadas

  ```bash
  npm ci --legacy-peer-deps
  ```

- [x] Validar a estrutura de diretórios conforme os padrões documentados
  - Garantir que a estrutura de `/src` segue os padrões definidos em `padroes-codigo.md`
  - Verificar se os componentes seguem a estrutura recomendada (index.tsx, styles.ts, types.ts)

## 2. Verificação de Código

- [x] Verificar erros no código

  ```bash
  npm run lint
  ```

  - [x] Corrigir erros críticos:

    - Corrigido o template literal em ConditionalEdge/styles.ts
    - Corrigido o erro de chave em material-ui.d.ts
    - Corrigido o JSX em setupTests.ts usando React.createElement
    - Corrigido o tsconfig.json para resolver o conflito de moduleResolution
    - Instaladas dependências faltantes:
      - `framer-motion`
      - `@dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities`
      - Atualizada `date-fns` para a versão mais recente
    - Implementadas soluções para Material UI 7 e React 19:
      - Corrigida a declaração de tema em src/styles/theme.ts
      - Criados componentes wrapper para resolver problemas de compatibilidade:
        - GridItem para Grid com item
        - GridContainer para Grid com container
        - ListItemWrapper para ListItem
        - MenuItemWrapper para MenuItem
      - Atualizado uso de LocalizationProvider para usar 'locale' em vez de 'adapterLocale'
      - Corrigida importação do tema no ThemeContext
      - Componentes atualizados para usar os wrappers:
        - RoleAssignment.tsx
        - TeamCommunication.tsx
        - SmartGoalList.tsx
        - TeamManagement.tsx
        - SmartGoalForm.tsx
        - InstrumentScreeningHistoryPieChart.tsx
        - ScreeningCycleManager.tsx
        - AdministratorScreeningHistory.tsx
        - InstrumentScreeningHistoryScatterChart.tsx
        - InstrumentScreeningHistoryChart.tsx
        - ScreeningRuleConditions.tsx
        - ScreeningAdministrationDetails.tsx
        - ScreeningResultsDashboard.tsx
        - ScreeningInstrumentManager.tsx
        - AIAnalysisDashboard.tsx
    - Corrigidos problemas de tipagem em hooks e serviços:
      - useAssessments.test.tsx: adicionadas tipagens corretas para objetos de teste
      - TeamService: corrigido uso de especialidades para usar o enum Specialty em vez de strings
      - TeamService: corrigido retorno do método getTeamMetrics para corresponder à interface TeamMetrics
      - useAssessments.ts: atualizado para usar a sintaxe de objeto único do React Query v5 e simplificada a abordagem de tipagem
    - Atualizado MSW (Mock Service Worker) para a nova API:
      - Substituída a importação de `rest` por `http` em src/mocks/server.ts
      - Refatorados todos os handlers para usar a nova sintaxe com `new Response()`
      - Implementado tratamento de parâmetros de URL usando `({ params })` nos handlers
      - Adicionados headers adequados para todas as respostas
    - Documentação:
      - Criado padrao-componentes-wrapper.md com guia de melhores práticas para novos componentes
      - Adicionado guia de uso dos componentes wrapper
      - Incluídas recomendações sobre tipagem, componentização e outras boas práticas
      - Documentados exemplos de código para ilustrar os padrões recomendados

  - [ ] Pendente:
    - Criar testes para os componentes wrapper:
      - GridItem.test.tsx
      - GridContainer.test.tsx
      - ListItemWrapper.test.tsx
      - MenuItemWrapper.test.tsx

## 3. Testes

- [ ] Executar testes unitários

  ```bash
  npm run test
  ```

- [ ] Executar testes de integração

  ```bash
  npm run test:integration
  ```

- [ ] Executar testes de acessibilidade

  ```bash
  npm run test:a11y
  ```

- [ ] Executar testes de performance

  ```bash
  npm run test:performance
  ```

- [ ] Verificar cobertura de testes
  ```bash
  npm run test:coverage
  ```
  - Identificar áreas com baixa cobertura
  - Adicionar testes adicionais para componentes críticos
  - Atualizar configurações do Jest para suportar React 19

## 4. Build

- [x] Executar build de produção

  ```bash
  npm run build
  ```

- [ ] Verificar warnings e otimizações sugeridas no output do build

  - Analisar sugestões de otimização
  - Corrigir warnings relacionados a performance

- [ ] Validar o tamanho dos bundles gerados

  - Verificar se há chunks excessivamente grandes
  - Identificar oportunidades de code-splitting

- [ ] Analisar dependências para identificar duplicações ou problemas
  ```bash
  npm ls
  ```

## 5. Deploy no Servidor de Testes

- [ ] Preparar o servidor para deploy

  ```bash
  ssh root@45.77.75.5
  mkdir -p /root/webdev/innerviewBeta1
  exit
  ```

- [ ] Transferir os arquivos para o servidor

  ```bash
  rsync -avz --exclude 'node_modules' --exclude '.git' ./ root@45.77.75.5:/root/webdev/innerviewBeta1/
  ```

- [ ] Instalar dependências no servidor

  ```bash
  ssh root@45.77.75.5
  cd /root/webdev/innerviewBeta1
  npm ci --legacy-peer-deps
  ```

- [ ] Configurar variáveis de ambiente no servidor

  ```bash
  cp .env.test .env.local
  ```

- [ ] Buildar a aplicação no servidor

  ```bash
  npm run build
  ```

- [ ] Iniciar a aplicação

  ```bash
  npm start
  ```

- [ ] Configurar PM2 para gerenciamento de processos
  ```bash
  npm install -g pm2
  pm2 start npm --name "innerview-teste" -- start
  pm2 save
  pm2 startup
  ```

## 6. Configuração de CI/CD (Opcional)

- [ ] Configurar integração GitHub com o servidor

  - Criar chave SSH para deploy automático
  - Configurar webhook para atualização automática

- [ ] Criar script de deploy automático

  ```bash
  touch /root/webdev/deploy-innerview.sh
  chmod +x /root/webdev/deploy-innerview.sh
  ```

- [ ] Implementar script de deploy

  ```bash
  #!/bin/bash
  cd /root/webdev/innerviewBeta1
  git pull
  npm ci --legacy-peer-deps
  npm run build
  pm2 restart innerview-teste
  ```

- [ ] Configurar cron job para backup diário
  ```bash
  crontab -e
  # Adicionar: 0 2 * * * tar -czf /root/backup/innerview-$(date +%Y%m%d).tar.gz /root/webdev/innerviewBeta1
  ```

## 7. Validação Pós-Deploy

- [ ] Verificar funcionamento das rotas principais

  - Testar navegação entre páginas
  - Verificar carregamento correto de dados
  - Validar comportamento de autenticação

- [ ] Testar a integração de componentes do Material UI

  - Verificar renderização correta em diferentes navegadores
  - Confirmar que os temas estão sendo aplicados corretamente
  - Testar interatividade dos componentes

- [ ] Validar responsividade em diferentes dispositivos

  - Testar em dispositivos móveis (diferentes tamanhos de tela)
  - Testar em tablets
  - Testar em desktops com diferentes resoluções

- [ ] Executar testes de performance

  - Usar Lighthouse para avaliar métricas principais
  - Verificar Core Web Vitals
  - Identificar gargalos de performance

- [ ] Verificar compatibilidade cross-browser
  - Testar em Chrome, Firefox, Safari e Edge
  - Verificar problemas específicos de navegadores

## 8. Monitoramento

- [ ] Configurar alertas para erros no ambiente de testes

  - Configurar Sentry ou similar para capturar erros
  - Configurar alertas por email para erros críticos

- [ ] Implementar logging

  ```bash
  mkdir -p /root/webdev/innerviewBeta1/logs
  ```

- [ ] Configurar monitoramento de performance

  - Instalar ferramentas de monitoramento

  ```bash
  npm install --save-dev next-runtime-metrics
  ```

- [ ] Monitorar uso de recursos e performance
  - Verificar consumo de memória/CPU
  - Monitorar tempos de resposta da API
  - Verificar métricas de carregamento de página

## 9. Documentação

- [x] Atualizar documentação com informações sobre o ambiente de testes

  - Adicionar endereço IP e informações de acesso ao ambiente
  - Documentar particularidades do ambiente de testes

- [x] Documentar processo de deploy e testes

  - Atualizar documentação com o processo completo
  - Documentar solução para problemas encontrados

- [x] Atualizar CHANGELOG.md com as mudanças implementadas

  - Registrar features adicionadas
  - Documentar correções de bugs
  - Listar melhorias de performance

- [x] Documentar componentes wrapper criados e seu uso
  - Documentação completa em componentes-wrapper.md
  - Exemplos de uso para todos os componentes wrapper implementados
  - Documentação de estratégia em proximo-passo.md
  - Resumo das soluções em material-ui-atualizacao-resumo.md
  - Guia de atualização do MSW em msw-atualizacao.md

## 10. Análise e Feedback

- [ ] Realizar reunião de revisão com a equipe

  - Apresentar o ambiente de testes
  - Revisar problemas encontrados e soluções aplicadas

- [ ] Coletar feedback sobre o ambiente de testes

  - Solicitar feedback de usuários internos
  - Documentar problemas reportados

- [ ] Identificar melhorias para próximos deploys
  - Listar oportunidades de melhoria no processo
  - Priorizar correções para a próxima iteração

## Acompanhamento do Progresso

| Seção                     | Progresso | Responsável | Data Prevista | Status       |
| ------------------------- | --------- | ----------- | ------------- | ------------ |
| 1. Preparação do Ambiente | 3/3       |             |               | Concluído    |
| 2. Verificação de Código  | 3/4       |             |               | Em andamento |
| 3. Testes                 | 0/5       |             |               | Não iniciado |
| 4. Build                  | 1/4       |             |               | Em andamento |
| 5. Deploy no Servidor     | 0/6       |             |               | Não iniciado |
| 6. Configuração de CI/CD  | 0/4       |             |               | Não iniciado |
| 7. Validação Pós-Deploy   | 0/5       |             |               | Não iniciado |
| 8. Monitoramento          | 0/4       |             |               | Não iniciado |
| 9. Documentação           | 4/4       |             |               | Concluído    |
| 10. Análise e Feedback    | 0/3       |             |               | Não iniciado |

## Problemas Encontrados e Soluções

### Conflitos de Dependências

- **Problema**: Conflito entre React 19 e algumas bibliotecas de teste.
- **Solução**: Uso da flag `--legacy-peer-deps` durante a instalação.

### Erros de Formatação

- **Problema**: Numerosos erros de formatação detectados pelo linter.
- **Status**: Em processo de correção. A maioria relacionada a regras de formatação do Prettier.

### Erros de Sintaxe

- **Problema**: Erros de sintaxe em três arquivos principais:
  1. Template literal não fechado em ConditionalEdge/styles.ts
  2. Erros de JSX em setupTests.ts
  3. Chave não fechada em material-ui.d.ts
- **Status**: Corrigido parcialmente. Arquivos reparados, mas surgiram novos erros.

### Erros de Tipagem do Material UI

- **Problema**: Numerosos erros com componentes do Material UI (Grid, ListItem, MenuItem) que exigem propriedade 'component'.
- **Solução**:
  1. Criação de componentes wrapper para encapsular a lógica e resolver os problemas de tipagem:
     - `GridItem`: Wrapper para Grid com item=true e component="div"
     - `GridContainer`: Wrapper para Grid com container=true e component="div"
     - `ListItemWrapper`: Wrapper para ListItem com component="div"
     - `MenuItemWrapper`: Wrapper para MenuItem com component="li"
  2. Atualização dos componentes existentes para usar os wrappers:
     - RoleAssignment.tsx
     - TeamCommunication.tsx
     - SmartGoalList.tsx
     - TeamManagement.tsx
     - SmartGoalForm.tsx
     - InstrumentScreeningHistoryPieChart.tsx
     - ScreeningCycleManager.tsx
     - AdministratorScreeningHistory.tsx
     - InstrumentScreeningHistoryScatterChart.tsx
     - InstrumentScreeningHistoryChart.tsx
     - ScreeningRuleConditions.tsx
     - ScreeningAdministrationDetails.tsx
     - ScreeningResultsDashboard.tsx
  3. Documentação detalhada do processo em componentes-wrapper.md

### Problemas de Incompatibilidade de Dependências

- **Problema**: O projeto utiliza Material UI 7 com React 19, mas alguns componentes e tipos parecem incompatíveis.
- **Solução**: Seguindo a abordagem progressiva, implementamos:
  1. Correção das declarações de tipo para paletas e temas no Material UI
  2. Ajustes nos componentes que usam LocalizationProvider
  3. Adição de cores faltantes (info, warning, error) na paleta de cores
  4. Atualização dos tipos para React Query v5

### Dependências Faltantes

- **Problema**: Build falhou devido a dependências faltantes: framer-motion, @dnd-kit.
- **Solução**: Instaladas as dependências faltantes com `--legacy-peer-deps`.

### Incompatibilidade de date-fns

- **Problema**: Incompatibilidade entre a versão atual do date-fns e @mui/x-date-pickers.
- **Solução**: Correção da importação do locale do ptBR e atualização das props do LocalizationProvider

### Problemas com MSW (Mock Service Worker)

- **Problema**: API antiga do MSW incompatível com versões recentes.
- **Solução**: Documentada a atualização da importação de rest para http e refatoração dos handlers para usar a nova API em msw-atualizacao.md.
