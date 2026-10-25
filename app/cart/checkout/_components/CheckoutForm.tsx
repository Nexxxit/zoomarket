'use client';

import React from 'react';
import {
  CheckCircle, User, Phone, FileText, ShieldCheck, Mail,
} from 'lucide-react';
import { motion } from 'motion/react';
import type { CartItem, } from '@/entities/cart';
import type { UserProfile } from '@/entities/user';
import PickupStoresSection from './PickupStoresSection';

interface CheckoutFormProps {
  cart: CartItem[];
  checkoutType: 'delivery' | 'pickup';
  pickupAddress: string;
  itemsSubtotal: number;
  deliveryCost: number;
  grandTotal: number;
  user?: UserProfile | null;
}

export default function CheckoutForm({
  cart,
  checkoutType,
  pickupAddress,
  itemsSubtotal,
  deliveryCost,
  grandTotal,
  user = null,
}: CheckoutFormProps) {
  return (
    <form onSubmit={(e) => e.preventDefault()} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mt-8">

      <div className="lg:col-span-8 bg-white border border-stone-150 rounded-3xl p-6 md:p-8 shadow-sm space-y-8">

        <div className="space-y-5 border-b border-stone-100 pb-8">
          <h2 className="text-base font-bold font-comfortaa text-stone-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-orange-100 text-orange-650 flex items-center justify-center text-xs font-bold font-mono">1</span>
            <span>Контактные данные получателя</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-stone-500 font-comfortaa uppercase tracking-wider block">
                Ваше Имя *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-stone-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  disabled={!!user}
                  placeholder="Константин Константинопольский"
                  className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm font-inter text-stone-900 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 transition-all font-medium disabled:opacity-75 disabled:bg-stone-100 disabled:cursor-not-allowed disabled:border-stone-200/50"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-stone-500 font-comfortaa uppercase tracking-wider block">
                Номер телефона *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-stone-400">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  type="tel"
                  required
                  disabled={!!user}
                  placeholder="+7 (999) 123-45-67"
                  className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm font-inter text-stone-900 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 transition-all font-medium disabled:opacity-75 disabled:bg-stone-100 disabled:cursor-not-allowed disabled:border-stone-200/50"
                />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-stone-500 font-comfortaa uppercase tracking-wider block">
              Электронная почта (для чека)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-stone-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                disabled={!!user}
                placeholder="petlover@aibolit.ru"
                className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm font-inter text-stone-900 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 transition-all font-medium disabled:opacity-75 disabled:bg-stone-100 disabled:cursor-not-allowed disabled:border-stone-200/50"
              />
            </div>
          </div>
        </div>

        <div className="space-y-6 border-b border-stone-100 pb-8">

          {checkoutType === 'delivery' ? (

            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h2 className="text-base font-bold font-comfortaa text-stone-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-orange-100 text-orange-650 flex items-center justify-center text-xs font-bold font-mono">2</span>
                  <span>Адрес и условия доставки</span>
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-[10px] font-bold text-stone-500 font-comfortaa uppercase tracking-wider block">
                    Улица *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="ул. Александра Невского"
                    className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm font-inter text-stone-900 focus:outline-none focus:border-orange-500 transition-all font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-stone-500 font-comfortaa uppercase tracking-wider block">
                    Дом *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="д. 14Б"
                    className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm font-inter text-stone-900 focus:outline-none focus:border-orange-500 transition-all font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-stone-500 font-comfortaa uppercase tracking-wider block">
                    Квартира / Офис
                  </label>
                  <input
                    type="text"
                    placeholder="кв. 102"
                    className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm font-inter text-stone-900 focus:outline-none focus:border-orange-500 transition-all font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-stone-500 font-comfortaa uppercase tracking-wider block">
                    Подъезд / Домофон
                  </label>
                  <input
                    type="text"
                    placeholder="Подъезд 3, код 123"
                    className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm font-inter text-stone-900 focus:outline-none focus:border-orange-500 transition-all font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-stone-500 font-comfortaa uppercase tracking-wider block">
                    Интервал доставки
                  </label>
                  <select className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm font-inter text-stone-900 focus:outline-none focus:border-orange-500 transition-all font-semibold">
                    <option>Сегодня (ближайшее время) — 2 часа</option>
                    <option>Завтра с 10:00 до 14:00</option>
                    <option>Завтра с 14:00 до 18:00</option>
                    <option>Завтра с 18:00 до 22:00</option>
                  </select>
                </div>
              </div>
            </div>
          ) : (

            <PickupStoresSection pickupAddress={pickupAddress} />
          )}
        </div>

        <div className="space-y-4">
          <h2 className="text-base font-bold font-comfortaa text-stone-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-orange-100 text-orange-650 flex items-center justify-center text-xs font-bold font-mono">3</span>
            <span>Дополнительные инструкции</span>
          </h2>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-stone-500 font-comfortaa uppercase tracking-wider block">
              Комментарий к заказу
            </label>
            <div className="relative">
              <div className="absolute top-3 left-3 pointer-events-none text-stone-400">
                <FileText className="w-4 h-4" />
              </div>
              <textarea
                rows={3}
                placeholder="Например: Пожалуйста, оставьте пакет у двери или позвоните за 30 минут до прибытия."
                className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm font-inter text-stone-900 focus:outline-none focus:border-orange-500 transition-all font-medium placeholder:text-stone-400"
              />
            </div>
          </div>
        </div>

      </div>

      <div className="lg:col-span-4 bg-white border border-stone-150 rounded-3xl p-6 shadow-sm space-y-6">

        <h3 className="text-sm font-bold font-comfortaa text-stone-500 uppercase tracking-widest leading-none block">
          Ваш заказ
        </h3>

        <div className="divide-y divide-stone-100 max-h-[220px] overflow-y-auto pr-1">
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

    </form>
  );
}
