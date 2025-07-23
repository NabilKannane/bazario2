import useSWR from 'swr';
import { Product } from '@/types';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export const useProduct = (id: string) => {
  const { data, error, isLoading, mutate } = useSWR<Product>(
    id ? `/api/products/${id}` : null,
    fetcher
  );

  return {
    product: data,
    loading: isLoading,
    error,
    refresh: mutate,
  };
};
