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
} from '@mui/material';
import { LTIConfig as LTIConfigType } from '@/types/integrations';
import { ltiService } from '@/services/integrations/ltiService';

export const LTIConfig: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [config, setConfig] = useState<LTIConfigType | null>(null);

  const fetchConfig = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await ltiService.getConfig();
      setConfig(response.data);
    } catch (err) {
      setError('Erro ao carregar configuração LTI');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  const handleChange =
    (field: keyof LTIConfigType) => (event: React.ChangeEvent<HTMLInputElement>) => {
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
      await ltiService.updateConfig(config);
      setSuccess('Configuração LTI atualizada com sucesso');
    } catch (err) {
      setError('Erro ao salvar configuração LTI');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleTestConnection = async () => {
    try {
      setError(null);
      setSuccess(null);
      const response = await ltiService.testConnection();
      if (response.data.success) {
        setSuccess('Conexão LTI testada com sucesso');
      } else {
        setError('Falha ao testar conexão LTI');
      }
    } catch (err) {
      setError('Erro ao testar conexão LTI');
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
        <Alert severity="error">Não foi possível carregar a configuração LTI</Alert>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Configuração LTI
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
                <TextField
                  fullWidth
                  label="URL de Lançamento"
                  value={config.launchUrl}
                  onChange={handleChange('launchUrl')}
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="URL da Plataforma"
                  value={config.platformUrl}
                  onChange={handleChange('platformUrl')}
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
            </Grid>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};
