'use client';

import React, { useState } from 'react';
import PasswordResetForm from '@/components/auth/PasswordResetForm';
import { PasswordResetRequest } from '@/types/auth';
import Image from 'next/image';
import Link from 'next/link';
import SkipLink from '@/components/accessibility/SkipLink';

export default function PasswordResetPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState(false);

  // Função para lidar com a solicitação de redefinição de senha
  const handlePasswordReset = async (data: PasswordResetRequest) => {
    setLoading(true);
    setError(undefined);

    try {
      // Aqui iria a chamada real de API
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Simulando sucesso
      setSuccess(true);
    } catch (err) {
      console.error('Erro ao solicitar redefinição de senha:', err);
      setError('Não foi possível solicitar a redefinição de senha. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Skip Link para acessibilidade */}
      <SkipLink targetId="main-content" label="Pular para o conteúdo principal" />

      <header className="w-full bg-white dark:bg-gray-800 shadow-sm py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <Link
            href="/"
            className="flex items-center focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-md"
            aria-label="Voltar para a página inicial"
          >
            <div className="relative h-10 w-10 mr-2">
              <Image
                src="/logo.svg"
                alt="Innerview Logo"
                fill
                className="object-contain"
                onError={e => {
                  // Fallback para texto se a imagem falhar
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
            <span className="text-xl font-semibold text-gray-900 dark:text-white">Innerview</span>
          </Link>
        </div>
      </header>

      <main
        id="main-content"
        className="flex-grow flex items-center justify-center p-4 md:p-6"
        tabIndex={-1} // Permite foco para skip link
      >
        <div className="w-full max-w-lg">
          <PasswordResetForm
            onSubmit={handlePasswordReset}
            loading={loading}
            error={error}
            success={success}
          />
        </div>
      </main>

      <footer className="bg-white dark:bg-gray-800 py-6 px-4 shadow-inner">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} Innerview. Todos os direitos reservados.
            </p>
            <div className="flex mt-4 md:mt-0 space-x-4">
              <Link
                href="/termos"
                className="text-gray-600 dark:text-gray-400 text-sm hover:text-gray-900 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-md px-2 py-1"
              >
                Termos de Uso
              </Link>
              <Link
                href="/privacidade"
                className="text-gray-600 dark:text-gray-400 text-sm hover:text-gray-900 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-md px-2 py-1"
              >
                Política de Privacidade
              </Link>
              <Link
                href="/acessibilidade"
                className="text-gray-600 dark:text-gray-400 text-sm hover:text-gray-900 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-md px-2 py-1"
              >
                Acessibilidade
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
