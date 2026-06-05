'use client';

import React, { useState, useEffect } from 'react';
import Icon from '@/components/common/Icons';
import { useWishlistStore } from '@/store/wishlist';
import GiftWrapSelector from '@/components/product/GiftWrapSelector';

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
  category?: { name: string; icon?: string; imageUrl?: string };
  brand?: { name: string; icon?: string; imageUrl?: string } | null;
  collection?: { name: string; icon?: string; imageUrl?: string } | null;
  occasions?: Array<{ id: string; name: string; icon?: string; imageUrl?: string }>;
  recipients?: Array<{ id: string; name: string; icon?: string; imageUrl?: string }>;
  totalSold?: number;
  averageRating?: number;
}

interface ProductInfoProps {
  product: Product;
  selectedVariant: Variant | null;
  setSelectedVariant: (v: Variant) => void;
  averageRating: number;
  totalReviews: number;
  soldCount?: number;
  onReviewsClick?: () => void;
  giftWrap?: string;
  setGiftWrap?: (v: string) => void;
  giftWrapOptions?: string[];
  giftWrapLabel?: string;
  showGiftWrap?: boolean;
}

export default function ProductInfo({
  product,
  selectedVariant,
  setSelectedVariant,
  averageRating,
  totalReviews,
  soldCount,
  onReviewsClick,
  giftWrap,
  setGiftWrap,
  giftWrapOptions,
  giftWrapLabel,
  showGiftWrap
}: ProductInfoProps) {
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const isFavorite = isInWishlist(product.id);
  const finalSoldCount = product.totalSold ?? soldCount ?? 0;

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
    <div className="bg-white dark:bg-zinc-900/40 p-5 rounded-3xl border border-slate-200/60 dark:border-zinc-800/80 shadow-xs space-y-5">
      {/* Category, Brand, Collection Tags */}
      <div className="flex flex-wrap gap-1.5 sm:gap-2 items-center">
        {product.isFeatured && (
          <span className="bg-gradient-to-r from-amber-500 to-rose-500 text-white border-0 text-[9px] sm:text-[10px] font-extrabold px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full uppercase tracking-wider shadow-xs flex items-center gap-1">
            🔥 Nổi bật
          </span>
        )}
        {product.category && (
          <span className="bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900/30 text-[9px] sm:text-[10px] font-extrabold px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
            {product.category.imageUrl || product.category.icon ? (
              product.category.imageUrl ? (
                <img src={product.category.imageUrl} className="w-3.5 h-3.5 rounded-full object-cover shrink-0" alt="" />
              ) : (
                <span className="shrink-0">{product.category.icon}</span>
              )
            ) : (
              <span className="shrink-0">🌸</span>
            )}
            {product.category.name}
          </span>
        )}
        {product.brand && (
          <span className="bg-slate-50 dark:bg-zinc-800/60 text-slate-700 dark:text-zinc-300 border border-slate-200/50 dark:border-zinc-800/80 text-[9px] sm:text-[10px] font-extrabold px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
            {product.brand.imageUrl || product.brand.icon ? (
              product.brand.imageUrl ? (
                <img src={product.brand.imageUrl} className="w-3.5 h-3.5 rounded-full object-cover shrink-0" alt="" />
              ) : (
                <span className="shrink-0">{product.brand.icon}</span>
              )
            ) : (
              <span className="shrink-0">✨</span>
            )}
            Hãng: {product.brand.name}
          </span>
        )}
        {product.collection && (
          <span className="bg-slate-50 dark:bg-zinc-800/60 text-slate-700 dark:text-zinc-300 border border-slate-200/50 dark:border-zinc-800/80 text-[9px] sm:text-[10px] font-extrabold px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
            {product.collection.imageUrl || product.collection.icon ? (
              product.collection.imageUrl ? (
                <img src={product.collection.imageUrl} className="w-3.5 h-3.5 rounded-full object-cover shrink-0" alt="" />
              ) : (
                <span className="shrink-0">{product.collection.icon}</span>
              )
            ) : (
              <span className="shrink-0">📦</span>
            )}
            {product.collection.name}
          </span>
        )}
      </div>

      {/* Title & Share/Wishlist Actions */}
      <div className="flex justify-between items-start gap-3 sm:gap-4">
        <h1 className="text-lg sm:text-xl md:text-3xl font-extrabold tracking-tight text-slate-800 dark:text-zinc-100 leading-tight">
          {product.name}
        </h1>
        <div className="flex gap-1.5 sm:gap-2 shrink-0 pt-0.5">
          <button
            onClick={() => toggleWishlist(product as any)}
            className={`p-2 sm:p-2.5 rounded-full border transition-all ${isFavorite
              ? 'bg-rose-500 border-rose-500 text-white shadow-sm'
              : 'bg-white border-slate-200 text-slate-400 hover:text-rose-500 dark:bg-zinc-900 dark:border-zinc-800'
              }`}
            title="Thêm yêu thích"
          >
            <Icon name="heart" size={14} className={isFavorite ? 'fill-current text-white' : 'text-slate-400'} />
          </button>
          <button
            onClick={handleShare}
            className="p-2 sm:p-2.5 rounded-full border border-slate-200 text-slate-400 hover:text-slate-650 bg-white dark:bg-zinc-900 dark:border-zinc-800 transition-all"
            title="Chia sẻ sản phẩm"
          >
            <Icon name="arrow-right" size={14} className="text-slate-400 rotate-[-45deg]" />
          </button>
        </div>
      </div>

      {/* Ratings & Sold Count */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-[11px] sm:text-xs font-semibold pb-3 border-b border-slate-100 dark:border-zinc-800/80">
        <button
          onClick={onReviewsClick}
          className="flex items-center gap-1 hover:text-rose-500 transition-colors cursor-pointer focus:outline-none"
        >
          <Icon name="star" size={13} className="text-amber-500 fill-current" />
          <span className="text-slate-700 dark:text-zinc-200">{averageRating.toFixed(1)}/5</span>
          <span className="text-slate-400 font-normal">({totalReviews} đánh giá)</span>
        </button>
        <div className="w-1 h-1 rounded-full bg-slate-300 shrink-0 hidden xs:block"></div>
        <div className="text-slate-500 dark:text-zinc-400">
          Đã bán <span className="text-slate-800 dark:text-zinc-200 font-extrabold">{finalSoldCount}</span>
        </div>
      </div>

      {/* Scarcity & Flash Sale Widgets Combined */}
      <div className="p-3 bg-gradient-to-br from-amber-500/5 via-rose-500/5 to-rose-500/10 border border-rose-500/10 rounded-2xl space-y-2 text-[11px] sm:text-xs">
        {/* Flash Sale Countdown Row */}
        {discountPercent > 0 && (
          <div className="flex flex-row items-center justify-between pb-1.5 border-b border-rose-500/10">
            <span className="font-extrabold text-amber-600 dark:text-amber-400 flex items-center gap-1.5 uppercase tracking-wider text-[10px]">
              <Icon name="zap" size={12} className="text-amber-500 animate-bounce" /> FLASH SALE ĐANG DIỄN RA
            </span>
            <div className="flex items-center gap-1 font-mono font-bold">
              <span className="bg-slate-900 dark:bg-zinc-800 text-white px-1.5 py-0.5 rounded text-[10px] min-w-[20px] text-center">
                {String(flashSaleTime.hours).padStart(2, '0')}
              </span>
              <span className="text-slate-500 dark:text-zinc-500">:</span>
              <span className="bg-slate-900 dark:bg-zinc-800 text-white px-1.5 py-0.5 rounded text-[10px] min-w-[20px] text-center">
                {String(flashSaleTime.minutes).padStart(2, '0')}
              </span>
              <span className="text-slate-500 dark:text-zinc-500">:</span>
              <span className="bg-slate-900 dark:bg-zinc-800 text-white px-1.5 py-0.5 rounded text-[10px] min-w-[20px] text-center">
                {String(flashSaleTime.seconds).padStart(2, '0')}
              </span>
            </div>
          </div>
        )}

        {/* Scarcity info row */}
        <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-1.5 font-semibold">
          <div className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400">
            <Icon name="zap" size={12} className="text-rose-500 shrink-0" />
            <span>Chỉ còn <strong className="text-rose-700 dark:text-rose-400">{stockCount} sản phẩm</strong> trong kho!</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-500 dark:text-zinc-400">
            <Icon name="users" size={12} className="text-slate-400 shrink-0" />
            <span>{viewersCount} người đang xem</span>
          </div>
        </div>
      </div>

      {/* Price Container */}
      <div className="flex items-baseline gap-3 flex-wrap pt-1">
        <span className="text-2xl sm:text-3xl font-black text-rose-600 dark:text-rose-500 tracking-tight">
          {currentPrice.toLocaleString('vi-VN')}đ
        </span>
        {originalPrice && originalPrice > currentPrice && (
          <div className="flex items-center gap-2">
            <span className="text-sm sm:text-base text-slate-400 dark:text-zinc-500 line-through">
              {originalPrice.toLocaleString('vi-VN')}đ
            </span>
            <span className="bg-rose-500 text-white dark:bg-rose-600 text-[9px] sm:text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
              -{discountPercent}%
            </span>
          </div>
        )}
      </div>

      {/* Short Description */}
      <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 leading-relaxed whitespace-pre-line pt-2">
        {product.description}
      </p>

      {/* Occasions, Recipients, Variants & Gift Wrap Wrapper Section */}
      {(((product.occasions && product.occasions.length > 0) || (product.recipients && product.recipients.length > 0) || ((product as any).variants && (product as any).variants.length > 0) || (showGiftWrap && setGiftWrap && giftWrap !== undefined)) && (
        <div className="border-t border-slate-100 dark:border-zinc-800/80 pt-5 space-y-5">
          {/* Occasions & Recipients Tags */}
          {((product.occasions && product.occasions.length > 0) || (product.recipients && product.recipients.length > 0)) && (
            <div className={`space-y-3.5 ${(((product as any).variants && (product as any).variants.length > 0) || (showGiftWrap && setGiftWrap)) ? 'pb-4 border-b border-slate-100 dark:border-zinc-800/80' : ''}`}>
              {product.occasions && product.occasions.length > 0 && (
                <div className="flex flex-col xs:flex-row xs:items-center text-xs gap-1.5">
                  <span className="text-slate-500 dark:text-zinc-400 font-extrabold uppercase tracking-wider text-[9px] sm:text-[10px] w-20 shrink-0">Dịp tặng:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {product.occasions.map(o => (
                      <span key={o.id} className="bg-slate-50 dark:bg-zinc-800/40 text-slate-650 dark:text-zinc-300 border border-slate-200/60 dark:border-zinc-800/80 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg text-[11px] sm:text-xs font-semibold">
                        {o.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {product.recipients && product.recipients.length > 0 && (
                <div className="flex flex-col xs:flex-row xs:items-center text-xs gap-1.5">
                  <span className="text-slate-500 dark:text-zinc-400 font-extrabold uppercase tracking-wider text-[9px] sm:text-[10px] w-20 shrink-0">Đối tượng:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {product.recipients.map(r => (
                      <span key={r.id} className="bg-slate-50 dark:bg-zinc-800/40 text-slate-650 dark:text-zinc-300 border border-slate-200/60 dark:border-zinc-800/80 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg text-[11px] sm:text-xs font-semibold">
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
            <div className="space-y-2.5">
              <label className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400 block mb-3">Chọn mẫu hộp quà / màu sắc</label>
              <div className={`grid grid-cols-2 sm:grid-cols-3 gap-2 ${(product as any).variants.length > 6 ? 'max-h-[230px] overflow-y-auto pr-1 scrollbar-thin' : ''}`}>
                {(product as any).variants.map((v: Variant) => {
                  const isSelected = selectedVariant?.id === v.id;
                  const isLowStock = v.stock > 0 && v.stock <= 10;
                  const isOutOfStock = v.stock === 0;

                  return (
                    <button
                      key={v.id}
                      type="button"
                      disabled={isOutOfStock}
                      onClick={() => setSelectedVariant(v)}
                      className={`relative p-1.5 pr-2 rounded-xl border text-[11px] font-bold transition-all duration-300 w-full flex items-center gap-2 text-left select-none outline-none group cursor-pointer min-h-[46px] ${isSelected
                        ? 'border-rose-500 bg-gradient-to-br from-rose-500/5 to-rose-600/5 text-rose-600 dark:border-rose-450 dark:text-rose-400 dark:from-rose-500/10 dark:to-rose-600/10 shadow-[0_2px_8px_rgba(244,63,94,0.06)]'
                        : isOutOfStock
                          ? 'border-slate-100 bg-slate-50 text-slate-400 cursor-not-allowed dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-500'
                          : 'border-slate-100 bg-white hover:border-rose-300 dark:border-zinc-800 dark:bg-zinc-900 text-slate-700 dark:text-zinc-300 hover:shadow-xs dark:hover:bg-zinc-800/50'
                        }`}
                    >
                      {/* Selected checkmark indicator */}
                      {isSelected && (
                        <span className="absolute -top-1 -right-1 p-0.5 rounded-full bg-rose-500 text-white dark:bg-rose-600 shadow-xs animate-scale-up z-10">
                          <Icon name="check" size={8} />
                        </span>
                      )}

                      {/* Image Thumbnail */}
                      <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0 border border-slate-100 dark:border-zinc-800/60 bg-slate-50 dark:bg-zinc-800 flex items-center justify-center">
                        {v.imageUrl ? (
                          <img src={v.imageUrl} className="w-full h-full object-cover" alt="" />
                        ) : (
                          <span className="text-[10px]">🎁</span>
                        )}
                      </div>

                      {/* Name and Stock Info */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                        <div className={`leading-tight break-words line-clamp-1 pr-1 transition-colors ${isSelected ? 'text-rose-600 dark:text-rose-400' : 'text-slate-800 dark:text-zinc-200'}`}>
                          {v.name}
                        </div>
                        <div className="flex items-center gap-1 text-[8px] text-slate-400 dark:text-zinc-500 font-medium">
                          <span className={`font-bold uppercase ${isOutOfStock
                            ? 'text-slate-400 dark:text-zinc-500'
                            : isLowStock
                              ? 'text-amber-600 dark:text-amber-400 animate-pulse'
                              : 'text-slate-400 dark:text-zinc-500'
                            }`}>
                            {isOutOfStock ? 'Hết' : isLowStock ? 'Sắp hết' : 'Sẵn có'}
                          </span>
                          <span className="font-mono shrink-0">({v.stock})</span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Gift Wrap Selector inside the block */}
          {showGiftWrap && setGiftWrap && giftWrap !== undefined && (
            <div className={`pt-4 ${((product as any).variants && (product as any).variants.length > 0) ? 'border-t border-slate-100 dark:border-zinc-800/80 mt-4' : ''}`}>
              <GiftWrapSelector
                giftWrap={giftWrap}
                setGiftWrap={setGiftWrap}
                options={giftWrapOptions}
                label={giftWrapLabel}
                show={showGiftWrap}
                borderless={true}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
