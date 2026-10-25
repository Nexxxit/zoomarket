'use client';

import React from 'react';
import { Filter, Percent, Check } from 'lucide-react';

interface FiltersSidebarProps {
  priceMin: string;
  priceMax: string;
  selectedBrands: string[];
  onSaleOnly: boolean;
  badgeFilterOnly: boolean;
  onSaleCount: number;
  availableBrandsInSubcategory: { name: string; count: number }[];
}

export default function FiltersSidebar({
  priceMin,
  priceMax,
  selectedBrands,
  onSaleOnly,
  badgeFilterOnly,
  onSaleCount,
  availableBrandsInSubcategory,
}: FiltersSidebarProps) {
  return (
    <div className="bg-white border border-stone-200/80 rounded-3xl p-5 shadow-xs space-y-6">

      <div className="space-y-6">
        <div className="flex justify-between items-center pb-1">
          <span className="text-sm font-bold font-comfortaa text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
            <Filter className="w-4 h-4 text-stone-500" />
            <span>Фильтры поиска</span>
          </span>
          {(priceMin || priceMax || selectedBrands.length > 0 || onSaleOnly || badgeFilterOnly) && (
            <button
              type="button"
              className="text-xs font-bold text-red-500 hover:text-red-700 font-comfortaa uppercase tracking-wider cursor-pointer bg-transparent border-0"
            >
              Сбросить
            </button>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-stone-400 uppercase tracking-widest block font-comfortaa">Полезные свойства</label>

          <div className="space-y-1.5 font-inter">
            <button
              type="button"
              className={`w-full flex items-center justify-between p-2 rounded-xl text-xs md:text-sm font-semibold cursor-pointer transition-all border-0 ${onSaleOnly ? 'bg-orange-500/10 text-orange-650 font-bold' : 'bg-transparent text-stone-700 hover:bg-stone-50'
                }`}
            >
              <div className="flex items-center gap-2">
                <Percent className="w-4 h-4 opacity-75" />
                <span>Только со скидкой</span>
              </div>
              <span className="bg-stone-100 text-stone-500 px-2 py-0.5 rounded-full text-[10px] font-mono">{onSaleCount}</span>
            </button>
          </div>
        </div>

        <div className="space-y-2.5">
          <label className="text-xs font-bold text-stone-400 uppercase tracking-widest block font-comfortaa">Диапазон цены (₽)</label>
          <div className="grid grid-cols-2 gap-2 font-mono">
            <input
              type="number"
              placeholder="От"
              className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs md:text-sm focus:outline-none focus:border-orange-500 font-medium"
            />
            <input
              type="number"
              placeholder="До"
              className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs md:text-sm focus:outline-none focus:border-orange-500 font-medium"
            />
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-xs font-bold text-stone-400 uppercase tracking-widest block font-comfortaa">Бренды производители</label>

          <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-1">
            {availableBrandsInSubcategory.map((brand) => {
              const isSelected = selectedBrands.includes(brand.name);
              return (
                <button
                  key={brand.name}
                  type="button"
                  className={`w-full flex items-center justify-between p-2 rounded-xl text-xs md:text-sm font-semibold cursor-pointer transition-all border-0 ${isSelected ? 'bg-orange-500/10 text-orange-650 font-bold' : 'bg-transparent text-stone-600 hover:bg-stone-50'
                    }`}
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-3.5 h-3.5 rounded-md border flex items-center justify-center transition-all ${isSelected ? 'bg-orange-500 border-orange-500 text-white' : 'border-stone-300 bg-white'
                      }`}>
                      {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                    </div>
                    <span>{brand.name}</span>
                  </div>
                  <span className="text-[10px] text-stone-400 font-mono">({brand.count})</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
