'use client';

import React from 'react';
import Icon from '@/components/common/Icons';

export type KPIColorVariant = 'rose' | 'emerald' | 'amber' | 'purple' | 'blue' | 'indigo' | 'cyan';

export interface KPICardItem {
  id: string;
  label: string;
  value: string | number;
  subtext?: string;
  icon: string;
  variant?: KPIColorVariant;
  valueColor?: string;
}

export interface AdminKPICardsProps {
  items: KPICardItem[];
  columns?: 2 | 3 | 4 | 5;
}

const COLOR_STYLES: Record<KPIColorVariant, { bg: string; text: string; valueText?: string }> = {
  rose: {
    bg: 'bg-rose-50 dark:bg-rose-950/40',
    text: 'text-rose-600 dark:text-rose-400',
    valueText: 'text-rose-600 dark:text-rose-400',
  },
  emerald: {
    bg: 'bg-emerald-50 dark:bg-emerald-950/40',
    text: 'text-emerald-600 dark:text-emerald-400',
    valueText: 'text-emerald-600 dark:text-emerald-400',
  },
  amber: {
    bg: 'bg-amber-50 dark:bg-amber-950/40',
    text: 'text-amber-600 dark:text-amber-400',
    valueText: 'text-amber-600 dark:text-amber-400',
  },
  purple: {
    bg: 'bg-purple-50 dark:bg-purple-950/40',
    text: 'text-purple-600 dark:text-purple-400',
    valueText: 'text-purple-600 dark:text-purple-400',
  },
  blue: {
    bg: 'bg-blue-50 dark:bg-blue-950/40',
    text: 'text-blue-600 dark:text-blue-400',
    valueText: 'text-blue-600 dark:text-blue-400',
  },
  indigo: {
    bg: 'bg-indigo-50 dark:bg-indigo-950/40',
    text: 'text-indigo-600 dark:text-indigo-400',
    valueText: 'text-indigo-600 dark:text-indigo-400',
  },
  cyan: {
    bg: 'bg-cyan-50 dark:bg-cyan-950/40',
    text: 'text-cyan-600 dark:text-cyan-400',
    valueText: 'text-cyan-600 dark:text-cyan-400',
  },
};

export const AdminKPICards: React.FC<AdminKPICardsProps> = ({
  items,
  columns = 4,
}) => {
  const colClasses = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-2 lg:grid-cols-4',
    5: 'grid-cols-2 lg:grid-cols-5',
  }[columns] || 'grid-cols-2 lg:grid-cols-4';

  return (
    <div className={`grid ${colClasses} gap-3.5`}>
      {items.map((item) => {
        const variant = item.variant || 'rose';
        const style = COLOR_STYLES[variant];

        return (
          <div
            key={item.id}
            className="bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 p-4 rounded-2xl shadow-xs"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">
                {item.label}
              </span>
              <div className={`w-8 h-8 rounded-xl ${style.bg} ${style.text} flex items-center justify-center shrink-0`}>
                <Icon name={item.icon} size={15} />
              </div>
            </div>

            <div className="mt-2 flex items-baseline gap-1.5 flex-wrap">
              <span
                className={`text-2xl font-black font-mono ${
                  item.valueColor || (variant === 'rose' ? 'text-slate-900 dark:text-white' : style.valueText)
                }`}
              >
                {item.value}
              </span>
              {item.subtext && (
                <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-medium">
                  {item.subtext}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
