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

const normalizeCoupon = (c: any): CouponPayload => {
  if (!c) return c;
  const activeVal = c.active !== undefined ? c.active : (c.isActive !== undefined ? c.isActive : true);
  return {
    ...c,
    active: activeVal,
    isActive: activeVal,
    showInBanner: c.showInBanner !== undefined ? c.showInBanner : false,
  };
};

const preparePayload = (payload: CouponPayload): CouponPayload => {
  const activeVal = payload.active !== undefined ? payload.active : (payload.isActive !== undefined ? payload.isActive : true);
  return {
    ...payload,
    active: activeVal,
    isActive: activeVal,
    showInBanner: payload.showInBanner !== undefined ? payload.showInBanner : false,
  };
};

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
      const normalized = (data || []).map(normalizeCoupon);
      set({ coupons: normalized, loading: false });
      return normalized;
    } catch (err: any) {
      set({ loading: false, error: err.message || 'Lỗi lấy danh sách coupon' });
      return [];
    }
  },

  getCouponByCode: async (code) => {
    set({ loading: true, error: null });
    try {
      const data = await couponService.getCouponByCode(code);
      const normalized = normalizeCoupon(data);
      set({ loading: false });
      return normalized;
    } catch (err: any) {
      set({ loading: false, error: err.message || 'Lỗi lấy thông tin coupon' });
      return null;
    }
  },

  applyCoupon: async (code, subtotal) => {
    set({ loading: true, error: null });
    try {
      if (typeof window !== 'undefined') {
        const used = localStorage.getItem('haniu_used_coupons');
        const usedList = used ? JSON.parse(used) : [];
        if (usedList.includes(code)) {
          set({ error: 'Mã giảm giá này đã được bạn sử dụng rồi', loading: false });
          return null;
        }
      }

      const coupon = await couponService.getCouponByCode(code);
      const normalized = normalizeCoupon(coupon);
      if (!normalized || !normalized.active) {
        set({ error: 'Mã giảm giá không hợp lệ hoặc đã hết hạn', loading: false });
        return null;
      }

      if (normalized.minOrderValue && subtotal < normalized.minOrderValue) {
        set({
          error: `Đơn hàng tối thiểu ${normalized.minOrderValue.toLocaleString()}đ để dùng mã`,
          loading: false,
          // Reset discount since order no longer qualifies
          appliedCoupon: null,
          discountAmount: 0,
        });
        if (typeof window !== 'undefined') {
          localStorage.removeItem('haniu_active_coupon');
        }
        return null;
      }

      let discount = 0;
      if (normalized.discountType === 'PERCENT') {
        discount = subtotal * (normalized.discountValue / 100);
        if (normalized.maxDiscount && discount > normalized.maxDiscount) {
          discount = normalized.maxDiscount;
        }
      } else {
        discount = normalized.discountValue;
      }

      set({
        appliedCoupon: normalized,
        discountAmount: discount,
        error: null,
        loading: false,
      });

      if (typeof window !== 'undefined') {
        localStorage.setItem('haniu_active_coupon', code);
      }

      return normalized;
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
      const body = preparePayload(payload);
      const data = await couponService.createCoupon(body);
      const normalized = normalizeCoupon(data);
      set((state) => ({
        coupons: [normalized, ...state.coupons],
        loading: false,
      }));
      return normalized;
    } catch (err: any) {
      set({ loading: false, error: err.message || 'Lỗi tạo coupon' });
      throw err;
    }
  },

  updateCoupon: async (id, payload) => {
    set({ loading: true, error: null });
    try {
      const body = preparePayload(payload);
      const data = await couponService.updateCoupon(id, body);
      const normalized = normalizeCoupon(data);
      set((state) => ({
        coupons: state.coupons.map((c) => (c.id === id ? normalized : c)),
        loading: false,
      }));
      return normalized;
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
