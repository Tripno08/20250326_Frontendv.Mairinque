import { createTheme, ThemeOptions } from '@mui/material/styles';

// Define as interfaces necessárias para estender o tema do Material UI
interface CustomPaletteColor {
  main: string;
  light: string;
  dark: string;
  contrastText: string;
}

declare module '@mui/material/styles' {
  interface Palette {
    neutral: CustomPaletteColor;
  }

  interface PaletteOptions {
    neutral?: Partial<CustomPaletteColor>;
  }

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

// Tema padrão
const theme = createTheme({
  palette: {
    primary: {
      main: '#3f51b5',
      light: '#7986cb',
      dark: '#303f9f',
      contrastText: '#fff',
    },
    secondary: {
      main: '#f50057',
      light: '#ff4081',
      dark: '#c51162',
      contrastText: '#fff',
    },
    success: {
      main: '#4caf50',
      light: '#81c784',
      dark: '#388e3c',
      contrastText: '#fff',
    },
    warning: {
      main: '#ff9800',
      light: '#ffb74d',
      dark: '#f57c00',
      contrastText: '#fff',
    },
    error: {
      main: '#f44336',
      light: '#e57373',
      dark: '#d32f2f',
      contrastText: '#fff',
    },
    info: {
      main: '#2196f3',
      light: '#64b5f6',
      dark: '#1976d2',
      contrastText: '#fff',
    },
    neutral: {
      main: '#64748B',
      light: '#cbd5e1',
      dark: '#334155',
      contrastText: '#fff',
    },
  },
  status: {
    danger: '#e53e3e',
  },
  custom: {
    gradients: {
      primary: 'linear-gradient(195deg, #7286D3, #3f51b5)',
      secondary: 'linear-gradient(195deg, #FF8E9E, #f50057)',
      success: 'linear-gradient(195deg, #66BB6A, #4caf50)',
      warning: 'linear-gradient(195deg, #FFA726, #ff9800)',
      error: 'linear-gradient(195deg, #EF5350, #f44336)',
      info: 'linear-gradient(195deg, #49a3f1, #2196f3)',
    },
  },
  typography: {
    fontFamily: [
      'Inter',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
  },
  shape: {
    borderRadius: 8,
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
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: '0 4px 20px 0 rgba(0,0,0,0.1)',
        },
      },
    },
  },
});

export default theme;
