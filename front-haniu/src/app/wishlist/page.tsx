'use client';

import { useWishlistStore } from '@/store/wishlist';
import ProductCard from '@/components/product/ProductCard';
import Link from 'next/link';
import Icon from '@/components/common/Icons';

export default function WishlistPage() {
  const { items, clearWishlist } = useWishlistStore();

  return (
    <div className="space-y-8 pb-16 font-sans">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 dark:border-zinc-800/80 pb-6">
        <div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-slate-800 dark:text-zinc-100">
            Danh Sách Yêu Thích ❤️
          </h1>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1.5 font-light">
            Lưu giữ những set quà tinh tế bạn yêu thích để dễ dàng tham khảo và lựa chọn sau này.
          </p>
        </div>
        {items.length > 0 && (
          <button
            onClick={clearWishlist}
            className="self-start sm:self-center inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-rose-200/60 dark:border-rose-950/30 text-rose-500 bg-rose-50/50 hover:bg-rose-50 dark:bg-rose-950/10 dark:hover:bg-rose-950/20 text-xs font-bold transition-all duration-300 cursor-pointer active:scale-95 shadow-sm"
          >
            <Icon name="trash" size={14} />
            Xóa tất cả
          </button>
        )}
      </div>

      {/* Product Grid */}
      {items.length === 0 ? (
        <div className="bg-white dark:bg-zinc-900 text-center py-20 px-6 rounded-[32px] border border-slate-200 dark:border-zinc-800/60 space-y-6 shadow-sm max-w-xl mx-auto mt-8">
          <span className="text-rose-350 dark:text-zinc-700 block animate-bounce flex justify-center">
            <Icon name="heart" size={56} className="text-rose-450 fill-rose-100 dark:fill-zinc-800" />
          </span>
          <div className="space-y-2">
            <h3 className="font-extrabold text-lg text-slate-700 dark:text-zinc-300">
              Danh sách yêu thích đang trống
            </h3>
            <p className="text-xs text-slate-450 dark:text-zinc-500 max-w-xs mx-auto font-light leading-relaxed">
              Nhấn vào biểu tượng trái tim trên các sản phẩm quà tặng để lưu chúng vào đây.
            </p>
          </div>
          <Link
            href="/#products"
            className="mt-6 inline-flex bg-slate-900 hover:bg-slate-800 dark:bg-zinc-800 text-white font-bold py-3 px-8 rounded-2xl text-xs transition-all cursor-pointer shadow-sm active:scale-98"
          >
            Khám phá sản phẩm
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {items.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>
      )}
    </div>
  );
}
