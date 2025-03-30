import React from 'react';
import { Paper, Typography, Box, CircularProgress } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { useDashboard } from '@/contexts/DashboardContext';
import { WidgetConfig } from '@/types/dashboard';
import { CSS_CLASSES } from '@/constants/dashboard';

interface WidgetBaseProps {
  widget: WidgetConfig;
  title: string;
  isLoading?: boolean;
  error?: Error | null;
  children: React.ReactNode;
  className?: string;
}

export const WidgetBase: React.FC<WidgetBaseProps> = ({
  widget,
  title,
  isLoading = false,
  error = null,
  children,
  className,
}) => {
  const { state, dispatch } = useDashboard();
  const isSelected = state.selectedWidget === widget.id;
  const isHovered = state.hoveredWidget === widget.id;

  const handleMouseEnter = () => {
    dispatch({ type: 'HOVER_WIDGET', payload: widget.id });
  };

  const handleMouseLeave = () => {
    dispatch({ type: 'HOVER_WIDGET', payload: null });
  };

  const handleClick = () => {
    if (state.isEditing) {
      dispatch({ type: 'SELECT_WIDGET', payload: widget.id });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2 }}
    >
      <Paper
        className={`${CSS_CLASSES.WIDGET} ${className || ''}`}
        sx={{
          height: '100%',
          position: 'relative',
          overflow: 'hidden',
          border: isSelected ? '2px solid primary.main' : 'none',
          boxShadow: isHovered ? 3 : 1,
          transition: 'all 0.2s ease-in-out',
          cursor: state.isEditing ? 'pointer' : 'default',
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
      >
        <Box className={CSS_CLASSES.WIDGET_HEADER}>
          <Typography variant="h6" component="h3" noWrap>
            {title}
          </Typography>
          <AnimatePresence>
            {state.isEditing && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  zIndex: 1,
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    backgroundColor: 'primary.main',
                    color: 'white',
                    px: 1,
                    py: 0.5,
                    borderRadius: 1,
                  }}
                >
                  {widget.w}x{widget.h}
                </Typography>
              </motion.div>
            )}
          </AnimatePresence>
        </Box>

        <Box className={CSS_CLASSES.WIDGET_CONTENT}>
          {isLoading ? (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
              }}
            >
              <CircularProgress size={40} />
            </Box>
          ) : error ? (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
                color: 'error.main',
              }}
            >
              <Typography variant="body2" color="error">
                {error.message}
              </Typography>
            </Box>
          ) : (
            children
          )}
        </Box>
      </Paper>
    </motion.div>
  );
}; 