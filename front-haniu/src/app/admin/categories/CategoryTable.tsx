'use client';

import React from 'react';
import { Category } from '@/services/catalog.service';
import { getFullImageUrl } from '@/lib/api';
import Icon from '@/components/common/Icons';

interface CategoryTableProps {
  categories: Category[];
  loading: boolean;
  onEdit: (category: Category) => void;
  onDelete: (id: string) => void;
}

export default function CategoryTable({
  categories,
  loading,
  onEdit,
  onDelete,
}: CategoryTableProps) {
  if (loading) {
    return (
      <div className="p-12 text-center text-slate-400">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-500 mx-auto mb-3" />
        Đang tải dữ liệu danh mục...
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="p-12 text-center text-slate-400 text-xs font-medium">
        Không tìm thấy danh mục nào phù hợp.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse text-xs">
        <thead>
          <tr className="bg-slate-50 dark:bg-zinc-850 border-b border-slate-100 dark:border-zinc-800 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
            <th className="p-4 w-20">Ảnh</th>
            <th className="p-4">Tên danh mục</th>
            <th className="p-4">Slug</th>
            <th className="p-4">Danh mục cha</th>
            <th className="p-4 text-center">Thứ tự</th>
            <th className="p-4">Trạng thái</th>
            <th className="p-4">Nổi bật</th>
            <th className="p-4">Phụ kiện</th>
            <th className="p-4 text-center w-36">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((item) => (
            <tr
              key={item.id}
              className="border-b border-slate-50 dark:border-zinc-800 hover:bg-slate-50/50 dark:hover:bg-zinc-800/30 transition-colors"
            >
              <td className="p-4">
                {item.imageUrl ? (
                  <img
                    src={getFullImageUrl(item.imageUrl)}
                    alt={item.name}
                    className="w-12 h-12 object-cover rounded-xl border border-slate-100 dark:border-zinc-700 bg-slate-100"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center font-bold text-sm">
                    📁
                  </div>
                )}
              </td>
              <td className="p-4">
                <div className="font-bold text-slate-800 dark:text-white text-sm">
                  {item.name}
                </div>
                {item.description && (
                  <div className="text-[10px] text-slate-400 font-medium truncate max-w-xs mt-0.5">
                    {item.description}
                  </div>
                )}
              </td>
              <td className="p-4 font-mono font-semibold text-slate-400">{item.slug}</td>
              <td className="p-4 font-semibold text-slate-600 dark:text-zinc-300">
                {item.parent ? (
                  <span className="bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 px-2 py-0.5 rounded text-[10px] font-bold border border-slate-200 dark:border-zinc-700">
                    {item.parent.name}
                  </span>
                ) : (
                  <span className="text-slate-300 dark:text-zinc-650">-</span>
                )}
              </td>
              <td className="p-4 text-center font-bold text-slate-600 dark:text-zinc-400">
                {item.sortOrder ?? 0}
              </td>
              <td className="p-4">
                <span
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border ${
                    item.isActive
                      ? 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/10'
                      : 'bg-slate-500/10 text-slate-500 border-slate-500/10'
                  }`}
                >
                  {item.isActive ? 'Hoạt động' : 'Đang ẩn'}
                </span>
              </td>
              <td className="p-4">
                <span
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border ${
                    item.isFeatured
                      ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/10'
                      : 'bg-slate-100 dark:bg-zinc-800 text-slate-400 border-slate-200 dark:border-zinc-750'
                  }`}
                >
                  {item.isFeatured ? 'Nổi bật ★' : 'Thường'}
                </span>
              </td>
              <td className="p-4">
                <span
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border ${
                    item.isAccessory
                      ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/10'
                      : 'bg-slate-100 dark:bg-zinc-800 text-slate-400 border-slate-200 dark:border-zinc-750'
                  }`}
                >
                  {item.isAccessory ? 'Phụ kiện 🎁' : 'Không'}
                </span>
              </td>
              <td className="p-4 text-center space-x-2">
                <button
                  onClick={() => onEdit(item)}
                  className="px-2.5 py-1.5 bg-slate-50 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-700 font-bold border border-slate-200 dark:border-zinc-700 cursor-pointer active:scale-95 transition-all inline-flex items-center gap-1"
                >
                  <Icon name="edit" size={12} /> Sửa
                </button>
                <button
                  onClick={() => onDelete(item.id!)}
                  className="px-2.5 py-1.5 bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/10 rounded-lg hover:bg-red-500 hover:text-white cursor-pointer active:scale-95 transition-all inline-flex items-center gap-1"
                >
                  <Icon name="trash" size={12} /> Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
