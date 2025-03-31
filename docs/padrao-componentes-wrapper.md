# Padrões Recomendados para Novos Componentes

Este documento descreve as melhores práticas e padrões para a criação de novos componentes no projeto Innerview Escola, especialmente considerando a migração para o Material UI 7 e React 19.

## Uso dos Componentes Wrapper

Para garantir compatibilidade com o Material UI 7 e React 19, foram criados componentes wrapper que devem ser utilizados em vez dos componentes originais do Material UI.

### 1. GridContainer e GridItem

Sempre que precisar utilizar o componente `Grid` do Material UI, use os wrappers:

```tsx
// ❌ EVITE
import { Grid } from '@mui/material';

function MeuComponente() {
  return (
    <Grid container spacing={2} component="div">
      <Grid item xs={12} md={6} component="div">
        <Card>...</Card>
      </Grid>
    </Grid>
  );
}

// ✅ RECOMENDADO
import { GridContainer, GridItem } from '@/components/ui/Grid';

function MeuComponente() {
  return (
    <GridContainer spacing={2}>
      <GridItem xs={12} md={6}>
        <Card>...</Card>
      </GridItem>
    </GridContainer>
  );
}
```

### 2. ListItemWrapper

Para elementos de lista, use o wrapper que já inclui a propriedade `component="div"`:

```tsx
// ❌ EVITE
import { List, ListItem } from '@mui/material';

function MinhaLista() {
  return (
    <List>
      <ListItem component="div">Item 1</ListItem>
      <ListItem component="div">Item 2</ListItem>
    </List>
  );
}

// ✅ RECOMENDADO
import { List } from '@mui/material';
import { ListItemWrapper } from '@/components/ui/ListItemWrapper';

function MinhaLista() {
  return (
    <List>
      <ListItemWrapper>Item 1</ListItemWrapper>
      <ListItemWrapper>Item 2</ListItemWrapper>
    </List>
  );
}
```

### 3. MenuItemWrapper

Para itens de menu, use o wrapper em vez de MenuItem:

```tsx
// ❌ EVITE
import { Menu, MenuItem } from '@mui/material';

function MeuMenu() {
  return (
    <Menu>
      <MenuItem component="li">Opção 1</MenuItem>
      <MenuItem component="li">Opção 2</MenuItem>
    </Menu>
  );
}

// ✅ RECOMENDADO
import { Menu } from '@mui/material';
import { MenuItemWrapper } from '@/components/ui/MenuItemWrapper';

function MeuMenu() {
  return (
    <Menu>
      <MenuItemWrapper>Opção 1</MenuItemWrapper>
      <MenuItemWrapper>Opção 2</MenuItemWrapper>
    </Menu>
  );
}
```

## Boas Práticas para Novos Componentes

### 1. Tipagem Forte

Use TypeScript para definir tipos claros para as props dos componentes:

```tsx
interface MeuComponenteProps {
  titulo: string;
  conteudo: string;
  ativo?: boolean;
  onAcao?: () => void;
}

const MeuComponente: React.FC<MeuComponenteProps> = ({
  titulo,
  conteudo,
  ativo = false,
  onAcao,
}) => {
  // ...
};
```

### 2. Componentização

Divida componentes grandes em subcomponentes menores e mais focados:

```tsx
// Componente principal
const DashboardAnalise: React.FC = () => {
  return (
    <GridContainer spacing={3}>
      <GridItem xs={12} md={8}>
        <GraficoDesempenho />
      </GridItem>
      <GridItem xs={12} md={4}>
        <ResumoEstatisticas />
      </GridItem>
    </GridContainer>
  );
};

// Subcomponentes
const GraficoDesempenho: React.FC = () => {
  /* ... */
};
const ResumoEstatisticas: React.FC = () => {
  /* ... */
};
```

### 3. Props com Valores Padrão

Defina valores padrão para props opcionais:

