import { describe, it, expect } from 'vitest';
import { resolveCatalogView } from '../catalogView';
import type { CatalogSlugState } from '../types';

const state = (over: Partial<CatalogSlugState>): CatalogSlugState => ({
  section: 'cat',
  animal: 'cat',
  isBrands: false,
  isVet: false,
  activeBrandName: null,
  subcategoryId: null,
  subSection: 'all',
  productId: null,
  slugLength: 1,
  ...over,
});

describe('resolveCatalogView', () => {
  it('empty slug without search is home', () => {
    expect(resolveCatalogView({
      state: state({ section: null, slugLength: 0 }),
      isSearchActive: false,
      hasActiveProduct: false,
    })).toBe('home');
  });

  it('search overrides home and animal levels', () => {
    expect(resolveCatalogView({
      state: state({ section: null, slugLength: 0 }),
      isSearchActive: true,
      hasActiveProduct: false,
    })).toBe('list');
    expect(resolveCatalogView({
      state: state({ slugLength: 1 }),
      isSearchActive: true,
      hasActiveProduct: false,
    })).toBe('list');
  });

  it('single segment is animal view', () => {
    expect(resolveCatalogView({
      state: state({ slugLength: 1 }),
      isSearchActive: false,
      hasActiveProduct: false,
    })).toBe('animal');
  });

  it('two and three segments are list view', () => {
    expect(resolveCatalogView({
      state: state({ subcategoryId: 'cat-food', slugLength: 2 }),
      isSearchActive: false,
      hasActiveProduct: false,
    })).toBe('list');
    expect(resolveCatalogView({
      state: state({ subcategoryId: 'cat-food', subSection: 'Сухой корм', slugLength: 3 }),
      isSearchActive: false,
      hasActiveProduct: false,
    })).toBe('list');
  });

  it('four segments with found product is detail view', () => {
    expect(resolveCatalogView({
      state: state({ subcategoryId: 'cat-food', subSection: 'all', slugLength: 4, productId: '42' }),
      isSearchActive: false,
      hasActiveProduct: true,
    })).toBe('detail');
  });

  it('four segments with missing product falls back to list view', () => {
    expect(resolveCatalogView({
      state: state({ subcategoryId: 'cat-food', subSection: 'all', slugLength: 4, productId: 'ghost' }),
      isSearchActive: false,
      hasActiveProduct: false,
    })).toBe('list');
  });

  it('five segments never render detail (parity with original)', () => {
    expect(resolveCatalogView({
      state: state({ slugLength: 5, productId: '42' }),
      isSearchActive: false,
      hasActiveProduct: true,
    })).toBe('list');
  });

  it('detail wins over search', () => {
    expect(resolveCatalogView({
      state: state({ slugLength: 4, productId: '42' }),
      isSearchActive: true,
      hasActiveProduct: true,
    })).toBe('detail');
  });
});
