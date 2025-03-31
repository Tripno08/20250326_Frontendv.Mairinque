/**
 * Configuração de testes específica para componentes wrapper
 * Este arquivo pode ser usado em vez do setupTests.ts padrão
 * para testes de componentes de UI que não dependem do MSW ou outros serviços
 */

import '@testing-library/jest-dom';
import React from 'react';

// Mock para window.matchMedia
window.matchMedia =
  window.matchMedia ||
  function () {
    return {
      matches: false,
      addListener: jest.fn(),
      removeListener: jest.fn(),
    };
  };

// Mock do ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock do IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock para o módulo @mui/material
jest.mock('@mui/material', () => ({
  ...jest.requireActual('@mui/material'),
  // Mock básico do useTheme
  useTheme: () => ({
    palette: {
      primary: {
        main: '#1976d2',
        contrastText: '#fff',
      },
      error: {
        main: '#d32f2f',
      },
      success: {
        main: '#2e7d32',
      },
      text: {
        secondary: 'rgba(0, 0, 0, 0.6)',
      },
      background: {
        default: '#f5f5f5',
        paper: '#fff',
      },
    },
    spacing: (factor: number) => `${8 * factor}px`,
  }),
  // Mock específico dos componentes usados nos testes wrapper
  Grid: jest.fn(({ children, ...props }) =>
    React.createElement('div', { 'data-testid': 'mock-grid', ...props }, children)
  ),
  ListItem: jest.fn(({ children, ...props }) =>
    React.createElement('div', { 'data-testid': 'mock-list-item', ...props }, children)
  ),
  MenuItem: jest.fn(({ children, ...props }) =>
    React.createElement('li', { 'data-testid': 'mock-menu-item', ...props }, children)
  ),
}));

// Mock para o módulo @mui/styles se necessário
try {
  jest.mock('@mui/styles', () => ({
    makeStyles: () => () => ({}),
  }));
} catch (error) {
  console.warn('Módulo @mui/styles não encontrado, ignorando mock');
}

// Não há configuração de MSW aqui, pois esses testes não dependem de serviços
