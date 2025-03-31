import { setupServer } from 'msw/node';
import { http } from 'msw';

const handlers = [
  // LTI
  http.get('/api/integrations/lti/config', () => {
    return new Response(
      JSON.stringify({
        clientId: 'test_client_id',
        clientSecret: 'test_client_secret',
        launchUrl: 'https://test.launch.url',
        platformUrl: 'https://test.platform.url',
        isActive: true,
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }),

  http.post('/api/integrations/lti/config', () => {
    return new Response(JSON.stringify({ message: 'Configuração atualizada com sucesso' }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }),

  // Microsoft
  http.get('/api/integrations/microsoft/config', () => {
    return new Response(
      JSON.stringify({
        clientId: 'test_client_id',
        clientSecret: 'test_client_secret',
        tenantId: 'test_tenant_id',
        graphApiVersion: 'v1.0',
        isActive: true,
        teamsEnabled: true,
        sharePointEnabled: true,
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }),

  http.post('/api/integrations/microsoft/config', () => {
    return new Response(JSON.stringify({ message: 'Configuração atualizada com sucesso' }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }),

  // Google
  http.get('/api/integrations/google/config', () => {
    return new Response(
      JSON.stringify({
        clientId: 'test_client_id',
        clientSecret: 'test_client_secret',
        isActive: true,
        classroomEnabled: true,
        driveEnabled: true,
        calendarEnabled: true,
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }),

  http.post('/api/integrations/google/config', () => {
    return new Response(JSON.stringify({ message: 'Configuração atualizada com sucesso' }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }),

  // Webhooks
  http.get('/api/integrations/webhooks', () => {
    return new Response(
      JSON.stringify([
        {
          id: '1',
          url: 'https://test.webhook.url',
          secret: 'test_secret',
          timeout: 5000,
          retryCount: 3,
          isActive: true,
          successRate: 98,
          lastEvent: {
            id: '1',
            type: 'test_event',
            status: 'success',
            timestamp: new Date().toISOString(),
          },
        },
      ]),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }),

  http.post('/api/integrations/webhooks', () => {
    return new Response(JSON.stringify({ message: 'Webhook criado com sucesso' }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }),

  http.put('/api/integrations/webhooks/:id', ({ params }) => {
    return new Response(JSON.stringify({ message: 'Webhook atualizado com sucesso' }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }),

  http.delete('/api/integrations/webhooks/:id', ({ params }) => {
    return new Response(JSON.stringify({ message: 'Webhook removido com sucesso' }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }),

  // Dashboard
  http.get('/api/integrations/dashboard', () => {
    return new Response(
      JSON.stringify({
        totalIntegrations: 4,
        activeIntegrations: 3,
        errorIntegrations: 1,
        averageSuccessRate: 97.5,
        totalEvents: 1000,
        totalErrors: 25,
        lastUpdate: new Date().toISOString(),
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }),
];

export const server = setupServer(...handlers);
