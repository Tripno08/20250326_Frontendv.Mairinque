import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  CircularProgress,
  Alert,
  Button,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  Error as ErrorIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { WebhookConfig } from '@/types/integrations';
import { IntegrationStatus, IntegrationStatusType } from '@/types/dashboard';
import { ltiService } from '@/services/integrations/ltiService';
import { microsoftService } from '@/services/integrations/microsoftService';
import { googleService } from '@/services/integrations/googleService';
import { webhookService } from '@/services/integrations/webhookService';

const determineStatus = (successRate: number): IntegrationStatusType => {
  return successRate > 95 ? 'active' : 'error';
};

export const IntegrationDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [integrations, setIntegrations] = useState<IntegrationStatus[]>([]);

  const fetchIntegrationData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [ltiMetrics, microsoftMetrics, googleMetrics, webhooks] = await Promise.all([
        ltiService.getMetrics(),
        microsoftService.getMetrics(),
        googleService.getMetrics(),
        webhookService.getWebhooks(),
      ]);

      const webhookMetrics = await Promise.all(
        webhooks.data.map((webhook: WebhookConfig) => webhookService.getMetrics(webhook.id))
      );

      const integrationsData: IntegrationStatus[] = [
        {
          type: 'lti',
          status: determineStatus(ltiMetrics.data.successRate),
          metrics: ltiMetrics.data,
        },
        {
          type: 'microsoft',
          status: determineStatus(microsoftMetrics.data.successRate),
          metrics: microsoftMetrics.data,
        },
        {
          type: 'google',
          status: determineStatus(googleMetrics.data.successRate),
          metrics: googleMetrics.data,
        },
        ...webhooks.data.map((webhook: WebhookConfig, index: number) => ({
          type: 'webhook' as const,
          status: determineStatus(webhookMetrics[index].data.successRate),
          metrics: webhookMetrics[index].data,
        })),
      ];

      setIntegrations(integrationsData);
    } catch (err) {
      setError('Erro ao carregar dados das integrações');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIntegrationData();
  }, []);

  const getStatusIcon = (status: IntegrationStatusType) => {
    switch (status) {
      case 'active':
        return <CheckCircleIcon color="success" />;
      case 'error':
        return <ErrorIcon color="error" />;
      case 'pending':
        return <WarningIcon color="warning" />;
      default:
        return <WarningIcon color="disabled" />;
    }
  };

  const getStatusText = (status: IntegrationStatusType) => {
    switch (status) {
      case 'active':
        return 'Ativo';
      case 'error':
        return 'Erro';
      case 'pending':
        return 'Pendente';
      default:
        return 'Inativo';
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert
          severity="error"
          action={<Button onClick={fetchIntegrationData}>Tentar Novamente</Button>}
        >
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Dashboard de Integrações</Typography>
        <Tooltip title="Atualizar Dados">
          <IconButton onClick={fetchIntegrationData}>
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Box>

      <Grid container spacing={3}>
        {integrations.map(integration => (
          <Grid item xs={12} sm={6} md={4} key={integration.type}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  {getStatusIcon(integration.status)}
                  <Typography variant="h6" ml={1}>
                    {integration.type.charAt(0).toUpperCase() + integration.type.slice(1)}
                  </Typography>
                </Box>

                <Typography color="textSecondary" gutterBottom>
                  Status: {getStatusText(integration.status)}
                </Typography>

                <Typography variant="body2" color="textSecondary">
                  Taxa de Sucesso: {integration.metrics.successRate.toFixed(2)}%
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Total de Eventos: {integration.metrics.totalEvents}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Erros: {integration.metrics.errorCount}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Última Sincronização: {new Date(integration.metrics.lastSync).toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
