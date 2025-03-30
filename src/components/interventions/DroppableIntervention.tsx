import React, { forwardRef } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Paper, Typography, Chip, Box, IconButton, useTheme } from '@mui/material';
import { Delete as DeleteIcon, DragIndicator as DragIndicatorIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';
import type { DroppableInterventionProps } from '@/types/intervention-planner';

export const DroppableIntervention = forwardRef<HTMLDivElement, DroppableInterventionProps>(
  ({ item, index }, ref) => {
    const theme = useTheme();
    const intervention = item.intervention;

    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({
      id: item.id,
      data: {
        intervention: item.intervention,
        index,
      },
    });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      opacity: isDragging ? 0.5 : 1,
      zIndex: isDragging ? 999 : 'auto',
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

    const tierColor = getTierColor(intervention.tier);

    return (
      <motion.div
        ref={setNodeRef}
        style={style}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        whileHover={{ scale: isDragging ? 1.05 : 1.01 }}
      >
        <Paper
          sx={{
            p: 2,
            borderRadius: 2,
            border: isDragging ? `2px dashed ${theme.palette.primary.main}` : '1px solid',
            borderColor: 'divider',
            mb: 2,
            cursor: 'grab',
            transition: 'all 0.2s ease',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Box
            sx={{
              mr: 1,
              color: theme.palette.text.secondary,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'grab',
            }}
            {...attributes}
            {...listeners}
          >
            <DragIndicatorIcon />
          </Box>

          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
              <Typography variant="subtitle1" fontWeight="bold">
                {intervention.title}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Chip
                  label={intervention.tier}
                  size="small"
                  sx={{
                    bgcolor: tierColor.bg,
                    color: tierColor.text,
                    fontWeight: 'bold',
                  }}
                />
                <Chip
                  label={intervention.duration}
                  size="small"
                  variant="outlined"
                  sx={{ fontSize: '0.7rem' }}
                />
              </Box>
            </Box>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {intervention.description.length > 80
                ? `${intervention.description.substring(0, 80)}...`
                : intervention.description}
            </Typography>

            {item.notes && (
              <Typography
                variant="body2"
                sx={{
                  fontStyle: 'italic',
                  bgcolor: theme.palette.grey[100],
                  p: 1,
                  borderRadius: 1,
                  mb: 1
                }}
              >
                Notas: {item.notes}
              </Typography>
            )}
          </Box>

          <IconButton
            size="small"
            color="error"
            sx={{ ml: 1 }}
            onClick={(e) => {
              e.stopPropagation();
              // O evento de remoção será gerenciado pelo componente principal
            }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Paper>
      </motion.div>
    );
  }
);

DroppableIntervention.displayName = 'DroppableIntervention';
