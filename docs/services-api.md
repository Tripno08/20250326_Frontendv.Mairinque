# Serviços e Hooks da API

## Visão Geral

Este documento descreve os serviços e hooks disponíveis para comunicação com a API do Innerview.

## Serviços

### AuthService

Serviço responsável pela autenticação e gerenciamento de usuários.

```typescript
// Exemplo de uso
import { authService } from '@/services/authService';

// Login
const login = async () => {
  try {
    const response = await authService.login({
      email: 'user@example.com',
      password: 'password123',
    });
    // Tratar resposta
  } catch (error) {
    // Tratar erro
  }
};

// Logout
const logout = async () => {
  try {
    await authService.logout();
    // Redirecionar para login
  } catch (error) {
    // Tratar erro
  }
};

// Verificar autenticação
const isAuthenticated = authService.isAuthenticated();

// Verificar permissões
const isAdmin = authService.hasRole('admin');
```

### AssessmentService

Serviço responsável pelo gerenciamento de avaliações.

```typescript
// Exemplo de uso
import { assessmentService } from '@/services/assessmentService';

// Listar avaliações
const listAssessments = async () => {
  try {
    const response = await assessmentService.listAssessments({
      type: 'quiz',
      status: 'published',
      page: 1,
      limit: 10,
    });
    // Tratar resposta
  } catch (error) {
    // Tratar erro
  }
};

// Criar avaliação
const createAssessment = async () => {
  try {
    const response = await assessmentService.createAssessment({
      title: 'Nova Avaliação',
      description: 'Descrição da avaliação',
      type: 'quiz',
      status: 'draft',
      startDate: '2024-03-26',
      endDate: '2024-03-27',
      questions: [],
    });
    // Tratar resposta
  } catch (error) {
    // Tratar erro
  }
};
```

## Hooks

### useAssessments

Hook para gerenciar operações com avaliações.

```typescript
// Exemplo de uso
import { useAssessments } from '@/hooks/useAssessments';

const AssessmentList = () => {
  const { data, isLoading, error } = useAssessments({
    type: 'quiz',
    status: 'published',
    page: 1,
    limit: 10,
  });

  if (isLoading) return <div>Carregando...</div>;
  if (error) return <div>Erro ao carregar avaliações</div>;

  return (
    <div>
      {data?.data.map((assessment) => (
        <div key={assessment.id}>{assessment.title}</div>
      ))}
    </div>
  );
};
```

### useAssessment

Hook para obter uma avaliação específica.

```typescript
// Exemplo de uso
import { useAssessment } from '@/hooks/useAssessments';

const AssessmentDetail = ({ id }: { id: string }) => {
  const { data, isLoading, error } = useAssessment(id);

  if (isLoading) return <div>Carregando...</div>;
  if (error) return <div>Erro ao carregar avaliação</div>;

  return (
    <div>
      <h1>{data?.title}</h1>
      <p>{data?.description}</p>
    </div>
  );
};
```

### useCreateAssessment

Hook para criar uma nova avaliação.

```typescript
// Exemplo de uso
import { useCreateAssessment } from '@/hooks/useAssessments';

const CreateAssessment = () => {
  const { mutate, isLoading, error } = useCreateAssessment();

  const handleSubmit = async (data: Omit<Assessment, 'id'>) => {
    try {
      await mutate(data);
      // Redirecionar ou mostrar mensagem de sucesso
    } catch (error) {
      // Tratar erro
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Formulário */}
    </form>
  );
};
```

### useUpdateAssessment

Hook para atualizar uma avaliação existente.

```typescript
// Exemplo de uso
import { useUpdateAssessment } from '@/hooks/useAssessments';

const EditAssessment = ({ id }: { id: string }) => {
  const { mutate, isLoading, error } = useUpdateAssessment();

  const handleSubmit = async (data: Partial<Assessment>) => {
    try {
      await mutate({ id, assessment: data });
      // Redirecionar ou mostrar mensagem de sucesso
    } catch (error) {
      // Tratar erro
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Formulário */}
    </form>
  );
};
```

### useDeleteAssessment

Hook para excluir uma avaliação.

```typescript
// Exemplo de uso
import { useDeleteAssessment } from '@/hooks/useAssessments';

const DeleteAssessment = ({ id }: { id: string }) => {
  const { mutate, isLoading, error } = useDeleteAssessment();

  const handleDelete = async () => {
    try {
      await mutate(id);
      // Redirecionar ou mostrar mensagem de sucesso
    } catch (error) {
      // Tratar erro
    }
  };

  return (
    <button onClick={handleDelete} disabled={isLoading}>
      Excluir
    </button>
  );
};
```

### usePublishAssessment

Hook para publicar uma avaliação.

