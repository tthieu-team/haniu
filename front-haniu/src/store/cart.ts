import { create } from 'zustand';
import { cartService, CartItemRequest } from '@/services/cart.service';

export interface CartItem {
  id: string;
  productId: string;
  productName: string;
  productSlug: string;
  variantId?: string;
  variantName?: string;
  variantSku?: string;
  imageUrl?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  customizationInfo?: string;
}

export interface Cart {
  id: string;
  totalItems: number;
  totalPrice: number;
  items: CartItem[];
}

interface CartState {
  cart: Cart | null;
  loading: boolean;
  error: string | null;

  fetchCart: () => Promise<Cart | null>;
  addToCart: (payload: CartItemRequest) => Promise<Cart | null>;
  updateQuantity: (itemId: string, quantity: number) => Promise<Cart | null>;
  removeItem: (itemId: string) => Promise<Cart | null>;
  mergeCarts: () => Promise<Cart | null>;
  clearCartState: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  cart: null,
  loading: false,
  error: null,

  fetchCart: async () => {
    set({ loading: true, error: null });
    try {
      const data = await cartService.getCart();
      set({ cart: data, loading: false });
      return data;
    } catch (err: any) {
      set({ loading: false, error: err.message || 'Lỗi lấy giỏ hàng' });
      return null;
    }
  },

  addToCart: async (payload) => {
    set({ loading: true, error: null });
    try {
      const data = await cartService.addToCart(payload);
      set({ cart: data, loading: false });
      return data;
    } catch (err: any) {
      set({ loading: false, error: err.message || 'Lỗi thêm sản phẩm' });
      throw err;
    }
  },

  updateQuantity: async (itemId, quantity) => {
    set({ loading: true, error: null });
    try {
      const data = await cartService.updateQuantity(itemId, quantity);
      set({ cart: data, loading: false });
      return data;
    } catch (err: any) {
      set({ loading: false, error: err.message || 'Lỗi cập nhật số lượng' });
      throw err;
    }
  },

  removeItem: async (itemId) => {
    set({ loading: true, error: null });
    try {
      const data = await cartService.removeItem(itemId);
      set({ cart: data, loading: false });
      return data;
    } catch (err: any) {
      set({ loading: false, error: err.message || 'Lỗi xóa sản phẩm' });
      throw err;
    }
  },

  mergeCarts: async () => {
    set({ loading: true, error: null });
    try {
      const data = await cartService.mergeCarts();
      set({ cart: data, loading: false });
      return data;
    } catch (err: any) {
      set({ loading: false, error: err.message || 'Lỗi gộp giỏ hàng' });
      return null;
    }
  },

  clearCartState: () => {
    set({ cart: null, loading: false, error: null });
  },
}));
