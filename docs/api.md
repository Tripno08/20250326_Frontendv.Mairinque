# Documentação da API

## Visão Geral
Esta documentação descreve os endpoints da API do Innerview, incluindo parâmetros, respostas e exemplos de uso.

## Autenticação
A API utiliza autenticação via JWT (JSON Web Token). O token deve ser incluído no header `Authorization` das requisições:

```
Authorization: Bearer <token>
```

## Endpoints

### Dashboard

#### GET /api/dashboard
Retorna os dados do dashboard, incluindo distribuição por tier, resumo por domínio e cobertura de avaliações.

**Resposta**
```json
{
  "tierDistribution": {
    "tier1": 60,
    "tier2": 30,
    "tier3": 10
  },
  "domainSummary": {
    "reading": 75,
    "math": 80,
    "writing": 70
  },
  "assessmentCoverage": {
    "total": 150,
    "assessed": 120
  }
}
```

**Códigos de Status**
- 200: Sucesso
- 401: Não autorizado
- 500: Erro interno do servidor

### Avaliações

#### GET /api/assessments
Retorna a lista de avaliações com paginação.

**Parâmetros de Query**
- `page`: Número da página (padrão: 1)
- `limit`: Itens por página (padrão: 10)
- `search`: Termo de busca
- `status`: Status da avaliação (pending, completed, cancelled)

**Resposta**
```json
{
  "data": [
    {
      "id": "string",
      "studentId": "string",
      "type": "string",
      "status": "string",
      "score": number,
      "date": "string",
      "notes": "string"
    }
  ],
  "pagination": {
    "total": number,
    "page": number,
    "limit": number,
    "totalPages": number
  }
}
```

#### POST /api/assessments
Cria uma nova avaliação.

**Request Body**
```json
{
  "studentId": "string",
  "type": "string",
  "score": number,
  "date": "string",
  "notes": "string"
}
```

**Resposta**
```json
{
  "id": "string",
  "studentId": "string",
  "type": "string",
  "status": "pending",
  "score": number,
  "date": "string",
  "notes": "string"
}
```

### Estudantes

#### GET /api/students
Retorna a lista de estudantes com paginação.

**Parâmetros de Query**
- `page`: Número da página (padrão: 1)
- `limit`: Itens por página (padrão: 10)
- `search`: Termo de busca
- `tier`: Tier do estudante (1, 2, 3)

**Resposta**
```json
{
  "data": [
    {
      "id": "string",
      "name": "string",
      "grade": "string",
      "tier": number,
      "status": "string",
      "lastAssessment": "string"
    }
  ],
  "pagination": {
    "total": number,
    "page": number,
    "limit": number,
    "totalPages": number
  }
}
```

#### POST /api/students
Cria um novo estudante.

**Request Body**
```json
{
  "name": "string",
  "grade": "string",
  "tier": number,
  "status": "string"
}
```

**Resposta**
```json
{
  "id": "string",
  "name": "string",
  "grade": "string",
  "tier": number,
  "status": "string",
  "lastAssessment": null
}
```

### Encaminhamentos

#### Listar Encaminhamentos
```typescript
GET /api/referrals

// Query Parameters
interface QueryParams {
  page?: number;
  limit?: number;
  status?: ReferralStatus;
  priority?: ReferralPriority;
  type?: ReferralType;
  assignedTo?: string;
  createdBy?: string;
  startDate?: string;
  endDate?: string;
  tags?: string[];
}

// Response
interface ApiResponse<{
  data: Referral[];
  total: number;
  page: number;
  limit: number;
}>
```

#### Obter Encaminhamento
```typescript
GET /api/referrals/:id

// Response
interface ApiResponse<Referral>
```

#### Criar Encaminhamento
```typescript
POST /api/referrals

// Request Body
interface CreateReferralRequest {
  title: string;
  description: string;
  type: ReferralType;
  priority: ReferralPriority;
  assignedTo: string;
  dueDate: string;
  tags?: string[];
}

// Response
interface ApiResponse<Referral>
```

