'use client';

import React, { useCallback } from 'react';
import {
  CardContent,
  Typography,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Divider,
  Box,
} from '@mui/material';
import {
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  AccessTime as AccessTimeIcon,
} from '@mui/icons-material';
import { ReferralPriority, ReferralType } from '../../../types/referral';
import { ReferralDashboardProps } from './types';
import {
  Container,
  MetricCard,
  MetricTitle,
  MetricValue,
  MetricLabel,
  DistributionItem,
  DistributionLabel,
  RecentReferralsCard,
} from './styles';

export const ReferralDashboard: React.FC<ReferralDashboardProps> = ({
  metrics,
  recentReferrals,
  onReferralSelect,
  className,
}) => {
  const getPriorityIcon = useCallback((priority: ReferralPriority) => {
    switch (priority) {
      case 'urgent':
        return <ErrorIcon color="error" />;
      case 'high':
        return <WarningIcon color="warning" />;
      case 'medium':
        return <AccessTimeIcon color="info" />;
      case 'low':
        return <CheckCircleIcon color="success" />;
      default:
        return <AssignmentIcon />;
    }
  }, []);

  const getPriorityColor = useCallback((priority: ReferralPriority) => {
    switch (priority) {
      case 'urgent':
        return 'error';
      case 'high':
        return 'warning';
      case 'medium':
        return 'info';
      case 'low':
        return 'success';
      default:
        return 'primary';
    }
  }, []);

  const getTypeColor = useCallback((type: ReferralType) => {
    switch (type) {
      case 'academic':
        return 'primary';
      case 'behavioral':
        return 'secondary';
      case 'social':
        return 'info';
      case 'administrative':
        return 'warning';
      default:
        return 'primary';
    }
  }, []);

  return (
    <Container className={className}>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
        {/* Métricas Gerais */}
        <Box sx={{ width: { xs: '100%', md: 'calc(50% - 12px)' } }}>
          <MetricCard>
            <CardContent>
              <MetricTitle variant="h6">Métricas Gerais</MetricTitle>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 8px)' } }}>
                  <MetricValue variant="h4">{metrics.total}</MetricValue>
                  <MetricLabel variant="body2">Total de Encaminhamentos</MetricLabel>
                </Box>
                <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 8px)' } }}>
                  <MetricValue variant="h4">
                    {Math.round((metrics.completed / metrics.total) * 100)}%
                  </MetricValue>
                  <MetricLabel variant="body2">Taxa de Conclusão</MetricLabel>
                </Box>
              </Box>
            </CardContent>
          </MetricCard>
        </Box>

        {/* Tempo Médio de Resolução */}
        <Box sx={{ width: { xs: '100%', md: 'calc(50% - 12px)' } }}>
          <MetricCard>
            <CardContent>
              <MetricTitle variant="h6">Tempo Médio de Resolução</MetricTitle>
              <MetricValue variant="h4">
                {Math.round(metrics.averageResolutionTime / 24)} dias
              </MetricValue>
              <MetricLabel variant="body2">Média de tempo para conclusão</MetricLabel>
            </CardContent>
          </MetricCard>
        </Box>

        {/* Distribuição por Prioridade */}
        <Box sx={{ width: { xs: '100%', md: 'calc(50% - 12px)' } }}>
          <MetricCard>
            <CardContent>
              <MetricTitle variant="h6">Distribuição por Prioridade</MetricTitle>
              {Object.entries(metrics.priorityDistribution).map(([priority, count]) => (
                <DistributionItem key={priority}>
                  <DistributionLabel>
                    <Typography variant="body2">
                      {priority.charAt(0).toUpperCase() + priority.slice(1)}
                    </Typography>
                    <Typography variant="body2">{count}</Typography>
                  </DistributionLabel>
                  <LinearProgress
                    variant="determinate"
                    value={(count / metrics.total) * 100}
                    color={getPriorityColor(priority as ReferralPriority)}
                  />
                </DistributionItem>
              ))}
            </CardContent>
          </MetricCard>
        </Box>

        {/* Distribuição por Tipo */}
        <Box sx={{ width: { xs: '100%', md: 'calc(50% - 12px)' } }}>
          <MetricCard>
            <CardContent>
              <MetricTitle variant="h6">Distribuição por Tipo</MetricTitle>
              {Object.entries(metrics.typeDistribution).map(([type, count]) => (
                <DistributionItem key={type}>
                  <DistributionLabel>
                    <Typography variant="body2">
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </Typography>
                    <Typography variant="body2">{count}</Typography>
                  </DistributionLabel>
                  <LinearProgress
                    variant="determinate"
                    value={(count / metrics.total) * 100}
                    color={getTypeColor(type as ReferralType)}
                  />
                </DistributionItem>
              ))}
            </CardContent>
          </MetricCard>
        </Box>

        {/* Encaminhamentos Recentes */}
        <Box sx={{ width: '100%' }}>
          <RecentReferralsCard>
            <CardContent>
              <MetricTitle variant="h6">Encaminhamentos Recentes</MetricTitle>
              <List disablePadding>
                {recentReferrals.map((referral, index) => (
                  <React.Fragment key={referral.id}>
                    <ListItem button onClick={() => onReferralSelect(referral.id)} sx={{ py: 1.5 }}>
                      <ListItemIcon>{getPriorityIcon(referral.priority)}</ListItemIcon>
                      <ListItemText
                        primary={referral.title}
                        secondary={
                          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 0.5 }}>
                            <Chip
                              label={referral.status}
                              size="small"
                              color={referral.status === 'completed' ? 'success' : 'default'}
                            />
                            <Chip
                              label={referral.type}
                              size="small"
                              color={getTypeColor(referral.type)}
                              variant="outlined"
                            />
                            <Typography variant="caption" color="text.secondary">
                              Vencimento: {new Date(referral.dueDate).toLocaleDateString()}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < recentReferrals.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </RecentReferralsCard>
        </Box>
      </Box>
    </Container>
  );
};

export default ReferralDashboard;
