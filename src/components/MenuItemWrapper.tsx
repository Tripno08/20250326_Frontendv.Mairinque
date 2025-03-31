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

/**
 * MenuItemWrapper é um componente wrapper para o MenuItem do Material UI 7,
 * que já inclui a propriedade 'component' definida como "li".
 *
 * Isso resolve problemas de tipagem no Material UI 7 com React 19.
 */
export const MenuItemWrapper: React.FC<MenuItemWrapperProps> = ({ children, ...props }) => {
  return (
    <MenuItem component="li" {...props}>
      {children}
    </MenuItem>
  );
};

export default MenuItemWrapper;
