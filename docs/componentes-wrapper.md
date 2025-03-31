# Componentes Wrapper para Material UI 7

Este documento descreve os componentes wrapper criados para resolver problemas de compatibilidade entre o Material UI 7 e o React 19 no projeto Innerview Escola.

## Problema

Com a atualização para o Material UI 7 e React 19, surgiram problemas de tipagem e compatibilidade em diversos componentes, principalmente:

1. O componente `Grid` passou a exigir a propriedade `component` para especificar o elemento HTML a ser renderizado
2. O componente `ListItem` também passou a exigir a propriedade `component`
3. Outros componentes como `MenuItem`, `Tab` e outros elementos interativos também podem apresentar problemas semelhantes

## Soluções Implementadas

### 1. GridItem

O componente `GridItem` é um wrapper para o `Grid` do Material UI 7 que já inclui a propriedade `item` sempre definida como `true` e `component` como `"div"`.

#### Implementação

```tsx
import React, { ReactNode } from 'react';
import { Grid } from '@mui/material';

export interface GridItemProps {
  children: ReactNode;
  xs?: number | boolean;
  sm?: number | boolean;
  md?: number | boolean;
  lg?: number | boolean;
  xl?: number | boolean;
  className?: string;
  style?: React.CSSProperties;
  [key: string]: any; // Para permitir outras props que possam ser passadas para o Grid
}

export const GridItem: React.FC<GridItemProps> = ({ children, ...props }) => {
  return (
    <Grid item component="div" {...props}>
      {children}
    </Grid>
  );
};

export default GridItem;
```

#### Uso

```tsx
// Antes
<Grid item xs={12} md={6}>
  <Card>...</Card>
</Grid>;

// Depois
import GridItem from '@/components/GridItem';

<GridItem xs={12} md={6}>
  <Card>...</Card>
</GridItem>;
```

### 2. GridContainer

O componente `GridContainer` é um wrapper para o `Grid` do Material UI 7 com a propriedade `container`, que já inclui a propriedade `component` definida como `"div"`.

#### Implementação

```tsx
import React, { ReactNode } from 'react';
import { Grid } from '@mui/material';

export interface GridContainerProps {
  children: ReactNode;
  spacing?: number;
  direction?: 'row' | 'row-reverse' | 'column' | 'column-reverse';
  justifyContent?:
    | 'flex-start'
    | 'center'
    | 'flex-end'
    | 'space-between'
    | 'space-around'
    | 'space-evenly';
  alignItems?: 'flex-start' | 'center' | 'flex-end' | 'stretch' | 'baseline';
  wrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
  className?: string;
  style?: React.CSSProperties;
  sx?: object;
  [key: string]: any;
}

export const GridContainer: React.FC<GridContainerProps> = ({ children, ...props }) => {
  return (
    <Grid container component="div" {...props}>
      {children}
    </Grid>
  );
};

export default GridContainer;
```

#### Uso

```tsx
// Antes
<Grid container spacing={3}>
  <Grid item xs={12} md={6}>
    ...
  </Grid>
  <Grid item xs={12} md={6}>
    ...
  </Grid>
</Grid>;

// Depois
import GridContainer from '@/components/GridContainer';
import GridItem from '@/components/GridItem';

<GridContainer spacing={3}>
  <GridItem xs={12} md={6}>
    ...
  </GridItem>
  <GridItem xs={12} md={6}>
    ...
  </GridItem>
</GridContainer>;
```

### 3. ListItemWrapper

O componente `ListItemWrapper` é um wrapper para o `ListItem` do Material UI 7 que já inclui a propriedade `component` definida como `"div"`.

#### Implementação

```tsx
import React, { ReactNode } from 'react';
import { ListItem, ListItemProps } from '@mui/material';

export interface ListItemWrapperProps {
  children: ReactNode;
  button?: boolean;
  onClick?: () => void;
  alignItems?: 'flex-start' | 'center';
  dense?: boolean;
  divider?: boolean;
  selected?: boolean;
  disablePadding?: boolean;
  sx?: object;
  className?: string;
  [key: string]: any; // Para permitir outras props
}

export const ListItemWrapper: React.FC<ListItemWrapperProps> = ({ children, ...props }) => {
  return (
    <ListItem component="div" {...props}>
      {children}
    </ListItem>
  );
};

export default ListItemWrapper;
```

#### Uso

```tsx
// Antes
<ListItem button onClick={handleClick}>
  <ListItemText primary="Item de lista" />
</ListItem>;

// Depois
import ListItemWrapper from '@/components/ListItemWrapper';

<ListItemWrapper button onClick={handleClick}>
  <ListItemText primary="Item de lista" />
</ListItemWrapper>;
```

### 4. MenuItemWrapper

O componente `MenuItemWrapper` é um wrapper para o `MenuItem` do Material UI 7 que já inclui a propriedade `component` definida como `"li"`.

#### Implementação

```tsx
import React, { ReactNode } from 'react';
import { MenuItem } from '@mui/material';

export interface MenuItemWrapperProps {
  children: ReactNode;
  value?: string | number;
  selected?: boolean;
  disabled?: boolean;
  dense?: boolean;
  divider?: boolean;
  onClick?: React.MouseEventHandler<HTMLLIElement>;
  className?: string;
  sx?: object;
  [key: string]: any; // Para permitir outras props que possam ser passadas para o MenuItem
}

export const MenuItemWrapper: React.FC<MenuItemWrapperProps> = ({ children, ...props }) => {
  return (
    <MenuItem component="li" {...props}>
      {children}
    </MenuItem>
  );
};

export default MenuItemWrapper;
```

#### Uso

```tsx
// Antes
<MenuItem value="option" selected={selected}>
  Opção de menu
</MenuItem>;

// Depois
import MenuItemWrapper from '@/components/MenuItemWrapper';

<MenuItemWrapper value="option" selected={selected}>
  Opção de menu
</MenuItemWrapper>;
```

## Abordagens Alternativas

Além de usar os componentes wrapper, existem outras abordagens que podem ser utilizadas:

### 1. Especificar o Componente Diretamente

Adicionar `component="div"` diretamente aos componentes que exigem essa propriedade:

```tsx
<Grid component="div" item xs={12} md={6}>
  <Card>...</Card>
</Grid>

<ListItem component="div" button onClick={handleClick}>
  <ListItemText primary="Item de lista" />
</ListItem>
```

### 2. Substituir por Componentes Alternativos

Para layouts mais simples, substituir `Grid` por `Box` com flexbox:

```tsx
<Box display="flex" flexDirection="row" flexWrap="wrap">
  <Box width={{ xs: '100%', md: '50%' }} p={1}>
    <Card>...</Card>
  </Box>
</Box>
```

## Criação de Novos Componentes Wrapper

Para criar novos componentes wrapper para outros elementos do Material UI que apresentem problemas semelhantes, siga o padrão:

1. Crie um arquivo para o componente wrapper em `src/components/NomeDoComponenteWrapper.tsx`
2. Importe o componente original do Material UI
3. Defina uma interface para as props que será passada para o componente
4. Passe a prop `component="div"` (ou outro elemento HTML apropriado) junto com as demais props

## Monitoramento de Progresso

Para acompanhar o progresso de migração dos componentes, consulte a seção "Estender a Solução para Outros Componentes" em `docs/proximo-passo.md`.
