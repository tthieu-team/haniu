'use client';

import React from 'react';
import Icon from '@/components/common/Icons';

interface DashboardTabProps {
  stats: any;
  loading?: boolean;
}

export const DashboardTab: React.FC<DashboardTabProps> = ({ stats, loading = false }) => {
  const chartData = stats?.chartData || [
    { day: 'Thứ 2', val: 0 },
    { day: 'Thứ 3', val: 0 },
    { day: 'Thứ 4', val: 0 },
    { day: 'Thứ 5', val: 0 },
    { day: 'Thứ 6', val: 0 },
    { day: 'Thứ 7', val: 0 },
    { day: 'Chủ Nhật', val: 0 }
  ];
  const maxChartVal = Math.max(...chartData.map((d: any) => d.val || 0), 5);
  const templateRankings = stats?.templateRankings || [];

  if (loading && !stats) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-rose-500 border-t-transparent animate-spin" />
        <p className="text-xs font-bold text-slate-400 dark:text-zinc-500">Đang tải số liệu thống kê Photobooth...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-50 dark:bg-zinc-850 p-5 rounded-2xl border border-slate-100 dark:border-zinc-800">
          <div className="flex justify-between items-start text-rose-500">
            <Icon name="camera" size={24} />
            <span className="text-[10px] font-bold text-emerald-500">Thực tế</span>
          </div>
          <p className="text-2xl font-black mt-2 text-slate-800 dark:text-zinc-150">{stats?.totalSessions ?? 0} Lượt</p>
          <p className="text-[10px] text-slate-400 dark:text-zinc-500 font-bold uppercase tracking-wider mt-1">Lượt chụp (Sessions)</p>
        </div>

        <div className="bg-slate-50 dark:bg-zinc-850 p-5 rounded-2xl border border-slate-100 dark:border-zinc-800">
          <div className="flex justify-between items-start text-amber-500">
            <Icon name="cake" size={24} />
            <span className="text-[10px] font-bold text-slate-400">Đang chạy</span>
          </div>
          <p className="text-2xl font-black mt-2 text-slate-800 dark:text-zinc-150">
            {stats?.activeEvents ?? 0} Sự kiện
          </p>
          <p className="text-[10px] text-slate-400 dark:text-zinc-500 font-bold uppercase tracking-wider mt-1">Sự kiện hoạt động</p>
        </div>

        <div className="bg-slate-50 dark:bg-zinc-850 p-5 rounded-2xl border border-slate-100 dark:border-zinc-800">
          <div className="flex justify-between items-start text-blue-500">
            <Icon name="palette" size={24} />
            <span className="text-[10px] font-bold text-slate-400">Sẵn có</span>
          </div>
          <p className="text-2xl font-black mt-2 text-slate-800 dark:text-zinc-150">{stats?.totalTemplates ?? 0} Khung</p>
          <p className="text-[10px] text-slate-400 dark:text-zinc-500 font-bold uppercase tracking-wider mt-1">Khung hình (Templates)</p>
        </div>

        <div className="bg-slate-50 dark:bg-zinc-850 p-5 rounded-2xl border border-slate-100 dark:border-zinc-800">
          <div className="flex justify-between items-start text-emerald-500">
            <Icon name="image" size={24} />
            <span className="text-[10px] font-bold text-emerald-500">Đã in</span>
          </div>
          <p className="text-2xl font-black mt-2 text-slate-800 dark:text-zinc-150">
            {stats?.totalPhotos ?? 0} Ảnh
          </p>
          <p className="text-[10px] text-slate-400 dark:text-zinc-500 font-bold uppercase tracking-wider mt-1">Ảnh đặt in</p>
        </div>
      </div>

      {/* Performance charts and summaries */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        <div className="md:col-span-2 space-y-4">
          <h3 className="text-sm font-black uppercase text-slate-800 dark:text-zinc-200 tracking-wide flex items-center gap-1.5">
            <Icon name="grid" size={14} className="text-rose-500" />
            Hiệu suất Chụp Theo Ngày (Tuần qua)
          </h3>
          <div className="bg-slate-50 dark:bg-zinc-850/50 border border-slate-100 dark:border-zinc-800 rounded-2xl p-5 h-64 flex items-end justify-between gap-2.5">
            {chartData.map((item: any, idx: number) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                <div className="w-full bg-slate-200 dark:bg-zinc-800 rounded-lg h-44 flex items-end overflow-hidden relative">
                  <div 
                    style={{ height: `${(item.val / maxChartVal) * 100}%` }}
                    className="w-full bg-gradient-to-t from-rose-600 to-amber-500 group-hover:from-rose-500 group-hover:to-amber-400 transition-all rounded-t-md relative"
                  >
                    <div className="absolute top-1 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white font-mono text-[9px] px-1 rounded -mt-6 whitespace-nowrap">
                      {item.val}
                    </div>
                  </div>
                </div>
                <span className="text-[9px] font-bold text-slate-400 dark:text-zinc-500">{item.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top active templates */}
        <div className="space-y-4">
          <h3 className="text-sm font-black uppercase text-slate-800 dark:text-zinc-200 tracking-wide flex items-center gap-1.5">
            <Icon name="star" size={14} className="text-amber-500" />
            Xếp hạng Templates
          </h3>
          <div className="space-y-2">
            {templateRankings.length === 0 ? (
              <div className="text-center py-10 bg-slate-50 dark:bg-zinc-850 rounded-2xl border text-slate-400 text-[10px]">
                Chưa có dữ liệu lượt chụp để xếp hạng.
              </div>
            ) : (
              templateRankings.map((tpl: any, i: number) => (
                <div key={i} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-zinc-850 rounded-xl border border-slate-100 dark:border-zinc-800">
                  <div>
                    <p className="text-xs font-bold text-slate-700 dark:text-zinc-300">{tpl.name}</p>
                    <p className="text-[9px] text-slate-400 dark:text-zinc-500 font-medium">Tỷ lệ sử dụng: {tpl.rate}</p>
                  </div>
                  <span className="text-xs font-black text-rose-500">{tpl.val}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
