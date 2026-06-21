import { useAuthStore } from '@/store/auth';

let baseUrl = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
  baseUrl = baseUrl.replace('localhost', window.location.hostname).replace('127.0.0.1', window.location.hostname);
}

export const API_BASE_URL = baseUrl;

// Generate session ID for guest carts
function getOrCreateSessionId() {
  if (typeof window === 'undefined') return '';
  let id = localStorage.getItem('haniu_session_id');
  if (!id) {
    id = 'sess_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    localStorage.setItem('haniu_session_id', id);
  }
  return id;
}

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

function subscribeTokenRefresh(cb: (token: string) => void) {
  refreshSubscribers.push(cb);
}

function onRefreshed(token: string) {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
}

export async function fetchApi(path: string, options: RequestInit = {}): Promise<any> {
  const url = `${API_BASE_URL}${path}`;
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (typeof window !== 'undefined') {
    const lang = localStorage.getItem('haniu_lang') || 'vi';
    headers['Accept-Language'] = lang;
  } else {
    try {
      // Dynamic require to prevent client-side build errors
      const { cookies } = require('next/headers');
      const cookieStore = await cookies();
      const lang = cookieStore.get('haniu_lang')?.value || 'vi';
      headers['Accept-Language'] = lang;
    } catch (e) {
      headers['Accept-Language'] = 'vi';
    }
  }

  const token = useAuthStore.getState().token;
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  if (typeof window !== 'undefined') {
    const sessionId = getOrCreateSessionId();
    if (sessionId) {
      headers['X-Session-ID'] = sessionId;
    }
  }

  const response = await fetch(url, {
    cache: 'no-store',
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
  });

  // Handle 401 Unauthorized by attempting to refresh token
  if (
    response.status === 401 &&
    !path.includes('/auth/refresh') &&
    !path.includes('/auth/login') &&
    !path.includes('/auth/register')
  ) {
    const refreshToken = useAuthStore.getState().refreshToken;
    if (refreshToken) {
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const refreshRes = await fetch(`${API_BASE_URL}/api/v1/auth/refresh`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refreshToken }),
          });

          if (refreshRes.ok) {
            const data = await refreshRes.json();
            if (data?.accessToken) {
              // Sync Zustand Auth Store
              const { setAuth } = useAuthStore.getState();
              setAuth(data.accessToken, data.refreshToken || refreshToken, { fullName: data.fullName, role: data.role });
              
              onRefreshed(data.accessToken);
              isRefreshing = false;
            } else {
              throw new Error('Refresh response missing access token');
            }
          } else {
            throw new Error('Refresh request failed');
          }
        } catch (error) {
          isRefreshing = false;
          // Clear authentication on refresh failure
          const { clearAuth } = useAuthStore.getState();
          clearAuth();
          throw error;
        }
      }

      // Queue the current request to retry once refreshed
      return new Promise((resolve) => {
        subscribeTokenRefresh((newToken) => {
          const newHeaders = {
            ...options.headers,
            'Authorization': `Bearer ${newToken}`,
          };
          resolve(fetchApi(path, { ...options, headers: newHeaders }));
        });
      });
    } else {
      // No refresh token available, clear authentication state
      const { clearAuth } = useAuthStore.getState();
      clearAuth();
    }
  }

  if (!response.ok) {
    let errorMessage = `HTTP error! status: ${response.status}`;
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch {
      // ignore
    }
    throw new Error(errorMessage);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export function getFullImageUrl(url: string | null | undefined): string | undefined {
  if (!url) return undefined;
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
    return url;
  }
  if (url.startsWith('/') && !url.startsWith('/api/')) {
    return url;
  }
  return `${API_BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
}
