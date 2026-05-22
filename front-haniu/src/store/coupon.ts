import { create } from 'zustand';
import { couponService, CouponPayload } from '@/services/coupon.service';

interface CouponState {
  coupons: CouponPayload[];
  appliedCoupon: CouponPayload | null;
  discountAmount: number;
  loading: boolean;
  error: string | null;

  fetchCoupons: () => Promise<CouponPayload[]>;
  getCouponByCode: (code: string) => Promise<CouponPayload | null>;
  applyCoupon: (code: string, subtotal: number) => Promise<CouponPayload | null>;
  clearAppliedCoupon: () => void;
  createCoupon: (payload: CouponPayload) => Promise<CouponPayload>;
  updateCoupon: (id: string, payload: CouponPayload) => Promise<CouponPayload>;
  deleteCoupon: (id: string) => Promise<void>;
}

export const useCouponStore = create<CouponState>((set, get) => ({
  coupons: [],
  appliedCoupon: null,
  discountAmount: 0,
  loading: false,
  error: null,

  fetchCoupons: async () => {
    set({ loading: true, error: null });
    try {
      const data = await couponService.getAllCoupons();
      set({ coupons: data || [], loading: false });
      return data || [];
    } catch (err: any) {
      set({ loading: false, error: err.message || 'Lỗi lấy danh sách coupon' });
      return [];
    }
  },

  getCouponByCode: async (code) => {
    set({ loading: true, error: null });
    try {
      const data = await couponService.getCouponByCode(code);
      set({ loading: false });
      return data;
    } catch (err: any) {
      set({ loading: false, error: err.message || 'Lỗi lấy thông tin coupon' });
      return null;
    }
  },

  applyCoupon: async (code, subtotal) => {
    set({ loading: true, error: null });
    try {
      const coupon = await couponService.getCouponByCode(code);
      if (!coupon || !coupon.active) {
        set({ error: 'Mã giảm giá không hợp lệ hoặc đã hết hạn', loading: false });
        return null;
      }

      if (coupon.minOrderValue && subtotal < coupon.minOrderValue) {
        set({
          error: `Đơn hàng tối thiểu ${coupon.minOrderValue.toLocaleString()}đ để dùng mã`,
          loading: false,
        });
        return null;
      }

      let discount = 0;
      if (coupon.discountType === 'PERCENT') {
        discount = subtotal * (coupon.discountValue / 100);
        if (coupon.maxDiscount && discount > coupon.maxDiscount) {
          discount = coupon.maxDiscount;
        }
      } else {
        discount = coupon.discountValue;
      }

      set({
        appliedCoupon: coupon,
        discountAmount: discount,
        error: null,
        loading: false,
      });

      if (typeof window !== 'undefined') {
        localStorage.setItem('haniu_active_coupon', code);
      }

      return coupon;
    } catch (err: any) {
      set({
        error: err.message || 'Mã giảm giá không chính xác',
        loading: false,
      });
      return null;
    }
  },

  clearAppliedCoupon: () => {
    set({ appliedCoupon: null, discountAmount: 0, error: null });
    if (typeof window !== 'undefined') {
      localStorage.removeItem('haniu_active_coupon');
    }
  },

  createCoupon: async (payload) => {
    set({ loading: true, error: null });
    try {
      const data = await couponService.createCoupon(payload);
      set((state) => ({
        coupons: [data, ...state.coupons],
        loading: false,
      }));
      return data;
    } catch (err: any) {
      set({ loading: false, error: err.message || 'Lỗi tạo coupon' });
      throw err;
    }
  },

  updateCoupon: async (id, payload) => {
    set({ loading: true, error: null });
    try {
      const data = await couponService.updateCoupon(id, payload);
      set((state) => ({
        coupons: state.coupons.map((c) => (c.id === id ? data : c)),
        loading: false,
      }));
      return data;
    } catch (err: any) {
      set({ loading: false, error: err.message || 'Lỗi cập nhật coupon' });
      throw err;
    }
  },

  deleteCoupon: async (id) => {
    set({ loading: true, error: null });
    try {
      await couponService.deleteCoupon(id);
      set((state) => ({
        coupons: state.coupons.filter((c) => c.id !== id),
        loading: false,
      }));
    } catch (err: any) {
      set({ loading: false, error: err.message || 'Lỗi xóa coupon' });
      throw err;
    }
  },
}));
