import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
} from '@mui/material';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import {
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  AccessTime as AccessTimeIcon,
} from '@mui/icons-material';
import { ReferralTimelineProps, HistoryItem, ReferralStatus } from '../../types/referral';

const ReferralTimeline: React.FC<ReferralTimelineProps> = ({ history }) => {
  const getStatusIcon = (status?: ReferralStatus) => {
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
  };

  const getStatusColor = (status?: ReferralStatus) => {
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
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Histórico de Alterações
        </Typography>
        <Timeline>
          {history.map((item, index) => (
            <TimelineItem key={item.id}>
              <TimelineSeparator>
                <TimelineDot color={getStatusColor(item.newStatus)}>
                  {getStatusIcon(item.newStatus)}
                </TimelineDot>
                {index < history.length - 1 && <TimelineConnector />}
              </TimelineSeparator>
              <TimelineContent>
                <Box sx={{ mb: 1 }}>
                  <Typography variant="subtitle2" component="span">
                    {item.action}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                    {new Date(item.createdAt).toLocaleString()}
                  </Typography>
                </Box>
                <Typography variant="body2" paragraph>
                  {item.description}
                </Typography>
                {item.previousStatus && item.newStatus && (
                  <Box sx={{ display: 'flex', gap: 1 }}>
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
            </TimelineItem>
          ))}
        </Timeline>
      </CardContent>
    </Card>
  );
};

export default ReferralTimeline;
