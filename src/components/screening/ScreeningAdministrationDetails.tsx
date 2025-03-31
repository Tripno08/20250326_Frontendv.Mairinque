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
  Divider,
} from '@mui/material';
import { ScreeningAdministration } from '../../types/screening';
import { ScreeningResponses } from './ScreeningResponses';
import GridContainer from '@/components/GridContainer';
import GridItem from '@/components/GridItem';

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
  onClose,
}) => {
  const [responsesDialogOpen, setResponsesDialogOpen] = useState(false);

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>Detalhes da Administração</DialogTitle>
        <DialogContent>
          <GridContainer spacing={3}>
            <GridItem xs={12}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h6">{administration.instrumentId}</Typography>
                <Chip
                  label={getStatusLabel(administration.status)}
                  color={getStatusColor(administration.status)}
                  size="small"
                />
              </Box>
            </GridItem>

            <GridItem xs={12}>
              <Divider />
            </GridItem>

            <GridItem xs={12} sm={6}>
              <Typography variant="subtitle2" color="textSecondary">
                Estudante
              </Typography>
              <Typography variant="body1">{administration.studentId}</Typography>
            </GridItem>

            <GridItem xs={12} sm={6}>
              <Typography variant="subtitle2" color="textSecondary">
                Administrador
              </Typography>
              <Typography variant="body1">{administration.administratorId}</Typography>
            </GridItem>

            <GridItem xs={12} sm={6}>
              <Typography variant="subtitle2" color="textSecondary">
                Data de Início
              </Typography>
              <Typography variant="body1">
                {new Date(administration.startDate).toLocaleString()}
              </Typography>
            </GridItem>

            <GridItem xs={12} sm={6}>
              <Typography variant="subtitle2" color="textSecondary">
                Data de Término
              </Typography>
              <Typography variant="body1">
                {administration.endDate ? new Date(administration.endDate).toLocaleString() : '-'}
              </Typography>
            </GridItem>

            {administration.notes && (
              <>
                <GridItem xs={12}>
                  <Divider />
                </GridItem>

                <GridItem xs={12}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Notas
                  </Typography>
                  <Typography variant="body1">{administration.notes}</Typography>
                </GridItem>
              </>
            )}

            <GridItem xs={12}>
              <Divider />
            </GridItem>

            <GridItem xs={12}>
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
            </GridItem>
          </GridContainer>
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
