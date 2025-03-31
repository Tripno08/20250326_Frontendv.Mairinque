import React, { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Theme,
  SxProps,
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ScatterChart,
  Scatter,
  ResponsiveContainer,
} from 'recharts';
import { useAIAnalysis } from '../hooks/useAIAnalysis';
import { StudentData } from '../types/ai.types';
import { styles } from '../styles/AIAnalysisDashboard.styles';
import GridContainer from '@/components/GridContainer';
import GridItem from '@/components/GridItem';

interface AIAnalysisDashboardProps {
  students: StudentData[];
  onStudentSelect?: (studentId: string) => void;
}

export function AIAnalysisDashboard({ students, onStudentSelect }: AIAnalysisDashboardProps) {
  const {
    riskPredictions,
    recommendations,
    clusters,
    patterns,
    isLoading,
    error,
    analyzeStudents,
    getClusterVisualization,
    getPatternsByType,
  } = useAIAnalysis({
    riskModelConfig: {
      learningRate: 0.001,
      epochs: 100,
      batchSize: 32,
      validationSplit: 0.2,
      features: ['averageGrade', 'attendance', 'behavior'],
      targetVariable: 'risk',
    },
    clusteringConfig: {
      numClusters: 5,
      embeddingDimension: 2,
    },
    patternConfig: {
      anomalyThreshold: 2.0,
      timeWindow: 30,
    },
  });

  useEffect(() => {
    if (students.length > 0) {
      analyzeStudents(students);
    }
  }, [students, analyzeStudents]);

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: 400,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ margin: 2 }}>
        Erro ao carregar análise: {error.message}
      </Alert>
    );
  }

  const clusterData = getClusterVisualization();
  const anomalies = getPatternsByType('anomaly');
  const trends = getPatternsByType('trend');

  // Definir estilos com SxProps para uso no componente
  const cardSx: SxProps<Theme> = {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    transition: 'transform 0.2s ease-in-out',
    '&:hover': {
      transform: 'translateY(-4px)',
    },
  };

  const summaryMetricValueSx: SxProps<Theme> = {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: 'primary.main',
  };

  const chartContainerStyle = {
    height: 300,
    marginTop: 2,
  };

  const anomalyCardSx: SxProps<Theme> = {
    ...cardSx,
    borderLeft: '4px solid',
    borderLeftColor: 'error.main',
  };

  const trendCardSx: SxProps<Theme> = {
    ...cardSx,
    borderLeft: '4px solid',
    borderLeftColor: 'success.main',
  };

  const cardHeaderSx: SxProps<Theme> = {
    bgcolor: 'primary.main',
    color: 'primary.contrastText',
  };

  const cardContentSx: SxProps<Theme> = {
    flexGrow: 1,
  };

  const metricLabelSx: SxProps<Theme> = {
    color: 'text.secondary',
    fontSize: '0.875rem',
  };

  const metricValueSx: SxProps<Theme> = {
    fontSize: '1.25rem',
    fontWeight: 'bold',
  };

  const dividerSx: SxProps<Theme> = {
    my: 1,
  };

  return (
    <Box sx={{ padding: 3, backgroundColor: 'background.default' }}>
      <GridContainer spacing={3}>
        {/* Cards de Resumo */}
        <GridItem xs={12} md={3}>
          <Card sx={cardSx}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Estudantes em Risco
              </Typography>
              <Typography sx={summaryMetricValueSx}>
                {riskPredictions.filter(p => p.riskScore > 0.7).length}
              </Typography>
            </CardContent>
          </Card>
        </GridItem>
        <GridItem xs={12} md={3}>
          <Card sx={cardSx}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recomendações Ativas
              </Typography>
              <Typography sx={summaryMetricValueSx}>
                {recommendations.filter(r => r.priority === 'high').length}
              </Typography>
            </CardContent>
          </Card>
        </GridItem>
        <GridItem xs={12} md={3}>
          <Card sx={cardSx}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Clusters Identificados
              </Typography>
              <Typography sx={summaryMetricValueSx}>{clusters.length}</Typography>
            </CardContent>
          </Card>
        </GridItem>
        <GridItem xs={12} md={3}>
          <Card sx={cardSx}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Padrões Detectados
              </Typography>
              <Typography sx={summaryMetricValueSx}>{patterns.length}</Typography>
            </CardContent>
          </Card>
        </GridItem>

        {/* Gráfico de Distribuição de Risco */}
        <GridItem xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Distribuição de Risco
            </Typography>
            <div style={chartContainerStyle}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={riskPredictions}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="studentId" />
                  <YAxis domain={[0, 1]} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="riskScore" stroke="#8884d8" name="Risco" />
                  <Line type="monotone" dataKey="confidence" stroke="#82ca9d" name="Confiança" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Paper>
        </GridItem>

        {/* Visualização de Clusters */}
        <GridItem xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Clusters de Estudantes
            </Typography>
            <div style={chartContainerStyle}>
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="x" />
                  <YAxis dataKey="y" />
                  <Tooltip />
                  <Legend />
                  {clusters.map((cluster, index) => (
                    <Scatter
                      key={cluster.id}
                      name={`Cluster ${index + 1}`}
                      data={clusterData.x
                        .map((x, i) => ({
                          x,
                          y: clusterData.y[i],
                          cluster: clusterData.labels[i],
                        }))
                        .filter(data => data.cluster === index)}
                      fill={`hsl(${(index * 137) % 360}, 70%, 50%)`}
                    />
                  ))}
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </Paper>
        </GridItem>

        {/* Anomalias Detectadas */}
        <GridItem xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Anomalias Detectadas
            </Typography>
            <GridContainer spacing={2}>
              {anomalies.map(anomaly => (
                <GridItem xs={12} sm={6} md={4} key={anomaly.id}>
                  <Card sx={anomalyCardSx}>
                    <CardHeader
                      title={anomaly.description}
                      subheader={`Confiança: ${(anomaly.confidence * 100).toFixed(1)}%`}
                      sx={cardHeaderSx}
                    />
                    <CardContent sx={cardContentSx}>
                      <Typography variant="body2" sx={metricLabelSx}>
                        Estudantes afetados: {anomaly.affectedStudents.length}
                      </Typography>
                      <Divider sx={dividerSx} />
                      {anomaly.metrics.map(metric => (
                        <Typography key={metric.name} variant="body2">
                          <Box component="span" sx={metricLabelSx}>
                            {metric.name}:
                          </Box>{' '}
                          <Box component="span" sx={metricValueSx}>
                            {metric.value.toFixed(2)}
                          </Box>
                        </Typography>
                      ))}
                    </CardContent>
                  </Card>
                </GridItem>
              ))}
            </GridContainer>
          </Paper>
        </GridItem>

        {/* Tendências Identificadas */}
        <GridItem xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Tendências Identificadas
            </Typography>
            <GridContainer spacing={2}>
              {trends.map(trend => (
                <GridItem xs={12} sm={6} md={4} key={trend.id}>
                  <Card sx={trendCardSx}>
                    <CardHeader
                      title={trend.description}
                      subheader={`Confiança: ${(trend.confidence * 100).toFixed(1)}%`}
                      sx={cardHeaderSx}
                    />
                    <CardContent sx={cardContentSx}>
                      <Typography variant="body2" sx={metricLabelSx}>
                        Estudantes afetados: {trend.affectedStudents.length}
                      </Typography>
                      <Divider sx={dividerSx} />
                      {trend.metrics.map(metric => (
                        <Typography key={metric.name} variant="body2">
                          <Box component="span" sx={metricLabelSx}>
                            {metric.name}:
                          </Box>{' '}
                          <Box component="span" sx={metricValueSx}>
                            {metric.value.toFixed(2)}
                          </Box>
                        </Typography>
                      ))}
                    </CardContent>
                  </Card>
                </GridItem>
              ))}
            </GridContainer>
          </Paper>
        </GridItem>
      </GridContainer>
    </Box>
  );
}
