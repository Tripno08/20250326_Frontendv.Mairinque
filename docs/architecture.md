# Arquitetura do Projeto Innerview

## Visão Geral da Arquitetura

O Innerview é uma plataforma educacional avançada com arquitetura moderna baseada em microserviços e design modular. A plataforma é projetada para suportar o framework RTI/MTSS (Response to Intervention/Multi-Tiered System of Supports) em instituições educacionais.

## Diagrama de Arquitetura

```
┌───────────────────┐     ┌───────────────────┐     ┌───────────────────┐
│                   │     │                   │     │                   │
│  Frontend         │     │  Backend API      │     │  Serviços         │
│  (Next.js)        │◄────┤  (NestJS)         │◄────┤  Especializados   │
│                   │     │                   │     │                   │
└───────────────────┘     └───────────────────┘     └───────────────────┘
         │                         │                         │
         │                         │                         │
         ▼                         ▼                         ▼
┌───────────────────┐     ┌───────────────────┐     ┌───────────────────┐
│                   │     │                   │     │                   │
│  Cache            │     │  Banco de Dados   │     │  Serviços         │
│  (Redis)          │     │  (MySQL)          │     │  Externos         │
│                   │     │                   │     │                   │
└───────────────────┘     └───────────────────┘     └───────────────────┘
```

## Componentes Principais

### 1. Frontend (Next.js)

- **Tecnologia**: Next.js 15.x, TypeScript, Material UI 7.x
- **Responsabilidades**:
  - Interface de usuário responsiva e acessível
  - Visualizações de dados educacionais avançadas
  - Interfaces drag-and-drop para planejamento de intervenções
  - Dashboards customizáveis
  - Experiência offline através de PWA
- **Organização**: Baseada em módulos funcionais (autenticação, dashboards, RTI/MTSS, avaliações, etc.)

### 2. Backend API (NestJS)

- **Tecnologia**: NestJS 10.x, TypeScript, Prisma ORM
- **Responsabilidades**:
  - Endpoints RESTful para todas as operações
  - Autenticação e autorização de usuários
  - Lógica de negócios para o framework RTI/MTSS
  - Validação e processamento de dados
  - Cache de dados frequentemente acessados
- **Organização**: Baseada em módulos de domínio (usuários, estudantes, intervenções, etc.)

### 3. Banco de Dados (MySQL)

- **Tecnologia**: MySQL 8.x
- **Gerenciamento**: Prisma ORM para definição de schema e migrações
- **Estrutura**: Modelagem relacional otimizada para o domínio educacional
- **Performance**: Índices estrategicamente definidos para consultas comuns

### 4. Cache (Redis)

- **Tecnologia**: Redis
- **Usos**:
  - Cache de consultas frequentes
  - Gerenciamento de sessões
  - Filas de tarefas assíncronas
  - Armazenamento temporário para operações offline

### 5. Serviços Especializados

- **Análise Preditiva**: Serviço para identificação precoce de riscos acadêmicos
- **Recomendações**: Motor de recomendação para intervenções educacionais
- **Relatórios**: Geração de relatórios educacionais complexos
- **Integrações**: Serviços para conexão com sistemas externos (LMS, SIS)

## Fluxo de Dados

### 1. Fluxo Principal

1. O usuário interage com a interface frontend
2. O frontend faz requisições à API backend via endpoints RESTful
3. A API consulta o banco de dados e/ou cache conforme necessário
4. A API processa os dados e retorna respostas padronizadas
5. O frontend renderiza os dados em visualizações apropriadas

### 2. Fluxo de Autenticação

1. O usuário fornece credenciais no frontend
2. Credenciais são enviadas para API de autenticação
3. API valida credenciais e gera token JWT
4. Token é armazenado no cliente e usado para requisições subsequentes
5. Middleware de autenticação valida token em cada requisição protegida

### 3. Fluxo de Trabalho Offline

1. Dados críticos são armazenados localmente no navegador
2. Operações realizadas offline são registradas em uma fila local
3. Ao recuperar conexão, operações são sincronizadas com o backend
4. Conflitos são resolvidos através de estratégias definidas

## Considerações de Segurança

1. **Autenticação**: Sistema de múltiplos fatores para perfis administrativos
2. **Autorização**: RBAC (Role-Based Access Control) granular com permissões contextuais
3. **Proteção de Dados**: Criptografia de dados sensíveis em repouso e em trânsito
4. **Auditoria**: Logs detalhados de ações críticas e acessos a dados sensíveis
5. **Conformidade**: Aderência à LGPD e outras regulamentações relevantes para dados educacionais

## Escalabilidade

1. **Horizontal**: Capacidade de adicionar mais instâncias de serviços conforme demanda
2. **Vertical**: Otimização de recursos para aproveitar hardware mais potente
3. **Dados**: Estratégias de particionamento para crescimento de dados
4. **Picos de Uso**: Arquitetura dimensionada para períodos críticos do calendário escolar

## Monitoramento e Operações

1. **Métricas**: Coleta de métricas de performance e uso através de Prometheus
2. **Visualização**: Dashboards Grafana para monitoramento em tempo real
3. **Alertas**: Sistema de alertas para condições anômalas
4. **Logs**: Centralização de logs para diagnóstico e auditoria

## Integração com Sistemas Externos

1. **LMS**: Integração com sistemas de gestão de aprendizagem via LTI 1.3
2. **SIS**: Conexão com sistemas de informação estudantil
3. **Microsoft Education**: Integração com ecossistema Microsoft (Teams, Graph API)
4. **Google Classroom**: Integração com ambiente Google Workspace for Education

## Ambientes

