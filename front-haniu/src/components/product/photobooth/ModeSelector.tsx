import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Icon from '@/components/common/Icons';
import { PhotoboothMode } from './types';

interface ModeSelectorProps {
  onSelect: (mode: PhotoboothMode, userName: string) => void;
}

const MODES = [
  {
    id: 'single' as PhotoboothMode,
    label: 'Chụp 1 ảnh',
    iconName: 'image',
    description: 'Chụp một tấm duy nhất sắc nét',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'grid-2-v' as PhotoboothMode,
    label: '2 Ảnh Dọc',
    iconName: 'list',
    description: 'Bố cục 2 ảnh đứng song song',
    color: 'from-emerald-500 to-teal-500'
  },
  {
    id: 'grid-2-h' as PhotoboothMode,
    label: '2 Ảnh Ngang',
    iconName: 'list',
    description: 'Bố cục 2 ảnh nằm ngang cổ điển',
    color: 'from-rose-500 to-pink-500'
  },
  {
    id: 'grid-3-v' as PhotoboothMode,
    label: '3 Ảnh Dọc',
    iconName: 'grid',
    description: '3 tấm đứng phong cách nghệ thuật',
    color: 'from-indigo-500 to-purple-500'
  },
  {
    id: 'grid-4' as PhotoboothMode,
    label: '4 Ảnh Grid',
    iconName: 'grid',
    description: 'Bố cục 2x2 hiện đại, cân đối',
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: 'grid-6' as PhotoboothMode,
    label: '6 Ảnh Grid',
    iconName: 'grid',
    description: 'Bố cục 2x3 cho nhiều khoảnh khắc',
    color: 'from-orange-500 to-red-500'
  },
  {
    id: 'grid-9' as PhotoboothMode,
    label: '9 Ảnh Grid',
    iconName: 'grid',
    description: '9 ô vuông nhỏ cho bộ sưu tập cảm xúc',
    color: 'from-cyan-500 to-blue-500'
  },
  {
    id: 'strip-3' as PhotoboothMode,
    label: '3 Ảnh Strip',
    iconName: 'list',
    description: 'Dải ảnh 3 tấm phong cách Retro',
    color: 'from-yellow-500 to-amber-500'
  },
  {
    id: 'strip-4' as PhotoboothMode,
    label: '4 Ảnh Strip',
    iconName: 'list',
    description: 'Dải ảnh 4 tấm chuẩn Hàn Quốc',
    color: 'from-amber-500 to-orange-500'
  },
  {
    id: 'wide-1' as PhotoboothMode,
    label: 'Cinema Wide',
    iconName: 'image',
    description: 'Góc rộng điện ảnh siêu chất',
    color: 'from-slate-700 to-slate-900'
  },
  {
    id: 'mixed-3' as PhotoboothMode,
    label: 'Poster Mixed',
    iconName: 'grid',
    description: '1 chính lớn và 2 phụ nhỏ tinh tế',
    color: 'from-fuchsia-500 to-purple-600'
  },
  {
    id: 'mixed-4' as PhotoboothMode,
    label: 'Magazine Style',
    iconName: 'grid',
    description: 'Phong cách tạp chí thời thượng',
    color: 'from-sky-500 to-indigo-600'
  }
];

export const ModeSelector: React.FC<ModeSelectorProps> = ({ onSelect }) => {
  const [userName, setUserName] = useState('');

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
          CHỌN <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-color to-primary-color/75">KHUNG HÌNH</span> YÊU THÍCH
        </h2>
        <p className="text-muted-color font-bold uppercase tracking-[0.2em] text-[8px] sm:text-[9px]">
          Thiết kế phong cách in ảnh lưu niệm độc đáo
        </p>
      </motion.div>

      {/* User Branding Card */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-md bg-card-bg border border-border-color rounded-2xl p-4 mb-5 backdrop-blur-2xl shadow-sm relative overflow-hidden group shrink-0"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-color to-primary-color/70 opacity-60" />
        
        <div className="flex items-center gap-2 mb-2.5">
          <div className="w-6 h-6 rounded-lg bg-primary-color/10 flex items-center justify-center">
            <Icon name="user" size={12} className="text-primary-color" />
          </div>
          <span className="text-[9px] font-black uppercase tracking-[0.15em] text-muted-color">Tên hiển thị trên ảnh</span>
        </div>
        
        <input
          type="text"
          placeholder="Ví dụ: Hieu & Vy, Happy Birthday..."
          value={userName}
          maxLength={30}
          onChange={e => setUserName(e.target.value)}
          className="bg-background border border-border-color text-foreground placeholder:text-muted-color/60 h-10 px-3.5 rounded-xl w-full text-[11px] font-bold focus:ring-1 focus:ring-primary-color focus:outline-none"
        />
        
        <div className="flex items-center justify-between mt-3.5 text-[8.5px] text-muted-color font-bold uppercase tracking-wider">
          <div className="flex items-center gap-1"><Icon name="calendar" size={10} className="text-primary-color/40" /> {new Date().toLocaleDateString('vi-VN')}</div>
          <div className="flex items-center gap-1"><Icon name="map-pin" size={10} className="text-primary-color/40" /> Haniu Studio</div>
        </div>
      </motion.div>

      {/* Grid List with auto-rows-fr to make all buttons exactly equal height */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 max-w-5xl w-full z-10 pb-8 auto-rows-fr">
        {MODES.map((mode, index) => (
          <motion.button
            key={mode.id}
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: index * 0.03 }}
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(mode.id, userName)}
            className="relative group bg-card-bg/45 border border-border-color rounded-2xl p-4 flex flex-col items-center justify-between text-center hover:border-primary-color/50 hover:bg-accent-color/10 transition-all duration-300 shadow-xs hover:shadow-md cursor-pointer h-full min-h-[155px]"
          >
            <div className="flex flex-col items-center w-full">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${mode.color} flex items-center justify-center mb-2.5 shadow-sm relative group-hover:scale-105 transition-transform duration-300`}>
                <div className="absolute inset-0 bg-white/20 rounded-xl blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
                <Icon name={mode.iconName} className="w-5 h-5 text-white relative z-10" />
              </div>

              <h3 className="text-[11px] sm:text-xs font-black text-foreground mb-1 uppercase tracking-tight">{mode.label}</h3>
              <p className="text-muted-color text-[8.5px] sm:text-[9.5px] font-medium leading-normal px-1">{mode.description}</p>
            </div>

            <div className="mt-3 px-3 py-1 bg-primary-color hover:bg-primary-color/90 text-white rounded-full text-[8.5px] font-bold uppercase tracking-wider transition-opacity shadow-xs">
              Chọn mẫu
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};
