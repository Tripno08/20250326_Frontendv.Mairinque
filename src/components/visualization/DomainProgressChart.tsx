import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  Cell,
  LabelList
} from 'recharts';
import { Box, Paper, Typography, useTheme, Switch, FormControlLabel, FormGroup, Grid } from '@mui/material';
import { DomainProgressChartProps } from '@/types/visualization';

export const DomainProgressChart: React.FC<DomainProgressChartProps> = ({
  data,
  onDomainClick,
  showBenchmarks = true,
  showNationalAverage = true,
  showTargets = true,
  title = 'Progresso por Domínio',
  className,
  style,
  width = 700,
  height = 500
}) => {
  const theme = useTheme();
  const [showDetails, setShowDetails] = React.useState({
    benchmarks: showBenchmarks,
    nationalAverage: showNationalAverage,
    targets: showTargets
  });

  // Reorganizar os dados para facilitar a visualização no gráfico
  const chartData = data.map(domain => ({
    name: domain.domain,
    color: domain.color,
    inicial: domain.initialScore,
    atual: domain.currentScore,
    meta: domain.targetScore,
    nacional: domain.nationalAverage || 0,
    benchmarks: domain.benchmarks || [],
    crescimento: domain.currentScore - domain.initialScore,
    percentualMeta: ((domain.currentScore - domain.initialScore) /
      (domain.targetScore - domain.initialScore) * 100).toFixed(0)
  }));

  // Encontrar o valor máximo para definir o domínio do eixo Y
  const maxValue = Math.max(
    ...chartData.map(d => Math.max(
      d.inicial,
      d.atual,
      d.meta,
      d.nacional || 0,
      ...((d.benchmarks && d.benchmarks.map(b => b.value)) || [0])
    ))
  );

  const handleToggleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setShowDetails({
      ...showDetails,
      [event.target.name]: event.target.checked
    });
  };

  const handleBarClick = (data: any) => {
    if (onDomainClick && data && data.activePayload && data.activePayload[0]) {
      const domainName = data.activePayload[0].payload.name;
      const domain = chartData.find(d => d.name === domainName);
      if (domain) {
        const originalDomain = data.find((d: any) => d.domain === domainName);
        onDomainClick(originalDomain);
      }
    }
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;

      return (
        <Paper
          elevation={3}
          sx={{
            p: 2,
            bgcolor: 'background.paper',
            boxShadow: theme.shadows[3],
            borderRadius: 1
          }}
        >
          <Typography variant="subtitle2" sx={{ color: data.color, fontWeight: 'bold', mb: 1 }}>
            {data.name}
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            <Typography variant="body2">
              <strong>Inicial:</strong> {data.inicial}
            </Typography>
            <Typography variant="body2">
              <strong>Atual:</strong> {data.atual}
            </Typography>
            <Typography variant="body2">
              <strong>Crescimento:</strong> {data.crescimento} pontos
            </Typography>

            {showDetails.targets && (
              <Typography variant="body2">
                <strong>Meta:</strong> {data.meta} ({data.percentualMeta}% alcançado)
              </Typography>
            )}

            {showDetails.nationalAverage && data.nacional > 0 && (
              <Typography variant="body2">
                <strong>Média Nacional:</strong> {data.nacional}
              </Typography>
            )}
          </Box>
        </Paper>
      );
    }
    return null;
  };

  return (
    <Box
      component={Paper}
      elevation={2}
      sx={{
        p: 3,
        width: width,
        height: height,
        display: 'flex',
        flexDirection: 'column',
        ...(style || {})
      }}
      className={className}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
        <Typography variant="h6">{title}</Typography>

        <FormGroup row>
          <FormControlLabel
            control={
              <Switch
                checked={showDetails.benchmarks}
                onChange={handleToggleChange}
                name="benchmarks"
                size="small"
              />
            }
            label={<Typography variant="body2">Benchmarks</Typography>}
          />
          <FormControlLabel
            control={
              <Switch
                checked={showDetails.nationalAverage}
                onChange={handleToggleChange}
                name="nationalAverage"
                size="small"
              />
            }
            label={<Typography variant="body2">Média Nacional</Typography>}
          />
          <FormControlLabel
            control={
              <Switch
                checked={showDetails.targets}
                onChange={handleToggleChange}
                name="targets"
                size="small"
              />
            }
            label={<Typography variant="body2">Metas</Typography>}
          />
        </FormGroup>
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Box sx={{ height: height - 140, width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                onClick={handleBarClick}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis domain={[0, Math.ceil(maxValue * 1.1)]} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />

                <Bar dataKey="inicial" name="Pontuação Inicial" fill={theme.palette.grey[400]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-inicial-${index}`} fill={theme.palette.grey[400]} />
                  ))}
                </Bar>

                <Bar dataKey="atual" name="Pontuação Atual">
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-atual-${index}`} fill={entry.color}>
                      <LabelList dataKey="atual" position="top" />
                    </Cell>
                  ))}
                  <LabelList dataKey="atual" position="top" />
                </Bar>

                {/* Linhas de referência condicionais */}
                {showDetails.targets && (
                  chartData.map((entry, index) => (
                    <ReferenceLine
                      key={`target-${index}`}
                      x={entry.name}
                      y={entry.meta}
                      stroke="#FF5722"
                      strokeDasharray="3 3"
                      isFront={true}
                      label={{
                        value: 'Meta',
                        position: 'right',
                        fill: '#FF5722',
                        fontSize: 11
                      }}
                    />
                  ))
                )}

                {showDetails.nationalAverage && (
                  chartData.map((entry, index) => (
                    entry.nacional > 0 && (
                      <ReferenceLine
                        key={`national-${index}`}
                        x={entry.name}
                        y={entry.nacional}
                        stroke="#3F51B5"
                        strokeDasharray="3 3"
                        isFront={true}
                        label={{
                          value: 'Nacional',
                          position: 'insideBottomRight',
                          fill: '#3F51B5',
                          fontSize: 11
                        }}
                      />
                    )
                  ))
                )}

                {showDetails.benchmarks && (
                  chartData.flatMap((entry, domainIndex) =>
                    entry.benchmarks.map((benchmark, index) => (
                      <ReferenceLine
                        key={`benchmark-${domainIndex}-${index}`}
                        x={entry.name}
                        y={benchmark.value}
                        stroke="#607D8B"
                        strokeDasharray="2 2"
                        isFront={true}
                        label={{
                          value: benchmark.name,
                          position: 'left',
                          fill: '#607D8B',
                          fontSize: 10
                        }}
                      />
                    ))
                  )
                )}
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Mostrando progresso em {chartData.length} domínios
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Crescimento médio: {(chartData.reduce((acc, curr) => acc + curr.crescimento, 0) / chartData.length).toFixed(1)} pontos
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};
