import React from 'react';
import { Card } from '@mui/material';
import type { CardProps } from '@mui/material';
import { styled } from '@mui/material/styles';
import type { WithChildren, WithTheme, GradientOptions } from '@/types/utils';

interface GradientCardProps extends Omit<CardProps, 'children'>, WithChildren {
  gradient?: string | GradientOptions | undefined;
  hover?: boolean;
}

const StyledCard = styled(Card, {
  shouldForwardProp: prop => prop !== 'gradient' && prop !== 'hover',
})<GradientCardProps>(({ theme, gradient, hover }: WithTheme<GradientCardProps>) => {
  const getGradient = () => {
    if (typeof gradient === 'string') return gradient;
    if (gradient) {
      const { startColor, endColor, angle = 135 } = gradient;
      return `linear-gradient(${angle}deg, ${startColor} 0%, ${endColor} 100%)`;
    }
    return `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`;
  };

  return {
    background: getGradient(),
    color: theme.palette.primary.contrastText,
    transition: hover ? 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out' : 'none',
    '&:hover': hover
      ? {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[4],
        }
      : {},
  };
});

export const GradientCard: React.FC<GradientCardProps> = ({
  children,
  gradient,
  hover = true,
  ...props
}) => {
  return (
    <StyledCard gradient={gradient} hover={hover} role="article" {...props}>
      {children}
    </StyledCard>
  );
};
