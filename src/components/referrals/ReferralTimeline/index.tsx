'use client';

import React, { useCallback } from 'react';
import { CardContent, Typography, Chip, Box, Divider } from '@mui/material';
import {
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  AccessTime as AccessTimeIcon,
} from '@mui/icons-material';
import { ReferralStatus } from '../../../types/referral';
import { ReferralTimelineProps } from './types';
import {
  Container,
  TimelineContainer,
  TimelineItem,
  TimelineDate,
  TimelineContent,
  TimelineAuthor,
  TimelineDescription,
} from './styles';

export const ReferralTimeline: React.FC<ReferralTimelineProps> = ({ history, className }) => {
  const getStatusIcon = useCallback((status?: ReferralStatus) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon color="success" />;
      case 'cancelled':
        return <ErrorIcon color="error" />;
      case 'in_progress':
        return <AccessTimeIcon color="info" />;
      case 'pending':
        return <WarningIcon color="warning" />;
      default:
        return <AssignmentIcon />;
    }
  }, []);

  const getStatusColor = useCallback((status?: ReferralStatus) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'error';
      case 'in_progress':
        return 'info';
      case 'pending':
        return 'warning';
      default:
        return 'primary';
    }
  }, []);

  return (
    <Container className={className}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Histórico de Alterações
        </Typography>

        <TimelineContainer>
          {history.map((item, index) => (
            <TimelineItem key={item.id}>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 1 }}>
                  <Box
                    sx={{
                      width: 24,
                      height: 24,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: theme => theme.palette[getStatusColor(item.newStatus)].main,
                      borderRadius: '50%',
                      color: 'white',
                      fontSize: '0.75rem',
                    }}
                  >
                    {getStatusIcon(item.newStatus)}
                  </Box>
                  <Typography variant="subtitle2">{item.action}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(item.createdAt).toLocaleString()}
                  </Typography>
                </Box>

                <TimelineContent>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    {item.description}
                  </Typography>

                  {item.previousStatus && item.newStatus && (
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                      <Chip
                        label={item.previousStatus}
                        size="small"
                        color={getStatusColor(item.previousStatus)}
                        variant="outlined"
                      />
                      <Typography variant="caption" color="text.secondary">
                        →
                      </Typography>
                      <Chip
                        label={item.newStatus}
                        size="small"
                        color={getStatusColor(item.newStatus)}
                      />
                    </Box>
                  )}
                </TimelineContent>
              </Box>

              {index < history.length - 1 && (
                <Box
                  sx={{ height: 24, ml: '12px', borderLeft: '2px solid', borderColor: 'divider' }}
                />
              )}
            </TimelineItem>
          ))}
        </TimelineContainer>
      </CardContent>
    </Container>
  );
};

export default ReferralTimeline;
