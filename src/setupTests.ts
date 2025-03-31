import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

// Mock para window.matchMedia
window.matchMedia =
  window.matchMedia ||
  function () {
    return {
      matches: false,
      addListener: jest.fn(),
      removeListener: jest.fn(),
    };
  };

// Objeto de queryClient para testes
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

// Função de renderização com QueryClientProvider
export const renderWithQueryClient = (ui: React.ReactElement) => {
  return render(React.createElement(QueryClientProvider, { client: queryClient }, ui));
};

// Mock do localStorage
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: jest.fn(() => null),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  },
  writable: true,
});

// Mock do sessionStorage
Object.defineProperty(window, 'sessionStorage', {
  value: {
    getItem: jest.fn(() => null),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  },
  writable: true,
});

// Mock do ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock do window.scrollTo
window.scrollTo = jest.fn();

// Mock do IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock do Recharts para testes
jest.mock('recharts', () => ({
  ResponsiveContainer: (props: { children: React.ReactNode }) =>
    React.createElement('div', { 'data-testid': 'mock-responsive-container' }, props.children),
  LineChart: (props: { children: React.ReactNode }) =>
    React.createElement('div', { 'data-testid': 'mock-line-chart' }, props.children),
  Line: () => null,
  XAxis: () => null,
  YAxis: () => null,
  CartesianGrid: () => null,
  Tooltip: () => null,
  Legend: () => null,
  ScatterChart: (props: { children: React.ReactNode }) =>
    React.createElement('div', { 'data-testid': 'mock-scatter-chart' }, props.children),
  Scatter: () => null,
  BarChart: () => null,
  Bar: () => null,
  PieChart: () => null,
  Pie: () => null,
  AreaChart: () => null,
  Area: () => null,
}));

// Mock para o módulo @mui/styles
try {
  jest.mock('@mui/styles', () => ({
    makeStyles: () => () => ({}),
  }));
} catch (error) {
  console.warn('Módulo @mui/styles não encontrado, ignorando mock');
}

// Mock para o módulo @mui/material
jest.mock('@mui/material', () => ({
  ...jest.requireActual('@mui/material'),
  useTheme: () => ({
    palette: {
      primary: {
        main: '#1976d2',
        contrastText: '#fff',
      },
      error: {
        main: '#d32f2f',
      },
      success: {
        main: '#2e7d32',
      },
      text: {
        secondary: 'rgba(0, 0, 0, 0.6)',
      },
      background: {
        default: '#f5f5f5',
        paper: '#fff',
      },
    },
    spacing: (factor: number) => `${8 * factor}px`,
  }),
}));

// Configuração do MSW (Mock Service Worker)
try {
  // Importações estáticas para MSW
  // Nota: importações condicionais não são elegantes, mas evitam
  // erros quando o MSW não está disponível
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { server } = require('./mocks/server');

  // Configurar os listeners do MSW
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());
} catch (error) {
  console.warn('Módulo MSW não encontrado ou erro ao inicializar o servidor de mock:', error);
  // Fornecer implementações vazias para os hooks do Jest caso não existam
  global.beforeAll = global.beforeAll || jest.fn();
  global.afterEach = global.afterEach || jest.fn();
  global.afterAll = global.afterAll || jest.fn();
}
