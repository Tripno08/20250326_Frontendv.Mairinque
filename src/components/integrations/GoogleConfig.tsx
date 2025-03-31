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
} from '@mui/material';
import { GoogleConfig as GoogleConfigType } from '@/types/integrations';
import { googleService } from '@/services/integrations/googleService';

export const GoogleConfig: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [config, setConfig] = useState<GoogleConfigType | null>(null);

  const fetchConfig = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await googleService.getConfig();
      setConfig(response.data);
    } catch (err) {
      setError('Erro ao carregar configuração Google');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  const handleChange =
    (field: keyof GoogleConfigType) => (event: React.ChangeEvent<HTMLInputElement>) => {
      if (config) {
        setConfig({
          ...config,
          [field]: event.target.type === 'checkbox' ? event.target.checked : event.target.value,
        });
      }
    };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!config) return;

    try {
      setSaving(true);
      setError(null);
      setSuccess(null);
      await googleService.updateConfig(config);
      setSuccess('Configuração Google atualizada com sucesso');
    } catch (err) {
      setError('Erro ao salvar configuração Google');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleTestConnection = async () => {
    try {
      setError(null);
      setSuccess(null);
      const response = await googleService.testConnection();
      if (response.data.success) {
        setSuccess('Conexão Google testada com sucesso');
      } else {
        setError('Falha ao testar conexão Google');
      }
    } catch (err) {
      setError('Erro ao testar conexão Google');
      console.error(err);
    }
  };

  const handleSyncClassroom = async () => {
    try {
      setError(null);
      setSuccess(null);
      const response = await googleService.syncClassroom();
      if (response.data.success) {
        setSuccess('Google Classroom sincronizado com sucesso');
      } else {
        setError('Falha ao sincronizar Google Classroom');
      }
    } catch (err) {
      setError('Erro ao sincronizar Google Classroom');
      console.error(err);
    }
  };

  const handleSyncDrive = async () => {
    try {
      setError(null);
      setSuccess(null);
      const response = await googleService.syncDrive();
      if (response.data.success) {
        setSuccess('Google Drive sincronizado com sucesso');
      } else {
        setError('Falha ao sincronizar Google Drive');
      }
    } catch (err) {
      setError('Erro ao sincronizar Google Drive');
      console.error(err);
    }
  };

  const handleSyncCalendar = async () => {
    try {
      setError(null);
      setSuccess(null);
      const response = await googleService.syncCalendar();
      if (response.data.success) {
        setSuccess('Google Calendar sincronizado com sucesso');
      } else {
        setError('Falha ao sincronizar Google Calendar');
      }
    } catch (err) {
      setError('Erro ao sincronizar Google Calendar');
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

  if (!config) {
    return (
      <Box p={3}>
        <Alert severity="error">Não foi possível carregar a configuração Google</Alert>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Configuração Google
          </Typography>

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Client ID"
                  value={config.clientId}
                  onChange={handleChange('clientId')}
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Client Secret"
                  type="password"
                  value={config.clientSecret}
                  onChange={handleChange('clientSecret')}
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={config.status === 'active'}
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
                  label="Ativar Integração"
                />
              </Grid>

              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={config.classroomEnabled}
                      onChange={handleChange('classroomEnabled')}
                    />
                  }
                  label="Habilitar Google Classroom"
                />
              </Grid>

              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch checked={config.driveEnabled} onChange={handleChange('driveEnabled')} />
                  }
                  label="Habilitar Google Drive"
                />
              </Grid>

              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={config.calendarEnabled}
                      onChange={handleChange('calendarEnabled')}
                    />
                  }
                  label="Habilitar Google Calendar"
                />
              </Grid>

              {error && (
                <Grid item xs={12}>
                  <Alert severity="error">{error}</Alert>
                </Grid>
              )}

              {success && (
                <Grid item xs={12}>
                  <Alert severity="success">{success}</Alert>
                </Grid>
              )}

              <Grid item xs={12}>
                <Box display="flex" gap={2}>
                  <Button type="submit" variant="contained" color="primary" disabled={saving}>
                    {saving ? 'Salvando...' : 'Salvar Configuração'}
                  </Button>
                  <Button variant="outlined" onClick={handleTestConnection} disabled={saving}>
                    Testar Conexão
                  </Button>
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Sincronização
                </Typography>
                <Box display="flex" gap={2}>
                  <Button
                    variant="outlined"
                    onClick={handleSyncClassroom}
                    disabled={saving || !config.classroomEnabled}
                  >
                    Sincronizar Classroom
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={handleSyncDrive}
                    disabled={saving || !config.driveEnabled}
                  >
                    Sincronizar Drive
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={handleSyncCalendar}
                    disabled={saving || !config.calendarEnabled}
                  >
                    Sincronizar Calendar
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};
