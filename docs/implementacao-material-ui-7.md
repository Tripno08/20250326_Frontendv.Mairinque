# Implementação do Material UI 7 com React 19

Este documento descreve as melhores práticas e soluções adotadas para a implementação do Material UI 7 em conjunto com React 19 no projeto Innerview Escola.

## 1. Configuração Inicial

### Instalação das Dependências

```bash
npm install @mui/material@latest @mui/icons-material@latest @emotion/react@latest @emotion/styled@latest
npm install @mui/x-date-pickers@latest date-fns@latest
```

### Configuração do Theme Provider

É necessário usar o ThemeProvider do Material UI para garantir que o tema seja aplicado corretamente em toda a aplicação:

```tsx
// src/contexts/ThemeContext.tsx
import React, { createContext, useState, useMemo, useContext, ReactNode } from 'react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import theme from '@/styles/theme';

// ... resto do código do ThemeContext
```

## 2. Problemas Comuns e Soluções

### Problema 1: Conflito de Tipos no Componente Grid

Com o Material UI 7, o componente Grid agora requer uma propriedade `component` para especificar o elemento HTML a ser renderizado.

**Problema**:

```tsx
<Grid item xs={12} sm={6} md={3}>
  <Card>...</Card>
</Grid>

// Erro: Property 'component' is missing in type '{ children: Element; item: true; xs: number; sm: number; md: number; }'
```

**Solução 1**: Adicionar o componente explicitamente:

```tsx
<Grid component="div" item xs={12} sm={6} md={3}>
  <Card>...</Card>
</Grid>
```

**Solução 2**: Criar um componente wrapper (recomendado):

```tsx
// src/components/GridItem.tsx
import React, { ReactNode } from 'react';
import { Grid, GridProps } from '@mui/material';

interface GridItemProps extends Omit<GridProps, 'item'> {
  children: ReactNode;
}

export const GridItem: React.FC<GridItemProps> = ({ children, ...props }) => {
  return (
    <Grid component="div" item {...props}>
      {children}
    </Grid>
  );
};

// Uso:
import GridItem from '@/components/GridItem';

<GridItem xs={12} sm={6} md={3}>
  <Card>...</Card>
</GridItem>;
```

### Problema 2: Incompatibilidade com date-fns v4 e LocalizationProvider

A atualização para o date-fns v4 gerou incompatibilidade com o AdapterDateFns.

**Problema**:

```tsx
<LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
  <DatePicker ... />
</LocalizationProvider>

// Erro: Property 'enUS' is missing in type 'Locale'
```

**Solução**:

```tsx
<LocalizationProvider dateAdapter={AdapterDateFns} locale={ptBR}>
  <DatePicker ... />
</LocalizationProvider>
```

### Problema 3: Configuração de Tema

As definições de tipo do tema do Material UI 7 entraram em conflito com nossas extensões personalizadas.

**Problema**:

```tsx
declare module '@mui/material/styles' {
  interface Palette {
    primary: Palette['primary'] & {
      main: string;
      light: string;
      dark: string;
      contrastText: string;
    };
    // similar para outras cores...
  }
}

// Erro: Subsequent property declarations must have the same type
```

**Solução**:

```tsx
// Criar interface customizada
interface CustomPaletteColor {
  main: string;
  light: string;
  dark: string;
  contrastText: string;
}

// Estender apenas para cores adicionais
declare module '@mui/material/styles' {
  interface Palette {
    neutral: CustomPaletteColor;
  }

  interface PaletteOptions {
    neutral?: Partial<CustomPaletteColor>;
  }
}
```

## 3. Componentes Customizados

### ActionButton

Um componente de botão padronizado que usa os estilos do Material UI 7:

```tsx
import React from 'react';
import { Button, ButtonProps, CircularProgress } from '@mui/material';

interface ActionButtonProps extends Omit<ButtonProps, 'variant'> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  loading?: boolean;
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  children,
  variant = 'primary',
  loading = false,
  disabled,
  startIcon,
  ...props
}) => {
  return (
    <Button
      color={variant}
      disabled={disabled || loading}
      startIcon={loading ? <CircularProgress size={20} color="inherit" /> : startIcon}
      {...props}
    >
      {children}
    </Button>
  );
};
```

### DataGrid

Um componente para exibir dados tabulares com funcionalidades de ordenação e filtro:

```tsx
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TableSortLabel,
  TablePagination,
} from '@mui/material';

// Implementação completa omitida por brevidade
```

## 4. Práticas Recomendadas

1. **Usar Styled Components com Emotion**: O Material UI 7 usa Emotion para estilização. Recomendamos usar a API `styled` para componentes personalizados:

```tsx
import { styled } from '@mui/material/styles';

const CustomCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[3],
  padding: theme.spacing(2),
}));
```

2. **Padronização de Props**: Manter as props dos componentes alinhadas com o Material UI para facilitar a manutenção:

```tsx
// Bom
interface MyComponentProps {
  color?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
  size?: 'small' | 'medium' | 'large';
}

// Evitar
interface MyComponentProps {
  colorType?: 'blue' | 'red' | 'green';
  componentSize?: number;
}
```

3. **Componentes não controlados/controlados**: Seguir o padrão do Material UI para componentes controlados e não controlados:

```tsx
// Componente controlado
<TextField value={value} onChange={handleChange} />

// Componente não controlado
<TextField defaultValue={defaultValue} />
```

## 5. Temas e Estilização

Nosso tema base inclui configurações personalizadas para a paleta de cores, tipografia e componentes:

```tsx
const theme = createTheme({
  palette: {
    primary: {
      main: '#3f51b5',
      light: '#7986cb',
      dark: '#303f9f',
      contrastText: '#fff',
    },
    // outras cores
    neutral: {
      main: '#64748B',
      light: '#cbd5e1',
      dark: '#334155',
      contrastText: '#fff',
    },
  },
  typography: {
    fontFamily: [
      'Inter',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      'sans-serif',
    ].join(','),
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
        },
      },
    },
    // outros componentes
  },
});
```

## 6. Referências

1. [Material UI 7 Documentation](https://mui.com/material-ui/)
2. [Migrating to Material UI 7](https://mui.com/material-ui/migration/migration-v7/)
3. [Material UI 7 with TypeScript](https://mui.com/material-ui/guides/typescript/)
4. [Emotion Documentation](https://emotion.sh/docs/introduction)
5. [React 19 Documentation](https://react.dev/)
