'use client';

import { useState, useEffect } from 'react';
import { useCouponStore } from '@/store/coupon';
import { CouponPayload } from '@/services/coupon.service';
import Link from 'next/link';

export default function AdminCouponsPage() {
  const { coupons, loading, fetchCoupons, createCoupon, updateCoupon, deleteCoupon } = useCouponStore();
  const [isEditing, setIsEditing] = useState(false);
  const [currentCoupon, setCurrentCoupon] = useState<CouponPayload>({
    code: '',
    name: '',
    description: '',
    discountType: 'PERCENT',
    discountValue: 0,
    minOrderValue: 0,
    maxDiscount: 0,
    usageLimit: 100,
    active: true
  });

  const loadCoupons = async () => {
    await fetchCoupons();
  };

  useEffect(() => {
    loadCoupons();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (currentCoupon.id) {
        await updateCoupon(currentCoupon.id, currentCoupon);
        alert('Cập nhật coupon thành công!');
      } else {
        await createCoupon(currentCoupon);
        alert('Tạo coupon mới thành công!');
      }
      setIsEditing(false);
      loadCoupons();
    } catch (err: any) {
      alert(err.message || 'Lỗi khi lưu Coupon!');
    }
  };

  const handleEdit = (coupon: CouponPayload) => {
    setCurrentCoupon(coupon);
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa coupon này?')) return;
    try {
      await deleteCoupon(id);
      loadCoupons();
    } catch (err: any) {
      alert(err.message || 'Lỗi khi xóa Coupon!');
    }
  };

  const handleCreateNew = () => {
    setCurrentCoupon({
      code: '',
      name: '',
      description: '',
      discountType: 'PERCENT',
      discountValue: 0,
      minOrderValue: 0,
      maxDiscount: 0,
      usageLimit: 100,
      active: true
    });
    setIsEditing(true);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Quản lý Mã giảm giá (Coupons)</h1>
          <p className="text-xs text-slate-400">Tạo mới, chỉnh sửa và cấu hình điều kiện áp dụng Coupon</p>
        </div>
        <button
          onClick={handleCreateNew}
          className="px-4 py-2 text-xs font-semibold rounded-xl bg-rose-500 hover:bg-rose-600 text-white shadow-md shadow-rose-500/10 transition-all"
        >
          + Tạo Coupon Mới
        </button>
      </div>

      {isEditing && (
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-slate-100 dark:border-zinc-800 space-y-6">
          <h3 className="font-bold text-slate-800 dark:text-white text-base">
            {currentCoupon.id ? 'Cập nhật Coupon' : 'Tạo Coupon mới'}
          </h3>
          <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-slate-400 block mb-1">Mã Code (Ví dụ: HANIU50)</label>
              <input
                type="text"
                required
                value={currentCoupon.code}
                onChange={e => setCurrentCoupon({ ...currentCoupon, code: e.target.value.toUpperCase() })}
                className="w-full text-xs bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg p-2.5 text-slate-700 dark:text-white"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">Tên chương trình</label>
              <input
                type="text"
                required
                value={currentCoupon.name}
                onChange={e => setCurrentCoupon({ ...currentCoupon, name: e.target.value })}
                className="w-full text-xs bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg p-2.5 text-slate-700 dark:text-white"
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-xs text-slate-400 block mb-1">Mô tả chi tiết</label>
              <textarea
                value={currentCoupon.description}
                onChange={e => setCurrentCoupon({ ...currentCoupon, description: e.target.value })}
                className="w-full text-xs bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg p-2.5 text-slate-700 dark:text-white h-20"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">Loại giảm giá</label>
              <select
                value={currentCoupon.discountType}
                onChange={e => setCurrentCoupon({ ...currentCoupon, discountType: e.target.value })}
                className="w-full text-xs bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg p-2.5 text-slate-700 dark:text-white"
              >
                <option value="PERCENT">Phần trăm (%)</option>
                <option value="FIXED">Giá trị cố định (đ)</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">Giá trị giảm giá</label>
              <input
                type="number"
                required
                value={currentCoupon.discountValue}
                onChange={e => setCurrentCoupon({ ...currentCoupon, discountValue: Number(e.target.value) })}
                className="w-full text-xs bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg p-2.5 text-slate-700 dark:text-white"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">Giá trị đơn tối thiểu (đ)</label>
              <input
                type="number"
                value={currentCoupon.minOrderValue}
                onChange={e => setCurrentCoupon({ ...currentCoupon, minOrderValue: Number(e.target.value) })}
                className="w-full text-xs bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg p-2.5 text-slate-700 dark:text-white"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">Giảm tối đa (đ - Chỉ cho loại phần trăm)</label>
              <input
                type="number"
                value={currentCoupon.maxDiscount || 0}
                onChange={e => setCurrentCoupon({ ...currentCoupon, maxDiscount: Number(e.target.value) })}
                className="w-full text-xs bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg p-2.5 text-slate-700 dark:text-white"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">Giới hạn số lần dùng</label>
              <input
                type="number"
                value={currentCoupon.usageLimit || 100}
                onChange={e => setCurrentCoupon({ ...currentCoupon, usageLimit: Number(e.target.value) })}
                className="w-full text-xs bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg p-2.5 text-slate-700 dark:text-white"
              />
            </div>
            <div className="flex items-center gap-2 pt-6">
              <input
                type="checkbox"
                id="active"
                checked={currentCoupon.active}
                onChange={e => setCurrentCoupon({ ...currentCoupon, active: e.target.checked })}
                className="rounded border-slate-300 text-rose-500 focus:ring-rose-500"
              />
              <label htmlFor="active" className="text-xs text-slate-700 dark:text-zinc-300 font-semibold">
                Kích hoạt hoạt động
              </label>
            </div>
            <div className="md:col-span-2 flex justify-end gap-2 pt-4">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-rose-500 hover:bg-rose-600 text-white"
              >
                Lưu lại
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Coupons Table */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-slate-100 dark:border-zinc-800 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-400">Đang tải danh sách coupon...</div>
        ) : coupons.length === 0 ? (
          <div className="p-8 text-center text-slate-400">Chưa có mã giảm giá nào.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 dark:bg-zinc-800 border-b border-slate-100 dark:border-zinc-800 text-slate-500 font-bold">
                  <th className="p-4">Mã Code</th>
                  <th className="p-4">Tên chương trình</th>
                  <th className="p-4">Loại giảm</th>
                  <th className="p-4">Giá trị giảm</th>
                  <th className="p-4">Đơn tối thiểu</th>
                  <th className="p-4">Giới hạn sử dụng</th>
                  <th className="p-4">Trạng thái</th>
                  <th className="p-4 text-center">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {coupons.map(coupon => (
                  <tr key={coupon.id} className="border-b border-slate-50 dark:border-zinc-800 hover:bg-slate-50/50 dark:hover:bg-zinc-800/30">
                    <td className="p-4 font-mono font-bold text-slate-800 dark:text-white">{coupon.code}</td>
                    <td className="p-4 font-bold text-slate-700 dark:text-zinc-300">{coupon.name}</td>
                    <td className="p-4">{coupon.discountType === 'PERCENT' ? 'Phần trăm' : 'Cố định'}</td>
                    <td className="p-4 font-bold text-rose-500">
                      {coupon.discountType === 'PERCENT'
                        ? `${coupon.discountValue}%`
                        : `${coupon.discountValue.toLocaleString()}đ`}
                    </td>
                    <td className="p-4">{(coupon.minOrderValue || 0).toLocaleString()}đ</td>
                    <td className="p-4">{coupon.usageLimit || 'Không giới hạn'}</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        coupon.active ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {coupon.active ? 'Đang chạy' : 'Tạm dừng'}
                      </span>
                    </td>
                    <td className="p-4 text-center space-x-2">
                      <button
                        onClick={() => handleEdit(coupon)}
                        className="px-2.5 py-1 bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 rounded font-semibold hover:bg-slate-200"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDelete(coupon.id!)}
                        className="px-2.5 py-1 bg-red-50 text-red-600 rounded font-semibold hover:bg-red-100"
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
