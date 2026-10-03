'use client';

import React from 'react';
import Icon from '@/components/common/Icons';

interface SessionsTabProps {
  sessions: any[];
}

export const SessionsTab: React.FC<SessionsTabProps> = ({ sessions }) => {
  const [previewImage, setPreviewImage] = React.useState<string | null>(null);

  const formatDate = (raw: string) => {
    if (!raw) return '—';
    try {
      const d = new Date(raw);
      if (isNaN(d.getTime())) return raw;
      return d.toLocaleString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch {
      return raw;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-sm font-black uppercase text-slate-800 dark:text-zinc-200 flex items-center gap-1.5">
            <Icon name="list" size={15} className="text-rose-500" />
            <span>Nhật Ký Chụp Ảnh (Sessions)</span>
          </h3>
          <p className="text-[11px] text-slate-400 dark:text-zinc-500">Theo dõi số lượng ảnh được in ra và lịch sử hoạt động camera photobooth.</p>
        </div>
        <div className="px-3 py-1 bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
          <Icon name="camera" size={11} />
          <span>Tổng cộng: {sessions.length} phiên</span>
        </div>
      </div>

      {sessions.length === 0 ? (
        <div className="text-center py-16 bg-slate-50 dark:bg-zinc-800/40 rounded-3xl border border-dashed border-slate-200 dark:border-zinc-800">
          <p className="text-xs font-bold text-slate-500 dark:text-zinc-400">Chưa có phiên chụp ảnh nào được ghi nhận.</p>
          <p className="text-[11px] text-slate-400 dark:text-zinc-500 mt-1">Khi khách hàng chụp ảnh trên Photobooth, dữ liệu phiên sẽ hiển thị chi tiết tại đây.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200/80 dark:border-zinc-800">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-zinc-800/60 border-b border-slate-200/80 dark:border-zinc-800 text-[11px] font-bold uppercase text-slate-500 dark:text-zinc-400 tracking-wider">
                <th className="py-3 px-4">Ảnh Xem Nhanh</th>
                <th className="py-3 px-4">Mã Phiên</th>
                <th className="py-3 px-4">Sự kiện</th>
                <th className="py-3 px-4">Bố cục sử dụng</th>
                <th className="py-3 px-4">Ảnh đã chụp</th>
                <th className="py-3 px-4">Thời gian</th>
                <th className="py-3 px-4">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/70">
              {sessions.map((sess) => (
                <tr key={sess.id} className="hover:bg-slate-50/70 dark:hover:bg-zinc-800/50 transition-colors">
                  <td className="py-2.5 px-4">
                    {sess.imageUrl ? (
                      <div 
                        onClick={() => setPreviewImage(sess.imageUrl)}
                        className="w-10 h-10 rounded-lg overflow-hidden border border-slate-200 dark:border-zinc-700 bg-slate-100 dark:bg-zinc-800 cursor-pointer hover:scale-105 transition-transform"
                      >
                        <img src={sess.imageUrl} alt="Session thumbnail" className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-zinc-800 flex items-center justify-center text-[9px] text-slate-400">
                        N/A
                      </div>
                    )}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-rose-500 text-[11px]">{sess.id}</td>
                  <td className="py-3.5 px-4 font-bold text-slate-700 dark:text-zinc-300">{sess.eventName || 'Sự kiện mặc định'}</td>
                  <td className="py-3.5 px-4 text-slate-500 dark:text-zinc-400 font-medium">{sess.templateName || 'Bố cục chuẩn'}</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-700 dark:text-zinc-300">{sess.photosCount || 1}</td>
                  <td className="py-3.5 px-4 text-slate-400 text-[11px] font-medium">{formatDate(sess.createdAt || sess.date)}</td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                      sess.status === 'Completed' || sess.status?.toLowerCase() === 'completed' || !sess.status
                        ? 'bg-emerald-500/10 text-emerald-500 dark:text-emerald-400'
                        : 'bg-amber-500/10 text-amber-500 dark:text-amber-400'
                    }`}>
                      {sess.status === 'Completed' || sess.status?.toLowerCase() === 'completed' || !sess.status ? 'Hoàn tất' : 'Gián đoạn'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Lightbox full size zoom */}
      {previewImage && (
        <div 
          className="fixed inset-0 bg-black/90 backdrop-blur-md z-[9999] flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative max-w-full max-h-[85vh]" onClick={e => e.stopPropagation()}>
            <img 
              src={previewImage} 
              alt="Session Full View" 
              className="max-w-[90vw] max-h-[80vh] object-contain rounded-2xl shadow-2xl border border-white/10"
            />
          </div>
        </div>
      )}
    </div>
  );
};
