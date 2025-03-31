/**
 * Tipos relacionados ao Layout Principal
 * Componentes de interface e navegação
 */

// Propriedades do layout principal
export interface MainLayoutProps {
  children: React.ReactNode;
  navigationGroups?: NavigationGroup[];
}

// Item de navegação
export interface NavigationItem {
  id: string;
  label: string;
  icon?: string;
  path?: string;
  items?: NavigationItem[];
  requiredPermission?: string;
  badge?: {
    content: string | number;
    color: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
  };
  divider?: boolean;
}

// Grupo de navegação
export interface NavigationGroup {
  id: string;
  title: string;
  items: NavigationItem[];
  collapsed?: boolean;
}

// Propriedades da barra lateral
export interface SidebarProps {
  open: boolean;
  onClose: () => void;
  onToggle: () => void;
  navigationGroups: NavigationGroup[];
  className?: string;
}

// Propriedades do cabeçalho
export interface HeaderProps {
  onSidebarToggle: () => void;
  title?: string;
  actions?: React.ReactNode;
  className?: string;
}

// Propriedades do breadcrumb
export interface BreadcrumbItem {
  label: string;
  path?: string;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

// Propriedades do centro de notificações
export interface NotificationCenterProps {
  open: boolean;
  onClose: () => void;
  onMarkAllAsRead: () => void;
  onClearAll: () => void;
  className?: string;
}

// Notificação
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: Date;
  link?: string;
  category: string;
  sender?: {
    id: string;
    name: string;
    avatar?: string;
  };
  actions?: {
    label: string;
    action: string;
  }[];
}

// Item de notificação
export interface NotificationItemProps {
  notification: Notification;
  onRead: (id: string) => void;
  onDelete: (id: string) => void;
  onAction?: (id: string, action: string) => void;
  className?: string;
}

// Menu de perfil do usuário
export interface UserProfileMenuProps {
  open: boolean;
  anchorEl: HTMLElement | null;
  onClose: () => void;
  onLogout: () => void;
  onOpenProfile: () => void;
  onOpenSettings: () => void;
  className?: string;
}

// Tema
export type ThemeMode = 'light' | 'dark' | 'system';

export interface ThemeContextValue {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
  highContrast: boolean;
  setHighContrast: (value: boolean) => void;
  toggleHighContrast: () => void;
  reducedMotion: boolean;
  setReducedMotion: (value: boolean) => void;
  toggleReducedMotion: () => void;
  fontSize: 'default' | 'large' | 'larger';
  setFontSize: (size: 'default' | 'large' | 'larger') => void;
}

// Estrutura de página
export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  backLink?: string;
  actions?: React.ReactNode;
  className?: string;
}

export interface PageContentProps {
  children: React.ReactNode;
  className?: string;
}

export interface PageFooterProps {
  children?: React.ReactNode;
  className?: string;
}

// Alternância de contexto institucional
export interface InstitutionSwitcherProps {
  institutions: {
    id: string;
    name: string;
    type: string;
  }[];
  currentInstitution?: string;
  onChange: (institutionId: string) => void;
  className?: string;
}

// Propriedades da pesquisa global
export interface GlobalSearchProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
}

export interface SearchResult {
  id: string;
  title: string;
  description?: string;
  type: string;
  url: string;
  icon?: string;
  highlight?: {
    title?: string[];
    description?: string[];
  };
}

export interface SearchResultsProps {
  results: SearchResult[];
  loading: boolean;
  onSelect: (result: SearchResult) => void;
  className?: string;
}

// Propriedades do painel de configurações
export interface SettingsPanelProps {
  open: boolean;
  onClose: () => void;
  className?: string;
}
