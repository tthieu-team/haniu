'use client';

import React from 'react';
import { Product } from '@/store/product';
import Link from 'next/link';
import Icon from '@/components/common/Icons';

interface ProductDetailInspectorProps {
  product: Product | null;
  onClose?: () => void;
  onRequestDelete: (p: Product) => void;
  formatVND: (amount: number | undefined | null) => string;
}

export const ProductDetailInspector: React.FC<ProductDetailInspectorProps> = ({
  product,
  onClose,
  onRequestDelete,
  formatVND
}) => {
  if (!product) {
    return (
      <div className="bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 rounded-3xl p-8 text-center text-slate-400 dark:text-zinc-500 h-full flex flex-col items-center justify-center space-y-2">
        <Icon name="gift" size={32} className="text-slate-300 dark:text-zinc-600" />
        <p className="text-xs font-bold text-slate-600 dark:text-zinc-400">Chưa chọn sản phẩm</p>
        <p className="text-[11px]">Bấm vào một hàng trong bảng để xem chi tiết.</p>
      </div>
    );
  }

  const thumbnail = product.media?.find(m => m.isThumbnail)?.url || product.media?.[0]?.url || 'https://placehold.co/400x400?text=Gift';

  return (
    <div className="bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 rounded-3xl p-5 shadow-xs flex flex-col gap-4 overflow-y-auto max-h-[calc(100vh-140px)] scrollbar-none">
      
      {/* Header */}
      <div className="flex items-start justify-between pb-3 border-b border-slate-100 dark:border-zinc-800">
        <div>
          <span className="text-[10px] font-black uppercase text-slate-400 dark:text-zinc-500 tracking-wider">
            Chi tiết sản phẩm
          </span>
          <h3 className="text-sm font-black text-slate-900 dark:text-zinc-100 mt-0.5 line-clamp-1">
            {product.name}
          </h3>
          <p className="text-[10px] text-slate-400 dark:text-zinc-500 font-mono mt-0.5">
            SKU: {product.sku || 'N/A'}
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          <Link
            href={`/products/${product.slug}`}
            target="_blank"
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-600 dark:text-zinc-300 transition-colors"
            title="Xem trên Website"
          >
            <Icon name="eye" size={14} />
          </Link>
          <Link
            href={`/admin/products/${product.id}/edit`}
            className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 transition-colors"
            title="Sửa thông tin"
          >
            <Icon name="edit" size={14} />
          </Link>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-400 hover:text-slate-700 cursor-pointer lg:hidden"
            >
              <Icon name="close" size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Image Preview Box */}
      <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-100 dark:bg-zinc-800/80 border border-slate-200/80 dark:border-zinc-700">
        <img src={thumbnail} alt={product.name} className="w-full h-full object-cover" />
        <div className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase backdrop-blur-md bg-black/60 text-white">
          {product.status === 'PUBLISHED' ? 'Đang mở bán' : 'Bản nháp'}
        </div>
      </div>

      {/* Pricing & Stock Specs */}
      <div className="grid grid-cols-2 gap-2.5">
        <div className="bg-slate-50 dark:bg-zinc-800/50 p-3 rounded-xl border border-slate-100 dark:border-zinc-800">
          <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-bold block">Giá niêm yết</span>
          <span className="font-mono font-black text-sm text-rose-600 dark:text-rose-400 mt-0.5 block">
            {formatVND(product.basePrice)}
          </span>
        </div>

        <div className="bg-slate-50 dark:bg-zinc-800/50 p-3 rounded-xl border border-slate-100 dark:border-zinc-800">
          <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-bold block">Tồn kho</span>
          <span className="font-mono font-black text-sm text-slate-800 dark:text-zinc-100 mt-0.5 block">
            {product.stock ?? 0} cái
          </span>
        </div>
      </div>

      {/* Description Snippet */}
      <div className="space-y-1.5 text-xs">
        <span className="text-[10px] font-black uppercase text-slate-400 dark:text-zinc-500 tracking-wider">
          Mô tả ngắn
        </span>
        <p className="text-slate-600 dark:text-zinc-300 leading-relaxed bg-slate-50 dark:bg-zinc-800/30 p-3 rounded-xl border border-slate-100 dark:border-zinc-800/80 line-clamp-3">
          {product.description || 'Chưa có mô tả chi tiết.'}
        </p>
      </div>

      {/* Quick Action Buttons */}
      <div className="pt-2 border-t border-slate-100 dark:border-zinc-800 flex items-center gap-2">
        <Link
          href={`/admin/products/${product.id}/edit`}
          className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
        >
          <Icon name="edit" size={13} />
          <span>Sửa sản phẩm</span>
        </Link>

        <button
          onClick={() => onRequestDelete(product)}
          className="px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 font-bold text-xs transition-colors cursor-pointer"
          title="Xóa sản phẩm"
        >
          <Icon name="trash" size={14} />
        </button>
      </div>

    </div>
  );
};
