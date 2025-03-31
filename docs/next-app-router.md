# Utilização do Next.js App Router no Projeto Innerview

Este documento detalha como o App Router do Next.js 15 está implementado no projeto Innerview Escola e como ele se integra com o Material UI 7.

## Introdução ao App Router

O Next.js 15 introduz o App Router, uma nova arquitetura de roteamento baseada em conceitos como:

- **Carregamento de Arquivos por Convenção**: A estrutura de arquivos determina as rotas.
- **Componentes de Servidor (RSC)**: Renderizados no servidor por padrão.
- **Componentes de Cliente**: Marcados com a diretiva `'use client'`.
- **Layouts Aninhados**: Compartilham UI entre rotas.

## Estrutura de Diretórios

```
src/
  ├── app/                    # Diretório principal do App Router
  │   ├── layout.tsx          # Layout raiz (aplicado a todas as rotas)
  │   ├── page.tsx            # Página inicial (rota /)
  │   ├── favicon.ico         # Ícone da aplicação
  │   ├── globals.css         # Estilos globais
  │   └── alunos/             # Rota /alunos
  │       ├── layout.tsx      # Layout específico para rotas de alunos
  │       ├── page.tsx        # Página de listagem (rota /alunos)
  │       └── [id]/           # Rota dinâmica /alunos/[id]
  │           └── page.tsx    # Página de detalhes do aluno
  └── components/             # Componentes compartilhados
      └── ...
```

## Layouts

Os layouts envolvem as páginas e permanecem preservados durante a navegação. São úteis para elementos de UI persistentes como menus e rodapés.

### Layout Raiz

O layout raiz (`src/app/layout.tsx`) é o ponto principal para configurar o Material UI no projeto:

```tsx
import type { Metadata } from 'next';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '../theme/theme';

// Importar fonts via fontsource
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

export const metadata: Metadata = {
  title: 'Innerview Escola',
  description: 'Plataforma educacional avançada...',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            {children}
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
```

> **Importante**: O `AppRouterCacheProvider` do `@mui/material-nextjs` é crucial para a coleta e gerenciamento adequado do CSS durante a renderização do servidor.

### Layout de Seção

Os layouts aninhados são aplicados a seções específicas da aplicação:

```tsx
// src/app/alunos/layout.tsx
'use client';

import React from 'react';
import Box from '@mui/material/Box';
import Sidebar from '@/components/alunos/Sidebar';

export default function AlunosLayout({ children }: { children: React.ReactNode }) {
  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        {children}
      </Box>
    </Box>
  );
}
```

## Páginas

As páginas são os componentes renderizados para uma rota específica:

```tsx
// src/app/page.tsx
'use client';

import React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Bem-vindo ao Innerview Escola
        </Typography>

        <Typography variant="h5" component="p" gutterBottom>
          Plataforma de Gestão Educacional
        </Typography>

        <Button
          variant="contained"
          size="large"
          onClick={() => router.push('/dashboard')}
          sx={{ mt: 2 }}
        >
          Acessar Dashboard
        </Button>
      </Box>
    </Container>
  );
}
```

## Server Components vs. Client Components

O App Router usa Server Components por padrão, o que significa:

1. O código é executado no servidor e apenas o HTML resultante é enviado ao cliente
2. Não há JavaScript desnecessário enviado ao cliente
3. Não é possível usar hooks React ou eventos interativos

### Quando usar Client Components

Adicione a diretiva `'use client'` no topo de arquivos que precisam:

- Usar hooks do React (useState, useEffect, etc.)
- Adicionar event listeners (onClick, onSubmit, etc.)
- Usar APIs do navegador
- Usar componentes interativos (como os do Material UI)

```tsx
'use client';

import React, { useState } from 'react';
import Button from '@mui/material/Button';

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <Button onClick={() => setCount(count + 1)}>Incrementar</Button>
    </div>
  );
}
```

> **Nota**: Todos os componentes do Material UI precisam ser utilizados dentro de Client Components.

## Carregamento e Manipulação de Dados

O App Router oferece diferentes formas de buscar e manipular dados:

### Usando fetch nativo (Server Components)

```tsx
// app/alunos/page.tsx
import AlunoList from '@/components/alunos/AlunoList';

// Função assíncrona que será executada durante a renderização no servidor
async function getAlunos() {
  const res = await fetch('https://api.exemplo.com/alunos');
  if (!res.ok) throw new Error('Falha ao carregar alunos');
  return res.json();
}

export default async function AlunosPage() {
  const alunos = await getAlunos();

  // AlunoList deve ser um Client Component para renderizar componentes do Material UI
  return <AlunoList alunos={alunos} />;
}
```

### Usando React Query (Client Components)

```tsx
'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import TabelaAlunos from './TabelaAlunos';

export default function AlunoList() {
  const { data, error, isLoading } = useQuery({
    queryKey: ['alunos'],
    queryFn: async () => {
      const res = await fetch('/api/alunos');
      return res.json();
    },
  });

  if (isLoading) return <CircularProgress />;
  if (error) return <Alert severity="error">Erro ao carregar alunos</Alert>;

  return <TabelaAlunos alunos={data} />;
}
```

## Rotas API

O App Router permite criar rotas API no diretório `app/api`:

```tsx
// app/api/alunos/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  // Lógica para buscar alunos (ex: do banco de dados)
  const alunos = [
    { id: 1, nome: 'João Silva', serie: '5º ano' },
    { id: 2, nome: 'Maria Souza', serie: '3º ano' },
  ];

  return NextResponse.json(alunos);
}

export async function POST(request: Request) {
  const data = await request.json();
  // Lógica para salvar um novo aluno

  return NextResponse.json({ success: true, data });
}
```