#### Atualizar Encaminhamento
```typescript
PUT /api/referrals/:id

// Request Body
interface UpdateReferralRequest {
  title?: string;
  description?: string;
  type?: ReferralType;
  priority?: ReferralPriority;
  assignedTo?: string;
  dueDate?: string;
  status?: ReferralStatus;
  tags?: string[];
}

// Response
interface ApiResponse<Referral>
```

#### Excluir Encaminhamento
```typescript
DELETE /api/referrals/:id

// Response
interface ApiResponse<{ success: boolean }>
```

### Comentários

#### Listar Comentários
```typescript
GET /api/referrals/:id/comments

// Response
interface ApiResponse<Comment[]>
```

#### Adicionar Comentário
```typescript
POST /api/referrals/:id/comments

// Request Body
interface CreateCommentRequest {
  content: string;
  author: string;
}

// Response
interface ApiResponse<Comment>
```

### Anexos

#### Listar Anexos
```typescript
GET /api/referrals/:id/attachments

// Response
interface ApiResponse<Attachment[]>
```

#### Fazer Upload de Anexo
```typescript
POST /api/referrals/:id/attachments

// Request Body (multipart/form-data)
interface UploadAttachmentRequest {
  file: File;
}

// Response
interface ApiResponse<Attachment>
```

#### Excluir Anexo
```typescript
DELETE /api/referrals/:id/attachments/:attachmentId

// Response
interface ApiResponse<{ success: boolean }>
```

### Métricas

#### Obter Métricas
```typescript
GET /api/referrals/metrics

// Query Parameters
interface MetricsQueryParams {
  startDate?: string;
  endDate?: string;
}

// Response
interface ApiResponse<ReferralMetrics>
```

## Serviços

### ReferralService

```typescript
class ReferralService {
  // Listar encaminhamentos
  async listReferrals(params: QueryParams): Promise<ApiResponse<Referral[]>>;

  // Obter encaminhamento
  async getReferral(id: string): Promise<ApiResponse<Referral>>;

  // Criar encaminhamento
  async createReferral(data: CreateReferralRequest): Promise<ApiResponse<Referral>>;

  // Atualizar encaminhamento
  async updateReferral(id: string, data: UpdateReferralRequest): Promise<ApiResponse<Referral>>;

  // Excluir encaminhamento
  async deleteReferral(id: string): Promise<ApiResponse<{ success: boolean }>>;

  // Listar comentários
  async listComments(referralId: string): Promise<ApiResponse<Comment[]>>;

  // Adicionar comentário
  async addComment(referralId: string, data: CreateCommentRequest): Promise<ApiResponse<Comment>>;

  // Listar anexos
  async listAttachments(referralId: string): Promise<ApiResponse<Attachment[]>>;

  // Fazer upload de anexo
  async uploadAttachment(referralId: string, file: File): Promise<ApiResponse<Attachment>>;

  // Excluir anexo
  async deleteAttachment(referralId: string, attachmentId: string): Promise<ApiResponse<{ success: boolean }>>;

  // Obter métricas
  async getMetrics(params: MetricsQueryParams): Promise<ApiResponse<ReferralMetrics>>;
}
```

### NotificationService

```typescript
class NotificationService {
  // Enviar notificação
  async sendNotification(userId: string, notification: Notification): Promise<void>;

  // Marcar como lida
  async markAsRead(notificationId: string): Promise<void>;

  // Listar notificações
  async listNotifications(userId: string): Promise<Notification[]>;
}
```

### StorageService

```typescript
class StorageService {
  // Fazer upload de arquivo
  async uploadFile(file: File): Promise<string>;

  // Obter URL do arquivo
  async getFileUrl(fileId: string): Promise<string>;

  // Excluir arquivo
  async deleteFile(fileId: string): Promise<void>;
}
```

## Tratamento de Erros

### Códigos de Erro

