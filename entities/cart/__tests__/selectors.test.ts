import { describe, it, expect } from 'vitest';
import {
  selectCartCount,
  selectSubtotal,
  selectOldSubtotal,
  selectDeliveryCost,
  selectPromoDiscount,
  selectGrandTotal,
} from '../model/selectors';
import { DELIVERY_COST } from '@/shared/config/commerce';
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

  it('computes delivery cost by type and free-shipping threshold', () => {
    expect(selectDeliveryCost(1000, 'pickup')).toBe(0);
    expect(selectDeliveryCost(1000, 'delivery')).toBe(DELIVERY_COST);
    expect(selectDeliveryCost(1500, 'delivery')).toBe(0);
  });

  it('derives promo discount from current subtotal, unknown code = 0', () => {
    expect(selectPromoDiscount(10000, 'AIBOLIT10')).toBe(1000);
    expect(selectPromoDiscount(10000, 'LOVEPETS')).toBe(1500);
    expect(selectPromoDiscount(10000, 'NOPE')).toBe(0);
    expect(selectPromoDiscount(10000, null)).toBe(0);
  });

  it('ignores prototype keys instead of producing NaN', () => {
    // «constructor in PROMO_CODES» давал true, а Math.round(subtotal * Function) — NaN.
    expect(selectPromoDiscount(10000, 'constructor')).toBe(0);
    expect(selectPromoDiscount(10000, 'toString')).toBe(0);
    expect(selectPromoDiscount(10000, '__proto__')).toBe(0);
    expect(selectGrandTotal(1000, 290, NaN)).toBe(0);
    expect(selectGrandTotal(NaN, 290, 0)).toBe(0);
  });

  it('clamps grand total at zero when discount exceeds subtotal', () => {
    expect(selectGrandTotal(1000, 290, 1500)).toBe(0);
    expect(selectGrandTotal(10000, 0, 1500)).toBe(8500);
  });
});
