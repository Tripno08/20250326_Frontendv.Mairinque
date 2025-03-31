import React from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Avatar,
  Paper,
  Chip,
} from '@mui/material';
import {
  PersonOutline as PersonIcon,
  School as SchoolIcon,
  SupervisorAccount as SupervisorIcon,
  Build as BuildIcon,
  Assessment as AssessmentIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { ProfileSuggestionsProps, UserProfile } from '@/types/actionable-insights';

// Mapeamento de ícones por perfil de usuário
const profileIcons: Record<UserProfile, React.ReactNode> = {
  teacher: <PersonIcon />,
  specialist: <BuildIcon />,
  coordinator: <SupervisorIcon />,
  principal: <SchoolIcon />,
  administrator: <AssessmentIcon />,
};

// Mapeamento de textos por perfil de usuário
const profileText: Record<UserProfile, string> = {
  teacher: 'Professor',
  specialist: 'Especialista',
  coordinator: 'Coordenador',
  principal: 'Diretor',
  administrator: 'Administrador',
};

/**
 * Componente que exibe sugestões específicas por perfil de usuário.
 */
export const ProfileSuggestionList: React.FC<ProfileSuggestionsProps> = ({
  insights,
  profile,
  maxItems = 10,
  className,
  style,
}) => {
  // Filtra apenas insights com alta relevância para o perfil atual
  const relevantInsights = insights
    .filter(insight => insight.profileRelevance[profile] >= 0.7)
    .slice(0, maxItems);

  return (
    <Box className={className} style={style}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Avatar sx={{ bgcolor: 'primary.main', mr: 1 }}>{profileIcons[profile]}</Avatar>
        <Typography variant="h6">Sugestões para {profileText[profile]}</Typography>
      </Box>

      {relevantInsights.length === 0 ? (
        <Paper sx={{ p: 2, textAlign: 'center' }}>
          <Typography color="text.secondary">
            Nenhuma sugestão específica disponível para este perfil no momento.
          </Typography>
        </Paper>
      ) : (
        <List component={Paper} sx={{ width: '100%' }} dense>
          {relevantInsights.map((insight, index) => (
            <motion.div
              key={insight.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <ListItem alignItems="flex-start">
                <Box sx={{ width: '100%' }}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      mb: 1,
                    }}
                  >
                    <Typography variant="subtitle1" fontWeight="bold">
                      {insight.title}
                    </Typography>
                    <Chip
                      size="small"
                      label={`Relevância: ${Math.round(insight.profileRelevance[profile] * 100)}%`}
                      color="primary"
                      variant="outlined"
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {insight.description}
                  </Typography>

                  <Typography variant="subtitle2" sx={{ mt: 1 }}>
                    Ações recomendadas:
                  </Typography>
                  <List dense disablePadding>
                    {insight.suggestedActions.map((action, actionIndex) => (
                      <ListItem key={actionIndex} sx={{ py: 0.5, pl: 2 }}>
                        <ListItemText
                          primary={action}
                          primaryTypographyProps={{
                            variant: 'body2',
                            color: 'text.primary',
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>

                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
                    {insight.impactArea.map(area => (
                      <Chip key={area} label={area} size="small" variant="outlined" />
                    ))}
                  </Box>
                </Box>
              </ListItem>
              {index < relevantInsights.length - 1 && <Divider component="li" />}
            </motion.div>
          ))}
        </List>
      )}
    </Box>
  );
};
