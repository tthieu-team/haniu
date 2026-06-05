'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Icon from '@/components/common/Icons';

interface ResultViewProps {
  imageBlob: Blob;
  imageUrl: string;
  onRestart: () => void;
  onConfirm: (blob: Blob) => void;
}

export const ResultView: React.FC<ResultViewProps> = ({ 
  imageBlob, 
  imageUrl, 
  onRestart, 
  onConfirm 
}) => {
  return (
    <div className="w-full h-full bg-background flex flex-col md:flex-row items-center justify-center p-4 sm:p-6 md:p-8 gap-6 overflow-y-auto min-h-[500px] transition-colors duration-500">
      {/* Product Preview */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative bg-card-bg p-2 shadow-xl rounded-2xl border border-border-color"
      >
        <img 
          src={imageUrl} 
          alt="Completed photobooth strip print" 
          className="max-h-[50vh] md:max-h-[68vh] w-auto object-contain rounded-lg shadow-inner block" 
        />
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-md border-2 border-white dark:border-zinc-900">
          <Icon name="check" size={16} />
        </div>
      </motion.div>

      {/* Control Actions Panel */}
      <div className="flex flex-col gap-4 max-w-sm w-full">
        <div className="text-center md:text-left">
          <div className="inline-block px-2.5 py-0.5 bg-primary-color/10 text-primary-color rounded-full text-[9px] font-black uppercase tracking-wider mb-1">
            Đã hoàn tất ảnh ghép
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-foreground uppercase tracking-tight font-sans italic">SIÊU PHẨM XINH XẮN! 🌸</h2>
          <p className="text-[10px] text-muted-color">Ảnh đã ghép thành công và sẵn sàng để in.</p>
        </div>

        <div className="flex flex-col gap-2">
          <button
            onClick={() => onConfirm(imageBlob)}
            className="h-12 rounded-xl font-black bg-primary-color hover:bg-primary-color/90 text-white transition-all text-[11px] uppercase tracking-widest shadow-md shadow-primary-color/20 flex items-center justify-center gap-1 cursor-pointer active:scale-98"
          >
            <Icon name="check" size={14} /> Đính kèm và Đóng
          </button>
        </div>

        <button
          onClick={onRestart}
          className="flex items-center justify-center gap-1.5 text-muted-color hover:text-primary-color transition-colors text-[9px] font-bold uppercase tracking-wider py-1.5 cursor-pointer"
        >
          <Icon name="refresh" size={10} />
          <span>Chụp bộ ảnh mới</span>
        </button>
      </div>
    </div>
  );
};
