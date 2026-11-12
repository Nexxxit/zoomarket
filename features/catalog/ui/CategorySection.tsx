'use client';

import React, { useMemo } from 'react';
import Image from 'next/image';
import type { Category, SubCategory } from '@/entities/catalog';
import { getSubcategoriesSync } from '@/entities/catalog';
import { getAllProducts } from '@/entities/product';

interface CategorySectionProps {
  category: Category;
  onSelectSubcategory?: (subId: string, categoryId: string, subSection?: string) => void;
}

export const CategorySection: React.FC<CategorySectionProps> = ({
  category,
  onSelectSubcategory,
}) => {
  const isBrandsCategory = category.id === 'brands';

  const brandNames = useMemo(() => {
    if (!isBrandsCategory) return [];
    const unique = new Set<string>();
    getAllProducts().forEach((product) => {
      if (product.brand?.trim()) {
        unique.add(product.brand.trim());
      }
    });
    return Array.from(unique).sort((a, b) => a.localeCompare(b, 'ru'));
  }, [isBrandsCategory]);

  // Без useEffect-загрузки: данные синхронно из мока entities/catalog.
  const subcategories: SubCategory[] = isBrandsCategory ? [] : getSubcategoriesSync(category.id);

  return (
    <div
      data-category-id={category.id}
      className="space-y-6 md:space-y-8"
    >

      <div className="pb-1 pt-2">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-black font-comfortaa text-stone-900 tracking-tight uppercase">
          {category.name}
        </h2>
      </div>

      {isBrandsCategory ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {brandNames.map((brand) => (
            <button
              key={brand}
              type="button"
              onClick={() => onSelectSubcategory?.(brand, category.id)}
              className="bg-white border border-stone-200/80 rounded-2xl p-4 sm:p-5 hover:border-orange-500 hover:shadow-md transition-all cursor-pointer flex flex-col items-center justify-between text-center gap-3 group h-44 relative overflow-hidden"
            >
              <div className="w-14 h-14 bg-stone-50/80 rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform border border-stone-100 p-2">
                <Image
                  src="/logo_aibolit.jpg"
                  alt={brand}
                  width={40}
                  height={40}
                  className="object-cover rounded-full"
                  referrerPolicy="no-referrer"
                />
              </div>

              <span className="text-[11px] sm:text-xs font-bold font-comfortaa text-stone-800 group-hover:text-orange-500 transition-colors leading-tight line-clamp-2">
                {brand}
              </span>
            </button>
          ))}
        </div>
      ) : (
        <div className="space-y-8">
          {subcategories.map((subcat) => (
            <div key={subcat.id} className="space-y-3">
              {/* Subcategory Header bar in a rounded white container card */}
              <button
                type="button"
                onClick={() => onSelectSubcategory?.(subcat.id, category.id)}
                className="block w-full text-left bg-white border border-stone-200/80 rounded-2xl px-5 py-3.5 shadow-xs cursor-pointer hover:border-orange-500 transition-colors"
              >
                <span className="text-xs sm:text-sm font-black font-comfortaa text-stone-900 uppercase tracking-wider">
                  {subcat.name}
                </span>
              </button>

              {/* Grid of subsections */}
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {subcat.subSections && subcat.subSections.length > 0 ? (
                  subcat.subSections.map((sec) => (
                    <button
                      key={sec}
                      type="button"
                      onClick={() =>
                        onSelectSubcategory?.(subcat.id, category.id, sec)
                      }
                      className="bg-white border border-stone-200/80 rounded-2xl p-4 sm:p-5 hover:border-orange-500 hover:shadow-md transition-all cursor-pointer flex flex-col items-center justify-between text-center gap-3 group h-44 relative overflow-hidden"
                    >
                      <span className="w-14 h-14 bg-stone-50/80 rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform border border-stone-100 p-2">
                        <Image
                          src="/logo_aibolit.jpg"
                          alt="Айболит"
                          width={40}
                          height={40}
                          className="object-cover rounded-full"
                          referrerPolicy="no-referrer"
                        />
                      </span>

                      <span className="text-[11px] sm:text-xs font-bold font-comfortaa text-stone-800 group-hover:text-orange-500 transition-colors leading-tight line-clamp-2">
                        {sec}
                      </span>
                    </button>
                  ))
                ) : (
                  <button
                    type="button"
                    onClick={() =>
                      onSelectSubcategory?.(subcat.id, category.id)
                    }
                    className="bg-white border border-stone-200/80 rounded-2xl p-4 sm:p-5 hover:border-orange-500 hover:shadow-md transition-all cursor-pointer flex flex-col items-center justify-between text-center gap-3 group h-44 relative overflow-hidden"
                  >
                    <span className="w-14 h-14 bg-stone-50/80 rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform border border-stone-100 p-2">
                      <Image
                        src="/logo_aibolit.jpg"
                        alt="Айболит"
                        width={40}
                        height={40}
                        className="object-cover rounded-full"
                        referrerPolicy="no-referrer"
                      />
                    </span>

                    <span className="text-[11px] sm:text-xs font-bold font-comfortaa text-stone-800 group-hover:text-orange-500 transition-colors leading-tight line-clamp-2">
                      {subcat.name}
                    </span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
