import '@mui/material/styles'

declare module '@mui/material/styles' {
  interface Theme {
    status: {
      danger: string
    }
    custom: {
      gradients: {
        primary: string
        secondary: string
        success: string
        warning: string
        error: string
        info: string
      }
    }
  }
  interface ThemeOptions {
    status?: {
      danger?: string
    }
    custom?: {
      gradients?: {
        primary?: string
        secondary?: string
        success?: string
        warning?: string
        error?: string
        info?: string
      }
    }
  }
}

declare module '@mui/material/Button' {
  interface ButtonPropsVariantOverrides {
    primary: true
    secondary: true
    success: true
    warning: true
    error: true
    info: true
  }
}

declare module '@mui/material/Card' {
  interface CardPropsVariantOverrides {
} 