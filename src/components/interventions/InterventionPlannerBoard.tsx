import React, { useState, useCallback, useEffect } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import {
  Grid,
  Typography,
  Box,
  Paper,
  Button,
  TextField,
  Divider,
  useTheme,
  Snackbar,
  Alert,
} from '@mui/material';
import { Save as SaveIcon, Add as AddIcon } from '@mui/icons-material';
import { v4 as uuidv4 } from 'uuid';
import { AnimatePresence } from 'framer-motion';

import { DraggableIntervention } from './DraggableIntervention';
import { DroppableIntervention } from './DroppableIntervention';
import { InterventionDropzone } from './InterventionDropzone';
import type {
  InterventionPlannerBoardProps,
  InterventionPlanItem,
  InterventionPlan
} from '@/types/intervention-planner';
import type { Intervention } from '@/types/intervention';

interface DragData {
  intervention: Intervention;
  [key: string]: unknown;
}

export const InterventionPlannerBoard: React.FC<InterventionPlannerBoardProps> = ({
  plan,
  interventionsLibrary,
  onPlanUpdate,
  onSave,
  readOnly = false,
  className = '',
}) => {
  const theme = useTheme();
  const [activeItem, setActiveItem] = useState<Intervention | null>(null);
  const [items, setItems] = useState<InterventionPlanItem[]>(plan.items || []);
  const [isOverDropzone, setIsOverDropzone] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Configuração dos sensores para detecção de arrastar-e-soltar
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Atualizar os itens quando o plano for alterado externamente
  useEffect(() => {
    setItems(plan.items || []);
  }, [plan]);

  // Filtragem de intervenções na biblioteca
  const filteredInterventions = interventionsLibrary.filter(intervention => {
    if (!searchTerm) return true;

    const searchLower = searchTerm.toLowerCase();
    return (
      intervention.title.toLowerCase().includes(searchLower) ||
      intervention.description.toLowerCase().includes(searchLower) ||
      intervention.tags.some(tag => tag.toLowerCase().includes(searchLower))
    );
  });

  // Gerenciar início do arrasto
  const handleDragStart = useCallback((event: DragStartEvent) => {
    const { active } = event;

    if (active.data.current) {
      // O item pode vir tanto da biblioteca quanto da lista existente
      const data = active.data.current as DragData;
      setActiveItem(data.intervention);
    }
  }, []);

  // Gerenciar fim do arrasto
  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;

    setIsOverDropzone(false);
    setActiveItem(null);

    if (!over) return;

    // Arrastar de intervenção da biblioteca para o plano
    if (over.id === 'interventions-dropzone' && active.data.current) {
      const data = active.data.current as DragData;
      const intervention = data.intervention;

      // Criar novo item do plano
      const newItem: InterventionPlanItem = {
        id: uuidv4(),
        intervention,
        position: items.length,
      };

      const updatedItems = [...items, newItem];
      setItems(updatedItems);

      // Atualizar o plano completo
      const updatedPlan: InterventionPlan = {
        ...plan,
        items: updatedItems,
        updatedAt: new Date(),
      };

      onPlanUpdate(updatedPlan);
      setNotification({
        message: `Intervenção "${intervention.title}" adicionada ao plano`,
        type: 'success'
      });
      return;
    }

    // Reordenação de itens já no plano
    if (active.id !== over.id) {
      const oldIndex = items.findIndex(item => item.id === active.id);
      const newIndex = items.findIndex(item => item.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const updatedItems = arrayMove(items, oldIndex, newIndex).map(
          (item, index) => ({ ...item, position: index })
        );

        setItems(updatedItems);

        // Atualizar o plano completo
        const updatedPlan: InterventionPlan = {
          ...plan,
          items: updatedItems,
          updatedAt: new Date(),
        };

        onPlanUpdate(updatedPlan);
      }
    }
  }, [items, onPlanUpdate, plan]);

  // Gerenciar estado quando o arrasto está sobre a dropzone
  const handleDragOver = useCallback((event: DragOverEvent) => {
    const { over } = event;
    setIsOverDropzone(over?.id === 'interventions-dropzone');
  }, []);

  // Remover item do plano
  const handleRemoveItem = useCallback((itemId: string) => {
    const itemToRemove = items.find(item => item.id === itemId);
    if (!itemToRemove) return;

    const updatedItems = items
      .filter(item => item.id !== itemId)
      .map((item, index) => ({ ...item, position: index }));

    setItems(updatedItems);

    // Atualizar o plano completo
    const updatedPlan: InterventionPlan = {
      ...plan,
      items: updatedItems,
      updatedAt: new Date(),
    };

    onPlanUpdate(updatedPlan);
    setNotification({
      message: `Intervenção "${itemToRemove.intervention.title}" removida do plano`,
      type: 'info'
    });
  }, [items, onPlanUpdate, plan]);

  // Salvar plano
  const handleSave = useCallback(() => {
    if (onSave) {
      onSave();
      setNotification({
        message: 'Plano de intervenção salvo com sucesso',
        type: 'success'
      });
    }
  }, [onSave]);

  // Renderização do overlay condicional
  const renderDragOverlay = () => {
    if (!activeItem) return null;
    return (
      <DraggableIntervention
        intervention={activeItem}
        isOverlay
      />
    );
  };

  return (
    <Box className={className}>
      <Typography variant="h5" component="h2" gutterBottom>
        Planejador de Intervenções
      </Typography>

      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        {plan.title}
      </Typography>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
      >
        <Grid container spacing={3}>
          {/* Área de planejamento */}
          <Grid item xs={12} md={7}>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 2,
                height: '100%',
                minHeight: 600,
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6">
                  Plano de Intervenção
                </Typography>

                {!readOnly && (
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<SaveIcon />}
                    onClick={handleSave}
                    disabled={items.length === 0}
                  >
                    Salvar Plano
                  </Button>
                )}
              </Box>

              <Divider sx={{ mb: 3 }} />

              <SortableContext items={items.map(item => item.id)} strategy={verticalListSortingStrategy}>
                <InterventionDropzone
                  id="interventions-dropzone"
                  items={items}
                  isOver={isOverDropzone}
                >
                  <AnimatePresence>
                    {items.map((item, index) => (
                      <DroppableIntervention
                        key={item.id}
                        item={item}
                        index={index}
                      />
                    ))}
                  </AnimatePresence>
                </InterventionDropzone>
              </SortableContext>
            </Paper>
          </Grid>

          {/* Biblioteca de intervenções */}
          <Grid item xs={12} md={5}>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 2,
                height: '100%',
                minHeight: 600,
              }}
            >
              <Typography variant="h6" gutterBottom>
                Biblioteca de Intervenções
              </Typography>

              <TextField
                fullWidth
                variant="outlined"
                size="small"
                label="Pesquisar intervenções"
                margin="normal"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />

              <Box sx={{
                mt: 2,
                maxHeight: 'calc(100vh - 300px)',
                overflowY: 'auto',
                pr: 1,
              }}>
                {filteredInterventions.length === 0 ? (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 4, textAlign: 'center' }}>
                    Nenhuma intervenção encontrada
                  </Typography>
                ) : (
                  filteredInterventions.map((intervention) => (
                    <DraggableIntervention
                      key={intervention.id}
                      intervention={intervention}
                    />
                  ))
                )}
              </Box>
            </Paper>
          </Grid>
        </Grid>

        <DragOverlay>
          {renderDragOverlay()}
        </DragOverlay>
      </DndContext>

      <Snackbar
        open={!!notification}
        autoHideDuration={4000}
        onClose={() => setNotification(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        {notification && (
          <Alert onClose={() => setNotification(null)} severity={notification.type} sx={{ width: '100%' }}>
            {notification.message}
          </Alert>
        )}
      </Snackbar>
    </Box>
  );
};
