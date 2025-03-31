'use client';

import React, { useState, useCallback } from 'react';
import { CardContent } from '@mui/material';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { ReferralType, ReferralPriority } from '../../../types/referral';
import { ReferralBuilderProps } from './types';
import { Container, FormBox, HeaderBox, FormRow, TagsContainer, ActionButtons } from './styles';

export const ReferralBuilder: React.FC<ReferralBuilderProps> = ({
  onSubmit,
  onCancel,
  className,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<ReferralType>('academic');
  const [priority, setPriority] = useState<ReferralPriority>('medium');
  const [assignedTo, setAssignedTo] = useState('');
  const [dueDate, setDueDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!title || !description || !assignedTo || !dueDate) return;

      onSubmit({
        title,
        description,
        type,
        priority,
        assignedTo,
        dueDate: new Date(dueDate),
        status: 'pending',
        createdBy: 'current-user', // TODO: Get from auth context
        attachments: [],
        comments: [],
        history: [],
        tags,
      });

      // Reset form
      setTitle('');
      setDescription('');
      setType('academic');
      setPriority('medium');
      setAssignedTo('');
      setDueDate(new Date().toISOString().split('T')[0]);
      setTags([]);
      setNewTag('');
    },
    [title, description, type, priority, assignedTo, dueDate, tags, onSubmit]
  );

  const handleAddTag = useCallback(() => {
    if (newTag && !tags.includes(newTag)) {
      setTags(prevTags => [...prevTags, newTag]);
      setNewTag('');
    }
  }, [newTag, tags]);

  const handleRemoveTag = useCallback((tagToRemove: string) => {
    setTags(prevTags => prevTags.filter(tag => tag !== tagToRemove));
  }, []);

  return (
    <Container className={className}>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <FormBox>
            <HeaderBox>
              <Typography variant="h6" gutterBottom>
                Novo Encaminhamento
              </Typography>
            </HeaderBox>

            <TextField
              fullWidth
              label="Título"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
            />

            <TextField
              fullWidth
              label="Descrição"
              multiline
              rows={4}
              value={description}
              onChange={e => setDescription(e.target.value)}
              required
            />

            <FormRow>
              <FormControl fullWidth>
                <InputLabel>Tipo</InputLabel>
                <Select
                  value={type}
                  onChange={e => setType(e.target.value as ReferralType)}
                  label="Tipo"
                >
                  <MenuItem value="academic">Acadêmico</MenuItem>
                  <MenuItem value="behavioral">Comportamental</MenuItem>
                  <MenuItem value="social">Social</MenuItem>
                  <MenuItem value="administrative">Administrativo</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Prioridade</InputLabel>
                <Select
                  value={priority}
                  onChange={e => setPriority(e.target.value as ReferralPriority)}
                  label="Prioridade"
                >
                  <MenuItem value="low">Baixa</MenuItem>
                  <MenuItem value="medium">Média</MenuItem>
                  <MenuItem value="high">Alta</MenuItem>
                  <MenuItem value="urgent">Urgente</MenuItem>
                </Select>
              </FormControl>
            </FormRow>

            <FormRow>
              <TextField
                fullWidth
                label="Atribuir para"
                value={assignedTo}
                onChange={e => setAssignedTo(e.target.value)}
                required
              />

              <TextField
                fullWidth
                label="Data de Vencimento"
                type="date"
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                required
              />
            </FormRow>

            <div>
              <FormRow sx={{ alignItems: 'center' }}>
                <TextField
                  label="Adicionar Tag"
                  value={newTag}
                  onChange={e => setNewTag(e.target.value)}
                  size="small"
                />
                <IconButton onClick={handleAddTag} color="primary">
                  <AddIcon />
                </IconButton>
              </FormRow>
              <TagsContainer>
                {tags.map(tag => (
                  <Chip
                    key={tag}
                    label={tag}
                    onDelete={() => handleRemoveTag(tag)}
                    deleteIcon={<DeleteIcon />}
                  />
                ))}
              </TagsContainer>
            </div>

            <ActionButtons>
              <Button variant="outlined" onClick={onCancel}>
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={!title || !description || !assignedTo || !dueDate}
              >
                Criar Encaminhamento
              </Button>
            </ActionButtons>
          </FormBox>
        </form>
      </CardContent>
    </Container>
  );
};

export default ReferralBuilder;
