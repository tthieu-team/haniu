'use client';

import { HeroSlide } from '@/store/homeLayout';
import Icon from '@/components/common/Icons';
import { getFullImageUrl } from '@/lib/api';

interface BannerCardProps {
  slide: HeroSlide;
  isMain: boolean;
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

export default function BannerCard({ slide, isMain, onOccasionSelect }: BannerCardProps) {
  if (!slide) return null;
  const isRight = slide.textLayout === 'right';
  const isCenter = slide.textLayout === 'center';

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
    <div className="relative w-full h-full overflow-hidden rounded-[24px] bg-[#FFF9F9] dark:bg-zinc-900 border border-rose-100/40 dark:border-zinc-800 shadow-xs flex">
      {isCenter ? (
        <>
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
              <img
                src={getFullImageUrl(slide.backgroundImage) || slide.backgroundImage}
                alt={slide.boldTitle || 'Banner'}
                className="w-full h-full object-cover object-center"
              />
            )}
            <div className="absolute inset-0 bg-[#FFF9F9]/80 dark:bg-zinc-900/80 backdrop-blur-[1px]" />
          </div>
          <div className="relative z-10 w-full h-full flex flex-col justify-center items-center text-center p-6 sm:p-8 space-y-4">
            {slide.badgeText && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 dark:bg-rose-950/40 border border-rose-100 dark:border-rose-900/30 px-3.5 py-1 text-[10px] font-bold uppercase tracking-wider text-rose-500 dark:text-rose-300">
                <Icon name="heart" size={10} className="fill-rose-500 text-rose-500 dark:fill-rose-300 dark:text-rose-300 animate-pulse" />
                {slide.badgeText}
              </span>
            )}
            <h2 className="leading-tight text-slate-800 dark:text-zinc-150">
              {slide.scriptTitle && (
                <span className="block font-script text-3xl sm:text-4xl text-rose-500 italic font-normal tracking-wide leading-none mb-1">
                  {slide.scriptTitle}
                </span>
              )}
              {slide.boldTitle && (
                <span className="block font-serif text-2xl sm:text-4xl font-bold uppercase tracking-wide text-slate-800 dark:text-white">
                  {slide.boldTitle}
                </span>
              )}
            </h2>
            <p className="text-xs text-slate-600 dark:text-zinc-400 font-light leading-relaxed max-w-md">
              {slide.subtitle}
            </p>
            <div className="pt-2">
              <a
                href={slide.ctaHref}
                onClick={(e) => handleCtaClick(e, slide.ctaHref)}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-rose-400 to-rose-500 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:shadow-lg hover:shadow-rose-500/30 hover:scale-[1.03] hover:-translate-y-0.5 active:scale-95 transition-all duration-300 cursor-pointer"
              >
                <span>{slide.ctaText}</span>
                <Icon name="arrow-right" size={12} />
              </a>
            </div>
          </div>
        </>
      ) : (
        <div className={`w-full h-full flex flex-col ${isRight ? 'sm:flex-row' : 'sm:flex-row-reverse'}`}>
          {/* Image/Video Pane */}
          <div className="w-full sm:w-1/2 relative h-48 sm:h-full overflow-hidden shrink-0">
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
              <img
                src={getFullImageUrl(slide.backgroundImage) || slide.backgroundImage}
                alt={slide.boldTitle || 'Banner'}
                className="w-full h-full object-cover object-center transition-transform duration-700 hover:scale-105"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />

            {slide.cardTitle && (
              <div className="absolute bottom-4 left-4 z-10 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-xs px-3 py-1.5 rounded-[16px] border border-dashed border-rose-100 dark:border-zinc-800/80 shadow-xs flex flex-col items-center">
                <h4 className="text-[9px] font-bold text-slate-800 dark:text-zinc-200 tracking-wider uppercase leading-none">{slide.cardTitle}</h4>
                {slide.cardSubtitle && (
                  <span className="font-script text-[11px] sm:text-xs text-rose-500 dark:text-rose-400 mt-0.5 leading-none">{slide.cardSubtitle}</span>
                )}
              </div>
            )}
          </div>

          {/* Text Pane */}
          <div className="w-full sm:w-1/2 p-6 sm:p-8 flex flex-col justify-center space-y-3 sm:space-y-4 bg-white/40 dark:bg-zinc-900/40">
            {slide.badgeText && (
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 dark:bg-rose-950/40 border border-rose-100 dark:border-rose-900/30 px-3 py-1 text-[9px] font-bold uppercase tracking-wider text-rose-500 dark:text-rose-300">
                  <Icon name="heart" size={8} className="fill-rose-500 text-rose-500 dark:fill-rose-300 dark:text-rose-300 animate-pulse" />
                  {slide.badgeText}
                </span>
              </div>
            )}

            <h2 className="leading-tight text-slate-800 dark:text-zinc-150">
              {slide.scriptTitle && (
                <span className="block font-script text-2xl sm:text-3xl text-rose-500 dark:text-rose-450 italic font-normal tracking-wide leading-none mb-1">
                  {slide.scriptTitle}
                </span>
              )}
              {slide.boldTitle && (
                <span className={`block font-serif font-bold uppercase tracking-wide leading-snug text-slate-800 dark:text-white ${isMain
                    ? 'text-2xl sm:text-3xl md:text-4xl'
                    : 'text-lg sm:text-xl md:text-2xl'
                  }`}>
                  {slide.boldTitle}
                </span>
              )}
            </h2>

            <p className="text-xs text-slate-650 dark:text-zinc-400 font-light leading-relaxed max-w-sm">
              {slide.subtitle}
            </p>

            <div className="pt-1">
              <a
                href={slide.ctaHref}
                onClick={(e) => handleCtaClick(e, slide.ctaHref)}
                className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-rose-400 to-rose-500 px-4.5 py-2 text-[10px] sm:text-xs font-bold text-white shadow-xs hover:shadow-md hover:shadow-rose-500/20 hover:scale-[1.03] hover:-translate-y-0.5 active:scale-95 transition-all duration-300 cursor-pointer"
              >
                <span>{slide.ctaText}</span>
                <Icon name="arrow-right" size={10} />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
