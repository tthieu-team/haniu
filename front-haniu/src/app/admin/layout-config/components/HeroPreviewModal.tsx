'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useHomeLayoutStore } from '@/store/homeLayout';
import { IframePreview } from './IframePreview';
import SliderHero from '@/components/home/hero/SliderHero';
import SplitGridHero from '@/components/home/hero/SplitGridHero';
import Icon from '@/components/common/Icons';

interface HeroPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type DeviceMode = 'desktop' | 'tablet' | 'mobile';

interface DeviceConfig {
  name: string;
  width: number;
  height: number;
  icon: React.ReactNode;
}

export function HeroPreviewModal({ isOpen, onClose }: HeroPreviewModalProps) {
  const { hero } = useHomeLayoutStore();
  const [deviceMode, setDeviceMode] = useState<DeviceMode>('desktop');
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const canvasRef = useRef<HTMLDivElement>(null);

  // ResizeObserver to track available container size for proper scaling
  useEffect(() => {
    if (!isOpen || !canvasRef.current) return;

    const observer = new ResizeObserver((entries) => {
      if (!entries || entries.length === 0) return;
      setContainerWidth(entries[0].contentRect.width);
    });

    observer.observe(canvasRef.current);
    
    // Initial size
    setContainerWidth(canvasRef.current.getBoundingClientRect().width);

    return () => observer.disconnect();
  }, [isOpen]);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const devices: Record<DeviceMode, DeviceConfig> = {
    desktop: {
      name: 'Máy tính',
      width: 1280,
      height: 720,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="20" height="14" x="2" y="3" rx="2"/>
          <line x1="8" x2="16" y1="21" y2="21"/>
          <line x1="12" x2="12" y1="17" y2="21"/>
        </svg>
      ),
    },
    tablet: {
      name: 'Máy tính bảng',
      width: 768,
      height: 850,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="16" height="20" x="4" y="2" rx="2" ry="2"/>
          <line x1="12" x2="12" y1="18" y2="18"/>
        </svg>
      ),
    },
    mobile: {
      name: 'Điện thoại',
      width: 375,
      height: 667,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="14" height="20" x="5" y="2" rx="2" ry="2"/>
          <path d="M12 18h.01"/>
        </svg>
      ),
    },
  };

  const currentDevice = devices[deviceMode];
  const targetWidth = currentDevice.width;
  const padding = 40; // margin padding
  const availableWidth = containerWidth - padding;
  const scale = availableWidth < targetWidth && availableWidth > 0 ? availableWidth / targetWidth : 1;

  const layoutLabel = hero.layoutType === 'split-grid' ? 'Chia Lưới (Split-Grid)' : 'Slider Chạy Tự Động';

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 transition-all duration-300 animate-fade-in">
      <div 
        className="bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-[28px] w-full max-w-[96vw] xl:max-w-[1400px] h-[94vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header section */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider">
                Xem Trước Giao Diện Hero
              </h3>
              <span className="text-[10px] bg-rose-500/10 border border-rose-500/20 text-rose-500 font-bold px-2 py-0.5 rounded-full uppercase">
                {layoutLabel}
              </span>
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">
              Xem trước các slide và tiện ích thay đổi theo thời gian thực (chưa cần lưu).
            </p>
          </div>

          {/* Size Selectors & Close */}
          <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
            <div className="bg-slate-100 dark:bg-zinc-800 p-1 rounded-xl flex items-center gap-1">
              {(Object.keys(devices) as DeviceMode[]).map((mode) => {
                const dev = devices[mode];
                const isActive = deviceMode === mode;
                return (
                  <button
                    key={mode}
                    onClick={() => setDeviceMode(mode)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      isActive
                        ? 'bg-white dark:bg-zinc-700 text-rose-500 shadow-sm'
                        : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                    }`}
                  >
                    {dev.icon}
                    <span className="hidden md:inline">{dev.name}</span>
                  </button>
                );
              })}
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-400 hover:text-slate-650 dark:hover:text-zinc-200 transition-all cursor-pointer active:scale-90"
              aria-label="Close modal"
            >
              <Icon name="close" size={18} />
            </button>
          </div>
        </div>

        {/* Canvas Body */}
        <div 
          ref={canvasRef} 
          className="flex-1 bg-slate-200 dark:bg-zinc-950 p-6 flex items-center justify-center overflow-hidden relative"
          style={{
            backgroundImage: `radial-gradient(circle, var(--border-color, #e2e8f0) 1px, transparent 1px)`,
            backgroundSize: '16px 16px',
          }}
        >
          {/* Simulated Screen with scale container */}
          <div
            style={{
              width: `${targetWidth * scale}px`,
              height: `${currentDevice.height * scale}px`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
            }}
            className="transition-all duration-300 relative shadow-2xl rounded-2xl border border-slate-350 dark:border-zinc-800"
          >
            <div
              style={{
                width: `${targetWidth}px`,
                height: `${currentDevice.height}px`,
                transform: `scale(${scale})`,
                transformOrigin: 'center center',
              }}
              className="bg-white dark:bg-zinc-900 relative flex flex-col shrink-0 overflow-hidden"
            >
              <IframePreview>
                <div className="relative w-full h-full">
                  {hero.layoutType === 'split-grid' ? (
                    <SplitGridHero 
                      hero={hero} 
                      isSticky={false} 
                      isAnnouncementBar={false} 
                    />
                  ) : (
                    <SliderHero 
                      hero={hero} 
                      isSticky={false} 
                      isAnnouncementBar={false} 
                    />
                  )}
                </div>
              </IframePreview>
            </div>
          </div>

          {/* Scale display indicator */}
          {scale < 1 && (
            <div className="absolute bottom-3 right-4 bg-slate-800/90 backdrop-blur-xs text-[10px] text-white/90 px-2.5 py-1 rounded-lg font-bold">
              Đang thu nhỏ: {Math.round(scale * 100)}%
            </div>
          )}
        </div>

        {/* Footer info bar */}
        <div className="px-6 py-3 border-t border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex justify-between items-center text-[10px] text-slate-400 shrink-0">
          <span>Kích thước giả lập: {currentDevice.width} × {currentDevice.height} ({currentDevice.name})</span>
          <span className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Kết nối trực tiếp Store
          </span>
        </div>
      </div>
    </div>
  );
}
