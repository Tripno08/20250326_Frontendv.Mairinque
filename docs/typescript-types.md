# TypeScript Types do Projeto Innerview

Este documento lista os principais tipos TypeScript usados no projeto Innerview, gerados a partir do schema Prisma.

## Tipos Principais

### Usuário

```typescript
// types/user.ts
export interface User {
  id: string;
  email: string;
  nome: string;
  cargo: 'ADMIN' | 'PROFESSOR' | 'ESPECIALISTA' | 'COORDENADOR' | 'DIRETOR' | 'ADMINISTRADOR' | 'SECRETARIA' | 'RESPONSAVEL' | 'PSICOLOGO' | 'ORIENTADOR' | 'OUTRO' | 'DPO';
  criadoEm: string;
  atualizadoEm: string;
  avatar: string | null;
  // Referências a outras entidades são omitidas aqui para brevidade
}

export interface UserCreateInput {
  email: string;
  senha: string;
  nome: string;
  cargo?: 'ADMIN' | 'PROFESSOR' | 'ESPECIALISTA' | 'COORDENADOR' | 'DIRETOR' | 'ADMINISTRADOR' | 'SECRETARIA' | 'RESPONSAVEL' | 'PSICOLOGO' | 'ORIENTADOR' | 'OUTRO' | 'DPO';
  avatar?: string;
}

export interface UserUpdateInput {
  email?: string;
  nome?: string;
  cargo?: 'ADMIN' | 'PROFESSOR' | 'ESPECIALISTA' | 'COORDENADOR' | 'DIRETOR' | 'ADMINISTRADOR' | 'SECRETARIA' | 'RESPONSAVEL' | 'PSICOLOGO' | 'ORIENTADOR' | 'OUTRO' | 'DPO';
  avatar?: string | null;
}
```

### Estudante

```typescript
// types/student.ts
export interface Student {
  id: string;
  nome: string;
  serie: string;
  dataNascimento: string;
  criadoEm: string;
  atualizadoEm: string;
  usuarioId: string;
  instituicaoId: string | null;
  // Referências a outras entidades são omitidas aqui para brevidade
}

export interface StudentCreateInput {
  nome: string;
  serie: string;
  dataNascimento: string;
  usuarioId: string;
  instituicaoId?: string;
}

export interface StudentUpdateInput {
  nome?: string;
  serie?: string;
  dataNascimento?: string;
  instituicaoId?: string | null;
}
```

### Avaliação

```typescript
// types/assessment.ts
export interface Assessment {
  id: string;
  data: string;
  tipo: string;
  pontuacao: number;
  observacoes: string | null;
  metadados: Record<string, any> | null;
  criadoEm: string;
  atualizadoEm: string;
  estudanteId: string;
}

export interface AssessmentCreateInput {
  data: string;
  tipo: string;
  pontuacao: number;
  observacoes?: string;
  metadados?: Record<string, any>;
  estudanteId: string;
}

export interface AssessmentUpdateInput {
  data?: string;
  tipo?: string;
  pontuacao?: number;
  observacoes?: string | null;
  metadados?: Record<string, any> | null;
}
```

### Intervenção

```typescript
// types/intervention.ts
export interface Intervention {
  id: string;
  dataInicio: string;
  dataFim: string | null;
  tipo: string;
  descricao: string;
  status: 'ATIVO' | 'CONCLUIDO' | 'CANCELADO' | 'AGENDADO';
  observacoes: string | null;
  criadoEm: string;
  atualizadoEm: string;
  estudanteId: string;
  intervencaoBaseId: string | null;
  // Referências a outras entidades são omitidas aqui para brevidade
}

export interface InterventionCreateInput {
  dataInicio: string;
  dataFim?: string;
  tipo: string;
  descricao: string;
  status?: 'ATIVO' | 'CONCLUIDO' | 'CANCELADO' | 'AGENDADO';
  observacoes?: string;
  estudanteId: string;
  intervencaoBaseId?: string;
}

export interface InterventionUpdateInput {
  dataInicio?: string;
  dataFim?: string | null;
  tipo?: string;
  descricao?: string;
  status?: 'ATIVO' | 'CONCLUIDO' | 'CANCELADO' | 'AGENDADO';
  observacoes?: string | null;
}
```

### Intervenção Base

