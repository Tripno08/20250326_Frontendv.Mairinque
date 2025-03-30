# Dicas para Visualizações de Dados com Recharts

## Visão Geral

Este documento apresenta dicas e boas práticas para implementação de visualizações de dados utilizando a biblioteca Recharts no sistema de Insights Acionáveis.

## Tipos de Visualizações

### 1. Gráficos de Barras

Os gráficos de barras são ideais para comparações de categorias ou séries temporais discretas.

```tsx
<ResponsiveContainer width="100%" height="100%" aspect={500 / 300}>
  <BarChart
    width={500}
    height={300}
    data={data}
    margin={{
      top: 5,
      right: 30,
      left: 20,
      bottom: 5,
    }}
  >
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="name" />
    <YAxis />
    <Tooltip />
    <Legend />
    <Bar dataKey="value" fill="#8884d8" activeBar={<Rectangle fill="pink" stroke="blue" />} />
  </BarChart>
</ResponsiveContainer>
```

**Quando usar:**
- Comparar valores entre categorias
- Mostrar distribuição de dados categóricos
- Visualizar mudanças ao longo do tempo em períodos discretos

### 2. Gráficos de Linha

Os gráficos de linha são perfeitos para mostrar tendências ao longo do tempo e mudanças contínuas.

```tsx
<ResponsiveContainer width="100%" height="100%" aspect={500 / 300}>
  <LineChart
    width={500}
    height={300}
    data={data}
    margin={{
      top: 5,
      right: 30,
      left: 20,
      bottom: 5,
    }}
  >
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="date" />
    <YAxis />
    <Tooltip />
    <Line type="monotone" dataKey="value" stroke="#82ca9d" />
  </LineChart>
</ResponsiveContainer>
```

**Quando usar:**
- Visualizar tendências ao longo do tempo
- Mostrar mudanças contínuas em dados
- Comparar múltiplas séries de dados ao longo do tempo

### 3. Gráficos de Área

Os gráficos de área são úteis para visualizar volumes e proporções ao longo do tempo.

```tsx
<ResponsiveContainer width="100%" height="100%" aspect={500 / 300}>
  <AreaChart
    width={500}
    height={300}
    data={data}
    margin={{
      top: 10,
      right: 30,
      left: 0,
      bottom: 0,
    }}
  >
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="date" />
    <YAxis />
    <Tooltip />
    <Area type="monotone" dataKey="value" stroke="#8884d8" fill="#8884d8" />
  </AreaChart>
</ResponsiveContainer>
```

**Quando usar:**
- Destacar volumes totais ao longo do tempo
- Mostrar a contribuição relativa de categorias
- Comparar partes de um todo em várias séries temporais

### 4. Gráficos de Pizza

Os gráficos de pizza são ideais para mostrar a proporção de categorias em relação ao todo.

```tsx
<ResponsiveContainer width="100%" height="100%" aspect={1}>
  <PieChart width={400} height={400}>
    <Pie
      data={data}
      cx="50%"
      cy="50%"
      labelLine={true}
      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
      outerRadius={80}
      fill="#8884d8"
      dataKey="value"
    >
      {data.map((entry, index) => (
        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
      ))}
    </Pie>
    <Tooltip />
  </PieChart>
</ResponsiveContainer>
```

**Quando usar:**
- Visualizar proporções de um todo
- Comparar partes de uma categoria
- Mostrar distribuição percentual

### 5. Mapas de Árvore (Treemap)

Os Treemaps são úteis para visualizar dados hierárquicos usando retângulos aninhados.

```tsx
<ResponsiveContainer width="100%" height="100%" aspect={500 / 300}>
  <Treemap
    width={500}
    height={300}
    data={data}
    dataKey="size"
    aspectRatio={4 / 3}
    stroke="#fff"
    fill="#8884d8"
  />
</ResponsiveContainer>
```

**Quando usar:**
- Visualizar dados hierárquicos
- Mostrar proporções relativas entre múltiplas categorias e subcategorias
- Destacar padrões em dados complexos

## Boas Práticas

### 1. Responsividade

Sempre envolva seus gráficos em um `ResponsiveContainer` para garantir que se adaptem a diferentes tamanhos de tela.

```tsx
<ResponsiveContainer width="100%" height="100%" aspect={16 / 9}>
  {/* Seu gráfico aqui */}
</ResponsiveContainer>
```

### 2. Tooltips Personalizados

Crie tooltips personalizados para melhorar a experiência do usuário e fornecer contexto adicional.

```tsx
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <p className="label">{`${label} : ${payload[0].value}`}</p>
        <p className="desc">Informação adicional sobre este ponto de dados.</p>
      </div>
    );
  }

  return null;
};

// Uso
<Tooltip content={<CustomTooltip />} />
```

### 3. Formatação de Dados

Formate os dados apropriadamente antes de passá-los para o gráfico.

```tsx
// Formatação de datas
const formatDate = new Intl.DateTimeFormat("pt-BR", {
  month: "short",
  year: "numeric",
  day: "numeric",
});

const transformData = (data: RawDataPoint[]): FormattedDataPoint[] => {
  return data.map(({ date, value }) => ({
    date: formatDate.format(new Date(date)),
    value,
  }));
};
```

### 4. Cores Acessíveis

Use cores acessíveis e consistentes em seus gráficos. Defina uma paleta de cores para diferentes tipos de dados.

