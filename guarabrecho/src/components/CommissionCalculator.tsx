'use client';

import { useState, useEffect } from 'react';
import { 
  CurrencyDollarIcon,
  InformationCircleIcon,
  ChartBarIcon 
} from '@heroicons/react/24/outline';
import { 
  calculateCommission, 
  formatCurrency, 
  getCommissionBreakdown,
  validateSalePrice,
  type CommissionCalculation 
} from '@/lib/commission';

interface CommissionCalculatorProps {
  initialPrice?: number;
  onCalculationChange?: (calculation: CommissionCalculation) => void;
  showDetailed?: boolean;
}

export function CommissionCalculator({ 
  initialPrice = 0, 
  onCalculationChange,
  showDetailed = true 
}: CommissionCalculatorProps) {
  const [price, setPrice] = useState(initialPrice);
  const [calculation, setCalculation] = useState<CommissionCalculation | null>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (price > 0) {
      const validation = validateSalePrice(price);
      
      if (!validation.valid) {
        setError(validation.message || 'Preço inválido');
        setCalculation(null);
        return;
      }

      try {
        const calc = calculateCommission(price);
        setCalculation(calc);
        setError('');
        onCalculationChange?.(calc);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro no cálculo');
        setCalculation(null);
      }
    } else {
      setCalculation(null);
      setError('');
    }
  }, [price, onCalculationChange]);

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    setPrice(value);
  };

  const { breakdown } = calculation ? getCommissionBreakdown(calculation.salePrice) : { breakdown: [] };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <CurrencyDollarIcon className="h-5 w-5 text-green-600" />
        <h3 className="text-lg font-semibold text-gray-900">
          Calculadora de Comissão
        </h3>
      </div>

      {/* Input de Preço */}
      <div className="mb-6">
        <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
          Preço de Venda
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
            R$
          </span>
          <input
            type="number"
            id="price"
            value={price || ''}
            onChange={handlePriceChange}
            placeholder="0,00"
            min="0"
            step="0.01"
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
        {error && (
          <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
            <InformationCircleIcon className="h-4 w-4" />
            {error}
          </p>
        )}
      </div>

      {/* Resumo Rápido */}
      {calculation && (
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-sm text-green-600 font-medium">Você Recebe</div>
            <div className="text-2xl font-bold text-green-700">
              {formatCurrency(calculation.sellerAmount)}
            </div>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-sm text-blue-600 font-medium">Comissão (10%)</div>
            <div className="text-2xl font-bold text-blue-700">
              {formatCurrency(calculation.platformCommission)}
            </div>
          </div>
        </div>
      )}

      {/* Breakdown Detalhado */}
      {showDetailed && calculation && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-3">
            <ChartBarIcon className="h-4 w-4 text-gray-600" />
            <h4 className="text-sm font-semibold text-gray-900">Breakdown Detalhado</h4>
          </div>
          
          {breakdown.map((item, index) => (
            <div 
              key={index} 
              className={`flex justify-between items-center py-2 px-3 rounded ${
                index === 0 ? 'bg-gray-50' : 
                index === breakdown.length - 1 ? 'bg-green-50 border border-green-200' : 
                'bg-red-50'
              }`}
            >
              <span className={`text-sm ${
                index === 0 ? 'font-semibold text-gray-900' :
                index === breakdown.length - 1 ? 'font-semibold text-green-700' :
                'text-red-700'
              }`}>
                {item.label}
              </span>
              <div className="text-right">
                <span className={`font-semibold ${
                  index === 0 ? 'text-gray-900' :
                  index === breakdown.length - 1 ? 'text-green-700' :
                  'text-red-700'
                }`}>
                  {formatCurrency(Math.abs(item.amount))}
                </span>
                <span className="text-xs text-gray-500 ml-2">
                  ({item.percentage.toFixed(1)}%)
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Informações Extras */}
      {calculation && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-start gap-2">
            <InformationCircleIcon className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">Como funciona:</p>
              <ul className="space-y-1 text-xs">
                <li>• <strong>10%</strong> de comissão do GuaraBrechó sobre o valor da venda</li>
                <li>• <strong>~3%</strong> de taxa de processamento do pagamento</li>
                <li>• Comissão mínima de <strong>R$ 2,00</strong> por venda</li>
                <li>• Você recebe o pagamento em até 48h após a venda</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Componente menor para exibir apenas o resumo
export function CommissionSummary({ price }: { price: number }) {
  if (price <= 0) return null;

  const calculation = calculateCommission(price);

  return (
    <div className="bg-gray-50 p-3 rounded-lg text-sm">
      <div className="flex justify-between items-center mb-2">
        <span className="text-gray-600">Preço:</span>
        <span className="font-semibold">{formatCurrency(price)}</span>
      </div>
      <div className="flex justify-between items-center mb-2">
        <span className="text-gray-600">Comissão (10%):</span>
        <span className="text-red-600">-{formatCurrency(calculation.platformCommission)}</span>
      </div>
      <div className="flex justify-between items-center mb-2">
        <span className="text-gray-600">Taxa processamento:</span>
        <span className="text-red-600">-{formatCurrency(calculation.paymentProcessingFee)}</span>
      </div>
      <div className="border-t pt-2 flex justify-between items-center">
        <span className="font-semibold text-gray-900">Você recebe:</span>
        <span className="font-bold text-green-600">{formatCurrency(calculation.sellerAmount)}</span>
      </div>
    </div>
  );
}
