import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Typography,
  Paper,
  Divider,
  Grid,
  Card,
  CardContent,
  Button,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  Chip,
  useTheme,
  ToggleButtonGroup,
  ToggleButton,
  Tooltip as MuiTooltip,
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
  ReferenceLine,
} from 'recharts';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { motion, AnimatePresence } from 'framer-motion';
import { ActionableInsight, ImpactSimulation } from '@/types/actionable-insights';

// Dados simulados para simulação de impacto
const generateSimulationFromInsight = (insight: ActionableInsight): ImpactSimulation => {
  // Gera cenários diferentes com base no insight
  const scenarios = [
    {
      id: `scenario-baseline-${insight.id}`,
      name: 'Manter Situação Atual',
      description: 'Nenhuma ação é tomada, mantendo a situação atual sem mudanças.',
      impactMetrics: [
        {
          metric: 'Desempenho Acadêmico',
          currentValue: 65,
          projectedValue: 63,
          percentChange: -3.1,
        },
        {
          metric: 'Engajamento',
          currentValue: 58,
          projectedValue: 55,
          percentChange: -5.2,
        },
        {
          metric: 'Índice de Conclusão',
          currentValue: 78,
          projectedValue: 76,
          percentChange: -2.6,
        },
      ],
    },
    {
      id: `scenario-action-${insight.id}`,
      name: 'Implementar Ações Sugeridas',
      description: `Implementação das ações sugeridas: ${insight.suggestedActions.join(', ')}`,
      impactMetrics: [
        {
          metric: 'Desempenho Acadêmico',
          currentValue: 65,
          projectedValue: 72,
          percentChange: 10.8,
        },
        {
          metric: 'Engajamento',
          currentValue: 58,
          projectedValue: 67,
          percentChange: 15.5,
        },
        {
          metric: 'Índice de Conclusão',
          currentValue: 78,
          projectedValue: 84,
          percentChange: 7.7,
        },
      ],
    },
    {
      id: `scenario-alternative-${insight.id}`,
      name: 'Abordagem Alternativa',
      description:
        'Implementação de uma abordagem alternativa com foco em intervenções mais intensivas.',
      impactMetrics: [
        {
          metric: 'Desempenho Acadêmico',
          currentValue: 65,
          projectedValue: 69,
          percentChange: 6.2,
        },
        {
          metric: 'Engajamento',
          currentValue: 58,
          projectedValue: 70,
          percentChange: 20.7,
        },
        {
          metric: 'Índice de Conclusão',
          currentValue: 78,
          projectedValue: 81,
          percentChange: 3.8,
        },
      ],
    },
  ];

  return {
    id: `simulation-${insight.id}`,
    title: `Simulação de Impacto: ${insight.title}`,
    description: `Simulação dos possíveis impactos ao lidar com: ${insight.description}`,
    scenarios,
  };
};

interface ImpactSimulationPanelProps {
  insights: ActionableInsight[];
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Componente que exibe simulações de impacto potencial de decisões.
 */
export const ImpactSimulationPanel: React.FC<ImpactSimulationPanelProps> = ({
  insights,
  className,
  style,
}) => {
  const theme = useTheme();
  const [selectedInsightIndex, setSelectedInsightIndex] = useState<number>(0);
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);
  const [comparisonView, setComparisonView] = useState<'bar' | 'line'>('bar');

  // Gera simulações para os insights
  const simulations = useMemo(() => {
    return insights.slice(0, 5).map(insight => generateSimulationFromInsight(insight));
  }, [insights]);

  // Seleciona o primeiro cenário por padrão
  useEffect(() => {
    if (simulations.length > 0 && simulations[selectedInsightIndex]?.scenarios.length > 0) {
      setSelectedScenario(simulations[selectedInsightIndex].scenarios[0].id);
    }
  }, [simulations, selectedInsightIndex]);

