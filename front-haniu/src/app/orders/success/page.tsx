'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderCode = searchParams.get('orderCode') || '';

  return (
    <div className="max-w-md mx-auto text-center py-16 px-4 space-y-6">
      <div className="w-16 h-16 bg-green-150 rounded-full flex items-center justify-center mx-auto text-green-600 text-3xl">
        ✓
      </div>
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Đặt hàng thành công!</h1>
        <p className="text-xs text-slate-400">
          Cảm ơn bạn đã lựa chọn Haniu Shop. Đơn hàng của bạn đã được tiếp nhận và xử lý.
        </p>
      </div>

      <div className="bg-slate-50 dark:bg-zinc-900 p-4 rounded-2xl border border-slate-200/40 text-xs text-left space-y-2">
        <div className="flex justify-between">
          <span className="text-slate-400">Mã đơn hàng:</span>
          <span className="font-mono font-bold text-slate-800 dark:text-zinc-200">{orderCode}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">Trạng thái thanh toán:</span>
          <span className="text-emerald-500 font-bold">Chờ xử lý / Đã tiếp nhận</span>
        </div>
      </div>

      <div className="flex flex-col gap-2 pt-4">
        <Link
          href="/"
          className="w-full py-3 bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs rounded-xl shadow-lg shadow-rose-500/10 transition-all"
        >
          Tiếp tục mua sắm
        </Link>
        <Link
          href="/cart"
          className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all"
        >
          Quay lại Giỏ hàng
        </Link>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="text-center py-20">Đang tải...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
