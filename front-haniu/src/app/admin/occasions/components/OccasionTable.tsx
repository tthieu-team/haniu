'use client';

import React from 'react';
import { Occasion } from '@/services/catalog.service';
import { getFullImageUrl } from '@/lib/api';
import Icon from '@/components/common/Icons';

interface OccasionTableProps {
  occasions: Occasion[];
  loading: boolean;
  onEdit: (item: Occasion) => void;
  onDelete: (id: string) => void;
}

export const OccasionTable: React.FC<OccasionTableProps> = ({
  occasions,
  loading,
  onEdit,
  onDelete,
}) => {
  if (loading && occasions.length === 0) {
    return (
      <div className="bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 rounded-3xl p-12 flex flex-col items-center justify-center gap-3 flex-1">
        <div className="w-8 h-8 rounded-full border-2 border-rose-500 border-t-transparent animate-spin" />
        <p className="text-xs font-bold text-slate-500 dark:text-zinc-400">Đang tải dữ liệu dịp lễ & sự kiện...</p>
      </div>
    );
  }

  if (occasions.length === 0) {
    return (
      <div className="bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 rounded-3xl p-16 text-center space-y-2 flex-1 flex flex-col items-center justify-center">
        <Icon name="calendar" size={36} className="mx-auto text-slate-300 dark:text-zinc-600" />
        <p className="text-sm font-bold text-slate-700 dark:text-zinc-200">Không tìm thấy dịp lễ nào phù hợp</p>
        <p className="text-xs text-slate-400 dark:text-zinc-500">Thử thay đổi bộ lọc hoặc thêm mới dịp lễ.</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-xs flex-1 min-h-0 flex flex-col">
      <div className="overflow-y-auto overflow-x-auto scrollbar-none flex-1 min-h-0">
        <table className="w-full text-left border-collapse text-xs">
          <thead className="sticky top-0 z-10 bg-slate-50 dark:bg-zinc-800 border-b border-slate-200/80 dark:border-zinc-800 shadow-xs">
            <tr className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-zinc-500">
              <th className="py-3.5 px-4 w-16 bg-slate-50 dark:bg-zinc-800">Ảnh</th>
              <th className="py-3.5 px-4 bg-slate-50 dark:bg-zinc-800">Tên dịp lễ / Sự kiện</th>
              <th className="py-3.5 px-4 bg-slate-50 dark:bg-zinc-800">Slug</th>
              <th className="py-3.5 px-4 bg-slate-50 dark:bg-zinc-800">Thời gian áp dụng</th>
              <th className="py-3.5 px-4 bg-slate-50 dark:bg-zinc-800">Mô tả</th>
              <th className="py-3.5 px-4 text-center bg-slate-50 dark:bg-zinc-800">Trạng thái</th>
              <th className="py-3.5 px-4 text-center w-28 bg-slate-50 dark:bg-zinc-800">Tác vụ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/60">
            {occasions.map((item) => (
              <tr
                key={item.id}
                className="hover:bg-slate-50/80 dark:hover:bg-zinc-800/40 transition-colors"
              >
                <td className="py-3 px-4">
                  {item.imageUrl ? (
                    <img
                      src={getFullImageUrl(item.imageUrl)}
                      alt={item.name}
                      className="w-10 h-10 object-cover rounded-xl border border-slate-200/60 dark:border-zinc-700 bg-slate-100 dark:bg-zinc-800"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center font-bold text-sm">
                      <Icon name="calendar" size={16} />
                    </div>
                  )}
                </td>
                <td className="py-3 px-4">
                  <div className="font-bold text-slate-800 dark:text-zinc-100 text-xs">
                    {item.name}
                  </div>
                </td>
                <td className="py-3 px-4 font-mono text-[11px] text-slate-400 dark:text-zinc-500">
                  {item.slug}
                </td>
                <td className="py-3 px-4 font-mono text-[11px] text-slate-600 dark:text-zinc-300">
                  {item.startDate || item.endDate ? (
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700">
                      {item.startDate || '...'} → {item.endDate || '...'}
                    </span>
                  ) : (
                    <span className="text-slate-400 dark:text-zinc-500">Quanh năm</span>
                  )}
                </td>
                <td className="py-3 px-4 text-slate-500 dark:text-zinc-400 max-w-xs truncate">
                  {item.description || '-'}
                </td>
                <td className="py-3 px-4 text-center">
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                      item.isActive
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                        : 'bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400 border-slate-200 dark:border-zinc-700'
                    }`}
                  >
                    {item.isActive ? 'Hoạt động' : 'Đang ẩn'}
                  </span>
                </td>
                <td className="py-3 px-4 text-center">
                  <div className="flex items-center justify-center gap-1.5">
                    <button
                      onClick={() => onEdit(item)}
                      className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-600 dark:text-zinc-300 transition-colors cursor-pointer"
                      title="Chỉnh sửa"
                    >
                      <Icon name="edit" size={13} />
                    </button>
                    <button
                      onClick={() => onDelete(item.id!)}
                      className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/50 text-rose-600 dark:text-rose-400 transition-colors cursor-pointer"
                      title="Xóa dịp lễ"
                    >
                      <Icon name="trash" size={13} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
