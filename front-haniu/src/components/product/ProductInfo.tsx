'use client';

import React, { useState, useEffect } from 'react';
import Icon from '@/components/common/Icons';
import { useWishlistStore } from '@/store/wishlist';

interface Variant {
  id: string;
  sku: string;
  name: string;
  color?: string;
  size?: string;
  material?: string;
  price: number;
  salePrice?: number;
  stock: number;
  imageUrl?: string;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  description: string;
  basePrice: number;
  salePrice?: number | null;
  stock: number;
  isFeatured: boolean;
  isNew: boolean;
  category?: { name: string };
  brand?: { name: string } | null;
  collection?: { name: string } | null;
  occasions?: Array<{ id: string; name: string }>;
  recipients?: Array<{ id: string; name: string }>;
}

interface ProductInfoProps {
  product: Product;
  selectedVariant: Variant | null;
  setSelectedVariant: (v: Variant) => void;
  averageRating: number;
  totalReviews: number;
  soldCount?: number;
  onReviewsClick?: () => void;
}

export default function ProductInfo({
  product,
  selectedVariant,
  setSelectedVariant,
  averageRating,
  totalReviews,
  soldCount = 1240,
  onReviewsClick
}: ProductInfoProps) {
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const isFavorite = isInWishlist(product.id);

  // Scarcity simulation
  const [viewersCount, setViewersCount] = useState(12);
  const [stockCount, setStockCount] = useState(product.stock || 25);
  const [flashSaleTime, setFlashSaleTime] = useState({ hours: 2, minutes: 15, seconds: 20 });

  useEffect(() => {
    // Random viewers simulation
    const viewerInterval = setInterval(() => {
      setViewersCount(prev => Math.max(5, prev + (Math.random() > 0.5 ? 1 : -1)));
    }, 8000);

    // Flash sale countdown simulation
    const countdownInterval = setInterval(() => {
      setFlashSaleTime(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 2, minutes: 15, seconds: 20 }; // reset fallback
      });
    }, 1000);

    return () => {
      clearInterval(viewerInterval);
      clearInterval(countdownInterval);
    };
  }, []);

  const currentPrice = selectedVariant?.salePrice || selectedVariant?.price || product.salePrice || product.basePrice;
  const originalPrice = selectedVariant?.salePrice ? selectedVariant.price : (product.salePrice ? product.basePrice : null);
  const discountPercent = originalPrice && originalPrice > currentPrice
    ? Math.round((1 - currentPrice / originalPrice) * 100)
    : 0;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Đã sao chép liên kết sản phẩm!');
    }
  };

  return (
    <div className="space-y-6">
      {/* Category, Brand, Collection Tags */}
      <div className="flex flex-wrap gap-2 items-center">
        {product.category && (
          <span className="bg-rose-500/10 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-100/50 dark:border-rose-950/30 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
            {product.category.name}
          </span>
        )}
        {product.brand && (
          <span className="bg-slate-100 dark:bg-zinc-900/80 text-slate-600 dark:text-zinc-300 border border-slate-200/50 dark:border-zinc-800/80 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
            Hãng: {product.brand.name}
          </span>
        )}
        {product.collection && (
          <span className="bg-slate-100 dark:bg-zinc-900/80 text-slate-600 dark:text-zinc-300 border border-slate-200/50 dark:border-zinc-800/80 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
            {product.collection.name}
          </span>
        )}
        {product.isFeatured && (
          <span className="bg-rose-500/10 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-100/50 dark:border-rose-950/30 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
            Nổi bật
          </span>
        )}
      </div>

      {/* Title & Share/Wishlist Actions */}
      <div className="flex justify-between items-start gap-4">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-800 dark:text-zinc-100 leading-tight">
          {product.name}
        </h1>
        <div className="flex gap-2 shrink-0 pt-1">
          <button
            onClick={() => toggleWishlist(product as any)}
            className={`p-2.5 rounded-full border transition-all ${
              isFavorite
                ? 'bg-rose-500 border-rose-500 text-white shadow-sm'
                : 'bg-white border-slate-200 text-slate-450 hover:text-rose-500 dark:bg-zinc-900 dark:border-zinc-800'
            }`}
            title="Thêm yêu thích"
          >
            <Icon name="heart" size={16} className={isFavorite ? 'fill-current text-white' : 'text-slate-400'} />
          </button>
          <button
            onClick={handleShare}
            className="p-2.5 rounded-full border border-slate-200 text-slate-400 hover:text-slate-650 bg-white dark:bg-zinc-900 dark:border-zinc-800 transition-all"
            title="Chia sẻ sản phẩm"
          >
            <Icon name="arrow-right" size={16} className="text-slate-400 rotate-[-45deg]" />
          </button>
        </div>
      </div>

      {/* Ratings & Sold Count */}
      <div className="flex items-center gap-4 text-xs font-semibold">
        <button
          onClick={onReviewsClick}
          className="flex items-center gap-1 hover:text-rose-500 transition-colors cursor-pointer focus:outline-none"
        >
          <Icon name="star" size={14} className="text-amber-500 fill-current" />
          <span className="text-slate-700 dark:text-zinc-200">{averageRating.toFixed(1)}/5</span>
          <span className="text-slate-450 font-normal">({totalReviews} đánh giá)</span>
        </button>
        <div className="w-1 h-1 rounded-full bg-slate-300"></div>
        <div className="text-slate-500 dark:text-zinc-400">
          Đã bán <span className="text-slate-850 dark:text-zinc-200 font-extrabold">{soldCount}+</span>
        </div>
      </div>

      {/* Scarcity Widget */}
      <div className="p-3.5 bg-rose-500/5 border border-rose-500/10 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-semibold">
        <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
          <Icon name="zap" size={14} className="text-rose-500 animate-pulse" />
          <span>Chỉ còn <strong>{stockCount} sản phẩm</strong> trong kho!</span>
        </div>
        <div className="flex items-center gap-2 text-slate-500 dark:text-zinc-400">
          <Icon name="users" size={14} className="text-slate-400" />
          <span>{viewersCount} người đang xem sản phẩm này</span>
        </div>
      </div>

      {/* Countdown Widget */}
      {discountPercent > 0 && (
        <div className="p-3.5 bg-gradient-to-r from-amber-500/10 to-rose-500/10 border border-amber-500/15 rounded-2xl flex items-center justify-between text-xs">
          <span className="font-extrabold text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
            <Icon name="zap" size={14} className="text-amber-500 animate-bounce" /> FLASH SALE ĐANG DIỄN RA
          </span>
          <div className="flex items-center gap-1">
            <span className="bg-slate-850 dark:bg-zinc-800 text-slate-800 dark:text-white px-2 py-1 rounded font-mono font-bold text-[10px]">
              {String(flashSaleTime.hours).padStart(2, '0')}
            </span>
            <span className="font-bold text-slate-800 dark:text-zinc-300">:</span>
            <span className="bg-slate-850 dark:bg-zinc-800 text-slate-800 dark:text-white px-2 py-1 rounded font-mono font-bold text-[10px]">
              {String(flashSaleTime.minutes).padStart(2, '0')}
            </span>
            <span className="font-bold text-slate-800 dark:text-zinc-300">:</span>
            <span className="bg-slate-850 dark:bg-zinc-800 text-slate-800 dark:text-white px-2 py-1 rounded font-mono font-bold text-[10px]">
              {String(flashSaleTime.seconds).padStart(2, '0')}
            </span>
          </div>
        </div>
      )}

      {/* Price Container */}
      <div className="bg-white/70 dark:bg-zinc-900/40 backdrop-blur-md p-4 rounded-2xl flex items-center gap-4 flex-wrap border border-slate-200/80 dark:border-zinc-800/60 shadow-sm">
        <span className="text-3xl font-black text-rose-500">
          {currentPrice.toLocaleString('vi-VN')}đ
        </span>
        {originalPrice && originalPrice > currentPrice && (
          <>
            <span className="text-sm text-slate-400 line-through">
              {originalPrice.toLocaleString('vi-VN')}đ
            </span>
            <span className="bg-rose-500/10 text-rose-500 text-xs font-bold px-2 py-1 rounded-lg">
              -{discountPercent}%
            </span>
          </>
        )}
      </div>

      {/* Short Description */}
      <p className="text-sm text-slate-600 dark:text-zinc-400 leading-relaxed whitespace-pre-line">
        {product.description}
      </p>

      {/* Occasions & Recipients Tags */}
      {((product.occasions && product.occasions.length > 0) || (product.recipients && product.recipients.length > 0)) && (
        <div className="bg-white/50 dark:bg-zinc-900/30 p-4 rounded-2xl space-y-3.5 border border-slate-200/60 dark:border-zinc-800/50">
          {product.occasions && product.occasions.length > 0 && (
            <div className="flex items-center text-xs">
              <span className="text-slate-450 dark:text-zinc-450 font-extrabold uppercase tracking-wider text-[10px] w-20 shrink-0">Dịp tặng:</span>
              <div className="flex flex-wrap gap-1.5">
                {product.occasions.map(o => (
                  <span key={o.id} className="bg-slate-100 dark:bg-zinc-800 text-slate-650 dark:text-zinc-300 border border-slate-200/60 dark:border-zinc-800/80 px-2.5 py-1 rounded-lg text-xs font-semibold">
                    {o.name}
                  </span>
                ))}
              </div>
            </div>
          )}
          {product.recipients && product.recipients.length > 0 && (
            <div className="flex items-center text-xs">
              <span className="text-slate-450 dark:text-zinc-450 font-extrabold uppercase tracking-wider text-[10px] w-20 shrink-0">Đối tượng:</span>
              <div className="flex flex-wrap gap-1.5">
                {product.recipients.map(r => (
                  <span key={r.id} className="bg-slate-100 dark:bg-zinc-800 text-slate-655 dark:text-zinc-300 border border-slate-200/60 dark:border-zinc-800/80 px-2.5 py-1 rounded-lg text-xs font-semibold">
                    {r.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Variants Selector */}
      {((product as any).variants && (product as any).variants.length > 0) && (
        <div className="space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Chọn mẫu hộp quà / màu sắc</label>
          <div className="grid grid-cols-2 gap-3">
            {(product as any).variants.map((v: Variant) => (
              <button
                key={v.id}
                type="button"
                onClick={() => setSelectedVariant(v)}
                className={`p-3 text-left rounded-xl border text-xs font-semibold transition-all ${
                  selectedVariant?.id === v.id
                    ? 'border-rose-500 bg-rose-50/10 text-rose-600 dark:border-rose-450 dark:text-rose-450 shadow-sm'
                    : 'border-slate-200 bg-white hover:bg-slate-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800'
                }`}
              >
                <div>{v.name}</div>
                <div className="text-[10px] text-slate-400 font-mono mt-1">Kho: {v.stock} chiếc</div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
