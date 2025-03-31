import React from 'react';
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Grid,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { ScreeningAdministration, ScreeningResponse } from '../../types/screening';

interface ScreeningResponsesProps {
  administration: ScreeningAdministration;
  open: boolean;
  onClose: () => void;
}

const formatResponseValue = (response: ScreeningResponse): string => {
  if (Array.isArray(response.value)) {
    return response.value.join(', ');
  }
  return response.value.toString();
};

export const ScreeningResponses: React.FC<ScreeningResponsesProps> = ({
  administration,
  open,
  onClose,
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Respostas da Administração</DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h6">{administration.instrumentId}</Typography>
              <Typography variant="body2" color="textSecondary">
                {administration.responses.length} respostas
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Divider />
          </Grid>

          <Grid item xs={12}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Questão</TableCell>
                    <TableCell>Resposta</TableCell>
                    <TableCell>Data</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {administration.responses.map((response, index) => (
                    <TableRow key={index}>
                      <TableCell>{response.questionId}</TableCell>
                      <TableCell>{formatResponseValue(response)}</TableCell>
                      <TableCell>{new Date(response.timestamp).toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Fechar</Button>
      </DialogActions>
    </Dialog>
  );
};
