'use client';

import React from 'react';
import { Plus } from 'lucide-react';
import { ProductIcon } from '@/shared/ui';
import { MOCK_PRODUCTS } from '@/entities/product';
import type { Product } from '@/entities/product';
import type { CartItem } from '@/entities/cart';

function getRecommendationScore(product: Product): number {
  let score = product.rating * 10;
  if (product.badge === 'Хит' || product.badge === 'Рекомендовано') score += 50;
  if (product.onSale) score += 10;
  return score;
}

interface CartRecommendationsProps {
  cart: CartItem[];
}

export default function CartRecommendations({ cart }: CartRecommendationsProps) {
  const recommendedProducts = (() => {
    const cartIds = new Set(cart.map((item) => item.id));
    const cartAnimals = new Set(
      cart
        .map((item) => MOCK_PRODUCTS.find((p) => p.id === item.id)?.animal)
        .filter((animal): animal is Product['animal'] => Boolean(animal))
    );

    const available = MOCK_PRODUCTS.filter(
      (product) => !cartIds.has(product.id) && product.inStock !== false
    );

    const related = available.filter(
      (product) => cartAnimals.size === 0 || cartAnimals.has(product.animal) || product.animal === 'universal'
    );

    const pool = related.length > 0 ? related : available;

    return [...pool]
      .sort((a, b) => getRecommendationScore(b) - getRecommendationScore(a))
      .slice(0, 3);
  })();

  if (recommendedProducts.length === 0) return null;

  return (
    <div className="space-y-3 border-t border-orange-200/40 pt-4">
      <p className="font-comfortaa text-[11px] font-bold uppercase tracking-wide text-stone-500">
        Часто покупают вместе
      </p>
      <div className="space-y-3">
        {recommendedProducts.map((product) => (
          <div key={product.id} className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white border border-orange-100/80">
              <ProductIcon type={product.type} alt={product.name} className="h-8 w-8" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="line-clamp-2 font-comfortaa text-xs font-bold leading-snug text-stone-900">
                {product.name}
              </p>
              <p className="mt-0.5 font-comfortaa text-sm font-black text-orange-500">
                {product.price} ₽
              </p>
            </div>
            <button
              type="button"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-orange-500 text-white shadow-sm transition-colors hover:bg-orange-600 cursor-pointer"
              aria-label={`Добавить ${product.name} в корзину`}
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
