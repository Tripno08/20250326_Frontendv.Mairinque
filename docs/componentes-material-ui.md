# Componentes Material UI 7

Este documento fornece exemplos e melhores práticas para utilização dos componentes do Material UI 7 no projeto Innerview Escola, de acordo com os padrões estabelecidos.

## Importações

### Importação Recomendada

Para melhor performance e tree-shaking, sempre importe os componentes diretamente do caminho específico:

```tsx
// ✅ Recomendado
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
```

### Importação Não Recomendada

Evite importações agrupadas que podem aumentar o tamanho do bundle:

```tsx
// ❌ Não recomendado
import { Button, Typography, Box } from '@mui/material';
```

## Uso da Diretiva 'use client'

Como os componentes do Material UI são Client Components, é necessário adicionar a diretiva no topo dos arquivos:

```tsx
'use client';

import React from 'react';
import Button from '@mui/material/Button';

export default function MeuComponente() {
  return <Button variant="contained">Clique Aqui</Button>;
}
```

## Estilos e Tema

### Sistema de Estilos

Utilizamos o sistema de estilo `sx` do Material UI para estilos inline com acesso ao tema:

```tsx
<Box
  sx={{
    p: 2, // padding: theme.spacing(2)
    bgcolor: 'background.paper',
    color: 'text.primary',
    borderRadius: 1,
    boxShadow: 1,
  }}
>
  Conteúdo
</Box>
```

### Responsividade

Use breakpoints para estilos responsivos:

```tsx
<Box
  sx={{
    width: {
      xs: '100%', // 0px ou maior
      sm: '50%', // 600px ou maior
      md: '33.33%', // 900px ou maior
      lg: '25%', // 1200px ou maior
      xl: '20%', // 1536px ou maior
    },
    p: {
      xs: 1,
      sm: 2,
      md: 3,
    },
  }}
>
  Conteúdo responsivo
</Box>
```

## Exemplos de Componentes

### Formulários

```tsx
'use client';

import React, { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';

export default function FormularioExemplo() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [tipo, setTipo] = useState('');
  const [erro, setErro] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome || !email || !tipo) {
      setErro('Todos os campos são obrigatórios');
      return;
    }

    setErro('');
    // Lógica de envio
    console.log({ nome, email, tipo });
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        maxWidth: 500,
        mx: 'auto',
        p: 3,
        borderRadius: 2,
        boxShadow: 3,
        bgcolor: 'background.paper',
      }}
    >
      <TextField
        label="Nome"
        value={nome}
        onChange={e => setNome(e.target.value)}
        fullWidth
        required
      />

      <TextField
        label="Email"
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        fullWidth
        required
      />

      <FormControl fullWidth required>
        <InputLabel>Tipo</InputLabel>
        <Select value={tipo} onChange={e => setTipo(e.target.value)} label="Tipo">
          <MenuItem value="estudante">Estudante</MenuItem>
          <MenuItem value="professor">Professor</MenuItem>
          <MenuItem value="administrador">Administrador</MenuItem>
        </Select>
      </FormControl>

      {erro && <FormHelperText error>{erro}</FormHelperText>}

      <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
        Enviar
      </Button>
    </Box>
  );
}
```

### Layout com Cards

```tsx
'use client';

import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';

interface ItemProps {
  titulo: string;
  descricao: string;
  imagem: string;
}

const itens: ItemProps[] = [
  {
    titulo: 'Item 1',
    descricao: 'Descrição do Item 1',
    imagem: '/placeholder1.jpg',
  },
  {
    titulo: 'Item 2',
    descricao: 'Descrição do Item 2',
    imagem: '/placeholder2.jpg',
  },
  {
    titulo: 'Item 3',
    descricao: 'Descrição do Item 3',
    imagem: '/placeholder3.jpg',
  },
];

export default function LayoutCards() {
  return (
    <Box sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" align="center" gutterBottom>
        Exemplos de Cards
      </Typography>

      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 2,
          justifyContent: 'center',
          mt: 4,
        }}
      >
        {itens.map(item => (
          <Box
            key={item.titulo}
            sx={{
              width: { xs: '100%', sm: '45%', md: '30%' },
              minWidth: 250,
            }}
          >
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardMedia component="img" height="140" image={item.imagem} alt={item.titulo} />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" component="h2" gutterBottom>
                  {item.titulo}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.descricao}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" color="primary">
                  Ver Detalhes
                </Button>
                <Button size="small">Mais Informações</Button>
              </CardActions>
            </Card>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
```

### Tabelas de Dados

