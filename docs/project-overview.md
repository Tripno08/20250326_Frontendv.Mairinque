# Visão Geral do Projeto Innerview

## O Que é o Innerview

Innerview é uma plataforma educacional avançada focada em intervenções, monitoramento e suporte ao framework RTI/MTSS (Response to Intervention/Multi-Tiered System of Supports). O sistema foi projetado para auxiliar instituições educacionais na implementação de um sistema estruturado de suporte aos estudantes, permitindo identificação precoce de necessidades, intervenções baseadas em evidências e monitoramento contínuo de progresso.

## Objetivos do Projeto

1. **Facilitar a Implementação de RTI/MTSS**
   - Fornecer ferramentas estruturadas para cada nível de intervenção
   - Automatizar fluxos de trabalho para equipes educacionais
   - Centralizar dados para tomada de decisão baseada em evidências

2. **Melhorar o Monitoramento de Estudantes**
   - Rastrear progresso acadêmico e comportamental
   - Identificar precocemente estudantes que precisam de suporte
   - Visualizar tendências e padrões em nível individual e de grupo

3. **Otimizar Recursos Educacionais**
   - Direcionar intervenções para onde são mais necessárias
   - Monitorar eficácia de diferentes abordagens
   - Facilitar colaboração entre profissionais

4. **Fornecer Insights Acionáveis**
   - Utilizar análise preditiva para identificação de riscos
   - Recomendar intervenções baseadas em dados históricos
   - Quantificar impacto das estratégias implementadas

## Diferenciadores Competitivos

O Innerview foi projetado para superar as limitações de soluções concorrentes como Branching Minds, PanoramaEd e AIMSweb, oferecendo:

1. **Visualizações de Dados Superiores**
   - Gráficos e dashboards interativos e customizáveis
   - Visualizações específicas para o contexto RTI/MTSS
   - Métricas e KPIs relevantes para educadores

2. **Experiência de Usuário Sofisticada**
   - Interfaces drag-and-drop para planejamento de intervenções
   - Design moderno e acessível
   - Micro-interações e feedback visual aprimorado

3. **Capacidades Offline Robustas**
   - Funcionalidade mesmo sem conexão à internet
   - Sincronização inteligente quando a conexão é restaurada
   - Ferramentas otimizadas para trabalho em campo

4. **Insights de IA Específicos para Educação**
   - Modelos preditivos para risco acadêmico
   - Recomendações personalizadas baseadas em perfil
   - Análise de padrões em dados educacionais

## Principais Características

### 1. Sistema RTI/MTSS Completo
- Visualização e gestão dos três níveis de intervenção
- Planejador visual de intervenções com biblioteca baseada em evidências
- Monitoramento de progresso com metas e objetivos mensuráveis

### 2. Dashboard Multinível
- Visões específicas para administradores, professores e especialistas
- Drill-down de rede → escola → turma → aluno
- Personalização por usuário com widgets arrastáveis

### 3. Avaliações e Rastreios
- Catálogo de instrumentos por área e idade
- Sistema de pontuação e interpretação automática
- Ciclos de avaliação programáveis com calendário integrado

### 4. Gestão de Equipes e Colaboração
- Formação de equipes multidisciplinares
- Agendamento e documentação de reuniões
- Sistema de encaminhamentos e notificações

### 5. Análise Preditiva e Insights
- Identificação precoce de riscos acadêmicos
- Recomendações de intervenções personalizadas
- Alertas preventivos baseados em padrões

### 6. Integrações Educacionais
- Compatibilidade LTI com sistemas LMS
- Integração com Microsoft Education e Google Classroom
- API extensível para conexão com sistemas existentes

## Tecnologias Principais

### Frontend
- Next.js 15.x com App Router
- TypeScript 5.x
- Material UI 6.x (customizado)
- React Query e Zustand para gerenciamento de estado
- D3.js e Recharts para visualizações

### Backend
- NestJS 10.x
- TypeScript
- Prisma ORM
- MySQL 8.x
- Redis para cache

## Usuários-Alvo

1. **Administradores Educacionais**
   - Diretores e coordenadores de rede
   - Gestores de educação especial
   - Administradores de distrito/rede

2. **Equipe Pedagógica**
   - Professores de sala regular
   - Especialistas em educação especial
   - Psicólogos e orientadores educacionais

3. **Equipe de Suporte**
   - Fonoaudiólogos
   - Terapeutas ocupacionais
   - Assistentes sociais escolares

4. **Famílias**
   - Responsáveis por estudantes
   - Acesso a portal específico com informações relevantes

## Fases do Projeto

### Fase 1: Fundação (Concluída)
- Definição de requisitos e arquitetura
- Modelagem de dados com Prisma
- Prototipagem de interfaces principais

### Fase 2: Desenvolvimento Frontend (Atual)
- Implementação do design system estendido
- Desenvolvimento de componentes core
- Criação de visualizações de dados educacionais

### Fase 3: Desenvolvimento Backend (Paralelo)
- Implementação da API RESTful
- Desenvolvimento de serviços de autenticação e autorização
- Criação de endpoints para todos os recursos

### Fase 4: Integrações e Analytics
- Implementação de conectores LTI
- Desenvolvimento de modelos preditivos
- Integração com sistemas externos

### Fase 5: Refinamento e Lançamento
- Testes de usabilidade com educadores
- Otimização de performance
- Preparação para deploy em produção

## Estado Atual do Projeto

O projeto Innerview está atualmente na Fase 2 (Desenvolvimento Frontend), com:

- Arquitetura definida e documentada
- Schema Prisma completo para o modelo de dados
- Plano detalhado de implementação frontend
- Desenvolvimento de componentes core em andamento

As próximas etapas incluem a finalização dos componentes de visualização avançados, implementação das interfaces drag-and-drop, e integração progressiva com o backend em desenvolvimento.