import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Icon from '@/components/common/Icons';
import { PhotoboothMode } from './types';
import { useTranslate } from '@/lib/translator';

interface ModeSelectorProps {
  onSelect: (mode: string, userName: string) => void;
  customTemplates?: any[];
}

const MODES = [
  {
    id: 'single',
    label: 'Chụp 1 ảnh',
    iconName: 'image',
    description: 'Chụp một tấm duy nhất sắc nét',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'grid-2-v',
    label: '2 Ảnh Dọc',
    iconName: 'list',
    description: 'Bố cục 2 ảnh đứng song song',
    color: 'from-emerald-500 to-teal-500'
  },
  {
    id: 'grid-2-h',
    label: '2 Ảnh Ngang',
    iconName: 'list',
    description: 'Bố cục 2 ảnh nằm ngang cổ điển',
    color: 'from-rose-500 to-pink-500'
  },
  {
    id: 'grid-3-v',
    label: '3 Ảnh Dọc',
    iconName: 'grid',
    description: '3 tấm đứng phong cách nghệ thuật',
    color: 'from-indigo-500 to-purple-500'
  },
  {
    id: 'grid-4',
    label: '4 Ảnh Grid',
    iconName: 'grid',
    description: 'Bố cục 2x2 hiện đại, cân đối',
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: 'grid-6',
    label: '6 Ảnh Grid',
    iconName: 'grid',
    description: 'Bố cục 2x3 cho nhiều khoảnh khắc',
    color: 'from-orange-500 to-red-500'
  },
  {
    id: 'grid-9',
    label: '9 Ảnh Grid',
    iconName: 'grid',
    description: '9 ô vuông nhỏ cho bộ sưu tập cảm xúc',
    color: 'from-cyan-500 to-blue-500'
  },
  {
    id: 'strip-3',
    label: '3 Ảnh Strip',
    iconName: 'list',
    description: 'Dải ảnh 3 tấm phong cách Retro',
    color: 'from-yellow-500 to-amber-500'
  },
  {
    id: 'strip-4',
    label: '4 Ảnh Strip',
    iconName: 'list',
    description: 'Dải ảnh 4 tấm chuẩn Hàn Quốc',
    color: 'from-amber-500 to-orange-500'
  },
  {
    id: 'wide-1',
    label: 'Cinema Wide',
    iconName: 'image',
    description: 'Góc rộng điện ảnh siêu chất',
    color: 'from-slate-700 to-slate-900'
  },
  {
    id: 'mixed-3',
    label: 'Poster Mixed',
    iconName: 'grid',
    description: '1 chính lớn và 2 phụ nhỏ tinh tế',
    color: 'from-fuchsia-500 to-purple-600'
  },
  {
    id: 'mixed-4',
    label: 'Magazine Style',
    iconName: 'grid',
    description: 'Phong cách tạp chí thời thượng',
    color: 'from-sky-500 to-indigo-600'
  }
];

export const ModeSelector: React.FC<ModeSelectorProps> = ({ onSelect, customTemplates = [] }) => {
  const trans = useTranslate();

  const displayModes = customTemplates.map((t: any) => {
    const frameCount = t.slots ? t.slots.length : (
      Array.isArray(t.layers) ? t.layers.filter((l: any) => l.type === 'frame').length : (
        typeof t.layers === 'string' ? (() => {
          try {
            return JSON.parse(t.layers).filter((l: any) => l.type === 'frame').length;
          } catch(e) { return 0; }
        })() : 0
      )
    );
    return {
      id: t.id,
      label: t.name,
      iconName: frameCount <= 2 ? 'image' : 'grid',
      description: t.description || `Bố cục ${frameCount} ảnh chụp thiết kế riêng`,
      color: 'from-rose-500 to-amber-500'
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
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 max-w-5xl w-full z-10 pb-8 auto-rows-fr">
          {displayModes.map((mode, index) => (
            <motion.button
              key={mode.id}
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.03 }}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelect(mode.id, '')}
              className="relative group bg-card-bg/45 border border-border-color rounded-2xl p-4 flex flex-col items-center justify-between text-center hover:border-primary-color/50 hover:bg-accent-color/10 transition-all duration-300 shadow-xs hover:shadow-md cursor-pointer h-full min-h-[155px]"
            >
              <div className="flex flex-col items-center w-full">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${mode.color || 'from-rose-500 to-amber-500'} flex items-center justify-center mb-2.5 shadow-sm relative group-hover:scale-105 transition-transform duration-300`}>
                  <div className="absolute inset-0 bg-white/20 rounded-xl blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
                  <Icon name={mode.iconName} className="w-5 h-5 text-white relative z-10" />
                </div>

                <h3 className="text-[11px] sm:text-xs font-black text-foreground mb-1 uppercase tracking-tight">{trans(mode.label)}</h3>
                <p className="text-muted-color text-[8.5px] sm:text-[9.5px] font-medium leading-normal px-1">{trans(mode.description)}</p>
              </div>

              <div className="mt-3 px-3 py-1 bg-primary-color hover:bg-primary-color/90 text-white rounded-full text-[8.5px] font-bold uppercase tracking-wider transition-opacity shadow-xs">
                {trans("Chọn mẫu")}
              </div>
            </motion.button>
          ))}
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
