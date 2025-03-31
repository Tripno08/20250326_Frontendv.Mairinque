import React, { ReactNode } from 'react';
import { Grid, GridProps } from '@mui/material';

interface GridContainerProps extends Omit<GridProps, 'container'> {
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
}

/**
 * GridContainer é um componente wrapper para o Grid do Material UI 7 com a propriedade container,
 * que já inclui a propriedade 'component' definida como "div".
 */
export const GridContainer: React.FC<GridContainerProps> = ({ children, ...props }) => {
  return (
    <Grid component="div" container {...props}>
      {children}
    </Grid>
  );
};

export default GridContainer;
