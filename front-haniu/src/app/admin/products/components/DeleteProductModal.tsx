'use client';

import React from 'react';
import { Product } from '@/store/product';
import Icon from '@/components/common/Icons';

interface DeleteProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  isDeleting: boolean;
}

export const DeleteProductModal: React.FC<DeleteProductModalProps> = ({
  product,
  isOpen,
  onClose,
  onConfirm,
  isDeleting
}) => {
  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-6 max-w-sm w-full shadow-2xl space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto">
          <Icon name="trash" size={20} />
        </div>

        <div className="text-center space-y-1">
          <h3 className="text-sm font-black text-slate-800 dark:text-zinc-100 uppercase">
            Xác nhận xóa sản phẩm
          </h3>
          <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
            Bạn có chắc chắn muốn xóa sản phẩm <span className="font-bold text-slate-800 dark:text-zinc-200">"{product.name}"</span> không? Hành động này không thể hoàn tác.
          </p>
        </div>

        <div className="flex items-center gap-2 pt-2">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 font-bold text-xs transition-colors cursor-pointer"
          >
            Hủy bỏ
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
          >
            {isDeleting && <span className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />}
            <span>{isDeleting ? 'Đang xóa...' : 'Xóa vĩnh viễn'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
