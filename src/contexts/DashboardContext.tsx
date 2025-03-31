import React, { createContext, useContext, useReducer } from 'react';
import { DashboardContextType, DashboardState, DashboardAction } from '@/types/dashboard';
import { DashboardLayout, WidgetConfig } from '@/types/dashboard';

// Estado inicial
const initialState: DashboardState = {
  layout: {
    id: '',
    name: '',
    widgets: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  isEditing: false,
  selectedWidget: null,
  hoveredWidget: null,
  isDragging: false,
  isResizing: false,
};

// Reducer
const dashboardReducer = (state: DashboardState, action: DashboardAction): DashboardState => {
  switch (action.type) {
    case 'SET_LAYOUT':
      return {
        ...state,
        layout: action.payload,
      };

    case 'TOGGLE_EDIT_MODE':
      return {
        ...state,
        isEditing: !state.isEditing,
      };

    case 'SELECT_WIDGET':
      return {
        ...state,
        selectedWidget: action.payload,
      };

    case 'HOVER_WIDGET':
      return {
        ...state,
        hoveredWidget: action.payload,
      };

    case 'SET_DRAGGING':
      return {
        ...state,
        isDragging: action.payload,
      };

    case 'SET_RESIZING':
      return {
        ...state,
        isResizing: action.payload,
      };

    case 'UPDATE_WIDGET':
      return {
        ...state,
        layout: {
          ...state.layout,
          widgets: state.layout.widgets.map(widget =>
            widget.id === action.payload.id ? action.payload : widget
          ),
          updatedAt: new Date(),
        },
      };

    case 'ADD_WIDGET':
      return {
        ...state,
        layout: {
          ...state.layout,
          widgets: [...state.layout.widgets, action.payload],
          updatedAt: new Date(),
        },
      };

    case 'REMOVE_WIDGET':
      return {
        ...state,
        layout: {
          ...state.layout,
          widgets: state.layout.widgets.filter(widget => widget.id !== action.payload),
          updatedAt: new Date(),
        },
        selectedWidget: state.selectedWidget === action.payload ? null : state.selectedWidget,
      };

    case 'RESET_LAYOUT':
      return {
        ...state,
        layout: initialState.layout,
      };

    default:
      return state;
  }
};

// Contexto
const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

// Provider
export const DashboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(dashboardReducer, initialState);

  return (
    <DashboardContext.Provider value={{ state, dispatch }}>{children}</DashboardContext.Provider>
  );
};

// Hook personalizado
export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard deve ser usado dentro de um DashboardProvider');
  }
  return context;
};

// Hooks específicos
export const useLayout = () => {
  const { state, dispatch } = useDashboard();
  return {
    layout: state.layout,
    setLayout: (layout: DashboardLayout) => dispatch({ type: 'SET_LAYOUT', payload: layout }),
    resetLayout: () => dispatch({ type: 'RESET_LAYOUT' }),
  };
};

export const useEditMode = () => {
  const { state, dispatch } = useDashboard();
  return {
    isEditing: state.isEditing,
    toggleEditMode: () => dispatch({ type: 'TOGGLE_EDIT_MODE' }),
  };
};

export const useWidgetSelection = () => {
  const { state, dispatch } = useDashboard();
  return {
    selectedWidget: state.selectedWidget,
    hoveredWidget: state.hoveredWidget,
    selectWidget: (widgetId: string) => dispatch({ type: 'SELECT_WIDGET', payload: widgetId }),
    hoverWidget: (widgetId: string | null) => dispatch({ type: 'HOVER_WIDGET', payload: widgetId }),
  };
};

export const useWidgetDrag = () => {
  const { state, dispatch } = useDashboard();
  return {
    isDragging: state.isDragging,
    isResizing: state.isResizing,
    setDragging: (isDragging: boolean) => dispatch({ type: 'SET_DRAGGING', payload: isDragging }),
    setResizing: (isResizing: boolean) => dispatch({ type: 'SET_RESIZING', payload: isResizing }),
  };
};

export const useWidgetManagement = () => {
  const { state, dispatch } = useDashboard();
  return {
    updateWidget: (widget: WidgetConfig) => dispatch({ type: 'UPDATE_WIDGET', payload: widget }),
    addWidget: (widget: WidgetConfig) => dispatch({ type: 'ADD_WIDGET', payload: widget }),
    removeWidget: (widgetId: string) => dispatch({ type: 'REMOVE_WIDGET', payload: widgetId }),
  };
};
