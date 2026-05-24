import { fetchApi } from '@/lib/api';

export interface CouponPayload {
  id?: string;
  code: string;
  name: string;
  description?: string;
  discountType: string; // PERCENT, FIXED
  discountValue: number;
  minOrderValue?: number;
  maxDiscount?: number;
  usageLimit?: number;
  startDate?: string;
  endDate?: string;
  active: boolean;
  isActive?: boolean;
}

export const couponService = {
  getAllCoupons: async () => {
    return fetchApi('/api/v1/coupons');
  },

  getCouponByCode: async (code: string) => {
    return fetchApi(`/api/v1/coupons/code/${code}`);
  },

  createCoupon: async (payload: CouponPayload) => {
    return fetchApi('/api/v1/coupons', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  updateCoupon: async (id: string, payload: CouponPayload) => {
    return fetchApi(`/api/v1/coupons/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  deleteCoupon: async (id: string) => {
    return fetchApi(`/api/v1/coupons/${id}`, {
      method: 'DELETE',
    });
  }
};
