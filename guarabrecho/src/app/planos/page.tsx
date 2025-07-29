'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { 
  CheckIcon, 
  XMarkIcon,
  SparklesIcon,
  RocketLaunchIcon,
  CreditCardIcon
} from '@heroicons/react/24/outline';

interface Plan {
  id: string;
  name: string;
  displayName: string;
  price: number;
  popular?: boolean;
  features: string[];
  limits: {
    maxListings: number;
    maxImages: number;
    canHighlight: boolean;
    hasAnalytics: boolean;
    priority: number;
  };
}

const plans: Plan[] = [
  {
    id: 'free',
    name: 'FREE',
    displayName: 'Gratuito',
    price: 0,
    features: [
      'Até 3 anúncios ativos',
      'Até 3 fotos por produto',
      'Suporte por email',
      'Acesso básico à plataforma'
    ],
    limits: {
      maxListings: 3,
      maxImages: 3,
      canHighlight: false,
      hasAnalytics: false,
      priority: 0
    }
  },
  {
    id: 'premium',
    name: 'PREMIUM',
    displayName: 'Premium',
    price: 19.90,
    popular: true,
    features: [
      'Até 15 anúncios ativos',
      'Até 10 fotos por produto',
      'Destaque ⭐ nos anúncios',
      'Analytics básico',
      'Suporte prioritário',
      'Badge "Vendedor Premium"'
    ],
    limits: {
      maxListings: 15,
      maxImages: 10,
      canHighlight: true,
      hasAnalytics: true,
      priority: 1
    }
  },
  {
    id: 'pro',
    name: 'PRO',
    displayName: 'Pro',
    price: 39.90,
    features: [
      'Anúncios ILIMITADOS',
      'Fotos ilimitadas',
      'Destaque OURO 🏆',
      'Analytics avançado',
      'Aparece primeiro nas buscas',
      'Suporte por WhatsApp',
      'Badge "Vendedor Verificado"',
      'Relatórios detalhados'
    ],
    limits: {
      maxListings: -1, // Ilimitado
      maxImages: -1,   // Ilimitado
      canHighlight: true,
      hasAnalytics: true,
      priority: 2
    }
  }
];

export default function PlansPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [currentPlan, setCurrentPlan] = useState('free'); // TODO: Buscar do backend

  const handleSelectPlan = async (planId: string) => {
    if (!session) {
      router.push('/auth/signin?callbackUrl=/planos');
      return;
    }

    if (planId === 'free') {
      // Downgrade para gratuito
      // TODO: Implementar cancelamento
      return;
    }

    setLoading(planId);
    try {
      // TODO: Integrar com Stripe/Mercado Pago
      const response = await fetch('/api/subscriptions/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ planId })
      });

      if (response.ok) {
        const { checkoutUrl } = await response.json();
        window.location.href = checkoutUrl;
      } else {
        throw new Error('Erro ao criar assinatura');
      }
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao processar pagamento. Tente novamente.');
    } finally {
      setLoading(null);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Escolha seu Plano
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Potencialize suas vendas com recursos premium e destaque seus produtos para mais compradores
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-white rounded-2xl shadow-lg overflow-hidden ${
                plan.popular 
                  ? 'ring-2 ring-green-500 transform scale-105' 
                  : 'border border-gray-200'
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <span className="bg-green-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Mais Popular
                  </span>
                </div>
              )}

              <div className="p-8">
                {/* Plan Icon */}
                <div className="text-center mb-6">
                  {plan.id === 'free' && (
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckIcon className="h-8 w-8 text-gray-600" />
                    </div>
                  )}
                  {plan.id === 'premium' && (
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <SparklesIcon className="h-8 w-8 text-green-600" />
                    </div>
                  )}
                  {plan.id === 'pro' && (
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <RocketLaunchIcon className="h-8 w-8 text-blue-600" />
                    </div>
                  )}
                  
                  <h3 className="text-2xl font-bold text-gray-900">
                    {plan.displayName}
                  </h3>
                </div>

                {/* Price */}
                <div className="text-center mb-8">
                  {plan.price === 0 ? (
                    <div className="text-3xl font-bold text-gray-900">Grátis</div>
                  ) : (
                    <>
                      <div className="text-4xl font-bold text-gray-900">
                        {formatPrice(plan.price)}
                      </div>
                      <div className="text-gray-600">por mês</div>
                    </>
                  )}
                </div>

                {/* Features */}
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <CheckIcon className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <button
                  onClick={() => handleSelectPlan(plan.id)}
                  disabled={loading === plan.id || currentPlan === plan.id}
                  className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-200 ${
                    currentPlan === plan.id
                      ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                      : plan.popular
                        ? 'bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl'
                        : 'bg-gray-900 hover:bg-gray-800 text-white'
                  } ${loading === plan.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {loading === plan.id ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Processando...
                    </div>
                  ) : currentPlan === plan.id ? (
                    'Plano Atual'
                  ) : plan.price === 0 ? (
                    'Começar Grátis'
                  ) : (
                    `Assinar ${plan.displayName}`
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-16 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Dúvidas Frequentes
          </h2>
          
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-2">
                Posso cancelar a qualquer momento?
              </h3>
              <p className="text-gray-700">
                Sim! Você pode cancelar sua assinatura a qualquer momento. 
                Seus recursos premium continuarão ativos até o final do período pago.
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-2">
                Como funciona o destaque dos produtos?
              </h3>
              <p className="text-gray-700">
                Produtos destacados aparecem no topo das buscas e na homepage, 
                aumentando significativamente a visibilidade e as chances de venda.
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-2">
                Aceita quais formas de pagamento?
              </h3>
              <p className="text-gray-700">
                Aceitamos cartão de crédito, débito, PIX e boleto bancário. 
                Pagamentos processados com segurança pelo Mercado Pago.
              </p>
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-12 text-center">
          <div className="flex items-center justify-center gap-8 text-gray-500">
            <div className="flex items-center">
              <CreditCardIcon className="h-5 w-5 mr-2" />
              <span className="text-sm">Pagamento Seguro</span>
            </div>
            <div className="flex items-center">
              <CheckIcon className="h-5 w-5 mr-2" />
              <span className="text-sm">Cancele a Qualquer Momento</span>
            </div>
            <div className="flex items-center">
              <SparklesIcon className="h-5 w-5 mr-2" />
              <span className="text-sm">Suporte Dedicado</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
