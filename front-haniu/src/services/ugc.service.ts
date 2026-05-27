import { fetchApi } from '@/lib/api';

export interface UgcItemPayload {
  id?: string;
  imageUrl: string;
  link?: string;
  active: boolean;
}

export const ugcService = {
  getActiveUgcItems: async (): Promise<UgcItemPayload[]> => {
    return fetchApi('/api/v1/ugc-items');
  },

  getAllUgcItems: async (): Promise<UgcItemPayload[]> => {
    return fetchApi('/api/v1/ugc-items/all');
  },

  createUgcItem: async (payload: UgcItemPayload): Promise<UgcItemPayload> => {
    return fetchApi('/api/v1/ugc-items', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  updateUgcItem: async (id: string, payload: UgcItemPayload): Promise<UgcItemPayload> => {
    return fetchApi(`/api/v1/ugc-items/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  deleteUgcItem: async (id: string): Promise<void> => {
    return fetchApi(`/api/v1/ugc-items/${id}`, {
      method: 'DELETE',
    });
  },
};
