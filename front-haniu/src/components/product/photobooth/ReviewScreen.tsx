'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '@/components/common/Icons';
import { CapturedPhoto, PhotoboothTemplate } from './types';
import { useTranslate } from '@/lib/translator';

interface ReviewScreenProps {
  photos: CapturedPhoto[];
  template: PhotoboothTemplate;
  onRetake: (index: number) => void;
  onConfirm: () => void;
  onRetakeAll: () => void;
}

export const ReviewScreen: React.FC<ReviewScreenProps> = ({
  photos,
  template,
  onRetake,
  onConfirm,
  onRetakeAll
}) => {
  const trans = useTranslate();
  return (
    <div className="w-full h-full bg-background flex flex-col items-center justify-start p-4 sm:p-6 overflow-y-auto min-h-0">
      <motion.div
        initial={{ y: -15, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mb-6 sm:mb-8"
      >
        <h2 className="text-xl sm:text-2xl font-black text-foreground mb-1 uppercase tracking-tight font-sans">{trans("KIỂM TRA HÌNH ẢNH 📸")}</h2>
        <p className="text-muted-color text-[10px] sm:text-xs">{trans("Nhấp vào từng hình để chụp lại nếu chưa ưng ý")}</p>
      </motion.div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-w-4xl w-full mb-8">
        <AnimatePresence mode="popLayout">
          {photos.map((photo, index) => {
            const slot = template.slots[index] || {};
             const frameShape = slot.frameShape || 'rect';
            const borderRadius = frameShape === 'circle' ? '999px' : (frameShape !== 'rect' && frameShape !== 'custom' && frameShape !== 'custom-path' ? '0px' : `${slot.cornerRadius ?? 16}px`);
            
            const clipPath = frameShape === 'custom-path' && (slot.framePath || slot.framePolygon)
              ? (slot.framePath ? `url(#clip-review-${photo.id || index})` : `polygon(${slot.framePolygon})`)
              : (frameShape !== 'rect' && frameShape !== 'circle' && frameShape !== 'custom'
                 ? (frameShape === 'triangle' ? 'polygon(50% 0%, 0% 100%, 100% 100%)' 
                    : frameShape === 'heart' ? 'polygon(50% 24%, 62% 10%, 78% 10%, 90% 20%, 94% 40%, 82% 65%, 50% 95%, 18% 65%, 6% 40%, 10% 20%, 26% 10%, 38% 24%)'
                    : frameShape === 'star' ? 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)'
                    : 'none')
                 : 'none');

            return (
              <motion.div
                key={photo.id}
                layout
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                whileHover={{ y: -4 }}
                className="relative w-full"
              >
                <div 
                  className="relative group bg-card-bg overflow-hidden shadow-lg w-full"
                  style={{ 
                    aspectRatio: (slot.width && slot.height) ? `${slot.width} / ${slot.height}` : '3/4',
                    borderRadius, 
                    clipPath,
                    borderWidth: (frameShape === 'rect' || frameShape === 'circle') ? `${slot.borderSize ?? 4}px` : '0px',
                    borderColor: slot.borderColor || '#ffffff',
                    borderStyle: (slot.borderSize ?? 4) > 0 ? 'solid' : 'none',
                    transform: slot.rotation ? `rotate(${slot.rotation}deg)` : 'none'
                  }}
                >
                  {frameShape === 'custom-path' && slot.framePath && (
                    <svg width="0" height="0" className="absolute">
                      <defs>
                        <clipPath id={`clip-review-${photo.id || index}`} clipPathUnits="objectBoundingBox">
                          <path d={slot.framePath} transform="scale(0.01)" />
                        </clipPath>
                      </defs>
                    </svg>
                  )}
                  {frameShape !== 'rect' && frameShape !== 'circle' && frameShape !== 'custom' && (
                    <svg className="absolute inset-0 w-full h-full pointer-events-none z-15" viewBox="0 0 100 100" preserveAspectRatio="none">
                      {frameShape === 'custom-path' && slot.framePath ? (
                        <path 
                          d={slot.framePath}
                          fill="none"
                          stroke={slot.borderColor || '#ffffff'}
                          strokeWidth={(slot.borderSize ?? 4) * 2}
                          vectorEffect="non-scaling-stroke"
                        />
                      ) : (
                        <polygon 
                          points={
                            frameShape === 'triangle' ? '50 0, 0 100, 100 100'
                            : frameShape === 'heart' ? '50 24, 62 10, 78 10, 90 20, 94 40, 82 65, 50 95, 18 65, 6 40, 10 20, 26 10, 38 24'
                            : frameShape === 'custom-path' && slot.framePolygon ? slot.framePolygon.replace(/%/g, '')
                            : '50 0, 61 35, 98 35, 68 57, 79 91, 50 70, 21 91, 32 57, 2 35, 39 35'
                          }
                          fill="none"
                          stroke={slot.borderColor || '#ffffff'}
                          strokeWidth={(slot.borderSize ?? 4) * 2}
                          vectorEffect="non-scaling-stroke"
                        />
                      )}
                    </svg>
                  )}
                  <img 
                    src={photo.url} 
                    alt={`Shot ${index + 1}`} 
                    className="w-full h-full object-cover" 
                    style={{
                      transform: slot.rotation ? `rotate(${-slot.rotation}deg)` : 'none'
                    }}
                  />

                  <div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center gap-2.5 p-3">
                    <div className="text-center">
                      <p className="text-white font-black text-xs uppercase tracking-wider">{trans("ẢNH")} {index + 1}</p>
                      <p className="text-white/70 text-[9px] font-bold mt-0.5">{trans("Bạn muốn chụp lại?")}</p>
                    </div>

                    <button
                      onClick={() => onRetake(index)}
                      className="px-3.5 py-1.5 bg-white hover:bg-slate-100 text-slate-900 rounded-xl hover:scale-105 active:scale-95 transition-all shadow-md font-bold text-[10px] uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
                    >
                      <Icon name="refresh" size={11} className="text-primary-color" />
                      {trans("Chụp lại")}
                    </button>
                  </div>

                  <div className="absolute top-3 left-3 w-6 h-6 bg-primary-color rounded-lg flex items-center justify-center text-white text-[10px] font-black shadow-md">
                    {index + 1}
                  </div>
                </div>
              </motion.div>
          );})}
        </AnimatePresence>
      </div>

      <div className="grid grid-cols-2 gap-2.5 w-full max-w-md mb-6">
        <button
          onClick={onRetakeAll}
          className="h-11 px-3 rounded-xl font-bold border border-primary-color/20 bg-primary-color/10 text-primary-color hover:bg-primary-color/20 transition-all text-[10px] sm:text-[11px] uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
        >
          <Icon name="trash" size={13} />
          {trans("Xóa chụp lại tất cả")}
        </button>
        <button
          onClick={onConfirm}
          className="h-11 px-3 rounded-xl font-black bg-rose-600 hover:bg-rose-700 dark:bg-rose-500 dark:hover:bg-rose-600 text-white transition-all text-[10px] sm:text-[11px] uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md shadow-rose-550/20 cursor-pointer whitespace-nowrap"
        >
          <Icon name="check" size={13} />
          {trans("Ghép ảnh tiếp tục")}
        </button>
      </div>

      <p className="text-[8px] text-muted-color/40 uppercase tracking-[0.25em] font-sans">Haniu Collection Photobooth Studio</p>
    </div>
  );
};
