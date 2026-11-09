'use client';

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Gift, Percent, Sparkles } from 'lucide-react';
import { renderPromoLogo } from './promoLogo';

const currentSlide = 0;

export default function PromoCarousel() {
  const logoIllustration = renderPromoLogo(
    'w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40',
    160
  );

  const slides = [
    {
      id: 1,
      badge: "Грандиозный Сейл",
      badgeBg: "bg-orange-500",
      badgeIcon: <Percent className="w-3.5 h-3.5" />,
      title: (
        <>
          Суперскидки до –30% <br /> на здоровье лапок!
        </>
      ),
      subtitle: "Сроки акции ограничены! Дарите питомцам заботу по сниженным ценам. Вся линейка сертифицирована.",
      expiration: "Действует до 30 июня 2026 г.",
      expireBg: "bg-orange-100 text-orange-800 border-orange-200",
      background: 'linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%)',
      borderClass: 'border-orange-100',
      illustration: logoIllustration
    },
    {
      id: 2,
      badge: "Экспресс-Доставка",
      badgeBg: "bg-emerald-600",
      badgeIcon: <Gift className="w-3.5 h-3.5" />,
      title: (
        <>
          Бесплатная доставка <br /> при заказе от 1500 ₽!
        </>
      ),
      subtitle: "Привезем прямо к вашей двери со скоростью виляния хвостика. Качественная упаковка и бережное отношение.",
      expiration: "Постоянная акция зоомаркета",
      expireBg: "bg-emerald-100 text-emerald-800 border-emerald-200",
      background: 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)',
      borderClass: 'border-emerald-100',
      illustration: logoIllustration
    },
    {
      id: 3,
      badge: "Время играть",
      badgeBg: "bg-sky-500",
      badgeIcon: <Sparkles className="w-3.5 h-3.5" />,
      title: (
        <>
          Купи игрушку — <br /> верни хвостику радость!
        </>
      ),
      subtitle: "При покупке развивающих интерактивных игрушек скидка 20% на весь ассортимент. Питомцы будут в восторге!",
      expiration: "Действует до 15 июля 2026 г.",
      expireBg: "bg-sky-100 text-sky-800 border-sky-200",
      background: 'linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 100%)',
      borderClass: 'border-sky-100',
      illustration: logoIllustration
    }
  ];

  return (
    <>
      <div className="relative overflow-hidden rounded-3xl shadow-aibolit h-110 sm:h-85 md:h-75 mb-4">
        <AnimatePresence initial={false}>
          <motion.div
            key={currentSlide}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: "tween", ease: "easeInOut", duration: 0.55 }}
            className={`absolute inset-0 p-6 sm:p-8 md:p-12 flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-8 border ${slides[currentSlide].borderClass}`}
            style={{ background: slides[currentSlide].background }}
          >
            <div className="relative z-10 max-w-xl space-y-3 sm:space-y-4 text-left flex flex-col items-start justify-center h-full">
              <div className={`inline-flex items-center gap-2 ${slides[currentSlide].badgeBg} text-white font-bold text-[10px] px-3.5 py-1 rounded-full font-comfortaa uppercase tracking-widest shadow-xs`}>
                {slides[currentSlide].badgeIcon}
                <span>{slides[currentSlide].badge}</span>
              </div>

              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-stone-950 font-comfortaa leading-tight">
                {slides[currentSlide].title}
              </h1>

              <p className="text-xs sm:text-sm text-stone-700 font-inter leading-relaxed max-w-md">
                {slides[currentSlide].subtitle}
              </p>

              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-sans text-xs font-bold border ${slides[currentSlide].expireBg}`}>
                <Calendar className="w-4 h-4" />
                <span>{slides[currentSlide].expiration}</span>
              </div>
            </div>

            <div className="absolute right-4 bottom-4 opacity-20 sm:relative sm:opacity-100 sm:right-0 sm:bottom-0 shrink-0 w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 bg-white/40 p-3 rounded-3xl border border-white/60 flex items-center justify-center">
              {slides[currentSlide].illustration}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-center gap-2 mb-12">
        {slides.map((_, idx) => {
          const isActive = idx === currentSlide;
          return (
            <button
              key={idx}
              type="button"
              className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer border-0 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-orange-500/40 focus-visible:ring-offset-1 ${
                isActive ? 'w-8 bg-orange-500 shadow-xs' : 'w-2.5 bg-stone-300 hover:bg-stone-400'
              }`}
              aria-label={`Слайд ${idx + 1}`}
            />
          );
        })}
      </div>
    </>
  );
}
