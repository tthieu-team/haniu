'use client';

import Link from 'next/link';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    sku: string;
    price?: number;
    basePrice?: number;
    salePrice?: number;
    isFeatured: boolean;
    isNew: boolean;
    isCustomizable: boolean;
    category?: { name: string };
    media?: Array<{ url: string; isThumbnail: boolean }>;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const thumbnail = product.media?.find(m => m.isThumbnail)?.url || product.media?.[0]?.url || 'https://via.placeholder.com/300';
  const priceVal = product.salePrice || product.basePrice || product.price || 0;
  const originalPriceVal = product.salePrice ? (product.basePrice || product.price) : undefined;

  return (
    <div className="group bg-white dark:bg-zinc-900 rounded-2xl border border-slate-100 dark:border-zinc-800 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col overflow-hidden relative">
      {/* Badges */}
      <div className="absolute left-3 top-3 z-10 flex flex-col gap-1.5">
        {product.isFeatured && (
          <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm">NỔI BẬT</span>
        )}
        {product.isNew && (
          <span className="bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm">MỚI</span>
        )}
        {product.isCustomizable && (
          <span className="bg-cyan-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm">⚙️ CÁ NHÂN HÓA</span>
        )}
      </div>

      {/* Product Thumbnail */}
      <Link href={`/products/${product.slug}`} className="block overflow-hidden relative aspect-square bg-slate-50 dark:bg-zinc-950">
        <img
          src={thumbnail}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </Link>

      {/* Content details */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-4 text-xs">
        <div className="space-y-1">
          {product.category && (
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-500">
              {product.category.name}
            </span>
          )}
          <Link href={`/products/${product.slug}`} className="block">
            <h3 className="font-semibold text-sm line-clamp-2 text-slate-800 hover:text-rose-500 transition-colors dark:text-zinc-100 dark:hover:text-rose-400">
              {product.name}
            </h3>
          </Link>
        </div>

        <div className="flex items-baseline justify-between pt-2 border-t border-slate-50 dark:border-zinc-800">
          <div className="flex items-baseline gap-2">
            <span className="font-bold text-rose-500 text-sm">
              {priceVal.toLocaleString('vi-VN')}đ
            </span>
            {originalPriceVal && (
              <span className="text-[10px] text-slate-400 line-through">
                {originalPriceVal.toLocaleString('vi-VN')}đ
              </span>
            )}
          </div>
          <Link href={`/products/${product.slug}`} className="text-[10px] font-semibold bg-rose-50 hover:bg-rose-100 text-rose-600 dark:bg-rose-950/20 dark:text-rose-400 px-3 py-1.5 rounded-xl transition-all">
            Xem quà
          </Link>
        </div>
      </div>
    </div>
  );
}
