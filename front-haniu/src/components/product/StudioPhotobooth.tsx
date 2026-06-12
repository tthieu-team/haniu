'use client';

import { useState, useEffect, type Dispatch, type SetStateAction } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import Icon from '@/components/common/Icons';
import { useThemeStore } from '@/store/theme';
import PhotoboothSystem from './photobooth/PhotoboothSystem';

interface StudioPhotoboothProps {
  photoboothPhotoUrls: string[];
  setPhotoboothPhotoUrls: Dispatch<SetStateAction<string[]>>;
  onPhotoSelected: (file: File) => void;
  onPhotoDeleted: (index: number) => void;
}

export default function StudioPhotobooth({
  photoboothPhotoUrls,
  setPhotoboothPhotoUrls,
  onPhotoSelected,
  onPhotoDeleted,
}: StudioPhotoboothProps) {
  const currentTheme = useThemeStore(state => state.theme);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number>(0);
  const [lightboxTheme, setLightboxTheme] = useState<'dark' | 'light'>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Sync lightbox theme with site theme automatically
  useEffect(() => {
    setLightboxTheme(currentTheme);
  }, [currentTheme]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!isLightboxOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        setSelectedPhotoIndex(prev => prev === 0 ? photoboothPhotoUrls.length - 1 : prev - 1);
      } else if (e.key === 'ArrowRight') {
        setSelectedPhotoIndex(prev => prev === photoboothPhotoUrls.length - 1 ? 0 : prev + 1);
      } else if (e.key === 'Escape') {
        setIsLightboxOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, photoboothPhotoUrls.length]);

  const handlePrevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedPhotoIndex(prev => 
      prev === 0 ? photoboothPhotoUrls.length - 1 : prev - 1
    );
  };

  const handleNextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedPhotoIndex(prev => 
      prev === photoboothPhotoUrls.length - 1 ? 0 : prev + 1
    );
  };

  const handleCaptureComplete = async (file: File) => {
    const localUrl = URL.createObjectURL(file);
    setPhotoboothPhotoUrls(prev => [...prev, localUrl]);
    onPhotoSelected(file);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const localUrl = URL.createObjectURL(file);
      setPhotoboothPhotoUrls(prev => [...prev, localUrl]);
      onPhotoSelected(file);
    }
  };

  const hasPhotos = photoboothPhotoUrls.length > 0;

  // Helper to determine optimal grid columns and max-width based on photo count (from 1 to 10)
  const getGridLayout = (count: number) => {
    if (count === 1) return { gridClass: 'grid-cols-1', maxW: 'max-w-[180px]' };
    if (count === 2) return { gridClass: 'grid-cols-2', maxW: 'max-w-sm' };
    if (count === 3) return { gridClass: 'grid-cols-3', maxW: 'max-w-md' };
    if (count === 4) return { gridClass: 'grid-cols-2 sm:grid-cols-4', maxW: 'max-w-xl' };
    if (count <= 6) return { gridClass: 'grid-cols-3', maxW: 'max-w-xl' };
    if (count <= 8) return { gridClass: 'grid-cols-4', maxW: 'max-w-2xl' };
    return { gridClass: 'grid-cols-5', maxW: 'max-w-3xl' };
  };

  const { gridClass, maxW } = getGridLayout(photoboothPhotoUrls.length);

  return (
    <div className="bg-white dark:bg-zinc-900/60 border border-slate-200/60 dark:border-zinc-800/80 rounded-3xl p-5 space-y-4 w-full shadow-xs text-xs font-semibold text-slate-800 dark:text-zinc-100">
      <label className="block text-slate-500 dark:text-zinc-400 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5">
        <Icon name="🖼️" size={14} className="text-rose-500" /> Studio Photobooth Haniu - In ảnh tặng kèm
      </label>

      {hasPhotos ? (
        /* Completed/Attached State Card (Multiple Photos list) */
        <div className="space-y-4 py-2">
          {/* Thumbnails grid / Slider */}
          <div className={
            photoboothPhotoUrls.length >= 3
              ? "flex gap-4 overflow-x-auto pt-3 pb-3.5 scrollbar-thin scrollbar-thumb-rose-500/20 dark:scrollbar-thumb-zinc-700 scrollbar-track-transparent w-full snap-x snap-mandatory px-2 custom-scrollbar"
              : `grid ${gridClass} gap-4 w-full ${maxW} mx-auto pt-3 px-2`
          }>
            {photoboothPhotoUrls.map((url, idx) => (
              <div 
                key={idx}
                className={
                  photoboothPhotoUrls.length >= 3
                    ? "relative w-[45%] sm:w-36 aspect-[2/3] shrink-0 snap-start group"
                    : "relative w-full aspect-[2/3] group"
                }
              >
                {/* Image preview box */}
                <div
                  onClick={() => {
                    setSelectedPhotoIndex(idx);
                    setIsLightboxOpen(true);
                  }}
                  className="cursor-pointer w-full h-full border-2 border-white dark:border-zinc-850 shadow-md rounded-2xl overflow-hidden bg-slate-50 dark:bg-zinc-900 transition-all hover:scale-[1.03] active:scale-98 relative"
                >
                  <img src={url} className="w-full h-full object-cover" alt={`Photobooth print ${idx + 1}`} />
                  <div className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                    <Icon name="search" size={16} />
                  </div>
                </div>

                {/* Larger delete button hanging slightly outside */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onPhotoDeleted(idx);
                  }}
                  className="absolute -top-2 -right-2 bg-rose-500 hover:bg-rose-600 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-md hover:scale-110 active:scale-90 transition-all cursor-pointer z-20 border border-white dark:border-zinc-900"
                  title="Xóa ảnh này"
                >
                  <Icon name="close" size={10} className="text-white" />
                </button>
              </div>
            ))}
          </div>
          
          <div className="space-y-1 text-center px-4">
            <p className="text-emerald-500 text-[11px] font-bold">✓ Đã đính kèm {photoboothPhotoUrls.length} ảnh photobooth!</p>
            <p className="text-[10px] text-slate-400 dark:text-zinc-500 font-normal leading-normal italic">
              Nhấp vào từng ảnh để xem kích thước đầy đủ. Bạn có thể chụp hoặc tải thêm tối đa nhiều ảnh kỷ niệm.
            </p>
            <p className="text-[10px] text-rose-500 dark:text-rose-400 font-bold leading-normal">
              * Đừng lo lắng về kích thước ảnh! Đội ngũ Haniu sẽ tự động tối ưu hóa và căn chỉnh chuyên nghiệp để đảm bảo thành phẩm in đạt chất lượng tốt nhất.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-2 justify-center mt-3.5 max-w-[280px] mx-auto">
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="px-3 py-1.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-[10px] font-bold transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1.5 flex-1"
              >
                <Icon name="camera" size={11} /> Chụp thêm ảnh
              </button>

              <label className="px-3 py-1.5 border border-slate-200 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-300 font-bold rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5 text-[10px] cursor-pointer flex-1 text-center">
                <Icon name="image" size={11} /> Tải thêm ảnh
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>
      ) : (
        /* Invitation / Launcher Card */
        <div className="text-center p-5 border-2 border-dashed border-rose-200/50 dark:border-zinc-800/80 rounded-2xl bg-rose-500/[0.01] dark:bg-zinc-900/10">
          <p className="text-slate-550 dark:text-zinc-400 mb-4 text-[11px] leading-relaxed font-normal">
            Haniu tặng bạn các tấm ảnh in màu lưu niệm kèm theo hộp quà. Tự sướng với webcam hoặc tải lên bức ảnh có sẵn, chèn lời chúc cùng sticker xinh xắn để đặt vào quà tặng nhé!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-2.5 justify-center max-w-sm mx-auto">
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2.5 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 text-[10px] cursor-pointer flex-1"
            >
              <Icon name="camera" size={12} /> Bật Camera Photobooth
            </button>

            <label className="px-4 py-2.5 border border-slate-200 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-300 font-bold rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 text-[10px] cursor-pointer flex-1 text-center">
              <Icon name="image" size={12} /> Tải ảnh có sẵn
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>
      )}

      {/* FULLSCREEN POPUP MODAL SYSTEM - ESCAPING STACKING CONTEXT VIA PORTAL */}
      {mounted && isModalOpen && createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/85 backdrop-blur-md p-0 sm:p-4">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full h-full sm:w-[91.666667%] sm:max-w-5xl sm:xl:max-w-6xl sm:h-[90vh] sm:max-h-[800px] bg-white dark:bg-zinc-950 rounded-none sm:rounded-[32px] overflow-hidden shadow-2xl border-0 sm:border border-slate-200/50 dark:border-zinc-800 relative flex flex-col"
          >
            <PhotoboothSystem 
              onCapture={handleCaptureComplete}
              onClose={() => setIsModalOpen(false)}
            />
          </motion.div>
        </div>,
        document.body
      )}

      {/* FULLSCREEN LIGHTBOX FOR ATTACHED PHOTO */}
      {mounted && isLightboxOpen && createPortal(
        <div 
          className={`fixed inset-0 z-[9999999] flex items-center justify-center transition-all duration-300 cursor-zoom-out p-4 ${
            lightboxTheme === 'dark' 
              ? 'bg-black/90 text-white backdrop-blur-md' 
              : 'bg-white/95 text-slate-900 backdrop-blur-md shadow-2xl'
          }`}
          onClick={() => setIsLightboxOpen(false)}
        >
           {/* Fixed Top Bar Controls for Theme Toggle, Navigation, and Close */}
          <div className="fixed top-6 right-6 flex items-center gap-2 z-[10000000]" onClick={e => e.stopPropagation()}>
            {/* Prev button */}
            {photoboothPhotoUrls.length > 1 && (
              <button
                onClick={handlePrevPhoto}
                className={`p-2.5 border rounded-full cursor-pointer transition-all hover:scale-105 active:scale-95 ${
                  lightboxTheme === 'dark' 
                    ? 'bg-white/10 hover:bg-white/20 border-white/20 text-white' 
                    : 'bg-black/5 hover:bg-black/10 border-black/10 text-slate-700'
                }`}
                title="Ảnh trước"
              >
                <Icon name="arrow-left" size={16} />
              </button>
            )}

            {/* Next button */}
            {photoboothPhotoUrls.length > 1 && (
              <button
                onClick={handleNextPhoto}
                className={`p-2.5 border rounded-full cursor-pointer transition-all hover:scale-105 active:scale-95 ${
                  lightboxTheme === 'dark' 
                    ? 'bg-white/10 hover:bg-white/20 border-white/20 text-white' 
                    : 'bg-black/5 hover:bg-black/10 border-black/10 text-slate-700'
                }`}
                title="Ảnh sau"
              >
                <Icon name="arrow-right" size={16} />
              </button>
            )}

            <button
              onClick={() => setLightboxTheme(prev => prev === 'dark' ? 'light' : 'dark')}
              className={`p-2.5 border rounded-full cursor-pointer transition-all ${
                lightboxTheme === 'dark' 
                  ? 'bg-white/10 hover:bg-white/20 border-white/20 text-white' 
                  : 'bg-black/5 hover:bg-black/10 border-black/10 text-slate-700'
              }`}
              title={lightboxTheme === 'dark' ? "Chuyển sang nền sáng" : "Chuyển sang nền tối"}
            >
              <Icon name={lightboxTheme === 'dark' ? 'sun' : 'moon'} size={16} />
            </button>
            <button
              onClick={() => setIsLightboxOpen(false)}
              className={`p-2.5 border rounded-full cursor-pointer transition-all ${
                lightboxTheme === 'dark' 
                  ? 'bg-white/10 hover:bg-white/20 border-white/20 text-white' 
                  : 'bg-black/5 hover:bg-black/10 border-black/10 text-slate-700'
              }`}
              title="Đóng xem ảnh"
            >
              <Icon name="close" size={16} />
            </button>
          </div>

          <div className="relative w-full h-full flex items-center justify-center p-4 sm:p-12" onClick={e => e.stopPropagation()}>
            <img 
              src={photoboothPhotoUrls[selectedPhotoIndex]} 
              className="max-w-[95vw] max-h-[85vh] object-contain transition-all duration-300 cursor-default rounded-xl shadow-2xl" 
              alt="Full size photobooth composite" 
            />
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
