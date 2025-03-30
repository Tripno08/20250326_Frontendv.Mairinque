import React from 'react'
import { Button, ButtonProps } from '@mui/material'
import { styled } from '@mui/material/styles'
import { WithChildren, WithTheme, ButtonVariant, ButtonSize } from '@/types/utils'

interface ActionButtonProps extends Omit<ButtonProps, 'variant' | 'children'>, WithChildren {
  variant?: ButtonVariant
  size?: ButtonSize
  fullWidth?: boolean
  loading?: boolean
}

const StyledButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'loading',
})<ActionButtonProps>(({ theme, variant = 'primary', size = 'medium', loading }: WithTheme<ActionButtonProps>) => ({
  position: 'relative',
  overflow: 'hidden',
  borderRadius: theme.shape.borderRadius,
  padding: size === 'small' ? '6px 12px' : size === 'large' ? '12px 24px' : '8px 16px',
  fontSize: size === 'small' ? '0.875rem' : size === 'large' ? '1.125rem' : '1rem',
  fontWeight: 500,
  textTransform: 'none',
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[2],
  },
  '&:active': {
    transform: 'translateY(0)',
  },
  '&:disabled': {
    opacity: 0.7,
    cursor: 'not-allowed',
  },
  '&::after': loading
    ? {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'rgba(255, 255, 255, 0.2)',
        animation: 'shimmer 1.5s infinite',
      }
    : {},
  '@keyframes shimmer': {
    '0%': {
      transform: 'translateX(-100%)',
    },
    '100%': {
      transform: 'translateX(100%)',
    },
  },
}))

export const ActionButton: React.FC<ActionButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  loading = false,
  disabled,
  ...props
}) => {
  return (
    <StyledButton
      variant={variant === 'primary' ? 'contained' : 'outlined'}
      size={size}
      fullWidth={fullWidth}
      loading={loading}
      disabled={disabled || loading}
      {...props}
    >
      {children}
    </StyledButton>
  )
} 