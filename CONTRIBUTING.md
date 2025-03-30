# Guia de Contribuição

## Visão Geral
Este documento fornece diretrizes para contribuir com o projeto Innerview. Ele cobre o processo de desenvolvimento, padrões de código e fluxo de trabalho.

## Começando

### Pré-requisitos
- Node.js 18.x ou superior
- npm 9.x ou superior
- Git

### Configuração do Ambiente
1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/innerview.git
   cd innerview
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Configure as variáveis de ambiente:
   ```bash
   cp .env.example .env.local
   ```

4. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

## Fluxo de Trabalho

### 1. Criando uma Branch
- Crie uma branch a partir da `main`:
  ```bash
  git checkout -b feature/nome-da-feature
  ```
- Use prefixos descritivos:
  - `feature/`: Novas funcionalidades
  - `fix/`: Correções de bugs
  - `docs/`: Documentação
  - `style/`: Formatação e estilo
  - `refactor/`: Refatoração de código
  - `test/`: Testes
  - `chore/`: Manutenção

### 2. Desenvolvimento
- Siga os padrões de código estabelecidos
- Escreva testes para novas funcionalidades
- Mantenha os commits atômicos e descritivos
- Atualize a documentação quando necessário

### 3. Commit
- Use mensagens de commit descritivas:
  ```
  tipo(escopo): descrição

  [corpo opcional]

  [rodapé opcional]
  ```
- Tipos de commit:
  - `feat`: Nova funcionalidade
  - `fix`: Correção de bug
  - `docs`: Documentação
  - `style`: Formatação
  - `refactor`: Refatoração
  - `test`: Testes
  - `chore`: Manutenção

### 4. Pull Request
1. Atualize sua branch com a `main`:
   ```bash
   git checkout main
   git pull
   git checkout feature/nome-da-feature
   git rebase main
   ```

2. Execute os testes:
   ```bash
   npm test
   ```

3. Verifique a formatação:
   ```bash
   npm run format
   ```

4. Crie um Pull Request:
   - Use o template fornecido
   - Descreva as mudanças
   - Liste os testes realizados
   - Adicione screenshots se necessário

## Padrões de Código

### TypeScript
- Use tipos explícitos para props e estados
- Evite o uso de `any`
- Use interfaces para objetos complexos
- Use enums para valores constantes
- Use tipos estritos
- Evite `any`
- Documente interfaces complexas
- Use enums para valores constantes

### React
- Use componentes funcionais
- Implemente memoização quando necessário
- Siga o padrão de composição
- Use hooks personalizados para lógica reutilizável

### Testes
- Mantenha cobertura mínima de 90%
- Use mocks para dependências externas
- Siga o padrão AAA (Arrange, Act, Assert)
- Teste casos de erro

### Estilos
- Use Material UI para componentes base
- Use Tailwind para estilos customizados
- Siga o sistema de design
- Mantenha consistência visual

## Documentação

### Código
- Documente funções complexas
- Use JSDoc para tipos
- Mantenha comentários atualizados
- Exclua código morto

### Componentes
- Documente props
- Forneça exemplos de uso
- Descreva comportamentos
- Liste dependências

### API
- Mantenha a documentação atualizada
- Documente mudanças
- Forneça exemplos
- Liste limitações

## Ferramentas

### ESLint
```json
{
  "extends": [
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended"
  ]
}
```

### Prettier
```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5"
}
```

### Jest
```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
}
```

## CI/CD

### Pipeline
1. Lint
2. Testes
3. Build
4. Deploy

### Ambientes
- `development`: Desenvolvimento local
- `staging`: Testes de integração
- `production`: Produção

## Suporte

### Comunicação
- Use o sistema de issues do GitHub
- Participe das discussões
- Mantenha o tom profissional
- Seja construtivo

### Recursos
- [Documentação](docs/)
- [API](docs/api.md)
- [Componentes](docs/componentes-testes.md)
- [Desafios](docs/desafios-solucoes.md)

## Licença
Este projeto está licenciado sob a MIT License - veja o arquivo [LICENSE](LICENSE) para detalhes. 