import React from 'react';
import { render, screen } from '@testing-library/react';
import GridItem from './GridItem';
import { Grid } from '@mui/material';

// Mock do componente Grid do Material UI
jest.mock('@mui/material', () => ({
  ...jest.requireActual('@mui/material'),
  Grid: jest.fn(({ children, ...props }) => (
    <div data-testid="mock-grid" {...props}>
      {children}
    </div>
  )),
}));

// Tipagem para a função mockada
const MockedGrid = Grid as jest.MockedFunction<typeof Grid>;

describe('GridItem', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza corretamente com o conteúdo filho', () => {
    render(
      <GridItem>
        <span>Conteúdo de teste</span>
      </GridItem>
    );

    expect(screen.getByText('Conteúdo de teste')).toBeInTheDocument();
  });

  it('passa a propriedade item=true para o Grid', () => {
    render(<GridItem>Teste</GridItem>);

    // Verificamos apenas que o Grid foi chamado
    expect(MockedGrid).toHaveBeenCalled();

    // E verificamos as propriedades no primeiro argumento
    const props = MockedGrid.mock.calls[0][0];
    expect(props).toHaveProperty('item', true);
    expect(props).toHaveProperty('component', 'div');
    expect(props).toHaveProperty('children', 'Teste');
  });

  it('passa propriedades xs, sm, md, lg, xl para o Grid', () => {
    render(
      <GridItem xs={12} sm={6} md={4} lg={3} xl={2}>
        Teste
      </GridItem>
    );

    // Verificamos as propriedades no primeiro argumento
    const props = MockedGrid.mock.calls[0][0];
    expect(props).toHaveProperty('xs', 12);
    expect(props).toHaveProperty('sm', 6);
    expect(props).toHaveProperty('md', 4);
    expect(props).toHaveProperty('lg', 3);
    expect(props).toHaveProperty('xl', 2);
    expect(props).toHaveProperty('item', true);
    expect(props).toHaveProperty('component', 'div');
  });

  it('aplica className e style quando fornecidos', () => {
    const testStyle = { color: 'red', margin: '10px' };
    render(
      <GridItem className="test-class" style={testStyle}>
        Teste
      </GridItem>
    );

    // Verificamos as propriedades no primeiro argumento
    const props = MockedGrid.mock.calls[0][0];
    expect(props).toHaveProperty('className', 'test-class');
    expect(props).toHaveProperty('style', testStyle);
    expect(props).toHaveProperty('item', true);
    expect(props).toHaveProperty('component', 'div');
  });

  it('aceita boolean para xs, sm, md, lg, xl', () => {
    render(
      <GridItem xs={true} md={true}>
        Teste
      </GridItem>
    );

    // Verificamos as propriedades no primeiro argumento
    const props = MockedGrid.mock.calls[0][0];
    expect(props).toHaveProperty('xs', true);
    expect(props).toHaveProperty('md', true);
    expect(props).toHaveProperty('item', true);
    expect(props).toHaveProperty('component', 'div');
  });

  it('passa outras props para o Grid', () => {
    render(
      <GridItem data-testid="grid-item-test" sx={{ p: 2 }}>
        Teste
      </GridItem>
    );

    // Verificamos as propriedades no primeiro argumento
    const props = MockedGrid.mock.calls[0][0];
    expect(props).toHaveProperty('data-testid', 'grid-item-test');
    expect(props).toHaveProperty('sx', { p: 2 });
    expect(props).toHaveProperty('item', true);
    expect(props).toHaveProperty('component', 'div');
  });
});
