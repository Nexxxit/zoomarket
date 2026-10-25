import type { Product } from '@/entities/product';
import type { Subcategory } from '@/entities/catalog';
import type { CatalogSlugState } from './types';

const TARGET_ANIMAL_GENITIVES: Record<string, string> = {
  cat: 'кошек',
  dog: 'собак',
  bird: 'птиц',
  rodent: 'грызунов',
  fish: 'рыб',
};

export interface CatalogTitleInput {
  state: CatalogSlugState;
  searchQuery: string;
  activeProduct: Product | null;
  activeSubcategory: Subcategory | null;
}

export function getCatalogTitle({
  state,
  searchQuery,
  activeProduct,
  activeSubcategory,
}: CatalogTitleInput): string {
  const targetAnimal = TARGET_ANIMAL_GENITIVES[state.animal] ?? 'питомцев';

  if (state.slugLength === 0) {
    return searchQuery
      ? `Результаты поиска по запросу «${searchQuery}»`
      : 'Каталог товаров зоомаркета';
  }
  if (state.isBrands) {
    if (state.activeBrandName) {
      return `Товары бренда ${state.activeBrandName}`;
    }
    return 'Бренды';
  }
  if (state.slugLength === 1) {
    return `Товары для ${targetAnimal}`;
  }
  if (state.slugLength >= 4 && activeProduct) {
    return activeProduct.brand ? `Товар бренда ${activeProduct.brand}` : 'Карточка товара';
  }
  if (activeSubcategory) {
    if (state.subSection !== 'all') {
      return `${state.subSection} для ${targetAnimal}`;
    }
    return `${activeSubcategory.name} для ${targetAnimal}`;
  }
  return 'Каталог зоомаркета';
}
