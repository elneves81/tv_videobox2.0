'use client';

import { useNotifications } from '@/contexts/NotificationContext';
import { useTheme } from '@/contexts/ThemeContext';
import { ThemeToggle, SimpleThemeToggle } from '@/components/ui/ThemeToggle';
import { 
  LoadingSpinner, 
  LoadingDots, 
  LoadingSkeleton, 
  LoadingCard, 
  LoadingButton, 
  LoadingOverlay 
} from '@/components/ui/Loading';
import { ProductInfiniteScroll } from '@/components/ui/InfiniteScrollList';
import { useState, useEffect } from 'react';

// Mock data para o infinite scroll
const mockProducts = Array.from({ length: 100 }, (_, i) => ({
  id: i + 1,
  title: `Produto ${i + 1}`,
  price: Math.floor(Math.random() * 1000) + 10,
  image: `https://picsum.photos/300/200?random=${i}`,
  description: `Descrição do produto ${i + 1}`,
  location: 'Guarapuava, PR'
}));

const fetchMockProducts = async (page: number) => {
  // Simular delay de rede
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const pageSize = 8;
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const data = mockProducts.slice(startIndex, endIndex);
  
  return {
    data,
    hasMore: endIndex < mockProducts.length,
    totalCount: mockProducts.length
  };
};

export default function TestPage() {
  const { success, error, warning, info } = useNotifications();
  const [loading, setLoading] = useState(false);
  const [overlayLoading, setOverlayLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Safe theme access with fallback
  let theme = 'system';
  let actualTheme = 'light';
  
  try {
    const themeContext = useTheme();
    theme = themeContext.theme;
    actualTheme = themeContext.actualTheme;
  } catch (error) {
    // Theme provider não está disponível durante o build
  }

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleNotificationTest = (type: string) => {
    switch (type) {
      case 'success':
        success('Sucesso!', 'Operação realizada com sucesso.');
        break;
      case 'error':
        error('Erro!', 'Algo deu errado. Tente novamente.');
        break;
      case 'warning':
        warning('Atenção!', 'Verifique os dados antes de continuar.');
        break;
      case 'info':
        info('Informação', 'Nova funcionalidade disponível!');
        break;
    }
  };

  const handleLoadingTest = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 3000));
    setLoading(false);
    success('Teste concluído!', 'Loading state funcionou perfeitamente.');
  };

  const handleOverlayTest = async () => {
    setOverlayLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setOverlayLoading(false);
  };

  const renderProduct = (product: any) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <img 
        src={product.image} 
        alt={product.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
          {product.title}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
          {product.description}
        </p>
        <div className="flex justify-between items-center">
          <span className="text-green-600 dark:text-green-400 font-bold">
            R$ {product.price}
          </span>
          <span className="text-xs text-gray-500">
            {product.location}
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            🧪 Teste das Funcionalidades UX
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Página para testar todas as novas funcionalidades implementadas
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Notificações */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              🔔 Sistema de Notificações
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleNotificationTest('success')}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Sucesso
              </button>
              <button
                onClick={() => handleNotificationTest('error')}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Erro
              </button>
              <button
                onClick={() => handleNotificationTest('warning')}
                className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Aviso
              </button>
              <button
                onClick={() => handleNotificationTest('info')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Info
              </button>
            </div>
          </div>

          {/* Dark Mode */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              🌙 Dark Mode
            </h2>
            <div className="space-y-4">
              <div>
                <p className="text-gray-600 dark:text-gray-400 mb-2">
                  Tema atual: <strong>{actualTheme}</strong> (configuração: {theme})
                </p>
              </div>
              {mounted && <ThemeToggle showLabel={true} />}
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600 dark:text-gray-400">Toggle simples:</span>
                {mounted && <SimpleThemeToggle />}
              </div>
            </div>
          </div>
        </div>

        {/* Loading States */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
            ⏳ Loading States
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            <div className="text-center">
              <h3 className="font-semibold mb-4">Spinner</h3>
              <LoadingSpinner size="lg" />
            </div>
            <div className="text-center">
              <h3 className="font-semibold mb-4">Dots</h3>
              <LoadingDots size="lg" />
            </div>
            <div className="text-center">
              <h3 className="font-semibold mb-4">Skeleton</h3>
              <LoadingSkeleton lines={2} avatar />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="font-semibold mb-4">Loading Card</h3>
              <LoadingCard />
            </div>
            <div>
              <h3 className="font-semibold mb-4">Loading Button</h3>
              <LoadingButton 
                loading={loading} 
                onClick={handleLoadingTest}
                className="w-full"
              >
                Testar Loading (3s)
              </LoadingButton>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Loading Overlay</h3>
            <LoadingOverlay isLoading={overlayLoading} message="Processando...">
              <div className="bg-gray-100 dark:bg-gray-700 p-8 rounded-lg">
                <p className="text-center text-gray-600 dark:text-gray-400">
                  Esta seção terá um overlay quando estiver carregando.
                </p>
                <button
                  onClick={handleOverlayTest}
                  className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Testar Overlay (2s)
                </button>
              </div>
            </LoadingOverlay>
          </div>
        </div>

        {/* Infinite Scroll */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
            ♾️ Infinite Scroll
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Role para baixo para carregar mais produtos automaticamente.
          </p>
          
          <ProductInfiniteScroll
            fetchProducts={fetchMockProducts}
            renderProduct={renderProduct}
          />
        </div>
      </div>
    </div>
  );
}
