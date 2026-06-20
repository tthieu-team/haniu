'use client';

import { useHomeLayoutStore } from '@/store/homeLayout';
import SliderHero from './hero/SliderHero';
import SplitGridHero from './hero/SplitGridHero';

interface HeroSectionProps {
  onOccasionSelect?: (slug: string) => void;
}

export default function HeroSection({ onOccasionSelect }: HeroSectionProps) {
  const hero = useHomeLayoutStore((state) => state.hero);
  const isVisible = useHomeLayoutStore((state) => state.visibility.hero);
  const isSticky = useHomeLayoutStore((state) => state.header.isSticky);
  const isAnnouncementBar = useHomeLayoutStore((state) => state.announcementBar.isEnabled);

  if (!isVisible || !hero?.slides?.length) return null;

  if (hero.layoutType === 'split-grid') {
    return (
      <SplitGridHero
        hero={hero}
        isSticky={isSticky}
        isAnnouncementBar={isAnnouncementBar}
        onOccasionSelect={onOccasionSelect}
      />
    );
  }

  return (
    <SliderHero
      hero={hero}
      isSticky={isSticky}
      isAnnouncementBar={isAnnouncementBar}
      onOccasionSelect={onOccasionSelect}
    />
  );
}
