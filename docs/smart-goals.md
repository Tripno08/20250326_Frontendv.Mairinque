# Sistema de Metas SMART

## Visão Geral

O sistema de Metas SMART implementa um conjunto completo de componentes para a criação, visualização, monitoramento e atualização de metas educacionais, seguindo o framework SMART (Específicas, Mensuráveis, Atingíveis, Relevantes, Temporais). O sistema é projetado para integração com o módulo de intervenções educacionais existente.

## Componentes Principais

### 1. SmartGoalForm

Formulário para criação e edição de metas SMART, com validação de campos e suporte para todos os critérios do framework SMART.

```tsx
<SmartGoalForm
  initialData={metaExistente}  // Opcional, para edição
  studentId="123"              // ID do aluno
  interventionsLibrary={[...]} // Biblioteca de intervenções disponíveis
  onSave={handleSave}          // Callback ao salvar
  onCancel={handleCancel}      // Callback ao cancelar
/>
```

#### Recursos
- Validação em tempo real dos campos
- Suporte para datas com DatePicker
- Campos dinâmicos para passos de realização
- Integração com intervenções existentes
- Autocomplete para habilidades e responsáveis

### 2. SmartGoalCard

Componente de visualização detalhada de uma meta SMART, incluindo progresso e informações relacionadas.

```tsx
<SmartGoalCard
  goal={meta}                    // Dados da meta
  onEdit={handleEdit}            // Callback para edição (opcional)
  onDelete={handleDelete}        // Callback para exclusão (opcional)
  onUpdateProgress={handleUpdate}// Callback para atualização (opcional)
/>
```

#### Recursos
- Visualização estruturada seguindo o framework SMART
- Barra de progresso visual
- Indicadores de tendência (melhoria/piora)
- Alertas para metas próximas do prazo ou atrasadas
- Ações contextuais (editar, excluir, atualizar)

### 3. GoalProgressUpdate

Componente para atualização do progresso de uma meta, com slider visual e campo para observações.

```tsx
<GoalProgressUpdate
  goal={meta}                 // Dados da meta
  onUpdate={handleUpdate}     // Callback para atualização
  onCancel={handleCancel}     // Callback para cancelar
/>
```

#### Recursos
- Slider interativo para ajuste de valores
- Cálculo automático de porcentagem concluída
- Campo para observações e notas de progresso
- Validação de valores dentro dos limites definidos

### 4. GoalProgressChart

Gráfico de linha para visualização do progresso histórico da meta ao longo do tempo.

```tsx
<GoalProgressChart
  goal={meta}       // Dados da meta
  width={600}       // Largura opcional (padrão: 600)
  height={300}      // Altura opcional (padrão: 300)
/>
```

#### Recursos
- Visualização temporal das medições
- Linhas de referência para valores inicial e alvo
- Tooltips com detalhes de cada medição
- Design responsivo

### 5. SmartGoalList

Lista de metas com funcionalidades de filtragem, busca e ordenação.

```tsx
<SmartGoalList
  goals={metas}                  // Array de metas
  onEdit={handleEdit}            // Callback para edição (opcional)
  onDelete={handleDelete}        // Callback para exclusão (opcional)
  onUpdateProgress={handleUpdate}// Callback para atualização (opcional)
/>
```

#### Recursos
- Filtros por status, prioridade e domínio
- Busca por texto em qualquer campo
- Estatísticas de metas por status
- Ordenação inteligente (prioridade + data alvo)
- Animações com Framer Motion

## Tipos de Dados

Principais interfaces e tipos utilizados pelo sistema:

```typescript
// Tipos básicos
type GoalStatus = 'não iniciada' | 'em andamento' | 'atrasada' | 'concluída' | 'cancelada';
type GoalPriority = 'baixa' | 'média' | 'alta' | 'crítica';

// Progresso
interface GoalProgress {
  date: Date;       // Data da medição
  value: number;    // Valor medido
  notes?: string;   // Observações (opcional)
}

// Dados de medição
interface GoalMeasurement {
  initialValue: number;          // Valor inicial
  targetValue: number;           // Valor alvo
  currentValue: number;          // Valor atual
  unit: string;                  // Unidade de medida
  progressHistory: GoalProgress[]; // Histórico de progresso
}

// Meta SMART completa
interface SmartGoal {
  id: string;
  studentId: string;
  title: string;
  description: string;

  // Specific (Específica)
  specificDetails: string;

  // Measurable (Mensurável)
  measurement: GoalMeasurement;

  // Achievable (Atingível)
  achievementSteps: string[];

  // Relevant (Relevante)
  relevance: string;

  // Time-bound (Temporal)
  startDate: Date;
  targetDate: Date;

  // Status e metadados
  status: GoalStatus;
  priority: GoalPriority;
  createdAt: Date;
  updatedAt: Date;

  // Relações
  interventions: string[] | Intervention[];
  domain: string;
  skills: string[];
  responsibleUsers: string[];
}
```

