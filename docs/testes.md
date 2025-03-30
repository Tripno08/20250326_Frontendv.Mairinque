# Guia de Testes

## Visão Geral

Este documento descreve os padrões e práticas de testes utilizados no projeto Innerview, garantindo qualidade e manutenibilidade do código.

## Configuração do Ambiente

### Jest

```javascript
// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  testMatch: ['**/__tests__/**/*.test.(ts|tsx)'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{ts,tsx}',
    '!src/**/*.test.{ts,tsx}',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
```

### Setup

```typescript
// jest.setup.js
import '@testing-library/jest-dom';
import { server } from './mocks/server';

// Configuração do MSW
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// Mock de APIs do navegador
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock do ResizeObserver
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock do IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
};
```

## Tipos de Testes

### 1. Testes Unitários

#### Componentes

```typescript
// GradientCard.test.tsx
import { render, screen } from '@testing-library/react';
import { GradientCard } from '@/components/common/GradientCard';

describe('GradientCard', () => {
  it('renderiza com conteúdo básico', () => {
    render(<GradientCard>Conteúdo</GradientCard>);
    expect(screen.getByText('Conteúdo')).toBeInTheDocument();
  });

  it('aplica gradiente personalizado', () => {
    render(
      <GradientCard gradient="linear-gradient(45deg, #ff0000, #00ff00)">
        Conteúdo
      </GradientCard>
    );
    const card = screen.getByText('Conteúdo').parentElement;
    expect(card).toHaveStyle({
      background: 'linear-gradient(45deg, #ff0000, #00ff00)',
    });
  });

  it('aplica efeito hover quando habilitado', () => {
    render(<GradientCard hover>Conteúdo</GradientCard>);
    const card = screen.getByText('Conteúdo').parentElement;
    expect(card).toHaveClass('hover-effect');
  });

  it('não aplica efeito hover quando desabilitado', () => {
    render(<GradientCard hover={false}>Conteúdo</GradientCard>);
    const card = screen.getByText('Conteúdo').parentElement;
    expect(card).not.toHaveClass('hover-effect');
  });

  it('aplica classe personalizada', () => {
    render(<GradientCard className="custom-class">Conteúdo</GradientCard>);
    const card = screen.getByText('Conteúdo').parentElement;
    expect(card).toHaveClass('custom-class');
  });

  it('aplica estilo inline', () => {
    render(
      <GradientCard style={{ padding: '20px' }}>Conteúdo</GradientCard>
    );
    const card = screen.getByText('Conteúdo').parentElement;
    expect(card).toHaveStyle({ padding: '20px' });
  });

  it('mantém acessibilidade com role="article"', () => {
    render(<GradientCard>Conteúdo</GradientCard>);
    expect(screen.getByRole('article')).toBeInTheDocument();
  });

  it('renderiza corretamente com children null', () => {
    render(<GradientCard>{null}</GradientCard>);
    expect(screen.queryByRole('article')).toBeInTheDocument();
  });
});
```

#### Hooks

```typescript
// useAssessments.test.tsx
import { renderHook, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAssessments } from '@/hooks/useAssessments';

describe('useAssessments', () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  it('busca lista de avaliações', async () => {
    const mockFilters = {
      type: 'quiz',
      status: 'draft',
      page: 1,
      limit: 10,
    };

    const mockResponse = {
      data: [mockAssessment],
      total: 1,
      page: 1,
      limit: 10,
      totalPages: 1,
    };

    (assessmentService.listAssessments as jest.Mock).mockResolvedValue(
      mockResponse
    );

    const { result } = renderHook(() => useAssessments(mockFilters), {
      wrapper,
    });

    expect(result.current.isLoading).toBe(true);
    expect(assessmentService.listAssessments).toHaveBeenCalledWith(mockFilters);

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toEqual(mockResponse);
  });

  it('trata erros adequadamente', async () => {
    const mockError = new Error('Erro ao buscar avaliações');
    (assessmentService.listAssessments as jest.Mock).mockRejectedValue(
      mockError
    );

    const { result } = renderHook(() => useAssessments({}), { wrapper });

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(result.current.isError).toBe(true);
    expect(result.current.error).toEqual(mockError);
  });
});
```