```typescript
// types/intervention-base.ts
export interface InterventionBase {
  id: string;
  nome: string;
  descricao: string;
  objetivo: string;
  nivel: 'UNIVERSAL' | 'SELETIVO' | 'INTENSIVO';
  area: 'LEITURA' | 'ESCRITA' | 'MATEMATICA' | 'COMPORTAMENTO' | 'ATENCAO' | 'SOCIOEMOCIONAL' | 'LINGUAGEM' | 'OUTRO';
  tempoEstimado: number;
  frequencia: 'DIARIA' | 'SEMANAL' | 'QUINZENAL' | 'MENSAL' | 'PERSONALIZADA';
  materiaisNecessarios: string | null;
  evidenciaCientifica: string | null;
  fonteEvidencia: string | null;
  ativo: boolean;
  criadoEm: string;
  atualizadoEm: string;
}

export interface InterventionBaseCreateInput {
  nome: string;
  descricao: string;
  objetivo: string;
  nivel: 'UNIVERSAL' | 'SELETIVO' | 'INTENSIVO';
  area: 'LEITURA' | 'ESCRITA' | 'MATEMATICA' | 'COMPORTAMENTO' | 'ATENCAO' | 'SOCIOEMOCIONAL' | 'LINGUAGEM' | 'OUTRO';
  tempoEstimado: number;
  frequencia: 'DIARIA' | 'SEMANAL' | 'QUINZENAL' | 'MENSAL' | 'PERSONALIZADA';
  materiaisNecessarios?: string;
  evidenciaCientifica?: string;
  fonteEvidencia?: string;
  ativo?: boolean;
}

export interface InterventionBaseUpdateInput {
  nome?: string;
  descricao?: string;
  objetivo?: string;
  nivel?: 'UNIVERSAL' | 'SELETIVO' | 'INTENSIVO';
  area?: 'LEITURA' | 'ESCRITA' | 'MATEMATICA' | 'COMPORTAMENTO' | 'ATENCAO' | 'SOCIOEMOCIONAL' | 'LINGUAGEM' | 'OUTRO';
  tempoEstimado?: number;
  frequencia?: 'DIARIA' | 'SEMANAL' | 'QUINZENAL' | 'MENSAL' | 'PERSONALIZADA';
  materiaisNecessarios?: string | null;
  evidenciaCientifica?: string | null;
  fonteEvidencia?: string | null;
  ativo?: boolean;
}
```

### Meta

```typescript
// types/goal.ts
export interface Goal {
  id: string;
  titulo: string;
  descricao: string;
  tipo: 'ACADEMICA' | 'COMPORTAMENTAL' | 'SOCIAL' | 'EMOCIONAL';
  especifico: string;
  mensuravel: string;
  atingivel: string;
  relevante: string;
  temporal: string;
  dataInicio: string;
  dataFim: string;
  status: 'NAO_INICIADA' | 'EM_ANDAMENTO' | 'CONCLUIDA' | 'CANCELADA';
  observacoes: string | null;
  criadoEm: string;
  atualizadoEm: string;
  intervencaoId: string;
}

export interface GoalCreateInput {
  titulo: string;
  descricao: string;
  tipo: 'ACADEMICA' | 'COMPORTAMENTAL' | 'SOCIAL' | 'EMOCIONAL';
  especifico: string;
  mensuravel: string;
  atingivel: string;
  relevante: string;
  temporal: string;
  dataInicio: string;
  dataFim: string;
  status?: 'NAO_INICIADA' | 'EM_ANDAMENTO' | 'CONCLUIDA' | 'CANCELADA';
  observacoes?: string;
  intervencaoId: string;
}

export interface GoalUpdateInput {
  titulo?: string;
  descricao?: string;
  tipo?: 'ACADEMICA' | 'COMPORTAMENTAL' | 'SOCIAL' | 'EMOCIONAL';
  especifico?: string;
  mensuravel?: string;
  atingivel?: string;
  relevante?: string;
  temporal?: string;
  dataInicio?: string;
  dataFim?: string;
  status?: 'NAO_INICIADA' | 'EM_ANDAMENTO' | 'CONCLUIDA' | 'CANCELADA';
  observacoes?: string | null;
}
```

### Rastreio

