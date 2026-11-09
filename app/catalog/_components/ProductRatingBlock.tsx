'use client';

import { StarRating } from '@/features/rating';

interface ProductRatingBlockProps {
  userRating?: number;
  onRate?: (rating: number) => void;
}

export default function ProductRatingBlock({ userRating, onRate }: ProductRatingBlockProps) {
  return (
    <div className="border-t border-stone-100 pt-8 pb-4 space-y-4">
      <h3 className="text-sm font-black font-comfortaa text-stone-900 uppercase tracking-wider">
        Оценка товара покупателями
      </h3>
      <div className="bg-stone-50 border border-stone-100 rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1.5 text-center md:text-left">
          <span className="text-sm font-bold text-stone-800 block">Как вам этот товар?</span>
          <p className="text-xs text-stone-500 leading-relaxed max-w-md">
            Поделитесь своим мнением о товаре с другими владельцами питомцев. Ваша оценка поможет сделать правильный выбор!
          </p>
        </div>

        <div className="flex flex-col items-center gap-2 w-60">
          <StarRating value={userRating ?? 0} onSelect={onRate} />

          <div className="flex h-7 items-center justify-center">
            {userRating !== undefined ? (
              <span className="text-xs font-bold whitespace-nowrap text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 flex items-center gap-1">
                <span>Ваша оценка: {userRating} из 5. Спасибо! 🐾</span>
              </span>
            ) : (
              <span className="text-[11px] text-stone-400 font-medium text-center">
                Нажмите на звезду, чтобы поставить оценку
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
