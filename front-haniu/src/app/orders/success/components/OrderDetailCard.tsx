import Icon from '@/components/common/Icons';

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
}

interface OrderDetailCardProps {
  order: OrderDetails;
}

export default function OrderDetailCard({ order }: OrderDetailCardProps) {
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

  const translatePaymentStatus = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'PENDING':
        return { text: 'Chờ thanh toán', color: 'text-amber-550' };
      case 'PAID':
        return { text: 'Đã thanh toán', color: 'text-emerald-550' };
      case 'FAILED':
        return { text: 'Thanh toán thất bại', color: 'text-rose-550' };
      default:
        return { text: status || 'Chờ thanh toán', color: 'text-slate-500' };
    }
  };

  const translatePaymentMethod = (method: string) => {
    switch (method?.toUpperCase()) {
      case 'COD':
        return 'Thanh toán khi nhận hàng (COD)';
      case 'VNPAY':
        return 'Thanh toán qua VNPAY';
      case 'MOMO':
        return 'Ví Momo';
      default:
        return method || 'Thanh toán khi nhận hàng (COD)';
    }
  };

  const translateShippingMethod = (method: string) => {
    switch (method?.toUpperCase()) {
      case 'STANDARD':
        return 'Giao hàng tiêu chuẩn';
      case 'FAST':
        return 'Giao hàng nhanh';
      case 'EXPRESS':
        return 'Giao hàng hỏa tốc';
      default:
        return method || 'Giao hàng tiêu chuẩn';
    }
  };

  const orderStatusInfo = translateOrderStatus(order.orderStatus);
  const paymentStatusInfo = translatePaymentStatus(order.paymentStatus);
  const fullAddress = `${order.shippingAddressLine}, ${order.shippingWard}, ${order.shippingDistrict}, ${order.shippingProvince}`;

  return (
    <div className="md:col-span-2 space-y-6">
      {/* Order Meta Info */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-200/40 dark:border-zinc-800/60 rounded-2xl p-5 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-800 dark:text-zinc-200 border-b border-slate-100 dark:border-zinc-800/50 pb-3 flex items-center gap-2">
          <Icon name="bag" size={16} className="text-rose-500" />
          Chi tiết đơn hàng #{order.orderCode}
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="flex justify-between sm:flex-col sm:gap-1 border-b sm:border-0 border-slate-100/60 dark:border-zinc-850 pb-2 sm:pb-0">
            <span className="text-slate-400 dark:text-zinc-500">Thời gian đặt hàng</span>
            <span className="font-semibold text-slate-700 dark:text-zinc-200">
              {order.orderedAt ? new Date(order.orderedAt).toLocaleString('vi-VN', { dateStyle: 'medium', timeStyle: 'short' }) : '---'}
            </span>
          </div>
          <div className="flex justify-between sm:flex-col sm:gap-1 border-b sm:border-0 border-slate-100/60 dark:border-zinc-850 pb-2 sm:pb-0">
            <span className="text-slate-400 dark:text-zinc-500">Trạng thái đơn hàng</span>
            <div>
              <span className={`inline-block px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase border ${orderStatusInfo.color}`}>
                {orderStatusInfo.text}
              </span>
            </div>
          </div>
          <div className="flex justify-between sm:flex-col sm:gap-1 border-b sm:border-0 border-slate-100/60 dark:border-zinc-850 pb-2 sm:pb-0">
            <span className="text-slate-400 dark:text-zinc-500">Phương thức thanh toán</span>
            <span className="font-semibold text-slate-700 dark:text-zinc-200">
              {translatePaymentMethod(order.paymentMethod)}
            </span>
          </div>
          <div className="flex justify-between sm:flex-col sm:gap-1 pb-2 sm:pb-0">
            <span className="text-slate-400 dark:text-zinc-500">Trạng thái thanh toán</span>
            <span className={`font-semibold ${paymentStatusInfo.color}`}>
              {paymentStatusInfo.text}
            </span>
          </div>
          <div className="flex justify-between sm:flex-col sm:gap-1 border-t sm:border-0 border-slate-100/60 dark:border-zinc-850 pt-2 sm:pt-0 sm:col-span-2">
            <span className="text-slate-400 dark:text-zinc-500">Hình thức vận chuyển</span>
            <span className="font-semibold text-slate-700 dark:text-zinc-200">
              {translateShippingMethod(order.shippingMethod)}
            </span>
          </div>
        </div>
      </div>

      {/* Delivery & Recipient info */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-200/40 dark:border-zinc-800/60 rounded-2xl p-5 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-800 dark:text-zinc-200 border-b border-slate-100 dark:border-zinc-800/50 pb-3 flex items-center gap-2">
          <Icon name="map-pin" size={16} className="text-rose-500" />
          Thông tin nhận hàng
        </h3>
        
        <div className="text-xs space-y-3">
          <div className="flex items-start gap-4">
            <div className="w-5 shrink-0 text-slate-400 dark:text-zinc-500 mt-0.5">
              <Icon name="user" size={14} />
            </div>
            <div>
              <div className="font-bold text-slate-700 dark:text-zinc-200">{order.customerName}</div>
              <div className="text-slate-450 dark:text-zinc-500 mt-0.5">{order.customerPhone}</div>
            </div>
          </div>
          
          <div className="flex items-start gap-4 border-t border-slate-100/60 dark:border-zinc-850 pt-3">
            <div className="w-5 shrink-0 text-slate-400 dark:text-zinc-500 mt-0.5">
              <Icon name="map-pin" size={14} />
            </div>
            <div className="text-slate-650 dark:text-zinc-300 leading-relaxed">
              {fullAddress}
            </div>
          </div>

          {order.note && (
            <div className="border-t border-slate-100/60 dark:border-zinc-850 pt-3 flex items-start gap-4">
              <div className="w-5 shrink-0 text-slate-400 dark:text-zinc-500 mt-0.5">
                <Icon name="edit" size={14} />
              </div>
              <div className="bg-slate-50 dark:bg-zinc-950 p-2.5 rounded-xl border border-slate-150/40 dark:border-zinc-850/60 text-slate-500 dark:text-zinc-400 italic flex-1">
                Ghi chú: "{order.note}"
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