```typescript
// types/screening.ts
export interface Screening {
  id: string;
  dataAplicacao: string;
  observacoes: string | null;
  status: 'PENDENTE' | 'EM_ANDAMENTO' | 'CONCLUIDO' | 'CANCELADO';
  criadoEm: string;
  atualizadoEm: string;
  estudanteId: string;
  aplicadorId: string;
  instrumentoId: string;
  // Referências a outras entidades são omitidas aqui para brevidade
}

export interface ScreeningCreateInput {
  dataAplicacao: string;
  observacoes?: string;
  status?: 'PENDENTE' | 'EM_ANDAMENTO' | 'CONCLUIDO' | 'CANCELADO';
  estudanteId: string;
  aplicadorId: string;
  instrumentoId: string;
}

export interface ScreeningUpdateInput {
  dataAplicacao?: string;
  observacoes?: string | null;
  status?: 'PENDENTE' | 'EM_ANDAMENTO' | 'CONCLUIDO' | 'CANCELADO';
  aplicadorId?: string;
}
```

### Instrumento de Rastreio

```typescript
// types/screening-instrument.ts
export interface ScreeningInstrument {
  id: string;
  nome: string;
  descricao: string;
  categoria: 'ACADEMICO' | 'COMPORTAMENTAL' | 'SOCIOEMOCIONAL' | 'COGNITIVO' | 'LINGUAGEM' | 'MOTOR' | 'ATENCAO' | 'OUTRO';
  faixaEtaria: string;
  tempoAplicacao: number;
  instrucoes: string;
  ativo: boolean;
  criadoEm: string;
  atualizadoEm: string;
  // Referências a outras entidades são omitidas aqui para brevidade
}

export interface ScreeningInstrumentCreateInput {
  nome: string;
  descricao: string;
  categoria: 'ACADEMICO' | 'COMPORTAMENTAL' | 'SOCIOEMOCIONAL' | 'COGNITIVO' | 'LINGUAGEM' | 'MOTOR' | 'ATENCAO' | 'OUTRO';
  faixaEtaria: string;
  tempoAplicacao: number;
  instrucoes: string;
  ativo?: boolean;
}

export interface ScreeningInstrumentUpdateInput {
  nome?: string;
  descricao?: string;
  categoria?: 'ACADEMICO' | 'COMPORTAMENTAL' | 'SOCIOEMOCIONAL' | 'COGNITIVO' | 'LINGUAGEM' | 'MOTOR' | 'ATENCAO' | 'OUTRO';
  faixaEtaria?: string;
  tempoAplicacao?: number;
  instrucoes?: string;
  ativo?: boolean;
}
```

### Equipe

```typescript
// types/team.ts
export interface Team {
  id: string;
  nome: string;
  descricao: string | null;
  ativo: boolean;
  criadoEm: string;
  atualizadoEm: string;
  // Referências a outras entidades são omitidas aqui para brevidade
}

export interface TeamCreateInput {
  nome: string;
  descricao?: string;
  ativo?: boolean;
}

export interface TeamUpdateInput {
  nome?: string;
  descricao?: string | null;
  ativo?: boolean;
}
```

### Instituição

```typescript
// types/institution.ts
export interface Institution {
  id: string;
  nome: string;
  tipo: string;
  endereco: string | null;
  configuracoes: string | null;
  ativo: boolean;
  criadoEm: string;
  atualizadoEm: string;
  // Referências a outras entidades são omitidas aqui para brevidade
}

export interface InstitutionCreateInput {
  nome: string;
  tipo: string;
  endereco?: string;
  configuracoes?: string;
  ativo?: boolean;
}

export interface InstitutionUpdateInput {
  nome?: string;
  tipo?: string;
  endereco?: string | null;
  configuracoes?: string | null;
  ativo?: boolean;
}
```

### Reunião

```typescript
// types/meeting.ts
export interface Meeting {
  id: string;
  titulo: string;
  data: string;
  local: string | null;
  status: 'PENDENTE' | 'AGENDADO' | 'EM_ANDAMENTO' | 'CONCLUIDO' | 'CANCELADO' | 'ADIADO';
  observacoes: string | null;
  resumo: string | null;
  pauta: string | null;
  criadoEm: string;
  atualizadoEm: string;
  equipeId: string;
  // Referências a outras entidades são omitidas aqui para brevidade
}

export interface MeetingCreateInput {
  titulo: string;
  data: string;
  local?: string;
  status?: 'PENDENTE' | 'AGENDADO' | 'EM_ANDAMENTO' | 'CONCLUIDO' | 'CANCELADO' | 'ADIADO';
  observacoes?: string;
  resumo?: string;
  pauta?: string;
  equipeId: string;
}

export interface MeetingUpdateInput {
  titulo?: string;
  data?: string;
  local?: string | null;
  status?: 'PENDENTE' | 'AGENDADO' | 'EM_ANDAMENTO' | 'CONCLUIDO' | 'CANCELADO' | 'ADIADO';
  observacoes?: string | null;
  resumo?: string | null;
  pauta?: string | null;
}
```

