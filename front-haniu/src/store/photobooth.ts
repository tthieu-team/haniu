import { create } from 'zustand';
import { photoboothService } from '@/services/photobooth.service';
import { PhotoboothTemplate } from '@/components/product/photobooth/types';

interface PhotoboothSettings {
  countdown: number;
  defaultFrameColor: string;
  watermarkText: string;
  showDate: boolean;
  isSoundEnabled?: boolean;
}

interface PhotoboothState {
  events: any[];
  templates: any[];
  settings: PhotoboothSettings;
  activeEvents: any[];
  activeTemplates: PhotoboothTemplate[];
  loading: boolean;
  error: string | null;
  fetchPhotoboothData: () => Promise<void>;
}

export const usePhotoboothStore = create<PhotoboothState>((set, get) => ({
  events: [],
  templates: [],
  settings: {
    countdown: 5,
    defaultFrameColor: '#ffffff',
    watermarkText: '🎀 Haniu Photobooth',
    showDate: true,
  },
  activeEvents: [],
  activeTemplates: [],
  loading: false,
  error: null,

  fetchPhotoboothData: async () => {
    set({ loading: true, error: null });
    try {
      const [dbEvents, dbTemplates, dbSettings] = await Promise.all([
        photoboothService.getEvents(),
        photoboothService.getTemplates(),
        photoboothService.getSettings(),
      ]);

      // Parse Settings
      let parsedSettings = dbSettings;
      if (typeof dbSettings === 'string') {
        try {
          parsedSettings = JSON.parse(dbSettings);
        } catch (e) {
          parsedSettings = {};
        }
      }

      const settings: PhotoboothSettings = {
        countdown: parsedSettings?.countdown || 5,
        defaultFrameColor: parsedSettings?.defaultFrameColor || '#ffffff',
        watermarkText: parsedSettings?.watermarkText || '🎀 Haniu Photobooth',
        showDate: parsedSettings?.showDate !== undefined ? parsedSettings.showDate : true,
        isSoundEnabled: parsedSettings?.isSoundEnabled !== undefined ? parsedSettings.isSoundEnabled : true,
      };

      // Filter Active Events
      const activeEvents = (dbEvents || []).filter((e: any) => e.status === 'ACTIVE');

      // Get Active Template IDs from Active Events
      const activeTemplateIds = new Set<string>();
      activeEvents.forEach((event: any) => {
        if (event.templateIds && Array.isArray(event.templateIds)) {
          event.templateIds.forEach((id: string) => activeTemplateIds.add(id));
        }
      });

      // Filter templates belonging to active events and are status ACTIVE
      // If there are no active events, default to all ACTIVE templates
      let rawActiveTemplates = (dbTemplates || []).filter((t: any) => t.status === 'ACTIVE');
      if (activeEvents.length > 0) {
        rawActiveTemplates = rawActiveTemplates.filter((t: any) => activeTemplateIds.has(t.id));
      }

      // Map raw templates to components PhotoboothTemplate interface
      const activeTemplates: PhotoboothTemplate[] = rawActiveTemplates.map((t: any) => {
        let layers = t.layers;
        if (typeof layers === 'string') {
          try {
            layers = JSON.parse(layers);
          } catch (e) {
            layers = [];
          }
        }
        const canvasWidth = t.canvasWidth || 1200;
        const canvasHeight = t.canvasHeight || 800;
        const slots = (layers || [])
          .filter((l: any) => l.type === 'frame')
          .map((l: any) => ({
            x: ((l.x || 0) / 100) * canvasWidth,
            y: ((l.y || 0) / 100) * canvasHeight,
            width: ((l.width || 0) / 100) * canvasWidth,
            height: ((l.height || 0) / 100) * canvasHeight,
          }));

        return {
          id: t.id,
          name: t.name,
          layout: t.canvasWidth > t.canvasHeight ? 'grid' : 'strip',
          canvasWidth: t.canvasWidth || 1200,
          canvasHeight: t.canvasHeight || 800,
          background: t.background || '#ffffff',
          slots: slots.length > 0 ? slots : [{ x: 50, y: 50, width: 1100, height: 700 }],
          layers: layers || [],
        };
      });

      set({
        events: dbEvents || [],
        templates: dbTemplates || [],
        settings,
        activeEvents,
        activeTemplates,
        loading: false,
      });
    } catch (err: any) {
      console.error('Lỗi tải cấu hình photobooth:', err);
      set({
        loading: false,
        error: err.message || 'Lỗi tải cấu hình photobooth',
      });
    }
  },
}));
