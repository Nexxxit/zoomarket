import type { CartItem, CheckoutType } from './types';
import { DELIVERY_COST, FREE_SHIPPING_THRESHOLD, PROMO_CODES } from '@/shared/config/commerce';

export function selectCartCount(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}

export function selectSubtotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

export function selectOldSubtotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + (item.oldPrice || item.price) * item.quantity, 0);
}

export function selectDeliveryCost(itemsSubtotal: number, checkoutType: CheckoutType): number {
  if (checkoutType !== 'delivery') return 0;
  return itemsSubtotal >= FREE_SHIPPING_THRESHOLD ? 0 : DELIVERY_COST;
}

export function selectPromoDiscount(itemsSubtotal: number, promoCode: string | null): number {
  const pct = promoCode ? PROMO_CODES[promoCode] : undefined;
  return pct ? Math.round(itemsSubtotal * pct) : 0;
}

export function selectGrandTotal(
  itemsSubtotal: number,
  deliveryCost: number,
  promoDiscount: number,
): number {
  return Math.max(0, itemsSubtotal - promoDiscount + deliveryCost);
}
