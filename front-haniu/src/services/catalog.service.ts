import { fetchApi } from '@/lib/api';

export interface Occasion {
  id?: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  startDate?: string;
  endDate?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Recipient {
  id?: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Category {
  id?: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  bannerUrl?: string;
  sortOrder?: number;
  isActive: boolean;
  isFeatured?: boolean;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  parent?: Category | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface Brand {
  id?: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  isActive: boolean;
}

export interface Collection {
  id?: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  isActive: boolean;
}

export const catalogService = {
  // Occasions
  getAllOccasions: async (): Promise<Occasion[]> => {
    return fetchApi('/api/v1/catalog/occasions');
  },
  createOccasion: async (payload: Occasion): Promise<Occasion> => {
    return fetchApi('/api/v1/catalog/occasions', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
  deleteOccasion: async (id: string): Promise<void> => {
    return fetchApi(`/api/v1/catalog/occasions/${id}`, {
      method: 'DELETE',
    });
  },

  // Recipients
  getAllRecipients: async (): Promise<Recipient[]> => {
    return fetchApi('/api/v1/catalog/recipients');
  },
  createRecipient: async (payload: Recipient): Promise<Recipient> => {
    return fetchApi('/api/v1/catalog/recipients', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
  deleteRecipient: async (id: string): Promise<void> => {
    return fetchApi(`/api/v1/catalog/recipients/${id}`, {
      method: 'DELETE',
    });
  },

  // Categories
  getAllCategories: async (): Promise<Category[]> => {
    return fetchApi('/api/v1/catalog/categories');
  },
  createCategory: async (payload: Category): Promise<Category> => {
    return fetchApi('/api/v1/catalog/categories', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
  updateCategory: async (id: string, payload: Category): Promise<Category> => {
    return fetchApi(`/api/v1/catalog/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },
  deleteCategory: async (id: string): Promise<void> => {
    return fetchApi(`/api/v1/catalog/categories/${id}`, {
      method: 'DELETE',
    });
  },

  // Brands
  getAllBrands: async (): Promise<Brand[]> => {
    return fetchApi('/api/v1/catalog/brands');
  },
  createBrand: async (payload: Brand): Promise<Brand> => {
    return fetchApi('/api/v1/catalog/brands', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
  deleteBrand: async (id: string): Promise<void> => {
    return fetchApi(`/api/v1/catalog/brands/${id}`, {
      method: 'DELETE',
    });
  },

  // Collections
  getAllCollections: async (): Promise<Collection[]> => {
    return fetchApi('/api/v1/catalog/collections');
  },
  createCollection: async (payload: Collection): Promise<Collection> => {
    return fetchApi('/api/v1/catalog/collections', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
  deleteCollection: async (id: string): Promise<void> => {
    return fetchApi(`/api/v1/catalog/collections/${id}`, {
      method: 'DELETE',
    });
  },
};
