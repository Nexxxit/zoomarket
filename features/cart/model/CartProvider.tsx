'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  INITIAL_CART_ITEMS,
  DEMO_CHECKOUT_TYPE,
  DEMO_PICKUP_ADDRESS,
  addItemToCart,
  removeItemFromCart,
  changeItemQuantity,
  parseStoredCart,
} from '@/entities/cart';
import type { CartItem } from '@/entities/cart';
import type { Product } from '@/entities/product';
import { getDefaultProductSize } from '@/entities/product/model/defaultSize';
import { PROMO_CODES } from '@/shared/config/commerce';
import { findRecommendation } from './recommendations';
import { CartActionsContext, CartDataContext, CartToastContext } from './cartContext';
import type {
  AddToCartOptions,
  CartActionsValue,
  CartDataValue,
  CartToastData,
  CartToastValue,
} from './cartContext';
import CartToast from '../ui/CartToast';

const TOAST_DURATION_MS = 7000;

const STORAGE_KEYS = {
  cart: 'aibolit_cart',
  checkoutType: 'aibolit_checkout_type',
  pickupAddress: 'aibolit_pickup_address',
  promo: 'aibolit_promo',
} as const;

function readStorage(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch (e) {
    console.error('Error reading localStorage', e);
    return null;
  }
}

function writeStorage(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch (e) {
    console.error('Error writing localStorage', e);
  }
}

