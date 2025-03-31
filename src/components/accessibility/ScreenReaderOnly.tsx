'use client';

import React from 'react';
import { ScreenReaderOnlyProps } from '@/types/accessibility';

/**
 * Componente para conteúdo que deve ser visível apenas para leitores de tela.
 * Útil para fornecer contexto adicional para usuários de tecnologias assistivas,
 * sem interferir na apresentação visual para outros usuários.
 */
export default function ScreenReaderOnly({ children, className = '' }: ScreenReaderOnlyProps) {
  return <span className={`sr-only ${className}`}>{children}</span>;
}
