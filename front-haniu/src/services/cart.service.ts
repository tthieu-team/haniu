import { fetchApi } from '@/lib/api';

export interface CartItemRequest {
  productId: string;
  variantId?: string | null;
  quantity: number;
  customizationInfo?: string;
}

export const cartService = {
  getCart: async () => {
    return fetchApi('/api/v1/carts');
  },

  addToCart: async (payload: CartItemRequest) => {
    return fetchApi('/api/v1/carts', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  updateQuantity: async (itemId: string, quantity: number) => {
    return fetchApi(`/api/v1/carts/items/${itemId}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity }),
    });
  },

  removeItem: async (itemId: string) => {
    return fetchApi(`/api/v1/carts/items/${itemId}`, {
      method: 'DELETE',
    });
  },

  mergeCarts: async () => {
    return fetchApi('/api/v1/carts/merge', {
      method: 'POST',
    });
  }
};
