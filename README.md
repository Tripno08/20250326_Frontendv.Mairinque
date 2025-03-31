# Innerview Escola

Sistema de integração com plataformas educacionais.

## Funcionalidades

- Integração com LTI
- Integração com Microsoft Education
- Integração com Google Classroom
- Webhooks para eventos
- Dashboard de monitoramento

## Tecnologias

- React
- TypeScript
- Material-UI
- React Router
- Axios
- Zod

## Requisitos

- Node.js 18+
- npm ou yarn

## Instalação

1. Clone o repositório:
```bash
git clone https://github.com/innerview/escola.git
cd escola
```

2. Instale as dependências:
```bash
npm install
# ou
yarn install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

4. Inicie o servidor de desenvolvimento:
```bash
npm start
# ou
yarn start
```

## Estrutura do Projeto

```
src/
  ├── components/     # Componentes React
  ├── pages/         # Páginas da aplicação
  ├── routes/        # Configuração de rotas
  ├── services/      # Serviços de API
  ├── types/         # Tipos TypeScript
  ├── utils/         # Funções utilitárias
  └── App.tsx        # Componente principal
```

## Configuração

### LTI

1. Configure as credenciais LTI no arquivo `.env`:
```
REACT_APP_LTI_CLIENT_ID=your_lti_client_id
REACT_APP_LTI_CLIENT_SECRET=your_lti_client_secret
REACT_APP_LTI_LAUNCH_URL=your_lti_launch_url
REACT_APP_LTI_PLATFORM_URL=your_lti_platform_url
```

### Microsoft

1. Configure as credenciais Microsoft no arquivo `.env`:
```
REACT_APP_MICROSOFT_CLIENT_ID=your_microsoft_client_id
REACT_APP_MICROSOFT_CLIENT_SECRET=your_microsoft_client_secret
REACT_APP_MICROSOFT_TENANT_ID=your_microsoft_tenant_id
REACT_APP_MICROSOFT_GRAPH_API_VERSION=v1.0
```

### Google

1. Configure as credenciais Google no arquivo `.env`:
```
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id
REACT_APP_GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### Webhook

1. Configure as credenciais Webhook no arquivo `.env`:
```
REACT_APP_WEBHOOK_SECRET=your_webhook_secret
REACT_APP_WEBHOOK_TIMEOUT=5000
REACT_APP_WEBHOOK_RETRY_COUNT=3
```

## Testes

Execute os testes:
```bash
npm test
# ou
yarn test
```

Gere o relatório de cobertura:
```bash
npm test -- --coverage
# ou
yarn test --coverage
```

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/amazing-feature`)
3. Commit suas mudanças (`git commit -m 'Add some amazing feature'`)
4. Push para a branch (`git push origin feature/amazing-feature`)
5. Abra um Pull Request

## Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.
