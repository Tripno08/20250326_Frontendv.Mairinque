# Sistema de Encaminhamentos

<div align="center">

![Logo do Projeto](assets/logo.png)

[![Build Status](https://github.com/seu-usuario/seu-repositorio/workflows/CI/badge.svg)](https://github.com/seu-usuario/seu-repositorio/actions)
[![Coverage Status](https://coveralls.io/repos/github/seu-usuario/seu-repositorio/badge.svg?branch=main)](https://coveralls.io/github/seu-usuario/seu-repositorio?branch=main)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

</div>

## Sobre o Projeto

O Sistema de Encaminhamentos é uma solução moderna e eficiente para gerenciar fluxos de encaminhamentos em ambientes educacionais. Desenvolvido com React, TypeScript e práticas modernas de desenvolvimento, o sistema oferece uma interface intuitiva e recursos avançados para acompanhamento e gestão de encaminhamentos.

### Principais Funcionalidades

- 📝 Criação e edição de encaminhamentos
- 📊 Dashboard com métricas e análises
- 📅 Acompanhamento de prazos
- 👥 Gestão de responsáveis
- 📎 Anexos e documentos
- 💬 Comentários e histórico
- 📱 Interface responsiva
- 🔔 Sistema de notificações

## Começando

### Pré-requisitos

- Node.js 16.x ou superior
- npm 7.x ou superior
- Git

### Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/seu-repositorio.git

# Entre no diretório
cd seu-repositorio

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env
# Edite .env com suas configurações

# Inicie o servidor de desenvolvimento
npm run dev
```

### Configuração

1. Configure o arquivo `.env`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_AUTH_DOMAIN=seu-dominio.auth0.com
NEXT_PUBLIC_AUTH_CLIENT_ID=seu-client-id
```

2. Configure o banco de dados:
```bash
# Execute as migrações
npm run migrate

# (Opcional) Carregue dados de exemplo
npm run seed
```

## Uso

### Criando um Encaminhamento

```typescript
import { ReferralBuilder } from '@/components/referrals';

function CreateReferral() {
  const handleSubmit = async (data: ReferralData) => {
    // Lógica de submissão
  };

  return (
    <ReferralBuilder
      onSubmit={handleSubmit}
      onCancel={() => navigate(-1)}
    />
  );
}
```

### Listando Encaminhamentos

```typescript
import { ReferralList } from '@/components/referrals';
import { useReferrals } from '@/hooks';

function ListReferrals() {
  const { referrals, loading } = useReferrals({
    status: 'pending'
  });

  return (
    <ReferralList
      referrals={referrals}
      loading={loading}
      onSelect={handleSelect}
    />
  );
}
```

### Dashboard

```typescript
import { ReferralDashboard } from '@/components/referrals';
import { useReferralMetrics } from '@/hooks';

function Dashboard() {
  const { metrics } = useReferralMetrics();

  return (
    <ReferralDashboard
      metrics={metrics}
      onReferralSelect={handleSelect}
    />
  );
}
```

## Arquitetura

### Estrutura de Diretórios

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

### Tecnologias

- **Frontend**
  - React
  - TypeScript
  - Emotion (Styled Components)
  - React Query
  - React Router
  - Material UI

- **Qualidade**
  - ESLint
  - Prettier
  - Jest
  - React Testing Library
  - Husky

- **CI/CD**
  - GitHub Actions
  - Docker
  - Vercel

## Documentação

- [Guia de Contribuição](docs/CONTRIBUTING.md)
- [Padrões de Código](docs/padroes-codigo.md)
- [Fluxo de Trabalho](docs/fluxo-trabalho.md)
- [Padrões de Tipagem](docs/padroes-tipagem.md)
- [Arquitetura](docs/architecture.md)
- [API](docs/api.md)
- [Testes](docs/testes.md)

## Roadmap

### v1.0.0 (Atual)
- ✅ CRUD de encaminhamentos
- ✅ Dashboard básico
- ✅ Autenticação
- ✅ Notificações

### v1.1.0 (Próxima)
- 🔄 Filtros avançados
- 🔄 Relatórios personalizados
- 🔄 Integração com email
- 🔄 Melhorias de UX

### v1.2.0 (Futura)
- 📋 Automação de fluxos
- 📋 API pública
- 📋 Apps mobile
- 📋 Analytics avançado

## Contribuindo

Contribuições são sempre bem-vindas! Veja [CONTRIBUTING.md](docs/CONTRIBUTING.md) para saber como começar.

### Reportando Bugs

1. Abra uma [nova issue](https://github.com/seu-usuario/seu-repositorio/issues/new)
2. Descreva o problema detalhadamente
3. Inclua passos para reproduzir
4. Adicione screenshots se possível

### Propondo Melhorias

1. Discuta a mudança em uma issue
2. Fork o repositório
3. Crie uma branch (`git checkout -b feature/sua-feature`)
4. Commit suas mudanças (`git commit -m 'feat: add nova feature'`)
5. Push para a branch (`git push origin feature/sua-feature`)
6. Abra um Pull Request

## Licença

Este projeto está licenciado sob a [MIT License](LICENSE).

## Contato

- **Email**: seu-email@exemplo.com
- **Twitter**: [@seu-usuario](https://twitter.com/seu-usuario)
- **LinkedIn**: [Seu Nome](https://linkedin.com/in/seu-usuario)

## Agradecimentos

- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Material UI](https://mui.com/)
- [React Query](https://react-query.tanstack.com/)
- Todos os contribuidores!
