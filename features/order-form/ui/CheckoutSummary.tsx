'use client';

import React from 'react';
import { CheckCircle, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';
import type { CartItem, CheckoutType } from '@/entities/cart';

interface CheckoutSummaryProps {
  cart: CartItem[];
  checkoutType: CheckoutType;
  itemsSubtotal: number;
  deliveryCost: number;
  promoDiscount: number;
  grandTotal: number;
}

export default function CheckoutSummary({
  cart,
  checkoutType,
  itemsSubtotal,
  deliveryCost,
  promoDiscount,
  grandTotal,
}: CheckoutSummaryProps) {
  return (
    <div className="lg:col-span-4 bg-white border border-stone-150 rounded-3xl p-6 shadow-sm space-y-6">

      <h3 className="text-sm font-bold font-comfortaa text-stone-500 uppercase tracking-widest leading-none block">
        Ваш заказ
      </h3>

      <div className="divide-y divide-stone-100 max-h-55 overflow-y-auto pr-1">
        {cart.map((item) => (
          <div key={`${item.id}-${item.size}`} className="py-3 flex justify-between items-start text-xs font-inter gap-4 first:pt-0">
            <div className="space-y-0.5">
              <p className="font-bold text-stone-900 line-clamp-2 leading-tight">
                {item.name}
              </p>
              <div className="flex gap-2 text-[10px] text-stone-400">
                <span>Кол-во: {item.quantity} шт.</span>
                {item.size && <span>• Вес: {item.size}</span>}
              </div>
            </div>
            <span className="font-extrabold text-stone-900 flex-shrink-0">
              {item.price * item.quantity} ₽
            </span>
          </div>
        ))}
      </div>

      <div className="border-t border-stone-100 pt-4 space-y-3.5 text-xs font-inter text-stone-600">
        <div className="flex justify-between">
          <span>Сумма по товарам:</span>
          <strong className="text-stone-900">{itemsSubtotal} ₽</strong>
        </div>
        <div className="flex justify-between">
          <span>Способ получения:</span>
          <strong className="text-stone-900">{checkoutType === 'delivery' ? 'Доставка' : 'Самовывоз'}</strong>
        </div>
        <div className="flex justify-between">
          <span>Стоимость доставки:</span>
          <strong className="text-stone-900">{deliveryCost === 0 ? 'Бесплатно' : `${deliveryCost} ₽`}</strong>
        </div>
        {promoDiscount > 0 && (
          <div className="flex justify-between text-orange-600">
            <span>Промокод:</span>
            <strong>–{promoDiscount} ₽</strong>
          </div>
        )}
        <div className="border-t border-stone-100 pt-4 flex justify-between items-end">
          <span className="font-bold font-comfortaa text-stone-950 text-sm">Всего к оплате:</span>
          <span className="text-xl font-extrabold text-orange-500 font-comfortaa">{grandTotal} ₽</span>
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        type="submit"
        className="w-full py-4 bg-green-600 hover:bg-green-700 text-white font-bold font-comfortaa text-xs sm:text-sm rounded-full tracking-wide shadow-md shadow-green-500/10 cursor-pointer flex items-center justify-center gap-2 transition-all"
      >
        <CheckCircle className="w-4 h-4" />
        <span>Подтвердить и заказать</span>
      </motion.button>

      <div className="flex gap-2.5 text-[10px] text-stone-400 font-inter leading-relaxed bg-stone-50 p-3.5 rounded-xl border border-stone-100">
        <ShieldCheck className="w-4 h-4 text-green-600 flex-shrink-0" />
        <p>Нажимая кнопку, вы соглашаетесь с условиями пользовательского соглашения ветеринарного ведомства «Айболит».</p>
      </div>

    </div>
  );
}
