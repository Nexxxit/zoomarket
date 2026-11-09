import type { Product } from '@/entities/product';
import type { BrandFacet, CatalogSlugState, CatalogSortType, FilterCriteria } from './types';

export const VET_SUBSECTION_ALIASES: Record<string, string[]> = {
  'Капли на холку': ['Капли на холку', 'Капли от клещей', 'Капли от внешних паразитов'],
  'Ошейники от паразитов': ['Ошейники от паразитов', 'Ошейники защитные'],
  'Спреи': ['Спреи', 'Шампуни гигиенические'],
  'Таблетки комплексные': ['Таблетки комплексные'],
};

const ANIMAL_SEARCH_SYNONYMS: Partial<Record<Product['animal'], string>> = {
  cat: 'кошка кошачий кот котята',
  dog: 'собака собачий пес щенок',
};

export function isVetProduct(product: Product): boolean {
  return product.type === 'medicine' || Boolean(product.subcategoryId?.includes('flea'));
}

export function matchesVetSubcategory(product: Product, subcategoryId: string | null): boolean {
  if (!subcategoryId) return true;
  if (subcategoryId === 'vet-flea') {
    return Boolean(product.subcategoryId?.includes('flea'));
  }
  if (subcategoryId === 'vet-vitamins' || subcategoryId === 'vet-care') {
    return product.type === 'medicine' && !product.subcategoryId?.includes('flea');
  }
  return product.subcategoryId === subcategoryId;
}

export function matchesVetSubSection(product: Product, subSection: string): boolean {
  if (subSection === 'all') return true;
  if (!product.subSection) return false;

  const aliases = VET_SUBSECTION_ALIASES[subSection] ?? [subSection];
  return aliases.includes(product.subSection);
}

function matchesSearchQuery(product: Product, q: string): boolean {
  return (
    product.name.toLowerCase().includes(q) ||
    Boolean(product.brand?.toLowerCase().includes(q)) ||
    product.category.toLowerCase().includes(q) ||
    Boolean(product.subSection?.toLowerCase().includes(q)) ||
    Boolean(ANIMAL_SEARCH_SYNONYMS[product.animal]?.includes(q))
  );
}

export function filterProducts(
  products: Product[],
  state: CatalogSlugState,
  filters: FilterCriteria,
): Product[] {
  const q = filters.searchQuery.toLowerCase();

  return products.filter(product => {
    if (filters.searchQuery && !matchesSearchQuery(product, q)) return false;

    const hasSlugAnimal = state.slugLength > 0;
    if (state.isBrands) {
      if (state.activeBrandName && product.brand !== state.activeBrandName) return false;
    } else if (state.isVet) {
      if (!isVetProduct(product)) return false;
      if (!matchesVetSubcategory(product, state.subcategoryId)) return false;
    } else if ((hasSlugAnimal || !filters.searchQuery) && product.animal !== state.animal) {
      return false;
    }

    if (!state.isBrands && !state.isVet && state.subcategoryId && product.subcategoryId !== state.subcategoryId) return false;

    if (state.isVet) {
      if (!matchesVetSubSection(product, state.subSection)) return false;
    } else if (!state.isBrands && state.subSection !== 'all' && product.subSection !== state.subSection) {
      return false;
    }

    if (filters.onSaleOnly && !product.onSale) return false;

    if (filters.badgeOnly && !product.badge) return false;

    const price = product.price;
    if (filters.priceMin !== '') {
      const min = parseFloat(filters.priceMin);
      if (!isNaN(min) && price < min) return false;
    }
    if (filters.priceMax !== '') {
      const max = parseFloat(filters.priceMax);
      if (!isNaN(max) && price > max) return false;
    }

    if (filters.brands.length > 0) {
      if (!product.brand || !filters.brands.includes(product.brand)) return false;
    }

    return true;
  });
}

export function sortProducts(products: Product[], sortType: CatalogSortType): Product[] {
  const sorted = [...products];
  if (sortType === 'cheap-first') {
    sorted.sort((a, b) => a.price - b.price);
  } else if (sortType === 'expensive-first') {
    sorted.sort((a, b) => b.price - a.price);
  } else {
    // «По популярности»: рейтинг, при равенстве — количество отзывов
    sorted.sort((a, b) => (b.rating - a.rating) || (b.reviews - a.reviews));
  }
  return sorted;
}

export function selectCategoryBaseProducts(products: Product[], state: CatalogSlugState): Product[] {
  return products.filter(product => {
    if (state.isBrands) {
      if (state.activeBrandName && product.brand !== state.activeBrandName) return false;
      return true;
    }
    if (state.isVet) {
      if (!isVetProduct(product)) return false;
      if (!matchesVetSubcategory(product, state.subcategoryId)) return false;
      if (!matchesVetSubSection(product, state.subSection)) return false;
      return true;
    }
    const hasSlugAnimal = state.slugLength > 0;
    if (hasSlugAnimal && product.animal !== state.animal) return false;
    if (state.subcategoryId && product.subcategoryId !== state.subcategoryId) return false;
    if (state.subSection !== 'all' && product.subSection !== state.subSection) return false;
    return true;
  });
}

export function buildBrandFacets(products: Product[], state: CatalogSlugState): BrandFacet[] {
  const brandsMap: Record<string, number> = {};
  products.forEach(p => {
    let matchesScope = false;
    if (state.isBrands) {
      matchesScope = !state.activeBrandName || p.brand === state.activeBrandName;
    } else if (state.isVet) {
      matchesScope = isVetProduct(p) && matchesVetSubcategory(p, state.subcategoryId);
    } else {
      matchesScope = p.animal === state.animal && (!state.subcategoryId || p.subcategoryId === state.subcategoryId);
    }

    if (matchesScope && p.brand) {
      brandsMap[p.brand] = (brandsMap[p.brand] || 0) + 1;
    }
  });
  return Object.entries(brandsMap).map(([name, count]) => ({ name, count }));
}

export function hasActiveFilters(filters: FilterCriteria): boolean {
  return (
    filters.priceMin !== '' ||
    filters.priceMax !== '' ||
    filters.brands.length > 0 ||
    filters.onSaleOnly ||
    filters.badgeOnly
  );
}

export function countOnSale(products: Product[], state: CatalogSlugState): number {
  return products.filter(p => {
    if (state.isBrands) {
      return (!state.activeBrandName || p.brand === state.activeBrandName) && p.onSale;
    }
    if (state.isVet) {
      return isVetProduct(p) && matchesVetSubcategory(p, state.subcategoryId) && p.onSale;
    }
    return p.animal === state.animal && (!state.subcategoryId || p.subcategoryId === state.subcategoryId) && p.onSale;
  }).length;
}
