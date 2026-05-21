import { fetchApi } from './api';

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
    localStorage.removeItem('haniu_token');
    localStorage.removeItem('haniu_refresh_token');
    localStorage.removeItem('haniu_user_role');
    localStorage.removeItem('haniu_user_name');
  },

  getCurrentUser: () => {
    if (typeof window === 'undefined') return null;
    const token = localStorage.getItem('haniu_token');
    const role = localStorage.getItem('haniu_user_role');
    const fullName = localStorage.getItem('haniu_user_name');
    if (!token) return null;
    return { token, role, fullName };
  }
};
