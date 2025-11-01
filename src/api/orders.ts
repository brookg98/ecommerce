import axiosClient from './axiosClient';

export interface OrderItem {
  id: number;
  product_id: number;
  quantity: number;
  unit_price: number | string;
}

export interface Order {
  id: number;
  user_id: number;
  total_amount: number | string;
  status: string;
  payment_intent_id?: string;
  created_at: string;
  items?: OrderItem[];
}

export const ordersAPI = {
  create: () =>
    axiosClient.post<Order>('/orders', {}),

  list: (skip?: number, limit?: number) =>
    axiosClient.get<Order[]>('/orders', {
      params: { skip: skip ?? 0, limit: limit ?? 100 },
    }),

  getById: (id: number) =>
    axiosClient.get<Order>(`/orders/${id}`),
};
