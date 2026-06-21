'use client';

import React, { useState } from 'react';
import Icon from '@/components/common/Icons';

interface EventsTabProps {
  events: any[];
  templates: any[];
  logos: any[];
  onToggleStatus: (id: string) => void;
  onOpenEdit: (event: any) => void;
  onDelete: (id: string) => void;
  onOpenAdd: () => void;
  showEventModal: boolean;
  onCloseModal: () => void;
  eventForm: any;
  onChangeEventForm: (updates: any) => void;
  onSaveEvent: (e: React.FormEvent) => void;
  editingEvent: any;
}

export const EventsTab: React.FC<EventsTabProps> = ({
  events,
  templates,
  logos,
  onToggleStatus,
  onOpenEdit,
  onDelete,
  onOpenAdd,
  showEventModal,
  onCloseModal,
  eventForm,
  onChangeEventForm,
  onSaveEvent,
  editingEvent
}) => {
  const [aiPrompt, setAiPrompt] = useState('');
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [aiStatusText, setAiStatusText] = useState('');

  // Client-side smart AI simulation
  const handleGenerateWithAi = () => {
    if (!aiPrompt.trim()) return;

    setIsAiGenerating(true);
    setAiStatusText('Đang phân tích ý tưởng...');

    const steps = [
      { text: 'Đang phối màu nền khung hình...', delay: 600 },
      { text: 'Đang lựa chọn template và logo watermark phù hợp...', delay: 1200 },
      { text: 'Thiết lập trạng thái hoạt động...', delay: 1800 }
    ];

    steps.forEach((step, idx) => {
      setTimeout(() => {
        setAiStatusText(step.text);
      }, step.delay);
    });

    setTimeout(() => {
      const promptLower = aiPrompt.toLowerCase();
      
      // 1. Determine background color based on prompt keywords
      let background = '#ffffff';
      if (promptLower.includes('đỏ') || promptLower.includes('red') || promptLower.includes('noel') || promptLower.includes('giáng sinh') || promptLower.includes('christmas')) {
        background = '#dc2626'; // Red
      } else if (promptLower.includes('hồng') || promptLower.includes('pink') || promptLower.includes('dâu') || promptLower.includes('strawberry')) {
        background = '#f472b6'; // Pink
      } else if (promptLower.includes('xanh lá') || promptLower.includes('green') || promptLower.includes('thông') || promptLower.includes('forest')) {
        background = '#16a34a'; // Green
      } else if (promptLower.includes('xanh dương') || promptLower.includes('blue') || promptLower.includes('biển')) {
        background = '#2563eb'; // Blue
      } else if (promptLower.includes('đen') || promptLower.includes('black') || promptLower.includes('tối')) {
        background = '#09090b'; // Black
      } else if (promptLower.includes('vàng kim') || promptLower.includes('gold') || promptLower.includes('sang trọng')) {
        background = '#fbbf24'; // Gold / Warm yellow
      } else if (promptLower.includes('tím') || promptLower.includes('purple')) {
        background = '#8b5cf6'; // Purple
      } else if (promptLower.includes('cam') || promptLower.includes('orange')) {
        background = '#f97316'; // Orange
      }

      // 2. Extract Event Name
      let eventName = '';
      if (promptLower.includes('giáng sinh') || promptLower.includes('noel') || promptLower.includes('christmas')) {
        eventName = 'Giáng Sinh 2026';
      } else if (promptLower.includes('sinh nhật') || promptLower.includes('birthday')) {
        eventName = 'Birthday Workshop 🎂';
      } else if (promptLower.includes('cưới') || promptLower.includes('wedding')) {
        eventName = 'Wedding Day 💍';
      } else if (promptLower.includes('kỷ niệm') || promptLower.includes('anniversary')) {
        eventName = 'Kỷ Niệm Ngày Chung Đôi';
      } else if (promptLower.includes('year end') || promptLower.includes('yep') || promptLower.includes('cuối năm')) {
        eventName = 'Year End Party ✨';
      } else {
        // Fallback capitalize first letter or keep it neat
        eventName = aiPrompt.charAt(0).toUpperCase() + aiPrompt.slice(1);
      }

      // 3. Find matching template
      let matchedTemplateId = templates[0]?.id || '';
      for (const t of templates) {
        const tName = t.name.toLowerCase();
        if (
          (promptLower.includes('strip') && tName.includes('strip')) ||
          (promptLower.includes('grid') && tName.includes('grid')) ||
          (promptLower.includes('4 ảnh') && (tName.includes('4') || tName.includes('grid-4'))) ||
          (promptLower.includes('3 ảnh') && (tName.includes('3') || tName.includes('grid-3'))) ||
          (promptLower.includes('giáng sinh') && tName.includes('giáng sinh'))
        ) {
          matchedTemplateId = t.id;
          break;
        }
      }

      // 4. Find matching logo
      let matchedLogoId = logos?.[0]?.id || '';
      for (const l of logos || []) {
        const lName = l.name.toLowerCase();
        if (
          (promptLower.includes('classic') && lName.includes('classic')) ||
          (promptLower.includes('noel') && lName.includes('noel')) ||
          (promptLower.includes('modern') && lName.includes('modern')) ||
          (promptLower.includes('haniu') && lName.includes('haniu'))
        ) {
          matchedLogoId = l.id;
          break;
        }
      }

      onChangeEventForm({
        name: eventName,
        background: background,
        templateIds: matchedTemplateId ? [matchedTemplateId] : [],
        logoId: matchedLogoId,
        status: 'ACTIVE'
      });

      setIsAiGenerating(false);
      setAiStatusText('');
      setAiPrompt('');
    }, 2400);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-sm font-black uppercase text-slate-800 dark:text-zinc-200">Danh Sách Sự Kiện Photobooth</h3>
          <p className="text-[11px] text-slate-400 dark:text-zinc-500">Mỗi sự kiện có các sticker, logo, và khung ảnh đi kèm riêng.</p>
        </div>
        <button 
          onClick={() => {
            setAiPrompt('');
            onOpenAdd();
          }}
          className="px-3 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
        >
          <Icon name="plus" size={12} />
          Thêm Sự Kiện Mới
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {events.map((ev) => (
          <div 
            key={ev.id} 
            className={`p-5 rounded-2xl border transition-all ${
              ev.status === 'ACTIVE' 
                ? 'bg-gradient-to-tr from-white to-rose-50/10 dark:from-zinc-900 dark:to-rose-950/5 border-rose-200 dark:border-rose-900/30' 
                : 'bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 opacity-75'
            }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-base font-black text-slate-800 dark:text-zinc-200 uppercase tracking-tight">{ev.name}</h4>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                    ev.status === 'ACTIVE' 
                      ? 'bg-emerald-500/10 text-emerald-500 dark:text-emerald-400' 
                      : 'bg-slate-400/10 text-slate-500'
                  }`}>
                    {ev.status === 'ACTIVE' ? 'Hoạt động' : 'Đang ẩn'}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 dark:text-zinc-500 mt-0.5">Ngày tạo: {ev.createdAt}</p>
              </div>

              <div className="flex items-center gap-1.5">
                <button 
                  onClick={() => onToggleStatus(ev.id)}
                  className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                    ev.status === 'ACTIVE' 
                      ? 'border-emerald-500/25 bg-emerald-500/5 hover:bg-emerald-500/10 text-emerald-500' 
                      : 'border-slate-350 hover:bg-slate-50 text-slate-500'
                  }`}
                  title={ev.status === 'ACTIVE' ? 'Tạm ẩn sự kiện' : 'Kích hoạt sự kiện'}
                >
                  <Icon name="check" size={12} />
                </button>
                <button 
                  onClick={() => onOpenEdit(ev)}
                  className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 dark:border-zinc-805 dark:hover:bg-zinc-800 text-slate-500 cursor-pointer"
                  title="Chỉnh sửa thông tin"
                >
                  <Icon name="edit" size={12} />
                </button>
                <button 
                  onClick={() => onDelete(ev.id)}
                  className="p-1.5 rounded-lg border border-red-250 bg-red-500/5 hover:bg-red-500/10 text-red-500 cursor-pointer"
                  title="Xóa sự kiện"
                >
                  <Icon name="trash" size={12} />
                </button>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-zinc-800 grid grid-cols-2 gap-3 text-[10px] font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">
              <div>
                <p className="text-slate-400 font-medium">Khung ảnh đi kèm ({ev.templateIds?.length || (ev.templateId ? 1 : 0)})</p>
                <p className="text-slate-700 dark:text-zinc-300 font-black mt-0.5 truncate" title={
                  ev.templateIds && ev.templateIds.length > 0
                    ? ev.templateIds.map((id: string) => templates.find(t => t.id === id)?.name).filter(Boolean).join(', ')
                    : templates.find(t => t.id === ev.templateId)?.name || 'Chưa chọn'
                }>
                  {ev.templateIds && ev.templateIds.length > 0
                    ? ev.templateIds.map((id: string) => templates.find(t => t.id === id)?.name).filter(Boolean).join(', ')
                    : templates.find(t => t.id === ev.templateId)?.name || 'Chưa chọn'}
                </p>
              </div>
              <div>
                <p className="text-slate-400 font-medium">Chữ ký watermark</p>
                <p className="text-slate-700 dark:text-zinc-300 font-black mt-0.5">
                  {logos?.find((l: any) => l.id === ev.logoId)?.name || 'Haniu Watermark'}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showEventModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-6 w-full max-w-md shadow-2xl relative transition-all duration-300">
            <h3 className="text-base font-black text-slate-800 dark:text-zinc-150 uppercase tracking-tight mb-4 flex items-center gap-2">
              <Icon name="edit" size={16} className="text-rose-500" />
              {editingEvent ? 'Chỉnh Sửa Sự Kiện' : 'Tạo Sự Kiện Photobooth Mới'}
            </h3>

            {/* AI Smart creation wizard (only for new events) */}
            {!editingEvent && (
              <div className="mb-4 p-4 rounded-2xl bg-gradient-to-r from-rose-500/10 via-purple-500/10 to-indigo-500/10 border border-rose-500/15 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/5 rounded-full blur-xl pointer-events-none" />
                <div className="flex items-center gap-1.5 mb-2">
                  <span className="animate-pulse">✨</span>
                  <span className="text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-rose-500 to-indigo-500 bg-clip-text text-transparent">
                    AI Thiết Kế Nhanh
                  </span>
                </div>
                
                {isAiGenerating ? (
                  <div className="py-3 flex flex-col items-center justify-center gap-2 text-center">
                    <div className="w-8 h-8 rounded-full border-2 border-rose-500/20 border-t-rose-500 animate-spin" />
                    <p className="text-[10px] font-bold text-slate-650 dark:text-zinc-350">{aiStatusText}</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-[10px] text-slate-400 dark:text-zinc-500 font-medium">
                      Nhập ý tưởng của bạn (ví dụ: "Giáng sinh tone đỏ ấm áp") để AI tự động chọn màu, khung và watermark.
                    </p>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        value={aiPrompt}
                        onChange={e => setAiPrompt(e.target.value)}
                        placeholder="Ví dụ: Giáng sinh tone đỏ, sinh nhật màu hồng..."
                        className="flex-1 px-3 h-9 rounded-xl bg-white dark:bg-zinc-850 border border-slate-200 dark:border-zinc-850 text-xs font-semibold focus:outline-none focus:border-rose-500"
                        onKeyDown={e => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleGenerateWithAi();
                          }
                        }}
                      />
                      <button 
                        type="button"
                        onClick={handleGenerateWithAi}
                        className="px-3 h-9 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center cursor-pointer active:scale-95"
                      >
                        Thiết kế
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            <form onSubmit={onSaveEvent} className="space-y-4">
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider block mb-1">Tên Sự Kiện</label>
                <input 
                  type="text" 
                  required
                  value={eventForm.name}
                  onChange={e => onChangeEventForm({ name: e.target.value })}
                  placeholder="Ví dụ: Giáng Sinh 2026, Birthday Workshop..."
                  className="w-full px-4 h-11 rounded-xl bg-slate-50 dark:bg-zinc-850 border border-slate-200 dark:border-zinc-850 focus:outline-none focus:border-rose-500 text-xs font-semibold text-slate-700 dark:text-zinc-350"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider block mb-1">Trạng thái</label>
                  <select 
                    value={eventForm.status}
                    onChange={e => onChangeEventForm({ status: e.target.value })}
                    className="w-full px-3 h-11 rounded-xl bg-slate-50 dark:bg-zinc-850 border border-slate-200 dark:border-zinc-850 text-xs font-semibold focus:outline-none cursor-pointer"
                  >
                    <option value="ACTIVE">Hoạt động</option>
                    <option value="INACTIVE">Tạm ẩn</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider block mb-1">Logo Watermark</label>
                  <select 
                    value={eventForm.logoId || ''}
                    onChange={e => onChangeEventForm({ logoId: e.target.value })}
                    className="w-full px-3 h-11 rounded-xl bg-slate-50 dark:bg-zinc-850 border border-slate-200 dark:border-zinc-850 text-xs font-semibold focus:outline-none cursor-pointer"
                  >
                    <option value="">Không sử dụng watermark</option>
                    {logos?.map((l: any) => (
                      <option key={l.id} value={l.id}>{l.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider block mb-1">Màu nền khung</label>
                <div className="flex gap-2 items-center">
                  <input 
                    type="color" 
                    value={eventForm.background}
                    onChange={e => onChangeEventForm({ background: e.target.value })}
                    className="w-10 h-10 rounded-lg cursor-pointer border border-slate-200 dark:border-zinc-850 bg-transparent p-0.5"
                  />
                  <span className="text-[10px] font-mono font-bold text-slate-400">{eventForm.background}</span>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider block mb-1">Khung ảnh đi kèm (Chọn nhiều) chưa có phần logo watermark</label>
                <div className="mt-1 grid grid-cols-2 gap-2 max-h-32 overflow-y-auto p-3 rounded-xl bg-slate-50 dark:bg-zinc-850 border border-slate-200 dark:border-zinc-850 custom-scrollbar">
                  {templates.map((t) => {
                    const isChecked = eventForm.templateIds?.includes(t.id);
                    return (
                      <label 
                        key={t.id} 
                        className="flex items-center gap-2 p-1.5 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-lg cursor-pointer transition-colors text-xs font-semibold text-slate-700 dark:text-zinc-350"
                      >
                        <input 
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {
                            const current = eventForm.templateIds || [];
                            const next = isChecked 
                              ? current.filter((id: string) => id !== t.id)
                              : [...current, t.id];
                            onChangeEventForm({ templateIds: next });
                          }}
                          className="rounded text-rose-500 focus:ring-rose-500 border-slate-350 dark:border-zinc-700"
                        />
                        <span className="truncate">{t.name}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button" 
                  onClick={onCloseModal}
                  className="flex-1 h-11 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 font-bold text-xs uppercase tracking-wider cursor-pointer"
                >
                  Hủy
                </button>
                <button 
                  type="submit"
                  className="flex-1 h-11 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs uppercase tracking-wider cursor-pointer shadow-md shadow-rose-600/10"
                >
                  Lưu Sự Kiện
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
