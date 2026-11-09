import type { CartItem } from './types';

export function isCartItem(value: unknown): value is CartItem {
  if (typeof value !== 'object' || value === null) return false;
  const item = value as Record<string, unknown>;
  return (
    typeof item.id === 'string' &&
    typeof item.name === 'string' &&
    typeof item.price === 'number' &&
    typeof item.quantity === 'number' &&
    (item.size === undefined || typeof item.size === 'string')
  );
}

export function parseStoredCart(raw: string | null): CartItem[] | null {
  if (!raw) return null;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;
    return parsed.filter(isCartItem);
  } catch {
    return null;
  }
}

export interface CartItemSeed {
  id: string;
  name: string;
  category?: string;
  price: number;
  oldPrice?: number;
  imageType: CartItem['imageType'];
  size?: string;
}

export function addItemToCart(items: CartItem[], seed: CartItemSeed, size?: string): CartItem[] {
  const itemSize = size ?? seed.size;
  const existingIndex = items.findIndex(item => item.id === seed.id && item.size === itemSize);

  if (existingIndex > -1) {
    return items.map((item, idx) =>
      idx === existingIndex ? { ...item, quantity: item.quantity + 1 } : item
    );
  }

  return [
    ...items,
    {
      id: seed.id,
      name: seed.name,
      category: seed.category || 'Товары',
      price: seed.price,
      oldPrice: seed.oldPrice,
      quantity: 1,
      imageType: seed.imageType,
      size: itemSize,
    },
  ];
}

export function removeItemFromCart(items: CartItem[], id: string, size?: string): CartItem[] {
  return items.filter(item => !(item.id === id && item.size === size));
}

export function changeItemQuantity(items: CartItem[], delta: number, id: string, size?: string): CartItem[] {
  return items
    .map(item => {
      if (item.id === id && item.size === size) {
        return { ...item, quantity: item.quantity + delta };
      }
      return item;
    })
    .filter(item => item.quantity > 0);
}
