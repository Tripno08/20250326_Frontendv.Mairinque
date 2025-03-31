import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
  ScatterChart,
  Scatter,
  ZAxis,
  Brush,
  ReferenceLine,
} from 'recharts';
import {
  Box,
  Paper,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Chip,
  Stack,
  Checkbox,
  ListItemText,
  OutlinedInput,
  Slider,
  Grid,
  useTheme,
} from '@mui/material';
import { InterventionEffectivenessChartProps } from '@/types/visualization';

// Constantes
const TIER_COLORS = {
  1: '#4CAF50', // Verde para Tier 1
  2: '#FFC107', // Amarelo para Tier 2
  3: '#F44336', // Vermelho para Tier 3
};

const CHART_MARGIN = { top: 20, right: 30, left: 20, bottom: 60 };

export const InterventionEffectivenessChart: React.FC<InterventionEffectivenessChartProps> = ({
  data,
  onInterventionClick,
  selectedTiers = [1, 2, 3],
  selectedDomains = [],
  minStudentsCount = 0,
  showLabels = true,
  title = 'Eficácia de Intervenções',
  className,
  style,
  width = 800,
  height = 500,
}) => {
  const theme = useTheme();

  // Estados locais para filtragem
  const [tiers, setTiers] = useState<(1 | 2 | 3)[]>(selectedTiers);
  const [domains, setDomains] = useState<string[]>(selectedDomains);
  const [studentsThreshold, setStudentsThreshold] = useState<number>(minStudentsCount);
  const [viewType, setViewType] = useState<'bar' | 'scatter'>('bar');

  // Obtendo a lista única de domínios
  const availableDomains = useMemo(() => {
    const uniqueDomains = [...new Set(data.map(item => item.domain))];
    return uniqueDomains.sort();
  }, [data]);

  // Filtragem dos dados
  const filteredData = useMemo(() => {
    return data.filter(item => {
      const tierMatch = tiers.includes(item.tier);
      const domainMatch = domains.length === 0 || domains.includes(item.domain);
      const studentsMatch = item.studentsCount >= studentsThreshold;
      return tierMatch && domainMatch && studentsMatch;
    });
  }, [data, tiers, domains, studentsThreshold]);

  // Formatação para gráfico de barras
  const barChartData = useMemo(() => {
    return filteredData
      .sort((a, b) => b.effectiveness - a.effectiveness)
      .map(item => ({
        ...item,
        effectivenessScore: item.effectiveness,
      }));
  }, [filteredData]);

  // Formatação para gráfico de dispersão (crescimento vs duração)
  const scatterChartData = useMemo(() => {
    return filteredData.map(item => ({
      ...item,
      x: item.durationInWeeks,
      y: item.averageGrowth,
      z: item.studentsCount,
    }));
  }, [filteredData]);

  // Manipuladores de eventos
  const handleTierChange = (event: SelectChangeEvent<(1 | 2 | 3)[]>) => {
    const {
      target: { value },
    } = event;

    // Convertendo string[] para (1 | 2 | 3)[]
    const selectedValues =
      typeof value === 'string'
        ? (value.split(',').map(Number) as (1 | 2 | 3)[])
        : (value as (1 | 2 | 3)[]);

    setTiers(selectedValues);
  };

  const handleDomainChange = (event: SelectChangeEvent<string[]>) => {
    const {
      target: { value },
    } = event;
    setDomains(typeof value === 'string' ? value.split(',') : value);
  };

  const handleStudentThresholdChange = (_: Event, newValue: number | number[]) => {
    setStudentsThreshold(newValue as number);
  };

  const handleViewTypeChange = (event: SelectChangeEvent) => {
    setViewType(event.target.value as 'bar' | 'scatter');
  };

  const handleChartClick = (data: any) => {
    if (onInterventionClick && data && data.activePayload && data.activePayload[0]) {
      onInterventionClick(data.activePayload[0].payload);
    }
  };

  // Componente de tooltip personalizado
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <Paper elevation={3} sx={{ p: 2, maxWidth: 300 }}>
          <Typography variant="subtitle2" gutterBottom>
            {data.intervention}
          </Typography>
          <Typography variant="body2">
            <strong>Domínio:</strong> {data.domain}
          </Typography>
          <Typography variant="body2">
            <strong>Eficácia:</strong> {data.effectiveness.toFixed(1)}%
          </Typography>
          <Typography variant="body2">
            <strong>Crescimento médio:</strong> {data.averageGrowth.toFixed(1)} pontos
          </Typography>
          <Typography variant="body2">
            <strong>Duração:</strong> {data.durationInWeeks} semanas
          </Typography>
          <Typography variant="body2">
            <strong>Alunos:</strong> {data.studentsCount}
          </Typography>
          <Typography variant="body2">
            <strong>Tier:</strong> {data.tier}
          </Typography>
        </Paper>
      );
    }
    return null;
  };

  return (
    <Paper
      elevation={2}
      sx={{
        p: 3,
        width: width || '100%',
        height: height || '100%',
        display: 'flex',
        flexDirection: 'column',
        ...style,
      }}
      className={className}
    >
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>

        <Grid container spacing={2} alignItems="center">
          {/* Seletor de Tipo de Visualização */}
          <Grid item xs={12} sm={3}>
            <FormControl size="small" fullWidth>
              <InputLabel id="view-type-label">Visualização</InputLabel>
              <Select
                labelId="view-type-label"
                id="view-type-select"
                value={viewType}
                onChange={handleViewTypeChange}
                label="Visualização"
              >
                <MenuItem value="bar">Gráfico de Barras</MenuItem>
                <MenuItem value="scatter">Gráfico de Dispersão</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Seletor de Tiers */}
          <Grid item xs={12} sm={3}>
            <FormControl size="small" fullWidth>
              <InputLabel id="tier-select-label">Níveis</InputLabel>
              <Select
                labelId="tier-select-label"
                id="tier-select"
                multiple
                value={tiers}
                onChange={handleTierChange}
                input={<OutlinedInput label="Níveis" />}
                renderValue={selected => (
                  <Stack direction="row" spacing={0.5} flexWrap="wrap">
                    {(selected as (1 | 2 | 3)[]).map(value => (
                      <Chip
                        key={value}
                        label={`Tier ${value}`}
                        size="small"
                        sx={{
                          bgcolor: TIER_COLORS[value],
                          color: value === 1 ? 'text.primary' : 'white',
                        }}
                      />
                    ))}
                  </Stack>
                )}
              >
                {[1, 2, 3].map(tier => (
                  <MenuItem key={tier} value={tier}>
                    <Checkbox checked={tiers.includes(tier as 1 | 2 | 3)} />
                    <ListItemText
                      primary={`Tier ${tier}`}
                      secondary={
                        tier === 1 ? 'Universal' : tier === 2 ? 'Direcionado' : 'Intensivo'
                      }
                    />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Seletor de Domínios */}
          <Grid item xs={12} sm={3}>
            <FormControl size="small" fullWidth>
              <InputLabel id="domain-select-label">Domínios</InputLabel>
              <Select
                labelId="domain-select-label"
                id="domain-select"
                multiple
                value={domains}
                onChange={handleDomainChange}
                input={<OutlinedInput label="Domínios" />}
                renderValue={selected => (
                  <Stack direction="row" spacing={0.5} flexWrap="wrap">
                    {(selected as string[]).map(value => (
                      <Chip key={value} label={value} size="small" />
                    ))}
                  </Stack>
                )}
              >
                {availableDomains.map(domain => (
                  <MenuItem key={domain} value={domain}>
                    <Checkbox checked={domains.includes(domain)} />
                    <ListItemText primary={domain} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Filtro de Número Mínimo de Alunos */}
          <Grid item xs={12} sm={3}>
            <Box sx={{ px: 1.5 }}>
              <Typography variant="body2" id="students-threshold-slider">
                Mínimo de alunos: {studentsThreshold}
              </Typography>
              <Slider
                value={studentsThreshold}
                onChange={handleStudentThresholdChange}
                aria-labelledby="students-threshold-slider"
                valueLabelDisplay="auto"
                step={5}
                marks
                min={0}
                max={100}
              />
            </Box>
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ flex: 1, minHeight: 0, width: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          {viewType === 'bar' ? (
            <BarChart data={barChartData} margin={CHART_MARGIN} onClick={handleChartClick}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="intervention"
                angle={-45}
                textAnchor="end"
                height={60}
                interval={0}
                tick={{ fontSize: 12 }}
              />
              <YAxis
                label={{ value: 'Eficácia (%)', angle: -90, position: 'insideLeft' }}
                domain={[0, 100]}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <ReferenceLine
                y={70}
                stroke="#666"
                strokeDasharray="3 3"
                label={{ value: 'Muito Eficaz', position: 'right', fill: '#666' }}
              />
              <Bar
                dataKey="effectivenessScore"
                name="Eficácia"
                radius={[4, 4, 0, 0]}
                label={
                  showLabels
                    ? { position: 'top', formatter: (value: number) => `${value.toFixed(0)}%` }
                    : false
                }
              >
                {barChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={TIER_COLORS[entry.tier]} />
                ))}
              </Bar>
              <Brush dataKey="intervention" height={30} stroke="#8884d8" />
            </BarChart>
          ) : (
            <ScatterChart margin={CHART_MARGIN} onClick={handleChartClick}>
              <CartesianGrid />
              <XAxis
                type="number"
                dataKey="x"
                name="Duração (semanas)"
                label={{ value: 'Duração (semanas)', position: 'bottom' }}
              />
              <YAxis
                type="number"
                dataKey="y"
                name="Crescimento Médio"
                label={{ value: 'Crescimento Médio', angle: -90, position: 'insideLeft' }}
              />
              <ZAxis type="number" dataKey="z" range={[50, 400]} name="Número de Alunos" />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              {scatterChartData.map((domain, index) => {
                const domainData = scatterChartData.filter(item => item.domain === domain.domain);
                return (
                  <Scatter
                    key={`scatter-${index}`}
                    name={domain.domain}
                    data={domainData}
                    fill={TIER_COLORS[domain.tier]}
                  />
                );
              })}
            </ScatterChart>
          )}
        </ResponsiveContainer>
      </Box>

      {filteredData.length === 0 && (
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            color: 'text.secondary',
          }}
        >
          <Typography variant="body1">Nenhum dado encontrado com os filtros atuais</Typography>
        </Box>
      )}

      <Typography variant="body2" color="text.secondary" sx={{ mt: 2, textAlign: 'right' }}>
        {filteredData.length} intervenções exibidas
      </Typography>
    </Paper>
  );
};
