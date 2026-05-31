import Icon from '@/components/common/Icons';

interface BillingCardProps {
  subtotalPrice: number;
  shippingFee: number;
  discountAmount: number;
  totalPrice: number;
}

export default function BillingCard({ subtotalPrice, shippingFee, discountAmount, totalPrice }: BillingCardProps) {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-slate-200/40 dark:border-zinc-800/60 rounded-2xl p-5 shadow-sm space-y-4">
      <h3 className="text-sm font-bold text-slate-800 dark:text-zinc-200 border-b border-slate-100 dark:border-zinc-800/50 pb-3 flex items-center gap-2">
        <Icon name="credit-card" size={16} className="text-rose-500" />
        Tổng quan thanh toán
      </h3>
      
      <div className="text-xs space-y-2.5">
        <div className="flex justify-between text-slate-450 dark:text-zinc-500">
          <span>Tạm tính</span>
          <span className="font-semibold text-slate-700 dark:text-zinc-300">
            {subtotalPrice?.toLocaleString('vi-VN')}đ
          </span>
        </div>
        
        {discountAmount > 0 && (
          <div className="flex justify-between text-rose-500">
            <span>Giảm giá</span>
            <span className="font-bold">
              -{discountAmount?.toLocaleString('vi-VN')}đ
            </span>
          </div>
        )}
        
        <div className="flex justify-between text-slate-455 dark:text-zinc-500">
          <span>Phí giao hàng</span>
          <span className="font-semibold text-slate-700 dark:text-zinc-300">
            {shippingFee?.toLocaleString('vi-VN')}đ
          </span>
        </div>
        
        <div className="border-t border-slate-100 dark:border-zinc-850 pt-3 flex justify-between items-center">
          <span className="text-sm font-bold text-slate-800 dark:text-zinc-200">Tổng cộng</span>
          <span className="text-lg font-black text-rose-500 dark:text-rose-455">
            {totalPrice?.toLocaleString('vi-VN')}đ
          </span>
        </div>
      </div>
    </div>
  );
}
