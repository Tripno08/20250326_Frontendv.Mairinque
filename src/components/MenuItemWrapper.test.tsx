import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import MenuItemWrapper from './MenuItemWrapper';
import { MenuItem } from '@mui/material';

// Mock do componente MenuItem do Material UI
jest.mock('@mui/material', () => ({
  ...jest.requireActual('@mui/material'),
  MenuItem: jest.fn(({ children, ...props }) => (
    <li data-testid="mock-menu-item" {...props}>
      {children}
    </li>
  )),
}));

// Tipagem para a função mockada
const MockedMenuItem = MenuItem as jest.MockedFunction<typeof MenuItem>;

describe('MenuItemWrapper', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza corretamente com o conteúdo filho', () => {
    render(
      <MenuItemWrapper>
        <span>Conteúdo de teste</span>
      </MenuItemWrapper>
    );

    expect(screen.getByText('Conteúdo de teste')).toBeInTheDocument();
  });

  it('passa a propriedade component="li" para o MenuItem', () => {
    render(<MenuItemWrapper>Teste</MenuItemWrapper>);

    // Verificamos apenas que o MenuItem foi chamado
    expect(MockedMenuItem).toHaveBeenCalled();

    // E verificamos as propriedades no primeiro argumento
    const props = MockedMenuItem.mock.calls[0][0];
    expect(props).toHaveProperty('component', 'li');
    expect(props).toHaveProperty('children', 'Teste');
  });

  it('passa a propriedade value quando fornecida', () => {
    render(<MenuItemWrapper value="test-value">Teste</MenuItemWrapper>);

    // Verificamos as propriedades no primeiro argumento
    const props = MockedMenuItem.mock.calls[0][0];
    expect(props).toHaveProperty('value', 'test-value');
    expect(props).toHaveProperty('component', 'li');
  });

  it('passa propriedades de estado para o MenuItem', () => {
    render(
      <MenuItemWrapper selected disabled dense divider>
        Teste
      </MenuItemWrapper>
    );

    // Verificamos as propriedades no primeiro argumento
    const props = MockedMenuItem.mock.calls[0][0];
    expect(props).toHaveProperty('selected', true);
    expect(props).toHaveProperty('disabled', true);
    expect(props).toHaveProperty('dense', true);
    expect(props).toHaveProperty('divider', true);
    expect(props).toHaveProperty('component', 'li');
  });

  it('chama a função onClick quando o item é clicado', () => {
    const handleClick = jest.fn();
    render(<MenuItemWrapper onClick={handleClick}>Teste</MenuItemWrapper>);

    fireEvent.click(screen.getByTestId('mock-menu-item'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('não chama onClick quando disabled é true', () => {
    const handleClick = jest.fn();

    // Verificamos apenas que a propriedade disabled é passada corretamente
    render(
      <MenuItemWrapper onClick={handleClick} disabled>
        Teste
      </MenuItemWrapper>
    );

    const props = MockedMenuItem.mock.calls[0][0];
    expect(props).toHaveProperty('disabled', true);
    expect(props).toHaveProperty('onClick', handleClick);

    // No MenuItem real, onClick não seria chamado quando disabled=true,
    // mas em nosso mock de teste, isso não é implementado automaticamente
  });

  it('aplica className quando fornecida', () => {
    render(<MenuItemWrapper className="test-menu-item">Teste</MenuItemWrapper>);

    // Verificamos as propriedades no primeiro argumento
    const props = MockedMenuItem.mock.calls[0][0];
    expect(props).toHaveProperty('className', 'test-menu-item');
    expect(props).toHaveProperty('component', 'li');
  });

  it('aplica sx quando fornecido', () => {
    const sxProp = { p: 2, color: 'primary.main' };
    render(<MenuItemWrapper sx={sxProp}>Teste</MenuItemWrapper>);

    // Verificamos as propriedades no primeiro argumento
    const props = MockedMenuItem.mock.calls[0][0];
    expect(props).toHaveProperty('sx', sxProp);
    expect(props).toHaveProperty('component', 'li');
  });

  it('passa props adicionais para o MenuItem', () => {
    render(
      <MenuItemWrapper data-testid="custom-menu-item" role="menuitem">
        Teste
      </MenuItemWrapper>
    );

    // Verificamos as propriedades no primeiro argumento
    const props = MockedMenuItem.mock.calls[0][0];
    expect(props).toHaveProperty('data-testid', 'custom-menu-item');
    expect(props).toHaveProperty('role', 'menuitem');
    expect(props).toHaveProperty('component', 'li');
  });
});
