'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslate } from '@/lib/translator';
import type { FaceFilterType } from './types';
import { FACE_FILTERS } from './FaceFilterEngine';

interface FaceFilterSelectorProps {
  activeFilter: FaceFilterType;
  onSelect: (filter: FaceFilterType) => void;
  isLoading?: boolean;
}

export const FaceFilterSelector: React.FC<FaceFilterSelectorProps> = ({
  activeFilter,
  onSelect,
  isLoading = false,
}) => {
  const trans = useTranslate();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLabel, setShowLabel] = useState<string | null>(null);

  // Auto-scroll to active filter
  useEffect(() => {
    if (scrollRef.current && activeFilter !== 'none') {
      const activeEl = scrollRef.current.querySelector(`[data-filter="${activeFilter}"]`);
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [activeFilter]);

  const handleSelect = (filterId: FaceFilterType, filterName: string) => {
    onSelect(filterId);
    setShowLabel(filterName);
    setTimeout(() => setShowLabel(null), 1200);
  };

  return (
    <div className="relative flex flex-col items-center gap-2">
      {/* Filter name label popup */}
      <AnimatePresence>
        {showLabel && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -5, scale: 0.9 }}
            className="absolute -top-9 z-50 px-3 py-1.5 bg-black/70 backdrop-blur-md rounded-full border border-white/10 shadow-lg"
          >
            <span className="text-[9px] font-black text-white uppercase tracking-wider whitespace-nowrap">
              {showLabel}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading indicator */}
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute -top-9 z-50 px-3 py-1.5 bg-black/70 backdrop-blur-md rounded-full border border-white/10 shadow-lg flex items-center gap-1.5"
        >
          <div className="w-2 h-2 rounded-full bg-rose-400 animate-pulse" />
          <span className="text-[8px] font-bold text-white/80 uppercase tracking-wider">
            {trans('Đang tải Face AI...')}
          </span>
        </motion.div>
      )}

      {/* Filter carousel */}
      <div
        ref={scrollRef}
        className="flex items-center gap-2 overflow-x-auto no-scrollbar px-2 pb-1 max-w-[85vw] sm:max-w-[400px]"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {FACE_FILTERS.map((filter, index) => {
          const isActive = activeFilter === filter.id;
          const isNone = filter.id === 'none';

          return (
            <motion.button
              key={filter.id}
              data-filter={filter.id}
              whileTap={{ scale: 0.85 }}
              whileHover={{ scale: 1.08 }}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.04, type: 'spring', stiffness: 300, damping: 20 }}
              onClick={() => handleSelect(filter.id, filter.name)}
              className={`
                relative flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center 
                transition-all duration-200 cursor-pointer
                ${isActive
                  ? 'bg-rose-500/20 border-2 border-rose-500 shadow-lg shadow-rose-500/20 scale-110'
                  : isNone
                    ? 'bg-black/30 border-2 border-white/15 hover:border-white/30'
                    : 'bg-black/40 border-2 border-white/10 hover:border-white/25 hover:bg-black/50'
                }
                ${isLoading && filter.id !== 'none' ? 'opacity-50 pointer-events-none' : ''}
              `}
              title={trans(filter.name)}
            >
              {/* Active ring animation */}
              {isActive && !isNone && (
                <motion.div
                  className="absolute inset-[-3px] rounded-full border-2 border-rose-400/50"
                  animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                />
              )}

              <span className={`text-lg select-none ${isNone ? 'text-sm opacity-60' : ''}`}>
                {filter.icon}
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* Section label */}
      <div className="flex items-center gap-1.5">
        <div className="w-1.5 h-1.5 rounded-full bg-rose-500/60" />
        <span className="text-[7px] font-black text-white/40 uppercase tracking-[0.15em]">
          {trans('FACE FILTERS')}
        </span>
      </div>
    </div>
  );
};
