import { useState, useEffect } from 'react';
import useSWR from 'swr';
import { Product } from '@/types';

interface UseProductsOptions {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  sortBy?: string;
  minPrice?: number;
  maxPrice?: number;
  tags?: string[];
}

interface ProductsResponse {
  products: Product[];
  pagination: {
    current: number;
    pages: number;
    total: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

const fetcher = (url: string) => fetch(url).then(res => res.json());

export const useProducts = (options: UseProductsOptions = {}) => {
  const [queryParams, setQueryParams] = useState('');

  useEffect(() => {
    const params = new URLSearchParams();
    
    Object.entries(options).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (Array.isArray(value)) {
          params.append(key, value.join(','));
        } else {
          params.append(key, value.toString());
        }
      }
    });

    setQueryParams(params.toString());
  }, [options]);

  const { data, error, isLoading, mutate } = useSWR<ProductsResponse>(
    queryParams ? `/api/products?${queryParams}` : '/api/products',
    fetcher
  );

  return {
    products: data?.products || [],
    pagination: data?.pagination,
    loading: isLoading,
    error,
    refresh: mutate,
  };
};