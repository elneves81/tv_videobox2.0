'use client';

import { useState, useEffect } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartOutline } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';
import Image from 'next/image';
import Link from 'next/link';
import AdvancedSearch from '@/components/AdvancedSearch';

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  type: string;
  condition: string;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  neighborhood: string;
  images: string;
  user: {
    name: string;
  };
  createdAt: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  _count: {
    products: number;
  };
}

interface AdvancedSearchFilters {
  search?: string;
  category?: string;
  type?: string;
  condition?: string;
  neighborhood?: string;
  priceMin?: number;
  priceMax?: number;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: 'createdAt' | 'price' | 'title';
  sortOrder?: 'asc' | 'desc';
}

export default function ProdutosPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [currentFilters, setCurrentFilters] = useState<AdvancedSearchFilters>({});
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 0
  });

  // MVP destaque
  const [highlighted, setHighlighted] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      return JSON.parse(localStorage.getItem('highlightedProducts') || '[]');
    }
    return [];
  });

  // Validação de base64
  const isValidDataUrl = (str: string): boolean => {
    try {
      const base64Regex = /^data:image\/(jpeg|jpg|png|gif|webp);base64,([A-Za-z0-9+/=]+)$/;
      if (!base64Regex.test(str)) return false;
      
      const base64Data = str.split(',')[1];
      if (!base64Data || base64Data.length < 100) return false;
      
      return true;
    } catch {
      return false;
    }
  };

  const getFirstImage = (imagesString: string): string | null => {
    if (!imagesString) return null;
    
    if (imagesString.startsWith('data:image/')) {
      return isValidDataUrl(imagesString) ? imagesString : null;
    }
    
    const images = imagesString.split(',').map(img => img.trim());
    const firstImage = images[0];
    
    return isValidDataUrl(firstImage) ? firstImage : null;
  };

  // Carregar categorias
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        if (response.ok) {
          const data = await response.json();
          setCategories(data);
        }
      } catch (error) {
        console.error('Erro ao carregar categorias:', error);
      }
    };

    fetchCategories();
  }, []);

  // Função para construir URL com filtros
  const buildApiUrl = (filters: AdvancedSearchFilters, page = 1) => {
    const params = new URLSearchParams();
    
    params.append('page', page.toString());
    params.append('limit', pagination.limit.toString());
    
    if (filters.search) params.append('search', filters.search);
    if (filters.category) params.append('category', filters.category);
    if (filters.type) params.append('type', filters.type);
    if (filters.condition) params.append('condition', filters.condition);
    if (filters.neighborhood) params.append('neighborhood', filters.neighborhood);
    if (filters.priceMin) params.append('priceMin', filters.priceMin.toString());
    if (filters.priceMax) params.append('priceMax', filters.priceMax.toString());
    if (filters.dateFrom) params.append('dateFrom', filters.dateFrom);
    if (filters.dateTo) params.append('dateTo', filters.dateTo);
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);
    
    return `/api/products?${params.toString()}`;
  };

  // Carregar produtos
  const fetchProducts = async (filters: AdvancedSearchFilters, page = 1) => {
    setLoading(true);
    try {
      const response = await fetch(buildApiUrl(filters, page));
      if (response.ok) {
        const data = await response.json();
        setProducts(data.products);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
    } finally {
      setLoading(false);
    }
  };

  // Carregar produtos iniciais
  useEffect(() => {
    fetchProducts(currentFilters, pagination.page);
  }, []);

  // Handler para busca avançada
  const handleAdvancedSearch = (filters: AdvancedSearchFilters) => {
    setCurrentFilters(filters);
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchProducts(filters, 1);
    setShowAdvancedSearch(false);
  };

  // Handler para busca simples
  const handleSimpleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const filters = { ...currentFilters, search: searchTerm };
    handleAdvancedSearch(filters);
  };

  // Limpar filtros
  const clearFilters = () => {
    setSearchTerm('');
    setCurrentFilters({});
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchProducts({}, 1);
  };

  // Paginação
  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
    fetchProducts(currentFilters, newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Funções auxiliares
  const toggleFavorite = (productId: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(productId)) {
      newFavorites.delete(productId);
    } else {
      newFavorites.add(productId);
    }
    setFavorites(newFavorites);
  };

  const handleWhatsAppContact = (product: Product) => {
    const action = product.type === 'VENDA' ? 'comprar' : 
                  product.type === 'TROCA' ? 'trocar' : 'solicitar';
    
    const message = `Olá! Tenho interesse em ${action} o produto "${product.title}" que você anunciou no GuaraBrechó.`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const getTransactionBadge = (type: string) => {
    const badges = {
      'VENDA': 'bg-green-100 text-green-800',
      'TROCA': 'bg-blue-100 text-blue-800',
      'DOACAO': 'bg-purple-100 text-purple-800'
    };
    return badges[type as keyof typeof badges] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Produtos Disponíveis</h1>
          <p className="text-gray-600">
            Encontre produtos únicos em Guarapuava - {pagination.total} produtos disponíveis
          </p>
        </div>

        {/* Busca Simples */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <form onSubmit={handleSimpleSearch} className="flex gap-4 mb-4">
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar produtos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Buscar
            </button>
            <button
              type="button"
              onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Filtros Avançados
            </button>
          </form>

          {/* Filtros ativos */}
          {Object.keys(currentFilters).length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="text-sm text-gray-600">Filtros ativos:</span>
              {currentFilters.search && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Busca: {currentFilters.search}
                </span>
              )}
              {currentFilters.category && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Categoria: {categories.find(c => c.slug === currentFilters.category)?.name}
                </span>
              )}
              {currentFilters.type && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  Tipo: {currentFilters.type}
                </span>
              )}
              <button
                onClick={clearFilters}
                className="text-xs text-red-600 hover:text-red-800 ml-2"
              >
                Limpar filtros
              </button>
            </div>
          )}
        </div>

        {/* Busca Avançada */}
        {showAdvancedSearch && (
          <div className="mb-6">
            <AdvancedSearch
              onSearch={handleAdvancedSearch}
              categories={categories}
              initialFilters={currentFilters}
            />
          </div>
        )}

        {/* Grid de Produtos */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm border animate-pulse">
                <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-4 w-3/4"></div>
                  <div className="h-6 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhum produto encontrado
              </h3>
              <p className="text-gray-600 mb-4">
                Tente ajustar os filtros de busca ou navegar por categorias diferentes.
              </p>
              <button
                onClick={clearFilters}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Ver todos os produtos
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {products.map((product) => {
                const firstImage = getFirstImage(product.images);
                const isHighlighted = highlighted.includes(product.id);
                
                return (
                  <div
                    key={product.id}
                    className={`bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow relative ${
                      isHighlighted ? 'ring-2 ring-yellow-400' : ''
                    }`}
                  >
                    {isHighlighted && (
                      <div className="absolute top-2 left-2 z-10">
                        <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full">
                          ⭐ DESTAQUE
                        </span>
                      </div>
                    )}

                    {/* Imagem */}
                    <div className="relative h-48 rounded-t-lg overflow-hidden">
                      {firstImage ? (
                        <Image
                          src={firstImage}
                          alt={product.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-400 text-sm">Sem imagem</span>
                        </div>
                      )}
                      
                      {/* Botão de favorito */}
                      <button
                        onClick={() => toggleFavorite(product.id)}
                        className="absolute top-2 right-2 p-2 bg-white/80 rounded-full hover:bg-white transition-colors"
                      >
                        {favorites.has(product.id) ? (
                          <HeartSolid className="h-5 w-5 text-red-500" />
                        ) : (
                          <HeartOutline className="h-5 w-5 text-gray-600" />
                        )}
                      </button>
                    </div>

                    {/* Conteúdo */}
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {product.title}
                        </h3>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTransactionBadge(product.type)}`}>
                          {product.type}
                        </span>
                      </div>

                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {product.description}
                      </p>

                      <div className="flex items-center justify-between mb-3">
                        <span className="text-lg font-bold text-green-600">
                          {product.type === 'DOACAO' ? 'Grátis' : formatPrice(product.price)}
                        </span>
                        <span className="text-xs text-gray-500">
                          {product.neighborhood}
                        </span>
                      </div>

                      <div className="flex gap-2">
                        <Link
                          href={`/produtos/${product.id}`}
                          className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors text-center"
                        >
                          Ver Detalhes
                        </Link>
                        <button
                          onClick={() => handleWhatsAppContact(product)}
                          className="px-3 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                        >
                          WhatsApp
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Paginação */}
            {pagination.pages > 1 && (
              <div className="flex justify-center items-center space-x-2">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Anterior
                </button>
                
                {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                  const page = i + Math.max(1, pagination.page - 2);
                  if (page > pagination.pages) return null;
                  
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-2 border rounded-lg ${
                        page === pagination.page
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
                
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.pages}
                  className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Próxima
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
