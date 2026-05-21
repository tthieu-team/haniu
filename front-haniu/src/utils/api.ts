const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

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

export async function fetchApi(path: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${path}`;
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('haniu_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const sessionId = getOrCreateSessionId();
    if (sessionId) {
      headers['X-Session-ID'] = sessionId;
    }
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
  });

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
