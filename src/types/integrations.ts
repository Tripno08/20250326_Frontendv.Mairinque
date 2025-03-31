import { z } from 'zod';

// Tipos comuns
export const IntegrationStatus = z.enum(['active', 'inactive', 'error', 'pending']);
export type IntegrationStatus = z.infer<typeof IntegrationStatus>;

export const IntegrationType = z.enum(['lti', 'microsoft', 'google', 'webhook']);
export type IntegrationType = z.infer<typeof IntegrationType>;

// LTI
export const LTIConfig = z.object({
  clientId: z.string(),
  clientSecret: z.string(),
  launchUrl: z.string().url(),
  platformUrl: z.string().url(),
  status: IntegrationStatus,
  scopes: z.array(z.string()),
  customParameters: z.record(z.string()).optional(),
});

export type LTIConfig = z.infer<typeof LTIConfig>;

// Microsoft Education
export const MicrosoftConfig = z.object({
  clientId: z.string(),
  clientSecret: z.string(),
  tenantId: z.string(),
  status: IntegrationStatus,
  scopes: z.array(z.string()),
  graphApiVersion: z.string(),
  teamsEnabled: z.boolean(),
  sharepointEnabled: z.boolean(),
});

export type MicrosoftConfig = z.infer<typeof MicrosoftConfig>;

// Google Classroom
export const GoogleConfig = z.object({
  clientId: z.string(),
  clientSecret: z.string(),
  status: IntegrationStatus,
  scopes: z.array(z.string()),
  classroomEnabled: z.boolean(),
  driveEnabled: z.boolean(),
  calendarEnabled: z.boolean(),
});

export type GoogleConfig = z.infer<typeof GoogleConfig>;

// Webhooks
export const WebhookConfig = z.object({
  id: z.string(),
  url: z.string().url(),
  secret: z.string(),
  status: IntegrationStatus,
  events: z.array(z.string()),
  retryCount: z.number(),
  timeout: z.number(),
  headers: z.record(z.string()).optional(),
});

export type WebhookConfig = z.infer<typeof WebhookConfig>;

// Respostas da API
export interface IntegrationResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

// Eventos de integração
export const IntegrationEvent = z.object({
  id: z.string(),
  type: z.string(),
  timestamp: z.string(),
  status: z.enum(['success', 'error', 'pending']),
  details: z.record(z.unknown()),
});

export type IntegrationEvent = z.infer<typeof IntegrationEvent>;

// Métricas de integração
export const IntegrationMetrics = z.object({
  totalEvents: z.number(),
  successRate: z.number(),
  averageLatency: z.number(),
  lastSync: z.string(),
  errorCount: z.number(),
  activeConnections: z.number(),
});

export type IntegrationMetrics = z.infer<typeof IntegrationMetrics>;
