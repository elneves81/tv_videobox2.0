'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { 
  ShieldCheckIcon,
  UsersIcon,
  TagIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XMarkIcon,
  EyeIcon,
  TrashIcon,
  UserIcon,
  NoSymbolIcon
} from '@heroicons/react/24/outline';

interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  isBlocked: boolean;
  _count: {
    products: number;
  };
}

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  type: string;
  category: {
    name: string;
  };
  user: {
    name: string;
    email: string;
  };
  createdAt: string;
}

interface Stats {
  totalUsers: number;
  totalProducts: number;
  totalCategories: number;
  newUsersToday: number;
}

export default function AdminPanel() {
  const { data: session, status } = useSession();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [users, setUsers] = useState<User[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalProducts: 0,
    totalCategories: 0,
    newUsersToday: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    if (session?.user?.email === 'admin@guarabrecho.com') {
      loadDashboardData();
    }
  }, [session]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Carregar estatísticas
      const statsRes = await fetch('/api/admin/stats');
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }

      // Carregar usuários
      const usersRes = await fetch('/api/admin/users');
      if (usersRes.ok) {
        const usersData = await usersRes.json();
        console.log('Dados dos usuários:', usersData); // Debug
        // Limpar dados de imagem problemáticos
        const cleanUsers = usersData.map((user: any) => ({
          ...user,
          image: null // Remover imagens temporariamente para evitar erros
        }));
        setUsers(cleanUsers || []);
      } else {
        console.error('Erro ao carregar usuários:', usersRes.status, usersRes.statusText);
      }

      // Carregar produtos
      const productsRes = await fetch('/api/products?limit=20');
      if (productsRes.ok) {
        const productsData = await productsRes.json();
        // Limpar dados de imagem problemáticos dos produtos
        const cleanProducts = (productsData.products || []).map((product: any) => ({
          ...product,
          images: null // Remover imagens temporariamente para evitar erros
        }));
        setProducts(cleanProducts);
      } else {
        console.error('Erro ao carregar produtos:', productsRes.status, productsRes.statusText);
      }
    } catch (error) {
      console.error('Erro ao carregar dados do admin:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBlockUser = async (userId: string, block: boolean) => {
    try {
      const endpoint = block ? '/api/admin/users/block' : '/api/admin/users/unblock';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });

      if (response.ok) {
        setUsers(users.map(user => 
          user.id === userId ? { ...user, isBlocked: block } : user
        ));
      }
    } catch (error) {
      console.error('Erro ao bloquear/desbloquear usuário:', error);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Tem certeza que deseja deletar este usuário? Esta ação não pode ser desfeita.')) {
      return;
    }

    try {
      const response = await fetch('/api/admin/users/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });

      if (response.ok) {
        setUsers(users.filter(user => user.id !== userId));
      }
    } catch (error) {
      console.error('Erro ao deletar usuário:', error);
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Carregando painel administrativo...</p>
        </div>
      </div>
    );
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Verificando permissões...</p>
        </div>
      </div>
    );
  }

  if (!session || session.user?.email !== 'admin@guarabrecho.com') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <ExclamationTriangleIcon className="mx-auto h-16 w-16 text-red-500 mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Acesso Negado</h1>
          <p className="text-gray-600 dark:text-gray-300">Você não tem permissão para acessar esta área.</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: ChartBarIcon },
    { id: 'users', name: 'Usuários', icon: UsersIcon },
    { id: 'products', name: 'Produtos', icon: TagIcon }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
            <ShieldCheckIcon className="w-8 h-8 mr-3 text-green-600" />
            Painel Administrativo
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Gerencie usuários, produtos e monitore as atividades da plataforma
          </p>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700 mb-8">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center py-2 px-1 border-b-2 font-medium text-sm
                  ${activeTab === tab.id
                    ? 'border-green-500 text-green-600 dark:text-green-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                  }
                `}
              >
                <tab.icon className="w-5 h-5 mr-2" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-300">Carregando dados...</p>
          </div>
        ) : (
          <>
            {/* Dashboard Tab */}
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                    <div className="flex items-center">
                      <UsersIcon className="w-8 h-8 text-blue-500" />
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                          Total de Usuários
                        </h3>
                        <p className="text-2xl font-bold text-blue-600">{stats.totalUsers}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                    <div className="flex items-center">
                      <TagIcon className="w-8 h-8 text-green-500" />
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                          Total de Produtos
                        </h3>
                        <p className="text-2xl font-bold text-green-600">{stats.totalProducts}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                    <div className="flex items-center">
                      <ChartBarIcon className="w-8 h-8 text-purple-500" />
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                          Categorias
                        </h3>
                        <p className="text-2xl font-bold text-purple-600">{stats.totalCategories}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                    <div className="flex items-center">
                      <UserIcon className="w-8 h-8 text-orange-500" />
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                          Cadastros Hoje
                        </h3>
                        <p className="text-2xl font-bold text-orange-600">{stats.newUsersToday}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    Produtos Recentes
                  </h3>
                  <div className="space-y-4">
                    {products.slice(0, 5).map((product) => (
                      <div key={product.id} className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-2">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{product.title}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            por {product.user.name} • {product.category.name}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-green-600">
                            {product.type === 'VENDA' ? `R$ ${product.price.toFixed(2)}` : product.type}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(product.createdAt).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Gerenciar Usuários ({users.length})
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Usuário
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Produtos
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Cadastro
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Ações
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {users.map((user) => (
                        <tr key={user.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {user.name}
                              </div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {user._count.products}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {user.isBlocked ? (
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                Bloqueado
                              </span>
                            ) : (
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                Ativo
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                            <button
                              onClick={() => handleBlockUser(user.id, !user.isBlocked)}
                              className={`${
                                user.isBlocked 
                                  ? 'text-green-600 hover:text-green-900' 
                                  : 'text-orange-600 hover:text-orange-900'
                              }`}
                              title={user.isBlocked ? 'Desbloquear usuário' : 'Bloquear usuário'}
                            >
                              {user.isBlocked ? <CheckCircleIcon className="w-5 h-5" /> : <NoSymbolIcon className="w-5 h-5" />}
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user.id)}
                              className="text-red-600 hover:text-red-900 ml-2"
                              title="Deletar usuário"
                            >
                              <TrashIcon className="w-5 h-5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Products Tab */}
            {activeTab === 'products' && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Produtos na Plataforma ({products.length})
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Produto
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Vendedor
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Categoria
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Tipo/Preço
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Data
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Ações
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {products.map((product) => (
                        <tr key={product.id}>
                          <td className="px-6 py-4">
                            <div>
                              <div className="text-sm font-medium text-gray-900 dark:text-white line-clamp-1">
                                {product.title}
                              </div>
                              <div className="text-sm text-gray-500 line-clamp-2">
                                {product.description}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900 dark:text-white">{product.user.name}</div>
                            <div className="text-sm text-gray-500">{product.user.email}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {product.category.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900 dark:text-white">
                              {product.type === 'VENDA' ? `R$ ${product.price.toFixed(2)}` : product.type}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(product.createdAt).toLocaleDateString('pt-BR')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <a
                              href={`/produtos/${product.id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-900"
                              title="Ver produto"
                            >
                              <EyeIcon className="w-5 h-5" />
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
