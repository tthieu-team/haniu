import { create } from 'zustand';
import { cartService, CartItemRequest } from '@/services/cart.service';
import { useAuthStore } from '@/store/auth';
import { productService } from '@/services/product.service';

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
  originalPrice?: number;
  stock?: number;
  color?: string;
  size?: string;
  material?: string;
  isAccessory?: boolean;
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
  syncGuestCartToBackend: () => Promise<Cart | null>;
  clearCartState: () => void;
}

export const useCartStore = create<CartState>((set, get) => ({
  cart: null,
  loading: false,
  error: null,

  fetchCart: async () => {
    set({ loading: true, error: null });
    const isAuthenticated = useAuthStore.getState().isAuthenticated;
    if (isAuthenticated) {
      try {
        const data = await cartService.getCart();
        set({ cart: data, loading: false });
        return data;
      } catch (err: any) {
        set({ loading: false, error: err.message || 'Lỗi lấy giỏ hàng' });
        return null;
      }
    } else {
      if (typeof window !== 'undefined') {
        const localCartStr = localStorage.getItem('haniu_guest_cart');
        const localCart: Cart = localCartStr
          ? JSON.parse(localCartStr)
          : { id: 'guest-cart', totalItems: 0, totalPrice: 0, items: [] };
        set({ cart: localCart, loading: false });
        return localCart;
      }
      set({ cart: null, loading: false });
      return null;
    }
  },

  addToCart: async (payload) => {
    set({ loading: true, error: null });
    const currentCart = get().cart;
    const existingItem = currentCart?.items.find(i => i.productId === payload.productId);
    
    let isAccessory = false;
    try {
      const product = await productService.getProductById(payload.productId);
      if (product && (product.category?.isAccessory || product.category?.accessory || product.category?.slug?.includes('phu-kien'))) {
        isAccessory = true;
      }
    } catch (e) {}

    if (existingItem && existingItem.isAccessory) {
      set({ loading: false });
      return currentCart;
    }

    const isAuthenticated = useAuthStore.getState().isAuthenticated;
    if (isAuthenticated) {
      try {
        const finalPayload = isAccessory ? { ...payload, quantity: 1 } : payload;
        const data = await cartService.addToCart(finalPayload);
        set({ cart: data, loading: false });
        return data;
      } catch (err: any) {
        set({ loading: false, error: err.message || 'Lỗi thêm sản phẩm' });
        throw err;
      }
    } else {
      try {
        const product = await productService.getProductById(payload.productId);
        if (!product) throw new Error('Không tìm thấy sản phẩm');

        let variant = null;
        let price = product.basePrice;
        let variantName = '';
        let variantSku = product.sku;
        let imageUrl = product.media?.find((m: any) => m.isThumbnail)?.url || product.media?.[0]?.url || '';

        if (payload.variantId) {
          variant = product.variants?.find((v: any) => v.id === payload.variantId);
          if (variant) {
            price = variant.salePrice || variant.price;
            variantName = variant.name;
            variantSku = variant.sku;
            if (variant.imageUrl) imageUrl = variant.imageUrl;
          }
        } else if (product.salePrice) {
          price = product.salePrice;
        }

        const newItem: CartItem = {
          id: `guest_item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          productId: product.id,
          productName: product.name,
          productSlug: product.slug,
          variantId: payload.variantId || undefined,
          variantName: variantName || undefined,
          variantSku: variantSku,
          imageUrl,
          quantity: isAccessory ? 1 : payload.quantity,
          unitPrice: price,
          totalPrice: price * (isAccessory ? 1 : payload.quantity),
          customizationInfo: payload.customizationInfo,
          originalPrice: variant ? variant.price : product.basePrice,
          stock: variant ? variant.stock : product.stock,
          isAccessory: isAccessory
        };

        let localCart: Cart = { id: 'guest-cart', totalItems: 0, totalPrice: 0, items: [] };
        if (typeof window !== 'undefined') {
          const localCartStr = localStorage.getItem('haniu_guest_cart');
          if (localCartStr) {
            localCart = JSON.parse(localCartStr);
          }
        }

        const existingItemIndex = localCart.items.findIndex(item =>
          item.productId === newItem.productId &&
          item.variantId === newItem.variantId &&
          item.customizationInfo === newItem.customizationInfo
        );

        if (existingItemIndex > -1) {
          if (localCart.items[existingItemIndex].isAccessory) {
            localCart.items[existingItemIndex].quantity = 1;
          } else {
            localCart.items[existingItemIndex].quantity += newItem.quantity;
          }
          localCart.items[existingItemIndex].totalPrice = localCart.items[existingItemIndex].unitPrice * localCart.items[existingItemIndex].quantity;
        } else {
          localCart.items.push(newItem);
        }

        localCart.totalItems = localCart.items.reduce((acc, item) => acc + item.quantity, 0);
        localCart.totalPrice = localCart.items.reduce((acc, item) => acc + item.totalPrice, 0);

        if (typeof window !== 'undefined') {
          localStorage.setItem('haniu_guest_cart', JSON.stringify(localCart));
        }

        set({ cart: localCart, loading: false });
        return localCart;
      } catch (err: any) {
        set({ loading: false, error: err.message || 'Lỗi thêm sản phẩm' });
        throw err;
      }
    }
  },

  updateQuantity: async (itemId, quantity) => {
    const currentCart = get().cart;
    const item = currentCart?.items.find(i => i.id === itemId);
    if (item && item.isAccessory && quantity > 1) {
      return currentCart;
    }

    set({ loading: true, error: null });
    const isAuthenticated = useAuthStore.getState().isAuthenticated;
    if (isAuthenticated) {
      try {
        const data = await cartService.updateQuantity(itemId, quantity);
        set({ cart: data, loading: false });
        return data;
      } catch (err: any) {
        set({ loading: false, error: err.message || 'Lỗi cập nhật số lượng' });
        throw err;
      }
    } else {
      if (typeof window !== 'undefined') {
        const localCartStr = localStorage.getItem('haniu_guest_cart');
        if (localCartStr) {
          const localCart: Cart = JSON.parse(localCartStr);
          const itemIndex = localCart.items.findIndex(item => item.id === itemId);
          if (itemIndex > -1) {
            if (quantity <= 0) {
              localCart.items.splice(itemIndex, 1);
            } else {
              localCart.items[itemIndex].quantity = localCart.items[itemIndex].isAccessory ? 1 : quantity;
              localCart.items[itemIndex].totalPrice = localCart.items[itemIndex].unitPrice * localCart.items[itemIndex].quantity;
            }
            localCart.totalItems = localCart.items.reduce((acc, item) => acc + item.quantity, 0);
            localCart.totalPrice = localCart.items.reduce((acc, item) => acc + item.totalPrice, 0);
            localStorage.setItem('haniu_guest_cart', JSON.stringify(localCart));
            set({ cart: localCart, loading: false });
            return localCart;
          }
        }
      }
      set({ loading: false });
      return null;
    }
  },

  removeItem: async (itemId) => {
    set({ loading: true, error: null });
    const isAuthenticated = useAuthStore.getState().isAuthenticated;
    if (isAuthenticated) {
      try {
        const data = await cartService.removeItem(itemId);
        set({ cart: data, loading: false });
        return data;
      } catch (err: any) {
        set({ loading: false, error: err.message || 'Lỗi xóa sản phẩm' });
        throw err;
      }
    } else {
      if (typeof window !== 'undefined') {
        const localCartStr = localStorage.getItem('haniu_guest_cart');
        if (localCartStr) {
          const localCart: Cart = JSON.parse(localCartStr);
          localCart.items = localCart.items.filter(item => item.id !== itemId);
          localCart.totalItems = localCart.items.reduce((acc, item) => acc + item.quantity, 0);
          localCart.totalPrice = localCart.items.reduce((acc, item) => acc + item.totalPrice, 0);
          localStorage.setItem('haniu_guest_cart', JSON.stringify(localCart));
          set({ cart: localCart, loading: false });
          return localCart;
        }
      }
      set({ loading: false });
      return null;
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

  syncGuestCartToBackend: async () => {
    set({ loading: true, error: null });
    try {
      if (typeof window === 'undefined') return null;
      const localCartStr = localStorage.getItem('haniu_guest_cart');
      if (!localCartStr) {
        set({ loading: false });
        return null;
      }
      const localCart: Cart = JSON.parse(localCartStr);
      if (localCart.items.length === 0) {
        set({ loading: false });
        return null;
      }

      let backendCart = null;
      for (const item of localCart.items) {
        backendCart = await cartService.addToCart({
          productId: item.productId,
          variantId: item.variantId || null,
          quantity: item.quantity,
          customizationInfo: item.customizationInfo
        });
      }

      localStorage.removeItem('haniu_guest_cart');
      set({ cart: backendCart, loading: false });
      return backendCart;
    } catch (err: any) {
      set({ loading: false, error: err.message || 'Lỗi đồng bộ giỏ hàng' });
      return null;
    }
  },

  clearCartState: () => {
    set({ cart: null, loading: false, error: null });
    if (typeof window !== 'undefined') {
      localStorage.removeItem('haniu_guest_cart');
    }
  },
}));
