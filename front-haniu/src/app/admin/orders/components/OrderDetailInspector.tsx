'use client';

import React, { useState } from 'react';
import { Order } from '@/store/order';
import Icon from '@/components/common/Icons';

interface OrderDetailInspectorProps {
  order: Order | null;
  onClose?: () => void;
  onUpdateStatus: (orderId: string, status: string) => Promise<void>;
  onUpdatePayment: (orderId: string, paymentStatus: string) => Promise<void>;
  isUpdating: boolean;
  formatVND: (amount: number | undefined | null) => string;
  formatDate: (dateStr: string | undefined | null) => string;
  onCopyCode: (code: string) => void;
  copiedCode: boolean;
}

export const OrderDetailInspector: React.FC<OrderDetailInspectorProps> = ({
  order,
  onClose,
  onUpdateStatus,
  onUpdatePayment,
  isUpdating,
  formatVND,
  formatDate,
  onCopyCode,
  copiedCode
}) => {
  const [zoomImage, setZoomImage] = useState<string | null>(null);

  if (!order) {
    return (
      <div className="bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 rounded-3xl p-8 text-center text-slate-400 dark:text-zinc-500 h-full flex flex-col items-center justify-center space-y-2">
        <Icon name="shopping-bag" size={32} className="text-slate-300 dark:text-zinc-600" />
        <p className="text-xs font-bold text-slate-600 dark:text-zinc-400">Chưa chọn đơn hàng</p>
        <p className="text-[11px]">Bấm vào một hàng trong bảng để xem chi tiết.</p>
      </div>
    );
  }

  const renderCustomizationInfo = (info: string | undefined | null) => {
    if (!info) return null;
    try {
      const parsed = JSON.parse(info);
      if (typeof parsed === 'object' && parsed !== null) {
        return (
          <div className="space-y-1.5 mt-2 p-2.5 rounded-xl bg-slate-50 dark:bg-zinc-800/80 border border-slate-200/70 dark:border-zinc-700/60 text-xs">
            <div className="flex items-center gap-1.5 text-slate-700 dark:text-zinc-200 font-bold text-[11px] mb-1">
              <Icon name="palette" size={13} className="text-rose-500" />
              <span>Yêu cầu khắc laser & thiệp:</span>
            </div>
            {Object.entries(parsed).map(([key, value]) => {
              if (!value) return null;
              let label = key;
              if (key === 'text') label = 'Nội dung khắc / Lời chúc';
              else if (key === 'card') label = 'Mẫu thiệp chúc';
              else if (key === 'font') label = 'Kiểu font';
              else if (key === 'note') label = 'Ghi chú thêm';
              
              return (
                <div key={key} className="flex items-start justify-between gap-2 text-[11px] border-b border-slate-200/40 dark:border-zinc-700/50 pb-1 last:border-0 last:pb-0">
                  <span className="text-slate-500 dark:text-zinc-400 font-medium shrink-0">{label}:</span>
                  <span className="font-semibold text-slate-800 dark:text-zinc-200 text-right">{String(value)}</span>
                </div>
              );
            })}
          </div>
        );
      }
    } catch {
      // Fallback
    }
    return (
      <div className="mt-1.5 p-2 rounded-lg bg-slate-50 dark:bg-zinc-800 text-[11px] text-slate-600 dark:text-zinc-300 font-mono whitespace-pre-wrap">
        {info}
      </div>
    );
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 rounded-3xl p-5 shadow-xs flex flex-col gap-4 overflow-y-auto max-h-[calc(100vh-140px)] scrollbar-none">
      
      {/* Header Inspector */}
      <div className="flex items-start justify-between pb-3 border-b border-slate-100 dark:border-zinc-800">
        <div>
          <span className="text-[10px] font-black uppercase text-slate-400 dark:text-zinc-500 tracking-wider">
            Chi tiết đơn hàng
          </span>
          <div className="flex items-center gap-2 mt-0.5">
            <h3 className="text-base font-black font-mono text-slate-900 dark:text-zinc-100">
              #{order.orderCode}
            </h3>
            <button
              onClick={() => onCopyCode(order.orderCode)}
              className="p-1 rounded-md bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-500 transition-colors cursor-pointer"
              title="Sao chép mã đơn"
            >
              <Icon name={copiedCode ? "check" : "copy"} size={12} className={copiedCode ? "text-emerald-500" : ""} />
            </button>
          </div>
          <p className="text-[10px] text-slate-400 dark:text-zinc-500 font-mono mt-0.5">
            {formatDate(order.orderedAt)}
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handlePrint}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-600 dark:text-zinc-300 transition-colors cursor-pointer"
            title="In phiếu đóng gói"
          >
            <Icon name="share" size={14} />
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-400 hover:text-slate-700 cursor-pointer lg:hidden"
            >
              <Icon name="close" size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Fast Status Update Controls */}
      <div className="space-y-3 bg-slate-50 dark:bg-zinc-800/60 p-3.5 rounded-2xl border border-slate-200/80 dark:border-zinc-700/80">
        
        {/* Order Status Selector */}
        <div>
          <label className="text-[10px] font-black uppercase text-slate-400 dark:text-zinc-500 block mb-1">
            Trạng thái giao hàng
          </label>
          <select
            value={order.orderStatus || 'PENDING'}
            disabled={isUpdating}
            onChange={(e) => onUpdateStatus(order.id, e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 text-xs font-bold text-slate-800 dark:text-zinc-100 focus:outline-none focus:border-rose-500 cursor-pointer"
          >
            <option value="PENDING">Chờ xác nhận (PENDING)</option>
            <option value="CONFIRMED">Đã xác nhận (CONFIRMED)</option>
            <option value="SHIPPING">Đang giao hàng (SHIPPING)</option>
            <option value="DELIVERED">Đã giao thành công (DELIVERED)</option>
            <option value="CANCELLED">Đã hủy đơn (CANCELLED)</option>
          </select>
        </div>

        {/* Payment Status Selector */}
        <div>
          <label className="text-[10px] font-black uppercase text-slate-400 dark:text-zinc-500 block mb-1">
            Trạng thái thanh toán
          </label>
          <select
            value={order.paymentStatus || 'PENDING'}
            disabled={isUpdating}
            onChange={(e) => onUpdatePayment(order.id, e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 text-xs font-bold text-slate-800 dark:text-zinc-100 focus:outline-none focus:border-rose-500 cursor-pointer"
          >
            <option value="PENDING">Chưa thanh toán (PENDING)</option>
            <option value="PAID">Đã thanh toán (PAID)</option>
            <option value="FAILED">Thanh toán thất bại (FAILED)</option>
          </select>
        </div>
      </div>

      {/* Customer Delivery Information */}
      <div className="space-y-2">
        <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-zinc-300 flex items-center gap-1.5">
          <Icon name="users" size={13} className="text-rose-500" />
          <span>Thông tin người nhận</span>
        </h4>

        <div className="bg-slate-50 dark:bg-zinc-800/40 p-3.5 rounded-2xl border border-slate-100 dark:border-zinc-800 space-y-1.5 text-xs">
          <div className="flex justify-between">
            <span className="text-slate-400 dark:text-zinc-500">Họ tên:</span>
            <span className="font-bold text-slate-800 dark:text-zinc-100">{order.customerName || 'N/A'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400 dark:text-zinc-500">Số điện thoại:</span>
            <span className="font-bold font-mono text-slate-800 dark:text-zinc-100">{order.customerPhone || 'N/A'}</span>
          </div>
          {order.customerEmail && (
            <div className="flex justify-between">
              <span className="text-slate-400 dark:text-zinc-500">Email:</span>
              <span className="font-medium text-slate-700 dark:text-zinc-300 truncate max-w-[180px]">{order.customerEmail}</span>
            </div>
          )}
          <div className="pt-1.5 border-t border-slate-200/60 dark:border-zinc-800">
            <span className="text-slate-400 dark:text-zinc-500 block text-[10px]">Địa chỉ giao hàng:</span>
            <p className="font-medium text-slate-700 dark:text-zinc-200 mt-0.5 leading-relaxed">
              {[order.shippingAddressLine, order.shippingWard, order.shippingDistrict, order.shippingProvince].filter(Boolean).join(', ') || 'Nhận tại cửa hàng'}
            </p>
          </div>
          {order.note && (
            <div className="pt-1.5 border-t border-slate-200/60 dark:border-zinc-800">
              <span className="text-rose-500 dark:text-rose-400 font-bold block text-[10px]">Lời dặn của khách:</span>
              <p className="font-medium text-slate-700 dark:text-zinc-300 italic mt-0.5">
                "{order.note}"
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Ordered Items List */}
      <div className="space-y-2">
        <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-zinc-300 flex items-center gap-1.5">
          <Icon name="gift" size={13} className="text-rose-500" />
          <span>Sản phẩm ({order.items?.length || 0})</span>
        </h4>

        <div className="space-y-2.5">
          {order.items?.map((item: any, idx: number) => (
            <div 
              key={idx} 
              className="p-3 bg-slate-50 dark:bg-zinc-800/40 rounded-2xl border border-slate-100 dark:border-zinc-800 space-y-2"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-slate-800 dark:text-zinc-100 truncate">
                    {item.productName || 'Sản phẩm quà tặng'}
                  </p>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                    Số lượng: <span className="font-bold text-slate-700 dark:text-zinc-300">{item.quantity}</span> x {formatVND(item.price)}
                  </p>
                </div>
                <span className="font-mono font-black text-xs text-rose-600 dark:text-rose-400">
                  {formatVND((item.price || 0) * (item.quantity || 1))}
                </span>
              </div>

              {/* Custom Laser Engraving / Card Notes */}
              {renderCustomizationInfo(item.customizationInfo)}

              {/* Photobooth Photo Attached */}
              {(item.photoboothImageUrl || item.customImageUrl) && (
                <div className="mt-2 p-2 rounded-xl bg-white dark:bg-zinc-800 border border-slate-200/80 dark:border-zinc-700 space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-700 dark:text-zinc-200">
                    <span className="flex items-center gap-1 text-rose-500">
                      <Icon name="camera" size={12} />
                      Ảnh Photobooth cần in
                    </span>
                    <button
                      onClick={() => setZoomImage(item.photoboothImageUrl || item.customImageUrl)}
                      className="text-[10px] text-rose-600 hover:underline cursor-pointer"
                    >
                      Phóng to
                    </button>
                  </div>
                  
                  <div 
                    className="relative aspect-[3/4] max-h-48 rounded-lg overflow-hidden bg-slate-100 dark:bg-zinc-900 cursor-zoom-in group"
                    onClick={() => setZoomImage(item.photoboothImageUrl || item.customImageUrl)}
                  >
                    <img 
                      src={item.photoboothImageUrl || item.customImageUrl} 
                      alt="Ảnh in photobooth" 
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform" 
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Price Breakdown Footer */}
      <div className="pt-3 border-t border-slate-100 dark:border-zinc-800 space-y-1.5 text-xs">
        <div className="flex justify-between text-slate-500 dark:text-zinc-400">
          <span>Tạm tính:</span>
          <span className="font-mono font-bold">{formatVND(order.totalPrice)}</span>
        </div>
        <div className="flex justify-between text-slate-500 dark:text-zinc-400">
          <span>Phí giao hàng:</span>
          <span className="font-mono text-emerald-600 font-bold">Miễn phí</span>
        </div>
        <div className="flex justify-between items-baseline pt-2 border-t border-slate-200 dark:border-zinc-700/80">
          <span className="font-black text-slate-800 dark:text-zinc-100 uppercase tracking-tight">Tổng thanh toán:</span>
          <span className="font-mono font-black text-lg text-rose-600 dark:text-rose-400">
            {formatVND(order.totalPrice)}
          </span>
        </div>
      </div>

      {/* Lightbox full image preview */}
      {zoomImage && (
        <div 
          className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setZoomImage(null)}
        >
          <button 
            onClick={() => setZoomImage(null)}
            className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer"
          >
            <Icon name="close" size={18} />
          </button>
          <div className="relative max-w-full max-h-[85vh]" onClick={e => e.stopPropagation()}>
            <img 
              src={zoomImage} 
              alt="Photobooth print preview" 
              className="max-w-[90vw] max-h-[80vh] object-contain rounded-2xl shadow-2xl border border-white/10" 
            />
          </div>
        </div>
      )}

    </div>
  );
};
