import { useMutation, useQuery, useQueryClient } from 'react-query';
import { ordersAPI } from '../api/orders';
import toast from 'react-hot-toast';

export const useOrders = () => {
  return useQuery(['orders'], () => ordersAPI.list(), {
    staleTime: 2 * 60 * 1000,
  });
};

export const useOrder = (id: number) => {
  return useQuery(['order', id], () => ordersAPI.getById(id));
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation(() => ordersAPI.create(), {
    onSuccess: (data) => {
      queryClient.invalidateQueries(['orders']);
      toast.success('Order created successfully!');
      return data;
    },
    onError: (error: any) => {
      const message = error.response?.data?.detail || 'Failed to create order';
      toast.error(message);
    },
  });
};
