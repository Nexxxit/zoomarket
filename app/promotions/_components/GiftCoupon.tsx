import React from 'react';

export default function GiftCoupon() {
  return (
    <section className="mt-16 bg-green-500/10 border border-green-200 p-8 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6">
      <div className="flex items-center gap-4 text-center md:text-left flex-col md:flex-row">
        <div className="w-14 h-14 bg-green-500 text-white rounded-2xl flex items-center justify-center text-2xl shadow-md">
          🎁
        </div>
        <div className="space-y-1">
          <h3 className="text-base sm:text-lg font-bold font-comfortaa text-green-950">Скидка на весь заказ промокодом!</h3>
          <p className="text-xs sm:text-sm text-green-800 font-inter max-w-xl">
            Введите промокод в корзине — и получите скидку 10% на весь заказ, включая корма для котят и щенков.
          </p>
        </div>
      </div>
      <div className="relative font-comfortaa bg-white py-3 px-6 rounded-2xl border-2 border-dashed border-green-500 font-black text-green-700 tracking-wider text-sm shadow-xs">
        ПРОМОКОД: AIBOLIT10
      </div>
    </section>
  );
}
