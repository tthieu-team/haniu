'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Icon from '@/components/common/Icons';
import { useTranslate } from '@/lib/translator';
import { playSound } from './sounds';

import { useThemeStore } from '@/store/theme';

interface StartModeOverlayProps {
  onSelect: (mode: 'auto' | 'manual') => void;
}

export const StartModeOverlay: React.FC<StartModeOverlayProps> = ({ onSelect }) => {
  const trans = useTranslate();
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  const handleSelectMode = (mode: 'auto' | 'manual') => {
    playSound('click');
    onSelect(mode);
  };

  return (
    <div className={`absolute inset-0 z-40 backdrop-blur-md flex flex-col items-center justify-center p-4 transition-colors ${isDark ? 'bg-black/85 text-white' : 'bg-slate-900/40 text-slate-800'
      }`}>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className={`w-full max-w-md border rounded-2xl p-5 sm:p-8 flex flex-col items-center gap-5 sm:gap-6 shadow-2xl relative ${isDark ? 'bg-zinc-900/95 border-white/10' : 'bg-white border-slate-200'
          }`}
      >
        <div className="text-center">
          <span className="inline-block px-3 py-1 bg-primary-color/20 text-primary-color rounded-full text-[10px] font-black uppercase tracking-wider mb-2.5">
            {trans("THIẾT LẬP CAMERA")}
          </span>
          <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight mb-1">
            {trans("Bắt đầu chụp ảnh")}
          </h2>
          <p className={`text-[11px] max-w-sm mx-auto leading-normal ${isDark ? 'text-zinc-400' : 'text-slate-550'
            }`}>
            {trans("Chọn chế độ chụp ảnh phù hợp với phong cách của bạn trước khi bắt đầu.")}
          </p>
        </div>

        {/* Mode options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4 w-full">
          <button
            onClick={() => handleSelectMode('auto')}
            className={`flex flex-col items-center justify-center p-4 sm:p-5 rounded-2xl border hover:border-primary-color/50 hover:bg-primary-color/5 transition-all text-center group cursor-pointer ${isDark ? 'border-white/10 bg-white/5 text-white' : 'border-slate-200 bg-slate-50 text-slate-800'
              }`}
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary-color/10 flex items-center justify-center text-primary-color mb-2.5 sm:mb-3 group-hover:scale-110 transition-transform">
              <Icon name="camera" size={20} />
            </div>
            <h3 className="text-xs font-black uppercase tracking-wide mb-1">
              {trans("Tự động chụp")}
            </h3>
            <p className={`text-[9px] font-normal leading-normal ${isDark ? 'text-zinc-400' : 'text-slate-550'
              }`}>
              {trans("Chụp liên tiếp tất cả các tấm với đếm ngược tự động.")}
            </p>
          </button>

          <button
            onClick={() => handleSelectMode('manual')}
            className={`flex flex-col items-center justify-center p-4 sm:p-5 rounded-2xl border hover:border-primary-color/50 hover:bg-primary-color/5 transition-all text-center group cursor-pointer ${isDark ? 'border-white/10 bg-white/5 text-white' : 'border-slate-200 bg-slate-50 text-slate-800'
              }`}
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary-color/10 flex items-center justify-center text-primary-color mb-2.5 sm:mb-3 group-hover:scale-110 transition-transform">
              <Icon name="list" size={20} />
            </div>
            <h3 className="text-xs font-black uppercase tracking-wide mb-1">
              {trans("Chụp từng tấm")}
            </h3>
            <p className={`text-[9px] font-normal leading-normal ${isDark ? 'text-zinc-400' : 'text-slate-550'
              }`}>
              {trans("Chủ động nhấn nút chụp khi bạn đã chuẩn bị sẵn sàng.")}
            </p>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
