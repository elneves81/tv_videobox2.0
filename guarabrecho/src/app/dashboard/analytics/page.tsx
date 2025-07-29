'use client';

import { useState, useEffect } from 'react';
import { 
  ChartBarIcon,
  EyeIcon,
  CursorArrowRippleIcon,
  ChatBubbleLeftRightIcon,
  UserGroupIcon,
  MagnifyingGlassIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

interface AnalyticsData {
  period: {
    startDate: string;
    endDate: string;
    days: number;
  };
  totals: {
    productViews: number;
    productClicks: number;
    whatsappClicks: number;
    profileViews: number;
    searchAppearances: number;
  };
  metrics: {
    clickRate: number;
    whatsappRate: number;
    avgViewsPerDay: string;
    avgClicksPerDay: string;
  };
  dailyData: Array<{
    date: string;
    productViews: number;
    productClicks: number;
    whatsappClicks: number;
    profileViews: number;
    searchAppearances: number;
  }>;
  insights: Array<{
    type: string;
    title: string;
    description: string;
    value: number;
    trend: 'positive' | 'negative' | 'neutral';
  }>;
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState('30');

  useEffect(() => {
    fetchAnalytics();
  }, [period]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/analytics?period=${period}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao carregar analytics');
      }
      
      const analyticsData = await response.json();
      setData(analyticsData);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('pt-BR').format(num);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('pt-BR');
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <ChartBarIcon className="h-8 w-8 mr-3 text-blue-600" />
            Analytics
          </h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <ChartBarIcon className="h-8 w-8 mr-3 text-blue-600" />
            Analytics
          </h1>
        </div>
        
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <SparklesIcon className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-medium text-red-800">
                Acesso Restrito
              </h3>
              <p className="text-red-700 mt-1">
                {error}
              </p>
              <div className="mt-4">
                <a
                  href="/planos"
                  className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <ArrowUpIcon className="h-4 w-4 mr-2" />
                  Fazer Upgrade
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const stats = [
    {
      name: 'Visualizações',
      value: formatNumber(data.totals.productViews),
      change: `${data.metrics.avgViewsPerDay}/dia`,
      icon: EyeIcon,
      color: 'blue'
    },
    {
      name: 'Cliques',
      value: formatNumber(data.totals.productClicks),
      change: `${data.metrics.clickRate}% taxa`,
      icon: CursorArrowRippleIcon,
      color: 'green'
    },
    {
      name: 'Contatos WhatsApp',
      value: formatNumber(data.totals.whatsappClicks),
      change: `${data.metrics.whatsappRate}% conversão`,
      icon: ChatBubbleLeftRightIcon,
      color: 'purple'
    },
    {
      name: 'Perfil Visto',
      value: formatNumber(data.totals.profileViews),
      change: 'visualizações',
      icon: UserGroupIcon,
      color: 'orange'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
          <ChartBarIcon className="h-8 w-8 mr-3 text-blue-600" />
          Analytics
        </h1>
        
        <div className="flex items-center space-x-4">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="7">Últimos 7 dias</option>
            <option value="30">Últimos 30 dias</option>
            <option value="90">Últimos 90 dias</option>
          </select>
        </div>
      </div>

      {/* Period Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-blue-800">
          <strong>Período:</strong> {formatDate(data.period.startDate)} até {formatDate(data.period.endDate)} 
          ({data.period.days} dias)
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const IconComponent = stat.icon;
          const colorClasses = {
            blue: 'text-blue-600 bg-blue-100',
            green: 'text-green-600 bg-green-100',
            purple: 'text-purple-600 bg-purple-100',
            orange: 'text-orange-600 bg-orange-100'
          };
          
          return (
            <div key={stat.name} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className={`p-2 rounded-lg ${colorClasses[stat.color as keyof typeof colorClasses]}`}>
                  <IconComponent className="h-6 w-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-gray-500">{stat.change}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Insights */}
      {data.insights.length > 0 && (
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Insights</h2>
          </div>
          <div className="p-6 space-y-4">
            {data.insights.map((insight, index) => (
              <div key={index} className="flex items-center p-4 bg-gray-50 rounded-lg">
                <div className={`p-2 rounded-full ${
                  insight.trend === 'positive' ? 'bg-green-100' : 
                  insight.trend === 'negative' ? 'bg-red-100' : 'bg-blue-100'
                }`}>
                  {insight.trend === 'positive' ? (
                    <ArrowUpIcon className="h-5 w-5 text-green-600" />
                  ) : insight.trend === 'negative' ? (
                    <ArrowDownIcon className="h-5 w-5 text-red-600" />
                  ) : (
                    <MagnifyingGlassIcon className="h-5 w-5 text-blue-600" />
                  )}
                </div>
                <div className="ml-4">
                  <h3 className="font-medium text-gray-900">{insight.title}</h3>
                  <p className="text-sm text-gray-600">{insight.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Chart placeholder */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Visualizações por Dia</h2>
        </div>
        <div className="p-6">
          <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <ChartBarIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">Gráfico em desenvolvimento</p>
              <p className="text-sm text-gray-400">
                Visualize tendências de visualizações ao longo do tempo
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search Appearances */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Aparições em Buscas</h2>
        </div>
        <div className="p-6">
          <div className="flex items-center">
            <MagnifyingGlassIcon className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {formatNumber(data.totals.searchAppearances)}
              </p>
              <p className="text-sm text-gray-600">
                vezes que seus produtos apareceram nas buscas
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
