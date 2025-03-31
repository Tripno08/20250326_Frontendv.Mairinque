'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import LoginForm from '@/components/auth/LoginForm';
import { LoginCredentials } from '@/types/auth';
import Image from 'next/image';
import Link from 'next/link';
import SkipLink from '@/components/accessibility/SkipLink';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  // Função para lidar com o login por email/senha
  const handleLogin = async (credentials: LoginCredentials) => {
    setLoading(true);
    setError(undefined);

    try {
      // Aqui iria a chamada real de API
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Simulando autenticação bem-sucedida
      localStorage.setItem('isAuthenticated', 'true');
      router.push('/dashboard');
    } catch (err) {
      console.error('Erro ao fazer login:', err);
      setError('Credenciais inválidas. Por favor, verifique seu email e senha.');
    } finally {
      setLoading(false);
    }
  };

  // Função para lidar com o login pelo Google
  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(undefined);

    try {
      // Implementação real usaria OAuth
      await new Promise(resolve => setTimeout(resolve, 1000));

      localStorage.setItem('isAuthenticated', 'true');
      router.push('/dashboard');
    } catch (err) {
      console.error('Erro ao fazer login com Google:', err);
      setError('Não foi possível fazer login com o Google. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // Função para lidar com o login pela Microsoft
  const handleMicrosoftLogin = async () => {
    setLoading(true);
    setError(undefined);

    try {
      // Implementação real usaria OAuth
      await new Promise(resolve => setTimeout(resolve, 1000));

      localStorage.setItem('isAuthenticated', 'true');
      router.push('/dashboard');
    } catch (err) {
      console.error('Erro ao fazer login com Microsoft:', err);
      setError('Não foi possível fazer login com a Microsoft. Tente novamente.');
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

          <nav>
            <ul className="flex space-x-6">
              <li>
                <Link
                  href="/sobre"
                  className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-md px-2 py-1"
                >
                  Sobre
                </Link>
              </li>
              <li>
                <Link
                  href="/contato"
                  className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-md px-2 py-1"
                >
                  Contato
                </Link>
              </li>
              <li>
                <Link
                  href="/suporte"
                  className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-md px-2 py-1"
                >
                  Suporte
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main
        id="main-content"
        className="flex-grow flex items-center justify-center p-4 md:p-6"
        tabIndex={-1} // Permite foco para skip link
      >
        <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8 items-center">
          <div className="hidden md:flex flex-col space-y-6 p-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Bem-vindo ao Innerview
            </h1>
            <p className="text-xl text-gray-700 dark:text-gray-300">
              Sistema de Gestão de Intervenções Educacionais para facilitar o framework RTI/MTSS
            </p>
            <ul className="space-y-3">
              {[
                'Análise de desempenho e intervenções',
                'Acompanhamento de progresso por tiers',
                'Colaboração entre equipes multidisciplinares',
                'Monitoramento de resultados em tempo real',
              ].map((item, i) => (
                <li key={i} className="flex items-center text-gray-700 dark:text-gray-300">
                  <span aria-hidden="true" className="mr-2 text-green-500">
                    ✓
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <LoginForm
              onSubmit={handleLogin}
              onGoogleLogin={handleGoogleLogin}
              onMicrosoftLogin={handleMicrosoftLogin}
              loading={loading}
              error={error}
            />
          </div>
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
