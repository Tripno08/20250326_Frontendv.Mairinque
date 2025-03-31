/**
 * Tipos relacionados ao Dashboard Principal
 * Métricas, widgets e visualizações
 */

// Estrutura do dashboard
export interface DashboardProps {
  userId: string;
  filters?: DashboardFilters;
  layout?: DashboardLayout;
  onSaveLayout?: (layout: DashboardLayout) => void;
  className?: string;
}

// Filtros do dashboard
export interface DashboardFilters {
  period?: 'day' | 'week' | 'month' | 'quarter' | 'year';
  dateRange?: {
    start: Date;
    end: Date;
  };
  institutions?: string[];
  groups?: string[];
  tiers?: number[];
  domínios?: string[];
}

// Layout do dashboard
export interface DashboardLayout {
  [widgetId: string]: {
    x: number;
    y: number;
    w: number;
    h: number;
    minW?: number;
    minH?: number;
    maxW?: number;
    maxH?: number;
    static?: boolean;
  };
}

// Widget base
export interface Widget {
  id: string;
  type: WidgetType;
  title: string;
  description?: string;
  settings?: Record<string, unknown>;
  permissions?: string[];
}

// Tipos de widget
export type WidgetType =
  | 'metric'
  | 'chart'
  | 'table'
  | 'tasks'
  | 'calendar'
  | 'map'
  | 'list'
  | 'notifications'
  | 'quick-access'
  | 'progress'
  | 'student-overview'
  | 'goals'
  | 'interventions'
  | 'tier-distribution'
  | 'domain-summary'
  | 'assessment-coverage'
  | 'risk-indicators'
  | 'recent-activity'
  | 'custom';

// Widget de métrica
export interface MetricWidget extends Widget {
  type: 'metric';
  value: number | string;
  previousValue?: number | string;
  change?: number;
  changeType?: 'positive' | 'negative' | 'neutral';
  format?: 'number' | 'percentage' | 'currency' | 'time';
  icon?: string;
  color?: string;
}

// Widget de gráfico
export interface ChartWidget extends Widget {
  type: 'chart';
  chartType: 'bar' | 'line' | 'pie' | 'area' | 'radar' | 'scatter';
  data: any; // Dados específicos do gráfico
  options?: Record<string, unknown>;
}

// Widget de tabela
export interface TableWidget extends Widget {
  type: 'table';
  columns: {
    id: string;
    label: string;
    format?: string;
    sortable?: boolean;
  }[];
  data: any[]; // Dados da tabela
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  pagination?: boolean;
  pageSize?: number;
}

// Widget de tarefas
export interface TasksWidget extends Widget {
  type: 'tasks';
  tasks: {
    id: string;
    title: string;
    dueDate?: Date;
    status: 'pending' | 'in_progress' | 'completed';
    priority: 'low' | 'medium' | 'high';
    assignedTo?: {
      id: string;
      name: string;
    };
  }[];
}

// Widget de acesso rápido
export interface QuickAccessWidget extends Widget {
  type: 'quick-access';
  items: {
    id: string;
    title: string;
    description?: string;
    icon?: string;
    path: string;
    type: 'student' | 'intervention' | 'assessment' | 'meeting' | 'other';
    timestamp?: Date;
  }[];
}

// Widget de progresso
export interface ProgressWidget extends Widget {
  type: 'progress';
  total: number;
  current: number;
  goal?: number;
  unit?: string;
  segments?: {
    value: number;
    color: string;
    label?: string;
  }[];
}

// Widget de visão geral do estudante
export interface StudentOverviewWidget extends Widget {
  type: 'student-overview';
  student: {
    id: string;
    name: string;
    grade: string;
    tier: number;
  };
  metrics: {
    id: string;
    label: string;
    value: number | string;
    target?: number;
    progress?: number;
  }[];
  interventions?: {
    id: string;
    title: string;
    status: string;
    progress?: number;
  }[];
}

// Propriedades do widget
export interface WidgetProps {
  widget: Widget;
  className?: string;
  onSettingsChange?: (id: string, settings: Record<string, unknown>) => void;
  onRefresh?: (id: string) => void;
  onRemove?: (id: string) => void;
}

// Propriedades da barra de ferramentas do dashboard
export interface DashboardToolbarProps {
  filters: DashboardFilters;
  onFilterChange: (filters: DashboardFilters) => void;
  onResetLayout: () => void;
  onAddWidget: () => void;
  className?: string;
}

// Propriedades do modal de adição de widget
export interface AddWidgetModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (widget: Widget) => void;
  availableWidgets: Widget[];
  className?: string;
}

// Anúncios do sistema
export interface SystemAnnouncement {
  id: string;
  title: string;
  content: string;
  priority: 'low' | 'medium' | 'high';
  startDate: Date;
  endDate?: Date;
  dismissible: boolean;
  dismissed?: boolean;
  link?: {
    url: string;
    label: string;
  };
}

// Propriedades do componente de anúncios do sistema
export interface SystemAnnouncementsProps {
  announcements: SystemAnnouncement[];
  onDismiss: (id: string) => void;
  className?: string;
}
