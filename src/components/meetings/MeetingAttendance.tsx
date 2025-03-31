import React from 'react';
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Switch,
  Chip,
  Grid,
} from '@mui/material';
import { MeetingAttendanceProps } from '@/types/meeting';

export const MeetingAttendance: React.FC<MeetingAttendanceProps> = ({
  meeting,
  onUpdateAttendance,
  className = '',
  style = {},
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'declined':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmado';
      case 'pending':
        return 'Pendente';
      case 'declined':
        return 'Recusado';
      default:
        return status;
    }
  };

  return (
    <Paper className={className} style={style} sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Lista de Presença
      </Typography>

      <List>
        {meeting.participants.map(participant => (
          <ListItem key={participant.id}>
            <ListItemText
              primary={participant.name}
              secondary={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    {participant.role}
                  </Typography>
                  <Chip
                    label={getStatusText(participant.status)}
                    color={getStatusColor(participant.status)}
                    size="small"
                  />
                </Box>
              }
            />
            <ListItemSecondaryAction>
              <Switch
                edge="end"
                checked={participant.attendance || false}
                onChange={e => onUpdateAttendance(participant.id, e.target.checked)}
                disabled={participant.status === 'declined'}
              />
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>

      <Box sx={{ mt: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <Typography variant="body2" color="text.secondary">
              Total de Participantes: {meeting.participants.length}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="body2" color="text.secondary">
              Presentes: {meeting.participants.filter(p => p.attendance).length}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="body2" color="text.secondary">
              Ausentes: {meeting.participants.filter(p => !p.attendance).length}
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};
