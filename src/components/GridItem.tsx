import React, { ReactNode } from 'react';
import { Grid, GridProps } from '@mui/material';

interface GridItemProps extends Omit<GridProps, 'item'> {
  children: ReactNode;
  xs?: number | boolean;
  sm?: number | boolean;
  md?: number | boolean;
  lg?: number | boolean;
  xl?: number | boolean;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * GridItem é um componente wrapper para o Grid do Material UI 7,
 * que já inclui a propriedade 'item' sempre definida como true.
 */
export const GridItem: React.FC<GridItemProps> = ({ children, ...props }) => {
  return (
    <Grid component="div" item {...props}>
      {children}
    </Grid>
  );
};

export default GridItem;
