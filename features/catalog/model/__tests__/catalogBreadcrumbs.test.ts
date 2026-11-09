import { describe, it, expect } from 'vitest';
import { buildCatalogBreadcrumbs } from '../catalogBreadcrumbs';
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

describe('buildCatalogBreadcrumbs', () => {
  it('empty slug → no items', () => {
    expect(buildCatalogBreadcrumbs({ slug: [], state: state({ section: null, slugLength: 0 }) })).toEqual([]);
  });

  it('brands root and brand page', () => {
    expect(buildCatalogBreadcrumbs({
      slug: ['brands'],
      state: state({ section: 'brands', animal: 'brands', isBrands: true, slugLength: 1 }),
    })).toEqual([
      { label: 'Бренды', segments: ['brands'] },
    ]);
    expect(buildCatalogBreadcrumbs({
      slug: ['brands', 'ownat'],
      state: state({
        section: 'brands',
        animal: 'brands',
        isBrands: true,
        activeBrandName: 'Ownat',
        slugLength: 2,
      }),
    })).toEqual([
      { label: 'Бренды', segments: ['brands'] },
      { label: 'Ownat', segments: ['brands', 'ownat'] },
    ]);
  });

  it('category, subcategory, subSection, product levels', () => {
    expect(buildCatalogBreadcrumbs({
      slug: ['cat'],
      state: state({ slugLength: 1 }),
    })).toEqual([
      { label: 'Кошки', segments: ['cat'], className: 'capitalize' },
    ]);
    expect(buildCatalogBreadcrumbs({
      slug: ['cat', 'food'],
      state: state({ subcategoryId: 'food', slugLength: 2 }),
      subcategoryName: 'Корм',
    })).toEqual([
      { label: 'Кошки', segments: ['cat'], className: 'capitalize' },
      { label: 'Корм', segments: ['cat', 'food'] },
    ]);
    expect(buildCatalogBreadcrumbs({
      slug: ['cat', 'food', 'Сухой корм'],
      state: state({ subcategoryId: 'food', subSection: 'Сухой корм', slugLength: 3 }),
      subcategoryName: 'Корм',
    })).toEqual([
      { label: 'Кошки', segments: ['cat'], className: 'capitalize' },
      { label: 'Корм', segments: ['cat', 'food'] },
      { label: 'Сухой корм', segments: ['cat', 'food', 'Сухой корм'] },
    ]);
    expect(buildCatalogBreadcrumbs({
      slug: ['cat', 'food', 'Сухой корм', '1'],
      state: state({ subcategoryId: 'food', subSection: 'Сухой корм', productId: '1', slugLength: 4 }),
      subcategoryName: 'Корм',
      productName: 'Ownat 12kg',
    })).toEqual([
      { label: 'Кошки', segments: ['cat'], className: 'capitalize' },
      { label: 'Корм', segments: ['cat', 'food'] },
      { label: 'Сухой корм', segments: ['cat', 'food', 'Сухой корм'] },
      { label: 'Ownat 12kg', className: 'max-w-35 truncate' },
    ]);
  });

  it('subSection "all" omits the subSection crumb at any level', () => {
    expect(buildCatalogBreadcrumbs({
      slug: ['cat', 'food', 'all'],
      state: state({ subcategoryId: 'food', subSection: 'all', slugLength: 3 }),
      subcategoryName: 'Корм',
    })).toEqual([
      { label: 'Кошки', segments: ['cat'], className: 'capitalize' },
      { label: 'Корм', segments: ['cat', 'food'] },
    ]);
  });

  it('product level with subSection "all" omits the subSection crumb', () => {
    expect(buildCatalogBreadcrumbs({
      slug: ['cat', 'food', 'all', '1'],
      state: state({ subcategoryId: 'food', subSection: 'all', productId: '1', slugLength: 4 }),
      subcategoryName: 'Корм',
    })).toEqual([
      { label: 'Кошки', segments: ['cat'], className: 'capitalize' },
      { label: 'Корм', segments: ['cat', 'food'] },
      { label: '1', className: 'max-w-35 truncate' },
    ]);
  });

  it('falls back to slug segments when names are missing', () => {
    expect(buildCatalogBreadcrumbs({
      slug: ['ghost', 'unknown'],
      state: state({ subcategoryId: 'unknown', slugLength: 2 }),
    })).toEqual([
      { label: 'ghost', segments: ['ghost'], className: 'capitalize' },
      { label: 'unknown', segments: ['ghost', 'unknown'] },
    ]);
  });
});
