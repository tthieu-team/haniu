'use client';

import React, { useRef, useState } from 'react';
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

  const handleSelect = (filterId: FaceFilterType) => {
    onSelect(filterId);
  };

  return (
    <div className="relative inline-flex max-sm:flex-row sm:flex-col items-center w-fit shrink-0 select-none bg-black/60 backdrop-blur-2xl border border-white/20 rounded-full p-1 sm:p-2 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)]">
      {/* Loading Indicator (iOS Glass style) */}
      {isLoading && (
        <div className="absolute max-sm:bottom-[calc(100%+10px)] max-sm:left-1/2 max-sm:-translate-x-1/2 sm:right-[calc(100%+14px)] sm:top-2 z-50 px-2.5 py-1 bg-black/90 backdrop-blur-2xl rounded-full border border-white/25 shadow-xl flex items-center gap-1.5 whitespace-nowrap">
          <div className="w-2 h-2 rounded-full bg-rose-400 animate-pulse" />
          <span className="text-[8px] sm:text-[9px] font-bold text-white/90 uppercase tracking-wider">
            {trans('Đang tải...')}
          </span>
        </div>
      )}

      {/* Filter Buttons List */}
      <div
        ref={scrollRef}
        className="flex max-sm:flex-row sm:flex-col items-center gap-1 sm:gap-2 max-sm:overflow-x-auto max-sm:overflow-y-hidden sm:overflow-y-auto sm:overflow-x-hidden p-0.5 max-sm:max-w-[84vw] sm:max-w-[56px] sm:max-h-[60vh] no-scrollbar touch-pan-x"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {FACE_FILTERS.map((filter) => {
          const isActive = activeFilter === filter.id;
          const isNone = filter.id === 'none';

          return (
            <button
              key={filter.id}
              type="button"
              data-filter={filter.id}
              onClick={() => handleSelect(filter.id)}
              className={`
                relative flex-shrink-0 rounded-full flex items-center justify-center 
                max-sm:w-8 max-sm:h-8 sm:w-11 sm:h-11 cursor-pointer select-none
                transition-all duration-150 active:scale-90 hover:scale-105
                ${isActive
                  ? 'bg-rose-500/50 border-2 border-rose-400 shadow-[0_0_12px_rgba(244,63,94,0.5)] scale-105'
                  : isNone
                    ? 'bg-white/10 hover:bg-white/20 active:bg-white/25 border border-white/20 text-white/70'
                    : 'bg-white/10 hover:bg-white/20 active:bg-white/25 border border-white/15 text-white'
                }
                ${isLoading && filter.id !== 'none' ? 'opacity-40 pointer-events-none' : ''}
              `}
              title={trans(filter.name)}
            >
              {/* Internal Active Indicator Dot */}
              {isActive && !isNone && (
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 sm:w-2.5 sm:h-2.5 bg-rose-500 border border-white rounded-full shadow-xs" />
              )}

              <span className={`text-sm sm:text-lg pointer-events-none ${isNone ? 'text-[11px] sm:text-xs opacity-70' : ''}`}>
                {filter.icon}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
