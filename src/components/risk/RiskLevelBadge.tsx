import React from 'react';
import { RiskLevel } from '@/types/risk-analysis';
import { Badge, Box, Tooltip } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import RemoveIcon from '@mui/icons-material/Remove';

interface RiskLevelBadgeProps {
  level: RiskLevel;
  trend?: 'improving' | 'stable' | 'worsening';
  showTrend?: boolean;
  tooltipTitle?: string;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

const getRiskColor = (level: RiskLevel): string => {
  switch (level) {
    case 'low':
      return '#4caf50'; // verde
    case 'moderate':
      return '#ff9800'; // laranja
    case 'high':
      return '#f44336'; // vermelho
    case 'severe':
      return '#9c27b0'; // roxo
    default:
      return '#757575'; // cinza
  }
};

const getRiskLabel = (level: RiskLevel): string => {
  switch (level) {
    case 'low':
      return 'Baixo';
    case 'moderate':
      return 'Moderado';
    case 'high':
      return 'Alto';
    case 'severe':
      return 'Severo';
    default:
      return 'Desconhecido';
  }
};

const getTrendIcon = (trend: 'improving' | 'stable' | 'worsening') => {
  switch (trend) {
    case 'improving':
      return <ArrowDownwardIcon fontSize="inherit" sx={{ color: '#4caf50' }} />;
    case 'worsening':
      return <ArrowUpwardIcon fontSize="inherit" sx={{ color: '#f44336' }} />;
    case 'stable':
    default:
      return <RemoveIcon fontSize="inherit" sx={{ color: '#757575' }} />;
  }
};

const RiskLevelBadge: React.FC<RiskLevelBadgeProps> = ({
  level,
  trend,
  showTrend = false,
  tooltipTitle,
  size = 'medium',
  className
}) => {
  const badgeContent = showTrend && trend ? getTrendIcon(trend) : null;
  const label = getRiskLabel(level);
  const color = getRiskColor(level);

  const badge = (
    <Badge
      badgeContent={badgeContent}
      overlap="circular"
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
    >
      <Box
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: color,
          color: 'white',
          borderRadius: '16px',
          padding: size === 'small' ? '2px 8px' : size === 'medium' ? '4px 12px' : '6px 16px',
          fontSize: size === 'small' ? '0.75rem' : size === 'medium' ? '0.875rem' : '1rem',
          fontWeight: 'bold',
          whiteSpace: 'nowrap',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        }}
        className={className}
      >
        {label}
      </Box>
    </Badge>
  );

  if (tooltipTitle) {
    return (
      <Tooltip title={tooltipTitle} arrow>
        {badge}
      </Tooltip>
    );
  }

  return badge;
};

export default RiskLevelBadge;
