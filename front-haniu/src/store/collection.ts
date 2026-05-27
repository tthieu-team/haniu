import { create } from 'zustand';
import { catalogService, Collection } from '@/services/catalog.service';

interface CollectionState {
  collections: Collection[];
  loading: boolean;
  error: string | null;

  fetchCollections: () => Promise<Collection[]>;
  saveCollection: (payload: Collection) => Promise<Collection>;
  deleteCollection: (id: string) => Promise<void>;
}

const normalizeCollection = (c: any): Collection => {
  if (!c) return c;
  const activeVal = c.active !== undefined ? c.active : (c.isActive !== undefined ? c.isActive : true);
  return {
    ...c,
    active: activeVal,
    isActive: activeVal,
  };
};

const preparePayload = (payload: Collection): any => {
  const activeVal = payload.isActive !== undefined ? payload.isActive : ((payload as any).active !== undefined ? (payload as any).active : true);
  return {
    ...payload,
    active: activeVal,
    isActive: activeVal,
  };
};

export const useCollectionStore = create<CollectionState>((set) => ({
  collections: [],
  loading: false,
  error: null,

  fetchCollections: async () => {
    set({ loading: true, error: null });
    try {
      const data = await catalogService.getAllCollections();
      const normalized = (data || []).map(normalizeCollection);
      set({ collections: normalized, loading: false });
      return normalized;
    } catch (err: any) {
      set({ loading: false, error: err.message || 'Lỗi lấy danh sách bộ sưu tập' });
      return [];
    }
  },

  saveCollection: async (payload) => {
    set({ loading: true, error: null });
    try {
      const body = preparePayload(payload);
      let data;
      if (payload.id) {
        data = await catalogService.updateCollection(payload.id, body);
      } else {
        data = await catalogService.createCollection(body);
      }
      const normalized = normalizeCollection(data);
      set((state) => {
        const exists = state.collections.some((c) => c.id === normalized.id);
        const updatedCollections = exists
          ? state.collections.map((c) => (c.id === normalized.id ? normalized : c))
          : [normalized, ...state.collections];
        return {
          collections: updatedCollections,
          loading: false,
        };
      });
      return normalized;
    } catch (err: any) {
      set({ loading: false, error: err.message || 'Lỗi lưu thông tin bộ sưu tập' });
      throw err;
    }
  },

  deleteCollection: async (id) => {
    set({ loading: true, error: null });
    try {
      await catalogService.deleteCollection(id);
      set((state) => ({
        collections: state.collections.filter((c) => c.id !== id),
        loading: false,
      }));
    } catch (err: any) {
      set({ loading: false, error: err.message || 'Lỗi xóa bộ sưu tập' });
      throw err;
    }
  },
}));
