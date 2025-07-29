'use client';

import { useState } from 'react';
import { MagnifyingGlassIcon, FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { AdvancedSearchFilters, Category } from '@/types';

interface AdvancedSearchProps {
  onSearch: (filters: AdvancedSearchFilters) => void;
  categories: Category[];
  initialFilters?: AdvancedSearchFilters;
}

export default function AdvancedSearch({ onSearch, categories, initialFilters = {} }: AdvancedSearchProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<AdvancedSearchFilters>({
    search: '',
    category: '',
    type: '',
    condition: '',
    neighborhood: '',
    priceMin: undefined,
    priceMax: undefined,
    dateFrom: '',
    dateTo: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
    ...initialFilters
  });

  const handleFilterChange = (key: keyof AdvancedSearchFilters, value: string | number | undefined) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleSearch = () => {
    const cleanFilters: AdvancedSearchFilters = {};
    
    // Remove campos vazios
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== '' && value !== undefined && value !== null) {
        (cleanFilters as any)[key] = value;
      }
    });
    
    onSearch(cleanFilters);
  };

  const clearFilters = () => {
    const resetFilters: AdvancedSearchFilters = {
      search: '',
      category: '',
      type: '',
      condition: '',
      neighborhood: '',
      priceMin: undefined,
      priceMax: undefined,
      dateFrom: '',
      dateTo: '',
      sortBy: 'createdAt',
      sortOrder: 'desc'
    };
    setFilters(resetFilters);
    onSearch({});
  };

  const activeFiltersCount = Object.values(filters).filter(v => 
    v && v !== '' && v !== 'createdAt' && v !== 'desc'
  ).length;

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <FunnelIcon className="h-5 w-5" />
          Busca Avançada
          {activeFiltersCount > 0 && (
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
              {activeFiltersCount}
            </span>
          )}
        </h3>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="text-gray-500 hover:text-gray-700"
        >
          {showFilters ? <XMarkIcon className="h-5 w-5" /> : <FunnelIcon className="h-5 w-5" />}
        </button>
      </div>

      {/* Busca por termo */}
      <div className="mb-4">
        <div className="relative">
          <MagnifyingGlassIcon className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Digite o que você procura..."
            value={filters.search || ''}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {showFilters && (
        <div className="space-y-4">
          {/* Linha 1: Categoria e Tipo */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Categoria
              </label>
              <select
                value={filters.category || ''}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Todas as categorias</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.slug}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Transação
              </label>
              <select
                value={filters.type || ''}
                onChange={(e) => handleFilterChange('type', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Todos os tipos</option>
                <option value="VENDA">Venda</option>
                <option value="TROCA">Troca</option>
                <option value="DOACAO">Doação</option>
              </select>
            </div>
          </div>

          {/* Linha 2: Condição e Bairro */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Condição
              </label>
              <select
                value={filters.condition || ''}
                onChange={(e) => handleFilterChange('condition', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Todas as condições</option>
                <option value="NOVO">Novo</option>
                <option value="SEMI_NOVO">Semi-novo</option>
                <option value="USADO">Usado</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bairro
              </label>
              <input
                type="text"
                placeholder="Digite o bairro..."
                value={filters.neighborhood || ''}
                onChange={(e) => handleFilterChange('neighborhood', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Linha 3: Preço */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Faixa de Preço (R$)
            </label>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="number"
                placeholder="Preço mínimo"
                value={filters.priceMin || ''}
                onChange={(e) => handleFilterChange('priceMin', e.target.value ? Number(e.target.value) : undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="0"
                step="0.01"
              />
              <input
                type="number"
                placeholder="Preço máximo"
                value={filters.priceMax || ''}
                onChange={(e) => handleFilterChange('priceMax', e.target.value ? Number(e.target.value) : undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="0"
                step="0.01"
              />
            </div>
          </div>

          {/* Linha 4: Data */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Período de Publicação
            </label>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="date"
                value={filters.dateFrom || ''}
                onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="date"
                value={filters.dateTo || ''}
                onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Linha 5: Ordenação */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ordenar por
              </label>
              <select
                value={filters.sortBy || 'createdAt'}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="createdAt">Data de publicação</option>
                <option value="price">Preço</option>
                <option value="title">Nome do produto</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ordem
              </label>
              <select
                value={filters.sortOrder || 'desc'}
                onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="desc">Decrescente</option>
                <option value="asc">Crescente</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Botões */}
      <div className="flex gap-3 mt-6">
        <button
          onClick={handleSearch}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Buscar Produtos
        </button>
        {activeFiltersCount > 0 && (
          <button
            onClick={clearFilters}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Limpar
          </button>
        )}
      </div>
    </div>
  );
}
