import { create } from 'zustand';
import { catalogService, Occasion } from '@/services/catalog.service';

interface OccasionState {
  occasions: Occasion[];
  loading: boolean;
  error: string | null;

  fetchOccasions: () => Promise<Occasion[]>;
  saveOccasion: (payload: Occasion) => Promise<Occasion>;
  deleteOccasion: (id: string) => Promise<void>;
}

const normalizeOccasion = (o: any): Occasion => {
  if (!o) return o;
  const activeVal = o.active !== undefined ? o.active : (o.isActive !== undefined ? o.isActive : true);
  return {
    ...o,
    active: activeVal,
    isActive: activeVal,
  };
};

const preparePayload = (payload: Occasion): any => {
  const activeVal = payload.isActive !== undefined ? payload.isActive : ((payload as any).active !== undefined ? (payload as any).active : true);
  return {
    ...payload,
    active: activeVal,
    isActive: activeVal,
  };
};

export const useOccasionStore = create<OccasionState>((set) => ({
  occasions: [],
  loading: false,
  error: null,

  fetchOccasions: async () => {
    set({ loading: true, error: null });
    try {
      const data = await catalogService.getAllOccasions();
      const normalized = (data || []).map(normalizeOccasion);
      set({ occasions: normalized, loading: false });
      return normalized;
    } catch (err: any) {
      set({ loading: false, error: err.message || 'Lỗi lấy danh sách dịp lễ' });
      return [];
    }
  },

  saveOccasion: async (payload) => {
    set({ loading: true, error: null });
    try {
      const body = preparePayload(payload);
      let data;
      if (payload.id) {
        data = await catalogService.updateOccasion(payload.id, body);
      } else {
        data = await catalogService.createOccasion(body);
      }
      const normalized = normalizeOccasion(data);
      set((state) => {
        const exists = state.occasions.some((o) => o.id === normalized.id);
        const updatedOccasions = exists
          ? state.occasions.map((o) => (o.id === normalized.id ? normalized : o))
          : [normalized, ...state.occasions];
        return {
          occasions: updatedOccasions,
          loading: false,
        };
      });
      return normalized;
    } catch (err: any) {
      set({ loading: false, error: err.message || 'Lỗi lưu thông tin dịp lễ' });
      throw err;
    }
  },

  deleteOccasion: async (id) => {
    set({ loading: true, error: null });
    try {
      await catalogService.deleteOccasion(id);
      set((state) => ({
        occasions: state.occasions.filter((o) => o.id !== id),
        loading: false,
      }));
    } catch (err: any) {
      set({ loading: false, error: err.message || 'Lỗi xóa dịp lễ' });
      throw err;
    }
  },
}));
