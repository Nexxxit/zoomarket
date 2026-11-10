'use client';

import React, { useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { HERO_SLIDES } from '@/shared/config/slides';
import { encodeCatalogSlugSegment } from '@/shared/lib';
import { useHeroCarousel } from './HeroCarouselProvider';

export default function HeroCarousel() {
  const router = useRouter();
  const heroTrackRef = useRef<HTMLDivElement>(null);

  const {
    currentSlide,
    isHeroSliding,
    heroAnimCustom,
    goToHeroSlide,
    unlockHeroSlide,
    setTrackWidth,
    attachFill,
    notifyManualSwitch,
    setHeroMounted,
  } = useHeroCarousel();

  const currentHeroSlide = HERO_SLIDES[currentSlide] || HERO_SLIDES[0];
  const shouldReduceMotion = useReducedMotion();

  React.useEffect(() => {
    setHeroMounted(true);
    return () => setHeroMounted(false);
  }, [setHeroMounted]);

  React.useEffect(() => {
    const el = heroTrackRef.current;
    if (!el) return;

    const updateWidth = () => setTrackWidth(el.offsetWidth);
    updateWidth();

    const observer = new ResizeObserver(updateWidth);
    observer.observe(el);
    return () => observer.disconnect();
  }, [setTrackWidth]);

  const handleSlideLink = () => {
    if (!currentHeroSlide.link) return;
    const path = `/catalog/${currentHeroSlide.link.slug.map(encodeCatalogSlugSegment).join('/')}`;
    const query = currentHeroSlide.link.query
      ? `?${new URLSearchParams(
        Object.entries(currentHeroSlide.link.query).filter((v): v is [string, string] => v[1] != null),
      ).toString()}`
      : '';
    // Компенсация скролла на смену slug живёт в useCatalogViewModel.
    router.push(`${path}${query}`, { scroll: false });
  };

  const handleNextSlide = () => {
    if (goToHeroSlide(currentSlide + 1, 1)) notifyManualSwitch();
  };

  const handlePrevSlide = () => {
    if (goToHeroSlide(currentSlide - 1, -1)) notifyManualSwitch();
  };

  const handleDotClick = (index: number) => {
    if (index === currentSlide) return;
    if (goToHeroSlide(index, index > currentSlide ? 1 : -1)) notifyManualSwitch();
  };

  const heroSlideEase: [number, number, number, number] = [0.22, 1, 0.36, 1];
  const heroSlideDuration = shouldReduceMotion ? 0 : 0.65;

  return (
    <section
      className="relative overflow-hidden -mt-header"
      aria-roledescription="carousel"
      aria-label="Промо-баннер"
    >
      <React.Suspense fallback={null}>
        <HeroSearchPauseGate />
      </React.Suspense>
      <div
        ref={heroTrackRef}
        className="relative h-[542px] sm:h-[594px] md:h-[634px] overflow-hidden"
      >
        <AnimatePresence
          initial={false}
          custom={heroAnimCustom}
          onExitComplete={unlockHeroSlide}
        >
          <motion.div
            key={currentSlide}
            custom={heroAnimCustom}
            variants={{
              enter: ({ direction, offset }: { direction: number; offset: number }) => ({
                x: direction * offset,
              }),
              center: { x: 0 },
              exit: ({ direction, offset }: { direction: number; offset: number }) => ({
                x: direction * -offset,
              }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: heroSlideDuration, ease: heroSlideEase }}
            className={`absolute inset-0 ${currentHeroSlide.bgClass} pt-header ${isHeroSliding ? 'pointer-events-none' : ''
              }`}
          >
            <div className="h-full py-6 md:py-10 px-4 sm:px-6 lg:px-8 flex items-center">
              <div className="max-w-7xl mx-auto px-6 md:px-12 w-full grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-center h-95 sm:h-100 md:h-110">
                <div className="lg:col-span-7 space-y-4 md:space-y-5 text-left flex flex-col justify-center h-full">
                  <div>
                    <span className="inline-block bg-black/10 text-stone-900 font-extrabold font-comfortaa text-xs md:text-sm px-4 py-1.5 rounded-full uppercase tracking-wider">
                      {currentHeroSlide.badge}
                    </span>
                  </div>

                  <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-stone-900 font-comfortaa leading-[1.1] tracking-tight">
                    {currentHeroSlide.title}
                  </h1>

                  <p className="text-base sm:text-lg text-stone-800 font-inter max-w-xl leading-relaxed font-medium">
                    {currentHeroSlide.subtitle}
                  </p>

                  {currentHeroSlide.btnText && currentHeroSlide.link && (
                    <div className="pt-1 flex items-center gap-4">
                      <button
                        type="button"
                        onClick={handleSlideLink}
                        className="px-8 py-3.5 bg-black hover:bg-stone-800 text-white font-black font-comfortaa text-sm md:text-base rounded-full shadow-md transition-all hover:scale-105 active:scale-95 flex items-center gap-3 group cursor-pointer"
                      >
                        <span>{currentHeroSlide.btnText}</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  )}
                </div>

                <div className="lg:col-span-5 flex justify-center lg:justify-end items-center h-full">
                  {currentHeroSlide.illustration}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Controls поверх трека, ниже навбара */}
      <div className="absolute inset-x-0 top-header bottom-0 z-30 pointer-events-none">
        <button
          type="button"
          onClick={handlePrevSlide}
          disabled={isHeroSliding}
          className="pointer-events-auto absolute left-2 sm:left-4 md:left-8 top-1/2 -translate-y-1/2 w-11 h-11 md:w-13 md:h-13 bg-black/90 hover:bg-stone-800 text-white rounded-full shadow-xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer group disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-default backdrop-blur-[2px]"
          title="Предыдущий слайд"
          aria-label="Предыдущий слайд"
        >
          <ChevronLeft className="w-6 h-6 stroke-[2.5] group-hover:-translate-x-0.5 transition-transform" />
        </button>

        <button
          type="button"
          onClick={handleNextSlide}
          disabled={isHeroSliding}
          className="pointer-events-auto absolute right-2 sm:right-4 md:right-8 top-1/2 -translate-y-1/2 w-11 h-11 md:w-13 md:h-13 bg-black/90 hover:bg-stone-800 text-white rounded-full shadow-xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer group disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-default backdrop-blur-[2px]"
          title="Следующий слайд"
          aria-label="Следующий слайд"
        >
          <ChevronRight className="w-6 h-6 stroke-[2.5] group-hover:translate-x-0.5 transition-transform" />
        </button>

        <div className="pointer-events-auto absolute inset-x-0 bottom-5 md:bottom-7 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="flex items-center gap-2">
              {HERO_SLIDES.map((_, idx) => {
                const isActive = idx === currentSlide;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleDotClick(idx)}
                    disabled={isHeroSliding}
                    className={`relative h-1.5 overflow-hidden rounded-full transition-all duration-300 cursor-pointer disabled:cursor-default ${isActive
                      ? 'w-10 bg-stone-900/25'
                      : 'w-6 bg-stone-900/25 hover:bg-stone-900/45'
                      }`}
                    title={`Слайд ${idx + 1}`}
                    aria-label={`Слайд ${idx + 1}`}
                    aria-current={isActive ? 'true' : undefined}
                  >
                    {isActive && (
                      <span
                        ref={attachFill}
                        className="absolute inset-0 origin-left bg-stone-900"
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Leaf-компонент под собственным Suspense: читает ?search= через
 * useSearchParams, не превращая всю страницу в CSR.
 */
function HeroSearchPauseGate() {
  const sp = useSearchParams();
  const { setAutoplayPaused } = useHeroCarousel();
  React.useEffect(() => {
    setAutoplayPaused(Boolean(sp?.get('search')));
  }, [sp, setAutoplayPaused]);
  return null;
}