## Tipos de Resposta da API

```typescript
// types/api.ts
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta: {
    totalCount?: number;
    page?: number;
    perPage?: number;
  };
  error: ApiError | null;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
}

export interface PaginationParams {
  page?: number;
  perPage?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}
```

## Tipos de Componentes e UI

```typescript
// types/ui.ts
// types/ui.ts
export interface DashboardItem {
  id: string;
  title: string;
  component: React.ReactNode;
  config?: React.ReactNode;
}

export interface DashboardLayoutItem {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
  minW?: number;
  minH?: number;
  maxW?: number;
  maxH?: number;
}

export interface ChartDataPoint {
  name: string;
  value: number;
  [key: string]: any;
}

export interface ProgressDataPoint {
  date: string;
  score: number;
  goal?: number;
  nationalAvg?: number;
}

export interface PyramidDataPoint {
  level: string;
  students: number;
  description: string;
  color: string;
}

export interface InterventionPlanItem {
  id: string;
  title: string;
  description: string;
  duration: string;
  type: 'reading' | 'group' | 'assessment' | 'practice' | 'other';
  materials: string[];
}

export interface StudentFilter {
  search?: string;
  grade?: string;
  status?: string;
  tier?: string;
  instituteId?: string;
  dateRange?: [string, string];
}
```

## Tipos Específicos do RTI/MTSS

```typescript
// types/rti-mtss.ts
export interface TierDistribution {
  tier1Count: number;
  tier2Count: number;
  tier3Count: number;
  tier1Percent: number;
  tier2Percent: number;
  tier3Percent: number;
  total: number;
}

export interface InterventionEffectiveness {
  interventionId: string;
  interventionName: string;
  successCount: number;
  partialCount: number;
  failureCount: number;
  successRate: number;
}

export interface StudentRiskLevel {
  id: string;
  name: string;
  riskLevel: 'low' | 'moderate' | 'high' | 'very-high';
  riskScore: number;
  previousScore?: number;
  changeTrend: 'improving' | 'stable' | 'worsening';
}

export interface DomainProgress {
  domain: string;
  currentPeriodAvg: number;
  previousPeriodAvg: number;
  changePercent: number;
  studentCount: number;
}

export interface ScreeningCoverage {
  totalStudents: number;
  screenedStudents: number;
  pendingStudents: number;
  coveragePercent: number;
  screeningsByType: {
    [type: string]: {
      completed: number;
      pending: number;
    };
  };
}
```

## Guia para Uso dos Tipos

### Como utilizar os tipos no projeto

1. **Importação**:
   ```typescript
   import type { Student, StudentCreateInput } from '@/types/student';
   ```

2. **Uso em componentes**:
   ```typescript
   interface StudentListProps {
     students: Student[];
     onSelect: (student: Student) => void;
   }
   ```

3. **Uso com React Query**:
   ```typescript
   const { data, isLoading } = useQuery<Student[], Error>({
     queryKey: ['student', id],
     queryFn: () => fetchStudent(id),
   });
   ```

4. **Uso com formulários**:
   ```typescript
   const onSubmit = (data: StudentCreateInput) => {
     createStudent(data);
   };
   ```

### Convenções de tipagem

1. **Nomes de interfaces**:
   - Use PascalCase para nomes de interfaces
   - Sufixo "Input" para dados de criação
   - Sufixo "UpdateInput" para dados de atualização

2. **Tipos de resposta**:
   - Use o tipo genérico `ApiResponse<T>` para respostas da API
   - Exemplo: `ApiResponse<Student[]>` para lista de estudantes

3. **Tipagem estrita**:
   - Evite o uso de `any` sempre que possível
   - Use `Record<string, unknown>` em vez de `object`
   - Para objetos com chaves arbitrárias, use index signatures com tipos definidos: `[key: string]: string | number`

4. **Tipagem de funções**:
   - Sempre defina tipos de parâmetros e retorno para funções e métodos
   - Use tipos function explícitos para callbacks

5. **Enums vs Union Types**:
   - Prefira union types para valores fixos: `type Status = 'ATIVO' | 'INATIVO'`
   - Use enums apenas quando necessário para serialização/deserialização

### Geração de tipos a partir do Schema Prisma

Os tipos acima foram gerados a partir do schema Prisma. Para atualizar os tipos:

1. Execute o script de geração:
   ```bash
   npm run generate-types
   ```

2. Este script usa o schema Prisma para gerar tipos TypeScript correspondentes

