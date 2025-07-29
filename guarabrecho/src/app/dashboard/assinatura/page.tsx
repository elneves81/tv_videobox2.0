'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  CreditCardIcon,
  CalendarIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowUpIcon,
  ChartBarIcon,
  SparklesIcon,
  TrophyIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

interface Subscription {
  id: string;
  planName: string;
  status: 'ACTIVE' | 'PENDING' | 'CANCELLED' | 'EXPIRED';
  amount: number;
  currency: string;
  startDate: string;
  endDate: string;
  renewsAt?: string;
  lastPaymentAt?: string;
  nextPaymentAt?: string;
}

interface UserPlan {
  currentPlan: 'FREE' | 'PREMIUM' | 'PRO';
  planExpiresAt?: string;
  isExpired: boolean;
  daysUntilExpiry?: number;
}

export default function SubscriptionDashboard() {
  const [userPlan, setUserPlan] = useState<UserPlan | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSubscriptionData();
  }, []);

  const fetchSubscriptionData = async () => {
    try {
      // TODO: Replace with real API calls
      // const response = await fetch('/api/user/subscription');
      // const data = await response.json();
      
      // Mock data for demonstration
      const mockData = {
        userPlan: {
          currentPlan: 'PREMIUM' as const,
          planExpiresAt: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(),
          isExpired: false,
          daysUntilExpiry: 25
        },
        subscription: {
          id: 'sub_123456',
          planName: 'PREMIUM',
          status: 'ACTIVE' as const,
          amount: 19.90,
          currency: 'BRL',
          startDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          endDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(),
          lastPaymentAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          nextPaymentAt: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString()
        }
      };

      setUserPlan(mockData.userPlan);
      setSubscription(mockData.subscription);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('pt-BR');
  };

  const getPlanIcon = (plan: string) => {
    switch (plan) {
      case 'PREMIUM':
        return SparklesIcon;
      case 'PRO':
        return TrophyIcon;
      default:
        return CheckCircleIcon;
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'PREMIUM':
        return 'text-green-600 bg-green-100';
      case 'PRO':
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'text-green-600 bg-green-100';
      case 'PENDING':
        return 'text-yellow-600 bg-yellow-100';
      case 'CANCELLED':
      case 'EXPIRED':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'Ativo';
      case 'PENDING':
        return 'Pendente';
      case 'CANCELLED':
        return 'Cancelado';
      case 'EXPIRED':
        return 'Expirado';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Minha Assinatura</h1>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center">
          <ExclamationTriangleIcon className="h-6 w-6 text-red-600 mr-3" />
          <div>
            <h3 className="font-medium text-red-800">Erro ao Carregar</h3>
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!userPlan) return null;

  const PlanIcon = getPlanIcon(userPlan.currentPlan);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
          <CreditCardIcon className="h-8 w-8 mr-3 text-blue-600" />
          Minha Assinatura
        </h1>
        
        <Link 
          href="/planos"
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
        >
          <ArrowUpIcon className="h-4 w-4 mr-2" />
          Alterar Plano
        </Link>
      </div>

      {/* Current Plan */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-green-500 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="p-3 bg-white/20 rounded-lg mr-4">
                <PlanIcon className="h-8 w-8" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">
                  Plano {userPlan.currentPlan}
                </h2>
                <p className="text-blue-100">
                  {userPlan.currentPlan === 'FREE' 
                    ? 'Plano gratuito' 
                    : 'Assinatura ativa'}
                </p>
              </div>
            </div>
            
            {subscription && (
              <div className="text-right">
                <div className="text-3xl font-bold">
                  {formatPrice(subscription.amount)}
                </div>
                <div className="text-blue-100">por mês</div>
              </div>
            )}
          </div>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Plan Details */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Recursos do Plano</h3>
              <ul className="space-y-2">
                {userPlan.currentPlan === 'FREE' && (
                  <>
                    <li className="flex items-center text-gray-700">
                      <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                      Até 3 anúncios
                    </li>
                    <li className="flex items-center text-gray-700">
                      <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                      3 fotos por produto
                    </li>
                    <li className="flex items-center text-gray-700">
                      <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                      Suporte básico
                    </li>
                  </>
                )}
                
                {userPlan.currentPlan === 'PREMIUM' && (
                  <>
                    <li className="flex items-center text-gray-700">
                      <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                      Até 15 anúncios
                    </li>
                    <li className="flex items-center text-gray-700">
                      <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                      10 fotos por produto
                    </li>
                    <li className="flex items-center text-gray-700">
                      <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                      Destaque nos anúncios
                    </li>
                    <li className="flex items-center text-gray-700">
                      <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                      Analytics básico
                    </li>
                  </>
                )}
                
                {userPlan.currentPlan === 'PRO' && (
                  <>
                    <li className="flex items-center text-gray-700">
                      <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                      Anúncios ilimitados
                    </li>
                    <li className="flex items-center text-gray-700">
                      <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                      Fotos ilimitadas
                    </li>
                    <li className="flex items-center text-gray-700">
                      <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                      Destaque OURO
                    </li>
                    <li className="flex items-center text-gray-700">
                      <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                      Analytics avançado
                    </li>
                  </>
                )}
              </ul>
            </div>
            
            {/* Subscription Status */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Status da Assinatura</h3>
              
              {subscription ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Status</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      getStatusColor(subscription.status)
                    }`}>
                      {getStatusText(subscription.status)}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Próximo pagamento</span>
                    <span className="text-gray-900">
                      {subscription.nextPaymentAt 
                        ? formatDate(subscription.nextPaymentAt)
                        : 'N/A'}
                    </span>
                  </div>
                  
                  {userPlan.daysUntilExpiry !== undefined && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Expira em</span>
                      <span className={`flex items-center ${
                        userPlan.daysUntilExpiry <= 7 ? 'text-red-600' : 'text-gray-900'
                      }`}>
                        <ClockIcon className="h-4 w-4 mr-1" />
                        {userPlan.daysUntilExpiry} dias
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-gray-600">Plano gratuito - sem assinatura ativa</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href="/planos"
          className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center">
            <ArrowUpIcon className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <h3 className="font-semibold text-gray-900">Fazer Upgrade</h3>
              <p className="text-sm text-gray-600">Desbloquear mais recursos</p>
            </div>
          </div>
        </Link>
        
        {userPlan.currentPlan !== 'FREE' && (
          <Link
            href="/dashboard/analytics"
            className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center">
              <ChartBarIcon className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h3 className="font-semibold text-gray-900">Ver Analytics</h3>
                <p className="text-sm text-gray-600">Acompanhar performance</p>
              </div>
            </div>
          </Link>
        )}
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <CalendarIcon className="h-8 w-8 text-purple-600 mr-3" />
            <div>
              <h3 className="font-semibold text-gray-900">Histórico</h3>
              <p className="text-sm text-gray-600">Ver faturas anteriores</p>
            </div>
          </div>
        </div>
      </div>

      {/* Expiry Warning */}
      {userPlan.daysUntilExpiry !== undefined && userPlan.daysUntilExpiry <= 7 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <div className="flex items-center">
            <ExclamationTriangleIcon className="h-6 w-6 text-yellow-600 mr-3" />
            <div className="flex-1">
              <h3 className="font-medium text-yellow-800">
                Assinatura Expirando em Breve
              </h3>
              <p className="text-yellow-700">
                Sua assinatura expira em {userPlan.daysUntilExpiry} dias. 
                Renove para continuar aproveitando os recursos premium.
              </p>
            </div>
            <Link
              href="/planos"
              className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors"
            >
              Renovar
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
