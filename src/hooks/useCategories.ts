import useSWR from 'swr';
import { Category } from '@/types';

const fetcher = (url: string) => fetch(url).then(res => res.json());

interface UseCategoriesOptions {
  includeCount?: boolean;
  parentOnly?: boolean;
}

export const useCategories = (options: UseCategoriesOptions = {}) => {
  const params = new URLSearchParams();
  
  if (options.includeCount) params.append('includeCount', 'true');
  if (options.parentOnly) params.append('parentOnly', 'true');

  const queryString = params.toString();
  
  const { data, error, isLoading, mutate } = useSWR<Category[]>(
    queryString ? `/api/categories?${queryString}` : '/api/categories',
    fetcher
  );

  return {
    categories: data || [],
    loading: isLoading,
    error,
    refresh: mutate,
  };
};