import { useState, useEffect, useCallback } from 'react';

interface UseInfiniteScrollOptions {
  hasNextPage: boolean;
  fetchNext: () => Promise<void>;
  threshold?: number;
}

export function useInfiniteScroll({
  hasNextPage,
  fetchNext,
  threshold = 100
}: UseInfiniteScrollOptions) {
  const [isFetching, setIsFetching] = useState(false);

  const handleScroll = useCallback(() => {
    const scrollTop = document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;

    if (scrollTop + clientHeight >= scrollHeight - threshold && hasNextPage && !isFetching) {
      setIsFetching(true);
    }
  }, [hasNextPage, isFetching, threshold]);

  useEffect(() => {
    if (!isFetching) return;

    const fetchData = async () => {
      try {
        await fetchNext();
      } catch (error) {
        console.error('Error fetching more data:', error);
      } finally {
        setIsFetching(false);
      }
    };

    fetchData();
  }, [isFetching, fetchNext]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return { isFetching };
}
