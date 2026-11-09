'use client';

import React from 'react';
import { MapPin } from 'lucide-react';
import { PICKUP_STORES } from '@/shared/config/site';

interface PickupStoresSectionProps {
  pickupAddress: string;
  onSelectStore: (address: string) => void;
}

export default function PickupStoresSection({ pickupAddress, onSelectStore }: PickupStoresSectionProps) {
  return (
    <div className="space-y-5">
      <div className="space-y-1">
        <h2 className="text-base font-bold font-comfortaa text-stone-900 flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-orange-100 text-orange-650 flex items-center justify-center text-xs font-bold font-mono">2</span>
          <span>Выбор пункта самовывоза</span>
        </h2>
        <p className="text-[11px] text-stone-400 font-inter">
          Выберите удобный для вас пункт выдачи заказов ветеринарного ведомства «Айболит»:
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {PICKUP_STORES.map((store) => {
          const isSelected = pickupAddress === store.address;
          return (
            <button
              key={store.id}
              type="button"
              onClick={() => onSelectStore(store.address)}
              className={`w-full text-left p-4 border rounded-2xl transition-all cursor-pointer flex gap-3 ${isSelected
                ? 'bg-orange-500/10 border-orange-500 shadow-xs'
                : 'bg-stone-50 border-stone-150 hover:bg-stone-100/50'
                }`}
            >
              <MapPin className={`w-5 h-5 flex-shrink-0 mt-0.5 ${isSelected ? 'text-orange-500' : 'text-stone-400'}`} />
              <div className="space-y-1 font-inter">
                <h4 className={`text-xs font-extrabold font-comfortaa ${isSelected ? 'text-orange-900' : 'text-stone-900'}`}>
                  {store.name}
                </h4>
                <p className="text-[11px] text-stone-500 leading-normal">
                  {store.address}
                </p>
                <div className="flex flex-col gap-1 text-[10px] font-semibold text-stone-400 pt-1">
                  <span>🕒 {store.hours}</span>
                  <span>📞 {store.phone}</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
