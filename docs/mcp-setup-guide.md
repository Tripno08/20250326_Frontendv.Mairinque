# Guia de Configuração do MCP para o Projeto Innerview

Este documento explica como configurar e utilizar o Multi-Context Processing (MCP) com o Claude via Cursor.ai para desenvolvimento do projeto Innerview.

## O que é MCP (Multi-Context Processing)?

MCP permite que o Claude analise e compreenda múltiplos arquivos simultaneamente ao ajudar no desenvolvimento. Isso é especialmente valioso para o projeto Innerview devido à sua complexidade e às múltiplas camadas de tecnologia envolvidas.

## Configuração Inicial

### 1. Instalação do Cursor.ai

1. Baixe e instale o Cursor.ai em [cursor.sh](https://www.cursor.sh/)
2. Abra o projeto Innerview no Cursor.ai

### 2. Configuração do arquivo mcp.json

Crie o arquivo `mcp.json` na raiz do projeto com a seguinte estrutura:

```json
{
  "version": 1,
  "contexts": [
    {
      "name": "Project Overview",
      "description": "General overview of the Innerview project, architecture and goals",
      "files": [
        "docs/architecture.md",
        "docs/project_overview.md"
      ]
    },
    {
      "name": "API Documentation",
      "description": "API endpoints and communication with backend",
      "files": [
        "docs/docs_api.md"
      ]
    },
    {
      "name": "Database Schema",
      "description": "Prisma schema and database models",
      "files": [
        "docs/prisma_ref.md"
      ]
    },
    {
      "name": "Frontend Implementation",
      "description": "Frontend implementation plan and components",
      "files": [
        "docs/projeto-frontend-revisado.md",
        "docs/material-ui-api-doc.md"
      ]
    },
    {
      "name": "Development Guidelines",
      "description": "Coding standards and development practices",
      "files": [
        "docs/cursor-ai-rules.md",
        "docs/innerview-desenvolvimento.md"
      ]
    },
    {
      "name": "RTI/MTSS Concepts",
      "description": "Educational concepts and domain knowledge for RTI/MTSS",
      "files": [
        "docs/rti-mtss-concepts.md"
      ]
    },
    {
      "name": "Backend Implementation",
      "description": "Backend implementation details",
      "files": [
        "docs/ProjetoBackend.md"
      ]
    },
    {
      "name": "Component Examples",
      "description": "Examples of key components implementation",
      "files": [
        "docs/component-examples.md"
      ]
    },
    {
      "name": "TypeScript Types",
      "description": "TypeScript types used in the project",
      "files": [
        "docs/typescript-types.md"
      ]
    },
    {
      "name": "Services and API",
      "description": "Service implementations and API communication",
      "files": [
        "docs/services-api.md"
      ]
    }
  ],
  "settings": {
    "defaultModel": "claude-3-sonnet-20240229",
    "contextWindow": 200000,
    "autoIncludeCurrentFile": true,
    "useFileHistory": true,
    "fileTypes": [
      ".tsx",
      ".ts",
      ".js",
      ".jsx",
      ".md",
      ".json",
      ".css",
      ".scss"
    ],
    "excludePatterns": [
      "node_modules/**",
      ".git/**",
      "dist/**",
      ".next/**",
      "build/**"
    ]
  }
}
```

### 3. Configuração do Claude no Cursor.ai

1. Acesse as configurações do Cursor.ai
2. Selecione a seção "AI Assistant"
3. Escolha "Claude" como provedor
4. Insira sua API key da Anthropic (se necessário)
5. Certifique-se de que o MCP esteja habilitado

### 4. Verificação da configuração

Após a configuração, reinicie o Cursor.ai e verifique se o MCP está funcionando corretamente.

## Estrutura dos Arquivos de Contexto

Os arquivos de contexto para o MCP estão organizados no diretório `docs/` e incluem:

1. **architecture.md**: Visão geral da arquitetura do projeto
2. **project_overview.md**: Descrição geral do projeto e seus objetivos
3. **docs_api.md**: Documentação detalhada da API backend
4. **prisma_ref.md**: Schema Prisma do projeto
5. **projeto-frontend-revisado.md**: Plano de implementação frontend
6. **material-ui-api-doc.md**: Documentação dos componentes estendidos do Material UI
7. **cursor-ai-rules.md**: Regras específicas para o Cursor.ai
8. **innerview-desenvolvimento.md**: Guia de desenvolvimento e cronograma
9. **rti-mtss-concepts.md**: Conceitos educacionais de RTI/MTSS
10. **component-examples.md**: Exemplos de implementação de componentes
11. **typescript-types.md**: Tipos TypeScript utilizados no projeto
12. **services-api.md**: Implementação de serviços e comunicação com API
13. **ProjetoBackend.md**: Detalhes da implementação do backend

## Como Usar o MCP no Desenvolvimento

### 1. Comandos do Cursor.ai para MCP

O Cursor.ai fornece vários comandos para trabalhar com o MCP:

- `/context`: Mostra os contextos atualmente carregados
- `/use-context [nome]`: Carrega um contexto específico
- `/use-contexts [nome1] [nome2] ...`: Carrega múltiplos contextos
- `/clear-context`: Limpa todos os contextos carregados
- `/mcp-status`: Verifica o status atual do MCP

### 2. Práticas Recomendadas

#### Carregar Contextos Relevantes

Para tarefas específicas, carregue apenas os contextos necessários para evitar sobrecarga:

```
/use-context Frontend Implementation API Documentation
```

#### Solicitar Ajuda com Referência a Contextos

Ao solicitar ajuda ao Claude, referencie explicitamente os contextos:

```
Baseado no schema Prisma e nas regras de nossa API, como devo implementar o componente de listagem de intervenções?
```

#### Desenvolvimento por Domínio

Agrupe suas tarefas por domínio para maximizar a eficácia do MCP:

1. **Ao trabalhar com componentes de RTI/MTSS**:
   ```
   /use-contexts Frontend Implementation RTI/MTSS Concepts Component Examples
   ```

2. **Ao trabalhar com integrações de API**:
   ```
   /use-contexts API Documentation Services and API TypeScript Types
   ```

3. **Ao implementar novas características**:
   ```
   /use-contexts Project Overview Frontend Implementation Development Guidelines
   ```

### 3. Fluxo de Trabalho Eficiente

#### Análise de Código Existente

Para analisar código existente:

1. Abra o arquivo que deseja analisar
2. Carregue os contextos relevantes:
   ```
   /use-contexts Component Examples TypeScript Types
   ```
3. Peça ao Claude para explicar ou analisar o código

#### Desenvolvimento de Novo Componente

Para desenvolver um novo componente:

1. Carregue os contextos relevantes:
   ```
   /use-contexts Frontend Implementation Component Examples TypeScript Types Services and API
   ```
2. Pergunte ao Claude:
   ```
   Por favor, ajude-me a criar um novo componente StudentInterventionList que exibe as intervenções de um estudante, seguindo nosso padrão de design e integração com a API.
   ```

#### Debugging

Para ajuda no debugging:

1. Abra o arquivo com o problema
2. Carregue os contextos relevantes:
   ```
   /use-contexts Services and API TypeScript Types
   ```
3. Descreva o erro para o Claude

## Exemplos de Prompts Efetivos para o Projeto Innerview

### Desenvolvimento de Componentes

```
Usando os contextos de Frontend Implementation e Component Examples, por favor crie um componente React TypeScript para visualizar a distribuição de estudantes nos níveis do RTI/MTSS. O componente deve:

1. Utilizar nossos padrões de estilo do Material UI estendido
2. Visualizar os três níveis da pirâmide
3. Mostrar a contagem e porcentagem de estudantes em cada nível
4. Incluir animações suaves usando Framer Motion
5. Ser totalmente responsivo
```

### Integração com API

```
Com base nos contextos de API Documentation e Services and API, ajude-me a implementar um hook React Query para buscar e gerenciar os dados de avaliações de um estudante. Quero:

1. Buscar as avaliações de um estudante específico
2. Permitir adicionar novas avaliações
3. Atualizar avaliações existentes
4. Implementar tratamento de erros adequado
5. Gerenciar o estado de carregamento
```

### Implementação de Novos Recursos

```
Considerando o RTI/MTSS Concepts e Frontend Implementation, preciso implementar um dashboard para coordenadores RTI/MTSS que mostre:

1. Distribuição geral de estudantes por nível
2. Métricas de progresso por domínio (leitura, matemática, etc.)
3. Alertas para estudantes que não estão respondendo adequadamente
4. Recomendações de intervenção baseadas nos dados

Por favor, ajude-me a projetar os componentes necessários e a lógica para buscar e processar esses dados.
```

## Solução de Problemas

### O MCP não está carregando os contextos

1. Verifique se o arquivo `mcp.json` está na raiz do projeto
2. Confirme que os caminhos dos arquivos estão corretos
3. Reinicie o Cursor.ai
4. Verifique o status com `/mcp-status`

### Mensagens de erro sobre tamanho do contexto

Se você encontrar mensagens sobre o tamanho do contexto exceder os limites:

1. Reduza o número de contextos carregados simultaneamente
2. Torne os arquivos de contexto mais concisos
3. Ajuste o `contextWindow` no arquivo `mcp.json`

### O Claude não está usando as informações dos contextos corretamente

1. Seja mais explícito ao referenciar os contextos em seus prompts
2. Verifique se os contextos estão realmente carregados com `/context`
3. Certifique-se de que a informação que você procura está nos arquivos de contexto carregados

## Recursos Adicionais

- [Documentação oficial do Cursor.ai](https://docs.cursor.sh)
- [Guia de MCP do Claude](https://docs.anthropic.com/claude/docs/multi-context-processing)
- [Guia de prompts eficientes](https://docs.anthropic.com/claude/docs/introduction-to-prompting)

## Conclusão

O MCP com Claude via Cursor.ai oferece uma poderosa ferramenta para desenvolvimento do projeto Innerview. Ao utilizar múltiplos contextos simultaneamente, é possível criar soluções mais integradas e coerentes, respeitando a arquitetura e os padrões do projeto.

Lembre-se de manter os arquivos de contexto atualizados à medida que o projeto evolui para maximizar os benefícios do MCP.