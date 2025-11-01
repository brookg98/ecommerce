import axiosClient from './axiosClient';

export interface Product {
  id: number;
  sku: string;
  name: string;
  description?: string;
  price: number | string;
  stock: number;
  category_id?: number;
  image_url?: string;
  created_at: string;
  updated_at?: string;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  created_at: string;
}

export interface ProductFilters {
  skip?: number;
  limit?: number;
  category_id?: number;
  min_price?: number;
  max_price?: number;
  search?: string;
}

export const productsAPI = {
  list: (filters?: ProductFilters) =>
    axiosClient.get<Product[]>('/products', { params: filters }),

  getById: (id: number) =>
    axiosClient.get<Product>(`/products/${id}`),

  create: (data: Omit<Product, 'id' | 'created_at' | 'updated_at'>) =>
    axiosClient.post<Product>('/products', data),

  update: (id: number, data: Partial<Product>) =>
    axiosClient.put<Product>(`/products/${id}`, data),

  delete: (id: number) =>
    axiosClient.delete(`/products/${id}`),

  listCategories: () =>
    axiosClient.get<Category[]>('/products/categories/list'),

  createCategory: (data: { name: string; description?: string }) =>
    axiosClient.post<Category>('/products/categories', data),
};
