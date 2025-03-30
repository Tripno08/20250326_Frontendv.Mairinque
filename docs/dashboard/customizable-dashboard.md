# Dashboard Personalizável

## Visão Geral
O Dashboard Personalizável é um componente React que permite aos usuários criar e personalizar layouts de dashboard com widgets arrastáveis e redimensionáveis. O componente utiliza `react-grid-layout` para gerenciar o layout e `framer-motion` para animações suaves.

## Funcionalidades

### Layout Personalizável
- Arrastar e soltar widgets
- Redimensionar widgets
- Modo de edição/visualização
- Persistência automática do layout
- Layout responsivo

### Widgets
- Suporte a múltiplos tipos de widgets
- Configuração personalizada por widget
- Animações suaves
- Estado persistente

### Modo de Edição
- Toggle entre modo de edição e visualização
- Indicadores visuais de tamanho
- Salvamento automático
- Reset para layout padrão

## Uso

### Instalação
```bash
npm install react-grid-layout framer-motion @mui/material @mui/icons-material
```

### Importação
```typescript
import { CustomizableDashboard } from '@/components/dashboard/CustomizableDashboard';
```

### Exemplo Básico
```typescript
const widgets = [
  {
    id: 'widget-1',
    type: 'chart',
    title: 'Gráfico de Desempenho',
    component: <PerformanceChart />,
    defaultConfig: {
      w: 6,
      h: 4,
      minW: 3,
      minH: 2
    }
  }
];

const defaultLayout = {
  id: 'default',
  name: 'Layout Padrão',
  widgets: [
    {
      id: 'widget-1',
      type: 'chart',
      x: 0,
      y: 0,
      w: 6,
      h: 4
    }
  ],
  createdAt: new Date(),
  updatedAt: new Date()
};

function Dashboard() {
  return (
    <CustomizableDashboard
      widgets={widgets}
      defaultLayout={defaultLayout}
      onLayoutChange={(layout) => console.log('Layout alterado:', layout)}
      onLayoutSave={(layout) => console.log('Layout salvo:', layout)}
    />
  );
}
```

## Props

### CustomizableDashboardProps
```typescript
interface CustomizableDashboardProps {
  widgets: DashboardWidget[];
  defaultLayout?: DashboardLayout;
  onLayoutChange?: (layout: DashboardLayout) => void;
  onLayoutSave?: (layout: DashboardLayout) => void;
  isEditable?: boolean;
  className?: string;
}
```

### DashboardWidget
```typescript
interface DashboardWidget {
  id: string;
  type: string;
  title: string;
  component: ReactNode;
  defaultConfig: Partial<WidgetConfig>;
}
```

### DashboardLayout
```typescript
interface DashboardLayout {
  id: string;
  name: string;
  widgets: WidgetConfig[];
  createdAt: Date;
  updatedAt: Date;
}
```

## Hooks

### useCustomizableDashboard
```typescript
const {
  layout,
  isEditing,
  handleLayoutChange,
  handleLayoutSave,
  toggleEditMode,
  resetLayout
} = useCustomizableDashboard(
  defaultLayout,
  onLayoutChange,
  onLayoutSave
);
```

## Estilos

### CSS
O componente utiliza um arquivo CSS separado (`dashboard.css`) para estilos e animações. Principais classes:

- `.layout`: Container principal do grid
- `.widget`: Container de cada widget
- `.widget-header`: Cabeçalho do widget
- `.widget-content`: Conteúdo do widget
- `.edit-mode`: Modo de edição

## Boas Práticas

### Performance
1. Use `React.memo()` para widgets que não precisam re-renderizar frequentemente
2. Implemente `useCallback` para funções de manipulação de eventos
3. Utilize `useMemo` para cálculos complexos
4. Evite re-renderizações desnecessárias

### Acessibilidade
1. Adicione `aria-label` para botões e controles
2. Implemente navegação por teclado
3. Forneça feedback visual para interações
4. Mantenha contraste adequado

### Responsividade
1. Defina breakpoints apropriados
2. Ajuste layouts para diferentes tamanhos de tela
3. Considere comportamento em dispositivos móveis
4. Teste em diferentes resoluções

## Troubleshooting

### Problemas Comuns
1. Widgets não se movem
   - Verifique se o modo de edição está ativo
   - Confirme se as props `isDraggable` e `isResizable` estão definidas

2. Layout não persiste
   - Verifique se o localStorage está disponível
   - Confirme se o `onLayoutChange` está sendo chamado

3. Animações travadas
   - Reduza a complexidade das animações
   - Verifique se há conflitos de CSS

### Soluções
1. Limpar cache do localStorage
```typescript
localStorage.removeItem('dashboard_layout');
```

2. Resetar layout
```typescript
const { resetLayout } = useCustomizableDashboard();
resetLayout();
```

3. Forçar atualização
```typescript
const [key, setKey] = useState(0);
const forceUpdate = () => setKey(prev => prev + 1);
```

## Contribuição
Para contribuir com o projeto:

1. Fork o repositório
2. Crie uma branch para sua feature
3. Faça commit das mudanças
4. Push para a branch
5. Abra um Pull Request

## Licença
MIT 