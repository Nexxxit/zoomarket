import { describe, it, expect } from 'vitest';
import { getCatalogTitle } from '../catalogTitle';
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

describe('getCatalogTitle', () => {
  it('empty slug without search', () => {
    expect(getCatalogTitle({
      state: state({ section: null, slugLength: 0 }),
      searchQuery: '',
      activeProduct: null,
      activeSubcategory: null,
    })).toBe('Каталог товаров зоомаркета');
  });

  it('empty slug with search query', () => {
    expect(getCatalogTitle({
      state: state({ section: null, slugLength: 0 }),
      searchQuery: 'корм',
      activeProduct: null,
      activeSubcategory: null,
    })).toBe('Результаты поиска по запросу «корм»');
  });

  it('brands root and brand page', () => {
    expect(getCatalogTitle({
      state: state({ section: 'brands', animal: 'brands', isBrands: true, slugLength: 1 }),
      searchQuery: '',
      activeProduct: null,
      activeSubcategory: null,
    })).toBe('Бренды');
    expect(getCatalogTitle({
      state: state({
        section: 'brands',
        animal: 'brands',
        isBrands: true,
        activeBrandName: 'Ownat',
        slugLength: 2,
      }),
      searchQuery: '',
      activeProduct: null,
      activeSubcategory: null,
    })).toBe('Товары бренда Ownat');
  });

  it('animal root uses genitive forms', () => {
    expect(getCatalogTitle({
      state: state({ animal: 'cat', slugLength: 1 }),
      searchQuery: '',
      activeProduct: null,
      activeSubcategory: null,
    })).toBe('Товары для кошек');
    expect(getCatalogTitle({
      state: state({ animal: 'unknown', slugLength: 1 }),
      searchQuery: '',
      activeProduct: null,
      activeSubcategory: null,
    })).toBe('Товары для питомцев');
  });

  it('subcategory with and without subSection', () => {
    const subcategory = { id: 'cat-food', name: 'Корм', type: 'food' as const, subSections: [] };
    expect(getCatalogTitle({
      state: state({ animal: 'cat', subcategoryId: 'cat-food', slugLength: 2 }),
      searchQuery: '',
      activeProduct: null,
      activeSubcategory: subcategory,
    })).toBe('Корм для кошек');
    expect(getCatalogTitle({
      state: state({ animal: 'cat', subcategoryId: 'cat-food', subSection: 'Сухой корм', slugLength: 3 }),
      searchQuery: '',
      activeProduct: null,
      activeSubcategory: subcategory,
    })).toBe('Сухой корм для кошек');
  });

  it('product level with and without brand', () => {
    expect(getCatalogTitle({
      state: state({ subcategoryId: 'cat-food', slugLength: 4, productId: '1' }),
      searchQuery: '',
      activeProduct: { id: '1', name: 'X', category: 'Корма', price: 1, rating: 1, reviews: 0, onSale: false, type: 'food', animal: 'cat', brand: 'Ownat' },
      activeSubcategory: null,
    })).toBe('Товар бренда Ownat');
    expect(getCatalogTitle({
      state: state({ subcategoryId: 'cat-food', slugLength: 4, productId: '1' }),
      searchQuery: '',
      activeProduct: { id: '1', name: 'X', category: 'Корма', price: 1, rating: 1, reviews: 0, onSale: false, type: 'food', animal: 'cat' },
      activeSubcategory: null,
    })).toBe('Карточка товара');
  });

  it('fallback without subcategory', () => {
    expect(getCatalogTitle({
      state: state({ subcategoryId: 'ghost', slugLength: 2 }),
      searchQuery: '',
      activeProduct: null,
      activeSubcategory: null,
    })).toBe('Каталог зоомаркета');
  });
});
