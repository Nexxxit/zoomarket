'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, Sparkles } from 'lucide-react';
import { MOCK_PRODUCTS } from '@/entities/product';
import { ProductCard } from '@/entities/product';
import { renderPromoLogo } from './promoLogo';

interface PromoBannerData {
  id: string;
  badge: string;
  badgeBg: string;
  title: string;
  subtitle: string;
  bgGradient: string;
  borderClass: string;
  badgeIcon: React.ReactNode;
  illustration: React.ReactNode;
  link: string;
  buttonText: string;
}

function PromoBanner({ banner }: { banner: PromoBannerData }) {
  return (
    <div
      className={`relative overflow-hidden rounded-3xl shadow-aibolit border ${banner.borderClass} p-6 sm:p-8 md:p-12 flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-8 my-10`}
      style={{ background: banner.bgGradient }}
    >
      <div className="relative z-10 max-w-xl space-y-3 sm:space-y-4 text-left flex flex-col items-start justify-center h-full">
        <div className={`inline-flex items-center gap-2 ${banner.badgeBg} border text-xs font-bold px-3.5 py-1 rounded-full font-comfortaa uppercase tracking-widest shadow-xs`}>
          {banner.badgeIcon}
          <span>{banner.badge}</span>
        </div>

        <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-stone-950 font-comfortaa leading-tight">
          {banner.title}
        </h3>

        <p className="text-xs sm:text-sm text-stone-700 font-inter leading-relaxed max-w-md">
          {banner.subtitle}
        </p>

        <Link
          href={banner.link}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold font-comfortaa rounded-full text-xs transition-all shadow-xs shadow-orange-500/10 cursor-pointer"
        >
          <span>{banner.buttonText}</span>
        </Link>
      </div>

      <div className="absolute right-4 bottom-4 opacity-20 sm:relative sm:opacity-100 sm:right-0 sm:bottom-0 shrink-0 w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 bg-white/40 p-3 rounded-3xl border border-white/60 flex items-center justify-center">
        {banner.illustration}
      </div>
    </div>
  );
}

export default function HotDealsSection() {
  const hotDeals = MOCK_PRODUCTS.filter(p => p.onSale);

  const promoBannerLogo = renderPromoLogo(
    'w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36',
    144
  );

  const productChunks: typeof hotDeals[] = [];
  const chunkSize = 16;
  for (let i = 0; i < hotDeals.length; i += chunkSize) {
    productChunks.push(hotDeals.slice(i, i + chunkSize));
  }

  const promoBanners: PromoBannerData[] = [
    {
      id: "promo-ins-1",
      badge: "ВИТАМИННЫЙ БУМ",
      badgeBg: "bg-amber-100 text-amber-800 border-amber-200",
      title: "Здоровые суставы и сияющая шерсть",
      subtitle: "Скидки до -25% на комплексные витамины, пребиотики, рыбий жир и полезные лакомства для кошек и собак. Поддержите иммунитет любимца!",
      bgGradient: "linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)",
      borderClass: "border-amber-200",
      badgeIcon: <Sparkles className="w-3.5 h-3.5 text-amber-500" />,
      illustration: promoBannerLogo,
      link: "/catalog/cat/cat-treat?onSale=true",
      buttonText: "Выбрать витамины 💊"
    },
    {
      id: "promo-ins-2",
      badge: "СТОП-ПАРАЗИТ",
      badgeBg: "bg-sky-100 text-sky-800 border-sky-200",
      title: "Защита от клещей и блох на 100%",
      subtitle: "Ветеринарные ошейники, капли на холку и спреи от ведущих брендов со скидкой -20%. Безопасные и беззаботные прогулки в любую погоду!",
      bgGradient: "linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 100%)",
      borderClass: "border-sky-200",
      badgeIcon: <Heart className="w-3.5 h-3.5 text-sky-500" />,
      illustration: promoBannerLogo,
      link: "/catalog/cat/cat-flea?onSale=true",
      buttonText: "Защитить любимца 🛡️"
    }
  ];

  return (
    <section className="space-y-8">
      <div className="flex items-center gap-3">
        <span className="text-2xl">🔥</span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-950 font-comfortaa tracking-tight">
          Горячие предложения недели
        </h2>
      </div>

      <div className="space-y-12">
        {productChunks.map((chunk, chunkIdx) => {
          const banner = promoBanners[chunkIdx % promoBanners.length];
          const hasBanner = chunkIdx < productChunks.length - 1;

          return (
            <React.Fragment key={chunkIdx}>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                {chunk.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {hasBanner && (
                <PromoBanner banner={banner} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </section>
  );
}
