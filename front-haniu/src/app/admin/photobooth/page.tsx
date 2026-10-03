'use client';

import React, { useState, useEffect } from 'react';
import Icon from '@/components/common/Icons';

// Import subcomponents
import { DashboardTab } from './components/DashboardTab';
import { EventsTab } from './components/EventsTab';
import { TemplatesTab } from './components/TemplatesTab';
import { AssetLibraryTab } from './components/AssetLibraryTab';
import { SessionsTab } from './components/SessionsTab';
import { SettingsTab } from './components/SettingsTab';
import { CanvaWorkspace } from './components/CanvaWorkspace';

import { GalleryTab } from './components/GalleryTab';

// Import service
import { photoboothService } from '@/services/photobooth.service';

const generateUUID = () => {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.randomUUID) {
    return window.crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export default function PhotoboothAdmin() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'events' | 'templates' | 'sessions' | 'settings' | 'gallery' | 'assets'>('dashboard');

  // Unified application state
  const [dashboardStats, setDashboardStats] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [templates, setTemplates] = useState<any[]>([]);
  const [templateCursor, setTemplateCursor] = useState<string | null>(null);
  const [hasMoreTemplates, setHasMoreTemplates] = useState<boolean>(false);
  const [loadingMoreTemplates, setLoadingMoreTemplates] = useState<boolean>(false);
  const [assets, setAssets] = useState<any>({ backgrounds: [], stickers: [], logos: [] });
  const [sessions, setSessions] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>({
    countdown: 3,
    isSoundEnabled: true,
    isFilterEnabled: true
  });
  const [loadingTabs, setLoadingTabs] = useState<{ [key: string]: boolean }>({});

  // Modal Control for Events
  const [showEventModal, setShowEventModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any>(null);
  const [eventForm, setEventForm] = useState({ name: '', status: 'ACTIVE', templateIds: [] as string[], background: '#ffffff', logoId: 'logo-classic' });

  // Canva Builder States
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [builderTemplate, setBuilderTemplate] = useState<any>(null);
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null);

  // Load specific tab data on demand
  const loadTabData = async (tab: string) => {
    setLoadingTabs(prev => ({ ...prev, [tab]: true }));
    try {
      if (tab === 'dashboard') {
        const stats = await photoboothService.getDashboardStats();
        setDashboardStats(stats);
      } else if (tab === 'events') {
        const [fetchedEvents, templateRes, fetchedAssets] = await Promise.all([
          photoboothService.getEvents(),
          templates.length === 0 ? photoboothService.getTemplates({ limit: 12 }) : Promise.resolve(null),
          !assets.logos || assets.logos.length === 0 ? photoboothService.getAssets() : Promise.resolve(assets),
        ]);
        setEvents(fetchedEvents);
        if (templateRes) {
          if (Array.isArray(templateRes)) {
            setTemplates(templateRes);
            setTemplateCursor(null);
            setHasMoreTemplates(false);
          } else if (templateRes && Array.isArray(templateRes.items)) {
            setTemplates(templateRes.items);
            setTemplateCursor(templateRes.nextCursor || null);
            setHasMoreTemplates(Boolean(templateRes.hasMore));
          }
        }
        if (!assets.logos || assets.logos.length === 0) setAssets(fetchedAssets);
      } else if (tab === 'templates') {
        const templateRes = await photoboothService.getTemplates({ limit: 12 });
        if (Array.isArray(templateRes)) {
          setTemplates(templateRes);
          setTemplateCursor(null);
          setHasMoreTemplates(false);
        } else if (templateRes && Array.isArray(templateRes.items)) {
          setTemplates(templateRes.items);
          setTemplateCursor(templateRes.nextCursor || null);
          setHasMoreTemplates(Boolean(templateRes.hasMore));
        }
        if (events.length === 0) {
          photoboothService.getEvents().then(setEvents).catch(() => {});
        }
      } else if (tab === 'assets') {
        const fetchedAssets = await photoboothService.getAssets();
        setAssets(fetchedAssets);
      } else if (tab === 'sessions') {
        const fetchedSessions = await photoboothService.getSessions();
        setSessions(fetchedSessions);
      } else if (tab === 'gallery') {
        const [fetchedSessions, fetchedEvents] = await Promise.all([
          photoboothService.getSessions(),
          events.length === 0 ? photoboothService.getEvents() : Promise.resolve(events),
        ]);
        setSessions(fetchedSessions);
        if (events.length === 0) setEvents(fetchedEvents);
      } else if (tab === 'settings') {
        const fetchedSettings = await photoboothService.getSettings();
        let cleanSettings = fetchedSettings;
        if (typeof fetchedSettings === 'string') {
          try {
            cleanSettings = JSON.parse(fetchedSettings);
          } catch {
            cleanSettings = {};
          }
        }
        setSettings({
          countdown: cleanSettings?.countdown || 3,
          isSoundEnabled: cleanSettings?.isSoundEnabled !== false,
          isFilterEnabled: cleanSettings?.isFilterEnabled !== false,
        });
      }
    } catch (error) {
      console.error(`Lỗi khi tải dữ liệu tab ${tab}:`, error);
    } finally {
      setLoadingTabs(prev => ({ ...prev, [tab]: false }));
    }
  };

  const handleLoadMoreTemplates = async () => {
    if (!hasMoreTemplates || !templateCursor || loadingMoreTemplates) return;
    setLoadingMoreTemplates(true);
    try {
      const res = await photoboothService.getTemplates({
        cursor: templateCursor,
        limit: 12
      });
      if (res && Array.isArray(res.items)) {
        setTemplates(prev => [...prev, ...res.items]);
        setTemplateCursor(res.nextCursor || null);
        setHasMoreTemplates(Boolean(res.hasMore));
      }
    } catch (err) {
      console.error('Lỗi khi tải thêm templates:', err);
    } finally {
      setLoadingMoreTemplates(false);
    }
  };

  useEffect(() => {
    loadTabData(activeTab);
  }, [activeTab]);

  // Event Action Handlers
  const handleToggleEventStatus = async (id: string) => {
    const target = events.find(ev => ev.id === id);
    if (!target) return;
    const updatedEvent = { ...target, status: target.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' };
    await photoboothService.saveEvent(updatedEvent);
    loadTabData('events');
  };

  const handleOpenAddEvent = () => {
    setEditingEvent(null);
    setEventForm({ name: '', status: 'ACTIVE', templateIds: templates[0] ? [templates[0].id] : [], background: '#ffffff', logoId: assets.logos?.[0]?.id || '' });
    setShowEventModal(true);
  };

  const handleOpenEditEvent = (event: any) => {
    setEditingEvent(event);
    let initialTemplateIds = event.templateIds || [];
    if (initialTemplateIds.length === 0 && event.templateId) {
      initialTemplateIds = [event.templateId];
    }
    setEventForm({ name: event.name, status: event.status, templateIds: initialTemplateIds, background: event.background, logoId: event.logoId || '' });
    setShowEventModal(true);
  };

  const handleDeleteEvent = async (id: string) => {
    if (confirm('Bạn có chắc muốn xóa sự kiện này không?')) {
      await photoboothService.deleteEvent(id);
      loadTabData('events');
    }
  };

  const handleSaveEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventForm.name.trim()) return;

    const payload = editingEvent
      ? { ...editingEvent, ...eventForm }
      : { ...eventForm };

    delete payload.createdAt;
    delete payload.updatedAt;

    await photoboothService.saveEvent(payload);
    setShowEventModal(false);
    loadTabData('events');
  };

  // Settings Save Handler
  const handleUpdateSettings = async (key: string, value: any) => {
    const updated = {
      countdown: key === 'countdown' ? value : (settings.countdown || 3),
      isSoundEnabled: key === 'isSoundEnabled' ? value : (settings.isSoundEnabled !== false),
      isFilterEnabled: key === 'isFilterEnabled' ? value : (settings.isFilterEnabled !== false),
    };
    await photoboothService.saveSettings(updated);
    setSettings(updated);
  };

  // Asset Actions
  const handleAddAsset = async (type: 'backgrounds' | 'stickers' | 'logos', item: any) => {
    await photoboothService.saveAsset(type, item);
    loadTabData('assets');
  };

  const handleDeleteAsset = async (type: 'backgrounds' | 'stickers' | 'logos', id: string) => {
    await photoboothService.deleteAsset(type, id);
    loadTabData('assets');
  };

  // Template Actions
  const handleOpenAddTemplate = () => {
    const newTpl = {
      name: '',
      status: 'ACTIVE',
      canvasWidth: 1200,
      canvasHeight: 1600,
      background: '#ffffff',
      description: '',
      thumbnail: '',
      isNew: true, // triggers 3-step wizard in CanvaWorkspace
      layers: []
    };
    setBuilderTemplate(newTpl);
    setSelectedLayerId(null);
    setIsBuilderOpen(true);
  };

  const handleOpenEditTemplate = (tpl: any) => {
    setBuilderTemplate(JSON.parse(JSON.stringify(tpl)));
    setSelectedLayerId(tpl.layers?.[0]?.id || null);
    setIsBuilderOpen(true);
  };

  const handleToggleTemplateStatus = async (id: string) => {
    const target = templates.find(t => t.id === id);
    if (!target) return;
    const updated = { ...target, status: target.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' };
    await photoboothService.saveTemplate(updated);
    loadTabData('templates');
  };

  const handleCloneTemplate = async (tpl: any) => {
    const clone = {
      ...JSON.parse(JSON.stringify(tpl)),
      name: `${tpl.name} (Nhân bản)`,
      isNew: false
    };
    delete clone.id;
    await photoboothService.saveTemplate(clone);
    loadTabData('templates');
  };

  const handleDeleteTemplate = async (id: string) => {
    const activeEvent = events.find(ev => ev.templateId === id);
    if (activeEvent) {
      alert(`Không thể xóa! Template đang được sử dụng trong Sự kiện: "${activeEvent.name}" (${activeEvent.status}).`);
      return;
    }

    if (confirm('Bạn có chắc muốn xóa Template này?')) {
      await photoboothService.deleteTemplate(id);
      loadTabData('templates');
    }
  };

  const handleSaveBuilderTemplate = async () => {
    await photoboothService.saveTemplate(builderTemplate);
    setIsBuilderOpen(false);
    loadTabData('templates');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-1">
      {/* Visual Canva Designer Modal Workspace */}
      {isBuilderOpen && builderTemplate && (
        <CanvaWorkspace
          builderTemplate={builderTemplate}
          setBuilderTemplate={setBuilderTemplate}
          selectedLayerId={selectedLayerId}
          setSelectedLayerId={setSelectedLayerId}
          assets={assets}
          onSave={handleSaveBuilderTemplate}
          onClose={() => setIsBuilderOpen(false)}
          onClone={handleCloneTemplate}
        />
      )}

      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-rose-500/10 via-amber-500/5 to-transparent border border-rose-500/10 p-6 sm:p-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/5 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 right-1/4 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl -z-10" />
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-500/25 text-rose-600 dark:text-rose-450 border border-rose-500/20">
                PRO MODULE
              </span>
              <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-bold">• Photobooth Haniu v2.5</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-zinc-150 uppercase tracking-tight italic font-sans flex items-center gap-2.5">
              📷 CẤU HÌNH <span className="bg-gradient-to-r from-rose-600 to-amber-500 bg-clip-text text-transparent">PHOTOBOOTH</span>
            </h1>
            <p className="text-xs text-slate-500 dark:text-zinc-400 max-w-xl mt-1">
              Quản lý các sự kiện chụp hình, định nghĩa layout template kéo thả, tải sticker, theo dõi hoạt động chụp ảnh và xuất báo cáo analytics.
            </p>
          </div>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="flex border-b border-slate-200 dark:border-zinc-800 overflow-x-auto scrollbar-none gap-2 pb-2">
        {[
          { id: 'dashboard', label: 'Dashboard', icon: 'grid' },
          { id: 'events', label: 'Sự kiện (Events)', icon: 'cake' },
          { id: 'templates', label: 'Khung hình (Templates)', icon: 'palette' },
          { id: 'assets', label: 'Tài nguyên (Assets)', icon: 'image' },
          { id: 'sessions', label: 'Lượt chụp (Sessions)', icon: 'list' },
          { id: 'gallery', label: 'Thư viện ảnh', icon: 'image' },
          { id: 'settings', label: 'Cấu hình chung', icon: 'settings' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-3 text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer whitespace-nowrap border ${
              activeTab === tab.id
                ? 'bg-rose-600 text-white border-rose-600 shadow-md shadow-rose-600/10'
                : 'bg-white dark:bg-zinc-900 text-slate-500 dark:text-zinc-400 border-slate-200 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-850'
            }`}
          >
            <Icon name={tab.icon} size={14} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB CONTENT PANEL */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm min-h-[400px]">
        {activeTab === 'dashboard' && (
          <DashboardTab stats={dashboardStats} loading={loadingTabs.dashboard} />
        )}
        
        {activeTab === 'events' && (
          <EventsTab
            events={events}
            templates={templates}
            logos={assets.logos}
            onToggleStatus={handleToggleEventStatus}
            onOpenEdit={handleOpenEditEvent}
            onDelete={handleDeleteEvent}
            onOpenAdd={handleOpenAddEvent}
            showEventModal={showEventModal}
            onCloseModal={() => setShowEventModal(false)}
            eventForm={eventForm}
            onChangeEventForm={updates => setEventForm(prev => ({ ...prev, ...updates }))}
            onSaveEvent={handleSaveEvent}
            editingEvent={editingEvent}
          />
        )}

        {activeTab === 'templates' && (
          <TemplatesTab
            templates={templates}
            events={events}
            hasMore={hasMoreTemplates}
            loadingMore={loadingMoreTemplates}
            onLoadMore={handleLoadMoreTemplates}
            onToggleStatus={handleToggleTemplateStatus}
            onOpenAdd={handleOpenAddTemplate}
            onOpenEdit={handleOpenEditTemplate}
            onClone={handleCloneTemplate}
            onDelete={handleDeleteTemplate}
          />
        )}

        {activeTab === 'assets' && (
          <AssetLibraryTab
            assets={assets}
            onAddAsset={handleAddAsset}
            onDeleteAsset={handleDeleteAsset}
          />
        )}

        {activeTab === 'sessions' && <SessionsTab sessions={sessions} />}

        {activeTab === 'gallery' && (
          <GalleryTab
            sessions={sessions}
            events={events}
            templates={templates}
            onDeleteSession={async (id) => {
              await photoboothService.deleteSession(id);
              loadTabData('gallery');
            }}
          />
        )}

        {activeTab === 'settings' && <SettingsTab settings={settings} onUpdateSettings={handleUpdateSettings} />}
      </div>
    </div>
  );
}
