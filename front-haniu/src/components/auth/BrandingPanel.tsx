'use client';

import Link from 'next/link';
import Icon from '@/components/common/Icons';
import LogoSvg from '@/components/common/LogoSvg';

export default function BrandingPanel() {
  const benefits = [
    {
      icon: 'gift',
      title: 'Hộp quà độc bản',
      iconColor: 'text-amber-500 bg-amber-500/10'
    },
    {
      icon: 'truck',
      title: 'Giao hỏa tốc 2H',
      iconColor: 'text-rose-500 bg-rose-500/10'
    },
    {
      icon: 'shield',
      title: 'Thanh toán an toàn',
      iconColor: 'text-emerald-500 bg-emerald-500/10'
    }
  ];

  return (
    <div className="relative hidden lg:flex flex-col justify-between w-1/2 p-10 xl:p-12 bg-gradient-to-br from-rose-50 via-amber-50/50 to-rose-100/50 dark:from-zinc-900 dark:via-zinc-900/80 dark:to-zinc-950 border-r border-slate-100 dark:border-zinc-800 overflow-hidden">
      {/* Decorative Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#f43f5e05_1px,transparent_1px),linear-gradient(to_bottom,#f43f5e05_1px,transparent_1px)] bg-[size:24px_24px] dark:bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)]" />

      {/* Background Decorative Blobs */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-rose-300/20 dark:bg-rose-950/15 blur-3xl animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-amber-200/25 dark:bg-amber-950/15 blur-3xl" />

      {/* Header Info */}
      <div className="relative z-10">
        <Link href="/" className="inline-flex items-center gap-2.5 mb-6 group">
          <LogoSvg className="w-7 h-7 text-slate-800 dark:text-zinc-100" />
          <span className="text-2xl font-black tracking-tight bg-gradient-to-r from-amber-600 via-rose-500 to-amber-500 bg-clip-text text-transparent group-hover:opacity-90 transition-opacity">
            Haniu
          </span>
          <span className="text-xs font-bold tracking-widest text-slate-400 dark:text-zinc-550 uppercase">
            Shop Quà Tặng
          </span>
        </Link>

        <h2 className="text-3xl xl:text-4xl font-black text-slate-800 dark:text-white leading-tight tracking-tight">
          Nơi Lưu Giữ <br />
          <span className="bg-gradient-to-r from-rose-500 to-amber-500 bg-clip-text text-transparent">
            Khoảnh Khắc Kỷ Niệm
          </span>
        </h2>
        <p className="text-xs text-slate-400 dark:text-zinc-500 max-w-sm leading-relaxed mt-3">
          Mỗi hộp quà Haniu đều mang một thông điệp yêu thương được hoàn thiện tỉ mỉ nhất để gửi tới người thương yêu của bạn.
        </p>
      </div>

      {/* Centered Modern Geometric Logo Symbol (Artisanal Custom Bow) */}
      <div className="relative z-10 flex flex-col items-center justify-center my-auto py-8">
        <div className="relative group cursor-pointer">
          {/* Multiple layers of glowing ambient backgrounds */}
          <div className="absolute inset-0 bg-gradient-to-tr from-rose-500 to-amber-500 rounded-full blur-3xl opacity-20 group-hover:opacity-30 scale-125 transition-all duration-700" />
          
          {/* Glass Outer Shield */}
          <div className="relative flex items-center justify-center w-48 h-48 xl:w-52 xl:h-52 rounded-[2.5rem] xl:rounded-[3rem] bg-white/40 dark:bg-zinc-900/30 backdrop-blur-xl border border-white/60 dark:border-zinc-800/40 shadow-[0_30px_100px_rgba(244,63,94,0.1)] dark:shadow-black/60 transition-all duration-700 group-hover:scale-105 group-hover:rotate-3">
            
            {/* Spinning decorative frame */}
            <div className="absolute inset-3 rounded-[2rem] xl:rounded-[2.5rem] border border-dashed border-rose-500/20 dark:border-amber-500/20 animate-[spin_60s_linear_infinite]" />
            
            {/* Inner Gold Gradient Circle */}
            <div className="absolute inset-6 rounded-[1.8rem] xl:rounded-[2rem] bg-gradient-to-tr from-rose-500/5 to-amber-500/5 border border-white/40 dark:border-zinc-800/20 flex items-center justify-center">
              
              {/* Modern Abstract logo-transparent.png */}
              <LogoSvg className="w-24 h-24 xl:w-28 xl:h-28 text-slate-800 dark:text-zinc-100 drop-shadow-[0_8px_16px_rgba(244,63,94,0.25)]" />

            </div>
          </div>
        </div>

        {/* Small Elegant Monogram Text */}
        <div className="mt-6 text-center space-y-1">
          <p className="text-[10px] font-bold tracking-[0.3em] text-rose-500/80 dark:text-amber-500/80 uppercase">
            Haniu Emblem
          </p>
          <p className="text-[9px] font-medium text-slate-400 dark:text-zinc-550 italic">
            "Artisanal Craftsmanship & Luxury Packaging"
          </p>
        </div>
      </div>

      {/* Platform Benefits (Simplified Horizontal Badges Grid) */}
      <div className="relative z-10 grid grid-cols-3 gap-3 pt-6 border-t border-slate-100/80 dark:border-zinc-800/40">
        {benefits.map((benefit, index) => (
          <div key={index} className="flex flex-col items-center text-center space-y-1.5 group/item">
            <div className={`p-2.5 rounded-2xl flex items-center justify-center transition-transform group-hover/item:scale-110 duration-300 ${benefit.iconColor}`}>
              <Icon name={benefit.icon} size={15} />
            </div>
            <span className="text-[10px] xl:text-[11px] font-bold text-slate-600 dark:text-zinc-300">
              {benefit.title}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