#### Serviços

```typescript
// assessmentService.test.ts
import { assessmentService } from '@/services/assessmentService';
import { createApiClient, get, post, put, del } from '@/utils/apiUtils';

jest.mock('@/utils/apiUtils');

describe('AssessmentService', () => {
  const mockApiClient = {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (createApiClient as jest.Mock).mockReturnValue(mockApiClient);
  });

  describe('listAssessments', () => {
    it('lista avaliações com filtros', async () => {
      const mockFilters = {
        type: 'quiz',
        status: 'draft',
        page: 1,
        limit: 10,
      };

      const mockResponse = {
        data: {
          data: [mockAssessment],
          total: 1,
          page: 1,
          limit: 10,
          totalPages: 1,
        },
        status: 200,
      };

      (get as jest.Mock).mockResolvedValue(mockResponse);

      const result = await assessmentService.listAssessments(mockFilters);

      expect(get).toHaveBeenCalledWith(
        mockApiClient,
        expect.stringContaining('/assessments?')
      );
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('createAssessment', () => {
    it('cria uma nova avaliação', async () => {
      const newAssessment = { ...mockAssessment };
      delete newAssessment.id;

      const mockResponse = {
        data: mockAssessment,
        status: 201,
      };

      (post as jest.Mock).mockResolvedValue(mockResponse);

      const result = await assessmentService.createAssessment(newAssessment);

      expect(post).toHaveBeenCalledWith(mockApiClient, '/assessments', newAssessment);
      expect(result).toEqual(mockAssessment);
    });
  });
});
```

### 2. Testes de Integração

```typescript
// AssessmentForm.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AssessmentForm } from '@/components/AssessmentForm';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

describe('AssessmentForm', () => {
  const queryClient = new QueryClient();
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  it('submete formulário com sucesso', async () => {
    render(<AssessmentForm />, { wrapper });

    // Preenche campos
    fireEvent.change(screen.getByLabelText(/título/i), {
      target: { value: 'Nova Avaliação' },
    });
    fireEvent.change(screen.getByLabelText(/descrição/i), {
      target: { value: 'Descrição da avaliação' },
    });

    // Submete formulário
    fireEvent.click(screen.getByRole('button', { name: /criar/i }));

    // Verifica feedback
    await waitFor(() => {
      expect(screen.getByText(/avaliação criada com sucesso/i)).toBeInTheDocument();
    });
  });

  it('exibe erros de validação', async () => {
    render(<AssessmentForm />, { wrapper });

    // Tenta submeter sem preencher campos obrigatórios
    fireEvent.click(screen.getByRole('button', { name: /criar/i }));

    // Verifica mensagens de erro
    expect(await screen.findByText(/título é obrigatório/i)).toBeInTheDocument();
    expect(await screen.findByText(/descrição é obrigatória/i)).toBeInTheDocument();
  });
});
```

### 3. Testes E2E

```typescript
// assessment.spec.ts
describe('Avaliações', () => {
  beforeEach(() => {
    cy.login('teacher@example.com', 'password123');
    cy.visit('/assessments');
  });

  it('cria uma nova avaliação', () => {
    cy.get('button').contains('Nova Avaliação').click();
    cy.url().should('include', '/assessments/new');

    cy.get('input[name="title"]').type('Teste de Avaliação');
    cy.get('textarea[name="description"]').type('Descrição do teste');
    cy.get('select[name="type"]').select('quiz');
    cy.get('input[name="startDate"]').type('2024-03-26');
    cy.get('input[name="endDate"]').type('2024-03-27');

    cy.get('button').contains('Criar').click();

    cy.url().should('include', '/assessments');
    cy.contains('Teste de Avaliação').should('exist');
  });

  it('edita uma avaliação existente', () => {
    cy.get('table').contains('Teste de Avaliação').parent().find('button').click();
    cy.get('button').contains('Editar').click();

    cy.get('input[name="title"]').clear().type('Avaliação Atualizada');
    cy.get('button').contains('Salvar').click();

    cy.contains('Avaliação Atualizada').should('exist');
  });

  it('exclui uma avaliação', () => {
    cy.get('table').contains('Avaliação Atualizada').parent().find('button').click();
    cy.get('button').contains('Excluir').click();
    cy.get('button').contains('Confirmar').click();

    cy.contains('Avaliação Atualizada').should('not.exist');
  });
});
```

