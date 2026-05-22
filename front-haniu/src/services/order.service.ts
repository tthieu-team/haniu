import { fetchApi } from '@/lib/api';

export interface OrderRequestPayload {
  cartId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  shippingProvince: string;
  shippingDistrict: string;
  shippingWard: string;
  shippingAddressLine: string;
  note?: string;
  paymentMethod: string;
  couponCode?: string;
}

export const orderService = {
  createOrder: async (payload: OrderRequestPayload) => {
    return fetchApi('/api/v1/orders', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  getOrderByCode: async (orderCode: string) => {
    return fetchApi(`/api/v1/orders/code/${orderCode}`);
  },

  getOrderByTrackingToken: async (token: string) => {
    return fetchApi(`/api/v1/orders/track?token=${token}`);
  },

  getMyOrders: async () => {
    return fetchApi('/api/v1/orders/my-orders');
  },

  updateOrderStatus: async (orderId: string, status: string) => {
    return fetchApi(`/api/v1/orders/${orderId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },

  updatePaymentStatus: async (orderId: string, status: string) => {
    return fetchApi(`/api/v1/orders/${orderId}/payment-status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },

  createPaymentLink: async (orderId: string, gateway: string) => {
    return fetchApi('/api/v1/payments/create-link', {
      method: 'POST',
      body: JSON.stringify({ orderId, gateway }),
    });
  }
};
