import { create } from 'zustand';
import { catalogService, Category } from '@/services/catalog.service';

interface CategoryState {
  categories: Category[];
  loading: boolean;
  error: string | null;

  fetchCategories: () => Promise<Category[]>;
  createCategory: (payload: Category) => Promise<Category>;
  updateCategory: (id: string, payload: Category) => Promise<Category>;
  deleteCategory: (id: string) => Promise<void>;
}

const normalizeCategory = (c: any): Category => {
  if (!c) return c;
  const activeVal = c.active !== undefined ? c.active : (c.isActive !== undefined ? c.isActive : true);
  const featuredVal = c.featured !== undefined ? c.featured : (c.isFeatured !== undefined ? c.isFeatured : false);
  return {
    ...c,
    active: activeVal,
    isActive: activeVal,
    featured: featuredVal,
    isFeatured: featuredVal,
    parent: c.parent ? normalizeCategory(c.parent) : null,
  };
};

const preparePayload = (payload: Category): any => {
  const activeVal = payload.isActive !== undefined ? payload.isActive : ((payload as any).active !== undefined ? (payload as any).active : true);
  const featuredVal = payload.isFeatured !== undefined ? payload.isFeatured : ((payload as any).featured !== undefined ? (payload as any).featured : false);
  return {
    ...payload,
    active: activeVal,
    isActive: activeVal,
    featured: featuredVal,
    isFeatured: featuredVal,
    parent: payload.parent ? preparePayload(payload.parent) : null,
  };
};

export const useCategoryStore = create<CategoryState>((set) => ({
  categories: [],
  loading: false,
  error: null,

  fetchCategories: async () => {
    set({ loading: true, error: null });
    try {
      const data = await catalogService.getAllCategories();
      const normalized = (data || []).map(normalizeCategory);
      set({ categories: normalized, loading: false });
      return normalized;
    } catch (err: any) {
      set({ loading: false, error: err.message || 'Lỗi lấy danh sách danh mục' });
      return [];
    }
  },

  createCategory: async (payload) => {
    set({ loading: true, error: null });
    try {
      const body = preparePayload(payload);
      const data = await catalogService.createCategory(body);
      const normalized = normalizeCategory(data);
      set((state) => ({
        categories: [normalized, ...state.categories],
        loading: false,
      }));
      return normalized;
    } catch (err: any) {
      set({ loading: false, error: err.message || 'Lỗi thêm danh mục mới' });
      throw err;
    }
  },

  updateCategory: async (id, payload) => {
    set({ loading: true, error: null });
    try {
      const body = preparePayload(payload);
      const data = await catalogService.updateCategory(id, body);
      const normalized = normalizeCategory(data);
      set((state) => ({
        categories: state.categories.map((c) => (c.id === id ? normalized : c)),
        loading: false,
      }));
      return normalized;
    } catch (err: any) {
      set({ loading: false, error: err.message || 'Lỗi cập nhật danh mục' });
      throw err;
    }
  },

  deleteCategory: async (id) => {
    set({ loading: true, error: null });
    try {
      await catalogService.deleteCategory(id);
      set((state) => ({
        categories: state.categories.filter((c) => c.id !== id),
        loading: false,
      }));
    } catch (err: any) {
      set({ loading: false, error: err.message || 'Lỗi xóa danh mục' });
      throw err;
    }
  },
}));
