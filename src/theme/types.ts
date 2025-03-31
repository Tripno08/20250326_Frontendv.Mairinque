import '@mui/material/styles';
import { Shadows } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Theme {
    palette: {
      primary: {
        main: string;
        light: string;
        dark: string;
        contrastText: string;
      };
      secondary: {
        main: string;
        light: string;
        dark: string;
        contrastText: string;
      };
      success: {
        main: string;
        light: string;
        dark: string;
        contrastText: string;
      };
      warning: {
        main: string;
        light: string;
        dark: string;
        contrastText: string;
      };
      error: {
        main: string;
        light: string;
        dark: string;
        contrastText: string;
      };
      background: {
        default: string;
        paper: string;
      };
      text: {
        primary: string;
        secondary: string;
      };
      divider: string;
      grey: {
        50: string;
        100: string;
        200: string;
        300: string;
        400: string;
        500: string;
        600: string;
        700: string;
        800: string;
        900: string;
      };
    };
    typography: {
      fontFamily: string;
      fontSize: number;
      fontWeightLight: number;
      fontWeightRegular: number;
      fontWeightMedium: number;
      fontWeightBold: number;
      h1: {
        fontSize: string;
        fontWeight: number;
      };
      h2: {
        fontSize: string;
        fontWeight: number;
      };
      h3: {
        fontSize: string;
        fontWeight: number;
      };
      h4: {
        fontSize: string;
        fontWeight: number;
      };
      h5: {
        fontSize: string;
        fontWeight: number;
      };
      h6: {
        fontSize: string;
        fontWeight: number;
      };
      subtitle1: {
        fontSize: string;
        fontWeight: number;
      };
      subtitle2: {
        fontSize: string;
        fontWeight: number;
      };
      body1: {
        fontSize: string;
        fontWeight: number;
      };
      body2: {
        fontSize: string;
        fontWeight: number;
      };
      button: {
        fontSize: string;
        fontWeight: number;
        textTransform: string;
      };
      caption: {
        fontSize: string;
        fontWeight: number;
      };
      overline: {
        fontSize: string;
        fontWeight: number;
      };
    };
    shape: {
      borderRadius: number;
    };
    shadows: Shadows;
    spacing: (factor: number) => string;
  }

  interface ThemeOptions {
    shadows?: Shadows;
  }
}
