import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Grid,
  Switch,
  FormControlLabel,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon, Add as AddIcon } from '@mui/icons-material';
import { WebhookConfig as WebhookConfigType } from '@/types/integrations';
import { webhookService } from '@/services/integrations/webhookService';

export const WebhookConfig: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [webhooks, setWebhooks] = useState<WebhookConfigType[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingWebhook, setEditingWebhook] = useState<WebhookConfigType | null>(null);
  const [newWebhook, setNewWebhook] = useState<Omit<WebhookConfigType, 'id'>>({
    url: '',
    secret: '',
    status: 'inactive',
    events: [],
    retryCount: 3,
    timeout: 5000,
    headers: {},
  });

  const fetchWebhooks = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await webhookService.getWebhooks();
      setWebhooks(response.data);
    } catch (err) {
      setError('Erro ao carregar webhooks');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWebhooks();
  }, []);

  const handleOpenDialog = (webhook?: WebhookConfigType) => {
    if (webhook) {
      setEditingWebhook(webhook);
      setNewWebhook({
        url: webhook.url,
        secret: webhook.secret,
        status: webhook.status,
        events: webhook.events,
        retryCount: webhook.retryCount,
        timeout: webhook.timeout,
        headers: webhook.headers || {},
      });
    } else {
      setEditingWebhook(null);
      setNewWebhook({
        url: '',
        secret: '',
        status: 'inactive',
        events: [],
        retryCount: 3,
        timeout: 5000,
        headers: {},
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingWebhook(null);
    setNewWebhook({
      url: '',
      secret: '',
      status: 'inactive',
      events: [],
      retryCount: 3,
      timeout: 5000,
      headers: {},
    });
  };

  const handleChange =
    (field: keyof typeof newWebhook) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setNewWebhook({
        ...newWebhook,
        [field]: event.target.type === 'checkbox' ? event.target.checked : event.target.value,
      });
    };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      if (editingWebhook) {
        await webhookService.updateWebhook(editingWebhook.id, newWebhook);
        setSuccess('Webhook atualizado com sucesso');
      } else {
        await webhookService.createWebhook(newWebhook);
        setSuccess('Webhook criado com sucesso');
      }

      handleCloseDialog();
      fetchWebhooks();
    } catch (err) {
      setError('Erro ao salvar webhook');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setError(null);
      setSuccess(null);
      await webhookService.deleteWebhook(id);
      setSuccess('Webhook excluído com sucesso');
      fetchWebhooks();
    } catch (err) {
      setError('Erro ao excluir webhook');
      console.error(err);
    }
  };

  const handleRetryFailedEvents = async (id: string) => {
    try {
      setError(null);
      setSuccess(null);
      const response = await webhookService.retryFailedEvents(id);
      if (response.data.success) {
        setSuccess('Eventos falhos serão tentados novamente');
      } else {
        setError('Falha ao tentar novamente eventos falhos');
      }
    } catch (err) {
      setError('Erro ao tentar novamente eventos falhos');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Card>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h5">Configuração de Webhooks</Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
            >
              Novo Webhook
            </Button>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}

          <List>
            {webhooks.map(webhook => (
              <ListItem key={webhook.id}>
                <ListItemText
                  primary={webhook.url}
                  secondary={
                    <Box>
                      <Typography variant="body2" color="textSecondary">
                        Status: {webhook.status}
                      </Typography>
                      <Box display="flex" gap={1} mt={1}>
                        {webhook.events.map(event => (
                          <Chip key={event} label={event} size="small" />
                        ))}
                      </Box>
                    </Box>
                  }
                />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    aria-label="edit"
                    onClick={() => handleOpenDialog(webhook)}
                    sx={{ mr: 1 }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => handleDelete(webhook.id)}
                    sx={{ mr: 1 }}
                  >
                    <DeleteIcon />
                  </IconButton>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleRetryFailedEvents(webhook.id)}
                  >
                    Tentar Novamente
                  </Button>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{editingWebhook ? 'Editar Webhook' : 'Novo Webhook'}</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="URL"
                  value={newWebhook.url}
                  onChange={handleChange('url')}
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Secret"
                  type="password"
                  value={newWebhook.secret}
                  onChange={handleChange('secret')}
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Timeout (ms)"
                  type="number"
                  value={newWebhook.timeout}
                  onChange={handleChange('timeout')}
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Tentativas"
                  type="number"
                  value={newWebhook.retryCount}
                  onChange={handleChange('retryCount')}
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={newWebhook.status === 'active'}
                      onChange={e =>
                        handleChange('status')({
                          ...e,
                          target: {
                            ...e.target,
                            value: e.target.checked ? 'active' : 'inactive',
                          },
                        } as any)
                      }
                    />
                  }
                  label="Ativar Webhook"
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancelar</Button>
            <Button type="submit" variant="contained" color="primary" disabled={saving}>
              {saving ? 'Salvando...' : 'Salvar'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};
