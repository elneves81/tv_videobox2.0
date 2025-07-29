'use client';

import dynamic from 'next/dynamic';

// Import dinâmico para evitar problemas de SSR
const AdminPanel = dynamic(() => import('./AdminPanel'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Carregando painel administrativo...</p>
      </div>
    </div>
  )
});

export default function AdminPage() {
  return <AdminPanel />;
}
