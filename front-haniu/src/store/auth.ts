import { create } from 'zustand';

// Helper functions to manage cookies without external libraries
function setCookie(name: string, value: string, days = 7) {
  if (typeof window === 'undefined') return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

function getCookie(name: string): string | null {
  if (typeof window === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    const part = parts.pop();
    if (part) return decodeURIComponent(part.split(';').shift() || '');
  }
  return null;
}

function eraseCookie(name: string) {
  if (typeof window === 'undefined') return;
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax`;
}

export interface User {
  fullName: string;
  role: string;
}

interface AuthState {
  token: string | null;
  refreshToken: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isInitialized: boolean;

  setAuth: (token: string, refreshToken: string, user: User) => void;
  clearAuth: () => void;
  initializeAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  refreshToken: null,
  user: null,
  isAuthenticated: false,
  isInitialized: false,

  setAuth: (token, refreshToken, user) => {
    set({ token, refreshToken, user, isAuthenticated: true });
    setCookie('haniu_access_token', token);
    setCookie('haniu_refresh_token', refreshToken);
    setCookie('haniu_user', JSON.stringify(user));
  },

  clearAuth: () => {
    set({ token: null, refreshToken: null, user: null, isAuthenticated: false });
    eraseCookie('haniu_access_token');
    eraseCookie('haniu_refresh_token');
    eraseCookie('haniu_user');
  },

  initializeAuth: () => {
    if (typeof window !== 'undefined') {
      const token = getCookie('haniu_access_token');
      const refreshToken = getCookie('haniu_refresh_token');
      const userStr = getCookie('haniu_user');
      
      if (token && refreshToken && userStr) {
        try {
          const user = JSON.parse(userStr);
          set({ token, refreshToken, user, isAuthenticated: true, isInitialized: true });
          return;
        } catch (e) {
          // ignore invalid cookie format
        }
      }
    }
    set({ isInitialized: true });
  },
}));
