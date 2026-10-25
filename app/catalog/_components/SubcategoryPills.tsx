'use client';

import React from 'react';
import type { Subcategory } from '@/entities/catalog';
import { getAllCategoryPillLabel } from '@/shared/lib';

interface SubcategoryPillsProps {
  activeSubcategory: Subcategory;
  activeSubSection: string;
}

/** Horizontal Pills for Subcategory Navigation — активный pill по дефолту ('all' или раздел из URL). */
export default function SubcategoryPills({
  activeSubcategory,
  activeSubSection,
}: SubcategoryPillsProps) {
  return (
    <div className="flex flex-nowrap items-center gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden -mx-4 px-4 sm:mx-0 sm:px-0">
      <button
        className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold font-comfortaa transition-all border cursor-pointer ${activeSubSection === 'all'
          ? 'bg-stone-900 border-stone-900 text-white shadow-xs'
          : 'bg-white border-stone-200 text-stone-600 hover:border-orange-500 hover:text-orange-500'
          }`}
      >
        {getAllCategoryPillLabel(activeSubcategory.name)}
      </button>
      {activeSubcategory.subSections.map((sec) => {
        const isSel = activeSubSection === sec;
        return (
          <button
            key={sec}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold font-comfortaa transition-all border cursor-pointer ${isSel
              ? 'bg-stone-900 border-stone-900 text-white shadow-xs'
              : 'bg-white border-stone-200 text-stone-600 hover:border-orange-500 hover:text-orange-500'
              }`}
          >
            {sec}
          </button>
        );
      })}
    </div>
  );
}
