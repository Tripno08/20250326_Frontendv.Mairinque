# Innerview - Plataforma RTI/MTSS

Plataforma de gestão e monitoramento de intervenções educacionais baseada no framework RTI/MTSS (Response to Intervention/Multi-Tiered System of Supports).

## Tecnologias Utilizadas

- Next.js 15.x
- TypeScript
- Material UI
- Zustand (Gerenciamento de Estado)
- React Query (Gerenciamento de Dados)
- Framer Motion (Animações)
- Recharts (Visualizações)
- D3.js (Visualizações Avançadas)

## Pré-requisitos

- Node.js 18.x ou superior
- npm 9.x ou superior

## Instalação

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

O aplicativo estará disponível em `http://localhost:3000`.

## Estrutura do Projeto

```
src/
├── app/              # Páginas e rotas (App Router)
├── components/       # Componentes reutilizáveis
├── lib/             # Utilitários e configurações
├── hooks/           # Hooks personalizados
├── services/        # Serviços e APIs
├── store/           # Estado global (Zustand)
├── styles/          # Estilos e temas
├── types/           # Tipos TypeScript
└── utils/           # Funções utilitárias
```

## Scripts Disponíveis

- `npm run dev`: Inicia o servidor de desenvolvimento
- `npm run build`: Cria a build de produção
- `npm start`: Inicia o servidor de produção
- `npm run lint`: Executa o linter
- `npm run type-check`: Verifica os tipos TypeScript

## Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.
