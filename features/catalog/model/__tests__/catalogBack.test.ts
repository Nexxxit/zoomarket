import { describe, it, expect } from 'vitest';
import { parseBackSource, getCatalogBackLabel } from '../catalogBack';

describe('parseBackSource', () => {
  it('returns null for missing/invalid values', () => {
    expect(parseBackSource(null)).toBeNull();
    expect(parseBackSource('')).toBeNull();
    expect(parseBackSource('unknown-section/cat-food')).toBeNull();
    expect(parseBackSource('cat/food/Сухой/extra')).toBeNull();
    expect(parseBackSource('cat/..')).toBeNull();
    expect(parseBackSource('cat/../..')).toBeNull();
  });

  it('rejects unknown subcategory and subsection ids', () => {
    expect(parseBackSource('cat/not-a-sub')).toBeNull();
    expect(parseBackSource('cat/cat-food/Пустой корм')).toBeNull();
    expect(parseBackSource('dog/dog-food/Сухой корм')).not.toBeNull();
  });

  it('accepts 1-3 catalog segments', () => {
    expect(parseBackSource('cat')).toEqual(['cat']);
    expect(parseBackSource('cat/cat-food')).toEqual(['cat', 'cat-food']);
    expect(parseBackSource('cat/cat-food/%D0%A1%D1%83%D1%85%D0%BE%D0%B9%20%D0%BA%D0%BE%D1%80%D0%BC'))
      .toEqual(['cat', 'cat-food', 'Сухой корм']);
    expect(parseBackSource('cat/cat-food/all')).toEqual(['cat', 'cat-food', 'all']);
    expect(parseBackSource('brands')).toEqual(['brands']);
    expect(parseBackSource('brands/Royal%20Canin')).toEqual(['brands', 'Royal Canin']);
  });
});

describe('getCatalogBackLabel', () => {
  it('resolves labels per depth', () => {
    expect(getCatalogBackLabel(['cat'])).toBe('Кошки');
    expect(getCatalogBackLabel(['cat', 'cat-food'])).toBe('Корм');
    expect(getCatalogBackLabel(['cat', 'cat-food', 'all'])).toBe('Корм');
    expect(getCatalogBackLabel(['cat', 'cat-food', 'Сухой корм'])).toBe('Сухой корм');
    expect(getCatalogBackLabel(['brands'])).toBe('Бренды');
  });
});
