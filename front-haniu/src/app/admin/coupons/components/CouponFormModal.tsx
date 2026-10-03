'use client';

import React, { useState, useEffect } from 'react';
import { CouponPayload } from '@/services/coupon.service';
import Icon from '@/components/common/Icons';

interface CouponFormModalProps {
  isOpen: boolean;
  editingCoupon: CouponPayload | null;
  onClose: () => void;
  onSave: (payload: CouponPayload) => Promise<void>;
}

export const CouponFormModal: React.FC<CouponFormModalProps> = ({
  isOpen,
  editingCoupon,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<CouponPayload>({
    code: '',
    name: '',
    description: '',
    discountType: 'PERCENT',
    discountValue: 0,
    minOrderValue: 0,
    maxDiscount: 0,
    usageLimit: 100,
    active: true,
    showInBanner: false,
  });
  const [submitLoading, setSubmitLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (editingCoupon) {
      setFormData({
        ...editingCoupon,
        showInBanner: editingCoupon.showInBanner || false,
      });
    } else {
      setFormData({
        code: '',
        name: '',
        description: '',
        discountType: 'PERCENT',
        discountValue: 0,
        minOrderValue: 0,
        maxDiscount: 0,
        usageLimit: 100,
        active: true,
        showInBanner: false,
      });
    }
    setErrorMsg('');
  }, [editingCoupon, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.code.trim()) {
      setErrorMsg('Mã code không được để trống.');
      return;
    }
    if (!formData.name.trim()) {
      setErrorMsg('Tên chương trình không được để trống.');
      return;
    }

    try {
      setSubmitLoading(true);
      setErrorMsg('');
      await onSave(formData);
    } catch (err: any) {
      setErrorMsg(err.message || 'Lỗi khi lưu Coupon.');
    } finally {
      setSubmitLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 dark:bg-zinc-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-zinc-900 w-full max-w-xl rounded-3xl border border-slate-100 dark:border-zinc-800 shadow-2xl p-6 relative flex flex-col max-h-[90vh] overflow-y-auto scrollbar-none animate-in fade-in zoom-in-95 duration-200 text-xs font-semibold">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white w-8 h-8 rounded-full bg-slate-50 dark:bg-zinc-800 flex items-center justify-center cursor-pointer"
        >
          <Icon name="close" size={14} />
        </button>

        <h3 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-zinc-800 pb-3 mb-5">
          {editingCoupon?.id ? 'Cập nhật Mã Giảm Giá' : 'Tạo Mã Giảm Giá Mới'}
        </h3>

        {errorMsg && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 rounded-xl font-medium mb-4">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] text-slate-400 block mb-1 uppercase tracking-wider">
              Mã Voucher (Code) *
            </label>
            <input
              type="text"
              required
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
              placeholder="VD: HANIU50, GIAM100K"
              className="w-full text-xs font-mono font-bold bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl p-3 text-slate-700 dark:text-white focus:outline-none focus:ring-1 focus:ring-rose-500"
            />
          </div>

          <div>
            <label className="text-[10px] text-slate-400 block mb-1 uppercase tracking-wider">
              Tên chương trình *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="VD: Giảm 50k đơn đầu tiên"
              className="w-full text-xs bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl p-3 text-slate-700 dark:text-white focus:outline-none focus:ring-1 focus:ring-rose-500"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="text-[10px] text-slate-400 block mb-1 uppercase tracking-wider">
              Mô tả chi tiết
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Nhập điều kiện hoặc đối tượng áp dụng..."
              className="w-full text-xs bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl p-3 text-slate-700 dark:text-white focus:outline-none focus:ring-1 focus:ring-rose-500 h-16 resize-none"
            />
          </div>

          <div>
            <label className="text-[10px] text-slate-400 block mb-1 uppercase tracking-wider">
              Loại giảm giá
            </label>
            <select
              value={formData.discountType}
              onChange={(e) => setFormData({ ...formData, discountType: e.target.value as any })}
              className="w-full text-xs font-bold bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl p-3 text-slate-700 dark:text-white focus:outline-none focus:ring-1 focus:ring-rose-500 cursor-pointer"
            >
              <option value="PERCENT">Phần trăm (%)</option>
              <option value="FIXED">Giá trị cố định (₫)</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] text-slate-400 block mb-1 uppercase tracking-wider">
              Giá trị giảm ({formData.discountType === 'PERCENT' ? '%' : '₫'}) *
            </label>
            <input
              type="number"
              required
              min={0}
              value={formData.discountValue}
              onChange={(e) => setFormData({ ...formData, discountValue: Number(e.target.value) })}
              className="w-full text-xs font-mono font-bold bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl p-3 text-slate-700 dark:text-white focus:outline-none focus:ring-1 focus:ring-rose-500"
            />
          </div>

          <div>
            <label className="text-[10px] text-slate-400 block mb-1 uppercase tracking-wider">
              Đơn hàng tối thiểu (₫)
            </label>
            <input
              type="number"
              min={0}
              value={formData.minOrderValue}
              onChange={(e) => setFormData({ ...formData, minOrderValue: Number(e.target.value) })}
              className="w-full text-xs font-mono bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl p-3 text-slate-700 dark:text-white focus:outline-none focus:ring-1 focus:ring-rose-500"
            />
          </div>

          <div>
            <label className="text-[10px] text-slate-400 block mb-1 uppercase tracking-wider">
              Giảm tối đa (₫ - Chỉ cho %)
            </label>
            <input
              type="number"
              min={0}
              disabled={formData.discountType === 'FIXED'}
              value={formData.maxDiscount || 0}
              onChange={(e) => setFormData({ ...formData, maxDiscount: Number(e.target.value) })}
              className="w-full text-xs font-mono bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl p-3 text-slate-700 dark:text-white focus:outline-none focus:ring-1 focus:ring-rose-500 disabled:opacity-40"
            />
          </div>

          <div>
            <label className="text-[10px] text-slate-400 block mb-1 uppercase tracking-wider">
              Giới hạn số lượt dùng
            </label>
            <input
              type="number"
              min={1}
              value={formData.usageLimit || 100}
              onChange={(e) => setFormData({ ...formData, usageLimit: Number(e.target.value) })}
              className="w-full text-xs font-mono bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl p-3 text-slate-700 dark:text-white focus:outline-none focus:ring-1 focus:ring-rose-500"
            />
          </div>

          <div className="sm:col-span-2 flex flex-col sm:flex-row gap-4 pt-2 border-t border-slate-100 dark:border-zinc-800">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="active"
                checked={formData.active}
                onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                className="rounded border-slate-300 text-rose-500 focus:ring-rose-500 w-4 h-4 cursor-pointer"
              />
              <label htmlFor="active" className="text-xs text-slate-700 dark:text-zinc-300 font-bold cursor-pointer">
                Kích hoạt hoạt động
              </label>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="showInBanner"
                checked={formData.showInBanner || false}
                onChange={(e) => setFormData({ ...formData, showInBanner: e.target.checked })}
                className="rounded border-slate-300 text-rose-500 focus:ring-rose-500 w-4 h-4 cursor-pointer"
              />
              <label htmlFor="showInBanner" className="text-xs text-rose-600 dark:text-rose-400 font-bold cursor-pointer">
                Hiển thị ở Popup / Banner
              </label>
            </div>
          </div>

          {/* Submit buttons */}
          <div className="sm:col-span-2 flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 hover:bg-slate-50 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-300 font-bold cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={submitLoading}
              className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-md shadow-rose-600/20 transition-all cursor-pointer disabled:opacity-50 inline-flex items-center gap-1.5"
            >
              {submitLoading ? (
                <>
                  <span className="animate-spin rounded-full h-3 w-3 border-b-2 border-white" />
                  Đang lưu...
                </>
              ) : (
                <>
                  <Icon name="save" size={12} /> Lưu mã giảm giá
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
