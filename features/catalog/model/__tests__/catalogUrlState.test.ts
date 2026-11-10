import { describe, it, expect } from 'vitest';
import {
  CATALOG_DEFAULT_FILTERS,
  parseCatalogFiltersFromParams,
  serializeCatalogFiltersToParams,
} from '../catalogUrlState';
import type { FilterCriteria } from '../types';

function filters(patch: Partial<FilterCriteria>): FilterCriteria {
  return { ...CATALOG_DEFAULT_FILTERS, ...patch };
}

describe('parseCatalogFiltersFromParams', () => {
  it('returns defaults for an empty query', () => {
    expect(parseCatalogFiltersFromParams(new URLSearchParams())).toEqual(CATALOG_DEFAULT_FILTERS);
  });

  it('parses every contract key', () => {
    const params = new URLSearchParams(
      'search=корм&sort=cheap-first&min=100&max=2000&brands=Ownat,Grandorf&onSale=1',
    );
    expect(parseCatalogFiltersFromParams(params)).toEqual(
      filters({
        searchQuery: 'корм',
        sortType: 'cheap-first',
        priceMin: '100',
        priceMax: '2000',
        brands: ['Ownat', 'Grandorf'],
        onSaleOnly: true,
      }),
    );
  });

  it('falls back on garbage values', () => {
    const params = new URLSearchParams('sort=prices-desc&min=abc&max=-40&brands=,,&onSale=yes');
    const parsed = parseCatalogFiltersFromParams(params);
    expect(parsed.sortType).toBe('popular');
    expect(parsed.priceMin).toBe('');
    expect(parsed.priceMax).toBe('');
    expect(parsed.brands).toEqual([]);
    expect(parsed.onSaleOnly).toBe(false);
  });
});

describe('serializeCatalogFiltersToParams', () => {
  it('emits nothing for default filters', () => {
    expect(serializeCatalogFiltersToParams(CATALOG_DEFAULT_FILTERS).toString()).toBe('');
  });

  it('round-trips through parse', () => {
    const source = filters({
      searchQuery: 'шампуни',
      sortType: 'expensive-first',
      priceMin: '500',
      priceMax: '',
      brands: ['Royal Canin', 'Grandorf'],
      onSaleOnly: true,
    });
    const params = serializeCatalogFiltersToParams(source);
    expect(parseCatalogFiltersFromParams(params)).toEqual(source);
  });
});
