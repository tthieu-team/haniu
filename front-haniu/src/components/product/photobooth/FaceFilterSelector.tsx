'use client';

import React, { useRef, useState } from 'react';
import { useTranslate } from '@/lib/translator';
import type { FaceFilterType } from './types';
import { FACE_FILTERS } from './FaceFilterEngine';

interface FaceFilterSelectorProps {
  activeFilter: FaceFilterType;
  onSelect: (filter: FaceFilterType) => void;
  isLoading?: boolean;
  orientation?: 'vertical' | 'horizontal';
}

export const FaceFilterSelector: React.FC<FaceFilterSelectorProps> = ({
  activeFilter,
  onSelect,
  isLoading = false,
  orientation = 'vertical',
}) => {
  const trans = useTranslate();
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeLabel, setActiveLabel] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState<number | null>(null);
  const labelTimerRef = useRef<NodeJS.Timeout | null>(null);

  const isVertical = orientation === 'vertical';

  const handleSelect = (filterId: FaceFilterType, filterName: string, e?: React.MouseEvent<HTMLButtonElement>) => {
    onSelect(filterId);
    if (labelTimerRef.current) clearTimeout(labelTimerRef.current);

    if (containerRef.current && e?.currentTarget) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const buttonRect = e.currentTarget.getBoundingClientRect();
      if (isVertical) {
        const relativeTop = (buttonRect.top + buttonRect.height / 2) - containerRect.top;
        setTooltipPos(relativeTop);
      } else {
        const relativeLeft = (buttonRect.left + buttonRect.width / 2) - containerRect.left;
        setTooltipPos(relativeLeft);
      }
    }

    setActiveLabel(filterName);
    labelTimerRef.current = setTimeout(() => {
      setActiveLabel(null);
    }, 1200);
  };

  return (
    <div
      ref={containerRef}
      className={`relative flex items-center select-none ${
        isVertical
          ? 'flex-col bg-black/45 backdrop-blur-2xl border border-white/20 rounded-full p-2 shadow-[0_8px_32px_0_rgba(0,0,0,0.45)]'
          : 'flex-col gap-2 bg-black/45 backdrop-blur-2xl border border-white/20 rounded-full p-2 shadow-[0_8px_32px_0_rgba(0,0,0,0.45)]'
      }`}
    >
      {/* Active Filter Name Tooltip (iOS Glass Pill flyout to the left) */}
      {activeLabel && (
        <div
          className="px-3.5 py-1.5 bg-black/80 backdrop-blur-2xl rounded-full border border-white/25 shadow-2xl pointer-events-none flex items-center whitespace-nowrap transition-all duration-150"
          style={
            isVertical
              ? {
                  position: 'absolute',
                  right: 'calc(100% + 14px)',
                  top: tooltipPos !== null ? `${tooltipPos}px` : '50%',
                  transform: 'translateY(-50%)',
                  zIndex: 100,
                }
              : {
                  position: 'absolute',
                  bottom: 'calc(100% + 10px)',
                  left: tooltipPos !== null ? `${tooltipPos}px` : '50%',
                  transform: 'translateX(-50%)',
                  zIndex: 100,
                }
          }
        >
          <span className="text-[10px] font-black text-white uppercase tracking-wider whitespace-nowrap drop-shadow-md">
            {trans(activeLabel)}
          </span>
        </div>
      )}

      {/* Loading Indicator (iOS Glass style) */}
      {isLoading && (
        <div
          className="px-3 py-1 bg-black/80 backdrop-blur-2xl rounded-full border border-white/25 shadow-xl flex items-center gap-1.5 whitespace-nowrap"
          style={
            isVertical
              ? {
                  position: 'absolute',
                  right: 'calc(100% + 14px)',
                  top: '10px',
                  zIndex: 100,
                }
              : {
                  position: 'absolute',
                  bottom: 'calc(100% + 10px)',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  zIndex: 100,
                }
          }
        >
          <div className="w-2 h-2 rounded-full bg-rose-400 animate-pulse" />
          <span className="text-[9px] font-bold text-white/90 uppercase tracking-wider">
            {trans('Đang tải...')}
          </span>
        </div>
      )}

      {/* Filter Buttons List */}
      <div
        ref={scrollRef}
        className={`
          no-scrollbar
          ${isVertical
            ? 'flex flex-col items-center gap-2 overflow-y-auto overflow-x-hidden p-1 max-h-[58vh] sm:max-h-[66vh]'
            : 'flex items-center gap-2 overflow-x-auto p-1 max-w-[85vw] sm:max-w-[400px]'
          }
        `}
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
              onClick={(e) => handleSelect(filter.id, filter.name, e)}
              className={`
                relative flex-shrink-0 rounded-full flex items-center justify-center 
                w-10 h-10 sm:w-11 sm:h-11 cursor-pointer select-none
                transition-all duration-150 active:scale-90 hover:scale-105
                ${isActive
                  ? 'bg-rose-500/40 border-2 border-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.5)] scale-105'
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
                <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-rose-500 border border-white rounded-full shadow-xs" />
              )}

              <span className={`text-base sm:text-lg pointer-events-none ${isNone ? 'text-xs opacity-70' : ''}`}>
                {filter.icon}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
