'use client';

import { HeroConfig } from '@/store/homeLayout';
import BannerCard from './BannerCard';
import FeatureCard from './FeatureCard';

interface SplitGridHeroProps {
  hero: HeroConfig;
  isSticky: boolean;
  isAnnouncementBar: boolean;
  onOccasionSelect?: (slug: string) => void;
}

export default function SplitGridHero({ hero, isSticky, isAnnouncementBar, onOccasionSelect }: SplitGridHeroProps) {
  const slides = hero.slides || [];
  const mainSlide = slides.find(s => s.id === hero.gridMainSlideId) || slides[0];
  const subSlide = slides.find(s => s.id === hero.gridSubSlideId) || slides[1] || slides[0];
  const features = hero.gridFeatures || [];

  return (
    <section
      className={`w-full bg-[#FAF5F2] dark:bg-zinc-950 py-6 sm:py-10 ${
        isSticky
          ? (isAnnouncementBar ? 'pt-24 sm:pt-28 md:pt-32' : 'pt-20 sm:pt-22 md:pt-24')
          : 'pt-6'
      }`}
    >
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-16 2xl:px-24 w-full">
        <div className="flex flex-col gap-6 lg:grid lg:grid-cols-12 lg:h-[600px] xl:h-[700px] 2xl:h-[780px]">
          {/* Left Block (Main Banner) */}
          <div className="lg:col-span-7 xl:col-span-8 h-[400px] sm:h-[500px] lg:h-full">
            <BannerCard slide={mainSlide} isMain={true} onOccasionSelect={onOccasionSelect} />
          </div>

          {/* Right Block (Column Container) */}
          <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-6 h-auto lg:h-full">
            {/* Top-Right (Sub Banner) */}
            <div className="flex-grow flex-shrink min-h-[220px] lg:h-auto">
              <BannerCard slide={subSlide} isMain={false} onOccasionSelect={onOccasionSelect} />
            </div>

            {/* Bottom-Right (3 Feature Cards) */}
            <div className="sm:h-[200px] lg:h-[220px] grid grid-cols-1 sm:grid-cols-3 gap-4 flex-shrink-0">
              {features.map((card) => (
                <FeatureCard key={card.id} card={card} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
