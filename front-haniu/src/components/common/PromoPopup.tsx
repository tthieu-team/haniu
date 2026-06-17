'use client';

import { useState, useEffect } from 'react';
import { useHomeLayoutStore } from '@/store/homeLayout';
import { useCouponStore } from '@/store/coupon';
import Icon from '@/components/common/Icons';

export default function PromoPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [collectedCodes, setCollectedCodes] = useState<string[]>([]);
  const [usedCodes, setUsedCodes] = useState<string[]>([]);
  const { welcomeScreen } = useHomeLayoutStore();
  const { coupons, fetchCoupons } = useCouponStore();

  useEffect(() => {
    // Load collected and used coupons from localStorage on mount
    if (typeof window !== 'undefined') {
      try {
        const storedCollected = localStorage.getItem('haniu_collected_coupons');
        if (storedCollected) {
          setCollectedCodes(JSON.parse(storedCollected));
        }
        const storedUsed = localStorage.getItem('haniu_used_coupons');
        if (storedUsed) {
          setUsedCodes(JSON.parse(storedUsed));
        }
      } catch (e) {
        console.error('Lỗi đọc dữ liệu coupon từ localStorage:', e);
      }
    }

    const isShown = sessionStorage.getItem('haniu_promo_shown');
    if (!isShown) {
      // Fetch coupons from backend
      fetchCoupons();

      const isSplashShowing = welcomeScreen.isEnabled && !sessionStorage.getItem('haniu_splash_shown');
      const delay = isSplashShowing ? (welcomeScreen.durationMs + 800) : 1000;

      const timer = setTimeout(() => {
        setIsOpen(true);
        sessionStorage.setItem('haniu_promo_shown', 'true');
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [welcomeScreen, fetchCoupons]);

  const handleCollect = (code: string) => {
    // Copy code to clipboard
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => {
      setCopiedCode(null);
    }, 2000);

    // Save to collected list if not already there
    if (!collectedCodes.includes(code)) {
      const updated = [...collectedCodes, code];
      setCollectedCodes(updated);
      if (typeof window !== 'undefined') {
        localStorage.setItem('haniu_collected_coupons', JSON.stringify(updated));
      }
    }
  };

  // Filter coupons showing in popup banner
  const bannerCoupons = (coupons || []).filter(c => c.active && c.showInBanner);

  if (!isOpen || bannerCoupons.length === 0) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop with premium blur */}
      <div
        className="absolute inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-md transition-opacity duration-300 cursor-pointer"
        onClick={() => setIsOpen(false)}
      />

      {/* Modal Container: Premium Rounded Card with Glow Effects */}
      <div className="relative w-full max-w-md bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl rounded-[32px] overflow-hidden shadow-[0_32px_64px_-15px_rgba(244,63,94,0.25)] border border-rose-100/50 dark:border-zinc-800/50 animate-scale-up z-10 flex flex-col transition-all duration-300">
        
        {/* Glow Effects inside Modal */}
        <div className="absolute -top-20 -right-20 w-48 h-48 bg-rose-500/20 dark:bg-rose-500/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-amber-500/15 dark:bg-amber-500/25 rounded-full blur-3xl pointer-events-none" />

        {/* Header Ribbon / Premium Gradient Background */}
        <div className="bg-gradient-to-tr from-rose-500 via-rose-600 to-amber-500 p-8 px-12 text-white text-center relative select-none overflow-hidden">
          {/* Subtle grid pattern / overlay */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent scale-150" />
          
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 border border-white/10 rounded-full p-2 transition-all cursor-pointer z-10 hover:rotate-90 duration-300"
            title="Đóng"
          >
            <Icon name="close" size={14} />
          </button>
          
          <div className="mx-auto w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-3 shadow-lg border border-white/30 transform hover:scale-110 transition-transform duration-300">
            <Icon name="gift" size={26} className="text-white animate-bounce" />
          </div>
          
          <h3 className="text-xl font-bold tracking-wide leading-tight text-white drop-shadow-md">
            Quà Tặng Độc Quyền Haniu
          </h3>
          <p className="text-xs text-rose-100/90 mt-1.5 font-medium max-w-xs mx-auto">
            Nhận ngay các mã voucher giảm giá cực hời cho đơn hàng của bạn!
          </p>
        </div>

        {/* Voucher List Content */}
        <div className="p-6 space-y-4 max-h-[50vh] overflow-y-auto scrollbar-thin relative z-10 bg-slate-50/40 dark:bg-zinc-950/20">
          {bannerCoupons.map((voucher) => {
            const isCopied = copiedCode === voucher.code;
            const isCollected = collectedCodes.includes(voucher.code);
            const isUsed = usedCodes.includes(voucher.code);

            const discountLabel = voucher.discountType === 'PERCENT'
              ? `Giảm ${voucher.discountValue}%`
              : `Giảm ${voucher.discountValue.toLocaleString()}đ`;
            const minOrderLabel = voucher.minOrderValue 
              ? `Đơn từ ${(voucher.minOrderValue).toLocaleString()}đ`
              : 'Đơn từ 0đ';

            return (
              <div
                key={voucher.id || voucher.code}
                className={`bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-2xl flex items-stretch shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group ${
                  isUsed ? 'opacity-60' : ''
                }`}
              >
                {/* Left side discount tag */}
                <div className={`w-24 text-white flex flex-col justify-center items-center p-3 text-center relative shrink-0 ${
                  isUsed 
                    ? 'bg-zinc-400 dark:bg-zinc-700' 
                    : 'bg-gradient-to-br from-rose-500 to-rose-600'
                }`}>
                  <span className="text-[10px] font-bold opacity-90 uppercase tracking-widest">GIẢM</span>
                  <span className="text-xl font-black tracking-tight mt-0.5">
                    {voucher.discountType === 'PERCENT' ? `${voucher.discountValue}%` : `${(voucher.discountValue / 1000)}k`}
                  </span>
                  
                  {/* Elegant dashed line on the right edge */}
                  <div className="absolute right-0 top-3 bottom-3 w-[1px] border-r border-dashed border-white/40" />
                </div>

                {/* Right side content */}
                <div className="flex-1 p-4 pl-5 flex flex-col justify-between gap-3 relative">
                  {/* Top and Bottom Ticket Cutouts */}
                  <div className="absolute -left-2.5 -top-2.5 w-5 h-5 rounded-full bg-slate-50 dark:bg-zinc-950 border border-slate-100 dark:border-zinc-800" />
                  <div className="absolute -left-2.5 -bottom-2.5 w-5 h-5 rounded-full bg-slate-50 dark:bg-zinc-950 border border-slate-100 dark:border-zinc-800" />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold text-rose-500 bg-rose-50 dark:bg-rose-950/30 px-2 py-0.5 rounded-full border border-rose-100/30 dark:border-rose-900/30">
                        {minOrderLabel}
                      </span>
                      {isUsed && (
                        <span className="text-[9px] font-bold text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-full">
                          Đã dùng
                        </span>
                      )}
                    </div>
                    
                    <h4 className="text-xs font-bold text-slate-800 dark:text-zinc-200 mt-2 flex items-center gap-1">
                      Mã: 
                      <span className="font-mono text-sm text-slate-900 dark:text-white font-bold bg-slate-100 dark:bg-zinc-800 px-2 py-0.5 rounded select-all border border-slate-200/50 dark:border-zinc-700/50">
                        {voucher.code}
                      </span>
                    </h4>

                    {voucher.description && (
                      <p className="text-[10px] text-slate-500 dark:text-zinc-400 mt-1.5 leading-relaxed">
                        {voucher.description}
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => handleCollect(voucher.code)}
                    disabled={isUsed}
                    className={`w-full text-center text-xs font-bold py-2 rounded-xl transition-all duration-200 cursor-pointer shadow-sm hover:scale-[1.02] active:scale-95 ${
                      isUsed
                        ? 'bg-zinc-100 dark:bg-zinc-800/80 text-zinc-400 dark:text-zinc-500 border border-zinc-200 dark:border-zinc-750 pointer-events-none'
                        : isCopied
                        ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/10'
                        : isCollected
                        ? 'bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900/50'
                        : 'bg-slate-900 hover:bg-slate-800 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-white shadow-slate-900/5'
                    }`}
                  >
                    {isUsed ? (
                      'Đã sử dụng'
                    ) : isCopied ? (
                      <span className="flex items-center justify-center gap-1">
                        <Icon name="check" size={12} /> Đã sao chép
                      </span>
                    ) : isCollected ? (
                      'Đã thu thập'
                    ) : (
                      'Thu thập'
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-5 bg-slate-50 dark:bg-zinc-950/50 border-t border-slate-100 dark:border-zinc-800 text-center flex flex-col items-center gap-1 relative z-10">
          <button
            onClick={() => setIsOpen(false)}
            className="text-sm font-semibold text-rose-500 hover:text-rose-600 dark:hover:text-rose-455 transition-colors cursor-pointer flex items-center gap-1 group"
          >
            Mua sắm ngay thôi
            <span className="transform group-hover:translate-x-1 transition-transform">→</span>
          </button>
        </div>
      </div>
    </div>
  );
}
