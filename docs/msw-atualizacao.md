# Atualização do Mock Service Worker (MSW)

Este documento descreve o processo para atualizar a biblioteca Mock Service Worker (MSW) para a versão mais recente no projeto Innerview Escola.

## Problema

A versão atual do MSW utiliza a API antiga (`rest`), que está deprecada nas versões mais recentes. Para compatibilidade com React 19 e outras dependências atualizadas, precisamos migrar para a nova API (`http`).

## Solução

### 1. Atualizar as Importações

Atualizar a importação de `rest` para `http`:

```typescript
// Antes
import { rest } from 'msw';

// Depois
import { http } from 'msw';
```

### 2. Refatorar os Handlers

Refatorar os handlers para usar a nova API:

```typescript
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

### 3. Exemplo Completo de Migração

Abaixo está um exemplo completo de migração de um arquivo de handlers:

#### Antes:

```typescript
import { setupServer } from 'msw/node';
import { rest } from 'msw';

const handlers = [
  rest.get('/api/integrations/lti/config', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        clientId: 'test_client_id',
        clientSecret: 'test_client_secret',
        launchUrl: 'https://test.launch.url',
        platformUrl: 'https://test.platform.url',
        isActive: true,
      })
    );
  }),

  rest.post('/api/integrations/lti/config', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ message: 'Configuração atualizada com sucesso' }));
  }),
];

export const server = setupServer(...handlers);
```

#### Depois:

```typescript
import { setupServer } from 'msw/node';
import { http } from 'msw';

const handlers = [
  http.get('/api/integrations/lti/config', () => {
    return new Response(
      JSON.stringify({
        clientId: 'test_client_id',
        clientSecret: 'test_client_secret',
        launchUrl: 'https://test.launch.url',
        platformUrl: 'https://test.platform.url',
        isActive: true,
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }),

  http.post('/api/integrations/lti/config', () => {
    return new Response(JSON.stringify({ message: 'Configuração atualizada com sucesso' }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }),
];

export const server = setupServer(...handlers);
```

### 4. Acessando Parâmetros da Requisição

Na nova API, o acesso a parâmetros é ligeiramente diferente:

#### Antes:

```typescript
rest.get('/api/users/:id', (req, res, ctx) => {
  const id = req.params.id;
  const query = req.url.searchParams.get('filter');
  const { authorization } = req.headers.all();
  const body = req.body;

  return res(ctx.json({ id, query }));
});
```

#### Depois:

```typescript
http.get('/api/users/:id', ({ params, request }) => {
  const id = params.id;
  const url = new URL(request.url);
  const query = url.searchParams.get('filter');
  const authorization = request.headers.get('Authorization');
  const body = request.json(); // Note que isso retorna uma Promise

  return new Response(JSON.stringify({ id, query }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
});
```

### 5. Respostas com Delay ou Erro

Para simular delays ou erros:

#### Antes:

```typescript
rest.get('/api/slow', (req, res, ctx) => {
  return res(ctx.delay(1000), ctx.status(200), ctx.json({ data: 'slow response' }));
});

rest.get('/api/error', (req, res, ctx) => {
  return res(ctx.status(500), ctx.json({ error: 'Internal Server Error' }));
});
```

#### Depois:

```typescript
http.get('/api/slow', async () => {
  await new Promise(resolve => setTimeout(resolve, 1000));

  return new Response(JSON.stringify({ data: 'slow response' }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
});

http.get('/api/error', () => {
  return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
    status: 500,
    headers: {
      'Content-Type': 'application/json',
    },
  });
});
```

## Arquivos a Atualizar

Os seguintes arquivos precisam ser atualizados:

- `src/mocks/server.ts` - Handlers principais do servidor mock
- `src/mocks/browser.ts` (se existir) - Handlers para o ambiente de navegador
- Qualquer outro arquivo que utilize a API do MSW

## Testes

Após atualizar o MSW, certifique-se de executar os testes para verificar se tudo está funcionando corretamente:

```bash
npm test
```

## Considerações de Compatibilidade

A atualização do MSW é considerada de prioridade baixa, pois afeta principalmente os testes e o ambiente de desenvolvimento. Recomenda-se realizar essa atualização após resolver os problemas mais críticos relacionados aos componentes UI e à tipagem.

## Referências

- [Documentação oficial do MSW](https://mswjs.io/docs/)
- [Guia de migração do MSW](https://mswjs.io/docs/migrations/1.x-to-2.x/)
