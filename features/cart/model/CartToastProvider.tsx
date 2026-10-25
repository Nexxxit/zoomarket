'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { Product } from '@/entities/product';
import CartToast, { type CartToastData } from '../ui/CartToast';

const AUTO_HIDE_MS = 4000;

interface CartToastContextValue {
  showToast: (product: Product) => void;
  hide: () => void;
}

const CartToastContext = createContext<CartToastContextValue | null>(null);

export function CartToastProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<CartToastData | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const hide = useCallback(() => {
    clearTimer();
    setData(null);
  }, [clearTimer]);

  const showToast = useCallback(
    (product: Product) => {
      clearTimer();
      setData({ product, recommendation: null });
      timerRef.current = setTimeout(() => setData(null), AUTO_HIDE_MS);
    },
    [clearTimer],
  );

  useEffect(() => clearTimer, [clearTimer]);

  const value = useMemo(() => ({ showToast, hide }), [showToast, hide]);

  return (
    <CartToastContext.Provider value={value}>
      {children}
      <CartToast data={data} onClose={hide} />
    </CartToastContext.Provider>
  );
}

export function useCartToast(): CartToastContextValue {
  const context = useContext(CartToastContext);
  if (!context) {
    throw new Error('useCartToast must be used within CartToastProvider');
  }
  return context;
}
