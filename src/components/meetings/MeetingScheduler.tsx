import React, { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Typography,
  SelectChangeEvent,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers';
import { MeetingSchedulerProps, MeetingType, Meeting } from '@/types/meeting';

export const MeetingScheduler: React.FC<MeetingSchedulerProps> = ({
  onSchedule,
  initialDate,
  className = '',
  style = {},
}) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<Omit<Meeting, 'id' | 'createdAt' | 'updatedAt'>>({
    title: '',
    type: 'rti',
    description: '',
    startDate: initialDate || new Date(),
    endDate: initialDate ? new Date(initialDate.getTime() + 60 * 60 * 1000) : new Date(),
    status: 'scheduled',
    participants: [],
    decisions: [],
    notes: [],
    agenda: [],
  });

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSchedule(formData);
      handleClose();
      setFormData({
        title: '',
        type: 'rti',
        description: '',
        startDate: initialDate || new Date(),
        endDate: initialDate ? new Date(initialDate.getTime() + 60 * 60 * 1000) : new Date(),
        status: 'scheduled',
        participants: [],
        decisions: [],
        notes: [],
        agenda: [],
      });
    } catch (error) {
      console.error('Erro ao agendar reunião:', error);
    }
  };

  const handleTextChange = (field: string) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleSelectChange = (e: SelectChangeEvent<MeetingType>) => {
    setFormData((prev) => ({
      ...prev,
      type: e.target.value as MeetingType,
    }));
  };

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        onClick={handleOpen}
        className={className}
        style={style}
      >
        Agendar Reunião
      </Button>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Agendar Nova Reunião</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Título"
                  value={formData.title}
                  onChange={handleTextChange('title')}
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Tipo de Reunião</InputLabel>
                  <Select
                    value={formData.type}
                    onChange={handleSelectChange}
                    label="Tipo de Reunião"
                  >
                    <MenuItem value="rti">RTI</MenuItem>
                    <MenuItem value="pedagogical">Pedagógica</MenuItem>
                    <MenuItem value="administrative">Administrativa</MenuItem>
                    <MenuItem value="parent_teacher">Pais e Professores</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Descrição"
                  multiline
                  rows={4}
                  value={formData.description}
                  onChange={handleTextChange('description')}
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <DateTimePicker
                  label="Data e Hora de Início"
                  value={formData.startDate}
                  onChange={(newValue) =>
                    setFormData((prev) => ({ ...prev, startDate: newValue || new Date() }))
                  }
                  slotProps={{ textField: { fullWidth: true, required: true } }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <DateTimePicker
                  label="Data e Hora de Término"
                  value={formData.endDate}
                  onChange={(newValue) =>
                    setFormData((prev) => ({ ...prev, endDate: newValue || new Date() }))
                  }
                  slotProps={{ textField: { fullWidth: true, required: true } }}
                />
              </Grid>
            </Grid>
          </DialogContent>

          <DialogActions>
            <Button onClick={handleClose}>Cancelar</Button>
            <Button type="submit" variant="contained" color="primary">
              Agendar
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};
