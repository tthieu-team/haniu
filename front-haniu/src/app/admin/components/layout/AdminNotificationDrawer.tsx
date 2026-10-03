'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Icon from '@/components/common/Icons';

interface AdminNotificationDrawerProps {
  notifications: any[];
  unreadCount: number;
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onClose: () => void;
}

export const AdminNotificationDrawer: React.FC<AdminNotificationDrawerProps> = ({
  notifications,
  unreadCount,
  onMarkAsRead,
  onMarkAllAsRead,
  onClose
}) => {
  const router = useRouter();

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-40 bg-black/20 dark:bg-black/40 backdrop-blur-xs" 
        onClick={onClose} 
      />

      {/* Popover Window */}
      <div className="absolute right-0 top-12 w-84 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700/80 rounded-2xl shadow-2xl z-50 p-4 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-zinc-800">
          <div className="flex items-center gap-1.5">
            <Icon name="bell" size={14} className="text-rose-500" />
            <h4 className="font-black text-xs uppercase tracking-wider text-slate-800 dark:text-zinc-100">
              Thông Báo Realtime
            </h4>
          </div>

          {unreadCount > 0 && (
            <button
              onClick={onMarkAllAsRead}
              className="text-[10px] text-rose-600 dark:text-rose-400 hover:underline font-bold cursor-pointer"
            >
              Đánh dấu đã đọc
            </button>
          )}
        </div>

        {/* Notifications List */}
        <div className="space-y-2 max-h-72 overflow-y-auto scrollbar-none pr-1">
          {notifications.length === 0 ? (
            <div className="text-center py-8 text-slate-400 dark:text-zinc-500 space-y-1">
              <Icon name="check" size={24} className="mx-auto text-slate-300 dark:text-zinc-600" />
              <p className="text-xs font-bold">Chưa có thông báo nào</p>
              <p className="text-[10px]">Tất cả đơn hàng mới sẽ xuất hiện ngay tại đây.</p>
            </div>
          ) : (
            notifications.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  onMarkAsRead(item.id);
                  onClose();
                  router.push('/admin/orders');
                }}
                className={`p-3 rounded-xl cursor-pointer transition-all duration-150 ${
                  item.unread
                    ? 'bg-rose-50/80 dark:bg-rose-950/30 border border-rose-200/80 dark:border-rose-900/40 shadow-xs'
                    : 'bg-slate-50 dark:bg-zinc-800/60 hover:bg-slate-100 dark:hover:bg-zinc-800 border border-transparent'
                }`}
              >
                <div className="flex justify-between items-start">
                  <p className="font-bold text-xs text-slate-800 dark:text-zinc-100">
                    Đơn hàng mới <span className="font-mono text-rose-500">#{item.orderCode}</span>
                  </p>
                  {item.unread && <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0 mt-1 animate-pulse" />}
                </div>

                <p className="text-[11px] text-slate-600 dark:text-zinc-400 mt-1">
                  Khách hàng: <span className="font-semibold text-slate-800 dark:text-zinc-200">{item.customerName}</span>
                </p>
                <p className="text-[11px] text-slate-600 dark:text-zinc-400">
                  Tổng tiền: <span className="font-bold font-mono text-rose-600 dark:text-rose-400">{item.totalPrice?.toLocaleString('vi-VN')} đ</span>
                </p>

                <p className="text-[9px] text-slate-400 dark:text-zinc-500 mt-1.5 font-medium">
                  {item.orderedAt ? new Date(item.orderedAt).toLocaleString('vi-VN') : 'Vừa xong'}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};
