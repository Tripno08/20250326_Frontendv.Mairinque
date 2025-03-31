import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Divider,
  Grid,
  Chip,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import { CollaborativeEditorProps, MeetingNote } from '@/types/meeting';

export const CollaborativeEditor: React.FC<CollaborativeEditorProps> = ({
  meeting,
  onUpdateNotes,
  className = '',
  style = {},
}) => {
  const [notes, setNotes] = useState<MeetingNote[]>(meeting.notes);
  const [editingNote, setEditingNote] = useState<MeetingNote | null>(null);
  const [newNote, setNewNote] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setNotes(meeting.notes);
  }, [meeting.notes]);

  const handleAddNote = async () => {
    if (newNote.trim()) {
      const note: MeetingNote = {
        id: Date.now().toString(),
        content: newNote.trim(),
        authorId: 'current-user-id', // TODO: Substituir pelo ID real do usuário
        authorName: 'Usuário Atual', // TODO: Substituir pelo nome real do usuário
        createdAt: new Date(),
        updatedAt: new Date(),
        isEdited: false,
      };

      const updatedNotes = [...notes, note];
      setNotes(updatedNotes);
      await onUpdateNotes(updatedNotes);
      setNewNote('');
      setIsEditing(false);
    }
  };

  const handleEditNote = (note: MeetingNote) => {
    setEditingNote(note);
    setNewNote(note.content);
    setIsEditing(true);
  };

  const handleUpdateNote = async () => {
    if (editingNote && newNote.trim()) {
      const updatedNote: MeetingNote = {
        ...editingNote,
        content: newNote.trim(),
        updatedAt: new Date(),
        isEdited: true,
      };

      const updatedNotes = notes.map(note => (note.id === editingNote.id ? updatedNote : note));

      setNotes(updatedNotes);
      await onUpdateNotes(updatedNotes);
      setNewNote('');
      setEditingNote(null);
      setIsEditing(false);
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    const updatedNotes = notes.filter(note => note.id !== noteId);
    setNotes(updatedNotes);
    await onUpdateNotes(updatedNotes);
  };

  const handleCancel = () => {
    setNewNote('');
    setEditingNote(null);
    setIsEditing(false);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Paper className={className} style={style} sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Notas e Ata da Reunião</Typography>
        {!isEditing && (
          <Button startIcon={<EditIcon />} onClick={() => setIsEditing(true)} variant="outlined">
            Nova Nota
          </Button>
        )}
      </Box>

      {isEditing && (
        <Box sx={{ mb: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label={editingNote ? 'Editar Nota' : 'Nova Nota'}
                value={newNote}
                onChange={e => setNewNote(e.target.value)}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
              <Button startIcon={<CancelIcon />} onClick={handleCancel} variant="outlined">
                Cancelar
              </Button>
              <Button
                startIcon={<SaveIcon />}
                onClick={editingNote ? handleUpdateNote : handleAddNote}
                variant="contained"
                color="primary"
                disabled={!newNote.trim()}
              >
                {editingNote ? 'Atualizar' : 'Adicionar'}
              </Button>
            </Grid>
          </Grid>
        </Box>
      )}

      <List>
        {notes.map(note => (
          <React.Fragment key={note.id}>
            <ListItem
              secondaryAction={
                <Box>
                  <IconButton
                    edge="end"
                    aria-label="editar"
                    onClick={() => handleEditNote(note)}
                    sx={{ mr: 1 }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    edge="end"
                    aria-label="deletar"
                    onClick={() => handleDeleteNote(note.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              }
            >
              <ListItemText
                primary={note.content}
                secondary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      {note.authorName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {formatDate(note.createdAt)}
                    </Typography>
                    {note.isEdited && <Chip label="Editado" size="small" color="info" />}
                  </Box>
                }
              />
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
        {notes.length === 0 && (
          <ListItem>
            <ListItemText
              primary="Nenhuma nota registrada"
              secondary="Clique em 'Nova Nota' para começar"
            />
          </ListItem>
        )}
      </List>
    </Paper>
  );
};
