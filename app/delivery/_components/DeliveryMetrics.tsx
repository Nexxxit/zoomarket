import React from 'react';

export default function DeliveryMetrics() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-stone-50 p-4 rounded-2xl border border-stone-100 text-center">
        <span className="block text-xl md:text-2xl font-bold font-comfortaa text-stone-900">43,000+</span>
        <span className="block text-[10px] sm:text-xs text-stone-500 font-inter mt-1 uppercase tracking-wider">Доставок сделано</span>
      </div>
      <div className="bg-stone-50 p-4 rounded-2xl border border-stone-100 text-center">
        <span className="block text-xl md:text-2xl font-bold font-comfortaa text-green-600">99.4%</span>
        <span className="block text-[10px] sm:text-xs text-stone-500 font-inter mt-1 uppercase tracking-wider">Довольных хвостиков</span>
      </div>
    </div>
  );
}
