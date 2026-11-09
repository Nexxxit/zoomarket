import { createContext, useContext } from 'react';
import type { CartItem, CheckoutType } from '@/entities/cart';
import type { Product } from '@/entities/product';

export type { CheckoutType };

export interface CartToastData {
  product: Product;
  recommendation: Product | null;
}

export interface AddToCartOptions {
  /** Не показывать CartToast (например, при добавлении уже со страницы корзины) */
  silent?: boolean;
}

export interface CartDataValue {
  cart: CartItem[];
  checkoutType: CheckoutType;
  pickupAddress: string;
  promoCode: string | null;
}

export interface CartActionsValue {
  addToCart: (product: Product, size?: string, options?: AddToCartOptions) => void;
  removeFromCart: (id: string, size?: string) => void;
  updateQty: (id: string, delta: number, size?: string) => void;
  clearCart: () => void;
  setCheckoutType: (type: CheckoutType) => void;
  setPickupAddress: (address: string) => void;
  applyPromo: (code: string) => void;
  clearPromo: () => void;
}

export interface CartToastValue {
  toastData: CartToastData | null;
  dismissToast: () => void;
  pauseToastTimer: () => void;
  resumeToastTimer: () => void;
}

export type CartContextValue = CartDataValue & CartActionsValue;

export const CartDataContext = createContext<CartDataValue | undefined>(undefined);
export const CartActionsContext = createContext<CartActionsValue | undefined>(undefined);
export const CartToastContext = createContext<CartToastValue | undefined>(undefined);

export function useCart(): CartContextValue {
  const data = useContext(CartDataContext);
  const actions = useContext(CartActionsContext);
  if (data === undefined || actions === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return { ...data, ...actions };
}

/** Только тост-данные: события тоста не ре-рендерят потребителей корзины. */
export function useCartToast(): CartToastValue {
  const toast = useContext(CartToastContext);
  if (toast === undefined) {
    throw new Error('useCartToast must be used within a CartProvider');
  }
  return toast;
}
