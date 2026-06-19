'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { HeroConfig } from '@/store/homeLayout';
import Icon from '@/components/common/Icons';
import { getFullImageUrl } from '@/lib/api';
import { useTranslate } from '@/lib/translator';

interface SliderHeroProps {
  hero: HeroConfig;
  isSticky: boolean;
  isAnnouncementBar: boolean;
}

function isVideoUrl(url: string) {
  if (!url) return false;
  const cleanUrl = url.split('?')[0].split('#')[0].toLowerCase();
  return (
    cleanUrl.endsWith('.mp4') ||
    cleanUrl.endsWith('.webm') ||
    cleanUrl.endsWith('.ogg') ||
    cleanUrl.endsWith('.mov') ||
    url.includes('/uploads/products/videos') ||
    url.includes('/uploads/files/products/videos') ||
    url.includes('video')
  );
}

export default function SliderHero({ hero, isSticky, isAnnouncementBar }: SliderHeroProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const translate = useTranslate();

  const slides = hero.slides || [];
  const autoplay = hero.autoplay !== false;
  const autoplaySpeed = hero.autoplaySpeed || 5000;

  useEffect(() => {
    if (!autoplay || slides.length <= 1 || isHovered) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, autoplaySpeed);
    return () => clearInterval(interval);
  }, [autoplay, autoplaySpeed, slides.length, isHovered]);

  if (slides.length === 0) return null;

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  return (
    <section
      className="relative overflow-hidden w-full bg-[#FAF5F2] dark:bg-zinc-950 group flex flex-col"
      style={{
        height: '100vh',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Slides Container */}
      <div className="relative w-full flex-1">
        {slides.map((slide, idx) => {
          const isActive = idx === currentIndex;

          return (
            <div
              key={slide.id || idx}
              className={`absolute inset-0 w-full h-full transition-all duration-1000 ease-in-out ${isActive
                ? 'opacity-100 scale-100 z-10 pointer-events-auto visible'
                : 'opacity-0 scale-[1.02] z-0 pointer-events-none invisible'
                }`}
            >
              {/* Background Image/Video Container */}
              <div className="absolute inset-0">
                {isVideoUrl(slide.backgroundImage) ? (
                  <video
                    src={getFullImageUrl(slide.backgroundImage) || slide.backgroundImage}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover object-center"
                  />
                ) : (
                  <Image
                    src={getFullImageUrl(slide.backgroundImage) || slide.backgroundImage}
                    alt={translate(slide.boldTitle) || 'Banner image'}
                    fill
                    priority={idx === 0}
                    className="object-cover object-center"
                    sizes="100vw"
                  />
                )}

                {/* Visual Enhancers / Aesthetic Overlays */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(253,244,245,0.4),transparent_60%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(254,243,199,0.2),transparent_50%)]" />

                {/* Base dark mode screen dimmer to darken bright images globally in dark mode */}
                <div className="absolute inset-0 bg-transparent dark:bg-black/45 z-[1]" />

                {/* Gradient direction based on text alignment to protect readability */}
                <div className={`absolute inset-0 z-[2] bg-[#FAF5F2]/15 dark:bg-zinc-950/20 sm:bg-transparent ${slide.textLayout === 'left'
                  ? 'sm:bg-gradient-to-r sm:from-[#FAF5F2]/35 sm:via-[#FAF5F2]/10 sm:to-transparent dark:sm:from-zinc-950/80 dark:sm:via-zinc-950/45 dark:sm:to-transparent'
                  : slide.textLayout === 'right'
                    ? 'sm:bg-gradient-to-l sm:from-[#FAF5F2]/35 sm:via-[#FAF5F2]/10 sm:to-transparent dark:sm:from-zinc-950/80 dark:sm:via-zinc-950/45 dark:sm:to-transparent'
                    : 'bg-[#FAF5F2]/15 sm:bg-[#FAF5F2]/10 dark:bg-zinc-950/40 dark:sm:bg-zinc-950/30'
                  }`} />
              </div>

              {/* Foreground content grid */}
              <div className="relative z-10 h-full max-w-screen-2xl mx-auto px-16 sm:px-20 lg:px-28 xl:px-36 2xl:px-44 w-full flex items-center">
                <div className={`w-full flex justify-center ${slide.textLayout === 'left'
                  ? 'sm:justify-start'
                  : slide.textLayout === 'right'
                    ? 'sm:justify-end'
                    : 'sm:justify-center'
                  }`}>
                  {/* Content card */}
                  <div className={`relative max-w-[540px] space-y-5 md:space-y-6 text-center p-8 sm:p-10 md:p-12 rounded-3xl bg-white/25 dark:bg-black/35 backdrop-blur-2xl backdrop-saturate-[1.6] shadow-[0_20px_50px_rgba(179,146,95,0.12)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] ${slide.textLayout === 'left'
                    ? 'sm:text-left'
                    : slide.textLayout === 'right'
                      ? 'sm:text-right'
                      : 'sm:text-center'
                    }`}>
                    {/* Floating stamp in the top-right corner of the card to prevent overlap */}
                    {slide.circleBadgeText && (
                      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20 pointer-events-none hidden sm:block drop-shadow-[0_2px_4px_rgba(255,255,255,0.9)] dark:drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">
                        <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center">
                          {/* Rotating SVG */}
                          <svg viewBox="0 0 100 100" className="w-full h-full animate-spin-slow">
                            <path
                              id={`circlePath-${idx}`}
                              d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
                              fill="transparent"
                            />
                            <text className="text-[8.5px] font-extrabold fill-[#B3925F] dark:fill-[#E8D3B3] tracking-[0.15em] uppercase font-sans">
                              <textPath href={`#circlePath-${idx}`} startOffset="0%">
                                {translate(slide.circleBadgeText)}
                              </textPath>
                            </text>
                          </svg>
                          {/* Central Heart */}
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Icon name="heart" size={10} className="fill-[#B3925F] text-[#B3925F] dark:fill-[#E8D3B3] dark:text-[#E8D3B3]" />
                          </div>
                        </div>
                      </div>
                    )}
                    {/* Badge */}
                    {slide.badgeText && (
                      <div className={`flex justify-center ${slide.textLayout === 'left'
                        ? 'sm:justify-start'
                        : slide.textLayout === 'right'
                          ? 'sm:justify-end'
                          : 'sm:justify-center'
                        }`}>
                        <span className="inline-flex items-center gap-2 text-[10px] sm:text-[11.5px] font-extrabold uppercase tracking-[0.25em] text-[#B3925F] dark:text-[#E8D3B3] drop-shadow-[0_1px_3px_rgba(255,255,255,0.8)] dark:drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                          <Icon name="heart" size={11} className="fill-[#B3925F] text-[#B3925F] dark:fill-[#E8D3B3] dark:text-[#E8D3B3] animate-pulse" />
                          {translate(slide.badgeText)}
                        </span>
                      </div>
                    )}

                    {/* Heading Typography combination */}
                    <div className="relative">
                      <h1 className="leading-tight sm:leading-none text-[#2C2520] dark:text-white select-none drop-shadow-[0_2px_10px_rgba(255,255,255,0.95)] dark:drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)]">
                        {slide.scriptTitle && (
                          <span className="block font-script text-3xl sm:text-5xl md:text-6xl text-[#B3925F] dark:text-[#E8D3B3] italic font-semibold tracking-wide leading-normal mb-1 sm:mb-[-0.1em] ml-1 drop-shadow-[0_1.5px_4px_rgba(255,255,255,0.6)] dark:drop-shadow-[0_1.5px_4px_rgba(0,0,0,0.6)]">
                            {translate(slide.scriptTitle)}
                          </span>
                        )}
                        {slide.boldTitle && (
                          <span className="block font-serif text-3xl sm:text-6xl md:text-7xl font-extrabold uppercase tracking-[0.05em] leading-tight mt-1 text-[#2C2520] dark:text-white">
                            {translate(slide.boldTitle)}
                          </span>
                        )}
                      </h1>
                    </div>

                    {/* Subtitle / Message */}
                    <p className="text-xs sm:text-sm md:text-base text-[#5F554E] dark:text-[#E2DED9] font-medium leading-relaxed max-w-sm sm:max-w-md mx-auto sm:mx-0 drop-shadow-[0_1.5px_6px_rgba(255,255,255,0.95)] dark:drop-shadow-[0_1.5px_6px_rgba(0,0,0,0.95)]">
                      {translate(slide.subtitle)}
                    </p>

                    {/* Call to Action */}
                    <div className={`pt-2 flex justify-center ${slide.textLayout === 'left'
                      ? 'sm:justify-start'
                      : slide.textLayout === 'right'
                        ? 'sm:justify-end'
                        : 'sm:justify-center'
                      }`}>
                      <a
                        href={slide.ctaHref}
                        className="inline-flex items-center justify-center gap-2 rounded-full border border-[#B3925F] text-[#B3925F] bg-transparent dark:border-[#E8D3B3] dark:text-[#E8D3B3] hover:bg-[#B3925F] hover:text-white dark:hover:bg-[#E8D3B3] dark:hover:text-[#1A1510] px-8 py-3.5 text-sm sm:text-base font-extrabold shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-[1.04] hover:-translate-y-0.5 active:scale-95"
                      >
                        <Icon name="gift" size={15} className="text-current" />
                        <span>{translate(slide.ctaText)}</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating organic card tag in the bottom corner */}
              {slide.cardTitle && (
                <div className={`absolute bottom-6 sm:bottom-8 z-20 hidden md:flex flex-col items-center justify-center bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xs p-4 sm:p-5 rounded-[22px] border border-dashed border-[#F5D0CD] dark:border-zinc-800 shadow-md max-w-[190px] transition-all duration-500 hover:rotate-0 hover:scale-105 ${slide.textLayout === 'right'
                  ? 'left-8 sm:left-12 -rotate-3'
                  : 'right-8 sm:right-12 rotate-3'
                  }`}>
                  <div className="w-9 h-9 rounded-full bg-[#FCEBEA] dark:bg-rose-950/40 flex items-center justify-center mb-2">
                    <Icon name="gift" size={16} className="text-[#A64F43] dark:text-rose-300" />
                  </div>
                  <div className="text-center">
                    <h4 className="text-[10px] font-bold text-[#1C0F06] dark:text-white tracking-wider uppercase mb-0.5">
                      {translate(slide.cardTitle)}
                    </h4>
                    <p className="font-script text-xs sm:text-sm text-[#A64F43] dark:text-rose-350 leading-tight">
                      {translate(slide.cardSubtitle)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Navigation chevrons (shown on hover/always on mobile) */}
      {slides.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 z-30 flex h-10 w-10 items-center justify-center rounded-full bg-white/40 dark:bg-zinc-900/40 hover:bg-white/80 dark:hover:bg-zinc-800/80 border border-white/40 dark:border-zinc-700/40 text-[#A64F43] dark:text-rose-300 backdrop-blur-xs opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-300 shadow-md cursor-pointer hover:scale-105 active:scale-95"
            aria-label="Previous slide"
          >
            <Icon name="arrow-left" size={16} />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 z-30 flex h-10 w-10 items-center justify-center rounded-full bg-white/40 dark:bg-zinc-900/40 hover:bg-white/80 dark:hover:bg-zinc-800/80 border border-white/40 dark:border-zinc-700/40 text-[#A64F43] dark:text-rose-300 backdrop-blur-xs opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-300 shadow-md cursor-pointer hover:scale-105 active:scale-95"
            aria-label="Next slide"
          >
            <Icon name="arrow-right" size={16} />
          </button>
        </>
      )}

      {/* Dots navigation */}
      {slides.length > 1 && (
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-30 flex gap-2 items-center justify-center">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2 rounded-full cursor-pointer transition-all duration-350 ${idx === currentIndex
                ? 'bg-[#C67B71] dark:bg-rose-400 w-6'
                : 'bg-[#C67B71]/40 dark:bg-rose-400/30 w-2 hover:bg-[#C67B71]/70 dark:hover:bg-rose-400/60'
                }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
