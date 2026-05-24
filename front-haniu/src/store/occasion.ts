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

export const useOccasionStore = create<OccasionState>((set) => ({
  occasions: [],
  loading: false,
  error: null,

  fetchOccasions: async () => {
    set({ loading: true, error: null });
    try {
      const data = await catalogService.getAllOccasions();
      set({ occasions: data || [], loading: false });
      return data || [];
    } catch (err: any) {
      set({ loading: false, error: err.message || 'Lỗi lấy danh sách dịp lễ' });
      return [];
    }
  },

  saveOccasion: async (payload) => {
    set({ loading: true, error: null });
    try {
      const data = await catalogService.createOccasion(payload);
      set((state) => {
        const exists = state.occasions.some((o) => o.id === data.id);
        const updatedOccasions = exists
          ? state.occasions.map((o) => (o.id === data.id ? data : o))
          : [data, ...state.occasions];
        return {
          occasions: updatedOccasions,
          loading: false,
        };
      });
      return data;
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
