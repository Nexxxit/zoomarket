import React from 'react';
import Image from 'next/image';

export interface CarouselSlide {
  title: React.ReactNode;
  subtitle: string;
  badge: string;
  bgClass: string;
  bgGradient: string;
  btnText?: string;
  illustration: React.ReactNode;
  link?: { slug: string[]; query?: Record<string, string | null> };
}

export const HERO_SLIDES: CarouselSlide[] = [
  {
    title: "Новинка Grandin Holistic!",
    subtitle: "Сухой и влажный гипоаллергенный корм супер-премиум класса для кошек и собак.",
    badge: "Новинка",
    bgClass: "bg-[#D1F2D9]",
    bgGradient: "from-emerald-700 via-teal-800 to-green-900",
    btnText: "Перейти",
    illustration: (
      <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center">
        <div className="absolute inset-0 bg-emerald-300/30 rounded-full blur-2xl transform scale-90" />
        <Image
          src="/logo_aibolit.jpg"
          alt=""
          width={280}
          height={280}
          className="w-full h-full object-cover rounded-full relative z-10 drop-shadow-xl"
        />
      </div>
    ),
    link: { slug: ['cat', 'cat-food'] }
  },
  {
    title: (
      <>
        Все для здоровья <br className="hidden sm:inline" />
        и счастья{' '}
        <span className="text-orange-500 relative inline-block">
          ваших лапок
          <svg className="absolute left-0 bottom-1 w-full h-2 text-orange-400 opacity-60" viewBox="0 0 100 10" preserveAspectRatio="none">
            <path d="M0,5 Q50,9 100,5" stroke="currentColor" strokeWidth="4" strokeLinecap="round" fill="none" />
          </svg>
        </span>
      </>
    ),
    subtitle: "Отборные фермерские корма, сертифицированные витамины, средства ухода и развивающие интерактивные игрушки для ваших любимых питомцев.",
    badge: "Заботливый зоомаркет Айболит",
    bgClass: "bg-[#FCE3CF]",
    bgGradient: "from-orange-600 via-amber-600 to-yellow-700",
    illustration: (
      <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center">
        <div className="absolute inset-0 bg-orange-400/20 rounded-full blur-2xl transform scale-90" />
        <Image
          src="/logo_aibolit.jpg"
          alt=""
          width={280}
          height={280}
          className="w-full h-full object-cover rounded-full relative z-10 drop-shadow-xl"
        />
      </div>
    ),
  },
  {
    title: "Сезонная защита от клещей и паразитов",
    subtitle: "Сертифицированная ветаптека: капли, ошейники, спреи и таблетки от ведущих ветеринарных брендов.",
    badge: "Ветаптека",
    bgClass: "bg-[#D5EBFD]",
    bgGradient: "from-sky-700 via-blue-800 to-indigo-900",
    btnText: "Выбрать защиту",
    illustration: (
      <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center">
        <div className="absolute inset-0 bg-sky-400/20 rounded-full blur-2xl transform scale-90" />
        <Image
          src="/logo_aibolit.jpg"
          alt=""
          width={280}
          height={280}
          className="w-full h-full object-cover rounded-full relative z-10 drop-shadow-xl"
        />
      </div>
    ),
    link: { slug: ['cat', 'cat-flea'] }
  }
];
