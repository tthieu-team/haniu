'use client';

import React from 'react';

interface SessionsTabProps {
  sessions: any[];
}

export const SessionsTab: React.FC<SessionsTabProps> = ({ sessions }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-sm font-black uppercase text-slate-800 dark:text-zinc-200">Nhật Ký Chụp Ảnh (Sessions)</h3>
          <p className="text-[11px] text-slate-400 dark:text-zinc-500">Theo dõi số lượng ảnh được in ra và lịch sử hoạt động camera photobooth.</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-200 dark:border-zinc-800 text-[10px] font-black uppercase text-slate-450 tracking-wider">
              <th className="py-3 px-4">Mã Phiên</th>
              <th className="py-3 px-4">Sự kiện</th>
              <th className="py-3 px-4">Bố cục sử dụng</th>
              <th className="py-3 px-4">Ảnh đã chụp</th>
              <th className="py-3 px-4">Thời gian</th>
              <th className="py-3 px-4">Trạng thái</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-zinc-850">
            {sessions.map((sess) => (
              <tr key={sess.id} className="hover:bg-slate-50 dark:hover:bg-zinc-855/50 transition-colors">
                <td className="py-3.5 px-4 font-mono font-bold text-rose-500">{sess.id}</td>
                <td className="py-3.5 px-4 font-bold text-slate-700 dark:text-zinc-300">{sess.eventName}</td>
                <td className="py-3.5 px-4 text-slate-500 dark:text-zinc-400">{sess.templateName}</td>
                <td className="py-3.5 px-4 font-mono font-bold">{sess.photosCount}</td>
                <td className="py-3.5 px-4 text-slate-400">{sess.date}</td>
                <td className="py-3.5 px-4">
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                    sess.status === 'Completed'
                      ? 'bg-emerald-500/10 text-emerald-500 dark:text-emerald-400'
                      : 'bg-amber-500/10 text-amber-500 dark:text-amber-400'
                  }`}>
                    {sess.status === 'Completed' ? 'Hoàn tất' : 'Gián đoạn'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
