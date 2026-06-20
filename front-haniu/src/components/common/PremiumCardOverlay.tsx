'use client';

interface PremiumCardOverlayProps {
  isActive?: boolean;
}

export default function PremiumCardOverlay({ isActive = false }: PremiumCardOverlayProps) {
  return (
    <div
      style={{
        backgroundImage: isActive
          ? 'linear-gradient(to top, rgba(76, 5, 25, 0.7) 0%, rgba(0, 0, 0, 0.45) 45%, transparent 100%)'
          : 'linear-gradient(to top, rgba(0, 0, 0, 0.55) 0%, rgba(0, 0, 0, 0.15) 45%, transparent 100%)'
      }}
      className="absolute inset-0 z-10 pointer-events-none transition-all duration-300"
    />
  );
}
