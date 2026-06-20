'use client';

import { GridFeatureCard } from '@/store/homeLayout';
import Icon from '@/components/common/Icons';
import { getFullImageUrl } from '@/lib/api';

export default function FeatureCard({ card }: { card: GridFeatureCard }) {
  return (
    <div className="relative overflow-hidden rounded-[20px] bg-white dark:bg-zinc-900 border border-rose-100/40 dark:border-zinc-800/60 p-4 flex flex-col justify-between group hover:shadow-md hover:border-rose-300 dark:hover:border-zinc-700/50 transition-all duration-300 min-h-[140px] sm:min-h-0 sm:h-full">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-rose-50 dark:bg-rose-950/30 flex items-center justify-center text-rose-500 dark:text-rose-400 shrink-0">
            <Icon name={card.icon} size={12} className="fill-rose-500/10 text-rose-500 dark:text-rose-400" />
          </div>
          <h3 className="text-[10px] sm:text-[11px] font-bold text-slate-800 dark:text-zinc-200 tracking-wider uppercase leading-tight">
            {card.title}
          </h3>
        </div>
        <p className="text-[9px] sm:text-[10px] text-slate-600 dark:text-zinc-400 font-light leading-relaxed line-clamp-3">
          {card.desc}
        </p>
      </div>

      <div className="flex items-end justify-between mt-2 pt-2 border-t border-dashed border-rose-100/30 dark:border-zinc-800/80">
        <span className="font-script text-[11px] sm:text-[12px] text-rose-500 dark:text-rose-450 leading-none mb-1">
          {card.tagText || ''}
        </span>
        {card.image && (
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-white shadow-xs overflow-hidden flex-shrink-0">
            <img src={getFullImageUrl(card.image) || card.image} alt={card.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
          </div>
        )}
      </div>
    </div>
  );
}
