import type { CatalogSortType, FilterCriteria } from './types';

/**
 * Контракт «фильтры ⇄ URL» для страницы каталога:
 * `?search=&sort=&min=&max=&brands=a,b&onSale=1`.
 * Тот же контракт фаза 5 отдаёт бэкенду как query-параметры поиска.
 */

const SORT_VALUES: readonly CatalogSortType[] = [
  'popular',
  'cheap-first',
  'expensive-first',
];

const DEFAULT_FILTERS: FilterCriteria = {
  searchQuery: '',
  priceMin: '',
  priceMax: '',
  brands: [],
  onSaleOnly: false,
  badgeOnly: false,
  sortType: 'popular',
};

function normalizePrice(value: string | null): string {
  if (value === null) return '';
  // `<input type="number">` допускает дробные значения — не должны «съедать»
  // их обратно в '' при каждом URL-sync.
  return /^\d+(\.\d+)?$/.test(value) ? value : '';
}

function normalizeSort(value: string | null): CatalogSortType {
  return value && (SORT_VALUES as readonly string[]).includes(value)
    ? (value as CatalogSortType)
    : 'popular';
}

export function parseCatalogFiltersFromParams(params: URLSearchParams): FilterCriteria {
  const brands = params.get('brands');
  return {
    searchQuery: params.get('search') ?? '',
    priceMin: normalizePrice(params.get('min')),
    priceMax: normalizePrice(params.get('max')),
    brands: brands
      ? brands.split(',').map((brand) => brand.trim()).filter(Boolean)
      : [],
    onSaleOnly: params.get('onSale') === '1',
    badgeOnly: false,
    sortType: normalizeSort(params.get('sort')),
  };
}

export function serializeCatalogFiltersToParams(filters: FilterCriteria): URLSearchParams {
  const params = new URLSearchParams();
  if (filters.searchQuery) params.set('search', filters.searchQuery);
  if (filters.sortType !== DEFAULT_FILTERS.sortType) params.set('sort', filters.sortType);
  if (filters.priceMin !== '') params.set('min', filters.priceMin);
  if (filters.priceMax !== '') params.set('max', filters.priceMax);
  if (filters.brands.length > 0) params.set('brands', filters.brands.join(','));
  if (filters.onSaleOnly) params.set('onSale', '1');
  return params;
}

export const CATALOG_DEFAULT_FILTERS: FilterCriteria = DEFAULT_FILTERS;
