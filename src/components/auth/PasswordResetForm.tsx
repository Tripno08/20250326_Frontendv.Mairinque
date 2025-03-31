'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';
import { Mail, AlertCircle, ArrowLeft, CheckCircle } from 'lucide-react';
import { PasswordResetRequest } from '@/types/auth';

// Schema de validação do formulário
const passwordResetSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email é obrigatório' })
    .email({ message: 'Formato de email inválido' }),
});

type PasswordResetFormValues = z.infer<typeof passwordResetSchema>;

interface PasswordResetFormProps {
  onSubmit: (data: PasswordResetRequest) => Promise<void>;
  loading: boolean;
  error?: string;
  success?: boolean;
}

export default function PasswordResetForm({
  onSubmit,
  loading,
  error,
  success,
}: PasswordResetFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<PasswordResetFormValues>({
    resolver: zodResolver(passwordResetSchema),
    defaultValues: {
      email: '',
    },
  });

  const emailValue = watch('email');

  const handleFormSubmit = async (data: PasswordResetFormValues) => {
    await onSubmit(data);
  };

  // Exibe mensagem de sucesso se a solicitação for bem-sucedida
  if (success) {
    return (
      <div className="w-full max-w-md mx-auto rounded-xl shadow-lg bg-white dark:bg-gray-800 p-6">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900 mb-4">
            <CheckCircle
              className="h-6 w-6 text-green-600 dark:text-green-300"
              aria-hidden="true"
            />
          </div>
          <h2
            className="text-2xl font-medium text-gray-900 dark:text-white mb-2"
            id="reset-success-heading"
          >
            Email enviado
          </h2>
          <p
            className="text-gray-600 dark:text-gray-300 mb-6"
            aria-describedby="reset-success-heading"
          >
            Enviamos um link de recuperação para <strong>{emailValue}</strong>. Por favor, verifique
            sua caixa de entrada e siga as instruções para redefinir sua senha.
          </p>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Não recebeu o email? Verifique sua pasta de spam ou solicite novamente.
            </p>
            <div className="flex justify-center space-x-4">
              <Link
                href="/login"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors dark:bg-primary-900 dark:text-primary-300 dark:hover:bg-primary-800 dark:focus:ring-offset-gray-800"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar para o login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto rounded-xl shadow-lg bg-white dark:bg-gray-800 p-6">
      <h1
        className="text-2xl font-bold mb-2 text-center text-gray-900 dark:text-white"
        id="password-reset-title"
      >
        Recuperação de Senha
      </h1>
      <p className="text-center text-gray-600 dark:text-gray-300 mb-6">
        Informe seu email e enviaremos um link para você redefinir sua senha.
      </p>

      {error && (
        <div
          className="mb-4 p-4 rounded-md bg-red-50 dark:bg-red-900/30 border border-red-300 dark:border-red-800 text-red-700 dark:text-red-300"
          role="alert"
          aria-live="assertive"
        >
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
            <span>{error}</span>
          </div>
        </div>
      )}

      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        className="space-y-4"
        aria-labelledby="password-reset-title"
        noValidate
      >
        <div className="space-y-1">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
            <input
              id="email"
              type="email"
              autoComplete="email"
              {...register('email')}
              className={`block w-full pl-10 pr-3 py-2 border ${
                errors.email
                  ? 'border-red-300 dark:border-red-700'
                  : 'border-gray-300 dark:border-gray-600'
              } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white`}
              placeholder="seu@email.com"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? 'email-error' : undefined}
              disabled={loading}
            />
          </div>
          {errors.email && (
            <p id="email-error" className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between pt-2">
          <Link
            href="/login"
            className="text-sm font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-md px-2 py-1"
          >
            <span className="flex items-center">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Voltar para o login
            </span>
          </Link>

          <button
            type="submit"
            className="flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors disabled:opacity-70 disabled:cursor-not-allowed dark:focus:ring-offset-gray-800"
            disabled={loading}
            aria-busy={loading}
          >
            {loading ? 'Enviando...' : 'Enviar link'}
          </button>
        </div>
      </form>
    </div>
  );
}
