import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { Paper, Typography, Chip, Box, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import type { DraggableInterventionProps } from '@/types/intervention-planner';

export const DraggableIntervention: React.FC<DraggableInterventionProps> = ({
  intervention,
  isDragging = false,
  isOverlay = false,
}) => {
  const theme = useTheme();
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: intervention.id,
    data: {
      intervention,
    },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
    cursor: 'grab',
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Tier 1':
        return { bg: theme.palette.success.light, text: theme.palette.success.contrastText };
      case 'Tier 2':
        return { bg: theme.palette.warning.light, text: theme.palette.warning.contrastText };
      case 'Tier 3':
        return { bg: theme.palette.error.light, text: theme.palette.error.contrastText };
      default:
        return { bg: theme.palette.grey[300], text: theme.palette.text.primary };
    }
  };

  const getEvidenceColor = (level: string) => {
    switch (level) {
      case 'Alta Evidência':
        return { bg: theme.palette.success.light, text: theme.palette.success.contrastText };
      case 'Média Evidência':
        return { bg: theme.palette.info.light, text: theme.palette.info.contrastText };
      case 'Baixa Evidência':
        return { bg: theme.palette.grey[400], text: theme.palette.text.primary };
      case 'Em Estudo':
        return { bg: theme.palette.grey[300], text: theme.palette.text.primary };
      default:
        return { bg: theme.palette.grey[300], text: theme.palette.text.primary };
    }
  };

  const tierColor = getTierColor(intervention.tier);
  const evidenceColor = getEvidenceColor(intervention.evidenceLevel);

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: 1,
        y: 0,
        scale: isOverlay ? 1.05 : 1,
        boxShadow: isOverlay ? theme.shadows[8] : theme.shadows[1],
      }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ scale: isOverlay ? 1.05 : 1.02 }}
      whileTap={{ scale: isOverlay ? 1.05 : 0.98 }}
      {...attributes}
      {...listeners}
    >
      <Paper
        sx={{
          p: 2,
          borderRadius: 2,
          border: isDragging ? `2px dashed ${theme.palette.primary.main}` : '1px solid',
          borderColor: 'divider',
          mb: 2,
          maxWidth: isOverlay ? 300 : '100%',
          transition: 'all 0.2s ease',
          position: 'relative',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            {intervention.title}
          </Typography>
          <Chip
            label={intervention.tier}
            size="small"
            sx={{
              bgcolor: tierColor.bg,
              color: tierColor.text,
              fontWeight: 'bold',
            }}
          />
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {intervention.description.length > 100
            ? `${intervention.description.substring(0, 100)}...`
            : intervention.description}
        </Typography>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
          <Chip
            label={intervention.evidenceLevel}
            size="small"
            sx={{
              bgcolor: evidenceColor.bg,
              color: evidenceColor.text,
              fontSize: '0.7rem',
            }}
          />
          <Chip
            label={intervention.duration}
            size="small"
            variant="outlined"
            sx={{ fontSize: '0.7rem' }}
          />
        </Box>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          {intervention.tags.slice(0, 3).map((tag) => (
            <Chip
              key={tag}
              label={tag}
              size="small"
              variant="outlined"
              sx={{ fontSize: '0.7rem' }}
            />
          ))}
          {intervention.tags.length > 3 && (
            <Chip
              label={`+${intervention.tags.length - 3}`}
              size="small"
              variant="outlined"
              sx={{ fontSize: '0.7rem' }}
            />
          )}
        </Box>
      </Paper>
    </motion.div>
  );
};
