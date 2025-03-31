# Biblioteca de Intervenções Baseadas em Evidências

Este diretório contém os componentes para a biblioteca de intervenções baseadas em evidências, que permite visualizar, filtrar e selecionar intervenções educacionais.

## Componentes

### InterventionCard

O componente `InterventionCard` exibe informações detalhadas sobre uma intervenção individual.

```tsx
import { InterventionCard } from './InterventionCard';

<InterventionCard
  intervention={intervention}
  onClick={intervention => console.log(intervention)}
/>;
```

#### Props

- `intervention`: Objeto contendo os dados da intervenção
- `onClick`: Função chamada quando o card é clicado
- `className`: Classes CSS adicionais (opcional)

### InterventionGallery

O componente `InterventionGallery` exibe uma grade de intervenções com funcionalidades de filtragem e busca.

```tsx
import { InterventionGallery } from './InterventionGallery';

<InterventionGallery
  interventions={interventions}
  onInterventionSelect={intervention => console.log(intervention)}
/>;
```

#### Props

- `interventions`: Array de objetos de intervenção
- `onInterventionSelect`: Função chamada quando uma intervenção é selecionada
- `className`: Classes CSS adicionais (opcional)

## Tipos

### Intervention

```tsx
interface Intervention {
  id: string;
  title: string;
  description: string;
  tier: 'Tier 1' | 'Tier 2' | 'Tier 3';
  domain: 'Acadêmico' | 'Comportamental' | 'Social' | 'Emocional' | 'Cognitivo' | 'Comunicação';
  evidenceLevel: 'Alta Evidência' | 'Média Evidência' | 'Baixa Evidência' | 'Em Estudo';
  duration: string;
  materials: string[];
  steps: string[];
  effectiveness: {
    rating: number;
    studies: number;
    description: string;
  };
  imageUrl?: string;
  tags: string[];
}
```

### InterventionFilters

```tsx
interface InterventionFilters {
  tier?: InterventionTier;
  domain?: InterventionDomain;
  evidenceLevel?: EvidenceLevel;
  duration?: string;
  searchTerm?: string;
}
```

## Funcionalidades

- Visualização em cards com informações detalhadas
- Filtragem por nível (tier), domínio e nível de evidência
- Busca por texto em título, descrição e tags
- Animações suaves de transição
- Design responsivo
- Feedback visual para interações
- Suporte a imagens
- Indicadores visuais de nível de evidência

## Dependências

- React
- TypeScript
- Tailwind CSS
- Framer Motion
- @tailwindcss/aspect-ratio
- @tailwindcss/forms

## Exemplo de Uso

```tsx
import { InterventionExample } from './InterventionExample';

export default function InterventionsPage() {
  return <InterventionExample />;
}
```
