'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeftIcon, EnvelopeIcon } from '@heroicons/react/24/outline';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Se o email existir em nossa base de dados, você receberá um link para redefinir sua senha.');
      } else {
        setError(data.error || 'Erro ao enviar email de recuperação');
      }
    } catch (err) {
      setError('Erro interno. Tente novamente mais tarde.');
      console.error('Erro ao enviar email de recuperação:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Logo */}
        <div className="text-center">
          <Link href="/" className="inline-block">
            <h2 className="text-3xl font-bold text-green-600">GuaraBrechó</h2>
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mt-6">
          <h1 className="text-2xl font-bold text-gray-900">Esqueceu sua senha?</h1>
          <p className="mt-2 text-sm text-gray-600">
            Digite seu email e enviaremos um link para redefinir sua senha
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10 border border-gray-200">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Success Message */}
            {message && (
              <div className="bg-green-50 border border-green-200 rounded-md p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <EnvelopeIcon className="h-5 w-5 text-green-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-green-800">{message}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <div className="text-sm text-red-600">
                  {error}
                </div>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm transition-colors"
                  placeholder="Digite seu email"
                  disabled={isLoading || !!message}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading || !!message}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02]"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Enviando...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <EnvelopeIcon className="w-4 h-4 mr-2" />
                    Enviar Link de Recuperação
                  </div>
                )}
              </button>
            </div>
          </form>

          {/* Back to Login */}
          <div className="mt-6">
            <div className="text-center">
              <Link
                href="/auth/signin"
                className="inline-flex items-center text-sm text-green-600 hover:text-green-500 transition-colors"
              >
                <ArrowLeftIcon className="w-4 h-4 mr-1" />
                Voltar para o login
              </Link>
            </div>
          </div>

          {/* Additional Help */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Ainda precisa de ajuda?{' '}
                <Link
                  href="/contato"
                  className="font-medium text-green-600 hover:text-green-500 transition-colors"
                >
                  Entre em contato
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
