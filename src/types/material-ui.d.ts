import '@mui/material/styles';
import { CSSProperties } from 'react';
import { Theme as MuiTheme } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Theme {
    status: {
      danger: string;
    };
    custom: {
      gradients: {
        primary: string;
        secondary: string;
        success: string;
        warning: string;
        error: string;
        info: string;
      };
    };
  }
  interface Palette {
    neutral: Palette['primary'];
  }
  interface PaletteOptions {
    neutral?: PaletteOptions['primary'];
  }
  interface PaletteColor {
    lighter?: string;
    darker?: string;
  }
  interface SimplePaletteColorOptions {
    lighter?: string;
    darker?: string;
  }
  interface ThemeOptions {
    status?: {
      danger?: string;
    };
    custom?: {
      gradients?: {
        primary?: string;
        secondary?: string;
        success?: string;
        warning?: string;
        error?: string;
        info?: string;
      };
    };
  }
}

declare module '@mui/material/Button' {
  interface ButtonPropsVariantOverrides {
    primary: true;
    secondary: true;
    success: true;
    warning: true;
    error: true;
    info: true;
    dashed: true;
  }
  interface ButtonPropsColorOverrides {
    neutral: true;
  }
}

declare module '@mui/material/Paper' {
  interface PaperPropsVariantOverrides {
    gradient: true;
  }
}

declare module '@mui/material/Card' {
  interface CardPropsVariantOverrides {
    gradient: true;
  }
}

export interface ResponsiveStyleValue<T> {
  xs?: T;
  sm?: T;
  md?: T;
  lg?: T;
  xl?: T;
}

export type Theme = MuiTheme;
