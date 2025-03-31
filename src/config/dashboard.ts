import { DashboardLayout } from '@/types/dashboard';

// Configurações do grid
export const GRID_CONFIG = {
  breakpoints: {
    lg: 1200,
    md: 996,
    sm: 768,
    xs: 480,
    xxs: 0,
  },
  cols: {
    lg: 12,
    md: 10,
    sm: 6,
    xs: 4,
    xxs: 2,
  },
  rowHeight: 100,
  margin: [16, 16],
  containerPadding: [16, 16],
};

// Configurações de animação
export const ANIMATION_CONFIG = {
  duration: 300,
  easing: 'ease-in-out',
  scale: {
    enter: 0.9,
    exit: 0.9,
  },
  opacity: {
    enter: 0,
    exit: 0,
  },
};

// Configurações de persistência
export const STORAGE_CONFIG = {
  key: 'dashboard_layout',
  version: '1.0.0',
};

// Layouts predefinidos
export const PRESET_LAYOUTS: Record<string, DashboardLayout> = {
  default: {
    id: 'default',
    name: 'Layout Padrão',
    widgets: [
      {
        id: 'tier-distribution',
        type: 'tier-distribution',
        title: 'Distribuição por Nível',
        x: 0,
        y: 0,
        w: 6,
        h: 4,
      },
      {
        id: 'domain-summary',
        type: 'domain-summary',
        title: 'Desempenho por Domínio',
        x: 6,
        y: 0,
        w: 6,
        h: 4,
      },
      {
        id: 'assessment-coverage',
        type: 'assessment-coverage',
        title: 'Cobertura de Avaliações',
        x: 0,
        y: 4,
        w: 12,
        h: 4,
      },
      {
        id: 'progress-monitoring',
        type: 'progress-monitoring',
        title: 'Monitoramento de Progresso',
        x: 0,
        y: 8,
        w: 12,
        h: 6,
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  compact: {
    id: 'compact',
    name: 'Layout Compacto',
    widgets: [
      {
        id: 'tier-distribution',
        type: 'tier-distribution',
        title: 'Distribuição por Nível',
        x: 0,
        y: 0,
        w: 4,
        h: 3,
      },
      {
        id: 'domain-summary',
        type: 'domain-summary',
        title: 'Desempenho por Domínio',
        x: 4,
        y: 0,
        w: 4,
        h: 3,
      },
      {
        id: 'assessment-coverage',
        type: 'assessment-coverage',
        title: 'Cobertura de Avaliações',
        x: 8,
        y: 0,
        w: 4,
        h: 3,
      },
      {
        id: 'progress-monitoring',
        type: 'progress-monitoring',
        title: 'Monitoramento de Progresso',
        x: 0,
        y: 3,
        w: 12,
        h: 4,
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  wide: {
    id: 'wide',
    name: 'Layout Amplo',
    widgets: [
      {
        id: 'tier-distribution',
        type: 'tier-distribution',
        title: 'Distribuição por Nível',
        x: 0,
        y: 0,
        w: 8,
        h: 5,
      },
      {
        id: 'domain-summary',
        type: 'domain-summary',
        title: 'Desempenho por Domínio',
        x: 8,
        y: 0,
        w: 4,
        h: 5,
      },
      {
        id: 'assessment-coverage',
        type: 'assessment-coverage',
        title: 'Cobertura de Avaliações',
        x: 0,
        y: 5,
        w: 6,
        h: 5,
      },
      {
        id: 'progress-monitoring',
        type: 'progress-monitoring',
        title: 'Monitoramento de Progresso',
        x: 6,
        y: 5,
        w: 6,
        h: 5,
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
};

// Configurações de widgets
export const WIDGET_CONFIG = {
  minWidth: 3,
  minHeight: 2,
  maxWidth: 12,
  maxHeight: 12,
  defaultWidth: 6,
  defaultHeight: 4,
};

// Configurações de tema
export const THEME_CONFIG = {
  colors: {
    primary: '#1976d2',
    secondary: '#dc004e',
    background: '#f5f5f5',
    surface: '#ffffff',
    text: '#000000',
    error: '#f44336',
    success: '#4caf50',
    warning: '#ff9800',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 16,
  },
  shadows: {
    sm: '0 2px 4px rgba(0,0,0,0.1)',
    md: '0 4px 8px rgba(0,0,0,0.1)',
    lg: '0 8px 16px rgba(0,0,0,0.1)',
  },
};
