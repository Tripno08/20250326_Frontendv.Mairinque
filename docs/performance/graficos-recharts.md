# Boas Práticas para Gráficos com Recharts

## Problemas Comuns e Soluções

### 1. Dimensões do Gráfico

**Problema**: Os gráficos Recharts frequentemente apresentam avisos como "A largura(0) e altura(0) do gráfico devem ser maiores que 0" e "A largura e altura são números fixos, talvez você não precise usar um ResponsiveContainer".

**Solução**:
- Evite usar `ResponsiveContainer` quando já estiver definindo dimensões fixas
- Implemente seu próprio sistema de dimensionamento usando refs e estado
- Defina dimensões mínimas para garantir que o gráfico seja sempre renderizado corretamente

### 2. Renderização Condicional

**Problema**: A renderização do gráfico pode falhar quando o componente ainda não está montado ou as dimensões não estão prontas.

**Solução**:
- Use um estado `mounted` para renderizar o gráfico apenas quando o componente está completamente montado
- Dispare eventos de redimensionamento após a montagem para garantir que o gráfico se ajuste corretamente
- Use `useEffect` para lidar com o ciclo de vida do componente

### 3. Performance

**Problema**: Gráficos podem causar problemas de performance, especialmente com conjuntos de dados grandes ou em atualizações frequentes.

**Solução**:
- Limite a quantidade de dados renderizados em cada gráfico
- Memoize cálculos pesados como linhas de tendência e projeções
- Utilize posicionamento absoluto para evitar recálculos de layout desnecessários

## Padrão Recomendado

```typescript
interface ChartDimensions {
  width: number;
  height: number;
  margin: {
    top: number;
    right: number;
    left: number;
    bottom: number;
  }
}

const ChartComponent: React.FC<Props> = ({
  data,
  width: propWidth = 800,
  height: propHeight = 600,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState<ChartDimensions>(() => ({
    width: propWidth,
    height: propHeight,
    margin: { top: 20, right: 30, left: 20, bottom: 20 }
  }));

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth || propWidth;
        const containerHeight = containerRef.current.clientHeight || propHeight;
        setDimensions({
          width: Math.max(containerWidth, 300),
          height: Math.max(containerHeight, 300),
          margin: { top: 20, right: 30, left: 20, bottom: 20 }
        });
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, [propWidth, propHeight]);

  return (
    <Box
      ref={containerRef}
      sx={{
        position: 'relative',
        width: `${propWidth}px`,
        height: `${propHeight}px`,
        minWidth: '300px',
        minHeight: '300px',
      }}
      role="img"
      aria-label="descrição do gráfico"
    >
      <Chart
        width={dimensions.width}
        height={dimensions.height}
        data={data}
        margin={dimensions.margin}
        style={{ position: 'absolute', top: 0, left: 0 }}
      >
        {/* Conteúdo do gráfico */}
      </Chart>
    </Box>
  );
};
```

## Acessibilidade em Gráficos

- Sempre defina `role="img"` e `aria-label` apropriados para o container do gráfico
- Forneça descrições textuais alternativas para os dados do gráfico
- Use cores com contraste suficiente e forneça formas alternativas de distinção (como padrões)
- Inclua legendas claras e descrições para cada série de dados

## Testes

Ao testar componentes de gráficos:

1. Use `within()` para selecionar elementos dentro de contêineres específicos quando houver texto duplicado
2. Considere usar renderizações diretas em vez de wrappers customizados para testes mais simples
3. Mock o `ResizeObserver` para evitar erros em ambientes de teste
4. Teste comportamentos específicos como zoom, filtros e interações, em vez de apenas a presença de elementos

```typescript
// Exemplo de teste com within
it('should render correct data', () => {
  render(<ChartComponent data={mockData} />);

  const detailsSection = screen.getByText('Detalhes').closest('div');
  if (detailsSection) {
    expect(within(detailsSection).getByText('Valor A')).toBeInTheDocument();
  }
});
```
