'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { fetchApi } from '@/lib/api';
import Link from 'next/link';
import Icon from '@/components/common/Icons';

function CallbackContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'failed'>('loading');
  const [orderCode, setOrderCode] = useState('');

  useEffect(() => {
    const processPayment = async () => {
      const code = searchParams.get('orderCode') || '';
      const gateway = searchParams.get('gateway') || '';
      const statusCode = searchParams.get('status') || '';
      setOrderCode(code);

      if (!code || !gateway) {
        setStatus('failed');
        return;
      }

      try {
        // Send request to webhook on backend to record and validate payment
        const queryParams = new URLSearchParams();
        searchParams.forEach((value, key) => {
          queryParams.append(key, value);
        });

        // Trigger POST webhook
        await fetchApi(`/api/v1/payments/webhook/${gateway.toLowerCase()}?${queryParams.toString()}`, {
          method: 'POST'
        });

        if (statusCode === '00') {
          setStatus('success');
        } else {
          setStatus('failed');
        }
      } catch (err) {
        // Fallback status check
        if (statusCode === '00') {
          setStatus('success');
        } else {
          setStatus('failed');
        }
      }
    };

    processPayment();
  }, [searchParams]);

  if (status === 'loading') {
    return (
      <div className="max-w-md mx-auto text-center py-20 px-4 space-y-4">
        <div className="w-12 h-12 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <h2 className="text-sm font-bold text-slate-700 dark:text-zinc-300">Đang xác thực giao dịch thanh toán...</h2>
        <p className="text-xs text-slate-400">Vui lòng không tắt hoặc refresh trình duyệt lúc này.</p>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="max-w-md mx-auto text-center py-16 px-4 space-y-6">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600">
          <Icon name="check" size={28} />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white font-serif">Thanh toán thành công!</h1>
          <p className="text-xs text-slate-400">
            Giao dịch thanh toán trực tuyến cho đơn hàng của bạn đã hoàn tất.
          </p>
        </div>

        <div className="bg-slate-50 dark:bg-zinc-900 p-4 rounded-2xl border border-slate-200/40 text-xs text-left space-y-2">
          <div className="flex justify-between">
            <span className="text-slate-400">Mã đơn hàng:</span>
            <span className="font-mono font-bold text-slate-800 dark:text-zinc-200">{orderCode}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Cổng thanh toán:</span>
            <span className="font-bold text-rose-500">{searchParams.get('gateway')}</span>
          </div>
        </div>

        <Link
          href="/"
          className="block w-full py-3 bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs rounded-xl shadow-lg shadow-rose-500/10 transition-all text-center"
        >
          Trở về Trang chủ
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto text-center py-16 px-4 space-y-6">
      <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto text-red-500">
        <Icon name="close" size={28} />
      </div>
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Thanh toán thất bại</h1>
        <p className="text-xs text-slate-400">
          Giao dịch thanh toán chưa thể hoàn tất hoặc đã bị hủy từ phía người dùng.
        </p>
      </div>

      <div className="flex flex-col gap-2 pt-4">
        <Link
          href="/cart"
          className="w-full py-3 bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs rounded-xl shadow-lg shadow-rose-500/10 transition-all text-center"
        >
          Thử thanh toán lại
        </Link>
        <Link
          href="/"
          className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all text-center"
        >
          Trở về Trang chủ
        </Link>
      </div>
    </div>
  );
}

export default function OrderCallbackPage() {
  return (
    <Suspense fallback={<div className="text-center py-20">Đang tải...</div>}>
      <CallbackContent />
    </Suspense>
  );
}
