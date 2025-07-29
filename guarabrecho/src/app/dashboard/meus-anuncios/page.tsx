'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { SafeImage } from '@/lib/safe-image';
import { canHighlightProduct } from '@/lib/plan-restrictions';
import { HighlightPurchase } from '@/components/HighlightPurchase';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  ArrowLeftIcon,
  TagIcon,
  MapPinIcon,
  CalendarIcon,
  StarIcon,
} from '@heroicons/react/24/outline';

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  type: string;
  condition: string;
  category: {
    name: string;
  };
  neighborhood: string;
  images: string;
  status: string;
  createdAt: string;
}

export default function MeusAnunciosPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showHighlightPurchase, setShowHighlightPurchase] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Para simulação, vamos considerar que o usuário tem plano FREE
  const userPlan: 'FREE' | 'PREMIUM' | 'PRO' = 'FREE';

  const fetchMyProducts = useCallback(async () => {
    try {
      const response = await fetch('/api/user/products');
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      }
    } catch (error) {
      console.warn('Erro ao carregar produtos:', error instanceof Error ? error.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/auth/signin');
      return;
    }
    fetchMyProducts();
  }, [session, status, fetchMyProducts]);

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Tem certeza que deseja excluir este produto?')) return;

    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setProducts(products.filter(p => p.id !== productId));
        alert('Produto excluído com sucesso!');
      } else {
        alert('Erro ao excluir produto');
      }
    } catch (error) {
      console.warn('Erro ao excluir produto:', error instanceof Error ? error.message : 'Erro desconhecido');
      alert('Erro ao excluir produto');
    }
  };

  const handleHighlight = (product: Product) => {
    const canHighlight = canHighlightProduct(userPlan);
    if (canHighlight.allowed) {
      setSelectedProduct(product);
      setShowHighlightPurchase(true);
    } else {
      alert(canHighlight.message);
    }
  };

  const formatPrice = useCallback((price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  }, []);

  const formatDate = useCallback((date: string) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }, []);

  const getTypeLabel = useCallback((type: string) => {
    const types = {
      'VENDA': 'Venda',
      'TROCA': 'Troca',
      'DOACAO': 'Doação'
    };
    return types[type as keyof typeof types] || type;
  }, []);

  const getTypeBadge = useCallback((type: string) => {
    const badges = {
      'VENDA': 'bg-green-100 text-green-800',
      'TROCA': 'bg-blue-100 text-blue-800',
      'DOACAO': 'bg-purple-100 text-purple-800'
    };
    return badges[type as keyof typeof badges] || 'bg-gray-100 text-gray-800';
  }, []);

  const getStatusBadge = useCallback((status: string) => {
    const badges = {
      'ACTIVE': 'bg-green-100 text-green-800',
      'SOLD': 'bg-gray-100 text-gray-800',
      'INACTIVE': 'bg-red-100 text-red-800'
    };
    const labels = {
      'ACTIVE': 'Ativo',
      'SOLD': 'Vendido',
      'INACTIVE': 'Inativo'
    };
    return {
      class: badges[status as keyof typeof badges] || 'bg-gray-100 text-gray-800',
      label: labels[status as keyof typeof labels] || status
    };
  }, []);

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-1" />
            Voltar ao Dashboard
          </Link>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Meus Anúncios</h1>
              <p className="mt-2 text-gray-600">
                Gerencie todos os seus produtos anunciados
              </p>
            </div>
            <Link
              href="/anunciar"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Novo Anúncio
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <TagIcon className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total de Anúncios
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {products.length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <EyeIcon className="h-6 w-6 text-green-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Ativos
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {products.filter(p => p.status === 'ACTIVE').length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CalendarIcon className="h-6 w-6 text-blue-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Este Mês
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {products.filter(p => {
                        const productDate = new Date(p.createdAt);
                        const now = new Date();
                        return productDate.getMonth() === now.getMonth() && 
                               productDate.getFullYear() === now.getFullYear();
                      }).length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Products List */}
        {products.length === 0 ? (
          <div className="text-center py-12">
            <TagIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum anúncio ainda
            </h3>
            <p className="text-gray-500 mb-4">
              Comece criando seu primeiro anúncio no GuaraBrechó
            </p>
            <Link
              href="/anunciar"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Criar primeiro anúncio
            </Link>
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {products.map((product) => (
                <li key={product.id}>
                  <div className="px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center flex-1 min-w-0">
                      {/* Product Image */}
                      <div className="flex-shrink-0 h-16 w-16">
                        <SafeImage
                          src={product.images}
                          alt={product.title}
                          className="h-16 w-16 rounded-lg object-cover"
                          fallbackIcon={
                            <TagIcon className="h-8 w-8 text-gray-400" />
                          }
                        />
                      </div>

                      {/* Product Info */}
                      <div className="ml-4 flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="text-lg font-medium text-gray-900 truncate">
                            {product.title}
                          </h3>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getTypeBadge(product.type)}`}>
                            {getTypeLabel(product.type)}
                          </span>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getStatusBadge(product.status).class}`}>
                            {getStatusBadge(product.status).label}
                          </span>
                        </div>
                        
                        <div className="flex items-center text-sm text-gray-500 space-x-4">
                          <span className="flex items-center">
                            <TagIcon className="h-4 w-4 mr-1" />
                            {product.category.name}
                          </span>
                          <span className="flex items-center">
                            <MapPinIcon className="h-4 w-4 mr-1" />
                            {product.neighborhood}
                          </span>
                          <span className="flex items-center">
                            <CalendarIcon className="h-4 w-4 mr-1" />
                            {formatDate(product.createdAt)}
                          </span>
                        </div>
                        
                        {product.type === 'VENDA' && (
                          <div className="mt-1 text-lg font-semibold text-green-600">
                            {formatPrice(product.price)}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2">
                      <Link
                        href={`/produtos/${product.id}`}
                        className="inline-flex items-center p-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                        title="Ver produto"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </Link>
                      
                      <button
                        onClick={() => router.push(`/anunciar?edit=${product.id}`)}
                        className="inline-flex items-center p-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                        title="Editar produto"
                        type="button"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      
                      <button
                        onClick={() => handleHighlight(product)}
                        className="inline-flex items-center p-2 border border-yellow-300 rounded-md shadow-sm text-sm font-medium text-yellow-700 bg-white hover:bg-yellow-50"
                        title="Destacar produto"
                        type="button"
                      >
                        <StarIcon className="h-4 w-4" />
                      </button>
                      
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="inline-flex items-center p-2 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50"
                        title="Excluir produto"
                        type="button"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Modal de Destaque */}
      {showHighlightPurchase && selectedProduct && (
        <HighlightPurchase
          product={selectedProduct}
          onClose={() => setShowHighlightPurchase(false)}
          onSuccess={() => {
            setShowHighlightPurchase(false);
            // Recarregar os produtos para refletir o destaque
            fetchMyProducts();
          }}
        />
      )}
    </div>
  );
}
