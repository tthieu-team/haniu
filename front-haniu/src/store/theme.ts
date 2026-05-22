import { create } from 'zustand';

export type Theme = 'light' | 'dark';

export interface ThemeColorConfig {
  background: string;
  foreground: string;
  cardBg: string;
  borderColor: string;
  primaryColor: string;
  mutedColor: string;
  accentColor: string;
}

export interface ThemeConfig {
  light: ThemeColorConfig;
  dark: ThemeColorConfig;
}

const DEFAULT_THEME_CONFIG: ThemeConfig = {
  light: {
    background: '#f8fafc',
    foreground: '#1e293b',
    cardBg: '#ffffff',
    borderColor: '#e2e8f0',
    primaryColor: '#e11d48',
    mutedColor: '#64748b',
    accentColor: '#fff1f2',
  },
  dark: {
    background: '#09090b',
    foreground: '#f4f4f5',
    cardBg: '#18181b',
    borderColor: '#27272a',
    primaryColor: '#f43f5e',
    mutedColor: '#94a3b8',
    accentColor: '#4c0519',
  },
};

interface ThemeState {
  theme: Theme;
  config: ThemeConfig;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  updateThemeConfig: (theme: Theme, colors: Partial<ThemeColorConfig>) => void;
  initializeTheme: () => void;
}

const applyThemeVariables = (theme: Theme, config: ThemeConfig) => {
  if (typeof window === 'undefined') return;
  const root = window.document.documentElement;
  const colors = config[theme];
  
  root.style.setProperty('--background-val', colors.background);
  root.style.setProperty('--foreground-val', colors.foreground);
  root.style.setProperty('--card-val', colors.cardBg);
  root.style.setProperty('--border-val', colors.borderColor);
  root.style.setProperty('--primary-val', colors.primaryColor);
  root.style.setProperty('--muted-val', colors.mutedColor);
  root.style.setProperty('--accent-val', colors.accentColor);
};

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: 'light',
  config: DEFAULT_THEME_CONFIG,

  toggleTheme: () => {
    const nextTheme = get().theme === 'light' ? 'dark' : 'light';
    const config = get().config;
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', nextTheme);
      const root = window.document.documentElement;
      if (nextTheme === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
      applyThemeVariables(nextTheme, config);
    }
    set({ theme: nextTheme });
  },

  setTheme: (theme) => {
    const config = get().config;
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', theme);
      const root = window.document.documentElement;
      if (theme === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
      applyThemeVariables(theme, config);
    }
    set({ theme });
  },

  updateThemeConfig: (theme, colors) => {
    set((state) => {
      const newConfig = {
        ...state.config,
        [theme]: {
          ...state.config[theme],
          ...colors,
        },
      };
      if (typeof window !== 'undefined') {
        localStorage.setItem('theme_config', JSON.stringify(newConfig));
        if (state.theme === theme) {
          applyThemeVariables(theme, newConfig);
        }
      }
      return { config: newConfig };
    });
  },

  initializeTheme: () => {
    if (typeof window === 'undefined') return;
    const storedTheme = localStorage.getItem('theme') as Theme | null;
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const activeTheme = storedTheme || (systemPrefersDark ? 'dark' : 'light');

    // Retrieve saved configurations if any
    const storedConfigStr = localStorage.getItem('theme_config');
    let activeConfig = DEFAULT_THEME_CONFIG;
    if (storedConfigStr) {
      try {
        activeConfig = JSON.parse(storedConfigStr);
      } catch (e) {
        console.error('Error parsing stored theme config', e);
      }
    }

    const root = window.document.documentElement;
    if (activeTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    applyThemeVariables(activeTheme, activeConfig);
    set({ theme: activeTheme, config: activeConfig });
  },
}));
