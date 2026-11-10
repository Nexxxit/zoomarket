'use client';

import React from 'react';
import { HERO_SLIDES } from '@/shared/config/slides';
import { useHeroAutoplay } from './useHeroAutoplay';

interface HeroCarouselContextValue {
  currentSlide: number;
  isHeroSliding: boolean;
  heroAnimCustom: { direction: number; offset: number };
  goToHeroSlide: (index: number, direction: number) => boolean;
  unlockHeroSlide: () => void;
  setTrackWidth: (width: number) => void;
  attachFill: (el: HTMLSpanElement | null) => void;
  notifyManualSwitch: () => void;
  setAutoplayPaused: (paused: boolean) => void;
  setHeroMounted: (mounted: boolean) => void;
}

const HeroCarouselContext = React.createContext<HeroCarouselContextValue | null>(null);

export function useHeroCarousel(): HeroCarouselContextValue {
  const ctx = React.useContext(HeroCarouselContext);
  if (!ctx) throw new Error('useHeroCarousel must be used within HeroCarouselProvider');
  return ctx;
}

interface HeroCarouselProviderProps {
  children: React.ReactNode;
  /** Интервал автопрокрутки, мс. Уменьшается только в тестах. */
  autoplayMs?: number;
}

export default function HeroCarouselProvider({
  children,
  autoplayMs,
}: HeroCarouselProviderProps) {
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const [isHeroSliding, setIsHeroSliding] = React.useState(false);
  const [trackWidth, setTrackWidthState] = React.useState(0);
  const [heroAnimCustom, setHeroAnimCustom] = React.useState({ direction: 1, offset: 1200 });
  const [autoplayPaused, setAutoplayPaused] = React.useState(false);
  const [heroMounted, setHeroMountedState] = React.useState(false);
  const isHeroSlidingRef = React.useRef(false);
  const currentSlideRef = React.useRef(0);

  const setTrackWidth = React.useCallback((width: number) => {
    setTrackWidthState((prev) => (prev === width ? prev : width));
  }, []);

  const setHeroMounted = React.useCallback((mounted: boolean) => {
    setHeroMountedState((prev) => (prev === mounted ? prev : mounted));
  }, []);

  const goToHeroSlide = React.useCallback((index: number, direction: number): boolean => {
    if (isHeroSlidingRef.current) return false;
    const total = HERO_SLIDES.length;
    const nextIndex = ((index % total) + total) % total;
    if (nextIndex === currentSlideRef.current) return false;

    const offset = trackWidth || 1200;
    isHeroSlidingRef.current = true;
    currentSlideRef.current = nextIndex;
    setHeroAnimCustom({ direction, offset });
    setIsHeroSliding(true);
    setCurrentSlide(nextIndex);
    return true;
  }, [trackWidth]);

  const unlockHeroSlide = React.useCallback(() => {
    isHeroSlidingRef.current = false;
    setIsHeroSliding(false);
  }, []);

  const autoAdvance = React.useCallback(() => {
    goToHeroSlide(currentSlideRef.current + 1, 1);
  }, [goToHeroSlide]);

  const { attachFill, notifyManualSwitch } = useHeroAutoplay({
    // Прокрутка активна, только когда карусель смонтирована и не на паузе:
    // useHeroAutoplay при !enabled не планирует кадры вовсе — на страницах
    // без героя (detail) rAF-цикл не крутится.
    enabled: heroMounted && !autoplayPaused,
    onAdvance: autoAdvance,
    autoplayMs,
  });

  // Страховка: не залипаем в isHeroSliding, если onExitComplete не пришёл
  // (в т.ч. если карусель размонтировалась посреди скольжения при навигации)
  React.useEffect(() => {
    if (!isHeroSliding) return;
    const unlock = setTimeout(unlockHeroSlide, 900);
    return () => clearTimeout(unlock);
  }, [isHeroSliding, currentSlide, unlockHeroSlide]);

  const value = React.useMemo<HeroCarouselContextValue>(() => ({
    currentSlide,
    isHeroSliding,
    heroAnimCustom,
    goToHeroSlide,
    unlockHeroSlide,
    setTrackWidth,
    attachFill,
    notifyManualSwitch,
    setAutoplayPaused,
    setHeroMounted,
  }), [
    currentSlide,
    isHeroSliding,
    heroAnimCustom,
    goToHeroSlide,
    unlockHeroSlide,
    setTrackWidth,
    attachFill,
    notifyManualSwitch,
    setHeroMounted,
  ]);

  return <HeroCarouselContext.Provider value={value}>{children}</HeroCarouselContext.Provider>;
}
