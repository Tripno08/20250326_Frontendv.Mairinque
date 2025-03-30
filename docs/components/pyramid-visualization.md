# PyramidVisualization

O componente `PyramidVisualization` é uma visualização interativa da distribuição de alunos nos diferentes níveis do modelo RTI/MTSS (Response to Intervention/Multi-Tiered System of Supports).

## Características

- Visualização em forma de pirâmide usando D3.js
- Animações suaves com Framer Motion
- Interatividade com hover e clique
- Totalmente responsivo
- Acessível
- Tipado com TypeScript

## Props

```typescript
interface PyramidVisualizationProps {
  data: PyramidData;
  onLevelClick?: (level: RTILevel) => void;
  className?: string;
  width?: number;
  height?: number;
}
```

### data
Objeto contendo os dados da pirâmide:
```typescript
interface PyramidData {
  totalStudents: number;
  levels: RTILevel[];
}

interface RTILevel {
  id: string;
  name: string;
  description: string;
  color: string;
  percentage: number;
  students: number;
  interventions: string[];
}
```

### onLevelClick
Função opcional chamada quando um nível é clicado.

### className
Classe CSS opcional para estilização adicional.

### width
Largura opcional do componente (padrão: 800).

### height
Altura opcional do componente (padrão: 600).

## Exemplo de Uso

```tsx
import { PyramidVisualization } from '@/components/RTI/PyramidVisualization';

const data = {
  totalStudents: 1000,
  levels: [
    {
      id: 'tier1',
      name: 'Tier 1 - Instrução Universal',
      description: 'Instrução de alta qualidade para todos os alunos',
      color: '#4CAF50',
      percentage: 80,
      students: 800,
      interventions: [
        'Instrução diferenciada',
        'Monitoramento contínuo',
        'Feedback imediato',
      ],
    },
    // ... outros níveis
  ],
};

function MyComponent() {
  const handleLevelClick = (level) => {
    console.log('Nível selecionado:', level);
  };

  return (
    <PyramidVisualization
      data={data}
      onLevelClick={handleLevelClick}
      width={800}
      height={600}
    />
  );
}
```

## Funcionalidades

### 1. Visualização
- Representação visual dos níveis RTI/MTSS
- Cores diferentes para cada nível
- Exibição de porcentagens e número de alunos
- Layout responsivo

### 2. Interatividade
- Hover effect nos níveis
- Clique para ver detalhes
- Modal com informações detalhadas
- Animações suaves

### 3. Acessibilidade
- Roles ARIA apropriados
- Suporte a navegação por teclado
- Contraste adequado
- Textos descritivos

### 4. Performance
- Otimização de renderização
- Animações eficientes
- Responsividade suave
- Cache de dados

## Testes

O componente inclui testes abrangentes:
- Renderização básica
- Interatividade
- Acessibilidade
- Responsividade
- Animações

## Dependências

- D3.js para visualização
- Framer Motion para animações
- Material UI para componentes base
- TypeScript para tipagem

## Boas Práticas

1. **Dados**
   - Forneça dados completos e válidos
   - Mantenha as porcentagens somando 100%
   - Use cores contrastantes

2. **Interatividade**
   - Implemente handlers de eventos
   - Forneça feedback visual
   - Mantenha a performance

3. **Acessibilidade**
   - Use roles ARIA apropriados
   - Mantenha contraste adequado
   - Forneça textos alternativos

4. **Responsividade**
   - Teste em diferentes tamanhos
   - Mantenha a legibilidade
   - Adapte o layout

## Troubleshooting

### Problemas Comuns

1. **Dados não exibidos**
   - Verifique o formato dos dados
   - Confirme as porcentagens
   - Valide as cores

2. **Interatividade não funcionando**
   - Verifique os handlers
   - Confirme os eventos
   - Teste a acessibilidade

3. **Performance lenta**
   - Otimize as animações
   - Reduza re-renders
   - Use memoização

### Soluções

1. **Dados**
   ```typescript
   // Validação de dados
   const validateData = (data: PyramidData) => {
     const totalPercentage = data.levels.reduce(
       (sum, level) => sum + level.percentage,
       0
     );
     return Math.abs(totalPercentage - 100) < 0.01;
   };
   ```

2. **Performance**
   ```typescript
   // Memoização de cálculos
   const memoizedDimensions = useMemo(
     () => calculatePyramidDimensions(width, height),
     [width, height]
   );
   ```

3. **Acessibilidade**
   ```typescript
   // Roles ARIA
   <div
     role="img"
     aria-label="Visualização da pirâmide RTI/MTSS"
   >
     {/* conteúdo */}
   </div>
   ```

## Referências

- [D3.js Documentation](https://d3js.org/)
- [Framer Motion](https://www.framer.com/motion/)
- [Material UI](https://mui.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) 