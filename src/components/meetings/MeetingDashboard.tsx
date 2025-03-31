import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  LinearProgress,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Event as EventIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import { MeetingDashboardProps, Meeting } from '@/types/meeting';

type PendingDecision = {
  id: string;
  description: string;
  assignedTo: string[];
  dueDate: Date;
  status: 'pending' | 'in_progress' | 'completed';
  createdAt: Date;
  updatedAt: Date;
  meetingId: string;
  meetingTitle: string;
  meetingDate: Date;
};

export const MeetingDashboard: React.FC<MeetingDashboardProps> = ({
  meetings,
  onMeetingSelect,
  className = '',
  style = {},
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'in_progress':
        return 'info';
      case 'scheduled':
        return 'warning';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Concluída';
      case 'in_progress':
        return 'Em Andamento';
      case 'scheduled':
        return 'Agendada';
      case 'cancelled':
        return 'Cancelada';
      default:
        return status;
    }
  };

  const getProgress = (meeting: Meeting) => {
    const totalDecisions = meeting.decisions.length;
    if (totalDecisions === 0) return 0;

    const completedDecisions = meeting.decisions.filter(
      decision => decision.status === 'completed'
    ).length;

    return (completedDecisions / totalDecisions) * 100;
  };

  const getUpcomingMeetings = () => {
    const now = new Date();
    return meetings
      .filter(meeting => new Date(meeting.startDate) > now)
      .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
      .slice(0, 5);
  };

  const getPendingDecisions = (): PendingDecision[] => {
    return meetings
      .flatMap(meeting =>
        meeting.decisions
          .filter(decision => decision.status !== 'completed')
          .map(decision => ({
            ...decision,
            meetingId: meeting.id,
            meetingTitle: meeting.title,
            meetingDate: meeting.startDate,
          }))
      )
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
      .slice(0, 5);
  };

  return (
    <Box className={className} style={style}>
      <Grid container spacing={3}>
        {/* Estatísticas Gerais */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Estatísticas de Reuniões
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={3}>
                <Card>
                  <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                      Total de Reuniões
                    </Typography>
                    <Typography variant="h4">{meetings.length}</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={3}>
                <Card>
                  <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                      Reuniões Concluídas
                    </Typography>
                    <Typography variant="h4">
                      {meetings.filter(m => m.status === 'completed').length}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={3}>
                <Card>
                  <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                      Reuniões Agendadas
                    </Typography>
                    <Typography variant="h4">
                      {meetings.filter(m => m.status === 'scheduled').length}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={3}>
                <Card>
                  <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                      Reuniões em Andamento
                    </Typography>
                    <Typography variant="h4">
                      {meetings.filter(m => m.status === 'in_progress').length}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Próximas Reuniões */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Próximas Reuniões
            </Typography>
            <List>
              {getUpcomingMeetings().map(meeting => (
                <ListItem key={meeting.id} button onClick={() => onMeetingSelect(meeting.id)}>
                  <ListItemIcon>
                    <EventIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={meeting.title}
                    secondary={new Date(meeting.startDate).toLocaleString('pt-BR')}
                  />
                  <Chip
                    label={getStatusText(meeting.status)}
                    color={getStatusColor(meeting.status)}
                    size="small"
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Decisões Pendentes */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Decisões Pendentes
            </Typography>
            <List>
              {getPendingDecisions().map(decision => (
                <ListItem
                  key={decision.id}
                  button
                  onClick={() => onMeetingSelect(decision.meetingId)}
                >
                  <ListItemIcon>
                    {new Date(decision.dueDate) < new Date() ? (
                      <WarningIcon color="error" />
                    ) : (
                      <ScheduleIcon color="warning" />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary={decision.description}
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Reunião: {decision.meetingTitle}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Prazo: {new Date(decision.dueDate).toLocaleDateString('pt-BR')}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Responsáveis: {decision.assignedTo.join(', ')}
                        </Typography>
                      </Box>
                    }
                  />
                  <Chip
                    label={getStatusText(decision.status)}
                    color={getStatusColor(decision.status)}
                    size="small"
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Progresso das Reuniões */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Progresso das Reuniões
            </Typography>
            <List>
              {meetings.map(meeting => (
                <ListItem key={meeting.id} button onClick={() => onMeetingSelect(meeting.id)}>
                  <ListItemIcon>
                    <EventIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={meeting.title}
                    secondary={
                      <Box sx={{ width: '100%' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                            {meeting.decisions.filter(d => d.status === 'completed').length} de{' '}
                            {meeting.decisions.length} decisões concluídas
                          </Typography>
                          <Chip
                            label={getStatusText(meeting.status)}
                            color={getStatusColor(meeting.status)}
                            size="small"
                          />
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={getProgress(meeting)}
                          sx={{ height: 8, borderRadius: 4 }}
                        />
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};
