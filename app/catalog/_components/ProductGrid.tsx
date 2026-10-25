'use client';

import React from 'react';
import type { Product } from '@/entities/product';
import { ProductCard } from '@/entities/product';
import { Loader } from '@/shared/ui';

interface ProductGridProps {
  isCatalogLoading: boolean;
  categoryBaseProducts: Product[];
  filteredProducts: Product[];
  isBrandsCatalog: boolean;
}

export default function ProductGrid({
  isCatalogLoading,
  categoryBaseProducts,
  filteredProducts,
  isBrandsCatalog,
}: ProductGridProps) {
  return (
    <>
      {isCatalogLoading ? (
        <div className="py-24">
          <Loader />
        </div>
      ) : categoryBaseProducts.length === 0 ? (
        <div className="max-w-md mx-auto text-center py-16 space-y-4">
          <span className="text-4xl">🐾</span>
          <h3 className="text-lg font-bold font-comfortaa text-stone-900">Раздел наполнении</h3>
          <p className="text-xs text-stone-500 leading-normal">
            В этой категории пока нет товаров. Мы уже работаем над расширением нашего каталога и скоро завезем качественные новинки для ваших любимцев!
          </p>
          <button
            className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold font-comfortaa rounded-full text-xs transition-all cursor-pointer shadow-sm shadow-orange-500/10"
          >
            {isBrandsCatalog ? 'Вернуться к брендам' : 'Вернуться к питомцу'}
          </button>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="max-w-md mx-auto text-center py-16 space-y-4">
          <span className="text-4xl">😿</span>
          <h3 className="text-lg font-bold font-comfortaa text-stone-900">По вашим фильтрам ничего не найдено</h3>
          <p className="text-xs text-stone-500 leading-normal">
            Попробуйте смягчить ценовой порог, выбрать другого производителя или сбросить активные фильтры.
          </p>
          <button
            className="px-5 py-2 border-2 border-[#1C1917] hover:bg-[#1C1917] hover:text-white font-bold font-comfortaa rounded-full text-xs transition-all cursor-pointer"
          >
            Сбросить фильтры
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </>
  );
}
