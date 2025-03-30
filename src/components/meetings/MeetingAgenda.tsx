import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  TextField,
  Button,
  Chip,
  Grid,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  DragIndicator as DragIcon,
} from '@mui/icons-material';
import { MeetingAgendaProps } from '@/types/meeting';

export const MeetingAgenda: React.FC<MeetingAgendaProps> = ({
  meeting,
  onUpdateAgenda,
  className = '',
  style = {},
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newItem, setNewItem] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const handleAddItem = () => {
    if (newItem.trim()) {
      const updatedAgenda = [...meeting.agenda, newItem.trim()];
      onUpdateAgenda(updatedAgenda);
      setNewItem('');
      setIsEditing(false);
    }
  };

  const handleEditItem = (index: number) => {
    setEditingIndex(index);
    setNewItem(meeting.agenda[index] || '');
    setIsEditing(true);
  };

  const handleUpdateItem = () => {
    if (editingIndex !== null && newItem.trim()) {
      const updatedAgenda = [...meeting.agenda];
      updatedAgenda[editingIndex] = newItem.trim();
      onUpdateAgenda(updatedAgenda);
      setNewItem('');
      setEditingIndex(null);
      setIsEditing(false);
    }
  };

  const handleDeleteItem = (index: number) => {
    const updatedAgenda = meeting.agenda.filter((_, i) => i !== index);
    onUpdateAgenda(updatedAgenda);
  };

  const handleCancel = () => {
    setNewItem('');
    setEditingIndex(null);
    setIsEditing(false);
  };

  return (
    <Paper className={className} style={style} sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Pauta da Reunião</Typography>
        {!isEditing && (
          <Button
            startIcon={<AddIcon />}
            onClick={() => setIsEditing(true)}
            variant="outlined"
          >
            Adicionar Item
          </Button>
        )}
      </Box>

      {isEditing && (
        <Box sx={{ mb: 2 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs>
              <TextField
                fullWidth
                label={editingIndex !== null ? 'Editar Item' : 'Novo Item'}
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                variant="outlined"
                size="small"
              />
            </Grid>
            <Grid item>
              <Button
                onClick={editingIndex !== null ? handleUpdateItem : handleAddItem}
                variant="contained"
                color="primary"
                disabled={!newItem.trim()}
              >
                {editingIndex !== null ? 'Atualizar' : 'Adicionar'}
              </Button>
            </Grid>
            <Grid item>
              <Button onClick={handleCancel} variant="outlined">
                Cancelar
              </Button>
            </Grid>
          </Grid>
        </Box>
      )}

      <List>
        {meeting.agenda.map((item, index) => (
          <ListItem
            key={index}
            secondaryAction={
              <Box>
                <IconButton
                  edge="end"
                  aria-label="editar"
                  onClick={() => handleEditItem(index)}
                  sx={{ mr: 1 }}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  edge="end"
                  aria-label="deletar"
                  onClick={() => handleDeleteItem(index)}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            }
          >
            <ListItemIcon>
              <DragIcon />
            </ListItemIcon>
            <ListItemText primary={item} />
          </ListItem>
        ))}
        {meeting.agenda.length === 0 && (
          <ListItem>
            <ListItemText
              primary="Nenhum item na pauta"
              secondary="Clique em 'Adicionar Item' para começar"
            />
          </ListItem>
        )}
      </List>
    </Paper>
  );
};
