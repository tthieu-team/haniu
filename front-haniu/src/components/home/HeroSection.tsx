'use client';

import { useHomeLayoutStore, DEFAULT_STATE } from '@/store/homeLayout';
import SliderHero from './hero/SliderHero';
import SplitGridHero from './hero/SplitGridHero';

interface HeroSectionProps {
  onOccasionSelect?: (slug: string) => void;
}

export default function HeroSection({ onOccasionSelect }: HeroSectionProps) {
  const hero = useHomeLayoutStore((state) => state.hero);
  const isVisible = useHomeLayoutStore((state) => state.visibility?.hero);
  const isSticky = useHomeLayoutStore((state) => state.header?.isSticky ?? DEFAULT_STATE.header.isSticky);
  const isAnnouncementBar = useHomeLayoutStore((state) => state.announcementBar?.isEnabled ?? DEFAULT_STATE.announcementBar.isEnabled);

  const activeHero = (hero?.slides && hero.slides.length > 0) ? hero : DEFAULT_STATE.hero;
  const showHero = isVisible !== false;

  if (!showHero || !activeHero?.slides?.length) return null;

  if (activeHero.layoutType === 'split-grid') {
    return (
      <SplitGridHero
        hero={activeHero}
        isSticky={isSticky}
        isAnnouncementBar={isAnnouncementBar}
        onOccasionSelect={onOccasionSelect}
      />
    );
  }

  return (
    <SliderHero
      hero={activeHero}
      isSticky={isSticky}
      isAnnouncementBar={isAnnouncementBar}
      onOccasionSelect={onOccasionSelect}
    />
  );
}
