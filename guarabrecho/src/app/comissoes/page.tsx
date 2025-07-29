'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  CurrencyDollarIcon,
  ChartBarIcon,
  InformationCircleIcon,
  CheckCircleIcon,
  ArrowLeftIcon,
} from '@heroicons/react/24/outline';
import { CommissionCalculator } from '@/components/CommissionCalculator';
import { getCommissionTable, formatCurrency } from '@/lib/commission';

export default function ComissoesPage() {
  const [selectedPrice, setSelectedPrice] = useState(100);
  const commissionTable = getCommissionTable();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Voltar ao início
          </Link>
          
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <CurrencyDollarIcon className="h-8 w-8 text-green-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Sistema de Comissões
              </h1>
              <p className="text-gray-600">
                Entenda como funcionam as taxas do GuaraBrechó
              </p>
            </div>
          </div>
        </div>

        {/* Como Funciona */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <InformationCircleIcon className="h-5 w-5 text-blue-600" />
            Como Funciona
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Taxas Aplicadas</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <CheckCircleIcon className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <div>
                    <span className="font-medium">10% de comissão</span>
                    <p className="text-sm text-gray-600">Taxa do GuaraBrechó sobre cada venda</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <CheckCircleIcon className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <div>
                    <span className="font-medium">~3% processamento</span>
                    <p className="text-sm text-gray-600">Taxa do meio de pagamento (Mercado Pago)</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <CheckCircleIcon className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <div>
                    <span className="font-medium">Mínimo R$ 2,00</span>
                    <p className="text-sm text-gray-600">Comissão mínima por venda</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Quando é Cobrado</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <CheckCircleIcon className="h-5 w-5 text-blue-600 flex-shrink-0" />
                  <span>Apenas quando você <strong>vende</strong> um produto</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <CheckCircleIcon className="h-5 w-5 text-blue-600 flex-shrink-0" />
                  <span>Não há taxas para <strong>anunciar</strong></span>
                </div>
                
                <div className="flex items-center gap-3">
                  <CheckCircleIcon className="h-5 w-5 text-blue-600 flex-shrink-0" />
                  <span>Recebimento em até <strong>48 horas</strong></span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Calculadora */}
        <div className="mb-8">
          <CommissionCalculator 
            initialPrice={selectedPrice}
            onCalculationChange={(calc) => console.log('Calculation:', calc)}
          />
        </div>

        {/* Tabela de Exemplos */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <ChartBarIcon className="h-5 w-5 text-blue-600" />
            Exemplos de Comissão
          </h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">
                    Preço de Venda
                  </th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-900">
                    Comissão (10%)
                  </th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-900">
                    Você Recebe
                  </th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-900">
                    Taxa Efetiva
                  </th>
                </tr>
              </thead>
              <tbody>
                {commissionTable.map((row, index) => (
                  <tr 
                    key={index} 
                    className={`border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                      row.priceRange === formatCurrency(selectedPrice) ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => setSelectedPrice(parseFloat(row.priceRange.replace(/[^\d,]/g, '').replace(',', '.')))}
                  >
                    <td className="py-3 px-4 font-medium text-gray-900">
                      {row.priceRange}
                    </td>
                    <td className="py-3 px-4 text-right text-red-600">
                      -{formatCurrency(row.commission)}
                    </td>
                    <td className="py-3 px-4 text-right font-semibold text-green-600">
                      {formatCurrency(row.sellerReceives)}
                    </td>
                    <td className="py-3 px-4 text-right text-gray-600">
                      {row.effectiveRate}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <p className="text-xs text-gray-500 mt-3">
            * Clique em uma linha para calcular detalhes
          </p>
        </div>

        {/* FAQ */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Perguntas Frequentes
          </h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Por que vocês cobram comissão?
              </h3>
              <p className="text-gray-600 text-sm">
                A comissão de 10% nos permite manter a plataforma funcionando, oferecer suporte, 
                melhorar recursos e garantir a segurança das transações.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Quando recebo o dinheiro da venda?
              </h3>
              <p className="text-gray-600 text-sm">
                O pagamento é processado automaticamente e você recebe em até 48 horas 
                após a confirmação da venda.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Posso negociar a comissão?
              </h3>
              <p className="text-gray-600 text-sm">
                A comissão é fixa em 10% para garantir transparência e igualdade entre todos os vendedores. 
                Grandes volumes podem ter condições especiais.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                E se a venda não se concretizar?
              </h3>
              <p className="text-gray-600 text-sm">
                Não cobramos nada se a venda não for finalizada. As taxas só são aplicadas 
                quando há transferência efetiva de dinheiro.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-8">
          <Link
            href="/anunciar"
            className="inline-flex items-center px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
          >
            <CurrencyDollarIcon className="h-5 w-5 mr-2" />
            Começar a Vender
          </Link>
        </div>
      </div>
    </div>
  );
}
