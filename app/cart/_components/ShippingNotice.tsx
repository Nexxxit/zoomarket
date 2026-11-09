'use client';

import React from 'react';
import type { CheckoutType } from '@/entities/cart';
import { formatPrice } from '@/shared/lib/format';
import { FREE_SHIPPING_THRESHOLD } from '@/shared/config/commerce';

interface ShippingNoticeProps {
  checkoutType: CheckoutType;
  itemsSubtotal: number;
}

export default function ShippingNotice({ checkoutType, itemsSubtotal }: ShippingNoticeProps) {
  if (checkoutType === 'delivery') {
    return (
      <div className="p-4 bg-orange-50 rounded-2xl border border-orange-100 flex items-center gap-3">
        <span className="text-xl" aria-hidden="true">🛵</span>
        <div className="text-xs text-stone-600 font-inter space-y-0.5">
          {itemsSubtotal >= FREE_SHIPPING_THRESHOLD ? (
            <p className="font-bold text-orange-950">Поздравляем! Доставка будет бесплатной!</p>
          ) : (
            <p> Добавьте еще товаров на <strong className="text-orange-950">{formatPrice(FREE_SHIPPING_THRESHOLD - itemsSubtotal)}</strong> для бесплатной доставки по городу.</p>
          )}
          <p className="text-stone-400 font-light">Доставка Айболита работает с заботой во все районы.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-green-50 rounded-2xl border border-green-100 flex items-center gap-3">
      <span className="text-xl" aria-hidden="true">🏪</span>
      <div className="text-xs text-stone-600 font-inter space-y-0.5">
        <p className="font-bold text-green-950">Самовывоз — Бесплатно в любое время!</p>
      </div>
    </div>
  );
}
