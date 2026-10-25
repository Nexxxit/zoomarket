import { describe, it, expect } from 'vitest';
import {
  decodeCatalogSlugSegment,
  encodeCatalogSlugSegment,
  getAllCategoryPillLabel,
} from '../catalog-slug';

describe('decodeCatalogSlugSegment / encodeCatalogSlugSegment', () => {
  it('encodes cyrillic subSection for URL segments', () => {
    expect(encodeCatalogSlugSegment('Сухой корм')).toBe(encodeURIComponent('Сухой корм'));
  });

  it('decodes percent-encoded segment back to original text', () => {
    expect(decodeCatalogSlugSegment(encodeURIComponent('Лечебный и диетический корм')))
      .toBe('Лечебный и диетический корм');
  });

  it('protects against double encoding (idempotent)', () => {
    const once = encodeCatalogSlugSegment('Сухой корм');
    const twice = encodeCatalogSlugSegment(once);
    expect(twice).toBe(once);
    expect(decodeCatalogSlugSegment(twice)).toBe('Сухой корм');
  });

  it('keeps plain ascii segments intact', () => {
    expect(encodeCatalogSlugSegment('all')).toBe('all');
    expect(decodeCatalogSlugSegment('cat-food')).toBe('cat-food');
  });
});

describe('getAllCategoryPillLabel', () => {
  it.each([
    ['Корм', 'Весь корм'],
    ['Корма', 'Все корма'],
    ['Игрушки', 'Все игрушки'],
    ['Лакомства', 'Все лакомства'],
    ['Витамины и минеральные добавки', 'Все витамины и минеральные добавки'],
    ['Одежда и аксессуары', 'Вся одежда и аксессуары'],
    ['Питание грызунов', 'Все питание грызунов'],
  ])('%s -> %s', (name, expected) => {
    expect(getAllCategoryPillLabel(name)).toBe(expected);
  });
});
