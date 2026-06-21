'use client';

import React from 'react';
import Icon from '@/components/common/Icons';

interface DashboardTabProps {
  events: any[];
  templates: any[];
  assets: any;
  sessions: any[];
}

export const DashboardTab: React.FC<DashboardTabProps> = ({ events, templates, assets, sessions }) => {
  const completedSessions = sessions.filter(s => s.status === 'Completed');

  // Compute sessions count by weekday (Monday to Sunday)
  const getSessionsByWeekday = () => {
    const counts = [0, 0, 0, 0, 0, 0, 0]; // 0: Mon, 1: Tue, ..., 6: Sun
    sessions.forEach(sess => {
      if (!sess.date) return;
      try {
        const date = new Date(sess.date);
        let day = date.getDay(); // 0: Sunday, 1: Monday, etc.
        let index = day === 0 ? 6 : day - 1;
        counts[index]++;
      } catch (e) {
        // Ignore date parsing errors
      }
    });
    return [
      { day: 'Thứ 2', val: counts[0] },
      { day: 'Thứ 3', val: counts[1] },
      { day: 'Thứ 4', val: counts[2] },
      { day: 'Thứ 5', val: counts[3] },
      { day: 'Thứ 6', val: counts[4] },
      { day: 'Thứ 7', val: counts[5] },
      { day: 'Chủ Nhật', val: counts[6] }
    ];
  };

  const chartData = getSessionsByWeekday();
  const maxChartVal = Math.max(...chartData.map(d => d.val), 5); // At least scale of 5 to look good

  // Group and rank templates by usage frequency
  const getTemplateRanking = () => {
    const counts: { [key: string]: number } = {};
    sessions.forEach(sess => {
      const tName = sess.templateName || 'Bố cục Classic';
      counts[tName] = (counts[tName] || 0) + 1;
    });
    const total = sessions.length || 1;
    return Object.entries(counts)
      .map(([name, count]) => ({
        name,
        val: `${count} lượt`,
        rate: `${((count / total) * 100).toFixed(1)}%`,
        count
      }))
      .sort((a, b) => b.count - a.count);
  };

  const templateRankings = getTemplateRanking();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-50 dark:bg-zinc-850 p-5 rounded-2xl border border-slate-100 dark:border-zinc-800">
          <div className="flex justify-between items-start text-rose-500">
            <Icon name="camera" size={24} />
            <span className="text-[10px] font-bold text-emerald-500">Thực tế</span>
          </div>
          <p className="text-2xl font-black mt-2 text-slate-800 dark:text-zinc-150">{sessions.length} Lượt</p>
          <p className="text-[10px] text-slate-400 dark:text-zinc-500 font-bold uppercase tracking-wider mt-1">Lượt chụp (Sessions)</p>
        </div>

        <div className="bg-slate-50 dark:bg-zinc-850 p-5 rounded-2xl border border-slate-100 dark:border-zinc-800">
          <div className="flex justify-between items-start text-amber-500">
            <Icon name="cake" size={24} />
            <span className="text-[10px] font-bold text-slate-400">Đang chạy</span>
          </div>
          <p className="text-2xl font-black mt-2 text-slate-800 dark:text-zinc-150">
            {events.filter(e => e.status === 'ACTIVE').length} Sự kiện
          </p>
          <p className="text-[10px] text-slate-400 dark:text-zinc-500 font-bold uppercase tracking-wider mt-1">Sự kiện hoạt động</p>
        </div>

        <div className="bg-slate-50 dark:bg-zinc-850 p-5 rounded-2xl border border-slate-100 dark:border-zinc-800">
          <div className="flex justify-between items-start text-blue-500">
            <Icon name="palette" size={24} />
            <span className="text-[10px] font-bold text-slate-400">Sẵn có</span>
          </div>
          <p className="text-2xl font-black mt-2 text-slate-800 dark:text-zinc-150">{templates.length} Khung</p>
          <p className="text-[10px] text-slate-400 dark:text-zinc-500 font-bold uppercase tracking-wider mt-1">Khung hình (Templates)</p>
        </div>

        <div className="bg-slate-50 dark:bg-zinc-850 p-5 rounded-2xl border border-slate-100 dark:border-zinc-800">
          <div className="flex justify-between items-start text-emerald-500">
            <Icon name="image" size={24} />
            <span className="text-[10px] font-bold text-emerald-500">Hoàn tất</span>
          </div>
          <p className="text-2xl font-black mt-2 text-slate-800 dark:text-zinc-150">
            {completedSessions.length} Ảnh
          </p>
          <p className="text-[10px] text-slate-400 dark:text-zinc-500 font-bold uppercase tracking-wider mt-1">Thư viện ảnh</p>
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
            {chartData.map((item, idx) => (
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
              templateRankings.map((tpl, i) => (
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
