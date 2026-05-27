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
  email?: string;
  phone?: string;
}

interface AuthState {
  token: string | null;
  refreshToken: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isInitialized: boolean;

  setAuth: (token: string, refreshToken: string, user: User) => void;
  clearAuth: () => void;
  initializeAuth: () => Promise<void>;
  checkAndRefreshToken: () => Promise<void>;
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

  initializeAuth: async () => {
    if (typeof window !== 'undefined') {
      const token = getCookie('haniu_access_token');
      const refreshToken = getCookie('haniu_refresh_token');
      const userStr = getCookie('haniu_user');
      
      if (token && refreshToken && userStr) {
        try {
          const user = JSON.parse(userStr);
          
          // Decode JWT payload to check expiration
          const parts = token.split('.');
          let isExpired = false;
          if (parts.length === 3) {
            try {
              const payload = JSON.parse(atob(parts[1]));
              // If expired or expiring within 10 seconds, trigger refresh
              if (payload.exp && payload.exp * 1000 - 10000 < Date.now()) {
                isExpired = true;
              }
            } catch (e) {
              isExpired = true;
            }
          } else {
            isExpired = true;
          }

          if (isExpired) {
            const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
            const res = await fetch(`${API_BASE_URL}/api/v1/auth/refresh`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ refreshToken }),
            });
            if (res.ok) {
              const data = await res.json();
              if (data?.accessToken) {
                const newUser = { fullName: data.fullName, role: data.role, email: data.email, phone: data.phone };
                set({ token: data.accessToken, refreshToken: data.refreshToken || refreshToken, user: newUser, isAuthenticated: true, isInitialized: true });
                setCookie('haniu_access_token', data.accessToken);
                setCookie('haniu_refresh_token', data.refreshToken || refreshToken);
                setCookie('haniu_user', JSON.stringify(newUser));
                return;
              }
            }
            // Clear expired or invalid cookies
            eraseCookie('haniu_access_token');
            eraseCookie('haniu_refresh_token');
            eraseCookie('haniu_user');
            set({ token: null, refreshToken: null, user: null, isAuthenticated: false, isInitialized: true });
            return;
          }

          set({ token, refreshToken, user, isAuthenticated: true, isInitialized: true });
          return;
        } catch (e) {
          // ignore
        }
      }
    }
    set({ isInitialized: true });
  },

  checkAndRefreshToken: async () => {
    const state = useAuthStore.getState();
    const token = state.token;
    const refreshToken = state.refreshToken;
    if (!token || !refreshToken) return;

    try {
      const parts = token.split('.');
      if (parts.length === 3) {
        const payload = JSON.parse(atob(parts[1]));
        // If expiring within 2 minutes (120 seconds), trigger refresh
        if (payload.exp && payload.exp * 1000 - 120000 < Date.now()) {
          const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
          const res = await fetch(`${API_BASE_URL}/api/v1/auth/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken }),
          });
          if (res.ok) {
            const data = await res.json();
            if (data?.accessToken) {
              const newUser = { fullName: data.fullName, role: data.role, email: data.email, phone: data.phone };
              set({ token: data.accessToken, refreshToken: data.refreshToken || refreshToken, user: newUser, isAuthenticated: true });
              setCookie('haniu_access_token', data.accessToken);
              setCookie('haniu_refresh_token', data.refreshToken || refreshToken);
              setCookie('haniu_user', JSON.stringify(newUser));
              console.log('Silent token refresh succeeded');
            }
          } else if (res.status === 400 || res.status === 401) {
            state.clearAuth();
          }
        }
      }
    } catch (e) {
      console.error('Silent token refresh error:', e);
    }
  },
}));
