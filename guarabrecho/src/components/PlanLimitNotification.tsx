'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  ExclamationTriangleIcon,
  SparklesIcon,
  ArrowUpIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

interface PlanLimitProps {
  type: 'listings' | 'images' | 'highlight' | 'analytics';
  current?: number;
  limit?: number;
  isBlocked: boolean;
  reason: string;
  suggestedPlan?: string;
  suggestedPrice?: number;
  benefits?: string[];
  onDismiss?: () => void;
}

interface PlanLimitNotificationProps {
  message: string;
  suggestions: string[];
  onClose: () => void;
}

export default function PlanLimitNotificationDetailed({
  type,
  current,
  limit,
  isBlocked,
  reason,
  suggestedPlan,
  suggestedPrice,
  benefits = [],
  onDismiss
}: PlanLimitProps) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const handleDismiss = () => {
    setDismissed(true);
    onDismiss?.();
  };

  const typeLabels = {
    listings: 'Anúncios',
    images: 'Imagens',
    highlight: 'Destaque',
    analytics: 'Analytics'
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  if (!isBlocked) {
    // Warning when approaching limit
    const percentage = current && limit && limit > 0 ? (current / limit) * 100 : 0;
    
    if (percentage >= 80) {
      return (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
          <div className="flex items-start">
            <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-sm font-medium text-yellow-800 mb-1">
                Limite de {typeLabels[type]} Próximo
              </h3>
              <p className="text-sm text-yellow-700 mb-2">
                Você está usando {current} de {limit} {typeLabels[type].toLowerCase()} disponíveis.
              </p>
              {suggestedPlan && (
                <Link 
                  href="/planos"
                  className="inline-flex items-center text-sm font-medium text-yellow-800 hover:text-yellow-900"
                >
                  <ArrowUpIcon className="h-4 w-4 mr-1" />
                  Upgrade para {suggestedPlan}
                </Link>
              )}
            </div>
            <button 
              onClick={handleDismiss}
              className="text-yellow-600 hover:text-yellow-800"
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      );
    }
    return null;
  }

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
      <div className="flex items-start">
        <ExclamationTriangleIcon className="h-6 w-6 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-red-800 mb-2">
            Limite Atingido
          </h3>
          <p className="text-red-700 mb-4">
            {reason}
          </p>

          {current !== undefined && limit !== undefined && limit > 0 && (
            <div className="mb-4">
              <div className="flex justify-between text-sm text-red-700 mb-1">
                <span>Usado: {current} de {limit}</span>
                <span>{Math.round((current / limit) * 100)}%</span>
              </div>
              <div className="w-full bg-red-200 rounded-full h-2">
                <div 
                  className="bg-red-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min((current / limit) * 100, 100)}%` }}
                />
              </div>
            </div>
          )}

          {suggestedPlan && (
            <div className="bg-white rounded-lg p-4 border border-red-200">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-gray-900 flex items-center">
                  <SparklesIcon className="h-5 w-5 text-green-600 mr-2" />
                  Upgrade para {suggestedPlan}
                </h4>
                {suggestedPrice && (
                  <span className="text-lg font-bold text-green-600">
                    {formatPrice(suggestedPrice)}/mês
                  </span>
                )}
              </div>
              
              {benefits.length > 0 && (
                <ul className="space-y-1 mb-4">
                  {benefits.map((benefit, index) => (
                    <li key={index} className="text-sm text-gray-700 flex items-center">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2 flex-shrink-0" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              )}

              <div className="flex gap-3">
                <Link 
                  href="/planos"
                  className="flex-1 bg-green-600 text-white text-center py-2 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  Ver Planos
                </Link>
                <button 
                  onClick={handleDismiss}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Agora não
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Componente alternativo para uso simplificado
export function PlanLimitNotification({ message, suggestions, onClose }: PlanLimitNotificationProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="p-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <ExclamationTriangleIcon className="h-6 w-6 text-yellow-400" />
            </div>
            <div className="ml-3 w-0 flex-1">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Limite do Plano
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                {message}
              </p>
              {suggestions.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Sugestões:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {suggestions.map((suggestion, index) => (
                      <li key={index} className="flex items-start">
                        <span className="mr-2">•</span>
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="flex space-x-3">
                <Link
                  href="/planos"
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors text-center"
                >
                  Ver Planos
                </Link>
                <button
                  onClick={onClose}
                  className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors"
                >
                  Fechar
                </button>
              </div>
            </div>
            <div className="ml-4">
              <button
                onClick={onClose}
                className="bg-white rounded-md text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
