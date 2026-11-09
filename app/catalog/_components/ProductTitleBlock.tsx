'use client';

import { Star } from 'lucide-react';
import type { Product } from '@/entities/product';

interface ProductTitleBlockProps {
  product: Product;
  displayRating: number;
  displayReviews: number;
}

export default function ProductTitleBlock({ product, displayRating, displayReviews }: ProductTitleBlockProps) {
  return (
    <div className="space-y-2">
      {product.brand && (
        <span className="text-xs font-bold text-orange-500 font-comfortaa uppercase tracking-widest bg-orange-50 px-3 py-1 rounded-full border border-orange-100">
          {product.brand}
        </span>
      )}
      <h1 className="text-xl sm:text-2xl font-black text-stone-900 font-comfortaa leading-tight mt-2">
        {product.name}
      </h1>

      <div className="flex items-center gap-4 text-xs font-medium text-stone-500 pt-1">
        <div className="flex items-center gap-1 text-amber-400">
          <Star className="w-4 h-4 fill-current" />
          <span className="font-bold text-stone-700 text-sm">{displayRating}</span>
          <span>({displayReviews} отзывов)</span>
        </div>
        <span>•</span>
        {product.inStock !== false ? (
          <span className="text-emerald-600 font-bold"><span aria-hidden="true">🐾 </span>В наличии</span>
        ) : (
          <span className="text-rose-600 font-bold"><span aria-hidden="true">❌ </span>Нет в наличии</span>
        )}
      </div>
    </div>
  );
}
