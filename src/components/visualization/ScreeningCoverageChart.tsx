import React, { useState } from 'react';
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
  Pie,
  PieChart,
  Label,
  LabelList,
} from 'recharts';
import {
  Box,
  Paper,
  Typography,
  useTheme,
  ToggleButtonGroup,
  ToggleButton,
  Grid,
  Stack,
  Chip,
  CircularProgress,
} from '@mui/material';
import { BarChartOutlined, PieChartOutlined, DonutLargeOutlined } from '@mui/icons-material';
import { ScreeningCoverageChartProps } from '@/types/visualization';

// Constantes para cores
const COLORS = {
  screened: '#4CAF50', // Verde
  pending: '#FFC107', // Amarelo
  missed: '#F44336', // Vermelho
  background: '#f5f5f5', // Cinza claro para fundo
};

export const ScreeningCoverageChart: React.FC<ScreeningCoverageChartProps> = ({
  data,
  onPeriodClick,
  showPercentageLabels = true,
  title = 'Cobertura de Rastreios',
  className,
  style,
  width = 700,
  height = 400,
}) => {
  const theme = useTheme();
  const [chartType, setChartType] = useState<'bar' | 'pie' | 'donut'>('bar');

  // Preparando dados para visualização
  const chartData = data.map(period => ({
    name: period.period,
    screened: period.screened,
    pending: period.pending,
    missed: period.missed,
    total: period.total,
    percentage: period.percentage,
  }));

  // Dados para a visualização de pizza (agregados)
  const totalData = {
    screened: data.reduce((sum, item) => sum + item.screened, 0),
    pending: data.reduce((sum, item) => sum + item.pending, 0),
    missed: data.reduce((sum, item) => sum + item.missed, 0),
    total: data.reduce((sum, item) => sum + item.total, 0),
  };

  const pieData = [
    { name: 'Rastreados', value: totalData.screened, color: COLORS.screened },
    { name: 'Pendentes', value: totalData.pending, color: COLORS.pending },
    { name: 'Perdidos', value: totalData.missed, color: COLORS.missed },
  ];

  // Cálculo das estatísticas gerais
  const overallPercentage = Math.round((totalData.screened / totalData.total) * 100);

  // Manipuladores de eventos
  const handleChartTypeChange = (
    _: React.MouseEvent<HTMLElement>,
    newType: 'bar' | 'pie' | 'donut' | null
  ) => {
    if (newType !== null) {
      setChartType(newType);
    }
  };

  const handleChartClick = (data: any) => {
    if (onPeriodClick && data && data.activePayload && data.activePayload[0]) {
      const periodName = data.activePayload[0].payload.name;
      const period = chartData.find(p => p.name === periodName);
      if (period) {
        onPeriodClick(period);
      }
    }
  };

  // Componente de tooltip personalizado
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
            borderRadius: 1,
          }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
            {data.name}
          </Typography>

          <Stack spacing={1}>
            <Typography variant="body2">
              <strong>Rastreados:</strong> {data.screened} (
              {Math.round((data.screened / data.total) * 100)}%)
            </Typography>
            <Typography variant="body2">
              <strong>Pendentes:</strong> {data.pending} (
              {Math.round((data.pending / data.total) * 100)}%)
            </Typography>
            <Typography variant="body2">
              <strong>Perdidos:</strong> {data.missed} (
              {Math.round((data.missed / data.total) * 100)}%)
            </Typography>
            <Typography variant="body2">
              <strong>Total:</strong> {data.total}
            </Typography>
          </Stack>
        </Paper>
      );
    }
    return null;
  };

  // Renderização do gráfico apropriado
  const renderChart = () => {
    switch (chartType) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              onClick={handleChartClick}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="screened" name="Rastreados" stackId="a" fill={COLORS.screened}>
                {showPercentageLabels && <LabelList dataKey="screened" position="center" />}
              </Bar>
              <Bar dataKey="pending" name="Pendentes" stackId="a" fill={COLORS.pending}>
                {showPercentageLabels && <LabelList dataKey="pending" position="center" />}
              </Bar>
              <Bar dataKey="missed" name="Perdidos" stackId="a" fill={COLORS.missed}>
                {showPercentageLabels && <LabelList dataKey="missed" position="center" />}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        );

      case 'pie':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={true}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }: any) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );

      case 'donut':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }: any) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
                <Label
                  value={`${overallPercentage}%`}
                  position="center"
                  fill={theme.palette.text.primary}
                  style={{ fontSize: '24px', fontWeight: 'bold' }}
                />
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  };

  return (
    <Box
      component={Paper}
      elevation={2}
      sx={{
        p: 3,
        width: `${width}px`,
        height: `${height}px`,
        display: 'flex',
        flexDirection: 'column',
        ...(style || {}),
      }}
      className={className || undefined}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">{title}</Typography>

        <ToggleButtonGroup
          value={chartType}
          exclusive
          onChange={handleChartTypeChange}
          size="small"
          aria-label="tipo de visualização"
        >
          <ToggleButton value="bar" aria-label="gráfico de barras">
            <BarChartOutlined />
          </ToggleButton>
          <ToggleButton value="pie" aria-label="gráfico de pizza">
            <PieChartOutlined />
          </ToggleButton>
          <ToggleButton value="donut" aria-label="gráfico de rosca">
            <DonutLargeOutlined />
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={12} md={chartType === 'bar' ? 12 : 8}>
          <Box sx={{ height: height - 120, width: '100%' }}>{renderChart()}</Box>
        </Grid>

        {(chartType === 'pie' || chartType === 'donut') && (
          <Grid item xs={12} md={4}>
            <Stack spacing={2}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  width: 120,
                  height: 120,
                  mx: 'auto',
                }}
              >
                <CircularProgress
                  variant="determinate"
                  value={overallPercentage}
                  size={120}
                  thickness={5}
                  sx={{ color: COLORS.screened }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography variant="h4" color="text.primary">
                    {overallPercentage}%
                  </Typography>
                </Box>
              </Box>

              <Typography variant="body2" color="text.secondary" align="center">
                Cobertura Total
              </Typography>

              <Stack direction="row" spacing={1} justifyContent="center" flexWrap="wrap">
                <Chip
                  label={`Rastreados: ${totalData.screened}`}
                  sx={{ bgcolor: COLORS.screened, color: 'white' }}
                />
                <Chip
                  label={`Pendentes: ${totalData.pending}`}
                  sx={{ bgcolor: COLORS.pending, color: 'black' }}
                />
                <Chip
                  label={`Perdidos: ${totalData.missed}`}
                  sx={{ bgcolor: COLORS.missed, color: 'white' }}
                />
              </Stack>
            </Stack>
          </Grid>
        )}
      </Grid>

      <Typography variant="body2" color="text.secondary" align="right" sx={{ mt: 2 }}>
        {data.length} períodos de rastreio | Total: {totalData.total} alunos
      </Typography>
    </Box>
  );
};
