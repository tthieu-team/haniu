import { create } from 'zustand';
import { productService, ProductRequestPayload } from '@/services/product.service';

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  description: string;
  basePrice: number;
  salePrice?: number;
  stock: number;
  isFeatured: boolean;
  isNew: boolean;
  isCustomizable: boolean;
  status: string;
  category?: { id: string; name: string };
  brand?: { id: string; name: string };
  collection?: { id: string; name: string };
  specifications?: string;
  occasions?: Array<{ id: string; name: string }>;
  recipients?: Array<{ id: string; name: string }>;
  media?: Array<{ id: string; url: string; type: string; isThumbnail: boolean; altText: string; sortOrder: number }>;
  variants?: Array<{ id: string; sku: string; name: string; color: string; size: string; material: string; price: number; salePrice?: number; stock: number; weight?: number; imageUrl?: string }>;
}

interface ProductState {
  products: Product[];
  currentProduct: Product | null;
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
  };

  fetchProducts: (filters?: any) => Promise<any>;
  fetchProductBySlug: (slug: string) => Promise<Product | null>;
  fetchProductById: (id: string) => Promise<Product | null>;
  searchProducts: (query: string, page?: number, size?: number) => Promise<any>;
  createProduct: (payload: ProductRequestPayload) => Promise<Product>;
  updateProduct: (id: string, payload: ProductRequestPayload) => Promise<Product>;
  deleteProduct: (id: string) => Promise<void>;
  clearCurrentProduct: () => void;
}

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  currentProduct: null,
  loading: false,
  error: null,
  pagination: {
    page: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0,
  },

  fetchProducts: async (filters) => {
    set({ loading: true, error: null });
    try {
      const res = await productService.getProducts(filters);
      // Backend paginated structure or fallback array
      if (res && res.content) {
        set({
          products: res.content,
          pagination: {
            page: res.number || 0,
            size: res.size || 10,
            totalElements: res.totalElements || 0,
            totalPages: res.totalPages || 0,
          },
          loading: false,
        });
      } else if (Array.isArray(res)) {
        set({
          products: res,
          pagination: { page: 0, size: res.length, totalElements: res.length, totalPages: 1 },
          loading: false,
        });
      } else {
        set({ products: [], loading: false });
      }
      return res;
    } catch (err: any) {
      set({ loading: false, error: err.message || 'Lỗi lấy danh sách sản phẩm' });
      return null;
    }
  },

  fetchProductBySlug: async (slug) => {
    set({ loading: true, error: null });
    try {
      const data = await productService.getProductBySlug(slug);
      set({ currentProduct: data, loading: false });
      return data;
    } catch (err: any) {
      set({ loading: false, error: err.message || 'Lỗi lấy chi tiết sản phẩm' });
      return null;
    }
  },

  fetchProductById: async (id) => {
    set({ loading: true, error: null });
    try {
      const data = await productService.getProductById(id);
      set({ currentProduct: data, loading: false });
      return data;
    } catch (err: any) {
      set({ loading: false, error: err.message || 'Lỗi lấy chi tiết sản phẩm' });
      return null;
    }
  },

  searchProducts: async (query, page = 0, size = 10) => {
    set({ loading: true, error: null });
    try {
      const res = await productService.searchProducts(query, page, size);
      if (res && res.content) {
        set({
          products: res.content,
          pagination: {
            page: res.number || 0,
            size: res.size || 10,
            totalElements: res.totalElements || 0,
            totalPages: res.totalPages || 0,
          },
          loading: false,
        });
      } else if (Array.isArray(res)) {
        set({
          products: res,
          pagination: { page: 0, size: res.length, totalElements: res.length, totalPages: 1 },
          loading: false,
        });
      }
      return res;
    } catch (err: any) {
      set({ loading: false, error: err.message || 'Lỗi tìm kiếm sản phẩm' });
      return null;
    }
  },

  createProduct: async (payload) => {
    set({ loading: true, error: null });
    try {
      const data = await productService.createProduct(payload);
      set((state) => ({
        products: [data, ...state.products],
        loading: false,
      }));
      return data;
    } catch (err: any) {
      set({ loading: false, error: err.message || 'Lỗi thêm sản phẩm' });
      throw err;
    }
  },

  updateProduct: async (id, payload) => {
    set({ loading: true, error: null });
    try {
      const data = await productService.updateProduct(id, payload);
      set((state) => ({
        products: state.products.map((p) => (p.id === id ? data : p)),
        currentProduct: state.currentProduct?.id === id ? data : state.currentProduct,
        loading: false,
      }));
      return data;
    } catch (err: any) {
      set({ loading: false, error: err.message || 'Lỗi cập nhật sản phẩm' });
      throw err;
    }
  },

  deleteProduct: async (id) => {
    set({ loading: true, error: null });
    try {
      await productService.deleteProduct(id);
      set((state) => ({
        products: state.products.filter((p) => p.id !== id),
        loading: false,
      }));
    } catch (err: any) {
      set({ loading: false, error: err.message || 'Lỗi xóa sản phẩm' });
      throw err;
    }
  },

  clearCurrentProduct: () => {
    set({ currentProduct: null });
  },
}));
