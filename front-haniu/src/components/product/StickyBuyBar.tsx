'use client';

import React, { useState, useEffect } from 'react';
import { getFullImageUrl } from '@/lib/api';

interface Variant {
  id: string;
  name: string;
  price: number;
  salePrice?: number;
  imageUrl?: string;
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
  const thumbnail = (product.media && product.media.length > 0)
    ? (product.media.find(m => m.isThumbnail)?.url || product.media[0].url)
    : (selectedVariant?.imageUrl || product.thumbnailUrl || 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=100');

  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-screen max-w-none z-40 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md border-t border-slate-200/60 dark:border-zinc-800/80 shadow-2xl pt-2.5 pb-[calc(10px+env(safe-area-inset-bottom))] px-4 transition-all duration-300 animate-slide-up">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-2 sm:gap-4 w-full">
        {/* Left: Product Info */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1 sm:flex-initial">
          <img
            src={getFullImageUrl(thumbnail)}
            alt={product.name}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg object-cover bg-slate-50 border border-slate-100 dark:border-zinc-800 shrink-0"
          />
          <div className="min-w-0">
            <h4 className="font-bold text-slate-800 dark:text-zinc-200 text-[10px] sm:text-xs truncate max-w-[80px] xs:max-w-[120px] md:max-w-xs">{product.name}</h4>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-rose-500 font-extrabold text-xs sm:text-sm">{currentPrice.toLocaleString('vi-VN')}đ</span>
            </div>
          </div>
        </div>

        {/* Right: CTAs */}
        <div className="flex gap-1.5 sm:gap-2 shrink-0">
          <button
            onClick={onAddToCart}
            className="px-2.5 py-2 sm:px-4 sm:py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 dark:text-zinc-950 text-white text-[9px] sm:text-[11px] font-bold rounded-xl transition-all shadow active:scale-95 whitespace-nowrap"
          >
            Thêm giỏ hàng
          </button>
          <button
            onClick={onBuyNow}
            className="px-3.5 py-2 sm:px-5 sm:py-2.5 bg-rose-500 hover:bg-rose-600 text-white text-[9px] sm:text-[11px] font-bold rounded-xl transition-all shadow-md shadow-rose-500/10 active:scale-95 cursor-pointer whitespace-nowrap"
          >
            Mua ngay
          </button>
        </div>
      </div>
    </div>
  );
}
