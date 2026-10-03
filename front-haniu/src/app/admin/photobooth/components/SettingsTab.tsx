'use client';

import React from 'react';

interface SettingsTabProps {
  settings: any;
  onUpdateSettings: (key: string, value: any) => void;
}

export const SettingsTab: React.FC<SettingsTabProps> = ({ settings, onUpdateSettings }) => {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h3 className="text-sm font-black uppercase text-slate-800 dark:text-zinc-200">Cấu hình Hệ Thống</h3>
        <p className="text-[11px] text-slate-400 dark:text-zinc-500">Các tùy chỉnh toàn cục áp dụng cho giao diện chụp ảnh photobooth.</p>
      </div>

      <div className="space-y-4">
        <div className="p-4 bg-slate-50 dark:bg-zinc-850 rounded-2xl border border-slate-100 dark:border-zinc-800 space-y-4">
          {/* Thời gian đếm ngược */}
          <div className="flex items-center justify-between">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-tight block">Thời gian đếm ngược (Countdown)</label>
              <span className="text-[10px] text-slate-400 dark:text-zinc-500 block">Số giây chuẩn bị đếm ngược cho mỗi kiểu ảnh.</span>
            </div>
            <select 
              value={settings.countdown || 3}
              onChange={e => onUpdateSettings('countdown', parseInt(e.target.value))}
              className="px-3 py-1.5 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-850 text-xs font-bold focus:outline-none cursor-pointer"
            >
              <option value="3">3 giây</option>
              <option value="5">5 giây</option>
              <option value="7">7 giây</option>
              <option value="10">10 giây</option>
            </select>
          </div>

          {/* Hiệu ứng âm thanh */}
          <div className="flex items-center justify-between border-t border-slate-100 dark:border-zinc-800 pt-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-tight block">Hiệu ứng âm thanh (Audio Effects)</label>
              <span className="text-[10px] text-slate-400 dark:text-zinc-500 block">Bật/tắt âm thanh chụp shutter, tiếng bíp đếm ngược.</span>
            </div>
            <button 
              onClick={() => onUpdateSettings('isSoundEnabled', settings.isSoundEnabled === false ? true : false)}
              className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase transition-colors cursor-pointer ${
                settings.isSoundEnabled !== false
                  ? 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20' 
                  : 'bg-rose-500/10 text-rose-600 hover:bg-rose-500/20'
              }`}
            >
              {settings.isSoundEnabled !== false ? 'Đang bật' : 'Đang tắt'}
            </button>
          </div>

          {/* Bật tắt bộ lọc làm đẹp */}
          <div className="flex items-center justify-between border-t border-slate-100 dark:border-zinc-800 pt-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-tight block">Bộ lọc màu & Làm đẹp (Filters)</label>
              <span className="text-[10px] text-slate-400 dark:text-zinc-500 block">Cho phép khách hàng chọn hiệu ứng bộ lọc màu và filter khuôn mặt khi chụp.</span>
            </div>
            <button 
              onClick={() => onUpdateSettings('isFilterEnabled', settings.isFilterEnabled === false ? true : false)}
              className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase transition-colors cursor-pointer ${
                settings.isFilterEnabled !== false
                  ? 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20' 
                  : 'bg-rose-500/10 text-rose-600 hover:bg-rose-500/20'
              }`}
            >
              {settings.isFilterEnabled !== false ? 'Đang bật' : 'Đang tắt'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
