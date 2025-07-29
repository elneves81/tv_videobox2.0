'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import {
  PlusIcon,
  HeartIcon,
  UserIcon,
  Cog6ToothIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  CreditCardIcon,
  MegaphoneIcon,
} from '@heroicons/react/24/outline';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Verificar se é admin
  const isAdmin = session?.user?.email && 
    ['admin@guarabrecho.com', 'elber@guarabrecho.com'].includes(session.user.email);

  useEffect(() => {
    if (status === 'loading') return; // Still loading
    if (!session) router.push('/auth/signin'); // Not logged in
  }, [session, status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!session) {
    return null; // Will redirect
  }

  return (
    <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        {/* Welcome Section */}
        <div className="bg-white overflow-hidden shadow rounded-lg mb-6">
          <div className="px-4 py-5 sm:p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Bem-vindo ao seu Dashboard!
            </h1>
            <p className="text-gray-600">
              Gerencie seus anúncios, favorites e configurações da sua conta.
            </p>
          </div>
        </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            <Link
              href="/anunciar"
              className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <PlusIcon className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Novo Anúncio
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        Anunciar Produto
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </Link>

            <Link
              href="/dashboard/meus-anuncios"
              className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <UserIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Meus Anúncios
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        Ver produtos
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </Link>

            <Link
              href="/dashboard/marketing"
              className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <MegaphoneIcon className="h-6 w-6 text-orange-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Marketing
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        Campanhas & Promoção
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </Link>

            <Link
              href="/dashboard/assinatura"
              className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <CreditCardIcon className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Minha Assinatura
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        Gerenciar plano
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </Link>
          </div>

          {/* Segunda linha de ações */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
            <Link
              href="/dashboard/analytics"
              className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <ChartBarIcon className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Analytics
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        Ver estatísticas
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </Link>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <HeartIcon className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Favoritos
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        0 produtos
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <Link
              href="/dashboard/configuracoes"
              className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Cog6ToothIcon className="h-6 w-6 text-gray-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Configurações
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        Perfil
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </Link>
          </div>

          {/* Admin Actions */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
            <Link
              href="/dashboard/vendedor"
              className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <ChartBarIcon className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Dashboard Vendedor
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        Estatísticas e gestão
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </Link>

            {/* Admin Panel - Only show for admins */}
            {isAdmin && (
              <Link
                href="/admin"
                className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow border-2 border-red-200"
              >
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <ShieldCheckIcon className="h-6 w-6 text-red-600" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-red-500 truncate">
                          ADMINISTRADOR
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          Painel Admin
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </Link>
            )}
          </div>

          {/* Recent Activity */}
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Atividade Recente
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Seus anúncios e interações mais recentes.
              </p>
            </div>
            <div className="border-t border-gray-200">
              <div className="px-4 py-5 sm:px-6">
                <div className="text-center py-8">
                  <div className="text-gray-500">
                    <UserIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">
                      Nenhuma atividade ainda
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Comece criando seu primeiro anúncio no GuaraBrechó.
                    </p>
                    <div className="mt-6">
                      <Link
                        href="/anunciar"
                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      >
                        <PlusIcon className="h-4 w-4 mr-2" />
                        Criar primeiro anúncio
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
  );
}
