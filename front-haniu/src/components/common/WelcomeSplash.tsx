'use client';

import { useState, useEffect } from 'react';
import { useHomeLayoutStore } from '@/store/homeLayout';
import Icon from '@/components/common/Icons';

export default function WelcomeSplash() {
  const { isEnabled, welcomeText, welcomeSubtitle, durationMs } = useHomeLayoutStore(
    (state) => state.welcomeScreen
  );

  const [show, setShow] = useState(false);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    if (!isEnabled) return;

    // Chỉ hiện 1 lần mỗi session - không hiện lại khi chuyển trang
    const alreadyShown = sessionStorage.getItem('haniu_splash_shown');
    if (alreadyShown) return;

    sessionStorage.setItem('haniu_splash_shown', '1');
    setShow(true);

    // Fade out slightly before the end of the duration
    const fadeTimeout = setTimeout(() => {
      setFade(true);
    }, durationMs - 500);

    // Unmount after complete duration
    const removeTimeout = setTimeout(() => {
      setShow(false);
    }, durationMs);

    return () => {
      clearTimeout(fadeTimeout);
      clearTimeout(removeTimeout);
    };
  }, [isEnabled, durationMs]);

  if (!isEnabled || !show) return null;

  return (
    <div
      className={`fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 via-white to-zinc-100 text-slate-800 dark:from-zinc-950 dark:via-neutral-950 dark:to-stone-950 dark:text-white transition-opacity duration-500 ease-out select-none ${fade ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
    >
      {/* Decorative radial glows */}
      <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-rose-500/[0.04] dark:bg-rose-500/10 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-amber-500/[0.04] dark:bg-amber-500/10 rounded-full blur-[120px] pointer-events-none animate-pulse duration-4000" />
 
      {/* Main content container */}
      <div className="text-center space-y-6 max-w-md px-6 flex flex-col items-center">
        {/* Pulsing luxury logo icon */}
        <div className="relative animate-bounce duration-[2000ms]">
          <div className="absolute inset-0 bg-rose-500/25 blur-xl rounded-full scale-125 animate-ping duration-[3000ms]" />
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center border border-slate-200/50 dark:border-white/10 shadow-xl shadow-rose-500/10 dark:shadow-rose-500/20 animate-pulse">
            <Icon name="✨" size={28} className="text-white" />
          </div>
        </div>
 
        {/* Brand Name Text with Gradient and Drawing effect */}
        <div className="space-y-3">
          <h1 className="text-4xl md:text-5xl font-black tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-slate-800 via-rose-500 to-amber-500 dark:from-white dark:via-slate-100 dark:to-rose-250 uppercase animate-fade-in-up duration-700">
            {welcomeText}
          </h1>
          <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-light tracking-[0.15em] uppercase max-w-xs mx-auto leading-relaxed animate-fade-in-up duration-1000">
            {welcomeSubtitle}
          </p>
        </div>
 
        {/* Loading Progress Line */}
        <div className="w-32 h-[1px] bg-slate-200/80 dark:bg-white/10 rounded-full overflow-hidden relative mt-8">
          <div
            className="h-full bg-gradient-to-r from-rose-500 to-amber-500 rounded-full"
            style={{
              animation: `welcomeLoader ${durationMs - 200}ms cubic-bezier(0.25, 1, 0.5, 1) forwards`
            }}
          />
        </div>
      </div>

      <style jsx global>{`
        @keyframes welcomeLoader {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        .animate-fade-in-up {
          animation: fadeInUp 1.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
