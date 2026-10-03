'use client';

import React from 'react';
import Icon from '@/components/common/Icons';

export interface TabItem {
  id: string;
  label: string;
  count?: number;
  icon?: string;
  activeColor?: 'rose' | 'emerald' | 'amber' | 'blue' | 'purple';
}

export interface AdminFilterTabsProps {
  tabs: TabItem[];
  activeTab: string;
  onSelectTab: (id: string) => void;
  rightElement?: React.ReactNode;
}

const ACTIVE_COLORS = {
  rose: 'bg-rose-600 text-white shadow-xs',
  emerald: 'bg-emerald-600 text-white shadow-xs',
  amber: 'bg-amber-600 text-white shadow-xs',
  blue: 'bg-blue-600 text-white shadow-xs',
  purple: 'bg-purple-600 text-white shadow-xs',
};

export const AdminFilterTabs: React.FC<AdminFilterTabsProps> = ({
  tabs,
  activeTab,
  onSelectTab,
  rightElement,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 dark:border-zinc-800 pb-1">
      {/* Tab Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const colorClass = tab.activeColor ? ACTIVE_COLORS[tab.activeColor] : ACTIVE_COLORS.rose;

          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? colorClass
                  : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800 hover:text-slate-900 dark:hover:text-zinc-200'
              }`}
            >
              {tab.icon && (
                <Icon
                  name={tab.icon}
                  size={13}
                  className={isActive ? 'text-white' : 'text-slate-400 dark:text-zinc-500'}
                />
              )}
              <span>{tab.label}</span>
              {typeof tab.count === 'number' && (
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono font-black ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-200/70 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Right Element (Filters, Quick Stats, Tags) */}
      {rightElement && (
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none shrink-0">
          {rightElement}
        </div>
      )}
    </div>
  );
};
