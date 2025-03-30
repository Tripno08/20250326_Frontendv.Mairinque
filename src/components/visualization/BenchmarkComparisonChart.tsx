import React, { useState } from 'react';
import {
  ResponsiveContainer,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Tooltip,
  Legend,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Bar
} from 'recharts';
import {
  Box,
  Paper,
  Typography,
  useTheme,
  ToggleButtonGroup,
  ToggleButton,
  Switch,
  FormControlLabel,
  FormGroup
} from '@mui/material';
import { RadarOutlined, BarChartOutlined } from '@mui/icons-material';
import { BenchmarkComparisonChartProps } from '@/types/visualization';

export const BenchmarkComparisonChart: React.FC<BenchmarkComparisonChartProps> = ({
  data,
  onDomainClick,
  showTarget = true,
  title = 'Comparação com Benchmarks',
  className,
  style,
  width = 700,
  height = 500
}) => {
  const theme = useTheme();
  const [chartType, setChartType] = useState<'radar' | 'bar'>('radar');
  const [showPerformanceLabels, setShowPerformanceLabels] = useState<string[]>([
    'schoolAverage',
    'districtAverage',
    'stateAverage',
    'nationalAverage',
    ...(showTarget ? ['target'] : [])
  ]);

  // Formatação dos dados
  const formattedData = data.map(item => ({
    domain: item.domain,
    'Escola': item.schoolAverage,
    'Distrito': item.districtAverage,
    'Estado': item.stateAverage,
    'Nacional': item.nationalAverage,
    'Meta': item.target
  }));

  // Opções de dados a mostrar
  const dataOptions = [
    { key: 'schoolAverage', label: 'Escola', color: theme.palette.primary.main },
    { key: 'districtAverage', label: 'Distrito', color: theme.palette.secondary.main },
    { key: 'stateAverage', label: 'Estado', color: theme.palette.warning.main },
    { key: 'nationalAverage', label: 'Nacional', color: theme.palette.info.main },
    { key: 'target', label: 'Meta', color: theme.palette.error.main }
  ];

  // Calcular valor máximo para eixos
  const maxValue = Math.max(
    ...data.flatMap(item => [
      item.schoolAverage,
      item.districtAverage,
      item.stateAverage,
      item.nationalAverage,
      item.target
    ])
  );

  // Manipuladores de eventos
  const handleChartTypeChange = (
    _: React.MouseEvent<HTMLElement>,
    newType: 'radar' | 'bar' | null,
  ) => {
    if (newType !== null) {
      setChartType(newType);
    }
  };

  const handleToggleDataOption = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.name;
    setShowPerformanceLabels(prev => {
      if (prev.includes(value)) {
        return prev.filter(key => key !== value);
      } else {
        return [...prev, value];
      }
    });
  };

  // Tooltip personalizado
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <Paper elevation={3} sx={{ p: 2, maxWidth: 250 }}>
          <Typography variant="subtitle2" gutterBottom>
            {label}
          </Typography>
          {payload.map((entry: any, index: number) => (
            <Typography
              key={`tooltip-item-${index}`}
              variant="body2"
              sx={{ color: entry.color }}
            >
              <strong>{entry.name}:</strong> {entry.value.toFixed(1)}
            </Typography>
          ))}
        </Paper>
      );
    }
    return null;
  };

  // Obter cor por chave de dados
  const getColorForKey = (key: string): string => {
    const option = dataOptions.find(opt => opt.label === key);
    return option ? option.color : theme.palette.grey[500];
  };

  // Renderizar gráfico adequado
  const renderChart = () => {
    const filteredOptions = dataOptions.filter(opt =>
      showPerformanceLabels.includes(opt.key)
    );

    if (chartType === 'radar') {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart outerRadius={150} data={formattedData}>
            <PolarGrid gridType="polygon" />
            <PolarAngleAxis dataKey="domain" />
            <PolarRadiusAxis domain={[0, Math.ceil(maxValue * 1.1)]} />

            {filteredOptions.map(option => (
              <Radar
                key={option.key}
                name={option.label}
                dataKey={option.label}
                stroke={option.color}
                fill={option.color}
                fillOpacity={0.2}
              />
            ))}

            <Tooltip content={<CustomTooltip />} />
            <Legend />
          </RadarChart>
        </ResponsiveContainer>
      );
    } else {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={formattedData}
            margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="domain" angle={-45} textAnchor="end" height={70} />
            <YAxis domain={[0, Math.ceil(maxValue * 1.1)]} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />

            {filteredOptions.map(option => (
              <Bar
                key={option.key}
                dataKey={option.label}
                name={option.label}
                fill={option.color}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      );
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
        ...(style || {})
      }}
      className={className || undefined}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
        <Typography variant="h6">{title}</Typography>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <ToggleButtonGroup
            value={chartType}
            exclusive
            onChange={handleChartTypeChange}
            size="small"
            aria-label="tipo de visualização"
            sx={{ mr: 2 }}
          >
            <ToggleButton value="radar" aria-label="gráfico de radar">
              <RadarOutlined />
            </ToggleButton>
            <ToggleButton value="bar" aria-label="gráfico de barras">
              <BarChartOutlined />
            </ToggleButton>
          </ToggleButtonGroup>

          <FormGroup row>
            {dataOptions.map(option => (
              <FormControlLabel
                key={option.key}
                control={
                  <Switch
                    checked={showPerformanceLabels.includes(option.key)}
                    onChange={handleToggleDataOption}
                    name={option.key}
                    size="small"
                    sx={{
                      '& .MuiSwitch-track': {
                        bgcolor: option.color,
                        opacity: showPerformanceLabels.includes(option.key) ? 0.5 : 0.1
                      },
                      '& .Mui-checked .MuiSwitch-thumb': { bgcolor: option.color }
                    }}
                  />
                }
                label={<Typography variant="body2">{option.label}</Typography>}
              />
            ))}
          </FormGroup>
        </Box>
      </Box>

      <Box sx={{ flex: 1, minHeight: 0 }}>
        {renderChart()}
      </Box>

      <Typography variant="body2" color="text.secondary" sx={{ mt: 2, textAlign: 'right' }}>
        Comparação de {data.length} domínios acadêmicos
      </Typography>
    </Box>
  );
};
