import { fetchApi, API_BASE_URL } from '@/lib/api';

export interface ProductRequestPayload {
  name: string;
  slug: string;
  sku: string;
  description: string;
  categoryId: string;
  brandId?: string | null;
  collectionId?: string | null;
  basePrice: number;
  salePrice?: number | null;
  stock: number;
  isFeatured: boolean;
  isNew: boolean;
  isCustomizable: boolean;
  status: string;
  layoutTemplate?: string;
  layoutConfig?: string;
  specifications?: string;
  includedItems?: string;
  occasions?: string[];
  recipients?: string[];
  variants?: any[];
  media?: any[];
}

export const productService = {
  getProducts: async (filters: {
    categoryId?: string;
    brandId?: string;
    collectionId?: string;
    isFeatured?: boolean;
    isNew?: boolean;
    occasionSlug?: string;
    recipientSlug?: string;
    status?: string;
    page?: number;
    size?: number;
    sortBy?: string;
    sortDir?: string;
  } = {}) => {
    const params = new URLSearchParams();
    if (filters.categoryId) params.append('categoryId', filters.categoryId);
    if (filters.brandId) params.append('brandId', filters.brandId);
    if (filters.collectionId) params.append('collectionId', filters.collectionId);
    if (filters.isFeatured !== undefined) params.append('isFeatured', String(filters.isFeatured));
    if (filters.isNew !== undefined) params.append('isNew', String(filters.isNew));
    if (filters.occasionSlug) params.append('occasionSlug', filters.occasionSlug);
    if (filters.recipientSlug) params.append('recipientSlug', filters.recipientSlug);
    if (filters.status) params.append('status', filters.status);
    if (filters.page !== undefined) params.append('page', String(filters.page));
    if (filters.size !== undefined) params.append('size', String(filters.size));
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    if (filters.sortDir) params.append('sortDir', filters.sortDir);

    const queryStr = params.toString();
    return fetchApi(`/api/v1/products${queryStr ? `?${queryStr}` : ''}`);
  },

  getProductsCursor: async (filters: {
    categoryId?: string;
    brandId?: string;
    collectionId?: string;
    isFeatured?: boolean;
    isNew?: boolean;
    occasionSlug?: string;
    recipientSlug?: string;
    cursor?: string;
    size?: number;
  } = {}) => {
    const params = new URLSearchParams();
    if (filters.categoryId) params.append('categoryId', filters.categoryId);
    if (filters.brandId) params.append('brandId', filters.brandId);
    if (filters.collectionId) params.append('collectionId', filters.collectionId);
    if (filters.isFeatured !== undefined) params.append('isFeatured', String(filters.isFeatured));
    if (filters.isNew !== undefined) params.append('isNew', String(filters.isNew));
    if (filters.occasionSlug) params.append('occasionSlug', filters.occasionSlug);
    if (filters.recipientSlug) params.append('recipientSlug', filters.recipientSlug);
    if (filters.cursor) params.append('cursor', filters.cursor);
    if (filters.size !== undefined) params.append('size', String(filters.size));

    const queryStr = params.toString();
    return fetchApi(`/api/v1/products/cursor${queryStr ? `?${queryStr}` : ''}`);
  },

  searchProducts: async (query: string, page = 0, size = 10) => {
    return fetchApi(`/api/v1/products/search?q=${encodeURIComponent(query)}&page=${page}&size=${size}`);
  },

  getProductById: async (id: string) => {
    return fetchApi(`/api/v1/products/${id}`);
  },

  getProductBySlug: async (slug: string) => {
    return fetchApi(`/api/v1/products/slug/${slug}`);
  },

  createProduct: async (payload: ProductRequestPayload) => {
    return fetchApi('/api/v1/products', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  updateProduct: async (id: string, payload: ProductRequestPayload) => {
    return fetchApi(`/api/v1/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  deleteProduct: async (id: string) => {
    return fetchApi(`/api/v1/products/${id}`, {
      method: 'DELETE',
    });
  },

  uploadImage: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/api/v1/uploads`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Tải tập tin lên thất bại.');
    }

    return response.json();
  },

  deleteFile: async (url: string) => {
    return fetchApi(`/api/v1/uploads?url=${encodeURIComponent(url)}`, {
      method: 'DELETE',
    });
  }
};
