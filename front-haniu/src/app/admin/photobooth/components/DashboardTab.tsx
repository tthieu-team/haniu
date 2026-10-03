'use client';

import React from 'react';
import Icon from '@/components/common/Icons';

interface DashboardTabProps {
  stats: any;
  loading?: boolean;
}

export const DashboardTab: React.FC<DashboardTabProps> = ({ stats, loading = false }) => {
  const chartData = stats?.chartData || [
    { day: 'T2', val: 0 },
    { day: 'T3', val: 0 },
    { day: 'T4', val: 0 },
    { day: 'T5', val: 0 },
    { day: 'T6', val: 0 },
    { day: 'T7', val: 0 },
    { day: 'CN', val: 0 }
  ];
  const maxChartVal = Math.max(...chartData.map((d: any) => d.val || 0), 5);
  const templateRankings = stats?.templateRankings || [];

  if (loading && !stats) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-rose-500 border-t-transparent animate-spin" />
        <p className="text-xs font-bold text-slate-500 dark:text-zinc-400">Đang tải số liệu thống kê Photobooth...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* 4 Highlight KPI Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        
        {/* Sessions */}
        <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-slate-200/80 dark:border-zinc-800 shadow-xs">
          <div className="flex justify-between items-center">
            <span className="text-[11px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">Lượt chụp (Sessions)</span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <Icon name="camera" size={15} />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">{stats?.totalSessions ?? 0}</span>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">hoạt động</span>
          </div>
        </div>

        {/* Active Events */}
        <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-slate-200/80 dark:border-zinc-800 shadow-xs">
          <div className="flex justify-between items-center">
            <span className="text-[11px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">Sự kiện hoạt động</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Icon name="cake" size={15} />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">{stats?.activeEvents ?? 0}</span>
            <span className="text-[11px] text-amber-600 dark:text-amber-400 font-bold">sự kiện</span>
          </div>
        </div>

        {/* Templates Available */}
        <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-slate-200/80 dark:border-zinc-800 shadow-xs">
          <div className="flex justify-between items-center">
            <span className="text-[11px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">Khung hình (Templates)</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Icon name="palette" size={15} />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">{stats?.totalTemplates ?? 0}</span>
            <span className="text-[11px] text-blue-600 dark:text-blue-400 font-bold">mẫu layout</span>
          </div>
        </div>

        {/* Printed Photos */}
        <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-slate-200/80 dark:border-zinc-800 shadow-xs">
          <div className="flex justify-between items-center">
            <span className="text-[11px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">Ảnh đã xuất / in</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Icon name="image" size={15} />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">{stats?.totalPhotos ?? 0}</span>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">bản in</span>
          </div>
        </div>
      </div>

      {/* Performance charts and summaries */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
        <div className="md:col-span-2 space-y-3">
          <h3 className="text-xs font-bold uppercase text-slate-700 dark:text-zinc-300 tracking-wider flex items-center gap-1.5">
            <Icon name="layout" size={14} className="text-rose-500" />
            <span>Hiệu suất Chụp Theo Ngày (Tuần qua)</span>
          </h3>
          <div className="bg-slate-50/80 dark:bg-zinc-800/50 border border-slate-200/70 dark:border-zinc-800 rounded-2xl p-5 h-64 flex items-end justify-between gap-3">
            {chartData.map((item: any, idx: number) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                <div className="w-full bg-slate-200/70 dark:bg-zinc-700/50 rounded-lg h-44 flex items-end overflow-hidden relative">
                  <div 
                    style={{ height: `${Math.max(8, (item.val / maxChartVal) * 100)}%` }}
                    className="w-full bg-gradient-to-t from-rose-600 to-amber-500 group-hover:from-rose-500 group-hover:to-amber-400 transition-all rounded-t-md relative flex items-start justify-center pt-1"
                  >
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold text-white drop-shadow-xs">
                      {item.val}
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-slate-500 dark:text-zinc-400">{item.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top active templates */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase text-slate-700 dark:text-zinc-300 tracking-wider flex items-center gap-1.5">
            <Icon name="star" size={14} className="text-amber-500" />
            <span>Xếp hạng Templates</span>
          </h3>
          <div className="space-y-2">
            {templateRankings.length === 0 ? (
              <div className="text-center py-12 bg-slate-50/80 dark:bg-zinc-800/50 rounded-2xl border border-slate-200/70 dark:border-zinc-800 text-slate-400 dark:text-zinc-500 text-xs">
                Chưa có dữ liệu lượt chụp để xếp hạng.
              </div>
            ) : (
              templateRankings.map((tpl: any, i: number) => (
                <div key={i} className="flex items-center justify-between p-3 bg-slate-50/80 dark:bg-zinc-800/50 rounded-xl border border-slate-200/70 dark:border-zinc-800">
                  <div className="min-w-0 flex-1 pr-2">
                    <p className="text-xs font-bold text-slate-800 dark:text-zinc-200 truncate">{tpl.name}</p>
                    <p className="text-[10px] text-slate-400 dark:text-zinc-500 font-medium">Tỷ lệ sử dụng: {tpl.rate}</p>
                  </div>
                  <span className="text-xs font-black text-rose-600 dark:text-rose-400 font-mono shrink-0">{tpl.val}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
