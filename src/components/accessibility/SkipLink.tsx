'use client';

import React from 'react';
import { SkipLinkProps } from '@/types/accessibility';

/**
 * Componente SkipLink para acessibilidade
 * Permite que usuários de teclado pulem para o conteúdo principal sem navegar por todos os links
 * Segue as diretrizes WCAG 2.1 AA - Critério 2.4.1 (Mecanismo para pular blocos de conteúdo)
 */
export default function SkipLink({
  targetId,
  label = 'Pular para o conteúdo principal',
  className = '',
}: SkipLinkProps) {
  return (
    <a
      href={`#${targetId}`}
      className={`
        sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50
        focus:p-4 focus:bg-white focus:text-primary-700 focus:shadow-lg focus:outline-none
        focus:ring-2 focus:ring-primary-500 focus:rounded-md dark:focus:bg-gray-800 dark:focus:text-primary-300
        ${className}
      `}
    >
      {label}
    </a>
  );
}
