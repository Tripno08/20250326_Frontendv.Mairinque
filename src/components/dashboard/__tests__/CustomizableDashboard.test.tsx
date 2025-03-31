import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CustomizableDashboard } from '../CustomizableDashboard';
import type { DashboardWidget, WidgetConfig, DashboardLayout, WidgetType } from '@/types/dashboard';
import { DashboardProvider } from '@/contexts/DashboardContext';
import { STORAGE_CONFIG } from '@/config/dashboard';

// Mock dos componentes de widget
const MockWidget: React.FC = () => <div data-testid="mock-widget">Widget de Teste</div>;

const mockWidgets: DashboardWidget[] = [
  {
    id: 'widget-1',
    type: 'tier-distribution',
    title: 'Widget de Teste',
    component: <MockWidget />,
    defaultConfig: {
      x: 0,
      y: 0,
      w: 6,
      h: 4,
    },
  },
];

const mockDefaultLayout: DashboardLayout = {
  id: 'default',
  name: 'Layout Padrão',
  widgets: [
    {
      id: 'widget-1',
      type: 'tier-distribution',
      title: 'Widget de Teste',
      x: 0,
      y: 0,
      w: 6,
      h: 4,
    },
  ],
  createdAt: new Date('2025-03-29T21:02:11.765Z'),
  updatedAt: new Date('2025-03-29T21:02:11.765Z'),
};

// Mock do localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

const renderWithProvider = (ui: React.ReactElement) => {
  return render(
    <DashboardProvider>
      <div style={{ width: 800, height: 600 }}>{ui}</div>
    </DashboardProvider>
  );
};

const mapWidgetToConfig = (widget: DashboardWidget): WidgetConfig => ({
  id: widget.id,
  type: widget.type,
  title: widget.title,
  component: widget.component,
  x: widget.defaultConfig.x || 0,
  y: widget.defaultConfig.y || 0,
  w: widget.defaultConfig.w || 6,
  h: widget.defaultConfig.h || 4,
});

describe('CustomizableDashboard', () => {
  beforeEach(() => {
    mockLocalStorage.clear();
    mockLocalStorage.getItem.mockReset();
    mockLocalStorage.setItem.mockReset();
  });

  it('renderiza o dashboard com widgets', () => {
    renderWithProvider(
      <CustomizableDashboard
        widgets={mockWidgets.map(mapWidgetToConfig)}
        defaultLayout={mockDefaultLayout}
      />
    );

    expect(screen.getByText('Dashboard Personalizado')).toBeInTheDocument();
    expect(screen.getByTestId('mock-widget')).toBeInTheDocument();
  });

  it('alterna entre modo de edição e visualização', () => {
    renderWithProvider(
      <CustomizableDashboard
        widgets={mockWidgets.map(mapWidgetToConfig)}
        defaultLayout={mockDefaultLayout}
      />
    );

    const editButton = screen.getByLabelText('Editar Layout');
    fireEvent.click(editButton);

    expect(screen.getByLabelText('Salvar Layout')).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText('Salvar Layout'));
    expect(screen.getByLabelText('Editar Layout')).toBeInTheDocument();
  });

  it('salva layout no localStorage', async () => {
    renderWithProvider(
      <CustomizableDashboard
        widgets={mockWidgets.map(mapWidgetToConfig)}
        defaultLayout={mockDefaultLayout}
      />
    );

    const editButton = screen.getByLabelText('Editar Layout');
    fireEvent.click(editButton);

    // Simula mudança no layout
    const layoutChangeEvent = new CustomEvent('layoutchange', {
      detail: {
        ...mockDefaultLayout,
        widgets: [
          {
            ...mockDefaultLayout.widgets[0],
            x: 2,
            y: 2,
          },
        ],
      },
    });
    window.dispatchEvent(layoutChangeEvent);

    // Salva o layout
    fireEvent.click(screen.getByLabelText('Salvar Layout'));

    await waitFor(() => {
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        STORAGE_CONFIG.key,
        expect.stringContaining('"version":"1.0.0"')
      );
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        STORAGE_CONFIG.key,
        expect.stringContaining('"id":"default"')
      );
    });
  });

  it('reseta para o layout padrão', () => {
    renderWithProvider(
      <CustomizableDashboard
        widgets={mockWidgets.map(mapWidgetToConfig)}
        defaultLayout={mockDefaultLayout}
      />
    );

    const resetButton = screen.getByLabelText('Resetar Layout');
    fireEvent.click(resetButton);

    expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
      STORAGE_CONFIG.key,
      expect.stringContaining('"version":"1.0.0"')
    );
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
      STORAGE_CONFIG.key,
      expect.stringContaining('"id":"default"')
    );
  });

  it('renderiza com layout personalizado do localStorage', () => {
    const customLayout = {
      ...mockDefaultLayout,
      widgets: [
        {
          ...mockDefaultLayout.widgets[0],
          x: 2,
          y: 2,
        },
      ],
    };

    mockLocalStorage.getItem.mockReturnValue(
      JSON.stringify({
        ...customLayout,
        version: STORAGE_CONFIG.version,
        updatedAt: new Date().toISOString(),
      })
    );

    renderWithProvider(
      <CustomizableDashboard
        widgets={mockWidgets.map(mapWidgetToConfig)}
        defaultLayout={mockDefaultLayout}
      />
    );

    expect(mockLocalStorage.getItem).toHaveBeenCalledWith(STORAGE_CONFIG.key);
    expect(screen.getByTestId('mock-widget')).toBeInTheDocument();
  });

  it('lida com widgets inválidos', () => {
    const invalidLayout = {
      ...mockDefaultLayout,
      widgets: [
        {
          id: 'widget-1',
          type: 'invalid-type',
          title: 'Widget de Teste',
          x: 0,
          y: 0,
          w: 6,
          h: 4,
        },
      ],
    };

    renderWithProvider(
      <CustomizableDashboard
        widgets={mockWidgets.map(mapWidgetToConfig)}
        defaultLayout={invalidLayout}
      />
    );

    expect(screen.queryByTestId('mock-widget')).not.toBeInTheDocument();
  });
});
