import Link from 'next/link';
import Icon from '@/components/common/Icons';
import OrderTimeline from './OrderTimeline';

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productSlug: string;
  productThumbnail?: string;
  variantId?: string;
  variantName?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  customizationInfo?: string;
}

export interface OrderDetails {
  id: string;
  orderCode: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  shippingProvince: string;
  shippingDistrict: string;
  shippingWard: string;
  shippingAddressLine: string;
  note?: string;
  subtotalPrice: number;
  shippingFee: number;
  discountAmount: number;
  totalPrice: number;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  shippingMethod: string;
  orderedAt: string;
  items: OrderItem[];
}

interface OrderLookupCardProps {
  order: OrderDetails;
  isExpanded: boolean;
  onToggle: () => void;
}

export default function OrderLookupCard({ order, isExpanded, onToggle }: OrderLookupCardProps) {
  const getOrderStatusStep = (status: string) => {
    const s = status?.toUpperCase();
    switch (s) {
      case 'PENDING': return 1;
      case 'CONFIRMED': return 2;
      case 'SHIPPING': return 3;
      case 'DELIVERED': return 4;
      default: return 1;
    }
  };

  const translateOrderStatus = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'PENDING':
        return { text: 'Chờ xử lý', color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/20 border-amber-500/20' };
      case 'CONFIRMED':
        return { text: 'Đã xác nhận', color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/20 border-blue-500/20' };
      case 'SHIPPING':
        return { text: 'Đang vận chuyển', color: 'text-sky-500 bg-sky-50 dark:bg-sky-950/20 border-sky-500/20' };
      case 'DELIVERED':
        return { text: 'Đã giao hàng', color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 border-emerald-500/20' };
      case 'CANCELLED':
        return { text: 'Đã hủy', color: 'text-rose-500 bg-rose-50 dark:bg-rose-950/20 border-rose-500/20' };
      default:
        return { text: status || 'Chờ xử lý', color: 'text-slate-500 bg-slate-50 dark:bg-zinc-800/50' };
    }
  };

  const translatePaymentMethod = (method: string) => {
    switch (method?.toUpperCase()) {
      case 'COD': return 'COD';
      case 'VNPAY': return 'VNPAY';
      case 'MOMO': return 'Ví Momo';
      default: return method || 'COD';
    }
  };

  const statusInfo = translateOrderStatus(order.orderStatus);
  const orderStep = getOrderStatusStep(order.orderStatus);
  const isCancelled = order.orderStatus?.toUpperCase() === 'CANCELLED';
  const fullAddress = `${order.shippingAddressLine}, ${order.shippingWard}, ${order.shippingDistrict}, ${order.shippingProvince}`;

  return (
    <div className="bg-white dark:bg-zinc-900 border border-slate-200/40 dark:border-zinc-800/60 rounded-2xl shadow-sm overflow-hidden transition-all duration-300">
      {/* Header */}
      <div
        onClick={onToggle}
        className="p-5 flex justify-between items-center cursor-pointer hover:bg-slate-50/50 dark:hover:bg-zinc-850/20 transition-colors select-none"
      >
        <div className="space-y-1.5 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-xs sm:text-sm text-slate-800 dark:text-zinc-200">
              #{order.orderCode}
            </span>
            <span className={`inline-block px-2 py-0.5 rounded-full font-bold text-[9px] uppercase border ${statusInfo.color}`}>
              {statusInfo.text}
            </span>
          </div>
          <div className="flex items-center gap-3 text-[10px] text-slate-400 dark:text-zinc-550">
            <span>
              {order.orderedAt ? new Date(order.orderedAt).toLocaleDateString('vi-VN') : '---'}
            </span>
            <span>•</span>
            <span>{order.customerName}</span>
            <span>•</span>
            <span>{translatePaymentMethod(order.paymentMethod)}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs sm:text-sm font-black text-rose-500 dark:text-rose-455">
            {order.totalPrice?.toLocaleString('vi-VN')}đ
          </span>
          <div className={`text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
            <Icon name="chevron-down" size={16} />
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t border-slate-100 dark:border-zinc-850 p-5 space-y-6 bg-slate-50/30 dark:bg-zinc-900/40 animate-slide-down">
          {/* Stepper Timeline */}
          {!isCancelled && <OrderTimeline orderStep={orderStep} />}

          {/* Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs text-slate-600 dark:text-zinc-350">
            {/* Delivery address */}
            <div className="bg-white dark:bg-zinc-950 p-4 border border-slate-150/40 dark:border-zinc-850/60 rounded-xl space-y-2">
              <div className="font-bold text-slate-850 dark:text-zinc-250 flex items-center gap-1.5">
                <Icon name="map-pin" size={13} className="text-rose-500" />
                Thông tin giao hàng
              </div>
              <div className="space-y-1 pl-5">
                <div className="font-medium text-slate-750 dark:text-zinc-300">
                  {order.customerName} - {order.customerPhone}
                </div>
                <div className="text-slate-450 dark:text-zinc-500 text-[11px] leading-relaxed">
                  {fullAddress}
                </div>
              </div>
            </div>

            {/* Pricing totals */}
            <div className="bg-white dark:bg-zinc-950 p-4 border border-slate-150/40 dark:border-zinc-850/60 rounded-xl space-y-2">
              <div className="font-bold text-slate-850 dark:text-zinc-250 flex items-center gap-1.5">
                <Icon name="bag" size={13} className="text-rose-500" />
                Chi tiết thanh toán
              </div>
              <div className="space-y-1 pl-5 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-400 dark:text-zinc-550">Phí giao hàng:</span>
                  <span className="font-medium text-slate-700 dark:text-zinc-300">{order.shippingFee?.toLocaleString('vi-VN')}đ</span>
                </div>
                {order.discountAmount > 0 && (
                  <div className="flex justify-between text-rose-500">
                    <span>Giảm giá:</span>
                    <span className="font-bold">-{order.discountAmount?.toLocaleString('vi-VN')}đ</span>
                  </div>
                )}
                <div className="flex justify-between text-[12px] pt-1.5 border-t border-slate-100 dark:border-zinc-850 font-bold text-slate-800 dark:text-zinc-250">
                  <span>Tổng cộng:</span>
                  <span className="text-rose-500">{order.totalPrice?.toLocaleString('vi-VN')}đ</span>
                </div>
              </div>
            </div>
          </div>

          {/* Items */}
          <div className="space-y-2">
            <div className="text-[11px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider pl-1">
              Sản phẩm ({order.items?.length})
            </div>
            <div className="bg-white dark:bg-zinc-950 border border-slate-150/40 dark:border-zinc-850/60 rounded-xl divide-y divide-slate-100 dark:divide-zinc-850 px-3">
              {order.items?.map((item) => (
                <div key={item.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={item.productThumbnail || 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=100&auto=format&fit=crop&q=80'}
                      alt={item.productName}
                      className="w-9 h-9 rounded-lg object-cover border border-slate-100 dark:border-zinc-800/40 shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="font-semibold text-slate-750 dark:text-zinc-300 truncate" title={item.productName}>
                        {item.productName}
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 dark:text-zinc-500 mt-0.5">
                        {item.variantName && <span>Phân loại: {item.variantName}</span>}
                        {item.customizationInfo && (
                          <span className="text-rose-500 bg-rose-50 dark:bg-rose-950/20 px-1 py-0.2 rounded border border-rose-100/10">
                            Ghi chú: {item.customizationInfo}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right pl-3 shrink-0">
                    <span className="text-[11px] text-slate-450 dark:text-zinc-500 mr-2">x{item.quantity}</span>
                    <span className="font-bold text-slate-700 dark:text-zinc-300">{item.totalPrice?.toLocaleString('vi-VN')}đ</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Detailed receipt link */}
          <div className="flex justify-end pt-2">
            <Link
              href={`/orders/success?orderCode=${order.orderCode}`}
              className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-500 hover:text-rose-600 transition-colors bg-rose-500/5 hover:bg-rose-500/10 px-4 py-2 rounded-xl border border-rose-500/10 cursor-pointer"
            >
              <Icon name="eye" size={12} />
              Xem hóa đơn chi tiết
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
