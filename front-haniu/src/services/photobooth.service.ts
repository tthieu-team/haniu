import { fetchApi } from '@/lib/api';

export const photoboothService = {
  // Events
  getEvents: async (): Promise<any[]> => {
    return await fetchApi('/api/v1/photobooth/events');
  },

  saveEvent: async (event: any): Promise<any> => {
    return await fetchApi('/api/v1/photobooth/events', {
      method: 'POST',
      body: JSON.stringify(event)
    });
  },

  deleteEvent: async (id: string): Promise<void> => {
    await fetchApi(`/api/v1/photobooth/events/${id}`, { method: 'DELETE' });
  },

  // Templates
  getTemplates: async (): Promise<any[]> => {
    return await fetchApi('/api/v1/photobooth/templates');
  },

  saveTemplate: async (template: any): Promise<any> => {
    return await fetchApi('/api/v1/photobooth/templates', {
      method: 'POST',
      body: JSON.stringify(template)
    });
  },

  deleteTemplate: async (id: string): Promise<void> => {
    await fetchApi(`/api/v1/photobooth/templates/${id}`, { method: 'DELETE' });
  },

  // Assets
  getAssets: async (): Promise<any> => {
    return await fetchApi('/api/v1/photobooth/assets');
  },

  saveAsset: async (type: 'backgrounds' | 'stickers' | 'logos', asset: any): Promise<any> => {
    return await fetchApi(`/api/v1/photobooth/assets/${type}`, {
      method: 'POST',
      body: JSON.stringify(asset)
    });
  },

  deleteAsset: async (type: 'backgrounds' | 'stickers' | 'logos', id: string): Promise<void> => {
    await fetchApi(`/api/v1/photobooth/assets/${type}/${id}`, { method: 'DELETE' });
  },

  // Sessions
  getSessions: async (): Promise<any[]> => {
    return await fetchApi('/api/v1/photobooth/sessions');
  },

  saveSession: async (session: any): Promise<any> => {
    return await fetchApi('/api/v1/photobooth/sessions', {
      method: 'POST',
      body: JSON.stringify(session)
    });
  },

  deleteSession: async (id: string): Promise<void> => {
    await fetchApi(`/api/v1/photobooth/sessions/${id}`, { method: 'DELETE' });
  },

  // Settings
  getSettings: async (): Promise<any> => {
    return await fetchApi('/api/v1/photobooth/settings');
  },

  saveSettings: async (settings: any): Promise<any> => {
    return await fetchApi('/api/v1/photobooth/settings', {
      method: 'POST',
      body: JSON.stringify(settings)
    });
  }
};
