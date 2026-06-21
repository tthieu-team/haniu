'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Icon from '@/components/common/Icons';
import { useWishlistStore } from '@/store/wishlist';
import { getFullImageUrl } from '@/lib/api';
import { useTranslate } from '@/lib/translator';

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
    thumbnailUrl?: string;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const trans = useTranslate();
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const isLiked = isInWishlist(product.id);

  const thumbnail = (product.media && product.media.length > 0)
    ? (product.media.find(m => m.isThumbnail)?.url || product.media[0]?.url)
    : (product.thumbnailUrl || (product as any).thumbnail_url || 'https://placehold.co/300');
  const secondaryImage = product.media?.find(m => !m.isThumbnail)?.url || product.media?.[1]?.url;

  const [imgSrc, setImgSrc] = useState<string>('https://placehold.co/300?text=Haniu');
  const [secondImgSrc, setSecondImgSrc] = useState<string | null>(null);

  useEffect(() => {
    setImgSrc(getFullImageUrl(thumbnail) || 'https://placehold.co/300?text=Haniu');
  }, [thumbnail]);

  useEffect(() => {
    setSecondImgSrc(secondaryImage ? (getFullImageUrl(secondaryImage) || null) : null);
  }, [secondaryImage]);
  
  const priceVal = product.salePrice || (product as any).sale_price || product.basePrice || product.price || 0;
  const originalPriceVal = (product.salePrice || (product as any).sale_price) ? (product.basePrice || product.price) : undefined;
  const discountPercent = originalPriceVal ? Math.round(((originalPriceVal - priceVal) / originalPriceVal) * 100) : 0;

  const isFeatured = product.isFeatured || (product as any).is_featured || (product as any).featured;
  const isNew = product.isNew || (product as any).is_new || (product as any).new;
  const isCustomizable = product.isCustomizable || (product as any).is_customizable;

  return (
    <div className="group bg-white dark:bg-zinc-900 rounded-2xl sm:rounded-[28px] border border-slate-100 dark:border-zinc-800/80 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden relative z-10">
      {/* Wishlist Button */}
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleWishlist(product);
        }}
        className="absolute right-2 top-2 sm:right-3 sm:top-3 z-30 p-2 rounded-full bg-white/90 hover:bg-white text-slate-400 hover:text-rose-500 shadow-md backdrop-blur-xs transition-all duration-300 active:scale-90 cursor-pointer dark:bg-zinc-900/90 dark:hover:bg-zinc-800"
        title={isLiked ? trans("Xóa khỏi danh sách yêu thích") : trans("Thêm vào danh sách yêu thích")}
      >
        <Icon
          name="heart"
          size={14}
          className={`${isLiked ? 'fill-rose-500 text-rose-500' : 'text-slate-500 dark:text-zinc-400'} transition-colors`}
        />
      </button>

      {/* Badges */}

      <div className="absolute left-2 top-2 sm:left-3 sm:top-3 z-20 flex flex-col gap-1 sm:gap-1.5 pointer-events-none">
        {isFeatured && (
          <span className="bg-gradient-to-r from-amber-500 to-amber-600 text-white text-[8px] sm:text-[9px] font-bold px-1.5 sm:px-2.5 py-0.5 rounded-full shadow-sm">
            {trans("NỔI BẬT")}
          </span>
        )}
        {isNew && (
          <span className="bg-gradient-to-r from-rose-500 to-rose-600 text-white text-[8px] sm:text-[9px] font-bold px-1.5 sm:px-2.5 py-0.5 rounded-full shadow-sm">
            {trans("MỚI")}
          </span>
        )}
        {isCustomizable && (
          <span className="bg-gradient-to-r from-cyan-500 to-cyan-600 text-white text-[8px] sm:text-[9px] font-bold px-1.5 sm:px-2.5 py-0.5 rounded-full shadow-sm">
            {trans("CÁ NHÂN HÓA")}
          </span>
        )}
      </div>

      {/* Product Thumbnail Container with hover switching & overlay */}
      <div className="block overflow-hidden relative aspect-square bg-slate-50 dark:bg-zinc-950 rounded-t-2xl sm:rounded-t-[28px]">
        <Link href={`/products/${product.slug}`} className="block w-full h-full relative">
          <Image
            src={imgSrc}
            alt={trans(product.name)}
            fill
            className="object-cover group-hover:scale-105 transition-all duration-700 ease-out rounded-t-2xl sm:rounded-t-[28px]"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            onError={() => setImgSrc('https://placehold.co/300?text=Haniu')}
          />
          {secondImgSrc && (
            <Image
              src={secondImgSrc}
              alt={`${trans(product.name)} alternate`}
              fill
              className="absolute inset-0 object-cover opacity-0 group-hover:opacity-100 transition-all duration-700 ease-out group-hover:scale-105 rounded-t-2xl sm:rounded-t-[28px]"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              onError={() => setSecondImgSrc(null)}
            />
          )}
        </Link>
      </div>

      {/* Content details */}
      <div className="p-3 sm:p-5 flex-1 flex flex-col justify-between space-y-3 sm:space-y-4">
        <div className="space-y-1 sm:space-y-1.5">
          {product.category && (
            <span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-wider text-rose-500 block">
              {trans(product.category.name)}
            </span>
          )}
          <Link href={`/products/${product.slug}`} className="block">
            <h3 className="font-bold text-[11px] sm:text-xs md:text-sm line-clamp-2 text-slate-800 hover:text-rose-500 transition-colors dark:text-zinc-100 dark:hover:text-rose-400 min-h-[30px] sm:min-h-[36px] leading-snug">
              {trans(product.name)}
            </h3>
          </Link>
        </div>

        {/* Price & view details button */}
        <div className="flex items-center justify-between pt-2.5 sm:pt-3 border-t border-slate-100 dark:border-zinc-800/80">
          <div className="flex flex-col">
            <span className="font-black text-rose-500 text-xs sm:text-sm md:text-base">
              {priceVal.toLocaleString('vi-VN')}đ
            </span>
            {originalPriceVal && (
              <div className="flex flex-wrap items-center gap-1 mt-0.5">
                <span className="text-[8px] sm:text-[10px] text-slate-400 line-through">
                  {originalPriceVal.toLocaleString('vi-VN')}đ
                </span>
                <span className="text-[8px] sm:text-[9px] font-bold text-rose-500">
                  -{discountPercent}%
                </span>
              </div>
            )}
          </div>
          <Link 
            href={`/products/${product.slug}`} 
            className="text-[9px] sm:text-[10px] font-bold bg-rose-50 hover:bg-rose-100 text-rose-600 dark:bg-rose-950/20 dark:text-rose-400 px-2 py-1.5 sm:px-3.5 sm:py-2 rounded-lg sm:rounded-xl transition-all hover:scale-102 active:scale-98 shrink-0"
          >
            {trans("Chi tiết")}
          </Link>
        </div>
      </div>
    </div>
  );
}
