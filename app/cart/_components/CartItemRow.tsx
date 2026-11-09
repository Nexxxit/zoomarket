'use client';

import React from 'react';
import Link from 'next/link';
import { Trash2 } from 'lucide-react';
import { ProductIcon } from '@/shared/ui';
import { MOCK_PRODUCTS } from '@/entities/product';
import type { CartItem } from '@/entities/cart';
import { productHref } from '@/shared/config/navigation';
import { formatPrice } from '@/shared/lib/format';
import QuantityStepper from './QuantityStepper';

function getCartItemDetailUrl(itemId: string): string | null {
  const product = MOCK_PRODUCTS.find((p) => p.id === itemId);
  if (!product?.animal || !product?.subcategoryId) return null;

  return productHref(product);
}

interface CartItemRowProps {
  item: CartItem;
  onDecrease: () => void;
  onIncrease: () => void;
  onRemove: () => void;
}

export default function CartItemRow({ item, onDecrease, onIncrease, onRemove }: CartItemRowProps) {
  const detailUrl = getCartItemDetailUrl(item.id);
  const titleClassName =
    'text-sm sm:text-base font-bold text-stone-900 leading-tight font-comfortaa pr-2 transition-colors max-w-sm line-clamp-2';

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 pt-4 first:pt-0 border-b border-stone-100">

      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-xl bg-stone-50 flex items-center justify-center flex-shrink-0 border border-stone-100">
          <ProductIcon alt={item.name} className="w-12 h-12" />
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

        <QuantityStepper
          value={item.quantity}
          itemContext={item.name}
          onDecrease={onDecrease}
          onIncrease={onIncrease}
        />

        <div className="text-right space-y-1 shrink-0 min-w-24">
          <p className="text-base sm:text-lg font-extrabold text-stone-900 font-comfortaa">
            {formatPrice(item.price * item.quantity)}
          </p>
          {item.oldPrice && (
            <p className="text-xs text-stone-400 line-through font-inter">
              {formatPrice(item.oldPrice * item.quantity)}
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={onRemove}
          className="text-stone-400 hover:text-red-500 p-2 rounded-full hover:bg-red-50/50 transition-colors flex-shrink-0 cursor-pointer"
          title="Удалить товар"
          aria-label={`Удалить ${item.name} из корзины`}
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}
