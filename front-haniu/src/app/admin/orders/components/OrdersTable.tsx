'use client';

import React from 'react';
import { Order } from '@/store/order';
import Icon from '@/components/common/Icons';

interface OrdersTableProps {
  orders: Order[];
  selectedOrder: Order | null;
  onSelectOrder: (order: Order) => void;
  formatVND: (amount: number | undefined | null) => string;
  formatDate: (dateStr: string | undefined | null) => string;
  loading: boolean;
  onQuickUpdateStatus?: (orderId: string, status: string) => void;
}

export const OrdersTable: React.FC<OrdersTableProps> = ({
  orders,
  selectedOrder,
  onSelectOrder,
  formatVND,
  formatDate,
  loading
}) => {
  if (loading && orders.length === 0) {
    return (
      <div className="bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 rounded-3xl p-12 flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-rose-500 border-t-transparent animate-spin" />
        <p className="text-xs font-bold text-slate-500 dark:text-zinc-400">Đang tải danh sách đơn hàng...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 rounded-3xl p-16 text-center space-y-2">
        <Icon name="shopping-bag" size={36} className="mx-auto text-slate-300 dark:text-zinc-600" />
        <p className="text-sm font-bold text-slate-700 dark:text-zinc-200">Không tìm thấy đơn hàng nào</p>
        <p className="text-xs text-slate-400 dark:text-zinc-500">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm.</p>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">Chờ duyệt</span>;
      case 'CONFIRMED':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">Đã xác nhận</span>;
      case 'SHIPPING':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">Đang giao</span>;
      case 'DELIVERED':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">Hoàn thành</span>;
      case 'CANCELLED':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">Đã hủy</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400">{status}</span>;
    }
  };

  const getPaymentBadge = (status: string) => {
    switch (status) {
      case 'PAID':
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">Đã TT</span>;
      case 'PENDING':
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400">Chưa TT</span>;
      case 'FAILED':
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400">Lỗi TT</span>;
      default:
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 dark:bg-zinc-800 text-slate-600">{status}</span>;
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-xs">
      <div className="overflow-x-auto scrollbar-none">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-zinc-800/60 border-b border-slate-200/80 dark:border-zinc-800 text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-zinc-500">
              <th className="py-3.5 px-4">Mã đơn & Ngày</th>
              <th className="py-3.5 px-4">Khách hàng</th>
              <th className="py-3.5 px-4">Sản phẩm</th>
              <th className="py-3.5 px-4 text-right">Tổng tiền</th>
              <th className="py-3.5 px-4 text-center">Thanh toán</th>
              <th className="py-3.5 px-4 text-center">Trạng thái</th>
              <th className="py-3.5 px-4 text-center">Chi tiết</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/60">
            {orders.map((order) => {
              const isSelected = selectedOrder?.id === order.id;
              const hasPhotobooth = order.items?.some((i: any) => Boolean(i.photoboothSessionId || i.photoboothImageUrl || i.customizationInfo));

              return (
                <tr
                  key={order.id}
                  onClick={() => onSelectOrder(order)}
                  className={`cursor-pointer transition-all duration-150 ${
                    isSelected
                      ? 'bg-rose-50/70 dark:bg-rose-950/25'
                      : 'hover:bg-slate-50/80 dark:hover:bg-zinc-800/40'
                  }`}
                >
                  {/* Order Code & Date */}
                  <td className="py-3.5 px-4">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-black text-rose-600 dark:text-rose-400">
                          #{order.orderCode}
                        </span>
                        {hasPhotobooth && (
                          <span className="p-0.5 rounded bg-rose-100 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400" title="Kèm ảnh in / Khắc Laser">
                            <Icon name="camera" size={10} />
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] font-mono text-slate-400 dark:text-zinc-500 mt-0.5">
                        {formatDate(order.orderedAt)}
                      </span>
                    </div>
                  </td>

                  {/* Customer Info */}
                  <td className="py-3.5 px-4">
                    <div className="flex flex-col max-w-[160px]">
                      <span className="font-bold text-slate-800 dark:text-zinc-100 truncate">
                        {order.customerName || 'Khách vãng lai'}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400 dark:text-zinc-500 truncate">
                        {order.customerPhone || order.customerEmail || 'Không có SĐT'}
                      </span>
                    </div>
                  </td>

                  {/* Items summary */}
                  <td className="py-3.5 px-4">
                    <div className="flex flex-col max-w-[200px]">
                      <span className="font-semibold text-slate-700 dark:text-zinc-200 truncate">
                        {order.items?.[0]?.productName || `${order.items?.length || 0} sản phẩm`}
                      </span>
                      {(order.items?.length || 0) > 1 && (
                        <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-medium">
                          +{ (order.items?.length || 1) - 1 } món quà khác
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Total Price */}
                  <td className="py-3.5 px-4 text-right">
                    <span className="font-mono font-black text-slate-900 dark:text-zinc-100 text-xs">
                      {formatVND(order.totalPrice)}
                    </span>
                  </td>

                  {/* Payment Status */}
                  <td className="py-3.5 px-4 text-center">
                    {getPaymentBadge(order.paymentStatus || 'PENDING')}
                  </td>

                  {/* Order Status */}
                  <td className="py-3.5 px-4 text-center">
                    {getStatusBadge(order.orderStatus || 'PENDING')}
                  </td>

                  {/* Arrow detail button */}
                  <td className="py-3.5 px-4 text-center">
                    <button
                      className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors mx-auto ${
                        isSelected
                          ? 'bg-rose-600 text-white shadow-xs'
                          : 'bg-slate-100 dark:bg-zinc-800 text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200'
                      }`}
                      title="Xem chi tiết"
                    >
                      <Icon name="chevron-right" size={14} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
