'use client';

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { HERO_SLIDES } from '@/shared/config/slides';

const currentSlide = 0;
const isHeroSliding = false;
const heroAnimCustom = { direction: 1, offset: 1200 };

const shouldReduceMotion = false;

export default function HeroCarousel() {
  const currentHeroSlide = HERO_SLIDES[currentSlide] || HERO_SLIDES[0];

  const heroSlideEase: [number, number, number, number] = [0.22, 1, 0.36, 1];
  const heroSlideDuration = shouldReduceMotion ? 0 : 0.65;

  return (
    <section
      className="relative overflow-hidden -mt-[114px]"
      aria-roledescription="carousel"
      aria-label="Промо-баннер"
    >
      <div
        className="relative h-[542px] sm:h-[594px] md:h-[634px] overflow-hidden"
      >
        <AnimatePresence
          initial={false}
          custom={heroAnimCustom}
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
            className={`absolute inset-0 ${currentHeroSlide.bgClass} pt-[114px] ${isHeroSliding ? 'pointer-events-none' : ''
              }`}
          >
            <div className="h-full py-6 md:py-10 px-4 sm:px-6 lg:px-8 flex items-center">
              <div className="max-w-7xl mx-auto px-6 md:px-12 w-full grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-center h-[380px] sm:h-[400px] md:h-[440px]">
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

      <div className="absolute inset-x-0 top-[114px] bottom-0 z-30 pointer-events-none">
        <button
          type="button"
          disabled={isHeroSliding}
          className="pointer-events-auto absolute left-2 sm:left-4 md:left-8 top-1/2 -translate-y-1/2 w-11 h-11 md:w-13 md:h-13 bg-black/90 hover:bg-stone-800 text-white rounded-full shadow-xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer group disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-default backdrop-blur-[2px]"
          title="Предыдущий слайд"
          aria-label="Предыдущий слайд"
        >
          <ChevronLeft className="w-6 h-6 stroke-[2.5] group-hover:-translate-x-0.5 transition-transform" />
        </button>

        <button
          type="button"
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
              {HERO_SLIDES.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  disabled={isHeroSliding}
                  className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer disabled:cursor-default ${idx === currentSlide
                    ? 'w-10 bg-stone-900'
                    : 'w-6 bg-stone-900/25 hover:bg-stone-900/45'
                    }`}
                  title={`Слайд ${idx + 1}`}
                  aria-label={`Слайд ${idx + 1}`}
                  aria-current={idx === currentSlide ? 'true' : undefined}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
