import { Theme } from '@mui/material/styles'

// Tipos para cores do tema
export interface CustomPaletteColor {
  main: string
  light: string
  dark: string
  contrastText: string
}

// Tipos para variantes de botão
export type ButtonVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info'
export type ButtonSize = 'small' | 'medium' | 'large'

// Tipos para gradientes
export interface GradientOptions {
  startColor: string
  endColor: string
  angle?: number
}

// Utilitários de tipo
export type WithChildren<T = {}> = T & {
  children: React.ReactNode
}

export type WithTheme<T = {}> = T & {
  theme: Theme
}

// Tipos para props de componentes
export interface BaseComponentProps {
  className?: string
  style?: React.CSSProperties
}

// Tipos para estados de loading
export interface LoadingState {
  isLoading: boolean
  error?: Error | null
}

// Tipos para respostas da API
export interface ApiResponse<T> {
  data: T
  status: number
  message?: string
}

// Tipos para paginação
export interface PaginationParams {
  page: number
  limit: number
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  total: number
  page: number
  limit: number
  totalPages: number
} 