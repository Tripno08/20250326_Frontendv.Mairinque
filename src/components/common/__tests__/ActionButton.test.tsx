import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from '@/styles/theme';
import { ActionButton } from '../ActionButton';
import type { ButtonVariant } from '@/types/utils';

describe('ActionButton', () => {
  const renderWithTheme = (component: React.ReactNode) => {
    return render(
      <ThemeProvider theme={theme}>
        {component}
      </ThemeProvider>
    );
  };

  it('renderiza corretamente com texto básico', () => {
    renderWithTheme(
      <ActionButton>
        Clique Aqui
      </ActionButton>
    );

    expect(screen.getByText('Clique Aqui')).toBeInTheDocument();
  });

  it('aplica variante primária por padrão', () => {
    renderWithTheme(
      <ActionButton>
        Botão Primário
      </ActionButton>
    );

    const button = screen.getByRole('button', { name: 'Botão Primário' });
    expect(button).toHaveClass('MuiButton-contained');
  });

  it('aplica variante secundária quando especificada', () => {
    renderWithTheme(
      <ActionButton variant="secondary">
        Botão Secundário
      </ActionButton>
    );

    const button = screen.getByRole('button', { name: 'Botão Secundário' });
    expect(button).toHaveClass('MuiButton-outlined');
  });

  it('aplica tamanho pequeno quando especificado', () => {
    renderWithTheme(
      <ActionButton size="small">
        Botão Pequeno
      </ActionButton>
    );

    const button = screen.getByRole('button', { name: 'Botão Pequeno' });
    expect(button).toHaveClass('MuiButton-sizeSmall');
  });

  it('aplica tamanho grande quando especificado', () => {
    renderWithTheme(
      <ActionButton size="large">
        Botão Grande
      </ActionButton>
    );

    const button = screen.getByRole('button', { name: 'Botão Grande' });
    expect(button).toHaveClass('MuiButton-sizeLarge');
  });

  it('mostra estado de loading quando especificado', () => {
    renderWithTheme(
      <ActionButton loading>
        Carregando
      </ActionButton>
    );

    const button = screen.getByRole('button', { name: 'Carregando' });
    expect(button).toBeDisabled();
    expect(button).toHaveStyle({
      position: 'relative',
      overflow: 'hidden'
    });
  });

  it('desabilita o botão quando loading é true', () => {
    renderWithTheme(
      <ActionButton loading>
        Carregando
      </ActionButton>
    );

    const button = screen.getByRole('button', { name: 'Carregando' });
    expect(button).toBeDisabled();
  });

  it('desabilita o botão quando disabled é true', () => {
    renderWithTheme(
      <ActionButton disabled>
        Desabilitado
      </ActionButton>
    );

    const button = screen.getByRole('button', { name: 'Desabilitado' });
    expect(button).toBeDisabled();
  });

  it('chama onClick quando clicado', () => {
    const handleClick = jest.fn();
    renderWithTheme(
      <ActionButton onClick={handleClick}>
        Clique-me
      </ActionButton>
    );

    fireEvent.click(screen.getByText('Clique-me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('não chama onClick quando desabilitado', () => {
    const handleClick = jest.fn();
    renderWithTheme(
      <ActionButton disabled onClick={handleClick}>
        Desabilitado
      </ActionButton>
    );

    fireEvent.click(screen.getByText('Desabilitado'));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('aplica className personalizada', () => {
    const customClass = 'custom-button-class';
    renderWithTheme(
      <ActionButton className={customClass}>
        Botão com Classe
      </ActionButton>
    );

    const button = screen.getByRole('button', { name: 'Botão com Classe' });
    expect(button).toHaveClass(customClass);
  });

  it('aplica estilos inline quando style é fornecido', () => {
    const customStyle = {
      margin: '10px'
    };

    renderWithTheme(
      <ActionButton style={customStyle}>
        Botão com Estilos
      </ActionButton>
    );

    const button = screen.getByRole('button', { name: 'Botão com Estilos' });
    expect(button).toHaveStyle(customStyle);
  });

  it('mantém acessibilidade', () => {
    renderWithTheme(
      <ActionButton>
        Botão Acessível
      </ActionButton>
    );

    const button = screen.getByRole('button', { name: 'Botão Acessível' });
    expect(button).toBeInTheDocument();
  });

  it('renderiza com children nulos', () => {
    renderWithTheme(
      <ActionButton>
        {null}
      </ActionButton>
    );

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });

  it('should apply custom color when specified', () => {
    renderWithTheme(<ActionButton color="secondary">Secundário</ActionButton>);
    const button = screen.getByRole('button', { name: 'Secundário' });
    expect(button).toHaveClass('MuiButton-containedSecondary');
  });

  it('should apply custom variant when specified', () => {
    const variant: ButtonVariant = 'secondary';
    renderWithTheme(<ActionButton variant={variant}>Secondary</ActionButton>);
    const button = screen.getByRole('button', { name: 'Secondary' });
    expect(button).toHaveClass('MuiButton-outlined');
  });

  it('should apply fullWidth when specified', () => {
    renderWithTheme(<ActionButton fullWidth>Full Width</ActionButton>);
    const button = screen.getByRole('button', { name: 'Full Width' });
    expect(button).toHaveClass('MuiButton-fullWidth');
  });
});
