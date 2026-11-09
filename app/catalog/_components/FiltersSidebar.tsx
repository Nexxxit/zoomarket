'use client';

import React from 'react';
import { Filter, Percent, Check } from 'lucide-react';
import { cn } from '@/shared/lib';
import { hasActiveFilters } from '@/features/catalog';
import type { BrandFacet, FilterCriteria } from '@/features/catalog';

interface FiltersSidebarProps {
  filters: FilterCriteria;
  brandFacets: BrandFacet[];
  onSaleCount: number;
}

function FilterToggleRow({
  active,
  leading,
  trailing,
  idleClassName = 'text-stone-700',
}: {
  active: boolean;
  leading: React.ReactNode;
  trailing: React.ReactNode;
  idleClassName?: string;
}) {
  return (
    <button
      type="button"
      className={cn(
        'w-full flex items-center justify-between p-2 rounded-xl text-xs md:text-sm font-semibold cursor-pointer transition-all border-0',
        active ? 'bg-orange-500/10 text-orange-650 font-bold' : cn('bg-transparent hover:bg-stone-50', idleClassName),
      )}
    >
      <div className="flex items-center gap-2">{leading}</div>
      {trailing}
    </button>
  );
}

export default function FiltersSidebar({ filters, brandFacets, onSaleCount }: FiltersSidebarProps) {
  const isResetVisible = hasActiveFilters(filters);

  return (
    <div className="bg-white border border-stone-200/80 rounded-3xl p-5 shadow-xs space-y-6">

      <div className="space-y-6">
        <div className="flex justify-between items-center pb-1">
          <span className="text-sm font-bold font-comfortaa text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
            <Filter className="w-4 h-4 text-stone-500" />
            <span>Фильтры поиска</span>
          </span>
          {isResetVisible && (
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
            <FilterToggleRow
              active={filters.onSaleOnly}
              leading={
                <>
                  <Percent className="w-4 h-4 opacity-75" />
                  <span>Только со скидкой</span>
                </>
              }
              trailing={
                <span className="bg-stone-100 text-stone-500 px-2 py-0.5 rounded-full text-[10px] font-mono">{onSaleCount}</span>
              }
            />
          </div>
        </div>

        <div className="space-y-2.5">
          <label className="text-xs font-bold text-stone-400 uppercase tracking-widest block font-comfortaa">Диапазон цены (₽)</label>
          <div className="grid grid-cols-2 gap-2 font-mono">
            <input
              type="number"
              placeholder="От"
              className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs md:text-sm focus:outline-hidden focus:border-orange-500 focus-visible:ring-2 focus-visible:ring-orange-500/40 focus-visible:ring-offset-1 font-medium"
            />
            <input
              type="number"
              placeholder="До"
              className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs md:text-sm focus:outline-hidden focus:border-orange-500 focus-visible:ring-2 focus-visible:ring-orange-500/40 focus-visible:ring-offset-1 font-medium"
            />
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-xs font-bold text-stone-400 uppercase tracking-widest block font-comfortaa">Бренды производители</label>

          <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
            {brandFacets.map((brand) => {
              const isSelected = filters.brands.includes(brand.name);
              return (
                <FilterToggleRow
                  key={brand.name}
                  active={isSelected}
                  idleClassName="text-stone-600"
                  leading={
                    <>
                      <div className={cn(
                        'w-3.5 h-3.5 rounded-md border flex items-center justify-center transition-all',
                        isSelected ? 'bg-orange-500 border-orange-500 text-white' : 'border-stone-300 bg-white',
                      )}>
                        {isSelected && <Check className="w-2.5 h-2.5 stroke-3" />}
                      </div>
                      <span>{brand.name}</span>
                    </>
                  }
                  trailing={
                    <span className="text-[10px] text-stone-400 font-mono">({brand.count})</span>
                  }
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
