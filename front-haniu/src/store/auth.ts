import { create } from 'zustand';

export interface User {
  fullName: string;
  role: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isInitialized: boolean;

  setAuth: (token: string, user: User) => void;
  clearAuth: () => void;
  initializeAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  isAuthenticated: false,
  isInitialized: false,

  setAuth: (token, user) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('haniu_token', token);
      localStorage.setItem('haniu_user_role', user.role);
      localStorage.setItem('haniu_user_name', user.fullName);
    }
    set({ token, user, isAuthenticated: true });
  },

  clearAuth: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('haniu_token');
      localStorage.removeItem('haniu_refresh_token');
      localStorage.removeItem('haniu_user_role');
      localStorage.removeItem('haniu_user_name');
    }
    set({ token: null, user: null, isAuthenticated: false });
  },

  initializeAuth: () => {
    if (typeof window === 'undefined') return;
    const token = localStorage.getItem('haniu_token');
    const role = localStorage.getItem('haniu_user_role');
    const fullName = localStorage.getItem('haniu_user_name');

    if (token && role && fullName) {
      set({
        token,
        user: { fullName, role },
        isAuthenticated: true,
        isInitialized: true,
      });
    } else {
      set({ isInitialized: true });
    }
  },
}));
