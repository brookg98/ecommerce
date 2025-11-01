import { useMutation, useQuery, useQueryClient } from 'react-query';
import { cartAPI, AddToCartRequest, UpdateCartItemRequest } from '../api/cart';
import { useCartStore } from '../stores/cartStore';
import toast from 'react-hot-toast';

export const useCart = () => {
  const queryClient = useQueryClient();
  const { setCart, setLoading } = useCartStore();

  const { data: cart, isLoading } = useQuery(['cart'], () => cartAPI.getCart(), {
    onSuccess: (data) => setCart(data),
    onError: () => setLoading(false),
  });

  const addItemMutation = useMutation(
    (data: AddToCartRequest) => cartAPI.addItem(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['cart']);
        toast.success('Added to cart!');
      },
      onError: (error: any) => {
        const message = error.response?.data?.detail || 'Failed to add item';
        toast.error(message);
      },
    }
  );

  const updateItemMutation = useMutation(
    ({ productId, quantity }: { productId: number; quantity: number }) =>
      cartAPI.updateItem(productId, { quantity }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['cart']);
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.detail || 'Failed to update item');
      },
    }
  );

  const removeItemMutation = useMutation(
    (productId: number) => cartAPI.removeItem(productId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['cart']);
        toast.success('Removed from cart');
      },
    }
  );

  const clearCartMutation = useMutation(() => cartAPI.clearCart(), {
    onSuccess: () => {
      queryClient.invalidateQueries(['cart']);
    },
  });

  return {
    cart,
    isLoading,
    addItem: addItemMutation.mutate,
    updateItem: updateItemMutation.mutate,
    removeItem: removeItemMutation.mutate,
    clearCart: clearCartMutation.mutate,
    isUpdating:
      addItemMutation.isLoading ||
      updateItemMutation.isLoading ||
      removeItemMutation.isLoading,
  };
};
