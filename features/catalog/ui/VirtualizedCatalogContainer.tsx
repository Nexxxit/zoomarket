'use client';

import React from 'react';
import { ALL_MOCK_CATEGORIES, Category } from '@/entities/catalog';
import { CategorySection } from './CategorySection';

interface VirtualizedCatalogContainerProps {
  selectedAnimal?: string;
  onSelectSubcategory?: (subId: string, categoryId: string, subSection?: string) => void;
}

export const VirtualizedCatalogContainer: React.FC<VirtualizedCatalogContainerProps> = ({
  selectedAnimal,
  onSelectSubcategory,
}) => {
  const isFilteredToAnimal = Boolean(selectedAnimal && selectedAnimal !== 'all');

  const categories: Category[] = isFilteredToAnimal
    ? ALL_MOCK_CATEGORIES.filter((c) => c.id === selectedAnimal)
    : ALL_MOCK_CATEGORIES;

  return (
    <div className="w-full space-y-6">
      <div
        className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 relative min-h-150 space-y-16"
      >
        {categories.map((category, index) => (
          <div
            key={category.id}
            id={`category-${category.id}`}
            data-category-id={category.id}
            data-category-section="true"
            data-index={index}
            data-mounted="true"
            className="scroll-mt-32 pb-8 sm:pb-12 border-b border-stone-100 last:border-0"
          >
            <CategorySection
              category={category}
              onSelectSubcategory={onSelectSubcategory}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
