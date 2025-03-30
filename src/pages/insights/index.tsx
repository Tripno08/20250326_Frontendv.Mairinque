import React, { useState } from 'react'
import { Box, Container, Typography } from '@mui/material'
import { ActionableInsightsDashboard } from '@/components/insights/ActionableInsightsDashboard'
import { mockInsights } from '@/data/mockInsights'
import { UserProfile } from '@/types/actionable-insights'

/**
 * Página que demonstra o dashboard de insights acionáveis.
 */
const InsightsPage: React.FC = () => {
  const [activeProfile, setActiveProfile] = useState<UserProfile>('teacher')

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 8 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Dashboard de Insights Acionáveis
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Visualize, analise e tome ações baseadas em insights gerados pelo sistema
        </Typography>
      </Box>

      <ActionableInsightsDashboard
        insights={mockInsights}
        activeProfile={activeProfile}
        onProfileChange={(profile) => setActiveProfile(profile)}
        isLoading={false}
        error={null}
      />
    </Container>
  )
}

export default InsightsPage
