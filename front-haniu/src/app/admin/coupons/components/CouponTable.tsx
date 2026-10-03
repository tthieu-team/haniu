'use client';

import React from 'react';
import { CouponPayload } from '@/services/coupon.service';
import Icon from '@/components/common/Icons';

interface CouponTableProps {
  coupons: CouponPayload[];
  loading: boolean;
  onEdit: (item: CouponPayload) => void;
  onDelete: (id: string) => void;
}

function formatVND(val?: number) {
  if (typeof val !== 'number') return '0 ₫';
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(val);
}

export const CouponTable: React.FC<CouponTableProps> = ({
  coupons,
  loading,
  onEdit,
  onDelete,
}) => {
  if (loading && coupons.length === 0) {
    return (
      <div className="bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 rounded-3xl p-12 flex flex-col items-center justify-center gap-3 flex-1">
        <div className="w-8 h-8 rounded-full border-2 border-rose-500 border-t-transparent animate-spin" />
        <p className="text-xs font-bold text-slate-500 dark:text-zinc-400">Đang tải danh sách coupon...</p>
      </div>
    );
  }

  if (coupons.length === 0) {
    return (
      <div className="bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 rounded-3xl p-16 text-center space-y-2 flex-1 flex flex-col items-center justify-center">
        <Icon name="percent" size={36} className="mx-auto text-slate-300 dark:text-zinc-600" />
        <p className="text-sm font-bold text-slate-700 dark:text-zinc-200">Không tìm thấy mã giảm giá nào</p>
        <p className="text-xs text-slate-400 dark:text-zinc-500">Thử thay đổi bộ lọc hoặc tạo mã coupon mới.</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-xs flex-1 min-h-0 flex flex-col">
      <div className="overflow-y-auto overflow-x-auto scrollbar-none flex-1 min-h-0">
        <table className="w-full text-left border-collapse text-xs">
          <thead className="sticky top-0 z-10 bg-slate-50 dark:bg-zinc-800 border-b border-slate-200/80 dark:border-zinc-800 shadow-xs">
            <tr className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-zinc-500">
              <th className="py-3.5 px-4 bg-slate-50 dark:bg-zinc-800">Mã Voucher</th>
              <th className="py-3.5 px-4 bg-slate-50 dark:bg-zinc-800">Tên chương trình</th>
              <th className="py-3.5 px-4 bg-slate-50 dark:bg-zinc-800">Loại giảm</th>
              <th className="py-3.5 px-4 text-right bg-slate-50 dark:bg-zinc-800">Mức giảm</th>
              <th className="py-3.5 px-4 text-right bg-slate-50 dark:bg-zinc-800">Đơn tối thiểu</th>
              <th className="py-3.5 px-4 text-center bg-slate-50 dark:bg-zinc-800">Lượt dùng</th>
              <th className="py-3.5 px-4 text-center bg-slate-50 dark:bg-zinc-800">Trạng thái</th>
              <th className="py-3.5 px-4 text-center bg-slate-50 dark:bg-zinc-800">Banner / Popup</th>
              <th className="py-3.5 px-4 text-center w-28 bg-slate-50 dark:bg-zinc-800">Tác vụ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/60">
            {coupons.map((coupon) => (
              <tr
                key={coupon.id}
                className="hover:bg-slate-50/80 dark:hover:bg-zinc-800/40 transition-colors"
              >
                <td className="py-3 px-4 font-mono font-black text-rose-600 dark:text-rose-400 text-xs">
                  <span className="px-2.5 py-1 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-500/20">
                    {coupon.code}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div className="font-bold text-slate-800 dark:text-zinc-100 text-xs">
                    {coupon.name}
                  </div>
                  {coupon.description && (
                    <div className="text-[10px] text-slate-400 dark:text-zinc-500 truncate max-w-xs mt-0.5">
                      {coupon.description}
                    </div>
                  )}
                </td>
                <td className="py-3 px-4">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 border border-slate-200 dark:border-zinc-700">
                    {coupon.discountType === 'PERCENT' ? 'Phần trăm (%)' : 'Cố định (₫)'}
                  </span>
                </td>
                <td className="py-3 px-4 text-right font-mono font-black text-rose-600 dark:text-rose-400 text-xs">
                  {coupon.discountType === 'PERCENT' ? `${coupon.discountValue}%` : formatVND(coupon.discountValue)}
                </td>
                <td className="py-3 px-4 text-right font-mono font-semibold text-slate-700 dark:text-zinc-300">
                  {formatVND(coupon.minOrderValue || 0)}
                </td>
                <td className="py-3 px-4 text-center font-mono font-bold text-slate-600 dark:text-zinc-400">
                  {coupon.usageLimit ?? '∞'}
                </td>
                <td className="py-3 px-4 text-center">
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                      coupon.active
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                        : 'bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400 border-slate-200 dark:border-zinc-700'
                    }`}
                  >
                    {coupon.active ? 'Đang chạy' : 'Tạm dừng'}
                  </span>
                </td>
                <td className="py-3 px-4 text-center">
                  {coupon.showInBanner ? (
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                      Hiển thị
                    </span>
                  ) : (
                    <span className="text-slate-300 dark:text-zinc-600 text-xs">-</span>
                  )}
                </td>
                <td className="py-3 px-4 text-center">
                  <div className="flex items-center justify-center gap-1.5">
                    <button
                      onClick={() => onEdit(coupon)}
                      className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-600 dark:text-zinc-300 transition-colors cursor-pointer"
                      title="Chỉnh sửa"
                    >
                      <Icon name="edit" size={13} />
                    </button>
                    <button
                      onClick={() => onDelete(coupon.id!)}
                      className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/50 text-rose-600 dark:text-rose-400 transition-colors cursor-pointer"
                      title="Xóa coupon"
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
