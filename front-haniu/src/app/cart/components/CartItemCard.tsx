'use client';

import React from 'react';
import Link from 'next/link';
import Icon from '@/components/common/Icons';
import { CartItem } from '@/store/cart';
import CustomizationInfo from './CustomizationInfo';

interface CartItemCardProps {
  item: CartItem;
  loading: boolean;
  updatingItemId: string | null;
  onUpdateQty: (itemId: string, newQty: number) => void;
  onRemoveItem: (itemId: string) => void;
}

export default function CartItemCard({
  item,
  loading,
  updatingItemId,
  onUpdateQty,
  onRemoveItem
}: CartItemCardProps) {
  const isOutOfStock = item.stock !== undefined && item.stock <= 0;
  const isLowStock = item.stock !== undefined && item.stock > 0 && item.stock < 5;
  const isQtyExceeded = item.stock !== undefined && item.quantity > item.stock;
  const discountPercent = item.originalPrice && item.originalPrice > item.unitPrice
    ? Math.round((1 - item.unitPrice / item.originalPrice) * 100)
    : 0;

  const isUpdating = updatingItemId === item.id;

  return (
    <div
      className={`bg-white dark:bg-zinc-900 p-5 rounded-2xl border ${
        isQtyExceeded || isOutOfStock ? 'border-red-200 dark:border-red-900/40 bg-red-50/10' : 'border-slate-100 dark:border-zinc-800/80'
      } flex flex-col sm:flex-row gap-5 items-start sm:items-center relative shadow-sm hover:shadow-md transition-all group`}
    >
      {/* Item Thumbnail */}
      <div className="relative w-24 h-24 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-slate-50 dark:bg-zinc-850 shrink-0">
        <img
          src={item.imageUrl || "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=200&q=80"}
          alt={item.productName}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Item Info */}
      <div className="flex-1 space-y-2 min-w-0">
        <div className="space-y-0.5">
          <Link href={`/products/${item.productSlug}`} className="font-bold text-sm text-slate-800 dark:text-zinc-200 hover:text-rose-500 transition-colors line-clamp-1 block">
            {item.productName}
          </Link>
          {item.variantSku && (
            <span className="text-[10px] text-slate-400 font-mono tracking-tight block">SKU: {item.variantSku}</span>
          )}
        </div>

        {/* Variant Badges */}
        <div className="flex flex-wrap gap-1.5">
          {item.color && (
            <span className="inline-flex items-center gap-1.5 bg-slate-50 dark:bg-zinc-800 text-[10px] text-slate-500 dark:text-zinc-400 px-2.5 py-0.5 rounded-full border border-slate-100 dark:border-zinc-700/60 font-medium">
              <span className="w-2 h-2 rounded-full border border-slate-250 dark:border-zinc-650" style={{ backgroundColor: item.color }} />
              {item.color}
            </span>
          )}
          {item.size && (
            <span className="inline-flex items-center bg-slate-50 dark:bg-zinc-800 text-[10px] text-slate-500 dark:text-zinc-400 px-2.5 py-0.5 rounded-full border border-slate-100 dark:border-zinc-700/60 font-medium">
              Kích cỡ: {item.size}
            </span>
          )}
          {item.material && (
            <span className="inline-flex items-center bg-slate-50 dark:bg-zinc-800 text-[10px] text-slate-500 dark:text-zinc-400 px-2.5 py-0.5 rounded-full border border-slate-100 dark:border-zinc-700/60 font-medium">
              Chất liệu: {item.material}
            </span>
          )}
          {!item.color && !item.size && !item.material && item.variantName && (
            <span className="inline-block bg-slate-50 dark:bg-zinc-800 text-[10px] text-slate-500 dark:text-zinc-400 px-2.5 py-0.5 rounded-full border border-slate-100 dark:border-zinc-700/60 font-medium">
              Biến thể: {item.variantName}
            </span>
          )}
        </div>

        {/* Personalization Info */}
        <CustomizationInfo info={item.customizationInfo || ''} />

        {/* Stock Warnings */}
        <div className="flex flex-wrap gap-1.5 mt-1">
          {isOutOfStock && (
            <span className="inline-flex items-center gap-1 bg-red-50 text-red-500 dark:bg-red-950/20 dark:text-red-400 text-[9px] font-bold px-2 py-0.5 rounded">
              <Icon name="close" size={10} /> Hết hàng
            </span>
          )}
          {isQtyExceeded && (
            <span className="inline-flex items-center gap-1 bg-red-50 text-red-650 dark:bg-red-950/20 dark:text-red-400 text-[9px] font-bold px-2 py-0.5 rounded">
              Chỉ còn {item.stock} sản phẩm (Vui lòng giảm số lượng)
            </span>
          )}
          {!isOutOfStock && !isQtyExceeded && isLowStock && (
            <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-600 dark:bg-amber-950/20 dark:text-amber-400 text-[9px] font-bold px-2 py-0.5 rounded">
              Sắp hết hàng (Chỉ còn {item.stock})
            </span>
          )}
          {!isOutOfStock && !isQtyExceeded && !isLowStock && item.stock !== undefined && (
            <span className="inline-flex items-center text-[9px] text-emerald-500 font-semibold">
              ✓ Còn hàng
            </span>
          )}
        </div>
      </div>

      {/* Price and Quantity controls */}
      <div className="flex sm:flex-col items-end justify-between sm:justify-center gap-4 w-full sm:w-auto shrink-0 border-t sm:border-t-0 border-slate-50 dark:border-zinc-800 pt-3 sm:pt-0">
        <div className="text-left sm:text-right space-y-0.5">
          <div className="flex items-center gap-1.5 justify-end">
            <span className="font-extrabold text-sm text-rose-500">{(item.unitPrice).toLocaleString()}đ</span>
            {discountPercent > 0 && (
              <span className="inline-block bg-rose-500/10 text-rose-500 text-[9px] font-bold px-1.5 py-0.5 rounded">
                -{discountPercent}%
              </span>
            )}
          </div>
          {discountPercent > 0 && item.originalPrice && (
            <div className="text-[10px] text-slate-400 line-through">{(item.originalPrice).toLocaleString()}đ</div>
          )}
          <div className="text-[10px] text-slate-400 font-medium">
            Tổng:{' '}
            {item.originalPrice && item.originalPrice > item.unitPrice && (
              <span className="line-through mr-1">{(item.originalPrice * item.quantity).toLocaleString()}đ</span>
            )}
            <strong className="text-slate-600 dark:text-zinc-350 font-bold">{item.totalPrice.toLocaleString()}đ</strong>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Minus */}
          <button
            onClick={() => onUpdateQty(item.id, item.quantity - 1)}
            disabled={isUpdating || loading}
            className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 flex items-center justify-center cursor-pointer transition-colors disabled:opacity-50"
          >
            <Icon name="minus" size={10} />
          </button>
          <span className="w-8 text-center text-xs font-bold text-slate-800 dark:text-zinc-200">{item.quantity}</span>
          {/* Plus */}
          <button
            onClick={() => onUpdateQty(item.id, item.quantity + 1)}
            disabled={isUpdating || loading || (item.stock !== undefined && item.quantity >= item.stock)}
            className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 flex items-center justify-center cursor-pointer transition-colors disabled:opacity-50"
          >
            <Icon name="plus" size={10} />
          </button>
          {/* Delete */}
          <button
            onClick={() => onRemoveItem(item.id)}
            disabled={isUpdating || loading}
            className="w-7 h-7 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center ml-2 cursor-pointer transition-colors disabled:opacity-50"
          >
            <Icon name="close" size={10} />
          </button>
        </div>
      </div>
    </div>
  );
}