3. Os tipos serão colocados em `src/types/`

4. Faça ajustes manuais conforme necessário para alinhar com as necessidades do frontend

## Utilitários de Tipos

Além dos tipos básicos gerados a partir do schema Prisma, o projeto também utiliza alguns utilitários de tipos para facilitar o desenvolvimento:

```typescript
// types/utils.ts

// Tipo para dados paginados
export type Paginated<T> = {
  items: T[];
  meta: {
    totalCount: number;
    page: number;
    perPage: number;
    totalPages: number;
  };
};

// Helper para remover propriedades de um tipo
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

// Helper para tornar propriedades opcionais
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

// Helper para deixar apenas algumas propriedades obrigatórias
export type RequiredOnly<T, K extends keyof T> = Partial<T> & Pick<T, K>;

// Tipo para respostas de sucesso e erro da API
export type ApiResult<T> =
  | { success: true; data: T; }
  | { success: false; error: ApiError; };

// Tipo para operações assíncronas
export type AsyncData<T> = {
  data: T | null;
  isLoading: boolean;
  error: ApiError | null;
  timestamp: number;
};
```

## Estratégias de Nomeação de Tipos

Para manter a consistência no projeto Innerview, as seguintes estratégias de nomeação são utilizadas:

1. **Entidades Principais**:
   - Nomes simples para entidades básicas: `Student`, `Intervention`, `Team`

2. **Entrada de Dados**:
   - Sufixo `CreateInput` para dados de criação: `StudentCreateInput`
   - Sufixo `UpdateInput` para dados de atualização: `StudentUpdateInput`

3. **Respostas da API**:
   - Prefixo `Api` para respostas: `ApiResponse<T>`, `ApiError`

4. **Requisições da API**:
   - Sufixo `Request` para requisições: `LoginRequest`, `PasswordResetRequest`

5. **Props de Componentes**:
   - Sufixo `Props` para props de componentes: `StudentCardProps`, `InterventionListProps`

6. **Estados**:
   - Sufixo `State` para estados: `AuthState`, `FilterState`

## Melhores Práticas para Tipagem no Projeto

1. **Coerência com o Backend**:
   - As interfaces devem refletir fielmente a estrutura de dados do backend
   - Mantenha-se alinhado com as convenções de nomeclatura do schema Prisma

2. **Granularidade Apropriada**:
   - Crie tipos específicos para cada propósito
   - Evite tipos muito genéricos que podem levar a erros sutis

3. **Expressividade**:
   - Os nomes dos tipos devem comunicar claramente seu propósito
   - Use interfaces em vez de types para objetos que representam entidades

4. **Restrição vs Flexibilidade**:
   - Seja restritivo o suficiente para evitar erros, mas flexível o suficiente para facilitar o desenvolvimento
   - Utilize "Union Types" para valores fixos: `type Status = 'ATIVO' | 'INATIVO'`

5. **Documentação Integrada**:
   - Use comentários JSDoc para documentar os tipos e propriedades
   - Explique o propósito de cada propriedade quando não for óbvio

```typescript
/**
 * Representa uma intervenção educacional aplicada a um estudante
 *
 * @property id - Identificador único da intervenção
 * @property dataInicio - Data de início da intervenção
 * @property dataFim - Data de término, null se ainda em andamento
 * @property tipo - Tipo da intervenção (ex: 'LEITURA', 'MATEMATICA')
 * @property descricao - Descrição detalhada da intervenção
 * @property status - Status atual da intervenção
 */
export interface Intervention {
  id: string;
  dataInicio: string;
  dataFim: string | null;
  tipo: string;
  descricao: string;
  status: 'ATIVO' | 'CONCLUIDO' | 'CANCELADO' | 'AGENDADO';
  // outras propriedades...
}
```

## Conclusão

A tipagem forte com TypeScript é um elemento crítico para o sucesso do projeto Innerview, fornecendo vários benefícios:

1. **Segurança de Tipos**: Redução significativa de erros de runtime relacionados a tipos incompatíveis
2. **Documentação Integrada**: Os próprios tipos servem como documentação viva do sistema
3. **Melhor Experiência de Desenvolvimento**: Autocompletar, verificação de erros e refatoração mais segura
4. **Comunicação com o Backend**: Garantia de coerência entre as chamadas frontend e as expectativas do backend
5. **Manutenibilidade**: Código mais fácil de entender e manter à medida que o projeto cresce