```typescript
// Exemplo de uso
import { usePublishAssessment } from '@/hooks/useAssessments';

const PublishAssessment = ({ id }: { id: string }) => {
  const { mutate, isLoading, error } = usePublishAssessment();

  const handlePublish = async () => {
    try {
      await mutate(id);
      // Mostrar mensagem de sucesso
    } catch (error) {
      // Tratar erro
    }
  };

  return (
    <button onClick={handlePublish} disabled={isLoading}>
      Publicar
    </button>
  );
};
```

### useCloseAssessment

Hook para fechar uma avaliação.

```typescript
// Exemplo de uso
import { useCloseAssessment } from '@/hooks/useAssessments';

const CloseAssessment = ({ id }: { id: string }) => {
  const { mutate, isLoading, error } = useCloseAssessment();

  const handleClose = async () => {
    try {
      await mutate(id);
      // Mostrar mensagem de sucesso
    } catch (error) {
      // Tratar erro
    }
  };

  return (
    <button onClick={handleClose} disabled={isLoading}>
      Fechar
    </button>
  );
};
```

### useAssessmentResults

Hook para obter resultados de uma avaliação.

```typescript
// Exemplo de uso
import { useAssessmentResults } from '@/hooks/useAssessments';

const AssessmentResults = ({ id }: { id: string }) => {
  const { data, isLoading, error } = useAssessmentResults(id);

  if (isLoading) return <div>Carregando...</div>;
  if (error) return <div>Erro ao carregar resultados</div>;

  return (
    <div>
      {data?.map((result) => (
        <div key={result.id}>
          <p>Pontuação: {result.score}/{result.maxScore}</p>
          <p>Data de envio: {new Date(result.submittedAt).toLocaleDateString()}</p>
        </div>
      ))}
    </div>
  );
};
```

### useAssessmentStats

Hook para obter estatísticas de avaliações.

```typescript
// Exemplo de uso
import { useAssessmentStats } from '@/hooks/useAssessments';

const AssessmentStats = () => {
  const { data, isLoading, error } = useAssessmentStats();

  if (isLoading) return <div>Carregando...</div>;
  if (error) return <div>Erro ao carregar estatísticas</div>;

  return (
    <div>
      <p>Total de avaliações: {data?.totalAssessments}</p>
      <p>Total de alunos: {data?.totalStudents}</p>
      <p>Média de pontuação: {data?.averageScore}%</p>
      <p>Taxa de conclusão: {data?.completionRate}%</p>
    </div>
  );
};
```

### useSubmitAssessment

Hook para enviar respostas de uma avaliação.

```typescript
// Exemplo de uso
import { useSubmitAssessment } from '@/hooks/useAssessments';

const SubmitAssessment = ({ id }: { id: string }) => {
  const { mutate, isLoading, error } = useSubmitAssessment();

  const handleSubmit = async (answers: { questionId: string; answer: string }[]) => {
    try {
      await mutate({ id, answers });
      // Mostrar mensagem de sucesso
    } catch (error) {
      // Tratar erro
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Formulário */}
    </form>
  );
};
```

## Tratamento de Erros

Todos os hooks e serviços retornam erros no formato `ApiError`:

```typescript
interface ApiError {
  status: number;
  message: string;
  errors?: string[];
}
```

Exemplo de tratamento de erro:

```typescript
const { error } = useAssessments(filters);

if (error) {
  return (
    <div>
      <p>Erro: {error.message}</p>
      {error.errors?.map((err, index) => (
        <p key={index}>{err}</p>
      ))}
    </div>
  );
}
```

## Cache e Revalidação

Os hooks utilizam React Query para gerenciamento de cache e revalidação automática. As principais configurações são:

- `staleTime`: 5 minutos
- `cacheTime`: 30 minutos
- `refetchOnWindowFocus`: false
- `refetchOnMount`: true
- `refetchOnReconnect`: true

## Boas Práticas

1. **Tratamento de Loading**
   - Sempre verifique o estado `isLoading` antes de renderizar dados
   - Use componentes de loading apropriados

2. **Tratamento de Erros**
   - Implemente tratamento de erros adequado
   - Mostre mensagens de erro amigáveis ao usuário

3. **Otimização de Performance**
   - Use `enabled` para controlar quando as queries devem ser executadas
   - Implemente paginação quando necessário

4. **Segurança**
   - Não exponha dados sensíveis
   - Implemente validação de dados no frontend

5. **Acessibilidade**
   - Forneça feedback adequado para estados de loading e erro
   - Mantenha a interface responsiva durante operações assíncronas

## Referências

- [React Query Documentation](https://tanstack.com/query/latest)
- [Axios Documentation](https://axios-http.com/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)