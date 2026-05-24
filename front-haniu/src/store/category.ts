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

export const useCategoryStore = create<CategoryState>((set) => ({
  categories: [],
  loading: false,
  error: null,

  fetchCategories: async () => {
    set({ loading: true, error: null });
    try {
      const data = await catalogService.getAllCategories();
      set({ categories: data || [], loading: false });
      return data || [];
    } catch (err: any) {
      set({ loading: false, error: err.message || 'Lỗi lấy danh sách danh mục' });
      return [];
    }
  },

  createCategory: async (payload) => {
    set({ loading: true, error: null });
    try {
      const data = await catalogService.createCategory(payload);
      set((state) => ({
        categories: [data, ...state.categories],
        loading: false,
      }));
      return data;
    } catch (err: any) {
      set({ loading: false, error: err.message || 'Lỗi thêm danh mục mới' });
      throw err;
    }
  },

  updateCategory: async (id, payload) => {
    set({ loading: true, error: null });
    try {
      const data = await catalogService.updateCategory(id, payload);
      set((state) => ({
        categories: state.categories.map((c) => (c.id === id ? data : c)),
        loading: false,
      }));
      return data;
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
