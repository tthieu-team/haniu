import { fetchApi } from '@/lib/api';

export const systemConfigService = {
  getConfig: async (key: string) => {
    return fetchApi(`/api/v1/system-configs/${key}`);
  },

  updateConfig: async (key: string, value: any, options?: RequestInit) => {
    return fetchApi(`/api/v1/system-configs/${key}`, {
      method: 'POST',
      body: JSON.stringify(value),
      ...options,
    });
  },
};
