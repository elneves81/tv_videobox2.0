'use client';

import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';

function DebugAuthContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [debugInfo, setDebugInfo] = useState<any>({});

  useEffect(() => {
    const info = {
      status,
      session,
      searchParams: Object.fromEntries(searchParams.entries()),
      currentUrl: window.location.href,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
    };
    
    setDebugInfo(info);
    console.log('Auth Debug Info:', info);
  }, [status, session, searchParams]);

  const testGoogleAuth = () => {
    console.log('Testing Google auth...');
    window.location.href = '/api/auth/providers';
  };

  const testDashboardRedirect = () => {
    console.log('Testing dashboard redirect...');
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            🔍 Debug de Autenticação
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Status Atual */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Status Atual
              </h2>
              <div className="space-y-2 text-sm">
                <div>
                  <strong>Status:</strong>{' '}
                  <span className={`px-2 py-1 rounded text-xs ${
                    status === 'authenticated' 
                      ? 'bg-green-100 text-green-800' 
                      : status === 'loading'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {status}
                  </span>
                </div>
                <div>
                  <strong>Sessão:</strong> {session ? '✅ Ativa' : '❌ Inativa'}
                </div>
                {session?.user && (
                  <div>
                    <strong>Usuário:</strong> {session.user.email}
                  </div>
                )}
              </div>
            </div>

            {/* Informações da URL */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                URL e Parâmetros
              </h2>
              <div className="space-y-2 text-sm">
                <div>
                  <strong>URL:</strong>
                  <div className="text-xs text-gray-600 dark:text-gray-400 break-all">
                    {debugInfo.currentUrl}
                  </div>
                </div>
                <div>
                  <strong>Parâmetros:</strong>
                  <pre className="text-xs bg-gray-100 dark:bg-gray-600 p-2 rounded mt-1">
                    {JSON.stringify(debugInfo.searchParams, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          </div>

          {/* Dados da Sessão */}
          <div className="mt-6 bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Dados da Sessão
            </h2>
            <pre className="text-xs bg-gray-100 dark:bg-gray-600 p-4 rounded overflow-auto max-h-60">
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          </div>

          {/* Actions de Teste */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={testGoogleAuth}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Testar Providers
            </button>
            
            <button
              onClick={testDashboardRedirect}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Ir para Dashboard
            </button>
            
            <button
              onClick={() => window.location.href = '/auth/signin'}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Página de Login
            </button>
          </div>

          {/* Logs */}
          <div className="mt-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
              💡 Dica para Debug
            </h3>
            <p className="text-sm text-yellow-700 dark:text-yellow-300">
              Abra o console do navegador (F12) para ver logs detalhados do processo de autenticação.
              Todos os eventos de login/redirect são logados com prefixo "NextAuth".
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Carregando informações de debug...</p>
      </div>
    </div>
  );
}

export default function DebugAuthPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <DebugAuthContent />
    </Suspense>
  );
}
