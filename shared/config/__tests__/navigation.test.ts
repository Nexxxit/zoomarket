import { describe, it, expect } from 'vitest';
import { productHref } from '../navigation';
import { MOCK_PRODUCTS } from '@/entities/product';

describe('productHref — routes regression vs generateStaticParams format', () => {
  const routePaths = new Set<string>();

  // Mirrors app/catalog/[...slug]/page.tsx generateStaticParams product branch:
  // slug segments [animal, subcategoryId, subSection|'all', id] encoded by Next into URL paths.
  MOCK_PRODUCTS.forEach((product) => {
    if (product.animal && product.subcategoryId) {
      const sec = product.subSection ? product.subSection : 'all';
      routePaths.add(`/catalog/${[product.animal, product.subcategoryId, sec, product.id]
        .map((segment) => encodeURIComponent(segment))
        .join('/')}`);
    }
  });

  it('is registered for every mock product page', () => {
    let checked = 0;
    MOCK_PRODUCTS.forEach((product) => {
      if (product.animal && product.subcategoryId) {
        expect(routePaths.has(productHref(product))).toBe(true);
        checked += 1;
      }
    });
    expect(checked).toBeGreaterThan(0);
  });

  it('falls back to "all" subSection segment', () => {
    expect(productHref({ id: '7', animal: 'cat', subcategoryId: 'cat-toys' }))
      .toBe('/catalog/cat/cat-toys/all/7');
  });

  it('encodes cyrillic subSection once', () => {
    expect(productHref({
      id: '1',
      animal: 'cat',
      subcategoryId: 'cat-food',
      subSection: 'Сухой корм',
    })).toBe(`/catalog/cat/cat-food/${encodeURIComponent('Сухой корм')}/1`);
  });
});
