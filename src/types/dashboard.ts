import { ReactNode } from 'react';

// Tipos básicos
export type WidgetType = 'tier-distribution' | 'domain-summary' | 'assessment-coverage' | 'progress-monitoring';

export interface Position {
  x: number;
  y: number;
}

export interface Size {
  w: number;
  h: number;
}

export interface WidgetBounds {
  minW?: number;
  minH?: number;
  maxW?: number;
  maxH?: number;
}

// Tipos de dados
export interface TierDistributionData {
  tier1: number;
  tier2: number;
  tier3: number;
}

export interface DomainSummaryData {
  reading: number;
  math: number;
  writing: number;
}

export interface AssessmentCoverageData {
  total: number;
  assessed: number;
}

export interface ProgressData {
  date: Date;
  value: number;
}

export interface Benchmark {
  name: string;
  value: number;
  color: string;
  description: string;
}

export interface ProgressGoal {
  name: string;
  targetValue: number;
  deadline: Date;
  color: string;
  description: string;
}

// Tipos de widgets
export interface BaseWidget {
  id: string;
  type: WidgetType;
  title: string;
}

export interface WidgetConfig {
  id: string;
  type: string;
  title: string;
  x: number;
  y: number;
  w: number;
  h: number;
  component?: React.ReactNode;
}

export interface DashboardWidget extends BaseWidget {
  component: ReactNode;
  defaultConfig: Partial<WidgetConfig>;
}

// Tipos de layout
export interface DashboardLayout {
  id: string;
  name: string;
  widgets: WidgetConfig[];
  createdAt: Date;
  updatedAt: Date;
}

// Tipos de props
export interface CustomizableDashboardProps {
  widgets: WidgetConfig[];
  defaultLayout?: DashboardLayout;
  onLayoutChange?: (layout: DashboardLayout) => void;
  onLayoutSave?: (layout: DashboardLayout) => void;
  isEditable?: boolean;
  className?: string;
}

// Tipos de eventos
export interface LayoutChangeEvent {
  layout: DashboardLayout;
  source: 'drag' | 'resize' | 'add' | 'remove';
}

export interface WidgetEvent {
  widgetId: string;
  type: 'click' | 'hover' | 'focus' | 'blur';
  data?: any;
}

// Tipos de estado
export interface DashboardState {
  layout: DashboardLayout;
  isEditing: boolean;
  selectedWidget: string | null;
  hoveredWidget: string | null;
  isDragging: boolean;
  isResizing: boolean;
}

// Tipos de contexto
export interface DashboardContextType {
  state: DashboardState;
  dispatch: React.Dispatch<DashboardAction>;
}

// Tipos de ações
export type DashboardAction =
  | { type: 'SET_LAYOUT'; payload: DashboardLayout }
  | { type: 'TOGGLE_EDIT_MODE' }
  | { type: 'SELECT_WIDGET'; payload: string }
  | { type: 'HOVER_WIDGET'; payload: string | null }
  | { type: 'SET_DRAGGING'; payload: boolean }
  | { type: 'SET_RESIZING'; payload: boolean }
  | { type: 'UPDATE_WIDGET'; payload: WidgetConfig }
  | { type: 'ADD_WIDGET'; payload: WidgetConfig }
  | { type: 'REMOVE_WIDGET'; payload: string }
  | { type: 'RESET_LAYOUT' };

// Tipos de validação
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

// Tipos de persistência
export interface StoredLayout {
  layout: DashboardLayout;
  version: string;
  updatedAt: Date;
}

// Tipos de configuração
export interface GridConfig {
  breakpoints: Record<string, number>;
  cols: Record<string, number>;
  rowHeight: number;
  margin: [number, number];
  containerPadding: [number, number];
}

export interface AnimationConfig {
  duration: number;
  easing: string;
  scale: {
    enter: number;
    exit: number;
  };
  opacity: {
    enter: number;
    exit: number;
  };
}

// Tipos de utilitários
export interface LayoutUtils {
  saveLayout: (layout: DashboardLayout) => void;
  loadLayout: () => DashboardLayout | null;
  clearLayout: () => void;
  validateLayout: (layout: DashboardLayout) => boolean;
  cloneLayout: (layout: DashboardLayout) => DashboardLayout;
  mergeLayouts: (base: DashboardLayout, overlay: Partial<DashboardLayout>) => DashboardLayout;
  calculateGridSize: (widgets: WidgetConfig[]) => { width: number; height: number };
  calculateWidgetOverlap: (widgets: WidgetConfig[]) => boolean;
  optimizeLayout: (layout: DashboardLayout) => DashboardLayout;
  compactLayout: (layout: DashboardLayout) => DashboardLayout;
  exportLayout: (layout: DashboardLayout) => string;
  importLayout: (json: string) => DashboardLayout | null;
} 