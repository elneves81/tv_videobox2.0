'use client';

import { useState, useEffect } from 'react';
import { 
  SparklesIcon,
  StarIcon,
  TrophyIcon,
  CreditCardIcon,
  ClockIcon,
  FireIcon
} from '@heroicons/react/24/outline';

interface HighlightOption {
  type: string;
  name: string;
  price: number;
  duration: number;
  description: string;
}

interface HighlightPurchaseProps {
  productId: string;
  productTitle: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

interface HighlightPurchaseModalProps {
  product: {
    id: string;
    title: string;
  };
  onClose: () => void;
  onSuccess: () => void;
}

export default function HighlightPurchaseForm({ 
  productId, 
  productTitle, 
  onSuccess, 
  onCancel 
}: HighlightPurchaseProps) {
  const [options, setOptions] = useState<HighlightOption[]>([]);
  const [selectedType, setSelectedType] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [canHighlight, setCanHighlight] = useState(true);

  useEffect(() => {
    fetchHighlightOptions();
  }, []);

  const fetchHighlightOptions = async () => {
    try {
      const response = await fetch('/api/highlights');
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Erro ao carregar opções');
      }

      setCanHighlight(data.canHighlight);
      setOptions(data.highlightOptions || []);
      if (data.highlightOptions?.length > 0) {
        setSelectedType(data.highlightOptions[0].type);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      setCanHighlight(false);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async () => {
    if (!selectedType) return;

    setPurchasing(true);
    try {
      const response = await fetch('/api/highlights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          productId,
          highlightType: selectedType,
          userEmail: 'user@example.com',
          userName: 'Usuário Teste'
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Erro ao processar compra');
      }

      // Redirect to Mercado Pago checkout
      window.location.href = data.checkoutUrl;
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao processar compra');
    } finally {
      setPurchasing(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'BASIC':
        return StarIcon;
      case 'PREMIUM':
        return SparklesIcon;
      case 'GOLD':
        return TrophyIcon;
      default:
        return StarIcon;
    }
  };

  const getColorClass = (type: string) => {
    switch (type) {
      case 'BASIC':
        return 'border-yellow-500 bg-yellow-50';
      case 'PREMIUM':
        return 'border-green-500 bg-green-50';
      case 'GOLD':
        return 'border-amber-500 bg-amber-50';
      default:
        return 'border-gray-300 bg-gray-50';
    }
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case 'BASIC':
        return 'text-yellow-600';
      case 'PREMIUM':
        return 'text-green-600';
      case 'GOLD':
        return 'text-amber-600';
      default:
        return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-16 bg-gray-200 rounded"></div>
            <div className="h-16 bg-gray-200 rounded"></div>
            <div className="h-16 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!canHighlight || error) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="text-center">
          <SparklesIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Destaque Indisponível
          </h3>
          <p className="text-gray-600 mb-4">
            {error || 'Recurso de destaque não disponível no seu plano atual.'}
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={onCancel}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Fechar
            </button>
            <a
              href="/planos"
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Ver Planos
            </a>
          </div>
        </div>
      </div>
    );
  }

  const selectedOption = options.find(opt => opt.type === selectedType);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
      {/* Header */}
      <div className="text-center mb-6">
        <FireIcon className="h-12 w-12 text-orange-500 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          Destacar Produto
        </h2>
        <p className="text-gray-600 text-sm">
          {productTitle}
        </p>
      </div>

      {/* Options */}
      <div className="space-y-3 mb-6">
        {options.map((option) => {
          const IconComponent = getIcon(option.type);
          const isSelected = selectedType === option.type;
          
          return (
            <button
              key={option.type}
              onClick={() => setSelectedType(option.type)}
              className={`w-full p-4 border-2 rounded-lg transition-all ${
                isSelected 
                  ? getColorClass(option.type)
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <IconComponent className={`h-6 w-6 mr-3 ${
                    isSelected ? getIconColor(option.type) : 'text-gray-400'
                  }`} />
                  <div className="text-left">
                    <div className="font-semibold text-gray-900">
                      {option.name}
                    </div>
                    <div className="text-sm text-gray-600 flex items-center">
                      <ClockIcon className="h-4 w-4 mr-1" />
                      {option.duration} dias
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-gray-900">
                    {formatPrice(option.price)}
                  </div>
                </div>
              </div>
              <div className="text-xs text-gray-500 mt-2 text-left">
                {option.description}
              </div>
            </button>
          );
        })}
      </div>

      {/* Summary */}
      {selectedOption && (
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-700">Destaque {selectedOption.name}</span>
            <span className="font-semibold">{formatPrice(selectedOption.price)}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Duração</span>
            <span className="text-gray-600">{selectedOption.duration} dias</span>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={onCancel}
          className="flex-1 px-4 py-3 text-gray-600 hover:text-gray-800 transition-colors"
          disabled={purchasing}
        >
          Cancelar
        </button>
        <button
          onClick={handlePurchase}
          disabled={!selectedType || purchasing}
          className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-all ${
            !selectedType || purchasing
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl'
          }`}
        >
          {purchasing ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Processando...
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <CreditCardIcon className="h-4 w-4 mr-2" />
              Comprar Destaque
            </div>
          )}
        </button>
      </div>

      {/* Info */}
      <div className="mt-4 text-xs text-gray-500 text-center">
        Seu produto aparecerá em destaque nas buscas e na página inicial
      </div>
    </div>
  );
}

// Componente alternativo para uso com modal
export function HighlightPurchase({ product, onClose, onSuccess }: HighlightPurchaseModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4">
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Destacar Produto: {product.title}
          </h3>
          <div className="mb-6">
            <HighlightPurchaseForm
              productId={product.id}
              productTitle={product.title}
              onSuccess={() => {
                onSuccess();
                onClose();
              }}
              onCancel={onClose}
            />
          </div>
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
