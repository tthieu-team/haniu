'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '@/components/common/Icons';
import { useTranslate } from '@/lib/translator';
import { playSound } from './sounds';

interface StartModeOverlayProps {
  onSelect: (mode: 'auto' | 'manual') => void;
}

export const StartModeOverlay: React.FC<StartModeOverlayProps> = ({ onSelect }) => {
  const trans = useTranslate();
  const [timeLeft, setTimeLeft] = useState(10);

  useEffect(() => {
    if (timeLeft <= 0) {
      onSelect('auto');
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, onSelect]);

  const handleSelectMode = (mode: 'auto' | 'manual') => {
    playSound('click');
    onSelect(mode);
  };

  return (
    <div className="absolute inset-0 z-40 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-4 text-white">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-lg bg-zinc-900/90 border border-white/10 rounded-3xl p-6 sm:p-8 flex flex-col items-center gap-6 shadow-2xl relative"
      >
        <div className="text-center">
          <span className="inline-block px-3 py-1 bg-primary-color/20 text-primary-color rounded-full text-[10px] font-black uppercase tracking-wider mb-2.5">
            {trans("THIẾT LẬP CAMERA 📸")}
          </span>
          <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight mb-1">
            {trans("Bắt đầu chụp ảnh")}
          </h2>
          <p className="text-[11px] text-zinc-400 max-w-sm mx-auto leading-normal">
            {trans("Chọn chế độ chụp ảnh phù hợp với phong cách của bạn trước khi bắt đầu.")}
          </p>
        </div>

        {/* Mode options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
          <button
            onClick={() => handleSelectMode('auto')}
            className="flex flex-col items-center justify-center p-5 rounded-2xl border border-white/10 hover:border-primary-color/50 bg-white/5 hover:bg-primary-color/5 transition-all text-center group cursor-pointer"
          >
            <div className="w-12 h-12 rounded-full bg-primary-color/10 flex items-center justify-center text-primary-color mb-3 group-hover:scale-110 transition-transform">
              <Icon name="camera" size={20} />
            </div>
            <h3 className="text-xs font-black uppercase tracking-wide mb-1">
              {trans("Tự động chụp")}
            </h3>
            <p className="text-[9px] text-zinc-400 font-normal leading-normal">
              {trans("Chụp liên tục tất cả các tấm với đếm ngược tự động.")}
            </p>
          </button>

          <button
            onClick={() => handleSelectMode('manual')}
            className="flex flex-col items-center justify-center p-5 rounded-2xl border border-white/10 hover:border-primary-color/50 bg-white/5 hover:bg-primary-color/5 transition-all text-center group cursor-pointer"
          >
            <div className="w-12 h-12 rounded-full bg-primary-color/10 flex items-center justify-center text-primary-color mb-3 group-hover:scale-110 transition-transform">
              <Icon name="list" size={20} />
            </div>
            <h3 className="text-xs font-black uppercase tracking-wide mb-1">
              {trans("Chụp từng tấm")}
            </h3>
            <p className="text-[9px] text-zinc-400 font-normal leading-normal">
              {trans("Chủ động nhấn nút chụp khi bạn đã chuẩn bị sẵn sàng.")}
            </p>
          </button>
        </div>

        {/* Countdown footer */}
        <div className="w-full pt-4 border-t border-white/5 text-center flex flex-col items-center gap-1.5">
          <div className="flex items-center gap-2 text-zinc-400 text-[10px] font-bold">
            <div className="w-2 h-2 rounded-full bg-primary-color animate-ping" />
            <span>
              {trans("Chế độ Tự động chụp sẽ bắt đầu sau")} <span className="text-primary-color text-xs font-black font-mono">{timeLeft}s</span>
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
