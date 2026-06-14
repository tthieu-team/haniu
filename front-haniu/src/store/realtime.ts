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

  initSocket: () => {
    if (get().socket) return;

    console.log('🔌 Initializing native WebSocket Connection to:', SOCKET_URL);
    const ws = new WebSocket(SOCKET_URL);

    ws.onopen = () => {
      console.log('🟢 WebSocket connected');
      set({ connected: true });
      get().fetchNotifications();
    };

    ws.onclose = () => {
      console.log('🔴 WebSocket disconnected');
      set({ connected: false, socket: null });
      // Reconnect after 5 seconds
      setTimeout(() => {
        if (get().socket === null) {
          get().initSocket();
        }
      }, 5000);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        console.log('📩 Realtime event received:', payload);
        if (payload.event === 'realtime.notification.created') {
          // Re-fetch all notifications from database to guarantee synchronization of DB IDs and values
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
      set({ socket: null, connected: false });
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
    // Optimistic UI update
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
    // Optimistic UI update
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
