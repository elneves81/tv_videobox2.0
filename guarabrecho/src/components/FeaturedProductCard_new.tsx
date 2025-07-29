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

interface FeaturedProductCardProps {
  product: Product;
}

export default function FeaturedProductCard({ product }: FeaturedProductCardProps) {
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

  const transactionBadge = getTransactionBadge(product.type);

  return (
    <Link href={`/produtos/${product.id}`}>
      <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer h-full border border-gray-200 hover:border-gray-300">
        {/* Image */}
        <div className="relative h-56 bg-gray-100">
          <SafeImage
            src={product.images}
            alt={product.title}
            className="h-full w-full object-cover"
            fallbackIcon={
              <div className="flex items-center justify-center h-full w-full bg-gray-100">
                <span className="text-gray-400 text-sm">Sem imagem</span>
              </div>
            }
          />
          
          {/* Transaction Badge */}
          <div className="absolute top-3 left-3">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${transactionBadge.bg} ${transactionBadge.text} shadow-sm`}>
              {transactionBadge.label}
            </span>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-5">
          {/* Price - Prominent like car dealerships */}
          {product.type === 'VENDA' && product.price > 0 && (
            <div className="mb-3">
              <span className="text-2xl font-bold text-gray-900">
                {formatPrice(product.price)}
              </span>
            </div>
          )}
          
          {/* Title */}
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 mb-3 min-h-[3.5rem]">
            {product.title}
          </h3>
          
          {/* Details */}
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center">
              <MapPinIcon className="w-4 h-4 mr-2 flex-shrink-0 text-gray-400" />
              <span className="truncate">{product.neighborhood}</span>
            </div>
            <div className="flex items-center">
              <TagIcon className="w-4 h-4 mr-2 flex-shrink-0 text-gray-400" />
              <span className="truncate">{product.category.name}</span>
            </div>
          </div>
          
          {/* Action hint */}
          <div className="mt-4 pt-3 border-t border-gray-100">
            <span className="text-xs text-gray-500">Clique para ver detalhes</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
