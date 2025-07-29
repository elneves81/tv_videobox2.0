'use client';

import Link from 'next/link';
import { SafeImage } from '@/lib/safe-image';
import { MapPinIcon, TagIcon } from '@heroicons/react/24/outline';

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
  };
  neighborhood: string;
  images: string;
  user: {
    id: string;
    name: string;
  };
  createdAt: string;
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const getTransactionBadge = (type: string) => {
    const badges = {
      'VENDA': { bg: 'bg-green-100', text: 'text-green-800', label: 'Venda' },
      'TROCA': { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Troca' },
      'DOACAO': { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Doação' }
    };
    return badges[type as keyof typeof badges] || { bg: 'bg-gray-100', text: 'text-gray-800', label: type };
  };

  const getConditionBadge = (condition: string) => {
    const badges = {
      'NOVO': { bg: 'bg-green-100', text: 'text-green-800', label: 'Novo' },
      'SEMINOVO': { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Seminovo' },
      'USADO': { bg: 'bg-orange-100', text: 'text-orange-800', label: 'Usado' }
    };
    return badges[condition as keyof typeof badges] || { bg: 'bg-gray-100', text: 'text-gray-800', label: condition };
  };

  const transactionBadge = getTransactionBadge(product.type);
  const conditionBadge = getConditionBadge(product.condition);

  return (
    <Link href={`/produtos/${product.id}`}>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
        {/* Image */}
        <div className="relative h-48 bg-gray-100 overflow-hidden">
          <SafeImage
            src={product.images}
            alt={product.title}
            className="h-full w-full object-cover product-card-image"
            fallbackIcon={
              <div className="flex items-center justify-center h-full w-full bg-gray-100">
                <div className="text-center">
                  <TagIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <span className="text-gray-400 text-sm">Sem imagem</span>
                </div>
              </div>
            }
          />
          
          {/* Badges */}
          <div className="absolute top-2 left-2 flex gap-1">
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${transactionBadge.bg} ${transactionBadge.text}`}>
              {transactionBadge.label}
            </span>
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${conditionBadge.bg} ${conditionBadge.text}`}>
              {conditionBadge.label}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
            {product.title}
          </h3>
          
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {product.description}
          </p>

          {/* Price */}
          {product.type !== 'DOACAO' && (
            <p className="text-lg font-bold text-green-600 mb-2">
              {formatPrice(product.price)}
            </p>
          )}

          {/* Location and Category */}
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <MapPinIcon className="h-4 w-4" />
            <span>{product.neighborhood}</span>
            <span>•</span>
            <span>{product.category.name}</span>
          </div>

          {/* Date */}
          <p className="text-xs text-gray-400">
            {new Date(product.createdAt).toLocaleDateString('pt-BR')}
          </p>
        </div>
      </div>
    </Link>
  );
}
