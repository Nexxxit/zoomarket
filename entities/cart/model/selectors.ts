import type { CartItem } from './types';

export function selectCartCount(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}

export function selectSubtotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

export function selectOldSubtotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + (item.oldPrice || item.price) * item.quantity, 0);
}
