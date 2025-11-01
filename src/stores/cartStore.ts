import { create } from 'zustand';
import { CartItem, CartResponse } from '../api/cart';

interface CartState {
  cart: CartResponse | null;
  isLoading: boolean;
  setCart: (cart: CartResponse) => void;
  setLoading: (loading: boolean) => void;
  clearCart: () => void;
  addItem: (item: CartItem) => void;
  removeItem: (productId: number) => void;
  updateItem: (productId: number, quantity: number) => void;
}

export const useCartStore = create<CartState>((set) => ({
  cart: null,
  isLoading: false,

  setCart: (cart) => set({ cart }),
  setLoading: (loading) => set({ isLoading: loading }),
  clearCart: () => set({ cart: null }),

  addItem: (item) =>
    set((state) => {
      if (!state.cart) {
        return {
          cart: {
            items: [item],
            item_count: 1,
            total: item.unit_price,
          },
        };
      }

      const existingItem = state.cart.items.find(
        (i) => i.product_id === item.product_id
      );

      if (existingItem) {
        existingItem.quantity += item.quantity;
      } else {
        state.cart.items.push(item);
      }

      const total = state.cart.items.reduce(
        (sum, i) => sum + Number(i.unit_price) * i.quantity,
        0
      );

      return {
        cart: {
          ...state.cart,
          total,
          item_count: state.cart.items.length,
        },
      };
    }),

  removeItem: (productId) =>
    set((state) => {
      if (!state.cart) return {};

      const items = state.cart.items.filter((i) => i.product_id !== productId);
      const total = items.reduce(
        (sum, i) => sum + Number(i.unit_price) * i.quantity,
        0
      );

      return {
        cart: {
          ...state.cart,
          items,
          total,
          item_count: items.length,
        },
      };
    }),

  updateItem: (productId, quantity) =>
    set((state) => {
      if (!state.cart) return {};

      const item = state.cart.items.find((i) => i.product_id === productId);
      if (item) {
        item.quantity = quantity;
      }

      const total = state.cart.items.reduce(
        (sum, i) => sum + Number(i.unit_price) * i.quantity,
        0
      );

      return {
        cart: {
          ...state.cart,
          total,
        },
      };
    }),
}));
