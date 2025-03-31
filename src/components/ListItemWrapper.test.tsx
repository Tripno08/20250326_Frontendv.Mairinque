import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ListItemWrapper from './ListItemWrapper';
import { ListItem } from '@mui/material';

// Mock do componente ListItem do Material UI
jest.mock('@mui/material', () => ({
  ...jest.requireActual('@mui/material'),
  ListItem: jest.fn(({ children, ...props }) => (
    <div data-testid="mock-list-item" {...props}>
      {children}
    </div>
  )),
}));

// Tipagem para a função mockada
const MockedListItem = ListItem as jest.MockedFunction<typeof ListItem>;

describe('ListItemWrapper', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza corretamente com o conteúdo filho', () => {
    render(
      <ListItemWrapper>
        <span>Conteúdo de teste</span>
      </ListItemWrapper>
    );

    expect(screen.getByText('Conteúdo de teste')).toBeInTheDocument();
  });

  it('passa a propriedade component="div" para o ListItem', () => {
    render(<ListItemWrapper>Teste</ListItemWrapper>);

    // Verificamos apenas que o ListItem foi chamado
    expect(MockedListItem).toHaveBeenCalled();

    // E verificamos as propriedades no primeiro argumento
    const props = MockedListItem.mock.calls[0][0];
    expect(props).toHaveProperty('component', 'div');
    expect(props).toHaveProperty('children', 'Teste');
  });

  it('passa a propriedade button quando fornecida', () => {
    render(<ListItemWrapper button>Teste</ListItemWrapper>);

    // Verificamos as propriedades no primeiro argumento
    const props = MockedListItem.mock.calls[0][0];
    expect(props).toHaveProperty('button', true);
    expect(props).toHaveProperty('component', 'div');
  });

  it('chama a função onClick quando o item é clicado', () => {
    const handleClick = jest.fn();
    render(<ListItemWrapper onClick={handleClick}>Teste</ListItemWrapper>);

    fireEvent.click(screen.getByTestId('mock-list-item'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('passa propriedades de formato para o ListItem', () => {
    render(
      <ListItemWrapper alignItems="flex-start" dense divider selected disablePadding>
        Teste
      </ListItemWrapper>
    );

    // Verificamos as propriedades no primeiro argumento
    const props = MockedListItem.mock.calls[0][0];
    expect(props).toHaveProperty('alignItems', 'flex-start');
    expect(props).toHaveProperty('dense', true);
    expect(props).toHaveProperty('divider', true);
    expect(props).toHaveProperty('selected', true);
    expect(props).toHaveProperty('disablePadding', true);
    expect(props).toHaveProperty('component', 'div');
  });

  it('aplica className quando fornecida', () => {
    render(<ListItemWrapper className="test-list-item">Teste</ListItemWrapper>);

    // Verificamos as propriedades no primeiro argumento
    const props = MockedListItem.mock.calls[0][0];
    expect(props).toHaveProperty('className', 'test-list-item');
    expect(props).toHaveProperty('component', 'div');
  });

  it('aplica sx quando fornecido', () => {
    const sxProp = { p: 2, color: 'primary.main' };
    render(<ListItemWrapper sx={sxProp}>Teste</ListItemWrapper>);

    // Verificamos as propriedades no primeiro argumento
    const props = MockedListItem.mock.calls[0][0];
    expect(props).toHaveProperty('sx', sxProp);
    expect(props).toHaveProperty('component', 'div');
  });

  it('passa props adicionais para o ListItem', () => {
    render(
      <ListItemWrapper data-testid="custom-list-item" role="listitem">
        Teste
      </ListItemWrapper>
    );

    // Verificamos as propriedades no primeiro argumento
    const props = MockedListItem.mock.calls[0][0];
    expect(props).toHaveProperty('data-testid', 'custom-list-item');
    expect(props).toHaveProperty('role', 'listitem');
    expect(props).toHaveProperty('component', 'div');
  });
});
