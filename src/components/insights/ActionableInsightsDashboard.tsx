import React, { useState, useMemo } from 'react'
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Grid,
  Tabs,
  Tab,
  Divider,
  useTheme,
  Paper
} from '@mui/material'
import { motion } from 'framer-motion'
import {
  ActionableInsightsDashboardProps,
  ActionableInsight,
  UserProfile,
  InsightFilters
} from '@/types/actionable-insights'
import { PreventiveAlertCard } from './alerts/PreventiveAlertCard'
import { ProfileSuggestionList } from './suggestions/ProfileSuggestionList'
import { InsightFilterPanel } from './filters/InsightFilterPanel'
import { InsightVisualization } from './visualizations/InsightVisualization'
import { ImpactSimulationPanel } from './simulations/ImpactSimulationPanel'

/**
 * Componente principal para o dashboard de insights acionáveis.
 * Este componente integra todos os subcomponentes do sistema de insights.
 */
export const ActionableInsightsDashboard: React.FC<ActionableInsightsDashboardProps> = ({
  insights,
  activeProfile = 'teacher',
  isLoading = false,
  error = null,
  onInsightSelect,
  onFilterChange,
  onProfileChange,
  className,
  style,
}) => {
  const theme = useTheme()
  const [selectedTab, setSelectedTab] = useState<number>(0)
  const [filters, setFilters] = useState<InsightFilters>({
    alertLevel: undefined,
    categories: undefined,
    impactAreas: undefined,
    dateRange: undefined,
    showResolved: false,
    showAcknowledged: true,
    relevanceThreshold: 0
  })

  // Filtra insights com base nos filtros selecionados
  const filteredInsights = useMemo(() => {
    return insights.filter(insight => {
      // Filtra por nível de alerta
      if (filters.alertLevel?.length && !filters.alertLevel.includes(insight.alertLevel)) {
        return false
      }

      // Filtra por categoria
      if (filters.categories?.length && !filters.categories.includes(insight.category)) {
        return false
      }

      // Filtra por área de impacto
      if (filters.impactAreas?.length &&
          !insight.impactArea.some(area => filters.impactAreas?.includes(area))) {
        return false
      }

      // Filtra por status de resolução
      if (!filters.showResolved && insight.isResolved) {
        return false
      }

      // Filtra por status de reconhecimento
      if (!filters.showAcknowledged && insight.isAcknowledged) {
        return false
      }

      // Filtra por relevância para o perfil ativo
      if (filters.relevanceThreshold &&
          insight.profileRelevance[activeProfile] < filters.relevanceThreshold) {
        return false
      }

      return true
    })
  }, [insights, filters, activeProfile])

  // Ordena insights por nível de alerta e relevância para o perfil ativo
  const sortedInsights = useMemo(() => {
    return [...filteredInsights].sort((a, b) => {
      const alertPriority = { 'critical': 4, 'high': 3, 'moderate': 2, 'low': 1 }
      const alertDiff = alertPriority[b.alertLevel] - alertPriority[a.alertLevel]

      if (alertDiff !== 0) return alertDiff

      return b.profileRelevance[activeProfile] - a.profileRelevance[activeProfile]
    })
  }, [filteredInsights, activeProfile])

  // Insights mais relevantes para o perfil ativo
  const profileRelevantInsights = useMemo(() => {
    return [...sortedInsights]
      .sort((a, b) => b.profileRelevance[activeProfile] - a.profileRelevance[activeProfile])
      .slice(0, 5)
  }, [sortedInsights, activeProfile])

  // Gerencia mudanças nos filtros
  const handleFilterChange = (newFilters: InsightFilters) => {
    setFilters(newFilters)
    onFilterChange?.(newFilters)
  }

  // Gerencia mudanças no perfil ativo
  const handleProfileChange = (profile: UserProfile) => {
    onProfileChange?.(profile)
  }

  // Gerencia a navegação entre abas
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue)
  }

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Alert severity="error">
        Erro ao carregar insights: {error.message}
      </Alert>
    )
  }

  return (
    <Box className={className} style={style}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4" component="h1" color="primary">
            Insights Acionáveis
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {filteredInsights.length} insights disponíveis
          </Typography>
        </Box>

        <Paper sx={{ mb: 3, p: 2 }}>
          <InsightFilterPanel
            filters={filters}
            onFilterChange={handleFilterChange}
            activeProfile={activeProfile}
            onProfileChange={handleProfileChange}
          />
        </Paper>

        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ mb: 2, borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Alertas" />
          <Tab label="Sugestões" />
          <Tab label="Visualizações" />
          <Tab label="Simulações" />
        </Tabs>

        {/* Painel de Alertas */}
        {selectedTab === 0 && (
          <Grid container spacing={2}>
            {sortedInsights.map(insight => (
              <Grid item xs={12} key={insight.id}>
                <PreventiveAlertCard
                  insight={insight}
                  onAcknowledge={(id) => console.log('Acknowledge', id)}
                  onResolve={(id) => console.log('Resolve', id)}
                  onDismiss={(id) => console.log('Dismiss', id)}
                />
              </Grid>
            ))}
            {sortedInsights.length === 0 && (
              <Grid item xs={12}>
                <Alert severity="info">
                  Nenhum alerta encontrado com os filtros atuais.
                </Alert>
              </Grid>
            )}
          </Grid>
        )}

        {/* Painel de Sugestões */}
        {selectedTab === 1 && (
          <ProfileSuggestionList
            insights={profileRelevantInsights}
            profile={activeProfile}
          />
        )}

        {/* Painel de Visualizações */}
        {selectedTab === 2 && (
          <InsightVisualization insights={sortedInsights} />
        )}

        {/* Painel de Simulações */}
        {selectedTab === 3 && (
          <ImpactSimulationPanel insights={sortedInsights} />
        )}
      </motion.div>
    </Box>
  )
}