function removeStorage(key: string) {
  try {
    localStorage.removeItem(key);
  } catch (e) {
    console.error('Error removing from localStorage', e);
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>(INITIAL_CART_ITEMS);
  const [checkoutType, setCheckoutTypeState] = useState(DEMO_CHECKOUT_TYPE);
  const [pickupAddress, setPickupAddressState] = useState(DEMO_PICKUP_ADDRESS);
  const [promoCode, setPromoCode] = useState<string | null>(null);
  const [toastData, setToastData] = useState<CartToastData | null>(null);

  // Синхронное зеркало корзины: мутации считаются от него, поэтому
  // showCartToast/silent-путь видят актуальный id-лист сразу, без ожидания
  // коммита React (updater отложен, когда в очереди уже есть обновления).
  const cartRef = useRef<CartItem[]>(cart);

  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastToastProductIdRef = useRef<string | null>(null);
  const toastVisibleRef = useRef(false);
  const toastPausedRef = useRef(false);

  // Hydration from localStorage. Сохранение выполняется только в мутациях
  // (commitCart/setCheckoutType/...), поэтому демо-корзина не «прилипает»
  // к localStorage у новых посетителей. Отложено на тик (не синхронно в
  // эффекте) — без каскадных рендеров; всплеш минимален (≤1 кадр).
  React.useEffect(() => {
    const timer = setTimeout(() => {
      const storedCart = parseStoredCart(readStorage(STORAGE_KEYS.cart));
      const storedCheckoutType = readStorage(STORAGE_KEYS.checkoutType);
      const storedPickup = readStorage(STORAGE_KEYS.pickupAddress);
      const storedPromo = readStorage(STORAGE_KEYS.promo);

      if (storedCart) {
        cartRef.current = storedCart;
        setCart(storedCart);
      }

      if (storedCheckoutType === 'delivery' || storedCheckoutType === 'pickup') {
        setCheckoutTypeState(storedCheckoutType);
      }

      if (storedPickup) {
        setPickupAddressState(storedPickup);
      }

      if (storedPromo && storedPromo in PROMO_CODES) {
        setPromoCode(storedPromo);
      }
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const commitCart = useCallback((next: CartItem[]) => {
    cartRef.current = next;
    setCart(next);
    writeStorage(STORAGE_KEYS.cart, JSON.stringify(next));
  }, []);

  const setCheckoutType = useCallback((type: typeof DEMO_CHECKOUT_TYPE) => {
    setCheckoutTypeState(type);
    writeStorage(STORAGE_KEYS.checkoutType, type);
  }, []);

  const setPickupAddress = useCallback((address: string) => {
    setPickupAddressState(address);
    writeStorage(STORAGE_KEYS.pickupAddress, address);
  }, []);

  const applyPromo = useCallback((code: string) => {
    const normalized = code.trim().toUpperCase();
    if (!(normalized in PROMO_CODES)) return;
    setPromoCode(normalized);
    writeStorage(STORAGE_KEYS.promo, normalized);
  }, []);

  const clearPromo = useCallback(() => {
    setPromoCode(null);
    removeStorage(STORAGE_KEYS.promo);
  }, []);

  const clearToastTimer = useCallback(() => {
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
      toastTimerRef.current = null;
    }
  }, []);

  const resetToastState = useCallback(() => {
    lastToastProductIdRef.current = null;
    toastVisibleRef.current = false;
    toastPausedRef.current = false;
    setToastData(null);
  }, []);

  const scheduleToastDismiss = useCallback(() => {
    clearToastTimer();
    toastTimerRef.current = setTimeout(() => {
      toastTimerRef.current = null;
      resetToastState();
    }, TOAST_DURATION_MS);
  }, [clearToastTimer, resetToastState]);

  const dismissToast = useCallback(() => {
    clearToastTimer();
    resetToastState();
  }, [clearToastTimer, resetToastState]);

  const pauseToastTimer = useCallback(() => {
    // Игнор hover на пустом wrapper, когда тоста нет
    if (!toastVisibleRef.current) return;
    toastPausedRef.current = true;
    clearToastTimer();
  }, [clearToastTimer]);

  const resumeToastTimer = useCallback(() => {
    if (!toastPausedRef.current) return;
    toastPausedRef.current = false;
    if (!toastVisibleRef.current) return;
    scheduleToastDismiss();
  }, [scheduleToastDismiss]);

  const showCartToast = useCallback(
    (product: Product, excludeIds: string[] = [], cartProductIds: string[] = []) => {
      clearToastTimer();
      lastToastProductIdRef.current = product.id;
      toastVisibleRef.current = true;
      setToastData({
        product,
        recommendation: findRecommendation(product, excludeIds, cartProductIds),
      });
      // Не стартуем таймер, пока курсор над тостом (пауза при наведении)
      if (!toastPausedRef.current) {
        scheduleToastDismiss();
      }
    },
    [clearToastTimer, scheduleToastDismiss],
  );

  useEffect(() => clearToastTimer, [clearToastTimer]);

  const addToCart = useCallback(
    (product: Product, size?: string, options?: AddToCartOptions) => {
      const itemSize = size ?? getDefaultProductSize(product);
      const nextCart = addItemToCart(
        cartRef.current,
        {
          id: product.id,
          name: product.name,
          category: product.category,
          price: product.price,
          oldPrice: product.oldPrice,
          imageType: product.type,
        },
        itemSize,
      );
      commitCart(nextCart);
      const nextCartProductIds = nextCart.map(item => item.id);

      if (options?.silent) {
        // Синхронизируем открытый тост: не предлагать товар, который уже в корзине
        setToastData(prev => {
          if (!prev?.recommendation) return prev;
          if (!nextCartProductIds.includes(prev.recommendation.id)) return prev;
          return {
            ...prev,
            recommendation: findRecommendation(
              prev.product,
              [prev.recommendation.id],
              nextCartProductIds,
            ),
          };
        });
        return;
      }

      const previousProductId = lastToastProductIdRef.current;
      const excludeIds =
        previousProductId && previousProductId !== product.id ? [previousProductId] : [];
      showCartToast(product, excludeIds, nextCartProductIds);
    },
    [commitCart, showCartToast],
  );

  const removeFromCart = useCallback(
    (id: string, size?: string) => {
      commitCart(removeItemFromCart(cartRef.current, id, size));
    },
    [commitCart],
  );

  const updateQty = useCallback(
    (id: string, delta: number, size?: string) => {
      commitCart(changeItemQuantity(cartRef.current, delta, id, size));
    },
    [commitCart],
  );

  const clearCart = useCallback(() => {
    commitCart([]);
  }, [commitCart]);

  const dataValue = useMemo<CartDataValue>(
    () => ({ cart, checkoutType, pickupAddress, promoCode }),
    [cart, checkoutType, pickupAddress, promoCode],
  );

  const actionsValue = useMemo<CartActionsValue>(
    () => ({
      addToCart,
      removeFromCart,
      updateQty,
      clearCart,
      setCheckoutType,
      setPickupAddress,
      applyPromo,
      clearPromo,
    }),
    [
      addToCart,
      removeFromCart,
      updateQty,
      clearCart,
      setCheckoutType,
      setPickupAddress,
      applyPromo,
      clearPromo,
    ],
  );

  const toastValue = useMemo<CartToastValue>(
    () => ({ toastData, dismissToast, pauseToastTimer, resumeToastTimer }),
    [toastData, dismissToast, pauseToastTimer, resumeToastTimer],
  );

  return (
    <CartActionsContext.Provider value={actionsValue}>
      <CartDataContext.Provider value={dataValue}>
        <CartToastContext.Provider value={toastValue}>
          {children}
          <CartToast />
        </CartToastContext.Provider>
      </CartDataContext.Provider>
    </CartActionsContext.Provider>
  );
}
