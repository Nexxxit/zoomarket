'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Truck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { HERO_SLIDES } from '@/shared/config/slides';

const lowerSlide = 0;

interface PromoSectionDisabledProps {
  slugLength: number;
  isSearchActive: boolean;
}

export default function PromoSectionDisabled({ slugLength, isSearchActive }: PromoSectionDisabledProps) {
  const carouselSlides = HERO_SLIDES;
  return (
    <section id="promotions-area" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8 border-b border-stone-100">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <span className="text-xs font-bold font-comfortaa text-orange-650 uppercase tracking-widest block bg-orange-100/60 px-2.5 py-1 rounded-full w-max">Акции зоомагазина</span>
          <h2 className="text-2xl sm:text-3xl font-black text-stone-900 font-comfortaa tracking-tight">Горячие скидки недели 🔥</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-[#1C1917] to-[#292524] text-white p-6 rounded-[28px] relative overflow-hidden flex flex-col justify-between shadow-lg h-72">
          <div className="space-y-2 relative z-10">
            <span className="bg-[#EF4444] text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full">Успей купить</span>
            <h3 className="text-lg md:text-xl font-bold font-comfortaa leading-snug pt-2">Скидки до -30% на сухие холистики</h3>
            <p className="text-xs text-stone-300 font-inter font-light">Свежайшее фермерское мясо кролика и индейки для идеального здоровья шерсти.</p>
          </div>
          <div className="flex justify-between items-center pt-4 relative z-10">
            <span className="text-xl font-black font-comfortaa">Ownat & Mera</span>
            <button
              className="p-3 bg-white hover:bg-orange-500 hover:text-white text-stone-950 rounded-full transition-all group/btn cursor-pointer"
            >
              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="absolute -right-10 -bottom-10 w-44 h-44 bg-orange-500/10 rounded-full blur-2xl" />
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-[28px] relative overflow-hidden flex flex-col justify-between shadow-lg h-72">
          <div className="space-y-2 relative z-10">
            <span className="bg-white/20 text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full">Забота</span>
            <h3 className="text-lg md:text-xl font-bold font-comfortaa leading-snug pt-2">Бесплатная экспресс доставка от 1500₽</h3>
            <p className="text-xs text-orange-50 font-inter font-light">Доставляем любые корма, тяжелые наполнители и ветаптеку прямо в коридор вашей квартиры за 1 час!</p>
          </div>
          <div className="flex justify-between items-center pt-4 relative z-10">
            <span className="text-xl font-black font-comfortaa">Айболит Экспресс</span>
            <Link href="/cart" className="p-3 bg-white text-orange-600 hover:bg-orange-50 hover:scale-105 rounded-full transition-all flex items-center justify-center">
              <Truck className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#0284C7] to-[#0369A1] text-white p-6 rounded-[28px] relative overflow-hidden flex flex-col justify-between shadow-lg h-72">
          <div className="space-y-2 relative z-10">
            <span className="bg-emerald-500 text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full">Безопасно</span>
            <h3 className="text-lg md:text-xl font-bold font-comfortaa leading-snug pt-2">Защита от паразитов до -20%</h3>
            <p className="text-xs text-sky-100 font-inter font-light">Брендовые ошейники Foresto, капли на холку Inspector и капли Elanco для мелких и крупных пород собак.</p>
          </div>
          <div className="flex justify-between items-center pt-4 relative z-10">
            <span className="text-xl font-black font-comfortaa">Паразитология 🔬</span>
            <button
              className="p-3 bg-white text-[#0284C7] hover:bg-orange-50 hover:scale-105 rounded-full transition-all flex items-center justify-center cursor-pointer"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {slugLength < 4 && !isSearchActive && (
        <div className="pt-10 space-y-6">
          <div className="relative overflow-hidden rounded-[32px] shadow-xl h-[420px] sm:h-[320px]">
            <AnimatePresence initial={false}>
              <motion.div
                key={lowerSlide}
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: "tween", ease: "easeInOut", duration: 0.55 }}
                className={`absolute inset-0 w-full h-full bg-gradient-to-br ${carouselSlides[lowerSlide].bgGradient} text-white p-6 sm:p-8 md:p-12 flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-8 overflow-hidden`}
              >
                <div className="space-y-3 sm:space-y-4 max-w-xl text-left relative z-10 flex flex-col justify-center h-full">
                  <h3 className="text-lg sm:text-2xl md:text-3xl font-black font-comfortaa leading-tight pt-1">
                    {carouselSlides[lowerSlide].title}
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-100/90 font-inter font-light leading-relaxed max-w-xl">
                    {carouselSlides[lowerSlide].subtitle}
                  </p>
                  {carouselSlides[lowerSlide].link && (
                    <button
                      className="mt-1 px-6 py-2.5 bg-white hover:bg-orange-500 text-stone-900 hover:text-white font-extrabold font-comfortaa text-xs rounded-full shadow-md hover:-translate-y-0.5 transition-all w-max cursor-pointer border-0 outline-none block"
                    >
                      Подробнее ⚡
                    </button>
                  )}
                </div>

                <div className="absolute right-4 bottom-4 opacity-15 sm:relative sm:opacity-90 sm:right-0 sm:bottom-0 shrink-0 w-24 h-24 sm:w-36 sm:h-36 md:w-44 md:h-44 flex items-center justify-center">
                  {carouselSlides[lowerSlide].illustration}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex items-center justify-center gap-2.5">
            {carouselSlides.map((_, idx) => {
              const isActive = idx === lowerSlide;
              return (
                <button
                  key={idx}
                  type="button"
                  className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer border-0 outline-none ${isActive ? 'w-8 bg-orange-500 shadow-sm' : 'w-2.5 bg-stone-300 hover:bg-stone-400'
                    }`}
                  aria-label={`Слайд ${idx + 1}`}
                />
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
