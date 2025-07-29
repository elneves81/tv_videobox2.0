'use client';

import { useState } from 'react';
import { signIn, useSession } from 'next-auth/react';
import Link from 'next/link';

export default function TestLoginPage() {
  const [email, setEmail] = useState('teste@guarabrecho.com');
  const [password, setPassword] = useState('123456');
  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { data: session, status } = useSession();

  const testCredentialsLogin = async () => {
    setIsLoading(true);
    setResult(null);
    
    console.log('🔄 Iniciando teste de login...');
    
    try {
      const loginResult = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });
      
      console.log('📊 Resultado do login:', loginResult);
      setResult(loginResult);
      
      if (loginResult?.ok) {
        console.log('✅ Login bem-sucedido! Redirecionando...');
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 2000);
      }
    } catch (error) {
      console.error('❌ Erro no teste de login:', error);
      setResult({ error: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const testGoogleLogin = async () => {
    setIsLoading(true);
    console.log('🔄 Iniciando login com Google...');
    
    try {
      await signIn('google', {
        callbackUrl: '/dashboard',
        redirect: true
      });
    } catch (error) {
      console.error('❌ Erro no login Google:', error);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">🔧 Debug de Login</h1>
        
        {/* Status da Sessão */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">📊 Status da Sessão</h2>
          <div className="space-y-2">
            <p><strong>Status:</strong> {status}</p>
            <p><strong>Usuário:</strong> {session?.user?.email || 'Não logado'}</p>
            <p><strong>Nome:</strong> {session?.user?.name || 'N/A'}</p>
          </div>
        </div>

        {/* Teste de Login com Credenciais */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">🔑 Teste Login Credenciais</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Email:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Senha:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>

          <button
            onClick={testCredentialsLogin}
            disabled={isLoading}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {isLoading ? '⏳ Testando...' : '🔑 Testar Login'}
          </button>
        </div>

        {/* Teste de Login com Google */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">🌐 Teste Login Google</h2>
          
          <button
            onClick={testGoogleLogin}
            disabled={isLoading}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:opacity-50"
          >
            {isLoading ? '⏳ Redirecionando...' : '🌐 Testar Google'}
          </button>
        </div>

        {/* Resultado */}
        {result && (
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <h2 className="text-xl font-semibold mb-4">📝 Resultado do Teste</h2>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}

        {/* Links de Navegação */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">🧭 Navegação</h2>
          <div className="space-x-4">
            <Link href="/auth/signin" className="text-blue-500 hover:underline">
              ← Voltar para Login
            </Link>
            <Link href="/dashboard" className="text-green-500 hover:underline">
              Ir para Dashboard →
            </Link>
            <Link href="/" className="text-purple-500 hover:underline">
              Página Inicial
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
