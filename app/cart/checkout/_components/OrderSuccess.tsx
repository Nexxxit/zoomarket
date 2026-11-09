'use client';

import React from 'react';
import Link from 'next/link';
import { CheckCircle, Truck, Store } from 'lucide-react';
import { motion } from 'motion/react';
import { LottiePlayer } from '@/shared/ui';
import type { CartItem } from '@/entities/cart';
import { formatAddress } from '@/entities/user';
import { PICKUP_STORES } from '@/shared/config/site';
import RatePurchased from './RatePurchased';

interface OrderSuccessProps {
  checkoutType: 'delivery' | 'pickup';
  pickupAddress: string;
  name: string;
  phone: string;
  email: string;
  street: string;
  house: string;
  entrance: string;
  flat: string;
  deliveryInterval: string;
  comment: string;
  orderId: string;
  orderTime: string;
  orderTotal: number;
  purchasedItems: CartItem[];
}

export default function OrderSuccess({
  checkoutType,
  pickupAddress,
  name,
  phone,
  email,
  street,
  house,
  entrance,
  flat,
  deliveryInterval,
  comment,
  orderId,
  orderTime,
  orderTotal,
  purchasedItems,
}: OrderSuccessProps) {
  const selectedStore = PICKUP_STORES.find(store => store.address === pickupAddress) || PICKUP_STORES[0];

  return (
    <motion.div
      key="success"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-2xl mx-auto space-y-8 py-10"
    >

      <div className="text-center space-y-4">
        {checkoutType === 'delivery' ? (
          <div className="h-52 w-full max-w-lg mx-auto mb-2">
            <LottiePlayer type="courier-scooter" className="h-full w-full" />
          </div>
        ) : (
          <div className="h-44 w-full max-w-lg mx-auto mb-2 flex flex-col items-center justify-center">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center border border-green-100 shadow-xs text-green-500">
              <CheckCircle className="w-10 h-10" />
            </div>
            <p className="text-xs font-semibold text-stone-600 font-inter mt-3">Ваш заказ успешно оформлен! 🎉🐾</p>
          </div>
        )}

        <div className="space-y-1">
          <span className="text-[10px] font-extrabold text-green-600 bg-green-100/70 px-3 py-1 rounded-full uppercase tracking-wider font-comfortaa">
            Заказ принят в обработку! 🚀
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 font-comfortaa tracking-tight pt-2">
            Спасибо за доверие, {name}!
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 font-inter max-w-lg mx-auto leading-relaxed">
            Наши специалисты уже упаковывают самые свежие вкусняшки для вашего любимца!
          </p>
        </div>
      </div>

      <div className="bg-white border border-stone-150 rounded-[28px] shadow-xs overflow-hidden divide-y divide-stone-150">

        <div className="p-6 bg-stone-50/50 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-inter font-medium text-stone-600">
          <div className="space-y-1 border-r border-stone-150/60 pr-2">
            <span className="text-stone-400 block text-[10px] font-bold uppercase tracking-wider">Номер Заказа</span>
            <strong className="text-stone-900 font-mono text-sm">{orderId}</strong>
          </div>
          <div className="space-y-1 sm:border-r border-stone-150/60 pr-2">
            <span className="text-stone-400 block text-[10px] font-bold uppercase tracking-wider">Дата Заказа</span>
            <strong className="text-stone-800 text-[11px] leading-tight block">{orderTime}</strong>
          </div>
          <div className="space-y-1 border-r border-stone-150/60 pr-2 pt-2 sm:pt-0">
            <span className="text-stone-400 block text-[10px] font-bold uppercase tracking-wider">Получение</span>
            <strong className="text-orange-650 flex items-center gap-1">
              {checkoutType === 'delivery' ? (
                <>
                  <Truck className="w-3.5 h-3.5" />
                  <span>Курьер</span>
                </>
              ) : (
                <>
                  <Store className="w-3.5 h-3.5" />
                  <span>Самовывоз</span>
                </>
              )}
            </strong>
          </div>
          <div className="space-y-1 pt-2 sm:pt-0">
            <span className="text-stone-400 block text-[10px] font-bold uppercase tracking-wider">Сумма заказа</span>
            <strong className="text-stone-900 text-sm font-comfortaa">{orderTotal} ₽</strong>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider font-comfortaa">
            Детали доставки и контакты
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-inter">
            <div className="space-y-1 bg-stone-50 p-3.5 rounded-xl border border-stone-100">
              <span className="text-stone-400 font-bold block">Получатель:</span>
              <span className="font-semibold text-stone-800 block">{name}</span>
              <span className="text-stone-500 block font-mono">{phone}</span>
              {email && <span className="text-stone-500 block">{email}</span>}
            </div>

            <div className="space-y-1 bg-stone-50 p-3.5 rounded-xl border border-stone-100">
              <span className="text-stone-400 font-bold block">
                {checkoutType === 'delivery' ? 'Адрес Доставки:' : 'Адрес Самовывоза:'}
              </span>
              {checkoutType === 'delivery' ? (
                <>
                  <p className="font-semibold text-stone-800 leading-relaxed">
                    {formatAddress({ street, house, flat, entrance })}
                  </p>
                  <span className="block text-[10px] text-stone-400 font-normal mt-0.5">Интервал доставки: {deliveryInterval}</span>
                </>
              ) : (
                <p className="font-semibold text-stone-800 leading-relaxed">
                  {pickupAddress}
                  <span className="block text-[10px] text-stone-400 font-normal mt-0.5">Часы работы: {selectedStore.hours}</span>
                </p>
              )}
            </div>
          </div>

          {comment && (
            <div className="p-3 bg-orange-50/50 border border-orange-100 text-stone-600 text-xs rounded-xl font-medium font-inter">
              <strong>Комментарий к заказу:</strong> &quot;{comment}&quot;
            </div>
          )}
        </div>

        <div className="p-6 bg-stone-50/30 text-center text-xs font-inter text-stone-500 leading-normal">
          {email ? (
            <>
              Копия чека отправлена вам на email <strong>{email}</strong>. Статус заказа продолжает отслеживаться по SMS на номер <strong>{phone}</strong>. Мы сохраняем историю вашей заботы о питомце!
            </>
          ) : (
            <>
              Копия чека и статус отслеживания курьера отправлены вам по SMS на номер <strong>{phone}</strong>. Мы сохраняем историю вашей заботы о питомце!
            </>
          )}
        </div>

      </div>

      <RatePurchased purchasedItems={purchasedItems} />

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
        <Link
          href="/"
          className="px-8 py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-bold font-comfortaa text-xs sm:text-sm rounded-full shadow-md shadow-orange-500/10 text-center w-full sm:w-auto"
        >
          Вернуться в каталог 🛍️
        </Link>
      </div>

    </motion.div>
  );
}
