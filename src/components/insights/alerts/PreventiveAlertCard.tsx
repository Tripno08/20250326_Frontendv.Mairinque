import React, { useState } from 'react'
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  Button,
  Collapse,
  Divider,
  List,
  ListItem,
  ListItemText,
  useTheme
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import DoneIcon from '@mui/icons-material/Done'
import CloseIcon from '@mui/icons-material/Close'
import ArrowRightIcon from '@mui/icons-material/ArrowRight'
import { motion } from 'framer-motion'
import { PreventiveAlertProps, AlertLevel } from '@/types/actionable-insights'

// Mapeamento de cores para níveis de alerta
const alertLevelColors: Record<AlertLevel, string> = {
  'low': '#4caf50',      // verde
  'moderate': '#ff9800', // laranja
  'high': '#f44336',     // vermelho
  'critical': '#d32f2f'  // vermelho escuro
}

// Mapeamento de textos para níveis de alerta
const alertLevelText: Record<AlertLevel, string> = {
  'low': 'Baixo',
  'moderate': 'Moderado',
  'high': 'Alto',
  'critical': 'Crítico'
}

/**
 * Componente que exibe um alerta preventivo com indicadores visuais.
 */
export const PreventiveAlertCard: React.FC<PreventiveAlertProps> = ({
  insight,
  onAcknowledge,
  onResolve,
  onDismiss,
  expanded = false,
  className,
  style
}) => {
  const theme = useTheme()
  const [isExpanded, setIsExpanded] = useState<boolean>(expanded)

  // Formata a data para exibição
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  // Manipula o reconhecimento do alerta
  const handleAcknowledge = () => {
    onAcknowledge?.(insight.id)
  }

  // Manipula a resolução do alerta
  const handleResolve = () => {
    onResolve?.(insight.id)
  }

  // Manipula a dispensa do alerta
  const handleDismiss = () => {
    onDismiss?.(insight.id)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={className}
      style={style}
      layout
    >
      <Card
        sx={{
          position: 'relative',
          borderLeft: `4px solid ${alertLevelColors[insight.alertLevel]}`,
          mb: 2,
          '&:hover': {
            boxShadow: theme.shadows[4]
          },
          transition: 'box-shadow 0.3s ease-in-out'
        }}
      >
        {/* Indicador de status */}
        {insight.isAcknowledged && (
          <Chip
            size="small"
            label="Reconhecido"
            icon={<CheckCircleIcon />}
            color="info"
            sx={{
              position: 'absolute',
              top: 8,
              right: 8
            }}
          />
        )}

        {insight.isResolved && (
          <Chip
            size="small"
            label="Resolvido"
            icon={<DoneIcon />}
            color="success"
            sx={{
              position: 'absolute',
              top: 8,
              right: insight.isAcknowledged ? 110 : 8
            }}
          />
        )}

        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Chip
                  label={alertLevelText[insight.alertLevel]}
                  size="small"
                  sx={{
                    bgcolor: alertLevelColors[insight.alertLevel],
                    color: 'white',
                    mr: 1,
                    fontWeight: 'bold'
                  }}
                />
                <Chip
                  label={insight.category}
                  size="small"
                  variant="outlined"
                  sx={{ mr: 1 }}
                />
                <Typography variant="caption" color="text.secondary">
                  {formatDate(insight.timestamp)}
                </Typography>
              </Box>

              <Typography variant="h6" component="h2" gutterBottom>
                {insight.title}
              </Typography>

              <Typography variant="body2" color="text.secondary">
                {insight.description}
              </Typography>
            </Box>

            <IconButton
              onClick={() => setIsExpanded(!isExpanded)}
              aria-expanded={isExpanded}
              aria-label="mostrar mais"
              sx={{
                transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.3s'
              }}
            >
              <ExpandMoreIcon />
            </IconButton>
          </Box>

          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            <Box sx={{ mt: 2 }}>
              <Divider sx={{ mb: 2 }} />

              <Typography variant="subtitle2" gutterBottom>
                Impacto Potencial: {insight.potentialImpact ? `${insight.potentialImpact}%` : 'Não determinado'}
              </Typography>

              <Typography variant="subtitle2" gutterBottom>
                Áreas de Impacto:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                {insight.impactArea.map((area) => (
                  <Chip key={area} label={area} size="small" variant="outlined" />
                ))}
              </Box>

              <Typography variant="subtitle2" gutterBottom>
                Ações Sugeridas:
              </Typography>
              <List dense disablePadding>
                {insight.suggestedActions.map((action, index) => (
                  <ListItem key={index} sx={{ py: 0.5 }}>
                    <ArrowRightIcon fontSize="small" sx={{ mr: 1, color: theme.palette.primary.main }} />
                    <ListItemText primary={action} />
                  </ListItem>
                ))}
              </List>

              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, gap: 1 }}>
                {!insight.isAcknowledged && (
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<CheckCircleIcon />}
                    onClick={handleAcknowledge}
                    disabled={insight.isResolved}
                  >
                    Reconhecer
                  </Button>
                )}

                {!insight.isResolved && (
                  <Button
                    size="small"
                    variant="contained"
                    color="success"
                    startIcon={<DoneIcon />}
                    onClick={handleResolve}
                  >
                    Resolver
                  </Button>
                )}

                <Button
                  size="small"
                  variant="outlined"
                  color="error"
                  startIcon={<CloseIcon />}
                  onClick={handleDismiss}
                >
                  Dispensar
                </Button>
              </Box>
            </Box>
          </Collapse>
        </CardContent>
      </Card>
    </motion.div>
  )
}
