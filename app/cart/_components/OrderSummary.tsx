'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { CreditCard, Truck, Store, ShieldCheck } from 'lucide-react';
import CartRecommendations from './CartRecommendations';
import type { CartItem, CheckoutType } from '@/entities/cart';
import type { Product } from '@/entities/product';
import { formatPrice } from '@/shared/lib/format';

interface OrderSummaryProps {
  cart: CartItem[];
  itemCount: number;
  checkoutType: CheckoutType;
  onCheckoutTypeChange?: (type: CheckoutType) => void;
  itemsSubtotal: number;
  totalSavings: number;
  deliveryCost: number;
  promoDiscount: number;
  promoError: string | null;
  promoSuccess: string | null;
  grandTotal: number;
  promoInput: string;
  onPromoInputChange: (value: string) => void;
  onApplyPromo: () => void;
  onAddRecommendation?: (product: Product) => void;
}

export default function OrderSummary({
  cart,
  itemCount,
  checkoutType,
  onCheckoutTypeChange,
  itemsSubtotal,
  totalSavings,
  deliveryCost,
  promoDiscount,
  promoError,
  promoSuccess,
  grandTotal,
  promoInput,
  onPromoInputChange,
  onApplyPromo,
  onAddRecommendation,
}: OrderSummaryProps) {
  const router = useRouter();

  return (
    <div className="bg-orange-50 rounded-3xl p-6 border border-orange-100 flex flex-col gap-6">

      <div className="space-y-2">
        <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider font-comfortaa block">
          Способ получения заказа
        </label>
        <div className="flex bg-orange-100/40 p-1.5 rounded-full border border-orange-100/50">
          <button
            type="button"
            onClick={() => onCheckoutTypeChange?.('delivery')}
            aria-pressed={checkoutType === 'delivery'}
            className={`flex-1 py-2.5 text-center text-xs font-bold rounded-full transition-all cursor-pointer flex items-center justify-center gap-1.5 ${checkoutType === 'delivery'
              ? 'bg-orange-500 text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
              }`}
          >
            <Truck className="w-3.5 h-3.5" />
            <span>Доставка</span>
          </button>
          <button
            type="button"
            onClick={() => onCheckoutTypeChange?.('pickup')}
            aria-pressed={checkoutType === 'pickup'}
            className={`flex-1 py-2.5 text-center text-xs font-bold rounded-full transition-all cursor-pointer flex items-center justify-center gap-1.5 ${checkoutType === 'pickup'
              ? 'bg-orange-500 text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
              }`}
          >
            <Store className="w-3.5 h-3.5" />
            <span>Самовывоз</span>
          </button>
        </div>
      </div>

      <h3 className="text-base sm:text-lg font-extrabold text-stone-950 font-comfortaa leading-none pt-2 border-t border-orange-200/20">
        Итого по заказу
      </h3>

      <div className="space-y-4 text-sm font-inter text-stone-700">
        <div className="flex justify-between">
          <span className="text-stone-500">Подитог ({itemCount} тов.):</span>
          <span className="font-semibold text-stone-900">{formatPrice(itemsSubtotal)}</span>
        </div>
        {totalSavings > 0 && (
          <div className="flex justify-between text-orange-650">
            <span>Экономия по акциям:</span>
            <span className="font-semibold">–{formatPrice(totalSavings)}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-stone-500">Получение заказа:</span>
          <span className="font-semibold text-stone-900">
            {checkoutType === 'delivery'
              ? (deliveryCost === 0 ? 'Бесплатно' : formatPrice(deliveryCost))
              : 'Самовывоз (Бесплатно)'}
          </span>
        </div>

        <div className="border-t border-orange-200/20 pt-4 space-y-2">
          <div className="flex items-center justify-between gap-2">
            <input
              type="text"
              value={promoInput}
              onChange={(e) => onPromoInputChange(e.target.value)}
              placeholder="Введите промокод"
              className="flex-1 bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs focus:outline-hidden focus:border-orange-500 focus-visible:ring-2 focus-visible:ring-orange-500/40 focus-visible:ring-offset-1 font-medium placeholder:text-stone-400"
            />
            <button
              type="button"
              onClick={onApplyPromo}
              className="bg-orange-500 text-white font-bold text-xs px-4 py-2 rounded-xl hover:bg-orange-600 transition-colors cursor-pointer whitespace-nowrap border-none"
            >
              Применить
            </button>
          </div>
          {promoError && (
            <p className="text-[10px] text-red-500 font-bold leading-tight">{promoError}</p>
          )}
          {promoSuccess && (
            <p className="text-[10px] text-emerald-600 font-bold leading-tight">{promoSuccess}</p>
          )}
        </div>

        <div className="border-t border-orange-200/50 pt-4 flex justify-between items-end">
          <span className="font-bold text-stone-950 font-comfortaa text-base">К оплате:</span>
          <div className="flex items-center gap-2">
            {promoDiscount > 0 && (
              <span className="text-sm text-stone-400 line-through font-comfortaa">
                {formatPrice(itemsSubtotal + deliveryCost)}
              </span>
            )}
            <span className="text-2xl font-black text-orange-500 font-comfortaa">{formatPrice(grandTotal)}</span>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => router.push('/cart/checkout')}
        className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold font-inter rounded-full tracking-wide text-xs sm:text-sm shadow-xs cursor-pointer flex items-center justify-center gap-2 transition-colors"
      >
        <CreditCard className="w-4 h-4" />
        <span>Перейти к оформлению</span>
      </button>

      <CartRecommendations cart={cart} onAdd={onAddRecommendation} />
    </div>
  );
}
