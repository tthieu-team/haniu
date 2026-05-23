'use client';

import { useEffect, useRef } from 'react';

export default function BackToTop() {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const circleRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const radius = 20;
    const circumference = 2 * Math.PI * radius; // ~125.66

    // Set initial values
    if (circleRef.current) {
      circleRef.current.style.strokeDasharray = `${circumference}`;
      circleRef.current.style.strokeDashoffset = `${circumference}`;
    }

    let ticked = false;

    const handleScroll = () => {
      if (!ticked) {
        window.requestAnimationFrame(() => {
          const scrollTop = window.scrollY;
          const docHeight = document.documentElement.scrollHeight - window.innerHeight;
          
          // 1. Update circle progress
          if (circleRef.current && docHeight > 0) {
            const progress = Math.min(Math.max(scrollTop / docHeight, 0), 1);
            const offset = circumference - progress * circumference;
            circleRef.current.style.strokeDashoffset = `${offset}`;
          }

          // 2. Toggle button visibility classes
          if (buttonRef.current) {
            if (scrollTop > 300) {
              buttonRef.current.style.opacity = '1';
              buttonRef.current.style.transform = 'translateY(0) scale(1)';
              buttonRef.current.style.pointerEvents = 'auto';
            } else {
              buttonRef.current.style.opacity = '0';
              buttonRef.current.style.transform = 'translateY(16px) scale(0.75)';
              buttonRef.current.style.pointerEvents = 'none';
            }
          }

          ticked = false;
        });
        ticked = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <button
      ref={buttonRef}
      onClick={scrollToTop}
      style={{
        bottom: '96px',
        opacity: 0,
        transform: 'translateY(16px) scale(0.75)',
        pointerEvents: 'none',
        transition: 'opacity 300ms ease, transform 300ms ease',
      }}
      className="fixed right-6 z-50 flex items-center justify-center w-12 h-12 rounded-full bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md shadow-lg border border-slate-200/50 dark:border-zinc-800/80 cursor-pointer hover:scale-110! active:scale-95! group focus:outline-none"
      aria-label="Scroll to top"
    >
      {/* Scroll Progress SVG Circle */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 48 48">
        {/* Track circle (faint background) */}
        <circle
          cx="24"
          cy="24"
          r={20}
          fill="none"
          stroke="currentColor"
          strokeWidth={3}
          className="text-slate-100 dark:text-zinc-800/40"
        />
        {/* Animated Progress Circle */}
        <circle
          ref={circleRef}
          cx="24"
          cy="24"
          r={20}
          fill="none"
          stroke="url(#progressGradient)"
          strokeWidth={3}
          strokeLinecap="round"
          style={{
            transform: 'rotate(-90deg)',
            transformOrigin: 'center',
            willChange: 'stroke-dashoffset',
          }}
        />
        {/* SVG Gradient definition */}
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f43f5e" /> {/* rose-500 */}
            <stop offset="100%" stopColor="#f59e0b" /> {/* amber-500 */}
          </linearGradient>
        </defs>
      </svg>

      {/* Up Arrow Icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        className="w-5 h-5 text-slate-700 dark:text-zinc-300 group-hover:text-rose-500 dark:group-hover:text-rose-400 group-hover:-translate-y-0.5 transition-all duration-300 relative z-10"
        strokeWidth="2.5"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
      </svg>
    </button>
  );
}
