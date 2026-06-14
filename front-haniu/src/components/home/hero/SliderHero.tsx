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
              className={`absolute inset-0 w-full h-full transition-all duration-1000 ease-in-out ${
                isActive
                  ? 'opacity-100 scale-100 z-10 pointer-events-auto visible'
                  : 'opacity-0 scale-[1.02] z-0 pointer-events-none invisible'
              }`}
            >
              {/* Background Image Container */}
              <div className="absolute inset-0">
                <Image
                  src={getFullImageUrl(slide.backgroundImage) || slide.backgroundImage}
                  alt={translate(slide.boldTitle) || 'Banner image'}
                  fill
                  priority={idx === 0}
                  className="object-cover object-center"
                  sizes="100vw"
                />

                {/* Visual Enhancers / Aesthetic Overlays */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(253,244,245,0.4),transparent_60%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(254,243,199,0.2),transparent_50%)]" />

                {/* Gradient direction based on text alignment to protect readability */}
                <div className={`absolute inset-0 bg-[#FAF5F2]/92 dark:bg-zinc-950/90 sm:bg-transparent dark:sm:bg-transparent ${
                  slide.textLayout === 'left'
                    ? 'sm:bg-gradient-to-r sm:from-[#FAF5F2] sm:via-[#FAF5F2]/95 sm:to-transparent dark:sm:from-zinc-950/80 dark:sm:via-zinc-950/40 dark:sm:to-transparent'
                    : slide.textLayout === 'right'
                    ? 'sm:bg-gradient-to-l sm:from-[#FAF5F2] sm:via-[#FAF5F2]/95 sm:to-transparent dark:sm:from-zinc-950/80 dark:sm:via-zinc-950/40 dark:sm:to-transparent'
                    : 'bg-[#FAF5F2]/85 sm:bg-[#FAF5F2]/75 dark:bg-zinc-950/75 dark:sm:bg-zinc-950/50'
                }`} />
              </div>

              {/* Foreground content grid */}
              <div className="relative z-10 h-full max-w-screen-2xl mx-auto px-16 sm:px-20 lg:px-28 xl:px-36 2xl:px-44 w-full flex items-center">
                <div className={`w-full flex justify-center ${
                  slide.textLayout === 'left'
                    ? 'sm:justify-start'
                    : slide.textLayout === 'right'
                    ? 'sm:justify-end'
                    : 'sm:justify-center'
                }`}>
                  {/* Content card */}
                  <div className={`relative max-w-[520px] space-y-5 md:space-y-6 text-center ${
                    slide.textLayout === 'left'
                      ? 'sm:text-left'
                      : slide.textLayout === 'right'
                      ? 'sm:text-right'
                      : 'sm:text-center'
                  }`}>
                    {/* Badge */}
                    {slide.badgeText && (
                      <div className={`flex justify-center ${
                        slide.textLayout === 'left'
                          ? 'sm:justify-start'
                          : slide.textLayout === 'right'
                          ? 'sm:justify-end'
                          : 'sm:justify-center'
                      }`}>
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FCEBEA] dark:bg-rose-950/40 border border-[#F5D0CD] dark:border-rose-900/30 px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider text-[#C67B71] dark:text-rose-300 shadow-xs">
                          <Icon name="heart" size={10} className="fill-[#C67B71] text-[#C67B71] dark:fill-rose-300 dark:text-rose-300" />
                          {translate(slide.badgeText)}
                        </span>
                      </div>
                    )}

                    {/* Heading Typography combination */}
                    <div className="relative">
                      <h1 className="leading-tight sm:leading-none text-[#3A2312] dark:text-zinc-100 select-none">
                        {slide.scriptTitle && (
                          <span className="block font-script text-3xl sm:text-5xl md:text-6xl text-[#C67B71] dark:text-rose-400 italic font-normal tracking-wide leading-normal mb-1 sm:mb-[-0.1em] ml-1">
                            {translate(slide.scriptTitle)}
                          </span>
                        )}
                        {slide.boldTitle && (
                          <span className="block font-serif text-3xl sm:text-6xl md:text-7xl font-bold uppercase tracking-[0.05em] leading-tight mt-1">
                            {translate(slide.boldTitle)}
                          </span>
                        )}
                      </h1>

                      {/* Floating stamp inside text box to anchor the design */}
                      {slide.circleBadgeText && (
                        <div className="absolute -top-6 right-2 sm:-right-8 md:-right-12 z-20 pointer-events-none hidden sm:block">
                          <div className="relative w-24 h-24 sm:w-26 sm:h-26 flex items-center justify-center">
                            {/* Rotating SVG */}
                            <svg viewBox="0 0 100 100" className="w-full h-full animate-spin-slow">
                              <path
                                id={`circlePath-${idx}`}
                                d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
                                fill="transparent"
                              />
                              <text className="text-[7px] font-bold fill-[#C67B71]/70 tracking-[0.14em] uppercase font-sans">
                                <textPath href={`#circlePath-${idx}`} startOffset="0%">
                                  {translate(slide.circleBadgeText)}
                                </textPath>
                              </text>
                            </svg>
                            {/* Central Heart */}
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="text-[#C67B71] text-xs">❤️</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Subtitle / Message */}
                    <p className="text-xs sm:text-sm md:text-base text-[#5E4E43] dark:text-zinc-300 font-light leading-relaxed max-w-sm sm:max-w-md mx-auto sm:mx-0">
                      {translate(slide.subtitle)}
                    </p>

                    {/* Call to Action */}
                    <div className={`pt-2 flex justify-center ${
                      slide.textLayout === 'left'
                        ? 'sm:justify-start'
                        : slide.textLayout === 'right'
                        ? 'sm:justify-end'
                        : 'sm:justify-center'
                    }`}>
                      <a
                        href={slide.ctaHref}
                        className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#E07A7C] to-[#C67B71] px-7 py-3 text-xs sm:text-sm font-bold text-white shadow-lg shadow-[#C67B71]/25 hover:shadow-xl hover:shadow-[#C67B71]/40 hover:scale-[1.03] hover:-translate-y-0.5 active:scale-95 transition-all duration-300 cursor-pointer"
                      >
                        <Icon name="gift" size={13} className="text-white" />
                        <span>{translate(slide.ctaText)}</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating organic card tag in the bottom corner */}
              {slide.cardTitle && (
                <div className={`absolute bottom-6 sm:bottom-8 z-20 hidden md:flex flex-col items-center justify-center bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xs p-4 sm:p-5 rounded-[22px] border border-dashed border-[#F5D0CD] dark:border-zinc-800 shadow-md max-w-[190px] transition-all duration-500 hover:rotate-0 hover:scale-105 ${
                  slide.textLayout === 'right'
                    ? 'left-8 sm:left-12 -rotate-3'
                    : 'right-8 sm:right-12 rotate-3'
                }`}>
                  <div className="w-9 h-9 rounded-full bg-[#FCEBEA] dark:bg-rose-950/40 flex items-center justify-center mb-2">
                    <Icon name="gift" size={16} className="text-[#C67B71] dark:text-rose-400" />
                  </div>
                  <div className="text-center">
                    <h4 className="text-[10px] font-bold text-[#3A2312] dark:text-zinc-200 tracking-wider uppercase mb-0.5">
                      {translate(slide.cardTitle)}
                    </h4>
                    <p className="font-script text-xs sm:text-sm text-[#C67B71] dark:text-rose-400 leading-tight">
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
            className="absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 z-30 flex h-10 w-10 items-center justify-center rounded-full bg-white/40 dark:bg-zinc-900/40 hover:bg-white/80 dark:hover:bg-zinc-800/80 border border-white/40 dark:border-zinc-700/40 text-[#C67B71] dark:text-rose-400 backdrop-blur-xs opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-300 shadow-md cursor-pointer hover:scale-105 active:scale-95"
            aria-label="Previous slide"
          >
            <Icon name="arrow-left" size={16} />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 z-30 flex h-10 w-10 items-center justify-center rounded-full bg-white/40 dark:bg-zinc-900/40 hover:bg-white/80 dark:hover:bg-zinc-800/80 border border-white/40 dark:border-zinc-700/40 text-[#C67B71] dark:text-rose-400 backdrop-blur-xs opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-300 shadow-md cursor-pointer hover:scale-105 active:scale-95"
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
              className={`h-2 rounded-full cursor-pointer transition-all duration-350 ${
                idx === currentIndex
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
