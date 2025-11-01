import { useQuery } from 'react-query';
import { productsAPI, ProductFilters } from '../api/products';

export const useProducts = (filters?: ProductFilters) => {
  return useQuery(['products', filters], () => productsAPI.list(filters), {
    staleTime: 5 * 60 * 1000,
  });
};

export const useProduct = (id: number) => {
  return useQuery(['product', id], () => productsAPI.getById(id), {
    staleTime: 5 * 60 * 1000,
  });
};

export const useCategories = () => {
  return useQuery(['categories'], () => productsAPI.listCategories(), {
    staleTime: 10 * 60 * 1000,
  });
};
