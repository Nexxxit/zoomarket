'use client';

import React from 'react';
import Image from 'next/image';
import type { CartItem } from '@/entities/cart';
import { StarRating } from '@/features/rating';

interface RatePurchasedProps {
  purchasedItems: CartItem[];
}

export default function RatePurchased({ purchasedItems }: RatePurchasedProps) {
  const productRatings: Record<string, { userRating?: number }> = {};

  if (purchasedItems.length === 0) return null;

  return (
    <div className="bg-white border border-stone-150 rounded-[28px] p-6 shadow-sm space-y-6">
      <div className="space-y-1.5 border-b border-stone-100 pb-4">
        <h2 className="text-base font-bold font-comfortaa text-stone-900 flex items-center gap-2">
          <span className="text-lg">⭐</span>
          <span>Оцените купленные товары</span>
        </h2>
        <p className="text-xs text-stone-500 font-inter">
          Помогите другим владельцам животных с выбором. Поставьте оценку товарам, которые вы только что приобрели!
        </p>
      </div>

      <div className="divide-y divide-stone-100">
        {purchasedItems.map((item) => {
          const itemUserRating = productRatings[item.id]?.userRating;
          return (
            <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center flex-shrink-0 overflow-hidden p-1">
                  <Image
                    src="/logo_aibolit.jpg"
                    alt=""
                    width={32}
                    height={32}
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <div>
                  <span className="text-xs font-bold text-stone-850 block line-clamp-1 leading-tight">{item.name}</span>
                  <span className="text-[10px] text-stone-400 font-mono mt-0.5 block">{item.size || 'Стандартный размер'} • {item.category}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-auto">
                <StarRating
                  value={itemUserRating ?? 0}
                  containerClassName="flex items-center gap-1"
                  starClassName="w-5 h-5"
                  ariaLabelTemplate={'Оценить на ${stars}'}
                />

                {itemUserRating !== undefined ? (
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100 animate-pulse">
                    Оценено!
                  </span>
                ) : (
                  <span className="text-[10px] text-stone-400 font-medium">
                    Оценить
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
