import React from 'react';
import { useInfiniteScrollWithObserver } from '@/hooks/useInfiniteScroll';
import { LoadingSpinner, LoadingCard } from '@/components/ui/Loading';

interface InfiniteScrollListProps<T> {
  fetchMore: (page: number) => Promise<{
    data: T[];
    hasMore: boolean;
    totalCount?: number;
  }>;
  renderItem: (item: T, index: number) => React.ReactNode;
  loadingComponent?: React.ReactNode;
  emptyComponent?: React.ReactNode;
  errorComponent?: (error: string, retry: () => void) => React.ReactNode;
  className?: string;
  containerClassName?: string;
  loadingCardsCount?: number;
  enabled?: boolean;
}

export function InfiniteScrollList<T>({
  fetchMore,
  renderItem,
  loadingComponent,
  emptyComponent,
  errorComponent,
  className = '',
  containerClassName = '',
  loadingCardsCount = 6,
  enabled = true
}: InfiniteScrollListProps<T>) {
  const {
    data,
    loading,
    error,
    hasMore,
    refresh,
    observerRef,
    totalCount
  } = useInfiniteScrollWithObserver({
    fetchMore,
    enabled
  });

  // Error state
  if (error && data.length === 0) {
    if (errorComponent) {
      return <div className={containerClassName}>{errorComponent(error, refresh)}</div>;
    }
    
    return (
      <div className={`text-center py-12 ${containerClassName}`}>
        <div className="text-red-600 mb-4">
          <svg className="w-12 h-12 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-lg font-medium">Erro ao carregar produtos</p>
          <p className="text-sm text-gray-600 mt-2">{error}</p>
        </div>
        <button
          onClick={refresh}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  // Empty state
  if (!loading && data.length === 0) {
    if (emptyComponent) {
      return <div className={containerClassName}>{emptyComponent}</div>;
    }
    
    return (
      <div className={`text-center py-12 ${containerClassName}`}>
        <div className="text-gray-400">
          <svg className="w-12 h-12 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m0 0V9a2 2 0 012-2h2m0 0V6a2 2 0 012-2h2.09M7 13h10v5a2 2 0 01-2 2H9a2 2 0 01-2-2v-5z" />
          </svg>
          <p className="text-lg font-medium text-gray-900 dark:text-white">Nenhum produto encontrado</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Tente ajustar os filtros ou adicione o primeiro produto
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={containerClassName}>
      {/* Show total count if available */}
      {totalCount !== undefined && (
        <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
          {totalCount === 1 ? '1 produto encontrado' : `${totalCount} produtos encontrados`}
        </div>
      )}

      {/* Items grid */}
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${className}`}>
        {data.map((item, index) => (
          <div key={index}>
            {renderItem(item, index)}
          </div>
        ))}
        
        {/* Loading cards while fetching more */}
        {loading && data.length > 0 && (
          <>
            {Array.from({ length: loadingCardsCount }).map((_, index) => (
              <LoadingCard key={`loading-${index}`} />
            ))}
          </>
        )}
      </div>

      {/* Initial loading state */}
      {loading && data.length === 0 && (
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${className}`}>
          {Array.from({ length: loadingCardsCount }).map((_, index) => (
            <LoadingCard key={`initial-loading-${index}`} />
          ))}
        </div>
      )}

      {/* Load more trigger */}
      {hasMore && !loading && (
        <div ref={observerRef} className="flex justify-center py-8">
          {loadingComponent || <LoadingSpinner size="lg" />}
        </div>
      )}

      {/* End of results message */}
      {!hasMore && data.length > 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <p>Você chegou ao final da lista!</p>
          {data.length > 10 && (
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="mt-2 text-green-600 hover:text-green-700 font-medium"
            >
              Voltar ao topo
            </button>
          )}
        </div>
      )}

      {/* Error indicator for failed load more */}
      {error && data.length > 0 && (
        <div className="text-center py-4">
          <p className="text-red-600 text-sm mb-2">Erro ao carregar mais produtos</p>
          <button
            onClick={refresh}
            className="text-green-600 hover:text-green-700 text-sm font-medium"
          >
            Tentar novamente
          </button>
        </div>
      )}
    </div>
  );
}

// Specialized component for product listings
interface ProductInfiniteScrollProps {
  fetchProducts: (page: number) => Promise<{
    data: any[];
    hasMore: boolean;
    totalCount?: number;
  }>;
  renderProduct: (product: any, index: number) => React.ReactNode;
  className?: string;
  enabled?: boolean;
}

export const ProductInfiniteScroll: React.FC<ProductInfiniteScrollProps> = ({
  fetchProducts,
  renderProduct,
  className = '',
  enabled = true
}) => {
  return (
    <InfiniteScrollList
      fetchMore={fetchProducts}
      renderItem={renderProduct}
      className={className}
      loadingCardsCount={8}
      enabled={enabled}
      emptyComponent={
        <div className="text-center py-12">
          <div className="text-gray-400">
            <svg className="w-16 h-16 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Nenhum produto encontrado
            </h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
              Não encontramos produtos que correspondam aos seus critérios de busca. 
              Tente ajustar os filtros ou seja o primeiro a anunciar nesta categoria!
            </p>
          </div>
        </div>
      }
    />
  );
};
