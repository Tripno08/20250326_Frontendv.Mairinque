'use client';

import React, { useState, useCallback } from 'react';
import {
  CardContent,
  Grid,
  Typography,
  Chip,
  TextField,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
} from '@mui/material';
import {
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  AccessTime as AccessTimeIcon,
  AttachFile as AttachFileIcon,
  Send as SendIcon,
} from '@mui/icons-material';
import { ReferralPriority, ReferralType, Referral, Comment } from '../../../types/referral';
import { ReferralDetailsProps } from './types';
import {
  Container,
  Header,
  InfoSection,
  DetailItem,
  Label,
  CommentSection,
  CommentForm,
  Comment as CommentBox,
  CommentHeader,
  CommentAuthor,
  CommentDate,
  StatusChips,
} from './styles';
import ReferralTimeline from '../ReferralTimeline';

export const ReferralDetails: React.FC<ReferralDetailsProps> = ({
  referral,
  onUpdate,
  onAddComment,
  className,
}) => {
  const [newComment, setNewComment] = useState('');
  const [isCommentDialogOpen, setIsCommentDialogOpen] = useState(false);

  const handleStatusChange = useCallback(
    (newStatus: Referral['status']) => {
      onUpdate({
        ...referral,
        status: newStatus,
        history: [
          ...referral.history,
          {
            id: Date.now().toString(),
            createdAt: new Date(),
            updatedAt: new Date(),
            action: 'Alteração de Status',
            description: `Status alterado de ${referral.status} para ${newStatus}`,
            author: 'current-user', // TODO: Get from auth context
            previousStatus: referral.status,
            newStatus,
          },
        ],
      });
    },
    [referral, onUpdate]
  );

  const handleCommentSubmit = useCallback(() => {
    if (!newComment.trim()) return;

    const comment: Omit<Comment, 'id' | 'createdAt' | 'updatedAt'> = {
      content: newComment,
      author: 'current-user', // TODO: Get from auth context
    };

    onAddComment(referral.id, comment);
    setNewComment('');
    setIsCommentDialogOpen(false);
  }, [referral.id, newComment, onAddComment]);

  const getPriorityIcon = useCallback((priority: ReferralPriority) => {
    switch (priority) {
      case 'urgent':
        return <ErrorIcon color="error" />;
      case 'high':
        return <WarningIcon color="warning" />;
      case 'medium':
        return <AccessTimeIcon color="info" />;
      case 'low':
        return <CheckCircleIcon color="success" />;
      default:
        return <AssignmentIcon />;
    }
  }, []);

  const getPriorityColor = useCallback((priority: ReferralPriority) => {
    switch (priority) {
      case 'urgent':
        return 'error';
      case 'high':
        return 'warning';
      case 'medium':
        return 'info';
      case 'low':
        return 'success';
      default:
        return 'primary';
    }
  }, []);

  const getTypeColor = useCallback((type: ReferralType) => {
    switch (type) {
      case 'academic':
        return 'primary';
      case 'behavioral':
        return 'secondary';
      case 'social':
        return 'info';
      case 'administrative':
        return 'warning';
      default:
        return 'primary';
    }
  }, []);

  return (
    <Box className={className}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Container>
            <CardContent>
              <Header>
                <Typography variant="h5" gutterBottom>
                  {referral.title}
                </Typography>
                <StatusChips direction="row" spacing={1}>
                  <Chip
                    label={referral.status}
                    color={referral.status === 'completed' ? 'success' : 'default'}
                    size="small"
                  />
                  <Chip
                    label={referral.priority}
                    color={getPriorityColor(referral.priority)}
                    size="small"
                    icon={getPriorityIcon(referral.priority)}
                  />
                  <Chip
                    label={referral.type}
                    color={getTypeColor(referral.type)}
                    size="small"
                    variant="outlined"
                  />
                </StatusChips>
              </Header>

              <Typography variant="body1" paragraph>
                {referral.description}
              </Typography>

              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                {referral.tags.map(tag => (
                  <Chip key={tag} label={tag} variant="outlined" size="small" />
                ))}
              </Box>

              <Divider sx={{ my: 2 }} />

              <InfoSection>
                <Label variant="subtitle1" gutterBottom>
                  Anexos
                </Label>
                <List>
                  {referral.attachments.map(attachment => (
                    <ListItem key={attachment.id}>
                      <ListItemIcon>
                        <AttachFileIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary={attachment.name}
                        secondary={`${Math.round(attachment.size / 1024)} KB`}
                      />
                    </ListItem>
                  ))}
                </List>
              </InfoSection>

              <Divider sx={{ my: 2 }} />

              <CommentSection>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 2,
                  }}
                >
                  <Typography variant="subtitle1">Comentários</Typography>
                  <Button
                    variant="outlined"
                    startIcon={<SendIcon />}
                    onClick={() => setIsCommentDialogOpen(true)}
                  >
                    Novo Comentário
                  </Button>
                </Box>

                {referral.comments.map(comment => (
                  <CommentBox key={comment.id}>
                    <CommentHeader>
                      <CommentAuthor variant="body2">{comment.author}</CommentAuthor>
                      <CommentDate variant="caption">
                        {new Date(comment.createdAt).toLocaleString()}
                      </CommentDate>
                    </CommentHeader>
                    <Typography variant="body2">{comment.content}</Typography>
                  </CommentBox>
                ))}
              </CommentSection>
            </CardContent>
          </Container>
        </Grid>

        <Grid item xs={12} md={4}>
          <ReferralTimeline history={referral.history} />

          <Container sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Ações
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Button
                  variant="contained"
                  color="primary"
                  disabled={referral.status === 'completed'}
                  onClick={() => handleStatusChange('in_progress')}
                >
                  Iniciar
                </Button>
                <Button
                  variant="contained"
                  color="success"
                  disabled={referral.status === 'completed'}
                  onClick={() => handleStatusChange('completed')}
                >
                  Concluir
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  disabled={referral.status === 'cancelled'}
                  onClick={() => handleStatusChange('cancelled')}
                >
                  Cancelar
                </Button>
              </Box>
            </CardContent>
          </Container>
        </Grid>
      </Grid>

      <Dialog open={isCommentDialogOpen} onClose={() => setIsCommentDialogOpen(false)}>
        <DialogTitle>Novo Comentário</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Comentário"
            fullWidth
            multiline
            rows={4}
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsCommentDialogOpen(false)}>Cancelar</Button>
          <Button onClick={handleCommentSubmit} variant="contained" color="primary">
            Enviar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ReferralDetails;
