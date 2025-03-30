import React from 'react'
import {
  Box,
  Typography,
  Paper,
  Grid,
  Divider,
  useTheme,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts'
import CompareArrowsIcon from '@mui/icons-material/CompareArrows'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import TrendingDownIcon from '@mui/icons-material/TrendingDown'
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat'
import SourceIcon from '@mui/icons-material/Source'
import { motion } from 'framer-motion'
import { ComparativeInsightProps } from '@/types/actionable-insights'

/**
 * Componente que exibe uma visualização comparativa detalhada de um insight.
 */
export const ComparativeInsight: React.FC<ComparativeInsightProps> = ({
  insight,
  showEvidence = true,
  className,
  style
}) => {
  const theme = useTheme()

  // Se não houver evidência ou showEvidence for false, não renderiza o componente
  if (!showEvidence || !insight.evidence) {
    return null
  }

  const { dataPoints, trend, sources } = insight.evidence

  // Função para renderizar o ícone de tendência
  const getTrendIcon = () => {
    if (!trend) return <TrendingFlatIcon />

    switch (trend.direction) {
      case 'up':
        return <TrendingUpIcon color="success" />
      case 'down':
        return <TrendingDownIcon color="error" />
      case 'stable':
      default:
        return <TrendingFlatIcon color="action" />
    }
  }

  // Função para renderizar o texto de tendência
  const getTrendText = () => {
    if (!trend) return 'Sem dados de tendência'

    const directionText =
      trend.direction === 'up' ? 'aumento' :
      trend.direction === 'down' ? 'redução' :
      'estabilidade'

    const percentText = trend.percentChange
      ? `${Math.abs(trend.percentChange).toFixed(1)}%`
      : ''

    return `${directionText} ${percentText} no período ${trend.period}`
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={className}
      style={style}
    >
      <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom>
          Evidências: {insight.title}
        </Typography>

        <Divider sx={{ mb: 2 }} />

        {/* Gráfico de comparação */}
        <Box sx={{ height: 300, mb: 3 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dataPoints}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value, name) => [value, name === 'value' ? 'Valor Atual' : name === 'baseline' ? 'Linha Base' : 'Comparação']} />
              <Legend />
              <Bar dataKey="value" name="Valor Atual" fill={theme.palette.primary.main} />
              {dataPoints.some(d => d.baseline !== undefined) && (
                <Bar dataKey="baseline" name="Linha Base" fill={theme.palette.grey[500]} />
              )}
              {dataPoints.some(d => d.comparisonValue !== undefined) && (
                <Bar dataKey="comparisonValue" name="Comparação" fill={theme.palette.secondary.main} />
              )}
            </BarChart>
          </ResponsiveContainer>
        </Box>

        <Grid container spacing={3}>
          {/* Informações de tendência */}
          {trend && (
            <Grid item xs={12} md={6}>
              <Box>
                <Typography variant="subtitle1" gutterBottom>
                  Tendência
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  {getTrendIcon()}
                  <Typography variant="body2" sx={{ ml: 1 }}>
                    {getTrendText()}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          )}

          {/* Fontes de dados */}
          {sources && sources.length > 0 && (
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom>
                Fontes de Dados
              </Typography>
              <List dense>
                {sources.map((source, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <SourceIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary={source} />
                  </ListItem>
                ))}
              </List>
            </Grid>
          )}
        </Grid>
      </Paper>
    </motion.div>
  )
}
