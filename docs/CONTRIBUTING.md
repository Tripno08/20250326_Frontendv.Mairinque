# Guia de Contribuição

## Introdução

Bem-vindo ao guia de contribuição do sistema de encaminhamentos! Este documento fornece as diretrizes necessárias para contribuir com o projeto de forma efetiva e consistente.

## Primeiros Passos

### 1. Ambiente de Desenvolvimento

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/seu-repositorio.git

# Instale as dependências
npm install

# Execute o projeto localmente
npm run dev
```

### 2. Estrutura do Projeto

```
src/
  ├── components/     # Componentes React
  ├── hooks/         # Hooks personalizados
  ├── services/      # Serviços e APIs
  ├── contexts/      # Contextos React
  ├── types/         # Tipos TypeScript
  ├── utils/         # Utilitários
  └── api/           # Configuração de API
```

## Fluxo de Trabalho

### 1. Issues

- Verifique issues existentes antes de criar uma nova
- Use os templates disponíveis
- Inclua labels apropriadas
- Descreva claramente o problema ou feature

### 2. Branches

```bash
# Nomenclatura
feature/nome-da-feature
bugfix/descricao-do-bug
hotfix/correcao-urgente

# Exemplo
git checkout -b feature/referral-builder
```

### 3. Commits

```bash
# Formato
type(scope): description

# Exemplos
feat(referral): add builder component
fix(api): handle error in service
docs(readme): update setup instructions
```

### 4. Pull Requests

- Use o template fornecido
- Vincule à issue relacionada
- Inclua testes
- Atualize a documentação
- Solicite review

## Padrões de Código

### 1. TypeScript

```typescript
// Interfaces em arquivos separados
interface ComponentProps {
  data: DataType;
  onAction: (data: ActionData) => void;
}

// Tipos explícitos
const Component: React.FC<ComponentProps> = ({
  data,
  onAction
}) => {
  // ...
};
```

### 2. React

```typescript
// Componentes funcionais
import React from 'react';
import { Container } from './styles';

export const Component: React.FC = () => {
  // Hooks no topo
  const [state, setState] = useState();

  // Handlers com useCallback
  const handleAction = useCallback(() => {
    // ...
  }, []);

  return (
    <Container>
      {/* JSX */}
    </Container>
  );
};
```

### 3. Estilos

```typescript
// Styled Components com Emotion
import styled from '@emotion/styled';

export const Container = styled.div`
  display: flex;
  padding: ${({ theme }) => theme.spacing(2)};

  // Responsividade
  ${({ theme }) => theme.breakpoints.down('sm')} {
    flex-direction: column;
  }
`;
```

## Testes

### 1. Unitários

```typescript
describe('Component', () => {
  it('should render correctly', () => {
    render(<Component />);
    expect(screen.getByText('Title')).toBeInTheDocument();
  });

  it('should handle action', () => {
    const onAction = jest.fn();
    render(<Component onAction={onAction} />);

    fireEvent.click(screen.getByRole('button'));
    expect(onAction).toHaveBeenCalled();
  });
});
```

### 2. Integração

```typescript
describe('ReferralFlow', () => {
  it('should complete referral creation', async () => {
    render(<ReferralFlow />);

    // Preencher formulário
    await userEvent.type(
      screen.getByLabelText('Title'),
      'Test Referral'
    );

    // Submeter
    await userEvent.click(screen.getByRole('button', {
      name: /submit/i
    }));

    // Verificar resultado
    expect(await screen.findByText('Success')).toBeInTheDocument();
  });
});
```

## Documentação

### 1. Componentes

```typescript
/**
 * Componente para construção de encaminhamentos.
 *
 * @component
 * @example
 * ```tsx
 * <ReferralBuilder
 *   onSubmit={handleSubmit}
 *   onCancel={handleCancel}
 * />
 * ```
 */
export const ReferralBuilder: React.FC<ReferralBuilderProps> = ({
  onSubmit,
  onCancel
}) => {
  // ...
};
```

### 2. Hooks

```typescript
/**
 * Hook para gerenciar estado de encaminhamentos.
 *
 * @param initialFilters - Filtros iniciais
 * @returns Estado e handlers do encaminhamento
 *
 * @example
 * ```tsx
 * const { referrals, loading, error } = useReferrals({
 *   status: 'pending'
 * });
 * ```
 */
export function useReferrals(initialFilters: FilterParams) {
  // ...
}
```

### 3. Serviços

```typescript
/**
 * Serviço para operações de encaminhamento.
 *
 * @class
 * @example
 * ```tsx
 * const service = new ReferralService(api);
 * await service.createReferral(data);
 * ```
 */
export class ReferralService {
  // ...
}
```

## Revisão de Código

### Checklist

1. Funcionalidade
   - [ ] Atende aos requisitos
   - [ ] Trata erros adequadamente
   - [ ] É performático

2. Código
   - [ ] Segue padrões do projeto
   - [ ] Está tipado corretamente
   - [ ] É testável

3. Testes
   - [ ] Cobrem casos principais
   - [ ] São determinísticos
   - [ ] São legíveis

4. Documentação
   - [ ] Está atualizada
   - [ ] É clara e completa
   - [ ] Inclui exemplos

## CI/CD

### 1. Pipeline

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v2

    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '16'

    - name: Install dependencies
      run: npm ci

    - name: Run tests
      run: npm test

    - name: Build
      run: npm run build
```

### 2. Verificações

- Lint
- Testes
- Build
- Cobertura
- Análise estática

## Releases

### 1. Versionamento

```bash
# Formato
MAJOR.MINOR.PATCH

# Exemplo
1.2.3
```

### 2. Changelog

```markdown
## [1.2.0] - 2024-03-26

### Adicionado
- Componente ReferralBuilder
- Hook useReferralMetrics
- Documentação de tipos

### Corrigido
- Bug na validação de datas
- Performance na listagem

### Alterado
- Refatoração do ReferralService
- Atualização de dependências
```

## Suporte

### Canais

1. Issues do GitHub
2. Discussões
3. Chat da equipe
4. Email de suporte

### Reportando Problemas

1. Descreva o problema
2. Forneça passos para reproduzir
3. Inclua logs e screenshots
4. Mencione ambiente e versão

## Licença

Este projeto está licenciado sob a [MIT License](LICENSE).

## Código de Conduta

### Nosso Compromisso

Manter um ambiente respeitoso e profissional para todos os contribuidores.

### Comportamento Esperado

- Comunicação construtiva
- Respeito às diferenças
- Foco na qualidade
- Colaboração efetiva

### Comportamento Inaceitável

- Assédio ou discriminação
- Linguagem ofensiva
- Spam ou trolling
- Violação de privacidade

## Agradecimentos

Agradecemos a todos os contribuidores que ajudam a melhorar este projeto!