```tsx
const ALERT_COLORS = {
  'low': '#4caf50',      // verde
  'moderate': '#ff9800', // laranja
  'high': '#f44336',     // vermelho
  'critical': '#d32f2f'  // vermelho escuro
};

const COMPARISON_COLORS = [
  '#1f77b4', // azul
  '#ff7f0e', // laranja
  '#2ca02c', // verde
  '#d62728', // vermelho
  '#9467bd', // roxo
];
```

### 5. Animações

Use animações sutis para melhorar a experiência do usuário, mas evite exageros que possam distrair.

```tsx
<Line
  type="monotone"
  dataKey="value"
  stroke="#82ca9d"
  animationDuration={500}
  animationEasing="ease-in-out"
/>
```

### 6. Eixos e Legendas

Configure eixos e legendas adequadamente para tornar o gráfico mais compreensível.

```tsx
<XAxis
  dataKey="date"
  tick={{ fontSize: 12 }}
  tickFormatter={(value) => formatXAxisTick(value)}
/>
<YAxis
  domain={[0, 'auto']}
  tickFormatter={(value) => `${value}%`}
/>
<Legend
  verticalAlign="top"
  height={36}
  formatter={(value) => legendFormatter(value)}
/>
```

## Otimização de Performance

### 1. Memoização de Componentes

Use `React.memo` ou `useMemo` para prevenir renderizações desnecessárias de gráficos complexos.

```tsx
// Memoizando o componente inteiro
const MemoizedChart = React.memo(MyChartComponent);

// Ou memoizando apenas os dados processados
const processedData = useMemo(() => {
  return transformData(rawData);
}, [rawData]);
```

### 2. Throttling para Dados em Tempo Real

Para gráficos com atualizações frequentes, implemente throttling para limitar as atualizações.

```tsx
import { throttle } from 'lodash';

// Throttle a atualização de dados para 1 segundo
const throttledUpdateData = useCallback(
  throttle((newData) => {
    setChartData(newData);
  }, 1000),
  []
);
```

### 3. Lazy Loading

Carregue gráficos complexos apenas quando necessário usando lazy loading.

```tsx
const ComplexChart = React.lazy(() => import('./ComplexChart'));

// No componente pai
<Suspense fallback={<div>Carregando gráfico...</div>}>
  <ComplexChart data={data} />
</Suspense>
```

## Acessibilidade

### 1. Textos Alternativos

Forneça descrições textuais para gráficos.

```tsx
<div role="figure" aria-label="Gráfico mostrando a distribuição de alunos por nível de risco">
  {/* Seu gráfico aqui */}
</div>
```

### 2. Cores Acessíveis

Use combinações de cores com contraste adequado e sempre inclua formas ou padrões para distinguir séries de dados, além das cores.

```tsx
<Bar
  dataKey="value"
  fill="#8884d8"
  stroke="#000"
  strokeWidth={1}
  // Adicione padrões ou texturas para melhor acessibilidade
  fillOpacity={0.8}
/>
```

### 3. Interação por Teclado

Garanta que seus gráficos sejam navegáveis por teclado.

```tsx
<Recharts.Bar
  tabIndex={0}
  onKeyDown={(e) => {
    if (e.key === 'Enter') {
      handleBarClick(data);
    }
  }}
  onClick={() => handleBarClick(data)}
  {...otherProps}
/>
```

## Exemplos de Uso no Sistema de Insights

### 1. Visualização de Distribuição de Alertas

```tsx
<ResponsiveContainer width="100%" height="100%">
  <BarChart data={alertLevelData}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="name" />
    <YAxis />
    <Tooltip />
    <Legend />
    <Bar dataKey="value" name="Quantidade de Insights">
      {alertLevelData.map((entry, index) => (
        <Cell
          key={`cell-${index}`}
          fill={ALERT_COLORS[entry.name] || COLORS[index % COLORS.length]}
        />
      ))}
    </Bar>
  </BarChart>
</ResponsiveContainer>
```

### 2. Visualização de Tendências Temporais

```tsx
<ResponsiveContainer width="100%" height="100%">
  <LineChart data={timelineData}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="date" />
    <YAxis />
    <Tooltip />
    <Legend />
    <Line type="monotone" dataKey="low" name="Baixo" stroke={ALERT_COLORS.low} />
    <Line type="monotone" dataKey="moderate" name="Moderado" stroke={ALERT_COLORS.moderate} />
    <Line type="monotone" dataKey="high" name="Alto" stroke={ALERT_COLORS.high} />
    <Line type="monotone" dataKey="critical" name="Crítico" stroke={ALERT_COLORS.critical} />
  </LineChart>
</ResponsiveContainer>
```

### 3. Visualização de Simulação de Impacto

```tsx
<ResponsiveContainer width="100%" height="100%">
  <BarChart data={currentScenario.impactMetrics}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="metric" />
    <YAxis domain={[0, 100]} />
    <Tooltip />
    <Legend />
    <Bar dataKey="currentValue" name="Valor Atual" fill={theme.palette.grey[500]} />
    <Bar dataKey="projectedValue" name="Valor Projetado" fill={theme.palette.primary.main} />
  </BarChart>
</ResponsiveContainer>
```

## Recursos Adicionais

- [Documentação Oficial do Recharts](https://recharts.org/en-US/)
- [Exemplos Interativos do Recharts](https://recharts.org/en-US/examples)
- [Guia de Acessibilidade para Visualização de Dados](https://www.w3.org/WAI/tutorials/images/complex/)
- [Princípios de Design de Visualização de Dados](https://www.data-to-viz.com/)
- [Paletas de Cores Acessíveis](https://colorbrewer2.org/)
