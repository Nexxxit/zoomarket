'use client';

import { Truck, Award } from 'lucide-react';

export default function ProductDeliveryInfo() {
  return (
    <div className="grid grid-cols-2 gap-4 text-[11px] font-inter text-stone-600">
      <div className="flex items-start gap-2 bg-stone-50/50 border border-stone-100 p-3 rounded-2xl">
        <Truck className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-stone-800 block">Быстрая доставка</span>
          <span>Курьером на дом сегодня или завтра. Бесплатно от 1500₽.</span>
        </div>
      </div>
      <div className="flex items-start gap-2 bg-stone-50/50 border border-stone-100 p-3 rounded-2xl">
        <Award className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-stone-800 block">Забрать в магазине</span>
          <span>Самовывоз через 30 минут из любого зоомаркета бесплатно.</span>
        </div>
      </div>
    </div>
  );
}
