import { useState, useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { DashboardLayout, WidgetConfig } from '@/types/dashboard';
import { STORAGE_CONFIG } from '@/config/dashboard';
import { saveLayout, loadLayout, clearLayout, validateLayout } from '@/utils/dashboard';
import { useDashboard } from '@/contexts/DashboardContext';

export const useCustomizableDashboard = (
  defaultLayout?: DashboardLayout,
  onLayoutChange?: (layout: DashboardLayout) => void,
  onLayoutSave?: (layout: DashboardLayout) => void
) => {
  const { state, dispatch } = useDashboard();
  const [isInitialized, setIsInitialized] = useState(false);

  // Inicialização
  useEffect(() => {
    if (!isInitialized) {
      const savedLayout = loadLayout();
      if (savedLayout && validateLayout(savedLayout)) {
        dispatch({ type: 'SET_LAYOUT', payload: savedLayout });
      } else if (defaultLayout) {
        dispatch({ type: 'SET_LAYOUT', payload: defaultLayout });
      }
      setIsInitialized(true);
    }
  }, [isInitialized, defaultLayout, dispatch]);

  // Persistência
  useEffect(() => {
    if (isInitialized && state.layout.id) {
      saveLayout(state.layout);
      onLayoutChange?.(state.layout);
    }
  }, [state.layout, isInitialized, onLayoutChange]);

  // Handlers
  const handleLayoutChange = useCallback(
    (newLayout: DashboardLayout) => {
      dispatch({ type: 'SET_LAYOUT', payload: newLayout });
    },
    [dispatch]
  );

  const handleLayoutSave = useCallback(() => {
    onLayoutSave?.(state.layout);
    dispatch({ type: 'TOGGLE_EDIT_MODE' });
  }, [state.layout, onLayoutSave, dispatch]);

  const toggleEditMode = useCallback(() => {
    dispatch({ type: 'TOGGLE_EDIT_MODE' });
  }, [dispatch]);

  const resetLayout = useCallback(() => {
    if (defaultLayout) {
      dispatch({ type: 'SET_LAYOUT', payload: defaultLayout });
    }
  }, [defaultLayout, dispatch]);

  const clearSavedLayout = useCallback(() => {
    clearLayout();
    if (defaultLayout) {
      dispatch({ type: 'SET_LAYOUT', payload: defaultLayout });
    }
  }, [defaultLayout, dispatch]);

  // Widget Management
  const addWidget = useCallback(
    (widget: Omit<WidgetConfig, 'id'>) => {
      const newWidget: WidgetConfig = {
        ...widget,
        id: uuidv4(),
      };
      dispatch({ type: 'ADD_WIDGET', payload: newWidget });
    },
    [dispatch]
  );

  const updateWidget = useCallback(
    (widget: WidgetConfig) => {
      dispatch({ type: 'UPDATE_WIDGET', payload: widget });
    },
    [dispatch]
  );

  const removeWidget = useCallback(
    (widgetId: string) => {
      dispatch({ type: 'REMOVE_WIDGET', payload: widgetId });
    },
    [dispatch]
  );

  // Selection Management
  const selectWidget = useCallback(
    (widgetId: string) => {
      dispatch({ type: 'SELECT_WIDGET', payload: widgetId });
    },
    [dispatch]
  );

  const hoverWidget = useCallback(
    (widgetId: string | null) => {
      dispatch({ type: 'HOVER_WIDGET', payload: widgetId });
    },
    [dispatch]
  );

  // Drag and Resize Management
  const setDragging = useCallback(
    (isDragging: boolean) => {
      dispatch({ type: 'SET_DRAGGING', payload: isDragging });
    },
    [dispatch]
  );

  const setResizing = useCallback(
    (isResizing: boolean) => {
      dispatch({ type: 'SET_RESIZING', payload: isResizing });
    },
    [dispatch]
  );

  return {
    layout: state.layout,
    isEditing: state.isEditing,
    selectedWidget: state.selectedWidget,
    hoveredWidget: state.hoveredWidget,
    isDragging: state.isDragging,
    isResizing: state.isResizing,
    handleLayoutChange,
    handleLayoutSave,
    toggleEditMode,
    resetLayout,
    clearSavedLayout,
    addWidget,
    updateWidget,
    removeWidget,
    selectWidget,
    hoverWidget,
    setDragging,
    setResizing,
  };
};

// Hook para gerenciar o layout responsivo
export const useResponsiveLayout = (breakpoints: Record<string, number>) => {
  const [currentBreakpoint, setCurrentBreakpoint] = useState<string>('lg');

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      let breakpoint = 'lg';

      Object.entries(breakpoints).forEach(([key, value]) => {
        if (width < value) {
          breakpoint = key;
        }
      });

      setCurrentBreakpoint(breakpoint);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [breakpoints]);

  return currentBreakpoint;
};

// Hook para gerenciar a persistência do layout
export const useLayoutPersistence = (layout: DashboardLayout) => {
  useEffect(() => {
    const saveTimeout = setTimeout(() => {
      saveLayout(layout);
    }, 1000);

    return () => {
      clearTimeout(saveTimeout);
    };
  }, [layout]);
};

// Hook para gerenciar a validação do layout
export const useLayoutValidation = (layout: DashboardLayout) => {
  const [validationResult, setValidationResult] = useState<{
    isValid: boolean;
    errors: string[];
  }>({ isValid: true, errors: [] });

  useEffect(() => {
    const isValid = validateLayout(layout);
    const errors: string[] = [];

    if (!isValid) {
      errors.push('Layout inválido');
    }

    setValidationResult({ isValid, errors });
  }, [layout]);

  return validationResult;
};

// Hook para gerenciar a animação do layout
export const useLayoutAnimation = (isEditing: boolean) => {
  const [animationState, setAnimationState] = useState<'entering' | 'entered' | 'exiting'>(
    isEditing ? 'entering' : 'exiting'
  );

  useEffect(() => {
    if (isEditing) {
      setAnimationState('entering');
      const timeout = setTimeout(() => {
        setAnimationState('entered');
      }, 300);
      return () => clearTimeout(timeout);
    } else {
      setAnimationState('exiting');
    }
  }, [isEditing]);

  return animationState;
}; 