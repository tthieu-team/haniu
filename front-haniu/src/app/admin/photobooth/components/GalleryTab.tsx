'use client';

import React, { useState } from 'react';
import Icon from '@/components/common/Icons';

interface GalleryTabProps {
  sessions: any[];
  events: any[];
  templates: any[];
  onDeleteSession: (id: string) => void;
}

export const GalleryTab: React.FC<GalleryTabProps> = ({
  sessions,
  events,
  templates,
  onDeleteSession
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEvent, setSelectedEvent] = useState('ALL');
  const [selectedTemplate, setSelectedTemplate] = useState('ALL');
  
  // Lightbox Zoom state
  const [zoomImageUrl, setZoomImageUrl] = useState<string | null>(null);

  // Filter completed sessions with images (simulate some mock pictures if imageUrl is missing)
  const galleryItems = sessions
    .filter(s => s.status === 'Completed')
    .map(s => {
      // Inject high-quality mock layout previews if no imageUrl is present to make it look premium
      let url = s.imageUrl;
      if (!url) {
        if (s.templateName.includes('Film Strip') || s.templateName.includes('Dọc')) {
          url = 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=400&q=80'; // vertical festive theme
        } else {
          url = 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&q=80'; // grid lifestyle collage
        }
      }
      return { ...s, imageUrl: url };
    });

  // Filter criteria logic
  const filteredItems = galleryItems.filter(item => {
    const matchesSearch = item.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.eventName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEvent = selectedEvent === 'ALL' || item.eventName === selectedEvent;
    const matchesTemplate = selectedTemplate === 'ALL' || item.templateName === selectedTemplate;
    return matchesSearch && matchesEvent && matchesTemplate;
  });

  const handleDownload = async (url: string, name: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `${name}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch (e) {
      // Fallback direct open in new window
      window.open(url, '_blank');
    }
  };

  return (
    <div className="space-y-6">
      {/* Filtering header toolbar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-50 dark:bg-zinc-850 p-4 rounded-2xl border border-slate-150 dark:border-zinc-800">
        <div className="flex-1 flex gap-2.5 w-full md:max-w-xs">
          <div className="relative flex-1">
            <input 
              type="text" 
              placeholder="Tìm theo Mã phiên hoặc Sự kiện..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 h-10 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 focus:outline-none focus:border-rose-500 text-xs font-semibold text-slate-700 dark:text-zinc-300"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <Icon name="search" size={14} />
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 w-full md:w-auto">
          {/* Event Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Lọc Sự Kiện</span>
            <select 
              value={selectedEvent}
              onChange={e => setSelectedEvent(e.target.value)}
              className="px-3 h-10 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-xs font-bold focus:outline-none cursor-pointer"
            >
              <option value="ALL">Tất cả sự kiện</option>
              {Array.from(new Set(galleryItems.map(item => item.eventName))).map((evName: any) => (
                <option key={evName} value={evName}>{evName}</option>
              ))}
            </select>
          </div>

          {/* Template Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Bố cục</span>
            <select 
              value={selectedTemplate}
              onChange={e => setSelectedTemplate(e.target.value)}
              className="px-3 h-10 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-xs font-bold focus:outline-none cursor-pointer"
            >
              <option value="ALL">Tất cả bố cục</option>
              {Array.from(new Set(galleryItems.map(item => item.templateName))).map((tplName: any) => (
                <option key={tplName} value={tplName}>{tplName}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Gallery Photo Grid */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-16 text-slate-400 bg-slate-50 dark:bg-zinc-850/30 rounded-3xl border border-dashed border-slate-200">
          <Icon name="image" size={36} className="mx-auto mb-2 text-slate-300" />
          <p className="text-xs font-medium">Chưa có ảnh photobooth nào được xuất trong bộ lọc này.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {filteredItems.map((item) => (
            <div 
              key={item.id}
              className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-xs hover:shadow-lg transition-all group flex flex-col justify-between"
            >
              {/* Photo Box container */}
              <div className="relative aspect-[2/3] bg-slate-100 dark:bg-zinc-950 overflow-hidden">
                <img 
                  src={item.imageUrl} 
                  alt={item.id} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                
                {/* Actions overlay on hover */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2.5 z-10">
                  <button 
                    onClick={() => setZoomImageUrl(item.imageUrl)}
                    className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/35 text-white flex items-center justify-center cursor-pointer transition-all active:scale-90"
                    title="Xem chi tiết"
                  >
                    <Icon name="search" size={16} />
                  </button>
                  <button 
                    onClick={() => handleDownload(item.imageUrl, item.id)}
                    className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/35 text-white flex items-center justify-center cursor-pointer transition-all active:scale-90"
                    title="Tải về"
                  >
                    <Icon name="star" size={16} />
                  </button>
                  <button 
                    onClick={() => {
                      if (confirm('Bạn có chắc muốn xóa ảnh này khỏi Thư viện?')) {
                        onDeleteSession(item.id);
                      }
                    }}
                    className="w-9 h-9 rounded-full bg-red-600/80 hover:bg-red-650 text-white flex items-center justify-center cursor-pointer transition-all active:scale-90"
                    title="Xóa ảnh"
                  >
                    <Icon name="trash" size={16} />
                  </button>
                </div>
              </div>

              {/* Specs description */}
              <div className="p-3.5 space-y-1 bg-slate-50 dark:bg-zinc-850">
                <div className="flex justify-between items-center">
                  <span className="font-mono text-[9px] font-black text-rose-500">{item.id}</span>
                  <span className="text-[8px] text-slate-400">{item.date?.split(' ')[0]}</span>
                </div>
                <p className="text-[10px] font-black text-slate-800 dark:text-zinc-200 uppercase tracking-tight truncate">{item.eventName}</p>
                <p className="text-[8.5px] text-slate-455 dark:text-zinc-400 font-medium truncate">{item.templateName}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox full size zoom popup */}
      {zoomImageUrl && (
        <div 
          className="fixed inset-0 bg-black/95 backdrop-blur-md z-[9999] flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setZoomImageUrl(null)}
        >
          <button 
            onClick={() => setZoomImageUrl(null)}
            className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer"
          >
            <Icon name="close" size={18} />
          </button>
          <div className="relative max-w-full max-h-[85vh]" onClick={e => e.stopPropagation()}>
            <img 
              src={zoomImageUrl} 
              alt="Fullscreen Zoom collage" 
              className="max-w-[90vw] max-h-[80vh] object-contain rounded-2xl shadow-2xl border border-white/5"
            />
          </div>
        </div>
      )}
    </div>
  );
};
