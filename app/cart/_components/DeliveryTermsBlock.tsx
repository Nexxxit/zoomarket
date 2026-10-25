'use client';

import React from 'react';
import { motion } from 'motion/react';
import { FREE_SHIPPING_THRESHOLD, DELIVERY_COST } from '@/shared/config/commerce';
import { formatPrice } from '@/shared/lib/format';

export default function DeliveryTermsBlock() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#FFF7ED] rounded-[24px] p-6 border border-orange-100 space-y-5"
    >
      <h3 className="text-sm font-bold font-comfortaa text-orange-950 uppercase tracking-wider flex items-center gap-2">
        <span>📍 Условия Доставки</span>
      </h3>

      <ul className="space-y-4 text-xs text-stone-700 font-inter">
        <li className="flex gap-3">
          <span className="text-base">🚀</span>
          <div>
            <strong>Бесплатно от {formatPrice(FREE_SHIPPING_THRESHOLD)}:</strong> При меньшей стоимости заказа доставка по городу составит фиксированные {formatPrice(DELIVERY_COST)}.
          </div>
        </li>
        <li className="flex gap-3">
          <span className="text-base">🕒</span>
          <div>
            <strong>Экспресс доставка:</strong> Для рецептурных лекарств и экстренных аксессуаров за 1 час! Действует курьерский сбор.
          </div>
        </li>
        <li className="flex gap-3">
          <span className="text-base">🦴</span>
          <div>
            <strong>Подарок-сюрприз:</strong> В каждую доставку мы упаковываем вкусный экологический комплимент от Айболита.
          </div>
        </li>
      </ul>

      <div className="text-[11px] text-stone-500 border-t border-orange-200/50 pt-4 leading-normal">
        Возникли перебои с адресацией? Свяжитесь с нами напрямую по номеру <strong className="text-orange-950 font-bold">8 (952) 677-07-77</strong> для ручной коррекции координации.
      </div>
    </motion.div>
  );
}
