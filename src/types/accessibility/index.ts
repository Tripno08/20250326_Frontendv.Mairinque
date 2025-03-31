/**
 * Tipos relacionados à Acessibilidade
 * Implementando conformidade com WCAG 2.1 AA
 */

import { ReactNode } from 'react';

// Preferências de acessibilidade do usuário
export interface AccessibilityPreferences {
  // Configurações visuais
  highContrast: boolean; // Alto contraste para melhor legibilidade
  fontSize: 'default' | 'large' | 'larger'; // Opções de tamanho de fonte
  lineSpacing: 'default' | 'wide' | 'wider'; // Espaçamento entre linhas
  letterSpacing: 'default' | 'wide' | 'wider'; // Espaçamento entre letras

  // Configurações de movimento
  reducedMotion: boolean; // Redução de movimento para usuários com vertigem/sensibilidade visual
  reduceTransparency: boolean; // Redução de transparência

  // Configurações de interação
  keyboardNavigation: boolean; // Navegação por teclado otimizada
  colorBlindMode: ColorBlindMode | null; // Modo para daltonismo

  // Configurações de mídia
  autoplaySounds: boolean; // Autoplay de áudio
  captionsEnabled: boolean; // Legendas habilitadas para vídeos

  // Tempo de expiração de sessão
  sessionTimeout: number; // Tempo de expiração em minutos

  // Leitura de tela
  screenReaderOptimized: boolean; // Otimizado para leitores de tela

  theme: 'light' | 'dark' | 'system';
  screenReader: boolean;
}

// Tipos de daltonismo
export type ColorBlindMode =
  | 'protanopia' // Deficiência no vermelho
  | 'deuteranopia' // Deficiência no verde
  | 'tritanopia' // Deficiência no azul
  | 'achromatopsia'; // Sem percepção de cores (preto e branco)

// Propriedades do componente de painel de acessibilidade
export interface AccessibilityPanelProps {
  open: boolean;
  onClose: () => void;
  preferences: AccessibilityPreferences;
  onPreferencesChange: (preferences: Partial<AccessibilityPreferences>) => void;
  className?: string;
}

// Propriedades do componente de controle de alto contraste
export interface HighContrastToggleProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  className?: string;
}

// Propriedades do componente de controle de tamanho de fonte
export interface FontSizeControlProps {
  value: 'default' | 'large' | 'larger';
  onChange: (value: 'default' | 'large' | 'larger') => void;
  className?: string;
}

// Propriedades do componente de controle de redução de movimento
export interface ReducedMotionToggleProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  className?: string;
}

// Contexto de acessibilidade para toda aplicação
export interface AccessibilityContextProps {
  preferences: AccessibilityPreferences;
  updatePreferences: (preferences: Partial<AccessibilityPreferences>) => void;
  resetPreferences: () => void;
}

// Foco teclado
export interface FocusRingProps {
  visible: boolean;
  color?: string;
  width?: number;
}

// Atributos para acessibilidade
export interface AriaAttributes {
  role?: string;
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
  'aria-expanded'?: boolean;
  'aria-haspopup'?: boolean | 'dialog' | 'grid' | 'listbox' | 'menu' | 'tree';
  'aria-controls'?: string;
  'aria-owns'?: string;
  'aria-hidden'?: boolean;
  'aria-live'?: 'assertive' | 'off' | 'polite';
  'aria-atomic'?: boolean;
  'aria-current'?: boolean | 'page' | 'step' | 'location' | 'date' | 'time';
  'aria-disabled'?: boolean;
  'aria-invalid'?: boolean | 'grammar' | 'spelling';
  'aria-pressed'?: boolean | 'mixed';
  'aria-selected'?: boolean;
  'aria-busy'?: boolean;
  'aria-checked'?: boolean | 'mixed';
  'aria-valuemin'?: number;
  'aria-valuemax'?: number;
  'aria-valuenow'?: number;
  'aria-valuetext'?: string;
  'aria-level'?: number;
}

// Hook para detectar preferências do sistema relacionadas à acessibilidade
export interface SystemPreferences {
  prefersReducedMotion: boolean;
  prefersHighContrast: boolean;
  prefersLightMode: boolean;
  prefersDarkMode: boolean;
}

// Componente de aviso para leitores de tela
export interface ScreenReaderOnlyProps {
  children: ReactNode;
  className?: string;
}

// Componente de skip link (link de pular para conteúdo)
export interface SkipLinkProps {
  targetId: string;
  children?: ReactNode;
  className?: string;
}

// Propriedades para teclado virtual acessível
export interface AccessibleKeyboardProps {
  onInputChange: (value: string) => void;
  initialValue?: string;
  maxLength?: number;
  className?: string;
}

// Propriedades para componente de alerta acessível
export interface AccessibleAlertProps {
  message: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  polite?: boolean; // Define se leitores de tela devem interromper (false) ou não (true)
  autoHide?: boolean;
  autoHideDuration?: number;
  onClose?: () => void;
  className?: string;
}

// Propriedades para o menu de acessibilidade
export interface AccessibilityMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

// Ações para o menu de acessibilidade
export type AccessibilityAction =
  | { type: 'TOGGLE_THEME'; payload: 'light' | 'dark' | 'system' }
  | { type: 'TOGGLE_REDUCED_MOTION'; payload: boolean }
  | { type: 'TOGGLE_HIGH_CONTRAST'; payload: boolean }
  | { type: 'SET_FONT_SIZE'; payload: 'default' | 'large' | 'larger' }
  | { type: 'TOGGLE_SCREEN_READER'; payload: boolean }
  | { type: 'TOGGLE_KEYBOARD_NAVIGATION'; payload: boolean }
  | { type: 'RESET_PREFERENCES' };