```tsx
interface CardProps {
  titulo: string;
  descricao?: string;
  elevacao?: number;
  completo?: boolean;
}

const Card: React.FC<CardProps> = ({ titulo, descricao = '', elevacao = 1, completo = false }) => {
  // ...
};
```

### 4. Uso de Hooks Personalizados

Extraia lógica complexa em hooks personalizados:

```tsx
// Hook personalizado
function useDadosAluno(alunoId: string) {
  const [dados, setDados] = useState<DadosAluno | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<Error | null>(null);

  useEffect(() => {
    const carregarDados = async () => {
      try {
        setCarregando(true);
        const resultado = await alunoService.obterDados(alunoId);
        setDados(resultado);
      } catch (error) {
        setErro(error as Error);
      } finally {
        setCarregando(false);
      }
    };

    carregarDados();
  }, [alunoId]);

  return { dados, carregando, erro };
}

// Uso no componente
const PerfilAluno: React.FC<{ alunoId: string }> = ({ alunoId }) => {
  const { dados, carregando, erro } = useDadosAluno(alunoId);

  if (carregando) return <Carregando />;
  if (erro) return <Erro mensagem={erro.message} />;
  if (!dados) return <SemDados />;

  return <ExibirPerfil dados={dados} />;
};
```

### 5. Uso de React Query

Para operações de busca de dados, prefira usar React Query com a sintaxe de objeto único:

```tsx
const { data, isLoading, error } = useQuery({
  queryKey: ['aluno', alunoId],
  queryFn: () => alunoService.obterDados(alunoId),
  enabled: !!alunoId,
});
```

### 6. Memoização

Use React.memo, useMemo e useCallback adequadamente para evitar renderizações desnecessárias:

```tsx
// Memoizando um componente
const ItemLista = React.memo(({ nome, valor }: ItemListaProps) => {
  return (
    <ListItemWrapper>
      <ListItemText primary={nome} secondary={valor} />
    </ListItemWrapper>
  );
});

// Memoizando um valor calculado
const MeuComponente: React.FC<MeuComponenteProps> = ({ dados }) => {
  const dadosFiltrados = useMemo(() => {
    return dados.filter(item => item.ativo);
  }, [dados]);

  // ...
};

// Memoizando uma função
const MeuComponente: React.FC<MeuComponenteProps> = ({ onSalvar }) => {
  const handleSalvar = useCallback(() => {
    // Lógica de salvamento
    onSalvar();
  }, [onSalvar]);

  // ...
};
```

## Padrões de Estilo

### 1. Estilização Recomendada

Utilize o sistema de temas do Material UI sempre que possível:

```tsx
import { styled } from '@mui/material/styles';

const ConteudoEstilizado = styled('div')(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[1],
}));
```

### 2. Responsividade

Utilize as propriedades de quebra dos componentes Grid para garantir responsividade:

```tsx
<GridContainer spacing={3}>
  <GridItem xs={12} sm={6} md={4} lg={3}>
    {/* Conteúdo responsivo */}
  </GridItem>
</GridContainer>
```

## Testes

### 1. Testes Unitários

Cada componente deve ter testes unitários básicos:

```tsx
describe('MeuComponente', () => {
  it('deve renderizar corretamente', () => {
    render(<MeuComponente titulo="Teste" conteudo="Conteúdo de teste" />);
    expect(screen.getByText('Teste')).toBeInTheDocument();
    expect(screen.getByText('Conteúdo de teste')).toBeInTheDocument();
  });

  it('deve chamar a função onAcao quando clicado', () => {
    const onAcao = jest.fn();
    render(<MeuComponente titulo="Teste" conteudo="Conteúdo" onAcao={onAcao} />);

    fireEvent.click(screen.getByRole('button'));
    expect(onAcao).toHaveBeenCalledTimes(1);
  });
});
```

## Conclusão

Seguir estes padrões garantirá que os novos componentes sejam compatíveis com as versões atualizadas do Material UI 7 e React 19, além de promover a consistência e a manutenibilidade do código. Sempre que possível, reutilize os componentes wrapper em vez de utilizar os componentes originais do Material UI diretamente.