1. **Desenvolvimento**: Ambiente local com mocks e dados sintéticos
2. **Staging**: Ambiente de pré-produção para testes integrados
3. **Produção**: Ambiente de produção com alta disponibilidade
4. **CI/CD**: Pipeline automatizado para builds, testes e deploy

# Arquitetura do Sistema

## Visão Geral

O sistema de encaminhamentos é construído seguindo uma arquitetura moderna e escalável, utilizando as melhores práticas de desenvolvimento React e TypeScript.

## Estrutura de Diretórios

```
src/
  ├── components/
  │   ├── referrals/
  │   │   ├── ReferralBuilder/
  │   │   ├── ReferralList/
  │   │   ├── ReferralDetails/
  │   │   ├── ReferralDashboard/
  │   │   └── ReferralTimeline/
  │   └── common/
  ├── hooks/
  │   ├── useReferral/
  │   ├── useReferralList/
  │   └── useReferralMetrics/
  ├── services/
  │   ├── referralService/
  │   ├── notificationService/
  │   └── storageService/
  ├── contexts/
  │   └── ReferralContext/
  ├── types/
  │   └── referral.ts
  ├── utils/
  │   ├── date.ts
  │   ├── format.ts
  │   └── validation.ts
  └── api/
      └── endpoints.ts
```

## Componentes Principais

### ReferralBuilder
- Responsável pela criação de novos encaminhamentos
- Formulário com validação
- Upload de anexos
- Sistema de tags

### ReferralList
- Lista de encaminhamentos
- Filtros e ordenação
- Paginação
- Ações rápidas

### ReferralDetails
- Visualização detalhada
- Sistema de comentários
- Timeline de alterações
- Gestão de anexos

### ReferralDashboard
- Métricas e estatísticas
- Gráficos de distribuição
- Lista de recentes
- Filtros temporais

### ReferralTimeline
- Histórico de alterações
- Detalhes de mudanças
- Informações de autor
- Formatação de datas

## Hooks Personalizados

### useReferral
```typescript
function useReferral(id: string) {
  // Gerenciamento de estado do encaminhamento
  // Operações CRUD
  // Cache
  // Notificações
}
```

### useReferralList
```typescript
function useReferralList(filters: FilterParams) {
  // Listagem com filtros
  // Paginação
  // Ordenação
  // Cache
}
```

### useReferralMetrics
```typescript
function useReferralMetrics(period: DateRange) {
  // Métricas do período
  // Distribuições
  // Cache
  // Atualização automática
}
```

## Contextos

### ReferralContext
```typescript
interface ReferralContextType {
  referrals: Referral[];
  metrics: ReferralMetrics;
  dispatch: React.Dispatch<ReferralEvent>;
  loading: boolean;
  error: Error | null;
}
```

## Serviços

### ReferralService
- Operações CRUD
- Gestão de anexos
- Sistema de comentários
- Métricas

### NotificationService
- Envio de notificações
- Gestão de estado
- Priorização
- Delivery

### StorageService
- Upload de arquivos
- Gestão de URLs
- Cache
- Limpeza automática

## Fluxo de Dados

1. **Criação de Encaminhamento**
   ```
   Usuário -> ReferralBuilder -> ReferralService -> API -> Cache -> Notificação
   ```

2. **Listagem de Encaminhamentos**
   ```
   Usuário -> useReferralList -> Cache -> API -> ReferralList
   ```

3. **Atualização de Status**
   ```
   Usuário -> ReferralDetails -> ReferralService -> API -> Cache -> Notificação
   ```

4. **Dashboard**
   ```
   Usuário -> useReferralMetrics -> Cache -> API -> ReferralDashboard
   ```

## Cache

### Estratégia
- Cache em memória
- Invalidação automática
- TTL configurável
- Limpeza periódica

### Implementação
```typescript
class CacheService {
  private cache: Map<string, CacheItem>;

  async get<T>(key: string): Promise<T | null>;
  async set<T>(key: string, value: T, ttl?: number): Promise<void>;
  async invalidate(key: string): Promise<void>;
  async clear(): Promise<void>;
}
```

## Tratamento de Erros

### Estratégia
- Erros tipados
- Mensagens amigáveis
- Logging
- Retry automático

### Implementação
```typescript
class ApiError extends Error {
  constructor(
    public code: ApiErrorCode,
    message: string,
    public details?: unknown
  ) {
    super(message);
  }
}
```

## Performance

### Otimizações
- Lazy loading
- Virtualização
- Debounce/Throttle
- Memoização

### Monitoramento
- Métricas de renderização
- Tempo de resposta
- Uso de memória
- Bundle size

## Segurança

### Autenticação
- JWT
- Refresh token
- Expiração
- Revogação

### Autorização
- Roles
- Permissões
- Validação
- Sanitização

## Testes

### Estratégia
- Testes unitários
- Testes de integração
- Testes E2E
- Snapshots

### Implementação
```typescript
describe('ReferralBuilder', () => {
  it('renderiza o formulário');
  it('valida campos');
  it('envia dados');
  it('trata erros');
});
```

## CI/CD

### Pipeline
1. Lint
2. Testes
3. Build
4. Deploy

### Ambientes
- Desenvolvimento
- Staging
- Produção

## Monitoramento

### Métricas
- Tempo de resposta
- Taxa de erro
- Uso de recursos
- Performance

### Logs
- Erros
- Ações
- Performance
- Segurança

## Escalabilidade

### Horizontal
- Load balancing
- Sharding
- Replicação
- Cache distribuído

### Vertical
- Otimização de queries
- Indexação
- Cache
- Pool de conexões

## Manutenção

### Documentação
- Código
- API
- Componentes
- Testes

### Versionamento
- Semântico
- Changelog
- Breaking changes
- Depreciação
