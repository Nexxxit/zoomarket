'use client';

import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Product } from '@/entities/product';
import { ProductCard } from '@/entities/product';

interface RecentlyViewedProps {
  products: Product[];
}

const SCROLL_STEP_RATIO = 0.8;

export default function RecentlyViewed({ products }: RecentlyViewedProps) {
  const trackRef = useRef<HTMLDivElement | null>(null);

  if (products.length === 0) return null;

  const scrollBySide = (direction: -1 | 1) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({ left: direction * track.clientWidth * SCROLL_STEP_RATIO, behavior: 'smooth' });
  };

  return (
    <div className="border-t border-stone-100 pt-10 space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg sm:text-xl font-black font-comfortaa text-stone-900 uppercase tracking-tight flex items-center gap-2">
          Вы смотрели недавно
        </h3>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => scrollBySide(-1)}
            className="p-1.5 rounded-full border border-stone-200 bg-white hover:bg-orange-50 hover:border-orange-500 text-stone-600 hover:text-orange-500 transition-all duration-200 active:scale-95 shadow-xs cursor-pointer"
            aria-label="Назад"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => scrollBySide(1)}
            className="p-1.5 rounded-full border border-stone-200 bg-white hover:bg-orange-50 hover:border-orange-500 text-stone-600 hover:text-orange-500 transition-all duration-200 active:scale-95 shadow-xs cursor-pointer"
            aria-label="Вперед"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div
        ref={trackRef}
        tabIndex={0}
        role="region"
        aria-label="Недавно просмотренные товары"
        className="flex gap-6 overflow-x-auto scrollbar-none pb-4 snap-x snap-mandatory scroll-smooth -mx-4 px-4 sm:mx-0 sm:px-0 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-orange-500/40 focus-visible:ring-offset-1"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {products.map((p) => (
          <ProductCard key={p.id} product={p} className="w-70 sm:w-75 shrink-0 snap-start" />
        ))}
      </div>
    </div>
  );
}