## Carregamento e Tratamento de Erros

O App Router oferece convenções para lidar com estados de carregamento e erros:

### Carregamento

Crie um arquivo `loading.tsx` que será mostrado durante o carregamento:

```tsx
// app/alunos/loading.tsx
'use client';

import React from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';

export default function Loading() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4 }}>
      <CircularProgress size={60} />
      <Typography variant="h6" sx={{ mt: 2 }}>
        Carregando dados...
      </Typography>
    </Box>
  );
}
```

### Erros

Crie um arquivo `error.tsx` para tratamento global de erros:

```tsx
'use client';

import React from 'react';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <Box sx={{ p: 3 }}>
      <Alert severity="error" sx={{ mb: 2 }}>
        <Typography variant="h6">Algo deu errado!</Typography>
        <Typography variant="body2">{error.message}</Typography>
      </Alert>
      <Button variant="contained" onClick={reset}>
        Tentar novamente
      </Button>
    </Box>
  );
}
```

## Considerações sobre Performance

### Renderização Estática

Por padrão, o Next.js renderiza páginas estaticamente, o que é ótimo para performance. Para atualizar dados:

- `revalidatePath`: Revalidar uma rota específica
- `revalidateTag`: Revalidar baseado em tags de cache
- `export const revalidate = 60`: Revalidar a cada 60 segundos

### Streaming

O App Router suporta streaming, permitindo que partes da página sejam enviadas progressivamente:

```tsx
import { Suspense } from 'react';
import Loading from './loading';
import DashboardMetrics from '@/components/DashboardMetrics';

export default function DashboardPage() {
  return (
    <main>
      <h1>Dashboard</h1>

      {/* Conteúdo inicialmente carregado */}
      <section>
        <h2>Resumo</h2>
        <p>Visão geral do sistema</p>
      </section>

      {/* Conteúdo que será carregado posteriormente */}
      <Suspense fallback={<Loading />}>
        <DashboardMetrics />
      </Suspense>
    </main>
  );
}
```

## Melhores Práticas

1. **Mova lógica para o servidor quando possível**:

   - Autenticação
   - Acesso direto a bancos de dados
   - Lógica sensível

2. **Use Client Components apenas quando necessário**:

   - Componentes interativos (formulários, botões)
   - Componentes que usam hooks
   - Componentes que dependem de APIs do navegador

3. **Segmente Client Components corretamente**:

   - Mantenha Server Components como "containers" e Client Components para partes interativas

4. **Utilize os recursos de cache do Next.js**:
   - Revalidação conforme necessário
   - Busca de dados com cache

## Exemplo Completo de Integração

Aqui está um exemplo de estrutura para uma página completa usando App Router e Material UI:

```tsx
// Server Component - Busca dados com a API fetch no servidor
// app/dashboard/page.tsx
import React from 'react';
import MetricasRTI from '@/components/dashboard/MetricasRTI';
import FiltrosData from '@/components/dashboard/FiltrosData';
import { Suspense } from 'react';
import Loading from './loading';

// Busca de dados no servidor
async function getMetricas() {
  const res = await fetch('https://api.exemplo.com/metricas', { cache: 'no-store' });
  if (!res.ok) throw new Error('Falha ao carregar métricas');
  return res.json();
}

export default async function DashboardPage() {
  const metricas = await getMetricas();

  return (
    <div>
      <h1>Dashboard de Acompanhamento</h1>

      {/* Componente Cliente para interatividade */}
      <FiltrosData />

      {/* Componente com dados do servidor com loading fallback */}
      <Suspense fallback={<Loading />}>
        <MetricasRTI dados={metricas} />
      </Suspense>
    </div>
  );
}
```

```tsx
// Client Component - Filtros interativos
// components/dashboard/FiltrosData.tsx
'use client';

import React, { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useRouter } from 'next/navigation';

export default function FiltrosData() {
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const router = useRouter();

  const aplicarFiltros = () => {
    router.push(`/dashboard?inicio=${dataInicio}&fim=${dataFim}`);
  };

  return (
    <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
      <TextField
        label="Data Início"
        type="date"
        value={dataInicio}
        onChange={e => setDataInicio(e.target.value)}
        InputLabelProps={{ shrink: true }}
      />
      <TextField
        label="Data Fim"
        type="date"
        value={dataFim}
        onChange={e => setDataFim(e.target.value)}
        InputLabelProps={{ shrink: true }}
      />
      <Button variant="contained" onClick={aplicarFiltros}>
        Aplicar Filtros
      </Button>
    </Box>
  );
}
```

```tsx
// Client Component - Renderiza as métricas
// components/dashboard/MetricasRTI.tsx
'use client';

import React from 'react';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { MetricasType } from '@/types/dashboard';

interface Props {
  dados: MetricasType;
}

export default function MetricasRTI({ dados }: Props) {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Typography variant="h6">Alunos Tier 1</Typography>
            <Typography variant="h3">{dados.tier1}</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Typography variant="h6">Alunos Tier 2</Typography>
            <Typography variant="h3">{dados.tier2}</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Typography variant="h6">Alunos Tier 3</Typography>
            <Typography variant="h3">{dados.tier3}</Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
```

## Referências

- [Documentação do Next.js App Router](https://nextjs.org/docs/app)
- [Material UI com Next.js App Router](https://mui.com/material-ui/integrations/nextjs/)
- [Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components)
- [Client Components](https://nextjs.org/docs/app/building-your-application/rendering/client-components)
- [Data Fetching](https://nextjs.org/docs/app/building-your-application/data-fetching)
