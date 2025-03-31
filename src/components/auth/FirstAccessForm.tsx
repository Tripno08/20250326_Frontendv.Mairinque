'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';
import { Eye, EyeOff, AlertCircle, ArrowLeft, Check, CheckCircle, Key, Info } from 'lucide-react';
import { FirstAccessRequest } from '@/types/auth';

// Schema de validação do formulário com validações robustas de senha
const firstAccessSchema = z
  .object({
    token: z
      .string()
      .min(1, { message: 'Token é obrigatório' })
      .length(8, { message: 'Token deve ter 8 caracteres' }),
    password: z
      .string()
      .min(8, { message: 'Senha deve ter no mínimo 8 caracteres' })
      .regex(/^(?=.*[a-z])/, { message: 'Senha deve conter pelo menos uma letra minúscula' })
      .regex(/^(?=.*[A-Z])/, { message: 'Senha deve conter pelo menos uma letra maiúscula' })
      .regex(/^(?=.*[0-9])/, { message: 'Senha deve conter pelo menos um número' })
      .regex(/^(?=.*[!@#$%^&*])/, {
        message: 'Senha deve conter pelo menos um caractere especial (!@#$%^&*)',
      }),
    confirmPassword: z.string().min(1, { message: 'Confirmação de senha é obrigatória' }),
    acceptTerms: z.boolean().refine(val => val === true, {
      message: 'Você deve aceitar os termos de uso e política de privacidade',
    }),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  });

type FirstAccessFormValues = z.infer<typeof firstAccessSchema>;

interface FirstAccessFormProps {
  onSubmit: (data: FirstAccessRequest) => Promise<void>;
  loading: boolean;
  error?: string;
  success?: boolean;
  tokenFromQuery?: string;
}

export default function FirstAccessForm({
  onSubmit,
  loading,
  error,
  success,
  tokenFromQuery,
}: FirstAccessFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, dirtyFields },
    watch,
  } = useForm<FirstAccessFormValues>({
    resolver: zodResolver(firstAccessSchema),
    defaultValues: {
      token: tokenFromQuery || '',
      password: '',
      confirmPassword: '',
      acceptTerms: false,
    },
  });

  const currentPassword = watch('password');

  // Função para verificar a força da senha
  const getPasswordStrength = (
    password: string
  ): { strength: number; label: string; color: string } => {
    if (!password) return { strength: 0, label: 'Muito fraca', color: 'bg-red-500' };

    let strength = 0;

    // Critérios de força de senha
    if (password.length >= 8) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^a-zA-Z0-9]/.test(password)) strength += 1;

    // Definição de níveis de força
    switch (strength) {
      case 0:
      case 1:
        return { strength: 1, label: 'Muito fraca', color: 'bg-red-500' };
      case 2:
        return { strength: 2, label: 'Fraca', color: 'bg-orange-500' };
      case 3:
        return { strength: 3, label: 'Média', color: 'bg-yellow-500' };
      case 4:
        return { strength: 4, label: 'Forte', color: 'bg-lime-500' };
      case 5:
        return { strength: 5, label: 'Muito forte', color: 'bg-green-500' };
      default:
        return { strength: 0, label: 'Muito fraca', color: 'bg-red-500' };
    }
  };

  const passwordStrength = getPasswordStrength(currentPassword);

  const handleFormSubmit = async (data: FirstAccessFormValues) => {
    await onSubmit(data);
  };

  // Exibe mensagem de sucesso se o acesso foi configurado com sucesso
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
            id="first-access-success-heading"
          >
            Senha definida com sucesso!
          </h2>
          <p
            className="text-gray-600 dark:text-gray-300 mb-6"
            aria-describedby="first-access-success-heading"
          >
            Sua senha foi configurada e você já pode acessar o sistema.
          </p>
          <div className="flex justify-center">
            <Link
              href="/login"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors dark:focus:ring-offset-gray-800"
            >
              Ir para o login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto rounded-xl shadow-lg bg-white dark:bg-gray-800 p-6">
      <h1
        className="text-2xl font-bold mb-2 text-center text-gray-900 dark:text-white"
        id="first-access-title"
      >
        Primeiro Acesso
      </h1>
      <p className="text-center text-gray-600 dark:text-gray-300 mb-6">
        Configure sua senha para acessar o sistema
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
        aria-labelledby="first-access-title"
        noValidate
      >
        <div className="space-y-1">
          <label
            htmlFor="token"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Código de acesso
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Key className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
            <input
              id="token"
              type="text"
              autoComplete="off"
              {...register('token')}
              className={`block w-full pl-10 pr-3 py-2 border ${
                errors.token
                  ? 'border-red-300 dark:border-red-700'
                  : 'border-gray-300 dark:border-gray-600'
              } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white`}
              placeholder="Digite o código de 8 dígitos"
              aria-invalid={!!errors.token}
              aria-describedby={errors.token ? 'token-error' : undefined}
              disabled={loading || !!tokenFromQuery}
            />
          </div>
          {errors.token && (
            <p id="token-error" className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.token.message}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Nova senha
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              {...register('password')}
              className={`block w-full pr-10 py-2 border ${
                errors.password
                  ? 'border-red-300 dark:border-red-700'
                  : 'border-gray-300 dark:border-gray-600'
              } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white`}
              placeholder="••••••••"
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? 'password-error' : 'password-requirements'}
              disabled={loading}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Esconder senha' : 'Mostrar senha'}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5 text-gray-400" aria-hidden="true" />
              ) : (
                <Eye className="h-5 w-5 text-gray-400" aria-hidden="true" />
              )}
            </button>
          </div>

          {/* Indicador de força de senha */}
          {currentPassword && (
            <div className="mt-2">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Força da senha: {passwordStrength.label}
                </span>
              </div>
              <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={`h-full ${passwordStrength.color}`}
                  style={{ width: `${(passwordStrength.strength / 5) * 100}%` }}
                  role="progressbar"
                  aria-valuenow={passwordStrength.strength}
                  aria-valuemin={0}
                  aria-valuemax={5}
                  aria-label={`Força da senha: ${passwordStrength.label}`}
                />
              </div>
            </div>
          )}

          {errors.password && (
            <p id="password-error" className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.password.message}
            </p>
          )}

          {/* Requisitos de senha */}
          <div
            id="password-requirements"
            className="mt-2 text-xs text-gray-500 dark:text-gray-400 space-y-1"
          >
            <p className="flex items-start">
              <Info className="h-4 w-4 mr-1 mt-0.5 flex-shrink-0" />
              <span>Sua senha deve conter:</span>
            </p>
            <ul className="space-y-1 pl-5">
              <li
                className={`flex items-center ${/^.{8,}$/.test(currentPassword) ? 'text-green-600 dark:text-green-400' : ''}`}
              >
                {/^.{8,}$/.test(currentPassword) ? (
                  <Check className="h-3 w-3 mr-1" />
                ) : (
                  <span className="h-3 w-3 mr-1" />
                )}
                Mínimo de 8 caracteres
              </li>
              <li
                className={`flex items-center ${/[a-z]/.test(currentPassword) ? 'text-green-600 dark:text-green-400' : ''}`}
              >
                {/[a-z]/.test(currentPassword) ? (
                  <Check className="h-3 w-3 mr-1" />
                ) : (
                  <span className="h-3 w-3 mr-1" />
                )}
                Pelo menos uma letra minúscula
              </li>
              <li
                className={`flex items-center ${/[A-Z]/.test(currentPassword) ? 'text-green-600 dark:text-green-400' : ''}`}
              >
                {/[A-Z]/.test(currentPassword) ? (
                  <Check className="h-3 w-3 mr-1" />
                ) : (
                  <span className="h-3 w-3 mr-1" />
                )}
                Pelo menos uma letra maiúscula
              </li>
              <li
                className={`flex items-center ${/[0-9]/.test(currentPassword) ? 'text-green-600 dark:text-green-400' : ''}`}
              >
                {/[0-9]/.test(currentPassword) ? (
                  <Check className="h-3 w-3 mr-1" />
                ) : (
                  <span className="h-3 w-3 mr-1" />
                )}
                Pelo menos um número
              </li>
              <li
                className={`flex items-center ${/[!@#$%^&*]/.test(currentPassword) ? 'text-green-600 dark:text-green-400' : ''}`}
              >
                {/[!@#$%^&*]/.test(currentPassword) ? (
                  <Check className="h-3 w-3 mr-1" />
                ) : (
                  <span className="h-3 w-3 mr-1" />
                )}
                Pelo menos um caractere especial (!@#$%^&*)
              </li>
            </ul>
          </div>
        </div>

        <div className="space-y-1">
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Confirme a senha
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              autoComplete="new-password"
              {...register('confirmPassword')}
              className={`block w-full pr-10 py-2 border ${
                errors.confirmPassword
                  ? 'border-red-300 dark:border-red-700'
                  : 'border-gray-300 dark:border-gray-600'
              } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white`}
              placeholder="••••••••"
              aria-invalid={!!errors.confirmPassword}
              aria-describedby={errors.confirmPassword ? 'confirm-password-error' : undefined}
              disabled={loading}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              aria-label={showConfirmPassword ? 'Esconder senha' : 'Mostrar senha'}
            >
              {showConfirmPassword ? (
                <EyeOff className="h-5 w-5 text-gray-400" aria-hidden="true" />
              ) : (
                <Eye className="h-5 w-5 text-gray-400" aria-hidden="true" />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p id="confirm-password-error" className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="acceptTerms"
                type="checkbox"
                {...register('acceptTerms')}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
                disabled={loading}
              />
            </div>
            <div className="ml-3 text-sm">
              <label
                htmlFor="acceptTerms"
                className={`font-medium ${
                  errors.acceptTerms
                    ? 'text-red-600 dark:text-red-400'
                    : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                Aceito os{' '}
                <Link
                  href="/termos"
                  target="_blank"
                  className="text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 underline"
                >
                  Termos de Uso
                </Link>{' '}
                e{' '}
                <Link
                  href="/privacidade"
                  target="_blank"
                  className="text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 underline"
                >
                  Política de Privacidade
                </Link>
              </label>
              {errors.acceptTerms && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.acceptTerms.message}
                </p>
              )}
            </div>
          </div>
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
            {loading ? 'Configurando...' : 'Configurar senha'}
          </button>
        </div>
      </form>
    </div>
  );
}
