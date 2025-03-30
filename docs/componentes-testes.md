# Componentes e Testes

## Componentes

### ReferralBuilder

O componente `ReferralBuilder` é responsável por criar novos encaminhamentos no sistema.

#### Props
```typescript
interface ReferralBuilderProps {
  onSubmit: (data: Omit<Referral, keyof BaseEntity>) => void;
  onCancel: () => void;
}
```

#### Funcionalidades
- Formulário para criação de encaminhamentos
- Validação de campos obrigatórios
- Sistema de tags
- Seleção de data de vencimento
- Seleção de prioridade e tipo

#### Testes
```typescript
describe('ReferralBuilder', () => {
  it('renderiza o formulário corretamente');
  it('valida campos obrigatórios');
  it('permite adicionar e remover tags');
  it('chama onSubmit com os dados corretos');
  it('chama onCancel ao clicar em cancelar');
});
```

### ReferralList

O componente `ReferralList` exibe uma lista de encaminhamentos com opções de filtro e ações.

#### Props
```typescript
interface ReferralListProps {
  referrals: Referral[];
  onReferralSelect: (id: string) => void;
  onStatusChange: (id: string, status: ReferralStatus) => void;
}
```

#### Funcionalidades
- Lista de encaminhamentos
- Filtros por status, prioridade e tipo
- Ações rápidas
- Indicadores visuais
- Paginação

#### Testes
```typescript
describe('ReferralList', () => {
  it('renderiza a lista de encaminhamentos');
  it('filtra encaminhamentos corretamente');
  it('chama onReferralSelect ao clicar em um item');
  it('chama onStatusChange ao alterar status');
  it('exibe indicadores de prioridade e vencimento');
});
```

### ReferralDetails

O componente `ReferralDetails` mostra informações detalhadas de um encaminhamento.

#### Props
```typescript
interface ReferralDetailsProps {
  referral: Referral;
  onUpdate: (referral: Referral) => void;
  onAddComment: (referralId: string, comment: Omit<Comment, keyof BaseEntity>) => void;
}
```

#### Funcionalidades
- Informações detalhadas
- Sistema de comentários
- Gestão de anexos
- Timeline de alterações
- Ações de status

#### Testes
```typescript
describe('ReferralDetails', () => {
  it('renderiza os detalhes do encaminhamento');
  it('permite adicionar comentários');
  it('permite atualizar status');
  it('exibe anexos corretamente');
  it('mostra timeline de alterações');
});
```

### ReferralDashboard

O componente `ReferralDashboard` exibe métricas e estatísticas dos encaminhamentos.

#### Props
```typescript
interface ReferralDashboardProps {
  metrics: ReferralMetrics;
  recentReferrals: Referral[];
  onReferralSelect: (id: string) => void;
}
```

#### Funcionalidades
- Métricas gerais
- Gráficos de distribuição
- Lista de recentes
- Filtros temporais

#### Testes
```typescript
describe('ReferralDashboard', () => {
  it('renderiza métricas corretamente');
  it('exibe gráficos de distribuição');
  it('mostra lista de recentes');
  it('chama onReferralSelect ao clicar em um item');
  it('atualiza dados ao mudar período');
});
```

### ReferralTimeline

O componente `ReferralTimeline` mostra o histórico de alterações de um encaminhamento.

#### Props
```typescript
interface ReferralTimelineProps {
  history: HistoryItem[];
}
```

#### Funcionalidades
- Histórico cronológico
- Detalhes de alterações
- Informações de autor
- Formatação de datas

#### Testes
```typescript
describe('ReferralTimeline', () => {
  it('renderiza histórico corretamente');
  it('ordena eventos cronologicamente');
  it('exibe detalhes de alterações');
  it('formata datas corretamente');
  it('mostra informações de autor');
});
```

## Testes

### Estrutura de Testes

```
src/
  components/
    referrals/
      __tests__/
        ReferralBuilder.test.tsx
        ReferralList.test.tsx
        ReferralDetails.test.tsx
        ReferralDashboard.test.tsx
        ReferralTimeline.test.tsx
```

### Boas Práticas

1. **Organização**
   - Testes próximos aos componentes
   - Nomes descritivos
   - Agrupamento lógico

2. **Cobertura**
   - Teste de renderização
   - Teste de interação
   - Teste de props
   - Teste de eventos
   - Teste de estados

3. **Mocking**
   - Mock de funções
   - Mock de dados
   - Mock de contextos
   - Mock de APIs

4. **Asserções**
   - Verificar renderização
   - Verificar interações
   - Verificar estados
   - Verificar chamadas
   - Verificar resultados

### Exemplo de Teste

```typescript
describe('ReferralBuilder', () => {
  const mockOnSubmit = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza o formulário corretamente', () => {
    render(
      <ReferralBuilder
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByLabelText(/título/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/descrição/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/tipo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/prioridade/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/data de vencimento/i)).toBeInTheDocument();
  });

  it('valida campos obrigatórios', async () => {
    render(
      <ReferralBuilder
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    const submitButton = screen.getByRole('button', { name: /criar/i });
    await userEvent.click(submitButton);

    expect(mockOnSubmit).not.toHaveBeenCalled();
    expect(screen.getByText(/título é obrigatório/i)).toBeInTheDocument();
  });

  it('permite adicionar e remover tags', async () => {
    render(
      <ReferralBuilder
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    const tagInput = screen.getByLabelText(/adicionar tag/i);
    await userEvent.type(tagInput, 'teste{enter}');

    expect(screen.getByText('teste')).toBeInTheDocument();

    const removeButton = screen.getByRole('button', { name: /remover tag/i });
    await userEvent.click(removeButton);

    expect(screen.queryByText('teste')).not.toBeInTheDocument();
  });
});
```

### Ferramentas

1. **Jest**
   - Framework de testes
   - Assertions
   - Mocks
   - Snapshots

2. **React Testing Library**
   - Renderização
   - Queries
   - Interações
   - Acessibilidade

3. **MSW**
   - Mock de API
   - Interceptors
   - Respostas
   - Erros

4. **Cypress**
   - Testes E2E
   - Interações
   - Visualização
   - Debugging
