import { create } from 'zustand';
import { ugcService, UgcItemPayload } from '@/services/ugc.service';

interface UgcState {
  ugcItems: UgcItemPayload[];
  activeUgcItems: UgcItemPayload[];
  loading: boolean;
  error: string | null;

  fetchUgcItems: () => Promise<UgcItemPayload[]>;
  fetchActiveUgcItems: () => Promise<UgcItemPayload[]>;
  createUgcItem: (payload: UgcItemPayload) => Promise<UgcItemPayload>;
  updateUgcItem: (id: string, payload: UgcItemPayload) => Promise<UgcItemPayload>;
  deleteUgcItem: (id: string) => Promise<void>;
}

export const useUgcStore = create<UgcState>((set) => ({
  ugcItems: [],
  activeUgcItems: [],
  loading: false,
  error: null,

  fetchUgcItems: async () => {
    set({ loading: true, error: null });
    try {
      const data = await ugcService.getAllUgcItems();
      set({ ugcItems: data || [], loading: false });
      return data || [];
    } catch (err: any) {
      set({ loading: false, error: err.message || 'Lỗi lấy danh sách hình ảnh Instagram' });
      return [];
    }
  },

  fetchActiveUgcItems: async () => {
    set({ loading: true, error: null });
    try {
      const data = await ugcService.getActiveUgcItems();
      set({ activeUgcItems: data || [], loading: false });
      return data || [];
    } catch (err: any) {
      set({ loading: false, error: err.message || 'Lỗi lấy danh sách hình ảnh hoạt động' });
      return [];
    }
  },

  createUgcItem: async (payload) => {
    set({ loading: true, error: null });
    try {
      const data = await ugcService.createUgcItem(payload);
      set((state) => ({
        ugcItems: [data, ...state.ugcItems],
        loading: false,
      }));
      return data;
    } catch (err: any) {
      set({ loading: false, error: err.message || 'Lỗi thêm hình ảnh mới' });
      throw err;
    }
  },

  updateUgcItem: async (id, payload) => {
    set({ loading: true, error: null });
    try {
      const data = await ugcService.updateUgcItem(id, payload);
      set((state) => ({
        ugcItems: state.ugcItems.map((u) => (u.id === id ? data : u)),
        loading: false,
      }));
      return data;
    } catch (err: any) {
      set({ loading: false, error: err.message || 'Lỗi cập nhật hình ảnh' });
      throw err;
    }
  },

  deleteUgcItem: async (id) => {
    set({ loading: true, error: null });
    try {
      await ugcService.deleteUgcItem(id);
      set((state) => ({
        ugcItems: state.ugcItems.filter((u) => u.id !== id),
        loading: false,
      }));
    } catch (err: any) {
      set({ loading: false, error: err.message || 'Lỗi xóa hình ảnh' });
      throw err;
    }
  },
}));
