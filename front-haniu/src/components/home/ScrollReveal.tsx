'use client';

import { ReactNode, useEffect, useRef, useState } from 'react';

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number; // millisecond delay
  duration?: number; // transition duration in ms
  distance?: string; // translate utility class name
}

export default function ScrollReveal({
  children,
  className = '',
  delay = 0,
  duration = 800,
  distance = 'translate-y-12',
}: ScrollRevealProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target); // Animates once
        }
      },
      {
        threshold: 0.05, // Trigger when 5% of content is visible
        rootMargin: '0px 0px -40px 0px',
      }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all cubic-bezier(0.16, 1, 0.3, 1) ${
        isVisible
          ? 'opacity-100 translate-y-0 scale-100'
          : `opacity-0 ${distance} scale-[0.985]`
      } ${className}`}
      style={{
        transitionDelay: `${delay}ms`,
        transitionDuration: `${duration}ms`,
        willChange: 'transform, opacity',
      }}
    >
      {children}
    </div>
  );
}