```tsx
'use client';

import React from 'react';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

interface Dado {
  id: number;
  nome: string;
  categoria: string;
  status: string;
  data: string;
}

const dados: Dado[] = [
  { id: 1, nome: 'Item 1', categoria: 'Categoria A', status: 'Ativo', data: '2025-01-15' },
  { id: 2, nome: 'Item 2', categoria: 'Categoria B', status: 'Inativo', data: '2025-02-20' },
  { id: 3, nome: 'Item 3', categoria: 'Categoria A', status: 'Ativo', data: '2025-03-10' },
  { id: 4, nome: 'Item 4', categoria: 'Categoria C', status: 'Pendente', data: '2025-04-05' },
  { id: 5, nome: 'Item 5', categoria: 'Categoria B', status: 'Ativo', data: '2025-05-12' },
];

export default function TabelaExemplo() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box sx={{ width: '100%', overflow: 'hidden' }}>
      <Typography variant="h5" component="h2" sx={{ mb: 2 }}>
        Tabela de Dados
      </Typography>

      <Paper sx={{ width: '100%', mb: 2 }}>
        <TableContainer>
          <Table sx={{ minWidth: 650 }} aria-label="tabela simples">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Nome</TableCell>
                <TableCell>Categoria</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Data</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {dados.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(row => (
                <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell component="th" scope="row">
                    {row.id}
                  </TableCell>
                  <TableCell>{row.nome}</TableCell>
                  <TableCell>{row.categoria}</TableCell>
                  <TableCell>{row.status}</TableCell>
                  <TableCell>{row.data}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={dados.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Linhas por página:"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} de ${count !== -1 ? count : `mais de ${to}`}`
          }
        />
      </Paper>
    </Box>
  );
}
```

## Boas Práticas

### Perfomance

1. **Memoização**: Use `React.memo`, `useMemo` e `useCallback` para componentes e funções que não precisam ser renderizados frequentemente.

```tsx
const MeuComponente = React.memo(function MeuComponente({ prop1, prop2 }) {
  // Componente
});
```

2. **Lazy Loading**: Carregue componentes pesados sob demanda:

```tsx
const ComponentePesado = React.lazy(() => import('./ComponentePesado'));

function MinhaApp() {
  return (
    <React.Suspense fallback={<div>Carregando...</div>}>
      <ComponentePesado />
    </React.Suspense>
  );
}
```

### Acessibilidade

1. **Rótulos e Descrições**: Sempre forneça rótulos e descrições adequadas:

```tsx
<TextField
  id="email-input"
  label="Email"
  aria-describedby="email-helper-text"
/>
<FormHelperText id="email-helper-text">
  Digite seu endereço de email
</FormHelperText>
```

2. **Contraste**: Garanta contraste adequado entre texto e fundo.

3. **Navegação por Teclado**: Verifique se todos os elementos interativos são acessíveis por teclado.

### Consistência no Tema

Utilize o tema para manter consistência na aplicação:

```tsx
// ✅ Recomendado: uso do sistema de tema
<Box
  sx={{
    bgcolor: 'primary.main',
    color: 'primary.contrastText',
    p: 2,
    borderRadius: 1,
  }}
>
  Conteúdo
</Box>

// ❌ Não recomendado: uso de valores hard-coded
<Box
  sx={{
    backgroundColor: '#1976d2',
    color: 'white',
    padding: '16px',
    borderRadius: '4px',
  }}
>
  Conteúdo
</Box>
```

## Componentes Customizados

### Estendendo Componentes MUI

```tsx
'use client';

import React from 'react';
import Button, { ButtonProps } from '@mui/material/Button';
import { styled } from '@mui/material/styles';

// Botão customizado estendendo o Button do Material UI
const BotaoPrimario = styled(Button)<ButtonProps>(({ theme }) => ({
  borderRadius: 28,
  padding: '10px 24px',
  fontSize: 16,
  fontWeight: 600,
  textTransform: 'none',
  boxShadow: theme.shadows[3],
  '&:hover': {
    boxShadow: theme.shadows[5],
  },
}));

// Uso do componente customizado
export default function ExemploBotaoCustomizado() {
  return (
    <div>
      <BotaoPrimario variant="contained" color="primary">
        Botão Customizado
      </BotaoPrimario>
    </div>
  );
}
```

## Considerações Finais

- Siga os padrões estabelecidos neste documento para manter consistência no código.
- Consulte a [documentação oficial do Material UI](https://mui.com/material-ui/) para mais detalhes sobre os componentes.
- Atualize este documento conforme novos padrões e componentes forem adicionados ao projeto.

## Referências

- [Padrões de código do projeto](./padroes-codigo.md)
- [Material UI com Next.js App Router](https://mui.com/material-ui/integrations/nextjs/)
- [Documentação oficial do Material UI](https://mui.com/material-ui/)
