import React from 'react';
import { render, screen } from '@testing-library/react';
import GridContainer from './GridContainer';
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

describe('GridContainer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza corretamente com o conteúdo filho', () => {
    render(
      <GridContainer>
        <span>Conteúdo de teste</span>
      </GridContainer>
    );

    expect(screen.getByText('Conteúdo de teste')).toBeInTheDocument();
  });

  it('passa a propriedade container=true para o Grid', () => {
    render(<GridContainer>Teste</GridContainer>);

    // Verificamos apenas que o Grid foi chamado
    expect(MockedGrid).toHaveBeenCalled();

    // E verificamos as propriedades no primeiro argumento
    const props = MockedGrid.mock.calls[0][0];
    expect(props).toHaveProperty('container', true);
    expect(props).toHaveProperty('component', 'div');
    expect(props).toHaveProperty('children', 'Teste');
  });

  it('passa a propriedade spacing para o Grid', () => {
    render(<GridContainer spacing={3}>Teste</GridContainer>);

    // Verificamos as propriedades no primeiro argumento
    const props = MockedGrid.mock.calls[0][0];
    expect(props).toHaveProperty('spacing', 3);
    expect(props).toHaveProperty('container', true);
    expect(props).toHaveProperty('component', 'div');
  });

  it('passa propriedades de layout para o Grid', () => {
    render(
      <GridContainer
        direction="column"
        justifyContent="center"
        alignItems="flex-start"
        wrap="wrap-reverse"
      >
        Teste
      </GridContainer>
    );

    // Verificamos as propriedades no primeiro argumento
    const props = MockedGrid.mock.calls[0][0];
    expect(props).toHaveProperty('direction', 'column');
    expect(props).toHaveProperty('justifyContent', 'center');
    expect(props).toHaveProperty('alignItems', 'flex-start');
    expect(props).toHaveProperty('wrap', 'wrap-reverse');
    expect(props).toHaveProperty('container', true);
    expect(props).toHaveProperty('component', 'div');
  });

  it('aplica className e style quando fornecidos', () => {
    const testStyle = { color: 'blue', padding: '20px' };
    render(
      <GridContainer className="test-container" style={testStyle}>
        Teste
      </GridContainer>
    );

    // Verificamos as propriedades no primeiro argumento
    const props = MockedGrid.mock.calls[0][0];
    expect(props).toHaveProperty('className', 'test-container');
    expect(props).toHaveProperty('style', testStyle);
    expect(props).toHaveProperty('container', true);
    expect(props).toHaveProperty('component', 'div');
  });

  it('aplica propriedade sx quando fornecida', () => {
    const sxProp = { p: 2, m: 1, backgroundColor: 'primary.light' };
    render(<GridContainer sx={sxProp}>Teste</GridContainer>);

    // Verificamos as propriedades no primeiro argumento
    const props = MockedGrid.mock.calls[0][0];
    expect(props).toHaveProperty('sx', sxProp);
    expect(props).toHaveProperty('container', true);
    expect(props).toHaveProperty('component', 'div');
  });

  it('passa outras props para o Grid', () => {
    render(<GridContainer data-testid="grid-container-test">Teste</GridContainer>);

    // Verificamos as propriedades no primeiro argumento
    const props = MockedGrid.mock.calls[0][0];
    expect(props).toHaveProperty('data-testid', 'grid-container-test');
    expect(props).toHaveProperty('container', true);
    expect(props).toHaveProperty('component', 'div');
  });
});
