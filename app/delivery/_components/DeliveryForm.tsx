'use client';

import React from 'react';
import { Shield } from 'lucide-react';
import { motion } from 'motion/react';
import { MOCK_DISTRICTS } from '@/shared/config/site';

export default function DeliveryForm() {
  return (
    <section className="lg:col-span-7 bg-white rounded-3xl p-6 md:p-8 border border-stone-100 shadow-sm space-y-8">
      <h2 className="text-lg md:text-xl font-bold font-comfortaa text-stone-900 pb-3 border-b border-stone-150">
        📋 Анкета доставки лакомств
      </h2>

      <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-600 font-comfortaa uppercase tracking-wider">
              Ваше Имя
            </label>
            <input
              type="text"
              required
              placeholder="Александр Иванов"
              className="w-full px-4 py-3 bg-stone-50 border border-[#E7E5E4] rounded-xl text-sm font-inter text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-[#F97316] focus:ring-3 focus:ring-orange-500/10 transition-all font-medium"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-600 font-comfortaa uppercase tracking-wider">
              Контактный Телефон
            </label>
            <input
              type="tel"
              required
              placeholder="+7 (999) 123-45-67"
              className="w-full px-4 py-3 bg-stone-50 border border-[#E7E5E4] rounded-xl text-sm font-inter text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-[#F97316] focus:ring-3 focus:ring-orange-500/10 transition-all font-medium"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="col-span-1 space-y-1.5">
            <label className="text-xs font-bold text-stone-600 font-comfortaa uppercase tracking-wider">
              Район доставки
            </label>
            <select
              className="w-full px-3 py-3 bg-stone-50 border border-[#E7E5E4] rounded-xl text-sm font-inter text-stone-900 focus:outline-none focus:border-[#F97316] focus:ring-3 focus:ring-orange-500/10 transition-all font-medium"
            >
              {MOCK_DISTRICTS.map((d) => (
                <option key={d.value} value={d.value}>
                  {d.label}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2 space-y-1.5">
            <label className="text-xs font-bold text-stone-600 font-comfortaa uppercase tracking-wider">
              Улица, дом, квартира
            </label>
            <input
              type="text"
              required
              placeholder="Ленинский проспект, д. 45, кв. 112"
              className="w-full px-4 py-3 bg-stone-50 border border-[#E7E5E4] rounded-xl text-sm font-inter text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-[#F97316] focus:ring-3 focus:ring-orange-500/10 transition-all font-medium"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-600 font-comfortaa uppercase tracking-wider">
              Интервал доставки
            </label>
            <select
              className="w-full px-3 py-3 bg-stone-50 border border-[#E7E5E4] rounded-xl text-sm font-inter text-stone-900 focus:outline-none focus:border-[#F97316] focus:ring-3 focus:ring-orange-500/10 transition-all font-medium"
            >
              <option>Сегодня: 12:00 – 15:00</option>
              <option>Сегодня: 15:00 – 18:00</option>
              <option>Сегодня: 18:00 – 21:00</option>
              <option>Завтра: Любое время с 09:00</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-600 font-comfortaa uppercase tracking-wider">
              Кто ждет подарок в заказе?
            </label>
            <select
              className="w-full px-3 py-3 bg-stone-50 border border-[#E7E5E4] rounded-xl text-sm font-inter text-stone-900 focus:outline-none focus:border-[#F97316] focus:ring-3 focus:ring-orange-500/10 transition-all font-medium"
            >
              <option>🐱 Кот / Кошка</option>
              <option>🐶 Собака / Щенок</option>
              <option>🐦 Попугай / Птичка</option>
              <option>🐾 Другой забавный питомец</option>
            </select>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-stone-600 font-comfortaa uppercase tracking-wider">
            Комментарий для курьера службы доставки
          </label>
          <textarea
            rows={3}
            placeholder="Оставьте здесь пожелания: например, позвонить за 15 минут, передать консьержу или не звонить в дверь, так как собака пугается звуков..."
            className="w-full px-4 py-3 bg-stone-50 border border-[#E7E5E4] rounded-xl text-sm font-inter text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-[#F97316] focus:ring-3 focus:ring-orange-500/10 transition-all font-medium resize-none"
          ></textarea>
        </div>

        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="w-full py-4 bg-[#F97316] hover:bg-[#EA580C] text-white font-semibold font-inter text-sm md:text-base rounded-full shadow-sm transition-colors text-center cursor-pointer"
        >
          🚀 Заказать бережную доставку Айболит
        </motion.button>
      </form>

      <div className="flex items-start gap-3 bg-stone-50 p-4 rounded-2xl border border-stone-150">
        <Shield className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
        <div className="text-xs text-stone-500 space-y-1 font-inter">
          <p className="font-bold text-stone-800">Безопасная бесконтактная передача</p>
          <p>Все медицинские средства защиты соблюдаются. Заказы со сложными ветеринарными препаратами комплектуются в изотермических пакетах с температурными датчиками.</p>
        </div>
      </div>
    </section>
  );
}
