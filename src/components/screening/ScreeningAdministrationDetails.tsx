import React, { useState } from 'react';
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Grid,
  Chip,
  Divider
} from '@mui/material';
import { ScreeningAdministration } from '../../types/screening';
import { ScreeningResponses } from './ScreeningResponses';

interface ScreeningAdministrationDetailsProps {
  administration: ScreeningAdministration;
  open: boolean;
  onClose: () => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending':
      return 'warning';
    case 'in_progress':
      return 'info';
    case 'completed':
      return 'success';
    case 'cancelled':
      return 'error';
    default:
      return 'default';
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'pending':
      return 'Pendente';
    case 'in_progress':
      return 'Em Andamento';
    case 'completed':
      return 'Concluído';
    case 'cancelled':
      return 'Cancelado';
    default:
      return status;
  }
};

export const ScreeningAdministrationDetails: React.FC<ScreeningAdministrationDetailsProps> = ({
  administration,
  open,
  onClose
}) => {
  const [responsesDialogOpen, setResponsesDialogOpen] = useState(false);

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>Detalhes da Administração</DialogTitle>
        <DialogContent>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h6">{administration.instrumentId}</Typography>
                <Chip
                  label={getStatusLabel(administration.status)}
                  color={getStatusColor(administration.status)}
                  size="small"
                />
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Divider />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="textSecondary">
                Estudante
              </Typography>
              <Typography variant="body1">{administration.studentId}</Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="textSecondary">
                Administrador
              </Typography>
              <Typography variant="body1">{administration.administratorId}</Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="textSecondary">
                Data de Início
              </Typography>
              <Typography variant="body1">
                {new Date(administration.startDate).toLocaleString()}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="textSecondary">
                Data de Término
              </Typography>
              <Typography variant="body1">
                {administration.endDate
                  ? new Date(administration.endDate).toLocaleString()
                  : '-'}
              </Typography>
            </Grid>

            {administration.notes && (
              <>
                <Grid item xs={12}>
                  <Divider />
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Notas
                  </Typography>
                  <Typography variant="body1">{administration.notes}</Typography>
                </Grid>
              </>
            )}

            <Grid item xs={12}>
              <Divider />
            </Grid>

            <Grid item xs={12}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="subtitle2" color="textSecondary">
                  Respostas
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => setResponsesDialogOpen(true)}
                >
                  Visualizar Respostas
                </Button>
              </Box>
              <Typography variant="body1">
                {administration.responses.length} respostas registradas
              </Typography>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Fechar</Button>
        </DialogActions>
      </Dialog>

      <ScreeningResponses
        administration={administration}
        open={responsesDialogOpen}
        onClose={() => setResponsesDialogOpen(false)}
      />
    </>
  );
};
