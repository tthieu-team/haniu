'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useCouponStore } from '@/store/coupon';
import { CouponPayload } from '@/services/coupon.service';
import { CouponTable } from './components/CouponTable';
import { CouponFormModal } from './components/CouponFormModal';
import {
  AdminPageHeader,
  AdminKPICards,
  AdminFilterTabs,
  AdminSearchToolbar,
  KPICardItem,
  TabItem,
} from '@/app/admin/components/common';
import Icon from '@/components/common/Icons';

export default function AdminCouponsPage() {
  const { coupons, loading, fetchCoupons, createCoupon, updateCoupon, deleteCoupon } = useCouponStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL');

  // Modal and form states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<CouponPayload | null>(null);
  const [successMsg, setSuccessMsg] = useState('');

  const loadCoupons = async () => {
    await fetchCoupons();
  };

  useEffect(() => {
    loadCoupons();
  }, []);

  const handleOpenAddModal = () => {
    setEditingCoupon(null);
    setSuccessMsg('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (coupon: CouponPayload) => {
    setEditingCoupon(coupon);
    setSuccessMsg('');
    setIsModalOpen(true);
  };

  const handleSave = async (payload: CouponPayload) => {
    if (payload.id) {
      await updateCoupon(payload.id, payload);
      setSuccessMsg('Cập nhật mã giảm giá thành công! 🎉');
    } else {
      await createCoupon(payload);
      setSuccessMsg('Tạo mã giảm giá mới thành công! 🎉');
    }
    setTimeout(() => {
      setIsModalOpen(false);
    }, 800);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa mã giảm giá này?')) return;
    try {
      await deleteCoupon(id);
      setSuccessMsg('Xóa coupon thành công! 🎉');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err: any) {
      alert(err.message || 'Lỗi khi xóa Coupon!');
    }
  };

  // Metrics summary
  const metrics = useMemo(() => {
    return {
      total: coupons.length,
      active: coupons.filter((c) => c.active).length,
      inactive: coupons.filter((c) => !c.active).length,
      inBanner: coupons.filter((c) => c.showInBanner).length,
    };
  }, [coupons]);

  // Status Tab Counts
  const statusCounts = useMemo(() => {
    return {
      ALL: coupons.length,
      ACTIVE: coupons.filter((c) => c.active).length,
      INACTIVE: coupons.filter((c) => !c.active).length,
    };
  }, [coupons]);

  // KPI Items
  const kpiItems: KPICardItem[] = useMemo(() => [
    {
      id: 'total',
      label: 'Tổng mã giảm giá',
      value: metrics.total,
      subtext: 'chương trình ưu đãi',
      icon: 'percent',
      variant: 'rose',
    },
    {
      id: 'active',
      label: 'Đang áp dụng',
      value: metrics.active,
      subtext: 'khách hàng có thể nhập',
      icon: 'check',
      variant: 'emerald',
    },
    {
      id: 'inactive',
      label: 'Tạm dừng / Hết hạn',
      value: metrics.inactive,
      subtext: 'ngừng kích hoạt',
      icon: 'alert',
      variant: 'amber',
    },
    {
      id: 'banner',
      label: 'Gắn Popup / Banner',
      value: metrics.inBanner,
      subtext: 'quảng bá nổi bật',
      icon: 'sparkles',
      variant: 'purple',
    },
  ], [metrics]);

  // Status Tab List
  const statusTabs: TabItem[] = useMemo(() => [
    { id: 'ALL', label: 'Tất cả mã giảm giá', count: statusCounts.ALL, activeColor: 'rose' },
    { id: 'ACTIVE', label: 'Đang áp dụng', count: statusCounts.ACTIVE, activeColor: 'emerald' },
    { id: 'INACTIVE', label: 'Tạm dừng', count: statusCounts.INACTIVE, activeColor: 'amber' },
  ], [statusCounts]);

  // Filtered list
  const filteredCoupons = useMemo(() => {
    return coupons.filter((coupon) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        coupon.code.toLowerCase().includes(q) ||
        coupon.name.toLowerCase().includes(q) ||
        (coupon.description && coupon.description.toLowerCase().includes(q));

      const matchesStatus =
        statusFilter === 'ALL' ||
        (statusFilter === 'ACTIVE' && coupon.active) ||
        (statusFilter === 'INACTIVE' && !coupon.active);

      return matchesSearch && matchesStatus;
    });
  }, [coupons, searchQuery, statusFilter]);

  return (
    <div className="flex flex-col h-[calc(100vh-2rem)] sm:h-[calc(100vh-3rem)] max-w-full space-y-3.5 min-h-0">
      {/* 1. Header Title & KPI Cards */}
      <div className="shrink-0 space-y-3">
        <AdminPageHeader
          title="Quản Lý Mã Giảm Giá & Voucher"
          description="Thiết lập các chiến dịch voucher, chiết khấu phần trăm, giá trị cố định và điều kiện áp dụng."
        />

        <AdminKPICards items={kpiItems} columns={4} />
      </div>

      {/* Success Alert */}
      {successMsg && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs rounded-xl font-bold flex items-center gap-2 shrink-0 animate-in fade-in duration-150">
          <Icon name="check" size={15} />
          <span>{successMsg}</span>
        </div>
      )}

      {/* 2. Status Tabs */}
      <div className="shrink-0">
        <AdminFilterTabs
          tabs={statusTabs}
          activeTab={statusFilter}
          onSelectTab={(id) => setStatusFilter(id as any)}
        />
      </div>

      {/* 3. Search & Toolbar */}
      <div className="shrink-0">
        <AdminSearchToolbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Tìm theo mã voucher, tên chương trình, mô tả..."
          loading={loading}
          onRefresh={loadCoupons}
          primaryAction={{
            label: 'Tạo coupon mới',
            onClick: handleOpenAddModal,
            icon: 'plus',
          }}
        />
      </div>

      {/* 4. Table Container (Scroll-only body) */}
      <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
        <CouponTable
          coupons={filteredCoupons}
          loading={loading}
          onEdit={handleOpenEditModal}
          onDelete={handleDelete}
        />
      </div>

      {/* Form Modal */}
      <CouponFormModal
        isOpen={isModalOpen}
        editingCoupon={editingCoupon}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
}
