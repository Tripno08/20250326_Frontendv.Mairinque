// Tipos de widgets disponíveis
export const WIDGET_TYPES = {
  TIER_DISTRIBUTION: 'tier-distribution',
  DOMAIN_SUMMARY: 'domain-summary',
  ASSESSMENT_COVERAGE: 'assessment-coverage',
  PROGRESS_MONITORING: 'progress-monitoring',
} as const;

// Títulos padrão dos widgets
export const WIDGET_TITLES = {
  [WIDGET_TYPES.TIER_DISTRIBUTION]: 'Distribuição por Nível',
  [WIDGET_TYPES.DOMAIN_SUMMARY]: 'Desempenho por Domínio',
  [WIDGET_TYPES.ASSESSMENT_COVERAGE]: 'Cobertura de Avaliações',
  [WIDGET_TYPES.PROGRESS_MONITORING]: 'Monitoramento de Progresso',
} as const;

// Configurações padrão dos widgets
export const DEFAULT_WIDGET_CONFIG = {
  [WIDGET_TYPES.TIER_DISTRIBUTION]: {
    w: 6,
    h: 4,
    minW: 4,
    minH: 3,
  },
  [WIDGET_TYPES.DOMAIN_SUMMARY]: {
    w: 6,
    h: 4,
    minW: 4,
    minH: 3,
  },
  [WIDGET_TYPES.ASSESSMENT_COVERAGE]: {
    w: 12,
    h: 4,
    minW: 6,
    minH: 3,
  },
  [WIDGET_TYPES.PROGRESS_MONITORING]: {
    w: 12,
    h: 6,
    minW: 6,
    minH: 4,
  },
} as const;

// Mensagens de erro
export const ERROR_MESSAGES = {
  INVALID_LAYOUT: 'Layout inválido',
  INVALID_WIDGET: 'Widget inválido',
  SAVE_FAILED: 'Falha ao salvar layout',
  LOAD_FAILED: 'Falha ao carregar layout',
  CLEAR_FAILED: 'Falha ao limpar layout',
  IMPORT_FAILED: 'Falha ao importar layout',
  WIDGET_OVERLAP: 'Widgets sobrepostos detectados',
  INVALID_VERSION: 'Versão do layout incompatível',
} as const;

// Mensagens de sucesso
export const SUCCESS_MESSAGES = {
  LAYOUT_SAVED: 'Layout salvo com sucesso',
  LAYOUT_CLEARED: 'Layout limpo com sucesso',
  LAYOUT_IMPORTED: 'Layout importado com sucesso',
  LAYOUT_EXPORTED: 'Layout exportado com sucesso',
} as const;

// Mensagens de aviso
export const WARNING_MESSAGES = {
  UNSAVED_CHANGES: 'Existem alterações não salvas',
  LAYOUT_RESET: 'Layout será resetado para o padrão',
  WIDGET_REMOVED: 'Widget removido com sucesso',
} as const;

// Textos da interface
export const UI_TEXT = {
  EDIT_MODE: 'Modo de Edição',
  VIEW_MODE: 'Modo de Visualização',
  SAVE_LAYOUT: 'Salvar Layout',
  RESET_LAYOUT: 'Resetar Layout',
  IMPORT_LAYOUT: 'Importar Layout',
  EXPORT_LAYOUT: 'Exportar Layout',
  ADD_WIDGET: 'Adicionar Widget',
  REMOVE_WIDGET: 'Remover Widget',
  CONFIGURE_WIDGET: 'Configurar Widget',
  WIDGET_SIZE: 'Tamanho do Widget',
  WIDGET_POSITION: 'Posição do Widget',
  WIDGET_SETTINGS: 'Configurações do Widget',
} as const;

// Classes CSS
export const CSS_CLASSES = {
  DASHBOARD: 'customizable-dashboard',
  EDIT_MODE: 'edit-mode',
  VIEW_MODE: 'view-mode',
  WIDGET: 'dashboard-widget',
  WIDGET_HEADER: 'widget-header',
  WIDGET_CONTENT: 'widget-content',
  WIDGET_DRAGGING: 'widget-dragging',
  WIDGET_RESIZING: 'widget-resizing',
  WIDGET_OVERLAP: 'widget-overlap',
  WIDGET_ERROR: 'widget-error',
  WIDGET_LOADING: 'widget-loading',
} as const;

// IDs de elementos
export const ELEMENT_IDS = {
  DASHBOARD: 'customizable-dashboard',
  LAYOUT_EDITOR: 'layout-editor',
  WIDGET_LIST: 'widget-list',
  WIDGET_PREVIEW: 'widget-preview',
  LAYOUT_IMPORT: 'layout-import',
  LAYOUT_EXPORT: 'layout-export',
  LAYOUT_RESET: 'layout-reset',
  WIDGET_SETTINGS: 'widget-settings',
} as const;

// Eventos
export const EVENTS = {
  LAYOUT_CHANGE: 'layout-change',
  LAYOUT_SAVE: 'layout-save',
  LAYOUT_RESET: 'layout-reset',
  WIDGET_ADD: 'widget-add',
  WIDGET_REMOVE: 'widget-remove',
  WIDGET_UPDATE: 'widget-update',
  WIDGET_MOVE: 'widget-move',
  WIDGET_RESIZE: 'widget-resize',
  EDIT_MODE_TOGGLE: 'edit-mode-toggle',
} as const;

// Animações
export const ANIMATIONS = {
  FADE_IN: 'fade-in',
  FADE_OUT: 'fade-out',
  SLIDE_IN: 'slide-in',
  SLIDE_OUT: 'slide-out',
  SCALE_IN: 'scale-in',
  SCALE_OUT: 'scale-out',
  ROTATE_IN: 'rotate-in',
  ROTATE_OUT: 'rotate-out',
} as const;

// Temas
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  CUSTOM: 'custom',
} as const;

// Breakpoints
export const BREAKPOINTS = {
  XS: 'xs',
  SM: 'sm',
  MD: 'md',
  LG: 'lg',
  XL: 'xl',
} as const;

// Orientação
export const ORIENTATIONS = {
  PORTRAIT: 'portrait',
  LANDSCAPE: 'landscape',
} as const; 