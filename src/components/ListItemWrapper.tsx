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
  [key: string]: any; // Para permitir outras props que possam ser passadas para o ListItem
}

/**
 * ListItemWrapper é um componente wrapper para o ListItem do Material UI 7,
 * que já inclui a propriedade 'component' definida como "div".
 *
 * Isso resolve problemas de tipagem no Material UI 7 com React 19.
 */
export const ListItemWrapper: React.FC<ListItemWrapperProps> = ({ children, ...props }) => {
  return (
    <ListItem component="div" {...props}>
      {children}
    </ListItem>
  );
};

export default ListItemWrapper;
