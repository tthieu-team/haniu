'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Icon from '@/components/common/Icons';
import { orderService } from '@/services/order.service';
import OrderLookupCard, { OrderDetails } from './components/OrderLookupCard';

function LookupContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('query') || searchParams.get('code') || '';

  const [query, setQuery] = useState(initialQuery);
  const [orders, setOrders] = useState<OrderDetails[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
      const fetchInitial = async () => {
        try {
          setLoading(true);
          setError(null);
          setSearched(true);
          const data = await orderService.lookupOrders(initialQuery);
          setOrders(data || []);
          if (data && data.length > 0) {
            setExpandedOrderId(data[0].id);
          }
        } catch (err: any) {
          setError(err.message || 'Có lỗi xảy ra khi tra cứu. Vui lòng thử lại.');
          setOrders([]);
        } finally {
          setLoading(false);
        }
      };
      fetchInitial();
    }
  }, [initialQuery]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    try {
      setLoading(true);
      setError(null);
      setSearched(true);
      const data = await orderService.lookupOrders(query);
      setOrders(data || []);
      if (data && data.length > 0) {
        setExpandedOrderId(data[0].id); // Expand the first result by default
      }
    } catch (err: any) {
      console.error('Failed to lookup orders:', err);
      setError(err.message || 'Có lỗi xảy ra khi tra cứu. Vui lòng thử lại.');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedOrderId(expandedOrderId === id ? null : id);
  };

  return (
    <div className="max-w-4xl mx-auto pb-12 font-sans space-y-8 sm:space-y-12">
      {/* Title Header */}
      <div className="text-center space-y-3 max-w-xl mx-auto">
        <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.25em] text-rose-500 bg-rose-500/10 border border-rose-500/20">
          Tra cứu nhanh
        </span>
        <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-slate-800 dark:text-zinc-100">
          Tra Cứu Đơn Hàng
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 leading-relaxed">
          Nhập mã đơn hàng, số điện thoại hoặc địa chỉ email bạn đã sử dụng lúc đặt hàng để theo dõi trạng thái vận chuyển mới nhất.
        </p>
      </div>

      {/* Search Bar Form */}
      <div className="max-w-2xl mx-auto bg-white dark:bg-zinc-900 border border-slate-200/40 dark:border-zinc-800/60 rounded-3xl p-5 sm:p-6 shadow-xl shadow-slate-100/40 dark:shadow-none">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400 dark:text-zinc-500">
              <Icon name="search" size={18} />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Mã đơn hàng, Email hoặc Số điện thoại..."
              className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-zinc-950 border border-slate-100 dark:border-zinc-800 text-slate-800 dark:text-zinc-100 text-xs sm:text-sm rounded-2xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all font-medium placeholder-slate-400 dark:placeholder-zinc-650"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="py-3.5 px-8 bg-rose-500 hover:bg-rose-600 disabled:bg-rose-400 text-white font-bold text-xs sm:text-sm rounded-2xl transition-all shadow-md shadow-rose-500/10 hover:shadow-rose-500/20 cursor-pointer flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              'Tìm kiếm'
            )}
          </button>
        </form>
      </div>

      {/* Results Area */}
      <div className="max-w-3xl mx-auto space-y-6">
        {loading && (
          <div className="py-20 flex flex-col justify-center items-center gap-3">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-rose-500" />
            <p className="text-[11px] text-slate-400 dark:text-zinc-500 font-semibold">Đang truy vấn đơn hàng của bạn...</p>
          </div>
        )}

        {/* Welcome State */}
        {!searched && !loading && (
          <div className="text-center py-16 border border-dashed border-slate-200/60 dark:border-zinc-800/80 rounded-3xl space-y-4">
            <div className="w-14 h-14 bg-slate-100 dark:bg-zinc-900/60 text-slate-400 dark:text-zinc-550 rounded-full flex items-center justify-center mx-auto">
              <Icon name="bag" size={24} />
            </div>
            <p className="text-xs text-slate-400 dark:text-zinc-500 max-w-xs mx-auto">
              Vui lòng điền thông tin vào thanh tìm kiếm phía trên để hiển thị trạng thái đơn hàng.
            </p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-rose-50 dark:bg-rose-950/10 border border-rose-200/30 dark:border-rose-900/20 rounded-2xl p-4 text-center text-xs text-rose-500 font-medium">
            <Icon name="alert" size={16} className="inline mr-1.5" />
            {error}
          </div>
        )}

        {/* No Results Found */}
        {searched && !loading && orders.length === 0 && !error && (
          <div className="text-center py-16 border border-dashed border-slate-200/60 dark:border-zinc-800/80 rounded-3xl space-y-4">
            <div className="w-14 h-14 bg-rose-50 dark:bg-rose-950/20 text-rose-500 rounded-full flex items-center justify-center mx-auto">
              <Icon name="alert" size={24} />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-bold text-slate-800 dark:text-zinc-200">Không tìm thấy đơn hàng nào</p>
              <p className="text-xs text-slate-400 dark:text-zinc-500 max-w-md mx-auto px-4">
                Không tìm thấy đơn hàng nào khớp với thông tin "{query}". Vui lòng kiểm tra kỹ lại mã đơn hàng, số điện thoại hoặc email.
              </p>
            </div>
          </div>
        )}

        {/* Results Found */}
        {searched && !loading && orders.length > 0 && (
          <div className="space-y-4">
            <div className="flex justify-between items-center px-2">
              <span className="text-xs font-bold text-slate-505 dark:text-zinc-450">
                Tìm thấy {orders.length} đơn hàng trùng khớp
              </span>
            </div>

            {orders.map((order) => (
              <OrderLookupCard
                key={order.id}
                order={order}
                isExpanded={expandedOrderId === order.id}
                onToggle={() => toggleExpand(order.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function OrderLookupPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[60vh] flex justify-center items-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-rose-500" />
      </div>
    }>
      <LookupContent />
    </Suspense>
  );
}
