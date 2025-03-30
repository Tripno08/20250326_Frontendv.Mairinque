import { DashboardLayout, WidgetConfig } from '@/types/dashboard';
import { STORAGE_CONFIG } from '@/config/dashboard';

// Funções de persistência
export const saveLayout = (layout: DashboardLayout): void => {
  try {
    localStorage.setItem(STORAGE_CONFIG.key, JSON.stringify({
      ...layout,
      version: STORAGE_CONFIG.version,
      updatedAt: new Date(),
    }));
  } catch (error) {
    console.error('Erro ao salvar layout:', error);
  }
};

export const loadLayout = (): DashboardLayout | null => {
  try {
    const savedLayout = localStorage.getItem(STORAGE_CONFIG.key);
    if (!savedLayout) return null;

    const layout = JSON.parse(savedLayout);
    if (layout.version !== STORAGE_CONFIG.version) {
      console.warn('Versão do layout incompatível');
      return null;
    }

    return layout;
  } catch (error) {
    console.error('Erro ao carregar layout:', error);
    return null;
  }
};

export const clearLayout = (): void => {
  try {
    localStorage.removeItem(STORAGE_CONFIG.key);
  } catch (error) {
    console.error('Erro ao limpar layout:', error);
  }
};

// Funções de validação
export const validateLayout = (layout: DashboardLayout): boolean => {
  if (!layout.id || !layout.name || !Array.isArray(layout.widgets)) {
    return false;
  }

  return layout.widgets.every(validateWidget);
};

export const validateWidget = (widget: WidgetConfig): boolean => {
  return (
    typeof widget.id === 'string' &&
    typeof widget.type === 'string' &&
    typeof widget.title === 'string' &&
    typeof widget.x === 'number' &&
    typeof widget.y === 'number' &&
    typeof widget.w === 'number' &&
    typeof widget.h === 'number'
  );
};

// Funções de manipulação de layout
export const cloneLayout = (layout: DashboardLayout): DashboardLayout => {
  return {
    ...layout,
    id: `${layout.id}_clone`,
    name: `${layout.name} (Cópia)`,
    widgets: layout.widgets.map(widget => ({ ...widget })),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

export const mergeLayouts = (base: DashboardLayout, overlay: Partial<DashboardLayout>): DashboardLayout => {
  return {
    ...base,
    ...overlay,
    widgets: overlay.widgets || base.widgets,
    updatedAt: new Date(),
  };
};

// Funções de cálculo
export const calculateGridSize = (widgets: WidgetConfig[]): { width: number; height: number } => {
  const maxX = Math.max(...widgets.map(w => w.x + w.w));
  const maxY = Math.max(...widgets.map(w => w.y + w.h));

  return {
    width: maxX,
    height: maxY,
  };
};

export const calculateWidgetOverlap = (widgets: WidgetConfig[]): boolean => {
  for (let i = 0; i < widgets.length; i++) {
    for (let j = i + 1; j < widgets.length; j++) {
      const w1 = widgets[i];
      const w2 = widgets[j];

      if (
        w1.x < w2.x + w2.w &&
        w1.x + w1.w > w2.x &&
        w1.y < w2.y + w2.h &&
        w1.y + w1.h > w2.y
      ) {
        return true;
      }
    }
  }

  return false;
};

// Funções de otimização
export const optimizeLayout = (layout: DashboardLayout): DashboardLayout => {
  const optimizedWidgets = layout.widgets.map(widget => ({
    ...widget,
    x: Math.round(widget.x),
    y: Math.round(widget.y),
    w: Math.round(widget.w),
    h: Math.round(widget.h),
  }));

  return {
    ...layout,
    widgets: optimizedWidgets,
    updatedAt: new Date(),
  };
};

export const compactLayout = (layout: DashboardLayout): DashboardLayout => {
  const sortedWidgets = [...layout.widgets].sort((a, b) => a.y - b.y);
  const compactedWidgets = sortedWidgets.map((widget, index) => ({
    ...widget,
    y: index * widget.h,
  }));

  return {
    ...layout,
    widgets: compactedWidgets,
    updatedAt: new Date(),
  };
};

// Funções de exportação/importação
export const exportLayout = (layout: DashboardLayout): string => {
  return JSON.stringify(layout, null, 2);
};

export const importLayout = (json: string): DashboardLayout | null => {
  try {
    const layout = JSON.parse(json);
    if (validateLayout(layout)) {
      return {
        ...layout,
        updatedAt: new Date(),
      };
    }
    return null;
  } catch (error) {
    console.error('Erro ao importar layout:', error);
    return null;
  }
};

// Funções de debug
export const logLayout = (layout: DashboardLayout): void => {
  console.log('Layout:', {
    id: layout.id,
    name: layout.name,
    widgetCount: layout.widgets.length,
    gridSize: calculateGridSize(layout.widgets),
    hasOverlap: calculateWidgetOverlap(layout.widgets),
    updatedAt: layout.updatedAt,
  });
};

export const logWidget = (widget: WidgetConfig): void => {
  console.log('Widget:', {
    id: widget.id,
    type: widget.type,
    title: widget.title,
    position: { x: widget.x, y: widget.y },
    size: { w: widget.w, h: widget.h },
  });
}; 