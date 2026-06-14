'use client';

import { create } from 'zustand';
import { fetchApi } from '@/lib/api';

export interface NotificationItem {
  id: string;
  orderCode: string;
  customerName: string;
  totalPrice: number;
  paymentMethod: string;
  orderedAt: string;
  unread: boolean;
}

interface RealtimeState {
  socket: WebSocket | null;
  notifications: NotificationItem[];
  unreadCount: number;
  connected: boolean;
  reconnectAttempts: number;
  initSocket: () => void;
  disconnectSocket: () => void;
  fetchNotifications: () => Promise<void>;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
}

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'ws://localhost:8000/realtime';

export const useRealtimeStore = create<RealtimeState>((set, get) => ({
  socket: null,
  notifications: [],
  unreadCount: 0,
  connected: false,
  reconnectAttempts: 0,

  initSocket: () => {
    if (get().socket) return;

    console.log('🔌 Initializing native WebSocket Connection to:', SOCKET_URL);
    const ws = new WebSocket(SOCKET_URL);

    ws.onopen = () => {
      console.log('🟢 WebSocket connected');
      set({ connected: true, reconnectAttempts: 0 });
      get().fetchNotifications();
    };

    ws.onclose = () => {
      console.log('🔴 WebSocket disconnected');
      set({ connected: false, socket: null });
      
      const attempts = get().reconnectAttempts;
      // Exponential backoff: starts at 5s, grows by 1.5x up to max 60s
      const delay = Math.min(5000 * Math.pow(1.5, attempts), 60000);
      set({ reconnectAttempts: attempts + 1 });
      
      console.log(`⏳ Reconnecting in ${(delay / 1000).toFixed(1)}s (Attempt ${attempts + 1})...`);
      setTimeout(() => {
        // Only reconnect if no active socket has been re-established
        if (get().socket === null) {
          get().initSocket();
        }
      }, delay);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        console.log('📩 Realtime event received:', payload);
        if (payload.event === 'realtime.notification.created') {
          get().fetchNotifications();
        }
      } catch (err) {
        console.error('Failed to parse WebSocket message:', err);
      }
    };

    set({ socket: ws });
  },

  disconnectSocket: () => {
    const { socket } = get();
    if (socket) {
      socket.close();
      set({ socket: null, connected: false, reconnectAttempts: 0 });
    }
  },

  fetchNotifications: async () => {
    try {
      const data = await fetchApi('/api/v1/notifications');
      if (!Array.isArray(data)) return;
      
      const mapped: NotificationItem[] = data.map((n: any) => {
        const orderCode = n.title.split('#')[1] || 'ORDER';
        const customerName = n.content.split('Khách hàng ')[1]?.split(' vừa đặt')[0] || 'Khách hàng';
        const totalPrice = parseFloat(n.content.split('trị giá ')[1]?.split(' đ')[0]) || 0;
        
        return {
          id: n.id,
          orderCode,
          customerName,
          totalPrice,
          paymentMethod: 'COD',
          orderedAt: n.createdAt,
          unread: !n.read,
        };
      });

      set({ 
        notifications: mapped,
        unreadCount: mapped.filter((n) => n.unread).length
      });
    } catch (err) {
      console.error('Failed to fetch notifications from DB:', err);
    }
  },

  markAsRead: async (id) => {
    set((state) => {
      const updated = state.notifications.map((n) =>
        n.id === id ? { ...n, unread: false } : n
      );
      return {
        notifications: updated,
        unreadCount: updated.filter((n) => n.unread).length,
      };
    });

    try {
      await fetchApi(`/api/v1/notifications/${id}/read`, { method: 'PUT' });
    } catch (err) {
      console.error('Failed to mark notification as read in DB:', err);
    }
  },

  markAllAsRead: async () => {
    set((state) => {
      const updated = state.notifications.map((n) => ({ ...n, unread: false }));
      return {
        notifications: updated,
        unreadCount: 0,
      };
    });

    try {
      await fetchApi('/api/v1/notifications/read-all', { method: 'PUT' });
    } catch (err) {
      console.error('Failed to mark all notifications as read in DB:', err);
    }
  },
}));
