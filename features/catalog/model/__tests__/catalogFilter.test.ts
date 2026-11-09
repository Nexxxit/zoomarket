import { describe, it, expect } from 'vitest';
import type { Product } from '@/entities/product';
import {
  filterProducts,
  sortProducts,
  selectCategoryBaseProducts,
  buildBrandFacets,
  countOnSale,
  hasActiveFilters,
  isVetProduct,
  matchesVetSubcategory,
  matchesVetSubSection,
} from '../catalogFilter';
import type { CatalogSlugState, FilterCriteria } from '../types';

const product = (over: Partial<Product>): Product => ({
  id: 'x',
  name: 'Товар',
  category: 'Корма',
  price: 1000,
  rating: 4,
  reviews: 10,
  onSale: false,
  type: 'food',
  animal: 'cat',
  ...over,
});

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

const criteria = (over?: Partial<FilterCriteria>): FilterCriteria => ({
  searchQuery: '',
  priceMin: '',
  priceMax: '',
  brands: [],
  onSaleOnly: false,
  badgeOnly: false,
  sortType: 'popular',
  ...over,
});

const catalog: Product[] = [
  product({ id: '1', name: 'Ownat Adult', brand: 'Ownat', animal: 'cat', subcategoryId: 'cat-food', subSection: 'Сухой корм', price: 2400, onSale: true, salePct: 20, rating: 4.9 }),
  product({ id: '2', name: 'Grandorf Sterilised', brand: 'Grandorf', animal: 'cat', subcategoryId: 'cat-food', subSection: 'Холистик', price: 1185, badge: 'Хит', rating: 5 }),
  product({ id: '3', name: 'Koudane для собак', brand: 'Koudane', animal: 'dog', subcategoryId: 'dog-food', subSection: 'Сухой корм', price: 900, rating: 4.2 }),
  product({ id: '4', name: 'Пеленки впитывающие', animal: 'universal', subcategoryId: 'dog-litter', price: 500, rating: 3.5 }),
  product({ id: '5', name: 'Ошейник Foresto', type: 'medicine', animal: 'cat', subcategoryId: 'cat-flea', subSection: 'Ошейники от паразитов', price: 3450, rating: 4.7 }),
  product({ id: '6', name: 'Капли Inspector', type: 'medicine', animal: 'dog', subcategoryId: 'dog-flea', subSection: 'Капли от внешних паразитов', price: 700, rating: 4.1 }),
  product({ id: '7', name: 'Гамавит 100 мл', type: 'medicine', animal: 'cat', subcategoryId: 'cat-vitamins', subSection: 'Мультивитамины', price: 350, rating: 4.4 }),
];

describe('filterProducts — animal scope', () => {
  it('keeps only products of slug animal', () => {
    const ids = filterProducts(catalog, state({ animal: 'dog' }), criteria()).map(p => p.id);
    expect(ids).toEqual(['3', '6']);
  });

  it('excludes universal products when animal scope active', () => {
    const ids = filterProducts(catalog, state({ animal: 'cat' }), criteria()).map(p => p.id);
    expect(ids).not.toContain('4');
  });
});

describe('filterProducts — subcategory and subSection', () => {
  it('filters by subcategoryId', () => {
    const ids = filterProducts(
      catalog,
      state({ animal: 'cat', subcategoryId: 'cat-food' }),
      criteria(),
    ).map(p => p.id);
    expect(ids).toEqual(['1', '2']);
  });

  it('filters by exact subSection for non-vet scope', () => {
    const ids = filterProducts(
      catalog,
      state({ animal: 'cat', subcategoryId: 'cat-food', subSection: 'Холистик' }),
      criteria(),
    ).map(p => p.id);
    expect(ids).toEqual(['2']);
  });
});

