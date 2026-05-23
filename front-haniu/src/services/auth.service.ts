import { fetchApi } from '@/lib/api';
import { useAuthStore } from '@/store/auth';

export const authService = {
  register: async (payload: any) => {
    const res = await fetchApi('/api/v1/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    if (res?.accessToken) {
      // Sync Zustand Store
      const { setAuth } = useAuthStore.getState();
      setAuth(res.accessToken, res.refreshToken, { fullName: res.fullName, role: res.role });
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
      setAuth(res.accessToken, res.refreshToken, { fullName: res.fullName, role: res.role });
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
  },

  getCurrentUser: () => {
    const { user, token } = useAuthStore.getState();
    if (token && user) {
      return { token, role: user.role, fullName: user.fullName };
    }
    return null;
  }
};