## Boas Práticas

### 1. Organização

- Agrupe testes relacionados em `describe`
- Use `it` para casos de teste individuais
- Mantenha testes independentes
- Use `beforeEach` para setup comum

### 2. Nomenclatura

- Descreva o comportamento esperado
- Use padrão "deve" ou "should"
- Seja específico e claro

```typescript
describe('GradientCard', () => {
  it('deve renderizar com gradiente padrão', () => {
    // ...
  });

  it('deve aplicar gradiente personalizado', () => {
    // ...
  });
});
```

### 3. Assertions

- Use assertions específicas
- Evite múltiplas assertions por teste
- Teste um comportamento por vez

```typescript
// ✅ Bom
it('deve aplicar classe personalizada', () => {
  render(<GradientCard className="custom-class">Conteúdo</GradientCard>);
  const card = screen.getByText('Conteúdo').parentElement;
  expect(card).toHaveClass('custom-class');
});

// ❌ Evitar
it('deve aplicar todas as props', () => {
  render(
    <GradientCard
      className="custom-class"
      style={{ padding: '20px' }}
      hover
    >
      Conteúdo
    </GradientCard>
  );
  const card = screen.getByText('Conteúdo').parentElement;
  expect(card).toHaveClass('custom-class');
  expect(card).toHaveStyle({ padding: '20px' });
  expect(card).toHaveClass('hover-effect');
});
```

### 4. Mocks

- Use mocks apenas quando necessário
- Mantenha mocks simples
- Documente mocks complexos

```typescript
// Mock simples
jest.mock('@/utils/apiUtils', () => ({
  createApiClient: jest.fn(),
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  del: jest.fn(),
}));

// Mock complexo
jest.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({
    user: {
      id: '1',
      name: 'Test User',
      role: 'teacher',
    },
    isAuthenticated: true,
    login: jest.fn(),
    logout: jest.fn(),
  }),
}));
```

### 5. Assíncrono

- Use `async/await` para operações assíncronas
- Use `waitFor` para esperar mudanças
- Trate erros adequadamente

```typescript
it('deve carregar dados da API', async () => {
  const { result } = renderHook(() => useData('key'));

  expect(result.current.isLoading).toBe(true);
  await waitFor(() => {
    expect(result.current.isLoading).toBe(false);
  });
  expect(result.current.data).toBeDefined();
});
```

## Cobertura de Testes

### 1. Métricas

- Componentes: 100%
- Hooks: 90%
- Serviços: 95%
- Utilitários: 95%
- Integração: 90%
- E2E: 100%

### 2. Relatórios

```bash
# Gerar relatório de cobertura
npm run test:coverage

# Verificar cobertura mínima
npm run test:coverage:check
```

### 3. Configuração

```json
{
  "coverageThreshold": {
    "global": {
      "branches": 80,
      "functions": 80,
      "lines": 80,
      "statements": 80
    }
  }
}
```

## Ferramentas

### 1. Jest

- Framework de testes
- Runner e assertions
- Snapshot testing
- Coverage reporting

### 2. React Testing Library

- Renderização de componentes
- Queries e assertions
- User events
- Accessibility testing

### 3. Cypress

- Testes E2E
- Visual testing
- Network mocking
- Time travel debugging

### 4. MSW

- API mocking
- Service workers
- Request interception
- Response mocking

