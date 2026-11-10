import { describe, it, expect } from 'vitest';
import {
  addItemToCart,
  removeItemFromCart,
  changeItemQuantity,
  parseStoredCart,
} from '../model/cart';
import type { CartItem } from '../model/types';

const seed = {
  id: 'x',
  name: 'Test',
  price: 100,
  imageType: 'food' as const,
};

describe('cart operations', () => {
  it('adds a new item with explicit size', () => {
    const next = addItemToCart([], seed, '1 кг');
    expect(next).toHaveLength(1);
    expect(next[0].size).toBe('1 кг');
    expect(next[0].quantity).toBe(1);
  });

  it('increments quantity when same id and size', () => {
    const once = addItemToCart([], seed, '1 кг');
    const twice = addItemToCart(once, seed, '1 кг');
    expect(twice).toHaveLength(1);
    expect(twice[0].quantity).toBe(2);
  });

  it('keeps different sizes as separate rows', () => {
    const a = addItemToCart([], seed, '1 кг');
    const b = addItemToCart(a, seed, '4 кг');
    expect(b).toHaveLength(2);
  });

  it('matches sizeless rows by undefined size exactly', () => {
    const added = addItemToCart([], seed, undefined);
    expect(added[0].size).toBeUndefined();
    const again = addItemToCart(added, seed, undefined);
    expect(again).toHaveLength(1);
    expect(again[0].quantity).toBe(2);
  });

  it('removes only the matching id+size row', () => {
    const items: CartItem[] = [
      { ...seed, category: 'Корма', quantity: 1, size: '1 кг' },
      { ...seed, category: 'Корма', quantity: 1, size: '4 кг' },
    ];
    const next = removeItemFromCart(items, 'x', '1 кг');
    expect(next).toHaveLength(1);
    expect(next[0].size).toBe('4 кг');
  });

  it('removes all sizes of the product when size is omitted', () => {
    const items: CartItem[] = [
      { ...seed, category: 'Корма', quantity: 1, size: '1 кг' },
      { ...seed, category: 'Корма', quantity: 1, size: '4 кг' },
      { ...seed, id: 'y', name: 'Other', category: 'Корма', quantity: 1, size: '1 кг' },
    ];
    const next = removeItemFromCart(items, 'x');
    expect(next).toHaveLength(1);
    expect(next[0].id).toBe('y');
  });

  it('changes quantity only for the exact id+size row', () => {
    const items: CartItem[] = [
      { ...seed, category: 'Корма', quantity: 1, size: '1 кг' },
      { ...seed, category: 'Корма', quantity: 1, size: '4 кг' },
    ];
    const next = changeItemQuantity(items, 1, 'x', '4 кг');
    expect(next.find(i => i.size === '1 кг')?.quantity).toBe(1);
    expect(next.find(i => i.size === '4 кг')?.quantity).toBe(2);
  });

  it('drops the row when quantity reaches zero', () => {
    const items: CartItem[] = [{ ...seed, category: 'Корма', quantity: 1, size: '1 кг' }];
    expect(changeItemQuantity(items, -1, 'x', '1 кг')).toHaveLength(0);
  });
});

describe('parseStoredCart', () => {
  it('returns null for empty input and invalid shapes', () => {
    expect(parseStoredCart(null)).toBeNull();
    expect(parseStoredCart('')).toBeNull();
    expect(parseStoredCart('null')).toBeNull();
    expect(parseStoredCart('{}')).toBeNull();
    expect(parseStoredCart('5')).toBeNull();
    expect(parseStoredCart('{broken')).toBeNull();
  });

  it('filters non-conforming rows out of a valid array', () => {
    const raw = JSON.stringify([
      { id: 'a', name: 'A', price: 1, quantity: 1, category: 'Корма', imageType: 'food' },
      'junk',
      { id: 2 },
      null,
    ]);
    const parsed = parseStoredCart(raw);
    expect(parsed).toHaveLength(1);
    expect(parsed?.[0].id).toBe('a');
  });
});
