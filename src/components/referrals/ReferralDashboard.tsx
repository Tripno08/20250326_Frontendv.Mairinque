import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Divider,
} from '@mui/material';
import {
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  AccessTime as AccessTimeIcon,
} from '@mui/icons-material';
import { ReferralDashboardProps, Referral, ReferralPriority, ReferralType } from '../../types/referral';

const ReferralDashboard: React.FC<ReferralDashboardProps> = ({
  metrics,
  recentReferrals,
  onReferralSelect,
}) => {
  const getPriorityIcon = (priority: ReferralPriority) => {
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
  };

  const getPriorityColor = (priority: ReferralPriority) => {
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
  };

  const getTypeColor = (type: ReferralType) => {
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
  };

  return (
    <Box>
      <Grid container spacing={3}>
        {/* Métricas Gerais */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Métricas Gerais
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="h4">{metrics.total}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total de Encaminhamentos
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="h4">
                    {Math.round((metrics.completed / metrics.total) * 100)}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Taxa de Conclusão
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Tempo Médio de Resolução */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Tempo Médio de Resolução
              </Typography>
              <Typography variant="h4">
                {Math.round(metrics.averageResolutionTime / 24)} dias
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Média de tempo para conclusão
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Distribuição por Prioridade */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Distribuição por Prioridade
              </Typography>
              {Object.entries(metrics.priorityDistribution).map(([priority, count]) => (
                <Box key={priority} sx={{ mb: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="body2">
                      {priority.charAt(0).toUpperCase() + priority.slice(1)}
                    </Typography>
                    <Typography variant="body2">{count}</Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={(count / metrics.total) * 100}
                    color={getPriorityColor(priority as ReferralPriority)}
                  />
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* Distribuição por Tipo */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Distribuição por Tipo
              </Typography>
              {Object.entries(metrics.typeDistribution).map(([type, count]) => (
                <Box key={type} sx={{ mb: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="body2">
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </Typography>
                    <Typography variant="body2">{count}</Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={(count / metrics.total) * 100}
                    color={getTypeColor(type as ReferralType)}
                  />
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* Encaminhamentos Recentes */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Encaminhamentos Recentes
              </Typography>
              <List>
                {recentReferrals.map((referral, index) => (
                  <React.Fragment key={referral.id}>
                    <ListItem
                      button
                      onClick={() => onReferralSelect(referral.id)}
                    >
                      <ListItemIcon>
                        {getPriorityIcon(referral.priority)}
                      </ListItemIcon>
                      <ListItemText
                        primary={referral.title}
                        secondary={
                          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
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
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ReferralDashboard;
