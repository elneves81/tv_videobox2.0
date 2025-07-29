'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  ChartBarIcon,
  EyeIcon,
  ShoppingBagIcon,
  ChatBubbleLeftRightIcon,
  StarIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolid } from '@heroicons/react/24/solid';
import Link from 'next/link';
import { SafeImage } from '@/lib/safe-image';

interface DashboardStats {
  totalProducts: number;
  activeProducts: number;
  soldProducts: number;
  totalViews: number;
  totalMessages: number;
  averageRating: number;
  totalRatings: number;
  recentActivity: Array<{
    type: 'view' | 'message' | 'review' | 'sale';
    description: string;
    date: string;
  }>;
}

interface ProductStats {
  id: string;
  title: string;
  images: string;
  price: number;
  type: string;
  status: string;
  views: number;
  messages: number;
  createdAt: string;
  updatedAt: string;
}

export default function SellerDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [products, setProducts] = useState<ProductStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<'overview' | 'products' | 'messages' | 'reviews'>('overview');

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/auth/signin');
      return;
    }

    fetchDashboardData();
  }, [session, status, router]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch dashboard stats
      const [statsResponse, productsResponse] = await Promise.all([
        fetch('/api/dashboard/stats'),
        fetch('/api/dashboard/products')
      ]);

      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData);
      }

      if (productsResponse.ok) {
        const productsData = await productsResponse.json();
        setProducts(productsData);
      }
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Tem certeza que deseja excluir este produto?')) return;

    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setProducts(prev => prev.filter(p => p.id !== productId));
        fetchDashboardData(); // Refresh stats
      }
    } catch (error) {
      console.error('Erro ao excluir produto:', error);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      'ACTIVE': { label: 'Ativo', bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircleIcon },
      'SOLD': { label: 'Vendido', bg: 'bg-blue-100', text: 'text-blue-800', icon: ShoppingBagIcon },
      'INACTIVE': { label: 'Inativo', bg: 'bg-gray-100', text: 'text-gray-800', icon: XCircleIcon }
    };
    return badges[status as keyof typeof badges] || badges.ACTIVE;
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard do Vendedor</h1>
              <p className="text-gray-600 mt-1">Gerencie seus anúncios e acompanhe seu desempenho</p>
            </div>
            <Link
              href="/dashboard/novo-produto"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Novo Anúncio
            </Link>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            {[
              { key: 'overview', label: 'Visão Geral', icon: ChartBarIcon },
              { key: 'products', label: 'Meus Produtos', icon: ShoppingBagIcon },
              { key: 'messages', label: 'Conversas', icon: ChatBubbleLeftRightIcon },
              { key: 'reviews', label: 'Avaliações', icon: StarIcon }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setSelectedTab(tab.key as any)}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  selectedTab === tab.key
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                <tab.icon className="h-5 w-5 mr-2" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content based on selected tab */}
        {selectedTab === 'overview' && stats && (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <ShoppingBagIcon className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900">{stats.totalProducts}</h3>
                    <p className="text-sm text-gray-600">Total de Produtos</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <EyeIcon className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900">{stats.totalViews}</h3>
                    <p className="text-sm text-gray-600">Visualizações</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <ChatBubbleLeftRightIcon className="h-8 w-8 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900">{stats.totalMessages}</h3>
                    <p className="text-sm text-gray-600">Mensagens</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <StarSolid className="h-8 w-8 text-yellow-500" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {stats.averageRating.toFixed(1)}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Avaliação ({stats.totalRatings})
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Atividade Recente</h3>
              {stats.recentActivity.length > 0 ? (
                <div className="space-y-3">
                  {stats.recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="flex-shrink-0">
                        {activity.type === 'view' && <EyeIcon className="h-5 w-5 text-blue-600" />}
                        {activity.type === 'message' && <ChatBubbleLeftRightIcon className="h-5 w-5 text-purple-600" />}
                        {activity.type === 'review' && <StarIcon className="h-5 w-5 text-yellow-500" />}
                        {activity.type === 'sale' && <ShoppingBagIcon className="h-5 w-5 text-green-600" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">{activity.description}</p>
                        <p className="text-xs text-gray-500">{formatDate(activity.date)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">Nenhuma atividade recente</p>
              )}
            </div>
          </>
        )}

        {selectedTab === 'products' && (
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Meus Produtos</h3>
            </div>
            <div className="p-6">
              {products.length > 0 ? (
                <div className="space-y-4">
                  {products.map((product) => {
                    const statusBadge = getStatusBadge(product.status);
                    
                    return (
                      <div key={product.id} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                        {/* Product Image */}
                        <div className="flex-shrink-0 w-20 h-20">
                          <SafeImage
                            src={product.images}
                            alt={product.title}
                            className="w-full h-full rounded-lg object-cover"
                            fallbackIcon={
                              <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                                <ShoppingBagIcon className="h-8 w-8 text-gray-400" />
                              </div>
                            }
                          />
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-gray-900 truncate">{product.title}</h4>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusBadge.bg} ${statusBadge.text}`}>
                              <statusBadge.icon className="h-3 w-3 mr-1" />
                              {statusBadge.label}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span className="font-medium text-green-600">
                              {product.type === 'DOACAO' ? 'Grátis' : formatPrice(product.price)}
                            </span>
                            <span className="flex items-center gap-1">
                              <EyeIcon className="h-4 w-4" />
                              {product.views} visualizações
                            </span>
                            <span className="flex items-center gap-1">
                              <ChatBubbleLeftRightIcon className="h-4 w-4" />
                              {product.messages} mensagens
                            </span>
                            <span className="flex items-center gap-1">
                              <ClockIcon className="h-4 w-4" />
                              {formatDate(product.createdAt)}
                            </span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/produtos/${product.id}`}
                            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Ver produto"
                          >
                            <EyeIcon className="h-5 w-5" />
                          </Link>
                          <Link
                            href={`/dashboard/editar-produto/${product.id}`}
                            className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Editar produto"
                          >
                            <PencilIcon className="h-5 w-5" />
                          </Link>
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Excluir produto"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <ShoppingBagIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum produto cadastrado</h3>
                  <p className="text-gray-600 mb-4">Comece criando seu primeiro anúncio</p>
                  <Link
                    href="/dashboard/novo-produto"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Criar Primeiro Anúncio
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}

        {selectedTab === 'messages' && (
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Gestão de Conversas</h3>
            <p className="text-gray-600 mb-4">
              Gerencie suas conversas através do chat flutuante no canto inferior direito.
            </p>
            <div className="flex items-center justify-center py-12 text-gray-500">
              <div className="text-center">
                <ChatBubbleLeftRightIcon className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <p>Chat integrado disponível em todas as páginas</p>
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'reviews' && (
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Minhas Avaliações</h3>
            {stats && stats.totalRatings > 0 ? (
              <div className="text-center py-12">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <StarSolid
                        key={star}
                        className={`h-8 w-8 ${
                          star <= Math.round(stats.averageRating)
                            ? 'text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-2xl font-bold text-gray-900">
                    {stats.averageRating.toFixed(1)}
                  </span>
                </div>
                <p className="text-gray-600">
                  Baseado em {stats.totalRatings} avaliação{stats.totalRatings !== 1 ? 'ões' : ''}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  As avaliações detalhadas aparecem nas páginas dos produtos
                </p>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <StarIcon className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <p>Ainda não há avaliações</p>
                <p className="text-sm mt-2">Complete algumas vendas para receber avaliações</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
