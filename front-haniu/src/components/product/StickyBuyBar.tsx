'use client';

import React, { useState, useEffect } from 'react';

interface Variant {
  id: string;
  name: string;
  price: number;
  salePrice?: number;
}

interface Product {
  id: string;
  name: string;
  basePrice: number;
  salePrice?: number | null;
  thumbnailUrl?: string;
  media?: Array<{ url: string; isThumbnail: boolean }>;
}

interface StickyBuyBarProps {
  product: Product;
  selectedVariant: Variant | null;
  onAddToCart: () => void;
  onBuyNow: () => void;
}

export default function StickyBuyBar({
  product,
  selectedVariant,
  onAddToCart,
  onBuyNow
}: StickyBuyBarProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show when scrolled down past 450px
      if (window.scrollY > 450) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isVisible) return null;

  const currentPrice = selectedVariant?.salePrice || selectedVariant?.price || product.salePrice || product.basePrice;
  const thumbnail = product.thumbnailUrl || (product.media && product.media.length > 0
    ? (product.media.find(m => m.isThumbnail)?.url || product.media[0].url)
    : 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=100');

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md border-t border-slate-200/60 dark:border-zinc-800/80 shadow-2xl pt-3 pb-[calc(12px+env(safe-area-inset-bottom))] px-4 transition-all duration-300 animate-slide-up">
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
        {/* Left: Product Info */}
        <div className="flex items-center gap-3 min-w-0">
          <img
            src={thumbnail}
            alt={product.name}
            className="w-10 h-10 rounded-lg object-cover bg-slate-50 border border-slate-100 shrink-0"
          />
          <div className="min-w-0">
            <h4 className="font-bold text-slate-800 dark:text-zinc-200 text-xs truncate max-w-[150px] md:max-w-xs">{product.name}</h4>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-rose-500 font-extrabold text-sm">{currentPrice.toLocaleString('vi-VN')}đ</span>
              {selectedVariant && (
                <span className="text-[9px] text-slate-400 font-bold bg-slate-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">
                  {selectedVariant.name}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right: CTAs */}
        <div className="flex gap-2">
          <button
            onClick={onAddToCart}
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-850 dark:bg-zinc-100 dark:hover:bg-zinc-200 dark:text-zinc-950 text-white text-[11px] font-bold rounded-xl transition-all shadow active:scale-95 whitespace-nowrap"
          >
            Thêm giỏ hàng
          </button>
          <button
            onClick={onBuyNow}
            className="px-5 py-2.5 bg-rose-500 hover:bg-rose-600 text-white text-[11px] font-bold rounded-xl transition-all shadow-md shadow-rose-500/10 active:scale-95 cursor-pointer whitespace-nowrap"
          >
            Mua ngay
          </button>
        </div>
      </div>
    </div>
  );
}
