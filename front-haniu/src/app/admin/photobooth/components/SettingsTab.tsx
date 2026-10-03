'use client';

import React from 'react';
import Icon from '@/components/common/Icons';

interface SettingsTabProps {
  settings: any;
  onUpdateSettings: (key: string, value: any) => void;
}

export const SettingsTab: React.FC<SettingsTabProps> = ({ settings, onUpdateSettings }) => {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h3 className="text-sm font-black uppercase text-slate-800 dark:text-zinc-200 flex items-center gap-2">
          <Icon name="settings" size={16} className="text-rose-500" />
          <span>Cấu hình Hệ Thống</span>
        </h3>
        <p className="text-[11px] text-slate-400 dark:text-zinc-500">Các tùy chỉnh toàn cục áp dụng cho giao diện chụp ảnh photobooth.</p>
      </div>

      <div className="space-y-4">
        <div className="p-4 bg-slate-50 dark:bg-zinc-800/60 rounded-2xl border border-slate-200 dark:border-zinc-700/80 space-y-4">
          {/* Thời gian đếm ngược */}
          <div className="flex items-center justify-between">
            <div>
              <label className="text-xs font-bold text-slate-800 dark:text-zinc-200 uppercase tracking-tight flex items-center gap-1.5">
                <Icon name="hourglass" size={13} className="text-amber-500" />
                <span>Thời gian đếm ngược (Countdown)</span>
              </label>
              <span className="text-[10px] text-slate-400 dark:text-zinc-400 block">Số giây chuẩn bị đếm ngược cho mỗi kiểu ảnh.</span>
            </div>
            <select 
              value={settings.countdown || 3}
              onChange={e => onUpdateSettings('countdown', parseInt(e.target.value))}
              className="px-3 py-1.5 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 text-slate-800 dark:text-zinc-100 text-xs font-bold focus:outline-none cursor-pointer"
            >
              <option value="3" className="bg-white dark:bg-zinc-900 text-slate-900 dark:text-zinc-100">3 giây</option>
              <option value="5" className="bg-white dark:bg-zinc-900 text-slate-900 dark:text-zinc-100">5 giây</option>
              <option value="7" className="bg-white dark:bg-zinc-900 text-slate-900 dark:text-zinc-100">7 giây</option>
              <option value="10" className="bg-white dark:bg-zinc-900 text-slate-900 dark:text-zinc-100">10 giây</option>
            </select>
          </div>

          {/* Hiệu ứng âm thanh */}
          <div className="flex items-center justify-between border-t border-slate-200/60 dark:border-zinc-700/60 pt-4">
            <div>
              <label className="text-xs font-bold text-slate-800 dark:text-zinc-200 uppercase tracking-tight flex items-center gap-1.5">
                <Icon name="play" size={13} className="text-blue-500" />
                <span>Hiệu ứng âm thanh (Audio Effects)</span>
              </label>
              <span className="text-[10px] text-slate-400 dark:text-zinc-400 block">Bật/tắt âm thanh chụp shutter, tiếng bíp đếm ngược.</span>
            </div>
            <button 
              onClick={() => onUpdateSettings('isSoundEnabled', settings.isSoundEnabled === false ? true : false)}
              className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase transition-colors cursor-pointer flex items-center gap-1 ${
                settings.isSoundEnabled !== false
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20' 
                  : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20'
              }`}
            >
              <Icon name={settings.isSoundEnabled !== false ? 'check' : 'close'} size={12} />
              <span>{settings.isSoundEnabled !== false ? 'Đang bật' : 'Đang tắt'}</span>
            </button>
          </div>

          {/* Bật tắt bộ lọc làm đẹp */}
          <div className="flex items-center justify-between border-t border-slate-200/60 dark:border-zinc-700/60 pt-4">
            <div>
              <label className="text-xs font-bold text-slate-800 dark:text-zinc-200 uppercase tracking-tight flex items-center gap-1.5">
                <Icon name="sparkles" size={13} className="text-pink-500" />
                <span>Bộ lọc màu & Làm đẹp (Filters)</span>
              </label>
              <span className="text-[10px] text-slate-400 dark:text-zinc-400 block">Cho phép khách hàng chọn hiệu ứng bộ lọc màu và filter khuôn mặt khi chụp.</span>
            </div>
            <button 
              onClick={() => onUpdateSettings('isFilterEnabled', settings.isFilterEnabled === false ? true : false)}
              className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase transition-colors cursor-pointer flex items-center gap-1 ${
                settings.isFilterEnabled !== false
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20' 
                  : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20'
              }`}
            >
              <Icon name={settings.isFilterEnabled !== false ? 'check' : 'close'} size={12} />
              <span>{settings.isFilterEnabled !== false ? 'Đang bật' : 'Đang tắt'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
