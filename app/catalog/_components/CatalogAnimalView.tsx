'use client';

import { VirtualizedCatalogContainer } from '@/features/catalog';

interface CatalogAnimalViewProps {
  selectedAnimal: string;
  onSelectSubcategory: (subId: string, categoryId: string, subSection?: string) => void;
}

export default function CatalogAnimalView({ selectedAnimal, onSelectSubcategory }: CatalogAnimalViewProps) {
  return (
    <section id="large-catalog" className="py-6 space-y-6">
      <VirtualizedCatalogContainer
        selectedAnimal={selectedAnimal}
        onSelectSubcategory={onSelectSubcategory}
      />
    </section>
  );
}