```typescript
enum ApiErrorCode {
  // Erros de Autenticação
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',

  // Erros de Validação
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  INVALID_DATA = 'INVALID_DATA',

  // Erros de Recurso
  NOT_FOUND = 'NOT_FOUND',
  ALREADY_EXISTS = 'ALREADY_EXISTS',
  CONFLICT = 'CONFLICT',

  // Erros de Servidor
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
}
```

### Exemplo de Tratamento

```typescript
try {
  const response = await referralService.createReferral(data);
  // Tratar sucesso
} catch (error) {
  if (error instanceof ApiError) {
    switch (error.code) {
      case ApiErrorCode.VALIDATION_ERROR:
        // Tratar erro de validação
        break;
      case ApiErrorCode.UNAUTHORIZED:
        // Tratar erro de autenticação
        break;
      default:
        // Tratar outros erros
    }
  }
  // Tratar erro genérico
}
```

## Interceptors

### Request Interceptor

```typescript
axios.interceptors.request.use(
  (config) => {
    // Adicionar token
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
```

### Response Interceptor

```typescript
axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Tratar erro de autenticação
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

## Cache

### Estratégia de Cache

```typescript
class CacheService {
  // Obter do cache
  async get<T>(key: string): Promise<T | null>;

  // Salvar no cache
  async set<T>(key: string, value: T, ttl?: number): Promise<void>;

  // Invalidar cache
  async invalidate(key: string): Promise<void>;

  // Limpar cache
  async clear(): Promise<void>;
}
```

### Exemplo de Uso

```typescript
class ReferralService {
  async getReferral(id: string): Promise<ApiResponse<Referral>> {
    const cacheKey = `referral:${id}`;
    const cached = await cacheService.get<ApiResponse<Referral>>(cacheKey);

    if (cached) {
      return cached;
    }

    const response = await api.get(`/api/referrals/${id}`);
    await cacheService.set(cacheKey, response.data, 5 * 60 * 1000); // 5 minutos

    return response.data;
  }
}
```

## Rate Limiting
A API implementa rate limiting para prevenir abusos:
- 100 requisições por minuto por IP
- 1000 requisições por hora por usuário

## Versionamento
A API é versionada através da URL:
- Versão atual: `/api/v1`
- Versões anteriores: `/api/v0`

## CORS
A API permite requisições CORS dos seguintes domínios:
- `http://localhost:3000`
- `https://innerview.example.com`

## Webhooks
A API suporta webhooks para notificações de eventos importantes:

### Eventos Disponíveis
- `assessment.created`
- `assessment.updated`
- `assessment.completed`
- `student.tier_changed`

### Formato do Payload
```json
{
  "event": "string",
  "timestamp": "string",
  "data": object
}
```

## Exemplos de Uso

### Usando o Cliente HTTP
```typescript
import { http } from '@/lib/http'

// Buscar dados do dashboard
const getDashboardData = async () => {
  try {
    const response = await http.get('/api/dashboard')
    return response.data
  } catch (error) {
    console.error('Erro ao buscar dados:', error)
    throw error
  }
}

// Criar nova avaliação
const createAssessment = async (data: AssessmentData) => {
  try {
    const response = await http.post('/api/assessments', data)
    return response.data
  } catch (error) {
    console.error('Erro ao criar avaliação:', error)
    throw error
  }
}
```

### Usando React Query
```typescript
import { useQuery, useMutation } from '@tanstack/react-query'

// Hook para buscar dados do dashboard
const useDashboard = () => {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: () => http.get('/api/dashboard').then(res => res.data),
    staleTime: 5 * 60 * 1000, // 5 minutos
    cacheTime: 30 * 60 * 1000, // 30 minutos
  })
}

// Hook para criar avaliação
const useCreateAssessment = () => {
  return useMutation({
    mutationFn: (data: AssessmentData) =>
      http.post('/api/assessments', data).then(res => res.data),
    onSuccess: () => {
      // Invalida a query do dashboard para atualizar os dados
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}
```
