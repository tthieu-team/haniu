import { create } from 'zustand';
import { orderService, OrderRequestPayload } from '@/services/order.service';

export interface OrderItem {
  id: string;
  productName: string;
  variantName?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  customizationInfo?: string;
}

export interface Order {
  id: string;
  orderCode: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  totalPrice: number;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  orderedAt: string;
  shippingProvince: string;
  shippingDistrict: string;
  shippingWard: string;
  shippingAddressLine: string;
  note?: string;
  items: OrderItem[];
}

interface OrderState {
  orders: Order[];
  currentOrder: Order | null;
  loading: boolean;
  error: string | null;

  createOrder: (payload: OrderRequestPayload) => Promise<Order>;
  fetchOrderByCode: (orderCode: string) => Promise<Order | null>;
  fetchOrderByTrackingToken: (token: string) => Promise<Order | null>;
  fetchMyOrders: () => Promise<Order[]>;
  fetchAllOrders: () => Promise<Order[]>;
  updateOrderStatus: (orderId: string, status: string) => Promise<Order | null>;
  updatePaymentStatus: (orderId: string, status: string) => Promise<Order | null>;
  createPaymentLink: (orderId: string, gateway: string) => Promise<any>;
  clearCurrentOrder: () => void;
}

export const useOrderStore = create<OrderState>((set) => ({
  orders: [],
  currentOrder: null,
  loading: false,
  error: null,

  createOrder: async (payload) => {
    set({ loading: true, error: null });
    try {
      const data = await orderService.createOrder(payload);
      set((state) => ({
        orders: [data, ...state.orders],
        currentOrder: data,
        loading: false,
      }));
      return data;
    } catch (err: any) {
      set({ loading: false, error: err.message || 'Lỗi đặt hàng' });
      throw err;
    }
  },

  fetchOrderByCode: async (orderCode) => {
    set({ loading: true, error: null });
    try {
      const data = await orderService.getOrderByCode(orderCode);
      set({ currentOrder: data, loading: false });
      return data;
    } catch (err: any) {
      set({ loading: false, error: err.message || 'Lỗi lấy thông tin đơn hàng' });
      return null;
    }
  },

  fetchOrderByTrackingToken: async (token) => {
    set({ loading: true, error: null });
    try {
      const data = await orderService.getOrderByTrackingToken(token);
      set({ currentOrder: data, loading: false });
      return data;
    } catch (err: any) {
      set({ loading: false, error: err.message || 'Lỗi theo dõi đơn hàng' });
      return null;
    }
  },

  fetchMyOrders: async () => {
    set({ loading: true, error: null });
    try {
      const data = await orderService.getMyOrders();
      set({ orders: data || [], loading: false });
      return data || [];
    } catch (err: any) {
      set({ loading: false, error: err.message || 'Lỗi lấy danh sách đơn hàng' });
      return [];
    }
  },

  fetchAllOrders: async () => {
    set({ loading: true, error: null });
    try {
      const data = await orderService.getAllOrders();
      set({ orders: data || [], loading: false });
      return data || [];
    } catch (err: any) {
      set({ loading: false, error: err.message || 'Lỗi lấy tất cả đơn hàng' });
      return [];
    }
  },

  updateOrderStatus: async (orderId, status) => {
    set({ loading: true, error: null });
    try {
      const data = await orderService.updateOrderStatus(orderId, status);
      set((state) => ({
        orders: state.orders.map((o) => (o.id === orderId ? { ...o, orderStatus: status } : o)),
        currentOrder: state.currentOrder?.id === orderId ? { ...state.currentOrder, orderStatus: status } : state.currentOrder,
        loading: false,
      }));
      return data;
    } catch (err: any) {
      set({ loading: false, error: err.message || 'Lỗi cập nhật trạng thái đơn hàng' });
      throw err;
    }
  },

  updatePaymentStatus: async (orderId, status) => {
    set({ loading: true, error: null });
    try {
      const data = await orderService.updatePaymentStatus(orderId, status);
      set((state) => ({
        orders: state.orders.map((o) => (o.id === orderId ? { ...o, paymentStatus: status } : o)),
        currentOrder: state.currentOrder?.id === orderId ? { ...state.currentOrder, paymentStatus: status } : state.currentOrder,
        loading: false,
      }));
      return data;
    } catch (err: any) {
      set({ loading: false, error: err.message || 'Lỗi cập nhật trạng thái thanh toán' });
      throw err;
    }
  },

  createPaymentLink: async (orderId, gateway) => {
    set({ loading: true, error: null });
    try {
      const res = await orderService.createPaymentLink(orderId, gateway);
      set({ loading: false });
      return res;
    } catch (err: any) {
      set({ loading: false, error: err.message || 'Lỗi tạo liên kết thanh toán' });
      throw err;
    }
  },

  clearCurrentOrder: () => {
    set({ currentOrder: null });
  },
}));
