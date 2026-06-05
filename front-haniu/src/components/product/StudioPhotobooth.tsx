'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import Icon from '@/components/common/Icons';
import PhotoboothSystem from './photobooth/PhotoboothSystem';

interface StudioPhotoboothProps {
  photoboothPhotoUrl: string;
  setPhotoboothPhotoUrl: (url: string) => void;
  onPhotoSelected: (file: File | null) => void;
}

export default function StudioPhotobooth({
  photoboothPhotoUrl,
  setPhotoboothPhotoUrl,
  onPhotoSelected,
}: StudioPhotoboothProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const handleCaptureComplete = async (file: File) => {
    const localUrl = URL.createObjectURL(file);
    setPhotoboothPhotoUrl(localUrl);
    onPhotoSelected(file);
    setIsModalOpen(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const localUrl = URL.createObjectURL(file);
      setPhotoboothPhotoUrl(localUrl);
      onPhotoSelected(file);
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900/60 border border-slate-200/60 dark:border-zinc-800/80 rounded-3xl p-5 space-y-4 w-full shadow-xs text-xs font-semibold text-slate-800 dark:text-zinc-100">
      <label className="block text-slate-500 dark:text-zinc-400 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5">
        <Icon name="🖼️" size={14} className="text-rose-500" /> Studio Photobooth Haniu - In ảnh tặng kèm
      </label>

      {photoboothPhotoUrl ? (
        /* Completed/Attached State Card */
        <div className="space-y-4 text-center py-2">
          <div className="relative inline-block border-8 border-white dark:border-zinc-800 shadow-md rounded-2xl overflow-hidden bg-slate-50 dark:bg-zinc-900 transition-colors">
            <img src={photoboothPhotoUrl} className="w-36 h-48 object-cover" alt="Completed photobooth design print" />
            <button
              type="button"
              onClick={() => {
                setPhotoboothPhotoUrl('');
                onPhotoSelected(null);
              }}
              className="absolute -top-2 -right-2 bg-rose-500 hover:bg-rose-600 text-white rounded-full p-1.5 shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
              title="Xóa ảnh kỷ niệm"
            >
              <Icon name="close" size={10} />
            </button>
          </div>
          <div className="space-y-1 px-4">
            <p className="text-emerald-500 text-[11px] font-bold">✓ Đã đính kèm ảnh chụp photobooth của bạn!</p>
            <p className="text-[10px] text-slate-400 dark:text-zinc-500 font-normal leading-normal italic">
              Ảnh kỷ niệm này sẽ được Haniu in màu chất lượng cao và bỏ vào hộp quà nắn nót giúp bạn.
            </p>
            <div className="flex justify-center mt-3 max-w-[140px] mx-auto">
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="px-3 py-1.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-[10px] font-bold transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1.5 w-full"
              >
                <Icon name="camera" size={11} /> Chụp lại ảnh khác
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Invitation / Launcher Card */
        <div className="text-center p-5 border-2 border-dashed border-rose-200/50 dark:border-zinc-800/80 rounded-2xl bg-rose-500/[0.01] dark:bg-zinc-900/10">
          <p className="text-slate-550 dark:text-zinc-400 mb-4 text-[11px] leading-relaxed font-normal">
            Haniu tặng bạn 1 tấm ảnh in màu lưu niệm kèm theo hộp quà. Tự sướng với webcam hoặc tải lên bức ảnh có sẵn, chèn lời chúc cùng sticker xinh xắn để đặt vào quà tặng nhé!
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
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-4">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-5xl xl:max-w-6xl h-[90vh] max-h-[800px] bg-white dark:bg-zinc-950 rounded-3xl sm:rounded-[32px] overflow-hidden shadow-2xl border border-slate-200/50 dark:border-zinc-800 relative flex flex-col"
            style={{ width: '91.666667%', height: '90vh' }}
          >
            <PhotoboothSystem 
              onCapture={handleCaptureComplete}
              onClose={() => setIsModalOpen(false)}
            />
          </motion.div>
        </div>,
        document.body
      )}
    </div>
  );
}
