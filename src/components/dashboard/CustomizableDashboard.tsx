import React from 'react';
import { Box, IconButton, Paper, Typography } from '@mui/material';
import { Edit as EditIcon, Save as SaveIcon, Refresh as RefreshIcon } from '@mui/icons-material';
import { Responsive, WidthProvider } from 'react-grid-layout';
import type { Layout } from 'react-grid-layout';
import { motion, AnimatePresence } from 'framer-motion';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import type { CustomizableDashboardProps } from '@/types/dashboard';
import { useCustomizableDashboard } from '@/hooks/useCustomizableDashboard';

const ResponsiveGridLayout = WidthProvider(Responsive);

export const CustomizableDashboard: React.FC<CustomizableDashboardProps> = ({
  widgets,
  defaultLayout,
  onLayoutChange,
  onLayoutSave,
  isEditable: initialIsEditable = false,
  className,
}) => {
  const { layout, isEditing, handleLayoutChange, handleLayoutSave, toggleEditMode, resetLayout } =
    useCustomizableDashboard(defaultLayout, onLayoutChange, onLayoutSave);

  const breakpoints = { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 };
  const cols = { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 };

  const handleLayoutUpdate = (currentLayout: Layout[]) => {
    handleLayoutChange({
      ...layout,
      widgets: currentLayout.map(item => ({
        id: item.i,
        type: layout.widgets.find(w => w.id === item.i)?.type || '',
        title: layout.widgets.find(w => w.id === item.i)?.title || '',
        x: item.x,
        y: item.y,
        w: item.w,
        h: item.h,
      })),
    });
  };

  return (
    <Box className={className} data-testid="dashboard-container">
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
        }}
      >
        <Typography variant="h5" component="h2">
          Dashboard Personalizado
        </Typography>
        <Box>
          <IconButton
            onClick={toggleEditMode}
            color="primary"
            aria-label={isEditing ? 'Salvar Layout' : 'Editar Layout'}
          >
            {isEditing ? <SaveIcon /> : <EditIcon />}
          </IconButton>
          <IconButton onClick={resetLayout} color="secondary" aria-label="Resetar Layout">
            <RefreshIcon />
          </IconButton>
        </Box>
      </Box>

      <ResponsiveGridLayout
        className="layout"
        layouts={{
          lg: layout.widgets.map(widget => ({
            i: widget.id,
            x: widget.x,
            y: widget.y,
            w: widget.w,
            h: widget.h,
          })),
        }}
        breakpoints={breakpoints}
        cols={cols}
        rowHeight={100}
        isDraggable={isEditing}
        isResizable={isEditing}
        onLayoutChange={handleLayoutUpdate}
        margin={[16, 16]}
        containerPadding={[16, 16]}
      >
        {layout.widgets.map(widget => {
          const widgetConfig = widgets.find(w => w.type === widget.type);
          if (!widgetConfig) return null;

          return (
            <Paper
              key={widget.id}
              sx={{
                height: '100%',
                p: 2,
                overflow: 'auto',
                position: 'relative',
              }}
            >
              <AnimatePresence>
                {isEditing && (
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

              <Typography variant="h6" gutterBottom>
                {widget.title}
              </Typography>
              {widgetConfig.component}
            </Paper>
          );
        })}
      </ResponsiveGridLayout>
    </Box>
  );
};
