'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

interface UseInfiniteScrollOptions<T> {
  fetchMore: (page: number) => Promise<{
    data: T[];
    hasMore: boolean;
    totalCount?: number;
  }>;
  initialData?: T[];
  threshold?: number;
  enabled?: boolean;
}

interface UseInfiniteScrollReturn<T> {
  data: T[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => void;
  refresh: () => void;
  totalCount?: number;
}

export function useInfiniteScroll<T>({
  fetchMore,
  initialData = [],
  threshold = 100,
  enabled = true
}: UseInfiniteScrollOptions<T>): UseInfiniteScrollReturn<T> {
  const [data, setData] = useState<T[]>(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState<number | undefined>();
  
  const isInitialized = useRef(false);
  const isFetching = useRef(false);

  const loadMore = useCallback(async () => {
    if (!enabled || isFetching.current || !hasMore) return;

    isFetching.current = true;
    setLoading(true);
    setError(null);

    try {
      const result = await fetchMore(page);
      
      setData(prevData => {
        // Avoid duplicates by checking if items already exist
        const existingIds = new Set(
          prevData.map(item => 
            typeof item === 'object' && item !== null && 'id' in item 
              ? (item as any).id 
              : item
          )
        );
        
        const newItems = result.data.filter(item => {
          const id = typeof item === 'object' && item !== null && 'id' in item 
            ? (item as any).id 
            : item;
          return !existingIds.has(id);
        });
        
        return [...prevData, ...newItems];
      });
      
      setHasMore(result.hasMore);
      setTotalCount(result.totalCount);
      setPage(prevPage => prevPage + 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar mais dados');
      console.error('Infinite scroll error:', err);
    } finally {
      setLoading(false);
      isFetching.current = false;
    }
  }, [fetchMore, page, hasMore, enabled]);

  const refresh = useCallback(async () => {
    setData([]);
    setPage(1);
    setHasMore(true);
    setError(null);
    isFetching.current = false;
    
    // Reset and load first page
    if (enabled) {
      try {
        setLoading(true);
        const result = await fetchMore(1);
        setData(result.data);
        setHasMore(result.hasMore);
        setTotalCount(result.totalCount);
        setPage(2);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao recarregar dados');
      } finally {
        setLoading(false);
      }
    }
  }, [fetchMore, enabled]);

  // Load initial data
  useEffect(() => {
    if (!isInitialized.current && enabled && initialData.length === 0) {
      isInitialized.current = true;
      loadMore();
    }
  }, [enabled, initialData.length, loadMore]);

  return {
    data,
    loading,
    error,
    hasMore,
    loadMore,
    refresh,
    totalCount
  };
}

// Hook for intersection observer (scroll detection)
export function useIntersectionObserver(
  callback: () => void,
  options: IntersectionObserverInit = {}
) {
  const targetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const target = targetRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        callback();
      }
    }, {
      threshold: 0.1,
      rootMargin: '100px',
      ...options
    });

    observer.observe(target);

    return () => {
      observer.unobserve(target);
    };
  }, [callback, options]);

  return targetRef;
}

// Combined hook for infinite scroll with intersection observer
export function useInfiniteScrollWithObserver<T>(
  options: UseInfiniteScrollOptions<T>
) {
  const infiniteScroll = useInfiniteScroll(options);
  
  const observerRef = useIntersectionObserver(
    infiniteScroll.loadMore,
    { threshold: 0.1, rootMargin: '200px' }
  );

  return {
    ...infiniteScroll,
    observerRef
  };
}