describe('filterProducts — brands section', () => {
  it('without brand keeps all brands scope', () => {
    const ids = filterProducts(
      catalog,
      state({ section: 'brands', animal: 'brands', isBrands: true, slugLength: 1 }),
      criteria(),
    ).map(p => p.id);
    expect(ids).toEqual(['1', '2', '3', '4', '5', '6', '7']);
  });

  it('with activeBrandName filters by brand', () => {
    const ids = filterProducts(
      catalog,
      state({
        section: 'brands',
        animal: 'brands',
        isBrands: true,
        activeBrandName: 'Grandorf',
        slugLength: 2,
      }),
      criteria(),
    ).map(p => p.id);
    expect(ids).toEqual(['2']);
  });
});

describe('filterProducts — vet section with aliases', () => {
  it('vet-flea subcategory matches any flea product regardless of animal', () => {
    const ids = filterProducts(
      catalog,
      state({ section: 'vet', animal: 'vet', isVet: true, subcategoryId: 'vet-flea', slugLength: 2 }),
      criteria(),
    ).map(p => p.id);
    expect(ids).toEqual(['5', '6']);
  });

  it('vet-vitamins takes medicine without flea', () => {
    const ids = filterProducts(
      catalog,
      state({ section: 'vet', animal: 'vet', isVet: true, subcategoryId: 'vet-vitamins', slugLength: 2 }),
      criteria(),
    ).map(p => p.id);
    expect(ids).toEqual(['7']);
  });

  it('pill alias "Капли на холку" includes "Капли от внешних паразитов"', () => {
    const ids = filterProducts(
      catalog,
      state({
        section: 'vet',
        animal: 'vet',
        isVet: true,
        subcategoryId: 'vet-flea',
        subSection: 'Капли на холку',
        slugLength: 3,
      }),
      criteria(),
    ).map(p => p.id);
    expect(ids).toEqual(['6']);
  });

  it('pill alias "Ошейники от паразитов" filters flea subcategory', () => {
    const ids = filterProducts(
      catalog,
      state({
        section: 'vet',
        animal: 'vet',
        isVet: true,
        subcategoryId: 'vet-flea',
        subSection: 'Ошейники от паразитов',
        slugLength: 3,
      }),
      criteria(),
    ).map(p => p.id);
    expect(ids).toEqual(['5']);
  });
});

describe('filterProducts — criteria facets', () => {
  it('onSaleOnly keeps discounted products', () => {
    const ids = filterProducts(catalog, state({ animal: 'cat' }), criteria({ onSaleOnly: true })).map(p => p.id);
    expect(ids).toEqual(['1']);
  });

  it('badgeOnly keeps badged products', () => {
    const ids = filterProducts(catalog, state({ animal: 'cat' }), criteria({ badgeOnly: true })).map(p => p.id);
    expect(ids).toEqual(['2']);
  });

  it('price range applies min and max', () => {
    const ids = filterProducts(
      catalog,
      state({ animal: 'cat' }),
      criteria({ priceMin: '1000', priceMax: '2000' }),
    ).map(p => p.id);
    expect(ids).toEqual(['2']);
  });

  it('brands multiselect applies', () => {
    const ids = filterProducts(
      catalog,
      state({ animal: 'cat' }),
      criteria({ brands: ['Grandorf'] }),
    ).map(p => p.id);
    expect(ids).toEqual(['2']);
  });
});

describe('filterProducts — search', () => {
  it('matches by brand (case-insensitive)', () => {
    const ids = filterProducts(catalog, state({ slugLength: 0, animal: 'cat' }), criteria({ searchQuery: 'grandorf' })).map(p => p.id);
    expect(ids).toContain('2');
  });

  it('matches cat synonyms without slug animal', () => {
    const ids = filterProducts(
      catalog,
      state({ slugLength: 0, animal: 'cat' }),
      criteria({ searchQuery: 'кош' }),
    ).map(p => p.id);
    expect(ids).toEqual(['1', '2', '5', '7']);
  });

  it('combines search with animal scope from slug', () => {
    const ids = filterProducts(
      catalog,
      state({ slugLength: 1, animal: 'dog' }),
      criteria({ searchQuery: 'капли' }),
    ).map(p => p.id);
    expect(ids).toEqual(['6']);
  });
});

