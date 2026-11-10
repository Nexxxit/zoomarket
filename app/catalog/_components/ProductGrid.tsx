'use client';

import React from 'react';
import type { Product } from '@/entities/product';
import { ProductCard } from '@/entities/product';
import EmptyState from './EmptyState';

interface ProductGridProps {
  categoryBaseProducts: Product[];
  filteredProducts: Product[];
  isBrandsCatalog: boolean;
  backTo?: string;
  onBackToCategory?: () => void;
  onResetFilters?: () => void;
}

export default function ProductGrid({
  categoryBaseProducts,
  filteredProducts,
  isBrandsCatalog,
  backTo,
  onBackToCategory,
  onResetFilters,
}: ProductGridProps) {

  if (categoryBaseProducts.length === 0) {
    return (
      <EmptyState
        icon="🐾"
        title="Раздел в наполнении"
        description="В этой категории пока нет товаров. Мы уже работаем над расширением нашего каталога и скоро завезем качественные новинки для ваших любимцев!"
        actionLabel={isBrandsCatalog ? 'Вернуться к брендам' : 'Вернуться к питомцу'}
        onAction={onBackToCategory}
      />
    );
  }

  if (filteredProducts.length === 0) {
    return (
      <EmptyState
        icon="😿"
        title="По вашим фильтрам ничего не найдено"
        description="Попробуйте смягчить ценовой порог, выбрать другого производителя или сбросить активные фильтры."
        actionLabel="Сбросить фильтры"
        variant="outline"
        onAction={onResetFilters}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredProducts.map((product) => (
        <ProductCard key={product.id} product={product} backTo={backTo} />
      ))}
    </div>
  );
}