## Integração com Intervenções

O sistema de metas SMART integra-se diretamente com o módulo de intervenções educacionais:

1. **Associação de intervenções**: Cada meta pode ser associada a uma ou mais intervenções do catálogo
2. **Seleção contextual**: O formulário permite selecionar intervenções da biblioteca existente
3. **Visualização relacionada**: As intervenções associadas são exibidas no cartão da meta

## Cálculo de Progresso

O sistema suporta diferentes cenários de medição:

1. **Aumento de valor**: Quando o valor alvo é maior que o inicial (ex: aumentar palavras por minuto)
2. **Redução de valor**: Quando o valor alvo é menor que o inicial (ex: reduzir comportamentos disruptivos)
3. **Valor binário**: Quando inicial e alvo são iguais (ex: meta concluída/não concluída)

A porcentagem de progresso é calculada automaticamente com base nestes cenários.

## Próximos Passos

1. **Backend e persistência**: Implementar API para persistência das metas no banco de dados
2. **Relatórios**: Gerar relatórios de progresso e comparativos
3. **Notificações**: Alertas para metas próximas ao prazo ou atrasadas
4. **Permissões**: Controle de acesso baseado em papéis para diferentes usuários

## Exemplos de Uso

### Criação de Nova Meta

```tsx
// Componente que implementa a criação de uma nova meta
function NovaMeta() {
  const [student, setStudent] = useState<Student | null>(null);
  const [interventions, setInterventions] = useState<Intervention[]>([]);

  // Função para buscar dados necessários
  useEffect(() => {
    async function fetchData() {
      const studentData = await fetchStudent(studentId);
      const interventionsData = await fetchInterventions();
      setStudent(studentData);
      setInterventions(interventionsData);
    }

    fetchData();
  }, [studentId]);

  // Manipulador para salvar meta
  const handleSave = async (formData: SmartGoalFormData) => {
    try {
      await createSmartGoal(formData);
      showSuccessNotification('Meta criada com sucesso');
      navigate('/metas');
    } catch (error) {
      showErrorNotification('Erro ao criar meta');
    }
  };

  return (
    <Container>
      <Typography variant="h4">Nova Meta SMART</Typography>
      {student && (
        <SmartGoalForm
          studentId={student.id}
          interventionsLibrary={interventions}
          onSave={handleSave}
          onCancel={() => navigate('/metas')}
        />
      )}
    </Container>
  );
}
```

### Visualização de Progresso

```tsx
// Componente que exibe o progresso de uma meta específica
function ProgressoMeta({ goalId }) {
  const [goal, setGoal] = useState<SmartGoal | null>(null);

  // Buscar dados da meta
  useEffect(() => {
    async function fetchGoalData() {
      const goalData = await fetchSmartGoal(goalId);
      setGoal(goalData);
    }

    fetchGoalData();
  }, [goalId]);

  // Manipulador para atualizar progresso
  const handleUpdateProgress = async (goalId, value, notes) => {
    try {
      await updateGoalProgress(goalId, value, notes);
      // Atualizar dados locais
      setGoal(prev => {
        if (!prev) return null;

        const newProgressEntry = {
          date: new Date(),
          value,
          notes
        };

        return {
          ...prev,
          measurement: {
            ...prev.measurement,
            currentValue: value,
            progressHistory: [...prev.measurement.progressHistory, newProgressEntry]
          }
        };
      });

      showSuccessNotification('Progresso atualizado com sucesso');
    } catch (error) {
      showErrorNotification('Erro ao atualizar progresso');
    }
  };

  if (!goal) return <CircularProgress />;

  return (
    <Container>
      <Typography variant="h4">{goal.title}</Typography>

      {/* Exibir cartão da meta */}
      <SmartGoalCard goal={goal} />

      {/* Formulário de atualização de progresso */}
      <GoalProgressUpdate
        goal={goal}
        onUpdate={handleUpdateProgress}
        onCancel={() => setIsUpdatingProgress(false)}
      />

      {/* Gráfico de progresso */}
      <GoalProgressChart goal={goal} />
    </Container>
  );
}
```
