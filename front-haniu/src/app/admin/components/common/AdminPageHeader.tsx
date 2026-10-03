'use client';

import React from 'react';
import Icon from '@/components/common/Icons';

export interface AdminPageHeaderProps {
  title: string;
  description?: string;
  icon?: string;
  badge?: string;
  children?: React.ReactNode;
}

export const AdminPageHeader: React.FC<AdminPageHeaderProps> = ({
  title,
  description,
  icon,
  badge,
  children,
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
      <div className="space-y-0.5">
        <div className="flex items-center gap-2.5">
          {icon && (
            <div className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center shrink-0">
              <Icon name={icon} size={18} />
            </div>
          )}
          <h1 className="text-xl font-black text-slate-900 dark:text-zinc-100 uppercase tracking-tight">
            {title}
          </h1>
          {badge && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
              {badge}
            </span>
          )}
        </div>
        {description && (
          <p className="text-xs text-slate-500 dark:text-zinc-400 font-medium">
            {description}
          </p>
        )}
      </div>

      {children && (
        <div className="flex items-center gap-2 flex-wrap shrink-0">
          {children}
        </div>
      )}
    </div>
  );
};
