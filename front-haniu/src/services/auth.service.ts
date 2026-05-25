import { fetchApi } from '@/lib/api';
import { useAuthStore } from '@/store/auth';
import { useCartStore } from '@/store/cart';

export const authService = {
  register: async (payload: any) => {
    const res = await fetchApi('/api/v1/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    if (res?.accessToken) {
      // Sync Zustand Store
      const { setAuth } = useAuthStore.getState();
      setAuth(res.accessToken, res.refreshToken, { 
        fullName: res.fullName, 
        role: res.role,
        email: res.email,
        phone: res.phone
      });
      
      // Merge carts
      try {
        await useCartStore.getState().mergeCarts();
      } catch (err) {
        console.error('Failed to merge carts on register', err);
      }
    }
    return res;
  },

  login: async (payload: any) => {
    const res = await fetchApi('/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    if (res?.accessToken) {
      // Sync Zustand Store
      const { setAuth } = useAuthStore.getState();
      setAuth(res.accessToken, res.refreshToken, { 
        fullName: res.fullName, 
        role: res.role,
        email: res.email,
        phone: res.phone
      });
      
      // Merge carts
      try {
        await useCartStore.getState().mergeCarts();
      } catch (err) {
        console.error('Failed to merge carts on login', err);
      }
    }
    return res;
  },

  logout: async () => {
    const { refreshToken, clearAuth } = useAuthStore.getState();
    try {
      if (refreshToken) {
        await fetchApi('/api/v1/auth/logout', {
          method: 'POST',
          body: JSON.stringify({ refreshToken }),
        });
      }
    } catch (e) {
      // ignore
    }
    
    // Sync Zustand Store
    clearAuth();
    
    // Clear and refetch guest cart
    try {
      useCartStore.getState().clearCartState();
      await useCartStore.getState().fetchCart();
    } catch (err) {
      console.error('Failed to refresh guest cart on logout', err);
    }
  },

  getCurrentUser: () => {
    const { user, token } = useAuthStore.getState();
    if (token && user) {
      return { token, role: user.role, fullName: user.fullName };
    }
    return null;
  }
};
