'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useOrderStore, Order } from '@/store/order';
import { OrdersKPICards } from './components/OrdersKPICards';
import { OrdersTabsHeader } from './components/OrdersTabsHeader';
import { OrdersFilterToolbar } from './components/OrdersFilterToolbar';
import { OrdersTable } from './components/OrdersTable';
import { OrderDetailInspector } from './components/OrderDetailInspector';
import { OrdersBottomBar } from './components/OrdersBottomBar';

function formatVND(amount: number | undefined | null) {
  if (typeof amount !== 'number' || isNaN(amount)) return '0 ₫';
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(dateStr: string | undefined | null) {
  if (!dateStr) return 'N/A';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return new Intl.DateTimeFormat('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(d);
  } catch {
    return dateStr;
  }
}

export default function AdminOrdersPage() {
  const { orders, loading, fetchAllOrders, updateOrderStatus, updatePaymentStatus } = useOrderStore();
  
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [filterPayment, setFilterPayment] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortBy, setSortBy] = useState<'NEWEST' | 'OLDEST' | 'PRICE_DESC' | 'PRICE_ASC'>('NEWEST');
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  const loadOrders = async () => {
    await fetchAllOrders();
  };

  useEffect(() => {
    loadOrders();
  }, []);

  // Sync selected order
  useEffect(() => {
    if (orders.length > 0 && !selectedOrder) {
      setSelectedOrder(orders[0]);
    } else if (selectedOrder) {
      const refreshed = orders.find(o => o.id === selectedOrder.id);
      if (refreshed) setSelectedOrder(refreshed);
    }
  }, [orders]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      setIsUpdating(true);
      await updateOrderStatus(orderId, newStatus);
    } catch (err: any) {
      alert(err.message || 'Cập nhật trạng thái thất bại');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdatePayment = async (orderId: string, newPaymentStatus: string) => {
    try {
      setIsUpdating(true);
      await updatePaymentStatus(orderId, newPaymentStatus);
    } catch (err: any) {
      alert(err.message || 'Cập nhật thanh toán thất bại');
    } finally {
      setIsUpdating(false);
    }
  };

  // Metrics Calculation
  const metrics = useMemo(() => {
    const totalOrders = orders.length;
    const pendingCount = orders.filter(o => o.orderStatus === 'PENDING').length;
    const processingCount = orders.filter(o => o.orderStatus === 'CONFIRMED' || o.orderStatus === 'SHIPPING').length;
    const deliveredCount = orders.filter(o => o.orderStatus === 'DELIVERED').length;
    const totalRevenue = orders
      .filter(o => o.paymentStatus === 'PAID' || o.orderStatus === 'DELIVERED')
      .reduce((acc, o) => acc + (o.totalPrice || 0), 0);

    return { totalOrders, pendingCount, processingCount, deliveredCount, totalRevenue };
  }, [orders]);

  // Tab Status Counts
  const statusCounts = useMemo(() => {
    return {
      ALL: orders.length,
      PENDING: orders.filter(o => o.orderStatus === 'PENDING').length,
      CONFIRMED: orders.filter(o => o.orderStatus === 'CONFIRMED').length,
      SHIPPING: orders.filter(o => o.orderStatus === 'SHIPPING').length,
      DELIVERED: orders.filter(o => o.orderStatus === 'DELIVERED').length,
      CANCELLED: orders.filter(o => o.orderStatus === 'CANCELLED').length,
    };
  }, [orders]);

  // Filtered & Sorted Orders
  const filteredOrders = useMemo(() => {
    return orders
      .filter((o) => {
        const matchesStatus = filterStatus === 'ALL' || o.orderStatus === filterStatus;
        const matchesPayment = filterPayment === 'ALL' || o.paymentStatus === filterPayment;
        const q = searchTerm.toLowerCase().trim();
        const matchesSearch = !q || 
          o.orderCode?.toLowerCase().includes(q) ||
          o.customerName?.toLowerCase().includes(q) ||
          o.customerPhone?.toLowerCase().includes(q) ||
          o.customerEmail?.toLowerCase().includes(q);

        return matchesStatus && matchesPayment && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'NEWEST') return new Date(b.orderedAt || 0).getTime() - new Date(a.orderedAt || 0).getTime();
        if (sortBy === 'OLDEST') return new Date(a.orderedAt || 0).getTime() - new Date(b.orderedAt || 0).getTime();
        if (sortBy === 'PRICE_DESC') return (b.totalPrice || 0) - (a.totalPrice || 0);
        if (sortBy === 'PRICE_ASC') return (a.totalPrice || 0) - (b.totalPrice || 0);
        return 0;
      });
  }, [orders, filterStatus, filterPayment, searchTerm, sortBy]);

  return (
    <div className="space-y-6 max-w-full pb-10">
      
      {/* 1. Header Page Title & KPI Cards */}
      <div className="space-y-4">
        <div>
          <h1 className="text-xl font-black text-slate-900 dark:text-zinc-100 uppercase tracking-tight">
            Quản Lý Đơn Hàng (Orders)
          </h1>
          <p className="text-xs text-slate-500 dark:text-zinc-400 font-medium mt-0.5">
            Theo dõi tình trạng đơn đặt hàng, kiểm tra yêu cầu in photobooth, khắc laser và cập nhật vận chuyển.
          </p>
        </div>

        <OrdersKPICards metrics={metrics} formatVND={formatVND} />
      </div>

      {/* 2. Status Tabs */}
      <OrdersTabsHeader
        filterStatus={filterStatus}
        onSelectStatus={setFilterStatus}
        statusCounts={statusCounts}
      />

      {/* 3. Filter & Search Toolbar */}
      <OrdersFilterToolbar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filterPayment={filterPayment}
        onPaymentChange={setFilterPayment}
        sortBy={sortBy}
        onSortChange={setSortBy}
        loading={loading}
        onRefresh={loadOrders}
      />

      {/* 4. Main 2-Column Split: Table (Main Content) + Inspector (Right Sidebar) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: Orders Table (Col 12 on mobile, Col 7 on desktop) */}
        <div className="lg:col-span-7 space-y-4">
          <OrdersTable
            orders={filteredOrders}
            selectedOrder={selectedOrder}
            onSelectOrder={setSelectedOrder}
            formatVND={formatVND}
            formatDate={formatDate}
            loading={loading}
          />

          <OrdersBottomBar
            totalCount={orders.length}
            filteredCount={filteredOrders.length}
            onRefresh={loadOrders}
            loading={loading}
          />
        </div>

        {/* Right: Order Detail Inspector (Col 12 on mobile, Col 5 on desktop) */}
        <div className="lg:col-span-5 sticky top-4">
          <OrderDetailInspector
            order={selectedOrder}
            onClose={() => setSelectedOrder(null)}
            onUpdateStatus={handleUpdateStatus}
            onUpdatePayment={handleUpdatePayment}
            isUpdating={isUpdating}
            formatVND={formatVND}
            formatDate={formatDate}
            onCopyCode={copyToClipboard}
            copiedCode={copiedCode}
          />
        </div>

      </div>

    </div>
  );
}
