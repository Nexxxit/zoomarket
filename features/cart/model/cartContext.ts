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
  /** Гидрация из localStorage ещё не завершилась: dependent UI (бедж) гейтится флагом. */
  isHydrated: boolean;
  /** Map `{id|size → quantity}`: O(1) доступ к количеству вместо `cart.find` на карточку. */
  qtyByKey: Map<string, number>;
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

/** Только данные корзины (без действий): потребителям количества/состава. */
export function useCartData(): CartDataValue {
  const data = useContext(CartDataContext);
  if (data === undefined) {
    throw new Error('useCartData must be used within a CartProvider');
  }
  return data;
}

/** Только действия (стабильный контекст): consumers не перерисовываются на смену корзины. */
export function useCartActions(): CartActionsValue {
  const actions = useContext(CartActionsContext);
  if (actions === undefined) {
    throw new Error('useCartActions must be used within a CartProvider');
  }
  return actions;
}

/** Только тост-данные: события тоста не ре-рендерят потребителей корзины. */
export function useCartToast(): CartToastValue {
  const toast = useContext(CartToastContext);
  if (toast === undefined) {
    throw new Error('useCartToast must be used within a CartProvider');
  }
  return toast;
}
