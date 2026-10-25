'use client';

import React from 'react';
import Link from 'next/link';
import { Trash2, Plus, Minus } from 'lucide-react';
import { ProductIcon } from '@/shared/ui';
import { MOCK_PRODUCTS } from '@/entities/product';
import type { CartItem } from '@/entities/cart';
import { encodeCatalogSlugSegment } from '@/shared/lib';

function getCartItemDetailUrl(itemId: string): string | null {
  const product = MOCK_PRODUCTS.find((p) => p.id === itemId);
  if (!product?.animal || !product?.subcategoryId) return null;

  return `/catalog/${product.animal}/${product.subcategoryId}/${encodeCatalogSlugSegment(product.subSection || 'all')}/${product.id}`;
}

interface CartListProps {
  cart: CartItem[];
  checkoutType: 'delivery' | 'pickup';
  itemsSubtotal: number;
  pickupAddress: string;
}

export default function CartList({ cart, checkoutType, itemsSubtotal, pickupAddress }: CartListProps) {
  const renderItemIllustration = (name: string) => (
    <ProductIcon alt={name} className="w-12 h-12" />
  );

  return (
    <div className="lg:col-span-8 bg-white p-6 border border-stone-100 rounded-3xl shadow-sm space-y-6">
      <div className="divide-y divide-stone-100">
        {cart.map((item) => {
          const detailUrl = getCartItemDetailUrl(item.id);
          const titleClassName =
            'text-sm sm:text-base font-bold text-stone-900 leading-tight font-comfortaa pr-2 transition-colors max-w-sm line-clamp-2';

          return (
          <div
            key={`${item.id}-${item.size}`}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 pt-4 first:pt-0 border-b border-[#F5F5F4]"
          >

            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-stone-50 flex items-center justify-center flex-shrink-0 border border-stone-100">
                {renderItemIllustration(item.name)}
              </div>
              <div className="flex flex-col items-start gap-1.5">
                <span className="text-[10px] bg-stone-100 text-stone-500 font-sans font-bold px-2 py-0.5 rounded-full uppercase tracking-wider inline-block">
                  {item.category}
                </span>
                {detailUrl ? (
                  <Link href={detailUrl} className="block">
                    <h3 className={`${titleClassName} hover:text-orange-500`}>
                      {item.name}
                    </h3>
                  </Link>
                ) : (
                  <h3 className={titleClassName}>{item.name}</h3>
                )}
                {item.size && (
                  <span className="text-xs text-stone-500 font-semibold bg-stone-50 border border-stone-200/50 px-2 py-0.5 rounded-md inline-block">
                    Вес/Размер: {item.size}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-6 sm:gap-10">

              <div className="flex items-center bg-stone-50 p-1.5 border border-stone-200/80 rounded-full">
                <button
                  className="w-8 h-8 rounded-full bg-white hover:bg-orange-50 hover:text-orange-500 border border-stone-200/50 flex items-center justify-center text-stone-600 transition-colors shadow-xs"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-8 text-center text-xs font-bold text-stone-800 font-mono">
                  {item.quantity}
                </span>
                <button
                  className="w-8 h-8 rounded-full bg-white hover:bg-orange-50 hover:text-orange-500 border border-stone-200/50 flex items-center justify-center text-stone-600 transition-colors shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="text-right space-y-1 flex-shrink-0 min-w-24">
                <p className="text-base sm:text-lg font-extrabold text-stone-900 font-comfortaa">
                  {item.price * item.quantity} ₽
                </p>
                {item.oldPrice && (
                  <p className="text-xs text-stone-400 line-through font-inter">
                    {item.oldPrice * item.quantity} ₽
                  </p>
                )}
              </div>

              <button
                className="text-stone-400 hover:text-red-500 p-2 rounded-full hover:bg-red-50/50 transition-colors flex-shrink-0"
                title="Удалить товар"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

          </div>
        );
        })}
      </div>

      {checkoutType === 'delivery' ? (
        <div className="p-4 bg-orange-50 rounded-2xl border border-orange-100 flex items-center gap-3">
          <span className="text-xl">🛵</span>
          <div className="text-xs text-stone-600 font-inter space-y-0.5">
            {itemsSubtotal >= 1500 ? (
              <p className="font-bold text-orange-950">Поздравляем! Доставка будет бесплатной!</p>
            ) : (
              <p> Добавьте еще товаров на <strong className="text-orange-950">{1500 - itemsSubtotal} ₽</strong> для бесплатной доставки по городу.</p>
            )}
            <p className="text-stone-400 font-light">Доставка Айболита работает с заботой во все районы.</p>
          </div>
        </div>
      ) : (
        <div className="p-4 bg-green-50 rounded-2xl border border-green-100 flex items-center gap-3">
          <span className="text-xl">🏪</span>
          <div className="text-xs text-stone-600 font-inter space-y-0.5">
            <p className="font-bold text-green-950">Самовывоз — Бесплатно в любое время!</p>
            <p className="text-stone-700">Пункт выдачи: <strong className="text-stone-950">{pickupAddress}</strong></p>
          </div>
        </div>
      )}

    </div>
  );
}
