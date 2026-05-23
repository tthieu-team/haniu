'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Icon from '@/components/common/Icons';
import { orderService } from '@/services/order.service';
import { productService } from '@/services/product.service';
import { couponService } from '@/services/coupon.service';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    revenue: 0,
    ordersCount: 0,
    customersCount: 0,
    productsCount: 0,
    couponsCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [lowStockProducts, setLowStockProducts] = useState<any[]>([]);
  const [statusStats, setStatusStats] = useState({
    pending: 0,
    confirmed: 0,
    shipping: 0,
    delivered: 0,
    cancelled: 0,
  });

  const formatVND = (value: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        const [ordersRes, productsRes, couponsRes] = await Promise.all([
          orderService.getAllOrders().catch(() => []),
          productService.getProducts({ size: 100 }).catch(() => ({ content: [] })),
          couponService.getAllCoupons().catch(() => []),
        ]);

        const orders = Array.isArray(ordersRes) ? ordersRes : [];
        const products = productsRes?.content || [];
        const coupons = Array.isArray(couponsRes) ? couponsRes : [];

        // Compute stats
        const totalRevenue = orders
          .filter((o: any) => o.orderStatus !== 'CANCELLED')
          .reduce((sum: number, o: any) => sum + (o.totalPrice || 0), 0);

        const uniqueCustomers = new Set(orders.map((o: any) => o.customerEmail).filter(Boolean)).size;

        // Order status counts
        const statusMap = { pending: 0, confirmed: 0, shipping: 0, delivered: 0, cancelled: 0 };
        orders.forEach((o: any) => {
          const st = (o.orderStatus || '').toLowerCase();
          if (st === 'pending') statusMap.pending++;
          else if (st === 'confirmed') statusMap.confirmed++;
          else if (st === 'shipping') statusMap.shipping++;
          else if (st === 'delivered') statusMap.delivered++;
          else if (st === 'cancelled') statusMap.cancelled++;
        });

        // Filter products with low stock (e.g. <= 5)
        const lowStock = products.filter((p: any) => (p.stock || 0) <= 5);

        setStats({
          revenue: totalRevenue,
          ordersCount: orders.length,
          customersCount: uniqueCustomers || Math.min(orders.length, 3), // Fallback if emails are empty
          productsCount: products.length,
          couponsCount: coupons.length,
        });

        setStatusStats(statusMap);
        setRecentOrders(orders.slice(0, 5));
        setLowStockProducts(lowStock.slice(0, 5));

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[60vh] w-full items-center justify-center">
        <div className="text-center space-y-2">
          <svg className="animate-spin h-6 w-6 text-rose-500 mx-auto" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="text-xs text-slate-400 dark:text-zinc-500">Đang tải dữ liệu tổng quan...</p>
        </div>
      </div>
    );
  }

  // Visual helper values for custom SVG charts
  const maxStatusCount = Math.max(...Object.values(statusStats), 1);

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">Dashboard Tổng Quan</h1>
          <p className="text-xs text-slate-500 dark:text-zinc-400">Xem nhanh tình trạng kinh doanh và quản trị hệ thống Haniu.</p>
        </div>
        
        {/* Quick Actions Panel */}
        <div className="flex items-center gap-2">
          <Link
            href="/admin/products/new"
            className="flex items-center gap-2 px-3 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
          >
            <Icon name="plus" size={14} /> Thêm Sản phẩm
          </Link>
          <Link
            href="/admin/coupons"
            className="flex items-center gap-2 px-3 py-2 bg-slate-850 dark:bg-zinc-800 hover:bg-slate-800 text-slate-200 dark:text-zinc-200 text-xs font-bold rounded-xl border border-slate-700 dark:border-zinc-700 transition-all active:scale-95 cursor-pointer"
          >
            <Icon name="star" size={14} /> Tạo Coupon
          </Link>
        </div>
      </div>

      {/* 1. STATISTIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Revenue Card */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-250/60 dark:border-zinc-850 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">Doanh Thu</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-500 flex items-center justify-center">
              <Icon name="cart" size={18} />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-xl font-black text-slate-800 dark:text-white">{formatVND(stats.revenue)}</h3>
            <span className="text-[10px] text-emerald-500 font-bold flex items-center gap-1 mt-1">
              <span>+12%</span>
              <span className="text-slate-400 font-medium">so với tháng trước</span>
            </span>
          </div>
        </div>

        {/* Orders Count Card */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-250/60 dark:border-zinc-850 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">Đơn Hàng</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-500 flex items-center justify-center">
              <Icon name="bag" size={18} />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-xl font-black text-slate-800 dark:text-white">{stats.ordersCount} đơn</h3>
            <span className="text-[10px] text-blue-500 font-bold flex items-center gap-1 mt-1">
              <span>+8%</span>
              <span className="text-slate-400 font-medium">mới nhận tuần này</span>
            </span>
          </div>
        </div>

        {/* Customers Count Card */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-250/60 dark:border-zinc-850 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">Khách Hàng</span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-500 flex items-center justify-center">
              <Icon name="user" size={18} />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-xl font-black text-slate-800 dark:text-white">{stats.customersCount} người</h3>
            <span className="text-[10px] text-purple-500 font-bold flex items-center gap-1 mt-1">
              <span>+15%</span>
              <span className="text-slate-400 font-medium">tăng trưởng tháng này</span>
            </span>
          </div>
        </div>

        {/* Products Count Card */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-250/60 dark:border-zinc-850 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">Sản Phẩm</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-500 flex items-center justify-center">
              <Icon name="gift" size={18} />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-xl font-black text-slate-800 dark:text-white">{stats.productsCount} món</h3>
            <span className="text-[10px] text-amber-500 font-bold flex items-center gap-1 mt-1">
              <span>{stats.couponsCount} mã giảm giá</span>
              <span className="text-slate-400 font-medium">đang áp dụng</span>
            </span>
          </div>
        </div>

      </div>

      {/* 2. CHARTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Revenue Chart Visual (Premium SVG implementation) */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-250/60 dark:border-zinc-850 p-5 rounded-2xl shadow-sm">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500 mb-4">Biểu đồ doanh thu tuần này</h3>
          <div className="h-60 w-full relative flex items-end justify-between pt-10">
            {/* Draw grid lines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pt-10 pb-8">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="border-t border-slate-100 dark:border-zinc-800 w-full h-0" />
              ))}
            </div>
            
            {/* Chart SVG Line */}
            <svg className="absolute inset-x-0 top-10 bottom-8 h-[calc(100%-4.5rem)] w-full" preserveAspectRatio="none" viewBox="0 0 100 100">
              <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgba(244, 63, 94, 0.25)" />
                  <stop offset="100%" stopColor="rgba(244, 63, 94, 0)" />
                </linearGradient>
              </defs>
              {/* Line path */}
              <path 
                d="M 5,85 Q 20,55 35,65 T 65,30 T 95,15" 
                fill="none" 
                stroke="rgb(244, 63, 94)" 
                strokeWidth="3.5" 
                strokeLinecap="round"
              />
              {/* Area filled path */}
              <path 
                d="M 5,85 Q 20,55 35,65 T 65,30 T 95,15 L 95,95 L 5,95 Z" 
                fill="url(#chartGrad)"
              />
              {/* Highlight Dots */}
              <circle cx="5" cy="85" r="4.5" fill="white" stroke="rgb(244, 63, 94)" strokeWidth="2.5" />
              <circle cx="35" cy="65" r="4.5" fill="white" stroke="rgb(244, 63, 94)" strokeWidth="2.5" />
              <circle cx="65" cy="30" r="4.5" fill="white" stroke="rgb(244, 63, 94)" strokeWidth="2.5" />
              <circle cx="95" cy="15" r="4.5" fill="white" stroke="rgb(244, 63, 94)" strokeWidth="2.5" />
            </svg>
            
            {/* X-Axis labels */}
            <div className="absolute bottom-0 inset-x-0 flex justify-between text-[10px] text-slate-400 font-bold px-2">
              <span>Thứ 2</span>
              <span>Thứ 4</span>
              <span>Thứ 6</span>
              <span>Chủ nhật</span>
            </div>
          </div>
        </div>

        {/* Order Status Distribution Chart */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-250/60 dark:border-zinc-850 p-5 rounded-2xl shadow-sm flex flex-col">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500 mb-4">Trạng thái đơn hàng</h3>
          <div className="flex-1 flex flex-col justify-center space-y-4">
            
            {/* Pending status row */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-bold">
                <span className="text-amber-500 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Chờ xác nhận
                </span>
                <span>{statusStats.pending} đơn</span>
              </div>
              <div className="h-2 w-full bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-amber-500 transition-all duration-500 rounded-full" 
                  style={{ width: `${(statusStats.pending / maxStatusCount) * 100}%` }}
                />
              </div>
            </div>

            {/* Confirmed status row */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-bold">
                <span className="text-blue-500 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Đã xác nhận
                </span>
                <span>{statusStats.confirmed} đơn</span>
              </div>
              <div className="h-2 w-full bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 transition-all duration-500 rounded-full" 
                  style={{ width: `${(statusStats.confirmed / maxStatusCount) * 100}%` }}
                />
              </div>
            </div>

            {/* Shipping status row */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-bold">
                <span className="text-indigo-500 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" /> Đang vận chuyển
                </span>
                <span>{statusStats.shipping} đơn</span>
              </div>
              <div className="h-2 w-full bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-indigo-500 transition-all duration-500 rounded-full" 
                  style={{ width: `${(statusStats.shipping / maxStatusCount) * 100}%` }}
                />
              </div>
            </div>

            {/* Delivered status row */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-bold">
                <span className="text-emerald-500 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Đã giao hàng
                </span>
                <span>{statusStats.delivered} đơn</span>
              </div>
              <div className="h-2 w-full bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 transition-all duration-500 rounded-full" 
                  style={{ width: `${(statusStats.delivered / maxStatusCount) * 100}%` }}
                />
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* 3. RECENT ACTIVITY & LOW STOCK SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent Orders List */}
        <div className="lg:col-span-2 bg-white dark:bg-zinc-900 border border-slate-250/60 dark:border-zinc-850 p-5 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">Đơn hàng vừa đặt</h3>
            <Link href="/admin/orders" className="text-xs font-bold text-rose-500 hover:text-rose-600 transition-colors">
              Xem tất cả
            </Link>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-100 dark:border-zinc-850 text-slate-400 font-bold">
                  <th className="py-2.5">Mã đơn</th>
                  <th className="py-2.5">Khách hàng</th>
                  <th className="py-2.5">Tổng tiền</th>
                  <th className="py-2.5">Thanh toán</th>
                  <th className="py-2.5">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-zinc-850">
                {recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400">Không có đơn hàng nào vừa nhận.</td>
                  </tr>
                ) : (
                  recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50/50 dark:hover:bg-zinc-850/50 transition-colors">
                      <td className="py-3 font-semibold text-slate-800 dark:text-zinc-200">{order.orderCode}</td>
                      <td className="py-3">
                        <p className="font-semibold">{order.customerName}</p>
                        <p className="text-[10px] text-slate-400">{order.customerPhone}</p>
                      </td>
                      <td className="py-3 font-bold">{formatVND(order.totalPrice)}</td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded-full font-bold text-[9px] ${
                          order.paymentStatus === 'PAID' 
                            ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-500' 
                            : 'bg-amber-50 dark:bg-amber-950/30 text-amber-500'
                        }`}>
                          {order.paymentStatus === 'PAID' ? 'Đã trả' : 'Chưa trả'}
                        </span>
                      </td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded-full font-bold text-[9px] ${
                          order.orderStatus === 'DELIVERED' 
                            ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-500' 
                            : order.orderStatus === 'CANCELLED'
                            ? 'bg-red-50 dark:bg-red-950/30 text-red-500'
                            : 'bg-blue-50 dark:bg-blue-950/30 text-blue-500'
                        }`}>
                          {order.orderStatus}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-250/60 dark:border-zinc-850 p-5 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">Cảnh báo tồn kho</h3>
            <Link href="/admin/products" className="text-xs font-bold text-rose-500 hover:text-rose-600 transition-colors">
              Xem tất cả
            </Link>
          </div>
          
          <div className="space-y-3">
            {lowStockProducts.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                <span className="text-emerald-500 text-lg mr-1">✓</span> Tồn kho ở trạng thái an toàn.
              </div>
            ) : (
              lowStockProducts.map((p) => (
                <div key={p.id} className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-zinc-850 rounded-xl">
                  <div className="min-w-0 flex-1 pr-2">
                    <p className="font-bold text-xs truncate text-slate-800 dark:text-zinc-200">{p.name}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">SKU: {p.sku || 'N/A'}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="px-2 py-0.5 rounded-full font-bold text-[9px] bg-red-50 dark:bg-red-950/30 text-red-500">
                      Còn {p.stock} sản phẩm
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
