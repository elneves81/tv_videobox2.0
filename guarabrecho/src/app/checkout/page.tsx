'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, Suspense } from 'react';
import { 
  CreditCardIcon,
  LockClosedIcon,
  CheckCircleIcon 
} from '@heroicons/react/24/outline';

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [processing, setProcessing] = useState(false);
  
  const planId = searchParams.get('plan');
  const price = searchParams.get('price');

  const planNames = {
    premium: 'Premium',
    pro: 'Pro'
  };

  const planName = planNames[planId as keyof typeof planNames] || 'Premium';

  const handlePayment = async () => {
    setProcessing(true);
    
    // Simular processamento de pagamento
    setTimeout(() => {
      router.push('/checkout/success?plan=' + planId);
    }, 3000);
  };

  const formatPrice = (price: string | null) => {
    if (!price) return 'R$ 0,00';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(parseFloat(price));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Finalizar Assinatura
          </h1>
          <p className="text-gray-600">
            Você está assinando o plano <strong>{planName}</strong>
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Order Summary */}
          <div className="bg-gray-50 p-6 border-b">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Resumo do Pedido
            </h2>
            
            <div className="flex justify-between items-center">
              <div>
                <div className="font-medium text-gray-900">
                  Plano {planName}
                </div>
                <div className="text-sm text-gray-600">
                  Cobrança mensal
                </div>
              </div>
              <div className="text-xl font-bold text-gray-900">
                {formatPrice(price)}
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Informações de Pagamento
            </h3>

            <div className="space-y-6">
              {/* Payment Methods */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-3 block">
                  Forma de Pagamento
                </label>
                
                <div className="grid grid-cols-2 gap-4">
                  <button className="p-4 border-2 border-green-500 bg-green-50 rounded-lg text-center">
                    <CreditCardIcon className="h-6 w-6 mx-auto mb-2 text-green-600" />
                    <span className="text-sm font-medium text-green-900">Cartão</span>
                  </button>
                  
                  <button className="p-4 border-2 border-gray-200 rounded-lg text-center hover:border-gray-300">
                    <div className="h-6 w-6 mx-auto mb-2 bg-blue-500 rounded"></div>
                    <span className="text-sm font-medium text-gray-700">PIX</span>
                  </button>
                </div>
              </div>

              {/* Card Form */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Número do Cartão
                  </label>
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Validade
                    </label>
                    <input
                      type="text"
                      placeholder="MM/AA"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CVV
                    </label>
                    <input
                      type="text"
                      placeholder="123"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome no Cartão
                  </label>
                  <input
                    type="text"
                    placeholder="João Silva"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
              </div>

              {/* Security Notice */}
              <div className="flex items-center p-4 bg-blue-50 rounded-lg">
                <LockClosedIcon className="h-5 w-5 text-blue-600 mr-3" />
                <div className="text-sm text-blue-800">
                  <div className="font-medium">Pagamento 100% Seguro</div>
                  <div>Seus dados são protegidos com criptografia SSL</div>
                </div>
              </div>

              {/* Terms */}
              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="terms"
                  className="mt-1 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label htmlFor="terms" className="ml-3 text-sm text-gray-700">
                  Eu concordo com os{' '}
                  <a href="#" className="text-green-600 hover:text-green-500">
                    Termos de Uso
                  </a>{' '}
                  e{' '}
                  <a href="#" className="text-green-600 hover:text-green-500">
                    Política de Privacidade
                  </a>
                </label>
              </div>

              {/* Submit Button */}
              <button
                onClick={handlePayment}
                disabled={processing}
                className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-200 ${
                  processing
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700 shadow-lg hover:shadow-xl'
                } text-white`}
              >
                {processing ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Processando Pagamento...
                  </div>
                ) : (
                  `Pagar ${formatPrice(price)}`
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Support */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-600">
            Precisa de ajuda?{' '}
            <a href="#" className="text-green-600 hover:text-green-500">
              Entre em contato
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}