describe('sortProducts', () => {
  const cats = filterProducts(catalog, state({ animal: 'cat' }), criteria());

  it('sorts cheap-first by price', () => {
    expect(sortProducts(cats, 'cheap-first').map(p => p.price)).toEqual([350, 1185, 2400, 3450]);
  });

  it('sorts expensive-first by price', () => {
    expect(sortProducts(cats, 'expensive-first').map(p => p.price)).toEqual([3450, 2400, 1185, 350]);
  });

  it('sorts popular by rating desc', () => {
    expect(sortProducts(cats, 'popular').map(p => p.rating)).toEqual([5, 4.9, 4.7, 4.4]);
  });

  it('popular breaks equal ratings by reviews count', () => {
    const tied = [
      product({ id: 'a', animal: 'cat', rating: 5, reviews: 3 }),
      product({ id: 'b', animal: 'cat', rating: 5, reviews: 9 }),
    ];
    expect(sortProducts(tied, 'popular').map(p => p.id)).toEqual(['b', 'a']);
  });
});

describe('selectCategoryBaseProducts', () => {
  it('ignores facet criteria and keeps scope products', () => {
    const ids = selectCategoryBaseProducts(catalog, state({
      animal: 'cat',
      subcategoryId: 'cat-food',
      subSection: 'Сухой корм',
    })).map(p => p.id);
    expect(ids).toEqual(['1']);
  });

  it('with empty slug keeps all animals (no animal scope)', () => {
    const ids = selectCategoryBaseProducts(catalog, state({ slugLength: 0 })).map(p => p.id);
    expect(ids).toEqual(['1', '2', '3', '4', '5', '6', '7']);
  });
});

describe('buildBrandFacets / countOnSale', () => {
  it('counts brands per cat scope with insertion order', () => {
    expect(buildBrandFacets(catalog, state({ animal: 'cat' }))).toEqual([
      { name: 'Ownat', count: 1 },
      { name: 'Grandorf', count: 1 },
    ]);
  });

  it('counts sale products in subcategory scope', () => {
    expect(countOnSale(catalog, state({ animal: 'cat', subcategoryId: 'cat-food' }))).toBe(1);
  });

  it('counts sale products for brands scope', () => {
    expect(countOnSale(
      catalog,
      state({ section: 'brands', animal: 'brands', isBrands: true, slugLength: 1 }),
    )).toBe(1);
  });
});

describe('vet predicates', () => {
  it('isVetProduct: medicine or flea subcategory', () => {
    expect(isVetProduct(product({ type: 'accessory', subcategoryId: 'cat-flea' }))).toBe(true);
    expect(isVetProduct(product({ type: 'medicine' }))).toBe(true);
    expect(isVetProduct(product({ type: 'food', subcategoryId: 'cat-food' }))).toBe(false);
  });

  it('matchesVetSubcategory with null subcategoryId matches all', () => {
    expect(matchesVetSubcategory(product({}), null)).toBe(true);
  });

  it('matchesVetSubSection "all" matches any product subSection', () => {
    expect(matchesVetSubSection(product({}), 'all')).toBe(true);
    expect(matchesVetSubSection(product({}), 'Спреи')).toBe(false);
  });
});

describe('hasActiveFilters', () => {
  it('default criteria are not active', () => {
    expect(hasActiveFilters(criteria())).toBe(false);
  });

  it('ignores searchQuery and sortType', () => {
    expect(hasActiveFilters(criteria({ searchQuery: 'корм', sortType: 'cheap-first' }))).toBe(false);
  });

  it('detects each facet criterion', () => {
    expect(hasActiveFilters(criteria({ priceMin: '100' }))).toBe(true);
    expect(hasActiveFilters(criteria({ priceMax: '500' }))).toBe(true);
    expect(hasActiveFilters(criteria({ brands: ['Ownat'] }))).toBe(true);
    expect(hasActiveFilters(criteria({ onSaleOnly: true }))).toBe(true);
    expect(hasActiveFilters(criteria({ badgeOnly: true }))).toBe(true);
  });
});
