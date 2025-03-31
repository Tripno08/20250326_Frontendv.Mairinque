/**
 * Tipos relacionados à autenticação
 * Seguindo boas práticas de tipagem e acessibilidade (WCAG 2.1 AA)
 */

// Tipos básicos de usuário
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  institutions: Institution[];
  lastLogin?: Date;
  preferences: UserPreferences;
  permissions: Permission[];
}

// Tipos de papel de usuário
export type UserRole =
  | 'ADMIN' // Administrador do sistema
  | 'COORDINATOR' // Coordenador pedagógico
  | 'TEACHER' // Professor
  | 'SPECIALIST' // Especialista (psicólogo, fonoaudiólogo, etc.)
  | 'PARENT' // Responsável pelo aluno
  | 'STUDENT'; // Estudante

// Permissões do usuário
export interface Permission {
  resource: string;
  actions: ('read' | 'write' | 'delete' | 'admin')[];
}

// Preferências do usuário
export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  reducedMotion: boolean;
  highContrast: boolean;
  fontSize: 'default' | 'large' | 'larger';
  language: string;
  notifications: NotificationPreferences;
  sidebarExpanded: boolean;
  dashboardLayout?: Record<string, unknown>;
}

// Preferências de notificação
export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  sms: boolean;
  categories: {
    [category: string]: boolean;
  };
}

// Instituição
export interface Institution {
  id: string;
  name: string;
  type: 'SCHOOL' | 'DISTRICT' | 'NETWORK';
  role: UserRole;
  isActive: boolean;
}

// Credenciais para login
export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
  institution?: string;
}

// Resposta de autenticação
export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
  expiresIn: number;
}

// Estado de autenticação
export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
  selectedInstitution?: Institution;
}

// Requisição de reset de senha
export interface PasswordResetRequest {
  email: string;
}

// Confirmação de reset de senha
export interface PasswordResetConfirmation {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

// Requisição de primeiro acesso
export interface FirstAccessRequest {
  token: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

// Resposta de verificação de token
export interface TokenVerificationResponse {
  valid: boolean;
  expired: boolean;
  email?: string;
}

// Propriedades do formulário de login
export interface LoginFormProps {
  onSubmit: (credentials: LoginCredentials) => Promise<void>;
  loading: boolean;
  error?: string;
}

// Propriedades do formulário de recuperação de senha
export interface PasswordResetFormProps {
  onSubmit: (data: PasswordResetRequest) => Promise<void>;
  loading: boolean;
  error?: string;
  success?: boolean;
}

// Propriedades do formulário de confirmação de senha
export interface PasswordResetConfirmationFormProps {
  onSubmit: (data: PasswordResetConfirmation) => Promise<void>;
  token: string;
  loading: boolean;
  error?: string;
  success?: boolean;
}

// Multi-factor authentication
export interface MfaSetup {
  secret: string;
  qrCodeUrl: string;
}

export interface MfaChallenge {
  type: 'totp' | 'email' | 'sms';
  challengeId: string;
}

export interface MfaResponse {
  challengeId: string;
  code: string;
}
