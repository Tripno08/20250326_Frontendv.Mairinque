import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Tab,
  Tabs,
  useTheme,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectChangeEvent,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';
import { motion } from 'framer-motion';
import { ActionableInsight } from '@/types/actionable-insights';
import { ComparativeInsight } from './ComparativeInsight';

interface InsightVisualizationProps {
  insights: ActionableInsight[];
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Componente que exibe visualizações comparativas para insights com evidências.
 */
export const InsightVisualization: React.FC<InsightVisualizationProps> = ({
  insights,
  className,
  style,
}) => {
  const theme = useTheme();
  const [visualizationType, setVisualizationType] = useState<string>('alertLevel');
  const [selectedInsight, setSelectedInsight] = useState<string | null>(null);

  // Categorias para visualização
  const categories = [
    { value: 'alertLevel', label: 'Por Nível de Alerta' },
    { value: 'category', label: 'Por Categoria' },
    { value: 'impactArea', label: 'Por Área de Impacto' },
    { value: 'profileRelevance', label: 'Por Relevância de Perfil' },
    { value: 'timeline', label: 'Linha do Tempo' },
  ];

  // Manipula a mudança do tipo de visualização
  const handleVisualizationTypeChange = (event: SelectChangeEvent) => {
    setVisualizationType(event.target.value);
  };

  // Manipula a seleção de um insight
  const handleInsightSelect = (insightId: string) => {
    setSelectedInsight(insightId === selectedInsight ? null : insightId);
  };

  // Preparação de dados para gráficos por nível de alerta
  const alertLevelData = React.useMemo(() => {
    const counts: Record<string, number> = { low: 0, moderate: 0, high: 0, critical: 0 };

    insights.forEach(insight => {
      counts[insight.alertLevel]++;
    });

    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [insights]);

  // Preparação de dados para gráficos por categoria
  const categoryData = React.useMemo(() => {
    const counts: Record<string, number> = {};

    insights.forEach(insight => {
      counts[insight.category] = (counts[insight.category] || 0) + 1;
    });

    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [insights]);

  // Preparação de dados para gráficos por área de impacto
  const impactAreaData = React.useMemo(() => {
    const counts: Record<string, number> = {};

    insights.forEach(insight => {
      insight.impactArea.forEach(area => {
        counts[area] = (counts[area] || 0) + 1;
      });
    });

    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [insights]);

  // Preparação de dados para gráficos por relevância de perfil
  const profileRelevanceData = React.useMemo(() => {
    const profiles = ['teacher', 'specialist', 'coordinator', 'principal', 'administrator'];
    const data = profiles.map(profile => {
      const avg =
        insights.reduce((sum, insight) => sum + insight.profileRelevance[profile], 0) /
          insights.length || 0;

      return {
        name:
          profile === 'teacher'
            ? 'Professor'
            : profile === 'specialist'
              ? 'Especialista'
              : profile === 'coordinator'
                ? 'Coordenador'
                : profile === 'principal'
                  ? 'Diretor'
                  : 'Administrador',
        value: Math.round(avg * 100),
      };
    });

    return data;
  }, [insights]);

  // Preparação de dados para linha do tempo
  const timelineData = React.useMemo(() => {
    // Agrupar insights por mês
    const monthlyData: Record<string, Record<string, number>> = {};

    insights.forEach(insight => {
      const date = new Date(insight.timestamp);
      const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;

      if (!monthlyData[monthYear]) {
        monthlyData[monthYear] = {
          low: 0,
          moderate: 0,
          high: 0,
          critical: 0,
        };
      }

      monthlyData[monthYear][insight.alertLevel]++;
    });

    // Ordenar por data
    return Object.entries(monthlyData)
      .map(([date, counts]) => ({
        date,
        ...counts,
      }))
      .sort((a, b) => {
        const [monthA, yearA] = a.date.split('/');
        const [monthB, yearB] = b.date.split('/');
        return Number(yearA) - Number(yearB) || Number(monthA) - Number(monthB);
      });
  }, [insights]);

  // Cores para gráficos
  const ALERT_COLORS = {
    low: '#4caf50', // verde
    moderate: '#ff9800', // laranja
    high: '#f44336', // vermelho
    critical: '#d32f2f', // vermelho escuro
  };

  const COLORS = [
    theme.palette.primary.main,
    theme.palette.secondary.main,
    theme.palette.error.main,
    theme.palette.warning.main,
    theme.palette.info.main,
    theme.palette.success.main,
    ...Object.values(ALERT_COLORS),
  ];

  // Renderiza o gráfico apropriado com base no tipo selecionado
  const renderVisualization = () => {
    switch (visualizationType) {
      case 'alertLevel':
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Distribuição por Nível de Alerta
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2, height: 400 }}>
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
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2, height: 400 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={alertLevelData}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={110}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {alertLevelData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={ALERT_COLORS[entry.name] || COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        );

      case 'category':
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Distribuição por Categoria
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2, height: 400 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={categoryData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar
                        dataKey="value"
                        name="Quantidade de Insights"
                        fill={theme.palette.primary.main}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2, height: 400 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={110}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        );

      case 'impactArea':
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Distribuição por Área de Impacto
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2, height: 400 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={impactAreaData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar
                        dataKey="value"
                        name="Quantidade de Insights"
                        fill={theme.palette.secondary.main}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2, height: 400 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart outerRadius={90} width={500} height={350} data={impactAreaData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="name" />
                      <PolarRadiusAxis angle={30} domain={[0, 'auto']} />
                      <Radar
                        name="Quantidade de Insights"
                        dataKey="value"
                        stroke={theme.palette.primary.main}
                        fill={theme.palette.primary.main}
                        fillOpacity={0.6}
                      />
                      <Legend />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        );

      case 'profileRelevance':
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Relevância Média por Perfil (%)
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={12}>
                <Paper sx={{ p: 2, height: 400 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={profileRelevanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Legend />
                      <Bar
                        dataKey="value"
                        name="Relevância Média (%)"
                        fill={theme.palette.info.main}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        );

      case 'timeline':
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Evolução Temporal de Insights
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Paper sx={{ p: 2, height: 400 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={timelineData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="low" name="Baixo" stroke={ALERT_COLORS.low} />
                      <Line
                        type="monotone"
                        dataKey="moderate"
                        name="Moderado"
                        stroke={ALERT_COLORS.moderate}
                      />
                      <Line type="monotone" dataKey="high" name="Alto" stroke={ALERT_COLORS.high} />
                      <Line
                        type="monotone"
                        dataKey="critical"
                        name="Crítico"
                        stroke={ALERT_COLORS.critical}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Box className={className} style={style}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          Visualizações de Insights
        </Typography>
        <FormControl sx={{ minWidth: 250 }}>
          <InputLabel id="visualization-type-label">Tipo de Visualização</InputLabel>
          <Select
            labelId="visualization-type-label"
            id="visualization-type"
            value={visualizationType}
            label="Tipo de Visualização"
            onChange={handleVisualizationTypeChange}
          >
            {categories.map(category => (
              <MenuItem key={category.value} value={category.value}>
                {category.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <motion.div
        key={visualizationType}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {renderVisualization()}
      </motion.div>

      {selectedInsight && (
        <Box sx={{ mt: 3 }}>
          <ComparativeInsight
            insight={insights.find(i => i.id === selectedInsight)!}
            showEvidence={true}
          />
        </Box>
      )}
    </Box>
  );
};
