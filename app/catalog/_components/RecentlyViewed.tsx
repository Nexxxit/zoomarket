'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Product } from '@/entities/product';
import { ProductCard } from '@/entities/product';

interface RecentlyViewedProps {
  products: Product[];
}

export default function RecentlyViewed({ products }: RecentlyViewedProps) {
  if (products.length === 0) return null;

  return (
    <div className="border-t border-stone-100 pt-10 space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg sm:text-xl font-black font-comfortaa text-stone-900 uppercase tracking-tight flex items-center gap-2">
          <span>Вы смотрели недавно</span>
        </h3>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="p-1.5 rounded-full border border-stone-200 bg-white hover:bg-orange-50 hover:border-orange-500 text-stone-600 hover:text-orange-500 transition-all duration-200 active:scale-95 shadow-xs cursor-pointer"
            aria-label="Назад"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            className="p-1.5 rounded-full border border-stone-200 bg-white hover:bg-orange-50 hover:border-orange-500 text-stone-600 hover:text-orange-500 transition-all duration-200 active:scale-95 shadow-xs cursor-pointer"
            aria-label="Вперед"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div
        className="flex gap-6 overflow-x-auto scrollbar-none pb-4 snap-x snap-mandatory scroll-smooth -mx-4 px-4 sm:mx-0 sm:px-0"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {products.map((p) => (
          <div
            key={p.id}
            className="w-[280px] sm:w-[300px] flex-shrink-0 snap-start"
          >
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </div>
  );
}
