import { create } from 'zustand';
import { photoboothService } from '@/services/photobooth.service';
import { PhotoboothTemplate } from '@/components/product/photobooth/types';

export interface PhotoboothSettings {
  countdown: number;
  isSoundEnabled: boolean;
  isFilterEnabled: boolean;
}

export const normalizePhotoboothTemplate = (t: any): PhotoboothTemplate => {
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
    .sort((a: any, b: any) => (a.order || 0) - (b.order || 0))
    .map((l: any) => ({
      x: ((l.x || 0) / 100) * canvasWidth,
      y: ((l.y || 0) / 100) * canvasHeight,
      width: ((l.width || 0) / 100) * canvasWidth,
      height: ((l.height || 0) / 100) * canvasHeight,
      frameShape: l.frameShape || 'rect',
      framePath: l.framePath || '',
      framePolygon: l.framePolygon || '',
      frameMaskUrl: l.frameMaskUrl || '',
      borderSize: l.borderSize,
      borderColor: l.borderColor,
      cornerRadius: l.cornerRadius,
      rotation: l.rotation || 0,
      opacity: l.opacity ?? 100,
    }));

  return {
    ...t,
    id: t.id,
    name: t.name,
    layout: t.canvasWidth > t.canvasHeight ? 'grid' : 'strip',
    canvasWidth: t.canvasWidth || 1200,
    canvasHeight: t.canvasHeight || 800,
    background: t.background || '#ffffff',
    slots: slots.length > 0 ? slots : [{ x: 50, y: 50, width: 1100, height: 700 }],
    layers: layers || [],
  };
};

interface PhotoboothState {
  events: any[];
  templates: any[];
  settings: PhotoboothSettings;
  activeEvents: any[];
  activeTemplates: PhotoboothTemplate[];
  nextCursor: string | null;
  hasMoreTemplates: boolean;
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
  fetchPhotoboothData: (force?: boolean) => Promise<void>;
  loadMoreTemplates: () => Promise<void>;
}

export const usePhotoboothStore = create<PhotoboothState>((set, get) => ({
  events: [],
  templates: [],
  settings: {
    countdown: 3,
    isSoundEnabled: true,
    isFilterEnabled: true,
  },
  activeEvents: [],
  activeTemplates: [],
  nextCursor: null,
  hasMoreTemplates: false,
  loading: false,
  loadingMore: false,
  error: null,

  fetchPhotoboothData: async (force: boolean = false) => {
    if (!force && get().templates.length > 0) {
      return;
    }
    if (get().loading) return;
    set({ loading: true, error: null });
    try {
      const [dbEvents, templateRes, dbSettings] = await Promise.all([
        photoboothService.getEvents(),
        photoboothService.getTemplates({ limit: 12 }),
        photoboothService.getSettings(),
      ]);

      let rawTemplates: any[] = [];
      let nextCursor: string | null = null;
      let hasMore = false;

      if (Array.isArray(templateRes)) {
        rawTemplates = templateRes;
      } else if (templateRes && Array.isArray(templateRes.items)) {
        rawTemplates = templateRes.items;
        nextCursor = templateRes.nextCursor || null;
        hasMore = Boolean(templateRes.hasMore);
      }

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
        countdown: Number(parsedSettings?.countdown) || 3,
        isSoundEnabled: parsedSettings?.isSoundEnabled !== undefined ? Boolean(parsedSettings.isSoundEnabled) : true,
        isFilterEnabled: parsedSettings?.isFilterEnabled !== undefined ? Boolean(parsedSettings.isFilterEnabled) : true,
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

      let rawActiveTemplates = rawTemplates.filter((t: any) => t.status === 'ACTIVE');
      if (activeEvents.length > 0 && activeTemplateIds.size > 0) {
        rawActiveTemplates = rawActiveTemplates.filter((t: any) => activeTemplateIds.has(t.id));
      }

      const activeTemplates = rawActiveTemplates.map(normalizePhotoboothTemplate);

      set({
        events: dbEvents || [],
        templates: rawTemplates,
        settings,
        activeEvents,
        activeTemplates,
        nextCursor,
        hasMoreTemplates: hasMore,
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

  loadMoreTemplates: async () => {
    const { nextCursor, hasMoreTemplates, loadingMore, templates, activeEvents } = get();
    if (!hasMoreTemplates || !nextCursor || loadingMore) return;

    set({ loadingMore: true });
    try {
      const templateRes = await photoboothService.getTemplates({
        cursor: nextCursor,
        limit: 12
      });

      let newItems: any[] = [];
      let newNextCursor: string | null = null;
      let newHasMore = false;

      if (Array.isArray(templateRes)) {
        newItems = templateRes;
      } else if (templateRes && Array.isArray(templateRes.items)) {
        newItems = templateRes.items;
        newNextCursor = templateRes.nextCursor || null;
        newHasMore = Boolean(templateRes.hasMore);
      }

      const activeTemplateIds = new Set<string>();
      activeEvents.forEach((event: any) => {
        if (event.templateIds && Array.isArray(event.templateIds)) {
          event.templateIds.forEach((id: string) => activeTemplateIds.add(id));
        }
      });

      let newActiveItems = newItems.filter((t: any) => t.status === 'ACTIVE');
      if (activeEvents.length > 0 && activeTemplateIds.size > 0) {
        newActiveItems = newActiveItems.filter((t: any) => activeTemplateIds.has(t.id));
      }

      const newActiveTemplates = newActiveItems.map(normalizePhotoboothTemplate);

      set(prev => ({
        templates: [...prev.templates, ...newItems],
        activeTemplates: [...prev.activeTemplates, ...newActiveTemplates],
        nextCursor: newNextCursor,
        hasMoreTemplates: newHasMore,
        loadingMore: false,
      }));
    } catch (err) {
      console.error('Lỗi tải thêm templates:', err);
      set({ loadingMore: false });
    }
  }
}));
