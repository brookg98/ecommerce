import axiosClient from './axiosClient';

export interface CartItem {
  product_id: number;
  quantity: number;
  unit_price: number | string;
  product_name: string;
}

export interface CartResponse {
  items: CartItem[];
  total: number | string;
  item_count: number;
}

export interface AddToCartRequest {
  product_id: number;
  quantity?: number;
}

export interface UpdateCartItemRequest {
  quantity: number;
}

export const cartAPI = {
  getCart: () =>
    axiosClient.get<CartResponse>('/cart'),

  addItem: (data: AddToCartRequest) =>
    axiosClient.post('/cart/items', data),

  updateItem: (productId: number, data: UpdateCartItemRequest) =>
    axiosClient.put(`/cart/items/${productId}`, data),

  removeItem: (productId: number) =>
    axiosClient.delete(`/cart/items/${productId}`),

  clearCart: () =>
    axiosClient.delete('/cart'),
};
