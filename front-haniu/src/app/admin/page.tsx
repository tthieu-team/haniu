'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import Icon from '@/components/common/Icons';
import { orderService } from '@/services/order.service';
import { productService } from '@/services/product.service';
import { couponService } from '@/services/coupon.service';
import { userService } from '@/services/user.service';
import { photoboothService } from '@/services/photobooth.service';

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | 'all'>('7d');
  const [hoveredPoint, setHoveredPoint] = useState<any | null>(null);
  
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [coupons, setCoupons] = useState<any[]>([]);
  const [userStats, setUserStats] = useState<any>(null);
  const [photoboothStats, setPhotoboothStats] = useState<any>(null);

  const formatVND = (value: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value || 0);
  };

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        const [ordersRes, productsRes, couponsRes, usersRes, pbStatsRes] = await Promise.all([
          orderService.getAllOrders().catch(() => []),
          productService.getProducts({ size: 100 }).catch(() => ({ content: [] })),
          couponService.getAllCoupons().catch(() => []),
          userService.getStats().catch(() => null),
          photoboothService.getDashboardStats().catch(() => null),
        ]);

        setOrders(Array.isArray(ordersRes) ? ordersRes : []);
        setProducts(productsRes?.content || []);
        setCoupons(Array.isArray(couponsRes) ? couponsRes : []);
        setUserStats(usersRes);
        setPhotoboothStats(pbStatsRes);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  // Filter orders by selected timeRange
  const { filteredOrders, previousPeriodRevenue, revenueGrowth } = useMemo(() => {
    const now = new Date();
    let cutoffDate = new Date();
    let prevCutoffDate = new Date();

    if (timeRange === '7d') {
      cutoffDate.setDate(now.getDate() - 7);
      prevCutoffDate.setDate(now.getDate() - 14);
    } else if (timeRange === '30d') {
      cutoffDate.setDate(now.getDate() - 30);
      prevCutoffDate.setDate(now.getDate() - 60);
    } else {
      cutoffDate = new Date(0); // All time
      prevCutoffDate = new Date(0);
    }

    const currentOrders = orders.filter((o: any) => {
      if (timeRange === 'all') return true;
      const orderDate = new Date(o.orderedAt || o.createdAt || 0);
      return orderDate >= cutoffDate;
    });

    const prevOrders = orders.filter((o: any) => {
      if (timeRange === 'all') return false;
      const orderDate = new Date(o.orderedAt || o.createdAt || 0);
      return orderDate >= prevCutoffDate && orderDate < cutoffDate;
    });

    const currentRevenue = currentOrders
      .filter((o: any) => o.orderStatus !== 'CANCELLED')
      .reduce((sum: number, o: any) => sum + (o.totalPrice || 0), 0);

    const prevRevenue = prevOrders
      .filter((o: any) => o.orderStatus !== 'CANCELLED')
      .reduce((sum: number, o: any) => sum + (o.totalPrice || 0), 0);

    let growth: number | null = null;
    if (prevRevenue > 0) {
      growth = Math.round(((currentRevenue - prevRevenue) / prevRevenue) * 100);
    } else if (currentRevenue > 0 && prevRevenue === 0) {
      growth = 100;
    }

    return {
      filteredOrders: currentOrders,
      previousPeriodRevenue: prevRevenue,
      revenueGrowth: growth,
    };
  }, [orders, timeRange]);

  // Overall & Filtered Computed summary metrics
  const computedMetrics = useMemo(() => {
    const validOrders = filteredOrders.filter((o: any) => o.orderStatus !== 'CANCELLED');
    const totalRevenue = validOrders.reduce((sum: number, o: any) => sum + (o.totalPrice || 0), 0);
    const completedOrders = filteredOrders.filter((o: any) => o.orderStatus === 'DELIVERED').length;
    const completedRate = filteredOrders.length > 0 ? Math.round((completedOrders / filteredOrders.length) * 100) : 0;

    const statusCounts = {
      pending: 0,
      confirmed: 0,
      shipping: 0,
      delivered: 0,
      cancelled: 0,
    };

    filteredOrders.forEach((o: any) => {
      const st = (o.orderStatus || '').toLowerCase();
      if (st === 'pending') statusCounts.pending++;
      else if (st === 'confirmed') statusCounts.confirmed++;
      else if (st === 'shipping') statusCounts.shipping++;
      else if (st === 'delivered') statusCounts.delivered++;
      else if (st === 'cancelled') statusCounts.cancelled++;
    });

    const lowStock = products.filter((p: any) => (p.stock || 0) <= 5);
    const activeCoupons = coupons.filter((c: any) => c.status === 'ACTIVE' || c.isActive !== false);

    const uniqueCustomers = new Set(orders.map((o: any) => o.customerEmail).filter(Boolean)).size;
    const totalCustomers = userStats?.totalUsers ?? (uniqueCustomers > 0 ? uniqueCustomers : orders.length);

    return {
      totalRevenue,
      totalOrders: filteredOrders.length,
      allOrdersCount: orders.length,
      completedOrders,
      completedRate,
      statusCounts,
      lowStock,
      totalProducts: products.length,
      activeCouponsCount: activeCoupons.length,
      totalCustomers,
      recentOrders: orders.slice(0, 6),
      lowStockTop: lowStock.slice(0, 4),
    };
  }, [filteredOrders, orders, products, coupons, userStats]);

  // Accurate Timeline Chart Points based on actual orders
  const chartData = useMemo(() => {
    const now = new Date();
    
    if (timeRange === '7d') {
      // 7 distinct days
      const daysList: { label: string; dateStr: string; value: number }[] = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(now.getDate() - i);
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        const dateKey = `${yyyy}-${mm}-${dd}`;
        const dayOfWeek = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'][d.getDay()];

        // Sum orders for this date
        const dayRevenue = orders
          .filter((o: any) => {
            if (o.orderStatus === 'CANCELLED') return false;
            const oDate = new Date(o.orderedAt || o.createdAt || 0);
            const oKey = `${oDate.getFullYear()}-${String(oDate.getMonth() + 1).padStart(2, '0')}-${String(oDate.getDate()).padStart(2, '0')}`;
            return oKey === dateKey;
          })
          .reduce((sum: number, o: any) => sum + (o.totalPrice || 0), 0);

        daysList.push({
          label: `${dayOfWeek} (${dd}/${mm})`,
          dateStr: `${dd}/${mm}`,
          value: dayRevenue,
        });
      }

      const maxValue = Math.max(...daysList.map(p => p.value), 0);
      return { points: daysList, maxValue };
    } 
    else if (timeRange === '30d') {
      // 4 weekly blocks
      const blocks: { label: string; dateStr: string; value: number }[] = [];
      for (let i = 3; i >= 0; i--) {
        const start = new Date();
        start.setDate(now.getDate() - (i + 1) * 7);
        const end = new Date();
        end.setDate(now.getDate() - i * 7);

        const blockRevenue = orders
          .filter((o: any) => {
            if (o.orderStatus === 'CANCELLED') return false;
            const oDate = new Date(o.orderedAt || o.createdAt || 0);
            return oDate >= start && oDate <= end;
          })
          .reduce((sum: number, o: any) => sum + (o.totalPrice || 0), 0);

        blocks.push({
          label: `Tuần ${4 - i}`,
          dateStr: `Tuần ${4 - i}`,
          value: blockRevenue,
        });
      }

      const maxValue = Math.max(...blocks.map(p => p.value), 0);
      return { points: blocks, maxValue };
    } 
    else {
      // Last 6 months
      const months: { label: string; dateStr: string; value: number }[] = [];
      for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const m = d.getMonth() + 1;
        const y = d.getFullYear();

        const monthRevenue = orders
          .filter((o: any) => {
            if (o.orderStatus === 'CANCELLED') return false;
            const oDate = new Date(o.orderedAt || o.createdAt || 0);
            return oDate.getMonth() + 1 === m && oDate.getFullYear() === y;
          })
          .reduce((sum: number, o: any) => sum + (o.totalPrice || 0), 0);

        months.push({
          label: `Tháng ${m}/${y}`,
          dateStr: `Tháng ${m}`,
          value: monthRevenue,
        });
      }

      const maxValue = Math.max(...months.map(p => p.value), 0);
      return { points: months, maxValue };
    }
  }, [orders, timeRange]);

  if (loading) {
    return (
      <div className="flex h-[70vh] w-full flex-col items-center justify-center gap-3 font-sans">
        <div className="relative flex items-center justify-center">
          <div className="h-12 w-12 rounded-full border-4 border-rose-500/20 border-t-rose-600 animate-spin" />
          <Icon name="sparkles" size={18} className="absolute text-rose-500" />
        </div>
        <p className="text-xs font-semibold text-slate-500 dark:text-zinc-400">Đang chuẩn bị dữ liệu tổng quan...</p>
      </div>
    );
  }

  const currentDateStr = new Intl.DateTimeFormat('vi-VN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(new Date());

  const getStatusBadge = (status: string) => {
    const s = (status || '').toUpperCase();
    switch (s) {
      case 'DELIVERED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/40">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Đã giao
          </span>
        );
      case 'SHIPPING':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/40">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
            Đang giao
          </span>
        );
      case 'CONFIRMED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800/40">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            Đã xác nhận
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200/60 dark:border-rose-800/40">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            Đã hủy
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200/60 dark:border-amber-800/40">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            Chờ duyệt
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 pb-12 font-sans">
      
      {/* ─────────────────────────────────────────────────────────────────────────────
          1. HEADER BANNER & QUICK ACTIONS
          ───────────────────────────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-rose-500/10 via-rose-500/5 to-purple-500/10 border border-rose-100 dark:border-zinc-800 p-6 md:p-7 backdrop-blur-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative z-10">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Hệ thống hoạt động bình thường
              </span>
              <span className="text-[11px] font-medium text-slate-400 dark:text-zinc-500 capitalize">
                {currentDateStr}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-800 dark:text-white tracking-tight">
              Trung tâm điều hành Haniu
            </h1>
            <p className="text-xs text-slate-500 dark:text-zinc-400 max-w-xl">
              Theo dõi nhịp độ kinh doanh quà tặng, phiên chụp Photobooth Studio và quản trị tài khoản người dùng tập trung.
            </p>
          </div>

          {/* Quick Shortcuts */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <Link
              href="/admin/products/new"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 dark:bg-rose-600 dark:hover:bg-rose-500 active:scale-95 text-white text-xs font-bold transition-all shadow-xs hover:shadow-md hover:shadow-rose-600/20 border border-rose-500/30 cursor-pointer"
            >
              <span className="w-5 h-5 rounded-lg bg-white/20 flex items-center justify-center text-white shrink-0">
                <Icon name="plus" size={13} />
              </span>
              <span>Thêm sản phẩm</span>
            </Link>

            <Link
              href="/admin/photobooth"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white dark:bg-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-700 border border-slate-200/90 dark:border-zinc-700 active:scale-95 text-slate-700 dark:text-zinc-200 hover:text-slate-900 dark:hover:text-white text-xs font-bold transition-all shadow-2xs hover:shadow-xs cursor-pointer"
            >
              <span className="w-5 h-5 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
                <Icon name="camera" size={13} />
              </span>
              <span>Photobooth</span>
            </Link>

            <Link
              href="/admin/users"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white dark:bg-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-700 border border-slate-200/90 dark:border-zinc-700 active:scale-95 text-slate-700 dark:text-zinc-200 hover:text-slate-900 dark:hover:text-white text-xs font-bold transition-all shadow-2xs hover:shadow-xs cursor-pointer"
            >
              <span className="w-5 h-5 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:purple-400 flex items-center justify-center shrink-0">
                <Icon name="users" size={13} />
              </span>
              <span>Người dùng</span>
            </Link>

            <Link
              href="/admin/orders"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white dark:bg-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-700 border border-slate-200/90 dark:border-zinc-700 active:scale-95 text-slate-700 dark:text-zinc-200 hover:text-slate-900 dark:hover:text-white text-xs font-bold transition-all shadow-2xs hover:shadow-xs cursor-pointer"
            >
              <span className="w-5 h-5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                <Icon name="bag" size={13} />
              </span>
              <span>Đơn hàng</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────────────────────
          2. CORE METRICS GRID (4 HIGHLIGHT CARDS)
          ───────────────────────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1: Total Revenue */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-200/70 dark:border-zinc-800 p-5 rounded-3xl shadow-xs hover:shadow-md transition-all group relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">
              Doanh thu ({timeRange === '7d' ? '7 ngày' : timeRange === '30d' ? '30 ngày' : 'Toàn bộ'})
            </span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center transition-transform group-hover:scale-110">
              <Icon name="cart" size={18} />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {formatVND(computedMetrics.totalRevenue)}
            </h3>
            <div className="flex items-center gap-1.5 mt-2 text-[11px]">
              {revenueGrowth !== null ? (
                <span className={`font-bold flex items-center gap-0.5 ${revenueGrowth >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600'}`}>
                  <Icon name={revenueGrowth >= 0 ? 'chevron-up' : 'chevron-down'} size={12} />
                  {revenueGrowth >= 0 ? `+${revenueGrowth}%` : `${revenueGrowth}%`}
                  <span className="text-slate-400 dark:text-zinc-500 font-normal ml-1">so với kỳ trước</span>
                </span>
              ) : (
                <span className="text-slate-400 dark:text-zinc-500">
                  {computedMetrics.totalOrders} đơn hàng ghi nhận
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Metric 2: Total Orders */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-200/70 dark:border-zinc-800 p-5 rounded-3xl shadow-xs hover:shadow-md transition-all group relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">
              Đơn hàng
            </span>
            <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center transition-transform group-hover:scale-110">
              <Icon name="bag" size={18} />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {computedMetrics.totalOrders} <span className="text-sm font-semibold text-slate-400">đơn</span>
            </h3>
            <div className="flex items-center gap-1.5 mt-2 text-[11px]">
              {computedMetrics.totalOrders > 0 ? (
                <>
                  <span className="font-bold text-blue-600 dark:text-blue-400">
                    {computedMetrics.completedRate}% hoàn tất
                  </span>
                  <span className="text-slate-400 dark:text-zinc-500">({computedMetrics.completedOrders} đơn giao xong)</span>
                </>
              ) : (
                <span className="text-slate-400 dark:text-zinc-500">Chưa có đơn hàng mới</span>
              )}
            </div>
          </div>
        </div>

        {/* Metric 3: Total Customers */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-200/70 dark:border-zinc-800 p-5 rounded-3xl shadow-xs hover:shadow-md transition-all group relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">
              Khách hàng
            </span>
            <div className="w-10 h-10 rounded-2xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center transition-transform group-hover:scale-110">
              <Icon name="users" size={18} />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {computedMetrics.totalCustomers} <span className="text-sm font-semibold text-slate-400">tài khoản</span>
            </h3>
            <div className="flex items-center gap-1.5 mt-2 text-[11px]">
              <span className="font-bold text-purple-600 dark:text-purple-400">
                +{userStats?.newUsersThisMonth ?? 0} mới
              </span>
              <span className="text-slate-400 dark:text-zinc-500">trong tháng này</span>
            </div>
          </div>
        </div>

        {/* Metric 4: Products & Photobooth Studio */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-200/70 dark:border-zinc-800 p-5 rounded-3xl shadow-xs hover:shadow-md transition-all group relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">
              Sản phẩm & Studio
            </span>
            <div className="w-10 h-10 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center transition-transform group-hover:scale-110">
              <Icon name="gift" size={18} />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {computedMetrics.totalProducts} <span className="text-sm font-semibold text-slate-400">sản phẩm</span>
            </h3>
            <div className="flex items-center gap-1.5 mt-2 text-[11px]">
              {computedMetrics.lowStock.length > 0 ? (
                <span className="font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                  <Icon name="alert" size={12} />
                  {computedMetrics.lowStock.length} sản phẩm sắp hết
                </span>
              ) : (
                <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <Icon name="check" size={12} />
                  Tồn kho đủ định mức
                </span>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* ─────────────────────────────────────────────────────────────────────────────
          3. REVENUE TREND CHART & ORDER PIPELINE
          ───────────────────────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Revenue Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-zinc-900 border border-slate-200/70 dark:border-zinc-800 p-6 rounded-3xl shadow-xs flex flex-col justify-between overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-zinc-800/80">
            <div>
              <h3 className="text-sm font-black uppercase text-slate-800 dark:text-zinc-100 tracking-wide flex items-center gap-2">
                <Icon name="sliders" size={15} className="text-rose-500" />
                <span>Biểu đồ doanh thu thực tế</span>
              </h3>
              <p className="text-[11px] text-slate-400 dark:text-zinc-500 mt-0.5">
                Dữ liệu phát sinh từ các đơn đặt hàng online theo mốc thời gian
              </p>
            </div>

            {/* Time Filter Segmented Control */}
            <div className="flex items-center bg-slate-100 dark:bg-zinc-800 p-1 rounded-xl gap-1 shrink-0">
              {[
                { id: '7d', label: '7 ngày qua' },
                { id: '30d', label: '30 ngày' },
                { id: 'all', label: 'Toàn thời gian' }
              ].map(tab => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setTimeRange(tab.id as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    timeRange === tab.id
                      ? 'bg-white dark:bg-zinc-900 text-rose-600 dark:text-rose-400 shadow-2xs'
                      : 'text-slate-500 dark:text-zinc-400 hover:text-slate-800 dark:hover:text-zinc-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* SVG Line / Area Graph with Strict Bounded Container */}
          <div className="relative h-60 w-full pt-4 pb-2 flex flex-col justify-between overflow-hidden">
            
            {/* Tooltip Hover Overlay */}
            {hoveredPoint && (
              <div 
                className="absolute top-2 z-20 bg-slate-900 text-white px-3 py-1.5 rounded-xl text-[11px] font-bold shadow-lg border border-slate-700 pointer-events-none transition-all"
                style={{ left: `${hoveredPoint.percentageX}%`, transform: 'translateX(-50%)' }}
              >
                <div className="text-[9px] text-slate-400 font-normal">{hoveredPoint.label}</div>
                <div className="text-rose-400 font-mono font-black">{formatVND(hoveredPoint.value)}</div>
              </div>
            )}

            {/* SVG Canvas (Strictly contained 500x160 space) */}
            <div className="relative flex-1 w-full overflow-hidden">
              <svg 
                className="w-full h-full block" 
                viewBox="0 0 500 150" 
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient id="dashRevenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgba(244, 63, 94, 0.25)" />
                    <stop offset="100%" stopColor="rgba(244, 63, 94, 0.0)" />
                  </linearGradient>
                </defs>

                {/* Horizontal Guidelines */}
                <line x1="20" y1="20" x2="480" y2="20" stroke="currentColor" className="text-slate-100 dark:text-zinc-800" strokeDasharray="3 3" />
                <line x1="20" y1="60" x2="480" y2="60" stroke="currentColor" className="text-slate-100 dark:text-zinc-800" strokeDasharray="3 3" />
                <line x1="20" y1="100" x2="480" y2="100" stroke="currentColor" className="text-slate-100 dark:text-zinc-800" strokeDasharray="3 3" />
                <line x1="20" y1="135" x2="480" y2="135" stroke="currentColor" className="text-slate-200 dark:text-zinc-800" strokeWidth="1" />

                {/* Path calculation */}
                {(() => {
                  const pts = chartData.points.map((p, i) => {
                    const x = 30 + (i / Math.max(1, chartData.points.length - 1)) * 440;
                    const y = chartData.maxValue > 0 
                      ? 135 - (p.value / chartData.maxValue) * 110 
                      : 135;
                    return { x, y, label: p.label, val: p.value, pctX: (x / 500) * 100 };
                  });

                  if (pts.length === 0) return null;

                  let dStr = `M ${pts[0].x} ${pts[0].y}`;
                  for (let i = 1; i < pts.length; i++) {
                    const prev = pts[i - 1];
                    const cur = pts[i];
                    const cpx1 = prev.x + (cur.x - prev.x) / 2;
                    const cpy1 = prev.y;
                    const cpx2 = prev.x + (cur.x - prev.x) / 2;
                    const cpy2 = cur.y;
                    dStr += ` C ${cpx1} ${cpy1}, ${cpx2} ${cpy2}, ${cur.x} ${cur.y}`;
                  }

                  const areaStr = `${dStr} L ${pts[pts.length - 1].x} 135 L ${pts[0].x} 135 Z`;

                  return (
                    <>
                      {chartData.maxValue > 0 && (
                        <path d={areaStr} fill="url(#dashRevenueGrad)" />
                      )}
                      <path 
                        d={dStr} 
                        fill="none" 
                        stroke="rgb(244, 63, 94)" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        vectorEffect="non-scaling-stroke"
                      />
                      {pts.map((pt, i) => (
                        <g 
                          key={i} 
                          className="cursor-pointer group"
                          onMouseEnter={() => setHoveredPoint({ label: pt.label, value: pt.val, percentageX: pt.pctX })}
                          onMouseLeave={() => setHoveredPoint(null)}
                        >
                          <circle cx={pt.x} cy={pt.y} r="8" fill="transparent" />
                          <circle 
                            cx={pt.x} 
                            cy={pt.y} 
                            r="3.5" 
                            fill={pt.val > 0 ? "white" : "#cbd5e1"} 
                            stroke={pt.val > 0 ? "rgb(244, 63, 94)" : "#94a3b8"} 
                            strokeWidth="2" 
                            vectorEffect="non-scaling-stroke"
                            className="transition-transform group-hover:scale-150"
                          />
                        </g>
                      ))}
                    </>
                  );
                })()}
              </svg>
            </div>

            {/* X-axis Labels */}
            <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 dark:text-zinc-500 px-2 pt-1 border-t border-slate-100 dark:border-zinc-800">
              {chartData.points.map((pt, i) => (
                <span key={i} className="truncate text-center">
                  {pt.dateStr}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Order Status Pipeline */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-200/70 dark:border-zinc-800 p-6 rounded-3xl shadow-xs flex flex-col justify-between">
          <div className="pb-4 border-b border-slate-100 dark:border-zinc-800/80">
            <h3 className="text-sm font-black uppercase text-slate-800 dark:text-zinc-100 tracking-wide flex items-center gap-2">
              <Icon name="list" size={15} className="text-blue-500" />
              <span>Tiến độ xử lý đơn hàng</span>
            </h3>
            <p className="text-[11px] text-slate-400 dark:text-zinc-500 mt-0.5">
              Phân bổ {computedMetrics.totalOrders} đơn theo từng giai đoạn
            </p>
          </div>

          <div className="space-y-4 py-4 my-auto">
            {/* Pending */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-amber-500 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-xs" />
                  Chờ duyệt & chuẩn bị
                </span>
                <span className="font-mono text-slate-700 dark:text-zinc-200">{computedMetrics.statusCounts.pending} đơn</span>
              </div>
              <div className="h-2 w-full bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-amber-500 rounded-full transition-all duration-500"
                  style={{ width: `${computedMetrics.totalOrders > 0 ? (computedMetrics.statusCounts.pending / computedMetrics.totalOrders) * 100 : 0}%` }}
                />
              </div>
            </div>

            {/* Confirmed */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-blue-500 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-xs" />
                  Đã xác nhận thanh toán
                </span>
                <span className="font-mono text-slate-700 dark:text-zinc-200">{computedMetrics.statusCounts.confirmed} đơn</span>
              </div>
              <div className="h-2 w-full bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 rounded-full transition-all duration-500"
                  style={{ width: `${computedMetrics.totalOrders > 0 ? (computedMetrics.statusCounts.confirmed / computedMetrics.totalOrders) * 100 : 0}%` }}
                />
              </div>
            </div>

            {/* Shipping */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-indigo-500 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 shadow-xs" />
                  Đang giao đến khách
                </span>
                <span className="font-mono text-slate-700 dark:text-zinc-200">{computedMetrics.statusCounts.shipping} đơn</span>
              </div>
              <div className="h-2 w-full bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                  style={{ width: `${computedMetrics.totalOrders > 0 ? (computedMetrics.statusCounts.shipping / computedMetrics.totalOrders) * 100 : 0}%` }}
                />
              </div>
            </div>

            {/* Delivered */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-emerald-500 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-xs" />
                  Hoàn tất thành công
                </span>
                <span className="font-mono text-slate-700 dark:text-zinc-200">{computedMetrics.statusCounts.delivered} đơn</span>
              </div>
              <div className="h-2 w-full bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${computedMetrics.totalOrders > 0 ? (computedMetrics.statusCounts.delivered / computedMetrics.totalOrders) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>

          <Link
            href="/admin/orders"
            className="w-full py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-800 text-slate-600 dark:text-zinc-300 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <span>Quản lý danh sách đơn hàng</span>
            <Icon name="arrow-right" size={13} />
          </Link>
        </div>

      </div>

      {/* ─────────────────────────────────────────────────────────────────────────────
          4. RECENT ORDERS & INVENTORY / SYSTEM SHORTCUTS
          ───────────────────────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Recent Orders Table */}
        <div className="lg:col-span-2 bg-white dark:bg-zinc-900 border border-slate-200/70 dark:border-zinc-800 p-6 rounded-3xl shadow-xs">
          <div className="flex items-center justify-between pb-4 mb-3 border-b border-slate-100 dark:border-zinc-800/80">
            <div>
              <h3 className="text-sm font-black uppercase text-slate-800 dark:text-zinc-100 tracking-wide flex items-center gap-2">
                <Icon name="bag" size={15} className="text-rose-500" />
                <span>Đơn hàng mới nhất</span>
              </h3>
              <p className="text-[11px] text-slate-400 dark:text-zinc-500 mt-0.5">
                Các đơn quà tặng vừa phát sinh trên hệ thống
              </p>
            </div>
            <Link
              href="/admin/orders"
              className="text-xs font-bold text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1"
            >
              <span>Xem tất cả ({computedMetrics.allOrdersCount})</span>
              <Icon name="arrow-right" size={12} />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="text-[11px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider border-b border-slate-100 dark:border-zinc-800">
                  <th className="pb-3 font-bold">Mã đơn</th>
                  <th className="pb-3 font-bold">Khách hàng</th>
                  <th className="pb-3 font-bold text-right">Tổng tiền</th>
                  <th className="pb-3 font-bold text-center">Thanh toán</th>
                  <th className="pb-3 font-bold text-right">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/70 dark:divide-zinc-800/60">
                {computedMetrics.recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-10 text-center text-slate-400 dark:text-zinc-500">
                      <Icon name="bag" size={28} className="mx-auto text-slate-300 dark:text-zinc-600 mb-2" />
                      <span>Chưa có đơn hàng nào được tạo.</span>
                    </td>
                  </tr>
                ) : (
                  computedMetrics.recentOrders.map((order: any) => (
                    <tr key={order.id} className="hover:bg-slate-50/70 dark:hover:bg-zinc-800/60 transition-colors">
                      <td className="py-3.5 font-bold font-mono text-slate-800 dark:text-zinc-200">
                        <Link href="/admin/orders" className="hover:text-rose-600 transition-colors">
                          {order.orderCode}
                        </Link>
                      </td>
                      <td className="py-3.5">
                        <p className="font-bold text-slate-800 dark:text-zinc-200">{order.customerName || 'Khách hàng'}</p>
                        <p className="text-[10px] text-slate-400 dark:text-zinc-500">{order.customerPhone || order.customerEmail || 'N/A'}</p>
                      </td>
                      <td className="py-3.5 font-bold font-mono text-right text-slate-800 dark:text-zinc-200">
                        {formatVND(order.totalPrice)}
                      </td>
                      <td className="py-3.5 text-center">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          order.paymentStatus === 'PAID'
                            ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400'
                            : 'bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400'
                        }`}>
                          {order.paymentStatus === 'PAID' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                        </span>
                      </td>
                      <td className="py-3.5 text-right">
                        {getStatusBadge(order.orderStatus)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right 1 Col: Inventory Watch & Photobooth Studio Stats */}
        <div className="space-y-6">
          
          {/* Inventory Alerts Card */}
          <div className="bg-white dark:bg-zinc-900 border border-slate-200/70 dark:border-zinc-800 p-6 rounded-3xl shadow-xs">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 dark:border-zinc-800/80">
              <h3 className="text-sm font-black uppercase text-slate-800 dark:text-zinc-100 tracking-wide flex items-center gap-2">
                <Icon name="alert" size={15} className="text-amber-500" />
                <span>Cảnh báo tồn kho</span>
              </h3>
              <Link
                href="/admin/products"
                className="text-xs font-bold text-rose-600 dark:text-rose-400 hover:underline"
              >
                Xem kho
              </Link>
            </div>

            <div className="space-y-2.5">
              {computedMetrics.lowStockTop.length === 0 ? (
                <div className="py-6 text-center text-xs text-slate-400 dark:text-zinc-500 flex flex-col items-center gap-1.5">
                  <Icon name="check" size={24} className="text-emerald-500" />
                  <span>Tất cả sản phẩm đều đủ số lượng tồn kho.</span>
                </div>
              ) : (
                computedMetrics.lowStockTop.map((item: any) => (
                  <div 
                    key={item.id} 
                    className="p-3 bg-slate-50 dark:bg-zinc-800/60 rounded-2xl flex items-center justify-between border border-slate-100 dark:border-zinc-800"
                  >
                    <div className="min-w-0 flex-1 pr-2">
                      <p className="font-bold text-xs truncate text-slate-800 dark:text-zinc-200">{item.name}</p>
                      <p className="text-[10px] text-slate-400 dark:text-zinc-500 mt-0.5">SKU: {item.sku || 'N/A'}</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-xl text-[10px] font-bold bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200/60 dark:border-rose-900/40 shrink-0">
                      Còn {item.stock} cái
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Modules Portal */}
          <div className="bg-gradient-to-br from-slate-900 to-zinc-900 dark:from-zinc-900 dark:to-zinc-950 p-6 rounded-3xl text-white shadow-md border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-rose-400">
                Photobooth Studio
              </span>
              <Icon name="camera" size={16} className="text-rose-400" />
            </div>
            <div>
              <h4 className="text-base font-bold">Thiết kế & Sự kiện Photobooth</h4>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Tạo khung in template chuẩn Hàn Quốc, tải ảnh sticker trong suốt và kiểm tra phiên chụp.
              </p>
            </div>
            <Link
              href="/admin/photobooth"
              className="inline-flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 active:scale-98 text-white font-bold text-xs transition-all shadow-sm shadow-rose-600/30 cursor-pointer"
            >
              <span>Mở Canva Photobooth</span>
              <Icon name="arrow-right" size={14} />
            </Link>
          </div>

        </div>

      </div>

    </div>
  );
}