  // Manipula a mudança de insight
  const handleInsightChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedInsightIndex(newValue);
    // Atualiza o cenário selecionado para o primeiro do novo insight
    if (simulations[newValue]?.scenarios.length > 0) {
      setSelectedScenario(simulations[newValue].scenarios[0].id);
    }
  };

  // Manipula a seleção de cenário
  const handleScenarioSelect = (scenarioId: string) => {
    setSelectedScenario(scenarioId);
  };

  // Manipula a mudança do tipo de visualização
  const handleViewChange = (event: React.MouseEvent<HTMLElement>, newView: 'bar' | 'line') => {
    if (newView !== null) {
      setComparisonView(newView);
    }
  };

  // Se não houver simulações, exibe mensagem
  if (simulations.length === 0) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="text.secondary">
          Nenhum insight disponível para simulação de impacto.
        </Typography>
      </Paper>
    );
  }

  const currentSimulation = simulations[selectedInsightIndex];
  const currentScenario = currentSimulation.scenarios.find(s => s.id === selectedScenario);

  // Prepara dados para comparação entre cenários
  const comparisonData = useMemo(() => {
    if (!currentSimulation) return [];

    // Extrai métricas únicas de todos os cenários
    const metrics = Array.from(
      new Set(currentSimulation.scenarios.flatMap(s => s.impactMetrics.map(m => m.metric)))
    );

    // Cria dados para cada métrica
    return metrics.map(metric => {
      const result: Record<string, any> = { metric };

      currentSimulation.scenarios.forEach(scenario => {
        const metricData = scenario.impactMetrics.find(m => m.metric === metric);
        if (metricData) {
          result[`${scenario.name}_current`] = metricData.currentValue;
          result[`${scenario.name}_projected`] = metricData.projectedValue;
        }
      });

      return result;
    });
  }, [currentSimulation]);

  return (
    <Box className={className} style={style}>
      <Typography variant="h5" gutterBottom>
        Simulação de Impacto Potencial
      </Typography>

      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={selectedInsightIndex}
          onChange={handleInsightChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          {simulations.map((simulation, index) => (
            <Tab key={simulation.id} label={`Simulação ${index + 1}`} sx={{ minWidth: 120 }} />
          ))}
        </Tabs>

        <Box sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            {currentSimulation.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            {currentSimulation.description}
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Typography variant="subtitle1" gutterBottom>
                Cenários de Decisão
              </Typography>

              <List sx={{ bgcolor: 'background.paper', borderRadius: 1 }}>
                {currentSimulation.scenarios.map(scenario => (
                  <motion.div
                    key={scenario.id}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <ListItem
                      button
                      selected={selectedScenario === scenario.id}
                      onClick={() => handleScenarioSelect(scenario.id)}
                      sx={{
                        mb: 1,
                        borderRadius: 1,
                        boxShadow: selectedScenario === scenario.id ? 2 : 0,
                        bgcolor:
                          selectedScenario === scenario.id ? 'action.selected' : 'background.paper',
                      }}
                    >
                      <ListItemText
                        primary={scenario.name}
                        secondary={scenario.description}
                        primaryTypographyProps={{
                          fontWeight: selectedScenario === scenario.id ? 'bold' : 'normal',
                        }}
                      />
                    </ListItem>
                  </motion.div>
                ))}
              </List>
            </Grid>

            <Grid item xs={12} md={8}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 2,
                }}
              >
                <Typography variant="subtitle1" gutterBottom>
                  Projeção de Impacto
                </Typography>

                <ToggleButtonGroup
                  value={comparisonView}
                  exclusive
                  onChange={handleViewChange}
                  size="small"
                >
                  <ToggleButton value="bar">Barras</ToggleButton>
                  <ToggleButton value="line">Linhas</ToggleButton>
                </ToggleButtonGroup>
              </Box>

              <AnimatePresence mode="wait">
                <motion.div
                  key={currentScenario?.id || 'empty'}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {currentScenario && (
                    <Box>
                      <Box sx={{ height: 300, mb: 3 }}>
                        {comparisonView === 'bar' ? (
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={currentScenario.impactMetrics}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="metric" />
                              <YAxis domain={[0, 100]} />
                              <Tooltip />
                              <Legend />
                              <Bar
                                dataKey="currentValue"
                                name="Valor Atual"
                                fill={theme.palette.grey[500]}
                              />
                              <Bar
                                dataKey="projectedValue"
                                name="Valor Projetado"
                                fill={theme.palette.primary.main}
                              />
                            </BarChart>
                          </ResponsiveContainer>
                        ) : (
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={currentScenario.impactMetrics}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="metric" />
                              <YAxis domain={[0, 100]} />
                              <Tooltip />
                              <Legend />
                              <Line
                                type="monotone"
                                dataKey="currentValue"
                                name="Valor Atual"
                                stroke={theme.palette.grey[500]}
                              />
                              <Line
                                type="monotone"
                                dataKey="projectedValue"
                                name="Valor Projetado"
                                stroke={theme.palette.primary.main}
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        )}
                      </Box>

                      <Typography variant="subtitle2" gutterBottom>
                        Métricas de Impacto
                      </Typography>

                      <Grid container spacing={2}>
                        {currentScenario.impactMetrics.map((metric, index) => (
                          <Grid item xs={12} sm={6} md={4} key={index}>
                            <Card variant="outlined">
                              <CardContent>
                                <Typography variant="subtitle2" gutterBottom>
                                  {metric.metric}
                                </Typography>

                                <Box
                                  sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    mb: 1,
                                  }}
                                >
                                  <Typography variant="body2" color="text.secondary">
                                    Atual:
                                  </Typography>
                                  <Typography variant="body1" fontWeight="bold">
                                    {metric.currentValue}%
                                  </Typography>
                                </Box>

                                <Box
                                  sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    mb: 1,
                                  }}
                                >
                                  <Typography variant="body2" color="text.secondary">
                                    Projetado:
                                  </Typography>
                                  <Typography variant="body1" fontWeight="bold">
                                    {metric.projectedValue}%
                                  </Typography>
                                </Box>

                                <Box
                                  sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'flex-end',
                                  }}
                                >
                                  <Chip
                                    size="small"
                                    icon={
                                      metric.percentChange > 0 ? (
                                        <TrendingUpIcon />
                                      ) : (
                                        <TrendingDownIcon />
                                      )
                                    }
                                    label={`${metric.percentChange > 0 ? '+' : ''}${metric.percentChange.toFixed(1)}%`}
                                    color={metric.percentChange > 0 ? 'success' : 'error'}
                                  />
                                </Box>
                              </CardContent>
                            </Card>
                          </Grid>
                        ))}
                      </Grid>
                    </Box>
                  )}
                </motion.div>
              </AnimatePresence>

              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                <MuiTooltip title="Este é apenas um modelo de simulação. Em um ambiente de produção, estas simulações seriam baseadas em modelos preditivos avançados usando dados históricos reais.">
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <HelpOutlineIcon color="action" fontSize="small" sx={{ mr: 1 }} />
                    <Typography variant="caption" color="text.secondary">
                      Simulação baseada em modelos preditivos
                    </Typography>
                  </Box>
                </MuiTooltip>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
};
