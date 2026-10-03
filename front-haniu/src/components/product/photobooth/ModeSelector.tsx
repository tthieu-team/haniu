import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Icon from '@/components/common/Icons';
import { PhotoboothMode } from './types';
import { TemplateBlueprintPreview } from './TemplateBlueprintPreview';
import { useTranslate } from '@/lib/translator';
import { useAuthStore } from '@/store/auth';

interface ModeSelectorProps {
  onSelect: (mode: string, userName: string) => void;
  customTemplates?: any[];
  hasMore?: boolean;
  loadingMore?: boolean;
  onLoadMore?: () => void;
}

export const ModeSelector: React.FC<ModeSelectorProps> = ({
  onSelect,
  customTemplates = [],
  hasMore = false,
  loadingMore = false,
  onLoadMore
}) => {
  const trans = useTranslate();
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // Infinite scroll observer
  useEffect(() => {
    if (!hasMore || loadingMore || !onLoadMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          onLoadMore();
        }
      },
      { rootMargin: '150px' }
    );

    const currentEl = sentinelRef.current;
    if (currentEl) {
      observer.observe(currentEl);
    }

    return () => {
      if (currentEl) {
        observer.unobserve(currentEl);
      }
    };
  }, [hasMore, loadingMore, onLoadMore]);

  const displayModes = customTemplates.map((t: any) => {
    const frameCount = t.slots ? t.slots.length : (
      Array.isArray(t.layers) ? t.layers.filter((l: any) => l.type === 'frame').length : (
        typeof t.layers === 'string' ? (() => {
          try {
            return JSON.parse(t.layers).filter((l: any) => l.type === 'frame').length;
          } catch (e) { return 0; }
        })() : 0
      )
    );
    return {
      id: t.id,
      label: t.name,
      iconName: frameCount <= 2 ? 'image' : 'grid',
      description: t.description || `Bố cục ${frameCount} ảnh chụp thiết kế riêng`,
      color: 'from-rose-500 to-amber-500',
      template: t
    };
  });

  return (
    <div className="w-full h-full bg-background flex flex-col items-center justify-start p-4 sm:p-6 overflow-y-auto relative custom-scrollbar transition-colors duration-500">
      <div className="absolute inset-0 opacity-[0.02] dark:opacity-10 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,var(--primary)_0%,transparent_50%)]" />
      </div>

      <motion.div
        initial={{ y: -15, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mb-5 z-10 pt-2 shrink-0"
      >
        <h2 className="text-xl sm:text-2xl font-black text-foreground mb-1 tracking-tight uppercase italic font-sans">
          {trans("CHỌN")} <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-color to-primary-color/75">{trans("KHUNG HÌNH")}</span> {trans("YÊU THÍCH")}
        </h2>
        <p className="text-muted-color font-bold uppercase tracking-[0.2em] text-[8px] sm:text-[9px]">
          {trans("Thiết kế phong cách in ảnh lưu niệm độc đáo")}
        </p>
      </motion.div>

      {/* Grid List with auto-rows-fr */}
      {displayModes.length > 0 ? (
        <div className="flex flex-col items-center max-w-5xl w-full z-10 pb-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 w-full auto-rows-fr">
            {displayModes.map((mode, index) => (
              <motion.button
                key={mode.id}
                initial={{ y: 15, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: Math.min(index * 0.02, 0.3) }}
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSelect(mode.id, '')}
                className="relative group bg-card-bg/45 border border-border-color rounded-2xl p-4 flex flex-col items-center justify-between text-center hover:border-primary-color/50 hover:bg-accent-color/10 transition-all duration-300 shadow-xs hover:shadow-md cursor-pointer h-full min-h-[155px]"
              >
                <div className="flex flex-col items-center w-full">
                  <TemplateBlueprintPreview template={mode.template} />
                  <h3 className="text-[11px] sm:text-xs font-black text-foreground mb-1 uppercase tracking-tight line-clamp-1">{trans(mode.label)}</h3>
                </div>
              </motion.button>
            ))}
          </div>

          {/* Loading More Indicator */}
          {loadingMore && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 w-full mt-3 animate-pulse">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-card-bg/30 border border-border-color/40 rounded-2xl p-4 flex flex-col items-center justify-center min-h-[155px]">
                  <div className="w-20 h-24 bg-card-bg/60 rounded-lg mb-2" />
                  <div className="h-3 w-16 bg-card-bg/60 rounded" />
                </div>
              ))}
            </div>
          )}

          {/* Sentinel element for infinite scroll */}
          <div ref={sentinelRef} className="h-4 w-full" />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-12 text-center bg-card-bg/30 border border-dashed border-border-color rounded-3xl max-w-md w-full mx-auto my-8 z-10">
          <div className="w-16 h-16 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500 mb-4">
            <Icon name="image" size={28} />
          </div>
          <h3 className="text-sm font-black uppercase text-foreground mb-1">Không có khung hình nào</h3>
          <p className="text-muted-color text-[10px] leading-relaxed max-w-xs">
            Hiện tại chưa có khung hình thiết kế nào hoạt động. Vui lòng quay lại sau hoặc liên hệ quản trị viên để thiết kế.
          </p>
        </div>
      )}
    </div>
  );
};