Ao seguir as convenções e práticas estabelecidas neste documento, a equipe de desenvolvimento do Innerview pode aproveitar ao máximo o TypeScript para criar uma plataforma educacional robusta e confiável. A disciplina em manter os tipos atualizados e precisos paga dividendos na forma de menos bugs, desenvolvimento mais rápido e um código mais adaptável às mudanças futuras.

# Tipos e Interfaces

## Tipos Base

### BaseEntity
```typescript
interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### BaseProps
```typescript
interface BaseProps {
  className?: string;
  style?: React.CSSProperties;
}
```

## Tipos de Encaminhamento

### ReferralStatus
```typescript
type ReferralStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';
```

### ReferralPriority
```typescript
type ReferralPriority = 'low' | 'medium' | 'high' | 'urgent';
```

### ReferralType
```typescript
type ReferralType = 'academic' | 'administrative' | 'technical' | 'other';
```

### Attachment
```typescript
interface Attachment extends BaseEntity {
  name: string;
  url: string;
  type: string;
  size: number;
}
```

### Comment
```typescript
interface Comment extends BaseEntity {
  content: string;
  author: string;
}
```

### HistoryItem
```typescript
interface HistoryItem extends BaseEntity {
  action: string;
  description: string;
  author: string;
  previousStatus?: ReferralStatus;
  newStatus?: ReferralStatus;
}
```

### Referral
```typescript
interface Referral extends BaseEntity {
  title: string;
  description: string;
  type: ReferralType;
  status: ReferralStatus;
  priority: ReferralPriority;
  assignedTo: string;
  createdBy: string;
  dueDate: Date;
  attachments: Attachment[];
  comments: Comment[];
  history: HistoryItem[];
  tags: string[];
}
```

## Tipos de Métricas

### ReferralMetrics
```typescript
interface ReferralMetrics {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
  cancelled: number;
  averageResolutionTime: number;
  priorityDistribution: Record<ReferralPriority, number>;
  typeDistribution: Record<ReferralType, number>;
}
```

## Tipos de Componentes

### ReferralBuilderProps
```typescript
interface ReferralBuilderProps extends BaseProps {
  onSubmit: (data: Omit<Referral, keyof BaseEntity>) => void;
  onCancel: () => void;
}
```

### ReferralListProps
```typescript
interface ReferralListProps extends BaseProps {
  referrals: Referral[];
  onReferralSelect: (id: string) => void;
  onStatusChange: (id: string, status: ReferralStatus) => void;
}
```

### ReferralDetailsProps
```typescript
interface ReferralDetailsProps extends BaseProps {
  referral: Referral;
  onUpdate: (referral: Referral) => void;
  onAddComment: (referralId: string, comment: Omit<Comment, keyof BaseEntity>) => void;
}
```

### ReferralDashboardProps
```typescript
interface ReferralDashboardProps extends BaseProps {
  metrics: ReferralMetrics;
  recentReferrals: Referral[];
  onReferralSelect: (id: string) => void;
}
```

### ReferralTimelineProps
```typescript
interface ReferralTimelineProps extends BaseProps {
  history: HistoryItem[];
}
```

## Tipos de Eventos

### ReferralEvent
```typescript
type ReferralEvent =
  | { type: 'CREATE'; payload: Omit<Referral, keyof BaseEntity> }
  | { type: 'UPDATE'; payload: Partial<Referral> }
  | { type: 'DELETE'; payload: string }
  | { type: 'ADD_COMMENT'; payload: { referralId: string; comment: Omit<Comment, keyof BaseEntity> } }
  | { type: 'CHANGE_STATUS'; payload: { referralId: string; status: ReferralStatus } };
```

## Tipos de Contexto

### ReferralContextType
```typescript
interface ReferralContextType {
  referrals: Referral[];
  metrics: ReferralMetrics;
  dispatch: React.Dispatch<ReferralEvent>;
  loading: boolean;
  error: Error | null;
}
```

## Tipos de API

### ApiResponse
```typescript
interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}
```

### ApiError
```typescript
interface ApiError {
  code: string;
  message: string;
  details?: unknown;
}
```

## Tipos de Utilitários

### DateRange
```typescript
interface DateRange {
  start: Date;
  end: Date;
}
```

### PaginationParams
```typescript
interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
```

### FilterParams
```typescript
interface FilterParams {
  status?: ReferralStatus;
  priority?: ReferralPriority;
  type?: ReferralType;
  assignedTo?: string;
  createdBy?: string;
  dateRange?: DateRange;
  tags?: string[];
}
```
