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
  onOccasionSelect?: (slug: string) => void;
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

export default function SliderHero({ hero, isSticky, isAnnouncementBar, onOccasionSelect }: SliderHeroProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const translate = useTranslate();

  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Minimum swipe distance in pixels
  const minSwipeDistance = 50;

  const slides = hero.slides || [];
  const autoplay = hero.autoplay !== false;
  const autoplaySpeed = hero.autoplaySpeed || 5000;

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    } else if (isRightSwipe) {
      setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
    }
  };

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

  const handleCtaClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!onOccasionSelect || !href) return;

    let slug = '';
    if (href.includes('/collections/')) {
      slug = href.split('/collections/')[1].split('?')[0].split('#')[0];
    } else if (href.includes('occasion=')) {
      try {
        const queryPart = href.split('?')[1] || '';
        const params = new URLSearchParams(queryPart);
        slug = params.get('occasion') || '';
      } catch (err) {
        console.error(err);
      }
    }

    if (slug) {
      e.preventDefault();
      // Normalize slug
      if (slug === 'graduation') slug = 'tot-nghiep';
      onOccasionSelect(slug);
    }
  };

  return (
    <section
      className="relative overflow-hidden w-full group flex flex-col"
      style={{
        height: '100vh',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
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
                {/* Subtle dark overlay for contrast and legibility */}
                <div className="absolute inset-0 bg-black/10 dark:bg-black/15" />
              </div>

              {/* Foreground content grid */}
              <div className={`relative z-10 h-full max-w-screen-2xl mx-auto px-4 sm:px-20 lg:px-28 xl:px-36 2xl:px-44 w-full flex items-center ${isSticky
                ? (isAnnouncementBar ? 'pt-16 sm:pt-28' : 'pt-14 sm:pt-22')
                : ''
                }`}>
                {/* Floating stamp in the corner of the slide to prevent overlap */}
                {slide.circleBadgeText && (
                  <div className={`absolute z-20 pointer-events-none hidden sm:block top-20 sm:top-28 lg:top-32 xl:top-36 ${slide.textLayout === 'left'
                      ? 'right-4 sm:right-20 lg:right-28 xl:right-36 2xl:right-44'
                      : 'left-4 sm:left-20 lg:left-28 xl:left-36 2xl:left-44'
                    }`}>
                    <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center">
                      {/* Rotating SVG */}
                      <svg viewBox="0 0 100 100" className="w-full h-full animate-spin-slow">
                        <path
                          id={`circlePath-${idx}`}
                          d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
                          fill="transparent"
                        />
                        <text className="text-[8.5px] font-extrabold fill-white dark:fill-white tracking-[0.15em] uppercase font-sans">
                          <textPath href={`#circlePath-${idx}`} startOffset="0%">
                            {translate(slide.circleBadgeText)}
                          </textPath>
                        </text>
                      </svg>
                      {/* Central Heart */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Icon name="heart" size={10} className="fill-white text-white dark:fill-white dark:text-white" />
                      </div>
                    </div>
                  </div>
                )}

                <div className={`w-full flex justify-center ${slide.textLayout === 'left'
                  ? 'sm:justify-start'
                  : slide.textLayout === 'right'
                    ? 'sm:justify-end'
                    : 'sm:justify-center'
                  }`}>
                  {/* Content card */}
                  <div className={`relative max-w-[540px] w-full space-y-5 md:space-y-6 text-center ${slide.textLayout === 'left'
                    ? 'sm:text-left'
                    : slide.textLayout === 'right'
                      ? 'sm:text-right'
                      : 'sm:text-center'
                    }`}>
                    {/* Badge */}
                    {slide.badgeText && (
                      <div className={`flex justify-center ${slide.textLayout === 'left'
                        ? 'sm:justify-start'
                        : slide.textLayout === 'right'
                          ? 'sm:justify-end'
                          : 'sm:justify-center'
                        }`}>
                        <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.25em] text-rose-500 bg-rose-500/10 dark:bg-rose-500/10 border border-rose-500/20">
                          <Icon name="heart" size={10} className="fill-rose-500 text-rose-500 dark:fill-rose-400 dark:text-rose-400 animate-pulse" />
                          {translate(slide.badgeText)}
                        </span>
                      </div>
                    )}

                    {/* Heading Typography combination */}
                    <div className="relative">
                      <h1 className="leading-tight sm:leading-none text-white select-none">
                        {slide.scriptTitle && (
                          <span className="block font-script text-2xl sm:text-5xl md:text-6xl text-rose-500 dark:text-rose-400 italic font-semibold tracking-wide leading-normal mb-1 sm:mb-[-0.1em] ml-1">
                            {translate(slide.scriptTitle)}
                          </span>
                        )}
                        {slide.boldTitle && (
                          <span className="block font-serif text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold uppercase tracking-[0.05em] leading-tight mt-1 text-white whitespace-normal sm:whitespace-nowrap">
                            {translate(slide.boldTitle)}
                          </span>
                        )}
                      </h1>
                    </div>

                    {/* Subtitle / Message */}
                    <p className={`text-xs sm:text-sm md:text-base text-zinc-200 dark:text-zinc-300 font-medium leading-relaxed max-w-sm sm:max-w-md mx-auto ${slide.textLayout === 'left'
                      ? 'sm:ml-0 sm:mr-auto'
                      : slide.textLayout === 'right'
                        ? 'sm:mr-0 sm:ml-auto'
                        : 'sm:mx-auto'
                      }`}>
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
                        onClick={(e) => handleCtaClick(e, slide.ctaHref)}
                        className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-rose-400 to-rose-500 hover:from-rose-500 hover:to-rose-600 text-white px-6 py-2.5 sm:px-8 sm:py-3.5 text-xs sm:text-base font-extrabold shadow-md hover:shadow-lg hover:shadow-rose-500/30 transition-all duration-300 cursor-pointer hover:scale-[1.04] hover:-translate-y-0.5 active:scale-95"
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
                <div className={`absolute bottom-6 sm:bottom-8 z-20 hidden md:flex flex-col items-center justify-center bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xs p-4 sm:p-5 rounded-[22px] border border-dashed border-rose-250 dark:border-zinc-800/80 shadow-md max-w-[190px] transition-all duration-500 hover:rotate-0 hover:scale-105 ${slide.textLayout === 'right'
                  ? 'left-8 sm:left-12 -rotate-3'
                  : 'right-8 sm:right-12 rotate-3'
                  }`}>
                  <div className="w-9 h-9 rounded-full bg-rose-50 dark:bg-rose-950/30 flex items-center justify-center mb-2">
                    <Icon name="gift" size={16} className="text-rose-500 dark:text-rose-400" />
                  </div>
                  <div className="text-center">
                    <h4 className="text-[10px] font-bold text-slate-800 dark:text-white tracking-wider uppercase mb-0.5">
                      {translate(slide.cardTitle)}
                    </h4>
                    <p className="font-script text-xs sm:text-sm text-rose-500 dark:text-rose-450 leading-tight">
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
            className="absolute left-2 sm:left-4 lg:left-8 top-1/2 -translate-y-1/2 z-30 flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-white/40 dark:bg-zinc-900/40 hover:bg-white/80 dark:hover:bg-zinc-800/80 border border-white/40 dark:border-zinc-700/40 text-rose-500 dark:text-rose-350 hover:text-rose-600 dark:hover:text-rose-200 hover:border-rose-450 dark:hover:border-rose-600 backdrop-blur-xs opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-300 shadow-md cursor-pointer hover:scale-105 active:scale-95"
            aria-label="Previous slide"
          >
            <Icon name="arrow-left" size={14} />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-2 sm:right-4 lg:right-8 top-1/2 -translate-y-1/2 z-30 flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-white/40 dark:bg-zinc-900/40 hover:bg-white/80 dark:hover:bg-zinc-800/80 border border-white/40 dark:border-zinc-700/40 text-rose-500 dark:text-rose-350 hover:text-rose-600 dark:hover:text-rose-200 hover:border-rose-450 dark:hover:border-rose-600 backdrop-blur-xs opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-300 shadow-md cursor-pointer hover:scale-105 active:scale-95"
            aria-label="Next slide"
          >
            <Icon name="arrow-right" size={14} />
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
                ? 'bg-rose-500 dark:bg-rose-400 w-6'
                : 'bg-rose-500/40 dark:bg-rose-400/30 w-2 hover:bg-rose-500/70 dark:hover:bg-rose-400/60'
                }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
