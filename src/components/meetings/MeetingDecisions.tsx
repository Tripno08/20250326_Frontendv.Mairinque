import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Chip,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { DateTimePicker } from '@mui/x-date-pickers';
import { MeetingDecisionsProps, MeetingDecision } from '@/types/meeting';

type DecisionStatus = 'pending' | 'in_progress' | 'completed';

export const MeetingDecisions: React.FC<MeetingDecisionsProps> = ({
  meeting,
  onAddDecision,
  onUpdateDecision,
  className = '',
  style = {},
}) => {
  const [open, setOpen] = useState(false);
  const [editingDecision, setEditingDecision] = useState<MeetingDecision | null>(null);
  const [formData, setFormData] = useState<Omit<MeetingDecision, 'id' | 'createdAt' | 'updatedAt'>>(
    {
      description: '',
      assignedTo: [],
      dueDate: new Date(),
      status: 'pending' as DecisionStatus,
    }
  );

  const handleOpen = () => {
    setOpen(true);
    setEditingDecision(null);
    setFormData({
      description: '',
      assignedTo: [],
      dueDate: new Date(),
      status: 'pending',
    });
  };

  const handleEdit = (decision: MeetingDecision) => {
    setEditingDecision(decision);
    setFormData({
      description: decision.description,
      assignedTo: decision.assignedTo,
      dueDate: decision.dueDate,
      status: decision.status,
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingDecision(null);
    setFormData({
      description: '',
      assignedTo: [],
      dueDate: new Date(),
      status: 'pending',
    });
  };

  const handleSubmit = async () => {
    try {
      if (editingDecision) {
        await onUpdateDecision(editingDecision.id, formData);
      } else {
        await onAddDecision(formData);
      }
      handleClose();
    } catch (error) {
      console.error('Erro ao salvar decisão:', error);
    }
  };

  const handleDelete = async (decisionId: string) => {
    try {
      await onUpdateDecision(decisionId, { status: 'completed' as DecisionStatus });
    } catch (error) {
      console.error('Erro ao deletar decisão:', error);
    }
  };

  const getStatusColor = (status: DecisionStatus) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'in_progress':
        return 'info';
      case 'completed':
        return 'success';
      default:
        return 'default';
    }
  };

  const getStatusText = (status: DecisionStatus) => {
    switch (status) {
      case 'pending':
        return 'Pendente';
      case 'in_progress':
        return 'Em Andamento';
      case 'completed':
        return 'Concluído';
      default:
        return status;
    }
  };

  return (
    <Paper className={className} style={style} sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Decisões e Encaminhamentos</Typography>
        <Button startIcon={<AddIcon />} onClick={handleOpen} variant="outlined">
          Nova Decisão
        </Button>
      </Box>

      <List>
        {meeting.decisions.map(decision => (
          <ListItem
            key={decision.id}
            secondaryAction={
              <Box>
                <IconButton
                  edge="end"
                  aria-label="editar"
                  onClick={() => handleEdit(decision)}
                  sx={{ mr: 1 }}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  edge="end"
                  aria-label="deletar"
                  onClick={() => handleDelete(decision.id)}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            }
          >
            <ListItemText
              primary={decision.description}
              secondary={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Responsáveis: {decision.assignedTo.join(', ')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Prazo: {new Date(decision.dueDate).toLocaleDateString()}
                  </Typography>
                  <Chip
                    label={getStatusText(decision.status)}
                    color={getStatusColor(decision.status)}
                    size="small"
                  />
                </Box>
              }
            />
          </ListItem>
        ))}
        {meeting.decisions.length === 0 && (
          <ListItem>
            <ListItemText
              primary="Nenhuma decisão registrada"
              secondary="Clique em 'Nova Decisão' para começar"
            />
          </ListItem>
        )}
      </List>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>{editingDecision ? 'Editar Decisão' : 'Nova Decisão'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Descrição"
                multiline
                rows={4}
                value={formData.description}
                onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Responsáveis (separados por vírgula)"
                value={formData.assignedTo.join(', ')}
                onChange={e =>
                  setFormData(prev => ({
                    ...prev,
                    assignedTo: e.target.value.split(',').map(s => s.trim()),
                  }))
                }
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <DateTimePicker
                label="Prazo"
                value={formData.dueDate}
                onChange={newValue =>
                  setFormData(prev => ({ ...prev, dueDate: newValue || new Date() }))
                }
                slotProps={{ textField: { fullWidth: true, required: true } }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Status</InputLabel>
                <Select
                  value={formData.status}
                  onChange={e =>
                    setFormData(prev => ({ ...prev, status: e.target.value as DecisionStatus }))
                  }
                  label="Status"
                >
                  <MenuItem value="pending">Pendente</MenuItem>
                  <MenuItem value="in_progress">Em Andamento</MenuItem>
                  <MenuItem value="completed">Concluído</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            disabled={!formData.description.trim() || formData.assignedTo.length === 0}
          >
            {editingDecision ? 'Atualizar' : 'Adicionar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};