## Referências

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Cypress Documentation](https://docs.cypress.io/)
- [MSW Documentation](https://mswjs.io/docs/getting-started)

## Testes Especializados

Para além dos testes gerais, temos documentação específica para casos mais complexos:

- [Testes para Componentes de Gráficos](./testes/testes-graficos.md) - Estratégias de teste para gráficos e visualizações de dados
- [Estratégias para Mock de ResizeObserver](./testes/mocks-browser-apis.md) - Como lidar com APIs do navegador em testes

# Testes

## Estrutura de Testes

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

## Componentes

### ReferralBuilder

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

### ReferralList

```typescript
describe('ReferralList', () => {
  const mockReferrals = [
    {
      id: '1',
      title: 'Encaminhamento 1',
      description: 'Descrição 1',
      type: 'academic',
      status: 'pending',
      priority: 'high',
      assignedTo: 'professor.artes',
      createdBy: 'admin',
      dueDate: new Date('2024-04-15'),
      attachments: [],
      comments: [],
      history: [],
      tags: ['urgente'],
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  const mockOnReferralSelect = jest.fn();
  const mockOnStatusChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza a lista de encaminhamentos', () => {
    render(
      <ReferralList
        referrals={mockReferrals}
        onReferralSelect={mockOnReferralSelect}
        onStatusChange={mockOnStatusChange}
      />
    );

    expect(screen.getByText('Encaminhamento 1')).toBeInTheDocument();
    expect(screen.getByText('Descrição 1')).toBeInTheDocument();
    expect(screen.getByText('urgente')).toBeInTheDocument();
  });

  it('chama onReferralSelect ao clicar em um item', async () => {
    render(
      <ReferralList
        referrals={mockReferrals}
        onReferralSelect={mockOnReferralSelect}
        onStatusChange={mockOnStatusChange}
      />
    );

    const referralCard = screen.getByText('Encaminhamento 1');
    await userEvent.click(referralCard);

    expect(mockOnReferralSelect).toHaveBeenCalledWith('1');
  });

  it('chama onStatusChange ao alterar status', async () => {
    render(
      <ReferralList
        referrals={mockReferrals}
        onReferralSelect={mockOnReferralSelect}
        onStatusChange={mockOnStatusChange}
      />
    );

    const statusButton = screen.getByRole('button', { name: /alterar status/i });
    await userEvent.click(statusButton);

    const inProgressOption = screen.getByText(/em andamento/i);
    await userEvent.click(inProgressOption);

    expect(mockOnStatusChange).toHaveBeenCalledWith('1', 'in_progress');
  });
});
```

### ReferralDetails

```typescript
describe('ReferralDetails', () => {
  const mockReferral = {
    id: '1',
    title: 'Encaminhamento 1',
    description: 'Descrição 1',
    type: 'academic',
    status: 'pending',
    priority: 'high',
    assignedTo: 'professor.artes',
    createdBy: 'admin',
    dueDate: new Date('2024-04-15'),
    attachments: [],
    comments: [],
    history: [],
    tags: ['urgente'],
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const mockOnUpdate = jest.fn();
  const mockOnAddComment = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza os detalhes do encaminhamento', () => {
    render(
      <ReferralDetails
        referral={mockReferral}
        onUpdate={mockOnUpdate}
        onAddComment={mockOnAddComment}
      />
    );

    expect(screen.getByText('Encaminhamento 1')).toBeInTheDocument();
    expect(screen.getByText('Descrição 1')).toBeInTheDocument();
    expect(screen.getByText('urgente')).toBeInTheDocument();
  });

  it('permite adicionar comentários', async () => {
    render(
      <ReferralDetails
        referral={mockReferral}
        onUpdate={mockOnUpdate}
        onAddComment={mockOnAddComment}
      />
    );

    const commentButton = screen.getByRole('button', { name: /novo comentário/i });
    await userEvent.click(commentButton);

    const commentInput = screen.getByLabelText(/comentário/i);
    await userEvent.type(commentInput, 'Novo comentário');

    const submitButton = screen.getByRole('button', { name: /enviar/i });
    await userEvent.click(submitButton);

    expect(mockOnAddComment).toHaveBeenCalledWith('1', {
      content: 'Novo comentário',
      author: 'current-user'
    });
  });
});
```

### ReferralDashboard

```typescript
describe('ReferralDashboard', () => {
  const mockMetrics = {
    total: 10,
    pending: 4,
    inProgress: 3,
    completed: 2,
    cancelled: 1,
    averageResolutionTime: 48,
    priorityDistribution: {
      low: 2,
      medium: 3,
      high: 4,
      urgent: 1
    },
    typeDistribution: {
      academic: 5,
      administrative: 3,
      technical: 2,
      other: 0
    }
  };

  const mockRecentReferrals = [
    {
      id: '1',
      title: 'Encaminhamento 1',
      description: 'Descrição 1',
      type: 'academic',
      status: 'pending',
      priority: 'high',
      assignedTo: 'professor.artes',
      createdBy: 'admin',
      dueDate: new Date('2024-04-15'),
      attachments: [],
      comments: [],
      history: [],
      tags: ['urgente'],
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  const mockOnReferralSelect = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza métricas corretamente', () => {
    render(
      <ReferralDashboard
        metrics={mockMetrics}
        recentReferrals={mockRecentReferrals}
        onReferralSelect={mockOnReferralSelect}
      />
    );

    expect(screen.getByText('10')).toBeInTheDocument(); // Total
    expect(screen.getByText('4')).toBeInTheDocument(); // Pendentes
    expect(screen.getByText('3')).toBeInTheDocument(); // Em andamento
    expect(screen.getByText('2')).toBeInTheDocument(); // Concluídos
  });

  it('exibe gráficos de distribuição', () => {
    render(
      <ReferralDashboard
        metrics={mockMetrics}
        recentReferrals={mockRecentReferrals}
        onReferralSelect={mockOnReferralSelect}
      />
    );

    // Distribuição por prioridade
    expect(screen.getByText('Alta: 4')).toBeInTheDocument();
    expect(screen.getByText('Média: 3')).toBeInTheDocument();
    expect(screen.getByText('Baixa: 2')).toBeInTheDocument();
    expect(screen.getByText('Urgente: 1')).toBeInTheDocument();

    // Distribuição por tipo
    expect(screen.getByText('Acadêmico: 5')).toBeInTheDocument();
    expect(screen.getByText('Administrativo: 3')).toBeInTheDocument();
    expect(screen.getByText('Técnico: 2')).toBeInTheDocument();
  });
});
```

### ReferralTimeline

```typescript
describe('ReferralTimeline', () => {
  const mockHistory = [
    {
      id: '1',
      action: 'Criação',
      description: 'Encaminhamento criado',
      author: 'admin',
      previousStatus: undefined,
      newStatus: 'pending',
      createdAt: new Date('2024-04-01'),
      updatedAt: new Date('2024-04-01')
    },
    {
      id: '2',
      action: 'Alteração de Status',
      description: 'Status alterado de pending para in_progress',
      author: 'professor.artes',
      previousStatus: 'pending',
      newStatus: 'in_progress',
      createdAt: new Date('2024-04-02'),
      updatedAt: new Date('2024-04-02')
    }
  ];

  it('renderiza histórico corretamente', () => {
    render(<ReferralTimeline history={mockHistory} />);

    expect(screen.getByText('Criação')).toBeInTheDocument();
    expect(screen.getByText('Alteração de Status')).toBeInTheDocument();
    expect(screen.getByText('Encaminhamento criado')).toBeInTheDocument();
    expect(screen.getByText('Status alterado de pending para in_progress')).toBeInTheDocument();
  });

  it('ordena eventos cronologicamente', () => {
    render(<ReferralTimeline history={mockHistory} />);

    const events = screen.getAllByRole('listitem');
    expect(events[0]).toHaveTextContent('Criação');
    expect(events[1]).toHaveTextContent('Alteração de Status');
  });

  it('formata datas corretamente', () => {
    render(<ReferralTimeline history={mockHistory} />);

    expect(screen.getByText('01/04/2024')).toBeInTheDocument();
    expect(screen.getByText('02/04/2024')).toBeInTheDocument();
  });
});
```

## Hooks

### useReferral

```typescript
describe('useReferral', () => {
  const mockReferral = {
    id: '1',
    title: 'Encaminhamento 1',
    // ... outros campos
  };

  beforeEach(() => {
    jest.spyOn(referralService, 'getReferral').mockResolvedValue({
      data: mockReferral,
      status: 200
    });
  });

  it('retorna dados do encaminhamento', async () => {
    const { result } = renderHook(() => useReferral('1'));

    await waitFor(() => {
      expect(result.current.referral).toEqual(mockReferral);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
    });
  });

  it('trata erros corretamente', async () => {
    const error = new Error('Erro ao buscar encaminhamento');
    jest.spyOn(referralService, 'getReferral').mockRejectedValue(error);

    const { result } = renderHook(() => useReferral('1'));

    await waitFor(() => {
      expect(result.current.referral).toBeNull();
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toEqual(error);
    });
  });
});
```

## Serviços

### ReferralService

```typescript
describe('ReferralService', () => {
  const mockReferral = {
    id: '1',
    title: 'Encaminhamento 1',
    // ... outros campos
  };

  beforeEach(() => {
    jest.spyOn(api, 'get').mockResolvedValue({ data: mockReferral });
    jest.spyOn(api, 'post').mockResolvedValue({ data: mockReferral });
    jest.spyOn(api, 'put').mockResolvedValue({ data: mockReferral });
    jest.spyOn(api, 'delete').mockResolvedValue({ data: { success: true } });
  });

  it('cria encaminhamento', async () => {
    const response = await referralService.createReferral(mockReferral);
    expect(response.data).toEqual(mockReferral);
    expect(api.post).toHaveBeenCalledWith('/api/referrals', mockReferral);
  });

  it('atualiza encaminhamento', async () => {
    const response = await referralService.updateReferral('1', { status: 'completed' });
    expect(response.data).toEqual(mockReferral);
    expect(api.put).toHaveBeenCalledWith('/api/referrals/1', { status: 'completed' });
  });

  it('exclui encaminhamento', async () => {
    const response = await referralService.deleteReferral('1');
    expect(response.data).toEqual({ success: true });
    expect(api.delete).toHaveBeenCalledWith('/api/referrals/1');
  });
});
```

## Cache

### CacheService

```typescript
describe('CacheService', () => {
  beforeEach(() => {
    cacheService.clear();
  });

  it('armazena e recupera dados do cache', async () => {
    const key = 'test-key';
    const value = { id: 1, name: 'test' };

    await cacheService.set(key, value);
    const cached = await cacheService.get(key);

    expect(cached).toEqual(value);
  });

  it('respeita TTL', async () => {
    const key = 'test-key';
    const value = { id: 1, name: 'test' };

    await cacheService.set(key, value, 100); // 100ms TTL
    await new Promise(resolve => setTimeout(resolve, 150));
    const cached = await cacheService.get(key);

    expect(cached).toBeNull();
  });

  it('invalida cache', async () => {
    const key = 'test-key';
    const value = { id: 1, name: 'test' };

    await cacheService.set(key, value);
    await cacheService.invalidate(key);
    const cached = await cacheService.get(key);

    expect(cached).toBeNull();
  });
});
```

## Cobertura

### Métricas
- Cobertura de código: 85%
- Componentes testados: 100%
- Casos de teste: 150+

### Áreas de Cobertura
1. Renderização
   - Componentes renderizam corretamente
   - Props são aplicadas
   - Estados iniciais são corretos

2. Interação
   - Eventos de usuário
   - Atualizações de estado
   - Callbacks

3. Integração
   - Comunicação entre componentes
   - Fluxo de dados
   - Navegação

4. Acessibilidade
   - Roles ARIA
   - Navegação por teclado
   - Contraste de cores

5. Responsividade
   - Layout em diferentes breakpoints
   - Adaptação de conteúdo
   - Performance

## Scripts

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:e2e": "cypress run",
    "test:e2e:open": "cypress open"
  }
}
```

## Configuração

```javascript
// jest.config.js
module.exports = {
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testEnvironment: 'jsdom',
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/index.tsx',
  ],
};
```
