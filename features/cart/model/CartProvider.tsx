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
  cartLineKey,
} from '@/entities/cart';
import type { CartItem } from '@/entities/cart';
import type { Product } from '@/entities/product';
import { getDefaultProductSize } from '@/entities/product/model/defaultSize';
import { getPromo } from '@/shared/config/commerce';
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

/**
 * Единый data-стейз корзины: гидрация и мутации применяют частичный patch —
 * один setState на обновление (без каскадных рендеров из нескольких сеттеров
 * в эффекте гидрации).
 */
interface CartState {
  cart: CartItem[];
  checkoutType: typeof DEMO_CHECKOUT_TYPE;
  pickupAddress: string;
  promoCode: string | null;
  isHydrated: boolean;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<CartState>(() => ({
    cart: INITIAL_CART_ITEMS,
    checkoutType: DEMO_CHECKOUT_TYPE,
    pickupAddress: DEMO_PICKUP_ADDRESS,
    promoCode: null,
    isHydrated: false,
  }));
  const [toastData, setToastData] = useState<CartToastData | null>(null);
  const { cart, checkoutType, pickupAddress, promoCode, isHydrated } = state;

  // Синхронное зеркало корзины: мутации считаются от него, поэтому
  // showCartToast/silent-путь видят актуальный id-лист сразу, без ожидания
  // коммита React (updater отложен, когда в очереди уже есть обновления).
  const cartRef = useRef<CartItem[]>(cart);

  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastToastProductIdRef = useRef<string | null>(null);
  const toastVisibleRef = useRef(false);
  const toastPausedRef = useRef(false);
  // Зеркало toastData: реролл рекомендации при silent-добавлении читает его
  // вне updater'а setToastData — Math.random не должен вызываться внутри
  // апдейтера (StrictMode/ретраи делают его нечистым).
  const toastDataRef = useRef<CartToastData | null>(toastData);

  const patchState = useCallback((patch: Partial<CartState>) => {
    setState((prev) => ({ ...prev, ...patch }));
  }, []);

  // Hydration from localStorage. Сохранение выполняется только в мутациях
  // (commitCart/setCheckoutType/...), поэтому демо-корзина не «прилипает»
  // к localStorage у новых посетителей. Без setTimeout-тика: синхронный read
  // при mount, постановка state — в микрозадаче (до paint, один batched-
  // patch); dependent UI (бедж корзины) гейтится isHydrated.
  useEffect(() => {
    let cancelled = false;
    const hydrate = () => {
      if (cancelled) return;
      const storedCart = parseStoredCart(readStorage(STORAGE_KEYS.cart));
      const storedCheckoutType = readStorage(STORAGE_KEYS.checkoutType);
      const storedPickup = readStorage(STORAGE_KEYS.pickupAddress);
      const storedPromo = readStorage(STORAGE_KEYS.promo);

      if (storedCart) {
        cartRef.current = storedCart;
      }

      const patch: Partial<CartState> = { isHydrated: true };
      if (storedCart) patch.cart = storedCart;
      if (storedCheckoutType === 'delivery' || storedCheckoutType === 'pickup') {
        patch.checkoutType = storedCheckoutType;
      }
      if (storedPickup) patch.pickupAddress = storedPickup;
      if (storedPromo && getPromo(storedPromo) !== undefined) patch.promoCode = storedPromo;
      patchState(patch);
    };
    queueMicrotask(hydrate);
    return () => {
      cancelled = true;
    };
  }, [patchState]);

  const commitCart = useCallback((next: CartItem[]) => {
    cartRef.current = next;
    setState((prev) => ({ ...prev, cart: next }));
    writeStorage(STORAGE_KEYS.cart, JSON.stringify(next));
  }, []);

  const setCheckoutType = useCallback((type: typeof DEMO_CHECKOUT_TYPE) => {
    patchState({ checkoutType: type });
    writeStorage(STORAGE_KEYS.checkoutType, type);
  }, [patchState]);

  const setPickupAddress = useCallback((address: string) => {
    patchState({ pickupAddress: address });
    writeStorage(STORAGE_KEYS.pickupAddress, address);
  }, [patchState]);

  const applyPromo = useCallback((code: string) => {
    const normalized = code.trim().toUpperCase();
    if (getPromo(normalized) === undefined) return;
    patchState({ promoCode: normalized });
    writeStorage(STORAGE_KEYS.promo, normalized);
  }, [patchState]);

  const clearPromo = useCallback(() => {
    patchState({ promoCode: null });
    removeStorage(STORAGE_KEYS.promo);
  }, [patchState]);

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
    toastDataRef.current = null;
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
      const nextToast: CartToastData = { product, recommendation: null };
      toastDataRef.current = nextToast;
      setToastData(nextToast);
      // Не стартуем таймер, пока курсор над тостом (пауза при наведении)
      if (!toastPausedRef.current) {
        scheduleToastDismiss();
      }
      // Рекомендация догружается асинхронно (моки каталога не в layout-бандле).
      void findRecommendation(product, excludeIds, cartProductIds).then((recommendation) => {
        const current = toastDataRef.current;
        // Тост могли закрыть/заменить, пока рекомендация грузилась.
        if (!toastVisibleRef.current || current?.product.id !== product.id) return;
        // Пока грузилось, товар могли добавить в корзину — не предлагаем его.
        if (recommendation && cartRef.current.some((item) => item.id === recommendation.id)) {
          return;
        }
        const next: CartToastData = { ...current, recommendation };
        toastDataRef.current = next;
        setToastData(next);
      });
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
        const current = toastDataRef.current;
        if (current?.recommendation && nextCartProductIds.includes(current.recommendation.id)) {
          const excludedId = current.recommendation.id;
          const toastProduct = current.product;
          void findRecommendation(toastProduct, [excludedId], nextCartProductIds).then(
            (recommendation) => {
              const latest = toastDataRef.current;
              // Тост могли закрыть/заменить, пока реролл грузился.
              if (!toastVisibleRef.current || latest?.product.id !== toastProduct.id) return;
              // Новый реролл уже на экране — не перетирать.
              if (latest.recommendation?.id !== excludedId) return;
              if (recommendation && nextCartProductIds.includes(recommendation.id)) return;
              const next: CartToastData = { ...latest, recommendation };
              toastDataRef.current = next;
              setToastData(next);
            },
          );
        }
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

  const qtyByKey = useMemo(() => {
    const map = new Map<string, number>();
    for (const item of cart) {
      map.set(cartLineKey(item.id, item.size), item.quantity);
    }
    return map;
  }, [cart]);

  const dataValue = useMemo<CartDataValue>(
    () => ({ cart, checkoutType, pickupAddress, promoCode, isHydrated, qtyByKey }),
    [cart, checkoutType, pickupAddress, promoCode, isHydrated, qtyByKey],
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
