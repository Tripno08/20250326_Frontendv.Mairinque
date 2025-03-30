# Padrões de Tipagem

## Visão Geral

Este documento descreve os padrões de tipagem utilizados no sistema, incluindo:

- Tipos base
- Interfaces
- Enums
- Unions
- Utilitários

## Tipos Base

### BaseEntity

```typescript
export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### BaseProps

```typescript
export interface BaseProps {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}
```

## Sistema de Reuniões

### Enums

```typescript
export type MeetingType = 'rti' | 'pedagogica' | 'administrativa';

export type MeetingStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled';

export type ParticipantStatus = 'confirmed' | 'pending' | 'declined';

export type DecisionStatus = 'pending' | 'completed' | 'cancelled';
```

### Interfaces

```typescript
export interface Participant extends BaseEntity {
  name: string;
  role: string;
  status: ParticipantStatus;
}

export interface Decision extends BaseEntity {
  description: string;
  assignedTo: string;
  dueDate: Date;
  status: DecisionStatus;
}

export interface Note extends BaseEntity {
  content: string;
  author: string;
}

export interface AgendaItem extends BaseEntity {
  title: string;
  description: string;
  duration: number;
  order: number;
  status: 'pending' | 'completed';
}

export interface Meeting extends BaseEntity {
  title: string;
  type: MeetingType;
  description: string;
  startDate: Date;
  endDate: Date;
  status: MeetingStatus;
  participants: Participant[];
  decisions: Decision[];
  notes: Note[];
  agenda: AgendaItem[];
}
```

### Props

```typescript
export interface MeetingSchedulerProps {
  onSchedule: (meeting: Omit<Meeting, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

export interface MeetingAgendaProps {
  agenda: AgendaItem[];
  onUpdate: (item: AgendaItem) => void;
}

export interface MeetingAttendanceProps {
  participants: Participant[];
  onUpdate: (participant: Participant) => void;
}

export interface MeetingDecisionsProps {
  decisions: Decision[];
  onUpdate: (decision: Decision) => void;
}

export interface CollaborativeEditorProps {
  notes: Note[];
  onUpdate: (note: Note) => void;
}

export interface MeetingDashboardProps {
  meetings: Meeting[];
  onMeetingSelect: (meetingId: string) => void;
}
```

## Utilitários

### Omit

```typescript
// Remove campos específicos de um tipo
type NewMeeting = Omit<Meeting, 'id' | 'createdAt' | 'updatedAt'>;
```

### Pick

```typescript
// Seleciona campos específicos de um tipo
type MeetingSummary = Pick<Meeting, 'title' | 'type' | 'status'>;
```

### Partial

```typescript
// Torna todos os campos opcionais
type UpdateMeeting = Partial<Meeting>;
```

### Required

```typescript
// Torna todos os campos obrigatórios
type CompleteMeeting = Required<Meeting>;
```

## Boas Práticas

### 1. Nomenclatura

- Interfaces: PascalCase (ex: `MeetingProps`)
- Types: PascalCase (ex: `MeetingType`)
- Props: Sufixo Props (ex: `MeetingSchedulerProps`)
- Enums: PascalCase (ex: `MeetingStatus`)

### 2. Organização

- Agrupar tipos relacionados
- Usar exports nomeados
- Manter tipos próximos aos componentes
- Documentar tipos complexos

### 3. Reutilização

- Usar tipos base
- Criar tipos utilitários
- Evitar duplicação
- Manter consistência

### 4. Validação

- Usar tipos estritos
- Evitar any
- Validar dados de entrada
- Tratar casos de erro

## Exemplos de Uso

### 1. Componente com Props

```typescript
interface Props {
  meeting: Meeting;
  onUpdate: (meeting: Meeting) => void;
}

const MeetingComponent: React.FC<Props> = ({ meeting, onUpdate }) => {
  // ...
};
```

### 2. Hook com Tipos

```typescript
interface UseMeetingReturn {
  meeting: Meeting | null;
  isLoading: boolean;
  error: Error | null;
  updateMeeting: (meeting: Meeting) => Promise<void>;
}

const useMeeting = (id: string): UseMeetingReturn => {
  // ...
};
```

### 3. Serviço com Tipos

```typescript
interface MeetingService {
  getMeeting(id: string): Promise<Meeting>;
  updateMeeting(meeting: Meeting): Promise<void>;
  deleteMeeting(id: string): Promise<void>;
}

class MeetingServiceImpl implements MeetingService {
  // ...
}
```

## Próximos Passos

1. **Melhorias**
   - Adicionar mais tipos utilitários
   - Melhorar documentação
   - Implementar validação

2. **Novos Tipos**
   - Tipos para relatórios
   - Tipos para estatísticas
   - Tipos para configurações

3. **Ferramentas**
   - Zod para validação
   - TypeScript strict mode
   - ESLint rules

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

## Boas Práticas

### 1. Nomenclatura
- Use nomes descritivos e significativos
- Siga o padrão PascalCase para interfaces e tipos
- Use sufixos apropriados (Props, Event, Context, etc.)

### 2. Organização
- Agrupe tipos relacionados
- Use interfaces para objetos com estrutura fixa
- Use types para uniões e intersecções

### 3. Reutilização
- Estenda tipos base quando apropriado
- Use tipos utilitários do TypeScript
- Evite duplicação de código

### 4. Documentação
- Documente tipos complexos
- Use JSDoc para interfaces públicas
- Inclua exemplos quando necessário

### 5. Validação
- Use tipos estritos
- Evite any
- Use unknown para valores desconhecidos

### 6. Performance
- Use tipos primitivos quando possível
- Evite tipos complexos em props
- Use tipos utilitários para otimização

## Exemplos de Uso

### 1. Tipos em Componentes
```typescript
const ReferralList: React.FC<ReferralListProps> = ({
  referrals,
  onReferralSelect,
  onStatusChange,
  className
}) => {
  // Implementação
};
```

### 2. Tipos em Hooks
```typescript
function useReferral(id: string): {
  referral: Referral | null;
  loading: boolean;
  error: Error | null;
} {
  // Implementação
}
```

### 3. Tipos em Serviços
```typescript
class ReferralService {
  async createReferral(
    data: Omit<Referral, keyof BaseEntity>
  ): Promise<ApiResponse<Referral>> {
    // Implementação
  }
}
```

### 4. Tipos em Contextos
```typescript
const ReferralContext = createContext<ReferralContextType | null>(null);
```

### 5. Tipos em Eventos
```typescript
function referralReducer(
  state: ReferralState,
  event: ReferralEvent
): ReferralState {
  // Implementação
}
```

## Ferramentas

### 1. TypeScript
- Versão: 4.9+
- Configuração estrita
- Verificação de tipos em tempo de compilação

### 2. ESLint
- Regras específicas para TypeScript
- Verificação de tipos
- Boas práticas

### 3. Prettier
- Formatação de código
- Configuração consistente
- Integração com TypeScript

### 4. Jest
- Tipagem de testes
- Mocks tipados
- Assertions tipadas

## Manutenção

### 1. Atualização
- Mantenha tipos atualizados
- Revise tipos periodicamente
- Documente mudanças

### 2. Versionamento
- Use versionamento semântico
- Documente breaking changes
- Mantenha compatibilidade

### 3. Testes
- Teste tipos
- Verifique cobertura
- Valide usabilidade
