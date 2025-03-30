import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { Box, Typography, useTheme, Paper } from '@mui/material';
import { AddCircleOutline as AddIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';
import type { InterventionDropzoneProps } from '@/types/intervention-planner';

export const InterventionDropzone: React.FC<InterventionDropzoneProps> = ({
  children,
  id,
  items = [],
  isOver = false,
}) => {
  const theme = useTheme();
  const { setNodeRef } = useDroppable({
    id,
  });

  return (
    <Box
      ref={setNodeRef}
      sx={{
        width: '100%',
        minHeight: 150,
        padding: 2,
        borderRadius: 2,
        border: `2px dashed ${isOver ? theme.palette.primary.main : theme.palette.grey[300]}`,
        backgroundColor: isOver ? theme.palette.primary.light + '20' : theme.palette.background.default,
        transition: 'all 0.2s ease',
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
      }}
    >
      {items.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            minHeight: 120,
          }}
        >
          <AddIcon
            sx={{
              fontSize: 40,
              color: isOver ? theme.palette.primary.main : theme.palette.grey[400],
              mb: 1,
            }}
          />
          <Typography
            variant="body2"
            color={isOver ? 'primary' : 'text.secondary'}
            align="center"
          >
            {isOver ? 'Solte para adicionar' : 'Arraste intervenções para cá'}
          </Typography>
        </motion.div>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {children}
        </Box>
      )}
    </Box>
  );
};
