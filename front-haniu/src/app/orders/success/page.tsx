'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Icon from '@/components/common/Icons';
import { orderService } from '@/services/order.service';
import SuccessHero from './components/SuccessHero';
import OrderDetailCard, { OrderDetails } from './components/OrderDetailCard';
import OrderItemsCard from './components/OrderItemsCard';
import BillingCard from './components/BillingCard';

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderCode = searchParams.get('orderCode') || '';
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderCode) {
      setError('Không tìm thấy mã đơn hàng trong liên kết.');
      setLoading(false);
      return;
    }

    const fetchOrder = async () => {
      try {
        setLoading(true);
        const data = await orderService.getOrderByCode(orderCode);
        if (data) {
          setOrder(data);
        } else {
          setError('Không thể tìm thấy thông tin đơn hàng này.');
        }
      } catch (err: any) {
        console.error('Failed to load order:', err);
        setError(err.message || 'Lỗi kết nối máy chủ khi lấy chi tiết đơn hàng.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderCode]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col justify-center items-center gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500" />
        <p className="text-xs text-slate-400 dark:text-zinc-500 font-semibold">Đang tải thông tin đơn hàng...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-md mx-auto text-center py-20 px-4 space-y-6 font-sans">
        <div className="w-16 h-16 bg-rose-50 dark:bg-rose-950/20 rounded-full flex items-center justify-center mx-auto text-rose-500">
          <Icon name="alert" size={28} />
        </div>
        <div className="space-y-2">
          <h1 className="text-xl font-bold text-slate-800 dark:text-zinc-100">Không tìm thấy đơn hàng</h1>
          <p className="text-xs text-slate-400 dark:text-zinc-500">
            {error || 'Đã có lỗi xảy ra khi tải thông tin đơn hàng. Vui lòng kiểm tra lại mã đơn hàng.'}
          </p>
        </div>
        <div className="pt-4">
          <Link
            href="/"
            className="inline-block w-full py-3 bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs rounded-xl shadow-lg shadow-rose-500/10 transition-all text-center"
          >
            Quay lại Trang chủ
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-12 font-sans space-y-8 sm:space-y-12">
      {/* Success Hero Card */}
      <SuccessHero orderCode={order.orderCode} customerEmail={order.customerEmail} />

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        {/* Left Side: Order & Shipping details */}
        <OrderDetailCard order={order} />

        {/* Right Side: Product summary & Billing details */}
        <div className="space-y-6">
          {/* Items card */}
          <OrderItemsCard items={(order as any).items || []} />

          {/* Pricing Card */}
          <BillingCard
            subtotalPrice={order.subtotalPrice}
            shippingFee={order.shippingFee}
            discountAmount={order.discountAmount}
            totalPrice={order.totalPrice}
          />
        </div>
      </div>

      {/* Footer / Actions */}
      <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-slate-200/40 dark:border-zinc-800/60 max-w-md mx-auto sm:max-w-none">
        <Link
          href="/products"
          className="flex-1 text-center py-3 bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs rounded-xl shadow-lg shadow-rose-500/10 transition-all hover:scale-[1.01] duration-200 cursor-pointer"
        >
          Tiếp tục mua sắm
        </Link>
        <Link
          href="/cart"
          className="flex-1 text-center py-3 bg-slate-100 hover:bg-slate-150 dark:bg-zinc-900 dark:hover:bg-zinc-850 text-slate-700 dark:text-zinc-250 font-bold text-xs rounded-xl transition-all hover:scale-[1.01] duration-200 border border-slate-200/10 dark:border-zinc-800/80 cursor-pointer"
        >
          Quay lại Giỏ hàng
        </Link>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[60vh] flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500" />
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
