'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, Suspense } from 'react';
import { 
  CheckCircleIcon,
  SparklesIcon,
  RocketLaunchIcon 
} from '@heroicons/react/24/outline';

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const planId = searchParams.get('plan');

  const planInfo = {
    premium: {
      name: 'Premium',
      icon: SparklesIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      features: [
        'Até 15 anúncios ativos',
        'Até 10 fotos por produto', 
        'Destaque nos anúncios',
        'Analytics básico',
        'Suporte prioritário'
      ]
    },
    pro: {
      name: 'Pro',
      icon: RocketLaunchIcon,
      color: 'text-blue-600', 
      bgColor: 'bg-blue-100',
      features: [
        'Anúncios ilimitados',
        'Fotos ilimitadas',
        'Destaque OURO',
        'Analytics avançado',
        'Prioridade nas buscas'
      ]
    }
  };

  const plan = planInfo[planId as keyof typeof planInfo] || planInfo.premium;
  const IconComponent = plan.icon;

  useEffect(() => {
    // Simulate updating user subscription status
    // TODO: Call API to update user subscription
    console.log('Subscription activated for plan:', planId);
  }, [planId]);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Success Message */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircleIcon className="h-12 w-12 text-green-600" />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Pagamento Aprovado!
          </h1>
          <p className="text-xl text-gray-600">
            Seu plano <strong>{plan.name}</strong> foi ativado com sucesso
          </p>
        </div>

        {/* Plan Activated Card */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="p-8 text-center">
            <div className={`w-16 h-16 ${plan.bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}>
              <IconComponent className={`h-8 w-8 ${plan.color}`} />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Plano {plan.name} Ativo
            </h2>
            
            <p className="text-gray-600 mb-6">
              Agora você tem acesso a todos os recursos premium!
            </p>

            {/* Features List */}
            <div className="text-left max-w-md mx-auto">
              <h3 className="font-semibold text-gray-900 mb-4">
                Seus novos recursos:
              </h3>
              <ul className="space-y-3">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Próximos Passos
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center p-4 bg-blue-50 rounded-lg">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-4">
                1
              </div>
              <div>
                <div className="font-medium text-gray-900">
                  Atualize seus anúncios
                </div>
                <div className="text-sm text-gray-600">
                  Adicione mais fotos e destaque seus produtos
                </div>
              </div>
            </div>
            
            <div className="flex items-center p-4 bg-green-50 rounded-lg">
              <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-4">
                2
              </div>
              <div>
                <div className="font-medium text-gray-900">
                  Explore o dashboard
                </div>
                <div className="text-sm text-gray-600">
                  Acompanhe suas vendas e analytics
                </div>
              </div>
            </div>
            
            <div className="flex items-center p-4 bg-purple-50 rounded-lg">
              <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-4">
                3
              </div>
              <div>
                <div className="font-medium text-gray-900">
                  Aproveite o destaque
                </div>
                <div className="text-sm text-gray-600">
                  Seus anúncios aparecem primeiro nas buscas
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => router.push('/dashboard')}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Ir para Dashboard
          </button>
          
          <button
            onClick={() => router.push('/anunciar')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Criar Novo Anúncio
          </button>
        </div>

        {/* Support */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-600">
            Dúvidas sobre seu plano?{' '}
            <a href="#" className="text-green-600 hover:text-green-500">
              Entre em contato
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    }>
      <CheckoutSuccessContent />
    </Suspense>
  );
}
