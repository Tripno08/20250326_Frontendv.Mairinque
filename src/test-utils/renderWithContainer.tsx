import React, { useEffect, useState, useRef } from 'react';
import { render } from '@testing-library/react';

interface TestWrapperProps {
  children: React.ReactElement;
  width?: number;
  height?: number;
  minWidth?: number;
  minHeight?: number;
}

const TestWrapper: React.FC<TestWrapperProps> = ({
  children,
  width = 800,
  height = 600,
  minWidth = 300,
  minHeight = 300,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [dimensions, setDimensions] = useState({ width, height });

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { clientWidth, clientHeight } = containerRef.current;
        setDimensions({
          width: Math.max(clientWidth, minWidth),
          height: Math.max(clientHeight, minHeight),
        });
      }
    };

    // Força um re-render após a montagem
    setMounted(true);
    updateDimensions();

    // Dispara evento de resize após o re-render
    const timer = setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
      updateDimensions();
    }, 100); // Aumentado para garantir que o DOM esteja pronto

    // Adiciona listener de resize
    window.addEventListener('resize', updateDimensions);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updateDimensions);
    };
  }, [minWidth, minHeight]);

  return (
    <div
      ref={containerRef}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        position: 'relative',
        display: 'block',
        minWidth: `${minWidth}px`,
        minHeight: `${minHeight}px`,
        margin: '0',
        padding: '0',
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}
      data-testid="chart-container"
    >
      {mounted && React.cloneElement(children, {
        width: dimensions.width,
        height: dimensions.height,
      })}
    </div>
  );
};

interface RenderOptions {
  width?: number;
  height?: number;
  minWidth?: number;
  minHeight?: number;
}

export const renderWithContainer = (
  ui: React.ReactElement,
  options: RenderOptions = {}
) => {
  return render(
    <TestWrapper {...options}>
      {ui}
    </TestWrapper>
  );
};
