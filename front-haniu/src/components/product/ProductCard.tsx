'use client';

import Link from 'next/link';
import Icon from '@/components/common/Icons';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    sku: string;
    description: string;
    price?: number;
    basePrice?: number;
    salePrice?: number;
    isFeatured: boolean;
    isNew: boolean;
    isCustomizable: boolean;
    category?: { name: string };
    media?: Array<{ url: string; isThumbnail: boolean }>;
  };
  onQuickView?: (product: any) => void;
}

export default function ProductCard({ product, onQuickView }: ProductCardProps) {
  const thumbnail = product.media?.find(m => m.isThumbnail)?.url || product.media?.[0]?.url || 'https://via.placeholder.com/300';
  const secondaryImage = product.media?.find(m => !m.isThumbnail)?.url || product.media?.[1]?.url;
  
  const priceVal = product.salePrice || product.basePrice || product.price || 0;
  const originalPriceVal = product.salePrice ? (product.basePrice || product.price) : undefined;
  const discountPercent = originalPriceVal ? Math.round(((originalPriceVal - priceVal) / originalPriceVal) * 100) : 0;

  return (
    <div className="group bg-white dark:bg-zinc-900 rounded-[28px] border border-slate-100 dark:border-zinc-800/80 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden relative">
      {/* Badges */}
      <div className="absolute left-3 top-3 z-20 flex flex-col gap-1.5 pointer-events-none">
        {product.isFeatured && (
          <span className="bg-gradient-to-r from-amber-500 to-amber-600 text-white text-[9px] font-bold px-2.5 py-0.5 rounded-full shadow-sm">
            NỔI BẬT
          </span>
        )}
        {product.isNew && (
          <span className="bg-gradient-to-r from-rose-500 to-rose-600 text-white text-[9px] font-bold px-2.5 py-0.5 rounded-full shadow-sm">
            MỚI
          </span>
        )}
        {product.isCustomizable && (
          <span className="bg-gradient-to-r from-cyan-500 to-cyan-600 text-white text-[9px] font-bold px-2.5 py-0.5 rounded-full shadow-sm">
            CÁ NHÂN HÓA
          </span>
        )}
      </div>

      {/* Product Thumbnail Container with hover switching & overlay */}
      <div className="block overflow-hidden relative aspect-square bg-slate-50 dark:bg-zinc-950">
        <Link href={`/products/${product.slug}`} className="block w-full h-full">
          <img
            src={thumbnail}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700 ease-out"
          />
          {secondaryImage && (
            <img
              src={secondaryImage}
              alt={`${product.name} alternate`}
              className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-all duration-700 ease-out group-hover:scale-105"
            />
          )}
        </Link>

        {/* Quick View slide-up overlay */}
        {onQuickView && (
          <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-10 flex justify-center">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onQuickView(product);
              }}
              className="w-full bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md text-slate-700 dark:text-zinc-200 hover:bg-rose-500 hover:text-white dark:hover:bg-rose-600 font-bold py-2.5 px-4 rounded-2xl text-[10px] transition-all shadow-lg active:scale-[0.98] cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Icon name="eye" size={14} /> Xem nhanh
            </button>
          </div>
        )}
      </div>

      {/* Content details */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-1.5">
          {product.category && (
            <span className="text-[9px] font-bold uppercase tracking-wider text-rose-500 block">
              {product.category.name}
            </span>
          )}
          <Link href={`/products/${product.slug}`} className="block">
            <h3 className="font-bold text-xs md:text-sm line-clamp-2 text-slate-800 hover:text-rose-500 transition-colors dark:text-zinc-100 dark:hover:text-rose-400 min-h-[36px] leading-snug">
              {product.name}
            </h3>
          </Link>
        </div>

        {/* Price & view details button */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-zinc-800/80">
          <div className="flex flex-col">
            <span className="font-black text-rose-500 text-sm md:text-base">
              {priceVal.toLocaleString('vi-VN')}đ
            </span>
            {originalPriceVal && (
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[10px] text-slate-400 line-through">
                  {originalPriceVal.toLocaleString('vi-VN')}đ
                </span>
                <span className="text-[9px] font-bold text-rose-500">
                  -{discountPercent}%
                </span>
              </div>
            )}
          </div>
          <Link 
            href={`/products/${product.slug}`} 
            className="text-[10px] font-bold bg-rose-50 hover:bg-rose-100 text-rose-600 dark:bg-rose-950/20 dark:text-rose-400 px-3.5 py-2 rounded-xl transition-all hover:scale-102 active:scale-98"
          >
            Chi tiết
          </Link>
        </div>
      </div>
    </div>
  );
}
