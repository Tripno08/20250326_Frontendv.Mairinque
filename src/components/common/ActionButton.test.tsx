import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ActionButton } from './ActionButton';

describe('ActionButton', () => {
  it('renderiza corretamente com texto', () => {
    render(<ActionButton>Clique Aqui</ActionButton>);
    expect(screen.getByText('Clique Aqui')).toBeInTheDocument();
  });

  it('aplica variantes de cor corretamente', () => {
    const { rerender } = render(<ActionButton variant="primary">Primary</ActionButton>);
    expect(screen.getByText('Primary')).toHaveClass('MuiButton-contained');

    rerender(<ActionButton variant="secondary">Secondary</ActionButton>);
    expect(screen.getByText('Secondary')).toHaveClass('MuiButton-outlined');
  });

  it('aplica diferentes tamanhos', () => {
    const { rerender } = render(<ActionButton size="small">Small</ActionButton>);
    expect(screen.getByText('Small')).toHaveStyle({ fontSize: '0.875rem' });

    rerender(<ActionButton size="large">Large</ActionButton>);
    expect(screen.getByText('Large')).toHaveStyle({ fontSize: '1.125rem' });
  });

  it('mostra estado de loading', () => {
    render(<ActionButton loading>Loading</ActionButton>);
    const button = screen.getByText('Loading');
    expect(button).toHaveStyle({
      position: 'relative',
      overflow: 'hidden',
    });
  });

  it('desabilita o botão quando loading', () => {
    render(<ActionButton loading>Loading</ActionButton>);
    expect(screen.getByText('Loading')).toBeDisabled();
  });

  it('desabilita o botão quando disabled', () => {
    render(<ActionButton disabled>Disabled</ActionButton>);
    expect(screen.getByText('Disabled')).toBeDisabled();
  });

  it('chama onClick quando clicado', () => {
    const handleClick = jest.fn();
    render(<ActionButton onClick={handleClick}>Click Me</ActionButton>);

    fireEvent.click(screen.getByText('Click Me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('não chama onClick quando desabilitado', () => {
    const handleClick = jest.fn();
    render(
      <ActionButton onClick={handleClick} disabled>
        Disabled
      </ActionButton>
    );

    fireEvent.click(screen.getByText('Disabled'));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('aplica fullWidth quando especificado', () => {
    render(<ActionButton fullWidth>Full Width</ActionButton>);
    expect(screen.getByText('Full Width')).toHaveStyle({ width: '100%' });
  });

  it('passa props adicionais para o componente Button', () => {
    render(
      <ActionButton data-testid="test-button" className="custom-class">
        With Props
      </ActionButton>
    );

    const button = screen.getByTestId('test-button');
    expect(button).toHaveClass('custom-class');
  });
});
