import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from '@/styles/theme';
import { GradientCard } from '../GradientCard';

describe('GradientCard', () => {
  const renderWithTheme = (component: React.ReactNode) => {
    return render(
      <ThemeProvider theme={theme}>
        {component}
      </ThemeProvider>
    );
  };

  it('renderiza corretamente com conteúdo básico', () => {
    renderWithTheme(
      <GradientCard>
        <div>Conteúdo do Card</div>
      </GradientCard>
    );

    expect(screen.getByText('Conteúdo do Card')).toBeInTheDocument();
  });

  it('aplica gradiente padrão quando não especificado', () => {
    const { container } = renderWithTheme(
      <GradientCard>
        <div>Card com Gradiente Padrão</div>
      </GradientCard>
    );

    const card = container.firstChild as HTMLElement;
    expect(card).toHaveStyle({
      background: expect.stringContaining('linear-gradient')
    });
  });

  it('aplica gradiente personalizado quando especificado', () => {
    const customGradient = {
      startColor: '#1976d2',
      endColor: '#1565c0',
      angle: 135
    };

    const { container } = renderWithTheme(
      <GradientCard gradient={customGradient}>
        <div>Card com Gradiente Customizado</div>
      </GradientCard>
    );

    const card = container.firstChild as HTMLElement;
    expect(card).toHaveStyle({
      background: expect.stringContaining('linear-gradient(135deg')
    });
  });

  it('não aplica efeito hover quando hover é false', () => {
    const { container } = renderWithTheme(
      <GradientCard hover={false}>
        <div>Card sem Hover</div>
      </GradientCard>
    );

    const card = container.firstChild as HTMLElement;
    expect(card).not.toHaveStyle({
      transition: expect.any(String)
    });
  });

  it('aplica efeito hover por padrão', () => {
    const { container } = renderWithTheme(
      <GradientCard>
        <div>Card com Hover</div>
      </GradientCard>
    );

    const card = container.firstChild as HTMLElement;
    expect(card).toHaveStyle('transition: transform 0.2s ease-in-out,box-shadow 0.2s ease-in-out');
  });

  it('aplica className personalizada', () => {
    const customClass = 'custom-card-class';
    const { container } = renderWithTheme(
      <GradientCard className={customClass}>
        <div>Card com Classe Customizada</div>
      </GradientCard>
    );

    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass(customClass);
  });

  it('aplica estilos inline quando style é fornecido', () => {
    const customStyle = {
      padding: '20px',
      margin: '10px'
    };

    const { container } = renderWithTheme(
      <GradientCard style={customStyle}>
        <div>Card com Estilos Inline</div>
      </GradientCard>
    );

    const card = container.firstChild as HTMLElement;
    expect(card).toHaveStyle(customStyle);
  });

  it('mantém acessibilidade com role="article"', () => {
    const { container } = renderWithTheme(
      <GradientCard>
        <div>Card Acessível</div>
      </GradientCard>
    );

    const card = container.firstChild as HTMLElement;
    expect(card).toHaveAttribute('role', 'article');
  });

  it('renderiza com children nulos', () => {
    const { container } = renderWithTheme(
      <GradientCard>
        {null}
      </GradientCard>
    );

    const card = container.firstChild as HTMLElement;
    expect(card).toBeEmptyDOMElement();
  });
});
