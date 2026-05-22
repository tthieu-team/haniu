import { fetchApi } from '@/lib/api';
import { useAuthStore } from '@/store/auth';

export const authService = {
  register: async (payload: any) => {
    const res = await fetchApi('/api/v1/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    if (res?.accessToken) {
      localStorage.setItem('haniu_token', res.accessToken);
      localStorage.setItem('haniu_refresh_token', res.refreshToken);
      localStorage.setItem('haniu_user_role', res.role);
      localStorage.setItem('haniu_user_name', res.fullName);

      // Sync Zustand Store
      const { setAuth } = useAuthStore.getState();
      setAuth(res.accessToken, { fullName: res.fullName, role: res.role });
    }
    return res;
  },

  login: async (payload: any) => {
    const res = await fetchApi('/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    if (res?.accessToken) {
      localStorage.setItem('haniu_token', res.accessToken);
      localStorage.setItem('haniu_refresh_token', res.refreshToken);
      localStorage.setItem('haniu_user_role', res.role);
      localStorage.setItem('haniu_user_name', res.fullName);

      // Sync Zustand Store
      const { setAuth } = useAuthStore.getState();
      setAuth(res.accessToken, { fullName: res.fullName, role: res.role });
    }
    return res;
  },

  logout: async () => {
    const refreshToken = localStorage.getItem('haniu_refresh_token');
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
    const { clearAuth } = useAuthStore.getState();
    clearAuth();
  },

  getCurrentUser: () => {
    const { user, token } = useAuthStore.getState();
    if (token && user) {
      return { token, role: user.role, fullName: user.fullName };
    }
    
    // Fallback if client-side rendering hasn't initialized Zustand yet
    if (typeof window === 'undefined') return null;
    const localToken = localStorage.getItem('haniu_token');
    const localRole = localStorage.getItem('haniu_user_role');
    const localName = localStorage.getItem('haniu_user_name');
    if (!localToken) return null;
    return { token: localToken, role: localRole || '', fullName: localName || '' };
  }
};
