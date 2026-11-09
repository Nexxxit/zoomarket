import { describe, it, expect } from 'vitest';
import { selectRecentlyViewed } from '../recentlyViewed';
import type { Product } from '@/entities/product';

const product = (over: Partial<Product>): Product => ({
  id: '1',
  name: 'X',
  category: 'Корма',
  price: 1,
  rating: 1,
  reviews: 0,
  onSale: false,
  type: 'food',
  animal: 'cat',
  ...over,
});

const catalog: Product[] = [
  product({ id: '1' }),
  product({ id: '2', animal: 'dog' }),
  product({ id: '3' }),
  product({ id: '4' }),
  product({ id: '5', animal: 'dog' }),
];

describe('selectRecentlyViewed', () => {
  const active = product({ id: '9', animal: 'cat' });

  it('returns viewed products excluding the active one', () => {
    expect(selectRecentlyViewed(catalog, ['1', '9'], active, 1).map(p => p.id))
      .toEqual(['1']);
  });

  it('pads with same-animal products up to the limit', () => {
    const result = selectRecentlyViewed(catalog, ['2'], active, 3);
    expect(result.map(p => p.id)).toEqual(['2', '1', '3']);
    expect(result.every(p => p.id !== active.id)).toBe(true);
  });

  it('never duplicates products already in the viewed list', () => {
    const result = selectRecentlyViewed(catalog, ['1', '3'], active, 4);
    expect(result.map(p => p.id)).toEqual(['1', '3', '4']);
  });

  it('without active product returns only viewed ids', () => {
    expect(selectRecentlyViewed(catalog, ['1', 'ghost'], null).map(p => p.id))
      .toEqual(['1']);
  });

  it('returns empty list when nothing viewed and no active product', () => {
    expect(selectRecentlyViewed(catalog, [], null)).toEqual([]);
  });
});
