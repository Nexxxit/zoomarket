import { describe, it, expect } from 'vitest';
import { selectCartCount, selectSubtotal, selectOldSubtotal } from '../model/selectors';
import { INITIAL_CART_ITEMS } from '../model/mock';
import type { CartItem } from '../model/types';

describe('cart selectors', () => {
  it('computes demo cart values', () => {
    expect(selectCartCount(INITIAL_CART_ITEMS)).toBe(3);
    expect(selectSubtotal(INITIAL_CART_ITEMS)).toBe(2400 + 1529 + 3450);
    expect(selectOldSubtotal(INITIAL_CART_ITEMS)).toBe(2999 + 1529 + 4300);
  });

  it('returns zeros for empty cart', () => {
    expect(selectCartCount([])).toBe(0);
    expect(selectSubtotal([])).toBe(0);
    expect(selectOldSubtotal([])).toBe(0);
  });

  it('multiplies by quantity and falls back to price without oldPrice', () => {
    const items: CartItem[] = [
      { id: 'a', name: 'A', category: 'Корма', price: 100, oldPrice: 150, quantity: 2, imageType: 'food' },
      { id: 'b', name: 'B', category: 'Корма', price: 50, quantity: 3, imageType: 'food' },
    ];
    expect(selectCartCount(items)).toBe(5);
    expect(selectSubtotal(items)).toBe(350);
    expect(selectOldSubtotal(items)).toBe(450);
  });
});
